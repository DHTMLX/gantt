import ScaleHelper from "./scales_ignore";
import eventable from "../../../utils/eventable";
import * as utils from "../../../utils/utils";
import * as helpers from "../../../utils/helpers";
import topPositionMixin from "../row_position_mixin";
import canvasRender from "./tasks_canvas_render";
import createLayerConfig from "./timeline_layers";

var Timeline = function(parent, config, factory, gantt){
	this.$config = utils.mixin({}, config || {});
	this.$scaleHelper = new ScaleHelper(gantt);
	this.$gantt = gantt;
	this._posFromDateCache = {};
	this._posFromWorkTimeCache = {};
	this._timelineDragScroll = null;
	utils.mixin(this, topPositionMixin(this));
	eventable(this);
};

Timeline.prototype = {
	init: function(container) {
		container.innerHTML += "<div class='gantt_task' style='width:inherit;height:inherit;'></div>";
		this.$task = container.childNodes[0];

		this.$task.innerHTML = "<div class='gantt_task_scale' " + this.$gantt._waiAria.getTimelineScaleContainerAttr() + "></div><div class='gantt_data_area'></div>";
		this.$task_scale = this.$task.childNodes[0];

		this.$task_data = this.$task.childNodes[1];
		const taskBg = "<div class='gantt_task_bg'></div>";
		const links = "<div class='gantt_links_area'></div>";
		const taskBars = "<div class='gantt_bars_area'></div>";

		const taskConstraints = "<div class='gantt_task_constraints'></div>";
		const taskDeadlines = "<div class='gantt_task_deadlines'></div>";
		const taskBaselines = "<div class='gantt_task_baselines'></div>";
		const taskLevelingDelays = "<div class='gantt_task_leveling_delays'></div>";

		this.$task_data.innerHTML = taskBg + taskBaselines + links + taskBars + taskConstraints + taskDeadlines + taskLevelingDelays;

		this.$task_bg = this.$task_data.childNodes[0];
		this.$task_baselines = this.$task_data.childNodes[1];
		this.$task_links = this.$task_data.childNodes[2];
		this.$task_bars = this.$task_data.childNodes[3];
		this.$task_constraints = this.$task_data.childNodes[4];
		this.$task_deadlines = this.$task_data.childNodes[5];
		this.$task_leveling_delays = this.$task_data.childNodes[6];

		if(this.$config.bind === this.$gantt.config.resource_store){
			this.$gantt._waiAria.resourceTimelineAttr(this.$task_bars);
		}

		this._tasks = {
			col_width: 0,
			width: [], // width of each column
			full_width: 0, // width of all columns
			trace_x: [],
			rendered: {}
		};

		var config = this.$getConfig();
		var attr = config[this.$config.bind + "_attribute"];
		var linksAttr = config[this.$config.bindLinks + "_attribute"];
		if(!attr && this.$config.bind){
			attr = "data-" + this.$config.bind + "-id";
		}
		if(!linksAttr && this.$config.bindLinks){
			linksAttr = "data-" + this.$config.bindLinks + "-id";
		}
		this.$config.item_attribute = attr || null;
		this.$config.link_attribute = linksAttr || null;

		var layers = this._createLayerConfig();
		if(!this.$config.layers){
			this.$config.layers = layers.tasks;
		}
		if(!this.$config.linkLayers){
			this.$config.linkLayers = layers.links;
		}

		this._attachLayers(this.$gantt);

		this.callEvent("onReady", []);
		//this.refresh();
		if (this.$gantt.ext.dragTimeline) {
			this._timelineDragScroll = this.$gantt.ext.dragTimeline.create();
			this._timelineDragScroll.attach(this);
		}
	},

	setSize: function(width, height){
		var config = this.$getConfig();

		if(width*1 === width){
			this.$config.width = width;
		}
		if(height*1 === height){

			this.$config.height = height;
			var dataHeight = Math.max(this.$config.height - config.scale_height);
			this.$task_data.style.height = dataHeight + 'px';
		}

		this.refresh();
		this.$task_bg.style.backgroundImage = "";

		if(config.smart_rendering && this.$config.rowStore){
			this.$task_bg.style.height = this.getTotalHeight() +"px";
		}else{
			this.$task_bg.style.height = "";
		}

		var scale = this._tasks;
		//timeline area layers
		var data_els = this.$task_data.childNodes;
		for(var i= 0, len = data_els.length; i < len; i++){
			var el = data_els[i];
			if(el.hasAttribute("data-layer") && el.style)
				el.style.width = scale.full_width + "px";
		}
	},

	isVisible: function(){
		if(this.$parent && this.$parent.$config){
			return !this.$parent.$config.hidden;
		}else{
			return this.$task.offsetWidth;
		}
	},

	getSize: function(){
		var config = this.$getConfig();
		var store = this.$config.rowStore;

		var contentHeight = store ? this.getTotalHeight() : 0,
			contentWidth = this.isVisible() ? this._tasks.full_width : 0;

		return {
			x: this.isVisible() ? this.$config.width : 0,
			y: this.isVisible() ? this.$config.height : 0,
			contentX: this.isVisible() ? contentWidth : 0,
			contentY: this.isVisible() ? (config.scale_height + contentHeight) : 0,
			scrollHeight: this.isVisible() ? contentHeight : 0,
			scrollWidth: this.isVisible() ? contentWidth : 0
		};
	},

	scrollTo: function(left, top){
		if(!this.isVisible())
			return;

		var scrolled = false;

		this.$config.scrollTop = this.$config.scrollTop || 0;
		this.$config.scrollLeft = this.$config.scrollLeft || 0;
		if(top*1 === top){
			this.$config.scrollTop = top;
			this.$task_data.scrollTop = this.$config.scrollTop;
			scrolled = true;
		}
		if (left*1 === left){
			this.$task.scrollLeft = left;
			this.$config.scrollLeft = this.$task.scrollLeft;
			this._refreshScales();
			scrolled = true;
		}

		if(scrolled){
			this.callEvent("onScroll", [this.$config.scrollLeft, this.$config.scrollTop]);
		}
	},

	_refreshScales: function _refreshScales() {
		if(!this.isVisible())
			return;

		var config = this.$getConfig();
		if (!config.smart_scales) return;

		var viewPort = this.getViewPort();

		var scales = this._scales;
		this.$task_scale.innerHTML = this._getScaleChunkHtml(scales, viewPort.x, viewPort.x_end);
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

	_createLayerConfig: createLayerConfig,

	_attachLayers: function(gantt){
		this._taskLayers = [];
		this._linkLayers = [];

		var self = this;

		var layers = this.$gantt.$services.getService("layers");

		if(this.$config.bind){

			this._bindStore();
			var taskRenderer = layers.getDataRender(this.$config.bind);

			if(!taskRenderer){
				taskRenderer = layers.createDataRender({
					name: this.$config.bind,
					defaultContainer: function(){ return self.$task_data;}
				});
			}

			taskRenderer.container = function(){ return self.$task_data;};

			var taskLayers = this.$config.layers;
			for(var i = 0; taskLayers && i < taskLayers.length; i++){
				var layer = taskLayers[i];

				if(typeof layer == "string"){
					layer = this.$gantt.$ui.layers[layer]();
				}

				if(typeof layer == "function" || (layer && layer.render && layer.update)){
					layer = {renderer: layer};
				}

				layer.view = this;

				var bar_layer = taskRenderer.addLayer(layer);
				this._taskLayers.push(bar_layer);
				if(layer.expose){
					this._taskRenderer = taskRenderer.getLayer(bar_layer);
				}
			}

			this._initStaticBackgroundRender();
		}

		if(this.$config.bindLinks){
			self.$config.linkStore = self.$gantt.getDatastore(self.$config.bindLinks);

			var linkRenderer = layers.getDataRender(this.$config.bindLinks);

			if(!linkRenderer){
				linkRenderer = layers.createDataRender({
					name: this.$config.bindLinks,
					defaultContainer: function(){ return self.$task_data;}
				});
			}
			var linkLayers = this.$config.linkLayers;
			for(var i = 0; linkLayers && i < linkLayers.length; i++){

				if(typeof layer == "string"){
					layer = this.$gantt.$ui.layers[layer]();
				}

				var layer = linkLayers[i];
				layer.view = this;
			//	layer.getViewPort = getViewPort;
			//	subscribeSmartRender(layer);
				var linkLayer = linkRenderer.addLayer(layer);
				this._taskLayers.push(linkLayer);
				if(linkLayers[i].expose){
					this._linkRenderer = linkRenderer.getLayer(linkLayer);
				}
			}
		}
	},

	_initStaticBackgroundRender: function(){
		var self = this;
		var staticRender = canvasRender.create();
		var store = self.$config.rowStore;
		if(!store) return;

		this._staticBgHandler = store.attachEvent("onStoreUpdated", function(id, item, mode){
			if(id !== null) {
				return;
			}

			if(!self.isVisible())
				return;
			var config = self.$getConfig();
			if(config.static_background || config.timeline_placeholder) {
				var store = self.$gantt.getDatastore(self.$config.bind);
				var staticBgContainer = self.$task_bg_static;
				if(!staticBgContainer){
					staticBgContainer = document.createElement("div");
					staticBgContainer.className = "gantt_task_bg";
					self.$task_bg_static = staticBgContainer;
					if(self.$task_bg.nextSibling){
						self.$task_data.insertBefore(staticBgContainer, self.$task_bg.nextSibling);
					}else{
						self.$task_data.appendChild(staticBgContainer);
					}
				}
				if (store) {
					var staticBackgroundHeight = self.getTotalHeight();
					if (config.timeline_placeholder){
						staticBackgroundHeight = config.timeline_placeholder.height || self.$task_data.offsetHeight || 99999;
					}
					staticRender.render(staticBgContainer, config, self.getScale(), staticBackgroundHeight, self.getItemHeight(item ? item.id : null));
				}
			}else if(config.static_background){
				if(self.$task_bg_static && self.$task_bg_static.parentNode){
					self.$task_bg_static.parentNode.removeChild(self.$task_bg_static);
				}
			}
		});
		this.attachEvent("onDestroy", function () {
			staticRender.destroy();
		});
		this._initStaticBackgroundRender = function(){};//init once
	},

	_clearLayers: function(gantt){
		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);
		var linkRenderer = layers.getDataRender(this.$config.bindLinks);

		if (this._taskLayers) {
			for(var i = 0; i < this._taskLayers.length; i++){
				taskRenderer.removeLayer(this._taskLayers[i]);
			}
		}
		if (this._linkLayers) {
			for(var i = 0; i < this._linkLayers.length; i++){
				linkRenderer.removeLayer(this._linkLayers[i]);
			}
		}

		this._linkLayers = [];
		this._taskLayers = [];
	},

	_render_tasks_scales: function _render_tasks_scales() {
		var config = this.$getConfig();

		var scales_html = "",
			outer_width = 0,
			scale_height = 0;

		var state = this.$gantt.getState();

		if (this.isVisible()) {
			var helpers = this.$scaleHelper;
			var scales = this._getScales();
			scale_height = config.scale_height;

			var availWidth = this.$config.width;
			if(config.autosize == "x" || config.autosize == "xy"){
				availWidth = Math.max(config.autosize_min_width, 0);
			}

			var cfgs = helpers.prepareConfigs(scales, config.min_column_width, availWidth, scale_height - 1, state.min_date, state.max_date, config.rtl);
			var cfg = this._tasks = cfgs[cfgs.length - 1];
			this._scales = cfgs;
			this._posFromDateCache = {};
			this._posFromWorkTimeCache = {};

			if(this._tasks.projection && this._tasks.projection?.source === "fixedHours"){
				const calendarId = "timescale-projection-calendar";
				if(this.$gantt.getCalendar(calendarId)){
					this.$gantt.deleteCalendar(calendarId);
				}

				let {hours} = this._tasks.projection;
				this.$gantt.addCalendar({
					id:calendarId, 
					worktime: {
						hours: hours || this.$gantt.getCalendar("global")._worktime.hours.slice(),
						days: [ 1, 1, 1, 1, 1, 1 ,1]
					}
				});
			}

			scales_html = this._getScaleChunkHtml(cfgs, 0, this.$config.width);

			outer_width = cfg.full_width + "px";//cfg.full_width + (this._scroll_sizes().y ? scrollSizes.scroll_size : 0) + "px";
			scale_height += "px";
		}

		this.$task_scale.style.height = scale_height;

		this.$task_data.style.width =
			this.$task_scale.style.width = outer_width;

		this.$task_scale.innerHTML = scales_html;

	},

	_getScaleChunkHtml: function _get_scale_chunk_html (scales, fromPos, toPos) {
		var templates = this.$gantt.templates;
		var html = [];

		var css = templates.scale_row_class;
		for (var i = 0; i < scales.length; i++) {
			var cssClass = "gantt_scale_line";
			var tplClass = css(scales[i]);
			if (tplClass) {
				cssClass += " " + tplClass;
			}

			html.push("<div class=\"" + cssClass + "\" " + this.$gantt._waiAria.getTimelineScaleRowAttr() +
				" style=\"height:" + (scales[i].height) +
				"px;position:relative;line-height:" + (scales[i].height) + "px\">" + this._prepareScaleHtml(scales[i], fromPos, toPos, i) + "</div>");
		}

		return html.join("");
	},
	_prepareScaleHtml: function _prepare_scale_html(config, fromPos, toPos, index) {
		var globalConfig = this.$getConfig();
		var globalTemplates = this.$gantt.templates;

		var cells = [];
		var date = null, css = null;

		var content = config.format || config.template || config.date;

		if(typeof content === "string"){
			content = this.$gantt.date.date_to_str(content);
		}

		var startIndex = 0,
			endIndex = config.count;

		if (globalConfig.smart_scales && (!isNaN(fromPos) && !isNaN(toPos))) {
			startIndex = helpers.findBinary(config.left, fromPos);
			endIndex = helpers.findBinary(config.left, toPos) + 1;
		}

		css = config.css || function () {
			};
		if (!config.css && globalConfig.inherit_scale_class) {
			css = globalTemplates.scale_cell_class;
		}

		// GS-1188: sticky labels keep the value of a long cell inside the viewport.
		// Their offsets are relative to the current scroll position, and only smart scales
		// re-render the scale on scroll (see _refreshScales). With smart_scales disabled the whole
		// scale is rendered once, so viewport-relative offsets would freeze and hide the labels (GS-3393)
		const stickyLabels = !!globalConfig.smart_scales;
		const stickyConfig = (globalConfig.scales[index] || {}).sticky; // for old scale settings
		const viewPort = stickyLabels ? this.getViewPort() : null;
		const approxLabelWidth = 70;

		for (var i = startIndex; i < endIndex; i++) {
			if (!config.trace_x[i]) break;

			date = new Date(config.trace_x[i]);
			var value = content.call(this, date),
				width = config.width[i],
				height = config.height,
				left = config.left[i],
				style = "",
				template = "",
				cssclass = "";

			if (width) {
				var position = globalConfig.smart_scales ? ("position:absolute;left:" + left + "px") : "";

				style = "width:" + (width) + "px;" + position;

				let labelPosition = '';
				// if sticky config is not specified - sticky labels are enabled for long cells only
				if (stickyLabels && ((stickyConfig !== false && width > approxLabelWidth) || stickyConfig === true)) {

					if (left < viewPort.x && left + width/2 - approxLabelWidth/2 < viewPort.x){
						labelPosition = ` style='position:absolute;left: ${viewPort.x  - left + 10}px;' `;
					} else if(left + width/2 + approxLabelWidth/2 > viewPort.x_end && width > approxLabelWidth){
						let labelPos = viewPort.x_end - left - 10;
						let translateValue = "-100%";
						if(labelPos < approxLabelWidth) {
							labelPos = approxLabelWidth;
							translateValue = `-${labelPos}px`;
						}
						labelPosition = ` style='position:absolute;left: ${labelPos}px;transform: translate(${translateValue},0);' `;
					}
				}
				cssclass = "gantt_scale_cell" + (i == config.count - 1 ? " gantt_last_cell" : "");

				template = css.call(this, date);
				if (template) cssclass += " " + template;

				var ariaAttr = this.$gantt._waiAria.getTimelineCellAttr(value, date, config);
				var cell = `<div class='${cssclass}' ${ariaAttr} style='${style}'><span ${labelPosition}>${value}</span></div>`;
				cells.push(cell);
			} else {
				//do not render ignored cells
			}

		}
		return cells.join("");
	},
	_getPositioningContext: function(task) {
		if(this._tasks.unit === this.$gantt.config.duration_unit){
			return null;
		}

		if(this._tasks.unit !== "day" && this._tasks.unit !== "week"){
			return null;
		}

		if(!this._tasks.projection){
			return null;
		}

		const {source} = this._tasks.projection || {};
		if(source === "taskCalendar"){

			if(!task){
				return {
					calendar: this.$gantt.getCalendar("global")
				};
			}
			return {
				calendar: this.$gantt.getTaskCalendar(task)
			};
		}
		if(source === "fixedHours"){
			return {
				calendar: this.$gantt.getCalendar("timescale-projection-calendar")
			};
		}

		return null;
	},

	dateFromPos: function dateFromPos(x, context) {
		var scale = this._tasks;
		if (x < 0 || x > scale.full_width || !scale.full_width) {
			return null;
		}

		var ind = helpers.findBinary(this._tasks.left, x);
		var summ = this._tasks.left[ind];

		var col_width = scale.width[ind] || scale.col_width;
		var part = 0;
		if (col_width) {
			part = (x - summ) / col_width;
			if(scale.rtl){
				part = 1 - part;
			}

		}

		const calendar = (context ? context.calendar : null) || null;

		var unit = 0;
		if (part) {
			unit = this._getColumnDuration(scale, scale.trace_x[ind]);
		}

		const cellStartDate = scale.trace_x[ind];

		const absolutePositionDate = new Date(scale.trace_x[ind].valueOf() + Math.round(part * unit));

		if(!calendar){

			return absolutePositionDate;
		}

		const {start: trimStartSec, end: cellEnd, duration: cellDuration, intervals} = this._getWorkTrimForCell(cellStartDate, calendar);

		if(cellDuration <= 0){
			return absolutePositionDate;
		}

		const secondsInsideTrim = Math.round(part * cellDuration);
		const mappedTimestampMs = cellStartDate.valueOf() + (trimStartSec + secondsInsideTrim) * 1000;

		return new Date(mappedTimestampMs);
	},

	posFromDate: function posFromDate(date, context) {
		if (!this.isVisible())
			return 0;

		if(!date){
			return 0;
		}

		if(context && context.calendar){
			return this.posFromWorkTime(date, context);
		}

		var dateValue = String(date.valueOf());

		if(this._posFromDateCache[dateValue] !== undefined){
			return this._posFromDateCache[dateValue];
		}
		var ind = this.columnIndexByDate(date);
		this.$gantt.assert(ind >= 0, "Invalid day index");

		var wholeCells = Math.floor(ind);
		var partCell = ind % 1;

		var pos = this._tasks.left[Math.min(wholeCells, this._tasks.width.length - 1)];
		if (wholeCells == this._tasks.width.length)
			pos += this._tasks.width[this._tasks.width.length - 1];
		//for(var i=1; i <= wholeCells; i++)
		//	pos += gantt._tasks.width[i-1];

		if (partCell) {
			if (wholeCells < this._tasks.width.length) {
				pos += this._tasks.width[wholeCells] * (partCell % 1);
			} else {
				pos += 1;
			}

		}

		var roundPos = Math.round(pos);
		this._posFromDateCache[dateValue] = roundPos;
		return Math.round(roundPos);
	},

	_getWorkTrimForCell: function (cellStartDate, calendar) {
		const cellDurationMs = this._getColumnDuration(this._tasks, cellStartDate);
		const cellEndDate = new Date(cellStartDate.valueOf() + cellDurationMs);

		let earliestWorkSecondInCell = null;
		let latestWorkSecondInCell = null;
		const intervalsSinceCellStart = [];

		for (let dayDate = new Date(cellStartDate), dayIndex = 0;
			dayDate < cellEndDate;
			dayDate = this.$gantt.date.add(dayDate, 1, "day"), dayIndex++) {

			const dayIntervals = calendar._getWorkHours(dayDate) || [];

			const dayStartOffsetSeconds = Math.round((dayDate - cellStartDate) / 1000);

			for (let i = 0; i < dayIntervals.length; i++) {
				const absoluteStartSeconds = dayStartOffsetSeconds + dayIntervals[i].start;
				const absoluteEndSeconds   = dayStartOffsetSeconds + dayIntervals[i].end;

				intervalsSinceCellStart.push({
					start: absoluteStartSeconds,
					end: absoluteEndSeconds
				});

				if (earliestWorkSecondInCell === null || absoluteStartSeconds < earliestWorkSecondInCell) {
					earliestWorkSecondInCell = absoluteStartSeconds;
				}
				if (latestWorkSecondInCell === null || absoluteEndSeconds > latestWorkSecondInCell) {
					latestWorkSecondInCell = absoluteEndSeconds;
				}
			}
		}

		if (
			earliestWorkSecondInCell === null ||
			latestWorkSecondInCell === null ||
			latestWorkSecondInCell <= earliestWorkSecondInCell
		) {
			return { start: 0, end: 0, duration: 0, intervals: [] };
		}

		return {
			start: earliestWorkSecondInCell,
			end: latestWorkSecondInCell,
			duration: latestWorkSecondInCell - earliestWorkSecondInCell,
			intervals: intervalsSinceCellStart
		};
	},

	posFromWorkTime: function (date, {calendar}) {
		if (!this.isVisible())
			return 0;
		if (!date) {
			return 0;
		}

		if(!calendar){
			return this.posFromDate(date);
		}

		const cacheKey = (calendar ? calendar.id : "") + String(date.valueOf());
		if (this._posFromWorkTimeCache[cacheKey] !== undefined) {
			return this._posFromWorkTimeCache[cacheKey];
		}

		const index = this.columnIndexByDate(date);
		this.$gantt.assert(index >= 0, "Invalid day index");

		const dayIndex = Math.floor(index);	
		const wholeCells = dayIndex;

		const {start: workintervalStart, end: workintervalEnd, duration: cellDuration} = this._getWorkTrimForCell(date, calendar);

		if(cellDuration === 0){
			const result = this.posFromDate(date);
		//	this._posFromWorkTimeCache[cacheKey] = result;
			return result;
		}

		const cellStart = this._tasks.trace_x[dayIndex];
		const dateOffset = (date - cellStart) / 1000; // in seconds

		let fraction = 0;
		if(dateOffset <= workintervalStart){
			fraction = 0;
		} else if(dateOffset >= workintervalEnd){
			fraction = 1;
		} else {
			fraction = (dateOffset - workintervalStart) / cellDuration;
		}

		if(this._tasks.rtl){
			fraction = 1 - fraction;
		}

		const posLeft = this._tasks.left[Math.min(wholeCells, this._tasks.width.length - 1)];

		const cellWidth = (wholeCells < this._tasks.width.length)
			? this._tasks.width[wholeCells]
			: this._tasks.width[this._tasks.width.length - 1];
	
		const pos = Math.round(posLeft + cellWidth * fraction);
	//	this._posFromWorkTimeCache[cacheKey] = pos;

		return pos;
	},


	_getNextVisibleColumn: function (startIndex, columns, ignores) {
		// iterate columns to the right
		var date = +columns[startIndex];
		var visibleDateIndex = startIndex;
		while (ignores[date]) {
			visibleDateIndex++;
			date = +columns[visibleDateIndex];
		}

		return visibleDateIndex;
	},
	_getPrevVisibleColumn: function (startIndex, columns, ignores) {
		// iterate columns to the left
		var date = +columns[startIndex];
		var visibleDateIndex = startIndex;
		while (ignores[date]) {
			visibleDateIndex--;
			date = +columns[visibleDateIndex];
		}
		return visibleDateIndex;
	},
	_getClosestVisibleColumn: function (startIndex, columns, ignores) {
		var visibleDateIndex = this._getNextVisibleColumn(startIndex, columns, ignores);
		if (!columns[visibleDateIndex]) {
			visibleDateIndex =  this._getPrevVisibleColumn(startIndex, columns, ignores);
		}
		return visibleDateIndex;
	},
	columnIndexByDate: function columnIndexByDate(date) {
		var pos = new Date(date).valueOf();
		var days = this._tasks.trace_x_ascending,
			ignores = this._tasks.ignore_x;

		var state = this.$gantt.getState();

		if (pos <= state.min_date) {
			if(this._tasks.rtl){
				return days.length;
			}else{
				return 0;
			}

		}

		if (pos >= state.max_date) {
			if(this._tasks.rtl){
				return 0;
			}else{
				return days.length;
			}
		}

		var dateIndex = helpers.findBinary(days, pos);

		var visibleIndex = this._getClosestVisibleColumn(dateIndex, days, ignores);
		var visibleDate = days[visibleIndex];
		var transition = this._tasks.trace_index_transition;

		if(!visibleDate){
			if(transition){
				return transition[0];
			}else{
				return 0;
			}
		}

		var part = ((date - days[visibleIndex]) / this._getColumnDuration(this._tasks, days[visibleIndex]));
		if(transition){
			return transition[visibleIndex] + (1 - part);
		}else{
			return visibleIndex + part;
		}
	},
	getItemPosition:function (task, start_date, end_date) {
		var xLeft, xRight, width;

		let displayStart = start_date || task.start_date || task.$auto_start_date;
		let displayEnd = end_date || task.end_date || task.$auto_end_date;

		const context = this._getPositioningContext(task);
		if(context && context.calendar) {

			if(this._tasks.rtl){
				xRight = this.posFromWorkTime(displayStart, context);
				xLeft = this.posFromWorkTime(displayEnd, context);
			}else{
				xLeft = this.posFromWorkTime(displayStart, context);
				xRight = this.posFromWorkTime(displayEnd, context);
			}
		}else{
			if(this._tasks.rtl){
				xRight = this.posFromDate(displayStart);
				xLeft = this.posFromDate(displayEnd);
			}else{
				xLeft = this.posFromDate(displayStart);
				xRight = this.posFromDate(displayEnd);
			}
		}

		width =  Math.max((xRight - xLeft), 0);

		var y = this.getItemTop(task.id);

		var height = this.getBarHeight(task.id);
		var rowHeight = this.getItemHeight(task.id);
		return {
			left: xLeft,
			top: y,
			height: height,
			width: width,
			rowHeight: rowHeight
		};
	},

	getBarHeight: function(taskId, isMilestoneRender){
		var config = this.$getConfig();

		var task = this.$config.rowStore.getItem(taskId);
		// height of the bar item
		var height = task.task_height || task.bar_height || config.bar_height || config.task_height;
		var rowHeight = this.getItemHeight(taskId);

		if (height == "full") {
			var offset = config.bar_height_padding || 3;
			height = rowHeight - offset;
		}
		//item height cannot be bigger than row height
		height = Math.min(height, rowHeight);
		if (isMilestoneRender) { // to get correct height for addapting Milestone to the row
			height = Math.round(height / Math.sqrt(2));
		}
		return Math.max(height, 0);
	},

	getScale: function(){
		return this._tasks;
	},

	_getScales: function _get_scales() {
		var config = this.$getConfig();
		var helpers = this.$scaleHelper;
		var scales = [helpers.primaryScale(config)].concat(helpers.getAdditionalScales(config));

		helpers.sortScales(scales);
		return scales;
	},

	_getColumnDuration: function _get_coll_duration(scale, date) {
		return this.$gantt.date.add(date, scale.step, scale.unit) - date;
	},
	_bindStore: function () {
		if (this.$config.bind){
			var rowStore = this.$gantt.getDatastore(this.$config.bind);
			this.$config.rowStore = rowStore;
			if(rowStore && !rowStore._timelineCacheAttached){
				var self = this;
				rowStore._timelineCacheAttached = rowStore.attachEvent("onBeforeFilter", function(){
					self._resetTopPositionHeight();
				});
			}
		}
	},
	_unbindStore: function(){
		if (this.$config.bind){
			var rowStore = this.$gantt.getDatastore(this.$config.bind);
			if(rowStore && rowStore._timelineCacheAttached){
				rowStore.detachEvent(rowStore._timelineCacheAttached);
				rowStore._timelineCacheAttached = false;
			}
		}
	},
	refresh: function(){
		this._bindStore();

		if(this.$config.bindLinks) {
			this.$config.linkStore = this.$gantt.getDatastore(this.$config.bindLinks);
		}

		this._resetTopPositionHeight();
		this._resetHeight();
		this._initStaticBackgroundRender();
		this._render_tasks_scales();
	},

	destructor: function(){
		var gantt = this.$gantt;
		this._clearLayers(gantt);
		this._unbindStore();
		this.$task = null;
		this.$task_scale = null;
		this.$task_data = null;
		this.$task_bg = null;
		this.$task_links = null;
		this.$task_bars = null;

		this.$gantt = null;

		if(this.$config.rowStore){
			this.$config.rowStore.detachEvent(this._staticBgHandler);
			this.$config.rowStore = null;
		}
		if(this.$config.linkStore){
			this.$config.linkStore = null;
		}

		if(this._timelineDragScroll) {
			this._timelineDragScroll.destructor();
			this._timelineDragScroll = null;
		}

		this.callEvent("onDestroy", []);
		this.detachAllEvents();

	}
};

export default Timeline;