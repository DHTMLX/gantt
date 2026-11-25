import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";
import { resourceStore, visibleResourceRows, resourceRowIndex } from "../helpers/resource_grid_helpers";
import { resourceTimelineView, resourceTimelineColumnCount, resourceTimelineColumnDate } from "../helpers/resource_timeline_helpers";

function firstDataRow(gantt: GanttWithKeyboardNavigation): any {
	const rows = visibleResourceRows(gantt);
	return rows[0] || null;
}

function ensureCellVisible(gantt: GanttWithKeyboardNavigation, resourceId: Id, columnIndex: number): void {
	const view = resourceTimelineView(gantt);
	if(!view || !view.$task_data) return;

	if(typeof view.getItemTop === "function"){
		const top = view.getItemTop(resourceId);
		const height = typeof view.getItemHeight === "function" ? view.getItemHeight(resourceId) : 0;
		const scrollTop = view.$task_data.scrollTop;
		const viewHeight = view.$task_data.offsetHeight;
		if(top < scrollTop || top + height > scrollTop + viewHeight){
			const targetY = Math.max(0, top - 20);
			const scrollYName = view.$config && view.$config.scrollY;
			const scrollbar = scrollYName ? gantt.$ui.getView(scrollYName) as any : null;
			if(scrollbar && typeof scrollbar.scrollVertically === "function"){
				scrollbar.scrollVertically(targetY);
			}else{
				view.$task_data.scrollTop = targetY;
			}
		}
	}

	if(typeof view.posFromDate === "function"){
		const date = resourceTimelineColumnDate(gantt, columnIndex);
		if(date){
			const left = view.posFromDate(date);
			const scrollLeft = view.$task_data.scrollLeft;
			const viewWidth = view.$task_data.offsetWidth;
			if(left < scrollLeft || left > scrollLeft + viewWidth - 40){
				const targetX = Math.max(0, left - 40);
				const scrollXName = view.$config && view.$config.scrollX;
				const scrollbar = scrollXName ? gantt.$ui.getView(scrollXName) as any : null;
				if(scrollbar && typeof scrollbar.scrollHorizontally === "function"){
					scrollbar.scrollHorizontally(targetX);
				}else{
					view.$task_data.scrollLeft = targetX;
				}
			}
		}
	}
}

