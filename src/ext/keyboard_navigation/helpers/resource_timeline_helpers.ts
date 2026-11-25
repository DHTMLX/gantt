import type { GanttWithKeyboardNavigation } from "../types";

export function resourceTimelineView(gantt: GanttWithKeyboardNavigation): any {
	const layout = (gantt as unknown as { $layout?: { getCellsByType(t: string): Array<{ $config?: { id?: string } }> } }).$layout;
	if(!layout || !layout.getCellsByType) return null;
	const cells = layout.getCellsByType("viewCell");
	for(let i = 0; i < cells.length; i++){
		const cell = cells[i];
		const id = cell && cell.$config && cell.$config.id;
		const view: any = id ? gantt.$ui.getView(id) : null;
		if(view && view.$config && view.$config.bind === gantt.config.resource_store && view.$task){
			return view;
		}
	}
	return null;
}

export function resourceTimelineColumnCount(gantt: GanttWithKeyboardNavigation): number {
	const view = resourceTimelineView(gantt);
	if(!view || typeof view.getScale !== "function") return 0;
	const scale = view.getScale();
	return (scale && scale.trace_x) ? scale.trace_x.length : 0;
}

export function resourceTimelineColumnDate(gantt: GanttWithKeyboardNavigation, columnIndex: number): Date | null {
	const view = resourceTimelineView(gantt);
	if(!view || typeof view.getScale !== "function") return null;
	const scale = view.getScale();
	return (scale && scale.trace_x && scale.trace_x[columnIndex]) || null;
}
