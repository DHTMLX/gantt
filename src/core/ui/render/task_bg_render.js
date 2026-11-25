import getRowRectangle from "./viewport/get_bg_row_rectangle";
import isLegacyRender from "./is_legacy_smart_render";
import getVisibleRange from "./viewport/get_visible_bars_range";
import getVisibleCellsRange from "./viewport/get_visible_cells_range";
import isColumnVisible from "./viewport/is_column_visible";
import bgPlaceholder from "./prerender/task_bg_placeholder";

function createTaskBgRender(gantt){
	var renderedCells = {};
	var visibleCells = {};

	function cleanupCell(itemId) {
		if (renderedCells[itemId]) {
			for (let columnIndex in renderedCells[itemId]) {
				const cell = renderedCells[itemId][columnIndex];
				if (cell && cell.parentNode) {
					cell.parentNode.removeChild(cell);
				}
			}
			delete renderedCells[itemId];
		}
		if (visibleCells[itemId]) {
			delete visibleCells[itemId];
		}
	}

	// GS-3018: Add cleanup method for all cells
	function cleanupAll() {
		for (let itemId in renderedCells) {
			cleanupCell(itemId);
		}
		renderedCells = {};
		visibleCells = {};
	}

	function isRendered(item, columnIndex){
		if(renderedCells[item.id][columnIndex] && renderedCells[item.id][columnIndex].parentNode){
			return true;
		}else{
			return false;
		}
	}

	function detachRenderedCell(itemId, columnIndex){
		if(renderedCells[itemId] && renderedCells[itemId][columnIndex] &&
			renderedCells[itemId][columnIndex].parentNode
			){
				renderedCells[itemId][columnIndex].parentNode.removeChild(renderedCells[itemId][columnIndex]);
			}
	}

	function getCellClassTemplate(view){
		var templates = view.$getTemplates();
		var cssTemplate;
		if (typeof templates.task_cell_class !== "undefined") {
			cssTemplate = templates.task_cell_class;
			// eslint-disable-next-line no-console
			var log = console.warn || console.log;
			log('gantt.templates.task_cell_class template is deprecated and will be removed soon. Please use gantt.templates.timeline_cell_class instead.');
		} else {
			cssTemplate = templates.timeline_cell_class;
		}
		return cssTemplate;
	}
	function getCellContentTemplate(view){
		var templates = view.$getTemplates();
		var contentTemplate = templates.timeline_cell_content;
		return contentTemplate;
	}

	function renderCells(item, node, view, config, viewPort){
		var cfg = view.getScale();
		var count = cfg.count;
		var cssTemplate = getCellClassTemplate(view);
		var contentTemplate = getCellContentTemplate(view);

		if (config.show_task_cells) {
			if(!renderedCells[item.id]){
				renderedCells[item.id] = {};
			}
			if(!visibleCells[item.id]){
				visibleCells[item.id] = {};
			}

			var range = getVisibleCellsRange(cfg, viewPort);

			for(var i in visibleCells[item.id]){
				var index = visibleCells[item.id][i];

				if(Number(index) < range.start || Number(index) > range.end){
					detachRenderedCell(item.id, index);
				}
			}
			visibleCells[item.id] = {};
			// TODO: do not iterate all cell, only ones in the viewport and once that are already rendered
			for (var columnIndex = range.start; columnIndex <= range.end; columnIndex++) {
				var cell = renderOneCell(cfg, columnIndex, item, viewPort, count, cssTemplate, contentTemplate, config);
				if(!cell && isRendered(item, columnIndex)){
					detachRenderedCell(item.id, columnIndex);
				}else if (cell && !cell.parentNode){
					node.appendChild(cell);
				}
			}
		}
	}

	function renderOneCell(scale, columnIndex, item, viewPort, count, cssTemplate, contentTemplate, config){
		var width = scale.width[columnIndex],
			cssclass = "";

		if (isColumnVisible(columnIndex, scale, viewPort, gantt)) {//do not render skipped columns

			var cssTemplateContent = cssTemplate(item, scale.trace_x[columnIndex]);
			var htmlTemplateContent = "";
			if (contentTemplate) {// for backward compatibility, contentTemplate was added in 7.2.0+, will be undefined if someone used copy of old config/template object
				htmlTemplateContent = contentTemplate(item, scale.trace_x[columnIndex]);
			}

			if(config.static_background){
				// if cell render in static background is not allowed, or if it's a blank cell
				var customCell = !!(cssTemplateContent || htmlTemplateContent);
				if(!(config.static_background_cells && customCell)){
					return null;
				}
			}

			if(renderedCells[item.id][columnIndex]){
				visibleCells[item.id][columnIndex] = columnIndex;
				return renderedCells[item.id][columnIndex];
			}
			var cell = document.createElement("div");
			cell.style.width = (width) + "px";

			cssclass = "gantt_task_cell" + (columnIndex == count - 1 ? " gantt_last_cell" : "");
			if (cssTemplateContent) {
				cssclass += " " + cssTemplateContent;
			}
			cell.className = cssclass;

			if (htmlTemplateContent) {
				cell.innerHTML = htmlTemplateContent;
			}

			cell.style.position = "absolute";
			cell.style.left = scale.left[columnIndex] + "px";
			renderedCells[item.id][columnIndex] = cell;
			visibleCells[item.id][columnIndex] = columnIndex;

			return cell;
		}
		return null;
	}

	function _render_bg_line(item, view, config, viewPort) {
		var templates = view.$getTemplates();
		var cfg = view.getScale();
		var count = cfg.count;

		if(config.static_background && !config.static_background_cells){
			return null;
		}

		var row = document.createElement("div");

		var cellCssTemplate = getCellClassTemplate(view);
		var cellHtmlTemplate = getCellContentTemplate(view);

		var range;

		if(!viewPort || !config.smart_rendering || isLegacyRender(gantt)){
			range = {
				start: 0,
				end: count - 1
			};
		} else {
			range = getVisibleCellsRange(cfg, viewPort.x);
		}
		if (config.show_task_cells) {
			renderedCells[item.id] = {};
			visibleCells[item.id] = {};
			for (var columnIndex = range.start; columnIndex <= range.end; columnIndex++) {
				var cell = renderOneCell(cfg, columnIndex, item, viewPort, count, cellCssTemplate, cellHtmlTemplate, config);
				if(cell){
					row.appendChild(cell);
				}
			}
		}
		// GS-291. The odd class should be assigned correctly
		const store = view.$config.rowStore;
		const odd = store.getIndexById(item.id) % 2 !== 0;

		var cssTemplate = templates.task_row_class(item.start_date, item.end_date, item);
		var css = "gantt_task_row" + (odd ? " odd" : "") + (cssTemplate ? ' ' + cssTemplate : '');

		if(store.isSelected(item.id)) {
			css += " gantt_selected";
		}

		if (store.$config.name === "task" && !gantt._isStoredTaskActive(item)) {
			css += " gantt_task_row_inactive";
		}

		row.className = css;

		if (config.smart_rendering) {
			row.style.position = "absolute";
			row.style.top = view.getItemTop(item.id) + "px";
			row.style.width = "100%";
		}else{
			row.style.position = "relative";
		}
		row.style.height = (view.getItemHeight(item.id)) + "px";

		if (item.id == "timeline_placeholder_task"){
			var placeholderTop = 0;
			if (item.lastTaskId){
				var lastTaskTop = view.getItemTop(item.lastTaskId);
				var lastTaskHeight = view.getItemHeight(item.lastTaskId);
				placeholderTop = lastTaskTop + lastTaskHeight;	
			}

			var maxHeight = item.row_height || view.$task_data.offsetHeight;

			var placeholderHeight = maxHeight - placeholderTop;
			// So that it won't exceed the placeholder timeline height
			if (placeholderHeight < 0){
				placeholderHeight = 0;
			}

			if (config.smart_rendering) {
				row.style.top = placeholderTop + "px";	
			}
			row.style.height = placeholderHeight + "px";
		}


		if(view.$config.item_attribute){
			row.setAttribute(view.$config.item_attribute, item.id);
			row.setAttribute(view.$config.bind + "_id", item.id); // 'task_id'/'resource_id' for backward compatibility
		}

		return row;
	}

	return {
		render: _render_bg_line,
		update: renderCells,
		clear: cleanupAll,
		getRectangle: getRowRectangle,
		getVisibleRange: getVisibleRange,
		prepareData: bgPlaceholder
	};
}

export default createTaskBgRender;
