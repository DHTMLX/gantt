// `task.pauses` - interruptions inside a single task, written by resource
// leveling (MS Project "split" model), in the shape of the PlanningEngine:
// `[{ at, length, by? }]`, elapsed (wall-clock) time in `duration_unit` (a day
// is 24 hours) from the task start. The contract is in
// docs/internal/leveling/pauses.md.
//
// The algorithm ports PlanningEngine's `gaps.rs` (@dhtmlx/plen `src/core/gaps.ts`,
// `7f88549`): pauses become a window `[work, gap, work, gap, ...]` of whole
// minutes anchored at the task start, the task works its `duration` in the work
// stretches, and the rest runs after the last pause. Gantt core and the v2
// scheduler (through its calendar adapter) share this module, so both place a
// paused task as the engine does.
import type { GanttInternal } from "../../types/gantt_internal_types";
import type { Calendar, Task, TaskPause } from "../../types/gantt_types";

export interface WorkSegment {
	start_date: Date;
	end_date: Date;
}

// The calendar operations the window math needs. `steps` are whole working
// days in the day unit and working minutes otherwise, as in the engine.
export interface PauseCalendar {
	addSteps(start: Date, steps: number): Date;
	// Whole steps that fit between the dates (0 when `to <= from`).
	countSteps(from: Date, to: Date): number;
	// Duration in the task's unit, as the calendar measures it.
	measure(from: Date, to: Date): number;
	// Whether the date has any working time; only read in the day unit.
	isWorkingDay(date: Date): boolean;
}

const UNIT_MINUTES: Record<string, number> = { minute: 1, hour: 60, day: 1440 };

// Pauses apply only in the units the engine supports.
export function pauseUnitMinutes(unit: string): number {
	return UNIT_MINUTES[unit] || 0;
}

// Within this relative error, adjacent pauses do not overlap: minute-exact
// fractions such as 1/60 + 31/60 exceed 32/60 by an ulp (engine rule).
const OVERLAP_TOLERANCE = 1e-9;

// Converts a loaded value into a valid list, or returns null when the value
// can't be used. XML and form data deliver a JSON string. The rules are the
// engine's: finite, `at >= 0`, `length > 0`, sorted by `at`, not overlapping,
// and `by` is "leveling" when present.
export function parsePauses(value: any): TaskPause[] | null {
	let list = value;
	if (typeof list === "string") {
		const text = list.trim();
		if (!text) {
			return [];
		}
		try {
			list = JSON.parse(text);
		} catch {
			return null;
		}
	}
	if (!Array.isArray(list)) {
		return null;
	}
	const result: TaskPause[] = [];
	let end = 0;
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		if (!item || typeof item !== "object") {
			return null;
		}
		const at = toNumber(item.at);
		const length = toNumber(item.length);
		if (!isFinite(at) || at < 0 || !isFinite(length) || length <= 0) {
			return null;
		}
		if (end - at > OVERLAP_TOLERANCE * Math.max(end, 1)) {
			return null;
		}
		if (item.by !== undefined && item.by !== null && item.by !== "leveling") {
			return null;
		}
		const pause: TaskPause = { at, length };
		if (item.by === "leveling") {
			pause.by = "leveling";
		}
		result.push(pause);
		end = at + length;
	}
	return result;
}

function toNumber(value: any): number {
	if (value === null || value === "" || typeof value === "boolean" || value === undefined) {
		return NaN;
	}
	return Number(value);
}

// Pauses apply only to regular scheduled tasks, in a supported unit with a
// step of 1: the window math counts whole days or minutes, as the engine does.
export function hasPauses(gantt: GanttInternal, task: Task): boolean {
	if (!task || !Array.isArray(task.pauses) || !task.pauses.length) {
		return false;
	}
	const config = gantt.config;
	if (task.unscheduled || !pauseUnitMinutes(config.duration_unit) || config.duration_step !== 1) {
		return false;
	}
	return gantt.getTaskType(task.type) === config.types.task;
}

