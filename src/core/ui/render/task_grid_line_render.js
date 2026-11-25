import * as helpers from "../../../utils/helpers";
import getRowRectangle from "./viewport/get_grid_row_rectangle";
import getVisibleRange from "./viewport/get_visible_bars_range";
import isInViewPort from "./viewport/is_grid_row_in_viewport";

function createGridLineRender(gantt){

	function _render_grid_item(item, view, config, viewport) {
		var columns = view.getGridColumns();
		var templates = view.$getTemplates();

		var store = view.$config.rowStore;

		var cells = [];
		var has_child;
		// a read-only task gets no new subtasks: its "+" stays in place, marked disabled
		var addDisabled = store.$config.name === "task" && !gantt._canAddSubtask(item, config, true);
		for (var i = 0; i < columns.length; i++) {
			var last = i == columns.length - 1;
			var col = columns[i];
			var cell;

			var value;
			var textValue;
			if (col.name == "add") {
				var aria = gantt._waiAria.gridAddButtonAttrString(col, addDisabled);

				value = "<div " + aria + " class='gantt_add" + (addDisabled ? " gantt_add_disabled" : "") + "'></div>";
				textValue = "";
			} else {
				if (col.template)
					value = col.template(item);
				else
					value = item[col.name];

				if (helpers.isDate(value)){
					value = templates.date_grid(value, item, col.name);
				}

				if (value === null || value === undefined) {
					value = "";
				}

				textValue = value;
				value = "<div class='gantt_tree_content'>" + value + "</div>";
			}
			var css = "gantt_cell" + (last ? " gantt_last_cell" : "");

			var tree = [];
			if (col.tree) {
				css += " gantt_cell_tree";
				for (var j = 0; j < item.$level; j++)
					tree.push(templates.grid_indent(item));

				has_child = store.hasChild(item.id) && !(gantt.isSplitTask(item) && !gantt.config.open_split_tasks);
				if (has_child) {
					tree.push(templates.grid_open(item));
					tree.push(templates.grid_folder(item));
				} else {
					tree.push(templates.grid_blank(item));
					tree.push(templates.grid_file(item));
				}
			}
			var style = "width:" + (col.width - (last ? 1 : 0)) + "px;";
			if (this.defined(col.align)){
				var flexAlign = {
					right: "flex-end",
					left: "flex-start",
					center: "center"
				};
				var justifyContent = flexAlign[col.align];

				style += "text-align:" + col.align + ";justify-content:"  + justifyContent + ";";
			}

			var aria = gantt._waiAria.gridCellAttrString(col, textValue, item, store, i);

			tree.push(value);
			cell = "<div class='" + css + "' data-column-index='"+i+"' data-column-name='"+col.name+"' style='" + style + "' " + aria + ">" + tree.join("") + "</div>";
			cells.push(cell);
		}
		// GS-291. The odd class should be assigned correctly
		css = "";
		const storeName = store.$config.name;
		switch (storeName) {
			case "task":
				css = gantt.getGlobalTaskIndex(item.id) % 2 === 0 ? "" : " odd";
				break;
			case "resource":
				css = store.visibleOrder.indexOf(item.id) % 2 === 0 ? "" : " odd";
				break;
		}

		css += (item.$transparent) ? " gantt_transparent" : "";

		css += (item.$dataprocessor_class ? " " + item.$dataprocessor_class : "");

		if (storeName === "task" && !gantt._isStoredTaskActive(item)) {
			css += " gantt_row_inactive";
		}

		if (templates.grid_row_class) {
			var css_template = templates.grid_row_class.call(gantt, item.start_date, item.end_date, item);
			if (css_template)
				css += " " + css_template;
		}

		if(store.isSelected(item.id)) {
			css += " gantt_selected";
		}

		var el = document.createElement("div");
		el.className = "gantt_row" + css + " gantt_row_" + gantt.getTaskType(item.type);
		var height = view.getItemHeight(item.id);
		el.style.height = height + "px";
		el.style.lineHeight = height + "px";

		if(config.smart_rendering){
			el.style.position = "absolute";
			el.style.left = "0px";
			el.style.top = view.getItemTop(item.id) + "px";
		}

		if(view.$config.item_attribute){
			el.setAttribute(view.$config.item_attribute, item.id);
			el.setAttribute(view.$config.bind + "_id", item.id); // 'task_id'/'resource_id' for backward compatibility
		}

		if(store.$config.name === gantt.config.resource_store){
			gantt._waiAria.resourceRowAttr(item, el, store);
		}else{
			gantt._waiAria.taskRowAttr(item, el, store);
		}

		el.innerHTML = cells.join("");
		return el;
	}

	function onrender(item, rowNode, view){
		var columns = view.getGridColumns();
		for (var i = 0; i < columns.length; i++) {
			var column = columns[i];
			if (column.onrender){

				// find cell node for current column
				var cellNode = rowNode.querySelector(`[data-column-name="${column.name}"]`);
				if (cellNode) {
					var content = column.onrender(item, cellNode);
					if (content && typeof content === "string") {
						cellNode.innerHTML = content;
					} else if (content && typeof content === "object") {
						// render object to node using additional functionality
						if (gantt.config.external_render){
							var adapter = gantt.config.external_render;
							if (adapter.isElement(content)){
								adapter.renderElement(content, cellNode);
							}
						}
					}
				}
			}
		}
	}

	return {
		render: _render_grid_item,
		update: null,
		getRectangle: getRowRectangle,
		isInViewPort: isInViewPort,
		getVisibleRange: getVisibleRange,
		onrender: onrender
	};
}

export default createGridLineRender;