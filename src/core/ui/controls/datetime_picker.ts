import { BaseControl } from "./base_component";
import { IDateTimePickerConfig } from "./types";
import { el } from "./common";
import { DatePicker } from "./datepicker";
import { TimeInput } from "./time_input";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * True when a gantt date format carries a time-of-day token (`%H`/`%h`/`%G`/`%g`
 * hour, `%i` minute, `%s` second, `%a`/`%A` meridiem). Accepts the legacy
 * array form (`["%d","%m","%Y","%H:%i"]`) or a plain string. Pure — unit-tested.
 */
export function hasTimeToken(format: string | string[] | undefined): boolean {
	if (!format) {
		return false;
	}
	const text = Array.isArray(format) ? format.join(" ") : String(format);
	return /%[HhGgisaA]/.test(text);
}

/**
 * Decides whether a lightbox datetime section renders its time-of-day half
 * (migration Step 6 §S6.3, user decision 2026-07-08). Precedence:
 *   1. an explicit section `time_format` with a time token forces the time half
 *      (a date-only explicit `time_format` forces date-only);
 *   2. otherwise the time half shows only when `gantt.config.duration_unit` is
 *      sub-day (`"second"`/`"minute"`/`"hour"`).
 * This deliberately drops the legacy `getTimeFormat` scale-unit check — the rule
 * reads `duration_unit` alone. Shared by every datetime section so they agree.
 */
export function showTimeInput(gantt: any, sns: any): boolean {
	if (sns && sns.time_format) {
		return hasTimeToken(sns.time_format);
	}
	const unit = gantt && gantt.config && gantt.config.duration_unit;
	return unit === "second" || unit === "minute" || unit === "hour";
}

/**
 * DateTimePicker — the reusable date+time composite (migration Step 6 §S6.3):
 * a calendar-only DatePicker plus, when `showTime` is set, a masked TimeInput,
 * merged into a single `Date | null`. The calendar owns the day/month/year and
 * preserves the value's time part; the TimeInput owns hours/minutes. This is the
 * piece the `time`/`duration`/`constraint`/`baseline` lightbox sections reuse in
 * place of the legacy multi-`<select>` `getTimePicker`.
 *
 * Value = Date | null. In date-only mode (`showTime` false) the value's existing
 * time-of-day is preserved (the DatePicker keeps it across day picks); in
 * date-time mode the TimeInput supplies hours/minutes on top of the picked day.
 */
export class DateTimePicker extends BaseControl<Date | null> {
	private _config: IDateTimePickerConfig;
	private _date: DatePicker;
	private _time: TimeInput | null = null;
	private _showTime: boolean;
	private _value: Date | null = null;

	constructor(kit: IUiKitRuntime, config?: IDateTimePickerConfig) {
		super(kit);
		this._config = config || {};
		this._showTime = !!this._config.showTime;
		this._date = new DatePicker(kit, {
			format: this._config.dateFormat,
			min: this._config.min,
			max: this._config.max,
			markNonWorkTime: this._config.markNonWorkTime,
			placeholder: this._config.placeholder
		});
		this._date.onChange(() => this._onPartChange());
		if (this._showTime) {
			this._time = new TimeInput(kit, {
				format: this._config.timeFormat,
				step: this._config.timeStep,
				min: this._config.minTime,
				max: this._config.maxTime
			});
			this._time.onChange(() => this._onPartChange());
		}
	}

	public getValue(): Date | null {
		const date = this._date.getValue();
		if (!date) {
			return null;
		}
		if (this._showTime && this._time) {
			const minutes = this._time.getValue();
			const h = minutes === null ? 0 : Math.floor(minutes / 60);
			const m = minutes === null ? 0 : minutes % 60;
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
		}
		// date-only: the DatePicker preserved the value's original time part
		return date;
	}

	public setValue(value: Date | null, options?: { preserveUnaligned?: boolean }): void {
		if (value && value.getFullYear && !isNaN(value.getTime())) {
			this._value = new Date(value.valueOf());
		} else {
			this._value = null;
		}
		this._date.setValue(this._value);
		if (this._time) {
			this._time.setValue(this._value ? this._value.getHours() * 60 + this._value.getMinutes() : null, options);
		}
	}

	public setDisabled(flag: boolean): void {
		super.setDisabled(flag);
		this._date.setDisabled(flag);
		if (this._time) {
			this._time.setDisabled(flag);
		}
	}

	public focus(): void {
		this._date.focus();
	}

	public destroy(): void {
		this._date.destroy();
		if (this._time) {
			this._time.destroy();
		}
		super.destroy();
	}

	protected _render(): HTMLElement {
		// keep the legacy `gantt_time_selects` class on the equivalent element so
		// CSS keyed on the old time-picker wrapper still has a target
		const root = el("div", "dhx_ui_control dhx_ui_datetime gantt_time_selects");
		const dateHost = el("div", "dhx_ui_datetime_date");
		root.appendChild(dateHost);
		this._date.mount(dateHost);
		if (this._time) {
			const timeHost = el("div", "dhx_ui_datetime_time");
			root.appendChild(timeHost);
			this._time.mount(timeHost);
		}
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._date.getRootNode();
	}

	private _onPartChange(): void {
		this._value = this.getValue();
		this._emitChange();
	}
}
