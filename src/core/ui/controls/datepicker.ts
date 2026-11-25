import { BaseControl } from "./base_component";
import { IDatePickerConfig } from "./types";
import { applyAria, controlUid, el, uiLabel } from "./common";
import { Popup } from "../popup/popup";
import { is12HourFormat, isUpperMeridiem, isHourPadded, typeHourDigit, typeMinuteDigit } from "./time_input";
import { buildTimeColumns, updateTimeColumnsHighlight } from "./time_columns";
import { buildCalendarMatrix, nextCalendarFocus } from "./calendar_panel";
import type { IUiKitRuntime } from "../ui_kit";
export { buildCalendarMatrix, nextCalendarFocus } from "./calendar_panel";
export type { ICalendarCell } from "./calendar_panel";

// --- masked text input: format parsing + digit state machines -------------
//
// The datepicker input is a segmented mask (day / month / year slots joined by
// fixed separators), mirroring TimeInput. The slot order, padding and year
// width are all read from the gantt date format so `%m/%d/%Y`, `%d-%m-%Y`,
// `%y.%n.%j` … all mask correctly. Value <-> text still goes through gantt's
// str_to_date/date_to_str, so the `%y` century pivot and locale stay authoritative.

export type DateSegName = "day" | "month" | "year" | "hour" | "minute" | "meridiem";

export interface IDateSegmentPart {
	kind: "segment";
	name: DateSegName;
	/** original gantt token, e.g. "%d" */
	token: string;
	/** leading-zero padding (day/month); year is always padded to `length` */
	padded: boolean;
	/** digit capacity: 2 for day/month and a 2-digit year, 4 for a 4-digit year */
	length: number;
}

export interface IDateLiteralPart {
	kind: "literal";
	text: string;
}

export type IDatePart = IDateSegmentPart | IDateLiteralPart;

/** current segment values held while editing the mask (meridiem: 0=am, 1=pm) */
interface ISegValues {
	day: number | null;
	month: number | null;
	year: number | null;
	hour: number | null;
	minute: number | null;
	meridiem: number | null;
}

/** placeholder glyph shown for an empty slot while the field is being edited */
const DATE_PH_CHAR = "–";

// keyboard steps inside the month / year picker grids (4 columns × 3 rows):
// left/right move one cell, up/down move one row, PageUp/Down page a decade.
const MONTH_GRID_DELTA: { [key: string]: number } = {
	ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4
};
const YEAR_GRID_DELTA: { [key: string]: number } = {
	ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4, PageUp: -10, PageDown: 10
};

/** left-pads a string with "0" up to `length` (ES5-safe; no String.padStart) */
function padLeft(value: string, length: number): string {
	let s = value;
	while (s.length < length) {
		s = "0" + s;
	}
	return s;
}

interface ITokenSpec { name: DateSegName; padded: boolean; length: number; }

const DATE_TOKEN_SPECS: { [token: string]: ITokenSpec } = {
	"%d": { name: "day", padded: true, length: 2 },
	"%j": { name: "day", padded: false, length: 2 },
	"%m": { name: "month", padded: true, length: 2 },
	"%n": { name: "month", padded: false, length: 2 },
	"%y": { name: "year", padded: true, length: 2 },
	"%Y": { name: "year", padded: false, length: 4 }
};

// time-of-day tokens, recognized only when parseDateMask(allowTime) is set
// (the combined date+time DatePicker, refinement #4 rework)
const TIME_TOKEN_SPECS: { [token: string]: ITokenSpec } = {
	"%H": { name: "hour", padded: true, length: 2 },
	"%G": { name: "hour", padded: false, length: 2 },
	"%h": { name: "hour", padded: true, length: 2 },
	"%g": { name: "hour", padded: false, length: 2 },
	"%i": { name: "minute", padded: true, length: 2 },
	"%a": { name: "meridiem", padded: false, length: 2 },
	"%A": { name: "meridiem", padded: false, length: 2 }
};

/**
 * Parses a gantt date format into ordered segment / literal parts for the
 * masked input. Returns null when the format carries a token the mask can't
 * segment (month/day NAMES `%M`/`%F`/`%D`/`%l`, week `%W`, seconds, …) or when
 * the required slots are not all present exactly once — the caller then falls
 * back to a plain free-text input. `allowTime` additionally accepts the
 * hour/minute/meridiem tokens (`%H`/`%h`/`%G`/`%g`/`%i`/`%a`/`%A`) and then
 * requires hour + minute too (the combined date+time field). Pure — exported
 * for unit tests.
 */
export function parseDateMask(format: string, allowTime: boolean = false): IDatePart[] | null {
	if (!format) {
		return null;
	}
	const parts: IDatePart[] = [];
	const seen: { [k in DateSegName]?: boolean } = {};
	const tokenRegex = /%[a-zA-Z]/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = tokenRegex.exec(format)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ kind: "literal", text: format.slice(lastIndex, match.index) });
		}
		const token = match[0];
		const spec = DATE_TOKEN_SPECS[token] || (allowTime ? TIME_TOKEN_SPECS[token] : undefined);
		if (!spec || seen[spec.name]) {
			return null; // unsupported token or a duplicated slot → plain-text fallback
		}
		seen[spec.name] = true;
		parts.push({ kind: "segment", name: spec.name, token, padded: spec.padded, length: spec.length });
		lastIndex = tokenRegex.lastIndex;
	}
	if (lastIndex < format.length) {
		parts.push({ kind: "literal", text: format.slice(lastIndex) });
	}
	if (!seen.day || !seen.month || !seen.year) {
		return null; // a date field needs all three slots; otherwise fall back
	}
	if (allowTime && (seen.hour || seen.minute) && (!seen.hour || !seen.minute)) {
		return null; // if a time part is present it needs BOTH the hour and minute
	}
	return parts;
}

export interface DateSegmentTypeResult {
	/** digit buffer retained when a further digit could still follow */
	buffer: string;
	/** resolved slot value (day 1–31, month 1–12, year as typed), or null while incomplete */
	value: number | null;
	/** true when the slot is filled and focus should advance to the next one */
	complete: boolean;
}

/**
 * Overwrite-style digit entry for the day slot (valid 1–31). A first digit ≥ 4
 * completes immediately (40+ impossible); 1–3 wait for a second digit; a second
 * digit that would overflow restarts from itself (Chrome date-field semantics).
 * Pure — unit-tested.
 */
export function typeDayDigit(buffer: string, digit: string): DateSegmentTypeResult {
	const d = parseInt(digit, 10);
	if (isNaN(d)) {
		return { buffer, value: buffer ? parseInt(buffer, 10) : null, complete: false };
	}
	if (buffer === "") {
		if (d === 0) {
			return { buffer: "0", value: null, complete: false }; // "0" alone is not a valid day yet
		}
		if (d >= 4) {
			return { buffer: "", value: d, complete: true }; // 4–9: no valid tens digit
		}
		return { buffer: String(d), value: d, complete: false }; // 1/2/3: wait for a second digit
	}
	const cand = parseInt(buffer, 10) * 10 + d;
	if (cand >= 1 && cand <= 31) {
		return { buffer: "", value: cand, complete: true };
	}
	return typeDayDigit("", digit); // overflow → restart from this digit
}

/**
 * Overwrite-style digit entry for the month slot (valid 1–12). A first digit
 * 2–9 completes immediately; 0/1 wait; a second digit that overflows restarts.
 * Pure — unit-tested.
 */
