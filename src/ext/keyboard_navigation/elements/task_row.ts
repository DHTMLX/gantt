import type { Id, Task } from "../../../types/gantt_types";
import type { GanttWithKeyboardNavigation, KeyboardNavigationGridView, KeyboardNavigationNode, KeyboardShortcutMap } from "../types";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.TaskRow = function (this: KeyboardNavigationNode, taskId?: Id | null) {
		if (!taskId) {
			const rootLevel = gantt.getChildren(gantt.config.root_id);
			if (rootLevel[0]) {
				taskId = rootLevel[0];
			}
		}
		this.taskId = taskId;
		if (this.taskId != null && gantt.isTaskExists(this.taskId)) {
			this.index = gantt.getTaskIndex(this.taskId);
			this.globalIndex = gantt.getGlobalTaskIndex(this.taskId);
			this.splitItem = !!gantt.getTask(this.taskId).$split_subtask;
			this.parentId = gantt.getParent(this.taskId);
		}
	} as unknown as typeof gantt.$keyboardNavigation.TaskRow;

	gantt.$keyboardNavigation.TaskRow.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,
			isValid: function (this: KeyboardNavigationNode): boolean {
				return this.taskId != null && gantt.isTaskExists(this.taskId) && (gantt.getTaskIndex(this.taskId) > -1);
			},
			fallback: function (this: KeyboardNavigationNode): KeyboardNavigationNode | null | undefined {
				if (!gantt.getVisibleTaskCount()) {
					const header = new gantt.$keyboardNavigation.HeaderCell();
					if (!header.isValid()) return null;
					else return header;
				} else {

					if(!this.splitItem){
						let nextIndex = -1;
						// GS-1393. When Gantt tries to restore the focus, it should rely on the global index
						const globalIndexValue = this.globalIndex || 0;
						if (gantt.getTaskByIndex(globalIndexValue - 1)) {
							nextIndex = globalIndexValue - 1;
						} else if (gantt.getTaskByIndex(globalIndexValue + 1)) {
							nextIndex = globalIndexValue + 1;
						} else {
							let globalIndex = globalIndexValue;
							while (globalIndex >= 0) {
								if (gantt.getTaskByIndex(globalIndex)) {
									nextIndex = globalIndex;
									break;
								}
								globalIndex--;
							}

						}
						if (nextIndex > -1) {
							return new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(nextIndex).id);
						}
					}else {
						return new gantt.$keyboardNavigation.TaskRow(this.parentId);
					}

				}
			},

			fromDomElement: function(el: Event): KeyboardNavigationNode | null{
				if(gantt.config.keyboard_navigation_cells){
					return null;
				}

				const taskId = gantt.locate(el);
				if(gantt.isTaskExists(taskId)){
					return new gantt.$keyboardNavigation.TaskRow(taskId);
				}else{
					return null;
				}
			},

			getNode: function (this: KeyboardNavigationNode): HTMLElement | null | undefined {
				if (this.taskId != null && gantt.isTaskExists(this.taskId) && gantt.isTaskVisible(this.taskId)) {
					if (gantt.config.show_grid && gantt.$grid) {
						return gantt.$grid.querySelector(`.gantt_row[${gantt.config.task_attribute}="${String(this.taskId).replace(/"/g, '\\"')}"]`) as HTMLElement | null;
					} else {
						return gantt.getTaskNode(this.taskId);
					}
				}
			},

			focus: function (this: KeyboardNavigationNode, keptFocus?: boolean): void {
				if(!keptFocus && this.taskId != null) {
					const pos = gantt.getTaskPosition(gantt.getTask(this.taskId));
					const height = gantt.getTaskHeight(this.taskId);
					const scroll = gantt.getScrollState();

					let viewWidth: number;
					if(gantt.$task){
						viewWidth = gantt.$task.offsetWidth;
					}else{
						viewWidth = scroll.inner_width;
					}

					let viewHeight: number;
					if(gantt.$grid_data || gantt.$task_data){
						viewHeight = (gantt.$grid_data || gantt.$task_data).offsetHeight;
					}else{
						viewHeight = scroll.inner_height;
					}
					const visibleTimeline = gantt.config.show_chart && gantt.$ui.getView("timeline");

					if (pos.top < scroll.y || pos.top + height > (scroll.y + viewHeight)) {
						// GS-2346: additional scrolling to be sure that the task will be in the required range
						gantt.scrollTo(null, pos.top - 20);
					} else if (gantt.config.scroll_on_click && visibleTimeline) {
						// horizontal scroll activated
						if (pos.left > (scroll.x + viewWidth)) { // scroll forward to the start of the task
							gantt.scrollTo(pos.left - gantt.config.task_scroll_offset);
						} else if (pos.left + pos.width < scroll.x) {  // scroll back to the end of the task
							gantt.scrollTo(pos.left + pos.width - gantt.config.task_scroll_offset);
						}
					}
				}

				gantt.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this, [keptFocus]);

				// GS-152 if there are scrollbars with custom names, change their scroll position
				scrollGrid();

				function scrollGrid() {
					const grid = gantt.$ui.getView("grid") as KeyboardNavigationGridView | null | undefined;
					if (!grid || !grid.$grid_data){
						// GS-1805. Don't try to focus the row that doesn't exist
						return;
					}
					const scrollPositionX = parseInt(String(grid.$grid.scrollLeft));
					const scrollPositionY = parseInt(String(grid.$grid_data.scrollTop));

					const attachedScrollbarHorizontal = grid.$config.scrollX;

					if (attachedScrollbarHorizontal && grid.$config.scrollable) {
						const scrollbarHorizontal = gantt.$ui.getView(attachedScrollbarHorizontal) as KeyboardNavigationGridView | null | undefined;
						if (scrollbarHorizontal) {
							scrollbarHorizontal.scrollTo(scrollPositionX, scrollPositionY);
						}
					}

					const attachedScrollbarVertical = grid.$config.scrollY;

					if (attachedScrollbarVertical) {
						const scrollbarVertical = gantt.$ui.getView(attachedScrollbarVertical) as KeyboardNavigationGridView | null | undefined;
						if (scrollbarVertical) {
							scrollbarVertical.scrollTo(scrollPositionX, scrollPositionY);
						}
					}
				}

			},

			keys: {
				"pagedown": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(gantt.getVisibleTaskCount() - 1).id));
					}
				},
				"pageup": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(0).id));
					}
				},
				"up": function () {
					let nextElement: KeyboardNavigationNode | null = null;
					const prevTask = gantt.getPrev(this.taskId!);
					if (!gantt.isTaskExists(prevTask)) {
						nextElement = new gantt.$keyboardNavigation.HeaderCell();
					} else {
						nextElement = new gantt.$keyboardNavigation.TaskRow(prevTask);
					}
					this.moveTo(nextElement);
				},
				"down": function () {
					const nextTask = gantt.getNext(this.taskId!);
					if (gantt.isTaskExists(nextTask)) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(nextTask));
					}
				},

				"shift+down": function(){
					if(gantt.hasChild(this.taskId!) && !gantt.getTask(this.taskId!).$open){
						gantt.open(this.taskId!);
					}
				},
				"shift+up": function(){
					if(gantt.hasChild(this.taskId!) && gantt.getTask(this.taskId!).$open){
						gantt.close(this.taskId!);
					}
				},
				"shift+right": function() {
					if (gantt.isReadonly(this.taskId!)) {
						return;
					}
					const prevId = gantt.getPrevSibling(this.taskId!);
					if(gantt.isTaskExists(prevId) && !gantt.isChildOf(this.taskId!, prevId)){
						const parent = gantt.getTask(prevId) as Task;
						parent.$open = true;
						const result = gantt.moveTask(this.taskId!, -1, prevId);
						if(result !== false)
							gantt.updateTask(this.taskId!);
					}
				},
				"shift+left": function() {
					if (gantt.isReadonly(this.taskId!)) {
						return;
					}
					const parent = gantt.getParent(this.taskId!);
					if(gantt.isTaskExists(parent)){
						const result =  gantt.moveTask(this.taskId!, gantt.getTaskIndex(parent) + 1, gantt.getParent(parent));
						if(result !== false)
							gantt.updateTask(this.taskId!);
					}
				},

				// select
				"space": function () {
					if (!gantt.isSelectedTask(this.taskId!)) {
						gantt.selectTask(this.taskId!);
					} else {
						gantt.unselectTask(this.taskId!);
					}
				},

				// collapse
				"ctrl+left": function () {
					gantt.close(this.taskId!);
				},
				// expand
				"ctrl+right": function () {
					gantt.open(this.taskId!);
				},

				// delete task
				"delete": function () {
					if (gantt.isReadonly(this.taskId!)) {
						return;
					}
					gantt.$click.buttons["delete"](this.taskId!);
				},

				// open lightbox
				"enter": function () {
					if (gantt.isReadonly(this.taskId!)) {
						return;
					}
					gantt.showLightbox(this.taskId!);
				},

				// add subtask
				"ctrl+enter": function () {
					if (!gantt._canAddSubtask(this.taskId!)) {
						return;
					}
					gantt.createTask({}, this.taskId!);
				}
			} as KeyboardShortcutMap
		}
	);
	gantt.$keyboardNavigation.TaskRow.prototype.bindAll(gantt.$keyboardNavigation.TaskRow.prototype.keys!);

};
