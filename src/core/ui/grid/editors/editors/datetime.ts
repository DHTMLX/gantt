import { DatePicker } from "../../../controls/datepicker";
import { inlineEditorAdapter } from "./inline_editor_adapter";
import { getGanttUiKit } from "../../../gantt_ui_kit";

/**
 * "datetime" inline editor — ui-core kit-backed (docs/internal/ui-core,
 * refinement #4). A single combined DatePicker (`withTime`): the masked input
 * carries date + time slots and the calendar popup grows a time-picker section,
 * so a Start/End column with minute precision can be edited inline in ONE cell
 * (a split DatePicker + TimeInput is too wide for a grid cell — that split
 * layout stays in the lightbox). The calendar-only `date` editor is unchanged.
 *
 * Editor config: { type: "datetime", map_to, format?, time_format?, time_step?,
 * show_time?, min?, max?, markNonWorkTime?, placeholder? }. `format` is the date
 * part (defaults to gantt.config.date_grid); `time_format` / `time_step` drive
 * the time part (default gantt.config.time_picker / time_step). `show_time`
 * defaults to true; set false for a calendar-only single input.
 * Returns the ready editor object (see inline_editor_adapter for why this differs
 * from the class-returning legacy editor modules).
 */
export default function(gantt: any): any {
	return inlineEditorAdapter(gantt, function(column: any, config: any) {
		return new DatePicker(getGanttUiKit(gantt), {
			withTime: config.show_time !== false,
			format: config.format,
			timeFormat: config.time_format,
			timeStep: config.time_step,
			min: typeof config.min === "function" ? config.min() : config.min,
			max: typeof config.max === "function" ? config.max() : config.max,
			markNonWorkTime: config.markNonWorkTime,
			placeholder: config.placeholder
		});
	}, {
		isValid: function(value: any): boolean {
			return !!(value && value.getFullYear && !isNaN(value.getTime()));
		}
	});
}