export function typeMonthDigit(buffer: string, digit: string): DateSegmentTypeResult {
	const d = parseInt(digit, 10);
	if (isNaN(d)) {
		return { buffer, value: buffer ? parseInt(buffer, 10) : null, complete: false };
	}
	if (buffer === "") {
		if (d === 0) {
			return { buffer: "0", value: null, complete: false }; // "0" alone is not a valid month yet
		}
		if (d === 1) {
			return { buffer: "1", value: 1, complete: false }; // could still become 10/11/12
		}
		return { buffer: "", value: d, complete: true }; // 2–9: no valid second digit
	}
	const cand = parseInt(buffer, 10) * 10 + d;
	if (cand >= 1 && cand <= 12) {
		return { buffer: "", value: cand, complete: true };
	}
	return typeMonthDigit("", digit); // overflow → restart from this digit
}

/**
 * Overwrite-style digit entry for the year slot: accumulates up to `length`
 * digits (2 for `%y`, 4 for `%Y`) and completes once full. The value carries the
 * digits typed so far as-is (century handling belongs to gantt's `%y` parser).
 * Pure — unit-tested.
 */
export function typeYearDigit(buffer: string, digit: string, length: number): DateSegmentTypeResult {
	const d = parseInt(digit, 10);
	if (isNaN(d)) {
		return { buffer, value: buffer ? parseInt(buffer, 10) : null, complete: false };
	}
	const next = buffer + digit;
	const value = parseInt(next, 10);
	if (next.length >= length) {
		return { buffer: "", value, complete: true };
	}
	return { buffer: next, value, complete: false };
}

/**
 * Builds the day matrix (up to 6 weeks × 7 days) shown for a month.
 * Pure — exported for unit tests.
 * @param weekStart 0 = Sunday, 1 = Monday
 */
function isSameDay(a: Date | null, b: Date | null): boolean {
	return !!(a && b &&
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate());
}

/**
 * Maps a calendar-navigation key to the next keyboard-focused day, or null when
 * the key is not a navigation key. Day-precision; the Date constructor
 * normalizes month/year roll-over. Pure — exported for unit tests.
 * @param weekStart 0 = Sunday, 1 = Monday
 */
/**
 * DatePicker — masked segmented text input + full calendar dropdown on the popup
 * primitive (decision D3). Non-working days are visually marked through the
 * worktime API when available (display only). Value = Date | null. It is
 * **calendar-only**: the display/parse format defaults to `gantt.config.date_grid`
 * (the grid display format, date-only), NOT `date_format` (that is the backend
 * parse format). The value's time-of-day is preserved across day picks and text
 * edits — the datetime sections compose this with `TimeInput`, which owns the
 * time part.
 *
 * Text-entry model (mirrors TimeInput): the input is a mask split into
 * day / month / year slots — order, padding and year width all read from the
 * format — joined by fixed separators the user can never type over. Clicking a
 * slot selects it whole; typing OVERWRITES the slot and auto-advances the moment
 * it can hold no more; ArrowLeft/Right (+ Home/End) move between slots;
 * Backspace/Delete clear a slot; non-digit characters are blocked. Value <-> text
 * still flows through gantt's str_to_date/date_to_str so the `%y` century pivot
 * and locale stay authoritative. Formats the mask can't segment (month/day names,
 * week numbers, …) fall back to a plain free-text input. The calendar keyboard
 * contract is unchanged: ArrowUp/Down open it, and it owns the arrows while open.
 */
export class DatePicker extends BaseControl<Date | null> {
	private _config: IDatePickerConfig;
	private _input: HTMLInputElement | null = null;
	private _value: Date | null = null;
	private _dropdown: Popup | null = null;
	private _calendarEl: HTMLElement | null = null;
	private _viewYear: number = 0;
	private _viewMonth: number = 0;
	// which sub-view the calendar shows: day grid (default), month picker or
	// year picker. Clicking the header month label opens "months", the year
	// label opens "years"; picking a month/year drills back down one level.
	private _viewMode: "days" | "months" | "years" = "days";
	// keyboard focus inside the month/year grids (mirrors _focusDate for days)
	private _focusMonth: number = 0;
	private _focusYearCell: number = 0;
	// keyboard-focused day while the calendar is open (D-impl: focus stays on the
	// input, this day is tracked via aria-activedescendant + a highlight class —
	// the same pattern Combo uses for its listbox)
	private _focusDate: Date | null = null;
	private _gridId: string;
	private _format: (date: Date) => string;
	private _parse: (value: string) => Date;
	// masked-input state (null mask => plain free-text fallback)
	private _mask: IDatePart[] | null;
	private _editing: boolean = false;
	private _activeSeg: DateSegName = "day";
	private _buffer: string = "";
	// segment values: day/month/year (+ hour/minute in withTime mode) as numbers,
	// meridiem as 0 (am) / 1 (pm); null = empty
	private _seg: ISegValues = {
		day: null, month: null, year: null, hour: null, minute: null, meridiem: null
	};
	// combined date+time mode (refinement #4): the mask carries time slots and the
	// popup grows a time section
	private _withTime: boolean;
	private _is12h: boolean = false;
	private _upperMeridiem: boolean = true;
	private _padHour: boolean = true;
	private _timeStep: number = 60;
	// date-only mask + parser, used to follow the typed date in the grid before the
	// time part is complete (in withTime mode)
	private _dateMask: IDatePart[] | null;
	private _dateOnlyParse: (value: string) => Date;
	private _timeColumnsEl: HTMLElement | null = null;

	constructor(kit: IUiKitRuntime, config?: IDatePickerConfig) {
		super(kit);
		this._config = config || {};
		this._gridId = controlUid(kit.context, "calendar");
		this._withTime = !!this._config.withTime;
		// calendar-only (D3): default to the grid display format (date-only),
		// NOT date_format (which is the backend/parse format that may carry time)
		const context = kit.context;
		const dateFormat = context.getDateFormat(this._config.format);
		this._dateOnlyParse = context.stringToDate(dateFormat);
		this._dateMask = parseDateMask(dateFormat, false);

		let formatString = dateFormat;
		if (this._withTime) {
			const timeFormat = context.getTimeFormat(this._config.timeFormat);
			// append the time format unless the date format already carries time tokens
			if (!/%[HhGgisaA]/.test(dateFormat)) {
				formatString = dateFormat + " " + timeFormat;
			}
			this._is12h = is12HourFormat(formatString);
			this._upperMeridiem = isUpperMeridiem(formatString);
			this._padHour = isHourPadded(formatString);
			const step = this._config.timeStep !== undefined
				? this._config.timeStep
				: context.getTimeStep();
			this._timeStep = step && step > 0 ? step : 60;
		}
		this._format = context.dateToString(formatString);
		this._parse = context.stringToDate(formatString);
		this._mask = parseDateMask(formatString, this._withTime);
	}

	public getValue(): Date | null {
		return this._value ? new Date(this._value.valueOf()) : null;
	}

	public setValue(value: Date | null): void {
		if (value && value.getFullYear && !isNaN(value.getTime())) {
			this._value = new Date(value.valueOf());
		} else {
			this._value = null;
		}
		this._reflectValue();
	}

	public destroy(): void {
		this._closeDropdown();
		super.destroy();
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_datepicker" +
			(this._mask ? " dhx_ui_datepicker_masked" : "") +
			(this._withTime ? " dhx_ui_datepicker_datetime" : ""));

		const input = el("input", "dhx_ui_input dhx_ui_datepicker_input", {
			type: "text",
			autocomplete: "off"
		}) as HTMLInputElement;
		if (this._mask) {
			input.setAttribute("inputmode", "numeric");
			input.setAttribute("autocapitalize", "off");
			input.setAttribute("spellcheck", "false");
		}
		input.setAttribute("placeholder", this._config.placeholder ||
			(this._mask ? this._maskHint() : ""));
		applyAria(this.$kit.context, input, { "aria-haspopup": "dialog", "aria-controls": this._gridId });

