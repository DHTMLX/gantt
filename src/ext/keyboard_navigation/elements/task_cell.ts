import * as domHelpers from "../../../core/ui/utils/dom_helpers";
import {replaceValidZeroId} from "../../../utils/helpers";
import type { Id } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";
import { getBoundGridViews, getCombinedColumnCount, resolveGlobalColumn, viewContaining, globalIndexOf } from "../helpers/grid_views_helpers";

function taskGridViews(gantt: GanttWithKeyboardNavigation) {
	return getBoundGridViews(gantt, "task");
}

export default function(gantt: GanttWithKeyboardNavigation): void {


	gantt.$keyboardNavigation.TaskCell = function (this: KeyboardNavigationNode, taskId: Id | null, index?: number) {
		taskId = replaceValidZeroId(taskId!, gantt.config.root_id);
		if (!taskId) {
			const rootLevel = gantt.getChildren(gantt.config.root_id);
			if (rootLevel[0]) {
				taskId = rootLevel[0];
			}
		}
		this.taskId = taskId;
		this.columnIndex = index || 0;
		// provided task may not exist, in this case node will be detectes as invalid
		if (this.taskId != null && gantt.isTaskExists(this.taskId)) {
			this.index = gantt.getTaskIndex(this.taskId);
			this.globalIndex = gantt.getGlobalTaskIndex(this.taskId);
		}
	} as unknown as typeof gantt.$keyboardNavigation.TaskCell;

	gantt.$keyboardNavigation.TaskCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.TaskRow,
		{
			_handlers: null,
			isValid: function (this: KeyboardNavigationNode): boolean {

				return gantt.$keyboardNavigation.TaskRow.prototype.isValid.call(this) && !!resolveGlobalColumn(taskGridViews(gantt), this.columnIndex || 0);
			},
			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null | undefined {

				const node = gantt.$keyboardNavigation.TaskRow.prototype.fallback.call(this);
				let result = node;
				if (node instanceof gantt.$keyboardNavigation.TaskRow) {
					const views = taskGridViews(gantt);
					let index = this.columnIndex || 0;
					while (index >= 0) {
						if (resolveGlobalColumn(views, index))
							break;
						index--;
					}
					if (resolveGlobalColumn(views, index)) {
						result = new gantt.$keyboardNavigation.TaskCell(node.taskId, index);
					}
				}

				return result;
			},

			fromDomElement: function(el: Event): KeyboardNavigationNode | null{
				if(!gantt.config.keyboard_navigation_cells){
					return null;
				}

				const taskId = gantt.locate(el);
				if(gantt.isTaskExists(taskId)){
					let index = 0;
					const cellElement = domHelpers.locateAttribute((el.target || el) as Element, "data-column-index");

					if(cellElement){
						const localIndex = Number(cellElement.getAttribute("data-column-index"));
						const views = taskGridViews(gantt);
						const matchedView = viewContaining(views, cellElement);
						index = matchedView ? globalIndexOf(views, matchedView.view, localIndex) : localIndex;
					}

					return new gantt.$keyboardNavigation.TaskCell(taskId, index);
				}else{
					return null;
				}
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				if (this.taskId != null && gantt.isTaskExists(this.taskId) && (gantt.isTaskVisible(this.taskId) || gantt.config.show_tasks_outside_timescale)) {
					if (gantt.config.show_grid && gantt.$grid) {
						const resolved = resolveGlobalColumn(taskGridViews(gantt), this.columnIndex || 0);
						if(!resolved) return null;
						const row = resolved.view.$grid.querySelector(".gantt_row[" + gantt.config.task_attribute + "='" + this.taskId + "']") as HTMLElement | null;
						if(!row)
							return null;
						return row.querySelector("[data-column-index='"+resolved.localIndex+"']") as HTMLElement | null;
					} else {
						return gantt.getTaskNode(this.taskId);
					}
				}
			},

			keys: {
				"up": function () {

					let nextElement: KeyboardNavigationNode | null = null;
					const prevTask = gantt.getPrev(this.taskId!);
					if (!gantt.isTaskExists(prevTask)) {
						nextElement = new gantt.$keyboardNavigation.HeaderCell(this.columnIndex);
					} else {
						nextElement = new gantt.$keyboardNavigation.TaskCell(prevTask, this.columnIndex);
					}
					this.moveTo(nextElement);
				},
				"down": function () {
					const nextTask = gantt.getNext(this.taskId!);
					if (gantt.isTaskExists(nextTask)) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(nextTask, this.columnIndex));
					}
				},
				"left": function () {
					const columnIndex = this.columnIndex || 0;
					if (columnIndex > 0) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, columnIndex - 1));
					}
				},
				"right": function () {
					const total = getCombinedColumnCount(taskGridViews(gantt));
					const columnIndex = this.columnIndex || 0;
					if (columnIndex < total - 1) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, columnIndex + 1));
					}
				},

				"end": function () {
					const total = getCombinedColumnCount(taskGridViews(gantt));
					this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, total - 1));
				},
				"home": function () {
					this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, 0));
				},
				"pagedown": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(gantt.getTaskByIndex(gantt.getVisibleTaskCount() - 1).id, this.columnIndex));
					}
				},
				"pageup": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(gantt.getTaskByIndex(0).id, this.columnIndex));
					}
				}
			} as KeyboardShortcutMap
		}
	);


	gantt.$keyboardNavigation.TaskCell.prototype.bindAll(gantt.$keyboardNavigation.TaskRow.prototype.keys!);
	gantt.$keyboardNavigation.TaskCell.prototype.bindAll(gantt.$keyboardNavigation.TaskCell.prototype.keys!);

};
