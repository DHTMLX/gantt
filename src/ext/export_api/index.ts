/* eslint-disable */

import ScaleHelper from "../../core/ui/timeline/scales_ignore";
import * as helpers from "../../utils/helpers";

export default function(gantt: any) {

	gantt.ext = gantt.ext || {};

	gantt.ext.export_api = gantt.ext.export_api || {

		_apiUrl: "https://export.dhtmlx.com/gantt",

		_preparePDFConfigRaw(config:any, type:any){
			let previousDateRage:any = null;
			if (config.start && config.end){
				previousDateRage = {
					start_date: gantt.config.start_date,
					end_date: gantt.config.end_date,
				};
				gantt.config.start_date = gantt.date.str_to_date(gantt.config.date_format)(config.start);
				gantt.config.end_date = gantt.date.str_to_date(gantt.config.date_format)(config.end);
			}

			config = gantt.mixin(config, {
				name: "gantt." + type, data: gantt.ext.export_api._serializeHtml()
			});

			if (previousDateRage){
				gantt.config.start_date = previousDateRage.start_date;
				gantt.config.end_date = previousDateRage.end_date;
			}
		},

		_prepareConfigPDF(config:any, type:any){
			config = gantt.mixin((config || {}), {
				name: "gantt." + type,
				data: gantt.ext.export_api._serializeAll(),
				config: gantt.config
			});
			gantt.ext.export_api._fixColumns(config.config.columns);
			return config;
		},

		_pdfExportRouter(config:any, type:any){
			if (config && config.raw) {
				gantt.ext.export_api._preparePDFConfigRaw(config, type);
			} else {
				config = gantt.ext.export_api._prepareConfigPDF(config, type);
			}
			config.version = gantt.version;
			gantt.ext.export_api._sendToExport(config, type);
		},

		exportToPDF(config:any) {
			gantt.ext.export_api._pdfExportRouter(config, "pdf");
		},

		exportToPNG(config:any) {
			gantt.ext.export_api._pdfExportRouter(config, "png");
		},


		exportToICal(config:any) {
			config = gantt.mixin((config || {}), {
				name: "gantt.ical",
				data: gantt.ext.export_api._serializePlain().data,
				version: gantt.version
			});
			gantt.ext.export_api._sendToExport(config, "ical");
		},

		exportToExcel(config:any) {
			config = config || {};

			let dates: any = [];
			let state;
			let scroll;
			// GS-2124, we need to get all task nodes to correctly obtain the colors
			const smartRendering = gantt.config.smart_rendering;
			if (config.visual === "base-colors"){
				gantt.config.smart_rendering = false;
			}

			if (config.start || config.end) {
				state = gantt.getState();
				dates = [gantt.config.start_date, gantt.config.end_date];
				scroll = gantt.getScrollState();
				const convert = gantt.date.str_to_date(gantt.config.date_format);

				if (config.start){
					gantt.config.start_date = convert(config.start);
				}
				if (config.end){
					gantt.config.end_date = convert(config.end);
				}

				gantt.render();
				gantt.config.smart_rendering = smartRendering;
			} else if (config.visual === "base-colors"){
				gantt.render();
				gantt.config.smart_rendering = smartRendering;
			}

			config = gantt.mixin(config, {
				name: "gantt.xlsx",
				title: "Tasks",
				data: gantt.ext.export_api._serializeTimeline(config),
				columns: gantt.ext.export_api._serializeGrid({ raw: config.raw, rawDates: true }),
				version: gantt.version
			}, true);

			if (config.visual){
				config.scales = gantt.ext.export_api._serializeScales(config);
			}

			gantt.ext.export_api._sendToExport(config, "excel");

			if (config.start || config.end) {
				gantt.config.start_date = state.min_date;
				gantt.config.end_date = state.max_date;

				gantt.render();
				gantt.scrollTo(scroll.x, scroll.y);

				gantt.config.start_date = dates[0];
				gantt.config.end_date = dates[1];
			}
		},

		exportToJSON(config:any) {
			config = gantt.mixin((config || {}), {
				name: "gantt.json",
				data: gantt.ext.export_api._serializeAll(),
				config: gantt.config,
				columns: gantt.ext.export_api._serializeGrid(),
				worktime: gantt.ext.export_api._getWorktimeSettings(),
				version: gantt.version
			});
			gantt.ext.export_api._sendToExport(config, "json");
		},


		importFromExcel(config:any) {
			try {
				const formData = config.data;
				if (formData instanceof File) {
					const data = new FormData();
					data.append("file", formData);
					config.data = data;
				}
			} catch (error) {}
			gantt.ext.export_api._sendImportAjaxExcel(config);
		},

		importFromMSProject(config:any) {
			const formData = config.data;
			try {
				if (formData  instanceof File) {
					const data = new FormData();
					data.append("file", formData);
					config.data = data;
				}
			} catch (error) {}
			gantt.ext.export_api._sendImportAjaxMSP(config);
		},

		importFromPrimaveraP6(config:any) {
			config.type = "primaveraP6-parse";
			return gantt.importFromMSProject(config);
		},

		exportToMSProject(config:any) {
			config = config || {};
			config.skip_circular_links = config.skip_circular_links === undefined ? true : !!config.skip_circular_links;

			const oldXmlFormat = gantt.templates.xml_format;
			const oldFormatDate = gantt.templates.format_date;
			const oldXmlDate = gantt.config.xml_date;
			const oldDateFormat = gantt.config.date_format;

			const exportServiceDateFormat = "%d-%m-%Y %H:%i:%s";

			gantt.config.xml_date = exportServiceDateFormat;
			gantt.config.date_format = exportServiceDateFormat;
			gantt.templates.xml_format = gantt.date.date_to_str(exportServiceDateFormat);
			gantt.templates.format_date = gantt.date.date_to_str(exportServiceDateFormat);
			const data = gantt.ext.export_api._serializeAll();

			gantt.ext.export_api._customProjectProperties(data, config);

			gantt.ext.export_api._customTaskProperties(data, config);

			if (config.skip_circular_links) {
				gantt.ext.export_api._clearRecLinks(data);
			}

			config = gantt.ext.export_api._exportConfig(data, config);

			gantt.ext.export_api._sendToExport(config, config.type || "msproject");
			gantt.config.xml_date = oldXmlDate;
			gantt.config.date_format = oldDateFormat;
			gantt.templates.xml_format = oldXmlFormat;
			gantt.templates.format_date = oldFormatDate;

			gantt.config.$custom_data = null;
			gantt.config.custom = null;
		},

		exportToPrimaveraP6(config:any) {
			config = config || {};
			config.type = "primaveraP6";
			return gantt.exportToMSProject(config);
		},

		_fixColumns(columns:any) {
			for (let i = 0; i < columns.length; i++) {
				columns[i].label = columns[i].label || gantt.locale.labels["column_" + columns[i].name];
				if (typeof columns[i].width === "string") {
					columns[i].width = columns[i].width * 1;
				}
			}
		},

		_xdr(url:any, pack:any, cb:any) {
			gantt.ajax.post(url, pack, cb);
		},

		_markColumns(base:any) {
			const columns = base.config.columns;
			if (columns){
				for (let i = 0; i < columns.length; i++) {
					if (columns[i].template){
						columns[i].$template = true;
					}
				}
			}
		},


		_sendImportAjaxExcel(config:any) {
			const url = config.server || gantt.ext.export_api._apiUrl;
			const store = config.store || 0;
			const formData = config.data;
			const callback = config.callback;

			formData.append("type", "excel-parse");
			formData.append("data", JSON.stringify({
				sheet: config.sheet || 0
			}));

			if (store){
				formData.append("store", store);
			}

			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState === 4 && xhr.status === 0) {// network error
					if (callback) {
						callback(null);
					}
				}
			};

			xhr.onload = function() {
				const fail = xhr.status > 400;
				let info = null;

				if (!fail) {
					try {
						info = JSON.parse(xhr.responseText);
					} catch (e) { }
				}

				if (callback) {
					callback(info);
				}
			};

			xhr.open("POST", url, true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.send(formData);
		},


		_ajaxToExport(data:any, type:any, callback:any) {
			delete data.callback;

			const url = data.server || gantt.ext.export_api._apiUrl;
			const pack = "type=" + type + "&store=1&data=" + encodeURIComponent(JSON.stringify(data));

			const cb = function(loader:any) {
				const xdoc = loader.xmlDoc || loader;
				const fail = xdoc.status > 400;
				let info = null;

				if (!fail) {
					try {
						info = JSON.parse(xdoc.responseText);
					} catch (e) { }
				}
				callback(info);
			};

			gantt.ext.export_api._xdr(url, pack, cb);
		},
		_serializableGanttConfig(config:any) {
			const result = gantt.mixin({}, config);

			if (result.columns) {
				result.columns = result.columns.map(function(col:any) {
					const copy = gantt.mixin({}, col);
					delete copy.editor;
					return copy;
				});
			}

			delete result.editor_types;

			// The ext/toolbar plugin injects a { view: "toolbar" } layout cell, but
			// the export worker's gantt does not register that view. Strip any
			// toolbar cell from a DEEP copy of the layout (never the live config),
			// then unwrap the single-child wrapper the auto-injection introduced.
			if (result.layout) {
				const stripToolbar = function(node:any):any {
					if (!node || typeof node !== "object") {
						return node;
					}
					["rows", "cols", "views"].forEach(function(key) {
						if (Array.isArray(node[key])) {
							node[key] = node[key]
								.filter(function(cell:any) { return !(cell && cell.view === "toolbar"); })
								.map(stripToolbar);
						}
					});
					return node;
				};
				let layout = stripToolbar(gantt.copy(result.layout));
				if (layout && Array.isArray(layout.rows) && layout.rows.length === 1 && !layout.cols) {
					const only = layout.rows[0];
					if (only && (only.rows || only.cols)) {
						if (layout.css && !only.css) {
							only.css = layout.css;
						}
						layout = only;
					}
				}
				result.layout = layout;
			}

			return result;
		},

		_sendToExport(data:any, type:any) {
			const convert = gantt.date.date_to_str(gantt.config.date_format || gantt.config.xml_date);
			if(!data.skin){
				data.skin = gantt.skin;
			}
			if (data.config) {
				data.config = gantt.copy(gantt.ext.export_api._serializableGanttConfig(data.config));
				gantt.ext.export_api._markColumns(data, type);

				if (data.config.start_date && data.config.end_date) {
					if (data.config.start_date instanceof Date) {
						data.config.start_date = convert(data.config.start_date);
					}
					if (data.config.end_date instanceof Date) {
						data.config.end_date = convert(data.config.end_date);
					}
				}
			}

			if (data.callback) {
				return gantt.ext.export_api._ajaxToExport(data, type, data.callback);
			}

			const form = gantt.ext.export_api._createHiddenForm();
			form.firstChild.action = data.server || gantt.ext.export_api._apiUrl;
			form.firstChild.childNodes[0].value = JSON.stringify(data);
			form.firstChild.childNodes[1].value = type;
			form.firstChild.submit();
		},

		_createHiddenForm() {
			if (!gantt.ext.export_api._hidden_export_form) {
				const t = gantt.ext.export_api._hidden_export_form = document.createElement("div");
				t.style.display = "none";
				t.innerHTML = "<form method='POST' target='_blank'><textarea name='data' style='width:0px; height:0px;' readonly='true'></textarea><input type='hidden' name='type' value=''></form>";
				document.body.appendChild(t);
			}
			return gantt.ext.export_api._hidden_export_form;
		},


		_copyObjectBase(obj: any) {
			const copy: any = {
				start_date: undefined,
				end_date: undefined,
				constraint_date: undefined,
				deadline: undefined
			};
			for (const key in obj) {
				if (key.charAt(0) === "$" || key === "baselines"){
					continue;
				}
				copy[key] = obj[key];
			}
			const formatDate = gantt.templates.xml_format || gantt.templates.format_date;

			copy.start_date = formatDate(copy.start_date);
			if (copy.end_date){
				copy.end_date = formatDate(copy.end_date);
			}
			if (copy.constraint_date){
				copy.constraint_date = formatDate(copy.constraint_date);
			}
			if (copy.deadline){
				copy.deadline = formatDate(copy.deadline);
			}

			return copy;
		},


		_color_box: null,
		_color_hash: {},

		_getStyles(css:any) {
			if (!gantt.ext.export_api._color_box) {
				gantt.ext.export_api._color_box = document.createElement("DIV");
				gantt.ext.export_api._color_box.style.cssText = "position:absolute; display:none;";
				document.body.appendChild(gantt.ext.export_api._color_box);
			}
			if (gantt.ext.export_api._color_hash[css]){
				return gantt.ext.export_api._color_hash[css];
			}

			gantt.ext.export_api._color_box.className = css;
			const color = gantt.ext.export_api._getColor(gantt.ext.export_api._color_box, "color");
			const backgroundColor = gantt.ext.export_api._getColor(gantt.ext.export_api._color_box, "backgroundColor");
			return (gantt.ext.export_api._color_hash[css] = color + ";" + backgroundColor);
		},


		_getMinutesWorktimeSettings(parsedRanges:any) {
			const minutes:any = [];
			parsedRanges.forEach(function(range:any) {
				minutes.push(range.startMinute);
				minutes.push(range.endMinute);
			});
			return minutes;
		},

		_getWorktimeSettings() {

			const defaultWorkTimes = {
				hours: [0, 24],
				minutes: null,
				dates: { 0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true }
			};

			let time: any;
			if (!gantt.config.work_time) {
				time = defaultWorkTimes;
			} else {
				if (gantt.config.worktimes && gantt.config.worktimes.global) {
					const settings = gantt.config.worktimes.global;

					if (settings.parsed) {
						const minutes = gantt.ext.export_api._getMinutesWorktimeSettings(settings.parsed.hours);
						time = {
							hours: null,
							minutes,
							dates: {}
						};
						for (const i in settings.parsed.dates) {
							if (Array.isArray(settings.parsed.dates[i])) {
								time.dates[i] = gantt.ext.export_api._getMinutesWorktimeSettings(settings.parsed.dates[i]);
							} else {
								time.dates[i] = settings.parsed.dates[i];
							}
						}
					} else {
						time = {
							hours: settings.hours,
							minutes: null,
							dates: settings.dates
						};
					}

				} else {
					time = defaultWorkTimes;
				}
			}

			return time;
		},

		_serializeCustomWeeks(customWeeks: any) {
			const formatDate = gantt.date.date_to_str("%Y-%m-%d");
			const result: any = {};

			for (const name in customWeeks) {
				const week = customWeeks[name];
				const copy = gantt.mixin({}, week);
				if (copy.from instanceof Date) {
					copy.fromDate = formatDate(copy.from);
				}
				if (copy.to instanceof Date) {
					copy.toDate = formatDate(copy.to);
				}
				result[name] = copy;
			}
			return result;
		},

		_serializeWorktimes(worktimes: any) {
			const result: any = {};
			for (const id in worktimes) {
				const calendar = worktimes[id];
				const copy = gantt.mixin({}, calendar);
				if (calendar.customWeeks) {
					copy.customWeeks = gantt.ext.export_api._serializeCustomWeeks(calendar.customWeeks);
				}

				result[id] = copy;
			}
			return result;
		},

		_eachTaskTimed(start:any, end:any) {
			return function(code:any, parent:any, master:any) {
				parent = parent || gantt.config.root_id;
				master = master || gantt;

				const branch = gantt.getChildren(parent);
				if (branch){
					for (let i = 0; i < branch.length; i++) {
						const item = gantt._pull[branch[i]];
						if ((!start || item.end_date > start) && (!end || item.start_date < end)){
							code.call(master, item);
						}

						if (gantt.hasChild(item.id)){
							gantt.eachTask(code, item.id, master);
						}
					}
				}
			};
		},

		_isTaskInsideTimeline(task:any) {
			if (!gantt.config.start_date || !gantt.config.end_date || gantt._isAllowedUnscheduledTask(task)){
				return true;
			}
			let startDate = task.start_date;
			let endDate = task.end_date;
			if (!startDate && !endDate){
				return false;
			}
			if (typeof startDate === "string"){
				startDate = gantt.date.str_to_date(gantt.config.date_format)(startDate);
			}
			if (typeof endDate === "string"){
				endDate = gantt.date.str_to_date(gantt.config.date_format)(endDate);
			}
			if (!startDate){
				startDate = gantt.calculateEndDate({start_date: endDate, duration: -task.duration, task});
			}
			if (!endDate){
				endDate = gantt.calculateEndDate({start_date: startDate, duration: task.duration, task});
			}
			return !(+endDate <= +gantt.config.start_date || +gantt.config.end_date <= +startDate);
		},

		// patch broken json serialization in gantt 2.1
		_originalCopyObject: gantt.json._copyObject,

		_copyObjectPlainICal(task: any) {
			const text = gantt.templates.task_text(task.start_date, task.end_date, task);

			const copy = gantt.ext.export_api._copyObjectBase(task);
			copy.text = text || copy.text;

			return copy;
		},

		_copyObjectPlainExcel(task: any) {
			const text = gantt.templates.task_text(task.start_date, task.end_date, task);

			const copy = gantt.json.serializeTask(task);
			copy.text = text || copy.text;

			// GS-3493. Keep internal properties that will be used later by the export module
			copy.$level = task.$level;
			copy.$rendered_type = task.$rendered_type;
			// GS-3499. Keep the date objects a they wil be converted to ISO format later
			copy.start_date = task.start_date;
			copy.end_date = task.end_date;

			return copy;
		},

		_getColor(node:any, style:any) {
			let value = node.currentStyle ? node.currentStyle[style] : getComputedStyle(node, null)[style];
			// if we get the black background color for the progress bar, 
			// most likely, it is the transparent color.
			// In that case, we need to confirm that and return the color of the task bar
			if (node.closest(".gantt_task_progress") && value === "rgba(0, 0, 0, 0.15)"){
				node = node.parentNode.parentNode;
				value = node.currentStyle ? node.currentStyle[style] : getComputedStyle(node, null)[style];
			}
			const rgb = value.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+)/i);
			return ((rgb && rgb.length === 4) ?
				("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : value).replace("#", "");
		},


		// excel serialization
		_copyObjectTable(obj:any) {
			// Excel interprets UTC time as local time in every timezone, send local time instead of actual UTC time.
			// https://github.com/SheetJS/js-xlsx/issues/126#issuecomment-60531614
			const toISOstring = gantt.date.date_to_str("%Y-%m-%dT%H:%i:%s.000Z");

			const copy = gantt.ext.export_api._copyObjectColumns(obj, gantt.ext.export_api._copyObjectPlainExcel(obj));
			if (copy.start_date){
				if (typeof copy.start_date === "string"){
					copy.original_start_date = gantt.date.str_to_date(gantt.config.date_format)(copy.start_date);
				} else {
					copy.original_start_date = copy.start_date;
					copy.start_date = toISOstring(obj.start_date);
				}
			}
			if (copy.end_date){
				if (typeof copy.end_date === "string"){
					copy.original_end_date = gantt.date.str_to_date(gantt.config.date_format)(copy.end_date);
				} else {
					copy.original_end_date = copy.end_date;
					copy.end_date = toISOstring(obj.end_date);
				}
			} else if (copy.original_start_date){
				copy.original_end_date = gantt.calculateEndDate({
					start_date: copy.original_start_date,
					duration: copy.duration,
					task: copy
				});
				copy.end_date = toISOstring(copy.original_end_date);
			}

			return copy;
		},

		_generatedScales: null,
		_generateScales(){
			const state = gantt.getState();
			const scaleHelper = ScaleHelper(gantt);
			const scales = [scaleHelper.primaryScale(gantt.config)].concat(scaleHelper.getAdditionalScales(gantt.config));

			const scalesConfig = scaleHelper.prepareConfigs(scales, gantt.config.min_column_width, 1000, gantt.config.scale_height - 1, state.min_date, state.max_date, gantt.config.rtl);
			gantt.ext.export_api._generatedScales = scalesConfig;
			return scalesConfig;
		},

		_getDayIndex (scales:any, date:any){
			let days = scales.trace_indexes
			if (days[+date]) {
				return days[+date]
			} else {
				days = scales.trace_x;
				const state = gantt.getState();

				if (+date <= state.min_date) {
					if (gantt.config.rtl) {
						return days.length;
					} else{
						return 0;
					}
				} else if (+date >= state.max_date) {
					if (gantt.config.rtl) {
						return 0;
					} else {
						return days.length;
					}
				}
				const index = helpers.findBinary(days, +date);
				return index;
			}
		},

		_copyObjectColors(obj:any, config:any) {
			const copy = gantt.ext.export_api._copyObjectTable(obj);

			let startDate = copy.original_start_date;
			let endDate = copy.original_end_date;

			let getDayIndex = gantt.columnIndexByDate;

			let scales;
			if (gantt.ext.export_api._generatedScales){ 
				const allScales = gantt.ext.export_api._generatedScales;
				scales = allScales[allScales.length - 1];

				copy.$start = gantt.ext.export_api._getDayIndex(scales, startDate);
				copy.$end = gantt.ext.export_api._getDayIndex(scales, endDate);
			} else {
				scales = gantt.getScale();
				copy.$start = getDayIndex.call(gantt, startDate);
				copy.$end = getDayIndex.call(gantt, endDate);
			}
			if (gantt.config.rtl) {
				const startIndex = copy.$start;
				copy.$start = copy.$end;
				copy.$end = startIndex;
			}

			// GS-2100. Correct bar position considering hidden cells
			let hiddenCells = 0;
			const scaleCellsWidth = scales.width;
			if (scaleCellsWidth.indexOf(0) > -1) {
				let i = 0;
				for (i; i < copy.$start; i++) {
					if (!scaleCellsWidth[i]) {
						hiddenCells++;
					}
				}
				copy.$start -= hiddenCells;

				for (i; i < copy.$end; i++) {
					if (!scaleCellsWidth[i]) {
						hiddenCells++;
					}
				}
				copy.$end -= hiddenCells;
			}

			copy.$level = obj.$level;
			copy.$type = obj.$rendered_type;

			const tmps = gantt.templates;
			copy.$text = tmps.task_text(obj.start, obj.end_date, obj);
			copy.$left = tmps.leftside_text ? tmps.leftside_text(obj.start, obj.end_date, obj) : "";
			copy.$right = tmps.rightside_text ? tmps.rightside_text(obj.start, obj.end_date, obj) : "";

			const node = gantt.getTaskNode && gantt.getTaskNode(obj.id);
			if (node && node.firstChild) {
				let targetNode = node;
				if (config.visual !== "base-colors" && copy.type !== gantt.config.types.milestone){
					targetNode = node.querySelector(".gantt_task_progress")
				}

				let color = gantt.ext.export_api._getColor(targetNode, "backgroundColor");
				if (color === "363636"){
					color = gantt.ext.export_api._getColor(node, "backgroundColor");
				}

				copy.$color = color;
			} else if (obj.color){
				copy.$color = obj.color;
			} else {
				const cellCss = gantt.templates.task_class(obj.start, obj.end, obj);
				if (cellCss){
					const styles = gantt.ext.export_api._getStyles(cellCss);
					copy.$color = styles.split(";")[1]
				}
			}

			return copy;
		},

		_copyObjectColumns(obj:any, copy:any) {
			for (let i = 0; i < gantt.config.columns.length; i++) {
				const ct = gantt.config.columns[i].template;
				if (ct) {
					let val = ct(obj);
					if (val instanceof Date){
						val = gantt.templates.date_grid(val, obj);
					}
					copy["_" + i] = val;
				}
			}
			return copy;
		},

		_copyObjectAll(obj:any) {
			const copy = gantt.ext.export_api._copyObjectBase(obj);

			const templates = [
				"leftside_text",
				"rightside_text",
				"task_text",
				"progress_text",
				"task_class"
			];

			// serialize all text templates
			for (let i = 0; i < templates.length; i++) {
				const template = gantt.templates[templates[i]];
				if (template){
					copy["$" + i] = template(obj.start_date, obj.end_date, obj);
				}
			}

			gantt.ext.export_api._copyObjectColumns(obj, copy);
			copy.open = obj.$open;
			return copy;
		},


		_serializeHtml() {
			const smartScales = gantt.config.smart_scales;
			const smartRendering = gantt.config.smart_rendering;
			if (smartScales || smartRendering) {
				gantt.config.smart_rendering = false;
				gantt.config.smart_scales = false;
				gantt.render();
			}

			const html = gantt.$container.parentNode.innerHTML;

			if (smartScales || smartRendering) {
				gantt.config.smart_scales = smartScales;
				gantt.config.smart_rendering = smartRendering;
				gantt.render();
			}

			return html;
		},

		_serializeAll() {
			gantt.json._copyObject = gantt.ext.export_api._copyObjectAll;
			const data = gantt.ext.export_api._exportSerialize();
			gantt.json._copyObject = gantt.ext.export_api._originalCopyObject;
			return data;
		},

		_serializePlain() {
			const oldXmlFormat = gantt.templates.xml_format;
			const oldFormatDate = gantt.templates.format_date;
			gantt.templates.xml_format = gantt.date.date_to_str("%Y%m%dT%H%i%s", true);
			gantt.templates.format_date = gantt.date.date_to_str("%Y%m%dT%H%i%s", true);
			gantt.json._copyObject = gantt.ext.export_api._copyObjectPlainICal;

			const data = gantt.ext.export_api._exportSerialize();

			gantt.templates.xml_format = oldXmlFormat;
			gantt.templates.format_date = oldFormatDate;
			gantt.json._copyObject = gantt.ext.export_api._originalCopyObject;

			delete data.links;
			return data;
		},

		_getRaw() {
			const timeline = gantt.$ui.getView("timeline");
			if (timeline && gantt.config.show_chart) {
				let availWidth = timeline.$config.width;
				if (gantt.config.autosize === "x" || gantt.config.autosize === "xy") {
					availWidth = Math.max(gantt.config.autosize_min_width, 0);
				}
				const state = gantt.getState();
				const scales = timeline._getScales();
				const minWidth = gantt.config.min_column_width;
				const height = gantt.config.scale_height - 1;
				const rtl = gantt.config.rtl;

				return timeline.$scaleHelper.prepareConfigs(scales, minWidth, availWidth, height, state.min_date, state.max_date, rtl);
			} else {
				return gantt.ext.export_api._generateScales();
			}
		},

		_serializeTimeline(config:any) {
			gantt.ext.export_api._generatedScales = null;
			let scales;
			if (config.visual){
				scales = gantt.ext.export_api._getRaw(config.start, config.end);
			}
			if (config.data){
				config.custom_dataset = true;
			}

			// Save filtered tasks in a separate dataset to not iterate all tasks multiple times
			const datasetForExport: any = [];
			let tasks = config.data || gantt.serialize(null, { order: "display" }).data;
			tasks.forEach(function(task:any, index:any){
				// GS-3508. Don't export tasks outside the timeline with disabled `show_tasks_outside_timescale`
				if (!gantt.config.show_tasks_outside_timescale && !gantt.ext.export_api._isTaskInsideTimeline(task)){
					return;
				}
				if (!config.custom_dataset){
					const existingTask = gantt.getTask(task.id);
					// GS-3493. Retrieve the tree level from existing task
					task.$level = existingTask.$level;
					// GS-3499. Retrieve the dates as they should be coverted
					// later to ISO string to support custom date format
					task.start_date = existingTask.start_date;
					task.end_date = existingTask.end_date;
				}
				if (config.visual){
					// Save split tasks dates inside the parent object
					if (task.render == "split"){
						const children:any = [];
						if (config.custom_dataset){
							tasks.forEach(function(child:any){
								if (child.parent == task.id && gantt.ext.export_api._isTaskInsideTimeline(child)){
									const childBar = gantt.ext.export_api._copyObjectColors(child, config);
									childBar.$split_subtask = true;
									children.push(childBar);
								}
							})
						}
						else {
							gantt.eachTask(function(child:any){
								if (gantt.ext.export_api._isTaskInsideTimeline(child)){
									const childBar = gantt.ext.export_api._copyObjectColors(child, config);
									children.push(childBar);
								}
							}, task.id);
						}

						task.split_bars = [];

						// Skip overlap children
						const skippedTasks:any = {};
						for (let i = 0; i < children.length; i++) {
							const child = children[i];
							for (let j = 0; j < children.length; j++) {
								const sibling = children[j];
								if (child.id == sibling.id || skippedTasks[sibling.id]){
									continue;
								}
								const overlap = +child.original_start_date < +sibling.original_start_date && +sibling.original_start_date <= +child.original_end_date;
								// const overlap = +child.original_start_date < +sibling.original_end_date && +sibling.original_end_date <= +child.original_end_date;
								const cover = +sibling.original_start_date <= +child.original_start_date && +child.original_end_date <= +sibling.original_end_date;
								if (overlap){
									child.original_end_date = sibling.original_start_date;
									child.end_date = sibling.start_date;
									child.$end = sibling.$start;
									// child.original_start_date = sibling.original_end_date;
									// child.start_date = sibling.end_date;
									// child.$start = sibling.$end;
								}
								if (cover){
									// skip the task as it won't be visible
									skippedTasks[child.id] = true;
									break;
								}
							}
							if (!skippedTasks[child.id]){
								task.split_bars.push(child)
							}
						}
						// GS-3499. _copyObjectTable converts the dates to ISO format
						tasks[index] = gantt.ext.export_api._copyObjectTable(task);
					} else if (!task.$split_subtask){
						if (gantt.ext.export_api._isTaskInsideTimeline(task)){
							tasks[index] = gantt.ext.export_api._copyObjectColors(task, config);
						}
						else {
							tasks[index] = gantt.ext.export_api._copyObjectTable(task);
						}
					}
				}
				else {
					tasks[index] = gantt.ext.export_api._copyObjectTable(task);
				}
				datasetForExport.push(tasks[index]);
			});
			tasks = datasetForExport;

			// Filter tasks
			if (config.raw && !config.data){
				const taskStore = gantt.getDatastore("task");
				// GS-3602. This is one of the two places that read the array instead of asking
				// the store, so it does not get the recomputation the store's own readers
				// trigger for themselves. Exporting from inside a `batchUpdate` callback is not
				// a supported scenario, but the read costs nothing to keep honest: a filter pass
				// the batch has deferred runs before the visible ids are taken.
				taskStore._ensureFilter();
				const filteredIds = taskStore.visibleOrder;
				if (tasks.length !== filteredIds.length){
					const filteredDataset:any = [];
					tasks.forEach(function(task:any){
						if (filteredIds.indexOf(task.id) > -1){
							filteredDataset.push(task);
						}
					});
					tasks = filteredDataset;
				}
			}

			if (config.cellColors) {
				const css = gantt.templates.timeline_cell_class || gantt.templates.task_cell_class;
				if (css) {
					let steps = scales[0].trace_x;
					for (let i = 1; i < scales.length; i++){
						if (scales[i].trace_x.length > steps.length){
							steps = scales[i].trace_x;
						}
					}

					for (let i = 0; i < tasks.length; i++) {
						tasks[i].styles = [];
						const task = gantt.getTask(tasks[i].id);
						for (let j = 0; j < steps.length; j++) {
							const date = steps[j];
							const cellCss = css(task, date);
							if (cellCss){
								tasks[i].styles.push({ index: j, styles: gantt.ext.export_api._getStyles(cellCss) });
							}
						}
					}
				}
			}
			return tasks;
		},

		_serializeScales(config:any) {
			const scales:any = [];
			const raw = gantt.ext.export_api._getRaw();

			let min = Infinity;
			let max = 0;
			for (let i = 0; i < raw.length; i++) {
				min = Math.min(min, raw[i].col_width);
			}

			for (let i = 0; i < raw.length; i++) {
				let start = 0;
				let end = 0;
				const row:any = [];

				scales.push(row);
				const step = raw[i];
				max = Math.max(max, step.trace_x.length);
				const template = step.format || step.template || gantt.date.date_to_str(step.date);

				for (let j = 0; j < step.trace_x.length; j++) {
					const date = step.trace_x[j];
					end = start + Math.round(step.width[j] / min);

					const scaleCell = { text: template(date), start, end, styles: "" };

					if (config.cellColors) {
						const css = step.css || gantt.templates.scaleCell_class;
						if (css) {
							const scaleCss = css(date);
							if (scaleCss){
								scaleCell.styles = gantt.ext.export_api._getStyles(scaleCss);
							}
						}
					}

					row.push(scaleCell);
					start = end;
				}
			}

			return { width: max, height: scales.length, data: scales };
		},

		_serializeGrid(config:any) {
			gantt.exportMode = true;

			const columns:any = [];
			const cols = gantt.config.columns;

			let ccount = 0;
			for (let i = 0; i < cols.length; i++) {
				if (cols[i].name === "add" || cols[i].name === "buttons") {
					continue;
				}
				if (config && config.raw && cols[i].hide){
					continue;
				}

				columns[ccount] = {
					id: ((cols[i].template) ? ("_" + i) : cols[i].name),
					header: cols[i].label || gantt.locale.labels["column_" + cols[i].name],
					width: (cols[i].width ? Math.floor(cols[i].width / 4) : ""),
					tree: cols[i].tree || false
				};

				if (cols[i].name === "duration"){
					columns[ccount].type = "number";
				}
				if (cols[i].name === "start_date" || cols[i].name === "end_date") {
					columns[ccount].type = "date";
					if (config && config.rawDates){
						columns[ccount].id = cols[i].name;
					}
				}

				ccount++;
			}

			gantt.exportMode = false;
			return columns;
		},

		_exportSerialize() {
			gantt.exportMode = true;

			const xmlFormat = gantt.templates.xml_format;
			const formatDate = gantt.templates.format_date;

			// use configuration date format for serialization so date could be parsed on the export
			// required when custom format date function is defined
			gantt.templates.xml_format =
				gantt.templates.format_date =
				gantt.date.date_to_str(gantt.config.date_format || gantt.config.xml_date);

			const data = gantt.serialize();

			gantt.templates.xml_format = xmlFormat;
			gantt.templates.format_date = formatDate;
			gantt.exportMode = false;
			return data;
		},


		_setLevel(data:any) {
			for (let i = 0; i < data.length; i++) {
				// tslint:disable-next-line triple-equals
				if (data[i].parent == 0) {
					data[i]._lvl = 1;
				}
				for (let j = i + 1; j < data.length; j++) {
					// tslint:disable-next-line triple-equals
					if (data[i].id == data[j].parent) {
						data[j]._lvl = data[i]._lvl + 1;
					}
				}
			}
		},

		_clearLevel(data:any) {
			for (let i = 0; i < data.length; i++) {
				delete data[i]._lvl;
			}
		},

		_clearRecLinks(data:any) {
			gantt.ext.export_api._setLevel(data.data);
			const tasks:any = {};
			for (let i = 0; i < data.data.length; i++) {
				tasks[data.data[i].id] = data.data[i];
			}

			const links:any = {};

			for (let i = 0; i < data.links.length; i++) {
				const link = data.links[i];
				if (gantt.isTaskExists(link.source) && gantt.isTaskExists(link.target) &&
					tasks[link.source] && tasks[link.target]) {
					links[link.id] = link;
				}
			}

			for (const j in links) {
				gantt.ext.export_api._makeLinksSameLevel(links[j], tasks);
			}

			const skippedLinks = {};
			for (const j in tasks) {
				gantt.ext.export_api._clearCircDependencies(tasks[j], links, tasks, {}, skippedLinks, null);
			}

			if (Object.keys(links)) {
				gantt.ext.export_api._clearLinksSameLevel(links, tasks);
			}

			for (let i = 0; i < data.links.length; i++) {
				if (!links[data.links[i].id]) {
					data.links.splice(i, 1);
					i--;
				}
			}

			gantt.ext.export_api._clearLevel(data.data);
		},

		_clearCircDependencies(task:any, links:any, tasks:any, usedTasks:any, skippedLinks:any, prevLink:any) {
			const sources = task.$_source;
			if (!sources) {
				return;
			}

			if (usedTasks[task.id]) {
				gantt.ext.export_api._onCircDependencyFind(prevLink, links, usedTasks, skippedLinks);
			}

			usedTasks[task.id] = true;

			const targets:any = {};

			for (let i = 0; i < sources.length; i++) {
				if (skippedLinks[sources[i]]) {
					continue;
				}
				const curLink = links[sources[i]];
				const targetTask = tasks[curLink._target];
				if (targets[targetTask.id]) { // two link from one task to another
					gantt.ext.export_api._onCircDependencyFind(curLink, links, usedTasks, skippedLinks);
				}
				targets[targetTask.id] = true;
				gantt.ext.export_api._clearCircDependencies(targetTask, links, tasks, usedTasks, skippedLinks, curLink);
			}
			usedTasks[task.id] = false;
		},

		_onCircDependencyFind(link:any, links:any, usedTasks:any, skippedLinks:any) {
			if (link) {
				if (gantt.callEvent("onExportCircularDependency", [link.id, link])) {
					delete links[link.id];
				}

				delete usedTasks[link._source];
				delete usedTasks[link._target];
				skippedLinks[link.id] = true;
			}
		},

		_makeLinksSameLevel(link:any, tasks:any) {
			let task;
			let targetLvl;
			const linkT:any = {
				target: tasks[link.target],
				source: tasks[link.source]
			};
			// tslint:disable-next-line triple-equals
			if (linkT.target._lvl != linkT.source._lvl) {
				if (linkT.target._lvl < linkT.source._lvl) {
					task = "source";
					targetLvl = linkT.target._lvl;
				} else {
					task = "target";
					targetLvl = linkT.source._lvl;
				}

				do {
					const parent = tasks[linkT[task].parent];
					if (!parent) {
						break;
					}
					linkT[task] = parent;
				} while (linkT[task]._lvl < targetLvl);

				let sourceParent = tasks[linkT.source.parent];
				let	targetParent = tasks[linkT.target.parent];
				// tslint:disable-next-line triple-equals
				while (sourceParent && targetParent && sourceParent.id != targetParent.id) {
					linkT.source = sourceParent;
					linkT.target = targetParent;
					sourceParent = tasks[linkT.source.parent];
					targetParent = tasks[linkT.target.parent];
				}
			}

			link._target = linkT.target.id;
			link._source = linkT.source.id;

			if (!linkT.target.$_target){
				linkT.target.$_target = [];
			}
			linkT.target.$_target.push(link.id);

			if (!linkT.source.$_source){
				linkT.source.$_source = [];
			}
			linkT.source.$_source.push(link.id);
		},

		_clearLinksSameLevel(links:any, tasks:any) {
			for (const link in links) {
				delete links[link]._target;
				delete links[link]._source;
			}

			for (const task in tasks) {
				delete tasks[task].$_source;
				delete tasks[task].$_target;
			}
		},


		_customProjectProperties(data:any, config:any) {
			if (config && config.project) {
				for (const i in config.project) {
					if (!gantt.config.$custom_data){
						gantt.config.$custom_data = {};
					}
					gantt.config.$custom_data[i] = typeof config.project[i] === "function" ? config.project[i](gantt.config) : config.project[i];
				}
				delete config.project;
			}
		},

		_customTaskProperties(data:any, config:any) {
			if (config && config.tasks) {
				data.data.forEach(function(el:any) {
					for (const i in config.tasks) {
						if (!el.$custom_data){
							el.$custom_data = {};
						}
						el.$custom_data[i] = typeof config.tasks[i] === "function" ? config.tasks[i](el, gantt.config) : config.tasks[i];
					}
				});
				delete config.tasks;
			}
		},

		_exportConfig(data:any, config:any) {
			const projectName = config.name || "gantt.xml";
			delete config.name;

			gantt.config.custom = config;

			const time = gantt.ext.export_api._getWorktimeSettings();

			const projectDates = gantt.getSubtaskDates();
			if (projectDates.start_date && projectDates.end_date) {
				const formatDate = gantt.templates.format_date || gantt.templates.xml_format;
				gantt.config.start_end = {
					start_date: formatDate(projectDates.start_date),
					end_date: formatDate(projectDates.end_date)
				};
			}

			const autoSchedulingConfig = gantt._getAutoSchedulingConfig();

			const manual = !!(autoSchedulingConfig.enabled);

			const res:any = {
				callback: config.callback || null,
				config: gantt.config,
				data,
				manual,
				name: projectName,
				worktime: time
			};
			for (const i in config) {
				res[i] = config[i];
			}

			if (res.config.worktimes) {
				res.config = gantt.mixin({}, res.config);
				res.config.worktimes = gantt.ext.export_api._serializeWorktimes(res.config.worktimes);
			}

			return res;
		},


		_sendImportAjaxMSP(config:any) {
			const url = config.server || gantt.ext.export_api._apiUrl;
			const store = config.store || 0;
			const formData = config.data;
			const callback = config.callback;

			const settings = {
				durationUnit: config.durationUnit || undefined,
				projectProperties: config.projectProperties || undefined,
				taskProperties: config.taskProperties || undefined,
				resourceProperties: config.resourceProperties || undefined,
				assignmentProperties: config.assignmentProperties || undefined,
			};

			formData.append("type", config.type || "msproject-parse");
			formData.append("data", JSON.stringify(settings));

			if (store){
				formData.append("store", store);
			}

			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState === 4 && xhr.status === 0) {// network error
					if (callback) {
						callback(null);
					}
				}
			};

			xhr.onload = function(){
				const fail = xhr.status > 400;
				let info = null;

				if (!fail) {
					try {
						info = JSON.parse(xhr.responseText);
					} catch (e) { }
				}

				if (callback) {
					callback(info);
				}
			};

			xhr.open("POST", url, true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.send(formData);
		}

	};


	gantt.exportToPDF = gantt.ext.export_api.exportToPDF;
	gantt.exportToPNG = gantt.ext.export_api.exportToPNG;
	gantt.exportToICal = gantt.ext.export_api.exportToICal;
	gantt.exportToExcel = gantt.ext.export_api.exportToExcel;
	gantt.exportToJSON = gantt.ext.export_api.exportToJSON;
	gantt.importFromExcel = gantt.ext.export_api.importFromExcel;
	gantt.importFromMSProject = gantt.ext.export_api.importFromMSProject;
	gantt.exportToMSProject = gantt.ext.export_api.exportToMSProject;
	gantt.importFromPrimaveraP6 = gantt.ext.export_api.importFromPrimaveraP6;
	gantt.exportToPrimaveraP6 = gantt.ext.export_api.exportToPrimaveraP6;


	return gantt.ext.export_api;
}
