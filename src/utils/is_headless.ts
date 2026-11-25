import env from "./env";
import { GanttStatic } from "../types/gantt_types";
import { GanttInternal } from "../types/gantt_internal_types";

export default function isHeadless(gantt: GanttStatic | GanttInternal): boolean {
	return env.isNode || !gantt.$root;
};
