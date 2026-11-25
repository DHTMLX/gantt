import * as domHelpers from "../../../core/ui/utils/dom_helpers";
import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";
import { resourceStore, resourceGridViews, visibleResourceRows, resourceRowIndex } from "../helpers/resource_grid_helpers";
import { getCombinedColumnCount, resolveGlobalColumn, viewContaining, globalIndexOf } from "../helpers/grid_views_helpers";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.ResourceGridCell = function (this: KeyboardNavigationNode, resourceId?: Id | null, index?: number) {
		if(resourceId === undefined || resourceId === null){
			const rows = visibleResourceRows(gantt);
			if(rows[0]) resourceId = rows[0].id;
		}
		this.resourceId = resourceId;
		this.columnIndex = index || 0;
	} as unknown as typeof gantt.$keyboardNavigation.ResourceGridCell;

	gantt.$keyboardNavigation.ResourceGridCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.ResourceGridRow,
		{
			_handlers: null,

			isValid: function (this: KeyboardNavigationNode): boolean {
				return gantt.$keyboardNavigation.ResourceGridRow.prototype.isValid.call(this) && !!resolveGlobalColumn(resourceGridViews(gantt), this.columnIndex || 0);
			},

			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null | undefined {
				const node = gantt.$keyboardNavigation.ResourceGridRow.prototype.fallback.call(this);
				if(node instanceof gantt.$keyboardNavigation.ResourceGridRow){
					const views = resourceGridViews(gantt);
					let index = this.columnIndex || 0;
					while(index >= 0){
						if(resolveGlobalColumn(views, index)) break;
						index--;
					}
					if(resolveGlobalColumn(views, index)){
						return new gantt.$keyboardNavigation.ResourceGridCell(node.resourceId, index);
					}
				}
				return node;
			},

			fromDomElement: function (e: Event): KeyboardNavigationNode | null {
				if(!gantt.config.keyboard_navigation_cells) return null;
				const views = resourceGridViews(gantt);
				if(!views.length) return null;
				const row = domHelpers.locateClassName((e.target || e) as Element, "gantt_row") as HTMLElement | null;
				const inAnyView = row && views.some(function(v){ return v.view.$grid && domHelpers.isChildOf(row, v.view.$grid); });
				if(row && inAnyView){
					const id = row.getAttribute(gantt.config.resource_store + "_id") || row.getAttribute("data-resource-id");
					if(id != null && resourceStore(gantt).exists(id)){
						let index = 0;
						const cellElement = domHelpers.locateAttribute((e.target || e) as Element, "data-column-index");
						if(cellElement){
							const localIndex = Number(cellElement.getAttribute("data-column-index"));
							const matchedView = viewContaining(views, cellElement);
							index = matchedView ? globalIndexOf(views, matchedView.view, localIndex) : localIndex;
						}
						return new gantt.$keyboardNavigation.ResourceGridCell(id, index);
					}
				}
				return null;
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				const views = resourceGridViews(gantt);
				const resolved = resolveGlobalColumn(views, this.columnIndex || 0);
				if(!resolved || this.resourceId == null) return null;
				const attr = gantt.config.resource_store + "_id";
				const row = resolved.view.$grid.querySelector(`.gantt_row[${attr}="${String(this.resourceId).replace(/"/g, '\\"')}"]`) as HTMLElement | null;
				if(!row) return null;
				return row.querySelector(`[data-column-index="${resolved.localIndex}"]`) as HTMLElement | null;
			},

			keys: {
				"up": function (this: KeyboardNavigationNode) {
					const index = resourceRowIndex(gantt, this.resourceId);
					if(index > 0){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(visibleResourceRows(gantt)[index - 1].id, this.columnIndex));
					}
				},
				"down": function (this: KeyboardNavigationNode) {
					const rows = visibleResourceRows(gantt);
					const index = resourceRowIndex(gantt, this.resourceId);
					if(index > -1 && index < rows.length - 1){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(rows[index + 1].id, this.columnIndex));
					}
				},
				"left": function (this: KeyboardNavigationNode) {
					const columnIndex = this.columnIndex || 0;
					if(columnIndex > 0){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(this.resourceId, columnIndex - 1));
					}
				},
				"right": function (this: KeyboardNavigationNode) {
					const total = getCombinedColumnCount(resourceGridViews(gantt));
					const columnIndex = this.columnIndex || 0;
					if(columnIndex < total - 1){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(this.resourceId, columnIndex + 1));
					}
				},
				"home": function (this: KeyboardNavigationNode) {
					this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(this.resourceId, 0));
				},
				"end": function (this: KeyboardNavigationNode) {
					const total = getCombinedColumnCount(resourceGridViews(gantt));
					this.moveTo(new gantt.$keyboardNavigation.ResourceGridCell(this.resourceId, total - 1));
				}
			} as KeyboardShortcutMap
		}
	);

	gantt.$keyboardNavigation.ResourceGridCell.prototype.bindAll(gantt.$keyboardNavigation.ResourceGridRow.prototype.keys!);
	gantt.$keyboardNavigation.ResourceGridCell.prototype.bindAll(gantt.$keyboardNavigation.ResourceGridCell.prototype.keys!);

}