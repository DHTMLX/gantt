import CalendarManager from "./calendar_manager";
import TimeCalculator from "./time_calculator";
import worktimeFacadeFactory from "../facades/worktime_calendars";
import * as utils from "../../utils/utils";
import type { GanttInternal } from "../../types/gantt_internal_types";

export default function (gantt: GanttInternal) {
	var manager = new CalendarManager(gantt),
	timeCalculator = new TimeCalculator(manager);
	var facade = worktimeFacadeFactory.create(manager, timeCalculator);
	utils.mixin(gantt, facade);
};
