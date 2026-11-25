/**
 * Pure-ish zone resolution for the context-menu extension
 * (design docs/internal/toolbar-context-menu/02-context-menu-api.md §2).
 *
 * Classifies a contextmenu event target into one of the v1 zones —
 * task / link / empty / header — or returns null for the reserved regions
 * (scale, resource panels, scrollbars, resizers) where the native browser menu
 * is left untouched.
 *
 * Kept free of layout math (the timeline `date` is enriched by the plugin) so
 * this is unit-testable against a faked target chain + a stub gantt.
 */

export type ContextZone = "task" | "link" | "empty" | "header";

export interface IZoneInfo {
	zone: ContextZone;
	id: string | number | null;
	area?: "grid" | "timeline";
	column?: string | null;
}

/** walk parentNode chain until an element carrying `className` is found */
function closestClass(node: any, className: string): any {
	let cur = node;
	while (cur && cur !== document) {
		if (cur.classList && cur.classList.contains(className)) {
			return cur;
		}
		cur = cur.parentNode;
	}
	return null;
}

/** true when `node` is `container` or a descendant of it (identity, not class) */
function isWithin(node: any, container: any): boolean {
	if (!container) {
		return false;
	}
	let cur = node;
	while (cur) {
		if (cur === container) {
			return true;
		}
		cur = cur.parentNode;
	}
	return false;
}

function headerColumn(cell: any): string | null {
	if (!cell || !cell.getAttribute) {
		return null;
	}
	return cell.getAttribute("data-column-name") ||
		cell.getAttribute("data-column-id") ||
		cell.getAttribute("column_id") ||
		null;
}

export function resolveZone(gantt: any, e: any): IZoneInfo | null {
	const target = (e && (e.target || e.srcElement)) || e;
	if (!target) {
		return null;
	}

	// link first (a link element can sit over the bars area)
	const linkId = gantt.locate(e, gantt.config.link_attribute);
	if (linkId !== null && linkId !== undefined) {
		return { zone: "link", id: linkId };
	}

	// task (grid row or timeline bar) — resource rows use a different attribute
	// so gantt.locate(task_attribute) returns null for them (they fall through)
	const taskId = gantt.locate(e);
	if (taskId !== null && taskId !== undefined) {
		const inTimeline = isWithin(target, gantt.$task);
		return { zone: "task", id: taskId, area: inTimeline ? "timeline" : "grid" };
	}

	// header: a grid header cell inside the MAIN grid's header container
	const headCell = closestClass(target, "gantt_grid_head_cell");
	if (headCell && isWithin(target, gantt.$grid_scale)) {
		return { zone: "header", id: null, column: headerColumn(headCell) };
	}

	// empty: inside the MAIN grid data area or the MAIN timeline data area
	if (isWithin(target, gantt.$grid_data)) {
		return { zone: "empty", id: null, area: "grid" };
	}
	if (isWithin(target, gantt.$task_data) || isWithin(target, gantt.$task_bg)) {
		return { zone: "empty", id: null, area: "timeline" };
	}

	// reserved (scale, resource panels, scrollbars, resizers) → native menu
	return null;
}
