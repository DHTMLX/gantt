import __extends from "../../../../utils/extends";

import DurationFormatterNumeric from  "../../../common/duration_formatter_numeric";
import BaseConstrutor from "./base_control";

export default function(gantt) {
	var _super = BaseConstrutor(gantt);

	function DurationControl() {
		var self = _super.apply(this, arguments) || this; 

		return self; 
	}

	function getFormatter(config) {
		return config.formatter || new DurationFormatterNumeric();
	}

	__extends(DurationControl, _super);

	DurationControl.prototype.render = function(sns) {
		var time = "<div class='gantt_time_selects'>" + gantt.form_blocks.getTimePicker.call(this, sns) + "</div>";
		var label = " "+ gantt.locale.labels[gantt.config.duration_unit + "s"] +" ";
		var singleDate = sns.single_date ? " style='display:none'" : "";
		var readonly = sns.readonly ? " disabled='disabled'" : "";
		var ariaAttr = gantt._waiAria.lightboxDurationInputAttrString(sns);

		var durationInputClass = "gantt_duration_value";
		if(sns.formatter) {
			label = "";
			durationInputClass += " gantt_duration_value_formatted" ;
		}

		var duration = "<div class='gantt_duration' " + singleDate + ">" +
		"<div class='gantt_duration_inputs'>" +
			"<input type='button' class='gantt_duration_dec' value='−'" + readonly + ">" +
			"<input type='text' value='5days' class='"+durationInputClass+"'" + readonly + " " + ariaAttr + ">" +
			"<input type='button' class='gantt_duration_inc' value='+'" + readonly + ">"+
			"</div>" +
			"<div class='gantt_duration_end_date'>"+label+"<span></span></div>" +
			"</div>" +
			"</div>";
		let sectionClassName = "gantt_section_time gantt_section_duration";
		if (sns.name !== "time"){
			sectionClassName += " gantt_section_" + sns.name;
		}	
		var html = "<div style='padding-top:0px;font-size:inherit;' class='" + sectionClassName + "'>" + time + " " + duration + "</div>";
		return html;
	};

	DurationControl.prototype.set_value = function(node, value, ev, config) {
		var s = node.getElementsByTagName("select");
		var inps = node.getElementsByTagName("input");
		var duration = inps[1];
		var btns = [inps[0], inps[2]];
		var endspan = node.getElementsByTagName("span")[0];
		var map = config._time_format_order;
		var mapping;
		var start_date;
		var end_date;
		var duration_val;

		function _calc_date() {
			var start_date = _getStartDate.call(gantt, node, config);
			var duration = _getDuration.call(gantt, node, config);
			var end_date = gantt.calculateEndDate({start_date: start_date, duration: duration, task: ev});

			var template = gantt.templates.task_end_date || gantt.templates.task_date;
			endspan.innerHTML = template(end_date);
			gantt._waiAria.lightboxDurationInputValueAttr(inps[1], duration, inps[1].value);
		}

		function _change_duration(step) {
			var value = duration.value;

			value = getFormatter(config).parse(value);
			if (window.isNaN(value))
				value = 0;
			value += step;
			if (value < 1) value = 1;
			duration.value = getFormatter(config).format(value);
			_calc_date();
		}

		btns[0].onclick = gantt.bind(function() {
			_change_duration(-1 * gantt.config.duration_step);
		}, this);
		btns[1].onclick = gantt.bind(function() {
			_change_duration(1 * gantt.config.duration_step);
		}, this);
		s[0].onchange = _calc_date;
		s[1].onchange = _calc_date;
		s[2].onchange = _calc_date;
		if (s[3]) s[3].onchange = _calc_date;

		duration.onkeydown = gantt.bind(function(e) {
			var code; 

			e = e || window.event;
			code = (e.charCode || e.keyCode || e.which);
			
			if (code == gantt.constants.KEY_CODES.DOWN) {
				_change_duration(-1 * gantt.config.duration_step);
				return false;
			}

			if (code == gantt.constants.KEY_CODES.UP) {
				_change_duration(1 * gantt.config.duration_step);
				return false;
			}
			window.setTimeout(_calc_date, 1);
		}, this);

		duration.onchange = gantt.bind(_calc_date, this);

		mapping = gantt._resolve_default_mapping(config);
		if (typeof(mapping) === "string") mapping = {start_date: mapping};

		start_date = ev[mapping.start_date] || new Date();
		end_date = ev[mapping.end_date] || gantt.calculateEndDate({
			start_date: start_date,
			duration: 1,
			task: ev
		});
		duration_val = Math.round(ev[mapping.duration]) || gantt.calculateDuration({
			start_date: start_date,
			end_date: end_date,
			task: ev
		});
		duration_val = getFormatter(config).format(duration_val);

		gantt.form_blocks._fill_lightbox_select(s, 0, start_date, map, config);
		duration.value = duration_val;
		_calc_date();
	};

	DurationControl.prototype.get_value = function(node, ev, config) {
		var startDate = _getStartDate(node, config);
		var duration = _getDuration(node, config);
		var endDate = gantt.calculateEndDate({start_date: startDate, duration: duration, task: ev});

		if (typeof gantt._resolve_default_mapping(config) == "string") {
			return startDate;
		}
		//GS-3144: consider scale-projection
		//GS-3561: getScale() reports the scale only while the timeline is visible, and it is null
		//otherwise. A hidden timeline keeps the projection and the projection calendar of its last
		//visible render - it recomputes neither - so they can describe a configuration that is no
		//longer set. Snapping the date the user typed with an obsolete projection is worse than not
		//snapping it, so the projection is applied only while the scale behind it is up to date.
		const scale = gantt.getScale();
		if(scale && scale.projection && gantt.getCalendar("timescale-projection-calendar")){
			const projectionCalendar = gantt.getCalendar("timescale-projection-calendar");
			startDate = projectionCalendar.getClosestWorkTime({ 
				date: startDate, 
				unit: gantt.config.duration_unit,
				dir: "future" 
			});
		}
		return {
			start_date: startDate,
			end_date: endDate,
			duration: duration
		};
	};

	DurationControl.prototype.focus = function(node) {
		gantt._focus(node.getElementsByTagName("select")[0]);
	};


	function _getStartDate(node, config) {
		var s = node.getElementsByTagName("select");
		var map = config._time_format_order;
		var hours = 0;
		var minutes = 0;

		if (gantt.defined(map[3])) {
			var input = s[map[3]];
			var time = parseInt(input.value, 10);
			if (isNaN(time) && input.hasAttribute("data-value")) {
				time = parseInt(input.getAttribute("data-value"), 10);
			}

			hours = Math.floor(time / 60);
			minutes = time % 60;
		}
		return new Date(s[map[2]].value, s[map[1]].value, s[map[0]].value, hours, minutes);
	}

	function _getDuration(node, config) {
		var duration = node.getElementsByTagName("input")[1];

		duration = getFormatter(config).parse(duration.value);
		if (!duration || window.isNaN(duration)) duration = 1;
		if (duration < 0) duration *= -1;
		return duration;
	}

	return DurationControl; 
};