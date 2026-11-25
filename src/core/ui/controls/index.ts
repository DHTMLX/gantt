import { getGanttUiKit } from "../gantt_ui_kit";

/**
 * Gantt bootstrap for the product-neutral UI kit.
 *
 * Construction is DOM-free. The kit owns popup/control lifecycle and receives
 * all product services through createGanttUiContext; controls do not discover
 * a host or read a private Gantt service bag.
 */
export default function initUiCore(gantt: any): void {
	if (!gantt.ext) gantt.ext = {};
	gantt.ext.ui = getGanttUiKit(gantt);
}
