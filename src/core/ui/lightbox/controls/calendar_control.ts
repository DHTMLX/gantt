import { Combo } from "../../controls/combo";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "calendar" lightbox section - picks the task's own work calendar
 * (`gantt.config.calendar_property`, "calendar_id" by default).
 *
 * The first option clears the property: a task without its own calendar 
 * inherits the global one (or a resource calendar, when `resource_calendars` is on).
 */

const BUILT_IN: Record<string, boolean> = { global: true, fulltime: true };

export function appCalendars(gantt: any): any[] {
	const calendars = gantt.getCalendars ? gantt.getCalendars() : [];
	return calendars.filter((calendar: any) => calendar && calendar.id && !BUILT_IN[calendar.id]);
}

export default function(gantt: any): any {

	function noneLabel(): string {
		return (gantt.locale.labels as any).calendar_none || "None (inherited)";
	}

	function options(sns: any): any[] {
		if (sns.options) {
			return sns.options;
		}
		return [{ key: "", label: noneLabel() }].concat(appCalendars(gantt)
			.map((calendar: any) => ({ key: String(calendar.id), label: String(calendar.id) })));
	}

	const block = formBlockAdapter(gantt, function(sns: any) {
		return new Combo(getGanttUiKit(gantt), { options: options(sns), openOnClick: true });
	}, {
		toControl: (value: any) => (value === undefined || value === null) ? "" : String(value),
		fromControl: (value: any) => value || ""
	});

	const renderBlock = block.render;
	block.render = function(sns: any): string {
		if (!sns.map_to || sns.map_to === "auto" || sns.map_to === "calendar") {
			sns.map_to = gantt.config.calendar_property;
		}
		return renderBlock.call(this, sns);
	};

	return block;
}