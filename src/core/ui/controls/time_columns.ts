import { applyAria, el } from "./common";
import { IUiContext } from "../ui_context";

/**
 * Shared multi-column time selector (hours · minutes · optional AM/PM), used by
 * both `TimeInput`'s dropdown (Phase 2) and the combined `DatePicker`'s popup
 * time section (refinement #4 rework). Layout-agnostic — the caller decides
 * where to place the returned element (a Popup body, a calendar-popup section).
 * State lives on the owning control; this module only renders the columns and
 * reflects a highlight.
 */

export interface ITimeColumnsConfig {
	/** 12-hour clock (adds the AM/PM column, hours 1..12) vs 24-hour (0..23) */
	is12h: boolean;
	/** minute granularity (the minute column lists 0, step, 2·step … < 60) */
	step: number;
	/** leading-zero the hour label */
	padHour: boolean;
	/** AM/PM upper-case (else am/pm) */
	upperMeridiem: boolean;
}

export interface ITimeSegValues {
	/** hour in the clock's terms (24h: 0–23, 12h: 1–12), or null */
	hour: number | null;
	minute: number | null;
	meridiem: "am" | "pm" | null;
}

/** hour cell values for the clock (pure — exported for unit tests) */
export function hourOptionValues(is12h: boolean): number[] {
	const values: number[] = [];
	if (is12h) {
		for (let h = 1; h <= 12; h++) {
			values.push(h);
		}
	} else {
		for (let h = 0; h <= 23; h++) {
			values.push(h);
		}
	}
	return values;
}

/** step-aligned minute cell values (pure — exported for unit tests) */
export function minuteOptionValues(step: number): number[] {
	const stride = step >= 60 ? 60 : (step > 0 ? step : 1);
	const values: number[] = [];
	for (let m = 0; m < 60; m += stride) {
		values.push(m);
	}
	return values;
}

function pad2(value: number): string {
	return value < 10 ? "0" + value : String(value);
}

/**
 * Builds the `.dhx_ui_time_dropdown_columns` element. `onPick(seg, value)` is
 * fired on click: `value` is the numeric string for hour/minute and "am"/"pm"
 * for meridiem (matching each cell's `data-value`). The element swallows
 * `mousedown` so the owning input keeps focus while cells are clicked.
 */
export function buildTimeColumns(
	context: IUiContext,
	config: ITimeColumnsConfig,
	onPick: (seg: string, value: string) => void
): HTMLElement {
	const wrap = el("div", "dhx_ui_time_dropdown_columns");
	wrap.addEventListener("mousedown", (e: Event) => e.preventDefault());

	function buildColumn(seg: string, options: { value: string; label: string }[]): HTMLElement {
		const column = el("div", "dhx_ui_time_column", { "data-seg": seg });
		applyAria(context, column, { role: "listbox" });
		options.forEach((opt) => {
			const item = el("button", "dhx_ui_time_option", { type: "button", "data-value": opt.value });
			item.textContent = opt.label;
			applyAria(context, item, { role: "option" });
			// plain listener: cells are discarded whenever the columns are rebuilt
			// and GC together with their handlers
			item.addEventListener("click", () => onPick(seg, opt.value));
			column.appendChild(item);
		});
		return column;
	}

	wrap.appendChild(buildColumn("hour", hourOptionValues(config.is12h).map((h) => ({
		value: String(h),
		label: config.padHour && h < 10 ? "0" + h : String(h)
	}))));
	wrap.appendChild(buildColumn("minute", minuteOptionValues(config.step).map((m) => ({
		value: String(m),
		label: pad2(m)
	}))));
	if (config.is12h) {
		wrap.appendChild(buildColumn("meridiem", [
			{ value: "am", label: config.upperMeridiem ? "AM" : "am" },
			{ value: "pm", label: config.upperMeridiem ? "PM" : "pm" }
		]));
	}
	return wrap;
}

/** Marks the cell matching each segment's value as selected (and scrolls it into
 * view) and flags the active segment's column. */
export function updateTimeColumnsHighlight(columnsEl: HTMLElement, values: ITimeSegValues, activeSeg?: string): void {
	const current: { [seg: string]: string | null } = {
		hour: values.hour === null ? null : String(values.hour),
		minute: values.minute === null ? null : String(values.minute),
		meridiem: values.meridiem
	};
	["hour", "minute", "meridiem"].forEach((seg) => {
		const column = columnsEl.querySelector(".dhx_ui_time_column[data-seg='" + seg + "']") as HTMLElement | null;
		if (!column) {
			return;
		}
		column.classList.toggle("dhx_ui_time_column_active", seg === activeSeg);
		const options = column.querySelectorAll(".dhx_ui_time_option");
		for (let i = 0; i < options.length; i++) {
			const option = options[i] as HTMLElement;
			const selected = current[seg] !== null && option.getAttribute("data-value") === current[seg];
			option.classList.toggle("dhx_ui_time_option_selected", selected);
			if (selected && option.scrollIntoView) {
				option.scrollIntoView({ block: "nearest" });
			}
		}
	});
}
