import type { GanttStatic, LightboxSection, Task } from "../../../../types/gantt_types";
import { getSecondsInUnit, isDate } from "../../../../utils/helpers";
import { escapeHTML } from "../../../../utils/template_security";

type DateMapping = Partial<Record<"start_date" | "end_date" | "duration", string>>;
type DatePart = "%d" | "%m" | "%Y" | "%H:%i";

export type NativeDateGantt = GanttStatic & {
	config: GanttStatic["config"] & { limit_time_select?: boolean; first_hour: number; last_hour: number };
	_get_timepicker_step(): number;
	_resolve_default_mapping(section: LightboxSection): DateMapping | string | undefined;
	_focus(node: HTMLElement | undefined): void;
	_waiAria: {
		lightboxSelectAttrString(part: DatePart): string;
		lightboxDurationInputAttrString(section: LightboxSection): string;
		lightboxDurationInputValueAttr(input: HTMLInputElement, value: number, text: string): void;
	};
};

const DATE_PARTS: DatePart[] = ["%d", "%m", "%Y"];
const TIME_PART = "%H:%i";
const MINUTES_PER_DAY = 24 * 60;

export function timeSelectStep(gantt: NativeDateGantt): number {
	const step = gantt._get_timepicker_step();
	return Number.isFinite(step) && step > 0 ? Math.max(1, Math.round(step)) : 1;
}

function validDate(value: unknown): value is Date {
	return isDate(value) && typeof value.getTime === "function" && Number.isFinite(value.getTime());
}

export function mappedDates(gantt: NativeDateGantt, section: LightboxSection, task: Task) {
	const resolved = gantt._resolve_default_mapping(section);
	const mapping = typeof resolved === "string" ? { start_date: resolved } : resolved ?? {};
	const mappedStart = task[mapping.start_date];
	const mappedEnd = task[mapping.end_date];
	const startDate = validDate(mappedStart) ? mappedStart : new Date();
	const endDate = validDate(mappedEnd) ? mappedEnd : gantt.calculateEndDate({ start_date: startDate, duration: 1, task });
	return { mapping, startDate, endDate };
}

function dateAtMinutes(date: Date, minutes: number): Date {
	const result = new Date(date.getTime());
	result.setHours(0, minutes, 0, 0);
	return result;
}

function option(value: number, label: string): string {
	return "<option value='" + value + "'>" + escapeHTML(label) + "</option>";
}

function options(first: number, last: number, step: number, label: (value: number) => string): string {
	let html = "";
	for (let value = first; value <= last; value += step) {
		html += option(value, label(value));
	}
	return html;
}

function timeOptions(gantt: NativeDateGantt, reference: Date, first: number, last: number): string {
	const time = dateAtMinutes(reference, first);
	const nextDay = dateAtMinutes(reference, MINUTES_PER_DAY);
	const stepMs = timeSelectStep(gantt) * 60_000;
	let html = "";
	// Step in elapsed time so a skipped hour never produces an option for a different clock time.
	while (time <= nextDay) {
		const dayOffset = time.getDate() === reference.getDate() ? 0 : MINUTES_PER_DAY;
		const value = dayOffset + time.getHours() * 60 + time.getMinutes();
		if (value > last) {
			break;
		}
		html += option(value, gantt.templates.time_picker(new Date(time.getTime())));
		time.setTime(time.getTime() + stepMs);
	}
	return html;
}

function yearBounds(section: LightboxSection, min: Date, max: Date): [number, number] {
	const range = section.year_range;
	if (Array.isArray(range) && Number.isInteger(range[0]) && Number.isInteger(range[1])
		&& range[0] <= range[1] && range[0] >= -271820 && range[1] <= 275759) {
		return [range[0], range[1]];
	}
	const padding = typeof range === "number" && Number.isFinite(range) && range > 0 ? Math.floor(range / 2) : 5;
	return [Math.max(-271820, min.getFullYear() - padding), Math.min(275759, max.getFullYear() + padding)];
}

