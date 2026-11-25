import { BaseControl } from "./base_component";
import { ITimeInputConfig } from "./types";
import { applyAria, el } from "./common";
import { Popup } from "../popup/popup";
import { buildTimeColumns, updateTimeColumnsHighlight } from "./time_columns";
import type { IUiKitRuntime } from "../ui_kit";

const MINUTES_PER_DAY = 24 * 60;
/** placeholder glyph shown for an empty segment while the field is being edited */
const PH = "––"; // "––"

type SegName = "hour" | "minute" | "meridiem";

/**
 * True when the format renders on a 12-hour clock — signalled by a 12h hour
 * token (%h/%g) or a meridiem token (%a/%A). Pure — exported for unit tests.
 */
export function is12HourFormat(format: string): boolean {
	if (!format) {
		return false;
	}
	return /%[hg]/.test(format) || /%[aA]/.test(format);
}

/**
 * Whether the meridiem renders upper-case ("AM"/"PM", token %A) vs
 * lower-case ("am"/"pm", token %a). Defaults to upper-case, matching gantt's
 * %A default. Pure — exported for unit tests.
 */
export function isUpperMeridiem(format: string): boolean {
	return !(/%a/.test(format) && !/%A/.test(format));
}

/**
 * Whether the hour segment carries a leading zero: padded for %H/%h, bare for
 * %G/%g, padded by default. Pure — exported for unit tests.
 */
export function isHourPadded(format: string): boolean {
	return !/%[Gg]/.test(format);
}

/**
 * Rounds minutes-past-midnight to the nearest allowed step and clamps the
 * result into a single day (0 .. last valid step). A step of 60 with input
 * 23:59 rounds down to 23:00, never 24:00. Pure — exported for unit tests.
 */
export function roundToStep(minutes: number, step: number): number {
	if (isNaN(minutes)) {
		return 0;
	}
	const stride = step && step > 0 ? step : 1;
	let value = Math.round(minutes / stride) * stride;
	if (value < 0) {
		value = 0;
	}
	// largest multiple of the step that still falls within the day
	const lastSlot = Math.floor((MINUTES_PER_DAY - 1) / stride) * stride;
	if (value > lastSlot) {
		value = lastSlot;
	}
	return value;
}

/**
 * Formats minutes-past-midnight as "HH:MM" (24h) or "hh:MM AM/PM" (12h);
 * "" for null/invalid. `padHour` controls the hour leading zero (24h always
 * pads). Pure — exported for unit tests.
 */