// Window math on a gantt calendar, in `unit`: whole working days for "day",
// working minutes for "minute" and "hour".
export function createPauseCalendar(calendar: Calendar, unit: string): PauseCalendar {
	if (unit === "day") {
		const addDays = (start: Date, days: number) =>
			calendar.calculateEndDate({ start_date: start, duration: days, unit: "day", step: 1 });
		return {
			addSteps: addDays,
			countSteps(from: Date, to: Date): number {
				let count = 0;
				let current = from;
				for (;;) {
					const next = addDays(current, 1);
					if (+next > +to || +next <= +current) {
						return count;
					}
					count++;
					current = next;
				}
			},
			measure: (from: Date, to: Date) =>
				calendar.calculateDuration({ start_date: from, end_date: to, unit: "day", step: 1 }),
			isWorkingDay: (date: Date) => calendar.isWorkTime({ date: date, unit: "day" })
		};
	}
	// minute-exact, as the engine: an hour duration can be fractional here
	const minutes = (from: Date, to: Date) => +to > +from
		? Math.max(calendar.calculateDuration({ start_date: from, end_date: to, unit: "minute", step: 1 }), 0)
		: 0;
	return {
		addSteps: (start: Date, steps: number) =>
			calendar.calculateEndDate({ start_date: start, duration: steps, unit: "minute", step: 1 }),
		countSteps: minutes,
		measure: (from: Date, to: Date) => minutes(from, to) / pauseUnitMinutes(unit),
		isWorkingDay: () => true
	};
}

// ── Window ──────────────────────────────────────────────────────────────────

// Pauses as `[work, gap, ...]` in whole minutes: a pause occupies
// `[round(at), round(at + length))`, and one that rounds to nothing is dropped.
// A work entry may be 0 (a pause at the start, adjacent pauses); a gap may not.
export function getPauseWindow(pauses: readonly TaskPause[], unit: string): number[] {
	const size = pauseUnitMinutes(unit);
	const window: number[] = [];
	let cursor = 0;
	for (const pause of pauses) {
		const from = Math.max(Math.round(pause.at * size), cursor);
		const to = Math.round((pause.at + pause.length) * size);
		if (to <= from) {
			continue;
		}
		window.push(from - cursor, to - from);
		cursor = to;
	}
	return window;
}

// `date` moved by whole wall-clock minutes (local time, as the engine's naive
// minutes: a day stays a calendar day across a DST change).
function shiftMinutes(date: Date, minutes: number): Date {
	const result = new Date(date.valueOf());
	if (minutes) {
		result.setMinutes(result.getMinutes() + minutes);
	}
	return result;
}

interface Stretch {
	from: Date;		// work allowed from
	to: Date;		// the pause starts
	resume: Date;	// the pause ends
}

function getStretches(anchor: Date, window: readonly number[]): Stretch[] {
	const stretches: Stretch[] = [];
	let offset = 0;
	for (let i = 0; i + 1 < window.length; i += 2) {
		const from = shiftMinutes(anchor, offset);
		offset += window[i];
		const to = shiftMinutes(anchor, offset);
		offset += window[i + 1];
		stretches.push({ from, to, resume: shiftMinutes(anchor, offset) });
	}
	return stretches;
}

function windowLength(window: readonly number[]): number {
	let sum = 0;
	for (let i = 0; i < window.length; i++) {
		sum += window[i];
	}
	return sum;
}

// ── Bar parts (no calendar) ─────────────────────────────────────────────────

// The bar parts: the work stretches from `start_date`, cut at `end_date`, then
// the rest up to `end_date`. An `end_date` inside a pause ends the bar where the
// pause begins. A single segment without pauses.
export function getWorkSegments(gantt: GanttInternal, task: Task): WorkSegment[] {
	const start = task.start_date;
	const end = task.end_date;
	if (!start || !end) {
		return [];
	}
	if (!hasPauses(gantt, task)) {
		return [{ start_date: start, end_date: end }];
	}
	return getSegments(start, end, getPauseWindow(task.pauses, gantt.config.duration_unit));
}

function getSegments(start: Date, end: Date, window: readonly number[]): WorkSegment[] {
	const segments: WorkSegment[] = [];
	const stretches = getStretches(start, window);
	for (const stretch of stretches) {
		const to = +stretch.to < +end ? stretch.to : end;
		if (+to > +stretch.from) {
			segments.push({ start_date: stretch.from, end_date: to });
		}
		if (+end <= +stretch.resume) {
			return segments;
		}
	}
	const from = stretches.length ? stretches[stretches.length - 1].resume : start;
	if (+end > +from) {
		segments.push({ start_date: from, end_date: end });
	}
	return segments;
}

// ── Calendar math ───────────────────────────────────────────────────────────

// In the day unit a stretch that opens on a non-working date begins on the next
// working date at the same time of day (Sat 08:00 -> Mon 08:00); minute steps
// skip non-working time themselves.
const MAX_DAY_SCAN = 3660;

