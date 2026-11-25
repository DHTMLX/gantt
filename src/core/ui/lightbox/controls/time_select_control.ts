import type { LightboxControl } from "../../../../types/gantt_types";
import {
	dateSelects, fillDateSelects, mappedDates, readDateSelects, renderDateSelects, timeSelectStep
} from "./native_date_selects";
import type { NativeDateGantt } from "./native_date_selects";
import { escapeHTML } from "../../../../utils/template_security";

export default function timeSelectControl(gantt: NativeDateGantt): LightboxControl {
	return {
		render(section) {
			const sectionClass = section.name === "time" ? "" : " gantt_section_" + escapeHTML(section.name);
			return "<div class='gantt_section_time" + sectionClass
				+ "' style='padding-top:0;font-size:inherit;text-align:center;'>"
				+ renderDateSelects(gantt, section, true) + "</div>";
		},

		set_value(node, _value, task, section) {
			const start = dateSelects(node);
			const end = dateSelects(node, "end");
			const { startDate, endDate } = mappedDates(gantt, section, task);
			fillDateSelects(gantt, start, startDate);
			fillDateSelects(gantt, end, endDate);

			start.forEach(select => {
				select.onchange = section.auto_end_date ? () => {
					const date = gantt.date.date_part(readDateSelects(start, startDate));
					fillDateSelects(gantt, end, gantt.calculateEndDate({ start_date: date, duration: 1, task }));
				} : null;
			});
		},

		get_value(node, task, section) {
			const dates = mappedDates(gantt, section, task);
			const startDate = readDateSelects(dateSelects(node), dates.startDate);
			if (typeof gantt._resolve_default_mapping(section) === "string") {
				return startDate;
			}

			let endDate = readDateSelects(dateSelects(node, "end"), dates.endDate);
			if (endDate <= startDate && (section.autofix_end !== false || section.single_date)) {
				endDate = gantt.date.add(startDate, timeSelectStep(gantt), "minute");
			}
			return { start_date: startDate, end_date: endDate };
		},

		focus(node) {
			gantt._focus(dateSelects(node)[0]);
		}
	};
}
