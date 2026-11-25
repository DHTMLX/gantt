import * as domHelpers from "../utils/dom_helpers";
import * as utils from "../../../utils/utils";
import timeout from "../../../utils/timeout";
import * as helpers from "../../../utils/helpers";

function createTaskDND(timeline, gantt) {
	var services = gantt.$services;
	return {
		drag: null,
		dragMultiple: {},
		_events: {
			before_start: {},
			before_finish: {},
			after_finish: {}
		},
		_handlers: {},
		init: function() {
			this._domEvents = gantt._createDomEventScope();
			this.clear_drag_state();
			var drag = gantt.config.drag_mode;
			this.set_actions();

			var stateService = services.getService("state");
			stateService.registerProvider("tasksDnd", utils.bind(function() {
				return {
					drag_id : this.drag ? this.drag.id : undefined,
					drag_mode : this.drag ? this.drag.mode : undefined,
					drag_from_start : this.drag ? this.drag.left : undefined
				};
			}, this));

			// Internal: copies of the tasks this drag changes, taken before it changed
			// them. A scheduling preview puts them back to see the chart as it was.
			// The first copy is the dragged task's, made anew at each mouse-down,
			// so it also identifies the drag.
			stateService.registerProvider("tasksDndOriginals", utils.bind(function() {
				if (!this.drag || !this.drag.id || !this.drag.mode || !this.drag.obj) return null;
				const originals = [this.drag.obj];
				for (const id in this.dragMultiple) {
					if (id != this.drag.id && this.dragMultiple[id].obj) originals.push(this.dragMultiple[id].obj);
				}
				return originals;
			}, this), true);

			var evs = {
				"before_start": "onBeforeTaskDrag",
				"before_finish": "onBeforeTaskChanged",
				"after_finish": "onAfterTaskDrag"
			};
			//for now, all drag operations will trigger the same events
			for (var stage in this._events) {
				for (var mode in drag) {
					this._events[stage][mode] = evs[stage];
				}
			}

			this._handlers[drag.move] = this._move;
			this._handlers[drag.resize] = this._resize;
			this._handlers[drag.progress] = this._resize_progress;
		},
		set_actions: function() {
			var data = timeline.$task_data;
			this._domEvents.attach(data, "mousemove", gantt.bind(function(e) {
				this.on_mouse_move(e);
			}, this));
			this._domEvents.attach(data, "mousedown", gantt.bind(function(e) {
				this.on_mouse_down(e);
			}, this));
			this._domEvents.attach(document.body, "mouseup", gantt.bind(function(e) {
				this.on_mouse_up(e);
			}, this));
		},

		_getPositioningContext: function(task) {
			if(timeline._getPositioningContext) {
				return timeline._getPositioningContext(task);
			}
			return null;
		},

		clear_drag_state: function() {
			this.drag = {
				id: null,
				mode: null,
				pos: null,
				start_x: null,
				start_y: null,
				obj: null,
				left: null
			};
			this.dragMultiple = {};
		},
		_resize: function(task, shift, drag) {
			var cfg = timeline.$getConfig();
			var coords_x = this._drag_task_coords(task, drag);
			if (drag.left) {
				task.start_date = gantt.dateFromPos(coords_x.start + shift, this._getPositioningContext(task));
				if (!task.start_date) {
					task.start_date = new Date(gantt.getState().min_date);
				}
			} else {
				task.end_date = gantt.dateFromPos(coords_x.end + shift, this._getPositioningContext(task));
				if (!task.end_date) {
					task.end_date = new Date(gantt.getState().max_date);
				}
			}

			var minDurationInUnits = this._calculateMinDuration(cfg.min_duration, cfg.duration_unit);
			if (task.end_date - task.start_date < cfg.min_duration) {
				// a floor on the span, not the task interval: the calendar is passed, so
				// the task's pauses don't round a fractional floor down to nothing
				var calendar = gantt.getTaskCalendar(task);
				if (drag.left)
					task.start_date = gantt.calculateEndDate({ start_date: task.end_date, duration: -minDurationInUnits, unit: cfg.duration_unit, calendar: calendar });
				else
					task.end_date = gantt.calculateEndDate({ start_date: task.start_date, duration: minDurationInUnits, unit: cfg.duration_unit, calendar: calendar });
			}
			gantt._init_task_timing(task);
		},
		_calculateMinDuration: function(duration, unit) {
			var inMs = {
				"minute": 60000,
				"hour": 3600000,
				"day": 86400000,
				"week": 604800000,
				"month": 2419200000,
				"year": 31356000000
			};
			return Math.ceil(duration / inMs[unit]);
		},
		_resize_progress: function(task, shift, drag) {
			var coords_x = this._drag_task_coords(task, drag);

			var config = timeline.$getConfig();
			var diffValue = !config.rtl ? (drag.pos.x - coords_x.start) : (coords_x.start - drag.pos.x);

			var diff = Math.max(0, diffValue);
			task.progress = Math.min(1, diff / Math.abs(coords_x.end - coords_x.start));
		},
		_find_max_shift: function(dragItems, shift) {
			var correctShift;
			for (var i in dragItems) {
				var drag = dragItems[i];
				var task = gantt.getTask(drag.id);
				if (task.unscheduled){
					// GS-1674. There is no need to check the tasks that are ignored by projects
					continue;
				}

				var coords_x = this._drag_task_coords(task, drag);
				var minX = gantt.posFromDate(new Date(gantt.getState().min_date), this._getPositioningContext(task));
				var maxX = gantt.posFromDate(new Date(gantt.getState().max_date), this._getPositioningContext(task));

				if (coords_x.end + shift > maxX) {
					var maxShift = maxX - coords_x.end;
					if (maxShift < correctShift || correctShift === undefined) {
						correctShift = maxShift;
					}
				} else if (coords_x.start + shift < minX) {
					var minShift = minX - coords_x.start;
					if (minShift > correctShift || correctShift === undefined) {
						correctShift = minShift;
					}
				}
			}
			return correctShift;
		},
		_move: function(task, shift, drag, multipleDragShift) {
			var coords_x = this._drag_task_coords(task, drag);
			var new_start = null,
			new_end = null;
			// GS-454: If we drag multiple tasks, rely on the dates instead of timeline coordinates
			if (multipleDragShift){
				new_start = new Date(+drag.obj.start_date + multipleDragShift),
				new_end = new Date(+drag.obj.end_date + multipleDragShift);
			} else {
				new_start = gantt.dateFromPos(coords_x.start + shift, this._getPositioningContext(task)),
				new_end = gantt.dateFromPos(coords_x.end + shift, this._getPositioningContext(task));
			}
			if (!new_start) {
				task.start_date = new Date(gantt.getState().min_date);
				task.end_date = gantt.dateFromPos(gantt.posFromDate(task.start_date) + (coords_x.end - coords_x.start), this._getPositioningContext(task));
			} else if (!new_end) {
				task.end_date = new Date(gantt.getState().max_date);
				task.start_date = gantt.dateFromPos(gantt.posFromDate(task.end_date) - (coords_x.end - coords_x.start), this._getPositioningContext(task));
			} else {
				task.start_date = new_start;
				task.end_date = new_end;
			}
		},
		_drag_task_coords: function(t, drag) {
			var start = drag.obj_s_x = drag.obj_s_x || gantt.posFromDate(t.start_date, this._getPositioningContext(t));
			var end = drag.obj_e_x = drag.obj_e_x || gantt.posFromDate(t.end_date, this._getPositioningContext(t));
			return {
				start: start,
				end: end
			};
		},
		_mouse_position_change: function(oldPos, newPos) {
			var dx = oldPos.x - newPos.x,
				dy = oldPos.y - newPos.y;
			return Math.sqrt(dx * dx + dy * dy);
		},
		_is_number: function(n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},

		on_mouse_move: function(e) {
			if (this.drag.start_drag) {
				var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);

				var sX = this.drag.start_drag.start_x,
					sY = this.drag.start_drag.start_y;

				if ((Date.now() - this.drag.timestamp > 50) ||
					(this._is_number(sX) && this._is_number(sY) && this._mouse_position_change({
						x: sX,
						y: sY
					}, pos) > 20)) {
					this._start_dnd(e);
				}
			}

			var drag = this.drag;

			if (drag.mode) {
				if (!timeout(this, 40))//limit update frequency
					return;

				this._update_on_move(e);

			}
		},

		_update_item_on_move: function(shift, id, mode, drag, e, multipleDragShift) {
			var task = gantt.getTask(id);
			var original = gantt.mixin({}, task);
			var copy = gantt.mixin({}, task);
			this._handlers[mode].apply(this, [copy, shift, drag, multipleDragShift]);
			gantt.mixin(task, copy, true);
			//gantt._update_parents(drag.id, true);
			gantt.callEvent("onTaskDrag", [task.id, mode, copy, original, e]);
			gantt.mixin(task, copy, true);
			gantt.refreshTask(id);
		},

		_update_on_move: function(e) {
			var drag = this.drag;
			var config = timeline.$getConfig();
			if (drag.mode) {
				var pos = domHelpers.getRelativeEventPosition(e, timeline.$task_data);
				if (drag.pos && drag.pos.x == pos.x)
					return;

				drag.pos = pos;

				const task = gantt.getTask(drag.id);

				var curr_date = gantt.dateFromPos(pos.x, this._getPositioningContext(task));
				if (!curr_date || isNaN(curr_date.getTime()))
					return;


				var shift = pos.x - drag.start_x;
				
				if (this._handlers[drag.mode]) {
					if (drag.mode === config.drag_mode.move) {
						var dragHash = {};

						if (this._isMultiselect()) {
							var selectedTasksIds = gantt.getSelectedTasks();
							if (selectedTasksIds.indexOf(drag.id) >= 0) {
								dragHash = this.dragMultiple;
							}
						}

						var dragProject = false;
						if (gantt.isSummaryTask(task) && gantt.config.drag_project) {
							var initialDrag = {};
							initialDrag[drag.id] = utils.copy(drag);
							dragProject = true;
							dragHash = utils.mixin(initialDrag, this.dragMultiple);
						}

						var maxShift = this._find_max_shift(dragHash, shift);
						if (maxShift !== undefined) {
							shift = maxShift;
						}
						this._update_item_on_move(shift, drag.id, drag.mode, drag, e);

						let multipleDragShift;
						if (maxShift === undefined) {
							// GS-2593. If the timeline is repainted during the drag (infinite scale scenario)
							// we need to update the initial drag position to correctly update
							// the position of other dragged tasks
							const newStartPos = gantt.posFromDate(drag.obj.start_date, this._getPositioningContext(drag.obj));
							const newEndPos = gantt.posFromDate(drag.obj.end_date, this._getPositioningContext(drag.obj));
							// calculate the offset only when the drag started
							if (drag.handle_offset === undefined){
								const width = newEndPos - newStartPos;
								const dragPos = drag.start_x - newStartPos;
								drag.handle_offset = dragPos / width;
							}
							const newWidth = Math.abs(newEndPos - newStartPos);
							let dragX = newStartPos + newWidth * drag.handle_offset;

							// GS-454: Calculate the date shift in milliseconds instead of pixels
							const shiftDate = gantt.dateFromPos(dragX, this._getPositioningContext(drag.obj));
							multipleDragShift = curr_date - shiftDate;
						}

						for (var i in dragHash) {
							var childDrag = dragHash[i];
							if(dragProject && childDrag.id != drag.id){
								gantt._bulk_dnd = true;
							}
							this._update_item_on_move(shift, childDrag.id, childDrag.mode, childDrag, e, multipleDragShift);
						}
						gantt._bulk_dnd = false;
					} else {
						// for resize and progress
						this._update_item_on_move(shift, drag.id, drag.mode, drag, e);
					}
					gantt._update_parents(drag.id);
				}

			}
		},

		on_mouse_down: function(e, src) {
			// on Mac we do not get onmouseup event when clicking right mouse button leaving us in dnd state
			// let's ignore right mouse button then
			if (e.button == 2 && e.button !== undefined)
				return;

			var config = timeline.$getConfig();
			var id = gantt.locate(e);
			var task = null;
			if (gantt.isTaskExists(id)) {
				task = gantt.getTask(id);
			}

			if (gantt.isReadonly(task) || this.drag.mode) return;

			this.clear_drag_state();

			src = src || (e.target || e.srcElement);

			var className = domHelpers.getClassName(src);
			var drag = this._get_drag_mode(className, src);

			if (!className || !drag) {
				if (src.parentNode)
					return this.on_mouse_down(e, src.parentNode);
				else
					return;
			}

			if (!drag) {
				if (gantt.checkEvent("onMouseDown") && gantt.callEvent("onMouseDown", [className.split(" ")[0]])) {
					if (src.parentNode)
						return this.on_mouse_down(e, src.parentNode);

				}
			} else {
				if (drag.mode && drag.mode != config.drag_mode.ignore && config["drag_" + drag.mode]) {
					id = gantt.locate(src);
					task = gantt.copy(gantt.getTask(id) || {});

					if (gantt.isReadonly(task)) {
						this.clear_drag_state();
						return false;
					}

					if ((gantt.isSummaryTask(task) && !(task.auto_scheduling === false) && !config.drag_project) && drag.mode != config.drag_mode.progress) {//only progress drag is allowed for tasks with flexible duration
						this.clear_drag_state();
						return;
					}

					drag.id = id;
					var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);

					drag.start_x = pos.x;
					drag.start_y = pos.y;
					drag.obj = task;
					this.drag.start_drag = drag;
					this.drag.timestamp = Date.now();

				} else
					this.clear_drag_state();
			}
		},
		_fix_dnd_scale_time: function(task, drag) {
			var config = timeline.$getConfig();
			var unit = gantt.getScale().unit,
				step = gantt.getScale().step;
			if (!config.round_dnd_dates) {
				unit = 'minute';
				step = config.time_step;
			}

			// Snaps by one unit are not the task interval: the calendar is passed,
			// not the task, so the task's pauses are not applied to them.
			function fixStart(task) {
				if (!gantt.config.correct_work_time)
					return;
				var config = timeline.$getConfig();
				if (!gantt.isWorkTime(task.start_date, undefined, task))
					task.start_date = gantt.calculateEndDate({
						start_date: task.start_date,
						duration: -1,
						unit: config.duration_unit,
						calendar: gantt.getTaskCalendar(task)
					});
			}

			function fixEnd(task) {
				if (!gantt.config.correct_work_time)
					return;
				var config = timeline.$getConfig();
				if (!gantt.isWorkTime(new Date(task.end_date - 1), undefined, task))
					task.end_date = gantt.calculateEndDate({
						start_date: task.end_date,
						duration: 1,
						unit: config.duration_unit,
						calendar: gantt.getTaskCalendar(task)
					});
			}

			const dndContext = timeline._getPositioningContext(task);

			if (drag.mode == config.drag_mode.resize) {
				if (drag.left) {
					task.start_date = gantt.roundDate({date: task.start_date, unit: unit, step: step});
	
					if(dndContext && dndContext.calendar){
						task.start_date = dndContext.calendar.getClosestWorkTime({date: task.start_date, dir:"future"});
					}
					fixStart(task);
				} else {
					task.end_date = gantt.roundDate({date: task.end_date, unit: unit, step: step});
					if(dndContext && dndContext.calendar){
						task.end_date = dndContext.calendar.getClosestWorkTime({date: task.end_date});
					}
					fixEnd(task);
				}
			} else if (drag.mode == config.drag_mode.move) {
				task.start_date = gantt.roundDate({date: task.start_date, unit: unit, step: step});
				
				if(dndContext && dndContext.calendar){
					task.start_date = dndContext.calendar.getClosestWorkTime({date: task.start_date, dir:"future"});
				}

				fixStart(task);
				task.end_date = gantt.calculateEndDate(task);
			}
		},
		_fix_working_times: function(task, drag) {
			var config = timeline.$getConfig();
			var drag = drag || {mode: config.drag_mode.move};

			if (drag.mode == config.drag_mode.resize) {
				if (drag.left) {
					task.start_date = gantt.getClosestWorkTime({date: task.start_date, dir: 'future', task: task});
				} else {
					task.end_date = gantt.getClosestWorkTime({date: task.end_date, dir: 'past', task: task});
				}
			} else if (drag.mode == config.drag_mode.move) {
				gantt.correctTaskWorkTime(task);
			}
		},

		_normalize_task_dates: function(task, config, drag) {
			if (config.work_time && config.correct_work_time) {
				this._fix_working_times(task, drag);
			}

			this._fix_dnd_scale_time(task, drag);
		},

		_finalize_mouse_up: function(taskId, config, drag, e) {
			var task = gantt.getTask(taskId);
			this._normalize_task_dates(task, config, drag);

			if (!this._fireEvent("before_finish", drag.mode, [taskId, drag.mode, gantt.copy(drag.obj), e])) {
				//drag.obj._dhx_changed = false;
				this.clear_drag_state();
				if (taskId == drag.id) {
					drag.obj._dhx_changed = false;
					gantt.mixin(task, drag.obj, true);
				}

				gantt.callEvent("onTaskDragCancel", [taskId, drag.mode, e]);

				gantt.refreshTask(task.id);
				// GS-2013. Repaint parent projects when the drag is cancelled
				if (task.$level > 100){
					// When there are too many tasks to repaint, it is better to repaint Gantt
					let shouldRepaint = false;
					gantt.eachParent(function(parent){
						if (!shouldRepaint && parent.type === gantt.config.types.project) {
							const initialDates = {start_date: parent.start_date, end_date: parent.end_date};
							gantt.resetProjectDates(parent);
							if (+initialDates.start_date !== +parent.start_date || +initialDates.end_date !== +parent.end_date){
								shouldRepaint = true;
							}
						}
					},task.id);
					if (shouldRepaint){
						gantt.refreshData();
					}
				} else {
					// If there are not so many parents especially if there are split tasks,
					// it is better to repaint individual tasks
					gantt.eachParent(function(parent){
						if (parent.type === gantt.config.types.project) {
							const initialDates = {start_date: parent.start_date, end_date: parent.end_date};
							gantt.resetProjectDates(parent);
							if (+initialDates.start_date !== +parent.start_date || +initialDates.end_date !== +parent.end_date){
								gantt.refreshTask(parent.id);
							}
						}
					},task.id);
				}
			} else {
				var drag_id = taskId;

				gantt._init_task_timing(task);

				this.clear_drag_state();
				gantt.updateTask(task.id);
				this._fireEvent("after_finish", drag.mode, [drag_id, drag.mode, e]);
			}

		},

		on_mouse_up: function(e) {

			var drag = this.drag;
			if (drag.mode && drag.id) {
				var config = timeline.$getConfig();
				//drop
				var task = gantt.getTask(drag.id);
				var dragMultiple = this.dragMultiple;

				var finalizingBulkMove = false;
				var moveCount = 0;
				if (drag.mode === config.drag_mode.move) {
					if ((gantt.isSummaryTask(task) && config.drag_project) || (this._isMultiselect())) {
						finalizingBulkMove = true;
						moveCount = Object.keys(dragMultiple).length;
					}
				}

				var doFinalize = function doFinalize(){
					if(finalizingBulkMove){
						for (var i in dragMultiple) {
							// GS-1057: Don't call drag events for the dragged task as they will be called later
							if (dragMultiple[i].id != drag.id){
								this._finalize_mouse_up(dragMultiple[i].id, config, dragMultiple[i], e);
							}
						}
					}
					this._finalize_mouse_up(drag.id, config, drag, e);

				};

				if(finalizingBulkMove && moveCount > 10){// 10 - arbitrary threshold for bulk dnd at which we start doing complete repaint to refresh
					gantt.batchUpdate(function(){
						doFinalize.call(this);
					}.bind(this));
				}else{
					doFinalize.call(this);
				}

			}
			this.clear_drag_state();
		},
		_get_drag_mode: function(className, el) {
			var config = timeline.$getConfig();
			var modes = config.drag_mode;
			var classes = (className || "").split(" ");
			var classname = classes[0];
			var drag = {mode: null, left: null};
			switch (classname) {
				case "gantt_task_line":
				case "gantt_task_content":
					drag.mode = modes.move;
					break;
				case "gantt_task_drag":
					drag.mode = modes.resize;

					var dragProperty = el.getAttribute("data-bind-property");

					if (dragProperty == "start_date") {
						drag.left = true;
					} else {
						drag.left = false;
					}
					break;
				case "gantt_task_progress_drag":
					drag.mode = modes.progress;
					break;
				case "gantt_link_control":
				case "gantt_link_point":
					drag.mode = modes.ignore;
					break;
				default:
					drag = null;
					break;
			}
			return drag;

		},

		_start_dnd: function(e) {
			var drag = this.drag = this.drag.start_drag;
			delete drag.start_drag;

			var cfg = timeline.$getConfig();
			var id = drag.id;

			if (!cfg["drag_" + drag.mode] || !gantt.callEvent("onBeforeDrag", [id, drag.mode, e]) || !this._fireEvent("before_start", drag.mode, [id, drag.mode, e])) {
				this.clear_drag_state();
			} else {
				delete drag.start_drag;
				var task = gantt.getTask(id);
				if (gantt.isReadonly(task)){
					this.clear_drag_state();
					return;
				}
				if (this._isMultiselect()) {
					// for don't move selected tasks when drag unselected task
					var selectedTasksIds = gantt.getSelectedTasks();
					if (selectedTasksIds.indexOf(drag.id) >= 0) {
						helpers.forEach(selectedTasksIds, gantt.bind(function(taskId) {
							var selectedTask = gantt.getTask(taskId);
							if (gantt.isSummaryTask(selectedTask) && gantt.config.drag_project && drag.mode == cfg.drag_mode.move) {
								this._addSubtasksToDragMultiple(selectedTask.id);
							}
							this.dragMultiple[taskId] = gantt.mixin({
								id: selectedTask.id,
								obj: gantt.copy(selectedTask)
							}, this.drag);
						}, this));
					}
				}
				// for move unselected summary
				if (gantt.isSummaryTask(task) && gantt.config.drag_project && drag.mode == cfg.drag_mode.move) {
					this._addSubtasksToDragMultiple(task.id);
				}
				gantt.callEvent("onTaskDragStart", []);
			}

		},
		_fireEvent: function(stage, mode, params) {
			gantt.assert(this._events[stage], "Invalid stage:{" + stage + "}");

			var trigger = this._events[stage][mode];

			gantt.assert(trigger, "Unknown after drop mode:{" + mode + "}");
			gantt.assert(params, "Invalid event arguments");


			if (!gantt.checkEvent(trigger))
				return true;

			return gantt.callEvent(trigger, params);
		},

		round_task_dates: function(task) {
			const config = timeline.$getConfig();
			const activeDrag = this.drag;
			let drag = activeDrag && activeDrag.id != null && activeDrag.id == task.id
				? activeDrag : null;
			if (!drag && activeDrag && activeDrag.mode === config.drag_mode.move) {
				drag = this.dragMultiple[task.id];
			}
			if (!drag || (drag.mode !== config.drag_mode.move && drag.mode !== config.drag_mode.resize)) {
				drag = {mode: config.drag_mode.move};
			}
			this._normalize_task_dates(task, config, drag);
		},
		destructor: function() {
			this._domEvents.detachAll();
		},
		_isMultiselect: function() {
			return gantt.config.drag_multiple && !!(gantt.getSelectedTasks && gantt.getSelectedTasks().length > 0);
		},
		_addSubtasksToDragMultiple: function(summaryId) {
			gantt.eachTask(function(child) {
				this.dragMultiple[child.id] = gantt.mixin({
					id: child.id,
					obj: gantt.copy(child)
				}, this.drag);
			}, summaryId, this);
		}
	};
}

function initTaskDND() {
	var _tasks_dnd;
	return {
		extend: function(timeline) {
			timeline.roundTaskDates = function(task) {
				_tasks_dnd.round_task_dates(task);
			};

		},
		init: function(timeline, gantt) {
			_tasks_dnd = createTaskDND(timeline, gantt);
			// TODO: entry point for touch handlers, move touch to timeline
			timeline._tasks_dnd = _tasks_dnd;
			return _tasks_dnd.init(gantt);
		},
		destructor: function() {
			if (_tasks_dnd) {
				_tasks_dnd.destructor();
				_tasks_dnd = null;
			}
		}
	};
}

export default {
	createTaskDND: initTaskDND
};