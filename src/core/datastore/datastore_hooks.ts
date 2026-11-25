import * as utils from "../../utils/utils";
import facadeFactory from "./../facades/datastore";
import calculateScaleRange from "../gantt_data_range";
import isPlaceholderTask from "../../utils/placeholder_task";
import { parsePauses } from "../common/pauses";

import treeHelper from "../../utils/task_tree_helpers";
import type { GanttInternal } from "../../types/gantt_internal_types";
import type { Id, Link, Task } from "../../types/gantt_types";
import type DatastoreInternal from "./datastore";
import TreeDatastoreInternal from "./treedatastore";


interface EventMapConfig {
	source: DatastoreInternal | TreeDatastoreInternal;
	target: {
		callEvent(name: string, params: any[]): boolean | undefined;
	};
	events: Record<string, string>;
}

function initDataStores(gantt: GanttInternal): void{

	const facade = facadeFactory.create();
	utils.mixin(gantt, facade);
	const tasksStore = gantt.createDatastore({
		name: "task",
		type: "treeDatastore",
		rootId: function() { return gantt.config.root_id; },
		initItem: utils.bind(_init_task, gantt),
		getConfig: function() { return gantt.config; }
	}) as TreeDatastoreInternal;

	const linksStore = gantt.createDatastore({
		name: "link",
		initItem: utils.bind(_init_link, gantt)
	});

	gantt.attachEvent("onDestroy", function(){
		tasksStore.destructor();
		linksStore.destructor();
	});

	gantt.attachEvent("onLinkValidation", function(link: Link){
		if(gantt.isLinkExists(link.id) || link.id === "predecessor_generated" || link.id === "successor_generated"){
			// link was already added into gantt
			return true;
		}
		const source = gantt.getTask(link.source);
		const taskLinks = source.$source || [];
		for (let i = 0; i < taskLinks.length; i++) {
			const existingLink = gantt.getLink(taskLinks[i]);

			const sourceMatch = link.source == existingLink.source;
			const targetMatch = link.target == existingLink.target;
			const typeMatch = link.type == existingLink.type;

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

		const order = tasksStore.getVisibleItems();

		for(let i=0; i < order.length; i++){
			const item = order[i];
			item.$index = i;
			item.$local_index = gantt.getTaskIndex(item.id);
			gantt.resetProjectDates(item);
		}

	});

	tasksStore.attachEvent("onFilterItem", function(id: Id, task: Task) {
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

	tasksStore.attachEvent("onIdChange", function(oldId: Id, newId: Id){
		gantt._update_flags(oldId, newId);

		const changedTask = gantt.getTask(newId);
		if(!tasksStore.isSilent()){
			if(changedTask.$split_subtask || changedTask.rollup){
				gantt.eachParent(function(parent: Task){
					gantt.refreshTask(parent.id);
				}, newId);
			}
		}
	});

	tasksStore.attachEvent("onAfterUpdate", function(id: Id){
		// GS-3542. Toggling a summary can keep its dates (an inactive summary still spans its
		// children) while its branch stops or starts counting for the ancestors.
		const recalculateAncestors = gantt._hasInactiveTasks() && !!tasksStore.hasChild(id);
		gantt._update_parents(id, false, false, recalculateAncestors);
		if(gantt.getState("batchUpdate").batch_update){
			return true;
		}

		const task = tasksStore.getItem(id) as Task;
		if (!task.$source) task.$source = [];
		for (let i = 0; i < task.$source.length; i++) {
			linksStore.refresh(task.$source[i]);
		}
		if (!task.$target) task.$target = [];
		for (let i = 0; i < task.$target.length; i++) {
			linksStore.refresh(task.$target[i]);
		}
	});

	tasksStore.attachEvent("onBeforeItemMove", function(sid: Id, parent: Id, tindex: number){
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
	function setDropTarget(store: DatastoreInternal, sid: Id){
		const source = gantt.getTask(sid);

		if(store.getNextSibling && store.getNextSibling(sid) !== null){
			source.$drop_target = store.getNextSibling(sid) as any;
		} else if(store.getPrevSibling && store.getPrevSibling(sid) !== null){
			source.$drop_target = "next:" + store.getPrevSibling(sid);
		}else{
			source.$drop_target = "next:null";
		}
	}

	tasksStore.attachEvent("onAfterItemMove", function(this: DatastoreInternal, sid: Id){
		setDropTarget(this, sid);
	});

	// A silent move gives a task no position for the data processor. A task that already has one -
	// a `$drop_target` that waits for the next save, or the `target` of an earlier reorder, which
	// the data processor sends with every later save - gets the position of its new place, as after
	// a move outside silent(). The old position no longer describes where the task is, and only the
	// task's own move can tell whether it still applies.
	tasksStore.attachEvent("onAfterSilentMove", function(this: DatastoreInternal, sid: Id){
		const task = gantt.getTask(sid);
		const target = task.target;
		if(task.$drop_target || (target !== undefined && target !== null && target !== "")){
			setDropTarget(this, sid);
		}
	});

	tasksStore.attachEvent("onStoreUpdated", function(this: DatastoreInternal, id: Id | null, item: any, action: string | null){
		if(action == "delete"){
			gantt._update_flags(id, null);
		}

		const state = gantt.$services.getService("state");
		if(state.getState("batchUpdate").batch_update){
			return;
		}

		if(gantt.config.fit_tasks && action !== "paint"){
			const oldState = gantt.getState();
			calculateScaleRange(gantt);
			const newState = gantt.getState();

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

	linksStore.attachEvent("onAfterAdd", function(id: Id, link: Link){
		if(linksStore.sync_link){
			linksStore.sync_link(link);
		}
	});
	linksStore.attachEvent("onAfterUpdate", function(){
		sync_links();
	});
	linksStore.attachEvent("onAfterDelete", function(id: Id, link: Link){
		sync_link_delete(link);
	});
	linksStore.attachEvent("onAfterSilentDelete", function(id: Id, link: Link){
		sync_link_delete(link);
	});
	linksStore.attachEvent("onBeforeIdChange", function(oldId: Id, newId: Id){
		sync_link_delete(gantt.mixin({id:oldId}, gantt.$data.linksStore.getItem(newId)!) as Link);
		if(linksStore.sync_link){
			linksStore.sync_link(gantt.$data.linksStore.getItem(newId) as Link);
		}
	});

	function checkLinkedTaskVisibility(taskId: Id): boolean{
		let isVisible = gantt.isTaskVisible(taskId);
		if(!isVisible && gantt.isTaskExists(taskId)){
			let parent = gantt.getParent(taskId);
			if(gantt.isTaskExists(parent) && gantt.isTaskVisible(parent)){
				const parentTask = gantt.getTask(parent);
				if(gantt.isSplitTask(parentTask)){
					isVisible = true;
				}
			}
		}
		return isVisible;
	}

	linksStore.attachEvent("onFilterItem", function(id: Id, link: Link){
		if (!gantt.config.show_links) {
			return false;
		}

		const sourceVisible = checkLinkedTaskVisibility(link.source);
		const targetVisible = checkLinkedTaskVisibility(link.target);

		if (!(sourceVisible && targetVisible) ||
			gantt._isAllowedUnscheduledTask(gantt.getTask(link.source)) || gantt._isAllowedUnscheduledTask(gantt.getTask(link.target)))
			return false;

		return gantt.callEvent("onBeforeLinkDisplay", [id, link]);
	});


	(function(){
		// delete all connected links after task is deleted
		const deletedLinks: Record<Id, Record<Id, Link> | null> = {};

		gantt.attachEvent("onBeforeTaskDelete", function(id: Id){
			deletedLinks[id] = treeHelper.getSubtreeLinks(gantt, id);
			return true;
		});

		gantt.attachEvent("onAfterTaskDelete", function(id: Id) {
			if(deletedLinks[id]){
				gantt.$data.linksStore.silent(function(){
					for(const i in deletedLinks[id]){
						if (gantt.isLinkExists(i)){
							gantt.$data.linksStore.removeItem(i);
						}
						sync_link_delete((deletedLinks[id])[i]);
					}

					deletedLinks[id] = null;
				});
			}
		});
	})();

	gantt.attachEvent("onAfterLinkDelete", function(id: Id, link: Link) {
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
		tasksStore: tasksStore as TreeDatastoreInternal,
		linksStore: linksStore as DatastoreInternal
	};

	linksStore.sync_link = function(link: Link): void {
		if(gantt.isTaskExists(link.source)){
			const sourceTask = gantt.getTask(link.source);
			sourceTask.$source = sourceTask.$source || [];
			if (noDuplicateIds(link.id, sourceTask.$source)){
				sourceTask.$source.push(link.id);
			}
		}
		if(gantt.isTaskExists(link.target)){
			const targetTask = gantt.getTask(link.target);
			targetTask.$target = targetTask.$target || [];
			if (noDuplicateIds(link.id, targetTask.$target)){
				targetTask.$target.push(link.id);
			}
		}
	};
	// GS-2085. Don't add duplicate link IDs
	function noDuplicateIds(id: Id, array: Id[]): boolean{
		return array.indexOf(String(id)) === -1 && array.indexOf(Number(id)) === -1;
	}

	function sync_link_delete(link: Link): void{
		if(gantt.isTaskExists(link.source)){
			const sourceTask = gantt.getTask(link.source);
			const sourceLinks = sourceTask.$source || [];
			sourceTask.$source = sourceLinks;
			for(let i = 0; i < sourceLinks.length; i++){
				if(sourceLinks[i] == link.id){
					sourceLinks.splice(i, 1);
					break;
				}
			}
		}
		if(gantt.isTaskExists(link.target)){
			const targetTask = gantt.getTask(link.target);
			const targetLinks = targetTask.$target || [];
			targetTask.$target = targetLinks;
			for(let i = 0; i < targetLinks.length; i++){
				if(targetLinks[i] == link.id){
					targetLinks.splice(i, 1);
					break;
				}
			}
		}
	}

	function sync_links(): void {
		let task: Task | null = null;
		const tasks = gantt.$data.tasksStore.getItems() as Task[];

		for(let i = 0, len = tasks.length; i < len; i++){
			task = tasks[i];
			task.$source = [];
			task.$target = [];
		}

		const links = gantt.$data.linksStore.getItems() as Link[];
		for (let i = 0, len = links.length; i < len; i++) {

			const link = links[i];
			if(linksStore.sync_link){
				linksStore.sync_link(link);
			}
		}
	}

	function mapEvents(conf: EventMapConfig): void{
		const mapFrom = conf.source;
		const mapTo = conf.target;
		for(const i in conf.events){
			(function(sourceEvent: string, targetEvent: string){
				mapFrom.attachEvent(sourceEvent, function(){
					// GS-3602. Cheaper than `Array.prototype.slice.call(arguments)`, and the
					// `onFilterItem` -> `onBeforeTaskDisplay` mapping runs this per task on
					// every filter pass.
					const args = new Array(arguments.length);
					for(let i = 0; i < args.length; i++){
						args[i] = arguments[i];
					}
					return mapTo.callEvent(targetEvent, args);
				}, targetEvent);
			})(i, conf.events[i]);
		}
	}

	function _init_task(this: GanttInternal, task: Task) {
		if (!this.defined(task.id))
			task.id = this.uid();

		if (task.start_date)
			task.start_date = gantt.date.parseDate(task.start_date, "parse_date");
		if (task.end_date)
			task.end_date = gantt.date.parseDate(task.end_date, "parse_date");


		if (task.duration || task.duration === 0) {
			task.duration = task.duration * 1;
		}

		// Parsed before end_date is derived from duration below, so the derived
		// end includes the pauses. Left unset when absent, like leveling_delay.
		if (task.pauses !== undefined && task.pauses !== null) {
			const pauses = parsePauses(task.pauses);
			if (pauses) {
				task.pauses = pauses;
			} else {
				gantt.assert(false, "Invalid pauses of task " + task.id + ": a list of { at, length } with at >= 0 and length > 0, sorted and not overlapping, is expected");
				delete task.pauses;
			}
		}

		if (task.duration) {
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

		// XML and form data deliver it as a string. Left unset when absent, so tasks
		// without a delay don't gain the field and send it back to the server.
		if (task.leveling_delay !== undefined && task.leveling_delay !== null) {
			const raw: unknown = task.leveling_delay;
			const delay = raw === "" ? NaN : Number(raw);
			if (isFinite(delay) && delay >= 0) {
				task.leveling_delay = delay;
			} else {
				gantt.assert(false, "Invalid leveling_delay of task " + task.id + ": a finite number >= 0 is expected");
				delete task.leveling_delay;
			}
		}

		if (this._isAllowedUnscheduledTask(task)) {
			this._set_default_task_timing(task);
		}
		this._init_task_timing(task);
		if (task.start_date && task.end_date)
			this.correctTaskWorkTime(task);

		task.$source = [];
		task.$target = [];

		const originalTask = this.$data.tasksStore.getItem(task.id) as Task | undefined;
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

	function _init_link(this: GanttInternal, link: Link): Link {
		if (!this.defined(link.id))
			link.id = this.uid();
		return link;
	}
}


export default initDataStores;
