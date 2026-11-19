import powerArray from "./power_array";
import * as utils from "../../utils/utils";
import * as helpers from "../../utils/helpers";
import DataStore from "./datastore";
import isPlaceholderTask from "../../utils/placeholder_task";
import {replaceValidZeroId} from "../../utils/helpers";
import SplitTasksHelper from "../common/split_task_helpers";

/**
 * GS-477. A branch array may carry `$positionById` - a String(id) -> index map
 * that answers position lookups in O(1) instead of scanning. Non-enumerable, so
 * it cannot show up in enumeration or serialization of a branch.
 *
 * Live branch arrays never leave this module: getChildren()/getSiblings() return
 * copies, internal callers use _getBranch(). Editing a handed-out array leaves a
 * stale entry, which splices the wrong slot on the next removal.
 *
 * Maintenance policy - every mutation goes through the helpers below:
 * - append and in-place id replacement keep the map exact in O(1);
 * - removal, insert-in-the-middle and reorder shift an unbounded number of
 *   entries, so they DROP the map. Repairing costs O(branch length) per
 *   mutation, which made re-parse slower than no cache at all.
 *
 * The two "absent" states differ:
 * - `undefined` - never built; any lookup may build it. Keeps an initial parse
 *   O(1) per row.
 * - `null` - dropped by a mutation. Mutation-side lookups must NOT rebuild it
 *   (bulk churn would pay a full rebuild per row); read-heavy callers do,
 *   through getBranchPosition().
 *
 * Ported from `next` (GS-477).
 */
function setBranchPositions(branch, positions){
	Object.defineProperty(branch, "$positionById", {
		configurable: true,
		value: positions,
		writable: true
	});
}

function buildBranchPositions(branch){
	var positions = new Map();
	for(var i = 0; i < branch.length; i++){
		// a hole left by the bulk reparent window has no id to index
		if(branch[i] !== undefined){
			positions.set(String(branch[i]), i);
		}
	}
	setBranchPositions(branch, positions);
	return positions;
}

// ids may be stored as numbers and looked up as strings, or the other way
// round; the strict probe goes first so a same-type lookup stops at the match
function scanBranchPosition(branch, id){
	var index = branch.indexOf(id);
	if(index === -1){
		index = branch.indexOf(id + "");
	}
	if(index === -1){
		index = branch.indexOf(+id);
	}
	return index;
}

