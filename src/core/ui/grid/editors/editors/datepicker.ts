import { DatePicker } from "../../../controls/datepicker";
import { inlineEditorAdapter } from "./inline_editor_adapter";
import { getGanttUiKit } from "../../../gantt_ui_kit";

/**
 * "datepicker" inline editor — ui-core kit-backed (docs/internal/ui-core).
 * Editor config: { type: "datepicker", map_to, format?, min?, max?, placeholder? }.
 * `format` defaults to gantt.config.date_grid inside the DatePicker (date-only,
 * calendar-only D3) — the editor does NOT read date_format (backend format).
 * Returns the ready editor object (see inline_editor_adapter for why this
 * differs from the class-returning legacy editor modules).
 */
export default function(gantt: any): any {
	return inlineEditorAdapter(gantt, function(column: any, config: any) {
		return new DatePicker(getGanttUiKit(gantt), {
			format: config.format,
			min: typeof config.min === "function" ? config.min() : config.min,
			max: typeof config.max === "function" ? config.max() : config.max,
			placeholder: config.placeholder
		});
	}, {
		isValid: function(value: any): boolean {
			return !!(value && value.getFullYear && !isNaN(value.getTime()));
		}
	});
}
