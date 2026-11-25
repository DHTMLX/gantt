import getRectangle from "./viewport/get_bg_row_rectangle";
import getVisibleRange from "./viewport/get_visible_bars_range";
import getVisibleCellsRange from "./viewport/get_visible_cells_range";
import isColumnVisible from "./viewport/is_column_visible";
import resourceTimetable from "../../resource_timetable_builder";

function generateRenderResourceLine(gantt){
	var getResourceLoad = resourceTimetable(gantt);
	var renderedResourceLines = {};

	function renderResourceLineCell(resource, day, templates, config, timeline, columnIndex){
		var css = templates.resource_cell_class(day.start_date, day.end_date, resource, day.tasks, day.assignments);
		var content = templates.resource_cell_value(day.start_date, day.end_date, resource, day.tasks, day.assignments);
		var height = timeline.getItemHeight(resource.id) - 1;

		if (css || content){
			var sizes = timeline.getItemPosition(resource, day.start_date, day.end_date);
			var el = document.createElement('div');
			el.setAttribute(timeline.$config.item_attribute, resource.id);
			el.setAttribute("data-column-index", columnIndex);
			el.className = ["gantt_resource_marker", css].join(" ");

			el.style.cssText = [
				'left:' + sizes.left + 'px',
				'width:' + sizes.width + 'px',
				'height:' + (height) + 'px',
				'line-height:' + (height) + 'px',
				'top:' + sizes.top + 'px'
			].join(";");

			if(content)
				el.innerHTML = content;

			gantt._waiAria.resourceCellAttr(resource, day.start_date, { used: content }, el);
			return el;
		}
		return null;
	}

	function detachRenderedResourceLine(id, index){
		if(renderedResourceLines[id] && renderedResourceLines[id][index] &&
			renderedResourceLines[id][index].parentNode
			){
				renderedResourceLines[id][index].parentNode.removeChild(renderedResourceLines[id][index]);
			}
	}

	function renderResourceLine(resource, timeline, config, viewport) {
		var templates = timeline.$getTemplates();
		var scale = timeline.getScale();
		var timetable = getResourceLoad(resource, config.resource_property, timeline.getScale(), timeline);
		var smartRendering = !!viewport;//no viewport means smart rendering is disabled
		var cells = [];
		renderedResourceLines[resource.id] = {};

		var range = getVisibleCellsRange(scale, viewport);
		for (var columnIndex = range.start; columnIndex <= range.end; columnIndex++) {

			var day = timetable[columnIndex];
			if(!day){
				continue;
			}

			if(smartRendering && !isColumnVisible(columnIndex, scale, viewport, gantt)){
				continue;
			}

			var cell = renderResourceLineCell(resource, day, templates, config, timeline, columnIndex);
			if(cell){
				cells.push(cell);
				renderedResourceLines[resource.id][columnIndex] = cell;
			}
		}

		var row = null;
		if(cells.length){
			row = document.createElement("div");
			gantt._waiAria.resourceTimelineRowAttr(resource, row);
			for(var i = 0; i < cells.length; i++){
				row.appendChild(cells[i]);
			}
		}
		return row;
	}

	function updateResourceLine(resource, node, timeline, config, viewport) {
		var templates = timeline.$getTemplates();
		var scale = timeline.getScale();
		var timetable = getResourceLoad(resource, config.resource_property, timeline.getScale(), timeline);

		var range = getVisibleCellsRange(scale, viewport);

		var checkedColumns = {};
		if(renderedResourceLines && renderedResourceLines[resource.id]){
			for(var i in renderedResourceLines[resource.id]){
				checkedColumns[i] = i;
			}
		}

		for (var columnIndex = range.start; columnIndex <= range.end; columnIndex++) {
			var day = timetable[columnIndex];
			checkedColumns[columnIndex] = false;
			if(!day){
				continue;
			}

			if(!isColumnVisible(columnIndex, scale, viewport, gantt)){
				detachRenderedResourceLine(resource.id, columnIndex);
				continue;
			}

			if(!renderedResourceLines[resource.id] || !renderedResourceLines[resource.id][columnIndex]){
				var cell = renderResourceLineCell(resource, day, templates, config, timeline, columnIndex);
				if(cell){
					node.appendChild(cell);
					renderedResourceLines[resource.id][columnIndex] = cell;
				}
			}
			else if(renderedResourceLines[resource.id] && renderedResourceLines[resource.id][columnIndex] && !renderedResourceLines[resource.id][columnIndex].parentNode){
				node.appendChild(renderedResourceLines[resource.id][columnIndex]);
			}
		}

		for(var i in checkedColumns){
			if(checkedColumns[i] !== false){
				detachRenderedResourceLine(resource.id, i);
			}
		}
	}

	return {
		render: renderResourceLine,
		update: updateResourceLine,
		getRectangle: getRectangle,
		getVisibleRange: getVisibleRange
	};
}

export default generateRenderResourceLine;