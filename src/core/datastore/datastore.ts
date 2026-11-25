import powerArray, { type PowerArray } from "./power_array";
import * as utils from "../../utils/utils";
import eventable from "../../utils/eventable";
import isPlaceholderTask from "../../utils/placeholder_task";
import type { DatastoreConfig, DatastoreItem, Id, Link, Datastore, TreeDatastoreItem } from "../../types/gantt_types";
import TreeDatastoreInternal from "./treedatastore";


type DataChangeCallback = (this: any) => boolean;
type OrderCallback = (this: PowerArray<Id>) => void;

type StoreUpdateArgs = [Id, DatastoreItem | undefined, "paint"] | [null, null, null];

interface DatastoreInternal extends Omit <Datastore, "eachItem" | "fullOrder" | "visibleOrder"> {
	eachItem(
		code: (this: DatastoreInternal, item: DatastoreItem | undefined) => void,
		parent?: Id /* a simpler way to resolve conflicts in the select.ts file */
	): void;

	fullOrder: PowerArray<Id>;
	visibleOrder: PowerArray<Id>;
	
	detachAllEvents: () => void;
	getIndexRange(from?: number, to?: number): DatastoreItem[];
	sync_link?: (link: Link) => void;

	$config: DatastoreConfig;
	$initItem: ((item: Partial<DatastoreItem> | Partial<TreeDatastoreItem>) => DatastoreItem | TreeDatastoreItem) | null | undefined;
	// Sees each item that parse, add or update stores, also inside silent(): after all before-event
	// listeners, which can still change the item, and before the after-events and the filter pass
	$onItemWrite?: ((item: DatastoreItem) => void) | null;

	_deferFilter: number;
	_filterInProgress: boolean;
	_filterRule: unknown;
	_ganttConfig?: any;
	_pendingFilter: boolean;
	_getItemsCache: DatastoreItem[] | null;
	_indexRangeCache: Record<string, DatastoreItem[]>;
	_mark_recompute?: boolean;
	_quick_refresh?: boolean;
	_searchVisibleOrder: Record<Id, number>;
	_skip_refresh: boolean | null;
	_skipTaskRecalculation?: boolean | "lightbox";

}

class DatastoreInternal {

	constructor(config: DatastoreConfig){
		this.pull = {};
		this.$initItem = config.initItem;
		this.visibleOrder = powerArray.$create<Id>();
		this.fullOrder = powerArray.$create<Id>();
		this._skip_refresh = false;
		// GS-3602. Rebuilding the visible order is a pass over every item in the store, so a
		// change that affects one item must not trigger one per item. See `_requestFilter`.
		this._deferFilter = 0;
		this._pendingFilter = false;
		this._filterInProgress = false;
		this._filterRule = null;
		this._searchVisibleOrder = {};
		this._indexRangeCache = {};
		this._getItemsCache = null;
		this.$config = config;
		eventable(this);

		this._attachDataChange(function(){
			this._indexRangeCache = {};
			this._getItemsCache = null;
			return true;
		});
	}

	_attachDataChange(callback: DataChangeCallback): void{
		this.attachEvent("onClearAll", callback);
		this.attachEvent("onBeforeParse", callback);
		this.attachEvent("onBeforeUpdate", callback);
		this.attachEvent("onBeforeDelete", callback);
		this.attachEvent("onBeforeAdd", callback);
		this.attachEvent("onParse", callback);
		this.attachEvent("onBeforeFilter", callback);
	}

	_parseInner(data: Partial<DatastoreItem>[]): DatastoreItem[] | TreeDatastoreItem[]{
		let item: Partial<DatastoreItem> | null = null;
		const loaded: DatastoreItem[] = [];
		for(let i = 0, len = data.length; i< len; i++){
			item = data[i];
			if(this.$initItem){
				if(this.$config.copyOnParse && this.$config.copyOnParse()){
					item = utils.copy(item);
				}
				item = this.$initItem(item);
			}
			// add ID if the parsed item doesn't have it
			if (!utils.defined(item.id)){
				item.id = utils.uid();
			}
			
			if(this.callEvent("onItemLoading", [item])){
				if (!this.pull.hasOwnProperty(item.id)) {
					this.fullOrder.push(item.id);
				}
				loaded.push(item as DatastoreItem);
				this.pull[item.id] = item;
				if (this.$onItemWrite) this.$onItemWrite(item as DatastoreItem);
			}
		}
		return loaded;
	}

