import { DatePicker } from "../../controls/datepicker";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "datepicker" lightbox section — ui-core kit-backed (docs/internal/ui-core).
 * Section config: { type: "datepicker", format?, min?, max?, placeholder? }.
 * `format` defaults to gantt.config.date_grid inside the DatePicker (date-only,
 * calendar-only D3) — the section does NOT read date_format (backend format) for display.
 * A string value (a custom date property loaded from JSON) is parsed with
 * gantt.templates.parse_date, i.e. date_format; one that does not match date_format exactly shows empty.
 * Returns the ready form-block object (see form_block_adapter for why this
 * differs from the class-returning legacy control modules).
 */
export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new DatePicker(getGanttUiKit(gantt), {
			format: sns.format,
			min: sns.min,
			max: sns.max,
			placeholder: sns.placeholder
		});
	}, {
		toControl: function(value: any): any {
			if (typeof value !== "string") {
				return value;
			}
			const parsed = value ? gantt.templates.parse_date(value) : null;
			if (!(parsed instanceof Date) || isNaN(parsed.getTime())) {
				return null;
			}
			// the pattern parser fills in missing parts and rolls over out-of-range ones
			// ("2024-02-31" is March 2), so accept only a string that formats back unchanged
			const format = gantt.config.xml_date || gantt.config.date_format;
			return format === "iso" || gantt.templates.format_date(parsed) === value ? parsed : null;
		}
	});
}
