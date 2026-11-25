import ScaleHelper from "./ui/timeline/scales_ignore";
import PrimaryScaleHelper from "./ui/timeline/scales";
import { getLevelingDelayRange } from "./common/leveling_delay";

function resolveConfigRange(unit, gantt){
	var range = {
		start_date:null,
		end_date:null
	};

	if (gantt.config.start_date && gantt.config.end_date) {
		range.start_date = gantt.date[unit + "_start"](new Date(gantt.config.start_date));

		var end = new Date(gantt.config.end_date);
		var start_interval = gantt.date[unit + "_start"](new Date(end));
		if (+end != +start_interval) {
			end = gantt.date.add(start_interval, 1, unit);
		} else {
			end = start_interval;
		}

		range.end_date = end;
	}
	return range;
}

function _scale_range_unit(gantt) {
	const primaryScale = (new PrimaryScaleHelper(gantt)).primaryScale();
	let unit = primaryScale.unit;
	let step = primaryScale.step;
	if (gantt.config.scale_offset_minimal) {

		const helper = new ScaleHelper(gantt);
		const scales = [helper.primaryScale()].concat(helper.getAdditionalScales());

		helper.sortScales(scales);
		unit = scales[scales.length - 1].unit;
		step = scales[scales.length - 1].step || 1;
	}
	return { unit:unit, step:step };
}

function _init_tasks_range(gantt) {
	var cfg = _scale_range_unit(gantt);
	var unit = cfg.unit,
		step = cfg.step;
	var range = resolveConfigRange(unit, gantt);

	// GS-1544: Show correct date range if we have tasks or only projects
	if(!(range.start_date && range.end_date)){
		var onlyProjectTasks = true;
		var tasks = gantt.getTaskByTime();
		for (var i = 0; i < tasks.length; i++) {
			var task = tasks[i];
			if (task.type !== gantt.config.types.project){
				onlyProjectTasks = false;
				break;
			}
		}
		if (tasks.length && onlyProjectTasks){
			var start_date = tasks[0].start_date;
			var end_date = gantt.date.add(start_date, 1, gantt.config.duration_unit);
			range = {
				start_date: new Date(start_date),
				end_date: new Date(end_date)
			};
		} else{
			range = gantt.getSubtaskDates();
		}

		if(!range.start_date || !range.end_date){
			range = {
				start_date: new Date(),
				end_date: new Date()
			};
		}
		// extend the displayed date range including the constraints, deadlines, baselines and leveling delays
		const hasInactiveTasks = gantt._hasInactiveTasks();
		gantt.eachTask(function(task){
			// GS-3542: inactive tasks are out of getSubtaskDates() by design, but they keep their
			// dates and must stay visible - without this they would drop out of the timeline
			if (hasInactiveTasks && task.start_date && task.end_date && !gantt._isStoredTaskActive(task)){
				extendRangeForDates(range, task.start_date, task.end_date);
			}
			if (gantt.config.deadlines && task.deadline){
				extendRangeForDates(range, task.deadline, task.deadline);
			}
			if (task.constraint_date && task.constraint_type){
				if (gantt._getAutoSchedulingConfig().apply_constraints && gantt.config.constraint_types && task.constraint_type !== gantt.config.constraint_types.ASAP && task.constraint_type !== gantt.config.constraint_types.ALAP){
					extendRangeForDates(range, task.constraint_date, task.constraint_date);
				}
			}
			if (gantt.config.baselines && task.baselines){
				task.baselines.forEach(function(baseline){
					extendRangeForDates(range, baseline.start_date, baseline.end_date);
				});
			}
			if (gantt.config.leveling_delays && task.leveling_delay){
				const delayRange = getLevelingDelayRange(gantt, task);
				if (delayRange){
					extendRangeForDates(range, delayRange.start_date, delayRange.end_date);
				}
			}
		});

		range.start_date = gantt.date[unit + "_start"](range.start_date);
		range.start_date = gantt.calculateEndDate({
			start_date: gantt.date[unit + "_start"](range.start_date),
			duration: -1,
			unit: unit,
			step:step
		});//one free column before first task

		range.end_date = gantt.date[unit + "_start"](range.end_date);
		range.end_date = gantt.calculateEndDate({start_date: range.end_date, duration: 2, unit: unit, step:step});//one free column after last task
	}

	gantt._min_date = range.start_date;
	gantt._max_date = range.end_date;
}

function extendRangeForDates(range, start_date, end_date){
	if (start_date < range.start_date){
		range.start_date = new Date(start_date);
	}
	if (end_date > range.end_date){
		range.end_date = new Date(end_date);
	}
}

function _adjust_scales(gantt) {
	if (gantt.config.fit_tasks) {
		var old_min = +gantt._min_date,
			old_max = +gantt._max_date;
		//this._init_tasks_range();
		if (+gantt._min_date != old_min || +gantt._max_date != old_max) {
			gantt.render();

			gantt.callEvent("onScaleAdjusted", []);
			return true;
		}
	}
	return false;
}

export default function updateTasksRange(gantt){
	_init_tasks_range(gantt);
	_adjust_scales(gantt);
};