	parse(data: DatastoreItem[]): void{
		if (!this.isSilent()) {
			this.callEvent("onBeforeParse", [data]);
		}
		const loaded = this._parseInner(data);
		if (!this.isSilent()) {
			this.refresh();
			this.callEvent("onParse", [loaded]);
		}
	}

	getItem(id: Id): DatastoreItem | TreeDatastoreItem | undefined{
		return this.pull[id];
	}

	_updateOrder(code: OrderCallback): void{
		code.call(this.visibleOrder);
		code.call(this.fullOrder);
	}

	// GS-3602. Recomputing the visible order costs a pass over every item in the store: it
	// re-evaluates `onFilterItem` for each of them and rebuilds `visibleOrder` and its index.
	// A single-item add or remove asks for that recomputation, which is why 300 changes on a
	// 100 000-task chart used to cost 300 full passes.
	//
	// While a recomputation is deferred - `batchUpdate` defers it for the duration of its
	// callback, the same way it already defers `resetProjectDates` - the request is recorded
	// instead of run, and it happens exactly once: when something reads the visible order
	// (`_ensureFilter`, called by every reader below) or when the deferral is released.
	// Nothing observes a stale order, and the events the pass fires are dispatched once for
	// the whole batch rather than once per change.
	_requestFilter(): void{
		if(this._deferFilter > 0){
			this._pendingFilter = true;
			return;
		}
		this.filter();
	}

	_ensureFilter(): void{
		// A filter pass reads the store through its own handlers, so a reader reached from
		// inside one must not start a second pass - it sees the same order it would have seen
		// before this change, the one the running pass is about to replace.
		if(this._pendingFilter && !this._filterInProgress){
			this.filter();
		}
	}

	beginDeferFilter(): void{
		this._deferFilter++;
	}

	endDeferFilter(): void{
		if(this._deferFilter > 0){
			this._deferFilter--;
		}
		if(this._deferFilter === 0){
			this._flushDeferredFilter();
		}
	}

	// Overridden in TreeDataStore, whose item order is derived from the branch tree and has
	// to be re-derived together with the visible order.
	_flushDeferredFilter(): void{
		this._ensureFilter();
	}

	updateItem(id: Id, item?: DatastoreItem): false | void{
		if (!utils.defined(item)) item = this.getItem(id);
		if (!item) return;

		// GS-3535. The events report the `id` argument rather than `item.id`: updateItem also
		// accepts a partial object - `store.updateItem(id, {prop: value})` - which carries no id
		// of its own, and such an update used to be announced as `undefined`. `id` is the key the
		// update is applied to below, so it is the correct one in every form of the call
		if (!this.isSilent()) {
			if (this.callEvent("onBeforeUpdate", [id, item]) === false) return false;
		}
		// This is how it worked before updating the properties:
		// this.pull[id]=item;
		utils.mixin(this.pull[id],item, true);
		if (this.$onItemWrite) this.$onItemWrite(this.pull[id]);
		if (!this.isSilent()) {
			this.callEvent("onAfterUpdate", [id, item]);
			this.callEvent("onStoreUpdated", [id, item, "update"]);
		}
	}

	_removeItemInner(id: Id): void{
		//clear from collections
		//this.visibleOrder.$remove(id);
		this._updateOrder(function(){ this.$remove(id);});
		delete this.pull[id];
	}

