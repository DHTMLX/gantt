import * as domHelpers from "../utils/dom_helpers";
import dropTarget from "./tasks_grid_dnd_marker_helpers/drop_target";
import getLockedLevelTarget from "./tasks_grid_dnd_marker_helpers/locked_level";
import getMultiLevelTarget from "./tasks_grid_dnd_marker_helpers/multi_level";
import higlighter from "./tasks_grid_dnd_marker_helpers/highlight";
import isPlaceholderTask from "../../../utils/placeholder_task";
import { getOwnItemId } from "../../datastore/own_item_id";

function _init_dnd(gantt, grid) {
	var DnD = gantt.$services.getService("dnd");

	if(!grid.$config.bind || !gantt.getDatastore(grid.$config.bind)){
		return;
	}

	function locate(e){
		return domHelpers.locateAttribute(e, grid.$config.item_attribute);
	}

	function getStore(){
		return gantt.getDatastore(grid.$config.bind);
	}

	// GS-3658. The attribute value is always a string; the events get the own id of the row
	function getRowId(el){
		return getOwnItemId(grid.$config.rowStore, el.getAttribute(grid.$config.item_attribute));
	}

	function checkPlaceholderTask(id){
		return isPlaceholderTask(id, gantt, getStore());
	}

	var dnd = new DnD(grid.$grid_data, {updates_per_second: 60});
	if (gantt.defined(grid.$getConfig().dnd_sensitivity))
		dnd.config.sensitivity = grid.$getConfig().dnd_sensitivity;

	dnd.attachEvent("onBeforeDragStart", gantt.bind(function (obj, e) {
		var el = locate(e);
		if (!el) return false;
		if (gantt.hideQuickInfo) gantt.hideQuickInfo();
		if (domHelpers.closest(e.target, ".gantt_grid_editor_placeholder")){
			return false;
		}

		var id = getRowId(el);
		var datastore = grid.$config.rowStore;
		var task = datastore.getItem(id);

		if (gantt.isReadonly(task) || checkPlaceholderTask(id))
			return false;

		dnd.config.initial_open_state = task.$open;
		if (!gantt.callEvent("onRowDragStart", [id, e.target || e.srcElement, e])) {
			return false;
		}

	}, gantt));

	dnd.attachEvent("onAfterDragStart", gantt.bind(function (obj, e) {
		var el = locate(e);

		dnd.config.marker.innerHTML = el.outerHTML;
		var element = dnd.config.marker.firstChild;
		if(element){
			dnd.config.marker.style.opacity = 0.4;
			element.style.position = "static";
			element.style.pointerEvents = "none";
		}

		dnd.config.id = getRowId(el);

		var store = grid.$config.rowStore;

		var task = store.getItem(dnd.config.id);
		dnd.config.level = store.calculateItemLevel(task);
		dnd.config.drop_target = dropTarget.createDropTargetObject({
			targetParent: store.getParent(task.id),
			targetIndex: store.getBranchIndex(task.id),
			targetId: task.id,
			nextSibling: true
		});

		task.$open = false;
		task.$transparent = true;
		this.refreshData();
	}, gantt));

	function getTargetTaskId(e){
		var y = domHelpers.getRelativeEventPosition(e, grid.$grid_data).y;
		var store = grid.$config.rowStore;

		if (!document.doctype){
			y += window.scrollY;
		}
		y = y || 0;

		// limits for the marker according to the layout layer
		var scrollPos = grid.$state.scrollTop || 0;
		var maxBottom = gantt.$grid_data.getBoundingClientRect().height + scrollPos + window.scrollY;
		var minTop = scrollPos;

		var firstVisibleTaskIndex = grid.getItemIndexByTopPosition(grid.$state.scrollTop);
		if (!store.exists(firstVisibleTaskIndex)){
			firstVisibleTaskIndex = store.countVisible() - 1;
		}
		if (firstVisibleTaskIndex < 0) {
			return store.$getRootId();
		}

		var firstVisibleTaskId = store.getIdByIndex(firstVisibleTaskIndex);

		var firstVisibleTaskPos = grid.$state.scrollTop / grid.getItemHeight(firstVisibleTaskId);
		var hiddenTaskPart = firstVisibleTaskPos - Math.floor(firstVisibleTaskPos);
		if (hiddenTaskPart > 0.1 && hiddenTaskPart < 0.9) {
			maxBottom = maxBottom - grid.getItemHeight(firstVisibleTaskId) * hiddenTaskPart;
			minTop = minTop + grid.getItemHeight(firstVisibleTaskId) * (1 - hiddenTaskPart);
		}

		// GS-715. The placeholder task row shouldn't be draggable below the Gantt container
		const gridPosition = domHelpers.getNodePosition(grid.$grid_data);
		const gridBottom = gridPosition.y + gridPosition.height;
		const placeholderRowHeight = dnd.config.marker.offsetHeight;
		if (y + placeholderRowHeight + window.scrollY >= maxBottom){
			dnd.config.marker.style.top = gridBottom - placeholderRowHeight	+ "px";
		}

		if (y >= maxBottom) {
			y = maxBottom;
		} else if (y <= minTop) {
			y = minTop;
			dnd.config.marker.style.top = gridPosition.y + "px";
		}

		var index = grid.getItemIndexByTopPosition(y);

		if (index > store.countVisible() - 1 || index < 0) {
			return store.$getRootId();
		}

		var targetId = store.getIdByIndex(index);
		if (checkPlaceholderTask(targetId)) {
			return store.getPrevSibling(targetId);
		}

		return store.getIdByIndex(index);
	}

	function getDropPosition(e){
		var targetTaskId = getTargetTaskId(e);
		var relTargetPos = null;
		var store = grid.$config.rowStore;
		var config = grid.$getConfig();
		var lockLevel = !config.order_branch_free;

		var eventTop = domHelpers.getRelativeEventPosition(e, grid.$grid_data).y;
		if (!document.doctype){
			eventTop += window.scrollY;
		}

		if(targetTaskId !== store.$getRootId()) {
			var rowTop = grid.getItemTop(targetTaskId);
			var rowHeight = grid.getItemHeight(targetTaskId);
			relTargetPos = (eventTop - rowTop) / rowHeight;
		}

		var result;
		if(!lockLevel){
			result = getMultiLevelTarget(dnd.config.id, targetTaskId, relTargetPos, eventTop, store);
		}else{
			result = getLockedLevelTarget(dnd.config.id, targetTaskId, relTargetPos, eventTop, store, dnd.config.level);
			if(result && result.targetParent && checkPlaceholderTask(result.targetParent)){
				targetTaskId = store.getPrevSibling(result.targetParent);
				result = getLockedLevelTarget(dnd.config.id, targetTaskId, relTargetPos, eventTop, store, dnd.config.level);
			}
		}

		return result;
	}

	dnd.attachEvent("onDragMove", gantt.bind(function (obj, e) {
		var target = getDropPosition(e);

		if(!target ||
			gantt.callEvent("onBeforeRowDragMove", [dnd.config.id, target.targetParent, target.targetIndex]) === false){
				target = dropTarget.createDropTargetObject(dnd.config.drop_target);
			}

		higlighter.highlightPosition(target, dnd.config, grid);
		dnd.config.drop_target = target;
		gantt._waiAria.reorderMarkerAttr(dnd.config.marker);

		this.callEvent("onRowDragMove", [dnd.config.id, target.targetParent, target.targetIndex]);
		return true;
	}, gantt));

	dnd.attachEvent("onDragEnd", gantt.bind(function () {
		var store = grid.$config.rowStore;
		var task = store.getItem(dnd.config.id);

		higlighter.removeLineHighlight(dnd.config);

		task.$transparent = false;
		task.$open = dnd.config.initial_open_state;
		var target = dnd.config.drop_target;

		if (this.callEvent("onBeforeRowDragEnd", [dnd.config.id, target.targetParent, target.targetIndex]) === false) {
			task.$drop_target = null;
		} else {
			store.move(dnd.config.id, target.targetIndex, target.targetParent);
			gantt.render();
			this.callEvent("onRowDragEnd", [dnd.config.id, target.targetParent, target.targetIndex]);
		}
		store.refresh(task.id);
	}, gantt));
}

export default {
	init: _init_dnd
};