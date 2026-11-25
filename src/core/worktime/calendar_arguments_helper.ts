import * as utils from "../../utils/utils";
import * as helpers from "../../utils/helpers";
import type { GanttInternal } from "../../types/gantt_internal_types";
import type { Task } from "../../types/gantt_types";
import type { CalendarStrategy } from "./types";


export class IsWorkTimeArgument {
	constructor(
		public date: Date,
		public unit: string,
		public task?: Task,
		public id?: any,
		public calendar?: CalendarStrategy
	) {}
}

export class ClosestWorkTimeArgument {
	constructor(
		public date: Date,
		public dir?: string,
		public unit?: string,
		public task?: Task,
		public id?: any,
		public calendar?: CalendarStrategy
	) {}
}

export class CalculateEndDateArgument {
	constructor(
		public start_date: Date,
		public duration: number,
		public unit: string,
		public step: number,
		public task?: Task,
		public id?: any,
		public calendar?: CalendarStrategy
	) {}
}

export class GetDurationArgument {
	start_date: Date;
	end_date: Date;
	unit: string | null;
	step: number | null;
	task?: Task;
	calendar?: CalendarStrategy;

	constructor(start: Date, end: Date, unit?: string | null, step?: number | null, task?: Task, calendar?: CalendarStrategy) {
		this.start_date = start;
		this.end_date = end;
		this.unit = unit !== undefined ? unit : null;
		this.step = step !== undefined ? step : null;
		this.task = task;
		this.calendar = calendar;
	}
}

export type CalendarArgumentsHelper = ReturnType<typeof calendarArgumentsHelper>;