	removeItem(id: Id): false | void{
		//utils.assert(this.exists(id), "Not existing ID in remove command"+id);

		const obj = this.getItem(id);	//save for later event
		if (!obj) return;
		if (!this.isSilent()) {
			if (this.callEvent("onBeforeDelete", [obj.id, obj]) === false) return false;
		}

		this.callEvent("onAfterDeleteConfirmed", [obj.id, obj]);
		this._removeItemInner(id);
		
		if (this.isSilent()) {
			this.callEvent("onAfterSilentDelete", [obj.id, obj]);
		}

		if (!this.isSilent()) {
			this._requestFilter();
			this.callEvent("onAfterDelete", [obj.id, obj]);
			//repaint signal
			this.callEvent("onStoreUpdated", [obj.id, obj, "delete"]);
		}
	}

	_addItemInner(item: DatastoreItem, index?: number): void{
		//in case of treetable order is sent as 3rd parameter
		//let order = index;

		if(this.exists(item.id)){
			this.silent(function(){this.updateItem(item.id, item);});
		}else{
			const order = this.visibleOrder;

			//by default item is added to the end of the list
			const data_size = order.length;

			if (!utils.defined(index) || index! < 0)
				index = data_size;
			//check to prevent too big indexes
			if (index! > data_size){
				//dhx.log("Warning","DataStore:add","Index of out of bounds");
				index = Math.min(order.length,index!);
			}
		}


		//gantt.assert(!this.exists(id), "Not unique ID");

		this.pull[item.id]=item;
		this._updateOrder(function(){
			if(this.$find(item.id) === -1)
				this.$insertAt(item.id,index);
		});
		this._requestFilter();
		//order.$insertAt(item.id,index);
	}


	isVisible(id: Id): boolean{
		this._ensureFilter();
		return this.visibleOrder.$find(id) > -1;
	}

	getVisibleItems(): DatastoreItem[]{
		return this.getIndexRange();
	}

	addItem(item: Partial<DatastoreItem>, index?: number): Id | false{
		if (!utils.defined(item.id))
			item.id = utils.uid();

		let initializedItem = item as DatastoreItem | TreeDatastoreItem;
		if(this.$initItem){
			initializedItem = this.$initItem(initializedItem);
		}

		if (!this.isSilent()){
			if (this.callEvent("onBeforeAdd", [initializedItem.id, initializedItem]) === false) return false;
		}

		if (this.$onItemWrite) this.$onItemWrite(initializedItem);
		this._addItemInner(initializedItem, index);

		if (!this.isSilent()){
			this.callEvent("onAfterAdd",[initializedItem.id, initializedItem]);
			//repaint signal
			this.callEvent("onStoreUpdated",[initializedItem.id,initializedItem,"add"]);
		} else {
			if(this.sync_link){
				this.sync_link(initializedItem as Link);
			}
		}
		return initializedItem.id;
	}

	_changeIdInner(oldId: Id, newId: Id): void{
		if(this.pull[oldId])
			this.pull[newId] = this.pull[oldId];

		const visibleOrder = this._searchVisibleOrder[oldId];
		this.pull[newId].id = newId;
		this._updateOrder(function(){
			this[this.$find(oldId)] = newId;
		});
		this._searchVisibleOrder[newId] = visibleOrder;
		delete this._searchVisibleOrder[oldId];

		//this.visibleOrder[this.visibleOrder.$find(oldId)]=newId;
		delete this.pull[oldId];
	}

	changeId(oldId: Id, newId: Id): void{
		this._changeIdInner(oldId, newId);

		this.callEvent("onIdChange", [oldId, newId]);

	}

	exists(id?: Id): boolean{
		return !!(this.pull[String(id)]);
	}

	_moveInner(sindex: number, tindex: number): void{
		const id = this.getIdByIndex(sindex);
		if(!utils.defined(id)) return;

		this._updateOrder(function(){
			this.$removeAt(sindex);
			this.$insertAt(id!,Math.min(this.length, tindex));
		});
		//this.visibleOrder.$removeAt(sindex);	//remove at old position
		//if (sindex<tindex) tindex--;	//correct shift, caused by element removing
		//this.visibleOrder.$insertAt(id,Math.min(this.visibleOrder.length, tindex));	//insert at new position
	}

