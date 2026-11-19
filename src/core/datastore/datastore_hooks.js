import * as utils from "../../utils/utils";
import facadeFactory from "./../facades/datastore";
import calculateScaleRange from "../gantt_data_range";
import isPlaceholderTask from "../../utils/placeholder_task";

import treeHelper from "../../utils/task_tree_helpers";

function initDataStores(gantt){

	var facade = facadeFactory.create();
	utils.mixin(gantt, facade);
	var tasksStore = gantt.createDatastore({
		name: "task",
		type: "treeDatastore",
		rootId: function() { return gantt.config.root_id; },
		initItem: utils.bind(_init_task, gantt),
		getConfig: function() { return gantt.config; }
	});

	var linksStore = gantt.createDatastore({
		name: "link",
		initItem: utils.bind(_init_link, gantt)
	});

	gantt.attachEvent("onDestroy", function(){
		tasksStore.destructor();
		linksStore.destructor();
	});

	gantt.attachEvent("onLinkValidation", function(link){
		if(gantt.isLinkExists(link.id) || link.id === "predecessor_generated"){
			// link was already added into gantt
			return true;
		}
		var source = gantt.getTask(link.source);
		var taskLinks = source.$source;
		for (var i = 0; i < taskLinks.length; i++) {
			var existingLink = gantt.getLink(taskLinks[i]);

			var sourceMatch = link.source == existingLink.source;
			var targetMatch = link.target == existingLink.target;
			var typeMatch = link.type == existingLink.type;

			// prevent creating duplicated links from the UI
			if (sourceMatch && targetMatch && typeMatch) {
				return false;
			}
		}

		return true;
	});

	tasksStore.attachEvent("onBeforeRefreshAll", function(){

		// GS-2170 do not recalculate indexes and dates as the event will be called later in the onStoreUpdate event
		if (tasksStore._skipTaskRecalculation){
			return;
		}

		var order = tasksStore.getVisibleItems();

		for(var i=0; i < order.length; i++){
			var item = order[i];
			item.$index = i;
			item.$local_index = gantt.getTaskIndex(item.id);
			gantt.resetProjectDates(item);
		}

	});

	tasksStore.attachEvent("onFilterItem", function(id, task) {
		if (gantt.config.show_tasks_outside_timescale) {
			return true;
		}
		let min = null, max = null;
		if (gantt.config.start_date && gantt.config.end_date) {
			if (gantt._isAllowedUnscheduledTask(task)) return true;
			min = gantt.config.start_date.valueOf();
			max = gantt.config.end_date.valueOf();

			if ((task.start_date && +task.start_date > max) || (task.end_date && +task.end_date < +min))
				return false;
		}
		return true;
	});

	tasksStore.attachEvent("onIdChange", function(oldId, newId){
		gantt._update_flags(oldId, newId);

		var changedTask = gantt.getTask(newId);
		if(!tasksStore.isSilent()){
			if(changedTask.$split_subtask || changedTask.rollup){
				gantt.eachParent(function(parent){
					gantt.refreshTask(parent.id);
				}, newId);
			}
		}
	});

	tasksStore.attachEvent("onAfterUpdate", function(id){
		gantt._update_parents(id);
		if(gantt.getState("batchUpdate").batch_update){
			return true;
		}

		var task = tasksStore.getItem(id);
		if (!task.$source) task.$source = [];
		for (var i = 0; i < task.$source.length; i++) {
			linksStore.refresh(task.$source[i]);
		}
		if (!task.$target) task.$target = [];
		for (var i = 0; i < task.$target.length; i++) {
			linksStore.refresh(task.$target[i]);
		}
	});

	tasksStore.attachEvent("onBeforeItemMove", function(sid, parent, tindex){
		// GS-125. Don't allow users to move the placeholder task
		if (isPlaceholderTask(sid, gantt, tasksStore)){
			//eslint-disable-next-line
			console.log("The placeholder task cannot be moved to another position.");
			return false;
		}

		return true;
	});

	// The position of a moved task for the data processor, which sends it as `target` with the next
	// save of the task.
	function setDropTarget(store, sid){
		var source = gantt.getTask(sid);

		if(store.getNextSibling(sid) !== null){
			source.$drop_target = store.getNextSibling(sid);
		} else if(store.getPrevSibling(sid) !== null){
			source.$drop_target = "next:" + store.getPrevSibling(sid);
		}else{
			source.$drop_target = "next:null";
		}
	}

	tasksStore.attachEvent("onAfterItemMove", function(sid, parent, tindex){
		setDropTarget(this, sid);
	});

	// A silent move gives a task no position for the data processor. A task that already has one -
	// a `$drop_target` that waits for the next save, or the `target` of an earlier reorder, which
	// the data processor sends with every later save - gets the position of its new place, as after
	// a move outside silent(). The old position no longer describes where the task is, and only the
	// task's own move can tell whether it still applies.
	tasksStore.attachEvent("onAfterSilentMove", function(sid){
		var task = gantt.getTask(sid);
		var target = task.target;
		if(task.$drop_target || (target !== undefined && target !== null && target !== "")){
			setDropTarget(this, sid);
		}
	});

	tasksStore.attachEvent("onStoreUpdated", function(id, item, action){
		if(action == "delete"){
			gantt._update_flags(id, null);
		}

		var state = gantt.$services.getService("state");
		if(state.getState("batchUpdate").batch_update){
			return;
		}

		if(gantt.config.fit_tasks && action !== "paint"){
			var oldState = gantt.getState();
			calculateScaleRange(gantt);
			var newState = gantt.getState();

			//this._init_tasks_range();
			if (+oldState.min_date != +newState.min_date || +oldState.max_date != +newState.max_date) {
				gantt.render();

				gantt.callEvent("onScaleAdjusted", []);
				return true;
			}

		}

		if(action == "add" || action == "move" || action == "delete"){
			if(gantt.$layout){
				// GS-2170. Do not recalculate the indexes and dates of other tasks in the
				// onBeforeResize layout event, but do it later. If lightbox is opened, it will
				// trigger the refreshData, so the indexes and dates will be recalculated there
				if (this.$config.name == "task" && (action == "add" || action == "delete")){
					if (this._skipTaskRecalculation != "lightbox"){
						this._skipTaskRecalculation = true;
					}
				}
				gantt.$layout.resize();
			}

		}else if(!id){
			linksStore.refresh();
		}

	});

	linksStore.attachEvent("onAfterAdd", function(id, link){
		linksStore.sync_link(link);
	});
	linksStore.attachEvent("onAfterUpdate", function(id, link){
		sync_links();
	});
	linksStore.attachEvent("onAfterDelete", function(id, link){
		sync_link_delete(link);
	});
	linksStore.attachEvent("onAfterSilentDelete", function(id, link){
		sync_link_delete(link);
	});
	linksStore.attachEvent("onBeforeIdChange", function(oldId, newId){
		sync_link_delete(gantt.mixin({id:oldId}, gantt.$data.linksStore.getItem(newId)));
		linksStore.sync_link(gantt.$data.linksStore.getItem(newId));
	});

	function checkLinkedTaskVisibility(taskId){
		var isVisible = gantt.isTaskVisible(taskId);
		if(!isVisible && gantt.isTaskExists(taskId)){
			var parent = gantt.getParent(taskId);
			if(gantt.isTaskExists(parent) && gantt.isTaskVisible(parent)){
				parent = gantt.getTask(parent);
				if(gantt.isSplitTask(parent)){
					isVisible = true;
				}
			}
		}
		return isVisible;
	}

	linksStore.attachEvent("onFilterItem", function(id, link){
		if (!gantt.config.show_links) {
			return false;
		}

		var sourceVisible = checkLinkedTaskVisibility(link.source);
		var targetVisible = checkLinkedTaskVisibility(link.target);

		if (!(sourceVisible && targetVisible) ||
			gantt._isAllowedUnscheduledTask(gantt.getTask(link.source)) || gantt._isAllowedUnscheduledTask(gantt.getTask(link.target)))
			return false;

		return gantt.callEvent("onBeforeLinkDisplay", [id, link]);
	});


	(function(){
		// delete all connected links after task is deleted
		var deletedLinks = {};

		gantt.attachEvent("onBeforeTaskDelete", function(id, item){
			deletedLinks[id] = treeHelper.getSubtreeLinks(gantt, id);
			return true;
		});

		gantt.attachEvent("onAfterTaskDelete", function(id, item) {
			if(deletedLinks[id]){
				gantt.$data.linksStore.silent(function(){
					for(var i in deletedLinks[id]){
						if (gantt.isLinkExists(i)){
							gantt.$data.linksStore.removeItem(i);
						}
						sync_link_delete(deletedLinks[id][i]);
					}

					deletedLinks[id] = null;
				});
			}
		});
	})();

	gantt.attachEvent("onAfterLinkDelete", function(id, link) {
		// GS-1786. Repaint tasks only if they are loaded
		if(gantt.isTaskExists(link.source)){
			gantt.refreshTask(link.source);
		}
		if(gantt.isTaskExists(link.target)){
			gantt.refreshTask(link.target);
		}
	});

	gantt.attachEvent("onParse", sync_links);

	mapEvents({
		source: linksStore,
		target: gantt,
		events:{
			"onItemLoading":"onLinkLoading",
			"onBeforeAdd":"onBeforeLinkAdd",
			"onAfterAdd":"onAfterLinkAdd",
			"onBeforeUpdate":"onBeforeLinkUpdate",
			"onAfterUpdate":"onAfterLinkUpdate",
			"onBeforeDelete":"onBeforeLinkDelete",
			"onAfterDelete":"onAfterLinkDelete",
			"onIdChange":"onLinkIdChange"
		}
	});

	mapEvents({
		source: tasksStore,
		target: gantt,
		events:{
			"onItemLoading":"onTaskLoading",
			"onBeforeAdd":"onBeforeTaskAdd",
			"onAfterAdd":"onAfterTaskAdd",
			"onBeforeUpdate":"onBeforeTaskUpdate",
			"onAfterUpdate":"onAfterTaskUpdate",
			"onBeforeDelete":"onBeforeTaskDelete",
			"onAfterDelete":"onAfterTaskDelete",
			"onIdChange":"onTaskIdChange",
			"onBeforeItemMove":"onBeforeTaskMove",
			"onAfterItemMove":"onAfterTaskMove",
			"onFilterItem":"onBeforeTaskDisplay",
			"onItemOpen":"onTaskOpened",
			"onItemClose":"onTaskClosed",
			"onBeforeSelect":"onBeforeTaskSelected",
			"onAfterSelect":"onTaskSelected",
			"onAfterUnselect":"onTaskUnselected"
		}
	});

	gantt.$data = {
		tasksStore: tasksStore,
		linksStore: linksStore
	};

	linksStore.sync_link = function(link) {
		if(gantt.isTaskExists(link.source)){
			var sourceTask = gantt.getTask(link.source);
			sourceTask.$source = sourceTask.$source || [];
			if (noDuplicateIds(link.id, sourceTask.$source)){
				sourceTask.$source.push(link.id);
			}
		}
		if(gantt.isTaskExists(link.target)){
			var targetTask = gantt.getTask(link.target);
			targetTask.$target = targetTask.$target || [];
			if (noDuplicateIds(link.id, targetTask.$target)){
				targetTask.$target.push(link.id);
			}
		}
	};
	// GS-2085. Don't add duplicate link IDs
	function noDuplicateIds(id, array){
		return array.indexOf(String(id)) === -1 && array.indexOf(Number(id)) === -1;
	}

	function sync_link_delete(link){
		if(gantt.isTaskExists(link.source)){
			var sourceTask = gantt.getTask(link.source);
			for(var i = 0; i < sourceTask.$source.length; i++){
				if(sourceTask.$source[i] == link.id){
					sourceTask.$source.splice(i, 1);
					break;
				}
			}
		}
		if(gantt.isTaskExists(link.target)){
			var targetTask = gantt.getTask(link.target);
			for(var i = 0; i < targetTask.$target.length; i++){
				if(targetTask.$target[i] == link.id){
					targetTask.$target.splice(i, 1);
					break;
				}
			}
		}
	}

	function sync_links() {
		var task = null;
		var tasks = gantt.$data.tasksStore.getItems();

		for(var i = 0, len = tasks.length; i < len; i++){
			task = tasks[i];
			task.$source = [];
			task.$target = [];
		}

		var links = gantt.$data.linksStore.getItems();
		for (var i = 0, len = links.length; i < len; i++) {

			var link = links[i];
			linksStore.sync_link(link);
		}
	}

	function mapEvents(conf){
		var mapFrom = conf.source;
		var mapTo = conf.target;
		for(var i in conf.events){
			(function(sourceEvent, targetEvent){
				mapFrom.attachEvent(sourceEvent, function(){
					// GS-3602. Cheaper than `Array.prototype.slice.call(arguments)`, and the
					// `onFilterItem` -> `onBeforeTaskDisplay` mapping runs this per task on
					// every filter pass.
					var args = new Array(arguments.length);
					for(var i = 0; i < args.length; i++){
						args[i] = arguments[i];
					}
					return mapTo.callEvent(targetEvent, args);
				}, targetEvent);
			})(i, conf.events[i]);
		}
	}

	function _init_task(task) {
		if (!this.defined(task.id))
			task.id = this.uid();

		if (task.start_date)
			task.start_date = gantt.date.parseDate(task.start_date, "parse_date");
		if (task.end_date)
			task.end_date = gantt.date.parseDate(task.end_date, "parse_date");


		var duration = null;
		if (task.duration || task.duration === 0) {
			task.duration = duration = task.duration * 1;
		}

		if (duration) {
			if (task.start_date && !task.end_date) {
				task.end_date = this.calculateEndDate(task);
			} else if (!task.start_date && task.end_date) {
				task.start_date = this.calculateEndDate({
					start_date: task.end_date,
					duration: -task.duration,
					task: task
				});
			}
			//task.$calculate_duration = false;
		}

		if (gantt.config.deadlines !== false && task.deadline){
			task.deadline = gantt.date.parseDate(task.deadline, "parse_date");
		}

		task.progress = Number(task.progress) || 0;

		if (this._isAllowedUnscheduledTask(task)) {
			this._set_default_task_timing(task);
		}
		this._init_task_timing(task);
		if (task.start_date && task.end_date)
			this.correctTaskWorkTime(task);

		task.$source = [];
		task.$target = [];

		var originalTask = this.$data.tasksStore.getItem(task.id);
		if (originalTask && !utils.defined(task.open)) {
			// if a task with the same id is already in the gantt and the new object doesn't specify the `open` state -
			// restore the `open` state we already have in the chart
			task.$open = originalTask.$open;
		}

		if (task.parent === undefined) {
			task.parent = this.config.root_id;
		}
		if(task.open){
			task.$open = true;
		}
		return task;
	}

	function _init_link(link) {
		if (!this.defined(link.id))
			link.id = this.uid();
		return link;
	}
}


export default initDataStores;
