import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation } from "../types";
import { getBoundGridViews, type BoundGridView } from "./grid_views_helpers";

export function resourceStore(gantt: GanttWithKeyboardNavigation): any {
	return gantt.getDatastore(gantt.config.resource_store);
}

export function resourceGridViews(gantt: GanttWithKeyboardNavigation): BoundGridView[] {
	return getBoundGridViews(gantt, gantt.config.resource_store);
}

export function resourceGridView(gantt: GanttWithKeyboardNavigation): any {
	const views = resourceGridViews(gantt);
	return views.length ? views[0].view : null;
}

export function visibleResourceRows(gantt: GanttWithKeyboardNavigation): any[] {
	const store = resourceStore(gantt);
	return store ? store.getVisibleItems() : [];
}

export function resourceRowIndex(gantt: GanttWithKeyboardNavigation, id: Id | null | undefined): number {
	const rows = visibleResourceRows(gantt);
	for(let i = 0; i < rows.length; i++){
		if(rows[i].id == id) return i;
	}
	return -1;
}
