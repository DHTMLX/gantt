import powerArray, { type PowerArray } from "./power_array";
import * as utils from "../../utils/utils";
import * as helpers from "../../utils/helpers";
import DatastoreInternal from "./datastore";
import type { Id, Task, DatastoreItem, TreeDatastore, TreeDatastoreItem, TreeDatastoreConfig } from "../../types/gantt_types";
import isPlaceholderTask from "../../utils/placeholder_task";
import {replaceValidZeroId} from "../../utils/helpers";
import SplitTasksHelper from "../common/split_task_helpers";
import CanonicalOrder from "./canonical_order";


type OrderCallback = (this: PowerArray<Id>) => void;

type BranchPositions = Map<string, number>;

/**
 * A branch array may carry `$positionById` - an id -> index map that answers
 * position lookups in O(1) instead of scanning the array. Keys are String(id),
 * matching `isEqualIds`, so a branch holding numeric ids answers string lookups
 * and vice versa.
 *
 * The property is non-enumerable so that it cannot show up in enumeration or
 * serialization of a branch array.
 *
 * Live branch arrays never leave this module: getChildren()/getSiblings()
 * return plain copies, and internal callers that need the real array go through
 * _getBranch(). Branch state is not meant to be edited through the public
 * accessors, and a cached index makes editing a handed-out array actively
 * harmful - a stale entry would splice the wrong slot on the next removal.
 *
 * Maintenance policy - every mutation of a live branch array goes through the
 * helpers below:
 * - append and in-place id replacement keep it exact in O(1);
 * - removal, insert-in-the-middle and reorder shift an unbounded number of
 *   entries, so they DROP the map instead of repairing it. Repairing costs
 *   O(branch length) per mutation, which is what made re-parse of an existing
 *   dataset slower than no cache at all (GS-477).
 *
 * Two "absent" states are distinguished on purpose:
 * - `undefined` - never built. Building is cheap and pays off, so any lookup
 *   may build it. This is what keeps an initial parse O(1) per row: the branch
 *   starts empty and grows by appends only.
 * - `null` - dropped by a mutation. Mutation-side lookups must NOT rebuild it,
 *   they fall back to a scan: bulk churn would otherwise pay a full rebuild per
 *   row. Read-heavy callers, which repeat lookups against a branch that is no
 *   longer being mutated, rebuild explicitly through getBranchPosition().
 *
 * The bulk reparent window (GS-477) is what keeps a RE-parse linear. A re-parse
 * moves every row of a branch to the end one row at a time, and both halves of
 * that are quadratic when done per row: splicing the id out shifts the tail
 * (which also invalidates every position after it), and the next lookup then has
 * to scan. Inside _buildTree the removal instead punches a hole in place -
 * positions do not shift, so the map survives exact and every lookup stays O(1)
 * - and each touched branch is compacted and re-indexed once at the end of the
 * loop. See _buildTree and _replace_branch_child.
 *
 * A hole is a plain `undefined` slot. It is only ever observable inside that
 * loop, which fires no events and calls no user code; _eachItemIterate already
 * skips undefined ids, and the window is closed from a `finally`.
 */
type Branch = PowerArray<Id> & {
	$positionById?: BranchPositions | null;
};

type BranchMap = Record<string, Branch> & Record<number, Branch>;

function setBranchPositions(branch: Branch, positions: BranchPositions | null): void{
	Object.defineProperty(branch, "$positionById", {
		configurable: true,
		value: positions,
		writable: true
	});
}

function buildBranchPositions(branch: Branch): BranchPositions{
	const positions: BranchPositions = new Map<string, number>();
	for(let i = 0; i < branch.length; i++){
		// a hole left by the bulk reparent window has no id to index
		if(branch[i] !== undefined){
			positions.set(String(branch[i]), i);
		}
	}
	setBranchPositions(branch, positions);
	return positions;
}

// the two-step probe the store used before the index existed - ids may be
// stored as numbers and looked up as strings, or the other way round - with a
// strict probe first, so a same-type lookup stops at the match instead of
// paying a full miss pass over the branch
function scanBranchPosition(branch: Branch, id: Id): number{
	let index = branch.indexOf(id);
	if(index === -1){
		index = branch.indexOf(id + "" as unknown as Id);
	}
	if(index === -1){
		index = branch.indexOf(+id as unknown as Id);
	}
	return index;
}

