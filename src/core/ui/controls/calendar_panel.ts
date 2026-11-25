import type { CalendarDayState, IUiContext } from "../ui_context";
export type { CalendarDayState } from "../ui_context";

export interface ICalendarCell {
	date: Date;
	inMonth: boolean;
}

export interface CalendarPanelConfig {
	weekStart?: number;
	fixedRows?: number;
	value?: Date | null;
	visibleMonth?: Date;
	minDate?: Date | null;
	maxDate?: Date | null;
	onBeforeMonthChange?: (next: Date, previous: Date) => boolean | void;
	onMonthChange?: (next: Date, previous: Date) => void;
	onSelect?: (date: Date) => void;
	getDayState?: (date: Date) => CalendarDayState | void;
}

export function buildCalendarMatrix(year: number, month: number, weekStart: number = 1, fixedRows?: number): ICalendarCell[][] {
	const firstOfMonth = new Date(year, month, 1);
	const startOffset = (firstOfMonth.getDay() - weekStart + 7) % 7;
	const cursor = new Date(year, month, 1 - startOffset);
	const weeks: ICalendarCell[][] = [];
	const rowCount = fixedRows || 6;
	for (let w = 0; w < rowCount; w++) {
		const week: ICalendarCell[] = [];
		for (let d = 0; d < 7; d++) {
			week.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()), inMonth: cursor.getMonth() === month });
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
		if (!fixedRows && cursor.getMonth() !== month && weeks.length >= 4) break;
	}
	return weeks;
}

function shiftMonthClamped(year: number, month: number, day: number): Date {
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	return new Date(year, month, Math.min(day, daysInMonth));
}

export function nextCalendarFocus(current: Date, key: string, weekStart: number = 1): Date | null {
	const y = current.getFullYear();
	const m = current.getMonth();
	const d = current.getDate();
	switch (key) {
		case "ArrowLeft": return new Date(y, m, d - 1);
		case "ArrowRight": return new Date(y, m, d + 1);
		case "ArrowUp": return new Date(y, m, d - 7);
		case "ArrowDown": return new Date(y, m, d + 7);
		case "PageUp": return shiftMonthClamped(y, m - 1, d);
		case "PageDown": return shiftMonthClamped(y, m + 1, d);
		case "Home": return new Date(y, m, d - ((current.getDay() - weekStart + 7) % 7));
		case "End": return new Date(y, m, d - ((current.getDay() - weekStart + 7) % 7) + 6);
		default: return null;
	}
}

export function resolveCalendarDayState(context: IUiContext, date: Date, config?: CalendarPanelConfig): CalendarDayState {
	const hostState = context.getCalendarDayState ? context.getCalendarDayState(date) || {} : {};
	const consumerState = config && config.getDayState ? config.getDayState(date) || {} : {};
	return {
		disabled: !!(hostState.disabled || consumerState.disabled),
		hidden: !!(hostState.hidden || consumerState.hidden),
		className: [hostState.className, consumerState.className].filter(Boolean).join(" ") || undefined,
		ariaLabel: consumerState.ariaLabel || hostState.ariaLabel
	};
}

/**
 * Reusable calendar state/panel model. Rendering stays with the product host so
 * legacy mini-calendar and lightbox DOM can remain unchanged.
 */
export class CalendarPanel {
	private _context: IUiContext;
	private _config: CalendarPanelConfig;
	private _value: Date | null;
	private _visibleMonth: Date;

	constructor(context: IUiContext, config: CalendarPanelConfig = {}) {
		this._context = context;
		this._config = config;
		this._value = config.value ? new Date(config.value) : null;
		const initial = config.visibleMonth || this._value || new Date();
		this._visibleMonth = new Date(initial.getFullYear(), initial.getMonth(), 1);
	}

	public getValue(): Date | null {
		return this._value ? new Date(this._value) : null;
	}

	public setValue(value: Date | null): void {
		this._value = value ? new Date(value) : null;
	}

	public getVisibleMonth(): Date {
		return new Date(this._visibleMonth);
	}

	public setVisibleMonth(year: number, month: number): boolean {
		const next = new Date(year, month, 1);
		const previous = this.getVisibleMonth();
		if (next.getFullYear() === previous.getFullYear() && next.getMonth() === previous.getMonth()) {
			return true;
		}
		if (this._config.onBeforeMonthChange && this._config.onBeforeMonthChange(next, previous) === false) {
			return false;
		}
		this._visibleMonth = next;
		if (this._config.onMonthChange) {
			this._config.onMonthChange(this.getVisibleMonth(), previous);
		}
		return true;
	}

	public getCells(): ICalendarCell[][] {
		return buildCalendarMatrix(
			this._visibleMonth.getFullYear(),
			this._visibleMonth.getMonth(),
			this._config.weekStart === undefined ? 1 : this._config.weekStart,
			this._config.fixedRows
		);
	}

	public getDayState(date: Date): CalendarDayState {
		const state = resolveCalendarDayState(this._context, date, this._config);
		if (this._config.minDate && date < this._config.minDate) state.disabled = true;
		if (this._config.maxDate && date > this._config.maxDate) state.disabled = true;
		return state;
	}

	public select(date: Date): boolean {
		const state = this.getDayState(date);
		if (state.disabled || state.hidden) return false;
		this._value = new Date(date);
		if (this._config.onSelect) this._config.onSelect(this.getValue() as Date);
		return true;
	}
}