function getCellNode(gantt: GanttWithKeyboardNavigation, resourceId: Id | null | undefined, columnIndex: number): HTMLElement | null {
	const view = resourceTimelineView(gantt);
	if(!view || !view.$task_data || resourceId == null) return null;
	const attr = (view.$config && view.$config.item_attribute) || ("data-" + gantt.config.resource_store + "-id");
	const id = String(resourceId).replace(/"/g, '\\"');
	return view.$task_data.querySelector(`[${attr}="${id}"][data-column-index="${columnIndex}"]`) as HTMLElement | null;
}

function seek(gantt: GanttWithKeyboardNavigation, self: KeyboardNavigationNode, rowDelta: number, colDelta: number): void {
	const rows = visibleResourceRows(gantt);
	let rowIndex = resourceRowIndex(gantt, self.resourceId);
	let columnIndex = self.columnIndex || 0;
	const columnCount = resourceTimelineColumnCount(gantt);
	const maxSteps = rowDelta ? rows.length : columnCount;

	for(let step = 0; step < maxSteps; step++){
		if(rowDelta){
			rowIndex += rowDelta;
			if(rowIndex < 0 || rowIndex > rows.length - 1) break;
		}
		if(colDelta){
			columnIndex += colDelta;
			if(columnIndex < 0 || columnIndex >= columnCount) break;
		}

		const resourceId = rows[rowIndex].id;
		ensureCellVisible(gantt, resourceId, columnIndex);
		if(getCellNode(gantt, resourceId, columnIndex)){
			self.moveTo(new gantt.$keyboardNavigation.ResourceCell(resourceId, columnIndex));
			return;
		}
	}

	if(self.resourceId != null){
		ensureCellVisible(gantt, self.resourceId, self.columnIndex || 0);
	}
	self.focus(true);
}

function seekColumn(gantt: GanttWithKeyboardNavigation, self: KeyboardNavigationNode, fromColumnIndex: number, colDelta: number, silentFail?: boolean): boolean {
	const rows = visibleResourceRows(gantt);
	const rowIndex = resourceRowIndex(gantt, self.resourceId);
	const columnCount = resourceTimelineColumnCount(gantt);
	if(rowIndex < 0){
		if(!silentFail) self.focus(true);
		return false;
	}

	let columnIndex = fromColumnIndex;
	for(let step = 0; step < columnCount; step++){
		if(columnIndex < 0 || columnIndex >= columnCount) break;

		const resourceId = rows[rowIndex].id;
		ensureCellVisible(gantt, resourceId, columnIndex);
		if(getCellNode(gantt, resourceId, columnIndex)){
			self.moveTo(new gantt.$keyboardNavigation.ResourceCell(resourceId, columnIndex));
			return true;
		}
		columnIndex += colDelta;
	}

	if(!silentFail){
		if(self.resourceId != null){
			ensureCellVisible(gantt, self.resourceId, self.columnIndex || 0);
		}
		self.focus(true);
	}
	return false;
}

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.ResourceCell = function (this: KeyboardNavigationNode, resourceId?: Id | null, columnIndex?: number) {
		if(resourceId === undefined || resourceId === null){
			const row = firstDataRow(gantt);
			if(row) resourceId = row.id;
		}
		this.resourceId = resourceId;
		this.columnIndex = columnIndex || 0;
	} as unknown as typeof gantt.$keyboardNavigation.ResourceCell;

	gantt.$keyboardNavigation.ResourceCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,

			isValid: function (this: KeyboardNavigationNode): boolean {
				const store = resourceStore(gantt);
				const count = resourceTimelineColumnCount(gantt);
				const columnIndex = this.columnIndex || 0;
				return !!store && this.resourceId != null && store.exists(this.resourceId)
					&& resourceRowIndex(gantt, this.resourceId) > -1
					&& columnIndex >= 0 && columnIndex < count;
			},

			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null {
				const rows = visibleResourceRows(gantt);
				if(!rows.length) return null;
				let rowIndex = resourceRowIndex(gantt, this.resourceId);
				if(rowIndex < 0) rowIndex = 0;
				if(rowIndex > rows.length - 1) rowIndex = rows.length - 1;

				const count = resourceTimelineColumnCount(gantt);
				let columnIndex = this.columnIndex || 0;
				if(columnIndex < 0) columnIndex = 0;
				if(count && columnIndex > count - 1) columnIndex = count - 1;

				return new gantt.$keyboardNavigation.ResourceCell(rows[rowIndex].id, columnIndex);
			},

			fromDomElement: function (e: Event): KeyboardNavigationNode | null {
				const view = resourceTimelineView(gantt);
				if(!view || !view.$task_data) return null;
				const attr = (view.$config && view.$config.item_attribute) || ("data-" + gantt.config.resource_store + "-id");
				const target = (e.target || e) as Element;
				const cell = target.closest ? target.closest(`[${attr}]`) as HTMLElement | null : null;
				if(cell && view.$task_data.contains(cell)){
					const id = cell.getAttribute(attr);
					if(id != null && resourceStore(gantt).exists(id)){
						const colAttr = cell.getAttribute("data-column-index");
						return new gantt.$keyboardNavigation.ResourceCell(id, colAttr != null ? Number(colAttr) : 0);
					}
				}
				return null;
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				return getCellNode(gantt, this.resourceId, this.columnIndex || 0);
			},

			focus: function (this: KeyboardNavigationNode, keptFocus?: boolean): void {
				const base = gantt.$keyboardNavigation.KeyNavNode.prototype.focus;

				if(!keptFocus && this.resourceId != null){
					ensureCellVisible(gantt, this.resourceId, this.columnIndex || 0);
				}

				if(this.getNode()){
					base.apply(this, [keptFocus]);
					return;
				}
				const self = this;
				let tries = 0;
				const attempt = function(): void{
					if(self.getNode()){
						base.apply(self, [true]);
					}else if(tries++ < 12){
						setTimeout(attempt, 20);
					}
				};
				setTimeout(attempt, 20);
			},

			keys: {
				"up": function (this: KeyboardNavigationNode) { seek(gantt, this, -1, 0); },
				"down": function (this: KeyboardNavigationNode) { seek(gantt, this, 1, 0); },
				"left": function (this: KeyboardNavigationNode) { seek(gantt, this, 0, -1); },
				"right": function (this: KeyboardNavigationNode) { seek(gantt, this, 0, 1); },
				"home": function (this: KeyboardNavigationNode) { seekColumn(gantt, this, 0, 1); },
				"end": function (this: KeyboardNavigationNode) {
					const count = resourceTimelineColumnCount(gantt);
					seekColumn(gantt, this, count - 1, -1);
				}
			} as KeyboardShortcutMap
		}
	);

	gantt.$keyboardNavigation.ResourceCell.prototype.bindAll(gantt.$keyboardNavigation.ResourceCell.prototype.keys!);

}

export function activateFirstResourceCell(gantt: GanttWithKeyboardNavigation): void {
	const rows = visibleResourceRows(gantt);
	for(let i = 0; i < rows.length; i++){
		const probe = new gantt.$keyboardNavigation.ResourceCell(rows[i].id, 0);
		if(seekColumn(gantt, probe, 0, 1, true)){
			return;
		}
	}
}
