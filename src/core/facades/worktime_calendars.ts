// TODO: rework public api for date methods
import * as utils from "../../utils/utils";
import type CalendarManager from "../worktime/calendar_manager";
import type TimeCalculator from "../worktime/time_calculator";

var createWorkTimeFacade = function(calendarManager: CalendarManager, timeCalculator: TimeCalculator){
	return {
		getWorkHours: function (date) {
			return timeCalculator.getWorkHours(date);
		},

		setWorkTime: function (config) {
			return timeCalculator.setWorkTime(config);
		},

		unsetWorkTime: function (config) {
			timeCalculator.unsetWorkTime(config);
		},

		isWorkTime: function (date, unit, task) {
			return timeCalculator.isWorkTime(date, unit, task);
		},

		getClosestWorkTime: function (config) {
			return timeCalculator.getClosestWorkTime(config);
		},

		calculateDuration: function (start_date, end_date, task) {
			return timeCalculator.calculateDuration(start_date, end_date, task);
		},
		_hasDuration: function (start_date, end_date, task) {
			return timeCalculator.hasDuration(start_date, end_date, task);
		},

		calculateEndDate: function (start, duration, unit, task) {
			return timeCalculator.calculateEndDate(start, duration, unit, task);
		},

		mergeCalendars: utils.bind(calendarManager.mergeCalendars, calendarManager),
		createCalendar: utils.bind(calendarManager.createCalendar, calendarManager),
		addCalendar: utils.bind(calendarManager.addCalendar, calendarManager),
		getCalendar: utils.bind(calendarManager.getCalendar, calendarManager),
		getCalendars: utils.bind(calendarManager.getCalendars, calendarManager),
		getResourceCalendar: utils.bind(calendarManager.getResourceCalendar, calendarManager),
		getTaskCalendar: utils.bind(calendarManager.getTaskCalendar, calendarManager),
		deleteCalendar: utils.bind(calendarManager.deleteCalendar, calendarManager)
	};
};


export default { create: createWorkTimeFacade };
