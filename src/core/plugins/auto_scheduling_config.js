export default function(gantt){
	function getDefaultAutoSchedulingConfig(){
		return {
			enabled: false,
			apply_constraints: false,
			gap_behavior: "preserve",
			descendant_links: false,
			schedule_on_parse: true,
			move_projects: true,
			use_progress: false,

			schedule_from_end: false,
			project_constraint: false,
			show_constraints: false,

			// GS-1557 / D-36. What to do when the user moves a task and a
			// link and a constraint then ask for different dates:
			//   "keep"   - keep the constraint and move the task (the old way),
			//   "prompt" - ask the user what to do (shows a small dialog),
			//   "adjust" - change the constraint so the task can stay put.
			// Used only when apply_constraints is true.
			resolve_constraint_conflicts: "keep",

			// GS-3581. The chart's scheduling engine: "v2", or a name registered
			// with Gantt.registerSchedulingEngine.
			engine: "v2"
		};
	}

	function getAutoSchedulingConfig() {
		const config = gantt.config;

		// if already using new-style object - return as is
		if (typeof config.auto_scheduling === "object") {

			const schedulingConfig = {...getDefaultAutoSchedulingConfig(), ...config.auto_scheduling};

			// backward compatibility for {mode, strict, move_asap_tasks} properties
			if(schedulingConfig.mode){
				schedulingConfig.apply_constraints = schedulingConfig.mode === "constraints";
				delete schedulingConfig.mode;
			}

			if(schedulingConfig.strict !== undefined){
				schedulingConfig.gap_behavior = schedulingConfig.strict ? "compress" : "preserve";
				delete schedulingConfig.strict;
			}

			if(schedulingConfig.move_asap_tasks !== undefined){
				schedulingConfig.gap_behavior = schedulingConfig.move_asap_tasks ? "compress" : "preserve";
				delete schedulingConfig.move_asap_tasks;
			}
			return schedulingConfig;
		}

		// backward compatibility: build config from old flags
		const enabled = !!config.auto_scheduling;

		const schedulingConfig = getDefaultAutoSchedulingConfig();
		return Object.assign(schedulingConfig, {
			enabled,
			// `auto_scheduling_compatibility: true` means "schedule like pre-6.1
			// gantt, WITHOUT task constraints" (GS-2083 / GS-3328 — the mapping
			// used to be inverted). Constraint scheduling is the legacy default,
			// so an unset flag resolves to apply_constraints: true.
			apply_constraints: !(config.auto_scheduling_compatibility ?? false),
			gap_behavior: config.auto_scheduling_strict !== true ? "preserve" : "compress",
			descendant_links: config.auto_scheduling_descendant_links ?? false,
			schedule_on_parse: config.auto_scheduling_initial ?? true,
			move_projects: config.auto_scheduling_move_projects ?? true,
			use_progress: config.auto_scheduling_use_progress ?? false,

			schedule_from_end: config.schedule_from_end ?? false,
			project_constraint: config.auto_scheduling_project_constraint ?? false,
			show_constraints: false
		});
	}

	return {
		getDefaultAutoSchedulingConfig,
		getAutoSchedulingConfig
	};
};