export function formatTimeValue(minutes: number | null, is12h: boolean, upperMeridiem: boolean = true, padHour: boolean = true): string {
	if (minutes === null || minutes === undefined || isNaN(minutes as number)) {
		return "";
	}
	let m = Math.round(minutes as number);
	m = ((m % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
	const hours = Math.floor(m / 60);
	const mins = m % 60;
	const mm = mins < 10 ? "0" + mins : String(mins);
	if (is12h) {
		let hour12 = hours % 12;
		if (hour12 === 0) {
			hour12 = 12;
		}
		const hh = padHour && hour12 < 10 ? "0" + hour12 : String(hour12);
		let suffix = hours < 12 ? "am" : "pm";
		if (upperMeridiem) {
			suffix = suffix.toUpperCase();
		}
		return hh + ":" + mm + " " + suffix;
	}
	const hh = padHour && hours < 10 ? "0" + hours : String(hours);
	return hh + ":" + mm;
}

/**
 * Parses masked "HH:MM"(+AM/PM) text into minutes past midnight. Tolerant of
 * "930", "9 30", "9:30pm"; null for empty/invalid. Used for paste and external
 * callers. Pure — exported for unit tests.
 */
export function parseTimeInput(text: string, is12h: boolean): number | null {
	if (text === null || text === undefined) {
		return null;
	}
	const raw = String(text).trim().toLowerCase();
	if (!raw) {
		return null;
	}
	let meridiem: "am" | "pm" | null = null;
	if (raw.indexOf("p") !== -1) {
		meridiem = "pm";
	} else if (raw.indexOf("a") !== -1) {
		meridiem = "am";
	}
	const groups = raw.match(/\d+/g);
	if (!groups || !groups.length) {
		return null;
	}
	let hours: number;
	let minutes: number;
	if (groups.length === 1) {
		const digits = groups[0];
		if (digits.length <= 2) {
			hours = parseInt(digits, 10);
			minutes = 0;
		} else {
			// "930" -> 9:30, "0930" -> 09:30: last two digits are the minutes
			minutes = parseInt(digits.slice(-2), 10);
			hours = parseInt(digits.slice(0, -2), 10);
		}
	} else {
		hours = parseInt(groups[0], 10);
		minutes = parseInt(groups[1], 10);
	}
	if (isNaN(hours) || isNaN(minutes) || minutes > 59) {
		return null;
	}
	if (is12h) {
		if (hours < 1 || hours > 12) {
			return null;
		}
		hours = hours % 12;
		if (meridiem === "pm") {
			hours += 12;
		}
	} else if (hours > 23) {
		return null;
	}
	const total = hours * 60 + minutes;
	if (total < 0 || total >= MINUTES_PER_DAY) {
		return null;
	}
	return total;
}

export interface SegmentTypeResult {
	/** digit buffer retained when a second digit could still follow */
	buffer: string;
	/** resolved segment value (24h hour 0–23, 12h hour 1–12, minute 0–59), or null */
	value: number | null;
	/** true when the segment is filled and focus should advance to the next one */
	complete: boolean;
}

/**
 * Overwrite-style digit entry for the hour segment. Given the digits typed so
 * far in this segment (`buffer`) and a new `digit`, returns the new buffer, the
 * resolved hour and whether the segment is complete. Never yields an invalid
 * hour — a second digit that would overflow restarts from that digit (Chrome
 * time-field semantics: 24h "2"+"5" → 05; 12h "0" → 12). Pure — unit-tested.
 */
export function typeHourDigit(buffer: string, digit: string, is12h: boolean): SegmentTypeResult {
	const d = parseInt(digit, 10);
	if (isNaN(d)) {
		return { buffer, value: buffer ? parseInt(buffer, 10) : null, complete: false };
	}
	if (is12h) {
		if (buffer === "") {
			if (d === 0) {
				return { buffer: "", value: 12, complete: true }; // 0 → 12 on a 12h clock
			}
			if (d === 1) {
				return { buffer: "1", value: 1, complete: false }; // could still become 10/11/12
			}
			return { buffer: "", value: d, complete: true }; // 2–9: no valid second digit
		}
		const cand = 10 + d;
		if (cand <= 12) {
			return { buffer: "", value: cand, complete: true };
		}
		return typeHourDigit("", digit, is12h); // overflow → restart from this digit
	}
	if (buffer === "") {
		if (d >= 3) {
			return { buffer: "", value: d, complete: true }; // 3–9: 30+ invalid, single digit
		}
		return { buffer: String(d), value: d, complete: false }; // 0/1/2: wait for a second digit
	}
	const cand = parseInt(buffer, 10) * 10 + d;
	if (cand <= 23) {
		return { buffer: "", value: cand, complete: true };
	}
	return typeHourDigit("", digit, is12h); // overflow → restart from this digit
}

/**
 * Overwrite-style digit entry for the minute segment (0–59). A first digit ≥ 6
 * completes immediately (60+ impossible); otherwise a second digit completes it.
 * Pure — unit-tested.
 */
export function typeMinuteDigit(buffer: string, digit: string): SegmentTypeResult {
	const d = parseInt(digit, 10);
	if (isNaN(d)) {
		return { buffer, value: buffer ? parseInt(buffer, 10) : null, complete: false };
	}
	if (buffer === "") {
		if (d >= 6) {
			return { buffer: "", value: d, complete: true };
		}
		return { buffer: String(d), value: d, complete: false };
	}
	const cand = parseInt(buffer, 10) * 10 + d;
	return { buffer: "", value: cand, complete: true };
}

/**
 * TimeInput — masked, segmented time-of-day field (design §6.1 amendment
 * 2026-07-06, migration Step 6). Value = minutes past midnight (0..1439) or
 * null. 24h vs 12h, the meridiem case and the hour leading zero are derived
 * from the time format (config.format || gantt.config.time_picker); the
 * rounding step from config.step || gantt.config.time_step.
 *
 * Editing model (native `<input type="time">` semantics): the field is split
 * into hour / minute / (12h) meridiem segments joined by fixed separators the
 * user can never type over. Clicking a segment selects it whole; typing
 * OVERWRITES the selected segment and auto-advances once the segment can hold
 * no more (24h "2"+"5" → 05→minute, 12h "3" → 3→minute). Arrow Left/Right move
 * between segments, Up/Down step the active segment, Backspace clears it. The
 * field never shows an invalid value; on commit (blur/Enter) it rounds to the
 * nearest allowed step. Phase 2 (deferred) adds a multi-column dropdown.
 */
export class TimeInput extends BaseControl<number | null> {
	private _config: ITimeInputConfig;
	private _input: HTMLInputElement | null = null;
	private _value: number | null = null;
	private _is12h: boolean;
	private _upperMeridiem: boolean;
	private _padHour: boolean;
	private _step: number;
	private _min: number;
	private _max: number;
	private _hasDropdown: boolean;
	private _dropdown: Popup | null = null;
	private _dropdownEl: HTMLElement | null = null;
	private _editing: boolean = false;
	private _activeSeg: SegName = "hour";
	private _buffer: string = "";
	private _seg: { hour: number | null; minute: number | null; meridiem: "am" | "pm" | null } = {
		hour: null, minute: null, meridiem: null
	};

	constructor(kit: IUiKitRuntime, config?: ITimeInputConfig) {
		super(kit);
		this._config = config || {};
		const context = kit.context;
		const format = context.getTimeFormat(this._config.format);
		this._is12h = is12HourFormat(format);
		this._upperMeridiem = isUpperMeridiem(format);
		this._padHour = isHourPadded(format);
		const step = this._config.step !== undefined
			? this._config.step
			: context.getTimeStep();
		this._step = step && step > 0 ? step : 60;
		this._min = Math.max(0, Math.min(MINUTES_PER_DAY - 1, this._config.min === undefined ? 0 : this._config.min));
		this._max = Math.max(this._min, Math.min(MINUTES_PER_DAY - 1, this._config.max === undefined ? MINUTES_PER_DAY - 1 : this._config.max));
		this._hasDropdown = this._config.dropdown !== false;
	}

	public getValue(): number | null {
		return this._value;
	}

	public setValue(value: number | null, options?: { preserveUnaligned?: boolean }): void {
		if (value === null || value === undefined || isNaN(value as number)) {
			this._value = null;
		} else {
			this._value = this._normalize(value as number, !!(options && options.preserveUnaligned));
		}
		this._setSegmentsFromValue(this._value);
		if (this._editing) {
			this._renderEditing();
			this._selectSegment(this._activeSeg);
		} else {
			this._syncDisplay();
		}
	}

	public destroy(): void {
		this._closeDropdown();
		super.destroy();
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_time_input" +
			(this._hasDropdown ? " dhx_ui_time_input_has_dropdown" : ""));
		const input = el("input", "dhx_ui_input dhx_ui_time_input_field", {
			type: "text",
			inputmode: this._is12h ? "text" : "numeric",
			autocomplete: "off",
			autocapitalize: "off",
			spellcheck: "false"
		}) as HTMLInputElement;
		input.setAttribute("placeholder", this._config.placeholder || (this._is12h ? "hh:mm AM" : "HH:MM"));

		this._listen(input, "keydown", (e: KeyboardEvent) => this._onKeyDown(e));
		this._listen(input, "focus", () => this._onFocus());
		this._listen(input, "blur", () => this._onBlur());
		this._listen(input, "mouseup", () => this._onMouseUp());
		this._listen(input, "paste", (e: ClipboardEvent) => this._onPaste(e));

		root.appendChild(input);
		this._input = input;

		if (this._hasDropdown) {
			const toggle = el("span", "dhx_ui_time_input_toggle " + this.$kit.context.icon("timer"));
			applyAria(this.$kit.context, toggle, { "aria-hidden": "true" });
			this._listen(toggle, "mousedown", (e: Event) => {
				e.preventDefault(); // keep focus on the input
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
			root.appendChild(toggle);
		}

		this._onDestroy(() => {
			this._input = null;
		});
		this._syncDisplay();
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}

	// --- segment <-> value -------------------------------------------------

	private _order(): SegName[] {
		return this._is12h ? ["hour", "minute", "meridiem"] : ["hour", "minute"];
	}

	private _setSegmentsFromValue(value: number | null): void {
		if (value === null) {
			this._seg = { hour: null, minute: null, meridiem: null };
			return;
		}
		const h24 = Math.floor(value / 60);
		const minute = value % 60;
		if (this._is12h) {
			const meridiem = h24 < 12 ? "am" : "pm";
			let h12 = h24 % 12;
			if (h12 === 0) {
				h12 = 12;
			}
			this._seg = { hour: h12, minute, meridiem };
		} else {
			this._seg = { hour: h24, minute, meridiem: null };
		}
	}

	/** Minutes past midnight from the current segments, or null if not composable. */
	private _composeValue(): number | null {
		if (this._seg.hour === null) {
			return null;
		}
		const minute = this._seg.minute === null ? 0 : this._seg.minute;
		let h24: number;
		if (this._is12h) {
			const meridiem = this._seg.meridiem || "am";
			h24 = (this._seg.hour % 12) + (meridiem === "pm" ? 12 : 0);
		} else {
			h24 = this._seg.hour;
		}
		return h24 * 60 + minute;
	}

	private _clearSeg(name: SegName): void {
		if (name === "hour") {
			this._seg.hour = null;
		} else if (name === "minute") {
			this._seg.minute = null;
		} else {
			this._seg.meridiem = null;
		}
	}

	// --- rendering ---------------------------------------------------------

	private _renderParts(): { text: string; ranges: { [k in SegName]?: [number, number] } } {
		const hourText = this._seg.hour === null
			? PH
			: (this._padHour && this._seg.hour < 10 ? "0" + this._seg.hour : String(this._seg.hour));
		const minuteText = this._seg.minute === null
			? PH
			: (this._seg.minute < 10 ? "0" + this._seg.minute : String(this._seg.minute));

		let text = hourText + ":" + minuteText;
		const ranges: { [k in SegName]?: [number, number] } = {
			hour: [0, hourText.length],
			minute: [hourText.length + 1, hourText.length + 1 + minuteText.length]
		};
		if (this._is12h) {
			const merText = this._seg.meridiem === null
				? PH
				: (this._upperMeridiem ? this._seg.meridiem.toUpperCase() : this._seg.meridiem);
			text += " " + merText;
			ranges.meridiem = [text.length - merText.length, text.length];
		}
		return { text, ranges };
	}

	private _renderEditing(): void {
		if (this._input) {
			this._input.value = this._renderParts().text;
		}
	}

	private _syncDisplay(): void {
		if (!this._input) {
			return;
		}
		this._input.value = this._value === null
			? ""
			: formatTimeValue(this._value, this._is12h, this._upperMeridiem, this._padHour);
	}

	private _selectSegment(seg: SegName): void {
		this._activeSeg = seg;
		if (!this._input) {
			return;
		}
		const range = this._renderParts().ranges[seg];
		if (range) {
			try {
				this._input.setSelectionRange(range[0], range[1]);
			} catch {
				// selection not supported / detached — ignore
			}
		}
		// keep the open dropdown in sync with the segment the field now shows
		if (this._isOpen()) {
			this._refreshDropdownHighlight();
		}
	}

	/** move to a new segment: reset the typing buffer, then select it whole */
	private _moveToSegment(seg: SegName): void {
		this._buffer = "";
		this._selectSegment(seg);
	}

	private _advance(): void {
		const order = this._order();
		const idx = order.indexOf(this._activeSeg);
		if (idx < order.length - 1) {
			this._moveToSegment(order[idx + 1]);
		} else {
			// last segment: stay put, ready to overwrite again
			this._buffer = "";
			this._selectSegment(this._activeSeg);
		}
	}

	private _segmentAtPosition(pos: number): SegName {
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

	// --- editing lifecycle -------------------------------------------------

	private _enterEditing(): void {
		this._editing = true;
		this._setSegmentsFromValue(this._value);
		this._buffer = "";
		this._activeSeg = "hour";
		this._renderEditing();
		this._selectSegment("hour");
	}

	private _onFocus(): void {
		if (!this._editing) {
			this._enterEditing();
		}
	}

	private _onBlur(): void {
		this._commit();
		this._editing = false;
		this._syncDisplay();
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
		const parsed = parseTimeInput(text, this._is12h);
		if (parsed === null) {
			return;
		}
		const rounded = this._normalize(parsed, false);
		const changed = rounded !== this._value;
		this._value = rounded;
		this._setSegmentsFromValue(rounded);
		this._renderEditing();
		this._selectSegment("hour");
		if (changed) {
			this._emitChange();
		}
	}

	private _onKeyDown(e: KeyboardEvent): void {
		const key = e.key;
		// Alt+ArrowDown opens the dropdown (native combobox pattern); plain
		// ArrowUp/Down keep stepping the segment
		if (this._hasDropdown && e.altKey && key === "ArrowDown") {
			e.preventDefault();
			if (!this._isOpen()) {
				this._openDropdown();
			}
			return;
		}
		// pass-through: focus movement, container save/cancel, clipboard combos
		if (key === "Tab") {
			if (this._isOpen()) {
				this._closeDropdownKeepFocus();
			}
			return;
		}
		if (key === "Enter") {
			if (this._isOpen()) {
				// first Enter closes the dropdown (keeps the value); a second one
				// bubbles for container save semantics
				e.preventDefault();
				e.stopPropagation();
				this._commit();
				this._renderEditing();
				this._selectSegment(this._activeSeg);
				this._closeDropdownKeepFocus();
				return;
			}
			this._commit();
			if (this._editing) {
				this._renderEditing();
				this._selectSegment(this._activeSeg);
			}
			return; // let it bubble (container save semantics)
		}
		if (key === "Escape") {
			if (this._isOpen()) {
				e.preventDefault();
				e.stopPropagation();
				this._closeDropdownKeepFocus();
				return;
			}
			return; // leave unhandled: container cancel keydown acts on it
		}
		if (e.ctrlKey || e.metaKey || e.altKey) {
			return; // copy / paste / select-all
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
		if (key === "ArrowUp") {
			e.preventDefault();
			this._stepSegment(1);
			return;
		}
		if (key === "ArrowDown") {
			e.preventDefault();
			this._stepSegment(-1);
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
		if (key === "Backspace") {
			e.preventDefault();
			this._onBackspace();
			return;
		}
		if (key === "Delete") {
			e.preventDefault();
			this._clearSeg(this._activeSeg);
			this._buffer = "";
			this._renderEditing();
			this._selectSegment(this._activeSeg);
			return;
		}
		if (/^[0-9]$/.test(key)) {
			e.preventDefault();
			this._onDigit(key);
			return;
		}
		if (this._is12h && this._activeSeg === "meridiem" && /^[apAP]$/.test(key)) {
			e.preventDefault();
			this._seg.meridiem = key.toLowerCase() === "p" ? "pm" : "am";
			this._renderEditing();
			this._selectSegment("meridiem");
			return;
		}
		// block any other printable key (letters, ':', space) — separators are fixed
		if (key.length === 1) {
			e.preventDefault();
		}
	}

	// --- editing operations ------------------------------------------------

	private _onDigit(digit: string): void {
		if (this._activeSeg === "hour") {
			const res = typeHourDigit(this._buffer, digit, this._is12h);
			this._seg.hour = res.value;
			this._buffer = res.buffer;
			this._renderEditing();
			if (res.complete) {
				this._advance();
			} else {
				this._selectSegment("hour");
			}
		} else if (this._activeSeg === "minute") {
			const res = typeMinuteDigit(this._buffer, digit);
			this._seg.minute = res.value;
			this._buffer = res.buffer;
			this._renderEditing();
			if (res.complete) {
				this._advance();
			} else {
				this._selectSegment("minute");
			}
		}
		// digits on the meridiem segment are ignored
	}

	private _onBackspace(): void {
		const cur = this._activeSeg;
		const empty = (cur === "hour" && this._seg.hour === null) ||
			(cur === "minute" && this._seg.minute === null) ||
			(cur === "meridiem" && this._seg.meridiem === null);
		if (empty) {
			const order = this._order();
			const idx = order.indexOf(cur);
			if (idx > 0) {
				const prev = order[idx - 1];
				this._clearSeg(prev);
				this._renderEditing();
				this._moveToSegment(prev);
				return;
			}
		}
		this._clearSeg(cur);
		this._buffer = "";
		this._renderEditing();
		this._selectSegment(cur);
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

	private _stepSegment(dir: number): void {
		if (this._disabled) {
			return;
		}
		if (this._activeSeg === "hour") {
			if (this._is12h) {
				let h = this._seg.hour === null ? (dir > 0 ? 1 : 12) : this._seg.hour + dir;
				if (h > 12) {
					h = 1;
				} else if (h < 1) {
					h = 12;
				}
				this._seg.hour = h;
			} else {
				let h = this._seg.hour === null ? (dir > 0 ? 0 : 23) : this._seg.hour + dir;
				h = ((h % 24) + 24) % 24;
				this._seg.hour = h;
			}
		} else if (this._activeSeg === "minute") {
			const stride = this._step >= 60 ? 60 : this._step;
			let m = this._seg.minute === null ? (dir > 0 ? 0 : 60 - stride) : this._seg.minute + dir * stride;
			m = ((m % 60) + 60) % 60;
			this._seg.minute = m;
		} else {
			this._seg.meridiem = this._seg.meridiem === "pm" ? "am" : "pm";
		}
		this._buffer = "";
		this._renderEditing();
		this._selectSegment(this._activeSeg);
	}

	private _commit(): void {
		const composed = this._composeValue();
		const rounded = composed === null ? null : this._normalize(composed, false);
		const changed = rounded !== this._value;
		this._value = rounded;
		this._setSegmentsFromValue(rounded);
		if (changed) {
			this._emitChange();
		}
	}

	private _normalize(value: number, preserveUnaligned: boolean): number {
		const normalized = preserveUnaligned ? Math.round(value) : roundToStep(value, this._step);
		return Math.max(this._min, Math.min(this._max, normalized));
	}

	// --- multi-column dropdown (hours · minutes · optional AM/PM), Phase 2 ---
	//
	// A visual companion to the masked field: the columns mirror the segments,
	// clicking a cell sets that segment and commits; the segment keyboard keeps
	// working while it is open and the highlight follows. Focus stays on the
	// input (the dropdown swallows mousedown) so the mask keeps receiving keys.

	private _isOpen(): boolean {
		return !!(this._dropdown && this._dropdown.isVisible());
	}

	private _openDropdown(): void {
		if (this._disabled || !this._root || !this._hasDropdown) {
			return;
		}
		if (!this._editing) {
			this._enterEditing();
		}
		if (!this._dropdown) {
			const config = {
				className: "dhx_ui_time_dropdown",
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
				this._dropdownEl = null;
			});
		}
		const columns = buildTimeColumns(this.$kit.context, {
			is12h: this._is12h,
			step: this._step,
			padHour: this._padHour,
			upperMeridiem: this._upperMeridiem
		}, (seg, value) => this._onDropdownPick(seg as SegName, value));
		this._dropdownEl = columns;
		this._dropdown.show(columns);
		this._refreshDropdownHighlight();
	}

	private _refreshDropdownHighlight(): void {
		if (this._dropdownEl) {
			updateTimeColumnsHighlight(this._dropdownEl, this._seg, this._activeSeg);
		}
	}

	private _closeDropdown(): void {
		if (this._dropdown) {
			this._dropdown.destroy();
			this._dropdown = null;
			this._dropdownEl = null;
		}
	}

	private _closeDropdownKeepFocus(): void {
		if (this._dropdown) {
			this._dropdown.hide();
		}
	}

	private _onDropdownPick(seg: SegName, value: string): void {
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
			this._seg.meridiem = value === "pm" ? "pm" : "am";
		}
		this._buffer = "";
		// commit only once a value is composable (hour set); picking a minute or
		// meridiem first keeps the partial segment visible instead of clearing it
		if (this._composeValue() !== null) {
			this._commit(); // compose + round + emit + re-derive segments
		}
		this._renderEditing();
		this._selectSegment(seg); // also refreshes the dropdown highlight
	}
}
