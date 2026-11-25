import * as domHelpers from "../../../core/ui/utils/dom_helpers";
import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";
import { resourceStore, resourceGridView, resourceGridViews, visibleResourceRows, resourceRowIndex } from "../helpers/resource_grid_helpers";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.ResourceGridRow = function (this: KeyboardNavigationNode, resourceId?: Id | null) {
		if(resourceId === undefined || resourceId === null){
			const rows = visibleResourceRows(gantt);
			if(rows[0]) resourceId = rows[0].id;
		}
		this.resourceId = resourceId;
	} as unknown as typeof gantt.$keyboardNavigation.ResourceGridRow;

	gantt.$keyboardNavigation.ResourceGridRow.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,

			isValid: function (this: KeyboardNavigationNode): boolean {
				const store = resourceStore(gantt);
				return !!store && this.resourceId != null && store.exists(this.resourceId) && resourceRowIndex(gantt, this.resourceId) > -1;
			},

			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null {
				const rows = visibleResourceRows(gantt);
				if(!rows.length) return null;
				let index = resourceRowIndex(gantt, this.resourceId);
				if(index < 0) index = 0;
				if(index > rows.length - 1) index = rows.length - 1;
				return new gantt.$keyboardNavigation.ResourceGridRow(rows[index].id);
			},

			fromDomElement: function (e: Event): KeyboardNavigationNode | null {
				if(gantt.config.keyboard_navigation_cells) return null;
				const views = resourceGridViews(gantt);
				if(!views.length) return null;
				const row = domHelpers.locateClassName((e.target || e) as Element, "gantt_row") as HTMLElement | null;
				const inAnyView = row && views.some(function(v){ return v.view.$grid && domHelpers.isChildOf(row, v.view.$grid); });
				if(row && inAnyView){
					const id = row.getAttribute(gantt.config.resource_store + "_id") || row.getAttribute("data-resource-id");
					if(id != null && resourceStore(gantt).exists(id)){
						return new gantt.$keyboardNavigation.ResourceGridRow(id);
					}
				}
				return null;
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				const view = resourceGridView(gantt);
				if(!view || !view.$grid || this.resourceId == null) return null;
				const attr = gantt.config.resource_store + "_id";
				return view.$grid.querySelector(`.gantt_row[${attr}="${String(this.resourceId).replace(/"/g, '\\"')}"]`) as HTMLElement | null;
			},

			focus: function (this: KeyboardNavigationNode, keptFocus?: boolean): void {
				const base = gantt.$keyboardNavigation.KeyNavNode.prototype.focus;

				if(!keptFocus && this.resourceId != null){
					const view = resourceGridView(gantt);
					if(view && view.$grid_data && typeof view.getItemTop === "function"){
						const top = view.getItemTop(this.resourceId);
						const height = typeof view.getItemHeight === "function" ? view.getItemHeight(this.resourceId) : 0;
						const scrollTop = view.$grid_data.scrollTop;
						const viewHeight = view.$grid_data.offsetHeight;
						if(top < scrollTop || top + height > scrollTop + viewHeight){
							const targetY = Math.max(0, top - 20);
							const scrollYName = view.$config && view.$config.scrollY;
							const scrollbar = scrollYName ? gantt.$ui.getView(scrollYName) as any : null;
							if(scrollbar && typeof scrollbar.scrollVertically === "function"){
								scrollbar.scrollVertically(targetY);
							}else if(scrollbar && typeof scrollbar.scrollTo === "function"){
								scrollbar.scrollTo(0, targetY);
							}else{
								view.$grid_data.scrollTop = targetY;
							}
						}
					}
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
				"up": function (this: KeyboardNavigationNode) {
					const index = resourceRowIndex(gantt, this.resourceId);
					if(index > 0){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridRow(visibleResourceRows(gantt)[index - 1].id));
					}
				},
				"down": function (this: KeyboardNavigationNode) {
					const rows = visibleResourceRows(gantt);
					const index = resourceRowIndex(gantt, this.resourceId);
					if(index > -1 && index < rows.length - 1){
						this.moveTo(new gantt.$keyboardNavigation.ResourceGridRow(rows[index + 1].id));
					}
				},
				"home": function (this: KeyboardNavigationNode) {
					const rows = visibleResourceRows(gantt);
					if(rows.length) this.moveTo(new gantt.$keyboardNavigation.ResourceGridRow(rows[0].id));
				},
				"end": function (this: KeyboardNavigationNode) {
					const rows = visibleResourceRows(gantt);
					if(rows.length) this.moveTo(new gantt.$keyboardNavigation.ResourceGridRow(rows[rows.length - 1].id));
				},
				"ctrl+left": function (this: KeyboardNavigationNode) {
					const store = resourceStore(gantt);
					if(store && typeof store.hasChild === "function" && store.hasChild(this.resourceId)) store.close(this.resourceId);
				},
				"ctrl+right": function (this: KeyboardNavigationNode) {
					const store = resourceStore(gantt);
					if(store && typeof store.hasChild === "function" && store.hasChild(this.resourceId)) store.open(this.resourceId);
				}
			} as KeyboardShortcutMap
		}
	);

	gantt.$keyboardNavigation.ResourceGridRow.prototype.bindAll(gantt.$keyboardNavigation.ResourceGridRow.prototype.keys!);

}