// lookup used inside the bulk reparent window, where the map is never dropped
function resolveBranchPosition(branch, id){
	var positions = branch.$positionById || buildBranchPositions(branch);
	var position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

// only valid when the id's slot is punched out in place, so no position shifts
function deleteBranchPosition(branch, id){
	var positions = branch.$positionById;
	if(positions){
		positions.delete(String(id));
	}
}

// closes the bulk reparent window for one branch: drops the holes in place,
// keeping the array identity, and re-indexes once
function compactBranch(branch){
	var write = 0;
	for(var read = 0; read < branch.length; read++){
		var id = branch[read];
		if(id !== undefined){
			branch[write] = id;
			write++;
		}
	}
	branch.length = write;
	buildBranchPositions(branch);
}

// read-heavy callers: builds or rebuilds the map
function getBranchPosition(branch, id){
	var positions = branch.$positionById || buildBranchPositions(branch);
	var position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

// mutation paths: builds the map once, but never rebuilds one a previous
// mutation dropped
function findBranchPosition(branch, id){
	var positions = branch.$positionById === undefined ? buildBranchPositions(branch) : branch.$positionById;
	if(!positions){
		return scanBranchPosition(branch, id);
	}
	var position = positions.get(String(id));
	return position === undefined ? -1 : position;
}

function appendBranchPosition(branch, id){
	var positions = branch.$positionById;
	if(positions){
		positions.set(String(id), branch.length - 1);
	}
}

function replaceBranchPosition(branch, oldId, newId, index){
	var positions = branch.$positionById;
	if(positions){
		positions.delete(String(oldId));
		positions.set(String(newId), index);
	}
}

function dropBranchPositions(branch){
	setBranchPositions(branch, null);
}

var TreeDataStore = function(config){
	DataStore.apply(this, [config]);
	this._branches = {};
	this._splitTaskHelper = new SplitTasksHelper(this);

	this.pull = {};
	//GS-761 Update existing item instead of adding it to the new position
	this.$initItem = function (item){
		var loadedItem = item;
		if(config.initItem){
			loadedItem = config.initItem(loadedItem);
		}
		var existingItem = this.getItem(item.id);
		if(existingItem && !isEqualIds(existingItem.parent,loadedItem.parent)){
			this.move(loadedItem.id, loadedItem.$index || -1, loadedItem.parent || this._ganttConfig.root_id);
		}
		return loadedItem;
	};
	this.$parentProperty = config.parentProperty || "parent";

	if(typeof config.rootId !== "function"){
		this.$getRootId = (function(val){
			return function(){return val;};
		})(config.rootId || 0);
	}else{
		this.$getRootId = config.rootId;
	}

	// TODO: replace with live reference to gantt config
	this.$openInitially = config.openInitially;

	this.visibleOrder = powerArray.$create();
	this.fullOrder = powerArray.$create();
	// GS-3602. See `_updateOrder`.
	this._pendingOrder = false;
	this._searchVisibleOrder = {};
	this._indexRangeCache = {};
	this._eachItemMainRangeCache = null;
	// GS-477. Non-null only while `_buildTree` reparents rows: the branches with
	// holes punched in them, to be compacted when the loop ends.
	this._holedBranches = null;
	this._getItemsCache = null;
	this._skip_refresh = false;

	this._ganttConfig = null;
	if(config.getConfig){
		this._ganttConfig = config.getConfig();
	}

	var splitParents = {};
	var splitItems = {};

	var taskOpenState = {};
	var taskVisibility = {};
	var haveSplitItems = false;

	this._attachDataChange(function(){
		this._indexRangeCache = {};
		this._eachItemMainRangeCache = null;
		this._getItemsCache = null;
		return true;
	});

	this.attachEvent("onPreFilter", function(){
		this._indexRangeCache = {};
		this._eachItemMainRangeCache = null;

		splitParents = {};
		splitItems = {};
		taskOpenState = {};
		taskVisibility = {};
		haveSplitItems = false;

		this.eachItem(function(item){
			// GS-3602. Runs per item on every filter pass: passing the item to `getParent`
			// spares a `getItem`.
			var itemId = item.id;
			var parent = this.getParent(item);
			if(item.$open && taskOpenState[parent] !== false){
				taskOpenState[itemId] = true;
			}else{
				taskOpenState[itemId] = false;
			}

			if(this._isSplitItem(item)){
				haveSplitItems = true;
				splitParents[itemId] = true;
				splitItems[itemId] = true;
			}


			if(haveSplitItems && splitItems[parent]){
				if(this._isDefaultItem(item) || this._isInlineChildItem(item)) splitItems[itemId] = true;
			}


			var parentOpen = taskOpenState[parent];
			if(parentOpen || parentOpen === undefined || this._isInlineChildItem(item)){
				taskVisibility[itemId] = true;
			}else{
				taskVisibility[itemId] = false;
			}
		});
	});

	this.attachEvent("onFilterItem", function(id, item){
		// GS-3602. Dispatched per item on every filter pass.
		var itemId = item.id;
		var visible = taskVisibility[itemId];
		var open = visible;

		if(haveSplitItems){
			var isSplitChild = splitItems[itemId] && !splitParents[itemId];
			if(isSplitChild){
				var canOpenSplitTasks = false;
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

	return this;
};

TreeDataStore.prototype = utils.mixin({

		_buildTree: function(data){
			var item = null;
			var rootId = this.$getRootId();

			// GS-477. The bulk reparent window. Each setParent below moves the row to the end
			// of its branch; splicing per row is quadratic twice over - the tail shifts, and
			// the shift invalidates the position index so the next lookup scans. Inside the
			// window the removal punches an `undefined` hole in place instead, and each
			// touched branch is compacted once when the window closes. The `finally` matters:
			// `setParent` reaches `calculateItemLevel`, which throws on a cyclic tree, and a
			// hole must never outlive this loop.
			var holed = new Set();
			this._holedBranches = holed;
			try{
				for (var i = 0, len = data.length; i < len; i++){
					item = data[i];
					this.setParent(item, replaceValidZeroId(this.getParent(item), rootId) || rootId);
				}
			}finally{
				this._holedBranches = null;
				holed.forEach(function(branch){
					compactBranch(branch);
				});
			}

			// calculating $level for each item
			for (var i = 0, len = data.length; i < len; i++){
				item = data[i];
				this._add_branch(item);
				item.$level = this.calculateItemLevel(item);
				item.$local_index = this.getBranchIndex(item.id);

				if (!utils.defined(item.$open)) {
					item.$open = utils.defined(item.open) ? item.open : this.$openInitially();
				}

			}
			this._updateOrder();
		},
		_isSplitItem: function(item){
			return this._splitTaskHelper.isSplitItem(item);
		},
		_isSplitChildItem: function(item){
			return this._splitTaskHelper.isSubrowSplitItem(item);
		},
		_isDefaultItem: function(item){
			return this._splitTaskHelper.isDefaultSplitItem(item);
		},
		_isInlineChildItem: function(item){
			return this._splitTaskHelper.isInlineSplitItem(item);
		},
		parse: function(data){
			if (!this._skip_refresh) {
				this.callEvent("onBeforeParse", [data]);
			}
			var loaded = this._parseInner(data);
			this._buildTree(loaded);
			this.filter();
			if (!this._skip_refresh) {
				this.callEvent("onParse", [loaded]);
			}
		},

		_addItemInner: function(item, index){

			var parent = this.getParent(item);

			if(!utils.defined(parent)){
				parent = this.$getRootId();
				this.setParent(item, parent);
			}

			// GS-3602. Only worked out when the caller asked for a position: with no index the
			// base store appends, and reading the visible order here would force a deferred
			// filter pass for every insertion.
			var targetIndex;
			var numericIndex = index * 1;
			if(numericIndex === numericIndex){
				var parentIndex = this.getIndexById(parent);
				targetIndex = parentIndex + Math.min(Math.max(numericIndex, 0), this.visibleOrder.length);

				if(targetIndex*1 !== targetIndex){
					targetIndex = undefined;
				}
			}
			DataStore.prototype._addItemInner.call(this, item, targetIndex);
			this.setParent(item, parent);

			if(item.hasOwnProperty("$rendered_parent")){
				this._move_branch(item, item.$rendered_parent);
			}
			this._add_branch(item, index);
		},
		_changeIdInner: function(oldId, newId){
			var children = this._getBranch(oldId);
			var visibleOrder = this._searchVisibleOrder[oldId];

			DataStore.prototype._changeIdInner.call(this, oldId, newId);

			var parent = this.getParent(newId);

			this._replace_branch_child(parent, oldId, newId);

			if(this._branches[oldId]){
				this._branches[newId] = this._branches[oldId];
			}
			for(var i = 0; i < children.length; i++){
				var child = this.getItem(children[i]);
				child[this.$parentProperty] = newId;
				child.$rendered_parent = newId;
			}

			this._searchVisibleOrder[newId] = visibleOrder;
			delete this._branches[oldId];
		},

		_traverseBranches: function(code, parent){
			if (!utils.defined(parent)) {
				parent = this.$getRootId();
			}
			var branch = this._branches[parent];
			if (branch) {
				for (var i = 0; i < branch.length; i++) {
					var itemId = branch[i];
					code.call(this, itemId);
					if (this._branches[itemId])
						this._traverseBranches(code, itemId);
				}
			}
		},

		_updateOrder: function(code){
			// GS-3602. Re-deriving the order walks the whole branch tree, and every add and
			// delete asks for it. While deferred it is recorded and done once at the end; the
			// base store still keeps its own array in step per item, so only the order waits.
			if(this._deferFilter > 0){
				this._pendingOrder = true;
			}else{
				this.fullOrder = powerArray.$create();
				this._traverseBranches(function(taskId){
					// GS-3602. A branch can hold an id with no item (see `_eachItemIterate`);
					// keeping it would make `count()` report a task no read can return.
					if(!this.exists(taskId)) return;
					this.fullOrder.push(taskId);
				});
			}

			if(code)
				DataStore.prototype._updateOrder.call(this, code);
		},

		// GS-3602. An insertion made while the order recomputation was deferred appended
		// itself instead of taking its place under its parent; re-deriving once on release
		// puts both orders back in step with the tree.
		_flushDeferredFilter: function(){
			if(this._pendingOrder || this._pendingFilter){
				// cleared only after the walk: if it throws, the order is still owed
				this._updateOrder();
				this._pendingOrder = false;
			}
			DataStore.prototype._flushDeferredFilter.call(this);
		},

		_removeItemInner: function(id){

			var items = [];
			this.eachItem(function(child){
				items.push(child);
			}, id);

			items.push(this.getItem(id));

			for(var i = 0; i < items.length; i++){

				this._move_branch(items[i], this.getParent(items[i]), null);
				DataStore.prototype._removeItemInner.call(this, items[i].id);
				this._move_branch(items[i], this.getParent(items[i]), null);
			}
		},

		move: function(sid, tindex, parent){
			//target id as 4th parameter
			var id = arguments[3];
			var config = this._ganttConfig || {};
			var root_id = config.root_id || 0;
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
			var source = this.getItem(sid);
			var source_pid = this.getParent(source.id);

			var tbranch = this._getBranch(parent);
			const siblings = this._getSiblingsBranch(sid);

			if (tindex == -1)
				tindex = tbranch.length + 1;
			if (isEqualIds(source_pid, parent)) {
				var sindex = this.getBranchIndex(sid);
				if (sindex == tindex) return;
				//GS-3004: prevent reorder single task in the root tree
				// `root_id` is this store's own config, resolved at the top of the method. The
				// bare global `gantt` this used to read does not exist in the node bundle, so
				// any same-parent reorder threw there.
				if (parent === root_id && siblings.length <= 1) {
					return;
				}
			}


			// GS-3389: Silent moves emit no public move events, cannot be vetoed by apps, and create no undo entry.
			// Store handlers still guard and update tree state (`onBeforeSilentMove`, `onAfterSilentMove`).
			var silent = this.isSilent();
			if(silent){
				// Keep placeholder and extension guards active during silent moves.
				if(isPlaceholderTask(sid, null, this, this._ganttConfig) ||
					this.callEvent("onBeforeSilentMove", [sid, parent, tindex]) === false)
					return false;
			}else if(this.callEvent("onBeforeItemMove", [sid, parent, tindex]) === false)
				return false;

			var placeholderIds = [];
			for(var i = 0; i < tbranch.length; i++){
				if (isPlaceholderTask(tbranch[i], null, this, this._ganttConfig)){
					placeholderIds.push(tbranch[i]);
					tbranch.splice(i, 1);
					i--;
				}
			}
			if(placeholderIds.length){
				// GS-477. The splices above shifted positions in the live branch.
				dropBranchPositions(tbranch);
			}

			this._replace_branch_child(source_pid, sid);
			tbranch = this._getBranch(parent);

			var tid = tbranch[tindex];
			tid = replaceValidZeroId(tid, root_id);
			if (!tid){ //adding as last element
				tbranch.push(sid);
				appendBranchPosition(tbranch, sid);
			}else{
				// a fresh array - it carries no index, and the first lookup builds one
				tbranch = tbranch.slice(0, tindex).concat([ sid ]).concat(tbranch.slice(tindex));
			}

			if (placeholderIds.length){
				tbranch = tbranch.concat(placeholderIds);
			}
			// GS-2423 to return initial parent to the task before it will be moved
			if (!isEqualIds(source.$rendered_parent, source_pid) && !isEqualIds(source_pid, parent)){
				source.$rendered_parent = source_pid;
			}
			this.setParent(source, parent);
			this._branches[parent] = tbranch;

			var diff = this.calculateItemLevel(source) - source.$level;
			source.$level += diff;
			this.eachItem(function(item){
				item.$level += diff;
			}, source.id, this);


			this._moveInner(this.getIndexById(sid), this.getIndexById(parent) + tindex);

			if(silent){
				this.callEvent("onAfterSilentMove", [sid, parent, tindex, source_pid]);
			}else{
				this.callEvent("onAfterItemMove", [sid, parent, tindex]);
			}
			this.refresh();
		},

		getBranchIndex: function(id){
			// GS-477. Read-heavy - the tasks store recomputes $local_index for every visible
			// row on every full refresh - so it rebuilds a dropped index rather than scanning.
			var branch = this._getBranch(this.getParent(id));
			return getBranchPosition(branch, id);
		},
		hasChild: function(id){
			var branch = this._branches[id];
			return branch && branch.length;
		},
		/**
		 * GS-477. The live branch array. Internal use only: mutating it outside the branch
		 * helpers corrupts the position index it carries.
		 */
		_getBranch: function(id){
			var branch = this._branches[id];
			return branch ? branch : powerArray.$create();
		},
		getChildren: function(id){
			// GS-477. A copy - an outside splice or reorder would silently invalidate the
			// live array's position index. Left as a plain array: `gantt.getChildren()`
			// always returned a plain slice(), so this is the contract callers already had.
			return this._getBranch(id).slice();
		},

		isChildOf: function(childId, parentId){
			if (!this.exists(childId))
				return false;
			if (parentId === this.$getRootId())
				return true;

			if (!this.hasChild(parentId))
				return false;

			var item = this.getItem(childId);
			var pid = this.getParent(childId);

			var parent = this.getItem(parentId);
			if(parent.$level >= item.$level){
				return false;
			}

			while (item && this.exists(pid)) {
				item = this.getItem(pid);

				if (item && isEqualIds(item.id, parentId))
					return true;
				pid = this.getParent(item);
			}
			return false;
		},

		getSiblings: function(id){
			if(!this.exists(id)){
				return [];
			}
			var parent = this.getParent(id);
			return this.getChildren(parent);

		},
		// GS-477. See `_getBranch`.
		_getSiblingsBranch: function(id){
			if(!this.exists(id)){
				return powerArray.$create();
			}
			return this._getBranch(this.getParent(id));
		},
		getNextSibling: function(id){
			var siblings = this._getSiblingsBranch(id);
			for(var i= 0, len = siblings.length; i < len; i++){
				if(isEqualIds(siblings[i], id)){
					var nextSibling = siblings[i+1];
					if (nextSibling === 0 && i > 0){
						nextSibling = "0";
					}
					return nextSibling || null;
				}
			}
			return null;
		},
		getPrevSibling: function(id){
			var siblings = this._getSiblingsBranch(id);
			for(var i= 0, len = siblings.length; i < len; i++){
				if(isEqualIds(siblings[i], id)){
					var previousSibling = siblings[i-1];
					if (previousSibling === 0 && i > 0){
						previousSibling = "0";
					}
					return previousSibling || null;
				}
			}
			return null;
		},
		getParent: function(id){
			var item = null;
			if(id.id !== undefined){
				item = id;
			}else{
				item = this.getItem(id);
			}

			var parent;
			if(item){
				parent = item[this.$parentProperty];
			}else{
				parent = this.$getRootId();
			}
			return parent;

		},

		clearAll: function(){
			this._branches = {};
			this._eachItemMainRangeCache = null;
			DataStore.prototype.clearAll.call(this);
		},

		calculateItemLevel: function(item){
			var level = 0;
			this.eachParent(function(){
				level++;
			}, item);
			return level;
		},

		_setParentInner: function(item, new_pid, silent){
			if(!silent){
				if(item.hasOwnProperty("$rendered_parent")){
					this._move_branch(item, item.$rendered_parent, new_pid);
				}else{
					this._move_branch(item, item[this.$parentProperty], new_pid);
				}
			}
		},
		setParent: function(item, new_pid, silent){
			this._setParentInner(item, new_pid, silent);

			item[this.$parentProperty] = new_pid;
		},

		_eachItemCached: function(code, cache){
			for(var i = 0, len = cache.length; i < len; i++){
				code.call(this, cache[i]);
			}
		},
		_eachItemIterate: function(code, startId, cache){
			var itemsStack = this._getBranch(startId);
			if(itemsStack.length){
				itemsStack = itemsStack.slice().reverse();
			}
			while(itemsStack.length){
				var itemId = itemsStack.pop();
				var item = this.getItem(itemId);
				// GS-3602. A branch can hold an id whose item is not in the store:
				// `gantt.addTask` registers the record through `setParent` before the store
				// inserts it, so anything walking the tree inside that window - an `initItem`
				// handler, a filter pass triggered by a read - used to throw here.
				if(!item) continue;
				code.call(this, item);
				if(cache){
					cache.push(item);
				}

				if(this.hasChild(item.id)){
					var children = this._getBranch(item.id);
					var len = children.length;
					for(var i = len - 1; i >= 0; i--){
						itemsStack.push(children[i]);
					}
				}

			}
		},

		eachItem: function(code, parent){
			var rootId = this.$getRootId();
			if (!utils.defined(parent)) {
				parent = rootId;
			}
			var startId = replaceValidZeroId(parent, rootId) || rootId;

			var useCache = false;
			var buildCache = false;
			var cache = null;
			if(startId === rootId){
				if(this._eachItemMainRangeCache){
					useCache = true;
					cache = this._eachItemMainRangeCache;
				}else{
					buildCache = true;
					cache = this._eachItemMainRangeCache = [];
				}
			}
			if(useCache){
				this._eachItemCached(code, cache);
			}else{
				this._eachItemIterate(code, startId, buildCache ? cache : null);
			}
		},
		eachParent: function(code, startItem) {
			var parentsHash = {};
			var item = startItem;
			var parent = this.getParent(item);

			while (this.exists(parent)) {
				if (parentsHash[parent]) {
					throw new Error("Invalid tasks tree. Cyclic reference has been detected on task " + parent);
				}
				parentsHash[parent] = true;
				item = this.getItem(parent);
				code.call(this, item);
				parent = this.getParent(item);
			}
		},
		_add_branch: function(item, index, parent){
			var pid = parent === undefined ? this.getParent(item) : parent;
			if (!this.hasChild(pid))
				this._branches[pid] = powerArray.$create();
			var branch = this._getBranch(pid);
			var added_already = findBranchPosition(branch, item.id) > -1;
			if(!added_already){
				if(index*1 == index){
					// GS-477. An insert in the middle shifts every position after it.
					branch.splice(index, 0, item.id);
					dropBranchPositions(branch);
				}else{
					branch.push(item.id);
					appendBranchPosition(branch, item.id);
				}

				item.$rendered_parent = pid;
			}
		},
		_move_branch: function(item, old_parent, new_parent){
			this._eachItemMainRangeCache = null;
			//this.setParent(item, new_parent);
			//this._sync_parent(task);
			this._replace_branch_child(old_parent, item.id);
			if(this.exists(new_parent) || isEqualIds(new_parent, this.$getRootId())){

				this._add_branch(item, undefined, new_parent);
			}else{
				delete this._branches[item.id];
			}
			item.$level =  this.calculateItemLevel(item);
			this.eachItem(function(child){
				child.$level = this.calculateItemLevel(child);
			}, item.id);
		},

		_replace_branch_child: function(node, old_id, new_id){
			var branch = this._getBranch(node);
			if (branch && node !== undefined){
				// GS-477. Inside the bulk reparent window a removal punches a hole instead of
				// splicing, so no position shifts. See `_buildTree`.
				if(!new_id && this._holedBranches){
					var holeIndex = resolveBranchPosition(branch, old_id);
					if(holeIndex > -1){
						branch[holeIndex] = undefined;
						deleteBranchPosition(branch, old_id);
						this._holedBranches.add(branch);
					}
					return;
				}

				var newbranch = powerArray.$create();

				let index = findBranchPosition(branch, old_id);

				if (index > -1){
					if (new_id){
						branch.splice(index, 1, new_id);
						replaceBranchPosition(branch, old_id, new_id, index);
					} else {
						branch.splice(index, 1);
						dropBranchPositions(branch);
					}
				}
				newbranch = branch;

				this._branches[node] = newbranch;
			}

		},

		sort: function(field, desc, parent){
			if (!this.exists(parent)) {
				parent = this.$getRootId();
			}

			if (!field) field = "order";
			var criteria = (typeof(field) == "string") ? (function(a, b) {
				if (a[field] == b[field] ||
					(helpers.isDate(a[field]) && helpers.isDate(b[field]) && a[field].valueOf() == b[field].valueOf()))
				{
					return 0;
				}

				var result = a[field] > b[field];
				return result ? 1 : -1;
			}) : field;

			if (desc) {
				var original_criteria = criteria;
				criteria = function (a, b) {
					return original_criteria(b, a);
				};
			}

			var els = this._getBranch(parent);

			if (els){
				var temp = [];
				for (var i = els.length - 1; i >= 0; i--)
					temp[i] = this.getItem(els[i]);

				temp.sort(criteria);

				// GS-477. Dropped first, so nothing reads a stale position off a
				// half-reordered branch.
				dropBranchPositions(els);
				for (var i = 0; i < temp.length; i++) {
					els[i] = temp[i].id;
					this.sort(field, desc, els[i]);
				}
			}
		},

		filter: function(rule){
			for(let i in this.pull){
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
			return DataStore.prototype.filter.apply(this, arguments);
		},

		open: function(id){
			if(this.exists(id)){
				this.getItem(id).$open = true;
				// GS-2170. Do not recalculate the indexes and dates as they will be recalculated later
				this._skipTaskRecalculation = true;
				this.callEvent("onItemOpen", [id]);
			}
		},

		close: function(id){
			if(this.exists(id)){
				this.getItem(id).$open = false;
				// GS-2170. Do not recalculate the indexes and dates as they will be recalculated later
				this._skipTaskRecalculation = true;
				this.callEvent("onItemClose", [id]);
			}
		},

		destructor: function(){
			DataStore.prototype.destructor.call(this);
			this._branches = null;
			this._indexRangeCache = {};
			this._eachItemMainRangeCache = null;
		}
	},
	DataStore.prototype
);

function isEqualIds(first, second){
	return String(first) === String(second);
};

export default TreeDataStore;