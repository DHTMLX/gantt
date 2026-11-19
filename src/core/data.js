import * as helpers from "../utils/helpers";
import isHeadless from "../utils/is_headless";

export default function(gantt) {

	gantt.isUnscheduledTask = function (task) {
		gantt.assert(task && task instanceof Object, "Invalid argument <b>task</b>="+task+" of gantt.isUnscheduledTask. Task object was expected");
		return (!!task.unscheduled || !task.start_date);
	};

	gantt._isAllowedUnscheduledTask = function (task) {
		return !!(task.unscheduled && gantt.config.show_unscheduled);
	};

	gantt._isTaskInTimelineLimits = function(task) {
		var taskStart = task.start_date ? task.start_date.valueOf() : null;
		var taskEnd = task.end_date ? task.end_date.valueOf() : null;
		return !!(taskStart && taskEnd && taskStart <= this._max_date.valueOf() && taskEnd >= this._min_date.valueOf());
	};
	gantt.isTaskVisible = function (id) {
		if (!this.isTaskExists(id)) {
			return false;
		}

		var task = this.getTask(id);
		if (!(this._isAllowedUnscheduledTask(task) || this._isTaskInTimelineLimits(task))) {
			return false;
		}

		return !!(this.getGlobalTaskIndex(id) >= 0);
	};

	gantt._getProjectEnd = function() {
		if(gantt.config.project_end){
			return gantt.config.project_end;
		}else{
			var tasks = gantt.getTaskByTime();
			tasks = tasks.sort(function (a, b) {
				return +a.end_date > +b.end_date ? 1 : -1;
			});
			return tasks.length ? tasks[tasks.length - 1].end_date : null;
		}
	};
	gantt._getProjectStart = function() {
		if (gantt.config.project_start) {
			return gantt.config.project_start;
		}

		// use timeline start if project start is not specified
		if (gantt.config.start_date) {
			return gantt.config.start_date;
		}
		if (gantt.getState().min_date) {
			return gantt.getState().min_date;
		}

		// earliest task start if neither project start nor timeline are specified
		var tasks = gantt.getTaskByTime();
		tasks = tasks.sort(function (a, b) {
			return +a.start_date > +b.start_date ? 1 : -1;
		});
		return tasks.length ? tasks[0].start_date : null;
	};

	var getDefaultTaskDate = function (item, parent_id) {
		var parentExists = parent_id && parent_id != gantt.config.root_id && gantt.isTaskExists(parent_id);
		var parent = parentExists ? gantt.getTask(parent_id) : false,
			startDate = null;
		if (parent) {
			if(gantt._getAutoSchedulingConfig().schedule_from_end){
				startDate = gantt.calculateEndDate({
					start_date: parent.end_date,
					duration: - gantt.config.duration_step,
					task:item
				});
			}else{
				if(!parent.start_date){
					return getDefaultTaskDate(parent, gantt.getParent(parent));
				}
				startDate = parent.start_date;
			}

		} else if(gantt._getAutoSchedulingConfig().schedule_from_end) {
			startDate = gantt.calculateEndDate({
				start_date: gantt._getProjectEnd(),
				duration: - gantt.config.duration_step,
				task:item
			});
		} else {
			const first = gantt.getTaskByIndex(0);
			let minDate = gantt.config.start_date;
			if (!minDate){
				// GS-2072. If the date range is not set, Gantt adds the offset dates to the timeline
				// this means when a user creates a new task,
				// it doesn't expect the task to be pushed to an earlier offset date
				const state = gantt.getState();
				if (!isHeadless(gantt) && state.scale_unit && state.scale_step){
					const durationUnit = gantt.config.duration_unit;
					const minuteUnitMismatch = state.scale_unit == "minute" && (durationUnit !== "minute" || state.scale_step !== 1);
					const hourUnitMismatch = state.scale_unit == "hour" && ((durationUnit !== "minute" && durationUnit !== "hour") || state.scale_step !== 1);
					const dayUnitMismatch = state.scale_unit == "day" && state.scale_step !== 1;
					const unitMismatch = minuteUnitMismatch || hourUnitMismatch || dayUnitMismatch;

					const builtInUnits = {
						minute: true,
						hour: true,
						day: true,
						week: true,
						month: true,
						quarter: true,
						year: true
					};

					// use the minimal timeline date when for unit mismatches and custom scales
					// because we cannot predict or guarantee the expected behavior
					if (unitMismatch || !builtInUnits[state.scale_unit]){
						minDate = state.min_date;
					} else {
						minDate = gantt.calculateEndDate({start_date: state.min_date, duration: 1 * state.scale_step, unit: state.scale_unit});
						minDate = gantt.getClosestWorkTime({date: minDate, dir: "future", unit: state.scale_unit});
					}
				} else {
					// in the headless environment and without the timeline, users don't see the dates 
					// and shouldn't consider the minimal date as a previous date
					minDate = state.min_date;
				}
			}

			if (first){
				if (first.start_date){
					startDate = first.start_date;
				}
				else if (first.end_date){
					startDate = gantt.calculateEndDate({
						start_date: first.end_date,
						duration: -gantt.config.duration_step,
						task:item
					});
				}
				else {
					startDate = minDate;
				}
			} else {
				startDate = minDate;
			}
		}
		gantt.assert(startDate, "Invalid dates");
		return new Date(startDate);
	};

	gantt._set_default_task_timing = function (task) {
		task.start_date = task.start_date || getDefaultTaskDate(task, gantt.getParent(task));
		task.duration = task.duration || gantt.config.duration_step;
		task.end_date = task.end_date || gantt.calculateEndDate(task);
	};

	gantt.createTask = function (item, parent, index) {
		item = item || {};

		if (!gantt.defined(item.id))
			item.id = gantt.uid();

		if (!item.start_date) {
			item.start_date = getDefaultTaskDate(item, parent);
		}
		if (item.text === undefined) {
			item.text = gantt.locale.labels.new_task;
		}
		if (item.duration === undefined) {
			item.duration = 1;
		}

		if (this.isTaskExists(parent)) {
			this.setParent(item, parent, true);
			var parentObj = this.getTask(parent);
			parentObj.$open = true;
			// GS-1583. Save the $open state to the Undo Stack
			if (!this.config.details_on_create){
				this.callEvent("onAfterParentExpand", [parent, parentObj]);
			}
		}

		if (!this.callEvent("onTaskCreated", [item])) {
			return null;
		}
		if (this.config.details_on_create) {
			//GS-761: assert unique ID
			if (gantt.isTaskExists(item.id)){
				var task = gantt.getTask(item.id);
				if (task.$index != item.$index) {
					// Someone may try to mistakenly add a task with the same ID, and most likely
					// use the string format for the dates. Gantt shouldn't break in this scenario
					if (item.start_date && typeof item.start_date === "string"){
						item.start_date = this.date.parseDate(item.start_date, "parse_date");
					}
					if (item.end_date && typeof item.end_date === "string"){
						item.end_date = this.date.parseDate(item.end_date, "parse_date");
					}
					this.$data.tasksStore.updateItem(item.id, item);
				}
			}
			else {
				item.$new = true;
				this.silent(function(){
					gantt.$data.tasksStore.addItem(item, index);
				});
			}
			this.selectTask(item.id);
			this.refreshData();
			this.showLightbox(item.id);
		} else {
			if (this.addTask(item, parent, index)) {
				this.showTask(item.id);
				this.selectTask(item.id);
			}
		}
		return item.id;
	};

	gantt._update_flags = function (oldid, newid) {
		//  TODO: need a proper way to update all possible flags
		var store = gantt.$data.tasksStore;
		if (oldid === undefined) {
			this._lightbox_id = null;

			store.silent(function(){
				store.unselect();
			});
			// GS-1522. If we have multiselect, unselect all previously selected tasks
			if (this.getSelectedTasks) {
				this._multiselect.reset();
			}

			if (this._tasks_dnd && this._tasks_dnd.drag) {
				this._tasks_dnd.drag.id = null;
			}
		} else {
			if (this._lightbox_id == oldid)
				this._lightbox_id = newid;

			// TODO: probably can be removed
			if (store.getSelectedId() == oldid) {
				store.silent(function(){
					store.unselect(oldid);
					store.select(newid);
				});
			}
			if (this._tasks_dnd && this._tasks_dnd.drag && this._tasks_dnd.drag.id == oldid) {
				this._tasks_dnd.drag.id = newid;
			}
		}
	};

	var getTaskTimingMode = function (task, force) {
		var task_type = gantt.getTaskType(task.type);

		var state = {
			type: task_type,
			$no_start: false,
			$no_end: false,
			scheduled_summary: false
		};

		if(task_type === gantt.config.types.project && task.auto_scheduling === false){
			state.scheduled_summary = true;
		}

		if (!force && task_type == task.$rendered_type) {
			state.$no_start = task.$no_start;
			state.$no_end = task.$no_end;
			return state;
		}

		if (task_type == gantt.config.types.project) {
			//project duration is always defined by children duration
			state.$no_end = state.$no_start = true;
		} else if (task_type != gantt.config.types.milestone) {
			//tasks can have fixed duration, children duration(as projects), or one date fixed, and other defined by nested items
			state.$no_end = !(task.end_date || task.duration);
			state.$no_start = !task.start_date;

			if (gantt._isAllowedUnscheduledTask(task)) {
				state.$no_end = state.$no_start = false;
			}
		}

		return state;
	};

	gantt._init_task_timing = function (task) {
		var task_mode = getTaskTimingMode(task, true);

		var dirty = task.$rendered_type != task_mode.type;

		var task_type = task_mode.type;

		if (dirty) {
			task.$no_start = task_mode.$no_start;
			task.$no_end = task_mode.$no_end;
			task.$rendered_type = task_mode.type;
		}

		if (dirty && task_type != this.config.types.milestone) {
			if (task_type == this.config.types.project) {
				//project duration is always defined by children duration
				this._set_default_task_timing(task);
				task.$calculate_duration = false;// do not recalculate duration below
			}
		}

		if (task_type == this.config.types.milestone) {
			task.end_date = task.start_date;
		}
		if (task.start_date && task.end_date && task.$calculate_duration !== false) {
			task.duration = this.calculateDuration(task);
		}

		if(!task.$calculate_duration){
			task.$calculate_duration = true;
		}

		if (!task.end_date) {
			task.end_date = task.start_date;
		}

		task.duration = task.duration || 0;
		// GS-1145. We should let tasks to have 0 duration if user wants it
		if (this.config.min_duration === 0 && task.duration === 0){
			task.$no_end = false;
			//GS-2813: special case for project that has 0 duration with milestone child
			if(task.type === gantt.config.types.project && gantt.hasChild(task.id)){
				task.$no_end = true;
			}
		}

		// work calendar of task has changed
		var effectiveCalendar = this.getTaskCalendar(task);
		if(task.$effective_calendar && task.$effective_calendar !== effectiveCalendar.id){
			updateTaskTiming(task);
			if(this.config.inherit_calendar && this.isSummaryTask(task)){
				this.eachTask(function(child){
					updateTaskTiming(child);
				}, task.id);
			}
		}

		task.$effective_calendar = effectiveCalendar.id;
	};

	function updateTaskTiming(task) {
		task.$effective_calendar = gantt.getTaskCalendar(task).id;
		task.start_date = gantt.getClosestWorkTime({
			dir: "future",
			date: task.start_date,
			unit: gantt.config.duration_unit,
			task: task
		});
		task.end_date = gantt.calculateEndDate(task);
	}

	gantt.isSummaryTask = function (task) {
		gantt.assert(task && task instanceof Object, "Invalid argument <b>task</b>="+task+" of gantt.isSummaryTask. Task object was expected");

		var mode = getTaskTimingMode(task);

		return !!(mode.$no_end || mode.$no_start);
	};

// downward calculation of project duration
	gantt.resetProjectDates = function (task) {
		var taskMode = getTaskTimingMode(task);
		if (taskMode.$no_end || taskMode.$no_start) {
			var info = getSubtaskInfo(task.id);
			assignProjectDates.call(this, task, taskMode, info.start_date, info.end_date);
			task.$rollup = info.rollup;
			task.$inlineSplit = info.splitItems;
		}
	};

	function assignProjectDates(task, taskTiming, from, to) {

		const summaryDateFields = {
			start: "start_date",
			end: "end_date"
		};
		const manuallyScheduledSummaryDateFields = {
			start: "$auto_start_date",
			end: "$auto_end_date"
		};

		let dateFields;
		if(task.type === gantt.config.types.project && task.auto_scheduling === false){
			dateFields = manuallyScheduledSummaryDateFields;
		}else{
			dateFields = summaryDateFields;
		}

		if (taskTiming.$no_start) {
			if (from) {
				task[dateFields.start] = new Date(from);
			} else {
				task[dateFields.start] = getDefaultTaskDate(task, this.getParent(task));
			}
		}

		if (taskTiming.$no_end) {
			if (to) {
				task[dateFields.end] = new Date(to);
			} else {
				task[dateFields.end] = this.calculateEndDate({
					start_date: task[dateFields.start],
					duration: this.config.duration_step,
					task: task
				});
			}
		}
		if (taskTiming.$no_start || taskTiming.$no_end) {
			this._init_task_timing(task);
		}
	}

	gantt.getSubtaskDuration = function (taskId) {
		var res = 0,
			root = taskId !== undefined ? taskId : gantt.config.root_id;

		this.eachTask(function (child) {
			if (this.getTaskType(child.type) == gantt.config.types.project || this.isUnscheduledTask(child))
				return;

			res += child.duration;
		}, root);

		return res;
	};

	function getSubtaskInfo (taskId){
		let min = null;
		let max = null;
		let root = taskId !== undefined ? taskId : gantt.config.root_id;
		const rollup = [];
		const inlineSplit = [];

		let rootTask = null;
		if(gantt.isTaskExists(root)){
			rootTask = gantt.getTask(root);
		}

		gantt.eachTask(function (child) {
			const isScheduledSummary = (gantt.getTaskType(child.type) == gantt.config.types.project && (child.auto_scheduling === false));
			if ((gantt.getTaskType(child.type) == gantt.config.types.project && !isScheduledSummary) || gantt.isUnscheduledTask(child))
				return;

			if(child.rollup){
				rollup.push(child.id);
			}

			if ((child.start_date && (!child.$no_start || isScheduledSummary)) && (!min || min > child.start_date.valueOf()))
				min = child.start_date.valueOf();
			if ((child.end_date && (!child.$no_end || isScheduledSummary)) && (!max || max < child.end_date.valueOf()))
				max = child.end_date.valueOf();


			if(rootTask && rootTask.render == "split"){
				if(child.split_placement === "inline"){
					inlineSplit.push(child);
				}else if(child.split_placement !== "subrow" && (!rootTask.$open || !gantt.config.open_split_tasks)){
					inlineSplit.push(child);
				}
			}
		}, root);

		return {
			start_date: min ? new Date(min) : null,
			end_date: max ? new Date(max) : null,
			rollup: rollup,
			splitItems: inlineSplit
		};
	}

	gantt.getSubtaskDates = function (task_id) {
		var info = getSubtaskInfo(task_id);
		return {
			start_date: info.start_date,
			end_date: info.end_date
		};
	};


// upward calculation of project duration
	gantt._update_parents = function (taskId, silent, updateAll) {
		if (!taskId) return;

		var task = this.getTask(taskId);
		if(task.rollup){
			updateAll = true;
		}
		var pid = this.getParent(task);

		var taskTiming = getTaskTimingMode(task);

		var has_changed = true;
		// GS-761 the dates check is necessary for adding empty tasks: gantt.addTask({id:"2"})
		if (updateAll || (task.start_date && task.end_date && (taskTiming.$no_start || taskTiming.$no_end))) {

			const startDateField = task.$auto_start_date ? "$auto_start_date" : "start_date";
			const endDateField = task.$auto_end_date ? "$auto_end_date" : "end_date";

			var oldStart = task[startDateField].valueOf(),
				oldEnd = task[endDateField].valueOf();

			gantt.resetProjectDates(task);

			// not refresh parent projects if dates hasn't changed
			if (!updateAll && oldStart == task[startDateField].valueOf() && oldEnd == task[endDateField].valueOf()) {
				has_changed = false;
			}

			if (has_changed && !silent) {
				this.refreshTask(task.id, true);
			}

			if(taskTiming.scheduled_summary){
				has_changed = true;//recalculate upwards from scheduled summaries
			}
		}


		if (has_changed && pid && this.isTaskExists(pid)) {
			this._update_parents(pid, silent, updateAll);
		}
	};

	gantt.roundDate = function (config) {
		var scale = gantt.getScale();

		if (helpers.isDate(config)) {
			config = {
				date: config,
				unit: scale ? scale.unit : gantt.config.duration_unit,
				step: scale ?  scale.step : gantt.config.duration_step
			};
		}
		var date = config.date,
			steps = config.step,
			unit = config.unit;

		if(!scale){
			return date;
		}

		var upper, lower, colIndex;
		if (unit == scale.unit && steps == scale.step &&
			+date >= +scale.min_date && +date <= +scale.max_date) {
			//find date in time scale config
			colIndex = Math.floor(gantt.columnIndexByDate(date));

			if (!scale.trace_x[colIndex]) {
				colIndex -= 1;// end of time scale
				if(scale.rtl){
					colIndex = 0;
				}
			}
			lower = new Date(scale.trace_x[colIndex]);
			upper = gantt.date.add(lower, steps, unit);
		} else {
			colIndex = Math.floor(gantt.columnIndexByDate(date));

			upper = gantt.date[unit + "_start"](new Date(scale.min_date));
			if (scale.trace_x[colIndex]) {
				upper = gantt.date[unit + "_start"](scale.trace_x[colIndex]);// end of time scale
			}

			while (+upper < +date) {
				upper = gantt.date[unit + "_start"](gantt.date.add(upper, steps, unit));

				var tzOffset = upper.getTimezoneOffset();

				upper = gantt._correct_dst_change(upper, tzOffset, upper, unit);
				if (gantt.date[unit + '_start'])
					upper = gantt.date[unit + '_start'](upper);
			}

			lower = gantt.date.add(upper, -1 * steps, unit);

		}
		if (config.dir && config.dir == 'future')
			return upper;
		if (config.dir && config.dir == 'past')
			return lower;

		if (Math.abs(date - lower) < Math.abs(upper - date)) {
			return lower;
		} else {
			return upper;
		}

	};

	gantt.correctTaskWorkTime = function (task) {
		if (gantt.config.work_time && gantt.config.correct_work_time) {
			if (!this.isWorkTime(task.start_date, undefined, task)) {
				task.start_date = this.getClosestWorkTime({date: task.start_date, dir: 'future', task: task});
				task.end_date = this.calculateEndDate(task);
			} else if (!this.isWorkTime(new Date(+task.end_date - 1), undefined, task)) {
				task.end_date = this.calculateEndDate(task);
			}
		}
	};

	gantt.attachEvent("onBeforeTaskUpdate", function (id, task) {
		gantt._init_task_timing(task);
		return true;
	});
	gantt.attachEvent("onBeforeTaskAdd", function (id, task) {
		gantt._init_task_timing(task);
		return true;
	});

	gantt.attachEvent("onAfterTaskMove", function (id, parent, tindex) {
		gantt._init_task_timing(gantt.getTask(id));
		return true;
	});
	gantt.$data.tasksStore.attachEvent("onAfterSilentMove", function (id) {
		gantt._init_task_timing(gantt.getTask(id));
	});

};