function begin(calendar: PauseCalendar, date: Date, unit: string): Date {
	if (unit !== "day") {
		return date;
	}
	let current = date;
	for (let i = 0; i < MAX_DAY_SCAN; i++) {
		if (calendar.isWorkingDay(current)) {
			return current;
		}
		current = shiftMinutes(current, UNIT_MINUTES.day);
	}
	return date;
}

// Whole steps of `duration`: working days in the day unit, minutes otherwise.
export function getPauseSteps(duration: number, unit: string): number {
	return unit === "day" ? Math.round(duration) : Math.round(duration * pauseUnitMinutes(unit));
}

function fromSteps(steps: number, unit: string): number {
	return unit === "day" ? steps : steps / pauseUnitMinutes(unit);
}

// End of `duration` work from `start`: each stretch holds the steps that fit in
// it, and the rest runs after the last pause. A pause after the work is done is
// not reached.
export function getPausedEndDate(calendar: PauseCalendar, start: Date, duration: number,
	unit: string, window: readonly number[]): Date {
	let left = getPauseSteps(duration, unit);
	for (const stretch of getStretches(start, window)) {
		const from = begin(calendar, stretch.from, unit);
		const held = Math.min(calendar.countSteps(from, stretch.to), left);
		left -= held;
		if (left <= 0) {
			return held > 0 ? calendar.addSteps(from, held) : from;
		}
	}
	const from = begin(calendar, shiftMinutes(start, windowLength(window)), unit);
	return calendar.addSteps(from, left);
}

// Work in `[start, end)`: what the reached stretches hold, plus the open part.
export function getPausedDuration(calendar: PauseCalendar, start: Date, end: Date,
	unit: string, window: readonly number[]): number {
	const measure = (from: Date) => (+end > +from ? calendar.measure(from, end) : 0);
	let held = 0;
	for (const stretch of getStretches(start, window)) {
		const from = begin(calendar, stretch.from, unit);
		if (+end <= +stretch.to) {
			return fromSteps(held, unit) + measure(from);
		}
		held += calendar.countSteps(from, stretch.to);
		if (+end <= +stretch.resume) {
			return fromSteps(held, unit);
		}
	}
	const from = begin(calendar, shiftMinutes(start, windowLength(window)), unit);
	return fromSteps(held, unit) + measure(from);
}

// The latest start whose forward fill ends by `end`. The forward end is not
// monotonic in the start (a stretch moving off a weekend can finish earlier
// from a later start), so this walks back from `latest` (the start without
// pauses) by each try's overshoot, snapped forward when that still fits; the
// engine's `searchStart`. `latest - window` always fits.
export function getPausedStartDate(end: Date, latest: Date, window: readonly number[],
	forward: (start: Date) => Date, snap: (start: Date) => Date): Date {
	const floor = shiftMinutes(latest, -windowLength(window));
	let start = latest;
	for (let i = 0; i < 64; i++) {
		const reached = forward(start);
		if (+reached <= +end) {
			return start;
		}
		const raw = shiftMinutes(start, Math.round((+end - +reached) / 60000));
		if (+raw <= +floor) {
			break;
		}
		const snapped = snap(raw);
		start = +snapped < +start && +forward(snapped) <= +end ? snapped : raw;
	}
	return floor;
}

// The earliest start, not before `from`, whose forward fill reaches `bound`:
// an FF/SF link or an FNET date bounds the end from below. A fill reaches the
// bound when no working time lies between them (`work`, in minutes), so Thu
// 17:00 reaches Fri 08:00. Walks forward in the calendar's steps by each try's
// shortfall: working minutes in the minute and hour units, whole working days
// in the day unit, so a day-unit start keeps its time of day. Starting at the
// bound itself always reaches it, hence the fallback.
export function getPausedStartReaching(calendar: PauseCalendar, bound: Date, from: Date,
	forward: (start: Date) => Date, work: (from: Date, to: Date) => number): Date {
	let start = from;
	for (let i = 0; i < 64; i++) {
		const reached = forward(start);
		if (+reached >= +bound || work(reached, bound) <= 0) {
			return start;
		}
		const next = calendar.addSteps(start, Math.max(1, calendar.countSteps(reached, bound)));
		if (+next <= +start) {
			break;
		}
		start = next;
	}
	return +from > +bound ? from : bound;
}