// position lookup that always answers off the map, building it when the branch
// has none. Used inside the bulk reparent window, where the map is never
// dropped, so every lookup is O(1) after the first.
function resolveBranchPosition(branch: Branch, id: Id): number{
	const positions = branch.$positionById || buildBranchPositions(branch);
	const position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

// removes an id from the map without touching any other entry - only valid when
// the id's slot is punched out in place, so no position shifts
function deleteBranchPosition(branch: Branch, id: Id): void{
	const positions = branch.$positionById;
	if(positions){
		positions.delete(String(id));
	}
}

// closes the bulk reparent window for one branch: drops the holes in place,
// keeping the array identity, and re-indexes it exactly, once
function compactBranch(branch: Branch): void{
	let write = 0;
	for(let read = 0; read < branch.length; read++){
		const id = branch[read];
		if(id !== undefined){
			branch[write] = id;
			write++;
		}
	}
	branch.length = write;
	buildBranchPositions(branch);
}

// lookup for read-heavy callers - builds or rebuilds the map
function getBranchPosition(branch: Branch, id: Id): number{
	const positions = branch.$positionById || buildBranchPositions(branch);
	const position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

// lookup for mutation paths - uses the map when it is there, builds it once,
// but never rebuilds a map that a previous mutation dropped
function findBranchPosition(branch: Branch, id: Id): number{
	const positions = branch.$positionById === undefined ? buildBranchPositions(branch) : branch.$positionById;
	if(!positions){
		return scanBranchPosition(branch, id);
	}
	const position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

function appendBranchPosition(branch: Branch, id: Id): void{
	const positions = branch.$positionById;
	if(positions){
		positions.set(String(id), branch.length - 1);
	}
}

function replaceBranchPosition(branch: Branch, oldId: Id, newId: Id, index: number): void{
	const positions = branch.$positionById;
	if(positions){
		positions.delete(String(oldId));
		positions.set(String(newId), index);
	}
}

function dropBranchPositions(branch: Branch): void{
	setBranchPositions(branch, null);
}

interface TreeDatastoreInternal extends Omit<DatastoreInternal, "eachItem" | "fullOrder" | "visibleOrder">, 
	Omit<TreeDatastore, "eachItem" | "fullOrder" | "visibleOrder">
{
	_listenerToDrop?: string;
	getItems(): Task[];

	getItem(id: Id): TreeDatastoreItem | undefined;
	/**
	 * sets the parent for an item. The parent id will be writen to the property specified by `parentProperty` config, "item.parent" by default.
	 * @param the item's object
	 * @param the id of the parent
	 * @param a flag to not call related events after changing the parent
	*/
	_setParentInner(item: DatastoreItem | TreeDatastoreItem, newParentId: string | number | null, silent?: boolean): void
}

class TreeDatastoreInternal extends DatastoreInternal {
	_branches: BranchMap | null = {} as BranchMap;
	_splitTaskHelper: any;
	$parentProperty: string;
	$getRootId: () => Id;
	$openInitially: () => boolean;
	_eachItemMainRangeCache: TreeDatastoreItem[] | null = null;
	// GS-3626. Canonical order snapshots — empty until a view reorders a branch.
	_canonicalOrder = new CanonicalOrder();
	_trustedMoveIndex = 0;
	// GS-3602. See `_updateOrder`.
	_pendingOrder = false;
	// non-null only while _buildTree is reparenting rows: the branches that have
	// holes punched in them and must be compacted when the loop ends
	_holedBranches: Set<Branch> | null = null;
	// true while parse() moves rows into their new parents one at a time. The
	// tree is incomplete in that window, so item levels are provisional and a
	// parent chain that closes on itself is not an error yet - see
	// calculateItemLevel (GS-3576)
	_reparentingRows = false;
	// set when a provisional level was counted over a chain that closed on
	// itself - such levels are recomputed once the tree is complete
	_provisionalLevels = false;
	_ganttConfig: any = null;
	_skipTaskRecalculation?: boolean | "lightbox";

	constructor(config: TreeDatastoreConfig){
		super(config);
		this._branches = {} as BranchMap;
		this._splitTaskHelper = new SplitTasksHelper(this);

		this.pull = {};
		//GS-761 Update existing item instead of adding it to the new position
		this.$initItem = (item: Partial<DatastoreItem> | Partial<TreeDatastoreItem>): DatastoreItem => {
			let loadedItem = item as TreeDatastoreItem;
			if(config.initItem){
				loadedItem = config.initItem(loadedItem) as TreeDatastoreItem;
			}
			const existingItem = item.id !== undefined && this.getItem(item.id);
			if(existingItem && !isEqualIds(existingItem.parent,loadedItem.parent)){
				this.move(loadedItem.id!, loadedItem.$index || -1, loadedItem.parent || this._ganttConfig?.root_id || this.$getRootId());
			}
			return loadedItem;
		};
		this.$parentProperty = config.parentProperty || "parent";

		if(typeof config.rootId !== "function"){
			this.$getRootId = ((val: Id) => {
				return function(){return val;};
			})(config.rootId || 0);
		}else{
			this.$getRootId = config.rootId;
		}

		// TODO: replace with live reference to gantt config
		this.$openInitially = config.openInitially || function(){ return false; };

		this.visibleOrder = powerArray.$create<Id>();
		this.fullOrder = powerArray.$create<Id>();
		this._searchVisibleOrder = {};
		this._indexRangeCache = {};
		this._eachItemMainRangeCache = null;
		this._getItemsCache = null;
		this._skip_refresh = false;

		this._ganttConfig = null;
		if(config.getConfig){
			this._ganttConfig = config.getConfig();
		}

		let splitParents: Record<any, boolean> = {};
		let splitItems: Record<any, boolean> = {};

		let taskOpenState: Record<any, boolean> = {};
		let taskVisibility: Record<any, boolean> = {};
		let haveSplitItems = false;

		this._attachDataChange(function(){
			this._indexRangeCache = {};
			this._eachItemMainRangeCache = null;
			this._getItemsCache = null;
			return true;
		});

		this.attachEvent("onPreFilter", function(this: TreeDatastoreInternal){
			this._indexRangeCache = {};
			this._eachItemMainRangeCache = null;

			splitParents = {};
			splitItems = {};
			taskOpenState = {};
			taskVisibility = {};
			haveSplitItems = false;

			this.eachItem((item)=>{
				if(!item) return;
				// GS-3602. Runs per item on every filter pass: passing the item to `getParent`
				// spares a `getItem`.
				const itemId = item.id;
				const parent = this.getParent(item);
				if(item.$open && taskOpenState[parent] !== false){
					taskOpenState[itemId] = true;
				}else{
					taskOpenState[itemId] = false;
				}

				const splitItem = item as TreeDatastoreItem;
				if(this._isSplitItem(splitItem)){
					haveSplitItems = true;
					splitParents[itemId] = true;
					splitItems[itemId] = true;
				}


				if(haveSplitItems && splitItems[parent]){
					if(this._isDefaultItem(splitItem) || this._isInlineChildItem(splitItem)) splitItems[itemId] = true;
				}


				const parentOpen = taskOpenState[parent];
				if(parentOpen || parentOpen === undefined || this._isInlineChildItem(splitItem)){
					taskVisibility[itemId] = true;
				}else{
					taskVisibility[itemId] = false;
				}
			});
		});

		this.attachEvent("onFilterItem", function(this: TreeDatastoreInternal, id: Id, item: TreeDatastoreItem){
			// GS-3602. Dispatched per item on every filter pass.
			const itemId = item.id;
			const visible = taskVisibility[itemId];
			let open = visible;

			if(haveSplitItems){
				const isSplitChild = splitItems[itemId] && !splitParents[itemId];
				if(isSplitChild){
					let canOpenSplitTasks = false;
					if(this._ganttConfig){
						canOpenSplitTasks = this._ganttConfig.open_split_tasks;
					}
					if(open){
						open = !!canOpenSplitTasks;
					}

					if(!this._isSplitChildItem(item)) item.$split_subtask = true;
				}
			}

			item.$expanded_branch = !!visible;
			if(this._isInlineChildItem(item)){
				open = false;
			}
			return !!open;
		});

		this.attachEvent("onFilter", function(){
			splitParents = {};
			splitItems = {};

			taskOpenState = {};
			taskVisibility = {};
		});
	}

	_buildTree(data: TreeDatastoreItem[]): void{
		let item: TreeDatastoreItem | null = null;
		const rootId = this.$getRootId();

		// PERF (GS-477): the bulk reparent window. Each setParent below removes
		// the row from its branch and appends it at the end; done per row with a
		// splice that is quadratic twice over - the tail shifts, and the shift
		// invalidates the position index so the next lookup scans. Inside the
		// window the removal punches a hole in place instead, which keeps the
		// index exact and every lookup O(1), and each touched branch is
		// compacted and re-indexed once when the window closes. The `finally`
		// matters: calculateItemLevel throws on a cyclic tree, and a hole must
		// never outlive this loop.
		const holed = new Set<Branch>();
		this._holedBranches = holed;
		// levels counted inside the loop are provisional: a row already moved and
		// a row still waiting for its turn can point at each other (GS-3576)
		const wasReparenting = this._reparentingRows;
		this._reparentingRows = true;
		try{
			for (let i = 0, len = data.length; i < len; i++){
				item = data[i];
				// must stay NON-silent: on re-parse of existing items the
				// remove+append cycle heals $rendered_parent on the replaced pull
				// object and adopts the incoming sibling order; with the branch
				// position index the probe is O(1) for fresh items, so this costs
				// nothing on a clean parse
				this.setParent(item, replaceValidZeroId(this.getParent(item), rootId) || rootId);
			}
		}finally{
			this._reparentingRows = wasReparenting;
			this._holedBranches = null;
			holed.forEach(function(branch){
				compactBranch(branch);
			});
		}

		// calculating $level for each item. Every branch touched above carries an
		// exact index now, so both calls below are O(1) per row.
		// The tree is complete here, so this is also where a cyclic parent chain
		// is reported: calculateItemLevel throws the "Invalid tasks tree" error
		// the same way it does for a cyclic first load.
		for (let i = 0, len = data.length; i < len; i++){
			item = data[i];
			this._add_branch(item);
			item.$level = this.calculateItemLevel(item);
			item.$local_index = this.getBranchIndex(item.id);

			if (!utils.defined(item.$open)) {
				item.$open = utils.defined(item.open) ? item.open : this.$openInitially();
			}

		}
		this._recalculateProvisionalLevels();
		this._updateOrder();
	}

	// rows that were not part of the payload keep the level they were given while
	// the tree was still incomplete. Recounting them costs a walk over the store,
	// so it only happens when a provisional level was actually counted over a
	// chain that closed on itself (GS-3576)
	_recalculateProvisionalLevels(): void{
		if(!this._provisionalLevels){
			return;
		}
		this._provisionalLevels = false;
		this.eachItem(function(this: TreeDatastoreInternal, item){
			item.$level = this.calculateItemLevel(item);
		});
	}

	_isSplitItem(item: TreeDatastoreItem): boolean{
		return this._splitTaskHelper.isSplitItem(item);
	}

	_isSplitChildItem(item: TreeDatastoreItem): boolean{
		return this._splitTaskHelper.isSubrowSplitItem(item);
	}

	_isDefaultItem(item: TreeDatastoreItem): boolean{
		return this._splitTaskHelper.isDefaultSplitItem(item);
	}

	_isInlineChildItem(item: TreeDatastoreItem): boolean{
		return this._splitTaskHelper.isInlineSplitItem(item);
	}

	parse(data: TreeDatastoreItem[]): void{
		if (!this._skip_refresh) {
			this.callEvent("onBeforeParse", [data]);
		}
		// $initItem reparents an already loaded row as soon as it is read, so the
		// tree is incomplete here for the same reason it is inside _buildTree -
		// levels stay provisional until every row of the payload is in place
		const wasReparenting = this._reparentingRows;
		this._reparentingRows = true;
		let loaded: TreeDatastoreItem[];
		try{
			loaded = this._parseInner(data) as TreeDatastoreItem[];
		}finally{
			this._reparentingRows = wasReparenting;
		}
		this._buildTree(loaded);
		this.filter();
		if (!this._skip_refresh) {
			this.callEvent("onParse", [loaded]);
		}
	}

	_addItemInner(item: DatastoreItem | TreeDatastoreItem, index?: number): void{

		let parent = this.getParent(item);

		if(!utils.defined(parent)){
			parent = this.$getRootId();
			this.setParent(item, parent);
		}

		// GS-3602. Only worked out when the caller asked for a position: with no index the
		// base store appends, and reading the visible order here would force a deferred
		// filter pass for every insertion.
		let targetIndex: number | undefined;
		const numericIndex = (index as number) * 1;
		if(numericIndex === numericIndex){
			const parentIndex = this.getIndexById(parent);
			targetIndex = parentIndex + Math.min(Math.max(numericIndex, 0), this.visibleOrder.length);

			if(targetIndex*1 !== targetIndex){
				targetIndex = undefined;
			}
		}
		super._addItemInner(item, targetIndex);
		this.setParent(item, parent);

		if(item.hasOwnProperty("$rendered_parent")){
			this._move_branch(item, item.$rendered_parent);
		}
		this._add_branch(item, index);
	}

	_changeIdInner(oldId: Id, newId: Id): void{
		const children = this._getBranch(oldId);
		const visibleOrder = this._searchVisibleOrder[oldId];

		super._changeIdInner(oldId, newId);

		const parent = this.getParent(newId);

		this._replace_branch_child(parent, oldId, newId);

		if(this._branches && this._branches[oldId]){
			this._branches[newId] = this._branches[oldId];
		}
		for(let i = 0; i < children.length; i++){
			const child = this.getItem(children[i]);
			if(child){
				child[this.$parentProperty] = newId;
				child.$rendered_parent = newId;
			}
		}

		this._searchVisibleOrder[newId] = visibleOrder;
		if(this._branches){
			delete this._branches[oldId];
		}
	}

	_traverseBranches(code: (this: TreeDatastoreInternal, itemId: Id) => void, parent?: Id): void{
		if (!utils.defined(parent)) {
			parent = this.$getRootId();
		}
		const branch = this._branches ? this._branches[parent as Id] : null;
		if (branch) {
			for (let i = 0; i < branch.length; i++) {
				const itemId = branch[i];
				code.call(this, itemId);
				if (this._branches && this._branches[itemId])
					this._traverseBranches(code, itemId);
			}
		}
	}

	_updateOrder(code?: OrderCallback): void{
		// GS-3602. Re-deriving the order walks the whole branch tree, and every add and
		// delete asks for it. While deferred it is recorded and done once at the end; the
		// base store still keeps its own array in step per item, so only the order waits.
		if(this._deferFilter > 0){
			this._pendingOrder = true;
		}else{
			this.fullOrder = powerArray.$create<Id>();
			this._traverseBranches(function(taskId){
				// GS-3602. A branch can hold an id with no item (see `_eachItemIterate`);
				// keeping it would make `count()` report a task no read can return.
				if(!this.exists(taskId)) return;
				this.fullOrder.push(taskId);
			});
		}

		if(code)
			super._updateOrder(code);
	}

	// GS-3602. An insertion made while the order recomputation was deferred appended
	// itself instead of taking its place under its parent; re-deriving once on release
	// puts both orders back in step with the tree.
	_flushDeferredFilter(): void{
		if(this._pendingOrder || this._pendingFilter){
			// cleared only after the walk: if it throws, the order is still owed
			this._updateOrder();
			this._pendingOrder = false;
		}
		super._flushDeferredFilter();
	}

	_removeItemInner(id: Id): void{

		const items: TreeDatastoreItem[] = [];
		this.eachItem(function(child){
			if(child){
				items.push(child as TreeDatastoreItem);
			}
		}, id);

		const item = this.getItem(id);
		if(item){
			items.push(item);
		}

		for(let i = 0; i < items.length; i++){

			this._move_branch(items[i], this.getParent(items[i]), null);
			super._removeItemInner(items[i].id);
			this._move_branch(items[i], this.getParent(items[i]), null);
		}
	}

	move(sid: Id, tindex: number, parent?: Id): false | void{
		//target id as 4th parameter
		let id = arguments[3] as Id;
		const config = this._ganttConfig || {};
		const root_id = config.root_id || 0;
		id = replaceValidZeroId(id, root_id);
		if (id) {
			if (id === sid) return;

			parent = this.getParent(id);
			tindex = this.getBranchIndex(id);
		}
		if(isEqualIds(sid, parent)){
			return;
		}
		if (!utils.defined(parent)) {
			parent = this.$getRootId();
		}
		const source = this.getItem(sid);
		if(!source) return;
		const source_pid = this.getParent(source.id);

		let tbranch = this._getBranch(parent);
		const siblings = this._getSiblingsBranch(sid);

		if (tindex == -1)
			tindex = tbranch.length + 1;
		if (isEqualIds(source_pid, parent)) {
			const sindex = this.getBranchIndex(sid);
			if (sindex == tindex) return;
			//GS-3004: prevent reorder single task in the root tree
			if (parent === root_id && siblings.length <= 1) {
				return;
			}
		}


		// GS-3389: Silent moves emit no public move events, cannot be vetoed by apps, and create no undo entry.
		// Store handlers still guard and update tree state (`onBeforeSilentMove`, `onAfterSilentMove`).
		const silent = this.isSilent();
		if(silent){
			// Keep placeholder and extension guards active during silent moves.
			if(isPlaceholderTask(sid, null, this as unknown as TreeDatastoreInternal, this._ganttConfig) ||
				this.callEvent("onBeforeSilentMove", [sid, parent, tindex]) === false)
				return false;
		}else if(this.callEvent("onBeforeItemMove", [sid, parent, tindex]) === false)
			return false;

		const targetSnapshotted = this._canonicalOrder.hasSnapshot(parent);
		if(targetSnapshotted){
			const sameParent = isEqualIds(source_pid, parent);
			let anchor: Id = undefined as unknown as Id;
			let previewIndex = 0;
			for(let i = 0; i < tbranch.length; i++){
				const branchId = tbranch[i];
				if(isPlaceholderTask(branchId, null, this as unknown as TreeDatastoreInternal, this._ganttConfig)) continue;
				if(sameParent && isEqualIds(branchId, sid)) continue;
				if(previewIndex === tindex){
					anchor = branchId;
					break;
				}
				previewIndex++;
			}
			anchor = replaceValidZeroId(anchor, root_id);
			if(anchor && !this._trustedMoveIndex && this._canonicalOrder.getPosition(parent, anchor, tbranch) === -1){
				// eslint-disable-next-line no-console
				console.error(`Gantt: cannot move task "${sid}" to index ${tindex} of parent "${parent}" - the destination doesn't resolve to a canonical position. The move was rejected.`);
				return false;
			}
		}

		const placeholderIds: Id[] = [];
		for(let i = 0; i < tbranch.length; i++){
			if (isPlaceholderTask(tbranch[i], null, this as unknown as TreeDatastoreInternal, this._ganttConfig)){
				placeholderIds.push(tbranch[i]);
				tbranch.splice(i, 1);
				i--;
			}
		}
		if(placeholderIds.length){
			dropBranchPositions(tbranch);
		}

		this._replace_branch_child(source_pid, sid);
		tbranch = this._getBranch(parent);

		let tid = tbranch[tindex];
		tid = replaceValidZeroId(tid, root_id);
		if (!tid){ //adding as last element
			tbranch.push(sid);
			appendBranchPosition(tbranch, sid);
		}else{
			tbranch = tbranch.slice(0, tindex).concat([ sid ]).concat(tbranch.slice(tindex)) as PowerArray<Id>;
		}

		if (placeholderIds.length){
			tbranch = tbranch.concat(placeholderIds) as PowerArray<Id>;
		}
		// GS-2423 to return initial parent to the task before it will be moved
		if (!isEqualIds(source.$rendered_parent, source_pid) && !isEqualIds(source_pid, parent)){
			source.$rendered_parent = source_pid;
		}
		const targetParent = parent as Id;
		this.setParent(source, targetParent);
		if(this._branches){
			this._branches[targetParent] = tbranch;
		}

		if(targetSnapshotted){
			this._canonicalOrder.remove(targetParent, sid);
			if(!tid){
				this._canonicalOrder.append(targetParent, sid);
			}else{
				this._canonicalOrder.insertBefore(targetParent, sid, tid);
			}
		}

		const diff = this.calculateItemLevel(source) - source.$level;
		source.$level += diff;
		this.eachItem(function(item){
			if(item){
				item.$level += diff;
			}
		}, source.id);


		this._moveInner(this.getIndexById(sid), this.getIndexById(targetParent) + tindex);

		if(silent){
			this.callEvent("onAfterSilentMove", [sid, parent, tindex, source_pid]);
		}else{
			this.callEvent("onAfterItemMove", [sid, parent, tindex]);
		}
		this.refresh();
	}

	getBranchIndex(id: Id): number{
		const branch = this._getBranch(this.getParent(id));
		return getBranchPosition(branch, id);
	}

	hasChild(id: Id | null | undefined): number | undefined{
		const branch = this._branches && utils.defined(id) ? this._branches[id as Id] : null;
		return branch ? branch.length : undefined;
	}

	/**
	 * The live branch array - a PowerArray carrying the position index. Internal
	 * use only: mutating it outside the branch helpers corrupts that index.
	 * Callers outside this module get a plain copy through
	 * getChildren()/getSiblings().
	 */
	_getBranch(id: Id | null | undefined): Branch{
		const branch = this._branches && utils.defined(id) ? this._branches[id as Id] : null;
		return branch ? branch : powerArray.$create<Id>() as Branch;
	}

	getChildren(id: Id | null | undefined): Id[]{
		// a plain copy: branch state is not meant to be edited through this
		// accessor, and the live array carries a position index that an outside
		// splice or reorder would silently invalidate. Not re-wrapped as a
		// PowerArray - gantt.getChildren() always returned a plain slice(), so
		// this is the contract callers already had, and $create() would add a
		// mixin of 7 properties per call for nobody
		return this._getBranch(id).slice();
	}

	getCanonicalChildren(id: Id | null | undefined): Id[]{
		const parent = utils.defined(id) ? (id as Id) : this.$getRootId();
		const order = this._canonicalOrder.getOrder(parent, this._getBranch(id));
		return Array.prototype.slice.call(order);
	}

	getCanonicalOrderRevision(): number{
		return this._canonicalOrder.revision;
	}

	withTrustedMoveIndex<T>(fn: () => T): T{
		this._trustedMoveIndex++;
		try{
			return fn();
		} finally {
			this._trustedMoveIndex--;
		}
	}

	exportCanonicalOrder(): Map<Id, Id[]>{
		const result = new Map<Id, Id[]>();
		if(!this._branches) return result;
		for(const key in this._branches){
			const parent = key as unknown as Id;
			const branch = this._branches[parent];
			if(!branch) continue;
			const order = this._canonicalOrder.getOrder(parent, branch);
			result.set(parent, Array.prototype.slice.call(order));
		}
		return result;
	}

	restoreCanonicalOrder(snapshot: Map<Id, Id[]>): void{
		if(!this._branches) return;
		const branches = this._branches;
		snapshot.forEach((order, parent) => {
			const liveBranch = branches[parent];
			if(!liveBranch) return; // this parent no longer exists in the rebuilt tree

			const liveIds = new Set<string>();
			for(let i = 0; i < liveBranch.length; i++){
				liveIds.add(String(liveBranch[i]));
			}

			const restored: Id[] = [];
			const known = new Set<string>();
			for(let i = 0; i < order.length; i++){
				if(liveIds.has(String(order[i]))){
					restored.push(order[i]);
					known.add(String(order[i]));
				}
			}
			// ids the rebuild added that the snapshot never saw - appended in rebuild order
			for(let i = 0; i < liveBranch.length; i++){
				const id = liveBranch[i];
				if(!known.has(String(id))){
					restored.push(id);
					known.add(String(id));
				}
			}

			this._canonicalOrder.snapshotBranch(parent, restored);
		});
	}

	isChildOf(childId: Id, parentId: Id): boolean{
		if (!this.exists(childId))
			return false;
		if (parentId === this.$getRootId())
			return true;

		if (!this.hasChild(parentId))
			return false;

		let item = this.getItem(childId);
		let pid = this.getParent(childId);

		const parent = this.getItem(parentId);
		if(!item || !parent || parent.$level >= item.$level){
			return false;
		}

		while (item && this.exists(pid)) {
			item = this.getItem(pid);

			if (item && isEqualIds(item.id, parentId))
				return true;
			pid = item ? this.getParent(item) : this.$getRootId();
		}
		return false;
	}

	getSiblings(id: Id): Id[]{
		if(!this.exists(id)){
			return [];
		}
		const parent = this.getParent(id);
		return this.getChildren(parent);

	}

	// live siblings branch for internal callers - see _getBranch()
	_getSiblingsBranch(id: Id): Branch{
		if(!this.exists(id)){
			return powerArray.$create<Id>() as Branch;
		}
		return this._getBranch(this.getParent(id));
	}

	getNextSibling(id: Id): Id | null{
		const siblings = this._getSiblingsBranch(id);
		for(let i= 0, len = siblings.length; i < len; i++){
			if(isEqualIds(siblings[i], id)){
				let nextSibling: Id | undefined = siblings[i+1];
				if (nextSibling === 0 && i > 0){
					nextSibling = "0";
				}
				return nextSibling || null;
			}
		}
		return null;
	}

	getPrevSibling(id: Id): Id | null{
		const siblings = this._getSiblingsBranch(id);
		for(let i= 0, len = siblings.length; i < len; i++){
			if(isEqualIds(siblings[i], id)){
				let previousSibling: Id | undefined = siblings[i-1];
				if (previousSibling === 0 && i > 0){
					previousSibling = "0";
				}
				return previousSibling || null;
			}
		}
		return null;
	}

	getParent(id: Id | Partial<TreeDatastoreItem>): Id{
		let item: TreeDatastoreItem | undefined | null = null;
		if((id as TreeDatastoreItem).id !== undefined){
			item = id as TreeDatastoreItem;
		}else{
			item = this.getItem(id as Id);
		}

		let parent: Id;
		if(item){
			parent = item[this.$parentProperty];
		}else{
			parent = this.$getRootId();
		}
		return parent;

	}

	clearAll(): void{
		this._branches = {} as BranchMap;
		this._eachItemMainRangeCache = null;
		this._canonicalOrder.clear();
		super.clearAll();
	}

	calculateItemLevel(item: Id | DatastoreItem | TreeDatastoreItem): number{
		if(this._reparentingRows){
			return this._calculateProvisionalItemLevel(item);
		}
		let level = 0;
		this.eachParent(function(){
			level++;
		}, item);
		return level;
	}

	/**
	 * GS-3576: level of an item counted over a parent chain that is allowed to
	 * close on itself. parse() moves rows into their new parents one at a time,
	 * so between two rows the chain can hold a cycle that the completed tree does
	 * not have - inverting a chain of tasks is enough to produce one. The count
	 * stops at the repeated ancestor and the tree is marked for a level
	 * recalculation; whether the finished tree is really cyclic is decided by
	 * _buildTree, which counts levels the strict way once every row is in place.
	 */
	_calculateProvisionalItemLevel(item: Id | DatastoreItem | TreeDatastoreItem): number{
		const visitedParents = new Set<string>();
		let parent = this.getParent(item);
		let level = 0;

		// counts the same ancestors eachParent would, it just stops at a repeated
		// one instead of throwing
		while(this.exists(parent)){
			const parentKey = String(parent);
			if(visitedParents.has(parentKey)){
				this._provisionalLevels = true;
				break;
			}
			visitedParents.add(parentKey);

			const parentItem = this.getItem(parent!);
			if(!parentItem) break;
			level++;
			parent = this.getParent(parentItem);
		}
		return level;
	}

	_setParentInner(item: DatastoreItem | TreeDatastoreItem, new_pid: Id | null, silent?: boolean): void{
		if(!silent){
			if(item.hasOwnProperty("$rendered_parent")){
				this._move_branch(item, item.$rendered_parent, new_pid);
			}else{
				this._move_branch(item, item[this.$parentProperty], new_pid);
			}
		}
	}

	setParent(item: DatastoreItem | TreeDatastoreItem, new_pid: Id | null, silent?: boolean): void{
		this._setParentInner(item, new_pid, silent);

		item[this.$parentProperty] = new_pid;
	}

	_eachItemCached(code: (this: TreeDatastoreInternal, item: DatastoreItem | TreeDatastoreItem) => void, cache: DatastoreItem[] | TreeDatastoreItem[]): void{
		for(let i = 0, len = cache.length; i < len; i++){
			code.call(this, cache[i]);
		}
	}

	_eachItemIterate(code: (this: TreeDatastoreInternal, item: DatastoreItem | TreeDatastoreItem) => void, startId: Id, cache?: DatastoreItem[] | TreeDatastoreItem[] | null): void{
		let itemsStack = this._getBranch(startId) as PowerArray<Id>;
		if(itemsStack.length){
			itemsStack = itemsStack.slice().reverse() as PowerArray<Id>;
		}
		// GS-3576: branches can reference each other - invalid data does it
		// permanently, and _buildTree does it transiently while it reparents rows
		// one at a time. Without this guard the walk keeps pushing the same ids
		// onto the stack and never returns, freezing the page. Ids are keyed the
		// same way as branch positions, so a numeric id and its string form count
		// as one visit
		const visited = new Set<string>();
		while(itemsStack.length){
			const itemId = itemsStack.pop();
			if(!utils.defined(itemId)) continue;
			const visitKey = String(itemId);
			if(visited.has(visitKey)) continue;
			visited.add(visitKey);
			const item = this.getItem(itemId as Id);
			if(!item) continue;
			code.call(this, item);
			if(cache){
				cache.push(item);
			}

			if(this.hasChild(item.id)){
				const children = this._getBranch(item.id);
				const len = children.length;
				for(let i = len - 1; i >= 0; i--){
					itemsStack.push(children[i]);
				}
			}

		}
	}

	eachItem(code: (this: TreeDatastoreInternal, item: DatastoreItem | TreeDatastoreItem) => void, parent?: Id): void{
		const rootId = this.$getRootId();
		if (!utils.defined(parent)) {
			parent = rootId;
		}
		const startId = replaceValidZeroId(parent, rootId) || rootId;

		let useCache = false;
		let buildCache = false;
		let cache: TreeDatastoreItem[] | null = null;
		if(startId === rootId){
			if(this._eachItemMainRangeCache){
				useCache = true;
				cache = this._eachItemMainRangeCache;
			}else{
				buildCache = true;
				cache = this._eachItemMainRangeCache = [];
			}
		}
		if(useCache && cache){
			this._eachItemCached(code, cache);
		}else{
			this._eachItemIterate(code, startId, buildCache ? cache : null);
		}
	}

	// GS-3626. Same walk as eachItem, sourced from canonical order instead of the
	// live (display) branch - used by gantt.serialize() when the wbs extension is active.
	eachItemCanonical(code: (this: TreeDatastoreInternal, item: DatastoreItem | TreeDatastoreItem) => void, parent?: Id): void{
		const rootId = this.$getRootId();
		if (!utils.defined(parent)) {
			parent = rootId;
		}
		const startId = replaceValidZeroId(parent, rootId) || rootId;

		const walk = (parentId: Id): void => {
			const children = this.getCanonicalChildren(parentId);
			for(let i = 0; i < children.length; i++){
				const id = children[i];
				const item = this.getItem(id);
				if(!item) continue;
				code.call(this, item);
				if(this.hasChild(id)){
					walk(id);
				}
			}
		};

		walk(startId);
	}

	eachParent(code: (this: TreeDatastoreInternal, item: DatastoreItem | TreeDatastoreItem) => void, startItem: Id | DatastoreItem | TreeDatastoreItem): void {
		const parentsHash: Record<any, boolean> = {};
		let item = startItem;
		let parent = this.getParent(item);

		while (this.exists(parent)) {
			if (parentsHash[parent!]) {
				throw new Error("Invalid tasks tree. Cyclic reference has been detected on task " + parent);
			}
			parentsHash[parent!] = true;
			item = this.getItem(parent!) as TreeDatastoreItem;
			if(!item) return;
			code.call(this, item);
			parent = this.getParent(item);
		}
	}

	_add_branch(item: DatastoreItem | TreeDatastoreItem, index?: number, parent?: Id): void{
		const pid = parent === undefined ? this.getParent(item) : parent;
		if (!this.hasChild(pid) && this._branches)
			this._branches[pid] = powerArray.$create<Id>();
		const branch = this._getBranch(pid);
		const added_already = findBranchPosition(branch, item.id) > -1;
		if(!added_already){
			if(index!*1 == index){
				const anchor = branch[index!];
				branch.splice(index!, 0, item.id);
				dropBranchPositions(branch);
				this._canonicalOrder.insertBefore(pid, item.id, anchor);
			}else{
				branch.push(item.id);
				appendBranchPosition(branch, item.id);
				this._canonicalOrder.append(pid, item.id);
			}

			item.$rendered_parent = pid;
		}
	}

	_move_branch(item: DatastoreItem | TreeDatastoreItem, old_parent?: Id | null, new_parent?: Id | null): void{
		this._eachItemMainRangeCache = null;
		//this.setParent(item, new_parent);
		//this._sync_parent(task);
		this._replace_branch_child(old_parent, item.id);
		if(this.exists(new_parent as Id) || isEqualIds(new_parent, this.$getRootId())){

			this._add_branch(item, undefined, new_parent as Id);
		}else{
			if(this._branches){
				delete this._branches[item.id];
			}
			this._canonicalOrder.dropBranch(item.id);
		}
		item.$level =  this.calculateItemLevel(item);
		this.eachItem(function(child){
			child.$level = this.calculateItemLevel(child);
		}, item.id);
	}

	_replace_branch_child(node: Id | null | undefined, old_id: Id, new_id?: Id): void{
		const branch = this._getBranch(node);
		if (branch && node !== undefined && node !== null){
			// PERF (GS-477): inside the bulk reparent window a removal punches a
			// hole instead of splicing, so no position shifts and the map stays
			// exact - the branch is compacted once when the window closes
			if(!new_id && this._holedBranches){
				const holeIndex = resolveBranchPosition(branch, old_id);
				if(holeIndex > -1){
					branch[holeIndex] = undefined as unknown as Id;
					deleteBranchPosition(branch, old_id);
					this._holedBranches.add(branch);
					this._canonicalOrder.remove(node, old_id);
				}
				return;
			}

			let newbranch = powerArray.$create<Id>();

			const index = findBranchPosition(branch, old_id);

			if (index > -1){
				if (new_id){
					branch.splice(index, 1, new_id);
					replaceBranchPosition(branch, old_id, new_id, index);
					this._canonicalOrder.replaceId(node, old_id, new_id);
				} else {
					branch.splice(index, 1);
					dropBranchPositions(branch);
					this._canonicalOrder.remove(node, old_id);
				}
			}
			newbranch = branch;

			if(this._branches){
				this._branches[node] = newbranch;
			}
		}

	}

	sort(field?: string | ((a: TreeDatastoreItem, b: TreeDatastoreItem) => number), desc?: boolean, parent?: Id): void{
		if (!this.exists(parent)) {
			parent = this.$getRootId();
		}

		if (!field) field = "order";
		let criteria = (typeof(field) == "string") ? ((a: TreeDatastoreItem, b: TreeDatastoreItem): number => {
			if (a[field] == b[field] ||
				(helpers.isDate(a[field]) && helpers.isDate(b[field]) && a[field].valueOf() == b[field].valueOf()))
			{
				return 0;
			}

			const result = a[field] > b[field];
			return result ? 1 : -1;
		}) : field;

		if (desc) {
			const original_criteria = criteria;
			criteria = function (a: TreeDatastoreItem, b: TreeDatastoreItem): number {
				return original_criteria(b, a);
			};
		}

		const els = this._getBranch(parent);

		if (els){
			const temp: TreeDatastoreItem[] = [];
			for (let i = els.length - 1; i >= 0; i--){
				const item = this.getItem(els[i]);
				if(item){
					temp[i] = item;
				}
			}

			temp.sort(criteria);

			let reordered = temp.length !== els.length;
			for(let i = 0; !reordered && i < temp.length; i++){
				if(!temp[i] || !isEqualIds(temp[i].id, els[i])){
					reordered = true;
				}
			}
			if(reordered){
				this._canonicalOrder.snapshotBranch(parent as Id, els);
			}

			// dropped before the reorder, so nothing can read a stale position
			// off a half-reordered branch
			dropBranchPositions(els);
			for (let i = 0; i < temp.length; i++) {
				els[i] = temp[i].id;
				this.sort(field, desc, els[i]);
			}
		}
	}

	filter(rule?: any): void{
		for(const i in this.pull){
			const item = this.pull[i];
			const renderedParent = item.$rendered_parent;
			const actualParent = this.getParent(item);
			//GS-2339: could be different types of the ids
			// GS-3602. `isEqualIds` stringifies both ids; the identity test settles the
			// common case without allocating.
			if(renderedParent !== actualParent && !isEqualIds(renderedParent,actualParent)){
				this._move_branch(item, renderedParent, actualParent);
			}
		}
		return super.filter(rule);
	}

	open(id: Id): void{
		if(this.exists(id)){
			const item = this.getItem(id);
			item!.$open = true;
			// GS-2170. Do not recalculate the indexes and dates as they will be recalculated later
			this._skipTaskRecalculation = true;
			this.callEvent("onItemOpen", [id]);
		}
	}

	close(id: Id): void{
		if(this.exists(id)){
			const item = this.getItem(id);
			item!.$open = false;
			// GS-2170. Do not recalculate the indexes and dates as they will be recalculated later
			this._skipTaskRecalculation = true;
			this.callEvent("onItemClose", [id]);
		}
	}

	destructor(): void{
		super.destructor();
		this._branches = null;
		this._indexRangeCache = {};
		this._eachItemMainRangeCache = null;
	}
}

function isEqualIds(first: unknown, second: unknown): boolean{
	return String(first) === String(second);
}

export default TreeDatastoreInternal;