	move(sindex: number, tindex: number): void{
		//gantt.assert(sindex>=0 && tindex>=0, "DataStore::move","Incorrect indexes");

		const id = this.getIdByIndex(sindex);
		if(!utils.defined(id)) return;
		const obj = this.getItem(id!);
		if(!obj) return;
		this._moveInner(sindex, tindex);

		if (!this.isSilent()) {
			//repaint signal
			this.callEvent("onStoreUpdated", [obj.id, obj, "move"]);
		}
	}

	clearAll(): void{
		if(this.$destroyed){
			return;
		}
		// GS-956 We need to unselect the resource as its ID is cached
		this.silent(function(){
			if(this.unselect){
				this.unselect();
			}
		});
		this.pull = {};
		this.visibleOrder = powerArray.$create<Id>();
		this.fullOrder = powerArray.$create<Id>();
		this._searchVisibleOrder = {};
		this._getItemsCache = null;
		if (this.isSilent()) return;
		this.callEvent("onClearAll",[]);
		this.refresh();
	}

	silent(code: (this: DatastoreInternal) => void, master?: any): void{
		let alreadySilent = false;
		if(this.isSilent()) {
			alreadySilent = true;
		}
		this._skip_refresh = true;
		code.call(master||this);
		
		if (!alreadySilent) {
			this._skip_refresh = false;
		}
	}

	isSilent(): boolean{
		return !!this._skip_refresh;
	}

	arraysEqual(arr1: unknown[], arr2: unknown[]): boolean {
		if(arr1.length !== arr2.length)
			return false;
		for(let i = 0; i < arr1.length; i++) {
			if(arr1[i] !== arr2[i])
				return false;
		}

		return true;
	}

	refresh(id?: Id, quick?: boolean): void{
		if(this.$destroyed){
			return;
		}
		if (this.isSilent()) return;

		// GS-3602. A deferred filter pass is outstanding: this refresh has to recompute the
		// order rather than take the quick path, which would repaint against a stale one.
		if(this._pendingFilter){
			this._mark_recompute = true;
		}

		let item: DatastoreItem | undefined;
		if(id){
			item = this.getItem(id);
		}

		let args: StoreUpdateArgs;
		if (id){
			args = [id, item, "paint"];
		}else{
			args = [null,null,null];
		}

		if(this.callEvent("onBeforeStoreUpdate", args) === false){
			return;
		}

		const skipFilter = this._quick_refresh && !this._mark_recompute;
		this._mark_recompute = false;
		if(id){
			// if item changes visible order (e.g. expand-collapse branch) - do a complete repaint
			if(!quick && !skipFilter){
				const oldOrder = this.visibleOrder;
				this.filter();
				if(!this.arraysEqual(oldOrder, this.visibleOrder)){
					id = undefined;
				}
			}

		}else if(!skipFilter){
			this.filter();
		}

		if (id){
			args = [id, item, "paint"];
		}else{
			args = [null,null,null];
		}

		this.callEvent("onStoreUpdated",args);
	}

	count(): number{
		return this.fullOrder.length;
	}

	countVisible(): number{
		this._ensureFilter();
		return this.visibleOrder.length;
	}

	sort(_sort?: any): void{}

	serialize(): void{}

	eachItem(code: (this: DatastoreInternal, item: DatastoreItem | undefined) => void): void{
		for (let i=0; i<this.fullOrder.length; i++) {
			const item = this.getItem(this.fullOrder[i]);
			code.call(this, item);
		}
	}

	find(filter: (item: DatastoreItem | undefined) => boolean): Array<DatastoreItem | undefined> {
		const result: Array<DatastoreItem | undefined> = [];
		this.eachItem(function(item) {
			if(filter(item)){
				result.push(item);
			}
		});
		return result;
	}

	filter(rule?: any): void{
		this._pendingFilter = false;
		this._filterInProgress = true;
		let completed = false;
		try{
			this._filterInner(rule);
			completed = true;
		}finally{
			this._filterInProgress = false;
			if(!completed){
				// GS-3602. The pass threw from one of its own handlers, so `visibleOrder` and the
				// index built from it are whatever the aborted pass left behind - and the pass is
				// still owed. Re-arming it makes the next reader run it rather than trust that
				// state; without this, a handler that throws once leaves the store answering from
				// a stale index for good. Cleared at the top rather than here, so that a filter
				// requested *during* the pass still survives it.
				this._pendingFilter = true;
			}
		}
	}

