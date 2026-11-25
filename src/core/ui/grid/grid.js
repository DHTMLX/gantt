import * as domHelpers from "../utils/dom_helpers";
import * as utils from "../../../utils/utils";
import eventable from "../../../utils/eventable";
import gridResize from "./grid_resize";
import topPositionMixin from "../row_position_mixin";
import rowResize from "./task_grid_row_resize";

import ColumnDnd from "../plugins/column_grid_dnd";

import mouseEventContainer from "../mouse_event_container";
import { applyColumnDefaults } from "./columns/column_defaults";
import { getOwnItemId } from "../../datastore/own_item_id";

var Grid = function (parent, config, factory, gantt) {
	this.$config = utils.mixin({}, config || {});
	this.$gantt = gantt;
	this.$parent = parent;
	eventable(this);
	this.$state = {};
	utils.mixin(this, topPositionMixin(this));
};


Grid.prototype = {
	init: function(container) {
		var gantt = this.$gantt;
		var gridAriaAttr = gantt._waiAria.gridAttrString();
		var gridDataAriaAttr = gantt._waiAria.gridDataAttrString();
		var _ganttConfig = this.$getConfig();
		var reorderColumns = _ganttConfig.reorder_grid_columns || false;
		if (this.$config.reorder_grid_columns !== undefined) {
			reorderColumns = this.$config.reorder_grid_columns;
		}


		container.innerHTML = "<div class='gantt_grid' style='height:inherit;width:inherit;' " + gridAriaAttr + "></div>";
		this.$grid = container.childNodes[0];

		this.$grid.innerHTML = "<div class='gantt_grid_scale' " +
			gantt._waiAria.gridScaleRowAttrString() + "></div><div class='gantt_grid_data' " + gridDataAriaAttr + "></div>";

		this.$grid_scale = this.$grid.childNodes[0];
		this.$grid_data = this.$grid.childNodes[1];

		var attr = _ganttConfig[this.$config.bind + "_attribute"];
		if (!attr && this.$config.bind) {
			attr = "data-" + this.$config.bind + "-id";
		}
		this.$config.item_attribute = attr || null;

		if (!this.$config.layers) {
			var layers = this._createLayerConfig();
			this.$config.layers = layers;
		}

		var resizer = gridResize(gantt, this);
		resizer.init();
		this._renderHeaderResizers = resizer.doOnRender;
		this._mouseDelegates = mouseEventContainer(gantt);

		var resizerrow = rowResize(gantt, this);
		resizerrow.init();

		this._addLayers(this.$gantt);
		this._initEvents();

		if (reorderColumns) {
			this._columnDND = new ColumnDnd(gantt, this);
			this._columnDND.init();
		}

		this.callEvent("onReady", []);
		//this.refresh();
	},

	_validateColumnWidth: function (column, property) {
		// user can set {name:"text", width:"200",...} for some reason,
		// check and convert it to number when possible
		var value = column[property];
		if (value && value != "*") {
			var gantt = this.$gantt;
			var numericWidth = value * 1;
			if (isNaN(numericWidth)) {
				gantt.assert(false, "Wrong " + property + " value of column " + column.name);
			} else {
				column[property] = numericWidth;
			}
		}
	},

	setSize: function (width, height) {
		this.$config.width = this.$state.width = width;
		this.$config.height = this.$state.height = height;

		// TODO: maybe inherit and override in a subclass instead of extending here

		var columns = this.getGridColumns(),
			innerWidth = 0;

		var config = this.$getConfig();
		var elasticColumns = config.grid_elastic_columns;

		for (var i = 0, l = columns.length; i < l; i++) {
			this._validateColumnWidth(columns[i], "min_width");
			this._validateColumnWidth(columns[i], "max_width");
			this._validateColumnWidth(columns[i], "width");

			innerWidth += columns[i].width * 1;
		}

		var outerWidth;
		if (isNaN(innerWidth) || !this.$config.scrollable) {
			outerWidth = this._setColumnsWidth(width + 1);
			innerWidth = outerWidth;
		}

		if(this.$config.scrollable && elasticColumns && !isNaN(innerWidth)){
			// GS-1352: Allow resizing the grid columns, then the grid width is increased
			// or keep the grid width, but don't allow column resize to affect the grid width
			let columnProperty = "width";
			if (elasticColumns == "min_width"){
				columnProperty = "min_width";
			}
			let newColumnWidth = 0;
			columns.forEach(function(col){
				newColumnWidth += col[columnProperty] || config.min_grid_column_width;
			});
			//newColumnWidth--; // the total column width shouldn't match the outerWidth // GS-2190 reducing width seems to be not needed
			var columnsWidth = Math.max(newColumnWidth, width);
			innerWidth = this._setColumnsWidth(columnsWidth);
			outerWidth = width;
		}

		if (this.$config.scrollable) {
			this.$grid_scale.style.width = innerWidth + "px";
			this.$grid_data.style.width = innerWidth + "px";
		} else {
			this.$grid_scale.style.width = "inherit";
			this.$grid_data.style.width = "inherit";
		}
		this.$config.width -= 1;

		var config = this.$getConfig();
		if (outerWidth !== width) {
			if(outerWidth !== undefined){
				config.grid_width = outerWidth;
				this.$config.width = outerWidth - 1;
			}else{
				if(!isNaN(innerWidth)){
					this._setColumnsWidth(innerWidth);
					config.grid_width = innerWidth;
					this.$config.width = innerWidth - 1;
				}
			}
		}

		var dataHeight = Math.max(this.$state.height - config.scale_height, 0);
		this.$grid_data.style.height = dataHeight + "px";
		this.refresh();
	},
	getSize: function () {

		var config = this.$getConfig();

		var store = this.$config.rowStore;

		var contentHeight = store ? this.getTotalHeight() : 0,
			contentWidth = this._getGridWidth();

		var size = {
			x: this.$state.width,
			y: this.$state.height,
			contentX: this.isVisible() ? contentWidth : 0,
			contentY: this.isVisible() ? (config.scale_height + contentHeight) : 0,
			scrollHeight: this.isVisible() ? contentHeight : 0,
			scrollWidth: this.isVisible() ? contentWidth : 0
		};

		return size;
	},

	_bindStore: function () {
		if (this.$config.bind){
			var rowStore = this.$gantt.getDatastore(this.$config.bind);
			this.$config.rowStore = rowStore;
			if(rowStore && !rowStore._gridCacheAttached){
				var self = this;
				rowStore._gridCacheAttached = rowStore.attachEvent("onBeforeFilter", function(){
					self._resetTopPositionHeight();
				});
			}
		}
	},
	_unbindStore: function(){
		if (this.$config.bind){
			var rowStore = this.$gantt.getDatastore(this.$config.bind);
			if(rowStore && rowStore._gridCacheAttached){
				rowStore.detachEvent(rowStore._gridCacheAttached);
				rowStore._gridCacheAttached = false;
			}
		}
	},

	refresh: function () {
		this._bindStore();

		this._resetTopPositionHeight();
		this._resetHeight();
		this._initSmartRenderingPlaceholder();

		this._calculateGridWidth();
		this._renderGridHeader();
	},

	getViewPort: function(){
		var scrollLeft = this.$config.scrollLeft || 0;
		var scrollTop = this.$config.scrollTop || 0;
		var height = this.$config.height || 0;
		var width = this.$config.width || 0;
		return {
			y: scrollTop,
			y_end: scrollTop + height,
			x: scrollLeft,
			x_end: scrollLeft + width,
			height: height,
			width: width
		};
	},

	scrollTo: function (left, top) {
		if (!this.isVisible())
			return;

		var scrolled = false;

		this.$config.scrollTop = this.$config.scrollTop || 0;
		this.$config.scrollLeft = this.$config.scrollLeft || 0;

		if (left * 1 == left) {
			this.$config.scrollLeft = this.$state.scrollLeft = this.$grid.scrollLeft = left;
			scrolled = true;
		}

		// var config = this.$getConfig();
		if (top * 1 == top) {
			this.$config.scrollTop = this.$state.scrollTop = this.$grid_data.scrollTop = top;
			scrolled = true;
		}

		if(scrolled){
			this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
		}
	},

	getColumnIndex: function (name, excludeHidden) {
		var columns = this.$getConfig().columns;
		var hiddenIndexShift = 0;

		for (var i = 0; i < columns.length; i++) {
			// GS-1257. If the cell is hidden, the target column index should be correct
			if (excludeHidden && columns[i].hide){
				hiddenIndexShift++;
			}
			if (columns[i].name == name) {
				return i - hiddenIndexShift;
			}
		}
		return null;
	},

	getColumn: function (name) {
		var index = this.getColumnIndex(name);
		if (index === null) {
			return null;
		}
		return this.$getConfig().columns[index];
	},

	getGridColumns: function () {
		var config = this.$getConfig();
		var columns = config.columns;
		for (var i = 0; i < columns.length; i++) {
			applyColumnDefaults(this.$gantt, columns[i]);
		}
		return columns.slice();
	},
	isVisible: function () {
		if (this.$parent && this.$parent.$config) {
			return !this.$parent.$config.hidden;
		} else {
			return this.$grid.offsetWidth;
		}
	},

	// getItemHeight: function () {
	// 	var config = this.$getConfig();
	// 	return config.row_height;
	// },

	_createLayerConfig: function () {
		var gantt = this.$gantt;
		var self = this;
		var layers = [
			{
				renderer: gantt.$ui.layers.gridLine(),
				container: this.$grid_data,
				filter: [function () {
					return self.isVisible();
				}]
			},
			{
				renderer: gantt.$ui.layers.gridTaskRowResizer(),
				container: this.$grid_data,
				append: true,
				filter: [function () {
					return gantt.config.resize_rows;
				}]
			}
		];
		return layers;
	},

	_addLayers: function (gantt) {
		if (!this.$config.bind)
			return;

		this._taskLayers = [];

		var self = this;

		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);

		if (!taskRenderer) {
			taskRenderer = layers.createDataRender({
				name: this.$config.bind,
				defaultContainer: function () { return self.$grid_data; }
			});
		}

		var taskLayers = this.$config.layers;
		for (var i = 0; taskLayers && i < taskLayers.length; i++) {
			var layer = taskLayers[i];
			layer.view = this;

			var bar_layer = taskRenderer.addLayer(layer);
			this._taskLayers.push(bar_layer);
		}

		this._bindStore();

		this._initSmartRenderingPlaceholder();
	},

	_refreshPlaceholderOnStoreUpdate: function (id) {
		var config = this.$getConfig(),
			store = this.$config.rowStore;

		// `batchUpdate` delays the filter pass until the batch ends. A read of the visible count
		// starts that pass immediately, one time for each change. The repaint at the end of the
		// batch sets the attribute.
		if (!store || !this.$gantt.getState("batchUpdate").batch_update) {
			this.$gantt._waiAria.gridRowCountAttr(this.$grid, store);
		}

		if (!store || id !== null || !this.isVisible() || !config.smart_rendering) {
			return;
		}

		var contentHeight;
		if (this.$config.scrollY) {
			var scroll = this.$gantt.$ui.getView(this.$config.scrollY);
			if (scroll)
				contentHeight = scroll.getScrollState().scrollSize;
		}

		if (!contentHeight) {
			contentHeight = store ? this.getTotalHeight() : 0;
		}

		if (contentHeight) {
			if (this.$rowsPlaceholder && this.$rowsPlaceholder.parentNode) {
				this.$rowsPlaceholder.parentNode.removeChild(this.$rowsPlaceholder);
			}

			var placeholder = this.$rowsPlaceholder = document.createElement("div");
			placeholder.style.visibility = "hidden";
			placeholder.style.height = contentHeight + "px";
			placeholder.style.width = "1px";
			this.$grid_data.appendChild(placeholder);
		}
	},

	_initSmartRenderingPlaceholder: function () {
		var store = this.$config.rowStore;
		if (!store) {
			return;
		} else {
			this._initSmartRenderingPlaceholder = function () { };
		}
		this._staticBgHandler = store.attachEvent("onStoreUpdated", utils.bind(this._refreshPlaceholderOnStoreUpdate, this));
	},

	_initEvents: function () {
		var gantt = this.$gantt;
		// GS-3658. The attribute value is always a string; the open and close events get the own id of the row
		var getRowId = gantt.bind(function (target) {
			return getOwnItemId(this.$config.rowStore, target.getAttribute(this.$config.item_attribute));
		}, this);

		this._mouseDelegates.delegate("click", "gantt_close", gantt.bind(function (e, id, trg) {
			var store = this.$config.rowStore;
			if (!store) return true;

			var target = domHelpers.locateAttribute(e, this.$config.item_attribute);
			if (target) {
				store.close(getRowId(target));

			}
			return false;
		}, this), this.$grid);

		this._mouseDelegates.delegate("click", "gantt_open", gantt.bind(function (e, id, trg) {
			var store = this.$config.rowStore;
			if (!store) return true;

			var target = domHelpers.locateAttribute(e, this.$config.item_attribute);
			if (target) {
				store.open(getRowId(target));

			}
			return false;
		}, this), this.$grid);
	},

	_clearLayers: function (gantt) {
		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);

		if (this._taskLayers) {
			for (var i = 0; i < this._taskLayers.length; i++) {
				taskRenderer.removeLayer(this._taskLayers[i]);
			}
		}

		this._taskLayers = [];
	},

	_getColumnWidth: function (column, config, width) {
		var min_width = column.min_width || config.min_grid_column_width;
		var new_width = Math.max(width, min_width || 10);
		if (column.max_width)
			new_width = Math.min(new_width, column.max_width);
		return new_width;
	},
	// set min width only if width < than config.min_grid_column_width
	_checkGridColumnMinWidthLimits: function (columns, config) {
		for (var i = 0, l = columns.length; i < l; i++) {
			var width = columns[i].width * 1;
			if (!columns[i].min_width && width < config.min_grid_column_width){
				columns[i].min_width = width;
			}
		}
	},
	// return min and max possible grid width according to restricts
	_getGridWidthLimits: function () {
		var config = this.$getConfig(),
			columns = this.getGridColumns(),
			min_limit = 0,
			max_limit = 0;

		for (var i = 0; i < columns.length; i++) {
			min_limit += columns[i].min_width ? columns[i].min_width : config.min_grid_column_width;
			if (max_limit !== undefined) {
				max_limit = columns[i].max_width ? (max_limit + columns[i].max_width) : undefined;
			}
		}
		this._checkGridColumnMinWidthLimits(columns, config); // FIX ME: should it be before calculating limits?
		return [min_limit, max_limit];
	},
	// resize columns to get total newWidth, starting from columns[start_index]
	_setColumnsWidth: function (newWidth, start_index) {
		var config = this.$getConfig();
		var columns = this.getGridColumns(),
			columns_width = 0,
			final_width = newWidth;

		start_index = !window.isNaN(start_index) ? start_index : -1;

		for (var i = 0, l = columns.length; i < l; i++) {
			columns_width += columns[i].width * 1;
		}

		if (window.isNaN(columns_width)) {
			this._calculateGridWidth();
			columns_width = 0;
			for (var i = 0, l = columns.length; i < l; i++) {
				columns_width += columns[i].width * 1;
			}
		}

		var extra_width = final_width - columns_width;

		var start_width = 0;
		for (var i = 0; i < start_index + 1; i++) {
			start_width += columns[i].width;
		}

		columns_width -= start_width;

		for (var i = start_index + 1; i < columns.length; i++) {

			var col = columns[i];
			var share = Math.round(extra_width * (col.width / columns_width));

			// columns have 2 additional restrict fields - min_width & max_width that are set by user
			if (extra_width < 0) {
				if (col.min_width && col.width + share < col.min_width)
					share = col.min_width - col.width;
				else if (!col.min_width && config.min_grid_column_width && col.width + share < config.min_grid_column_width)
					share = config.min_grid_column_width - col.width;
			} else if (col.max_width && col.width + share > col.max_width)
				share = col.max_width - col.width;

			columns_width -= col.width;
			col.width += share;
			extra_width -= share;

		}

		var iterator = extra_width > 0 ? 1 : -1;
		while ((extra_width > 0 && iterator === 1) || (extra_width < 0 && iterator === -1)) {
			var curExtra = extra_width;
			for (i = start_index + 1; i < columns.length; i++) {
				var new_width = columns[i].width + iterator;

				if (new_width == this._getColumnWidth(columns[i], config, new_width)) {
					extra_width -= iterator;
					columns[i].width = new_width;
				}

				if (!extra_width)
					break;

			}

			if (curExtra == extra_width)
				break;
		}

		// if impossible to resize the right-side columns, resize the start column
		if (extra_width && start_index > -1) {
			var new_width = columns[start_index].width + extra_width;
			if (new_width == this._getColumnWidth(columns[start_index], config, new_width))
				columns[start_index].width = new_width;
		}

		//if (this.callEvent("onGridResizeEnd", [config.grid_width, final_width]) === false)
		//	return;

		return this._getColsTotalWidth();
	},

	_getColsTotalWidth: function () {
		var columns = this.getGridColumns();
		var cols_width = 0;

		for (var i = 0; i < columns.length; i++) {
			var v = parseFloat(columns[i].width);
			if (window.isNaN(v)) {
				return false;
			}
			cols_width += v;
		}
		return cols_width;
	},
	_calculateGridWidth: function () {
		var config = this.$getConfig();
		var columns = this.getGridColumns();
		var cols_width = 0;
		var unknown = [];
		var width = [];

		for (var i = 0; i < columns.length; i++) {
			var v = parseFloat(columns[i].width);
			if (window.isNaN(v)) {
				v = config.min_grid_column_width || 10;
				unknown.push(i);
			}
			width[i] = v;
			cols_width += v;
		}
		var gridWidth = this._getGridWidth() + 1;
		if (config.autofit || unknown.length) {
			var diff = gridWidth - cols_width;
			// TODO: logic may be improved for proportional changing of width

			// autofit adjusts columns widths to the outer grid width
			// it doesn't makes sense if grid has inner scroll with elastic columns
			if (config.autofit && !config.grid_elastic_columns) {
				// delta must be added for all columns
				for (var i = 0; i < width.length; i++) {
					var delta = Math.round(diff / (width.length - i));
					width[i] += delta;
					var new_width = this._getColumnWidth(columns[i], config, width[i]);

					if (new_width != width[i]) {
						delta = new_width - width[i];
						width[i] = new_width;
					}
					diff -= delta;
				}
			} else if (unknown.length) {
				// there are several columns with undefined width
				for (var i = 0; i < unknown.length; i++) {
					var delta = Math.round(diff / (unknown.length - i)); // no float values, just integer
					var index = unknown[i];
					width[index] += delta;
					var new_width = this._getColumnWidth(columns[index], config, width[index]);
					if (new_width != width[index]) {
						delta = new_width - width[index];
						width[index] = new_width;
					}
					diff -= delta;
				}
			}

			for (var i = 0; i < width.length; i++) {
				columns[i].width = width[i];
			}
		} else {
			var changed = (gridWidth != cols_width);
			this.$config.width = cols_width - 1;
			config.grid_width = cols_width;
			if (changed) {
				this.$parent._setContentSize(this.$config.width, null);
			}
		}

	},

	_renderGridHeader: function () {
		var gantt = this.$gantt;
		var config = this.$getConfig();
		var locale = this.$gantt.locale;
		var templates = this.$gantt.templates;

		var columns = this.getGridColumns();
		if (config.rtl) {
			columns = columns.reverse();
		}
		var cells = [];
		var width = 0,
			labels = locale.labels;

		var lineHeigth = config.scale_height - 1;

		const renderableComponents = {};

		for (var i = 0; i < columns.length; i++) {
			var last = i == columns.length - 1;
			var col = columns[i];

			// ensure columns have non-empty names
			if (!col.name) {
				col.name = gantt.uid() + "";
			}

			var colWidth = col.width * 1;

			var gridWidth = this._getGridWidth();
			if (last && gridWidth > width + colWidth)
				col.width = colWidth = gridWidth - width;
			width += colWidth;
			var sort = (gantt._sort && col.name == gantt._sort.name) ? (`<div data-column-id="${col.name}" class="gantt_sort gantt_${gantt._sort.direction}"></div>`) : "";
			// the header "+" adds a top-level task, so only the chart-level read-only value applies
			var addDisabled = col.name == "add" && !gantt._canAddSubtask(null, config, true);
			var cssClass = ["gantt_grid_head_cell",
				("gantt_grid_head_" + col.name),
				(last ? "gantt_last_cell" : ""),
				(addDisabled ? "gantt_add_disabled" : ""),
				templates.grid_header_class(col.name, col)].join(" ");

			var style = "width:" + (colWidth - (last ? 1 : 0)) + "px;";
			var label = (col.label || labels["column_" + col.name] || labels[col.name]);
			if(typeof label === "function"){
				label = label.call(gantt, col.name, col);
			}
			label = label || "";
			let componentLabel = false;
			if(gantt.config.external_render && gantt.config.external_render.isElement(label)){
				componentLabel = true;
				renderableComponents[col.name] = label;
			}

			var ariaAttrs = gantt._waiAria.gridScaleCellAttrString(col, label, addDisabled);

			var cell = "<div class='" + cssClass + "' style='" + style + "' " + ariaAttrs + 
				" data-column-id='" + col.name + "' column_id='" + col.name + "'" +
				" data-column-name='" + col.name + "' data-column-index='" + i + "'" +
				">" + (!componentLabel ? label : "<div data-component-container></div>") + sort + "</div>";
			cells.push(cell);
		}
		this.$grid_scale.style.height = (config.scale_height) + "px";
		this.$grid_scale.style.lineHeight = lineHeigth + "px";
		//this.$grid_scale.style.width = "inherit";
		this.$grid_scale.innerHTML = cells.join("");
		for(let i in renderableComponents){
			gantt.config.external_render.renderElement(renderableComponents[i], this.$grid_scale.querySelector("[data-column-id='" + i + "'] [data-component-container]"));
		}

		if (this._renderHeaderResizers) {
			this._renderHeaderResizers();
		}

		gantt._waiAria.gridColCountAttr(this.$grid, columns.length);
		gantt._waiAria.gridRowCountAttr(this.$grid, this.$config.rowStore);
	},

	_getGridWidth: function () {
		// TODO: refactor/remove/comment some of _getGridWidth/this.$config.width/this.$state.width, it's not clear what they do
		return this.$config.width;
	},

	destructor: function () {
		this._clearLayers(this.$gantt);
		if (this._mouseDelegates) {
			this._mouseDelegates.destructor();
			this._mouseDelegates = null;
		}
		this._unbindStore();
		this.$grid = null;
		this.$grid_scale = null;
		this.$grid_data = null;
		this.$gantt = null;
		if (this.$config.rowStore) {
			this.$config.rowStore.detachEvent(this._staticBgHandler);
			this.$config.rowStore = null;
		}

		this.callEvent("onDestroy", []);
		this.detachAllEvents();
	}
};

export default Grid;
