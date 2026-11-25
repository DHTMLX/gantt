import type { DurationFormatter, LightboxControl, LightboxSection } from "../../../../types/gantt_types";
import DurationFormatterNumeric from "../../../common/duration_formatter_numeric";
import { escapeHTML } from "../../../../utils/template_security";
import { dateSelects, fillDateSelects, mappedDates, readDateSelects, renderDateSelects } from "./native_date_selects";
import type { NativeDateGantt } from "./native_date_selects";

const numericFormatter = new DurationFormatterNumeric();

function formatter(section: LightboxSection): DurationFormatter {
	return (section.formatter as DurationFormatter) || numericFormatter;
}

function readDuration(input: HTMLInputElement, section: LightboxSection): number {
	const value = formatter(section).parse(input.value);
	return Number.isFinite(value) && value !== 0 ? Math.abs(value) : 1;
}

export default function durationSelectControl(gantt: NativeDateGantt): LightboxControl {
	return {
		render(section) {
			const sectionClass = section.name === "time" ? "" : " gantt_section_" + escapeHTML(section.name);
			const singleDate = section.single_date ? " style='display:none'" : "";
			const disabled = section.readonly ? " disabled" : "";
			const formatted = section.formatter ? " gantt_duration_value_formatted" : "";
			const unitLabel = section.formatter ? "" : " " + escapeHTML(gantt.locale.labels[gantt.config.duration_unit + "s"] || "") + " ";
			const aria = gantt._waiAria.lightboxDurationInputAttrString(section);

			return "<div class='gantt_section_time gantt_section_duration gantt_section_duration_select" + sectionClass
				+ "' style='padding-top:0;font-size:inherit;'>"
				+ "<div class='gantt_time_selects'>" + renderDateSelects(gantt, section) + "</div> "
				+ "<div class='gantt_duration'" + singleDate + "><div class='gantt_duration_inputs'>"
				+ "<input type='button' class='gantt_duration_dec' value='−'" + disabled + ">"
				+ "<input type='text' class='gantt_duration_value" + formatted + "'" + disabled + " " + aria + ">"
				+ "<input type='button' class='gantt_duration_inc' value='+'" + disabled + ">"
				+ "</div><div class='gantt_duration_end_date'>" + unitLabel + "<span></span></div></div></div>";
		},

		set_value(node, _value, task, section) {
			const selects = dateSelects(node);
			const input = node.querySelector<HTMLInputElement>(".gantt_duration_value");
			const decrement = node.querySelector<HTMLInputElement>(".gantt_duration_dec");
			const increment = node.querySelector<HTMLInputElement>(".gantt_duration_inc");
			const endLabel = node.querySelector<HTMLElement>(".gantt_duration_end_date span");
			const { mapping, startDate, endDate } = mappedDates(gantt, section, task);
			const duration = Math.round(task[mapping.duration]) || gantt.calculateDuration({
				start_date: startDate, end_date: endDate, task
			});

			const refreshEnd = () => {
				const start = readDateSelects(selects, startDate);
				const value = readDuration(input, section);
				const end = gantt.calculateEndDate({ start_date: start, duration: value, task });
				const template = gantt.templates.task_end_date || gantt.templates.task_date;
				endLabel.innerHTML = template(end);
				gantt._waiAria.lightboxDurationInputValueAttr(input, value, input.value);
			};
			const stepDuration = (direction: number) => {
				const activeFormatter = formatter(section);
				const current = activeFormatter.parse(input.value);
				const duration = (Number.isFinite(current) ? current : 0) + direction * gantt.config.duration_step;
				input.value = activeFormatter.format(Math.max(1, duration));
				input.dispatchEvent(new input.ownerDocument.defaultView.Event("change", { bubbles: true }));
			};

			fillDateSelects(gantt, selects, startDate);
			input.value = formatter(section).format(duration);
			increment.onclick = () => stepDuration(1);
			decrement.onclick = () => stepDuration(-1);
			selects.forEach(select => { select.onchange = refreshEnd; });
			input.oninput = refreshEnd;
			input.onchange = refreshEnd;
			input.onkeydown = event => {
				if (event.key === "ArrowDown" || event.key === "ArrowUp") {
					event.preventDefault();
					stepDuration(event.key === "ArrowUp" ? 1 : -1);
				}
			};
			refreshEnd();
		},

		get_value(node, task, section) {
			const { startDate: initialDate } = mappedDates(gantt, section, task);
			let startDate = readDateSelects(dateSelects(node), initialDate);
			if (typeof gantt._resolve_default_mapping(section) === "string") {
				return startDate;
			}

			const duration = readDuration(node.querySelector<HTMLInputElement>(".gantt_duration_value"), section);
			const endDate = gantt.calculateEndDate({ start_date: startDate, duration, task });
			const calendar = gantt.getScale()?.projection && gantt.getCalendar("timescale-projection-calendar");
			if (calendar) {
				startDate = calendar.getClosestWorkTime({ date: startDate, unit: gantt.config.duration_unit, dir: "future" });
			}
			return { start_date: startDate, end_date: endDate, duration };
		},

		focus(node) {
			gantt._focus(dateSelects(node)[0]);
		}
	};
}
