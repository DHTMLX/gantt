import type { Calendar, CalendarConfig, DateHelpers, WorkDaysSettings } from "../../types/gantt_types";

/** `gantt.date` also holds a `<unit>_start` function for every time unit. */
export type UnitDateHelpers = DateHelpers & { [unitStart: string]: any };

/** A working interval of a day, in seconds from midnight. */
export interface WorkInterval {
	start: number;
	end: number;
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	durationSeconds: number;
	durationMinutes: number;
	durationHours: number;
}

/** Hours in any notation `setWorkTime` accepts: `["8:00-12:00"]`, `[8, 12]`, `true` or `false`. */
export type WorkHoursSetting = Array<string | number> | boolean;

/**
 * A day rule: `true` works the calendar hours, `false` is a day off.
 * `dates` keys are weekday indexes 0-6, or `Date.UTC` of a local day (`_timestamp`).
 */
export type WorkDayRules = Record<string, WorkHoursSetting>;

/** A custom week as `addCalendar` accepts it, plus the `dates` rules it is stored with. */
export type CustomWeekSettings = NonNullable<NonNullable<CalendarConfig["worktime"]>["customWeeks"]>[string] & {
	dates?: WorkDayRules;
};

/** What `getConfig()` returns. `gantt.config.worktimes` stores this object per calendar. */
export interface WorkTimeSettings {
	hours: WorkHoursSetting;
	dates: WorkDayRules;
	customWeeks?: Record<string, CustomWeekSettings>;
	parsed?: ParsedWorkTime;
}

export interface ParsedWorkDays {
	hours: WorkInterval[];
	dates: Record<string, WorkInterval[] | boolean>;
}

export interface ParsedCustomWeek extends ParsedWorkDays {
	from: Date;
	to: Date;
}

export interface CustomWeekBoundary {
	from: number;
	fromReadable: Date;
	to: number;
	toReadable: Date;
	name: string;
}

export interface ParsedWorkTime extends ParsedWorkDays {
	haveCustomWeeks: boolean;
	customWeeks: Record<string, ParsedCustomWeek>;
	customWeeksRangeStart: number | null;
	customWeeksRangeEnd: number | null;
	customWeeksBoundaries: CustomWeekBoundary[];
}

/** A day in serialized form: working with the calendar hours, a day off, or its own hours. */
export type SerializedWorkDay = boolean | string[];

export interface SerializedWorkDays extends WorkDaysSettings {
	weekdays: [
		SerializedWorkDay, SerializedWorkDay, SerializedWorkDay, SerializedWorkDay,
		SerializedWorkDay, SerializedWorkDay, SerializedWorkDay
	];
	/** Keyed `"YYYY-MM-DD"` by the local calendar day. */
	dates: Record<string, SerializedWorkDay>;
}

export interface SerializedCustomWeek {
	from: Date;
	to: Date;
	hours: string[];
	days: SerializedWorkDays;
}

export interface SerializedWorkTime {
	/** `"H:MM-H:MM"` ranges, with `:SS` only where a boundary has seconds. */
	hours: string[];
	days: SerializedWorkDays;
	customWeeks?: Record<string, SerializedCustomWeek>;
}

/** A calendar in the form `gantt.createCalendar` and `gantt.addCalendar` accept. */
export interface SerializedCalendar extends CalendarConfig {
	worktime: SerializedWorkTime;
}

/**
 * A calendar as gantt uses it internally: the public `Calendar` plus what `CalendarManager` and
 * `TimeCalculator` call. Both strategies implement it, which keeps the MIT edition's
 * `no_work_time` a checked drop-in for `calendar_strategy`.
 */
export interface CalendarStrategy extends Calendar {
	getConfig(): WorkTimeSettings;
	_setConfig(settings: WorkTimeSettings): void;
	_tryChangeCalendarSettings(payload: () => void): boolean;
	_getWorkHours(date?: Date, parsed?: boolean): any;
	getWorkHours(...args: any[]): any;
	hasDuration(...args: any[]): boolean;
	hasWorkTime(): boolean;
	equals(calendar: CalendarStrategy): boolean;
	serialize(): SerializedCalendar;
}
