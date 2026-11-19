import * as utils from "../../utils/utils";
import createTasksFacade from "./datastore_tasks";
import createLinksFacade from "./datastore_links";
import DataStore from "../datastore/datastore";
import TreeDataStore from "../datastore/treedatastore";
import createDatastoreSelect from "../datastore/select";
import datastoreRender from "../datastore/datastore_render";
import isHeadless from "../../utils/is_headless";
import {replaceValidZeroId} from "../../utils/helpers";
import { getOwnItemId } from "../datastore/own_item_id";

function getDatastores(){
	var storeNames = this.$services.getService("datastores");
	var res = [];
	for(var i = 0; i < storeNames.length; i++){
		var store = this.getDatastore(storeNames[i]);
		if(!store.$destroyed){
			res.push(store);
		}
	}
	return res;
}

var createDatastoreFacade = function(){
	return {
	createDatastore: function(config){

		var $StoreType = (config.type || "").toLowerCase() == "treedatastore" ? TreeDataStore : DataStore;

		if (config) {
			var self = this;
			config.openInitially = function(){ return self.config.open_tree_initially; };
			config.copyOnParse = function(){ return self.config.deepcopy_on_parse; };
		}

		var store = new $StoreType(config);
		this.mixin(store, createDatastoreSelect(store));

		if (config.name) {
			var servicePrefix = "datastore:";
			var storeAccessName = servicePrefix + config.name;

			store.attachEvent("onDestroy", function(){
				this.$services.dropService(storeAccessName);
				var storeList = this.$services.getService("datastores");
				for(var i = 0; i < storeList.length; i++){
					if(storeList[i] === config.name){
						storeList.splice(i, 1);
						break;
					}
				}
			}.bind(this));

			this.$services.dropService(storeAccessName);
			this.$services.setService(storeAccessName, function() { return store; } );

			var storeList = this.$services.getService("datastores");
			if (!storeList) {
				storeList = [];
				this.$services.setService("datastores", function() { return storeList; });
				storeList.push(config.name);
			} else if (storeList.indexOf(config.name) < 0) {
				storeList.push(config.name);
			}

			datastoreRender.bindDataStore(config.name, this);

		}

		return store;
	},
	getDatastore: function(name){
		return this.$services.getService("datastore:" + name);
	},
	_getDatastores: getDatastores,

	refreshData: function () {
		var scrollState;
		if(!isHeadless(this)){
			scrollState = this.getScrollState();
		}

		this.callEvent("onBeforeDataRender", []);

		var stores = getDatastores.call(this);
		for(var i = 0; i < stores.length; i++){
			stores[i].refresh();
		}

		if(this.config.preserve_scroll && !isHeadless(this)){
			if(scrollState.x || scrollState.y){
				this.scrollTo(scrollState.x, scrollState.y);
			}
			// GS-2866: need to restore the scroll position after resizing the resource view
			// in case if it was increased
			const scrollbarsInfo = this.$layout.getScrollbarsInfo();
			scrollbarsInfo.forEach((scroll_info) => {
				const scroll = this.$ui.getView(scroll_info.id);
				if(!scroll) return;
				const scrollbarNodeVisible = this.utils.dom.isChildOf(scroll.$view, this.$container);
				scroll_info.boundViews.forEach((viewName) => {
					const view = this.$ui.getView(viewName);
					if(scroll_info.y){
						if(view && !scrollbarNodeVisible){
							view.scrollTo(undefined, 0);
						}
					}
				});
			});
		}
		this.callEvent("onDataRender", []);

	},

	isChildOf: function(childId, parentId){
		return this.$data.tasksStore.isChildOf(childId, parentId);
	},

	refreshTask: function (taskId, refresh_links) {
		var task = this.getTask(taskId);
		var self = this;
		function refreshLinks(){
			if (refresh_links !== undefined && !refresh_links)
				return;
			for (var i = 0; i < task.$source.length; i++) {
				self.refreshLink(task.$source[i]);
			}
			for (var i = 0; i < task.$target.length; i++) {
				self.refreshLink(task.$target[i]);
			}
		}

		if (task && this.isTaskVisible(taskId)) {
			this.$data.tasksStore.refresh(taskId, !!this.getState("tasksDnd").drag_id || refresh_links === false);// do quick refresh during drag and drop
			refreshLinks();
		}else if(this.isTaskExists(taskId) && this.isTaskExists(this.getParent(taskId)) && !this._bulk_dnd){
			this.refreshTask(this.getParent(taskId));

			var hasSplitParent = false;
			this.eachParent(function(parent){
				if(hasSplitParent || this.isSplitTask(parent)){
					hasSplitParent = true;
				}
			}, taskId);
			if(hasSplitParent){
				refreshLinks();
			}
		}

	},
	refreshLink: function (linkId) {
		this.$data.linksStore.refresh(linkId, !!this.getState("tasksDnd").drag_id);// do quick refresh during drag and drop
	},

	silent: function(code){
		var gantt = this;
		gantt.$data.tasksStore.silent(function(){
			gantt.$data.linksStore.silent(function(){
				code();
			});
		});
	},

	clearAll: function () {
		var stores = getDatastores.call(this);
		
		// clear all stores without invoking clearAll event
		// in order to prevent calling handlers when only some stores are cleared
		for(var i = 0; i < stores.length; i++){
			stores[i].silent(function(){
				stores[i].clearAll();	
			});
		}
		// run clearAll again to invoke events
		for(var i = 0; i < stores.length; i++){
			stores[i].clearAll();	
		}

		this._update_flags();
		this.date._isoDateOnly = false;
		this.date._nonIsoStringDetected = false;
		this.userdata = {};
		this.callEvent("onClear", []);
		this.render();
	},
	_clear_data: function () {
		this.$data.tasksStore.clearAll();
		this.$data.linksStore.clearAll();
		this._update_flags();
		this.userdata = {};
	},

	selectTask: function(id){
		var store = this.$data.tasksStore;
		if(!this.config.select_task)
			return false;
		id = replaceValidZeroId(id, this.config.root_id);
		if (id){
			// GS-3658. The caller can give the id 12 as "12"; store the own id so that
			// getSelectedId() matches the ids from the UI
			id = getOwnItemId(store, id);
			let oldSelectId = this.getSelectedId();
			// Don't repaint the resource panel as the data didn't change
			store._skipResourceRepaint = true;
			store.select(id);
			store._skipResourceRepaint = false;
			// GS-730. Split task is not included in the tree, 
			// so the datastore renderer will think that the task is not visible
			if (oldSelectId && store.pull[oldSelectId].$split_subtask && oldSelectId != id) {
				this.refreshTask(oldSelectId);
			}
			if (store.pull[id].$split_subtask && oldSelectId != id) {// GS-1850. Do not repaint split task after double click
				this.refreshTask(id);
			}
		}
		return store.getSelectedId();
	},
	unselectTask: function(id){
		var store = this.$data.tasksStore;
		if (id) {
			// GS-3658. The own id, so that the unselect event gets the same id as the select events
			id = getOwnItemId(store, id);
		}
		store.unselect(id);
		// GS-730. Split task is not included in the tree, 
		// so the datastore renderer will think that the task is not visible
		if (id && store.pull[id].$split_subtask) {
			this.refreshTask(id);
		}
	},
	isSelectedTask: function(id){
		return this.$data.tasksStore.isSelected(id);
	},
	getSelectedId: function() {
		return this.$data.tasksStore.getSelectedId();
	}
};
};

function createFacade(){
	var res = utils.mixin({}, createDatastoreFacade());
	utils.mixin(res, createTasksFacade());
	utils.mixin(res, createLinksFacade());
	return res;
}




export default {create: createFacade};