	_filterInner(_rule?: any): void{
		if (!this.isSilent()) {
			this.callEvent("onBeforeFilter", []);
		}
		this.callEvent("onPreFilter", []);
		const filteredOrder = powerArray.$create<Id>();
		const placeholderIds: Id[] = [];
		// GS-3602. Hoisted out of the per-item `isPlaceholderTask` check. Answered once on
		// purpose: an `onFilterItem` handler can change `gantt.config`, and switching mid-walk
		// would classify only part of the items as placeholders.
		const config = this._ganttConfig;
		const mayHavePlaceholder = !!(config && config.placeholder_task);
		this.eachItem(function(item){
			if(!item) return;
			if(this.callEvent("onFilterItem", [item.id, item])){
				if(mayHavePlaceholder && isPlaceholderTask(item.id, null, this as unknown as TreeDatastoreInternal, config)){
					placeholderIds.push(item.id);
				} else {
					filteredOrder.push(item.id);
				}
			}
		});

		for(let i = 0; i < placeholderIds.length; i++){
			filteredOrder.push(placeholderIds[i]);
		}

		this.visibleOrder = filteredOrder;
		this._searchVisibleOrder = {};
		for(let i = 0; i < this.visibleOrder.length; i++){
			this._searchVisibleOrder[this.visibleOrder[i]] = i;
		}
		if (!this.isSilent()) {
			this.callEvent("onFilter", []);
		}
	}

	getIndexRange(from?: number, to?: number): DatastoreItem[]{
		this._ensureFilter();
		const max = Math.min((to||Infinity),this.countVisible()-1);
		const min = from||0;

		const cacheKey = min + '-' + max;
		if(this._indexRangeCache[cacheKey]){
			return this._indexRangeCache[cacheKey].slice();
		}

		const ret: DatastoreItem[] = [];
		for (let i=min; i <= max; i++){
			const item = this.getItem(this.visibleOrder[i]);
			if(item){
				ret.push(item);
			}
		}

		this._indexRangeCache[cacheKey] = ret.slice();
		return ret;
	}

	getItems(): DatastoreItem[]{
		if(this._getItemsCache){
			return this._getItemsCache.slice();
		}

		const res: DatastoreItem[] = [];
		for(const i in this.pull){
			res.push(this.pull[i]);
		}
		this._getItemsCache = res.slice();

		return res;
	}

	getIdByIndex(index: number): Id | undefined{
		this._ensureFilter();
		return this.visibleOrder[index];
	}

	getIndexById(id: Id): number{
		this._ensureFilter();
		let res = this._searchVisibleOrder[id];
		if(res === undefined){
			res = -1;
		}
		return res;
	}

	_getNullIfUndefined<T>(value: T | undefined): T | null{
		if(value === undefined){
			return null;
		}else{
			return value;
		}
	}

	getFirst(): Id | null{
		this._ensureFilter();
		return this._getNullIfUndefined(this.visibleOrder[0]);
	}

	getLast(): Id | null{
		this._ensureFilter();
		return this._getNullIfUndefined(this.visibleOrder[this.visibleOrder.length-1]);
	}

	getNext(id: Id): Id | null{
		return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(id) + 1]);
	}

	getPrev(id: Id): Id | null{
		return this._getNullIfUndefined(this.visibleOrder[this.getIndexById(id) - 1]);
	}

	destructor(): void{
		this.callEvent("onDestroy", []);
		this.detachAllEvents();
		this.$destroyed = true;
		this.pull = null as any;
		this.$initItem = null;
		this.$onItemWrite = null;
		this.visibleOrder = null as any;
		this.fullOrder = null as any;
		this._skip_refresh = null;
		this._filterRule = null;
		this._searchVisibleOrder = null as any;
		this._indexRangeCache = {};
		this._getItemsCache = null;
	}
}

export default DatastoreInternal;