		const toggle = el("span", "dhx_ui_datepicker_toggle " + this.$kit.context.icon("calendar"));
		applyAria(this.$kit.context, toggle, { "aria-hidden": "true" });

		this._listen(input, "keydown", (e: KeyboardEvent) => this._onKeyDown(e));
		if (this._mask) {
			this._listen(input, "focus", () => this._onFocus());
			this._listen(input, "blur", () => this._onBlur());
			this._listen(input, "mouseup", () => this._onMouseUp());
			this._listen(input, "paste", (e: ClipboardEvent) => this._onPaste(e));
		} else {
			this._listen(input, "change", () => this._commitInputText());
		}
		this._listen(toggle, "mousedown", (e: Event) => {
			e.preventDefault();
			if (this._disabled) {
				return;
			}
			if (this._isOpen()) {
				this._closeDropdownKeepFocus();
			} else {
				this._openDropdown();
				this.focus();
			}
		});

		root.appendChild(input);
		root.appendChild(toggle);
		this._input = input;
		this._onDestroy(() => {
			this._input = null;
		});
		this._syncInputToValue();
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}

	// --- calendar dropdown ----------------------------------------------

	private _isOpen(): boolean {
		return !!(this._dropdown && this._dropdown.isVisible());
	}

	private _openDropdown(): void {
		if (this._disabled || !this._root) {
			return;
		}
		// seed the keyboard focus on the current value (or today), pulled into
		// range so it never starts on a disabled day
		const base = this._value || new Date();
		this._focusDate = this._clampToRange(new Date(base.getFullYear(), base.getMonth(), base.getDate()));
		this._viewYear = this._focusDate.getFullYear();
		this._viewMonth = this._focusDate.getMonth();
		this._viewMode = "days"; // always open on the day grid

		if (!this._dropdown) {
			const config = {
				className: "dhx_ui_datepicker_dropdown",
				role: "dialog" as const,
				position: {
					type: "anchor" as const,
					target: this._root,
					side: "bottom" as const,
					flip: true
				},
				dismiss: { escape: false, outsideClick: true },
				ignoreOutsideClick: [this._root]
			};
			this._dropdown = this.$kit.createPopup(config);
			this._dropdown.attachEvent("onHide", () => {
				this._calendarEl = null;
				this._timeColumnsEl = null;
				this._focusDate = null;
				this._viewMode = "days";
				if (this._input) {
					this._input.removeAttribute("aria-activedescendant");
				}
			});
		}

		const calendar = el("div", "dhx_ui_calendar");
		// keep focus on the input while clicking inside the calendar — the
		// buttons would otherwise steal it on mousedown and, once the popup
		// hides, drop focus to <body>, breaking every flow that reads keys
		// from the control afterwards (inline-editor Enter-to-save, ESC).
		// Same pattern as combo option mousedown; found by retest 26_ui_core/012.
		calendar.addEventListener("mousedown", (e: Event) => e.preventDefault());
		this._calendarEl = calendar;

		let shown: HTMLElement = calendar;
		if (this._withTime) {
			// wrap the calendar with a time-picker section (shared columns) so the
			// single input can also pick the time by mouse
			const wrap = el("div", "dhx_ui_datetime_popup");
			wrap.addEventListener("mousedown", (e: Event) => e.preventDefault());
			wrap.appendChild(calendar);
			wrap.appendChild(this._buildTimePanel());
			shown = wrap;
		}
		this._dropdown.show(shown);
		this._renderCalendar();
		if (this._withTime) {
			this._refreshTimeColumns();
		}
	}

	private _buildTimePanel(): HTMLElement {
		const panel = el("div", "dhx_ui_datetime_time_panel");
		const columns = buildTimeColumns(this.$kit.context, {
			is12h: this._is12h,
			step: this._timeStep,
			padHour: this._padHour,
			upperMeridiem: this._upperMeridiem
		}, (seg, value) => this._onTimeColumnPick(seg as DateSegName, value));
		this._timeColumnsEl = columns;
		panel.appendChild(columns);
		return panel;
	}

	private _refreshTimeColumns(): void {
		if (!this._timeColumnsEl) {
			return;
		}
		updateTimeColumnsHighlight(this._timeColumnsEl, {
			hour: this._seg.hour,
			minute: this._seg.minute,
			meridiem: this._seg.meridiem === null ? null : (this._seg.meridiem === 1 ? "pm" : "am")
		}, this._activeSeg);
	}

	private _onTimeColumnPick(seg: DateSegName, value: string): void {
		if (this._disabled) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
		this._activeSeg = seg;
		if (seg === "hour") {
			this._seg.hour = parseInt(value, 10);
		} else if (seg === "minute") {
			this._seg.minute = parseInt(value, 10);
		} else {
			this._seg.meridiem = value === "pm" ? 1 : 0;
		}
		this._buffer = "";
		// commit live once the whole datetime is composable (date already picked);
		// otherwise keep the picked time visible until the date is set
		const composed = this._composeDate();
		if (composed && !this._isOutOfRange(composed)) {
			const changed = !this._value || composed.valueOf() !== this._value.valueOf();
			this._value = composed;
			if (changed) {
				this._emitChange();
			}
		}
		this._selectSegment(seg); // re-render the input + refresh the column highlight
	}

	private _closeDropdown(): void {
		if (this._dropdown) {
			this._dropdown.destroy();
			this._dropdown = null;
			this._calendarEl = null;
			this._timeColumnsEl = null;
		}
	}

	private _closeDropdownKeepFocus(): void {
		if (this._dropdown) {
			this._dropdown.hide();
		}
	}

	// --- keyboard navigation (focus stays on the input, D-impl) ---------

	private _onKeyDown(e: KeyboardEvent): void {
		if (this._disabled) {
			return;
		}
		const open = this._isOpen();

		if (e.key === "Escape") {
			if (open) {
				e.preventDefault();
				e.stopPropagation();
				this._closeDropdownKeepFocus();
			}
			return; // left unhandled otherwise: container cancel keydown acts on it
		}

		if (!open) {
			// closed: ArrowUp/Down open the calendar; the mask owns everything else
			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				e.preventDefault();
				this._openDropdown();
				return;
			}
			if (this._mask) {
				this._onMaskKeyDown(e);
				return;
			}
			// plain fallback: Enter commits the typed text
			if (e.key === "Enter") {
				this._commitInputText();
			}
			return;
		}

		// open: the calendar owns the arrows/paging/Enter keys
		if (e.key === "Enter") {
			if (this._viewMode === "months") {
				e.preventDefault();
				e.stopPropagation();
				this._pickMonth(this._focusMonth);
				return;
			}
			if (this._viewMode === "years") {
				e.preventDefault();
				e.stopPropagation();
				this._pickYear(this._focusYearCell);
				return;
			}
			if (this._withTime) {
				// commit the full datetime, close the popup, and let Enter BUBBLE so
				// the container (grid / lightbox) saves in one keystroke — the withTime
				// popup stays open on day-pick, so we close it here (mirrors how the
				// date-only calendar closes on pick and the next Enter saves).
				// Deliberately NOT preventDefault/stopPropagation: the grid placeholder
				// onkeydown bails on defaultPrevented and needs the event to save.
				if (this._editIsDirty()) {
					this._commitEdit();
				} else if (this._focusDate && !this._isOutOfRange(this._focusDate)) {
					this._pickDay(this._focusDate);
				}
				this._closeDropdownKeepFocus();
				return;
			}
			e.preventDefault();
			e.stopPropagation();
			if (this._editIsDirty()) {
				// the user retyped the date instead of navigating — honor the text
				this._commitEdit();
				this._closeDropdownKeepFocus();
			} else if (this._focusDate && !this._isOutOfRange(this._focusDate)) {
				this._pickDay(this._focusDate);
			}
			return;
		}
		if (e.key === "Tab") {
			// let focus move on naturally, just close the calendar; a retyped date is
			// committed first, as the grid inline editor saves on Tab keydown
			if (this._editIsDirty()) {
				this._commitEdit();
			}
			this._closeDropdownKeepFocus();
			return;
		}
		// digits / Backspace / Delete keep editing the mask while the calendar is
		// open (a fully composed date then follows in the day grid); the arrows
		// stay with the calendar
		if (this._mask && this._maskEditKey(e)) {
			return;
		}
		if (this._viewMode === "months") {
			if (this._moveMonthFocus(e.key)) {
				e.preventDefault();
				e.stopPropagation();
			}
			return;
		}
		if (this._viewMode === "years") {
			if (this._moveYearFocus(e.key)) {
				e.preventDefault();
				e.stopPropagation();
			}
			return;
		}
		const target = this._focusDate && nextCalendarFocus(this._focusDate, e.key, this._weekStart());
		if (target) {
			e.preventDefault();
			e.stopPropagation();
			this._moveFocusTo(target);
		}
	}

	/** True when the pending edit differs from the committed value —
	 * lets Enter honor a retyped date over the highlighted calendar day. */
	private _editIsDirty(): boolean {
		return this._mask ? this._maskIsDirty() : this._inputTextIsDirty();
	}

	private _commitEdit(): void {
		if (this._mask) {
			this._commitMask();
		} else {
			this._commitInputText();
		}
	}

	private _moveFocusTo(date: Date): void {
		const clamped = this._clampToRange(date);
		if (this._isOutOfRange(clamped)) {
			return;
		}
		this._focusDate = clamped;
		if (clamped.getFullYear() !== this._viewYear || clamped.getMonth() !== this._viewMonth) {
			this._viewYear = clamped.getFullYear();
			this._viewMonth = clamped.getMonth();
			this._renderCalendar();
		} else {
			this._applyFocusHighlight();
		}
	}

	private _applyFocusHighlight(): void {
		const calendar = this._calendarEl;
		if (!calendar) {
			return;
		}
		const focusId = this._focusDate ? this._dayCellId(this._focusDate) : "";
		const days = calendar.querySelectorAll(".dhx_ui_calendar_day");
		for (let i = 0; i < days.length; i++) {
			const dayEl = days[i] as HTMLElement;
			dayEl.classList.toggle("dhx_ui_calendar_day_focus", !!focusId && dayEl.id === focusId);
		}
		this._syncActiveDescendant();
	}

	private _syncActiveDescendant(): void {
		if (!this._input) {
			return;
		}
		let id: string | null = null;
		if (this._viewMode === "days" && this._focusDate) {
			id = this._dayCellId(this._focusDate);
		} else if (this._viewMode === "months") {
			id = this._monthCellId(this._focusMonth);
		} else if (this._viewMode === "years") {
			id = this._yearCellId(this._focusYearCell);
		}
		if (id) {
			applyAria(this.$kit.context, this._input, { "aria-activedescendant": id });
		} else {
			this._input.removeAttribute("aria-activedescendant");
		}
	}

	private _dayCellId(date: Date): string {
		return this._gridId + "_" + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate();
	}

	private _monthCellId(month: number): string {
		return this._gridId + "_m_" + month;
	}

	private _yearCellId(year: number): string {
		return this._gridId + "_y_" + year;
	}

	/** first year of the decade shown in the year picker (2024 → 2020) */
	private _decadeStart(year: number): number {
		return Math.floor(year / 10) * 10;
	}

	private _weekStart(): number {
		return this.$kit.context.getWeekStart();
	}

	/** True when the input shows text the user typed, not the formatted value —
	 * lets Enter honor a retyped date over the highlighted calendar day. */
	private _inputTextIsDirty(): boolean {
		if (!this._input) {
			return false;
		}
		const shown = this._value ? this._format(this._value) : "";
		return this._input.value !== shown;
	}

	private _renderCalendar(): void {
		const calendar = this._calendarEl;
		if (!calendar) {
			return;
		}
		calendar.innerHTML = "";

		calendar.appendChild(this._renderHeader());
		if (this._viewMode === "months") {
			this._renderMonthsBody(calendar);
		} else if (this._viewMode === "years") {
			this._renderYearsBody(calendar);
		} else {
			this._renderDaysBody(calendar);
		}
		calendar.appendChild(this._renderFooter());

		if (this._withTime) {
			this._syncTimePanelHeight();
		}
		if (this._dropdown) {
			this._dropdown.reposition();
		}
		this._syncActiveDescendant();
	}

	/** cap the popup time columns to the calendar's natural height so the combined
	 * popup is always exactly as tall as the mini-calendar — the tall hours column
	 * scrolls inside that height instead of stretching the popup (no blank space
	 * below a short month). The popup uses align-items:flex-start, so the calendar
	 * height read here is its natural height, not a stretched one. */
	private _syncTimePanelHeight(): void {
		if (!this._calendarEl || !this._timeColumnsEl) {
			return;
		}
		const calendarHeight = this._calendarEl.offsetHeight;
		if (!calendarHeight) {
			return;
		}
		const columns = this._timeColumnsEl.querySelectorAll(".dhx_ui_time_column");
		// the time panel adds 8px top + 8px bottom padding around the columns
		const maxHeight = Math.max(0, calendarHeight - 16);
		for (let i = 0; i < columns.length; i++) {
			(columns[i] as HTMLElement).style.maxHeight = maxHeight + "px";
		}
	}

	// header: prev | title | next. In the day view the title splits into a
	// month label + a year label that drill into the month / year pickers; the
	// arrows page by month (day view), year (month view) or decade (year view).
	private _renderHeader(): HTMLElement {
		const context = this.$kit.context;
		const header = el("div", "dhx_ui_calendar_header");
		const prev = el("button", "dhx_ui_calendar_nav dhx_ui_calendar_prev", { type: "button" });
		prev.textContent = "‹";
		applyAria(context, prev, { "aria-label": uiLabel(context, "ui_datepicker_prev_month") });
		const next = el("button", "dhx_ui_calendar_nav dhx_ui_calendar_next", { type: "button" });
		next.textContent = "›";
		applyAria(context, next, { "aria-label": uiLabel(context, "ui_datepicker_next_month") });
		prev.addEventListener("click", () => this._shiftView(-1));
		next.addEventListener("click", () => this._shiftView(1));
		header.appendChild(prev);
		header.appendChild(this._renderTitle());
		header.appendChild(next);
		return header;
	}

	private _renderTitle(): HTMLElement {
		const locale = this.$kit.context.getDateLocale();
		const title = el("span", "dhx_ui_calendar_title");
		if (this._viewMode === "days") {
			// keep the innerText "Month Year" (the space text node matters — the
			// retest reads getText(".dhx_ui_calendar_title"))
			const monthLabel = el("button", "dhx_ui_calendar_title_part dhx_ui_calendar_title_month", { type: "button" });
			monthLabel.textContent = locale.month_full[this._viewMonth];
			monthLabel.addEventListener("click", () => this._switchMode("months"));
			const yearLabel = el("button", "dhx_ui_calendar_title_part dhx_ui_calendar_title_year", { type: "button" });
			yearLabel.textContent = String(this._viewYear);
			yearLabel.addEventListener("click", () => this._switchMode("years"));
			title.appendChild(monthLabel);
			title.appendChild(document.createTextNode(" "));
			title.appendChild(yearLabel);
		} else if (this._viewMode === "months") {
			const yearLabel = el("button", "dhx_ui_calendar_title_part dhx_ui_calendar_title_year", { type: "button" });
			yearLabel.textContent = String(this._viewYear);
			yearLabel.addEventListener("click", () => this._switchMode("years"));
			title.appendChild(yearLabel);
		} else {
			const start = this._decadeStart(this._viewYear);
			title.textContent = start + " – " + (start + 9);
		}
		return title;
	}

	private _renderFooter(): HTMLElement {
		const context = this.$kit.context;
		const footer = el("div", "dhx_ui_calendar_footer");
		const todayBtn = el("button", "dhx_ui_calendar_action", { type: "button" });
		todayBtn.textContent = uiLabel(context, "ui_datepicker_today");
		todayBtn.addEventListener("click", () => {
			const now = new Date();
			if (!this._isOutOfRange(now)) {
				this._pickDay(now);
			}
		});
		const clearBtn = el("button", "dhx_ui_calendar_action", { type: "button" });
		clearBtn.textContent = uiLabel(context, "ui_datepicker_clear");
		clearBtn.addEventListener("click", () => {
			const changed = this._value !== null;
			this._value = null;
			// return the field to its empty rest state ("") even though the calendar
			// kept focus on the input; the next click/keystroke re-enters editing
			this._editing = false;
			this._setSegmentsFromValue(null);
			this._buffer = "";
			this._syncInputToValue();
			this._closeDropdownKeepFocus();
			if (changed) {
				this._emitChange();
			}
		});
		footer.appendChild(todayBtn);
		footer.appendChild(clearBtn);
		return footer;
	}

	private _renderDaysBody(calendar: HTMLElement): void {
		const context = this.$kit.context;
		const locale = context.getDateLocale();

		// weekday row
		const weekStart = this._weekStart();
		const daysRow = el("div", "dhx_ui_calendar_weekdays");
		for (let d = 0; d < 7; d++) {
			const cell = el("span", "dhx_ui_calendar_weekday");
			cell.textContent = locale.day_short[(d + weekStart) % 7];
			daysRow.appendChild(cell);
		}
		calendar.appendChild(daysRow);

		// day grid
		const today = new Date();
		const markNonWork = this._shouldMarkNonWorkTime();
		const grid = el("div", "dhx_ui_calendar_grid", { id: this._gridId });
		applyAria(context, grid, { role: "grid" });
		const matrix = buildCalendarMatrix(this._viewYear, this._viewMonth, weekStart);
		matrix.forEach((week) => {
			week.forEach((cell) => {
				const day = el("button", "dhx_ui_calendar_day", { type: "button", id: this._dayCellId(cell.date) });
				day.textContent = String(cell.date.getDate());
				if (!cell.inMonth) {
					day.classList.add("dhx_ui_calendar_day_other");
				}
				if (isSameDay(cell.date, today)) {
					day.classList.add("dhx_ui_calendar_day_today");
				}
				if (isSameDay(cell.date, this._value)) {
					day.classList.add("dhx_ui_calendar_day_selected");
					applyAria(context, day, { "aria-pressed": "true" });
				}
				if (isSameDay(cell.date, this._focusDate)) {
					day.classList.add("dhx_ui_calendar_day_focus");
				}
				if (markNonWork && !this._isWorkDay(cell.date)) {
					day.classList.add("dhx_ui_calendar_day_nonwork");
				}
				if (this._isOutOfRange(cell.date)) {
					(day as HTMLButtonElement).disabled = true;
					day.classList.add("dhx_ui_calendar_day_disabled");
				} else {
					day.addEventListener("click", () => this._pickDay(cell.date));
				}
				grid.appendChild(day);
			});
		});
		calendar.appendChild(grid);
	}

	private _renderMonthsBody(calendar: HTMLElement): void {
		const context = this.$kit.context;
		const locale = context.getDateLocale();
		const grid = el("div", "dhx_ui_calendar_cells dhx_ui_calendar_months", { id: this._gridId });
		applyAria(context, grid, { role: "grid" });
		for (let m = 0; m < 12; m++) {
			const cell = el("button", "dhx_ui_calendar_cell dhx_ui_calendar_month", { type: "button", id: this._monthCellId(m) });
			cell.textContent = locale.month_short[m];
			if (this._value && this._value.getFullYear() === this._viewYear && this._value.getMonth() === m) {
				cell.classList.add("dhx_ui_calendar_cell_selected");
				applyAria(context, cell, { "aria-pressed": "true" });
			}
			if (m === this._focusMonth) {
				cell.classList.add("dhx_ui_calendar_cell_focus");
			}
			if (this._isMonthOutOfRange(this._viewYear, m)) {
				(cell as HTMLButtonElement).disabled = true;
				cell.classList.add("dhx_ui_calendar_cell_disabled");
			} else {
				cell.addEventListener("click", () => this._pickMonth(m));
			}
			grid.appendChild(cell);
		}
		calendar.appendChild(grid);
	}

	private _renderYearsBody(calendar: HTMLElement): void {
		const context = this.$kit.context;
		const grid = el("div", "dhx_ui_calendar_cells dhx_ui_calendar_years", { id: this._gridId });
		applyAria(context, grid, { role: "grid" });
		const start = this._decadeStart(this._viewYear);
		// 12 cells: the ten decade years padded by one year on each side (dimmed)
		for (let i = -1; i <= 10; i++) {
			const year = start + i;
			const cell = el("button", "dhx_ui_calendar_cell dhx_ui_calendar_year", { type: "button", id: this._yearCellId(year) });
			cell.textContent = String(year);
			if (i < 0 || i > 9) {
				cell.classList.add("dhx_ui_calendar_cell_other");
			}
			if (this._value && this._value.getFullYear() === year) {
				cell.classList.add("dhx_ui_calendar_cell_selected");
				applyAria(context, cell, { "aria-pressed": "true" });
			}
			if (year === this._focusYearCell) {
				cell.classList.add("dhx_ui_calendar_cell_focus");
			}
			if (this._isYearOutOfRange(year)) {
				(cell as HTMLButtonElement).disabled = true;
				cell.classList.add("dhx_ui_calendar_cell_disabled");
			} else {
				cell.addEventListener("click", () => this._pickYear(year));
			}
			grid.appendChild(cell);
		}
		calendar.appendChild(grid);
	}

	// --- month / year picker navigation ---------------------------------

	private _switchMode(mode: "days" | "months" | "years"): void {
		this._viewMode = mode;
		if (mode === "months") {
			this._focusMonth = this._viewMonth;
		} else if (mode === "years") {
			this._focusYearCell = this._viewYear;
		}
		this._renderCalendar();
	}

	private _pickMonth(month: number): void {
		if (this._isMonthOutOfRange(this._viewYear, month)) {
			return;
		}
		this._viewMonth = month;
		this._viewMode = "days";
		// seed the day focus on the value's day when it lands in this month,
		// otherwise the first day, clamped into range and the month length
		const daysInMonth = new Date(this._viewYear, month + 1, 0).getDate();
		const day = this._value ? Math.min(this._value.getDate(), daysInMonth) : 1;
		this._focusDate = this._clampToRange(new Date(this._viewYear, month, day));
		this._renderCalendar();
	}

	private _pickYear(year: number): void {
		if (this._isYearOutOfRange(year)) {
			return;
		}
		this._viewYear = year;
		this._viewMode = "months";
		this._focusMonth = this._viewMonth;
		this._renderCalendar();
	}

	private _moveMonthFocus(key: string): boolean {
		const delta = MONTH_GRID_DELTA[key];
		if (delta === undefined) {
			return false;
		}
		// walk the 4×3 month grid, rolling into the adjacent year at the edges
		const index = this._viewYear * 12 + this._focusMonth + delta;
		this._viewYear = Math.floor(index / 12);
		this._focusMonth = ((index % 12) + 12) % 12;
		this._renderCalendar();
		return true;
	}

	private _moveYearFocus(key: string): boolean {
		const delta = YEAR_GRID_DELTA[key];
		if (delta === undefined) {
			return false;
		}
		this._focusYearCell += delta;
		// keep the displayed decade in step with the focused year
		this._viewYear = this._focusYearCell;
		this._renderCalendar();
		return true;
	}

	private _isMonthOutOfRange(year: number, month: number): boolean {
		const monthEnd = new Date(year, month + 1, 0);
		const monthStart = new Date(year, month, 1);
		return this._isOutOfRange(monthEnd) && this._isOutOfRange(monthStart) &&
			this._sameSideOfRange(monthStart, monthEnd);
	}

	private _isYearOutOfRange(year: number): boolean {
		const yearEnd = new Date(year, 11, 31);
		const yearStart = new Date(year, 0, 1);
		return this._isOutOfRange(yearEnd) && this._isOutOfRange(yearStart) &&
			this._sameSideOfRange(yearStart, yearEnd);
	}

	/** both dates fall out of range on the SAME boundary (both below min or both
	 * above max) — so a span straddling the whole [min,max] window is NOT hidden */
	private _sameSideOfRange(a: Date, b: Date): boolean {
		if (this._config.min) {
			const min = new Date(this._config.min.getFullYear(), this._config.min.getMonth(), this._config.min.getDate());
			if (a.valueOf() < min.valueOf() && b.valueOf() < min.valueOf()) {
				return true;
			}
		}
		if (this._config.max) {
			const max = new Date(this._config.max.getFullYear(), this._config.max.getMonth(), this._config.max.getDate());
			if (a.valueOf() > max.valueOf() && b.valueOf() > max.valueOf()) {
				return true;
			}
		}
		return false;
	}

	private _shiftView(direction: number): void {
		if (this._viewMode === "months") {
			this._viewYear += direction;
			this._renderCalendar();
		} else if (this._viewMode === "years") {
			this._viewYear += direction * 10;
			this._renderCalendar();
		} else {
			this._shiftMonth(direction);
		}
	}

	private _shiftMonth(direction: number): void {
		this._viewMonth += direction;
		if (this._viewMonth < 0) {
			this._viewMonth = 11;
			this._viewYear--;
		} else if (this._viewMonth > 11) {
			this._viewMonth = 0;
			this._viewYear++;
		}
		this._renderCalendar();
	}

	private _pickDay(date: Date): void {
		const picked = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		if (this._value) {
			// preserve the time part of the previous value
			picked.setHours(this._value.getHours(), this._value.getMinutes(), this._value.getSeconds(), 0);
		}
		const changed = !isSameDay(picked, this._value) || !this._value;
		this._value = picked;
		this._reflectValue();
		if (this._withTime) {
			// keep the popup open so the user can now pick the time; follow the pick
			// with the calendar focus/selection and refresh the time-column highlight
			this._focusDate = new Date(picked.getFullYear(), picked.getMonth(), picked.getDate());
			this._viewYear = this._focusDate.getFullYear();
			this._viewMonth = this._focusDate.getMonth();
			this._renderCalendar();
			this._refreshTimeColumns();
		} else {
			this._closeDropdownKeepFocus();
		}
		if (changed) {
			this._emitChange();
		}
	}

	private _commitInputText(): void {
		if (!this._input) {
			return;
		}
		const text = this._input.value;
		if (!text) {
			const hadValue = this._value !== null;
			this._value = null;
			if (hadValue) {
				this._emitChange();
			}
			return;
		}
		let parsed: Date | null = null;
		try {
			parsed = this._parse(text);
		} catch {
			parsed = null;
		}
		if (parsed && !isNaN(parsed.getTime()) && !this._isOutOfRange(parsed)) {
			// the input edits the date only; keep the previous value's time part
			const picked = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
			if (this._value) {
				picked.setHours(this._value.getHours(), this._value.getMinutes(), this._value.getSeconds(), 0);
			}
			const changed = !this._value || picked.valueOf() !== this._value.valueOf();
			this._value = picked;
			this._syncInputToValue();
			if (changed) {
				this._emitChange();
			}
		} else {
			// invalid text — revert to the last valid value
			this._syncInputToValue();
		}
	}

	private _isOutOfRange(date: Date): boolean {
		if (this._config.min && date.valueOf() < new Date(this._config.min.getFullYear(), this._config.min.getMonth(), this._config.min.getDate()).valueOf()) {
			return true;
		}
		if (this._config.max && new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf() > this._config.max.valueOf()) {
			return true;
		}
		return false;
	}

	/** Pulls a day-precision date inside [min, max] so keyboard focus never
	 * lands on a disabled day (boundaries are themselves in range). */
	private _clampToRange(date: Date): Date {
		if (this._config.min) {
			const min = new Date(this._config.min.getFullYear(), this._config.min.getMonth(), this._config.min.getDate());
			if (date.valueOf() < min.valueOf()) {
				return min;
			}
		}
		if (this._config.max) {
			const max = new Date(this._config.max.getFullYear(), this._config.max.getMonth(), this._config.max.getDate());
			if (date.valueOf() > max.valueOf()) {
				return max;
			}
		}
		return date;
	}

	private _shouldMarkNonWorkTime(): boolean {
		if (this._config.markNonWorkTime === false) {
			return false;
		}
		return this.$kit.context.hasWorkCalendar();
	}

	private _isWorkDay(date: Date): boolean {
		try {
			return this.$kit.context.isWorkDay(date);
		} catch {
			return true;
		}
	}

	private _syncInputToValue(): void {
		if (!this._input) {
			return;
		}
		this._input.value = this._value ? this._format(this._value) : "";
	}

	// --- masked text input (segmented day/month/year slots) -------------
	//
	// Reflects the committed value into the field: masked segments while
	// editing, the plain formatted string at rest. Shared by setValue / pickDay /
	// commit so masked and plain modes converge on one code path.
	private _reflectValue(): void {
		this._setSegmentsFromValue(this._value);
		if (this._mask && this._editing) {
			this._selectSegment(this._activeSeg);
		} else {
			this._syncInputToValue();
		}
	}

	/** placeholder hint derived from the mask, e.g. "%Y-%m-%d" → "YYYY-MM-DD" */
	private _maskHint(): string {
		if (!this._mask) {
			return "";
		}
		let text = "";
		this._mask.forEach((part) => {
			if (part.kind === "literal") {
				text += part.text;
			} else if (part.name === "day") {
				text += "DD";
			} else if (part.name === "month") {
				text += "MM";
			} else if (part.name === "year") {
				text += part.length === 2 ? "YY" : "YYYY";
			} else if (part.name === "hour") {
				text += "HH";
			} else if (part.name === "minute") {
				text += "mm";
			} else {
				text += this._upperMeridiem ? "AM" : "am";
			}
		});
		return text;
	}

	private _order(): DateSegName[] {
		const order: DateSegName[] = [];
		if (this._mask) {
			this._mask.forEach((part) => {
				if (part.kind === "segment") {
					order.push(part.name);
				}
			});
		}
		return order;
	}

	private _partFor(name: DateSegName): IDateSegmentPart | null {
		if (this._mask) {
			for (let i = 0; i < this._mask.length; i++) {
				const part = this._mask[i];
				if (part.kind === "segment" && part.name === name) {
					return part;
				}
			}
		}
		return null;
	}

	/** the year slot value for a full year: last two digits for %y, else the full year */
	private _yearSegmentValue(fullYear: number): number {
		const part = this._partFor("year");
		return part && part.length === 2 ? ((fullYear % 100) + 100) % 100 : fullYear;
	}

	private _emptySegs(): ISegValues {
		return { day: null, month: null, year: null, hour: null, minute: null, meridiem: null };
	}

	/** segment values for a Date (date slots always; time slots in withTime mode) */
	private _deriveSegs(value: Date | null): ISegValues {
		if (value === null) {
			return this._emptySegs();
		}
		const segs: ISegValues = {
			day: value.getDate(),
			month: value.getMonth() + 1,
			year: this._yearSegmentValue(value.getFullYear()),
			hour: null, minute: null, meridiem: null
		};
		if (this._withTime) {
			const h24 = value.getHours();
			segs.minute = value.getMinutes();
			if (this._is12h) {
				let h12 = h24 % 12;
				if (h12 === 0) {
					h12 = 12;
				}
				segs.hour = h12;
				segs.meridiem = h24 < 12 ? 0 : 1;
			} else {
				segs.hour = h24;
			}
		}
		return segs;
	}

	private _setSegmentsFromValue(value: Date | null): void {
		if (!this._mask) {
			return;
		}
		this._seg = this._deriveSegs(value);
	}

	private _formatSeg(part: IDateSegmentPart, value: number): string {
		if (part.name === "year") {
			return padLeft(String(Math.max(0, value)), part.length);
		}
		if (part.name === "meridiem") {
			const text = value === 1 ? "pm" : "am";
			return this._upperMeridiem ? text.toUpperCase() : text;
		}
		if (part.padded) {
			return padLeft(String(value), 2);
		}
		return String(value);
	}

	private _placeholderFor(part: IDateSegmentPart): string {
		const width = part.name === "year" ? part.length : 2;
		let s = "";
		for (let i = 0; i < width; i++) {
			s += DATE_PH_CHAR;
		}
		return s;
	}

	private _renderParts(): { text: string; ranges: { [k in DateSegName]?: [number, number] } } {
		const ranges: { [k in DateSegName]?: [number, number] } = {};
		let text = "";
		if (!this._mask) {
			return { text, ranges };
		}
		this._mask.forEach((part) => {
			if (part.kind === "literal") {
				text += part.text;
				return;
			}
			let segText: string;
			if (part.name === this._activeSeg && this._buffer !== "") {
				segText = this._buffer; // show the raw digits typed so far
			} else if (this._seg[part.name] !== null) {
				segText = this._formatSeg(part, this._seg[part.name] as number);
			} else {
				segText = this._placeholderFor(part);
			}
			const start = text.length;
			text += segText;
			ranges[part.name] = [start, start + segText.length];
		});
		return { text, ranges };
	}

	/** renders the current segments and selects `seg` whole — the single point
	 * that keeps the displayed text and the selection range consistent */
	private _selectSegment(seg: DateSegName): void {
		this._activeSeg = seg;
		if (!this._input) {
			return;
		}
		const parts = this._renderParts();
		this._input.value = parts.text;
		const range = parts.ranges[seg];
		if (range) {
			try {
				this._input.setSelectionRange(range[0], range[1]);
			} catch {
				// selection not supported / detached — ignore
			}
		}
		// keep the open time-picker section in sync with the active segment
		if (this._withTime && this._isOpen()) {
			this._refreshTimeColumns();
		}
	}

	private _moveToSegment(seg: DateSegName): void {
		this._buffer = "";
		this._selectSegment(seg);
	}

	private _moveRelative(dir: number): void {
		const order = this._order();
		let idx = order.indexOf(this._activeSeg);
		if (idx === -1) {
			idx = 0;
		}
		idx = Math.max(0, Math.min(order.length - 1, idx + dir));
		this._moveToSegment(order[idx]);
	}

	private _advance(): void {
		const order = this._order();
		const idx = order.indexOf(this._activeSeg);
		if (idx < order.length - 1) {
			this._moveToSegment(order[idx + 1]);
		} else {
			this._buffer = "";
			this._selectSegment(this._activeSeg);
		}
	}

	private _segmentAtPosition(pos: number): DateSegName {
		const ranges = this._renderParts().ranges;
		const order = this._order();
		for (let i = 0; i < order.length; i++) {
			const range = ranges[order[i]];
			if (range && pos >= range[0] && pos <= range[1]) {
				return order[i];
			}
		}
		return order[order.length - 1];
	}

	private _clearSeg(name: DateSegName): void {
		this._seg[name] = null;
	}

	private _enterEditing(): void {
		this._editing = true;
		this._setSegmentsFromValue(this._value);
		this._buffer = "";
		this._activeSeg = this._order()[0] || "day";
		this._selectSegment(this._activeSeg);
	}

	private _onFocus(): void {
		if (this._disabled) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
	}

	private _onBlur(): void {
		if (!this._editing) {
			return;
		}
		this._editing = false;
		this._commitMask(); // _reflectValue now renders the plain rest display
	}

	private _onMouseUp(): void {
		if (this._disabled || !this._input) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
		const pos = this._input.selectionStart || 0;
		this._moveToSegment(this._segmentAtPosition(pos));
	}

	private _onPaste(e: ClipboardEvent): void {
		e.preventDefault();
		const text = (e.clipboardData && e.clipboardData.getData("text")) || "";
		let parsed: Date | null = null;
		try {
			parsed = this._parse(text);
		} catch {
			parsed = null;
		}
		if (!parsed || isNaN(parsed.getTime()) || this._isOutOfRange(parsed)) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
		let picked: Date;
		if (this._withTime) {
			// keep the pasted time-of-day
			picked = new Date(parsed.valueOf());
		} else {
			picked = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
			if (this._value) {
				picked.setHours(this._value.getHours(), this._value.getMinutes(), this._value.getSeconds(), 0);
			}
		}
		const changed = !this._value || picked.valueOf() !== this._value.valueOf();
		this._value = picked;
		this._setSegmentsFromValue(picked);
		this._buffer = "";
		this._selectSegment(this._order()[0] || "day");
		this._afterSegmentChange();
		if (changed) {
			this._emitChange();
		}
	}

	/** closed-field keystrokes (the mask owns everything except calendar open) */
	private _onMaskKeyDown(e: KeyboardEvent): void {
		const key = e.key;
		if (key === "Tab") {
			// commit before bubbling: the grid inline editor saves on Tab keydown, before blur
			this._commitMask();
			return;
		}
		if (key === "Enter") {
			this._commitMask();
			return; // bubble for container save semantics
		}
		if (e.ctrlKey || e.metaKey || e.altKey) {
			return; // copy / paste / select-all
		}
		if (this._maskEditKey(e)) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
		if (key === "ArrowLeft") {
			e.preventDefault();
			this._moveRelative(-1);
			return;
		}
		if (key === "ArrowRight") {
			e.preventDefault();
			this._moveRelative(1);
			return;
		}
		if (key === "Home") {
			e.preventDefault();
			this._moveToSegment(this._order()[0]);
			return;
		}
		if (key === "End") {
			e.preventDefault();
			const order = this._order();
			this._moveToSegment(order[order.length - 1]);
			return;
		}
		// block any other printable key (letters, separators are fixed)
		if (key.length === 1) {
			e.preventDefault();
		}
	}

	/** digit / Backspace / Delete — meaning is the same whether the calendar is
	 * open or closed, so both keydown paths share this. Returns true when handled. */
	private _maskEditKey(e: KeyboardEvent): boolean {
		const key = e.key;
		if (/^[0-9]$/.test(key)) {
			e.preventDefault();
			if (!this._editing) {
				this._enterEditing();
			}
			this._onDigit(key);
			return true;
		}
		// meridiem: a/p set AM/PM (withTime, 12h)
		if (this._withTime && this._is12h && this._activeSeg === "meridiem" && /^[apAP]$/.test(key)) {
			e.preventDefault();
			if (!this._editing) {
				this._enterEditing();
			}
			this._seg.meridiem = key.toLowerCase() === "p" ? 1 : 0;
			this._buffer = "";
			this._advance();
			this._afterSegmentChange();
			return true;
		}
		if (key === "Backspace") {
			e.preventDefault();
			if (!this._editing) {
				this._enterEditing();
			}
			this._onBackspace();
			return true;
		}
		if (key === "Delete") {
			e.preventDefault();
			if (!this._editing) {
				this._enterEditing();
			}
			this._clearSeg(this._activeSeg);
			this._buffer = "";
			this._selectSegment(this._activeSeg);
			this._afterSegmentChange();
			return true;
		}
		return false;
	}

	private _onDigit(digit: string): void {
		const seg = this._activeSeg;
		let res: DateSegmentTypeResult;
		if (seg === "day") {
			res = typeDayDigit(this._buffer, digit);
		} else if (seg === "month") {
			res = typeMonthDigit(this._buffer, digit);
		} else if (seg === "year") {
			const part = this._partFor("year");
			res = typeYearDigit(this._buffer, digit, part ? part.length : 4);
		} else if (seg === "hour") {
			res = typeHourDigit(this._buffer, digit, this._is12h);
		} else if (seg === "minute") {
			res = typeMinuteDigit(this._buffer, digit);
		} else {
			return; // meridiem takes a/p letters, not digits
		}
		this._seg[seg] = res.value;
		this._buffer = res.buffer;
		if (res.complete) {
			this._advance();
		} else {
			this._selectSegment(seg);
		}
		this._afterSegmentChange();
	}

	private _onBackspace(): void {
		const cur = this._activeSeg;
		const empty = this._seg[cur] === null && this._buffer === "";
		if (empty) {
			const order = this._order();
			const idx = order.indexOf(cur);
			if (idx > 0) {
				const prev = order[idx - 1];
				this._clearSeg(prev);
				this._moveToSegment(prev);
				this._afterSegmentChange();
				return;
			}
		}
		this._clearSeg(cur);
		this._buffer = "";
		this._selectSegment(cur);
		this._afterSegmentChange();
	}

	/** Date composed from the current slots (with time when withTime), or null when
	 * a required slot is empty or the day/month combination is impossible (31 Feb). */
	private _composeDate(): Date | null {
		if (!this._mask || this._seg.day === null || this._seg.month === null || this._seg.year === null) {
			return null;
		}
		if (this._withTime && (this._seg.hour === null || this._seg.minute === null)) {
			return null;
		}
		let text = "";
		this._mask.forEach((part) => {
			if (part.kind === "literal") {
				text += part.text;
			} else {
				let value = this._seg[part.name];
				if (part.name === "meridiem" && value === null) {
					value = 0; // default to am when the meridiem slot was never set
				}
				text += this._formatSeg(part, value as number);
			}
		});
		let parsed: Date | null = null;
		try {
			parsed = this._parse(text);
		} catch {
			parsed = null;
		}
		if (!parsed || isNaN(parsed.getTime())) {
			return null;
		}
		// the Date constructor rolls impossible dates over (31 Feb → 3 Mar); reject
		// them so the mask never commits a day the user did not type
		if (parsed.getDate() !== this._seg.day || parsed.getMonth() + 1 !== this._seg.month) {
			return null;
		}
		return parsed;
	}

	/** day-precision Date from just the date slots (independent of the time slots),
	 * used to follow the typed date in the calendar grid before the time is set */
	private _focusDateFromSegs(): Date | null {
		if (!this._dateMask || this._seg.day === null || this._seg.month === null || this._seg.year === null) {
			return null;
		}
		let text = "";
		this._dateMask.forEach((part) => {
			if (part.kind === "literal") {
				text += part.text;
			} else {
				text += this._formatSeg(part, this._seg[part.name] as number);
			}
		});
		let parsed: Date | null = null;
		try {
			parsed = this._dateOnlyParse(text);
		} catch {
			parsed = null;
		}
		if (!parsed || isNaN(parsed.getTime())) {
			return null;
		}
		if (parsed.getDate() !== this._seg.day || parsed.getMonth() + 1 !== this._seg.month) {
			return null;
		}
		return parsed;
	}

	private _allSegsEmpty(): boolean {
		if (this._seg.day !== null || this._seg.month !== null || this._seg.year !== null) {
			return false;
		}
		if (this._withTime && (this._seg.hour !== null || this._seg.minute !== null || this._seg.meridiem !== null)) {
			return false;
		}
		return true;
	}

	private _maskIsDirty(): boolean {
		const fromValue = this._deriveSegs(this._value);
		const dateDirty = this._seg.day !== fromValue.day ||
			this._seg.month !== fromValue.month ||
			this._seg.year !== fromValue.year;
		if (dateDirty || !this._withTime) {
			return dateDirty;
		}
		return this._seg.hour !== fromValue.hour ||
			this._seg.minute !== fromValue.minute ||
			this._seg.meridiem !== fromValue.meridiem;
	}

	private _commitMask(): void {
		// all slots empty → clear
		if (this._allSegsEmpty()) {
			const changed = this._value !== null;
			this._value = null;
			this._reflectValue();
			if (changed) {
				this._emitChange();
			}
			return;
		}
		const parsed = this._composeDate();
		if (parsed && !this._isOutOfRange(parsed)) {
			let picked: Date;
			if (this._withTime) {
				// the mask carries the full date + time
				picked = new Date(parsed.valueOf());
			} else {
				// the mask edits the date only; keep the previous value's time part
				picked = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
				if (this._value) {
					picked.setHours(this._value.getHours(), this._value.getMinutes(), this._value.getSeconds(), 0);
				}
			}
			const changed = !this._value || picked.valueOf() !== this._value.valueOf();
			this._value = picked;
			this._reflectValue();
			if (changed) {
				this._emitChange();
			}
		} else {
			// incomplete or impossible date — revert to the last valid value
			this._reflectValue();
		}
	}

	/** while the calendar is open, follow the typed date so the grid and the masked
	 * text never disagree (date-only focus, so it tracks even before the time is set) */
	private _afterSegmentChange(): void {
		if (!this._isOpen()) {
			return;
		}
		this._refreshTimeColumns();
		const date = this._focusDateFromSegs();
		if (!date) {
			return;
		}
		// typing a full date always returns to the day grid so the composed date
		// is visible even if the user had drilled into the month/year picker
		this._viewMode = "days";
		this._focusDate = this._clampToRange(new Date(date.getFullYear(), date.getMonth(), date.getDate()));
		this._viewYear = this._focusDate.getFullYear();
		this._viewMonth = this._focusDate.getMonth();
		this._renderCalendar();
	}
}
