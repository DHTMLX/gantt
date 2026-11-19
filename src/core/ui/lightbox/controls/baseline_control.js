
import __extends from "../../../../utils/extends";
import DurationFormatterNumeric from "../../../common/duration_formatter_numeric";
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

	function _generateBaselineRow (node, baseline, task, config){
		const time = "<div class='gantt_time_selects'>" + gantt.form_blocks.getTimePicker.call(gantt, config) + "</div>";
		let durationLabel = " "+ gantt.locale.labels[gantt.config.duration_unit + "s"] +" ";
		const singleDate = config.single_date ? " style='display:none'" : "";
		const readonly = config.readonly ? " disabled='disabled'" : "";
		const ariaAttr = gantt._waiAria.lightboxDurationInputAttrString(config);
		const deleteLabel = gantt.locale.labels.baselines_remove_button;

		let durationInputClass = "gantt_duration_value";
		if(config.formatter) {
			durationLabel = "";
			durationInputClass += " gantt_duration_value_formatted";
		}

		const durationEl = "<div class='gantt_duration' " + singleDate + ">" +
		"<div class='gantt_duration_inputs'>" +
			"<input type='button' class='gantt_duration_dec' value='-'" + readonly + ">" +
			"<input type='text' value='5days' class='"+durationInputClass+"'" + readonly + " " + ariaAttr + ">" +
			"<input type='button' class='gantt_duration_inc' value='+'" + readonly + ">"+
			"</div>" +
			"<div class='gantt_duration_end_date'>"+durationLabel+"<span></span></div>" +
			"</div>" +
			"</div>";

		const deleteButton = `<div><div class='baseline_delete_button gantt_custom_button dhx_gantt_icon dhx_gantt_icon_delete' aria-label='${deleteLabel}'></div></div>`;

		const baselineRow = document.createElement("div");
		baselineRow.className = "gantt_section_time gantt_section_duration";
		baselineRow.setAttribute("data-baseline-id", baseline.id);
		baselineRow.innerHTML = time + durationEl + deleteButton + "<br>";
		node.appendChild(baselineRow);

		var s = baselineRow.getElementsByTagName("select");
		var inps = baselineRow.getElementsByTagName("input");
		var duration = inps[1];
		var btns = [inps[0], inps[2]];
		var endspan = baselineRow.getElementsByTagName("span")[0];
		var map = config._time_format_order;
		var mapping;
		var start_date;
		var end_date;
		var duration_val;

		const deleteEl = baselineRow.querySelector(".baseline_delete_button");
		deleteEl.onclick = function(e){
			const section = baselineRow.parentNode;
			baselineRow.innerHTML = "";
			baselineRow.remove();
			if (section.innerHTML === ""){
				section.innerHTML = gantt.locale.labels.baselines_section_placeholder;
			}
		};
		

		function _calc_date() {
			var start_date = _getStartDate.call(gantt, baselineRow, config);
			var duration = _getDuration.call(gantt, baselineRow, config);
			var end_date = gantt.calculateEndDate({start_date: start_date, duration: duration, task: task});

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
		}, gantt);
		btns[1].onclick = gantt.bind(function() {
			_change_duration(1 * gantt.config.duration_step);
		}, gantt);
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
		}, gantt);

		duration.onchange = gantt.bind(_calc_date, gantt);

		mapping = gantt._resolve_default_mapping(config);
		if (typeof(mapping) === "string") mapping = {start_date: mapping};

		start_date = baseline.start_date || new Date();
		end_date = baseline.end_date || gantt.calculateEndDate({
			start_date: start_date,
			duration: 1,
			task
		});
		duration_val = gantt.calculateDuration({
			start_date: start_date,
			end_date: end_date,
			task
		});
		duration_val = getFormatter(config).format(duration_val);

		gantt.form_blocks._fill_lightbox_select(s, 0, start_date, map, config);
		duration.value = duration_val;
		_calc_date();
	}

	__extends(DurationControl, _super);

	DurationControl.prototype.render = function(sns) {
		const baselineSection = `<div style='height: ${sns.height || 110}px; font-size:inherit;' class='gantt_section_baselines'></div>`;
		return baselineSection;
	};

	DurationControl.prototype.set_value = function(node, value, task, config) {
		if (task.baselines){
			node.innerHTML = "";

			task.baselines.forEach((baseline)=>{
				_generateBaselineRow(node, baseline, task, config);
			});
		} else {
			node.innerHTML = gantt.locale.labels.baselines_section_placeholder;
		}		

	};

	DurationControl.prototype.get_value = function(node, task, config) {
		const baselines = [];
		const baselineRows = node.querySelectorAll(`[data-baseline-id]`);
		baselineRows.forEach((baselineNode)=>{
			const baselineId = baselineNode.dataset.baselineId;
			const baselineStore = gantt.getDatastore("baselines");
			let baseline = baselineStore.getItem(baselineId);
			let updatedBaseline;
			if (baseline){
				updatedBaseline = gantt.copy(baseline);
			} else {
				updatedBaseline = {
					id: gantt.uid(),
					task_id: task.id,
					text: "Baseline 1"
				};
			}
			updatedBaseline.start_date = _getStartDate(baselineNode, config);
			updatedBaseline.duration = _getDuration(baselineNode, config);
			updatedBaseline.end_date = gantt.calculateEndDate({start_date: updatedBaseline.start_date, duration: updatedBaseline.duration, task});

			baselines.push(updatedBaseline);
		});

		return baselines;
	};

	DurationControl.prototype.button_click = function (index, el, section, container) {
		if (gantt.callEvent("onSectionButton", [gantt._lightbox_id, section]) === false) {
			return;
		}
		if (el.closest(".gantt_custom_button.gantt_remove_baselines")){
			container.innerHTML = gantt.locale.labels.baselines_section_placeholder;
		}
		if (el.closest(".gantt_custom_button.gantt_add_baselines")){
			if (container.innerHTML == gantt.locale.labels.baselines_section_placeholder){
				container.innerHTML = "";
			}
			const task = gantt.getTask(gantt._lightbox_id);
			const baseline = {
				id: gantt.uid(),
				task_id: task.id,
				text: "Baseline 1",
				start_date: task.start_date,
				end_date: task.end_date
			};
			const config = gantt._get_typed_lightbox_config()[index];
			_generateBaselineRow(container, baseline, task, config);
		}
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