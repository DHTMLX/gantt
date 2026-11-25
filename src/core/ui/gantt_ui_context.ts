import makeEventable from "../../utils/eventable";
import * as domHelpers from "./utils/dom_helpers";
import { resolveAriaEnabled } from "./accessibility";
import { IUiContext } from "./ui_context";

const FALLBACK_LABELS: Record<string, string> = {
	ui_toolbar_label: "Toolbar",
	ui_datepicker_today: "Today",
	ui_datepicker_clear: "Clear",
	ui_datepicker_prev_month: "Previous month",
	ui_datepicker_next_month: "Next month"
};

let nextContextId = 0;

/** Maps one Gantt instance onto the product-neutral UI-kit context. */
export function createGanttUiContext(gantt: any): IUiContext {
	let uid = 0;
	const contextId = ++nextContextId;
	return {
		eventable: makeEventable,
		ariaEnabled: () => resolveAriaEnabled(gantt && gantt.config),
		label: (key: string) => (gantt && gantt.locale && gantt.locale.labels && gantt.locale.labels[key]) || FALLBACK_LABELS[key] || "",
		uid: (prefix: string) => "dhx_ui_gantt_" + contextId + "_" + prefix + "_" + (++uid),
		icon: (name: string) => "dhx_gantt_icon dhx_gantt_icon_" + name,
		getPopupContainer: () => gantt && gantt._lightbox_root ? gantt._lightbox_root : null,
		getDateFormat: (format?: string) => format || (gantt && gantt.config && gantt.config.date_grid) || "%d-%m-%Y",
		getTimeFormat: (format?: string) => format || (gantt && gantt.config && gantt.config.time_picker) || "%H:%i",
		getTimeStep: (step?: number) => step !== undefined ? step : ((gantt && gantt.config && gantt.config.time_step) || 60),
		dateToString: (format: string) => gantt.date.date_to_str(format),
		stringToDate: (format: string) => gantt.date.str_to_date(format),
		getWeekStart: () => gantt && gantt.config && gantt.config.start_on_monday === false ? 0 : 1,
		getDateLocale: () => gantt.locale.date,
		hasWorkCalendar: () => !!(gantt && gantt.config && gantt.config.work_time && typeof gantt.isWorkTime === "function"),
		isWorkDay: (date: Date) => !gantt || !gantt.config || !gantt.config.work_time || typeof gantt.isWorkTime !== "function" || gantt.isWorkTime(date, "day"),
		getCalendarDayState: (date: Date) => {
			if (gantt && gantt.config && gantt.config.work_time && typeof gantt.isWorkTime === "function" && !gantt.isWorkTime(date, "day")) {
				return { className: "dhx_ui_calendar_day_nonwork" };
			}
			return undefined;
		},
		dom: {
			closest: domHelpers.closest,
			getTargetNode: domHelpers.getTargetNode,
			isChildOf: domHelpers.isChildOf,
			getActiveElement: domHelpers.getActiveElement,
			getFocusableNodes: domHelpers.getFocusableNodes
		}
	};
}

