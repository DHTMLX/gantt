import createArgumentsHelper from "./calendar_arguments_helper";
import { createPauseCalendar, getPauseWindow, getPausedDuration, getPausedEndDate, hasPauses } from "../common/pauses";
import NoWorkTimeCalendar from "./strategy/no_work_time";
import type { GanttInternal } from "../../types/gantt_internal_types";
import type { CalendarArgumentsHelper } from "./calendar_arguments_helper";
import type CalendarManager from "./calendar_manager";
import type { CalendarStrategy } from "./types";

interface TimeCalculator {
	$gantt: GanttInternal;
	argumentsHelper: CalendarArgumentsHelper;
	calendarManager: CalendarManager;
	$disabledCalendar: CalendarStrategy;
}

class TimeCalculator {
	constructor(calendarManager: CalendarManager){

		this.$gantt = calendarManager.$gantt;
		this.argumentsHelper = createArgumentsHelper(this.$gantt);
		this.calendarManager = calendarManager;
		this.$disabledCalendar = new NoWorkTimeCalendar(this.$gantt, this.argumentsHelper);
	}

	_getCalendar(config: any): CalendarStrategy {
		var calendar;
		if (!this.$gantt.config.work_time) {
			calendar = this.$disabledCalendar;
		} else {
			var manager = this.calendarManager;
			if (config.task) {
				calendar = manager.getTaskCalendar(config.task);
			} else if (config.id) {
				calendar = manager.getTaskCalendar(config);
			} else if (config.calendar) {
				calendar = config.calendar;
			}
			if (!calendar) {
				calendar = manager.getTaskCalendar();
			}
		}
		return calendar;
	}

	// The pause window of `config.task`, when the call measures that task in its
	// own unit and step; any other interval (a lag, a baseline, a one-unit snap)
	// passes `calendar:` instead of `task:` and never gets the pauses.
	_getPauseWindow(config: any): number[] | null {
		const task = config.task;
		if (!task || !hasPauses(this.$gantt, task)) {
			return null;
		}
		const ganttConfig = this.$gantt.config;
		if (config.unit !== ganttConfig.duration_unit || config.step !== ganttConfig.duration_step) {
			return null;
		}
		return getPauseWindow(task.pauses, config.unit);
	}

	getWorkHours(...args: any[]) {
		var config = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, args);

		var calendar = this._getCalendar(config);

		return calendar.getWorkHours(config.date);
	}

	setWorkTime(...args: any[]): boolean {
		var config = this.argumentsHelper.setWorkTimeArguments.apply(this.argumentsHelper, args);
		var calendar: CalendarStrategy = args[1];

		if (!calendar)
			calendar = this.calendarManager.getCalendar(); // Global
		return calendar.setWorkTime(config);
	}

	unsetWorkTime(...args: any[]): void {
		var config = this.argumentsHelper.unsetWorkTimeArguments.apply(this.argumentsHelper, args);
		var calendar: CalendarStrategy = args[1];

		if (!calendar)
			calendar = this.calendarManager.getCalendar(); // Global
		return calendar.unsetWorkTime(config);
	}
	isWorkTime(...args: any[]): boolean {
		var config = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, args);

		var calendar = this._getCalendar(config);
		return calendar.isWorkTime(config);
	}
	getClosestWorkTime(...args: any[]): Date {
		var config = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, args);

		var calendar = this._getCalendar(config);

		return calendar.getClosestWorkTime(config);
	}

	calculateDuration(...args: any[]): number { // start_date_date, end_date, task
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, args);


		var calendar = this._getCalendar(config);
		var pauses = this._getPauseWindow(config);
		if (pauses && +config.end_date > +config.start_date) {
			return getPausedDuration(createPauseCalendar(calendar as any, config.unit), config.start_date, config.end_date, config.unit, pauses);
		}
		return calendar.calculateDuration(config);
	}
	hasDuration(...args: any[]): boolean {
		var config = this.argumentsHelper.hasDurationArguments.apply(this.argumentsHelper, args);

		var calendar = this._getCalendar(config);

		return calendar.hasDuration(config);
	}
	calculateEndDate(...args: any[]): Date { // start_date, duration, unit, task
		var config = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, args);

		var calendar = this._getCalendar(config);
		var pauses = this._getPauseWindow(config);
		// forward from the task start only; backward (end - duration) ignores the
		// pauses: data with pauses comes from leveling with both dates
		if (pauses && config.duration > 0) {
			return getPausedEndDate(createPauseCalendar(calendar as any, config.unit), config.start_date, config.duration, config.unit, pauses);
		}
		return calendar.calculateEndDate(config);
	}
}

export default TimeCalculator;
