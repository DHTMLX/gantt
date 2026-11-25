// The dates that a task's resource leveling delay (`task.leveling_delay`) covers
// in the timeline. Used by the leveling delay layer (`config.leveling_delays`)
// and by the auto-fit date range. See docs/internal/leveling/leveling-delay.md.

import type { TimeUnit } from "./scale_types";

export interface LevelingDelayRange {
	start_date: Date;
	end_date: Date;
	/** true when the area lies after the bar (`schedule_from_end`) */
	fromEnd: boolean;
}

const UNIT_SHORT: Partial<Record<string, string>> = {
	minute: "min", hour: "h", day: "d", week: "w", month: "mo", quarter: "q", year: "y"
};

export function getLevelingDelay(task: any): number {
	return Number(task.leveling_delay) || 0;
}

/**
 * Adds `amount` units of calendar time to `date`, keeping the fraction.
 * gantt.date.add drops fractions (days go through Date.setDate), so the whole
 * part goes through it and the fraction is taken of the next whole unit's real
 * length - a 23h DST day, a 31-day month. Never calculateEndDate: the delay is
 * elapsed time and ignores working calendars.
 */
export function addElapsed(gantt: any, date: Date, amount: number, unit: TimeUnit): Date {
	const sign = amount < 0 ? -1 : 1;
	const whole = Math.floor(Math.abs(amount));
	const fraction = Math.abs(amount) - whole;
	let result = whole ? gantt.date.add(new Date(date), sign * whole, unit) : new Date(date);
	if (fraction) {
		const next = gantt.date.add(new Date(result), sign, unit);
		result = new Date(result.getTime() + (next.getTime() - result.getTime()) * fraction);
	}
	return result;
}

/**
 * The dates the delay covers, or null when the task has no delay area: before
 * the bar in forward planning, after it with `schedule_from_end`. The direction
 * is the project's; an ASAP or ALAP constraint does not change it.
 */
export function getLevelingDelayRange(gantt: any, task: any): LevelingDelayRange | null {
	const delay = getLevelingDelay(task);
	if (!delay || !task.start_date || !task.end_date) {
		return null;
	}
	if (task.hide_bar || task.unscheduled || gantt.isSummaryTask(task)) {
		return null;
	}
	const unit = gantt.config.duration_unit;
	if (gantt._getAutoSchedulingConfig().schedule_from_end) {
		return {
			start_date: task.end_date,
			end_date: addElapsed(gantt, task.end_date, delay, unit),
			fromEnd: true
		};
	}
	return {
		start_date: addElapsed(gantt, task.start_date, -delay, unit),
		end_date: task.start_date,
		fromEnd: false
	};
}

/** The default text of `templates.leveling_delay_text`: "+2d", "+1.5w". */
export function formatLevelingDelay(delay: number, unit: string): string {
	if (!delay) {
		return "";
	}
	return "+" + delay + (UNIT_SHORT[unit] || " " + unit);
}
