import { ensureDateTime } from "./datetime_section";
import { showTimeInput } from "../../controls/datetime_picker";

/**
 * "time" lightbox section — kit-backed since migration Step 6 §S6.3, replacing
 * the legacy multi-`<select>` `getTimePicker`. Renders a start row and an end
 * row, each a DatePicker + (optional) TimeInput composite; the time half shows
 * only when the section calls for sub-day precision (see `showTimeInput`).
 *
 * Preserved from the legacy control: the `gantt_section_time` /
 * `gantt_time_selects` classes and the start–spacer–end layout, `single_date`
 * (end row hidden), `auto_end_date` (end follows start), `autofix_end`
 * (end clamped after start), and the `map_to` object/string contract.
 *
 * Returns the ready form-block object (see form_block_adapter for why kit-backed
 * modules export a factory rather than the class the legacy modules returned).
 */
export default function(gantt: any): any {

	function startHost(node: any): any {
		return node.querySelector("[data-time-start]");
	}
	function endHost(node: any): any {
		return node.querySelector("[data-time-end]");
	}

	return {
		render: function(sns: any): string {
			let sectionClassName = "gantt_section_time";
			if (sns.name !== "time") {
				sectionClassName += " gantt_section_" + sns.name;
			}
			const spacer = sns.single_date
				? "<span></span>"
				: "<span class='gantt_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>";
			const endStyle = sns.single_date ? " style='display:none'" : "";
			let html = "<div style='padding-top:0px;font-size:inherit;text-align:center;' class='" + sectionClassName + "'>";
			html += "<div class='gantt_time_start' data-time-start></div>";
			html += spacer;
			html += "<div class='gantt_time_end' data-time-end" + endStyle + "></div>";
			html += "</div>";
			return html;
		},

		set_value: function(node: any, value: any, task: any, config: any): void {
			let mapping = gantt._resolve_default_mapping(config);
			if (typeof mapping === "string") {
				mapping = { start_date: mapping };
			}

			const start_date = task[mapping.start_date] || new Date();
			const end_date = task[mapping.end_date] || gantt.calculateEndDate({
				start_date: start_date,
				duration: 1,
				task: task
			});

			const startCtl = ensureDateTime(gantt, startHost(node), config);
			const endCtl = ensureDateTime(gantt, endHost(node), config);

			startCtl.setValue(start_date);
			endCtl.setValue(end_date);

			// auto_end_date: any change to the start snaps the end to start + 1 unit
			// (legacy fired this on every start <select> change). Wire once.
			if (config.auto_end_date && !node.$uiAutoEnd) {
				node.$uiAutoEnd = true;
				startCtl.onChange(function() {
					const start = startCtl.getValue();
					if (start) {
						endCtl.setValue(gantt.calculateEndDate({ start_date: start, duration: 1, task: task }));
					}
				});
			}
		},

		get_value: function(node: any, task: any, config: any): any {
			const startCtl = startHost(node) && startHost(node).$uiControl;
			const startDate = startCtl ? startCtl.getValue() : new Date();

			if (typeof gantt._resolve_default_mapping(config) === "string") {
				return startDate;
			}

			const endCtl = endHost(node) && endHost(node).$uiControl;
			let endDate = endCtl ? endCtl.getValue() : null;

			// GS-1010 parity: guarantee a valid end after the start
			if (!endDate || endDate <= startDate) {
				if (config.autofix_end !== false || config.single_date) {
					endDate = gantt.date.add(startDate, gantt._get_timepicker_step(), "minute");
				}
			}

			return {
				start_date: startDate,
				end_date: endDate
			};
		},

		focus: function(node: any): void {
			const host = startHost(node);
			if (host && host.$uiControl) {
				host.$uiControl.focus();
			}
		},

		// exposed for reuse/testing; kept internal otherwise
		_showTimeInput: function(sns: any): boolean {
			return showTimeInput(gantt, sns);
		}
	};
}
