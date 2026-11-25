import type { GridColumn } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation } from "../types";

export interface BoundGridView {
	view: any;
	columns: GridColumn[];
	offset: number;
}

type LayoutCell = { $config?: { id?: string; bind?: string }, $content?: any };

function getLayout(gantt: GanttWithKeyboardNavigation): { getCellsByType(t: string): LayoutCell[] } | null {
	const layout = (gantt as unknown as { $layout?: { getCellsByType(t: string): LayoutCell[] } }).$layout;
	return layout && typeof layout.getCellsByType === "function" ? layout : null;
}

// Grid-like views (task grid, resourceGrid) can be split across several layout
// cells bound to the same store (e.g. one "frozen" panel + one independently
// scrollable panel with more columns). This walks the layout in declaration
// order (left to right) and stitches every such view's own columns into one
// combined, globally-indexed list so keyboard navigation can treat them as a
// single continuous table.
export function getBoundGridViews(gantt: GanttWithKeyboardNavigation, bind: string | undefined): BoundGridView[] {
	const layout = getLayout(gantt);
	if(!layout) return [];
	const cells = layout.getCellsByType("viewCell");
	const result: BoundGridView[] = [];
	let offset = 0;
	for(let i = 0; i < cells.length; i++){
		const view = cells[i] && cells[i].$content;
		if(view && view.$grid && typeof view.getGridColumns === "function" && view.$config && view.$config.bind === bind){
			const columns: GridColumn[] = view.getGridColumns() || [];
			result.push({ view, columns, offset });
			offset += columns.length;
		}
	}
	return result;
}

export function getCombinedColumnCount(views: BoundGridView[]): number {
	let total = 0;
	for(let i = 0; i < views.length; i++) total += views[i].columns.length;
	return total;
}

export function resolveGlobalColumn(views: BoundGridView[], globalIndex: number): { view: any, localIndex: number } | null {
	for(let i = 0; i < views.length; i++){
		const v = views[i];
		if(globalIndex >= v.offset && globalIndex < v.offset + v.columns.length){
			return { view: v.view, localIndex: globalIndex - v.offset };
		}
	}
	return null;
}

export function globalIndexOf(views: BoundGridView[], view: any, localIndex: number): number {
	for(let i = 0; i < views.length; i++){
		if(views[i].view === view) return views[i].offset + localIndex;
	}
	return -1;
}

export function viewContaining(views: BoundGridView[], node: HTMLElement): BoundGridView | null {
	for(let i = 0; i < views.length; i++){
		if(views[i].view.$grid && views[i].view.$grid.contains(node)) return views[i];
	}
	return null;
}

export function viewIndexForGlobalColumn(views: BoundGridView[], globalIndex: number): number {
	for(let i = 0; i < views.length; i++){
		const v = views[i];
		if(globalIndex >= v.offset && globalIndex < v.offset + v.columns.length) return i;
	}
	return -1;
}