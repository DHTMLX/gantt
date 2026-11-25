import { markBuiltinTemplate } from "../../utils/template_security";
import { formatLevelingDelay } from "./leveling_delay";

export default function(gantt) {

	var regTemplates = {};

	function initTemplate(name, initial, template_name) {
		template_name = template_name || name;
		var config = gantt.config,
			templates = gantt.templates;

		if (gantt.config[name] && regTemplates[template_name] != config[name]) {
			if (!(initial && templates[template_name])) {
				templates[template_name] = gantt.date.date_to_str(config[name]);
				regTemplates[template_name] = config[name];
			}
		}
	}

	function initTemplates() {
		var date = gantt.date;

		//build configuration based templates
		var d = date.date_to_str;
		var c = gantt.config;
		var dateFormat = c.xml_date || c.date_format;
		var isIso = (dateFormat === "iso");

		var format_date = isIso
			? function(dateVal) { return date.formatISODate(dateVal); }
			: d(dateFormat, c.server_utc);
		format_date._ganttAuto = true;


		const parseDateFormat = date.str_to_date(dateFormat, c.server_utc);
		var parse_date = isIso
			? function(dateStr) { return date.parseDate(dateStr); }
			: function(dateStr) { 
				if(dateStr && dateStr.getFullYear) { 
					return new Date(dateStr);
				} return parseDateFormat(dateStr);
			};
		parse_date._ganttAuto = true;

		initTemplate("date_scale", true, undefined, gantt.config, gantt.templates);
		initTemplate("date_grid", true, "grid_date_format", gantt.config, gantt.templates);
		initTemplate("task_date", true, undefined, gantt.config, gantt.templates);

		gantt.mixin(gantt.templates, {
			xml_format: undefined, // deprecated
			format_date: format_date,

			xml_date: undefined, // deprecated
			parse_date: parse_date,

			progress_text: function (start, end, task) {
				return "";
			},
			grid_header_class: function (column, config) {
				return "";
			},

			task_text: function (start, end, task) {
				return task.text;
			},
			task_work: function (task) {
				return task.work != null ? task.work : "";
			},
			task_class: function (start, end, task) {
				return "";
			},
			task_end_date: function (date) {
				return gantt.templates.task_date(date);
			},
			grid_row_class: function (start, end, task) {
				return "";
			},
			task_row_class: function (start, end, task) {
				return "";
			},
			timeline_cell_class: function (item, date) {
				return "";
			},
			timeline_cell_content: function (item, date) {
				return "";
			},
			scale_cell_class: function (date) {
				return "";
			},
			scale_row_class: function (date) {
				return "";
			},

			grid_indent: markBuiltinTemplate(function (item) {
				return "<div class='gantt_tree_indent'></div>";
			}),
			grid_folder: markBuiltinTemplate(function (item) {
				return "<div " + gantt._waiAria.gridDecorativeIconAttrString() + "class='gantt_tree_icon gantt_folder_" + (item.$open ? "open" : "closed") + "'></div>";
			}),
			grid_file: markBuiltinTemplate(function (item) {
				return "<div " + gantt._waiAria.gridDecorativeIconAttrString() + "class='gantt_tree_icon gantt_file'></div>";
			}),
			grid_open: markBuiltinTemplate(function (item) {
				return "<div " + gantt._waiAria.gridToggleButtonAttrString() + "class='gantt_tree_icon gantt_" + (item.$open ? "close" : "open") + "'></div>";
			}),
			grid_blank: markBuiltinTemplate(function (item) {
				return "<div " + gantt._waiAria.gridDecorativeIconAttrString() + "class='gantt_tree_icon gantt_blank'></div>";
			}),
			date_grid: function (date, item, column) {
				if (item && gantt.isUnscheduledTask(item) && gantt.config.show_unscheduled) {
					return gantt.templates.task_unscheduled_time(item);
				} else {
					return gantt.templates.grid_date_format(date, column);
				}
			},

			task_time: function (start, end, ev) {
				if (gantt.isUnscheduledTask(ev) && gantt.config.show_unscheduled) {
					return gantt.templates.task_unscheduled_time(ev);
				} else {
					return gantt.templates.task_date(start) + " - " + gantt.templates.task_end_date(end);
				}
			},

			task_unscheduled_time: function (task) {
				return "";
			},

			time_picker: d(c.time_picker),
			link_class: function (link) {
				return "";
			},
			link_description: markBuiltinTemplate(function (link) {
				var from = gantt.getTask(link.source),
					to = gantt.getTask(link.target);

				return "<b>" + from.text + "</b> &ndash;  <b>" + to.text + "</b>";
			}),

			drag_link: markBuiltinTemplate(function (from, from_start, to, to_start) {
				from = gantt.getTask(from);
				var labels = gantt.locale.labels;

				var text = "<b>" + from.text + "</b> " + (from_start ? labels.link_start : labels.link_end) + "<br/>";
				if (to) {
					to = gantt.getTask(to);
					text += "<b> " + to.text + "</b> " + (to_start ? labels.link_start : labels.link_end) + "<br/>";
				}
				return text;
			}),
			drag_link_class: function (from, from_start, to, to_start) {
				var add = "";

				if (from && to) {
					var allowed = gantt.isLinkAllowed(from, to, from_start, to_start);
					add = " " + (allowed ? "gantt_link_allow" : "gantt_link_deny");
				}

				return "gantt_link_tooltip" + add;
			},

			/* used for aria-labels of bar elements and for tooltip.js */
			tooltip_date_format: date.date_to_str("%Y-%m-%d"),
			tooltip_text: markBuiltinTemplate(function (start, end, event) {
				return `<div>Task: ${event.text}</div>
				<div>Start date: ${gantt.templates.tooltip_date_format(start)}</div>
				<div>End date: ${gantt.templates.tooltip_date_format(end)}</div>`;
			}),
			baseline_text: function (task, baseline, index) {
				return "";
			},
			leveling_delay_text: function (task, delay, unit) {
				return formatLevelingDelay(delay, unit);
			}
		});
	}

	return {
		initTemplates: initTemplates,
		initTemplate: initTemplate
	};

};