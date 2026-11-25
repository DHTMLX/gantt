import { durationRowHtml, initDurationRow } from "./duration_row";

/**
 * "duration" lightbox section — kit-backed since migration Step 6 §S6.4,
 * replacing the legacy multi-`<select>` + text-stepper control. Three parts,
 * all preserved for parity:
 *   1. start date  = DatePicker + TimeInput composite (was the multi-`<select>`);
 *   2. duration    = NumberStepper (−/text/+, `duration_step`, arrows);
 *   3. end date    = read-only `gantt_duration_end_date` label, recomputed from
 *      start + duration via `calculateEndDate` and the task_end_date/task_date
 *      template.
 *
 * Preserves `gantt_duration` / `gantt_duration_value` / `gantt_duration_end_date`
 * classes, `duration_step`, `duration_unit`, the end-date recompute-on-change,
 * and the map_to object/string contract. Also drives `duration_optional`
 * (lightbox_optional_time) through the same render/set_value/get_value/focus.
 */
export default function(gantt: any): any {

	function startHost(node: any): any {
		return node.querySelector("[data-time-start]");
	}

	return {
		render: function(sns: any): string {
			let sectionClassName = "gantt_section_time gantt_section_duration";
			if (sns.name !== "time") {
				sectionClassName += " gantt_section_" + sns.name;
			}
			return "<div style='padding-top:0px;font-size:inherit;' class='" + sectionClassName + "'>" +
				durationRowHtml(gantt, sns) +
				"</div>";
		},

		set_value: function(node: any, value: any, task: any, config: any): void {
			let mapping = gantt._resolve_default_mapping(config);
			if (typeof mapping === "string") {
				mapping = { start_date: mapping };
			}

			const start_date = task[mapping.start_date] || new Date();
			const end_date = task[mapping.end_date] || gantt.calculateEndDate({
				start_date: start_date,
				duration: 1,
				task: task
			});
			const duration_val = Math.round(task[mapping.duration]) || gantt.calculateDuration({
				start_date: start_date,
				end_date: end_date,
				task: task
			});

			node.$uiRow = initDurationRow(gantt, node, {
				start_date: start_date,
				duration: duration_val
			}, task, config);
		},

		get_value: function(node: any, task: any, config: any): any {
			const row = node.$uiRow;
			let startDate = row ? row.getStartDate() : new Date();
			const duration = row ? row.getDuration() : 1;
			const endDate = gantt.calculateEndDate({ start_date: startDate, duration: duration, task: task });

			if (typeof gantt._resolve_default_mapping(config) === "string") {
				return startDate;
			}

			// GS-3144: consider scale-projection
			// GS-3561: getScale() reports the scale only while the timeline is visible, and it is null
			// otherwise. A hidden timeline keeps the projection and the projection calendar of its last
			// visible render - it recomputes neither - so they can describe a configuration that is no
			// longer set. Snapping the date the user typed with an obsolete projection is worse than not
			// snapping it, so the projection is applied only while the scale behind it is up to date.
			const scale = gantt.getScale();
			if (scale && scale.projection && gantt.getCalendar("timescale-projection-calendar")) {
				const projectionCalendar = gantt.getCalendar("timescale-projection-calendar");
				startDate = projectionCalendar.getClosestWorkTime({
					date: startDate,
					unit: gantt.config.duration_unit,
					dir: "future"
				});
			}

			return {
				start_date: startDate,
				end_date: endDate,
				duration: duration
			};
		},

		focus: function(node: any): void {
			const host = startHost(node);
			if (host && host.$uiControl) {
				host.$uiControl.focus();
			}
		}
	};
}
