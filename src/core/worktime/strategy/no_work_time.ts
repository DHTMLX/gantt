import type { GanttInternal } from "../../../types/gantt_internal_types";
import type { CalendarArgumentsHelper } from "../calendar_arguments_helper";
import type { CalendarStrategy, SerializedCalendar, SerializedWorkTime, WorkTimeSettings } from "../types";

interface CalendarDisabledTimeStrategy {
	id: string | number;
	argumentsHelper: CalendarArgumentsHelper;
	$gantt: GanttInternal;
	_worktime: WorkTimeSettings | null;
}

class CalendarDisabledTimeStrategy implements CalendarStrategy {
	static _warnedNoWorktime?: boolean;

	constructor(gantt: GanttInternal, argumentsHelper: CalendarArgumentsHelper){
		this.argumentsHelper = argumentsHelper;
		this.$gantt = gantt;
		this._worktime = null;
	}

	getWorkHours(): number[] {
		return [0, 24];
	}
	// Internal accessor used by the timeline scale-projection modes (a Pro
	// feature that relies on working-time calendars). This edition has no
	// working calendar, so report a full working day — projection then degrades
	// to a plain scale instead of throwing. Reaching here means projection /
	// working-time calendars are in use, so warn once (same notice as the Pro
	// render shims, see dummy_layer.js).
	_getWorkHours(): Array<{ start: number; end: number }> {
		if (!CalendarDisabledTimeStrategy._warnedNoWorktime) {
			CalendarDisabledTimeStrategy._warnedNoWorktime = true;
			// eslint-disable-next-line no-console
			console.error("You are trying to use a Pro feature (scale projection / working-time calendars) that is not available in this edition of dhtmlxGantt.");
		}
		return [{ start: 0, end: 24 * 60 * 60 }];
	}
	setWorkTime(): boolean {
		return true;
	}
	unsetWorkTime(): boolean {
		return true;
	}
	// Config accessors so this strategy is a drop-in for CalendarWorkTimeStrategy
	// when the MIT edition aliases calendar_strategy -> no_work_time: the
	// CalendarManager creates/stores calendars through these, but every
	// calculation stays "all time is working time".
	getConfig(): WorkTimeSettings {
		return this._worktime;
	}
	_setConfig(settings: WorkTimeSettings): void {
		this._worktime = settings;
	}
	_tryChangeCalendarSettings(payload: () => void): boolean {
		payload();
		return true;
	}
	/** All time is working time, whatever the stored settings say. */
	serialize(): SerializedCalendar {
		const worktime: SerializedWorkTime = {
			hours: ["0:00-24:00"],
			days: { weekdays: [true, true, true, true, true, true, true], dates: {} }
		};
		return this.id === undefined ? { worktime } : { id: this.id, worktime };
	}
	isWorkTime(): boolean {
		return true;
	}
	getClosestWorkTime(...args: any[]): Date {
		var config = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, args);
		return config.date;
	}

	calculateDuration(...args: any[]): number {
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, args);
		var from = config.start_date,
			to = config.end_date,
			unit = config.unit,
			step = config.step;

		return this._calculateDuration(from, to, unit, step);
	}
	_calculateDuration(start: Date, end: Date, unit: string, step: number): number {
		var dateHelper = this.$gantt.date;
		var fixedUnits = {
			"week": 1000 * 60 * 60 * 24 * 7,
			"day": 1000 * 60 * 60 * 24,
			"hour": 1000 * 60 * 60,
			"minute": 1000 * 60
		};

		var res = 0;
		if (fixedUnits[unit]) {
			res = Math.round((end.valueOf() - start.valueOf()) / (step * fixedUnits[unit]));
		} else {
			var from = new Date(start),
				to = new Date(end);
			while (from.valueOf() < to.valueOf()) {
				res += 1;
				from = dateHelper.add(from, step, unit);
			}

			if (from.valueOf() != end.valueOf()) {
				res += (to.valueOf() - from.valueOf()) / (dateHelper.add(from, step, unit).valueOf() - from.valueOf());
			}
		}

		return Math.round(res);
	}

	hasDuration(...args: any[]): boolean {
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, args);
		var from = config.start_date,
			to = config.end_date,
			unit = config.unit;

		if (!unit) {
			return false;
		}
		from = new Date(from);
		to = new Date(to);

		return (from.valueOf() < to.valueOf());
	}

	hasWorkTime(): boolean {
		return true;
	}

	equals(calendar: CalendarStrategy): boolean {
		if(!(calendar instanceof CalendarDisabledTimeStrategy)){
			return false;
		}
		return true;
	}

	calculateEndDate(...args: any[]): Date {
		var config = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, args);

		var start = config.start_date,
			duration = config.duration,
			unit = config.unit,
			step = config.step;

		return this.$gantt.date.add(start, step * duration, unit);
	}
}

export default CalendarDisabledTimeStrategy;