const calendarArgumentsHelper = function(gantt: GanttInternal){
	return {
		getWorkHoursArguments: function (...args: any[]) {
			let config = args[0];
			if (helpers.isDate(config)) {
				config = {
					date: config
				};
			} else {
				config = utils.mixin({}, config);
			}

			if(!helpers.isValidDate(config.date)){
				gantt.assert(false, "Invalid date argument for getWorkHours method");
				throw new Error("Invalid date argument for getWorkHours method");
			}

			return config;
		},
		setWorkTimeArguments: function (...args: any[]) {
			return args[0];
		},
		unsetWorkTimeArguments: function (...args: any[]) {
			return args[0];
		},
		isWorkTimeArguments: function (...args: any[]): IsWorkTimeArgument {
			const config = args[0];
			if(config instanceof IsWorkTimeArgument){
				return config;
			}

			let processedConfig: IsWorkTimeArgument;
			if (!config.date) {
				//IsWorkTimeArgument(date, unit, task, id, calendar)
				processedConfig = new IsWorkTimeArgument(args[0], args[1], args[2], null, args[3]);
			} else {
				processedConfig = new IsWorkTimeArgument(config.date, config.unit, config.task, null, config.calendar);
			}

			processedConfig.unit = processedConfig.unit || gantt.config.duration_unit;

			if(!helpers.isValidDate(processedConfig.date)){
				gantt.assert(false, "Invalid date argument for isWorkTime method");
				throw new Error("Invalid date argument for isWorkTime method");
			}

			return processedConfig;
		},
		getClosestWorkTimeArguments: function (...args: any[]): ClosestWorkTimeArgument {
			const config = args[0];
			if (config instanceof ClosestWorkTimeArgument)
				return config;

			let processedConfig: ClosestWorkTimeArgument;
			if (helpers.isDate(config)) {
				processedConfig = new ClosestWorkTimeArgument(config);

			} else {
				processedConfig = new ClosestWorkTimeArgument(
					config.date,
					config.dir,
					config.unit,
					config.task,
					null,//config.id,
					config.calendar
				);
			}

			if(config.id){
				processedConfig.task = config;
			}
			processedConfig.dir = config.dir || 'any';
			processedConfig.unit = config.unit || gantt.config.duration_unit;

			if(!helpers.isValidDate(processedConfig.date)){
				gantt.assert(false, "Invalid date argument for getClosestWorkTime method");
				throw new Error("Invalid date argument for getClosestWorkTime method");
			}
			return processedConfig;
		},

		_getStartEndConfig: function (...args: any[]): GetDurationArgument {
			const param = args[0];
			const argumentType = GetDurationArgument;
			let config: GetDurationArgument;
			if (param instanceof argumentType)
				return param;

			if (helpers.isDate(param)) {
				// positional. Two shapes:
				//   (start, end, unit, step)     — unit-aware form (unit is a string)
				//   (start, end, task, calendar) — legacy pre-unit form; still used by
				//                                  the facade calculateDuration/_hasDuration
				//                                  and public callers. A task in the unit
				//                                  slot is truthy, so without this branch it
				//                                  survives the `unit || duration_unit`
				//                                  fallback and the calendar strategy does
				//                                  `gantt.date[<task object>]` → TypeError.
				const third = args[2];
				if (third && typeof third === "object") {
					config = new argumentType(args[0], args[1], null, null, third, args[3]);
				} else {
					config = new argumentType(args[0], args[1], args[2], args[3]);
				}
			} else {
				// object form: thread unit/step through so per-call overrides
				// reach the calendar strategy. Previously the unit/step fields
				// were dropped here and the calendar always used the global
				// `gantt.config.duration_unit`.

				// received a task object as an argument
				// ignore 'unit' and 'step' properties in this case, since it's likely a part of data model of a task
				const isTaskArgument = param.id !== null && param.id !== undefined;

				config = new argumentType(param.start_date, param.end_date, isTaskArgument ? null : param.unit, isTaskArgument ? null : param.step, param.task, isTaskArgument ? undefined : param.calendar);
				if (param.id !== null && param.id !== undefined) {
					config.task = param;
				}
			}

			config.unit = config.unit || gantt.config.duration_unit;
			config.step = config.step || gantt.config.duration_step;
			config.start_date = config.start_date || (config as any).start || (config as any).date;

			if(!helpers.isValidDate(config.start_date)){
				gantt.assert(false, "Invalid start_date argument for getDuration method");
				throw new Error("Invalid start_date argument for getDuration method");
			}

			if(!helpers.isValidDate(config.end_date)){
				gantt.assert(false, "Invalid end_date argument for getDuration method");
				throw new Error("Invalid end_date argument for getDuration method");
			}

			return config;
		},

		getDurationArguments: function (...args: any[]): GetDurationArgument {
			return this._getStartEndConfig.apply(this, args);
		},

		hasDurationArguments: function (...args: any[]): GetDurationArgument {
			return this._getStartEndConfig.apply(this, args);
		},

		calculateEndDateArguments: function (...args: any[]): CalculateEndDateArgument {
			const config = args[0];
			if (config instanceof CalculateEndDateArgument)
				return config;

			let processedConfig: CalculateEndDateArgument;
			//CalculateEndDateArgument(start_date, duration, unit, step, task, id, calendar)
			if (helpers.isDate(config)) {
				processedConfig = new CalculateEndDateArgument(
					args[0],
					args[1],
					args[2],
					undefined,
					args[3],
					undefined,
					args[4]
				);

			} else {
				processedConfig = new CalculateEndDateArgument(
					config.start_date,
					config.duration,
					config.unit,
					config.step,
					config.task,
					null,//config.id,
					config.calendar
				);
			}
			if(config.id !== null && config.id !== undefined){
				processedConfig.task = config;

				// received a task object as an argument
				// ignore 'unit' and 'step' properties in this case, since it's likely a part of data model of a task
				processedConfig.unit = null;
				processedConfig.step = null;
			}

			processedConfig.unit = processedConfig.unit || gantt.config.duration_unit;
			processedConfig.step = processedConfig.step || gantt.config.duration_step;

			if(!helpers.isValidDate(processedConfig.start_date)){
				gantt.assert(false, "Invalid start_date argument for calculateEndDate method");
				throw new Error("Invalid start_date argument for calculateEndDate method");
			}

			return processedConfig;
		}
	};
};


export default calendarArgumentsHelper;
