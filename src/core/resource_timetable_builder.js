import * as helpers from "../utils/helpers";
import { hasPauses, getWorkSegments } from "./common/pauses";

export default function createResourceTimelineBuilder(gantt){

	let resourceTaskCache = {};

	gantt.$data.tasksStore.attachEvent("onStoreUpdated", function(){
		resourceTaskCache = {};
	});

	function getResourceLoad(resource, resourceProperty, scale, timeline){
		const cacheKey = resource.id + "_" + resourceProperty  + "_" + scale.unit + "_" + scale.step;
		let res;
		if (!resourceTaskCache[cacheKey]) {
			res = resourceTaskCache[cacheKey] = calculateResourceLoad(resource, resourceProperty, scale, timeline);

		} else {
			res = resourceTaskCache[cacheKey];
		}
		return res;
	}

	function calculateResourceLoadFromAssignments(items, scale, assignmentsPassed){
		const scaleUnit = scale.unit;
		const scaleStep = scale.step;
		const timegrid = {};

		const precalculatedTimes = {};
		const hasInactiveTasks = gantt._hasInactiveTasks();
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			let task = item;
			if(assignmentsPassed){
				task = gantt.getTask(item.task_id);
			}
			if (task.unscheduled){
				continue; // do not process assignments for unscheduled tasks
			}
			if (hasInactiveTasks && !gantt._isStoredTaskActive(task)){
				continue;
			}
			let minDate = (item.start_date || task.start_date);
			let maxDate = (item.end_date || task.end_date);
			if(assignmentsPassed){
				if(item.start_date){
					minDate = new Date(Math.max(item.start_date.valueOf(), task.start_date.valueOf()));
				}
				if(item.end_date){
					maxDate = new Date(Math.min(item.end_date.valueOf(), task.end_date.valueOf()));
				}
				// GS-2063: handle case with fixedDates mode
				if(item.mode && item.mode == "fixedDates"){
					minDate = item.start_date;
					maxDate = item.end_date;
				}
			}

			let firstColumn = helpers.findBinary(scale.trace_x, minDate.valueOf());
			let minScaleDate = new Date(scale.trace_x[firstColumn] || gantt.date[scaleUnit + "_start"](new Date(minDate)));
			// GS-2307: need to take into account that task could start before the min scale date
			// so the task would be added to timegrid
			let currDate = new Date(Math.min(minDate.valueOf(), minScaleDate.valueOf())); 

			let calendar = gantt.config.work_time ? gantt.getTaskCalendar(task) : gantt;
			precalculatedTimes[calendar.id] = {};

			// task.pauses: a cell counts only if the part of it the item covers
			// overlaps a work segment. Occupancy stays binary per cell, as for any task.
			const segments = hasPauses(gantt, task) ? getWorkSegments(gantt, task) : null;
			let segmentIndex = 0;

			while (currDate < maxDate) {
				const cachedTimes = precalculatedTimes[calendar.id];

				let date = currDate;
				const timestamp = date.valueOf();

				currDate = gantt.date.add(currDate, scaleStep, scaleUnit);

				if(cachedTimes[timestamp] === false){
					continue;
				}

				if (segments) {
					const coveredFrom = Math.max(timestamp, minDate.valueOf());
					const coveredTo = Math.min(currDate.valueOf(), maxDate.valueOf());
					while (segmentIndex < segments.length && segments[segmentIndex].end_date.valueOf() <= coveredFrom) {
						segmentIndex++;
					}
					if (segmentIndex >= segments.length || segments[segmentIndex].start_date.valueOf() >= coveredTo) {
						continue;
					}
				}

				if (!timegrid[timestamp]){
					timegrid[timestamp] = {tasks: [], assignments: []};
				}

				timegrid[timestamp].tasks.push(task);
				if(assignmentsPassed){
					timegrid[timestamp].assignments.push(item);
				}

			}
		}
		return timegrid;
	}

	function calculateResourceLoad(resource, resourceProperty, scale, timeline) {

		let items;
		let assignmentsPassed = false;
		let timegrid = {};

		if(gantt.config.process_resource_assignments && resourceProperty === gantt.config.resource_property){
			if(resource.$role == "task"){
				items = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id);
			}else{
				items = gantt.getResourceAssignments(resource.id);
			}

			assignmentsPassed = true;
		}else if(resource.$role == "task"){
			items = [];
		}else{
			items = gantt.getTaskBy(resourceProperty, resource.id);
		}

		timegrid = calculateResourceLoadFromAssignments(items, scale, assignmentsPassed);
		const scaleUnit = scale.unit;
		const scaleStep = scale.step;

		const timetable = [];
		let start, end, tasks, assignments, cell;
		const config = timeline.$getConfig();

		for(let i = 0; i < scale.trace_x.length; i++){
			start = new Date(scale.trace_x[i]);
			end = gantt.date.add(start, scaleStep, scaleUnit);
			cell = timegrid[start.valueOf()] || {};
			tasks = cell.tasks || [];
			assignments = cell.assignments || [];
			if(tasks.length || config.resource_render_empty_cells){
				timetable.push({
					start_date: start,
					end_date: end,
					tasks: tasks,
					assignments: assignments
				});
			}else{
				timetable.push(null);
			}
		}

		return timetable;
	}



	return getResourceLoad;
};