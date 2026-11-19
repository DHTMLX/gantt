import * as domHelpers from "../utils/dom_helpers";
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
		return getOwnItemId(getStore(), el.getAttribute(grid.$config.item_attribute));
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
		if (checkPlaceholderTask(id)) return false;

		var datastore = getStore();

		var task = datastore.getItem(id);

		if (gantt.isReadonly(task))
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
			element.style.position = "static";
		}

		dnd.config.id = getRowId(el);

		var store = getStore();

		var task = store.getItem(dnd.config.id);
		dnd.config.index = store.getBranchIndex(dnd.config.id);
		dnd.config.parent = task.parent;
		task.$open = false;
		task.$transparent = true;
		this.refreshData();
	}, gantt));

	dnd.lastTaskOfLevel = function (level) {
		var last_item = null;
		var store = getStore();
		var tasks = store.getItems();
		for (var i = 0, len = tasks.length; i < len; i++) {
			if (tasks[i].$level == level) {
				last_item = tasks[i];
			}
		}
		return last_item ? last_item.id : null;
	};
	dnd._getGridPos = gantt.bind(function (e) {
		var pos = domHelpers.getNodePosition(grid.$grid_data);
		// row offset
		var x = pos.x + grid.$grid.scrollLeft;
		var y = e.pos.y - 10;

		var rowHeight = grid.getItemHeight(dnd.config.id);
		// prevent moving row out of grid_data container
		if (y < pos.y) y = pos.y;
		var gridHeight = grid.getTotalHeight();
		if (y > pos.y + gridHeight - rowHeight) y = pos.y + gridHeight - rowHeight;
		const maxBottom = pos.y + pos.height;
		if (y > maxBottom - rowHeight) {
			y = maxBottom - rowHeight;
		}

		pos.x = x;
		pos.y = y;
		return pos;
	}, gantt);
	dnd._getTargetY = gantt.bind(function (e) {
		var pos = domHelpers.getNodePosition(grid.$grid_data);
		var scrollPos = grid.$state.scrollTop || 0;
		var maxBottom = gantt.$grid_data.getBoundingClientRect().height + scrollPos;

		var y = e.pageY - pos.y + scrollPos;
		if (y > maxBottom) {
			y = maxBottom;
		} else if (y < scrollPos) {
			y = scrollPos;
		}
		return y;
	}, gantt);
	dnd._getTaskByY = gantt.bind(function (y, dropIndex) {

		var store = getStore();

		y = y || 0;

		var index = grid.getItemIndexByTopPosition(y);
		index = dropIndex < index ? index - 1 : index;

		if (index > store.countVisible() - 1)
			return null;

		return store.getIdByIndex(index);
	}, gantt);
	dnd.attachEvent("onDragMove", gantt.bind(function (obj, e) {
		var gridDataSizes = gantt.$grid_data.getBoundingClientRect();
		var maxBottom = gridDataSizes.height + gridDataSizes.y + (grid.$state.scrollTop || 0) + window.scrollY;
		var dd = dnd.config;
		var pos = dnd._getGridPos(e);

		gantt._waiAria.reorderMarkerAttr(dd.marker);

		var config = grid.$getConfig(),
			store = getStore();

		// setting position of row
		if (pos.y < maxBottom) {
			dd.marker.style.top = pos.y + "px";
		} else {
			dd.marker.style.top = maxBottom + "px";
		}
		dd.marker.style.left = pos.x + 10 + "px";
		const containerSize = domHelpers.getNodePosition(gantt.$root);
		if (pos.width > containerSize.width){
			dd.marker.style.width = containerSize.width - 10 - 2 + "px";
			dd.marker.style.overflow = "hidden";	
		}

		// highlight row when mouseover
		var item = store.getItem(dnd.config.id);
		var targetY = dnd._getTargetY(e);
		var el = dnd._getTaskByY(targetY, store.getIndexById(item.id));

		if (!store.exists(el)) {
			el = dnd.lastTaskOfLevel(config.order_branch_free ? item.$level : 0);
			if (el == dnd.config.id) {
				el = null;
			}
		}

		function allowedLevel(next, item) {
			return (!(store.isChildOf(over.id, item.id)) && (next.$level == item.$level || config.order_branch_free));
		}

		if (store.exists(el)) {
			var over = store.getItem(el);

			var itemTop = grid.getItemTop(over.id);
			var itemHeight = grid.getItemHeight(over.id);
			if (itemTop + itemHeight / 2 < targetY) {
				//hovering over bottom part of item, check can be drop to bottom
				var index = store.getIndexById(over.id);
				var nextId = store.getNext(over.id);//adds +1 when hovering over placeholder
				var next = store.getItem(nextId);
				if (checkPlaceholderTask(nextId)){
					var prevId = store.getPrev(next.id);
					next = store.getItem(prevId);
				}
				if (next) {
					if (next.id != item.id) {
						over = next; //there is a valid target
					}
					else {
						if (config.order_branch_free) {
							// GS-477. hasChild() is the count; getChildren() now copies the branch.
							if (!(store.isChildOf(item.id, over.id) && store.hasChild(over.id) == 1))
								return;
							else {
								store.move(item.id, store.getBranchIndex(over.id) + 1, store.getParent(over.id));
								return;
							}
						}
						else {
							return;
						}
					}
				} else {
					//we at end of the list, check and drop at the end of list
					nextId = store.getIdByIndex(index);
					next = store.getItem(nextId);

					if (checkPlaceholderTask(nextId)){
						var prevId = store.getPrev(next.id);
						next = store.getItem(prevId);
					}

					if (allowedLevel(next, item) && next.id != item.id) {
						store.move(item.id, -1, store.getParent(next.id));
						return;
					}
				}
			}
			else if (config.order_branch_free) {
				if (over.id != item.id && allowedLevel(over, item) && !checkPlaceholderTask(over.id)) {
					if (!store.hasChild(over.id)) {
						over.$open = true;
						store.move(item.id, -1, over.id);
						return;
					}
					if (store.getIndexById(over.id) || itemHeight / 3 < targetY) return;
				}
			}
			//if item is on different level, check the one before it
			var index = store.getIndexById(over.id),
				prevId = store.getIdByIndex(index - 1);

			var prev = store.getItem(prevId);

			var shift = 1;
			while ((!prev || prev.id == over.id) && index - shift >= 0) {

				prevId = store.getIdByIndex(index - shift);
				prev = store.getItem(prevId);
				shift++;
			}

			if (item.id == over.id || checkPlaceholderTask(over.id)) return;
			//replacing item under cursor
			if (allowedLevel(over, item) && item.id != over.id) {
				store.move(item.id, 0, 0, over.id);

			} else if (over.$level == item.$level - 1 && !store.hasChild(over.id)) {
				store.move(item.id, 0, over.id);

			} else if (prev && (allowedLevel(prev, item)) && (item.id != prev.id)) {
				store.move(item.id, -1, store.getParent(prev.id));

			}
		}
		return true;
	}, gantt));

	dnd.attachEvent("onDragEnd", gantt.bind(function () {
		var store = getStore();
		var task = store.getItem(dnd.config.id);
		task.$transparent = false;
		task.$open = dnd.config.initial_open_state;

		if (this.callEvent("onBeforeRowDragEnd", [dnd.config.id, dnd.config.parent, dnd.config.index]) === false) {
			store.move(dnd.config.id, dnd.config.index, dnd.config.parent);
			task.$drop_target = null;
		} else {
			this.callEvent("onRowDragEnd", [dnd.config.id, task.$drop_target]);
		}
		gantt.render();
		this.refreshData();
	}, gantt));
}

export default {
	init: _init_dnd
};