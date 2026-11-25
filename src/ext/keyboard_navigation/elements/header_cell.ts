import * as domHelpers from "../../../core/ui/utils/dom_helpers";
import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";
import { getBoundGridViews, getCombinedColumnCount, resolveGlobalColumn, globalIndexOf } from "../helpers/grid_views_helpers";

function taskGridViews(gantt: GanttWithKeyboardNavigation) {
	return getBoundGridViews(gantt, "task");
}

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.HeaderCell = function (this: KeyboardNavigationNode, index?: Id | null) {
		this.index = Number(index || 0);
	} as unknown as typeof gantt.$keyboardNavigation.HeaderCell;

	gantt.$keyboardNavigation.HeaderCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,

			isValid: function (this: KeyboardNavigationNode): boolean {
				if (!gantt.config.show_grid) {
					if (gantt.getVisibleTaskCount())
						return false;
				}
				return !!resolveGlobalColumn(taskGridViews(gantt), this.index || 0) || !gantt.getVisibleTaskCount();
			},
			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null {
				if (!gantt.config.show_grid) {
					if (gantt.getVisibleTaskCount()) {
						return new gantt.$keyboardNavigation.TaskRow();
					}
					return null;
				}
				const views = taskGridViews(gantt);
				let index = this.index || 0;
				while (index >= 0) {
					if (resolveGlobalColumn(views, index))
						break;
					index--;
				}
				if (resolveGlobalColumn(views, index)) {
					return new gantt.$keyboardNavigation.HeaderCell(index);
				} else {
					return null;
				}
			},

			fromDomElement: function(el: Event): KeyboardNavigationNode | null{
				let cellElement = domHelpers.locateClassName((el.target || el) as Element, "gantt_grid_head_cell");
				if(cellElement){
					const views = taskGridViews(gantt);
					let matchedView = null;
					for(let i = 0; i < views.length; i++){
						if(views[i].view.$grid_scale && views[i].view.$grid_scale.contains(cellElement)){
							matchedView = views[i];
							break;
						}
					}
					let localIndex = 0;
					while(cellElement && cellElement.previousSibling){
						cellElement = cellElement.previousSibling as HTMLElement;
						localIndex += 1;
					}
					const index = matchedView ? globalIndexOf(views, matchedView.view, localIndex) : localIndex;
					return new gantt.$keyboardNavigation.HeaderCell(index);
				}else{
					return null;
				}
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				const views = taskGridViews(gantt);
				const resolved = resolveGlobalColumn(views, this.index || 0);
				const scale = resolved ? resolved.view.$grid_scale : gantt.$grid_scale;
				if (!scale){
					return null;
				}
				const cells = scale.childNodes;
				const localIndex = resolved ? resolved.localIndex : (this.index || 0);
				return cells[localIndex] as HTMLElement | undefined;
			},


			keys: {

				"left": function () {
					const index = this.index || 0;
					if (index > 0) {
						this.moveTo(new gantt.$keyboardNavigation.HeaderCell(index - 1));
					}
				},
				"right": function () {
					const total = getCombinedColumnCount(taskGridViews(gantt));
					const index = this.index || 0;
					if (index < total - 1) {
						this.moveTo(new gantt.$keyboardNavigation.HeaderCell(index + 1));
					}
				},
				"down": function () {
					let taskRow: Id | undefined;
					const rootLevel = gantt.getChildren(gantt.config.root_id);
					if (gantt.isTaskExists(rootLevel[0])) {
						taskRow = rootLevel[0];
					}
					if (taskRow) {
						if (gantt.config.keyboard_navigation_cells) {
							this.moveTo(new gantt.$keyboardNavigation.TaskCell(taskRow, this.index));
						} else {
							this.moveTo(new gantt.$keyboardNavigation.TaskRow(taskRow));
						}
					}
				},

				"end": function () {
					const total = getCombinedColumnCount(taskGridViews(gantt));
					this.moveTo(new gantt.$keyboardNavigation.HeaderCell(total - 1));
				},
				"home": function () {
					this.moveTo(new gantt.$keyboardNavigation.HeaderCell(0));
				},


				// press header button
				"enter, space": function () {
					const node = domHelpers.getActiveElement() as HTMLElement | null;
					node?.click();
				},

				// add new task
				"ctrl+enter": function () {
					if (gantt.isReadonly(this)) {
						return;
					}
					gantt.createTask({}, this.taskId);
				}
			} as KeyboardShortcutMap
		}
	);

	gantt.$keyboardNavigation.HeaderCell.prototype.bindAll(gantt.$keyboardNavigation.HeaderCell.prototype.keys!);

};
