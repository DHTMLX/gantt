import batch_update from "./batch_update";
import task_query from "./task_query";
import auto_task_types from "./auto_task_types";
import formatters from "./formatters";
import empty_state_screen from "./empty_state_screen";
import remote_events from "./remote_events/index";
import auto_scheduling_config from "./auto_scheduling_config";

// MIT edition plugin set. Excluded vs the other editions:
//   - wbs, resources, resource_assignments, baselines (Pro-only)
//   - outline_number (Pro-only, same as wbs - getOutlineNumber/getTaskByOutlineNumber
//     must not appear in this list)
//   - new_task_placeholder (the "+ New task" empty row is built on
//     unscheduled tasks, which this edition does not support)
// task_query provides the public getTaskBy API that plugins/resources.js
// installs in the other editions.
export default function(gantt){
	if(!gantt.ext){
		gantt.ext = {};
	}

	var modules = [
		batch_update,
		task_query,
		auto_task_types,
		formatters,
		empty_state_screen,
		remote_events
	];

	for(var i = 0; i < modules.length; i++){
		if(modules[i])
			modules[i](gantt);
	}

	// Unscheduled-task support is excluded from the MIT edition.
	// `show_unscheduled` is the library's single gate for displaying tasks
	// without dates (see data.js#_isAllowedUnscheduledTask and templates.js);
	// forcing it off makes date-less / unscheduled tasks not render.
	gantt.config.show_unscheduled = false;

	const { getAutoSchedulingConfig} = auto_scheduling_config(gantt);
	gantt._getAutoSchedulingConfig = getAutoSchedulingConfig;
};