export function renderDateSelects(gantt: NativeDateGantt, section: LightboxSection, withEnd = false): string {
	const scaleUnit = gantt.getScale()?.unit || gantt.config.duration_unit;
	const defaultTime = getSecondsInUnit(scaleUnit) < getSecondsInUnit("day");
	const requested = section.time_format || (defaultTime ? [...DATE_PARTS, TIME_PART] : DATE_PARTS);
	const parts = Array.from(new Set([...requested, ...DATE_PARTS]))
		.filter((part): part is DatePart => part === TIME_PART || DATE_PARTS.includes(part as DatePart));
	const state = gantt.getState();
	const min = validDate(state.min_date) ? state.min_date : new Date();
	const max = validDate(state.max_date) ? state.max_date : min;
	const [firstYear, lastYear] = yearBounds(section, min, max);
	const { limit_time_select, first_hour, last_hour } = gantt.config;
	const firstMinute = limit_time_select && Number.isFinite(first_hour) ? Math.max(0, first_hour * 60) : 0;
	const lastMinute = limit_time_select && Number.isFinite(last_hour)
		? Math.min(MINUTES_PER_DAY, last_hour * 60)
		: MINUTES_PER_DAY - 1;
	const partOptions = {
		"%d": () => options(1, 31, 1, String),
		"%m": () => options(0, 11, 1, value => gantt.locale.date.month_full[value]),
		"%Y": () => options(firstYear, lastYear, 1, String),
		"%H:%i": () => timeOptions(gantt, min, firstMinute, lastMinute)
	};
	const disabled = section.readonly ? " disabled" : "";
	const markup = parts.map(part => ({
		attributes: disabled + " data-date-part='" + part + "' " + gantt._waiAria.lightboxSelectAttrString(part),
		options: partOptions[part]()
	}));
	const row = (group: "start" | "end", hidden: boolean) => markup.map(part =>
		"<select data-date-group='" + group + "'" + (hidden ? " style='display:none'" : "")
		+ part.attributes + ">" + part.options + "</select>").join(" ");

	const start = row("start", false);
	if (!withEnd) {
		return start;
	}
	const spacer = section.single_date ? "<span></span>" : "<span class='gantt_section_time_spacer'> &nbsp;&ndash;&nbsp; </span>";
	return start + spacer + row("end", Boolean(section.single_date));
}

export function dateSelects(node: HTMLElement, group: "start" | "end" = "start"): NodeListOf<HTMLSelectElement> {
	return node.querySelectorAll<HTMLSelectElement>("select[data-date-group='" + group + "']");
}

export function fillDateSelects(
	gantt: NativeDateGantt,
	selects: NodeListOf<HTMLSelectElement>,
	date: Date
): void {
	if (!validDate(date)) {
		return;
	}
	const minutes = date.getHours() * 60 + date.getMinutes();
	const step = timeSelectStep(gantt);
	const values: Record<DatePart, number> = {
		"%d": date.getDate(),
		"%m": date.getMonth(),
		"%Y": date.getFullYear(),
		"%H:%i": Math.round(minutes / step) * step
	};
	selects.forEach(select => {
		select.querySelector("option[data-loaded-value]")?.remove();
		const part = select.dataset.datePart as DatePart;
		const value = values[part];
		select.value = String(value);
		if (select.selectedIndex < 0 && part === TIME_PART) {
			select.value = String(minutes);
		}
		if (select.selectedIndex < 0) {
			// Keep an existing value outside the option range without making it an available choice.
			const option = select.ownerDocument.createElement("option");
			option.value = String(part === TIME_PART ? minutes : value);
			option.textContent = part === TIME_PART ? gantt.templates.time_picker(date) : option.value;
			option.hidden = true;
			option.dataset.loadedValue = "";
			select.appendChild(option);
			select.value = option.value;
		}
		select.dataset.value = select.value;
	});
}

export function readDateSelects(selects: NodeListOf<HTMLSelectElement>, fallback: Date): Date {
	const parts: Record<DatePart, number> = {
		"%Y": fallback.getFullYear(),
		"%m": fallback.getMonth(),
		"%d": fallback.getDate(),
		"%H:%i": 0
	};
	selects.forEach(select => {
		const value = select.value || select.dataset.value;
		if (value) {
			parts[select.dataset.datePart as DatePart] = Number(value);
		}
	});
	const date = dateAtMinutes(fallback, 0);
	date.setFullYear(parts["%Y"], parts["%m"], parts["%d"]);
	date.setHours(0, parts[TIME_PART], 0, 0);
	return validDate(date) ? date : new Date(fallback.getTime());
}
