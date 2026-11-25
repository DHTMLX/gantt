// Type definitions for dhtmlxGantt {{version}}
// Project: https://dhtmlx.com/docs/products/dhtmlxGantt

// Scale-domain types live in a single shared, dependency-free leaf module so the host config
// surface and the timeline scale engine stay in sync. They are re-exported here to keep the
// public type names (Scale, ScaleProjectionMode, …) importable from gantt_types unchanged.
import type { Scale, ScaleProjectionMode, TimeUnit, ScaleUnit } from "../core/common/scale_types";
export type { Scale, ScaleProjectionMode, TimeUnit, ScaleUnit };

export type GanttCallback = (...args: any[]) => any;


export interface GanttEventCallback {

	/**
	 * fires when autoscheduling is done
	 * @param taskId the root task id
	 * @param updatedTasks an array with the ids of rescheduled tasks
	*/
	"onAfterAutoSchedule"(taskId: string | number, updatedTasks: any[]): void;

	/**
	 * fires after the api/gantt_batchupdate.md method was called
	*/
	"onAfterBatchUpdate"(): void;

	/**
	 * if dynamic loading is enabled, fires after the task branch was loaded to the page
	 * @param settings an object which contains the task id and request URL
	*/
	"onAfterBranchLoading"(settings: any): void;

	/**
	 * fires after the user has closed the lightbox (edit form)
	*/
	"onAfterLightbox"(): void;

	/**
	 * fires after a new link is added to the Gantt chart
	 * @param id the link id
	 * @param link the link object
	*/
	"onAfterLinkAdd"(id: string | number, link: Link): void;

	/**
	 * fires after the user deletes a link
	 * @param id the link id
	 * @param link the link object
	*/
	"onAfterLinkDelete"(id: string | number, link: Link): void;

	/**
	 * fires after the user updates a link
	 * @param id the link id
	 * @param link the link object
	*/
	"onAfterLinkUpdate"(id: string | number, link: Link): void;

	/**
	 * fires after the pop-up edit form is closed
	 * @param taskId the task id
	*/
	"onAfterQuickInfo"(taskId: string | number): void;

	/**
	 * fires after the redo() method was called
	 * @param action a user action as an array of command objects
	*/
	"onAfterRedo"(action: any[]): void;

	/**
	 * fires after resizing of the row height is finished
	 * @param id the task id
	 * @param task the item object
	 * @param oldHeight the old height of the row
	 * @param newHeight the new height of the row
	*/
	"onAfterRowResize"(id: string | number, task: Task, oldHeight: number, newHeight: number): void;

	/**
	 * fires after tasks are sorted in the grid
	 * @param field the name of the column that the grid was sorted by or a custom sorting function
	 * @param desc optional, the sorting direction: <i>true</i> - descending, <i>false</i> - ascending<br>
	 * @param parent optional, the id of the parent task, if the tasks were sorted only in the branch of the specified parent
	*/
	"onAfterSort"(field: string | GanttCallback, desc?: boolean, parent?: string | number): void;

	/**
	 * fires after the user adds a task to the Gantt chart
	 * @param id the task id
	 * @param task the task object
	*/
	"onAfterTaskAdd"(id: string | number, task: Task): void;

	/**
	 * fires for each task which has been autoscheduled
	 * @param task the task object
	 * @param start a new start date
	 * @param link the link object that creates the constraint
	 * @param predecessor the predecessor task object
	*/
	"onAfterTaskAutoSchedule"(task: Task, start: Date, link: Link, predecessor: Task): void;

	/**
	 * fires after the user deletes a task
	 * @param id the task id
	 * @param task the task object
	*/
	"onAfterTaskDelete"(id: string | number, task: Task): void;

	/**
	 * fires after the user has finished to drag and released the mouse button
	 * @param id the task id
	 * @param mode the drag-and-drop mode ("resize", "progress", "move", "ignore")
	 * @param e a native event object
	*/
	"onAfterTaskDrag"(id: string | number, mode: string, e: Event): void;

	/**
	 * fires after a task was moved to a new vertical position
	 * @param id the id of the task to move
	 * @param parent the parent id
	 * @param tindex the index of the position in the parent branch that the task will be moved to
	*/
	"onAfterTaskMove"(id: string | number, parent: string | number, tindex: number): void;

	/**
	 * fires after the user updates a task
	 * @param id the task id
	 * @param task the task object
	*/
	"onAfterTaskUpdate"(id: string | number, task: Task): void;

	/**
	 * fires after the undo() method was called
	 * @param action an array of command objects
	*/
	"onAfterUndo"(action: any[]): void;

	/**
	 * fires once after a `wbs` extension operation applies a non-empty set of code changes. Not raised for a
	 * no-op, a `dryRun`, or a rejected operation.
	 * @param result the applied operation, including every changed code
	*/
	"onAfterWBSOperation"(result: WBSOperationPlan): void;

	/**
	 * fires if the server returns an error
	 * @param request XML HTTP request object
	*/
	"onAjaxError"(request: any): boolean;

	/**
	 * fires if some dependency loops were found during auto scheduling
	 * @param groups an array of dependency loops found in gantt, each
	 *               `{ tasks, links }` as `gantt.findCycles()` returns it
	*/
	"onAutoScheduleCircularLink"(groups: any[]): void;

	/**
	 * Since v10.0. Fires for a conflict that auto scheduling runs into. The
	 * conflict is a passive notification - the engine still writes its
	 * best-effort dates.
	 * @param conflict an `AutoScheduleConflict`. The 10.0 field names `taskId`,
	 *                 `constraintType`, `proposedDate` and `snappedDate` are kept
	 *                 as deprecated aliases of `task`, `constraint`, `proposed`
	 *                 and `snapped`
	*/
	"onAutoScheduleConflict"(conflict: any): void;

	/**
	 * Since v10.1. Fires when a user edit creates one or more constraint conflicts,
	 * before Gantt shows its built-in dialog. Return false to hide the built-in
	 * dialog and handle the choice yourself: call `resolve` with "cancel" or with
	 * the `choice` of one of `resolutions` once you have an answer.
	 * Only fires when auto_scheduling.resolve_constraint_conflicts is "prompt".
	 * @param conflicts the conflicts the edit created
	 * @param resolve finishes the edit; throws for a choice that is not offered
	 * @param resolutions the remedies the built-in dialog offers, in its order and with its labels
	*/
	"onBeforeAutoScheduleConflictResolve"(
		conflicts: AutoScheduleConflict[],
		resolve: (choice: AutoScheduleConflictChoice) => void,
		resolutions: AutoScheduleConflictResolution[]
	): boolean;

	/**
	 * Since v10.1. Fires after a constraint conflict has been resolved (by the
	 * user, by your own handler, or by the "adjust" mode).
	 * @param choice the remedy chosen, or "cancel"
	 * @param conflicts the conflicts that were resolved
	 * @param changedTaskIds tasks whose constraint "adjust" or "remove" changed
	 * @param changedLinkIds links that "deactivate" deactivated
	*/
	"onAfterAutoScheduleConflictResolve"(
		choice: AutoScheduleConflictChoice,
		conflicts: AutoScheduleConflict[],
		changedTaskIds: Id[],
		changedLinkIds: Id[]
	): void;

	/**
	 * Since v10.0. Fires when the auto-scheduling engine reaches its iteration
	 * cap without converging on stable dates. The final pass's dates are still
	 * written; this event signals that the dataset is over-constrained.
	 * @param info `{ iterations, converged: false, conflicts }`; the conflicts
	 *             are as `onAutoScheduleConflict` passes them
	*/
	"onAutoScheduleNoConverge"(info: any): void;

	/**
	 * fires before auto scheduling
	 * @param taskId the root task id
	*/
	"onBeforeAutoSchedule"(taskId: string | number): boolean;

	/**
	 * fires before the api/gantt_batchupdate.md method is called
	*/
	"onBeforeBatchUpdate"(): void;

	/**
	 * if dynamic loading is enabled, fires after a user expands the task branch but before loading starts
	 * @param settings an object which contains the task id and request URL
	*/
	"onBeforeBranchLoading"(settings: any): boolean;

	/**
	 * before gantt exits the fullscreen mode and goes back to normal mode
	*/
	"onBeforeCollapse"(): boolean;

	/**
	 * fires before data is rendered on the page
	*/
	"onBeforeDataRender"(): void;

	/**
	 * fires before gantt is expanded to full screen
	*/
	"onBeforeExpand"(): boolean;

	/**
	 * fires before the dhtmlxGantt initialization is started
	*/
	"onBeforeGanttReady"(): void;

	/**
	 * fires before the Gantt chart is rendered on the page
	*/
	"onBeforeGanttRender"(): void;

	/**
	 * fires immediately before the user opens the lightbox (edit form)
	 * @param id the task id
	*/
	"onBeforeLightbox"(id: string | number): boolean;

	/**
	 * fires before a new link is added to the Gantt chart
	 * @param id the link id
	 * @param link the link object
	*/
	"onBeforeLinkAdd"(id: string | number, link: Link): boolean;

	/**
	 * fires before the user deletes a link
	 * @param id the link id
	 * @param link the link object
	*/
	"onBeforeLinkDelete"(id: string | number, link: Link): boolean;

	/**
	 * fires after the links have been loaded to the Gantt chart but before they are displayed
	 * @param id the link id
	 * @param link the link object
	*/
	"onBeforeLinkDisplay"(id: string | number, link: Link): boolean;

	/**
	 * fires before a link is updated
	 * @param id the link id
	 * @param new_link the new (updated)  object of the link
	*/
	"onBeforeLinkUpdate"(id: string | number, new_link: Link): boolean;

	/**
	 * fires before selecting a task or a range of tasks
	 * @param e a native event object
	*/
	"onBeforeMultiSelect"(e: Event): void;

	/**
	 * fires before data started to be parsed
	*/
	"onBeforeParse"(): void;

	/**
	 * fires before the redo() method is called
	 * @param action a user action as an array of command objects
	*/
	"onBeforeRedo"(action: any[]): boolean;

	/**
	 * fires before an action is added into the redo stack
	 * @param action a user action as an array of command objects
	*/
	"onBeforeRedoStack"(action: UndoRedoAction): boolean;

	/**
	 * fires before the rollup task is displayed on its parent project
	 * @param taskId the rollup task id
	 * @param task the rollup task object
	 * @param parentId the id of the parent (project) task
	*/
	"onBeforeRollupTaskDisplay"(taskId: number | string, task: Task, parentId: number | string): boolean;

	/**
	 * fires when a user drops a row in the grid
	 * @param sid the id of the task to move
	 * @param parent the parent id. If specified, the <b>tindex</b> will  refer to the  index in the <br> <b>'parent'</b> branch
	 * @param tindex the index of the position that the task will be moved from <br> (the index in the whole tree)
	*/
	"onBeforeRowDragEnd"(sid: string | number, parent: string | number, tindex: number): boolean;

	/**
	 * fires before a row of the grid is dragged vertically to a different position
	 * @param id the id of the task to move in the grid
	 * @param parent the parent id
	 * @param tindex the index of the position in the parent branch that the task will be moved to
	*/
	"onBeforeRowDragMove"(id: string | number, parent: string | number, tindex: number): boolean;

	/**
	 * fires before the user starts to resize the row height by drag-and-drop
	 * @param task the task object
	*/
	"onBeforeRowResize"(task: Task): boolean;

	/**
	 * fires before resizing of the row height is completed
	 * @param id the task id
	 * @param task the task object
	 * @param newHeight the new height of the row
	*/
	"onBeforeRowResizeEnd"(id: number | string, task: Task, newHeight: number): boolean;

	/**
	 * fires before a part of the split task is displayed on the Gantt chart
	 * @param id the id of the subtask
	 * @param task the object of the subtask
	 * @param parent the object of the parent task
	*/
	"onBeforeSplitTaskDisplay"(id: number | string, task: Task, parent: any): boolean;

	/**
	 * fires before a new task is added to the Gantt chart
	 * @param id the task id
	 * @param task the task object
	*/
	"onBeforeTaskAdd"(id: string | number, task: Task): boolean;

	/**
	 * fires for each task which is rescheduled
	 * @param task the task object
	 * @param start a new start date
	 * @param link the link object that creates the constraint
	 * @param predecessor the predecessor task object
	*/
	"onBeforeTaskAutoSchedule"(task: Task, start: Date, link: Link, predecessor: Task): boolean;

	/**
	 * fires after the user has finished dragging and released the mouse button but before the changes are applied
	 * @param id the task id
	 * @param mode the drag-and-drop mode ("resize", "progress", "move", "ignore")
	 * @param task the copy of the task object in its original state (before drag and drop)
	*/
	"onBeforeTaskChanged"(id: string | number, mode: string, task: Task): boolean;

	/**
	 * fires before the user deletes a task
	 * @param id the task id
	 * @param task the task object
	*/
	"onBeforeTaskDelete"(id: string | number, task: Task): boolean;

	/**
	 * fires after the tasks have been loaded to the Gantt chart, but before they are displayed
	 * @param id the task id
	 * @param task the task object
	*/
	"onBeforeTaskDisplay"(id: string | number, task: Task): boolean;

	/**
	 * fires after the user has pressed the mouse button and started dragging, but before dhtmlxGantt starts the drag-and-drop operation
	 * @param id the task id
	 * @param mode the drag-and-drop mode ("resize", "progress", "move", "ignore")
	 * @param e a native event object
	*/
	"onBeforeTaskDrag"(id: string | number, mode: string, e: Event): boolean;

	/**
	 * fires before a task is moved to a new vertical position
	 * @param id the id of the task to move
	 * @param parent the parent id
	 * @param tindex the index of the position in the parent branch that the task will be moved to
	*/
	"onBeforeTaskMove"(id: string | number, parent: string | number, tindex: number): boolean;

	/**
	 * fires before the task selection state is being changed (the task is being selected or unselected)
	 * @param id the id of a task
	 * @param state true if the task is going to be selected, false - if unselected
	 * @param e a native event object
	*/
	"onBeforeTaskMultiSelect"(id: string | number, state: boolean, e: Event | null): void;

	/**
	 * fires before the user selects a task
	 * @param id the task id
	*/
	"onBeforeTaskSelected"(id: string | number): boolean;

	/**
	 * fires before the user updates a task
	 * @param id the task id
	 * @param new_task the new (updated) object of the task
	*/
	"onBeforeTaskUpdate"(id: string | number, new_task: Task): void;

	/**
	 * fires before the undo() method is called
	 * @param action an array of command objects
	*/
	"onBeforeUndo"(action: any[]): boolean;

	/**
	 * fires before an action is added into the undo stack
	 * @param action a user action as an array of command objects
	*/
	"onBeforeUndoStack"(action: UndoRedoAction): boolean;

	/**
	 * fires before a `wbs` extension operation applies a non-empty set of code
	 * changes. Return `false` to cancel the whole operation - the structural
	 * command it is attached to (add, delete, move, drag and drop, indent,
	 * outdent, or a grid edit of a mapped field) is vetoed too, so nothing
	 * changes. Not raised for a no-op or a `dryRun`.
	 * @param plan the proposed operation, including every code change it would make
	*/
	"onBeforeWBSOperation"(plan: WBSOperationPlan): boolean | void;

	/**
	 * fires when the circular reference has been detected and auto scheduling is not possible
	 * fires when the circular reference has been detected and auto scheduling is not possible.
	 * A handler that returns false hides the notice that Gantt shows for a dragged link
	 * in the "prompt" conflict mode (since v10.1)
	 * @param link the link object
	 * @param group a group of tasks and links connected in a loop
	*/
	"onCircularLinkError"(link: Link, group: any): void;

	/**
	 * fires after all tasks were removed from the Gantt chart by the api/gantt_clearall.md method
	*/
	"onClear"(): void;

	/**
	 * fires when gantt went back to normal mode from the full screen mode
	*/
	"onCollapse"(): void;

	/**
	 * fires when the user is dragging the column's border to resize the column
	 * @param index the column index
	 * @param column the column object
	 * @param new_width the new column's width
	*/
	"onColumnResize"(index: number, column: GridColumn, new_width: number): void;

	/**
	 * fires after the user finished dragging the column's border to resize the column
	 * @param index the column index
	 * @param column the column object
	 * @param new_width the new column's width
	*/
	"onColumnResizeEnd"(index: number, column: GridColumn, new_width: number): boolean;

	/**
	 * fires before the user starts to drag the column's border to resize the column
	 * @param index the column index
	 * @param column the column object
	*/
	"onColumnResizeStart"(index: number, column: GridColumn): boolean;

	/**
	 * fires when a user clicks the right mouse button inside the Gantt chart (see the details)
	 * @param taskId the task id
	 * @param linkId the link id
	 * @param e a native event object
	*/
	"onContextMenu"(taskId: string | number, linkId: string | number, e: Event): void;

	/**
	 * fires before the context menu opens, AFTER built-in resolution — inspect or
	 * mutate `context.items`, or return false to suppress the menu (the native
	 * browser menu is then left untouched)
	 * @param context the resolved context-menu context (zone, id, items, …)
	*/
	"onBeforeContextMenu"(context: IContextMenuEventContext): void | boolean;

	/**
	 * fires when a context-menu item is selected (custom items AND built-ins);
	 * for a built-in it fires BEFORE the built-in action — return false to cancel it
	 * @param id the selected item id
	 * @param item the selected item descriptor
	 * @param context the context-menu context
	*/
	"onContextMenuItemClick"(id: string | number, item: UIMenuItem, context: IContextMenuEventContext): void | boolean;

	/**
	 * fires when a toolbar item is activated (button click / menu leaf select);
	 * for a built-in item it fires BEFORE the built-in action — return false to cancel it
	 * @param id the item id (the selected leaf id for dropdown items)
	 * @param item the item descriptor
	 * @param e the originating event, if any
	*/
	"onToolbarItemClick"(id: string | number, item: UIToolbarItem, e?: Event | null): void | boolean;

	/**
	 * fires when a value-bearing toolbar item changes (toggle / combo / segmented / text / stepper / datepicker);
	 * for a built-in item it fires BEFORE the built-in action — return false to cancel it
	 * @param id the item id
	 * @param value the new value
	 * @param item the item descriptor
	*/
	"onToolbarItemChange"(id: string | number, value: any, item: UIToolbarItem): void | boolean;

	/**
	 * fires whenever the undo/redo stacks change (a recorded action, an undo, a
	 * redo, or a clear) — a single signal for UI that reflects undo availability
	 * @param undoLength the number of actions on the undo stack
	 * @param redoLength the number of actions on the redo stack
	*/
	"onAfterUndoStackChange"(undoLength: number, redoLength: number): void;

	/**
	 * fires on the `dp.init(gantt)` call
	 * @param DataProcessor the DataProcessor object
	*/
	"onDataProcessorReady"(DataProcessor: any): void;

	/**
	 * fires after data has been rendered on the page
	*/
	"onDataRender"(): void;

	/**
	 * called after gantt has been cleared by the api/gantt_destructor.md method
	*/
	"onDestroy"(): void;

	/**
	 * fires when the user clicks on an empty space in the Gantt chart (not on tasks)
	 * @param e a native event object
	*/
	"onEmptyClick"(e: Event): void;

	/**
	 * fires when api/gantt_assert.md receives 'false' value, i.e. when assertion fails
	 * @param errorMessage a string with an error from the api/gantt_assert.md method
	*/
	"onError"(errorMessage: string): boolean;

	/**
	 * fires when gantt is expanded to full screen
	*/
	"onExpand"(): void;

	/**
	 * fires after the Gantt layout is ready, but before it is rendered
	*/
	"onGanttLayoutReady"(): void;

	/**
	 * fires after the dhtmlxGantt initialization is complete but the Gantt chart is not rendered on the page yet
	*/
	"onGanttReady"(): void;

	/**
	 * fires after the Gantt chart was rendered on the page
	*/
	"onGanttRender"(): void;

	/**
	 * fires when the Gantt chart is scrolled to a particular point
	 * @param left the position of horizontal scroll
	 * @param top the position of vertical scroll
	*/
	"onGanttScroll"(left: number, top: number): void;

	/**
	 * fires when the user clicks on the grid's header
	 * @param name the name attribute of the column which header the user clicks on
	 * @param e a native event object
	*/
	"onGridHeaderClick"(name: string, e: Event): boolean;

	/**
	 * fires when the user is dragging the grid's border to resize the grid
	 * @param old_width the initial grid's width
	 * @param new_width the new grid's width
	*/
	"onGridResize"(old_width: number, new_width: number): void;

	/**
	 * fires after the user finished dragging the grid's border to resize the grid
	 * @param old_width the initial grid's width
	 * @param new_width the new grid's width
	*/
	"onGridResizeEnd"(old_width: number, new_width: number): boolean;

	/**
	 * fires before the user starts to drag the grid's border to resize the grid
	 * @param old_width the initial grid's width
	*/
	"onGridResizeStart"(old_width: number): boolean;

	/**
	 * fires after the user has opened the lightbox (edit form)
	 * @param task_id the id of the task opened in the lightbox
	*/
	"onLightbox"(task_id: string | number): void;

	/**
	 * fires when the user clicks on a custom button in the lightbox
	 * @param css the name of the CSS class applied to the button
	 * @param node an HTML element of the clicked button
	 * @param e a native 'click' event object
	*/
	"onLightboxButton"(css: string, node: HTMLElement, e: Event): void;

	/**
	 * fires when the user clicks on the 'Cancel' button in the lightbox
	 * @param id the task id ( the task opened in the lightbox)
	*/
	"onLightboxCancel"(id: string | number): void;

	/**
	 * fires when the structure of the lightbox is changed
	 * @param old_type the name of the initial lighbox's structure
	 * @param new_type the name of the new lighbox's structure
	*/
	"onLightboxChange"(old_type: string, new_type: string): void;

	/**
	 * fires when the advanced task form is open and filled for a task: after each open, and after each rebuild of the open form, for example after a type change
	 * @param taskId the id of the edited task
	 * @param api the form API, `gantt.ext.taskForm`
	*/
	"onTaskFormRender"(taskId: string | number, api: TaskFormExt): void;

	/**
	 * fires when the active tab of the advanced task form changes
	 * @param tabId the id of the new active tab
	 * @param prevTabId the id of the previous active tab
	*/
	"onTaskFormTabChange"(tabId: string, prevTabId: string): void;

	/**
	 * fires when the user clicks on the 'Delete' button in the lightbox
	 * @param id the task id (the task opened in the lightbox)
	*/
	"onLightboxDelete"(id: string | number): boolean;

	/**
	 * fires when the user clicks on the 'Save' button in the lightbox
	 * @param id the id of unmodified task. Note, at this stage the lightbox values aren't applied to the task object yet and you can access the initial task using gantt.getTask(id)
	 * @param task the modified task object
	 * @param is_new specifies whether the user opens the lightbox to create a new task (<i>true</i>)<br> or update an existing one (<i>false</i>)
	*/
	"onLightboxSave"(id: string | number, task: Task, is_new: boolean): boolean;

	/**
	 * fires when the user clicks on a link
	 * @param id the id of the clicked link
	 * @param e optional, a native event object
	*/
	"onLinkClick"(id: string | number, e?: Event): void;

	/**
	 * fires when a user creates a new link between tasks
	 * @param link the object of a new link
	*/
	"onLinkCreated"(link: Link): boolean;

	/**
	 * fires when the user starts dragging a new link from a task
	 * @param sourceId the id of the task the link is dragged from
	 * @param fromStart true if the link is dragged from the task's start point
	*/
	"onLinkDragStart"(sourceId: Id, fromStart: boolean): void;

	/**
	 * fires on each mouse move while a new link is being dragged;
	 * the state matches gantt.getState("linksDnD")
	 * @param state the link drag state
	*/
	"onLinkDragMove"(state: LinkDragState): void;

	/**
	 * fires when dragging of a new link ends, whether or not a link is created
	 * @param state the link drag state at the moment of the drop
	*/
	"onLinkDragEnd"(state: LinkDragState): void;

	/**
	 * fires when the user double clicks on a link
	 * @param id the id of the clicked link
	 * @param e optional, a native event object
	*/
	"onLinkDblClick"(id: string | number, e?: Event): boolean;

	/**
	 * fires when the id of a link is changed
	 * @param id the current link id
	 * @param new_id the new link id
	*/
	"onLinkIdChange"(id: string | number, new_id: string | number): void;

	/**
	 * fires when the user adds a new link and dhtmlxGantt checks whether the link is valid
	 * @param link the link object
	*/
	"onLinkValidation"(link: Link): boolean;

	/**
	 * fires after loading data from the data source has been completed
	 * @param url the server-side url (may be a static file or a server side script that outputs data)
	 * @param type ('json', 'xml', 'oldxml') the data type
	*/
	"onLoadEnd"(url: string, type: string): void;

	/**
	 * fires immediately before loading data from the data source has been started
	 * @param url the server-side url (may be a static file or a server side script that outputs data)
	 * @param type ('json', 'xml', 'oldxml') the data type
	*/
	"onLoadStart"(url: string, type: string): void;

	/**
	 * fires when the mouse is moved over the gantt container
	 * @param id the id of the task that the mouse is moved over
	 * @param e a native event object
	*/
	"onMouseMove"(id: string | number, e: Event): void;

	/**
	 * fires after selection of a task or a range of tasks has been completed
	 * @param e a native event object
	*/
	"onMultiSelect"(e: Event): void;

	/**
	 * fires after a collection of options has been loaded from the server, but isn't parsed yet
	*/
	"onOptionsLoad"(): void;

	/**
	 * fires after data was parsed (became available for API) but before it was rendered in the Gantt chart
	*/
	"onParse"(): void;

	/**
	 * fires when the pop-up edit form appears
	 * @param taskId the task id
	*/
	"onQuickInfo"(taskId: string | number): void;

	/**
	 * fires after the user drops a vertically reordered row in the grid
	 * @param id the id of the task that the user has dragged vertically in the grid
	 * @param target the id of the task which place the dragged row has occupied
	*/
	"onRowDragEnd"(id: string | number, target: string | number): void;

	/**
	 * fires before the user drags a row of the grid to vertically reorder it
	 * @param id the id of the task that the user drags in the grid
	 * @param target an HTML element of the task that the user drags
	 * @param e a native event object
	*/
	"onRowDragStart"(id: string | number, target: HTMLElement, e: Event): boolean;

	/**
	 * fires when the user is dragging the border of the row to resize the row height
	 * @param id the task id
	 * @param task the task object
	 * @param currentHeight the current height of the row
	*/
	"onRowResize"(id: string | number, task: Task, currentHeight: number): void;

	/**
	 * fires when the scale is re-rendered in order to display all tasks completely
	*/
	"onScaleAdjusted"(): void;

	/**
	 * fires when the user clicks on the cell in the time scale
	 * @param e a native event object
	 * @param date the date of the clicked cell
	*/
	"onScaleClick"(e: Event, date: Date): void;

	/**
	 * fires when the user clicks on a task row in the grid area (including the 'expand/collapse' and 'add task' buttons) or on a task bar in the timeline area
	 * @param id the id of the clicked task
	 * @param e optional, a native event object
	*/
	"onTaskClick"(id: string | number, e?: Event): boolean;

	/**
	 * fires when a branch has been closed
	 * @param id the branch id
	*/
	"onTaskClosed"(id: string | number): void;

	/**
	 * fires when a user creates a new task by pressing the'+' button in a grid, or when the api/gantt_createtask.md method is called
	 * @param task the object of a new task
	*/
	"onTaskCreated"(task: Task): boolean;

	/**
	 * fires when the user double clicks on a task
	 * @param id the id of the double clicked task
	 * @param e a native event object
	*/
	"onTaskDblClick"(id: string | number, e?: Event): boolean;

	/**
	 * fires when the user drags a task
	 * @param id the task id
	 * @param mode the drag mode ("resize", "progress", "move", "ignore")
	 * @param task the current (dragged) task object
	 * @param original the original(initial) task object
	 * @param e a native event object
	*/
	"onTaskDrag"(id: string | number, mode: string, task: Task, original: Task, e: Event): void;

	/**
	 * fires after a rejected task drop restores the task, before repaint
	 * Fires once per cancelled task. The return value does not affect cancellation.
	 * @param id the task id
	 * @param mode the drag-and-drop mode ("resize", "progress", "move")
	 * @param e the native mouseup event
	*/
	"onTaskDragCancel"(id: string | number, mode: string, e: Event): void;

	/**
	 * fires when the id of a task is changed
	 * @param id the current task's id
	 * @param new_id the new task's id
	*/
	"onTaskIdChange"(id: string | number, new_id: string | number): void;

	/**
	 * fires when a task is being loaded from the data source
	 * @param task the object of a task
	*/
	"onTaskLoading"(task: Task): boolean;

	/**
	 * fires after the task selection state has changed (the task has been selected/unselected)
	 * @param id the id of a task
	 * @param state true if the task has been selected, false - if unselected
	 * @param e a native event object
	*/
	"onTaskMultiSelect"(id: string | number, state: boolean, e: Event): void;

	/**
	 * fires when a branch has been opened
	 * @param id the branch id
	*/
	"onTaskOpened"(id: string | number): void;

	/**
	 * fires when the user clicks on a row in the table
	 * @param id the task id
	 * @param row an HTML element of the clicked row
	*/
	"onTaskRowClick"(id: string | number, row: HTMLElement): void;

	/**
	 * fires when the user selects a task
	 * @param id the task id
	*/
	"onTaskSelected"(id: string | number): void;

	/**
	 * fires when the user unselects a task by selecting some other task
	 * @param id the task id (of the unselected task)
	*/
	"onTaskUnselected"(id: string | number): void;

	/**
	 * fires when the dhtmlxGantt templates are initialized
	*/
	"onTemplatesReady"(): void;
}


export interface GanttTemplates {

	/**
	 * specifies the text displayed inside the baseline element
	 * @param task the task object associated with the baseline
	 * @param baseline the baseline object
	 * @param index the index of the baseline in the task's baselines array
	*/
	baseline_text(task: Task, baseline: Baseline, index: number): string | number | void;

	/**
	 * specifies the text of the leveling delay area (`config.leveling_delays`): its label and tooltip.
	 * The default returns the delay with a short unit name, e.g. `+2d`
	 * @param task the task object
	 * @param delay the task's `leveling_delay`
	 * @param unit the unit of the delay, `config.duration_unit`
	*/
	leveling_delay_text(task: Task, delay: number, unit: TimeUnit): string | number | void;

	/**
	 * specifies the content of columns that show dates (return `Date` values) in grid
	 * @param date the date which needs formatting
	 * @param task the task object
	 * @param column the name of the column that called the template
	*/
	date_grid(date: Date, task: Task, column: string): string;

	/**
	 * specifies the text of tooltips that are displayed when the user creates a new dependency link
	 * @param from the id of the source task
	 * @param from_start <i>true</i>, if the link is being dragged from the start of the  source task, <i>false</i> - if <br> from the end of the task
	 * @param to the id of the target task( 'null' or 'undefined', if the target task isn't specified yet)
	 * @param to_start <i>true</i>, if the link is being dragged to the start of the target task, <i>false</i> - if <br> to the end of the task
	*/
	drag_link(from: string | number, from_start: boolean, to: string | number, to_start: boolean): string;

	/**
	 * specifies the CSS class that will be applied to the pop-up that appears when a user drags a link
	 * @param from the id of the source task
	 * @param from_start <i>true</i>, if the link is being dragged from the start of the  source task, <i>false</i> - if <br> from the end of the task
	 * @param to the id of the target task( 'null' or 'undefined', if the target task isn't specified yet)
	 * @param to_start <i>true</i>, if the link is being dragged to the start of the target task, <i>false</i> - if <br> to the end of the task
	*/
	drag_link_class(from: string | number, from_start: boolean, to: string | number, to_start: boolean): string | void;

	/**
	 * converts a date object to a date string. Used to send data back to the server
	 * @param date the date which needs formatting
	*/
	format_date(date: Date): string;

	/**
	 * specifies the custom content inserted before the labels of child items in the tree column
	 * @param task the task object
	*/
	grid_blank(task: Task): string;

	/**
	 * specifies the format of dates for the columns that show dates (return the `Date` values)
	 * @param date the date which needs formatting
	 * @param column the name of the column that called the template
	*/
	grid_date_format(date: Date, column?: string): string;

	/**
	 * specifies the icon of child items in the tree column
	 * @param task the task object
	*/
	grid_file(task: Task): string;

	/**
	 * specifies the icon of parent items in the tree column
	 * @param task the task object
	*/
	grid_folder(task: Task): string;

	/**
	 * specifies the CSS class that will be applied to the headers of the table's columns
	 * @param columnName the column's name (as specified in the "name" property of the column object)
	 * @param column column object (as specified in the <i>gantt.config.columns</i> config)
	*/
	grid_header_class(columnName: string, column: any): string | void;

	/**
	 * specifies the indent  of the child items in a branch (in the tree column)
	 * @param task the task object
	*/
	grid_indent(task: Task): string;

	/**
	 * specifies the icon of the open/close sign in the tree column
	 * @param task the task object
	*/
	grid_open(task: Task): string;

	/**
	 * specifies the CSS class that will be applied to a grid row
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	grid_row_class(start: Date, end: Date, task: Task): string | void;

	/**
	 * defines the height of the filled area in the resourceHistogram
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_allocated(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): number | void;

	/**
	 * specifies the height of the line that defines the available capacity of the resource
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_capacity(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): number | void;

	/**
	 * defines the CSS class which is applied to a cell of the resource panel
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_class(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string | void;

	/**
	 * defines the label inside a cell
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_label(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string | number | void;

	/**
	 * specifies the CSS class that will be applied to a link
	 * @param link the link object
	*/
	link_class(link: Link): string | void;

	/**
	 * specifies the text in the header of the link's "delete" confirm window
	 * @param link the link object
	*/
	link_description(link: any): string;

	/**
	 * converts date string into a Date object
	 * @param date the string which need to be parsed
	*/
	parse_date(date: string): Date;

	/**
	 * specifies the text in the completed part of the task bar
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	progress_text(start: Date, end: Date, task: Task): string | number | void;

	/**
	 * specifies the CSS class that will be applied to  the pop-up edit form
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	quick_info_class(start: Date, end: Date, task: Task): string | void;

	/**
	 * specifies the content of the pop-up edit form
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	quick_info_content(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the date of the pop-up edit form
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when  a task is scheduled to be completed
	 * @param task the task object
	*/
	quick_info_date(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the title of the pop-up edit form
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	quick_info_title(start: Date, end: Date, task: Task): string | number | void;

	/**
	 * defines the CSS class names of cells in the resource timeline cells
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	resource_cell_class(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string | void;

	/**
	 * defines the HTML content of resource timeline cells
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	resource_cell_value(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string | number | void;

	/**
	 * specifies the CSS class that will be applied to cells of the time scale of the timeline area
	 * @param date the date of a cell
	*/
	scale_cell_class(date: Date): string | void;

	/**
	 * specifies the CSS class that will be applied to the time scale
	 * @param scale the scale's configuration object
	*/
	scale_row_class(scale: Scale): string | void;

	/**
	 * specifies the CSS class that will be applied to task bars
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_class(start: Date, end: Date, task: Task): string | void;

	/**
	 * specifies the date format of the label in the 'Time period' section of the lightbox
	 * @param date the date which needs formatting
	*/
	task_date(date: Date): string;

	/**
	 * specifies the format for the end dates of tasks in the lightbox
	 * @param date the date which needs formatting
	*/
	task_end_date(date: Date): string;

	/**
	 * specifies the CSS class that will be applied to the row of the timeline area
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_row_class(start: Date, end: Date, task: Task): string | void;

	/**
	 * specifies the text in the task bars and the header of the lightbox
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_text(start: Date, end: Date, task: Task): string | number | void;

	/**
	 * renders the task's total work (effort) in the grid
	 * @param task the task object
	*/
	task_work(task: Task): string | number | void;

	/**
	 * specifies the date period in the header of the lightbox
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_time(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the dates of unscheduled tasks
	 * @param task the task object
	*/
	task_unscheduled_time(task: Task): string | void;

	/**
	 * specifies the format of the drop-down time selector in the lightbox
	 * @param date the date which needs formatting
	*/
	time_picker(date: Date): string;

	/**
	 * specifies the CSS class that will be applied to the cells of the timeline area
	 * @param item either the task's or resource's object assigned to the row
	 * @param date the date of a cell
	*/
	timeline_cell_class(item: any, date: Date): string | void;

	/**
	 * specifies custom HTML content in the timeline cells
	 * @param task the task's object
	 * @param date the date of a cell
	*/
	timeline_cell_content(task: Task, date: Date): string | number | void;

	/**
	 * specifies the format of start and end dates displayed in the tooltip
	 * @param date the date which needs formatting
	*/
	tooltip_date_format(date: Date): string;

	/**
	 * specifies the text of tooltips
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	tooltip_text(start: Date, end: Date, task: Task): string | void;

	/**
	 * specifies the text assigned to tasks bars on the right side
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	rightside_text(start: Date, end: Date, task: Task): string | number | void;

	/**
	 * specifies the text assigned to tasks bars on the left side
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	leftside_text(start: Date, end: Date, task: Task): string | number | void;

	/**
	 * specifies the lightbox's header
	 * @param start_date the date when a task is scheduled to begin
	 * @param end_date the date when a task is scheduled to be completed
	 * @param task the task's object
	*/
	lightbox_header(start_date: Date, end_date: Date, task: Task): string;

	/**
	 * specifies the CSS class that will be applied to markers
	 * @param marker the marker's configuration object
	*/
	marker_class(marker: MarkerItem): string | void;

	[customTemplate: string]: any;
}

export interface GanttConfigOptions {

	/**
	 * accessibility settings
	 * @param aria - (boolean) master switch for emitting ARIA attributes; an explicitly set legacy `wai_aria_attributes` takes precedence
	 * @param announcements - (boolean) build the live region and allow gantt.ext.accessibility.announce() to push screen-reader announcements
	 * @param grid_semantics - (boolean) emit verbose grid position attributes (reserved for future use)
	 * @param colorblind_friendly - (boolean) add non-colour cues (progress boundary, project/overload hatch, critical outline) so meaning is not carried by colour alone (WCAG 1.4.1);
	 * @param increase_contrast - (boolean) raise the default (terrace) light skin to WCAG 1.4.3 AA contrast via CSS-variable overrides;
	*/
	accessibility: {
		aria: boolean,
		announcements: boolean,
		grid_semantics: boolean,
		colorblind_friendly?: boolean,
		increase_contrast?: boolean
	};

	/**
	 * enables auto scheduling
	*/
	auto_scheduling?: boolean | {} | AutoSchedulingConfig;

	/**
	 * configuration of the `wbs` extension: stored WBS codes,
	 * field mapping, update policy, generation flags and the code mask
	*/
	wbs?: WBSConfig;

	/**
	 * enables effort-driven tasks feature
	*/
	effort: EffortConfig;

	/* Deprecated auto-scheduling configuration */
	// /**
	//  * disables usage of time contraints for tasks
	// */
	// auto_scheduling_compatibility: boolean;

	// /**
	//  * allows or forbids creating links from parent tasks (projects) to their children
	// */
	// auto_scheduling_descendant_links: boolean;

	// /**
	//  * defines whether gantt will do autoscheduling on data loading/parsing
	// */
	// auto_scheduling_initial: boolean;

	// /**
	//  * defines whether the whole project will be moved (see the details below)
	// */
	// auto_scheduling_move_projects: boolean;

	// /**
	//  * defines whether tasks should inherit the constraint type from their parent project
	// */
	// auto_scheduling_project_constraint: boolean;

	// /**
	//  * enables the auto scheduling mode, in which tasks will always be rescheduled to the earliest possible date
	// */
	// auto_scheduling_strict: boolean;

	// /**
	//  * sets the way the scheduling algorithms process completed tasks
	// */
	// auto_scheduling_use_progress: boolean;

	/**
	 * automatically converts tasks with subtasks to projects and projects without subtasks back to tasks
	*/
	auto_types: boolean;

	/**
	 * enables automatic adjusting of the grid's columns to the grid's width
	*/
	autofit: boolean;

	/**
	 * enables autoscrolling while dragging a task or link out of the current browser screen
	*/
	autoscroll: boolean;

	/**
	 * defines the speed of autoscrolling (in ms) while dragging a task or link out of the current browser screen
	*/
	autoscroll_speed: number;

	/**
	 * forces the Gantt chart to automatically change its size to show all tasks without scrolling
	*/
	autosize: boolean | string;

	/**
	 * sets the minimum width (in pixels) that the Gantt chart can take in the horizontal 'autosize' mode
	*/
	autosize_min_width: number;

	/**
	 * sets the height of task bars in the timeline area
	*/
	bar_height: number | string;

	/**
	 * adjusts the padding around task bars in the timeline when `bar_height` is set to "full"
	*/
	bar_height_padding: number;

	/**
	 * configures the functionality of baselines in the Gantt chart
	*/
	baselines: BaselineConfig | boolean;

	/**
	 * enables dynamic loading in the Gantt chart
	*/
	branch_loading: boolean;

	/**
	 * specifies that the task has children that are not yet loaded from the backend
	*/
	branch_loading_property: string;

	/**
	 * stores a collection of buttons resided in the left bottom corner of the lightbox
	*/
	buttons_left: string[];

	/**
	 * stores a collection of buttons resided in the right bottom corner of the lightbox
	*/
	buttons_right: string[];

	/**
	 * changes the name of the property that affects binding of a calendar to a task/group of tasks
	*/
	calendar_property: string;

	/**
	 * enables cascade deleting of nested tasks and links
	*/
	cascade_delete: boolean;

	/**
	 * enables advanced drag-n-drop
	*/
	click_drag: undefined | ClickDrag;

	/**
	 * configures the columns of the table
	*/
	columns: GridColumn[];

	/**
	 * contains all available constraint types
	 * @param As Soon As Possible
	 * @param As Late As Possible
	 * @param Start No Earlier Than
	 * @param Start No Later Than
	 * @param Finish No Earlier Than
	 * @param Finish No Later Than
	 * @param Must Start On
	 * @param Must Finish On
	*/
	constraint_types?: {
		ASAP?: string,
		ALAP?: string,
		SNET?: string,
		SNLT?: string,
		FNET?: string,
		FNLT?: string,
		MSO?: string,
		MFO?: string
	}

	/**
	 * defines whether the gantt should track resizing of the container at time intervals
	*/
	container_resize_method: string | undefined;

	/**
	 * specifies the delay (in milliseconds) before redrawing the gantt when resizing the container
	*/
	container_resize_timeout: number;

	/**
	 * enables adjusting the task's start and end dates to the work time (while dragging)
	*/
	correct_work_time: boolean;

	/**
	 * @deprecated for date formatting. Date parsing and formatting are always CSP-safe and no longer
	 * select an implementation based on this option. The value is still read as a secure-environment hint by the lightbox.
	*/
	csp: boolean | string;

	/**
	 * sets the date format that is used to parse data from a data set and to send dates back to the server
	*/
	date_format: string;

	/**
	 * sets the format of dates in the "Start time" column of the table
	*/
	date_grid: string;

	/**
	 * enables or disables the display of deadline elements for tasks
	*/
	deadlines: boolean;

	/**
	 * shows the resource leveling delay (`task.leveling_delay`) as a hatched area next to the task bar: before it,
	 * or after it with `schedule_from_end`. The text comes from `templates.leveling_delay_text`. Off by default;
	 * read when the timeline is created. PRO only
	*/
	leveling_delays: boolean;

	/**
	 * defines whether gantt will perform a deep copy of data objects passed into the gantt.parse() method
	*/
	deepcopy_on_parse: boolean;

	/**
	 * 'says' to open the lightbox while creating new events by clicking the '+' button
	*/
	details_on_create: boolean;

	/**
	 * 'says' to open the lightbox after double clicking on a task
	*/
	details_on_dblclick: boolean;

	/**
	 * enables the possibility to drag the lightbox by the header
	*/
	drag_lightbox: boolean;

	/**
	 * enables creating dependency links by drag-and-drop
	*/
	drag_links: boolean;

	/**
	 * stores the types of available drag-and-drop modes
	 * @param the mode when the user drags a task bar to change its duration.
	 * @param the mode when the user drags the progress knob of a task bar.
	 * @param the mode when the user drags a task bar to replace it.
	 * @param the service mode which restricts the drag-and-drop action.
	*/
	drag_mode: {
		resize?: string,
		progress?: string,
		move?: string,
		ignore?: string
	}

	/**
	 * enables the possibility to move tasks by drag-and-drop
	*/
	drag_move: boolean;

	/**
	 * enables the possibility to drag several selected tasks at once
	*/
	drag_multiple: boolean;

	/**
	 * enables the possibility to change the task progress by dragging the progress knob
	*/
	drag_progress: boolean;

	/**
	 * enables drag and drop of items of the project type
	*/
	drag_project: boolean;

	/**
	 * enables the possibility to resize tasks by drag-and-drop
	*/
	drag_resize: boolean;

	/**
	 * configures the behavior of the drag_timeline extension
	 * @param CSS selector. Scrolling the timeline won't be activated for the elements that match the selector
	 * @param if the property is specified, scrolling the timeline will be activated only when the specified modifier key is pressed. The supported values are: "ctrlKey", "shiftKey", "metaKey", "altKey"
	 * @param if the property is enabled, scrolling the timeline will be rerendered when the scroll is started and when it is ended
	*/
	drag_timeline: null | {
		ignore?: string,
		useKey?: string | boolean,
		render?: boolean
	}

	/**
	 * sets the number of 'gantt.config.duration_unit' units that will correspond to one  unit of the 'duration' data property.
	*/
	duration_step: number;

	/**
	 * sets the duration unit
	*/
	duration_unit: string;

	/**
	 * enables automatic merging of multiple resource calendars into one
	*/
	dynamic_resource_calendars: boolean;

	/**
	 * changes the name of a property that affects the editing ability  of tasks/links in the read-only Gantt chart
	*/
	editable_property: string;

	/**
	 * an object that contains definitions of inline editors
	 * @param for editing text columns, e.g. task name
	 * @param for editing number columns, e.g. task duration, order, etc.
	 * @param for editing duration columns, i.e. task duration.
	 * @param for editing date columns, e.g. start and end dates of the task
	 * @param for choosing an option from a list
	 * @param for setting task-predecessor for the currently edited task. This editor gets the [WBS codes of tasks](desktop/specifying_columns.md#wbscode) to set connection with the predecessor task
	 * @param for setting task-successor for the currently edited task, the mirror of the predecessor editor over outgoing links
	 * @param custom inline editors
	*/
	editor_types: {
		text?: InlineEditor,
		number?: InlineEditor,
		duration?: InlineEditor,
		date?: InlineEditor,
		select?: InlineEditor,
		predecessor?: InlineEditor,
		successor?: InlineEditor,
		combo?: InlineEditor,
		datepicker?: InlineEditor,
		stepper?: InlineEditor,
		[customEditorName: string]: InlineEditor | undefined
	}

	/**
	 * sets the end value of the time scale
	*/
	end_date: Date | undefined;

	/**
	 * renders an external component into the DOM
	 * @param an object that is returned by the **onrender* function.
	 * @param an object that is returned by the **onrender* function.
	 * @param a DOM element the native component will be attached to.
	*/
	external_render?: {
		isElement(element: any): boolean,
		renderElement(element: any, container: HTMLElement): void
	}

	/**
	 * 'says' the Gantt chart to automatically extend the time scale in order to fit all displayed tasks
	*/
	fit_tasks: boolean;

	/**
	 * adjusts the width of columns inside a scrollable grid
	*/
	grid_elastic_columns: boolean | string;

	/**
	 * sets the name of the attribute  of the column resizer's  DOM element. The attribute presents the column's index
	*/
	grid_resizer_column_attribute: string;

	/**
	 * sets the width of the grid
	*/
	grid_width?: number;

	/**
	 * shows the critical path in the chart
	*/
	highlight_critical_path?: boolean;

	/**
	 * enables/disables horizontal scroll by the Shift|Alt|Meta key + mouse wheel movement
	*/
	horizontal_scroll_key: string | boolean;

	/**
	 * defines whether tasks should inherit work calendars from their summary parents
	*/
	inherit_calendar: boolean;

	/**
	 * specifies whether sub-scales shall use the scale_cell_class template by default
	*/
	inherit_scale_class: boolean;

	/**
	 * sets whether the timeline area will be initially scrolled to display the earliest task
	*/
	initial_scroll: boolean;

	/**
	 * keeps the duration of a task unchanged during editing of the start/end of a task
	*/
	inline_editors_date_processing: string | undefined;

	/**
	 * defines whether inline editor should be opened after one click on a task when multi-task selection is enabled
	*/
	inline_editors_multiselect_open: boolean | undefined;

	/**
	 * 'says' to preserve the initial grid's width while resizing columns within
	*/
	keep_grid_width: boolean;

	/**
	 * enables keyboard navigation in gantt
	*/
	keyboard_navigation?: boolean;

	/**
	 * enables keyboard navigation by cells
	*/
	keyboard_navigation_cells?: boolean;

	/**
	 * sets the name of the attribute of the task layer's DOM element
	*/
	layer_attribute: string;

	/**
	 * specifies the layout object
	*/
	layout: any;

	/**
	 * declarative toolbar (ext/toolbar plugin). `true`/unset renders the default
	 * preset; an array is shorthand for `{ items: [...] }`; `false` suppresses.
	 * See docs: toolbar & context-menu composition surface.
	*/
	toolbar?: boolean | UIToolbarItemDef[] | UIToolbarConfig;

	/**
	 * declarative context menu (ext/context_menu plugin). `true`/unset gives the
	 * default per-zone menus; `false` disables; a per-zone key REPLACES that
	 * zone's default (or `false` turns the zone off).
	*/
	context_menu?: boolean | IContextMenuConfig;

	/**
	 * specifies the lightbox object
	*/
	lightbox: LightboxSections;

	/**
	 * deprecated
	 * increases the height of the lightbox
	*/
	// lightbox_additional_height: number;

	/**
	 * sets the size of the link arrow
	*/
	link_arrow_size: number;

	/**
	 * sets the name of the attribute that will specify the id of the link's HTML element
	*/
	link_attribute: string;

	/**
	 * sets the width of dependency links in the timeline area
	*/
	link_line_width?: number;

	/**
	 * sets the radius for rounding corners of link lines in the timeline
	*/
	link_radius?: number;

	/**
	 * sets the width of the area (over the link) sensitive to clicks
	*/
	link_wrapper_width: number;

	/**
	 * stores the types of links dependencies
	 * @param the target task can't start before the source task ends (but it may start later).
	 * @param the target task can't start until the source task starts (but it may start later).
	 * @param the target task can't end before the source task ends (but it may end later).
	 * @param the target task can't end before the source task starts (but it may end later).
	*/
	links: {
		finish_to_start?: string | number,
		start_to_start?: string | number,
		finish_to_finish?: string | number,
		start_to_finish?: string | number
	}

	/**
	 * sets the minimum width for a column in the timeline area
	*/
	min_column_width: number;

	/**
	 * sets the minimum duration (in milliseconds) that can be set for a task during resizing.
	*/
	min_duration: number;

	/**
	 * sets the minimal width for each grid column (in pixels) while resizing grid
	*/
	min_grid_column_width: number;

	/**
	 * sets the minimal row height that can be set for a task during resizing
	*/
	min_task_grid_row_height: number;

	/**
	 * enables/disables multi-task selection in the Gantt chart
	*/
	multiselect?: boolean;

	/**
	 * specifies whether multi-task selection will be available within one or any level
	*/
	multiselect_one_level?: boolean;

	/**
	 * enables the possibility to expand/collapse split tasks by clicking the +/- button
	*/
	open_split_tasks?: boolean;

	/**
	 * openes all branches initially
	*/
	open_tree_initially: boolean;

	/**
	 * activates the 'branch' mode that allows vertically reordering tasks within the same tree level
	*/
	order_branch: string | boolean;

	/**
	 * activates the 'branch' mode that allows reordering tasks within the whole gantt
	*/
	order_branch_free: boolean;

	/**
	 * adds an empty row into the end of the list of tasks to simplify tasks editing via keyboard
	*/
	placeholder_task: any;

	/**
	 * preserves the current position of the vertical and horizontal scrolls while re-drawing the gantt chart
	*/
	preserve_scroll: boolean;

	/**
	 * enables/disables parsing of the resource assignments
	*/
	process_resource_assignments: boolean;

	/**
	 * specifies the end date of a project
	*/
	project_end: Date | undefined;

	/**
	 * specifies the start date of a project
	*/
	project_start: Date | undefined;

	/**
	 * defines whether the task form will appear from the left/right side of the screen or near the selected task
	*/
	quick_info_detached?: boolean;

	/**
	 * stores a collection of buttons resided in the pop-up task's details form
	*/
	quickinfo_buttons?: any[];

	/**
	 * activates the read-only mode for the Gantt chart
	*/
	readonly: boolean;

	/**
	 * changes the name of a property that affects the read-only behaviour of tasks/links
	*/
	readonly_property: string;

	/**
	 * enables the Redo functionality for the gantt
	*/
	redo?: boolean;

	/**
	 * enables the possibility to reorder grid columns by drag and drop
	*/
	reorder_grid_columns?: boolean;

	/**
	 * enables the ability to adjust the row height by drag-and-drop
	*/
	resize_rows: boolean;

	/**
	 * specifies the name of the dataStore which stores resource assignments
	*/
	resource_assignment_store: string;

	/**
	 * changes the name of the attribute that Gantt uses to find which resource the task row in the resource grid/timeline is referring to
	*/
	resource_attribute?: string;

	/**
	 * defines a set of working calendars that can be assigned to a specific resource, e.g. a user
	 * @param mapping of the resource calendar
	*/
	resource_calendars: {
		[resourceId: string | number]: string | number | { [resourceId: string | number]: string | number | undefined } | undefined
	}

	/**
	 * defines the property of a task object that stores a resource id associated with resourceGrid/Timeline/Histogram/Calendar
	*/
	resource_property: string;

	/**
	 * tells the resource timeline to render elements and call templates for non-allocated cells
	*/
	resource_render_empty_cells: boolean;

	/**
	 * specifies the name of the dataStore connected to the resourceGrid/resourceTimeline/resourceHistogram views
	*/
	resource_store: string;

	/**
	 * defines an extra configuration for the resource store
	 * @param defines whether modified resource assignments can be sent to the DataProcessor as separate entries with persistent IDs
	 * @param defines whether modified resource objects can be sent to the DataProcessor as separate entries with persistent IDs
	 * @param defines whether resource assignments will be editable in the resource diagram
	 * @param creates the default resource datastore. The object includes the following properties:
	 * @param optional, accepts only one fixed value **"treeDatastore"**. If the type:"treeDatastore" is specified, the datastore will support hierarchical data, with the **id** property as a primary key, and **parent** as a link to the parent id. Any other value will produce a flat list datastore.
	 * @param optional, preprocesses items loaded into the datastore. It is a good place to set the default values of the datastore items. The function takes the following parameter:
	 * @param the resource item
	 * @param optional, enables showing all tasks assigned to a certain resource in the resource view panel. This functionality works both for the resource diagram and resource histogram types of layout.
	 * @param an array with resources
	*/
	resources: boolean | {
		dataprocessor_assignments?: boolean,
		dataprocessor_resources?: boolean,
		editable_resource_diagram?: boolean,
		resource_store?: {
			type?: string,
			initItem?: ((
				item: any,
			) => any),
			fetchTasks?: boolean
		},
		lightbox_resources?(resourceArray: any): any
	}

	/**
	 * sets the id of the virtual root element
	*/
	root_id: string | number;

	/**
	 * enables rounding the task's start and end dates to the nearest scale marks
	*/
	round_dnd_dates: boolean;

	/**
	 * sets the default height for rows of the table
	*/
	row_height: number;

	/**
	 * switches gantt to the right-to-left mode
	*/
	rtl: boolean;

	/**
	 * sets the height of the time scale and the header of the grid
	*/
	scale_height?: number;

	/**
	 * sets the minimal scale unit (in case multiple scales are used) as the interval of the leading/closing empty space
	*/
	scale_offset_minimal: boolean;

	/**
	 * defines configuration settings of the time scale
	*/
	scales: Scales;

	/**
	 * enables backward scheduling
	*/
	schedule_from_end?: boolean;

	/**
	 * specifies whether the timeline area shall be scrolled while selecting to display the selected task
	*/
	scroll_on_click: boolean;

	/**
	 * set the sizes of the vertical (width) and horizontal (height) scrolls
	*/
	scroll_size: number;

	/**
	 * enables selection of tasks in the Gantt chart
	*/
	select_task: boolean;

	/**
	 * enables converting server-side dates from UTC to a local time zone (and backward) while sending data to the server
	*/
	server_utc: boolean;

	/**
	 * shows the chart (timeline) area of the Gantt chart
	*/
	show_chart: boolean;

	/**
	 * defines whether to display the placeholder element inside the grid when it is empty
	*/
	show_empty_state: boolean;

	/**
	 * enables showing error alerts in case of unexpected behavior
	*/
	show_errors: boolean;

	/**
	 * shows the grid area of the Gantt chart
	*/
	show_grid: boolean;

	/**
	 * enables/disables displaying links in the Gantt chart
	*/
	show_links: boolean;

	/**
	 * shows/hides markers on the page
	*/
	show_markers?: boolean;

	/**
	 * enables displaying of the progress inside the task bars
	*/
	show_progress: boolean;

	/**
	 * activates/disables the 'quick_info' extension (pop-up task's details form)
	*/
	show_quick_info?: boolean;

	/**
	 * enables/disables displaying column borders in the chart area
	*/
	show_task_cells: boolean;

	/**
	 * enables showing tasks that are outside the specified date range in the Gantt chart
	*/
	show_tasks_outside_timescale: boolean;

	/**
	 * enables showing unscheduled tasks
	*/
	show_unscheduled: boolean;

	/**
	 * hides non-working time from the time scale
	*/
	skip_off_time: boolean;

	/**
	 * enables the smart rendering mode for gantt's tasks and links rendering
	*/
	smart_rendering: boolean;

	/**
	 * specifies that only visible part of the time scale is rendered on the screen
	*/
	smart_scales: boolean;

	/**
	 * enables sorting in the table
	*/
	sort: boolean;

	/**
	 * sets the start value of the time scale
	*/
	start_date: Date | undefined;

	/**
	 * sets the starting day of the week
	*/
	start_on_monday: boolean;

	/**
	 * generates a background image for the timeline area instead of rendering actual columns' and rows' lines
	*/
	static_background: boolean;

	/**
	 * enables rendering of highlighted cells in the static_background mode
	*/
	static_background_cells: boolean;

	/**
	 * sets the name of the attribute that will specify the id of the task's HTML element
	*/
	task_attribute: string;

	/**
	 * sets the format of the date label in the 'Time period' section of the lightbox
	*/
	task_date: string;

	/**
	 * sets the name of the attribute of the resizer's DOM element of the grid row. The attribute presents the row's index
	*/
	task_grid_row_resizer_attribute: string;

	/**
	 * sets the offset (in pixels) of the nearest task from the left border in the timeline
	*/
	task_scroll_offset: number;

	/**
	 * sets the format of the time drop-down selector in the lightbox
	*/
	time_picker: string;

	/**
	 * sets the minimum step (in minutes) for the task's time values
	*/
	time_step: number;

	/**
	 * shows the background grid in the empty timeline
	*/
	timeline_placeholder: boolean;

	/**
	 * sets the length of time, in milliseconds, before the tooltip hides
	*/
	tooltip_hide_timeout?: number;

	/**
	 * sets the right (if positive) offset of the tooltip's position
	*/
	tooltip_offset_x?: number;

	/**
	 * sets the top (if positive) offset of the tooltip's position
	*/
	tooltip_offset_y?: number;

	/**
	 * sets the timeout in milliseconds before the tooltip is displayed for a task
	*/
	tooltip_timeout?: number;

	/**
	 * enables/disables the touch support for the Gantt chart
	*/
	touch: boolean | string;

	/**
	 * defines the time period in milliseconds that is used to differ the long touch gesture from the scroll gesture
	*/
	touch_drag: number | boolean;

	/**
	 * returns vibration feedback before/after drag and drop on touch devices
	*/
	touch_feedback: boolean;

	/**
	 * defines the duration of vibration feedback before/after drag and drop on touch devices (in milliseconds)
	*/
	touch_feedback_duration: number;

	/**
	 * redefines functions responsible for displaying different types of tasks
	*/
	type_renderers: CustomTypeRenderers["type_renderers"];

	/**
	 * stores the names of lightbox's structures (used for different types of tasks)
	 * @param the name of the task type.
	 * @param the name of the project type.
	 * @param the name of the milestone type.
	 * @param the name of the placeholder type.
	 * @param name of the custom type.
	*/
	types: {
		task?: string | number,
		project?: string | number,
		milestone?: string | number,
		placeholder?: string | number,
		[typeName: string]: string | number | undefined
	}

	/**
	 * enables the Undo functionality for the gantt
	*/
	undo?: boolean;

	/**
	 * sets the actions that the Undo operation will revert
	 * @param the name of the "update" action
	 * @param the name of the "remove" action
	 * @param the name of the "add" action
	 * @param the name of the "move" action
	*/
	undo_actions?: {
		update?: string,
		remove?: string,
		add?: string,
		move?: string
	}

	/**
	 * sets the number of steps that should be reverted by the undo method
	*/
	undo_steps?: number;

	/**
	 * sets the types of entities for which the Undo operation will be applied
	 * @param the name of the "link" entity
	 * @param the name of the "task" entity
	*/
	undo_types?: {
		link?: string,
		task?: string
	}

	/**
	 * enables WAI-ARIA support to make the component recognizable for screen readers.
	 * Legacy alias of `config.accessibility.aria`: when explicitly set, this value wins
	*/
	wai_aria_attributes?: boolean;

	/**
	 * specifies the speed of scrolling the gantt by the mouse wheel
	 * @param the horizontal speed
	 * @param the vertical speed
	*/
	wheel_scroll_sensitivity: undefined | number | {
		x?: number,
		y?: number
	}

	/**
	 * sets both the section and its label on the same line
	*/
	wide_form: boolean;

	/**
	 * enables calculating the duration of tasks in working time instead of calendar time
	*/
	work_time: boolean;

	/**
	 * stores zoom extension settings that can be passed directly to gantt.ext.zoom.init()
	*/
	zoom?: ZoomConfig;

	[customConfig: string]: any;
}

export interface GanttHotkeys {
	edit_save: number;
	edit_cancel: number;
}

export type MonthLabelList = [string, string, string, string, string, string, string, string, string, string, string, string];
export type WeekDayLabelList = [string, string, string, string, string, string, string];

export interface GanttLocaleDate {
	month_full: MonthLabelList;
	month_short: MonthLabelList;
	day_full: WeekDayLabelList;
	day_short: WeekDayLabelList;
}

export interface GanttLocaleLabels {
	new_task: string;
	icon_save: string;
	icon_cancel: string;
	icon_details: string;
	icon_edit: string;
	icon_delete: string;
	confirm_deleting: string;
	section_description: string;
	section_time: string;
	section_type: string;
	section_deadline: string;
	section_baselines: string;

	/* effort-driven tasks */
	section_work: string;
	section_scheduling_mode: string;
	fixed_duration: string;
	fixed_units: string;
	fixed_work: string;

	/* grid columns */
	column_wbs: string;
	column_text: string;
	column_start_date: string;
	column_duration: string;
	column_predecessors: string;
	column_successors: string;
	column_work: string;
	column_add: string;

	/* link confirmation */
	link: string;
	confirm_link_deleting: string;
	link_start: string;
	link_end: string;

	type_task: string;
	type_project: string;
	type_milestone: string;

	minutes: string;
	hours: string;
	days: string;
	weeks: string;
	months: string;
	years: string;

	/* message popup */
	message_ok: string;
	message_cancel: string;

	/* constraints */
	section_constraint: string;
	constraint_type: string;
	constraint_date: string;
	asap: string;
	alap: string;
	snet: string;
	snlt: string;
	fnet: string;
	fnlt: string;
	mso: string;
	mfo: string;

	/* resource control */
	resources_filter_placeholder: string;
	resources_filter_label: string;

	/* screen reader (ARIA) labels */
	aria_grid: string;
	aria_dialog_lightbox: string;
	aria_dialog_quickinfo: string;
	aria_sort_ascending: string;
	aria_sort_descending: string;
	aria_resource_load: string;
	aria_resource_load_date: string;
	aria_resource_hours_date: string;
	aria_task_duration: string;
	aria_task_progress: string;
	aria_toggle_row: string;
	aria_link_finish_to_start: string;
	aria_link_start_to_start: string;
	aria_link_finish_to_finish: string;
	aria_link_start_to_finish: string;

	[customLabel: string]: any;
}

export interface GanttLocale {
	date: GanttLocaleDate;
	labels: GanttLocaleLabels;
}

/**
 * The domain a link formatter shows and parses task references in.
 * `"legacy"` keeps `getWBSCode`, which follows the current display order;
 * `"outline"` uses the canonical outline number, which ignores sort, filter,
 * grouping and collapsing; `"row"` uses the row number (`getRowNumber`), which
 * ignores sort, filter and collapsing and follows the grouped tree while grouping
 * is active. `"outline"` and `"row"` reject a reference whose link type or lag text
 * can't be read. Stored link endpoints remain task ids either way, so switching the
 * domain changes only the text.
 */
export type LinkReference = "legacy" | "outline" | "row";

/** field mapping for the `wbs` extension (GS-3626) - task property names */
export interface WBSFieldsConfig {
	code: string;
	locked: string;
}

export type WBSUpdatePolicy = "preserve" | "reparent" | "structure";

export interface WBSMaskLevel {
	/** a built-in sequence ("numeric", "uppercase", "lowercase") or one added with `addSequence` */
	sequence: string;
	/** `null` is a variable-length segment; a positive integer is an exact width */
	length: number | null;
	/** one or more punctuation characters; a code never ends with a separator */
	separator: string;
}

/** a serializable WBS code mask: a prefix plus one definition per outline level */
export interface WBSMask {
	prefix: string;
	levels: WBSMaskLevel[];
}

/**
 * A custom code segment alphabet. Both handlers are required: allocation parses
 * the parent code before it formats a child. `format` returns `null` on overflow
 * and `parse` returns `null` when the text does not belong to the sequence -
 * neither ever grows, truncates or wraps a segment.
 */
export interface WBSSequence {
	format(ordinal: number, length: number | null): string | null;
	parse(text: string, length: number | null): number | null;
}

export interface WBSConfig {
	fields: WBSFieldsConfig;
	update_policy: WBSUpdatePolicy;
	generate_on_create: boolean;
	generate_on_parse: boolean;
	/** `null` means the default mask: one variable-length numeric level, "." separator */
	mask: WBSMask | null;
}

/**
 * `renumber` recodes from canonical position; `assignMissing` fills missing codes only;
 * `rebaseChildren` keeps the scope task's stored code and recodes its descendants beneath it.
 */
export type WBSRequestMode = "renumber" | "assignMissing" | "rebaseChildren";

export interface WBSRequest {
	mode: WBSRequestMode;
	/** a task id limits the operation to that subtree; omitted means the whole project. Required for `rebaseChildren` */
	scope?: Id;
	/** `renumber` and `rebaseChildren` only; default `false` */
	includeMissing?: boolean;
	/**
	 * `renumber` and `rebaseChildren` only; default `false`. A locked task is left with its
	 * current code instead of vetoing the whole operation - the Microsoft Project rule,
	 * where Renumber leaves a manually-entered code alone. A descendant of a skipped task
	 * still gets its own proposed code; only the locked task itself is left unchanged.
	 */
	skipLocked?: boolean;
	/** default `false` */
	dryRun?: boolean;
}

export interface WBSChange {
	id: Id;
	before: string | null;
	after: string | null;
}

export type WBSConflictType =
	"locked" | "duplicate" | "capacity" | "incompatible_context" | "insufficient_data" | "out_of_scope";

export interface WBSConflict {
	type: WBSConflictType;
	id?: Id;
	code?: string;
	proposed?: string;
	message: string;
}

export type WBSResultStatus = "applied" | "preview" | "rejected";

export interface WBSResult {
	status: WBSResultStatus;
	changes: WBSChange[];
	conflicts: WBSConflict[];
}

/**
 * `not_derived`: the task's code parses under the mask but is not its parent's code plus
 * one segment - e.g. children `1.1`/`1.2` left under a parent hand-edited to `5`.
 */
export type WBSDiagnosticType = "duplicate" | "malformed" | "locked_without_code" | "not_derived";

export interface WBSDiagnosticEntry {
	type: WBSDiagnosticType;
	id: Id;
	code?: string | null;
	message: string;
}

export interface WBSDiagnostics {
	entries: WBSDiagnosticEntry[];
}

export type WBSOperationReason = "add" | "delete" | "move" | "update" | "generate" | "setCode";

/** the `onBeforeWBSOperation` / `onAfterWBSOperation` payload (GS-3626 Phase 7) */
export interface WBSOperationPlan {
	operationId: string;
	reason: WBSOperationReason;
	/** "local": applied locally, not a statement about whether it is saved yet */
	origin: string;
	codeChanges: WBSChange[];
}

export interface WBS {
	getCode(task: Task | Id): string | null;
	getTaskByCode(code: string): Task | null;
	setCode(id: Id, code: string | null, options?: { locked?: boolean }): WBSResult;
	generate(request: WBSRequest): WBSResult;
	addSequence(name: string, handlers: WBSSequence): void;
	/** validates and stores the mask into `gantt.config.wbs.mask`; changes no task data */
	setMask(mask: WBSMask | null): void;
	validate(): WBSDiagnostics;
}

export interface GanttPlugins {
	auto_scheduling?: boolean;
	click_drag?: boolean;
	critical_path?: boolean;
	drag_timeline?: boolean;
	fullscreen?: boolean;
	keyboard_navigation?: boolean;
	quick_info?: boolean;
	tooltip?: boolean;
	undo?: boolean;
	grouping?: boolean;
	marker?: boolean;
	multiselect?: boolean;
	overlay?: boolean;
	wbs?: boolean;
	export_api?: boolean;
	toolbar?: boolean;
	context_menu?: boolean;
	task_form?: boolean;
}

export interface GanttInitializationConfig {
	container?: string | HTMLElement;
	config?: any;
	templates?: any;
	events?: any;
	data?: any;
	plugins?: GanttPlugins;
	locale?: any;
}

export interface GanttInternationalization {
	setLocale(locale: any): void;
	getLocale(language: string): GanttLocale;
	addLocale(language: string, locale: GanttLocale): void;
}
export type GanttPlugin = (gantt: GanttStatic) => void;

/**
 * A scheduling engine, created by an engine add-on. The rest of its contract is
 * internal; Gantt checks the engine when a chart first uses it.
 */
export interface SchedulingEngine {
	readonly id: string;
}

/**
 * The PlanningEngine module (`@dhx/plen-wasm` 1.1), after its `init()` in a browser:
 * an object with the engine's `Project` class.
 */
export interface PlanningEngineModule {
	Project: new (options?: { dates?: "string" | "date" }) => unknown;
}

export interface GanttEnterprise {
	plugin(plugin: GanttPlugin): void;
	getGanttInstance(settings?: GanttInitializationConfig): GanttStatic;

	/**
	 * Since v10.1. Makes a scheduling engine selectable by name in config.auto_scheduling.engine.
	 * Registration is global. Each chart that names the engine calls createEngine and gets its
	 * own engine, which the chart disposes of when it switches engines or is destroyed.
	 * "v2" is the built-in engine and cannot be registered.
	 * @param name the name to put in config.auto_scheduling.engine
	 * @param createEngine a function that returns a new engine, usually from an engine add-on
	 */
	registerSchedulingEngine(name: string, createEngine: () => SchedulingEngine): void;

	/**
	 * Since v10.1, in the bundles with auto-scheduling. Creates a scheduling engine on PlanningEngine
	 * (`@dhx/plen-wasm`), for `registerSchedulingEngine`. The page loads the engine module itself and,
	 * in a browser, awaits its `init()` first.
	 * A chart that the engine cannot schedule as Gantt models it (for example, a `week` duration
	 * unit, dates with seconds or calendars with custom weeks) makes the engine throw an error that
	 * names the reasons.
	 * @param plen the PlanningEngine module
	 */
	createPlanningEngine(plen: PlanningEngineModule): SchedulingEngine;
}


export interface GanttStatic {

	/**
	 * redefines the default click behavior for buttons of the Gantt chart
	*/
	$click: any;

	/**
	 * gantt ajax module
	*/
	ajax: any;

	/**
	 * the interface of the working calendar object
	*/
	calendar: Calendar;

	/**
	 * defines configuration options for dates, scale, controls
	*/
	config: GanttConfigOptions;

	/**
	 * stores various constants to reduce the use of magic numbers in the code
	*/
	constants: any;

	/**
	 * a set of datastore methods
	*/
	datastore: DatastoreMethods;

	/**
	 * a set of date formatting methods
	*/
	date: DateHelpers;

	/**
	 * a set of flags which describe current environment
	*/
	env: any;

	/**
	 * an object that stores various extensions
	*/
	ext: Ext;

	/**
	 * an object of the lightbox controls
	 * @param the [Checkbox](desktop/checkbox.md) control
	 * @param the [Constraint](desktop/constraint.md) control
	 * @param the [Duration](desktop/duration.md) control
	 * @param the [Duration](desktop/duration.md) control that allows changing the [section visibility](desktop/duration.md#switchingsectionvisibility)
	 * @param the [Parent](desktop/parent.md) control
	 * @param the [Radio button](desktop/radio.md) control
	 * @param the [Resources](desktop/resources.md) control
	 * @param the [Select](desktop/select.md) control
	 * @param the [Template](desktop/template.md) control
	 * @param the [Textarea](desktop/textarea.md) control
	 * @param the [Time](desktop/time.md) control
	 * @param the [Time](desktop/time.md) control that allows changing the [section visibility](desktop/time.md#switchingsectionvisibility)
	 * @param the [Typeselect](desktop/typeselect.md) control
	 * @param a custom control
	*/
	form_blocks: {
		checkbox?: LightboxControl,
		constraint?: LightboxControl,
		duration?: LightboxControl,
		duration_optional?: LightboxControl,
		duration_select?: LightboxControl,
		duration_select_optional?: LightboxControl,
		parent?: LightboxControl,
		radio?: LightboxControl,
		resources?: LightboxControl,
		select?: LightboxControl,
		template?: LightboxControl,
		textarea?: LightboxControl,
		time?: LightboxControl,
		time_optional?: LightboxControl,
		time_select?: LightboxControl,
		time_select_optional?: LightboxControl,
		typeselect?: LightboxControl,
		[ControlName: string]: LightboxControl | undefined
	}

	/**
	 * a set of methods for Gantt chart localization
	*/
	i18n: GanttInternationalization;

	/**
	 * hides a time unit in the time scale
	*/
	ignore_time: GanttCallback;

	/**
	 * specifies JSON serialization and parsing
	*/
	json: any;

	/**
	 * defines the hot keys for the Gantt chart
	*/
	keys: GanttHotkeys;

	/**
	 * returns the license name of dhtmlxGantt
	*/
	license: string;

	/**
	 * the current locale object (region-specific labels) of the Gantt chart
	*/
	locale: GanttLocale;

	/**
	 * specifies serialization and parsing in the XML format of dhtmlxGantt 1.0
	*/
	oldxml: any;

	/**
	 * returns the current skin of the Gantt chart
	*/
	skin: string;

	/**
	 * returns objects of the available skins
	*/
	skins: any;

	/**
	 * defines formatting templates for dates, titles, tooltips in the Gantt chart
	*/
	templates: GanttTemplates;

	/**
	 * a set of treeDatastore methods
	*/
	treeDatastore: TreeDatastoreMethods;

	/**
	 * various helper modules
	*/
	utils: { dom: DomHelpers };

	/**
	 * returns the version of dhtmlxGantt
	*/
	version: string;

	/**
	 * specifies XML serialization and parsing
	*/
	xml: any;

	$container: HTMLElement;

	$grid: HTMLElement;

	$grid_data: HTMLElement;

	$grid_scale: HTMLElement;

	$root: HTMLElement;

	$scroll_hor: HTMLElement;

	$scroll_ver: HTMLElement;

	$task: HTMLElement;

	$task_bars: HTMLElement;

	$task_bg: HTMLElement;

	$task_data: HTMLElement;

	$task_links: HTMLElement;

	$task_scale: HTMLElement;

	$destroyed?: boolean;

	[customProperty: string]: any;

	/**
	 * Promise object constructor
	 * @param executor a callback used to initialize the promise
	*/
	Promise: new (executor: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void) => Promise<unknown>;

	/**
	 * adds a calendar into Gantt
	 * @param calendar an object with configuration of the calendar
	*/
	addCalendar(calendar: CalendarConfig): string;

	/**
	 * adds a new dependency link
	 * @param link the link object
	*/
	addLink(link: WithOptionalId<SerializedLink | Link>): string | number;

	/**
	 * displays an additional layer with custom elements for a link in the timeline area
	 * @param func a render function or a config object
	*/
	addLinkLayer(func: AdditionalLinkLayer["LinkLayerRender"] | AdditionalLinkLayer["LinkLayerConfig"]): string;

	/**
	 * adds a marker to the timeline area
	 * @param marker the marker's configuration object
	*/
	addMarker(marker: MarkerConfig): number | string;

	/**
	 * adds a new keyboard shortcut
	 * @param shortcut the key name or the name of keys combination for a shortcut (<a href="desktop/keyboard_navigation.md#shortcutsyntax">shortcut syntax</a>)
	 * @param handler the handler of the shortcut call
	 * @param scope optional, the name of the context element to attach the handler function to (<a href="desktop/keyboard_navigation.md#scopes">list of scopes</a>); "gantt" by default
	*/
	addShortcut(shortcut: string, handler: GanttCallback, scope?: string): void;

	/**
	 * adds a new task
	 * @param task the task object
	 * @param parent optional, the parent's id
	 * @param index optional, the position the task will be added into (0 or greater)
	*/
	addTask(task: WithOptionalId<SerializedTask | Task>, parent?: string | number, index?: number): string | number;

	/**
	 * displays an additional layer with custom elements for a task in the timeline area
	 * @param func a render function or a config object
	*/
	addTaskLayer(func: AdditionalTaskLayer["TaskLayerRender"] | AdditionalTaskLayer["TaskLayerConfig"]): string;

	/**
	 * adjusts the task's row height for proper display of baseline elements
	 * @param task the task object whose `row_height` will be adjusted
	*/
	adjustTaskHeightForBaselines(task: Task): void;

	/**
	 * calls an alert message box
	 * @param config either an object with the alert box's configuration or the text to show
	*/
	alert(config: AlertBoxConfig | string | number): HTMLElement;

	/**
	 * if the specified expression is false, an errorMessage is shown in the red popup at the top right corner of the screen
	 * @param expression truthy value to assert the expression, falsy - if assertion fails
	 * @param errorMessage an error message that will be shown in the red popup
	*/
	assert(expression: any, errorMessage: string): void;

	/**
	 * attaches the handler to an inner event of dhtmlxGantt
	 * @param name the event's name, case-insensitive
	 * @param handler the handler function
	 * @param settings optional, an <a href="#propertiesofsettingsobject">object with settings</a> for the event handler
	*/
	attachEvent<T extends keyof GanttEventCallback>(event: T, handler: GanttEventCallback[T], settings?: HandlerSettings): string
	/**
	 * recalculates the schedule of the project
	 * @param taskId optional, the task id
	*/
	autoSchedule(taskId?: string | number): void;

	/**
	 * updates multiple tasks/links at once
	 * @param callback the callback function
	 * @param noRedraw optional, specifies if Gantt should repaint the chart after the callback function; <i>true</i> - not to repaint and <i>false</i> (by default) - to repaint
	*/
	batchUpdate(callback: GanttCallback, noRedraw?: boolean): void;

	/**
	 * creates a new function that, when called, has its <i>this</i> keyword set to the provided value
	 * @param method the target function
	 * @param thisArg the value to be passed as the <i>this</i> parameter to the target function when the bound function is called
	*/
	bind(method: GanttCallback, thisArg: any): GanttCallback;

	/**
	 * calculates the duration of a task
	 * @param config either the <a href="#configurationobjectproperties">configuration object</a> of a time span or the start date of the task
	 * @param end_date optional, the end date of the task. The parameter is required when the first parameter is specified as  <i>start_date</i>.
	*/
	calculateDuration: Calendar["calculateDuration"];

	/**
	 * calculates the end date of a task
	 * @param config either the <a href="#configurationobjectproperties">configuration object</a> of a time span or the start date of the task
	 * @param duration optional, the duration of the task. The parameter is required when the first parameter is specified as  <i>start_date</i>
	*/
	calculateEndDate: Calendar["calculateEndDate"];

	/**
	 * calculates the level of nesting of a task
	 * @param task the task's object
	*/
	calculateTaskLevel(task: Task): number;

	/**
	 * calls an inner event
	 * @param name the event's name, case-insensitive
	 * @param params optional, an array of the event-related data
	*/
	callEvent(name: string, params?: any[]): boolean | undefined;

	/**
	 * repaints the lighbox for the task according to its type
	 * @param type the task type
	*/
	changeLightboxType(type: string): void;

	/**
	 * changes the link's id
	 * @param id the current link's id
	 * @param new_id the new link's id
	*/
	changeLinkId(id: string | number, new_id: string | number): void;

	/**
	 * changes the task's id
	 * @param id the current task's id
	 * @param new_id the new task's id
	*/
	changeTaskId(id: string | number, new_id: string | number): void;

	/**
	 * checks whether an event has some handler(s) specified
	 * @param name the event's name
	*/
	checkEvent(name: string): boolean;

	/**
	 * removes all tasks and additional elements (including markers) from the Gantt chart
	*/
	clearAll(): void;

	/**
	 * clears the stack of stored redo commands
	*/
	clearRedoStack(): void;

	/**
	 * clears the stack of stored undo commands
	*/
	clearUndoStack(): void;

	/**
	 * closes the branch with the specified id
	 * @param id the branch id
	*/
	close(id: string | number): void;

	/**
	 * collapses gantt from the full screen mode to the normal mode
	*/
	collapse(): void;

	/**
	 * returns the index of the column by the date
	 * @param date a date object
	*/
	columnIndexByDate(date: Date): number;

	/**
	 * calls a confirm message box
	 * @param config either an object with the confirm box's configuration or the text to show
	*/
	confirm(config: ConfirmBoxConfig | string | number): HTMLElement;

	/**
	 * creates a deep copy of provided object
	 * @param initialObject the object that needs to be copied
	*/
	copy(initialObject: any): any;

	/**
	 * recalculates the task duration in the work time
	 * @param task the task's object
	*/
	correctTaskWorkTime(task: Task): void;

	/**
	 * creates a working calendar
	 * @param parentCalendar (optional) an existing calendar that is used for creating a new one on the base of it
	*/
	createCalendar(parentCalendar?: Calendar): Calendar;

	/**
	 * creates a new dataProcessor instance and attaches it to gantt
	 * @param config dataProcessor configuration object
	*/
	createDataProcessor(config: DataProcessorConfig | RouterFunction | RouterConfig): any;

	/**
	 * creates a datastore according to the provided configuration
	 * @param config a configuration object of a datastore
	*/
	createDatastore(config: DatastoreConfig): DatastoreMethods & TreeDatastoreMethods;

	/**
	 * adds a new task and opens the lightbox to confirm
	 * @param task optional, the task object
	 * @param parent optional, the parent's id
	 * @param index optional, the position the task will be added into (0 or greater)
	*/
	createTask(task?: TaskInput, parent?: string | number, index?: number): string | number;

	/**
	 * dataProcessor constructor
	 * @param url url to the data feed
	*/
	dataProcessor(url: string): void;

	/**
	 * gets the date of the specified horizontal  position in the chart area
	 * @param pos the relative horizontal position you want to know the date of
	*/
	dateFromPos(pos: number): Date;

	/**
	 * returns false if the provided argument is undefined, otherwise true
	 * @param param a property of an object that should be checked
	*/
	defined(param: any): boolean;

	/**
	 * deletes a task calendar by its id
	 * @param id the id of the calendar
	*/
	deleteCalendar(id: string | number): void;

	/**
	 * deletes the specified dependency link
	 * @param id the dependency link's id
	*/
	deleteLink(id: string | number): void;

	/**
	 * deletes the specified marker
	 * @param markerId the marker's id
	*/
	deleteMarker(markerId: string | number): void;

	/**
	 * deletes the specified  task
	 * @param id the task's id
	*/
	deleteTask(id: string | number): void;

	/**
	 * destroys the gantt instance
	*/
	destructor(): void;

	/**
	 * detaches a handler from an event (which was attached before by the attachEvent() method)
	 * @param id the event's id
	*/
	detachEvent(id: string): void;

	/**
	 * iterates over all parent tasks of the specified task in the Gantt chart
	 * @param code a function that will iterate over tasks. Takes a task object as a parameter
	 * @param startTask the id of the item the parent tasks of which should be iterated over
	 * @param master the object, that 'this'  will refer to
	*/
	eachParent(code: (child: Task) => void, startTask: string | number, master?: any): void;

	/**
	 * iterates over all selected tasks in the Gantt chart
	 * @param code a function that will iterate over tasks. Takes a task id as a parameter
	*/
	eachSelectedTask?(code: (id: string | number) => void): void;

	/**
	 * iterates over all child tasks of a specific task or the of whole Gantt chart
	 * @param code a function that will iterate over tasks. Takes a task object as a parameter
	 * @param parent the parent id. If specified, the function will iterate over children of the <br> specified parent
	 * @param master the object, that 'this'  will refer to
	*/
	eachTask(code: (task: Task) => void, parent?: string | number, master?: any): void;

	/**
	 * attaches an event handler to an HTML element
	 * @param node the HTML node or its id
	 * @param event the name of an HTML event (without the 'on' prefix)
	 * @param handler the event handler
	 * @param options optional, the value of either the <i>useCapture</i> or <i>options</i> parameter. <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener">Read details</a>
	*/
	event(node: HTMLElement | string, event: string, handler: GanttCallback, options?: boolean | HandlerSettings): void;

	/**
	 * removes an event handler from an HTML element
	 * @param node the HTML node or its id
	 * @param event the name of an HTML event (without the 'on' prefix)
	 * @param handler the event handler
	 * @param options optional, the value of either the <i>useCapture</i> or <i>options</i> parameter. <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener">Read details</a>
	*/
	eventRemove(node: HTMLElement | string, event: string, handler: GanttCallback, options?: boolean | HandlerSettings): void;

	/**
	 * expands gantt to the full screen mode
	*/
	expand(): void;

	/**
	 * exports data from the Gantt chart to an Excel document
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToExcel(_export_?: any): void;

	/**
	 * exports data from the Gantt chart to an iCal string
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToICal(_export_?: any): void;

	/**
	 * exports the structure and data of a Gantt chart into a JSON object
	 * @param config optional, an object with Gantt configuration
	*/
	exportToJSON(config?: any): void;

	/**
	 * exports data from the Gantt chart to MS Project
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToMSProject(_export_?: any): void;

	/**
	 * exports a Gantt chart into the PDF format
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToPDF(_export_?: any): void;

	/**
	 * exports a Gantt chart into the PNG format
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToPNG(_export_?: any): void;

	/**
	 * exports data from the Gantt chart to Primavera P6
	 * @param _export_ optional, an object with export settings (see the details)
	*/
	exportToPrimaveraP6(_export_?: any): void;

	/**
	 * returns all dependency loops in the chart
	*/
	findCycles(): any[];

	/**
	 * sets focus on the gantt
	*/
	focus(): void;

	/**
	 * gets worktime calendar by id
	 * @param calendarId optional, the id of the global calendar or "global"
	*/
	getCalendar(calendarId?: string | number): Calendar;

	/**
	 * gets all the calendars added into Gantt
	*/
	getCalendars(): any[];

	/**
	 * returns the 1st-level child tasks of the specified parent branch
	 * @param id the parent branch's id
	*/
	getChildren(id: string | number): any[];

	/**
	 * returns the closest working time
	 * @param config the configuration object or the date
	*/
	getClosestWorkTime: Calendar["getClosestWorkTime"];

	/**
	 * returns the index of the column by its name
	 * @param name the name of the column
	 * @param excludeHidden skips indexes of the hidden columns
	*/
	getColumnIndex(name: string | number, excludeHidden?: boolean): number;

	/**
	 * returns all tasks and links that a task is connected with
	 * @param id optional, the id of a task
	*/
	getConnectedGroup(id?: string | number): any;

	/**
	 * returns the earliest and latest dates allowed by the constraint applied to a task
	 * @param task a task object
	*/
	getConstraintLimitations(task: Task): any;

	/**
	 * returns the constraint type applied to the task
	 * @param task a task object
	*/
	getConstraintType(task: Task): string | undefined;

	/**
	 * returns the configuration object of a datastore
	 * @param name the name of the datastore
	*/
	getDatastore(name: string): DatastoreMethods & TreeDatastoreMethods;

	/**
	 * returns the free slack of a task
	 * @param task the object of a task
	*/
	getFreeSlack(task: Task): number;

	/**
	 * gets the index of a task in the tree
	 * @param id the task id
	*/
	getGlobalTaskIndex(id: string | number): number;

	/**
	 * gets the configuration object of a column
	 * @param name the column's name
	*/
	getGridColumn(name: string | number): GridColumn;

	/**
	 * gets columns of the Gantt chart
	*/
	getGridColumns(): GridColumn[];

	/**
	 * gets the label of a select control in the lightbox
	 * @param property the name of a data property that the control is mapped to
	 * @param key the option's id. This parameter is compared with the task's data property to <br> assign the select's option to the task
	*/
	getLabel(property: string, key: string | number): string;

	/**
	 * returns the id of the last selected task
	*/
	getLastSelectedTask?(): string | number | null;

	/**
	 * returns the object of the layout view by its name
	 * @param name the name of the layout view
	*/
	getLayoutView(name: string): any;

	/**
	 * gets the lightbox's HTML object element
	*/
	getLightbox(): HTMLElement;

	/**
	 * returns the object of the lightbox's section
	 * @param name the name of the section
	*/
	getLightboxSection(name: string | number): LightboxSectionState;

	/**
	 * returns the name of the active lighbox's structure
	*/
	getLightboxType(): string;

	/**
	 * returns values of the lightbox's sections
	*/
	getLightboxValues(): any;

	/**
	 * returns the dependency link object by the specified id
	 * @param id the link id
	*/
	getLink(id: string | number): Link;

	/**
	 * returns the number of all dependency links presented in the Gantt chart
	*/
	getLinkCount(): number;

	/**
	 * returns the HTML element of the specified dependency link
	 * @param id the link id
	*/
	getLinkNode(id: string | number): HTMLElement;

	/**
	 * returns all links presented in the Gantt chart
	*/
	getLinks(): Array<Link>;

	/**
	 * gets the marker's object
	 * @param markerId the marker's id
	*/
	getMarker(markerId: string | number): MarkerItem | null | void;

	/**
	 * returns the id of the next item (no matter what the level of nesting is: the same or different)
	 * @param id the task id
	*/
	getNext(id: string | number): string | number;

	/**
	 * returns the id of the next task of the same level
	 * @param id the task id
	*/
	getNextSibling(id: string | number): string | number;

	/**
	 * returns the id of the parent task
	 * @param id the task id
	*/
	getParent(id: string | number): string | number;

	/**
	 * returns the id of the previous item (no matter what the level of nesting is: the same or different)
	 * @param id the task id
	*/
	getPrev(id: string | number): string | number;

	/**
	 * returns the id of the previous task of the same level
	 * @param id the task id
	*/
	getPrevSibling(id: string | number): string | number;

	/**
	 * returns the stack of stored redo user actions
	*/
	getRedoStack(): UndoRedoAction[];

	/**
	 * returns all tasks assigned to the resource
	 * @param resourceId the id of the resource
	 * @param taskId the id of the task
	*/
	getResourceAssignments(resourceId: string | number, taskId?: string | number): ResourceAssignment[];

	/**
	 * returns a calendar which the resource is assigned to
	 * @param resource the id or object of the resource
	*/
	getResourceCalendar(resource: any): any;

	/**
	 * returns the configuration of the time scale
	*/
	getScale(): any;

	/**
	 * returns the scroll position
	*/
	getScrollState(): { x: number, y: number };

	/**
	 * returns the id of the selected task, or null if no task is selected
	*/
	getSelectedId(): string | number | null;

	/**
	 * returns an array of the currently selected tasks
	*/
	getSelectedTasks?(): Array<string | number>;

	/**
	 * gets a key navigation shortcut handler
	 * @param shortcut the key name or the name of keys combination for a shortcut (<a href="desktop/keyboard_navigation.md#shortcutsyntax">shortcut syntax</a>)
	 * @param scope the name of the context element to attach the handler function to (<a href="desktop/keyboard_navigation.md#scopes">list of scopes</a>)
	*/
	getShortcutHandler(shortcut: string, scope: string): GanttCallback;

	/**
	 * returns siblings of the specified  task (including itself)
	 * @param id the task id
	*/
	getSiblings(id: string | number): any[];

	/**
	 * gets the current state of the Gantt chart
	*/
	getState(): GanttUIState;

	/**
	 * calculates the combined start/end dates of tasks nested in a project or another task
	 * @param task_id the task's id, api/gantt_root_id_config.md will be used if not specified
	*/
	getSubtaskDates(task_id?: string | number): any;

	/**
	 * calculates the combined duration of tasks nested in a project or another task.
	 * @param task_id the task's id, api/gantt_root_id_config.md will be used if not specified
	*/
	getSubtaskDuration(task_id?: string | number): number;

	/**
	 * returns the task object
	 * @param id the task id
	*/
	getTask(id: string | number): Task;

	/**
	 * returns the parsed resource assignments of a specific task from the datastore
	 * @param taskId the task id
	*/
	getTaskAssignments(taskId: string | number): ResourceAssignment[];

	/**
	 * returns the total work (effort) of a task in `config.effort.work_unit`
	 * Derived from dates and assignments when `task.work` is not stored.
	 * Returns 0 while `config.effort.enabled` is false.
	 * @param taskId the task id
	*/
	getTaskWork(taskId: string | number): number;

	/**
	 * returns the height (in pixels) of the DOM element of the task
	 * @param taskId the task's id
	*/
	getTaskBarHeight(taskId: number | string): number;

	/**
	 * returns an array of baselines of a specific task from the datastore
	 * @param taskId the task id
	*/
	getTaskBaselines(taskId: string | number): Baseline[];

	/**
	 * finds a task by the specified criteria
	 * @param propertyName the name of the property to match, or a filter function
	 * @param propertyValue the property value
	 * @param types an object with types of the tasks which should be returned
	*/
	getTaskBy(propertyName: string | GanttCallback, propertyValue?: string | number | boolean | any[], types?: any): Array<Task>;

	/**
	 * returns a task by its global task index
	 * @param index the task index in the tree (zero-based numbering)
	*/
	getTaskByIndex(index: number | string): Task;

	/**
	 * returns a collection of tasks which occur during the specified period
	 * @param from the start date of the period
	 * @param to the end date of the period
	*/
	getTaskByTime(from?: Date, to?: Date): Array<Task>;

	/**
	 * returns a task by its WBS code
	 * @param code the WBS code of the task
	 * Legacy outline-number API: resolves against display order, so a code found
	 * before a sort or filter may point elsewhere afterwards.
	*/
	getTaskByWBSCode(code: string): Task;

	/**
	 * returns a task by its canonical outline number, e.g. "1.2.3" (GS-3626).
	 * @param code the outline number to look up
	 * @returns the matching task, or null when malformed or not loaded
	*/
	getTaskByOutlineNumber(code: string): Task | null;

	/**
	 * returns a task by its row number (GS-441), the inverse of `getRowNumber`.
	 * @param rowNumber a positive integer
	 * @returns the matching task, or null for any other value or a number that no loaded task holds
	*/
	getTaskByRowNumber(rowNumber: number): Task | null;

	/**
	 * gets a calendar assigned to the specified task (a task level calendar)
	 * @param task the id or object of a task
	*/
	getTaskCalendar(task: any): any;

	/**
	 * gets the number of tasks that are currently loaded in the gantt
	*/
	getTaskCount(): number;

	/**
	 * returns the visible height of a task
	 * @param id the task's id
	*/
	getTaskHeight(id?: string | number): number;

	/**
	 * gets the index of a task in the branch
	 * @param id the task id
	*/
	getTaskIndex(id: string | number): number;

	/**
	 * returns the HTML element of the task bar
	 * @param id the task id
	*/
	getTaskNode(id: string | number): HTMLElement;

	/**
	 * calculates the position and size of the task's DOM element in the timeline area
	 * @param task the task object
	 * @param from optional, the start date of the item
	 * @param to optional, the end date of the item
	*/
	getTaskPosition(task: Task, from?: Date, to?: Date): any;

	/**
	 * returns the array of unique resources assigned to a specific task from the datastore
	 * @param taskId the task id
	*/
	getTaskResources(taskId: string | number): ResourceItem[];

	/**
	 * returns the HTML element of the task row in the table
	 * @param id the task id
	*/
	getTaskRowNode(id: string | number): HTMLElement;

	/**
	 * gets the top position of the task's DOM element in the timeline area
	 * @param id the task's id
	*/
	getTaskTop(id: number | string): number;

	/**
	 * returns the type of a task
	 * @param task the task object
	*/
	getTaskType(task: Task): string;

	/**
	 * returns the total slack of a task
	 * @param task optional, the object of a task or its ID
	*/
	getTotalSlack(task?: Task | string | number): any;

	/**
	 * returns the stack of stored undo user actions
	*/
	getUndoStack(): UndoRedoAction[];

	/**
	 * gets the number of tasks visible on the screen (those that are not collapsed)
	*/
	getVisibleTaskCount(): number;

	/**
	 * returns the WBS code (the outline number) of a task
	 * @param task the object of a task
	 * Legacy outline-number API (GS-3626): a derived, display-order value, recalculated from
	 * the current grid order and cached until the next sort, add, delete or move. Kept
	 * unchanged, with no removal planned - see
	 * docs/internal/wbs-codes-and-outline-numbers/design.md#6-compatibility for the migration
	 * path to `getOutlineNumber()` or the stored `wbs` extension.
	*/
	getWBSCode(task: Task): string;

	/**
	 * returns the canonical outline number of a task, e.g. "1.2.3" (GS-3626).
	 * Unlike `getWBSCode`, unaffected by sort, filter or collapsing.
	 * @param task the object of a task
	 * @returns the dotted outline number, or "" for a virtual row, a placeholder or the root
	*/
	getOutlineNumber(task: Task): string;

	/**
	 * returns the row number of a task (GS-441): its position, counted from 1, in a walk of
	 * canonical order that visits each task before its children. Collapse, sort and filter do not
	 * change it; adding, deleting or moving a task renumbers the tasks after it. While grouping is
	 * active, it follows the grouped tree, as `getOutlineNumber` does.
	 * @param task the object of a task
	 * @returns the row number, or 0 for a virtual row, a placeholder or the root
	*/
	getRowNumber(task: Task): number;

	/**
	 * returns the working hours of the specified date
	 * @param date a date to check
	*/
	getWorkHours(date: Date): any[];

	/**
	 * groups tasks by the specified task's attribute
	 * @param config the grouping configuration object, or false to ungroup tasks
	*/
	groupBy(config: GroupConfig | boolean): void;

	/**
	 * returns the number of child task(s)
	 * @param id the task id
	*/
	hasChild(id: string | number): number | undefined;

	/**
	 * hides the lightbox modal overlay that blocks interactions with the remaining screen
	 * @param box an element to hide
	*/
	hideCover(box?: HTMLElement): void;

	/**
	 * closes the lightbox if it's currently active
	*/
	hideLightbox(): void;

	/**
	 * hides the pop-up task form (if it's currently active)
	*/
	hideQuickInfo(): void;

	/**
	 * converts an Excel file to JSON
	 * @param config an object with configuration properties of an imported file
	*/
	importFromExcel(config: any): void;

	/**
	 * converts an XML or MPP MS Project file to JSON
	 * @param config an object with configuration properties of an imported file
	*/
	importFromMSProject(config: any): void;

	/**
	 * converts an XML or XER Primavera P6 file to JSON
	 * @param config an object with configuration properties of an imported file
	*/
	importFromPrimaveraP6(config: any): void;

	/**
	 * initializes a dhtmlxGantt inside a container
	 * @param container an HTML container (or its id) where a dhtmlxGantt object will be initialized
	 * @param from the start value of the time scale (X&ndash;Axis)
	 * @param to the end value of the time scale (X&ndash;Axis)
	*/
	init(container: string | HTMLElement, from?: Date, to?: Date): void;

	/**
	 * checks whether a task is a child of a different task
	 * @param childId the id of a task that you want to check as a child
	 * @param parentId the id of a task that you want to check as a parent
	*/
	isChildOf(childId: string | number, parentId: string | number): boolean;

	/**
	 * checks whether the link is circular
	 * @param link the link object
	*/
	isCircularLink(link: Link): boolean;

	/**
	 * checks whether the specified link is critical
	 * @param link the link's object
	*/
	isCriticalLink(link: Link): boolean;

	/**
	 * checks whether the specified task is critical
	 * @param task the task's object
	*/
	isCriticalTask(task: Task): boolean;

	/**
	 * checks whether the specified link is correct
	 * @param linkOrFrom either ID of the source (predecessor) task or a link object with the following properties:
	 * @param from_start optional, specifies if the link is being dragged from the start of the source (predecessor) task (*true*) or from its end (*false*). Not needed at all when the first parameter is specified as an object
	 * @param to optional, the ID of the target (successor) task. Can have the *null* or *undefined* value if the target task isn't specified yet. Not needed at all when the first parameter is specified as an object
	 * @param to_start optional, specifies if the link is being dragged to the start of the target (successor) task (*true*) or from its end (*false*). Not needed at all when the first parameter is specified as an object
	*/
	isLinkAllowed(linkOrFrom: string | number | LinkForValidation, from_start?: boolean, to?: string | number | null | undefined, to_start?: boolean): boolean;

	/**
	 * checks whether the specified link exists
	 * @param id the link id
	*/
	isLinkExists(id: string | number): boolean;

	/**
	 * checks whether the specified task/link, or the whole Gantt is read-only
	 * @param item optional, the id or an object of the task/link. If not specified, the method checks whether the Gantt is read-only
	*/
	isReadonly(item?: number | string | Task | Link): boolean;

	/**
	 * checks whether the specified task is currently selected
	 * @param task the task's id
	*/
	isSelectedTask(task: string | number): boolean;

	/**
	 * checks whether the specified task is split
	 * @param task the object of a task
	*/
	isSplitTask(task: Task): boolean;

	/**
	 * checks whether the specified task is summary
	 * @param task the object of a task
	*/
	isSummaryTask(task: Task): boolean;

	/**
	 * checks whether the specified task exists
	 * @param id the task id
	*/
	isTaskExists(id: string | number): boolean;

	/**
	 * checks whether the specifies task is currently rendered in the Gantt chart
	 * @param id the task's id
	*/
	isTaskVisible(id: string | number): boolean;

	/**
	 * checks if the task is unscheduled
	 * @param task the task's object
	*/
	isUnscheduledTask(task: Task): boolean;

	/**
	 * checks whether the task is active - neither the task nor any of its parents has active:false. Returns false for an unknown id
	 * @param task the task's object or id
	*/
	isTaskActive(task: Task | string | number): boolean;

	/**
	 * checks whether the link is active - it has no active:false and the tasks on both its ends are active. Returns false for an unknown id
	 * @param link the link's object or id
	*/
	isLinkActive(link: Link | string | number): boolean;

	/**
	 * checks whether the specified date is working or not
	 * @param config either the configuration object of a time span or a specific date
	*/
	isWorkTime: Calendar["isWorkTime"];

	/**
	 * loads data to the gantt from an external data source
	 * @param url the server-side url (may be a static file or a server side script that outputs data)
	 * @param type <i>('json', 'xml', 'oldxml')</i> the data type. The default value - <i>'json'</i>
	 * @param callback the callback function
	*/
	load(url: string, type?: string, callback?: GanttCallback): any;

	/**
	 * gets the id of a task from the specified HTML event
	 * @param e a native event
	*/
	locate(e: Event): string | number;

	/**
	 * merges several working calendars into one
	 * @param calendars an array of calendars' objects or the first calendar object
	 * @param calendar2 optional, the second calendar object
	*/
	mergeCalendars(calendars: Calendar[] | Calendar, calendar2?: Calendar): void;

	/**
	 * calls a message box of the specified type
	 * @param config either an object with the message box's configuration or the text to show
	*/
	message: MessagePopupObject;

	/**
	 * adds properties of the 'source' object into the 'target' object
	 * @param target the target object
	 * @param source the source object
	 * @param force optional, if true, properties of the 'source' will overwrite matching properties of the 'target', if there are any. If false (by default), properties that already exist in the 'target' will be omitted
	*/
	mixin(target: CustomObject, source: CustomObject, force?: boolean): void;

	/**
	 * calls a modalbox
	 * @param config the modal box's configuration
	*/
	modalbox(config: ModalBoxConfig): HTMLElement;

	/**
	 * moves a task to a new position
	 * @param sid the id of the task to move
	 * @param tindex the index of the position that the task will be moved to <br> (the index within a branch)
	 * @param parent the parent id. If specified, the <b>tindex</b> will  refer to the  index in the <br> <b>'parent'</b> branch
	*/
	moveTask(sid: string | number, tindex: number, parent?: string | number): boolean | void;

	/**
	 * opens the branch with the specified id
	 * @param id the branch id
	*/
	open(id: string | number): void;

	/**
	 * loads data from a client-side resource
	 * @param data a string or object which represents <a href="https://docs.dhtmlx.com/gantt/desktop__loading.html#dataproperties">data</a>
	 * @param type optional, (<i>'json', 'xml'</i>) the data type. The default value - <i>'json'</i>
	*/
	parse(data: string | GanttData, type?: string): void;

	/**
	 * activates the specified extensions
	 * @param ext an object with the extensions' names that need to be activated
	*/
	plugins(ext?: GanttPlugins): GanttPlugins;

	/**
	 * gets the relative horizontal position of the specified date in the chart area
	 * @param date a date you want to know the position of
	*/
	posFromDate(date: Date): number;

	/**
	 * applies the reverted changes to the gantt once again
	*/
	redo(): void;

	/**
	 * refreshes data in the Gantt chart
	*/
	refreshData(): void;

	/**
	 * refreshes the specifies link
	 * @param id the link id
	*/
	refreshLink(id: string | number): void;

	/**
	 * refreshes the task and its related links
	 * @param id the task id
	 * @param refresh_links optional, defines whether links related to the task should be refreshed, <em>true</em> by default
	*/
	refreshTask(id: string | number, refresh_links?: boolean): void;

	/**
	 * removes the specified layer related to a link
	 * @param layerId a DOM element that will be displayed in the layer
	*/
	removeLinkLayer(layerId: string | number): void;

	/**
	 * removes a keyboard shortcut
	 * @param shortcut the key name or the name of keys combination for a shortcut (<a href="desktop/keyboard_navigation.md#shortcutsyntax">shortcut syntax</a>)
	 * @param scope the element to which the shortcut is attached (<a href="desktop/keyboard_navigation.md#scopes">list of scopes</a>)
	*/
	removeShortcut(shortcut: string, scope: string): void;

	/**
	 * removes the specified layer related to a task
	 * @param layerId a DOM element that will be displayed in the layer
	*/
	removeTaskLayer(layerId: string | number): void;

	/**
	 * renders the whole Gantt chart
	*/
	render(): void;

	/**
	 * updates all markers on the page
	*/
	renderMarkers(): void;

	/**
	 * rebuilds the Gantt layout using the current value of the layout config
	*/
	resetLayout(): void;

	/**
	 * removes the current lightbox's HTML object element
	*/
	resetLightbox(): void;

	/**
	 * re-calculates the duration of a project task depending on the dates of its children
	 * @param task the task's object
	*/
	resetProjectDates(task: Task): void;

	/**
	 * re-calculates the skin's settings from the related attached skin CSS file
	*/
	resetSkin(): void;

	/**
	 * forces the lightbox to resize
	*/
	resizeLightbox(): void;

	/**
	 * rounds the specified date to the nearest date in the time scale
	 * @param date the Date object to round or an object with settings
	*/
	roundDate(date: Date | RoundDateConfig): Date;

	/**
	 * Rounds the supplied task's dates using the drag rounding and working-time settings.
	 * During a move or resize of this task, uses that drag's mode and resize edge.
	 * Otherwise, rounds the start as a move and calculates the end from its duration.
	 * Mutates only the supplied task. Pass a copy to preview dates during a drag.
	 * @param task the task object to round
	*/
	roundTaskDates(task: Task): void;

	/**
	 * scrolls the layout view to the specified position
	 * @param name the name of the layout view
	 * @param x optional, the value of the horizontal scroll or 'null' (if the scroll position shouldn't be changed)
	 * @param y optional, the value of the vertical scroll or 'null' (if the scroll position shouldn't be changed)
	*/
	scrollLayoutCell(name: string, x: number | null, y: number | null): void;

	/**
	 * scrolls the Gantt container to the specified position
	 * @param x optional, the value of the horizontal scroll or 'null' (if the scroll position shouldn't be changed)
	 * @param y optional, the value of the vertical scroll or 'null' (if the scroll position shouldn't be changed)
	*/
	scrollTo(x?: number | null, y?: number | null): void;

	/**
	 * selects the specified task
	 * @param id the task id
	*/
	selectTask(id: string | number): string | number | false | null;

	/**
	 * serializes the data into JSON or XML format
	 * @param type the format that the data will be serialized into. <br> Possible values: 'json' (<i>default</i> ), 'xml'.
	 * @param options.order the task order used for `json` serialization. `"display"` walks
	 * the current grid order; `"canonical"` walks stored WBS order and ignores sort, filter
	 * and collapsing. Defaults to `"canonical"` once the `wbs` extension is active,
	 * `"display"` otherwise.
	*/
	serialize(type?: string, options?: { order?: "display" | "canonical" }): any;

	/**
	 * returns a list of options
	 * @param list_name the name of a list
	 * @param options an array of options
	*/
	serverList(list_name: string | number, options?: any[]): any[];

	/**
	 * set the parent for a task
	 * @param task the task object
	 * @param pid the parent task id
	*/
	setParent(task: Task, pid: number | string): void;

	/**
	 * resizes the Gantt chart
	*/
	setSizes(): void;

	/**
	 * sets the active skin
	 * @param skin the name of the skin. The allowed values are: "terrace", "dark", "material", "contrast-white", "contrast-black", "meadow", "skyblue", "broadway"
	*/
	setSkin(skin: string): void;

	/**
	 * sets the working time for the Gantt chart
	 * @param config the configuration object of a time span
	*/
	setWorkTime: Calendar["setWorkTime"];

	/**
	 * shows the lightbox modal overlay that blocks interactions with the remaining screen
	 * @param box an element to hide
	*/
	showCover(box?: HTMLElement): void;

	/**
	 * scrolls the chart area to makes the specified date visible
	 * @param date the date to show in the chart
	*/
	showDate(date: Date): void;

	/**
	 * opens the lightbox for the specified task
	 * @param id the task id
	*/
	showLightbox(id: string | number): void;

	/**
	 * displays the pop-up task form for the specified task
	 * @param id the task id
	*/
	showQuickInfo(id: string | number): void;

	/**
	 * makes the specified task visible on the screen
	 * @param id the task id
	*/
	showTask(id: string | number): void;

	/**
	 * makes all code inside it not to trigger internal events or server-side calls
	 * @param callback the callback function
	*/
	silent(callback: GanttCallback): void;

	/**
	 * sorts tasks in the grid
	 * @param field the name of the column that the  grid will be sorted by or a custom sorting function
	 * @param desc specifies the sorting direction: <i>true</i> - descending sort and <i>false</i> - ascending<br> sort. By default, <i>false</i>
	 * @param parent the id of the parent task. Specify the parameter if you want to sort tasks only in the branch of the specified parent.
	 * @param silent specifies whether rendering should be invoked after reordering items
	*/
	sort(field: string | ((task1: Task, task2: Task) => 1 | 0 | -1), desc?: boolean, parent?: string | number, silent?: boolean): void;

	/**
	 * selects the specified task if it was unselected and vice versa
	 * @param taskId the task's id
	*/
	toggleTaskSelection?(taskId: string | number): void;

	/**
	 * returns a unique id
	*/
	uid(): number;

	/**
	 * reverts the changes made in the gantt
	*/
	undo(): void;

	/**
	 * removes selection from the selected task
	 * @param id optional, the id of the task to remove selection from, see details
	*/
	unselectTask(id?: string | number | null): Id | null | undefined;

	/**
	 * unsets a working time in the Gantt Chart
	 * @param config the configuration object of a time span
	*/
	unsetWorkTime: Calendar["unsetWorkTime"];

	/**
	 * updates the specified collection with new options
	 * @param collection the name of the collection to update
	 * @param options the new values of the collection
	*/
	updateCollection(collection: string | number, options: any[]): boolean;

	/**
	 * updates the specified dependency link
	 * @param id the task id
	*/
	updateLink(id: string | number): void;

	/**
	 * updates the specified marker
	 * @param markerId the marker's id
	*/
	updateMarker(markerId: string | number): void;

	/**
	 * updates the specified task
	 * @param id the task id
	 * @param newState optional, the new values of the task
	*/
	updateTask(id: string | number, newState?: Task): void;

	/**
	 * updates the resource property of the task object with the values of the resource assignments from the datastore
	 * @param taskId the task id
	*/
	updateTaskAssignments(taskId: number | string): void;
}

export interface CustomTypeRenderers {

	/**
	 * a custom render function for the *task* type
	 * @param optional, a custom render function for the *task* type
	 * @param optional, a custom render function for the *project* type
	 * @param optional, a custom render function for the *milestone* type
	 * @param optional, a custom render function for the custom task type
	*/
	type_renderers: {
		task?: CustomTypeRenderers["typeRenderer"],
		project?: CustomTypeRenderers["typeRenderer"],
		milestone?: CustomTypeRenderers["typeRenderer"],
		[typeName: string]: CustomTypeRenderers["typeRenderer"] | undefined
	}

	/**
	 * a function takes a task's object as a parameter and must return a DOM element that will be displayed instead of the task bar.
	 * @param the task object
	 * @param optional, the default render function used in the dhtmlxGantt
	*/
	typeRenderer(task: Task, defaultRender?: AdditionalTaskLayer["TaskLayerRender"]): HTMLElement | boolean | void | undefined
}

export interface AdditionalTaskLayer {

	/**
	 * a function takes a task's object as a parameter and must return a DOM element that will be displayed in the layer.
	 * @param the task object
	 * @param the timeline view
	 * @param the Gantt configuration object
	 * @param the viewport object
	*/
	TaskLayerRender(
		task: Task,
		timeline?: any,
		config?: GanttConfigOptions,
		viewport?: AdditionalTaskLayer["LayerViewport"]
	): HTMLElement | boolean | void

	/**
	 * the configuration object for the additional task layer. Has the following properties:
	 * @param optional, the layer ID
	 * @param mandatory, a function that answers for rendering the layer's elements
	 * @param the function that returns HTML element that should be rendered
	 * @param optional, a function where you can update the rendered HTML elements
	 * @param the task object
	 * @param the container of the rendered node
	 * @param the timeline view
	 * @param the Gantt configuration object
	 * @param the viewport object
	 * @param optional, this function is called after rendering is complete. You can use it to render native components (for example, using the `ReactDOM.render` method)
	 * @param the task object
	 * @param the container of the rendered node
	 * @param the layout cell where the layer is added (timeline, by default)
	 * @param optional, a function that returns the coordinates of the viewport rectangle
	 * @param the task object
	 * @param the layout cell where the layer is added (timeline, by default)
	 * @param the Gantt configuration object
	 * @param the Gantt object
	 * @param a function that returns the object with of the visible range
	 * @param the Gantt object
	 * @param the layout cell where the layer is added (timeline, by default)
	 * @param the Gantt configuration object
	 * @param the task datastore object
	 * @param the viewport object
	 * @param optional, a layer's container
	 * @param optional, if true, the element will be displayed over the task
	 * @param optional, a function that takes a task object as a parameter. If returns 'false', the 'renderer' function won't be called for a task
	 * @param the task object
	*/
	TaskLayerConfig: {
		id?: string | number,
		renderer: {
			render: AdditionalTaskLayer["TaskLayerRender"],
			update?: ((
				task: Task,
				node: HTMLElement,
				timeline?: any,
				config?: GanttConfigOptions,
				viewport?: AdditionalTaskLayer["LayerViewport"],
			) => void),
			onrender?: ((
				task: Task,
				node: HTMLElement,
				view?: any,
			) => void),
			getRectangle?: ((
				task: Task,
				view?: any,
				config?: GanttConfigOptions,
				gantt?: GanttStatic,
			) => { left: number, top: number, height: number, width: number } | void),
			getVisibleRange: ((
				gantt?: GanttStatic,
				view?: any,
				config?: GanttConfigOptions,
				datastore?: any,
				viewport?: AdditionalTaskLayer["LayerViewport"],
			) => { start: number, end: number } | undefined | void),
		},
		container?: HTMLElement,
		topmost?: boolean,
		filter?: ((
			task: Task,
		) => boolean)
	}

	/**
	 * the layer viewport object
	 * @param the left rectangle position
	 * @param the right rectangle position
	 * @param the top rectangle position
	 * @param the bottom rectangle position
	 * @param the rectangle width
	 * @param the rectangle height
	*/
	LayerViewport: {
		x: number,
		x_end: number,
		y: number,
		y_end: number,
		width: number,
		height: number
	}
}

export interface AdditionalLinkLayer {

	/**
	 * a function takes a link's object as a parameter and must return a DOM element that will be displayed in the layer.
	 * @param the link object
	 * @param optional, the timeline view
	 * @param optional, the Gantt configuration object
	 * @param optional, the viewport object
	*/
	LinkLayerRender(
		link: Link,
		timeline?: any,
		config?: GanttConfigOptions,
		viewport?: AdditionalTaskLayer["LayerViewport"]
	): HTMLElement | boolean | void

	/**
	 * the configuration object for the additional link layer. Has the following properties:
	 * @param optional, the layer ID
	 * @param mandatory, a function that answers for rendering the layer's elements
	 * @param the function that returns HTML element that should be rendered
	 * @param optional, a function where you can update the rendered HTML elements
	 * @param the link object
	 * @param the container of the rendered node
	 * @param optional, the timeline view
	 * @param optional, the Gantt configuration object
	 * @param optional, the viewport object
	 * @param optional, this function is called after rendering is complete. You can use it to render native components (for example, using the `ReactDOM.render` method)
	 * @param the link object
	 * @param the container of the rendered node
	 * @param optional, the layout cell where the layer is added (timeline, by default)
	 * @param optional, a function that returns the coordinates of the viewport rectangle
	 * @param the link object
	 * @param optional, the layout cell where the layer is added (timeline, by default)
	 * @param optional, the Gantt configuration object
	 * @param optional, the Gantt object
	 * @param a function that returns the object with of the visible range
	 * @param optional, the Gantt object
	 * @param optional, the layout cell where the layer is added (timeline, by default)
	 * @param optional, the Gantt configuration object
	 * @param optional, the link datastore object
	 * @param optional, the viewport object
	 * @param optional, the layer's container
	 * @param optional, if true, the element will be displayed over the link
	 * @param optional, a function that takes a link object as a parameter. If returns 'false', the 'renderer' function won't be called for a link
	 * @param the link object
	*/
	LinkLayerConfig: {
		id?: string | number,
		renderer: {
			render: AdditionalLinkLayer["LinkLayerRender"],
			update?: ((
				link: Link,
				node: HTMLElement,
				timeline?: any,
				config?: GanttConfigOptions,
				viewport?: AdditionalTaskLayer["LayerViewport"],
			) => void),
			onrender?: ((
				link: Link,
				node: HTMLElement,
				view?: any,
			) => void),
			getRectangle?: ((
				link: Link,
				view?: any,
				config?: GanttConfigOptions,
				gantt?: GanttStatic,
			) => { left: number, top: number, height: number, width: number } | void),
			getVisibleRange: ((
				gantt?: GanttStatic,
				view?: any,
				config?: GanttConfigOptions,
				datastore?: any,
				viewport?: AdditionalTaskLayer["LayerViewport"],
			) => { start: number, end: number } | undefined | void),
		},
		container?: HTMLElement,
		topmost?: boolean,
		filter?: ((
			link: Link,
		) => boolean)
	}

	/**
	 * the layer viewport object
	 * @param the left rectangle position
	 * @param the right rectangle position
	 * @param the top rectangle position
	 * @param the bottom rectangle position
	 * @param the rectangle width
	 * @param the rectangle height
	*/
	LayerViewport: {
		x: number,
		x_end: number,
		y: number,
		y_end: number,
		width: number,
		height: number
	}
}

export type DatastoreItem = {
	id: Id;
	[customProperty: string]: any;
};

export interface TreeDatastoreItem extends DatastoreItem {
	parent: Id | null;
	$expanded_branch: boolean;
	$level: number;
	$local_index: number;
	$open: boolean;
	$rendered_parent: Id | null;

	open?: boolean;
	$drop_target?: Id | string;
	$index?: number;
}

export interface Task {

	/**
	 * The task id, auto-generated if not set
	*/
	id: string | number,

	/**
	 * The date when a task is scheduled to begin. If not specified, Gantt will calculate it based on the end_date and duration properties.The property becomes optional when setting unscheduled: true.
	*/
	start_date?: Date,

	/**
	 * The date when a task is scheduled to be completed. If not specified, Gantt will calculate it based on the start_date and duration properties.The property becomes optional when setting unscheduled: true.
	*/
	end_date?: Date,

	/**
	 * The task duration. If not specified, Gantt will calculate it based on the start_date and end_date properties.
	*/
	duration?: number,

	/**
	 * Defines whether gantt should do auto-scheduling of the task (true or not specified) or not (false)
	*/
	auto_scheduling?: boolean,

	/**
	 * Defines whether the task takes part in the project (true or not specified) or is inactive (false).
	 * An inactive task is not scheduled, is styled as inactive, doesn't roll up and is not counted by
	 * getSubtaskDuration(); the flag applies to the whole branch.
	 * Change it through updateTask(), addTask() or parse(): after a direct change followed only by
	 * a repaint, the chart, the summary dates and the scheduling can disagree.
	*/
	active?: boolean,

	/**
	 * total work/effort in `config.effort.work_unit`.
	 * Derived from dates and assignments if not set. Requires `config.effort.enabled`.
	*/
	work?: number,

	/**
	 * which axis of `Work = Duration × Units` is held
	 * constant. Defaults to `config.effort.mode`.
	*/
	scheduling_mode?: "fixed_duration" | "fixed_units" | "fixed_work",

	/**
	 * keep Work constant when assignments are added or
	 * removed. Defaults to `config.effort.effort_driven`.
	*/
	effort_driven?: boolean,

	/**
	 * Sets the height of the DOM element of the task in the timeline area
	*/
	bar_height?: number,

	/**
	 * An array with the baselines
	*/
	baselines?: Baseline[],

	/**
	 * Sets the id of the custom calendar to be assigned to the task. The name of the property depends on the value of the calendar_property option
	*/
	calendar_id?: number | string,

	/**
	 * Sets the color of the task in the timeline area (i.e. sets background-color for the gantt_task_line element of the task)
	*/
	color?: string,

	/**
	 * The date of the task constraint. It is added to the task object when auto-scheduling with time constraints is enabled. The property isn't used if auto_scheduling_compatibility is enabled.
	*/
	constraint_date?: Date,

	/**
	 * The type of the task constraint ("asap", "alap", "snet", "snlt", "fnet", "fnlt", "mso", "mfo"). It is added to the task object when auto-scheduling with time constraints is enabled. The property isn't used if auto_scheduling_compatibility is enabled.
	*/
	constraint_type?: string,

	/**
	 * Specifies the deadline date for the task. A [visual indicator](desktop/inbuilt_baselines.md#deadlinesandconstraints) is displayed in the timeline when this property is set.
	*/
	deadline?: Date,

	/**
	 * Defines whether the task can be editable in the read-only Gantt chart. The name of the property depends on the value of the editable_property option
	*/
	editable?: boolean,

	/**
	 * The group's id. It is added to the tasks grouped by some criterion if the property used for grouping tasks (relation_property in the groupBy() method) is specified as an object.
	*/
	group_id?: string | number,

	/**
	 * Defines whether a task (type:"task") or milestone (type:"milestone") should be hidden in the timeline area
	*/
	hide_bar?: boolean,

	/**
	 * The key of the group. It is added to the tasks grouped by some criterion if the property used for grouping tasks (relation_property in the groupBy() method) is specified as an array.It is also added to the tasks with the name of the group (for example, to the "High", "Normal", "Low" tasks if you've grouped tasks by priority. Check the example).
	*/
	key?: string | number,

	/**
	 * The label of the group. It is added to the tasks with the name of the group (for example, if you've grouped tasks by priority, the property will be added to the tasks with "High", "Normal", "Low" names. Check the example).
	*/
	label?: string,

	/**
	 * The resource leveling delay: how far leveling moved the task from the position the scheduler would give it
	 * (later than the earliest start in forward planning, earlier than the latest end with schedule_from_end).
	 * Elapsed time in `duration_unit` that ignores working calendars (a day is 24 hours); `start_date` and
	 * `end_date` already include it. Written by resource leveling; a manual move of the task clears it.
	*/
	leveling_delay?: number,

	/**
	 * Pauses inside the task, written by resource leveling (MS Project "split" model). Each pause starts `at` after
	 * the task start and lasts `length`, both elapsed time in `duration_unit` (a day is 24 hours, fractions allowed);
	 * sorted by `at`, not overlapping. The task works its `duration` (working time) outside the pauses, and
	 * `start_date`/`end_date` are the real bar bounds. Changing the dates or the duration never modifies the list.
	 * Applies to regular tasks only.
	*/
	pauses?: TaskPause[],

	/**
	 * Specifies whether the task branch will be opened initially (to show child tasks). To close/open the branch after Gantt initialization, use the related methods: close() and open()
	*/
	open?: boolean,

	/**
	 * The id of the parent task. If the specified parent doesn't exist, the task won't be rendered in the Gantt. The id of the root task is specified by the api/gantt_root_id_config.md config.
	*/
	parent?: number | string,

	/**
	 * The task's progress (from 0 to 1)
	*/
	progress?: number,

	/**
	 * The color of the task progress in the timeline area (i.e. sets background-color for the gantt_task_progress element of the task progress)
	*/
	progressColor?: string,

	/**
	 * Defines whether the task must be readonly. The name of the property depends on the value of the readonly_property option
	*/
	readonly?: boolean,

	/**
	 * Defines how subtasks of the task must be displayed. Values: "split" | "". If set to "split", the subtasks will be displayed in one row. In addition, if you enable the open_split_tasks property, the subtasks will be rendered in one row only if the task is collapsed.
	*/
	render?: string,

	/**
	 * An array with resources assigned to the task. It is added to the task object when importing data from MS Project/Primavera
	*/
	resource?: Array<string>,

	/**
	 * Specifies whether a task (type:"task") or milestone (type:"milestone") should appear on the parent projects.
	*/
	rollup?: boolean,

	/**
	 * Sets the height for the task's row
	*/
	row_height?: number,

	/**
	 * Defines how split task must be displayed. The available values are:
		"inline" - subtask is always displayed in the same row as the parent task.
		"subrow" - subtask is always displayed its own row (like a regular subtask) under it's `render:"split"` parent.
		"auto" -  default behavior. When `render:"split"` parent is collapsed, subtasks will be displayed in the parents row (like with "inline"), if the parent is expanded, tge subtask will be displayed in its own row.
				Default value: "auto"
	*/
	split_placement?: "inline" | "subrow" | "auto" | null | undefined,

	/**
	 * The id of the target task. The property displays the same value as the $drop_target property. The property is added to the task object only if Data Processor is enabled, after the task is updated and data is sent to the server.
	*/
	target?: string,

	/**
	 * The name of the task. If necessary you may use any other name for this property.The property is used in default configurations of different parts of Gantt.
	*/
	text?: any,

	/**
	 * The color of the task's text in the timeline area (i.e. sets color for the gantt_task_line element of the task)
	*/
	textColor?: string,

	/**
	 * the task type. The available values are stored in the api/gantt_types_config.md object:
				"task" -  a regular task (default value).
				"project" -  a task that starts, when its earliest child task starts, and ends, when its latest child ends. 
				The start_date, end_date, duration properties are ignored for such tasks. 
				"milestone" -  a zero-duration task that is used to mark out important dates of the project.
				The duration, progress, end_date properties are ignored for such tasks.
	*/
	type?: string,

	/**
	 * Defines whether the task must be unscheduled. By default, the unscheduled task isn't displayed in the timeline area, empty values are displayed in the grid instead of the start and end dates.
	*/
	unscheduled?: boolean,

	/**
	 * A computed end date of the project task from its subtasks. Added and updated when "auto_scheduling" is disabled.
	*/
	$auto_end_date?: Date,

	/**
	 * A computed start date of the project task from its subtasks. Added and updated when "auto_scheduling" is disabled.
	*/
	$auto_start_date?: Date,

	/**
	 * A system property that is used in internal calculations.
	*/
	$calculate_duration?: boolean,

	/**
	 * An object which contains custom properties of a task which were defined in the importFromMSProject() and importFromPrimaveraP6() methods
	*/
	$custom_data?: object,

	/**
	 * A system property which defines whether the task has been updated. It is added to the task object when Data Processor is enabled. If the value of the property is "updated", the task's text will be bold in the grid but it is possible to define your own styles via CSS.
	*/
	$dataprocessor_class?: string,

	/**
	 * The id of the target task. A temporary property which is added to the task object when dragging the task vertically.
	*/
	$drop_target?: string,

	/**
	 * The id of the calendar (or resource calendar) assigned to the task. A system property that is used in internal calculations.
	*/
	$effective_calendar?: string,

	/**
	 * A system property which shows whether the task is visible depending on whether the task's parents are expanded or not. If at least one parent is collapsed, the task won't be visible. The exception is only split tasks (subtasks).
	*/
	$expanded_branch?: boolean,

	/**
	 * Defines whether the Gantt should send a request to the server to load the first-level subtasks of the task. The property is used when the branch_loading property is enabled. The name of the property depends on the value of the branch_loading_property option.
	*/
	$has_child?: boolean,

	/**
	 * The global vertical position of the task. It is bound to the task and changes if the tasks below or above are open or closed. If the parent of the task is collapsed, the property doesn't show the actual position of the task.
	*/
	$index?: number,

	/**
	 * The task's level in the tasks hierarchy (zero-based numbering)
	*/
	$level?: number,

	/**
	 * The vertical position of the task in the branch (under the parent). It isn't bound to the task and doesn't change if the tasks below or above are open or closed as inside the branch as globally. If the parent of the task is collapsed, the property doesn't show the actual position of the task.
	*/
	$local_index?: number,

	/**
	 * It is added for a new task when it is created via the createTask() method or via the "+" button. The property is added to the task object when you open the lightbox, and is removed after you save the task.
	*/
	$new?: boolean,

	/**
	 * Required, a system property which is added to the task object. True if the end_date property couldn't be calculated (when the start_date property is loaded but there is no duration or end_date one). In this case, you cannot move or resize the task. The end_date property will depend on the end_date of the subtasks (if any). The start_date property will be fixed and won't change. Auto-scheduling won't work for such a task. If the $no_start property is enabled, the task will fully depend on the dates of its subtasks or on the date of the first task.
	*/
	$no_end?: boolean,

	/**
	 * Required, a system property which is added to the task object. True if the start_date property couldn't be calculated (when the end_date property is loaded but there is no duration or start_date one). The start_date property will depend on the start_date of the subtasks (if any) or on the start date of the first task. The end_date property will be fixed and will change only if the start date of the subtasks/first task is bigger than the end date of the task. Auto-scheduling won't work for such a task. If the $no_end property is enabled, the task will fully depend on the dates of its subtasks or on the date of the first task.
	*/
	$no_start?: boolean,

	/**
	 * A system property which specifies whether the task is currently opened (true). If you change the value of the property and re-draw the Gantt, it will open or close the task. To change the state of the task, you may also apply the open() or close() methods.
	*/
	$open?: boolean,

	/**
	 * An object with original names of task properties which were imported from MS Project / Primavera into the export module (export server). The properties appear in the $raw object while the file is converted into JSON-format but before they are converted into names and format expected by Gantt.
	*/
	$raw?: object,

	/**
	 * The id of a row the rollup item / split task is rendered at. This is the temporary property which appears in the object of the rollup/split task only when it's been rendering on the page.
	*/
	$rendered_at?: string | number,

	/**
	 * The id of the parent under which the task is rendered (not id of the real parent of the task). The property is used in internal calculations and on tasks' grouping.
	*/
	$rendered_parent?: number | string,

	/**
	 * The type of the rendered task (a temporary property).
	*/
	$rendered_type?: string,

	/**
	 * An array with ids of resources assigned to the task (a temporary property). But the most actual data is stored in the store of resource assignments not in this property.
	*/
	$resourceAssignments?: Array<any>,

	/**
	 * An array with ids of tasks and milestones which have appeared on the current task
	*/
	$rollup?: Array<string | number>,

	/**
	 * Required, an array with ids of all links that come out of the task
	*/
	$source?: Array<string | number>,

	/**
	 * Appears if the task is a subtask of a split task (i.e. arranges in one row with other subtasks)
	*/
	$split_subtask?: boolean,

	/**
	 * Required, an array with ids of links that come into task
	*/
	$target?: Array<string | number>,

	/**
	 * A temporary property which is added to the task object when dragging the task vertically. The task looks a little bit transparent in grid on vertical dragging due to this property.
	*/
	$transparent?: boolean,

	/**
	 * It is added to the tasks grouped by some criterion. After the grouping is reset, tasks with $virtual: true are removed
	*/
	$virtual?: boolean,

	/**
	 * The WBS code of the task (a temporary property). It is added to the task object after applying the getWBSCode() method. If the value of the code has changed (the task's parent or position has been changed), you need to call the getWBSCode() method again to get the updated value of the code.
	 * Legacy outline-number API (GS-3626): a derived, display-order value, not a stored WBS
	 * code. Kept unchanged, with no removal planned - see
	 * docs/internal/wbs-codes-and-outline-numbers/design.md#6-compatibility for the migration
	 * path to `getOutlineNumber()` or the stored `wbs` extension.
	*/
	$wbs?: string,

	[customProperty: string]: any;

}

export interface Link {

	/**
	 * the link id
	*/
	id: string | number,

	/**
	 * the id of a task that the dependency will start from
	*/
	source: string | number,

	/**
	 * the id of a task that the dependency will end with.
	*/
	target: string | number,

	/**
	 * the dependency type. The available values are stored in the api/gantt_links_config.md object. By default, they are:
				"0" -  'finish_to_start'.
				"1" -  'start_to_start'.
				"2" -  'finish_to_finish'.
				"3" -  'start_to_finish'.
	*/
	type: string,

	/**
	 * the task's lag
	*/
	lag?: number,

	/**
	 * can mark link as readonly
	*/
	readonly?: boolean,

	/**
	 * can mark link as editable
	*/
	editable?: boolean,

	/**
	 * Defines whether the link is taken into account by the auto-scheduling engine (true or not
	 * specified) or is inactive (false). An inactive link stays in the data and is displayed with
	 * an inactive style.
	 * Change it through updateLink(), addLink() or parse(): after a direct change followed only by
	 * a repaint, the chart and the scheduling can disagree.
	*/
	active?: boolean,

	[customProperty: string]: any;

}

export interface Baseline {

	/**
	 * the baseline ID
	*/
	id: string | number,

	/**
	 * the ID of the task the baseline belongs to
	*/
	task_id: string | number,

	/**
	 * the start date of the baseline
	*/
	start_date: Date,

	/**
	 * the duration of the baseline
	*/
	duration: number,

	/**
	 * the end date of the baseline
	*/
	end_date: Date,

	/**
	 * any custom property
	*/
	[customProperty: string]: any
}

export interface ResourceItem {

	/**
	 * the ID of the resource item
	*/
	id: string | number,

	/**
	 * indicates whether the resource item is expanded in the tree (*true*) or collapsed (*false*)
	*/
	open?: boolean,

	/**
	 * the ID of the resource item's parent
	*/
	parent?: string | number,

	/**
	 * the resource name
	*/
	text?: string,

	/**
	 * the unit for the assignments
	*/
	unit?: string,

	/**
	 * the value that is assigned by default when adding the assignment in the lightbox section
	*/
	default_value?: string | number,

	/**
	 * any custom property
	*/
	[customProperty: string]: any
}

export interface ResourceAssignment {

	/**
	 * the id of the assignment
	*/
	id: string | number,

	/**
	 * the ID of the task the resource is assigned to.
	*/
	task_id: string | number,

	/**
	 * the ID of the resource that is assigned to the task.
	*/
	resource_id: string | number,

	/**
	 * the quantity of the resources assigned to a task
	*/
	value: number | string,

	/**
	 * the difference between the assignment start date and the task start date
	*/
	delay: number,

	/**
	 * the date the assignment should start
	*/
	start_date: Date,

	/**
	 * the date the assignment should end
	*/
	end_date: Date,

	/**
	 * the duration of the assignment
	*/
	duration: number,

	/**
	 * the calculation mode of the time of the resource assignment: "default"|"fixedDates"|"fixedDuration"
	*/
	mode: string,

	/**
	 * any custom property
	*/
	[customProperty: string]: any
}

/* Simplified resource assignemts that were used in old Gantt version */
export interface OldResourceAssignment {
	resource_id: string | number | any[];
	value?: number | string;
	[key: string]: any;
}

/**
 * Utility type used by the "add" methods (gantt.addTask(), gantt.addLink(), etc.):
 * the entity `id` becomes optional because Gantt generates one automatically when it
 * is not provided. The conditional makes the type distribute over unions, so each
 * member of the union keeps its own shape (e.g. SerializedTask vs Task date fields).
*/
export type WithOptionalId<T> = T extends unknown ? Omit<T, "id"> & { id?: string | number } : never

/**
 * A pause inside a task (`task.pauses`), written by resource leveling.
*/
export interface TaskPause {
	/** Elapsed time in `duration_unit` from the task start to the pause start, >= 0. */
	at: number,
	/** Elapsed length of the pause in `duration_unit`, > 0. */
	length: number,
	/** "leveling" on every pause that resource leveling writes. */
	by?: "leveling",
}

/**
 * Serialized (JSON-compatible) representation of a task.
 * Date fields are strings only - this shape can be safely passed through JSON.stringify/JSON.parse.
 * Used in gantt.parse(), gantt.load() responses, and DataProcessor server exchange.
 * Methods like gantt.parse() and gantt.addTask() accept both SerializedTask and Task.
*/
export interface SerializedTask {
	/**
	 * The task id, auto-generated if not set
	*/
	id?: string | number,

	/**
	 * The date when a task is scheduled to begin, as a date string matching the date_format config or ISO 8601.
	 * If not specified, Gantt will calculate it based on the end_date and duration properties.
	 * The property becomes optional when setting unscheduled: true.
	*/
	start_date?: string,

	/**
	 * The date when a task is scheduled to be completed, as a date string.
	 * If not specified, Gantt will calculate it based on the start_date and duration properties.
	 * The property becomes optional when setting unscheduled: true.
	*/
	end_date?: string,

	/**
	 * The task duration. If not specified, Gantt will calculate it based on the start_date and end_date properties.
	*/
	duration?: number,

	/**
	 * The name of the task. If necessary you may use any other name for this property.
	 * The property is used in default configurations of different parts of Gantt.
	*/
	text?: any,

	/**
	 * the task type. The available values are stored in the api/gantt_types_config.md object:
	 * "task" - a regular task (default value).
	 * "project" - a task that starts, when its earliest child task starts, and ends, when its latest child ends.
	 * "milestone" - a zero-duration task that is used to mark out important dates of the project.
	*/
	type?: string,

	/**
	 * The id of the parent task. If the specified parent doesn't exist, the task won't be rendered in the Gantt.
	 * The id of the root task is specified by the api/gantt_root_id_config.md config.
	*/
	parent?: number | string,

	/**
	 * The task's progress (from 0 to 1)
	*/
	progress?: number,

	/**
	 * Specifies whether the task branch will be opened initially (to show child tasks).
	*/
	open?: boolean,

	/**
	 * Defines whether gantt should do auto-scheduling of the task (true or not specified) or not (false)
	*/
	auto_scheduling?: boolean,

	/**
	 * Defines whether the task takes part in the project (true or not specified) or is inactive (false).
	 * An inactive task is not scheduled, is styled as inactive, doesn't roll up and is not counted by
	 * getSubtaskDuration(); the flag applies to the whole branch.
	 * Change it through updateTask(), addTask() or parse(): after a direct change followed only by
	 * a repaint, the chart, the summary dates and the scheduling can disagree.
	*/
	active?: boolean,

	/**
	 * Total work/effort in `config.effort.work_unit`.
	 * Derived from dates and assignments if not set. Requires `config.effort.enabled`.
	*/
	work?: number,

	/**
	 * Which axis of `Work = Duration × Units` is held constant. Defaults to `config.effort.mode`.
	*/
	scheduling_mode?: "fixed_duration" | "fixed_units" | "fixed_work",

	/**
	 * Keep Work constant when assignments are added or removed. Defaults to `config.effort.effort_driven`.
	*/
	effort_driven?: boolean,

	/**
	 * Defines whether the task must be unscheduled.
	*/
	unscheduled?: boolean,

	/**
	 * The date of the task constraint, as a date string.
	*/
	constraint_date?: string,

	/**
	 * The type of the task constraint ("asap", "alap", "snet", "snlt", "fnet", "fnlt", "mso", "mfo").
	*/
	constraint_type?: string,

	/**
	 * Specifies the deadline date for the task, as a date string.
	*/
	deadline?: string,

	/**
	 * The resource leveling delay in `duration_unit`, as elapsed time that ignores working calendars.
	*/
	leveling_delay?: number | string,

	/**
	 * Pauses inside the task: a list of `{ at, length, by? }`, or that list as a JSON string.
	*/
	pauses?: TaskPause[] | string,

	/**
	 * Sets the color of the task in the timeline area
	*/
	color?: string,

	/**
	 * The color of the task's text in the timeline area
	*/
	textColor?: string,

	/**
	 * The color of the task progress in the timeline area
	*/
	progressColor?: string,

	/**
	 * Sets the height of the DOM element of the task in the timeline area
	*/
	bar_height?: number,

	/**
	 * Sets the height for the task's row
	*/
	row_height?: number,

	/**
	 * Defines whether a task (type:"task") or milestone (type:"milestone") should be hidden in the timeline area
	*/
	hide_bar?: boolean,

	/**
	 * An array with the baselines
	*/
	baselines?: (SerializedBaseline | Baseline)[],

	/**
	 * Sets the id of the custom calendar to be assigned to the task.
	*/
	calendar_id?: number | string,

	/**
	 * Defines whether the task can be editable in the read-only Gantt chart.
	*/
	editable?: boolean,

	/**
	 * Defines whether the task must be readonly.
	*/
	readonly?: boolean,

	/**
	 * Defines how subtasks of the task must be displayed. Values: "split" | "".
	*/
	render?: string,

	/**
	 * Defines how split task must be displayed: "inline" | "subrow" | "auto".
	*/
	split_placement?: "inline" | "subrow" | "auto" | null | undefined,

	/**
	 * An array with resources assigned to the task.
	*/
	resource?: Array<string>,

	/**
	 * Specifies whether a task (type:"task") or milestone (type:"milestone") should appear on the parent projects.
	*/
	rollup?: boolean,

	/**
	 * The group's id.
	*/
	group_id?: string | number,

	/**
	 * The key of the group.
	*/
	key?: string | number,

	/**
	 * The label of the group.
	*/
	label?: string,

	/**
	 * The id of the target task.
	*/
	target?: string,

	[customProperty: string]: any;
}

/**
 * Serialized (JSON-compatible) representation of a link.
 * Used in gantt.parse(), gantt.load() responses, and DataProcessor server exchange.
*/
export interface SerializedLink {
	/**
	 * The link id
	*/
	id: string | number,

	/**
	 * The id of the source (predecessor) task
	*/
	source: string | number,

	/**
	 * The id of the target (successor) task
	*/
	target: string | number,

	/**
	 * The dependency type.
	 * "0" = finish-to-start, "1" = start-to-start,
	 * "2" = finish-to-finish, "3" = start-to-finish
	*/
	type: string,

	/**
	 * Task lag (in duration units)
	*/
	lag?: number,

	/**
	 * Can mark link as readonly
	*/
	readonly?: boolean,

	/**
	 * Can mark link as editable
	*/
	editable?: boolean,

	[customProperty: string]: any;
}

/**
 * Serialized (JSON-compatible) representation of a baseline.
 * Date fields are strings only.
*/
export interface SerializedBaseline {
	/**
	 * The baseline ID
	*/
	id?: string | number,

	/**
	 * The ID of the task the baseline belongs to
	*/
	task_id?: string | number,

	/**
	 * The start date of the baseline, as a date string
	*/
	start_date?: string,

	/**
	 * The duration of the baseline
	*/
	duration?: number,

	/**
	 * The end date of the baseline, as a date string
	*/
	end_date?: string,

	[customProperty: string]: any;
}

/**
 * Serialized (JSON-compatible) representation of a resource assignment.
 * Date fields are strings only.
*/
export interface SerializedResourceAssignment {
	/**
	 * The id of the assignment
	*/
	id?: string | number,

	/**
	 * The ID of the task the resource is assigned to
	*/
	task_id: string | number,

	/**
	 * The ID of the resource that is assigned to the task
	*/
	resource_id: string | number,

	/**
	 * The quantity of the resources assigned to a task
	*/
	value?: number | string,

	/**
	 * The calculation mode of the time of the resource assignment: "default"|"fixedDates"|"fixedDuration"
	*/
	mode?: string,

	/**
	 * The difference between the assignment start date and the task start date
	*/
	delay?: number,

	/**
	 * The date the assignment should start, as a date string
	*/
	start_date?: string,

	/**
	 * The duration of the assignment
	*/
	duration?: number,

	/**
	 * The date the assignment should end, as a date string
	*/
	end_date?: string,

	[customProperty: string]: any;
}

export interface GridColumn {

	/**
	 * sets the horizontal title alignment. Possible values: *'left'*, *'center'*, or *'right'*
	*/
	align?: string,

	/**
	 * hides/shows a column (PRO)
	*/
	hide?: boolean,

	/**
	 * specifies the title of the column
	*/
	label?: string | number | any,

	/**
	 * sets the maximum column width in case of resize operations
	*/
	max_width?: number,

	/**
	 * sets the minimum column width in case of resize operations
	*/
	min_width?: number,

	/**
	 * defines the column's id. The name 'add' allows you to add a column with the '+' sign.
	 * The names 'predecessors'/'successors' get a default `template` listing the task's
	 * incoming/outgoing links and a default `editor` of the 'predecessor'/'successor' type. Each
	 * default is applied on its own, only when that property is `undefined`: set `template: null`
	 * to show the task property of the same name instead, `editor: null` for no inline editor.
	 * By default, a column named 'duration' shows the raw duration value; see `default_formatter`
	*/
	name?: string | number,

	/**
	 * off by default. When `true` on a column named 'duration' that has no `template`, the column
	 * shows the value through the default duration formatter
	 * (`gantt.ext.formatters.durationFormatter()`), e.g. "5 days" instead of "5". In the MIT
	 * edition the default duration formatter is numeric, so the value has no unit
	*/
	default_formatter?: boolean,

	/**
	 * enables the possibility to resize a column by dragging the column's border (PRO)
	*/
	resize?: boolean,

	/**
	 * indicates that the related column should display a tree
	*/
	tree?: boolean,

	/**
	 * defines the width of the column
	*/
	width?: number | string,

	/**
	 * attached inline editor
	 * @param the type of the inline editor
	 * @param specifies which property of the task should be updated by the inline editor
	 * @param minimal value for the date and duration types
	 * @param maximal value for the date and duration types
	 * @param an array with the options for the select types
	 * @param formatter for the date, predecessor and successor types
	*/
	editor?: {
		type: string,
		map_to: string,
		min?: Date | number,
		max?: Date | number,
		options?: Array<any>,
		formatter?: DurationFormatter | LinkFormatter
	},

	/**
	 * sets a data template
	 * @param the Task object
	*/
	template?(task: Task): any,

	/**
	 * optional, a callback function for rendering a cell into the DOM. The function takes a task object and the DOM element of the grid cell as parameters and may return a component of the framework. See details here
	 * @param the Task object
	 * @param the HTML element of the Grid cell
	*/
	onrender?(task: Task, node: HTMLElement): any,

	/**
	 * the configuration of sorting after clicking on the column header. When the property is set to *false*, sorting is disabled. You can also set a different task property in the *string* to sort the column or use a custom sorting function:
	 * @param an object of the first task that will be sorted
	 * @param an object of the second task that will be sorted
	*/
	sort?: boolean | string | ((task1: Task, task2: Task,) => any)
}

export interface LightboxSections {

	/**
	 * optional, turns the advanced (tabbed) task form of the `task_form` plugin on or off.
	 * With the plugin active the form is on unless this is `false`. Without the plugin the
	 * setting has no effect; a build that has no plugin (MIT/GPL) ignores it
	*/
	advanced?: boolean,

	/**
	 * optional, the lightbox sections for regular tasks: either the flat array or,
	 * for the advanced form, the tab-grouped object
	*/
	sections?: LightboxSectionEntry[] | LightboxTabSections,

	/**
	 * optional, the lightbox sections for project tasks
	*/
	project_sections?: LightboxSectionEntry[] | LightboxTabSections,

	/**
	 * optional, the lightbox sections for milestones
	*/
	milestone_sections?: LightboxSectionEntry[] | LightboxTabSections,

	/**
	 * the lightbox sections for the custom type
	 * (the union also carries the non-section key above: `advanced`)
	*/
	[lightboxType: string]: LightboxSectionEntry[] | LightboxTabSections | boolean | undefined
}

/**
 * tab-grouped sections config of the advanced task form: the nesting declares the
 * tabs, their order and which section goes where
 * @example
 * gantt.config.lightbox.sections = {
 *     tabs: [
 *         { name: "general", children: [
 *             { name: "description", type: "textarea", map_to: "text" },
 *             { cols: [
 *                 { name: "type", type: "typeselect", map_to: "type" },
 *                 { name: "priority", type: "select", map_to: "priority", options: priorities, width: 140 }
 *             ]},
 *             { name: "time", type: "duration", map_to: "auto" }
 *         ]},
 *         { name: "advanced", label: "More", children: [
 *             { name: "deadline", type: "datepicker", map_to: "deadline" }
 *         ]}
 *     ]
 * };
 */
export interface LightboxTabSections {
	tabs: LightboxSectionsTab[]
}

export interface LightboxSectionsTab {

	/**
	 * the tab id;
	*/
	name?: string,

	id?: string,

	/**
	 * optional, the tab label; overrides the locale
	*/
	label?: string,

	/**
	 * optional, hides the tab together with its sections
	*/
	hidden?: boolean,

	/**
	 * the content of this tab: each entry is a row - a section, `{ cols }` or `{ rows }`;
	 * a `tab` property on a section is ignored here
	*/
	children?: LightboxSectionEntry[]
}

/**
 * advanced task form: entries side by side in one row. Each entry takes the size set by its
 * `width`; the default is one share of the free space
 * @example
 * { cols: [
 *     { name: "deadline", type: "datepicker", map_to: "deadline" },
 *     { name: "priority", type: "select", map_to: "priority", options: priorities, width: 140 }
 * ]}
 */
export interface LightboxSectionCols {

	/**
	 * the entries of the row, from left to right
	*/
	cols: LightboxSectionEntry[],

	/**
	 * optional, the size of the container in its row; the same values as `LightboxSection.width`
	*/
	width?: number | string
}

/**
 * advanced task form: entries stacked in one column, for example next to a taller section
 * @example
 * { cols: [
 *     { name: "description", type: "textarea", map_to: "text", height: 120 },
 *     { rows: [
 *         { name: "type", type: "typeselect", map_to: "type" },
 *         { name: "progress", type: "progress", map_to: "progress" }
 *     ]}
 * ]}
 */
export interface LightboxSectionRows {

	/**
	 * the entries of the column, from top to bottom
	*/
	rows: LightboxSectionEntry[],

	/**
	 * optional, the size of the container in its row; the same values as `LightboxSection.width`
	*/
	width?: number | string
}

/**
 * an entry of a tab, or of a flat sections array: a section, or a container of entries. The
 * containers work only in the advanced task form; the classic lightbox reports them with an error
 */
export type LightboxSectionEntry = LightboxSection | LightboxSectionCols | LightboxSectionRows;

export interface LightboxSection {

	/**
	 * the section's name (according to this name, dhtmlxGantt will take the section's label from the *locale.labels* collection).
	*/
	name: string,

	/**
	 * the name of a data property that will be mapped to the section
	*/
	map_to?: string,

	/**
	 * the [type of the section control](desktop/default_edit_form.md#lightboxcontrols) (editor).
	 * The task_form plugin adds `work`, `scheduling_mode`, `effort_driven`, `auto_scheduling` and
	 * `unscheduled`; without `map_to`, each edits the task property of its own name. In the advanced
	 * form, a section of these types, `constraint` or `calendar` shows only while its feature is on
	*/
	type: string,

	/**
	 * optional, the section's height. Not used with the [checkbox](desktop/checkbox.md) and [radio](desktop/radio.md) sections.
	*/
	height?: number,

	/**
	 * optional, if set to *true*, the section will take focus on opening the lightbox
	*/
	focus?: boolean,

	/**
	 * optional, advanced form only: the size of the section in its row. A number or `"Npx"` is
	 * pixels, `"N%"` a percent of the row, `"Nfr"` a share of the free space. Defaults to `"1fr"`,
	 * so a section alone in its row takes the whole row
	*/
	width?: number | string,

	/**
	 * optional, the caption of the section. Without it, the caption comes from
	 * `gantt.locale.labels["section_" + name]`, and then from the name itself
	*/
	label?: string,

	/**
	 * optional, hides the section. A hidden section is still read and saved. In the
	 * advanced form it takes no cell; in the classic lightbox it hides only with `gantt.config.wide_form`
	*/
	hidden?: boolean,

	/**
	 * optional, the hint shown in an empty field of a "text", "stepper", "datepicker" or "combo" section
	*/
	placeholder?: string,

	/**
	 * optional, the smallest value of a "stepper" section, or the earliest date of a "datepicker" section
	*/
	min?: number | Date,

	/**
	 * optional, the largest value of a "stepper" section, or the latest date of a "datepicker" section
	*/
	max?: number | Date,

	/**
	 * optional, the step of a "stepper" section
	*/
	step?: number,

	/**
	 * optional, a formatter for the section
	*/
	formatter?: DurationFormatter | LinkFormatter,

	/**
	 * optional, if you set the "true" value, the section will be read-only
	*/
	readonly?: boolean,

	/**
	 * optional, sets a year range for the native select time and duration sections.
	 * Pass a number to add half that many years on each side of the chart range, rounded down.
	 * Pass [firstYear, lastYear] for inclusive bounds.
	*/
	year_range?: number | number[],

	/**
	 * optional, if you set the "true" value, just the 'start Date' selector will be presented in the section.
	*/
	single_date?: boolean,

	/**
	 * optional, sets the order of date-time selectors
	*/
	time_format?: string[],

	/**
	 * optional, defines whether the end date will be corrected automatically if the selected start date is greater than the end date, *true* by default. The disabled mode allows validating the dates, but if you enable the mode and don't validate the dates, you can get tasks with 0 duration when the *start_date* is greater than the *end_date*.
	*/
	autofix_end?: boolean,

	/**
	 * optional, recalculates the end date when the user changes the start date in a time section
	*/
	auto_end_date?: boolean,

	/**
	 * optional, defines select options of the control.Each object in the array specifies a single option and takes the following properties:
	 * @param the option's id. This attribute is compared with the task's data property to assign select options to tasks
	 * @param the option's label
	 * @param optional, the unit of measurement of the resource (for the Resources control)
	*/
	options?: {
		key: number | string,
		label: string,
		unit?: string | number
	}[],

	/**
	 * optional, the default value of the section's control. Applied only if the input value is underfined. For the resources control is applied if the value of the resource is underfined.
	*/
	default_value?: any,

	/**
	 * optional, if set to "true", the options list will contain an additional option that will allow users to set the root level as the parent for tasks. Used in pair with the **root_label** property
	*/
	allow_root?: boolean,

	/**
	 * optional, sets a label for the root-level parent. Used in pair with the **allow_root** property
	*/
	root_label?: string,

	/**
	 * optional, specifies the 'onChange' event handler function for the section's control
	 * @param a native event object.
	*/
	onchange?(e: Event): any,

	/**
	 * optional, sets a sorting function for the select options
	 * @param an object of the first task that will be sorted
	 * @param an object of the second task that will be sorted
	*/
	sort?(task1: Task, task2: Task): number,

	/**
	 * optional, sets a filtering function for the select options. Takes the task id and task object as parameters
	 * @param the ID of the task object
	 * @param the Task object
	*/
	filter?(id: string | number, task: Task): boolean,

	/**
	 * optional, sets a template for select options
	 * @param the start date of the task object
	 * @param the end date of the task object
	 * @param the Task object
	*/
	template?(
		start_date: Date | number,
		end_date: Date | number,
		task: Task
	): string | number
}

export interface LightboxControl {

	/**
	 * a function that returns a string with the HTML elements of the section
	 * @param the section's configuration object
	*/
	render(sns: LightboxSection): string,

	/**
	 * a function that obtains the value from the **Task** object and sets it to the section
	 * @param an html object related to the html defined above
	 * @param a value defined by the **map_to** property
	 * @param the task object
	 * @param the section's configuration object
	*/
	set_value(
		node: HTMLElement,
		value: any,
		task: Task,
		section: LightboxSection
	): any,

	/**
	 * a function that obtains the value from the section and saves it to the **Task** object
	 * @param an html object related to the html defined above
	 * @param the task object
	 * @param the section's configuration object
	*/
	get_value(
		node: HTMLElement,
		task: Task,
		section: LightboxSection
	): any,

	/**
	 * a function to set focus to the section
	 * @param an html object related to the html defined above
	*/
	focus(node: HTMLElement): void
}

export interface LightboxSectionState {

	/**
	 * the configuration object of the section
	 * @param the section id
	 * @param the section name. According to the name, the gantt takes the label for the section from the **locale.labels** collection. For example, for the 'description' section, the label will be taken as **gantt.locale.labels.section_description**
	 * @param the section height
	 * @param the name of a property mapped to the editor
	 * @param the editor type
	 * @param if set to *true*, the related field will take the focus on opening the lightbox
	*/
	section: {
		id: string,
		name: string,
		height: number,
		map_to: string,
		type: string,
		focus: boolean
	},

	/**
	 * a div with the section body
	*/
	node: HTMLElement,

	/**
	 * a div with the section header
	*/
	header: HTMLElement,

	/**
	 * a collection of controls used in the section
	*/
	control: HTMLCollection,

	/**
	 * returns an object with the section's data
	*/
	getValue(): any,

	/**
	 * sets the value(s) for the section. As a parameter the method takes a value (or an object with values if the section has several controls) that should be set
	 * @param a value for the section
	 * @param optional, an object with any properties
	*/
	setValue(value: any, valueObject?: CustomObject): any
}

export interface MarkerConfig {

	/**
	 * the marker id
	*/
	id?: string | number,

	/**
	 * a Date object that sets the marker's start date
	*/
	start_date: Date,

	/**
	 * a Date object that sets the marker's end date
	*/
	end_date?: Date,

	/**
	 * a CSS class applied to the marker
	*/
	css?: string,

	/**
	 * the marker title
	*/
	text?: string | number | ((marker: MarkerItem) => string | number),

	/**
	 * the marker's tooltip
	*/
	title?: string | number
}

export interface MarkerItem extends MarkerConfig {
	id: Id;
}

export interface HandlerSettings {

	/**
	 * the id of the event handler.
	*/
	id?: string | number,

	/**
	 * defines whether the event will be executed only once.
	*/
	once?: boolean,

	/**
	 * specifies the `this` object for the listener.
	*/
	thisObject?: any
}

export interface GanttUIState {

	/**
	 * reveals if Gantt is auto-scrolled (*true*). Added only when the
	*/
	autoscroll: boolean,

	/**
	 * the update mode. *true* if the method is called inside the [*batchUpdate*](api/gantt_batchupdate.md) method.
	*/
	batch_update: boolean,

	/**
	 * the resizing mode of a task. *true* means the task is resized from the start, *false* means that the task is resized from the end. When the task is not resized, it is *null*.
	*/
	drag_from_start: boolean | null,

	/**
	 * the id of a task that the user is currently dragging in the Gantt chart. *undefined* or *null*, if no tasks are being dragged in the Gantt chart.
	*/
	drag_id: string | number | null | undefined,

	/**
	 * the drag mode. Has these values: 'move','resize','progress', 'ignore' when a task is dragged. Otherwise, has *null* or *undefined* value.
	*/
	drag_mode: string | null | undefined,

	/**
	 * the flag for the fullscreen mode. *true*, if the Gantt chart is in the fullscreen mode, *false* otherwise.
	*/
	fullscreen: boolean,

	/**
	 * the id of a task that is currently opened in the lightbox. *undefined* or *null*, if no tasks are opened in the lightbox.
	*/
	lightbox: string | number | null | undefined,

	/**
	 * the new link creation state, returns *true* when the link is created from the start of the predecessor task.
	*/
	link_from_start: boolean | null,

	/**
	 * the new link creation state, returns *true* if the mouse points to the link drag element (bubble).
	*/
	link_landing_area: boolean,

	/**
	 * the new link creation state. the id of the source (predecessor) task.
	*/
	link_source_id: string | number | null,

	/**
	 * the new link creation state. the id of the target (successor) task.
	*/
	link_target_id: string | number | null,

	/**
	 * the new link creation state, returns *true* when the link is created to the start of the successor task.
	*/
	link_to_start: boolean,

	/**
	 * the date that tasks are displayed in the chart from
	*/
	min_date: Date,

	/**
	 * the date that tasks are displayed in the chart till
	*/
	max_date: Date,

	/**
	 * the unit of the background grid of the timeline
	*/
	scale_unit: string,

	/**
	 * the step of the background grid of the timeline
	*/
	scale_step: number,

	/**
	 * the id of the currently selected task. *undefined* or *null*, if no tasks are selected in the Gantt chart.
	*/
	selected_task: string | number | null | undefined
}

export interface RoundDateConfig {

	/**
	 * the Date object to round;
	*/
	date: Date,

	/**
	 * the time unit ("minute", "hour", "day", "week", "month", "year");
	*/
	unit?: string,

	/**
	 * the step of the time scale (X-Axis), 1 by default.
	*/
	step?: number
}

export interface LinkForValidation {

	/**
	 * the ID of the source (predecessor) task.
	*/
	source: string | number,

	/**
	 * the ID of the target (successor) task.
	*/
	target: string | number,

	/**
	 * the link type.
	*/
	type: string
}

export interface GroupConfig {

	/**
	 * a property of a task object that will be used to group items.
	*/
	relation_property: string,

	/**
	 * an array of the groups (summary) items. Each item should have the properties set in the **group_id** and **group_text** parameters (by default, *key* and *label*).
	*/
	groups: VirtualGroupTask[],

	/**
	 * optional, the group's id. The default value is 'key'.
	*/
	group_id?: string,

	/**
	 * optional, the group's label. The default value is 'label'.
	*/
	group_text?: string,

	/**
	 * optional, the delimiter is used for automatic creation of groups for tasks with multiple resources. The default value is ",".
	*/
	delimiter?: string,

	/**
	 * optional, the name of the default group. Optional. The default value is 'None'.
	*/
	default_group_label?: string,

	/**
	 * optional, defines whether the gantt should save its tree structure inside groups. If not specified or set to *false*, gantt tasks will be displayed in a flat list view.
	*/
	save_tree_structure?: boolean,

	/**
	 * optional, a custom function to group tasks
	*/
	set_relation_value?: ((newGroupValues: Array<string | number> | string | null | undefined, id: string | number, oldRelationProperty: any) => any ) | null
}

export interface VirtualGroupTask {
	key?: string | number;
	label?: string;
	text?: string;
	default?: boolean;
	readonly?: true;

	[customProperty: string]: any;
}

/**
 * Effort-driven tasks config
*/
export interface EffortConfig {

	/** master switch; `false` ⇒ feature inert. Default `false`. */
	enabled: boolean,

	/** which axis is held constant. Default `"fixed_duration"`. */
	mode: "fixed_duration" | "fixed_units" | "fixed_work",

	/** keep Work constant when assignments change. Default `false`. */
	effort_driven: boolean,

	/** unit of `task.work` and of `value` (per day). Default `"hour"`. */
	work_unit: "minute" | "hour" | "day" | "week" | "month" | "year",

	/** `work_unit` per full day. Default `8`. */
	hours_per_day: number
}

export interface AutoSchedulingConfig {

	/**
	 * turns auto-scheduling on or off (same as using a boolean value directly).
	*/
	enabled: boolean,

	/**
	 * controls the display of task constraints on the Gantt chart.
	*/
	show_constraints?: boolean,

	/**
	 * Enables or disables usage of time constraints for auto scheduling.
	 */
	apply_constraints?: boolean,

	/**
	 * Defines how Gantt handles gaps between dependent tasks during scheduling.

		"preserve" - keeps tasks in their current positions if there are no conflicts
		"compress" - moves tasks to the earliest allowed date (or latest if schedule_from_end is enabled)
		By default, tasks are only rescheduled when their current date violates a constraint or dependency.
	 */
	gap_behavior?: "preserve"|"compress",

	/**
	 * Allows or forbids creating links between parent tasks (projects) and their subtasks.

		By default, such links can't be created.
	 */
	descendant_links?: boolean,

	/**
	 * Defines whether Gantt will do auto-scheduling on data loading/parsing.
	 */
	schedule_on_parse?: boolean,

	/**By default (when the property is set to true), the whole project is moved during auto scheduling. 
	 * It means that all tasks in the project remain on their places relative to each other and the beginning of the project. 
	*/
	move_projects?: boolean,

	/**
	 * Specifies whether completed tasks should affect scheduling and critical path calculations.

		When the property is enabled, the critical path, slack, and auto scheduling algorithms will take the value of the task progress into account, similar to how these methods work in MS Project, namely:

		1) Completed tasks (completed tasks - the tasks with 100% progress) always have zero slack;

		2) Completed tasks are excluded from the auto scheduling calculations. Relations that connect predecessors to completed tasks are ignored;

		3) Completed tasks can't be critical.
	 */
	use_progress?: boolean,

	/**
	 * Enables backward scheduling.

		Setting this config to true will switch auto scheduling to the as late as possible mode.

		The value will be only applied if config.project_end is specified as well.
	 */
	schedule_from_end?: boolean,

	/**
	 * Defines whether tasks should inherit the constraint type from their parent project.
	 */
	project_constraint?: boolean,

	/**
	 * Since v10.0. When enabled, the auto-scheduling engine enforces strict calendar
	 * coherence - task start/end dates must always fall on working time per the
	 * task's own calendar. When disabled (default), the engine keeps the behaviour of
	 * earlier versions, where edge-projected dates may land on non-working time
	 * before being normalised on the next write.
	 */
	strict_calendar?: boolean,

	/**
	 * Since v10.0. Tells Gantt what to do when the user moves a task and a link
	 * and a constraint then ask for different dates:

		"keep"   - keep the constraint and move the task (the default, same as before),
		"prompt" - ask the user what to do with a small dialog,
		"adjust" - change the constraint so the task can stay where the user put it.

		Works only when apply_constraints is true.
	 */
	resolve_constraint_conflicts?: "keep"|"prompt"|"adjust",

	/**
	 * Since v10.1. The name of the scheduling engine: "v2" (the default, built in) or a name
	 * registered with Gantt.registerSchedulingEngine. A chart creates its engine at the first
	 * scheduling or analysis call, and a new one at the first call after the name changes. A
	 * change made while auto-scheduling runs applies to the calls after it; the running pass
	 * keeps its engine. An unknown name throws from the call that needs the engine.
	 */
	engine?: string


}

export interface BaselineConfig {

	/**
	 * the name of the datastore used for storing baseline entries. For related functionality,
	*/
	datastore: string,

	/**
	 * determines how baselines are displayed:
	*/
	render_mode: boolean | string,

	/**
	 * specifies whether baseline updates trigger the DataProcessor as individual entries.
	*/
	dataprocessor_baselines: boolean,

	/**
	 * defines the height of the subrow for baselines, applicable only when `render_mode`
	*/
	row_height: number,

	/**
	 * sets the height of the baseline bar.
	*/
	bar_height: number
}

export interface GanttDataWithData {

	/**
	 * the array with the task data
	*/
	data: [] | (TaskInput)[]
	tasks?: undefined
	/**
	 * the array with the link data
	*/
	links?: (SerializedLink | Link)[]

	/**
	 * the array with the resource data
	*/
	resources?: Partial<ResourceItem>[]

	/**
	 * the array with the assignment data
	*/
	assignments?: (Partial<SerializedResourceAssignment> | Partial<ResourceAssignment>)[]

	/**
	 * the array with the baseline data
	*/
	baselines?: (SerializedBaseline | Baseline)[]

	/**
	 * the object that has the arrays with the custom data
	*/
	collections?: Сollections
}

export interface GanttDataWithTasks {

	/**
	 * the array with the task data
	*/
	tasks: [] | (TaskInput)[]
	data?: undefined
	/**
	 * the array with the link data
	*/
	links?: (SerializedLink | Link)[]

	/**
	 * the array with the resource data
	*/
	resources?: Partial<ResourceItem>[]

	/**
	 * the array with the assignment data
	*/
	assignments?: (Partial<SerializedResourceAssignment> | Partial<ResourceAssignment>)[]

	/**
	 * the array with the baseline data
	*/
	baselines?: (SerializedBaseline | Baseline)[]

	/**
	 * the object that has the arrays with the custom data
	*/
	collections?: Сollections
}

export type GanttData = GanttDataWithData | GanttDataWithTasks

/**
 * @deprecated Use GanttDataWithData instead
*/
export type DataToLoad1 = GanttDataWithData

/**
 * @deprecated Use GanttDataWithTasks instead
*/
export type DataToLoad2 = GanttDataWithTasks

/**
 * The shape accepted when you *provide* task data to Gantt - `gantt.parse()`,
 * `gantt.addTask()`, the `tasks` config/prop, your own application stores, etc.
 *
 * Date fields may be either a `Date` or a `string`, and every field (including
 * `id`) is optional - Gantt generates an id when one is not supplied.
 *
 * Use `TaskInput` when you are *authoring or holding* task data. Use `Task`
 * (live, `Date` dates, runtime `$`-fields) when reading Gantt's own task objects,
 * and `SerializedTask` (JSON form, `string` dates) for serialized/server data.
*/
export type TaskInput = Partial<SerializedTask> | Partial<Task>

/**
 * Legacy alias of {@link TaskInput}, kept for backwards compatibility.
 * Prefer `TaskInput` in new code.
*/
export type NewTask = TaskInput | string | {}


/**
 * the resource item object that will be added to Gantt. It can have the following properties:
 * @param optional, the resource ID, auto-generated if not set
 * @param optional, the ID of the parent resource
 * @param optional, the resource name
 * @param optional, specifies if the resource will be opened on load (to show child items)
 * @param optional, the unit of the resource assignment
 * @param optional, the value that is assigned by default when adding the assignment in the lightbox section
 * @param any other property you want to add
*/
export type NewResourceItem = Partial<ResourceItem>


/**
 * the assignment item object that will be added to Gantt. It can have the following properties:
 * @param optional, the assignment ID, auto-generated if not set
 * @param the ID of the task the resource is assigned to
 * @param the ID of the resource that is assigned to the task
 * @param optional, the assignment value
 * @param optional, the calculation mode of the time of the resource assignment: "default"|"fixedDates"|"fixedDuration"
 * @param optional, the difference between the assignment start date and the task start date
 * @param optional, the date the assignment should start
 * @param optional, the assignment duration
 * @param optional, the date the assignment should end
 * @param any other property you want to add
*/
/**
 * @deprecated Use SerializedResourceAssignment | ResourceAssignment instead
*/
export type NewAssignmentItem = SerializedResourceAssignment | ResourceAssignment


export interface Сollections {

	/**
	 * an array that contains the collection items.
	*/
	[collectionName: string]: [] | СollectionItem[]
}

export interface СollectionItem {

	/**
	 * any custom property of the collection item.
	*/
	[itemProperty: string]: any
}

export interface ScaleArray<ScaleObj> extends Array<ScaleObj> {
	0: ScaleObj
}

// `Scale` and `ScaleProjectionMode` are defined in ./scale_types and re-exported at the top
// of this file. `Scales` / `ScaleArray` stay here because the required-first-element tuple
// shape is specific to the gantt config surface.
export type Scales = ScaleArray<Scale>;

export interface MessagePopupConfig {

	/**
	 * optional, the ID of the popup message
	*/
	id?: number | string

	/**
	 * the content of the popup message
	*/
	text: number | string

	/**
	 * optional, the class name of the popup message
	*/
	type?: string

	/**
	 * optional, the time period until the popup message disappears. -1 means, it won't hide by itself
	*/
	expire?: number
}

export interface MessagePopupObject {

	/**
	 * calls a message box of the specified type
	*/
	(config: string | number | MessagePopupConfig): string | number | HTMLElement

	/**
	 * the position of the popup message. Possible values are: "top", "bottom", "left", "right"
	*/
	position: string

	/**
	 * specifies if Gantt should block keyboard events. *true* by default.
	*/
	keyboard: boolean

	/**
	 * a function that hides the popup message. Uses **id** as a parameter:
	 * @param the ID of the popup message
	*/
	hide(id: number | string): any
}

export interface AlertBoxConfig {

	/**
	 * optional, the ID of the alert box
	*/
	id?: number | string

	/**
	 * the text of the alert box's body
	*/
	text: number | string

	/**
	 * optional, the text of the header
	*/
	title?: number | string

	/**
	 * optional, the text of the "OK" button
	*/
	ok?: number | string

	/**
	 * optional, the position of the alert box for now supports only one value - "top", any other value will result in "center-align"
	*/
	position?: string

	/**
	 * optional, the width of the alert box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	width?: string

	/**
	 * optional, the height of the alert box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	height?: string

	/**
	 * optional, the function called on button click. Takes *true* as a parameter (subject to the clicked button)
	 * @param result of the clicked button, always returns **true** (because there is only the "OK" button)
	*/
	callback?(result: boolean): void
}

export interface ConfirmBoxConfig {

	/**
	 * optional, the ID of the confirm box
	*/
	id?: number | string

	/**
	 * the text of the confirm box's body
	*/
	text: number | string

	/**
	 * optional, the text of the header
	*/
	title?: number | string

	/**
	 * optional, the text of the "OK" button
	*/
	ok?: number | string

	/**
	 * optional, the text of the "Cancel" button
	*/
	cancel?: number | string

	/**
	 * optional, the position of the confirm box for now supports only one value - "top", any other value will result in "center-align"
	*/
	position?: string

	/**
	 * optional, the width of the confirm box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	width?: string

	/**
	 * optional, the height of the confirm box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	height?: string

	/**
	 * optional, the function called on button click. Takes *true* or *false* as a parameter (subject to the clicked button)
	 * @param result of the clicked button: **true** for "OK", **false** for "Cancel".
	*/
	callback?(result: boolean): void
}

export interface ModalBoxConfig {

	/**
	 * optional, the ID of the modal box
	*/
	id?: number | string

	/**
	 * the text of the modal box's body
	*/
	text: number | string

	/**
	 * optional, the text of the header
	*/
	title?: number | string

	/**
	 * the array of buttons
	*/
	buttons: string[] | number[] | ModalboxButton[]

	/**
	 * optional, the position of the modal box for now supports only one value - "top", any other value will result in "center-align"
	*/
	position?: string

	/**
	 * optional, the width of the modal box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	width?: string

	/**
	 * optional, the height of the modal box (set as CSS [<length>](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or
	*/
	height?: string

	/**
	 * optional, the function called on button click. Takes *true* or *false* as a parameter (subject to the clicked button)
	 * @param The result of the callback function will be equal to the stringified index of a pressed button from the array ("0", "1", "2",...)
	*/
	callback?(result: string | number | boolean): void
}

export interface ModalboxButton {

	/**
	 * the text of the button
	*/
	label: string | number

	/**
	 * optional, the value that is returned in the *result* argument of the *callback* function.
	*/
	value?: string | number | boolean

	/**
	 * optional, a custom class name for the button, prefixed with the "gantt_" string.
	*/
	css?: string | number
}

export type WorkDayConfig = string | number | boolean | Array<string | number>

export type WorkDaysTuple = [WorkDayConfig, WorkDayConfig, WorkDayConfig, WorkDayConfig, WorkDayConfig, WorkDayConfig, WorkDayConfig,]

export type WorkDaysSettings = {
	weekdays: WorkDaysTuple,
	dates: {[date: string]: WorkDayConfig}
}

export interface CalendarConfig {

	/**
	 * optional, the calendar id
	*/
	id?: string | number,

	/**
	 * an object that sets the worktime in days and hours. It can include:
	 * @param optional, an array with global working hours, sets the start and end hours of the task
	 * @param optional, an array of 7 days of the week (from 0 - Sunday, to 6 - Saturday), where 1/true stands for a working day and 0/false - a non-working day
	 * @param optional, an object with different working-time rules for different periods of time. The object can contain a set of key:value pairs where key is the name of a time span and value is an object with a list of attributes.
	 * @param the time span with the working time settings. The name of that object is used as the name of the time span
	 * @param the date when the time span is scheduled to begin
	 * @param the date when the time span is scheduled to be completed
	 * @param optional, an array of working hours as 'from'-'to' pairs.'false' value sets a day-off, 'true' (default value) applies the default hours (["8:00-17:00"])
	 * @param optional, an array of 7 days of the week (from 0 - Sunday, to 6 - Saturday), where 1/true stands for a working day and 0/false - a non-working day.
	*/
	worktime?: {
		hours?: string[] | number[] | boolean,
		days?: WorkDaysTuple | WorkDaysSettings,
		customWeeks?: {
			[timespan: string]: {
				from: Date,
				to: Date,
				hours?: Array<string | number> | boolean,
				days?: WorkDaysTuple | WorkDaysSettings | boolean,
			},
		}
	}
}

/**
 * an object that stores the commands of the Undo or Redo action
 * @param an array that stores the changes (commands) of the Undo or Redo action.
*/
export type UndoRedoAction = { commands: UndoRedoCommand[] }


/**
 * an object that stores the initial and updated state of the **Task** or **Link** objects:
 * @param the type of a command: "add/remove/update"
 * @param the type of the object which was changed: "task" or "link"
 * @param the changed task/link object
 * @param the task/link object before changes
*/
export type UndoRedoCommand = {
	type: string,
	entity: string,
	value: Task | Link,
	oldValue: Task | Link
}


/**
 * object specifying one of the predefined modes of sending the data
 * @param the URL to the server side
 * @param optional, the mode of sending data to the server: "JSON" | "REST-JSON" | "JSON" | "POST" | "GET"
 * @param optional, defines whether the task must be deleted from the gantt only after a successful response from the server. Dependency links and subtasks will be deleted after the deletion of the parent task is confirmed.
*/
export type DataProcessorConfig = {
	url: string,
	mode?: string,
	deleteAfterConfirmation?: boolean,
	/**
	 * sends all pending changes of an entity in one request instead of one request per row.
	 * Supported only by the "JSON" mode; any other mode throws a configuration error.
	 * @default false
	 */
	batch?: boolean
}


/**
 * a single row result of a batched save response. The response is either an array of such rows
 * or an object with a "batch" array of them
 * @property id - id of the saved row, used when "sid" is not given
 * @property sid - id the row was sent with
 * @property tid - id the row gets after saving, used to renumber a newly created row
 * @property action - outcome of the row: "inserted"|"updated"|"deleted"|"error"|"invalid" and custom actions
 */
export type DataProcessorBatchResponseRow = {
	id?: Id,
	sid?: Id,
	tid?: Id,
	action?: string,
	[key: string]: any
}


/**
 * the router configuration for different entities
 * @param the router object for tasks
 * @param the router object for links
 * @param the router object for resources
 * @param the router object for assignments
*/
export type RouterConfig = {
	task?: RouterForEntity,
	link?: RouterForEntity,
	resource?: RouterForEntity,
	assignment?: RouterForEntity
}


/**
 * the router function to process changes in Gantt
 * @param the name of the relevant entity. Possible values are: "task"|"link"|"resource"|"assignment"
 * @param the name of the relevant action. Possible values are:  "create"|"update"|"delete"
 * @param the processed object
 * @param the id of a processed object
*/
export type RouterFunction = (
	entity: string,
	action: string,
	data: Task | Link | ResourceAssignment | CustomObject,
	id: string | number
) => Promise<any> | object | void


export interface RouterForEntity {

	/**
	 * a function to process adding of items
	 * @param the processed item
	*/
	create(data: Task | Link | ResourceAssignment | CustomObject): Promise<any>

	/**
	 * a function to process updating of items
	 * @param the processed item
	 * @param the id of a processed item
	*/
	update(data: Task | Link | ResourceAssignment | CustomObject, id: string | number): Promise<any>

	/**
	 * a function to process deleting of items
	 * @param the id of a processed item
	*/
	delete(id: string | number): Promise<any>
}

export interface CustomObject {
	/*
	 * @param Any custom property with any type
	*/
	[propertyName: string]: any
}

export interface DateHelpers {

	/**
	 * adds/subtracts the specified time interval to/from the date
	 * @param the date object that you need to add a time to/subtract a time from
	 * @param the number of units to add. If this number is positive - the time will be added to the date, if negative - the time will be subtracted
	 * @param the time unit. Values: 'minute', 'hour', 'day', 'week', 'month', 'year'.
	*/
	add(date: Date, number: number, unit: string): Date,

	/**
	 * adds/subtracts the specified number of quarters to/from the date
	 * @param the date object that you need to add quarters to/subtract quarters from
	 * @param the number of quarters
	*/
	add_quarter(date: Date, number: number): Date,

	/**
	 * converts local time to UTC
	 * @param the date object to convert
	*/
	convert_to_utc(date: Date): Date,

	/**
	 * makes a copy of a Date object
	 * @param the date object to copy
	*/
	copy(date: Date): Date,

	/**
	 * returns a copy of the date with the time part set to 00:00:00. Does not modify the passed date
	 * @param the date object to format
	*/
	date_part(date: Date): Date,

	/**
	 * returns a function that converts a Date object to a string of the specified format
	 * @param the date format
	 * @param specifies whether local time should be converted to UTC
	*/
	date_to_str(format: string, utc?: boolean): Function,

	/**
	 * returns a copy of the date with the time part set to 00:00:00, without modifying the passed date. Alias of the  date_part  method. Used by the Day view to set the display date and can be redefined to provide the default behaviour
	 * @param the date object to format
	*/
	day_start(date: Date): Date,

	/**
	 * returns the ISO-8601 week number of the date, weeks starts on Monday
	 * @param the date object to format
	*/
	getISOWeek(date: Date): number,

	/**
	 * returns the week number of the date, but previously converts local time to UTC
	 * @param the date object to format
	*/
	getUTCISOWeek(date: Date): number,

	/**
	 * returns the week number of the date. Weeks start either on Monday or Sunday, depending on the value of the api/gantt_start_on_monday_config.md property.
	 * @param the date object to format
	*/
	getWeek(date: Date): number,

	/**
	 * returns a Date object of the first day of the month for the specified date and clears the time part to zero
	 * @param the date object to format
	*/
	month_start(date: Date): Date,

	/**
	 * converts a string of the specified format to a Date object
	 * @param a date as a string
	 * @param the date format
	*/
	parseDate(date: string, format: string): Date,

	/**
	 * returns a function that converts a string of the specified format to a Date object
	 * @param the date format
	 * @param specifies whether local time should be converted to UTC
	*/
	str_to_date(format: string, utc?: boolean): Function,

	/**
	 * returns the time of a Date object as a number of seconds counted from the midnight (00:00:00)
	 * @param the date object to format
	*/
	time_part(date: Date): number,

	/**
	 * adds the leading zero to numbers less than 10 and returns the result as a string. Doesn't affect numbers from 10
	 * @param the number to format
	*/
	to_fixed(num: number): string | number,

	/**
	 * returns a Date object of the specified date and clears the part with seconds to zero
	 * @param the date object to format
	*/
	minute_start(date: Date): Date,

	/**
	 * returns a Date object of the specified date and clears the part with minutes and seconds to zero
	 * @param the date object to format
	*/
	hour_start(date: Date): Date,

	/**
	 * returns a Date object of the first day of the week for the specified date and clears the time part to zero
	 * @param the date object to format
	*/
	week_start(date: Date): Date,

	/**
	 * returns a Date object of the first month of the quarter for the specified date and clears the time part to zero
	 * @param the date object to format
	*/
	quarter_start(date: Date): Date,

	/**
	 * returns a Date object of the first day of the year for the specified date and clears the time part to zero
	 * @param the date object to format
	*/
	year_start(date: Date): Date

	[customTemplate: string]: any;
}

export interface Calendar {

	/**
	 * the id of a task's calendar
	*/
	id: string | number,

	/**
	 * sets the working time for the Gantt chart
	 * @param the [configuration object](api/gantt_setworktime.md#configurationobjectproperties) of a time span:
	 * @param optional, a number of a week day [0 (Sunday) - 6 (Saturday)]. Note, you can set only 1 day at once
	 * @param optional, a specific date to set as a working day or day off
	 * @param optional, an array of working hours as 'from'-'to' pairs.'false' value sets a day-off, 'true' (default value) applies the default hours (["8:00-17:00"])
	 * @param optional, an object with different working-time rules for different periods of time. The object can contain a set of key:value pairs where key is the name of a time span and value is an object with a list of attributes.
	 * @param the time span with the working time settings. The name of that object is used as the name of the time span
	 * @param the date when the time span is scheduled to begin
	 * @param the date when the time span is scheduled to be completed
	 * @param optional, an array of working hours as 'from'-'to' pairs.'false' value sets a day-off, 'true' (default value) applies the default hours (["8:00-17:00"])
	 * @param optional, an array of 7 days of the week (from 0 - Sunday, to 6 - Saturday), where 1/true stands for a working day and 0/false - a non-working day.
	*/
	setWorkTime(
		config: {
			day?: string | number,
			date?: Date,
			hours?: string[] | number[] | boolean,
			customWeeks?: {
				[timespan: string]: {
					from: Date,
					to: Date,
					hours?: string[] | number[] | boolean,
					days?: WorkDaysTuple | boolean,
				},
			},
		}
	): boolean,

	/**
	 * unsets a working time in the Gantt Chart
	 * @param the [configuration object](api/gantt_unsetworktime.md#configurationobjectproperties) of a time span:
	 * @param optional, a number of a week day [0 (Sunday) - 6 (Saturday)]. Note, you can set only 1 day at once
	 * @param optional, a specific date to set as a working day or day off
	 * @param optional, an array of working hours as 'from'-'to' pairs.
	*/
	unsetWorkTime(
		config: {
			day?: string | number,
			date?: Date,
			hours?: string[] | number[] | boolean,
		}
	): void,

	/**
	 * checks whether the specified date is working
	 * @param either a date to check or the [configuration object](api/gantt_isworktime.md#configurationobjectproperties) of a time span:
	 * @param a date to check
	 * @param optional, a time unit: "minute", "hour", "day", "week", "month", "year"
	 * @param optional, the object of the task the duration of which should be calculated
	 * @param optional, a time unit: "minute", "hour", "day", "week", "month", "year". Not needed at all when the first parameter is specified as an object
	*/
	isWorkTime(
		config: Date | {
			date: Date,
			unit?: string,
			task?: Task,
		},
		time_unit?: string
	): boolean,

	/**
	 * returns the closest working time
	 * @param the [configuration object](api/gantt_getclosestworktime.md#configurationobjectproperties):
	 * @param a date to get the closest working time for
	 * @param optional, specifies the direction of the closest time: "future" or "past"
	 * @param optional, a time unit to search for the closest working time
	 * @param optional, the object of the task to use its calendar
	*/
	getClosestWorkTime(
		config: Date | {
			date: Date,
			dir?: string,
			unit?: string,
			task?: Task,
		}
	): Date,

	/**
	 * calculates the end date of a task
	 * @param either the date when a task is scheduled to begin or the [configuration object](api/gantt_calculateenddate.md#configurationobjectproperties) of a time span:
	 * @param the date when a task is scheduled to begin
	 * @param the duration of a task
	 * @param optional, the time unit of the duration: "minute", "hour", "day", "week", "month", "year"
	 * @param optional, the object of the task the duration of which should be calculated
	 * @param optional, the duration of a task. Not needed at all when the first parameter is specified as an object
	 * @param optional, the time unit of the duration. Not needed at all when the first parameter is specified as an object
	*/
	calculateEndDate(
		config: Date | {
			start_date: Date,
			duration: number,
			unit?: string,
			step?: number,
			task?: Task,
		},
		duration?: number,
		unit?: string
	): Date,

	/**
	 * calculates the duration of a task
	 * @param either the date when a task is scheduled to begin or the [configuration object](api/gantt_calculateduration.md#configurationobjectproperties) of a time span:
	 * @param the date when a task is scheduled to begin
	 * @param the date when a task is scheduled to be completed
	 * @param optional, the object of the task the duration of which should be calculated
	 * @param the date when a task is scheduled to be completed. Not needed at all when the first parameter is specified as an object
	*/
	calculateDuration(
		config: Date | {
			start_date: Date,
			end_date: Date,
			unit?: string,
			step?: number,
			task?: Task,
		},
		end?: Date
	): number

	[customMethod: string]: any;
}

/** A point on the page in `{x, y}` coordinates. */
export interface Point {
	x: number;
	y: number;
}

/** Position of a DOM element on the page (see `DomHelpers.getNodePosition`). */
export interface NodePosition {
	x: number;
	y: number;
	width: number;
	height: number;
	right: number;
	bottom: number;
}

export interface DomHelpers {

	/**
	 * returns position of the element on the screen in the format of `{x:number, y:number,width:number, height:number}` object
	 * @param DOM element that will be checked
	*/
	getNodePosition(node: HTMLElement): NodePosition,

	/**
	 * returns mouse coordinates relatively to the DOM element in the format of `{x:number, y:number}` object
	 * @param event that occured
	 * @param DOM element that will be checked
	*/
	getRelativeEventPosition(e: Event, node: HTMLElement): Point,

	/**
	 * returns `true` if the node provided as the first argument is DOM child of the node provided as the second argument
	 * @param child node that will be checked
	 * @param parent node that will be checked
	*/
	isChildOf(child: HTMLElement, parent: HTMLElement): boolean,

	/**
	 * returns `true` if the class list of the provided `node` contains a specified css class
	 * @param DOM element that will be checked
	 * @param class name that will be checked
	*/
	hasClass(node: HTMLElement, className: string): boolean,

	/**
	 * returns the first node that matches the provided css selector, starting from the `node` attribute, up to its DOM parents' branch.
	 * @param DOM element will be checked
	 * @param a class name for the target node
	*/
	closest(node: HTMLElement, cssSelector: string): HTMLElement

	[customMethod: string]: any;
}

export interface DatastoreConfig {

	/**
	 * an arbitrary string name of the datastore. The datastore can be accessed by its name using api/gantt_getdatastore.md.
	*/
	name: string,

	/**
	 * optional, accepts only one fixed value **"treeDatastore"**. If the type:"treeDatastore" is specified, the datastore will support hierarchical data, with the **id** property as a primary key, and **parent** as a link to the parent id. Any other value will produce a flat list datastore.
	*/
	type?: string,

	/**
	 * optional, enables showing all tasks assigned to a certain resource in the resource view panel. This functionality works both for the resource diagram and resource histogram types of layout.
	*/
	fetchTasks?: boolean,

	/**
	 * a method that returns true if we need to deep copy provided data instead of modifying it
	*/
	copyOnParse?: () => boolean;


	/**
	 * get datastore configuration
	*/
	getConfig?: () => any;

	/**
	 * optional, preprocesses items loaded into the datastore. It is a good place to set the default values of the datastore items. The function takes the following parameter:
	 * @param the resource item.
	*/
	initItem?: (item: Partial<DatastoreItem>) => DatastoreItem;


	/**
	 * any custom property or method
	*/
	[customProperty: string]: any;

}

export interface DatastoreMethods {

	/**
	 * loads data from an array
	 * @param the data to load
	*/
	parse(data: DatastoreItem[]): void,

	/**
	 * returns the item by its id
	 * @param the id of the item
	*/
	getItem(id: string | number): DatastoreItem | void,

	/**
	 * updates the specified item
	 * @param the id of the item
	 * @param an object the item
	*/
	updateItem(id: string | number, item?: DatastoreItem): void,

	/**
	 * deletes the specified item
	 * @param the id of the item
	*/
	removeItem(id: string | number): void,

	/**
	 * returns true if the datastore is operated in the `silent` mode
	*/
	isSilent(): boolean,

	/**
	 * checks whether the specified item is visible or hidden via filters
	 * @param the id of the item
	*/
	isVisible(id: string | number): boolean,

	/**
	 * returns the array of visible items
	*/
	getVisibleItems(): DatastoreItem[],

	/**
	 * adds a new item to the datastore
	 * @param the item object
	 * @param the position the task will be added into (0 or greater)
	*/
	addItem(item: Partial<DatastoreItem>, index?: number): number | string | false,

	/**
	 * changes the id of the item
	 * @param the current item's id
	 * @param the new item's id
	*/
	changeId(oldId: string | number, newId: string | number): void,

	/**
	 * checks whether the specified item exists in the datastore
	 * @param the item's id
	*/
	exists(id?: string | number): boolean,

	/**
	 * moves an item to a new position
	 * @param sindex the index of the current position of the task
	 * @param tindex the index of the position that the item will be moved to
	*/
	move(sindex: number, tindex: number): void,

	/**
	 * clears the datastore
	*/
	clearAll(): void,

	/**
	 * execute the code without firing API events of the datastore
	 * @param callback the callback function
	 * @param master the object, that 'this'  will refer to
	*/
	silent(callback: (this: Datastore) => void, master?: any): void,

	/**
	 * fires repainting of events of the specified record, runs filters
	 * @param optional, the id of the record
	*/
	refresh(id?: string | number): void,

	/**
	 * returns the number of items that are currently loaded into the datastore
	*/
	count(): number,

	/**
	 * returns the number of items that are currently visible
	*/
	countVisible(): number,

	/**
	 * iterates over all tasks of the datastore
	 * @param the callback function
	*/
	eachItem(callback: (item: DatastoreItem) => void): void,

	/**
	 * runs the filters and updates visible array of items
	*/
	filter(): void,

	/**
	 * sorts datastore items
	 * @param sortFunction a custom sorting function
	*/
	sort(sortFunction: any): void,

	/**
	 * select an item
	 * @param id optional, the id of the item
	*/
	select: (id?: string | number | null) => string | number| false | null | void;

	/**
	 * unselect an item
	 * @param optional, the id of the item
	*/
	unselect: (id?: string | number | null) => void;

	/**
	 * get selected item id
	 * @param id optional, the id of the item
	*/
	getSelectedId: () => string | number| null;

	/**
	 * check if a datastore item is selected
	 * @param id optional, the id of the item
	*/
	isSelected: (id: string | number) => boolean;

	/**
	 * returns records between the specified indexes
	 * @param the position of the start record
	 * @param the position of the end record
	*/
	getIndexRange(from?: number, to?: number): DatastoreItem[],

	/**
	 * returns all records of the datastore
	*/
	getItems(): DatastoreItem[],

	/**
	 * returns the id of the item by its index. Returns `undefined` if there is no item at the specified index.
	 * @param the position of the item
	*/
	getIdByIndex(index: number): string | number | void,

	/**
	 * returns the index of the item by its id. Returns `-1` if no such item exists in the datastore.
	 * @param the id of the item
	*/
	getIndexById(id: string | number): number,

	/**
	 * returns the id of the first item of the datastore
	*/
	getFirst(): string | number | null,

	/**
	 * returns the id of the last item of the datastore
	*/
	getLast(): string | number | null,

	/**
	 * returns the id of the next item of the datastore
	 * @param the item's id
	*/
	getNext(id: string | number): string | number | null,

	/**
	 * returns the id of the previous item of the datastore
	 * @param the item's id
	*/
	getPrev(id: string | number): string | number | null,

	/**
	 * clears the datastore and removes all attached event handlers. The datastore is not usable after this method is called.
	*/
	destructor(): void,

	/**
	 * attaches the handler to an inner event of DataStore
	 * @param the event's name, case-insensitive
	 * @param the handler function
	 * @param optional, an object with settings for the event handler
	*/
	attachEvent<T extends keyof TreeDatastoreEvents>(event: T, handler: TreeDatastoreEvents[T], settings?: object | string): string,

	/**
	 * calls an inner event
	 * @param the event's name, case-insensitive
	 * @param an array of the event-related data
	*/
	callEvent(name: string, params: Array<any>): boolean | undefined,

	/**
	 * detaches a handler from an event (which was attached before by the attachEvent() method)
	 * @param the event's id
	*/
	detachEvent(id: string): void
}

export interface DatastoreEvents {

	/**
	 * fires when an item is being loaded from the data source
	 * @param the object of an item
	*/
	"onItemLoading": (item: any) => any,

	/**
	 * fires before data started to be parsed
	 * @param the array with the data that was loaded
	*/
	"onBeforeParse": (data: Array<any>) => any,

	/**
	 * fires after data were parsed (became available for API) but before they were rendered in the Gantt chart
	 * @param the array with the data that was loaded
	*/
	"onParse": (data: Array<any>) => any,

	/**
	 * fires before an item is updated
	 * @param the id of an item
	 * @param the new (updated) object of the item
	*/
	"onBeforeUpdate": (id: string | number, item: any) => any,

	/**
	 * fires after an item is updated
	 * @param the id of an item
	 * @param the object of the item
	*/
	"onAfterUpdate": (id: string | number, item: any) => any,

	/**
	 * fires before an item is deleted
	 * @param the id of an item
	 * @param the object of the item
	*/
	"onBeforeDelete": (id: string | number, item: any) => any,

	/**
	 * fires after an item is deleted
	 * @param the id of an item
	 * @param the object of the item
	*/
	"onAfterDelete": (id: string | number, item: any) => any,

	/**
	 * fires after an item is deleted inside the `silent` method
	 * @param id the id of an item
	 * @param item the datastore item
	*/
	"onAfterSilentDelete": (id: string | number, item: DatastoreItem) => any,

	/**
	 * fires after receiving a succeful response from the server when sending the delete confirmation request
	 * @param id the id of an item
	 * @param item the datastore item
	*/
	"onAfterDeleteConfirmed": (id: string | number, item: DatastoreItem) => any,

	/**
	 * fires before a new item is added to the datastore
	 * @param the id of an item
	 * @param the object of the item
	*/
	"onBeforeAdd": (id: string | number, item: any) => any,

	/**
	 * fires after an item is added to the datastore
	 * @param the id of an item
	 * @param the object of the item
	*/
	"onAfterAdd": (id: string | number, item: any) => any,

	/**
	 * fires before a datastore item is repainted
	 * @param id the id of an item
	*/
	"onBeforeRefreshItem": (id: string | number) => any,

	/**
	 * fires after a datastore item is repainted
	 * @param id the id of an item
	*/
	"onAfterRefreshItem": (id: string | number) => any,

	/**
	 * fires before repainting all datastore items
	*/
	"onBeforeRefreshAll": () => any,

	/**
	 * fires after repainting all datastore items
	*/
	"onAfterRefreshAll": () => any,

	/**
	 * fires before the id of an item is changed
	 * @param the id of an item
	 * @param the new id of the item
	*/
	"onBeforeIdChange": (oldId: string | number, newId: string | number) => any,

	/**
	 * fires when the id of an item is changed
	 * @param the id of an item
	 * @param the new id of the item
	*/
	"onIdChange": (oldId: string | number, newId: string | number) => any,

	/**
	 * fires after all items were removed from the datastore
	*/
	"onClearAll": () => any,

	/**
	 * fires before the datastore is refreshed
	 * @param the id of an item or null
	 * @param the item object or null
	 * @param the action type ("paint", "move", "add", "delete", null)
	*/
	"onBeforeStoreUpdate": (id: string | number | null, item: any | null, action: string | null) => any,

	/**
	 * fires after the datastore has been refreshed
	 * @param the id of an item or null
	 * @param the item object or null
	 * @param the action type ("paint", "move", "add", "delete", null)
	*/
	"onStoreUpdated": (id: string | number | null, item: any | null, action: string | null) => any,

	/**
	 * fires before filtering is applied
	*/
	"onBeforeFilter": () => any,

	/**
	 * fires before filtering is applied but after onBeforeFilter is called. Not ignored by the `silent` method
	*/
	"onPreFilter": () => any,

	/**
	 * fires after the datastore has update the filtering state
	*/
	"onFilter": () => any,

	/**
	 * fires for each item during the filtering stage, returning `false` will mark item as not visible
	 * @param the id of an item
	 * @param the item object
	*/
	"onFilterItem": (id: string | number, item: any) => any,

	/**
	 * fires before a datastore item is selected
	 * @param id the id of an item
	*/
	"onBeforeSelect": (id: string | number) => any,

	/**
	 * fires after a datastore item is selected
	 * @param id the id of an item
	*/
	"onAfterSelect": (id: string | number) => any,

	/**
	 * fires after a datastore item is unselected
	 * @param id the id of an item
	*/
	"onAfterUnselect": (id: string | number) => any,

	/**
	 * fires after the destructor() method of the datastore is called
	*/
	"onDestroy": () => any

	[customEvent: string]: any;
}

export interface Datastore extends DatastoreMethods, DatastoreEvents{

	/**
	 * get datastore items
	*/
	pull: Record<Id, DatastoreItem>;

	/**
	 * get visible IDs
	*/
	visibleOrder: Id[];

	/**
	 * get all IDs
	*/
	fullOrder: Id[];

	/**
	 * a function that is used to initialize datastore items
	*/
	$initItem: ((item: DatastoreItem) => DatastoreItem) | null | undefined;

	/**
	 * datastore configuration
	*/
	$config: DatastoreConfig;

	/**
	 * added after the datastore is destroyed
	*/
	$destroyed?: boolean;

}

export interface TreeDatastoreConfig extends DatastoreConfig {

	/**
	 * property that is used for the tree stucture
	*/
	parentProperty?: string;

	/**
	 * property that specifies the root ID
	*/
	rootId?: Id | (() => Id);

}

export interface TreeDatastoreMethods extends DatastoreMethods {

	/**
	 * moves an item to the new position or to a new parent
	 * @param the id of the item to move
	 * @param the index of the position that the item will be moved to (the index within a branch)
	 * @param the parent id. If specified, the tindex will refer to the index in the
'parent' branch
	*/
	move(sid: string | number, tindex: number, parent?: string | number): boolean | void,

	/**
	 * returns the index of an item in the branch
	 * @param the id of the item
	*/
	getBranchIndex(id: string | number): number,

	/**
	 * checks whether the specified item has child items
	 * @param the id of the item
	*/
	hasChild(id: string | number): number | void,

	/**
	 * returns the 1st-level child items of the specified parent branch.
	 * The returned array is a plain copy - modifying it does not reorder or
	 * resize the branch; use addTask/moveTask/deleteTask or sort() to change it
	 * @param the id of the parent branch
	*/
	getChildren(id: string | number): Array<number | string | TreeDatastoreItem>,

	/**
	 * checks whether an item is a child of a different item
	 * @param the id of an item that you want to check as a child
	 * @param the id of an item that you want to check as a parent
	*/
	isChildOf(childId: string | number, parentId: string | number): boolean,

	/**
	 * returns siblings of the specified item (including itself).
	 * The returned array is a plain copy - see getChildren()
	 * @param the id of the item
	*/
	getSiblings(id: string | number): Array<number | string | TreeDatastoreItem>,

	/**
	 * returns the id of the next item of the same level
	 * @param the id of the item
	*/
	getNextSibling(id: string | number): number | string | null,

	/**
	 * returns the id of the previous item of the same level
	 * @param the id of the item
	*/
	getPrevSibling(id: string | number): number | string | null,

	/**
	 * returns the id of the parent item or 0.
	 * @param the id of the item
	*/
	getParent(id: string | number | TreeDatastoreItem): number | string,

	/**
	 * calculates the level of nesting of an item
	 * @param the item's object
	*/
	calculateItemLevel(item: TreeDatastoreItem): number,

	/**
	 * sets the parent for an item. The parent id will be writen to the property specified by `parentProperty` config, "item.parent" by default.
	 * @param the item's object
	 * @param the id of the parent
	*/
	setParent(item: TreeDatastoreItem, newParentId: string | number | null): void,

	/**
	 * iterates over all children of a specific item
	 * @param the callback function
	 * @param the id of the parent
	*/
	eachItem(callback: (item: TreeDatastoreItem) => void, parentId?: string | number): void,

	/**
	 * iterates over all parent items of the specified item
	 * @param the callback function
	 * @param the id of the item the parent item of which should be iterated over
	*/
	eachParent(callback: Function, startItem: string | number): void,

	/**
	 * opens the branch with the specified id
	 * @param the branch id
	*/
	open(id: string | number): void,

	/**
	 * a method that returns true if the parent items should be expanded on load
	*/
	openInitially?: () => boolean;


	/**
	 * closes the branch with the specified id
	 * @param the branch id
	*/
	close(id: string | number): void,

	/**
	 * sorts items in the tree datastore
	 * @param the name of the column that the tree datastore will be sorted by or a custom sorting function
	 * @param specifies the sorting direction: true - descending sort and false - ascending sort. By default, false
	 * @param the id of the parent item. Specify the parameter if you want to sort items only in the branch of the specified parent.
	 * @param specifies whether rendering should be invoked after reordering items
	*/
	sort(field: string | ((item1: TreeDatastoreItem, item2: TreeDatastoreItem) => number), desc?: boolean, parent?: string | number, silent?: boolean): void
}

export interface TreeDatastoreEvents extends DatastoreEvents {

	/**
	 * fires before an item is moved to a new position
	 * @param the id of the item to move
	 * @param the parent id
	 * @param the index of the position in the parent branch that the item will be moved to
	*/
	"onBeforeItemMove": (id: string | number, parent: string | number, tindex: number) => any,

	/**
	 * fires after an item was moved to a new position
	 * @param the id of the item to move
	 * @param the parent id
	 * @param the index of the position in the parent branch that the item will be moved to
	*/
	"onAfterItemMove": (id: string | number, parent: string | number, tindex: number) => any,

	/**
	 * fires on opening a branch
	 * @param the id of the branch
	*/
	"onItemOpen": (id: string | number) => any,

	/**
	 * fires on closing a branch
	 * @param the id of the branch
	*/
	"onItemClose": (id: string | number) => any
}

export interface TreeDatastore extends TreeDatastoreConfig, TreeDatastoreMethods, TreeDatastoreEvents{

}


export interface InlineEditor {

	/**
	 * the function is called when you open the inline editor. Here, you can add a container for the DOM elements and initialize the third
	 * @param task ID
	 * @param the column configuration object
	 * @param the configuration object of the custom inline editor
	 * @param the DOM element of the inline editor
	*/
	show(
		id: string | number,
		column: GridColumn,
		config: any,
		placeholder: HTMLElement
	): void,

	/**
	 * optional, the function is called when hiding the inline editor
	*/
	hide?(): void,

	/**
	 * the function is called after the **show** function. There, you need to set the values to the inline editor elements from the **task** object. The parameters are:
	 * @param the value of the task property
	 * @param task ID
	 * @param the column configuration object
	 * @param the DOM element of the inline editor
	*/
	set_value(
		value: any,
		id: string | number,
		column: GridColumn,
		node: HTMLElement
	): void,

	/**
	 * the function is called before hiding the inline editor. You need to obtain the values from the inline editor and add it to the **task** object. The parameters are:
	 * @param task ID
	 * @param the column configuration object
	 * @param the DOM element of the inline editor
	*/
	get_value(
		id: string | number,
		column: GridColumn,
		node: HTMLElement
	): any,

	/**
	 * optional, the function is called before hiding the inline editor. If you return **true** the changes will be saved, otherwise, they will be cancelled. The parameters are:
	 * @param the value of the task property
	 * @param task ID
	 * @param the column configuration object
	 * @param the DOM element of the inline editor
	*/
	is_changed?(
		value: any,
		id: string | number,
		column: GridColumn,
		node: HTMLElement
	): boolean,

	/**
	 * optional, the function where you can add validation. If you return **false**, the changes will be cancelled. The parameters are:
	 * @param the value of the task property
	 * @param task ID
	 * @param the column configuration object
	 * @param the DOM element of the inline editor
	*/
	is_valid?(
		value: any,
		id: string | number,
		column: GridColumn,
		node: HTMLElement
	): boolean,

	/**
	 * optional, the function for a complex save behavior, when the editor has the `map_to:auto` property. The parameters are:
	 * @param task ID
	 * @param the column configuration object
	 * @param the Task object
	*/
	save?(
		id: string | number,
		column: GridColumn,
		node: HTMLElement
	): void,

	/**
	 * optional, this function is called when the inline editor receives focus.
	 * @param the DOM element of the inline editor
	*/
	focus?(node: HTMLElement): void

	[customMethod: string]: any;
}

export interface InlineEditorMethods {

	/**
	 * opens an editor in the specified task/cell, sets the mapped value and puts browser focus on the editor
	 * @param the task ID
	 * @param the column name
	*/
	startEdit(taskId: number | string, columnName: string): void,

	/**
	 * opens an empty editor in specified task/cell
	 * @param the task ID
	 * @param the column name
	*/
	show(taskId: number | string, columnName: string): void,

	/**
	 * populates an opened editor with values from the task
	*/
	setValue(): void,

	/**
	 * saves changes and hides an editor
	*/
	save(): void,

	/**
	 * hides an editor without saving changes
	*/
	hide(): void,

	/**
	 * puts browser focus on the editor
	*/
	focus(): void,

	/**
	 * gets the state object {id: taskId, columnName: columnName, placeholder: HTMLElement}
	*/
	getState(): object,

	/**
	 * gets the current value of the editor
	*/
	getValue(): string,

	/**
	 * checks whether the current value of the editor differs from the initial value
	*/
	isChanged(): boolean,

	/**
	 * checks whether the editor is opened
	*/
	isVisible(): boolean,

	/**
	 * attaches an event handler to inlineEditors object
	 * @param the name of the event handler
	 * @param the function that will be called when the event fires
	*/
	attachEvent<T extends keyof InlineEditorEvents>(event: T, handler: InlineEditorEvents[T]): string,

	/**
	 * detaches a handler from an event (which was attached before by the attachEvent() method)
	 * @param the id of the attached event handler
	*/
	detachEvent(id: string): void,

	/**
	 * saves the current editor and moves editor to the next cell
	 * @param the parameter specifies whether it can move the editor to the first cell of the next row after the last cell of the current one
	*/
	editNextCell(canChangeRow?: boolean): void,

	/**
	 * saves the current editor and opens an editor in the same cell of the task below
	 * @param the parameter specifies whether it can skip the read-only task and open an editor in the cell of the first editable task. The default *false* state of the parameter closes the editor if the next task is read-only.
	*/
	editNextRow(skipReadonly?: boolean): void,

	/**
	 * saves the current editor and moves editor to the previous cell
	 * @param the parameter specifies whether it can move editor to the last cell of the row above after reaching the first cell of the current row
	*/
	editPrevCell(canChangeRow?: boolean): void,

	/**
	 * saves the current editor and opens an editor in the same cell of the task above
	 * @param the parameter specifies whether it can skip the read-only task and open an editor in the cell of the first editable task. The default *false* state of the parameter closes the editor if the previous task is read-only.
	*/
	editPrevRow(skipReadonly?: boolean): void,

	/**
	 * gets the name of the first editable column in the grid
	*/
	getFirstCell(): string,

	/**
	 * gets the name of the last editable column in the grid
	*/
	getLastCell(): string,

	/**
	 * returns the name of the next editable column
	 * @param the parameter specifies in which direction it should iterate the following cell. `1` - right, `-1` - left.
	*/
	getNextCell(direction: number): string | null,

	/**
	 * checks whether a provided DOM element is a task cell object and returns an editor state object, if it is so: {id: taskId, columnName: columnName}
	 * @param the HTML element
	*/
	locateCell(node: HTMLElement): object | null,

	/**
	 * sets a mapping object
	 * @param an object with the mapping configuration:
	 * @param the method to initialize mapping
	 * @param the inlineEditors object
	 * @param the Grid layout view
	 * @param the method that will be called when the inline editor is opened
	 * @param the inlineEditors object
	 * @param the HTML element
	 * @param the Grid layout view
	 * @param the method that will be called when the inline editor is closed
	 * @param the inlineEditors object
	 * @param the HTML element
	 * @param the Grid layout view
	 * @param the method to destroy mapping
	*/
	setMapping(
		mapping: {
			init: ((
				inlineEditors: InlineEditorMethods,
				grid: any,
			) => void),
			onShow: ((
				inlineEditors: InlineEditorMethods,
				node: HTMLElement,
				grid: any,
			) => void),
			onHide: ((
				inlineEditors: InlineEditorMethods,
				node: HTMLElement,
				grid: any,
			) => void),
			destroy: (() => void),
		}
	): void,

	/**
	 * returns a currently applied mapping object
	*/
	getMapping(): object

	[customMethod: string]: any;
}

export interface InlineEditorEvents {

	"onBeforeEditStart": (state: {
		id: number | string,
		columnName: string,
	}) => any,

	"onEditStart": (state: {
		id: number | string,
		columnName: string,
	}) => any,

	"onBeforeSave": (state: {
		id: number | string,
		columnName: string,
		oldValue: any,
		newValue: any,
	}) => any,

	"onSave": (state: {
		id: number | string,
		columnName: string,
		oldValue: any,
		newValue: any,
	}) => any,

	"onEditEnd": (state: {
		id: number | string,
		columnName: string,
	}) => any

	[customEvent: string]: any;
}

export interface Fullscreen {

	/**
	 * expands gantt to the full screen mode
	*/
	expand(): void,

	/**
	 * collapses gantt from the fullscreen mode to the normal mode
	*/
	collapse(): void,

	/**
	 * calls the **collapse()** method if gantt is expanded to full screen, and the **expand()** method otherwise
	*/
	toggle(): void,

	/**
	 * returns a DOM element that will be expanded to full screen by the **expand()** method.
	*/
	getFullscreenElement(): HTMLElement

	[customMethod: string]: any;
}

export interface KeyNav {

	/**
	 * allows selecting any cell in the grid. Works only if the Grid already has the focus
	 * @param the config object
	 * @param the id of an edited task
	 * @param the column name
	 * @param type of the scope. Possible values: "gantt", "taskRow", "taskCell", "headerCell"
	*/
	focus(
		config: {
			id: number | string,
			column: string,
			type: string,
		}
	): void,

	/**
	 * allows obtaining information about the active cell
	*/
	getActiveNode(): boolean | void

	[customMethod: string]: any;
}

export interface QuickInfo {

	/**
	 * displays the quick info popup for a specified element
	 * @param the task ID
	*/
	show(id: number | string): void,

	/**
	 * displays the quick info popup at specific coordinates
	 * @param horizontal coordinate
	 * @param vertical coordinate
	*/
	show(x: number | string, y: number | string): void,

	/**
	 * hides the quick info popup. When **gantt.config.quick_info_detached** is set to *false*, the quick info will not disappear immediately, but after a short animation. Providing *true* value as an argument will cancel the animation and will remove the popup immediately.
	 * @param defines whether the quick info popup will be hidden immediately without animation
	*/
	hide(force?: boolean): HTMLElement,

	/**
	 * sets a container where the quick info will be displayed. If no custom container specified, QuickInfo will be placed into the first of the found nodes: **gantt.$task, gantt.$grid, gantt.$root**
	 * @param container element or its ID
	*/
	setContainer(container: HTMLElement | string): void,

	/**
	 * returns the HTMLElement of the quick info popup. Returns *null* if the quick info is not initialized
	*/
	getNode(): HTMLElement | null,

	/**
	 * puts the content into the quick info
	 * @param optional, the configuration object of a quick info which can include the following attributes:
	 * @param optional, the id of the task to which the action buttons of the quick info will be connected
	 * @param optional, the header of the pop-up edit form which may include:
	 * @param optional, the title of the pop-up edit form
	 * @param optional, the date of the pop-up edit form
	 * @param optional, the content of the pop-up edit form
	 * @param optional, buttons to be placed in the pop-up edit form
	*/
	setContent(
		config?: {
			taskId?: string | number,
			header?: {
				title?: string,
				date?: string,
			},
			content?: string,
			buttons?: string[],
		}
	): void

	[customMethod: string]: any;
}

export interface Undo {

	/**
	 * reverts the changes made in the gantt
	*/
	undo(): void,

	/**
	 * applies the reverted changes to the gantt once again
	*/
	redo(): void,

	/**
	 * returns the stack of stored undo user actions
	*/
	getUndoStack(): UndoRedoAction[],

	/**
	 * returns the stack of stored redo user actions
	*/
	getRedoStack(): UndoRedoAction[],

	/**
	 * sets the stack of stored undo user actions
	 * @param the undo stack
	*/
	setUndoStack(stack: UndoRedoAction[]): void,

	/**
	 * sets the stack of stored redo user actions
	 * @param the redo stack
	*/
	setRedoStack(stack: UndoRedoAction[]): void,

	/**
	 * clears the stack of stored undo commands
	*/
	clearUndoStack(): void,

	/**
	 * clears the stack of stored redo commands
	*/
	clearRedoStack(): void,

	/**
	 * saves the current state of a task/link before the changes are made
	 * @param the id of a task/link,
	 * @param the type of an entry for which the id is provided as the first argument.
	*/
	saveState(id: string | number, type: string): boolean

	[customMethod: string]: any;
}

export interface ClickDrag {

	/**
	 * sets a custom CSS class for a selected element
	*/
	className?: string,

	/**
	 * the element to attach an event to and select
	*/
	viewPort?: HTMLElement,

	/**
	 * defines whether requestAnimationFrame is used during rendering
	*/
	useRequestAnimationFrame?: boolean,

	/**
	 * true to add selection only in one row equal to the height of a task
	*/
	singleRow?: boolean,

	/**
	 * CSS selector. Drag-n-drop won't be activated for the elements that match the selector
	*/
	ignore?: string,

	/**
	 * if the property is specified, drag-n-drop will be activated only when the specified modifier key is pressed. Supported values: "ctrlKey", "shiftKey", "metaKey", "altKey"
	*/
	useKey?: string | boolean,

	/**
	 * a function that will be called when the mouse button is released. Takes 6 parameters:
	 * @param an object with the following attributes:
	 * @param the coordinates of the left top corner of the document
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param the coordinates of the left top element used as a viewPort
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param an object with the following attributes:
	 * @param the coordinates of the left top corner of the document
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param the coordinates of the left top element used as a viewPort
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param the date that corresponds to the starting point
	 * @param the date that corresponds to the ending point
	 * @param an array of tasks between the start and end date points
	 * @param an array of tasks selected between the start and end coordinates vertically
	*/
	callback?(
		startPoint?: {
			absolute: {
				left: number,
				top: number,
			},
			relative: {
				left: number,
				top: number,
			},
		},
		endPoint?: {
			absolute: {
				left: number,
				top: number,
			},
			relative: {
				left: number,
				top: number,
			},
		},
		startDate?: Date,
		endDate?: Date,
		tasksBetweenDates?: Array<Task>,
		tasksInRows?: Array<Task>
	): any,

	/**
	 * a function that creates an element rendered during dragging. Takes two parameters:
	 * @param an object with the attributes:
	 * @param the coordinates of the left top corner of the document
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param the coordinates of the left top element used as a viewPort
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param an object with the attributes:
	 * @param the coordinates of the left top corner of the document
	 * @param the left coordinate
	 * @param the top coordinate
	 * @param the coordinates of the left top element used as a viewPort
	 * @param the left coordinate
	 * @param the top coordinate
	*/
	render?(
		startPoint?: {
			absolute: {
				left: number,
				top: number,
			},
			relative: {
				left: number,
				top: number,
			},
		},
		endPoint?: {
			absolute: {
				left: number,
				top: number,
			},
			relative: {
				left: number,
				top: number,
			},
		}
	): any

	[customMethod: string]: any;
}

export interface Overlay {

	/**
	 * adds a new overlay into the Gantt Chart and returns its id
	 * @param the render function. Takes a container with custom content as a parameter
	 * @param the overlay container
	 * @param optional, the ID of the overlay
	*/
	addOverlay(
		render: ((
			container: HTMLElement,
		) => HTMLElement),
		id?: number | string
	): string | number,

	/**
	 * removes an overlay by its id
	 * @param the ID of the overlay
	*/
	deleteOverlay(id: number | string): boolean,

	/**
	 * returns an array with ids of overlays added into the chart
	*/
	getOverlaysIds(): Array<string>,

	/**
	 * repaints the specified overlay.
	 * @param the ID of the overlay
	*/
	refreshOverlay(id: number | string): void,

	/**
	 * shows an overlay by its id.
	 * @param the ID of the overlay
	*/
	showOverlay(id: number | string): void,

	/**
	 * hides an overlay by its id
	 * @param the ID of the overlay
	*/
	hideOverlay(id: number | string): void,

	/**
	 * checks visibility of the specified overlay. Returns *true* if the overlay is visible.
	 * @param the ID of the overlay
	*/
	isOverlayVisible(id: number | string): boolean

	[customMethod: string]: any;
}

export interface ZoomLevel {

	/**
	 * the name of the level
	*/
	name: string

	/**
	 * an optional caption of the level for zoom controls. Not used by the chart itself
	*/
	label?: string

	/**
	 * the height of the scale
	*/
	scale_height?: number

	/**
	 * the height of the scale
	*/
	height?: number

	/**
	 * the minimal width of a column. It has a higher priority than minColumnWidth and maxColumnWidth
	*/
	min_column_width?: number

	/**
	 * an array of scales to switch between while zooming in/out on this level
	*/
	scales: Scales
}

export interface ZoomToFitRange {

	/**
	 * the start date of the target range
	*/
	start_date: Date

	/**
	 * the end date of the target range
	*/
	end_date: Date
}

export interface ZoomToFitOptions {

	/**
	 * defines whether gantt should fit the currently visible rows or the whole dataset
	*/
	scope?: "visible" | "all"

	/**
	 * allows fitting a subtree or project by its task id
	*/
	taskId?: string | number

	/**
	 * allows fitting an explicit date range
	*/
	range?: ZoomToFitRange

	/**
	 * defines whether zoomToFit should preserve or overwrite the current start_date/end_date bounds
	*/
	rangeMode?: "auto" | "preserve" | "target"

	/**
	 * adds extra columns before the first and after the last fitted date
	*/
	padding?: number

	/**
	 * limits the most detailed zoom level that zoomToFit can pick
	*/
	minLevel?: string | number

	/**
	 * limits the most coarse zoom level that zoomToFit can pick
	*/
	maxLevel?: string | number
}

export interface ZoomToFitContext {

	/**
	 * the date range that should be fitted into the timeline
	*/
	range: ZoomToFitRange

	/**
	 * the available timeline width, in pixels
	*/
	viewportWidth: number

	/**
	 * the zoom levels considered for fitting (fit.levels, or the interactive zoom levels)
	*/
	levels: ZoomLevel[]

	/**
	 * the number of extra columns added around the fitted range
	*/
	padding: number

	/**
	 * the level index the built-in algorithm picked
	*/
	defaultLevel: number
}

export interface ZoomToFitConfig extends ZoomToFitOptions {

	/**
	 * an optional set of zoom levels used only for "zoom to fit"; defaults to the interactive zoom levels
	*/
	levels?: ZoomLevel[]

	/**
	 * overrides the level selection; returns a level name/index, false to abort, or nothing to keep the default
	*/
	handler?: (context: ZoomToFitContext) => string | number | boolean | void
}

export interface ZoomConfig {
	levels?: ZoomLevel[],
	handler?: ((
		e: Event,
	) => void),
	startDate?: Date,
	endDate?: Date,
	activeLevelIndex?: number,
	widthStep?: number,
	minColumnWidth?: number,
	maxColumnWidth?: number,
	useKey?: string,
	trigger?: string | null | undefined,
	element?: HTMLElement | (() => HTMLElement),
	fit?: ZoomToFitConfig,
	current?: string | number,
}

export interface ZoomMethods {

	/**
	 * initializes the extension with the provided configuration.
	 * @param an object with configuration settings that contains the *levels* array of zooming levels and a number of additional properties:
	 * @param required, an array of zooming levels
	 * @param allows specifying a custom handler of the mouse wheel to work with zooming manually
	 * @param a native event object.
	 * @param the start value of the time scale zooming
	 * @param the end value of the time scale zooming
	 * @param the number of the default active level
	 * @param the step of increasing/decreasing the width of scale while switching to the next/previous zooming level
	 * @param the minimal width of a column that allows switching to the previous zooming level
	 * @param the maximal width of a column that allows switching to the next zooming level
	 * @param the key that enables zooming by scrolling the mouse wheel:"ctrlKey" | "altKey" | "shiftKey"
	 * @param the trigger of zooming: "wheel" | null | undefined
	 * @param a DOM element over which zooming is triggered or a function that returns a DOM element
	*/
	init(
		zoomConfig: ZoomConfig
	): void,

	/**
	 * returns the number (index) of the current zooming level
	*/
	getCurrentLevel(): number,

	/**
	 * switches to the specified zooming level.
	 * @param The level is defined either by a string (the name of the level from the config, e.g. "year"), or by its number in the array of levels
	*/
	setLevel(level: number | string): void,

	/**
	 * allows getting all zooming levels
	*/
	getLevels(): ZoomLevel[],

	/**
	 * increases the current zooming level
	*/
	zoomIn(): void,

	/**
	 * decreases the current zooming level
	*/
	zoomOut(): void,

	/**
	 * fits the selected range into the current timeline width by choosing the most detailed matching zoom level
	 * @param optional, zoomToFit settings
	*/
	zoomToFit(options?: ZoomToFitOptions): boolean,

	/**
	 * restores the zoom level and time scale that were active before the first zoomToFit call
	*/
	resetZoom(): boolean,

	/**
	 * attaches an event handler
	 * @param the name of the event handler
	 * @param the function that will be called when the event fires
	*/
	attachEvent<T extends keyof ZoomEvents>(event: T, handler: ZoomEvents[T]): string,

	/**
	 * detaches a handler from an event
	 * @param the id of the attached event handler
	*/
	detachEvent(id: string): void,

	/**
	 * calls an inner event
	 * @param the event's name, case-insensitive
	 * @param optional, an array of the event-related data
	*/
	callEvent(name: string, params: Array<any>): boolean | undefined,

	/**
	 * checks whether an event has some handler(s) specified
	 * @param the event's name
	*/
	checkEvent(name: string): boolean,
}

export interface ZoomEvents {

	/**
	 * fires during switching of the zooming level.
	 * @param the number of the level
	 * @param the config of the level
	*/
	"onAfterZoom": (level: number | string, config: ZoomLevel) => any
}

export interface Tooltip {

	/**
	 * returns the HTML element of the tooltip
	*/
	getNode(): HTMLElement,

	/**
	 * locks the position of tooltip to the boundaries of the specified HTML element
	 * @param the HTML element under the question
	*/
	setViewport(node: HTMLElement): object,

	/**
	 * displays the tooltip at specific coordinates (relative to document.body). The method can take different parameters, depending on the position you want to show the tooltip at. To display tooltip at specific coordinates (relative to document.body), pass x,y coordinates. To display tooltip at the mouse event coordinates pass the Event object. The *tooltip_offset_x/y* and viewport will be taken into account.
	 * @param the X coordinate or the mouse event object
	 * @param the Y coordinate
	*/
	show(config?: number | Event, top?: number): object,

	/**
	 * hides the tooltip element
	*/
	hide(): object,

	/**
	 * puts HTML content into the tooltip. Takes as a parameter:
	 * @param a string with HTML content for the tooltip
	*/
	setContent(html: string): object,
}

export interface Tooltips {

	/**
	 * Tooltip object
	*/
	tooltip: Tooltip,

	/**
	 * adds tooltip with extended configuration. The method takes one parameter:
	 * @param an object with the tooltip settings. The settings are:
	 * @param defines CSS-selector for the elements to listen to mouse events on
	 * @param a handler called when the mouse pointer enters the element. The parameters are:
	 * @param a native mouse event
	 * @param the HTML node
	 * @param optional, a handler called when the mouse pointer moves inside the element. The parameters are:
	 * @param a native mouse event
	 * @param the HTML node
	 * @param a handler called when the mouse pointer leaves the element. The parameters are:
	 * @param a native mouse event
	 * @param the HTML node
	 * @param optional, defines whether the module listens to mouse events on the whole page (*true*) or only inside a gantt element (*false*). By default the option is set to *false*.
	*/
	attach(
		config: {
			selector: string,
			onmouseenter: ((
				event: MouseEvent,
				node: HTMLElement,
			) => void),
			onmousemove?: ((
				event: MouseEvent,
				node: HTMLElement,
			) => void),
			onmouseleave: ((
				event: MouseEvent,
				node: HTMLElement,
			) => void),
			global?: boolean,
		}
	): void,

	/**
	 * adds a tooltip for the specified Gantt element. It is a more simplified version of the **attach()** method. The method takes one parameter:
	 * @param an object with the tooltip settings. The settings are:
	 * @param a CSS-selector of the Gantt element to add a tooltip to
	 * @param a template for the tooltip. The template function takes two parameters in its turn:
	 * @param a native mouse event
	 * @param the HTML node and returns a string with a template.
	 * @param optional, defines whether the module listens to mouse events on the whole page (*true*) or only inside a gantt element (*false*). By default the option is set to *false*.
	*/
	tooltipFor(
		config: {
			selector: string,
			html: ((
				event: Event,
				node: HTMLElement,
			) => HTMLElement | string | number | void),
			global?: boolean,
		}
	): void,

	/**
	 * removes tooltip. As a parameter the method takes:
	 * @param the CSS selector of a Gantt element
	*/
	detach(selector: string): void,
}

export interface DurationFormatter {

	/**
	 * returns *true* if the provided string can be parsed into the duration value, otherwise
	 * @param the string that will be checked
	*/
	canParse(value: string): boolean,

	/**
	 * converts the provided duration value into the duration string
	 * @param the duration value that will be converted
	*/
	format(value: number): string,

	/**
	 * parses the provided string into the duration value. If the value can’t be parsed, ‘null’ will be returned
	 * @param the string that will be converted
	*/
	parse(value: string): number,

}

export interface LinkFormatter {

	/**
	 * returns *true* if the provided string can be parsed into the link object, otherwise
	 * @param the string that will be checked
	*/
	canParse(value: string): boolean,

	/**
	 * converts the provided link value into the string
	 * @param the link object that will be converted
	*/
	format(value: Link): string,

	/**
	 * parses the provided string into the link object. If the value can’t be parsed, ‘null’ will be returned. **Note** that the *link.target* of the given link will have "null" value
	 * @param the string that will be converted
	*/
	parse(value: string): object,

}

export interface Formatters {

	/**
	 * creates a Duration Formatter
	 * @param optional, a configuration object which can include the following attributes:
	 * @param specifies the default format for the **parse** method, which is used when an input value is entering without units. Default value: "day".
	 * @param specifies the format for the duration values storage in the gantt. This property affects the output value of the **parse** method. Default value: "hour".
	 * @param specifies the format for the output value. Supported values: "auto", "minute", "hour", "day", "week", "month", "year", "an array containing any of these values". The "auto" value  means the formatter will try to select an appropriate unit depending on provided value (i.e. larger values will be formatted as days/months/years, smaller values will be formatted as minutes/hours).
	 * @param sets short labels (abbreviations) for time units. Default value: *false*
	 * @param defines how duration values will be converted from minutes to hours and vice-versa. *Default value: 60*
	 * @param defines how duration values will be converted from hours to days and vice-versa. *Default value: 8*
	 * @param defines how duration values will be converted from hours to weeks and vice-versa. *Default value: 40*
	 * @param defines how duration values will be converted from days to months and vice-versa. *Default value: 30*
	 * @param defines how duration values will be converted from days to years and vice-versa. *Default: 365*
	 * @param defines text labels for different time units. These labels are used both for parsed and formatted values.
	 * @param configuration for minutes
	 * @param full text label for minutes
	 * @param plural text label for minutes
	 * @param short text label for minutes
	 * @param configuration for hours
	 * @param full text label for hours
	 * @param plural text label for hours
	 * @param short text label for hours
	 * @param configuration for days
	 * @param full text label for days
	 * @param plural text label for days
	 * @param short text label for days
	 * @param configuration for weeks
	 * @param full text label for weeks
	 * @param plural text label for weeks
	 * @param short text label for weeks
	 * @param configuration for months
	 * @param full text label for months
	 * @param plural text label for months
	 * @param short text label for months
	 * @param configuration for years
	 * @param full text label for years
	 * @param plural text label for years
	 * @param short text label for years
	*/
	durationFormatter(
		config?: {
			enter?: string,
			store?: string,
			format?: string | Array<string>,
			short?: boolean,
			minutesPerHour?: number,
			hoursPerDay?: number,
			hoursPerWeek?: number,
			daysPerMonth?: number,
			daysPerYear?: number,
			labels?: {
				minute?: {
					full?: string,
					plural?: string,
					short?: string,
				},
				hour?: {
					full?: string,
					plural?: string,
					short?: string,
				},
				day?: {
					full?: string,
					plural?: string,
					short?: string,
				},
				week?: {
					full?: string,
					plural?: string,
					short?: string,
				},
				month?: {
					full?: string,
					plural?: string,
					short?: string,
				},
				year?: {
					full?: string,
					plural?: string,
					short?: string,
				},
			},
		}
	): DurationFormatter,

	/**
	 * create a Link Formatter
	 * @param optional, a configuration object which can include the following attributes:
	 * @param an instance of the *DurationFormatter* created by the *gantt.ext.formatters.durationFormatter()*. It affects how lag/lead values of links are parsed and formatted:
	 * @param locale labels for different types of links
	 * @param labels for the Finish to Start links
	 * @param labels for the Start to Start links
	 * @param labels for the Finish to Finish links
	 * @param labels for the Start to Finish links
	 * @param reference the domain task references are shown and parsed in (GS-3626)
	*/
	linkFormatter(
		config?: {
			durationFormatter?: DurationFormatter,
			labels?: {
				finish_to_start?: string,
				start_to_start?: string,
				finish_to_finish?: string,
				start_to_finish?: string,
			},
			/**
			 * `"legacy"` (default) keeps `getWBSCode`, which follows the current display
			 * order; `"outline"` uses the canonical outline number, which ignores sort,
			 * filter, grouping and collapsing; `"row"` uses the row number
			 * (`getRowNumber`). One formatter uses one domain for both output and
			 * parsing - the domain is never inferred from a value.
			 * @default "legacy"
			 */
			reference?: LinkReference,
		}
	): LinkFormatter,
}

export interface EmptyState {

	/**
	 * an array with the IDs of the attached handlers. It is modified by the *attachAddTaskEvent* and *detachAddTaskEvents* methods.
	*/
	clickEvents?: Array<string>,

	/**
	 * returns *true* if there is no data loaded into the Gantt chart, otherwise
	*/
	isGanttEmpty(): boolean,

	/**
	 * returns *true* if the api/gantt_show_empty_state_config.md property is enabled, otherwise
	*/
	isEnabled(): boolean,

	/**
	 * puts an HTML content into the empty state element. The method can be redefined.
	 * @param the container element
	*/
	renderContent(container: HTMLElement): void,

	/**
	 * returns the DOM element where the empty state will be attached to. By default, returns the grid element (the "empty state" will be displayed in the grid). If there is no grid, returns the timeline element (the "empty state" will be displayed in the timeline). The method can be redefined.
	*/
	getContainer(): HTMLElement | null,

	/**
	 * returns the DOM node of the empty state element
	*/
	getNode(): HTMLElement | null,

	/**
	 * displays the "empty state". Returns *null* if there is no container for the Empty State Element.  The extension calls the method by itself
	*/
	show(): null | void,

	/**
	 * hides the "empty state". Returns *false* if there is no Empty State Element node, so there is nothing to hide.  The extension calls the method by itself
	*/
	hide(): boolean | void,

	/**
	 * adds the handler that will fire after clicking on the Empty State Element. By default, it is used to add a new task.
	*/
	attachAddTaskEvent(): void,

	/**
	 * removes the handlers that were used to add a task after clicking on the Empty State Element
	*/
	detachAddTaskEvents(): void
}

/* UI core — internal control kit (design: ai-drafts/ui-controls-library-design.md).
Exposed via gantt.ext.ui for evaluation; the public contract is finalized at the v11 flip (decision D5). */

export interface UIComponent {
	mount(target: HTMLElement): void;
	focus(): void;
	destroy(): void;
	setDisabled(flag: boolean): void;
	getRootNode(): HTMLElement | null;
}

export interface UIControl<TValue = any> extends UIComponent {
	getValue(): TValue;
	setValue(value: TValue): void;
	onChange(handler: (value: TValue) => void): void;
}

export interface UIPopupConfig {
	container?: HTMLElement | (() => HTMLElement | null);
	role?: "dialog" | "alertdialog" | "tooltip" | "menu" | "listbox";
	label?: string | (() => string);
	position?: {
		type?: "center" | "anchor" | "point" | "cursor" | "none";
		target?: HTMLElement;
		side?: "top" | "bottom" | "left" | "right";
		flip?: boolean;
		offset?: number;
		matchTargetWidth?: boolean;
		x?: number;
		y?: number;
		clamp?: boolean;
		offsetX?: number;
		offsetY?: number;
		boundary?: HTMLElement | (() => HTMLElement | null);
	};
	dismiss?: { escape?: boolean, outsideClick?: boolean };
	ignoreOutsideClick?: HTMLElement[];
	className?: string;
	zBand?: "popup" | "modal" | "notification";
	/** legacy-compat: node gets only className (no ui-core skin / z-band classes) */
	unstyled?: boolean;
	/** legacy-compat: content is placed directly into the node, without the body wrapper */
	bareContent?: boolean;
	/** legacy-compat: absolute positioning keeps subpixel antialiasing (fixed nodes composite) */
	cssPosition?: "fixed" | "absolute";
	/** legacy-compat: adopt an existing element as the popup node (markup/classes/aria stay with the owner) */
	node?: HTMLElement;
	/** modal-only: set false to skip the intrinsic focus-first on show */
	autoFocus?: boolean;
	/** modal-only: replaces the default backdrop classes (legacy cover CSS) */
	backdropClassName?: string;
	/** modal-only: append the popup node inside the backdrop (legacy cover > box nesting) */
	nestInBackdrop?: boolean;
	/** element that drags the popup; reposition() is suspended after a user drag until hide() */
	dragHandle?: HTMLElement | (() => HTMLElement | null);
}

export interface UIPopup {
	show(content?: HTMLElement | string | ((body: HTMLElement) => void)): void;
	hide(): void;
	destroy(): void;
	isVisible(): boolean;
	getNode(): HTMLElement | null;
	setContent(content: HTMLElement | string | ((body: HTMLElement) => void)): void;
	reposition(): void;
	attachEvent(name: string, handler: (...args: any[]) => any): string | number;
	detachEvent(id: string | number): void;
}

export interface UIControlFactories {
	button(config?: any): UIComponent;
	text(config?: any): UIControl<string>;
	stepper(config?: any): UIControl<number | null>;
	combo(config?: any): UIControl<string | number | null>;
	datepicker(config?: any): UIControl<Date | null>;
	/** masked time-of-day field; value = minutes past midnight (0..1439) or null */
	time(config?: any): UIControl<number | null>;
	datetime(config?: any): UIControl<Date | null>;
	tabs(config: any): UIControl<string | number>;
	checkboxGroup(config: any): UIControl<Array<string | number>>;
	radioGroup(config: any): UIControl<string | number | null>;
	field(config: any, child: UIComponent): UIComponent;
	toggle(config?: any): UIControl<boolean>;
	menu(config?: any): UIMenu;
}

export interface UIMenuItem {
	id?: string | number;
	label?: string;
	icon?: string;
	disabled?: boolean;
	separator?: boolean;
	checked?: boolean;
	radio?: boolean;
	items?: UIMenuItem[];
}

export interface UIMenu {
	openFor(anchor: HTMLElement): void;
	openAt(x: number, y: number): void;
	close(): void;
	destroy(): void;
	isOpen(): boolean;
	setItems(items: UIMenuItem[]): void;
	attachEvent(name: string, handler: (...args: any[]) => any): string | number;
	detachEvent(id: string | number): void;
}

/** One offered theme on a `theme` toolbar/context-menu item (design 08). */
export interface UIThemeOption {
	/** skin id passed to gantt.setSkin (hyphen form, e.g. "contrast-black") or "auto" */
	id: string;
	label?: string;
	mode?: "light" | "dark" | "auto";
	/** marks a high-contrast variant — ignored by the binary toggle */
	contrast?: boolean;
	icon?: string;
}

/**
 * How the toolbar handles items that do not fit its width:
 * - "menu": items move, from the end, into a "More" menu button (default);
 * - "collapse": all items except pinned ones are in one menu (burger) button;
 * - "wrap": items wrap to new lines, and the toolbar grows.
 */
export type UIToolbarOverflowMode = "menu" | "collapse" | "wrap";

/**
 * Per-item overflow preference:
 * - "auto": can move into the overflow menu (default);
 * - "never": pinned, always stays in the toolbar row;
 * - "always": is only in the overflow menu.
 */
export type UIToolbarItemOverflow = "auto" | "never" | "always";

export type UIToolbarItemComp =
	"button" | "toggle" | "menu" | "combo" | "segmented" |
	"text" | "stepper" | "datepicker" | "label" | "separator" | "spacer";

export interface UIToolbarItem {
	id?: string | number;
	comp?: UIToolbarItemComp;
	label?: string;
	/** Control width in CSS pixels for combo, text, stepper and datepicker items. */
	width?: number;
	/** Accessible name for an input item. Defaults to its visible label. */
	ariaLabel?: string;
	icon?: string;
	tooltip?: string;
	variant?: "primary" | "outline" | "danger" | "link";
	disabled?: boolean;
	hidden?: boolean;
	/** where the item goes when the toolbar is too narrow (default "auto") */
	overflow?: UIToolbarItemOverflow;
	items?: UIMenuItem[];
	options?: Array<{ key: string | number, label: string, icon?: string }>;
	placeholder?: string;
	pressed?: boolean;
	value?: any;
	/** extra config forwarded to the underlying kit control (text/stepper/datepicker) */
	config?: Record<string, any>;
	/** theme item only (id === "theme"): offered skins */
	themes?: UIThemeOption[];
	/** theme item only: persist the pick in localStorage */
	remember?: boolean;
	/** imperative-only callbacks (never serialized into gantt.config) */
	onClick?: (e: Event | null, item: UIToolbarItem) => boolean | void;
	onChange?: (value: any, item: UIToolbarItem) => boolean | void;
}

export type UIToolbarItemDef = string | UIToolbarItem;

export interface UIToolbarConfig {
	/** the gantt instance — required for the top-level Toolbar export */
	gantt?: GanttStatic;
	items?: UIToolbarItemDef[];
	css?: string;
	/** how items that do not fit are handled (default "menu") */
	overflow?: UIToolbarOverflowMode;
	/** with overflow "menu": below this toolbar width (CSS pixels) the toolbar collapses into one menu button */
	collapseWidth?: number;
	onItemClick?: (id: string | number, item: UIToolbarItem, e?: Event | null) => boolean | void;
	onItemChange?: (id: string | number, value: any, item: UIToolbarItem) => boolean | void;
}

export interface UIToolbar extends UIComponent {
	setItems(items: UIToolbarItemDef[]): void;
	updateItem(id: string | number, patch: Partial<UIToolbarItem>): void;
	getItem(id: string | number): UIToolbarItem | null;
	getValue(id: string | number): any;
	setValue(id: string | number, value: any): void;
	getControl(id: string | number): UIComponent | null;
	refresh(): void;
	attachEvent(name: string, handler: (...args: any[]) => any, settings?: any): string | number;
	detachEvent(id: string | number): void;
}

export type ContextMenuItemDef = string | UIMenuItem;

/** per-zone context-menu config; a present key REPLACES that zone's default. */
export interface IContextMenuConfig {
	task?: ContextMenuItemDef[] | false;
	link?: ContextMenuItemDef[] | false;
	empty?: ContextMenuItemDef[] | false;
	header?: ContextMenuItemDef[] | false;
	// reserved for a follow-up: scale, resource
}

export interface IContextMenuEventContext {
	zone: "task" | "link" | "empty" | "header";
	id: string | number | null;
	task?: Task;
	link?: Link;
	area?: "grid" | "timeline";
	date?: Date;
	/** header zone: the column name under the cursor */
	column?: string | null;
	/** RESOLVED items (defaults/config + built-in merge + degradation) — mutable */
	items: UIMenuItem[];
	event: MouseEvent;
	x: number;
	y: number;
}

export interface ContextMenuOpenRequest {
	zone: "task" | "link" | "empty" | "header";
	id?: string | number;
	x?: number;
	y?: number;
	area?: "grid" | "timeline";
	column?: string;
	/** bypass built-in resolution with an explicit item list */
	items?: UIMenuItem[];
}

/** runtime API of the context menu (gantt.ext.contextMenu) */
export interface ContextMenuExt {
	open(request: ContextMenuOpenRequest): void;
	close(): void;
	isOpen(): boolean;
	getMenu(): UIMenu;
}

/** runtime API of the declarative toolbar (gantt.ext.toolbar) */
export interface ToolbarExt {
	setItems(items: UIToolbarItemDef[]): void;
	updateItem(id: string | number, patch: Partial<UIToolbarItem>): void;
	getItem(id: string | number): UIToolbarItem | null;
	getValue(id: string | number): any;
	setValue(id: string | number, value: any): void;
	show(): void;
	hide(): void;
	refresh(): void;
	getToolbar(): UIToolbar | null;
}

export interface UICore {
	createPopup(config?: UIPopupConfig): UIPopup;
	createModal(config?: UIPopupConfig): UIPopup;
	controls: UIControlFactories;
	createToolbar(config?: UIToolbarConfig): UIToolbar;
	/** Raw constructors for advanced composition and subclassing. */
	classes: { [name: string]: any };
	/** Destroys all controls and popups created by this UI-kit instance. */
	destroy(): void;
}

/**
 * Customizable screen-reader descriptions. Override any producer with a function
 * returning plain text; HTML is stripped and quotes are escaped by the engine before use.
 * @example
 * gantt.ext.accessibility.labels.taskBar = (task) => `${task.text}, ${task.progress * 100}% done`;
 */
export interface AccessibilityLabels {
	/**
	 * returns the label of a task bar in the timeline
	 * @param task - the task object
	*/
	taskBar(task: Task): string;

	/**
	 * returns the label of a task row in the grid
	 * @param task - the task object
	*/
	taskRow(task: Task): string;

	/**
	 * returns the label of a dependency link
	 * @param link - the link object
	*/
	link(link: Link): string;

	/**
	 * returns the label of a timescale cell
	 * @param date - the start date of the cell
	 * @param scale - the scale row configuration the cell belongs to
	 * @param precomputedText - ready-made cell text passed by the engine; overrides may ignore it
	*/
	timelineCell(date: Date, scale: any, precomputedText?: string): string;

	/**
	 * returns the label of a resource panel cell (consumed by the resource-panel ARIA integration)
	 * @param resource - the resource object
	 * @param date - the cell date
	 * @param value - the load value of the cell
	*/
	resourceCell(resource: any, date: Date, value: any): string;

	/**
	 * returns the label of a resource-grid row
	 * @param resource - the resource object
	*/
	resourceRow(resource: any): string;
}

/**
 * Public accessibility facade: customizable screen-reader labels,
 * live-region announcements, and the resolved ARIA master switch.
 * @example
 * gantt.ext.accessibility.announce("Sorted by name, ascending");
 */
export interface Accessibility {
	/**
	 * customizable screen-reader label producers
	*/
	labels: AccessibilityLabels;

	/**
	 * pushes a message into the visually-hidden live region so screen readers read it aloud;
	 * no-op when announcements or the ARIA master switch are off
	 * @param text - the plain-text message to announce
	 * @param options - pass `{ assertive: true }` to interrupt the current speech; default is a polite announcement
	 * @example
	 * gantt.ext.accessibility.announce("Task moved to 21 Jul – 25 Jul");
	*/
	announce(text: string, options?: { assertive?: boolean }): void;

	/**
	 * returns the resolved ARIA master switch: an explicitly set legacy
	 * `wai_aria_attributes` wins, otherwise `config.accessibility.aria`
	 * @returns true when ARIA output is enabled
	*/
	isEnabled(): boolean;
}

/** a tab of the open advanced task form, as returned by `getTabs()` */
export interface TaskFormTab {
	id: string;

	/** `locale.labels["tab_" + id]` unless the config sets `label` */
	label: string;

	/** true when the form does not show the tab: hidden by config, or all its sections hidden */
	hidden: boolean;
}

/**
 * what `gantt.ext.taskForm.getControl()` returns for a section:
 * - the UI kit control for `select`, `combo`, `datepicker`, `stepper`, `switch`, `progress`,
 *   `calendar`, `work`, `scheduling_mode`, `effort_driven`, `auto_scheduling` and `unscheduled`;
 * - the `<textarea>` element for `textarea`;
 * - the `<input>` elements of the date and time pickers for `time`;
 * - the section node for every other type.
 */
export type TaskFormSectionControl = UIControl | HTMLElement | HTMLCollectionOf<HTMLInputElement>;

/** the events of the advanced task form, see `gantt.ext.taskForm.attachEvent()` */
export interface TaskFormEvents {

	/**
	 * fires when the form is open and filled for a task: after each open, and after each
	 * rebuild of the open form, for example after a type change. Not for a form built hidden
	*/
	"onRender"(taskId: string | number, api: TaskFormExt): void;

	/** fires when the active tab changes */
	"onTabChange"(tabId: string, prevTabId: string): void;

	/**
	 * fires when the user saves the form, before gantt writes the task.
	 * Return `true` to let the save go on; a falsy result cancels it, as in gantt events
	*/
	"onSave"(taskId: string | number, task: Task, isNew: boolean): boolean;

	/** fires when the user cancels the form */
	"onCancel"(taskId: string | number, isNew: boolean): void;

	/**
	 * fires when the user deletes the task from the form.
	 * Return `true` to let the deletion go on; a falsy result cancels it
	*/
	"onDelete"(taskId: string | number): boolean;

	/** fires after the form closes */
	"onHide"(): void;
}

/**
 * runtime API of the advanced task form (gantt.ext.taskForm)
 * @example
 * gantt.ext.taskForm.setActiveTab("predecessors");
 */
export interface TaskFormExt {
	/** true while the advanced form is open for a task */
	isOpen(): boolean;

	/** the tabs of the open form that have sections, hidden ones included */
	getTabs(): TaskFormTab[];

	getActiveTab(): string | null;

	/** selects a tab of the open form; an unknown or hidden tab is ignored */
	setActiveTab(id: string): void;

	/** the id of the tab a section belongs to, or null when no form is open */
	getSectionTab(sectionName: string): string | null;

	/** the control of a section of the open form, or null; see `TaskFormSectionControl` */
	getControl(sectionName: string): TaskFormSectionControl | null;

	/**
	 * shows an announced error under the section; pass null to clear it. When the section has
	 * no visible cell (hidden, in a hidden tab, left out because its feature is off, or not in the
	 * layout), the message shows in the summary strip above the tabs
	*/
	setSectionError(sectionName: string, message: string | null): void;

	/**
	 * a new copy of a built-in layout, to change and assign to `gantt.config.lightbox.sections`,
	 * `project_sections` or `milestone_sections`. It holds every built-in section; the form leaves
	 * out the sections whose feature is off. Changing the copy does not change the defaults
	 * @param type optional, "task" by default; another value gives the task layout
	 * @example
	 * const form = gantt.ext.taskForm;
	 * const sections = form.getDefaultSections("task");
	 * form.findSection(sections, "deadline")!.label = "Due date";
	 * gantt.config.lightbox.sections = sections;
	 */
	getDefaultSections(type?: "task" | "project" | "milestone"): LightboxTabSections;

	/**
	 * finds a section by name in a layout: through all tabs and nested `cols` and `rows`, hidden
	 * ones included. Returns the section object itself, or null. To work with a section of the
	 * open form, use `gantt.getLightboxSection()`
	 */
	findSection(sections: LightboxSectionEntry[] | LightboxTabSections, name: string): LightboxSection | null;

	/**
	 * attaches a handler to a form event. Form events follow the gantt rule: a handler of
	 * `onSave` or `onDelete` returns `true` to let the action go on, and a falsy result cancels it
	 * @returns the id to pass to detachEvent
	 * @example
	 * gantt.ext.taskForm.attachEvent("onSave", (id, task) => {
	 *     if (task.text) { return true; }
	 *     gantt.ext.taskForm.setSectionError("description", "The task needs a name");
	 *     return false;
	 * });
	 */
	attachEvent<T extends keyof TaskFormEvents>(event: T, handler: TaskFormEvents[T], settings?: HandlerSettings): string;

	/** detaches a handler by the id that attachEvent returned */
	detachEvent(id: string): void;

	/** calls a form event; returns false when a handler cancels it */
	callEvent(name: string, params: Array<any>): boolean | undefined;

	/** checks whether an event has handlers */
	checkEvent(name: string): boolean;
}

/**
 * Link drag-and-drop state, as returned by `gantt.getState("linksDnD")` and
 * passed to the `onLinkDragMove` / `onLinkDragEnd` events.
 */
export interface LinkDragState {
	link_source_id: Id;
	link_target_id: Id | null;
	link_from_start: boolean | null;
	link_to_start: boolean;
	link_landing_area: boolean;
}

/** The constraint types, as `gantt.config.constraint_types` names them. */
export type AutoScheduleConstraintType = "asap" | "alap" | "snet" | "snlt" | "fnet" | "fnlt" | "mso" | "mfo";

/** The forms gantt accepts for a link type. */
export type AutoScheduleLinkType = "0" | "1" | "2" | "3" | 0 | 1 | 2 | 3 | "fs" | "ss" | "ff" | "sf";

/** What drove a task's new date. */
export type AutoScheduleReason =
	| { kind: "asap"; linkId: Id; sourceId: Id }
	| { kind: "alap"; linkId: Id; targetId: Id }
	| { kind: "constraint" }
	| { kind: "preferred" }
	| { kind: "summary-translation"; summaryId: Id }
	/** Resource leveling delayed or paused the task. */
	| { kind: "leveling" };

/** A task whose dates change. */
export interface AutoScheduleUpdate {
	id: Id;
	/** "summary" entries are informational: gantt derives a summary's dates from its tasks. */
	kind: "task" | "summary" | "milestone";
	start_date: Date;
	end_date: Date;
	reason: AutoScheduleReason;
	/** The constraint the task was scheduled with, after defaults. */
	constraint: AutoScheduleConstraintType;
	/** Resource leveling only, when it changes: the task's `leveling_delay`, 0 when cleared. */
	leveling_delay?: number;
	/** Resource leveling only, when it changes: the task's `pauses`, empty when cleared. */
	pauses?: TaskPause[];
}

/**
 * How a user resolves the constraint conflicts of an edit: "adjust" moves the
 * constraint dates, "deactivate" deactivates the dependencies, "remove" removes
 * the constraints, "keep" keeps the constraints and leaves the dependencies
 * unmet, "cancel" reverts the edit.
 */
export type AutoScheduleConflictChoice = "adjust" | "deactivate" | "remove" | "keep" | "cancel";

/** A remedy that Gantt offers for the constraint conflicts of an edit. */
export interface AutoScheduleConflictResolution {
	choice: Exclude<AutoScheduleConflictChoice, "cancel">;
	/** The label the built-in dialog shows for this remedy. */
	text: string;
	/** "adjust" and "remove": the tasks whose constraints change. */
	tasks?: Id[];
	/** "deactivate": the links it deactivates. "keep": the links left unmet. */
	links?: Id[];
}

/** A conflict that scheduling ran into; the schedule still holds. More kinds can be added. */
export type AutoScheduleConflict =
	| {
		kind: "constraint-violation";
		task: Id;
		constraint: AutoScheduleConstraintType;
		violation: "earliest-start" | "latest-start" | "earliest-end" | "latest-end";
		/** The date the constraint requires. */
		required: Date;
		/** The date the links require. */
		actual: Date;
		/**
		 * The dependencies that set `actual`; two or more when they require the same date.
		 * Absent when the scheduling engine does not report them.
		 */
		links?: Id[];
	}
	| {
		/** Reported only with `auto_scheduling.strict_calendar`. */
		kind: "calendar-non-working";
		task: Id;
		proposed: Date;
		snapped: Date;
	};

/** A dependency loop, in the shape of `gantt.findCycles()`. */
export interface AutoScheduleCycle {
	tasks: Id[];
	links: Id[];
}

/** Scheduling-relevant task fields accepted in change sets. */
export interface SchedulingChangeTaskFields {
	start_date?: Date;
	end_date?: Date;
	duration?: number;
	/** `null` clears the constraint. */
	constraint_type?: AutoScheduleConstraintType | null;
	/** `null` clears the date. */
	constraint_date?: Date | null;
	auto_scheduling?: boolean;
	/** The resource leveling delay (`task.leveling_delay`); `null` or 0 clears it. */
	leveling_delay?: number | null;
	/** Pauses inside the task (`task.pauses`); replaces the list, `null` or `[]` clears it. */
	pauses?: TaskPause[] | null;
}

/** An assignment in a change set, with the fields of gantt's assignment store. */
export interface SchedulingChangeAssignmentFields {
	/** In the unit of the resource's `capacity`. Default 8. */
	value?: number;
	/** Default "default": from `delay` to the task end. */
	mode?: "default" | "fixedDuration";
	/** Working time from the task start, in `duration_unit`. Default 0. */
	delay?: number;
	/** Required with "fixedDuration". */
	duration?: number;
}

/**
 * A change set: edits of tasks, links and assignments described as data.
 * `gantt.ext.autoScheduling.preview` and `evaluate` model it; `apply` writes it.
 */
export interface SchedulingChanges {
	tasks?: {
		add?: Array<SchedulingChangeTaskFields & {
			id: Id;
			parent?: Id | null;
			/** Default "task". */
			type?: "task" | "project" | "milestone";
			calendar_id?: Id;
			progress?: number;
			/** Written by `apply`; scheduling does not read it. */
			text?: string;
		}>;
		update?: Array<{ id: Id; /** Written by `apply`; scheduling does not read it. */ text?: string } & SchedulingChangeTaskFields>;
		remove?: Id[];
	};
	links?: {
		add?: Array<{ id?: Id; source: Id; target: Id; type?: AutoScheduleLinkType; lag?: number }>;
		update?: Array<{ id: Id; source?: Id; target?: Id; type?: AutoScheduleLinkType; lag?: number }>;
		remove?: Id[];
	};
	/** Needs a scheduling engine with resource scheduling. */
	assignments?: {
		add?: Array<SchedulingChangeAssignmentFields & { id?: Id; task_id: Id; resource_id: Id }>;
		update?: Array<SchedulingChangeAssignmentFields & { id: Id; task_id?: Id; resource_id?: Id }>;
		remove?: Id[];
	};
}

export interface AutoScheduleAnalyticsOptions {
	slack?: boolean;
	criticalPath?: boolean;
}

/** Schedule from one task, as `gantt.autoSchedule(id, inclusive)` does. */
export interface AutoScheduleSubtree {
	task: Id;
	/** Default `true`: the task itself is scheduled too. */
	inclusive?: boolean;
}

export interface AutoScheduleSolveOptions {
	subtree?: AutoScheduleSubtree;
	/**
	 * Report the periods in which a resource is booked over its capacity, after
	 * the change. Needs a scheduling engine with resource scheduling.
	 */
	overallocations?: boolean;
}

/** Resource leveling options. */
export interface AutoScheduleLevelOptions {
	/** Level only these. `from` and `to` select which overbooked periods are resolved, not where tasks may move. */
	scope?: { resources?: Id[]; tasks?: Id[]; from?: Date; to?: Date };
	/** The size of a load bucket. Default: from `duration_unit`. */
	basis?: "hour" | "day";
	/** The order in which tasks give way. Default "standard": successors, slack, start, then priority. */
	order?: "id" | "standard" | "priority";
	/** Never move the project end. Default false. */
	withinSlackOnly?: boolean;
	/**
	 * Remove the delays and pauses before leveling, of the tasks in scope that leveling may move.
	 * Default true. A manually scheduled, vetoed, completed (`use_progress`), priority 1000 or
	 * `mso`/`mfo`-pinned task keeps them.
	 */
	clearFirst?: boolean;
	/** Pause tasks; false delays them whole. Default true. */
	allowSplits?: boolean;
	/** "skip": delay past the whole overbooked stretch at once. Default "minimal". */
	step?: "minimal" | "skip";
}

/** Why an overbooked period stays after resource leveling. */
export type AutoScheduleOverallocationReason =
	| "pinned-constraint"
	| "fixed-task"
	| "completed"
	| "priority-1000"
	| "slack-exhausted"
	| "out-of-scope";

/** The periods in which a resource is booked over its capacity. */
export interface AutoScheduleOverallocation {
	resource: Id;
	windows: Array<{
		from: Date;
		to: Date;
		capacity: number;
		/** The highest load of a bucket in the period. */
		peak: number;
		/** Load over capacity, summed over the period's buckets. */
		overload: number;
		tasks: Id[];
		/** Resource leveling only. */
		reason?: AutoScheduleOverallocationReason;
	}>;
}

/** The buckets and resources of a load profile. */
export interface AutoScheduleLoadProfileQuery {
	/** Buckets whose start lies in `[from, to)`. */
	from: Date;
	to: Date;
	/** Default: every resource. */
	resources?: Id[];
	/** Default: from `duration_unit`. */
	basis?: "hour" | "day";
	/** List the tasks of each bucket: none (default), only overbooked buckets, or all. */
	tasks?: "none" | "overallocated" | "all";
}

/** The load of resources per hour or day. Load and capacity are in the unit of assignment `value`s. */
export interface AutoScheduleLoadProfile {
	basis: "hour" | "day";
	resources: Array<{
		resource: Id;
		/** "flat": `capacity` in every bucket; "calendar": 0 outside the resource's working time. */
		capacityMode: "calendar" | "flat";
		buckets: Array<{ start: Date; load: number; capacity: number; tasks?: Id[] }>;
	}>;
}

export interface AutoSchedulePreviewOptions extends AutoScheduleSolveOptions {
	/**
	 * Schedule the change set as a user edit (drag, lightbox or inline-editor
	 * save) instead of an edit made from code: moved tasks get the constraint
	 * such an edit sets and lose their `leveling_delay`, as such an edit does,
	 * and summaries keep their spans from before the edit.
	 */
	interactive?: boolean;
	/** Analytics of the previewed schedule. */
	analytics?: AutoScheduleAnalyticsOptions;
	/**
	 * Preview the plan as `level()` would leave it after the change set. Not
	 * with `subtree`. Needs a scheduling engine with resource scheduling.
	 */
	level?: boolean | AutoScheduleLevelOptions;
	/** The load of the previewed plan. Needs a scheduling engine with resource scheduling. */
	profile?: AutoScheduleLoadProfileQuery;
}

export interface AutoScheduleAnalyzeOptions {
	/** Default: both. */
	analytics?: AutoScheduleAnalyticsOptions;
	/** The periods in which a resource is booked over its capacity. Needs a scheduling engine with resource scheduling. */
	overallocations?: boolean;
}

export interface AutoScheduleResult {
	/** In planning order. */
	updates: AutoScheduleUpdate[];
	conflicts: AutoScheduleConflict[];
	/** Nothing is written while there are any. */
	cycles: AutoScheduleCycle[];
	converged: boolean;
	/** Present when `options.overallocations` asks for it. */
	overallocations?: AutoScheduleOverallocation[];
}

export interface AutoScheduleLevelResult extends AutoScheduleResult {
	/** What is still overbooked after leveling, with the reason. */
	overallocations: AutoScheduleOverallocation[];
	/** Leveling passes. */
	rounds: number;
}

/** Scheduling after `gantt.ext.autoScheduling.apply` writes a change set; `solve` and `level` exclude each other. */
export interface AutoScheduleApplyOptions {
	/** Schedule the chart after the write, as `solve(options)` does. */
	solve?: boolean | AutoScheduleSolveOptions;
	/** Level the chart after the write, as `level(options)` does. Needs a scheduling engine with resource scheduling. */
	level?: boolean | AutoScheduleLevelOptions;
	/**
	 * Since v10.1. Write the change set as a user edit and schedule it as one,
	 * under `auto_scheduling.resolve_constraint_conflicts`: a moved task gets the
	 * constraint a user edit sets, and a new conflict opens the dialog. Takes task
	 * updates only, without `parent`; excludes `solve` and `level`.
	 */
	interactive?: boolean;
}

/** What `gantt.ext.autoScheduling.apply` wrote. */
export interface AutoScheduleApplyResult {
	/** "stopped": an event handler cancelled a write; the later changes were not written. */
	status: "applied" | "stopped";
	/**
	 * The changes written, with the ids generated for link and assignment adds that had none.
	 * After a stop, the assignment changes are listed only when every write that carries them went through.
	 */
	applied: SchedulingChanges;
	/** The write a handler cancelled: a task or link change of the set, or the task write that carries assignment changes. */
	stoppedAt?: { section: "tasks" | "links"; action: "add" | "update" | "remove"; id: Id };
	/** The result of `solve` or `level`, when one was requested and every change was written. */
	scheduled?: AutoScheduleResult | AutoScheduleLevelResult | null;
	/**
	 * With `interactive`, when the change set creates new constraint conflicts:
	 * the choice, or "pending" when the call returns before the user decides.
	 */
	resolution?: AutoScheduleConflictChoice | "pending";
}

export interface AutoScheduleAnalytics {
	/** "invalid" when cycles prevent an analysis; `slack` and `criticalPath` are then absent. */
	status: "available" | "invalid";
	/**
	 * `links`: the dependencies that drive the critical path. Absent when the
	 * scheduling engine does not report critical links.
	 */
	criticalPath?: { tasks: Id[]; links?: Id[] };
	/** In `gantt.config.duration_unit`. */
	slack?: Array<{ task: Id; total: number; free: number }>;
}

export interface AutoSchedulePreviewResult extends AutoScheduleResult {
	/** `isNew`: the change set introduced the conflict. */
	conflicts: Array<AutoScheduleConflict & { isNew: boolean }>;
	/** `isNew`: the change set introduced the loop. */
	cycles: Array<AutoScheduleCycle & { isNew: boolean }>;
	/** Present when `options.analytics` asks for it. */
	analytics?: AutoScheduleAnalytics;
	/** Present with `options.profile`. */
	profile?: AutoScheduleLoadProfile;
	/** Leveling passes, with `options.level`. */
	rounds?: number;
	summary: {
		/** How many tasks and milestones would move. */
		tasksAffected: number;
		/** The latest task end before the change. `null` if there are no tasks. */
		finishBefore: Date | null;
		/** The latest task end after the change. */
		finishAfter: Date | null;
	};
}

export interface AutoScheduleAnalysis {
	cycles: AutoScheduleCycle[];
	analytics: AutoScheduleAnalytics;
	/** Present when `options.overallocations` asks for it. */
	overallocations?: AutoScheduleOverallocation[];
}

/** A change set for `gantt.ext.autoScheduling.evaluate`, with the caller's name for it. */
export interface AutoScheduleCandidate {
	/** Returned with the candidate's score. */
	id: Id;
	changes: SchedulingChanges;
}

export interface AutoScheduleEvaluateOptions {
	/** Also level each candidate's plan, as `level()` would, and score it again. */
	level?: boolean | AutoScheduleLevelOptions;
	/** Tasks whose finish and overload the metrics give one by one, in this order. */
	focus?: Id | Id[];
	/**
	 * With `level` only: measure the baseline and every candidate from the chart
	 * without the `leveling_delay` and `pauses` of the tasks that `level()` may
	 * move, so that a leveled chart does not hide its overload. Default `false`.
	 * Not the `clearFirst` of the leveling options, which applies to each
	 * leveling run.
	 */
	clearFirst?: boolean;
}

/** A measure of a scored plan, and its difference from the chart's. */
export interface AutoScheduleAmount {
	value: number;
	delta: number;
}

/** What `evaluate` measures on a plan; every `delta` is against the chart. */
export interface AutoScheduleMetrics {
	finish: {
		/**
		 * The latest task end; `delta` in `duration_unit` of the global calendar's
		 * working time. `null` without tasks.
		 */
		project: { date: Date; delta: number } | null;
		/** The focus tasks, in their order; `delta` in `duration_unit` of the task's calendar. */
		tasks: Array<{ id: Id; finish: { date: Date; delta: number } | null }>;
	};
	overload: {
		/**
		 * Load over capacity, summed over the buckets of every resource, as
		 * `AutoScheduleOverallocation` sums it. Capacity counts at every hour, as
		 * in leveling.
		 */
		total: AutoScheduleAmount;
		/** The resources with overload in the plan or in the chart. */
		resources: Array<{ resource: Id; overload: AutoScheduleAmount }>;
		/** Per focus task: each resource's overload during the task. */
		focus: Array<{ task: Id; resources: Array<{ resource: Id; overload: AutoScheduleAmount }> | null }>;
	};
	conflicts: AutoScheduleAmount;
	cycles: AutoScheduleAmount;
	/**
	 * The engine's score, lower is better: the project's `delta` (not below 0),
	 * plus the overload `value`, plus 1000 for each conflict or cycle.
	 */
	cost: number;
}

export interface AutoScheduleCandidateResult {
	id: Id;
	/** The engine could not apply the candidate; the metrics are then absent. */
	error?: { message: string };
	/** The plan with the candidate's changes, scheduled. */
	scheduled?: AutoScheduleMetrics;
	/** With `options.level`, unless the plan has dependency loops: the same plan, leveled. */
	leveled?: AutoScheduleMetrics & {
		converged: boolean;
		/** Leveling passes. */
		rounds: number;
		/** The overbooked periods that leveling leaves. */
		windows: number;
	};
	/** The `cost` of `leveled` when it is there, else of `scheduled`. */
	cost?: number;
}

export interface AutoScheduleEvaluation {
	/** The chart as `preview(null)` schedules it. */
	baseline: AutoScheduleMetrics;
	/** In the order of the candidates. */
	candidates: AutoScheduleCandidateResult[];
}

/** The people that `slots()` may choose from, with their grades. */
export interface AutoScheduleSkillPool {
	workers: Array<{
		/** A resource of the chart. */
		resource: Id;
		/** Grades; a skill that is not listed counts as 0, a skill without `value` as 1. */
		skills?: Array<{ id: Id; value?: number }>;
	}>;
}

/** What a task needs, for `slots()`: `count` people who meet every condition. */
export interface AutoScheduleRequirement {
	/**
	 * Unique among the requirements. The slot ids are `<id>#1` to `<id>#<count>`,
	 * and an assignment that fills an empty slot gets the slot's id, so keep a
	 * requirement's id on its task.
	 */
	id: Id;
	task: Id;
	/** Every condition must hold. `op` defaults to `"at_least"`, `value` to 1. */
	matches: Array<{ skill: Id; op?: "at_least" | "no_more" | "equal"; value?: number }>;
	/** The number of people. Default 1. */
	count?: number;
	/** The `value` of each assignment, in the unit of the resource's `capacity`. Default 8, as for an assignment without `value`. */
	units?: number;
	/**
	 * The task's assignments that fill the slots, in order. Without it, an
	 * assignment whose id is a slot id fills that slot, and the task's other
	 * assignments fill the slots whose condition their resource meets.
	 */
	assignments?: Id[];
}

/** One person's place on a task, and the people who may take it. */
export interface AutoScheduleSlot {
	/** Unique. An assignment that fills the slot gets this id; it must not be the id of an assignment of another task. */
	id: Id;
	task: Id;
	/** The resources that may take it. */
	allowed: Id[];
	/** The `value` of the assignment that fills it. Default 8. */
	value?: number;
	/** The assignment of the task that fills it now. */
	assignment?: Id;
}

export interface AutoScheduleSuggestOptions {
	/**
	 * The slots the proposal may change: `"empty"` fills slots without an
	 * assignment, `"broken"` replaces a person who is not allowed, `"valid"`
	 * moves allowed people where that lowers the cost. Default `["empty"]`.
	 */
	targets?: Array<"empty" | "broken" | "valid">;
	/** Added to the cost for each person that the proposal brings in, in the units of `cost`. Default 0. */
	newResourcePenalty?: number;
	/** Level each step's plan, as `level()` would, and score it leveled. */
	level?: boolean | AutoScheduleLevelOptions;
	/** Passes over the slots for `"valid"`. Default 1. */
	passes?: number;
	/** Assignments that the proposal must not change. */
	fixed?: Id[];
	/** As in `evaluate()`, with `level` only. `changes` then also removes those delays and pauses. */
	clearFirst?: boolean;
}

/** One step of a staffing proposal. */
export interface AutoScheduleSuggestStep {
	slot: Id;
	task: Id;
	/** 0 for a fill or a repair; the pass otherwise. */
	pass: number;
	/** `null` for a fill. */
	fromResource: Id | null;
	toResource: Id;
	/** The proposal's cost before and after the step. */
	cost: { before: number; after: number };
}

/** A staffing proposal from `suggestAssignments()`. Nothing is written. */
export interface AutoScheduleSuggestion {
	/**
	 * The proposal as a change set that `preview()` takes: assignments added (the
	 * slot's id, `task_id`, `resource_id`, `value`) and assignments given to
	 * another `resource_id`; with `clearFirst`, the `leveling_delay` and `pauses`
	 * that it removed.
	 */
	changes: SchedulingChanges;
	/** In the order that the engine took them. */
	steps: AutoScheduleSuggestStep[];
	/** Empty slots that no allowed person could take. */
	unfilled: Id[];
	/** Slots whose person is not allowed after the proposal. */
	invalid: Id[];
	/** The chart's cost, and the number of the slots' people that it uses. */
	baseline: { cost: number; resources: number };
	proposed: {
		/** The cost of the last stage, plus `newResourcePenalty` for each person brought in. */
		cost: number;
		resources: number;
		scheduled: AutoScheduleMetrics;
		/** With `options.level`. */
		leveled?: AutoScheduleMetrics & { converged: boolean; rounds: number; windows: number };
	};
}

/**
 * Auto scheduling as data (`gantt.ext.autoScheduling`). PRO-only.
 */
export interface AutoScheduling {
	/**
	 * Schedule the chart and write the result, as `gantt.autoSchedule()` does,
	 * events and undo included. Returns the tasks it moved, with the dates they
	 * have after the write. Returns `null` when `onBeforeAutoSchedule` cancels,
	 * or when auto scheduling is already running, for example when it is called
	 * from an `onAfterTaskAutoSchedule` handler.
	 */
	solve(options?: AutoScheduleSolveOptions): AutoScheduleResult | null;
	/**
	 * Level the resources of the chart and write the leveled plan (dates,
	 * `leveling_delay`, `pauses`) as `solve()` writes, events and undo included.
	 * Needs a scheduling engine with resource scheduling; with one that has
	 * none, it throws. Returns `null` where `solve()` does.
	 */
	level(options?: AutoScheduleLevelOptions): AutoScheduleLevelResult | null;
	/**
	 * What would scheduling do after this change set? Nothing is written and no
	 * event fires. `preview(null)` is what `solve()` would do now. During a task
	 * drag, the preview starts from the chart as it was when the drag began.
	 */
	preview(changes?: SchedulingChanges | null, options?: AutoSchedulePreviewOptions): AutoSchedulePreviewResult;
	/** Slack, the critical path and the dependency loops of the chart. */
	analyze(options?: AutoScheduleAnalyzeOptions): AutoScheduleAnalysis;
	/**
	 * Score candidate change sets against the chart, each on its own copy:
	 * scheduled and, with `options.level`, leveled. Nothing is written and no
	 * event fires, as with `preview()`. Throws for a change set that `preview()`
	 * refuses; a candidate that the engine cannot apply gets `error`. Needs a
	 * scheduling engine with candidate scoring; with one that has none, it throws.
	 */
	evaluate(candidates: AutoScheduleCandidate[], options?: AutoScheduleEvaluateOptions): AutoScheduleEvaluation;
	/**
	 * The slots of each requirement: the people of the pool who meet it, and the
	 * task's assignment that fills each slot. Nothing is written. A wrong
	 * argument throws an `Error` whose `path` names the field
	 * (`"requirements[2].count"`). Needs a scheduling engine with staffing;
	 * with one that has none, it throws.
	 */
	slots(pool: AutoScheduleSkillPool, requirements: AutoScheduleRequirement[]): AutoScheduleSlot[];
	/**
	 * Propose who fills the slots: the engine fills, repairs and rebalances them
	 * step by step, each step scored as `evaluate()` scores a candidate. Nothing
	 * is written and no event fires; `apply(result.changes)` writes the proposal.
	 * A wrong argument throws as in `slots()`. Needs a scheduling engine with
	 * staffing; with one that has none, it throws.
	 */
	suggestAssignments(slots: AutoScheduleSlot[], options?: AutoScheduleSuggestOptions): AutoScheduleSuggestion;
	/**
	 * Write a change set to the chart as user edits: the task and link events
	 * fire, so the DataProcessor saves each change, and one `gantt.undo()`
	 * restores the chart as it was before the call. An assignment change is a
	 * write of its task's resource list. The write itself schedules nothing;
	 * with `options.solve` or `options.level`, the chart is scheduled after it,
	 * in the same undo step.
	 *
	 * The change set is checked before the first write, by the rules of
	 * `preview()` and of gantt's link checks; an invalid one throws, and
	 * nothing is written. When an `onBefore*` handler cancels a write, the call
	 * stops there and reports it; the changes written before it stay.
	 *
	 * With `options.interactive`, the change set is a user edit: it is written as
	 * `preview(changes, { interactive: true })` models it, and then scheduled as
	 * after a lightbox save, under `auto_scheduling.resolve_constraint_conflicts`.
	 */
	apply(changes: SchedulingChanges, options?: AutoScheduleApplyOptions): AutoScheduleApplyResult;

	/**
	 * Since v10.1. Run `write` as a user edit of one task, the way a lightbox save
	 * is one: `write` changes the task with the usual task API and calls
	 * `gantt.updateTask(id)`; Gantt then pins a moved task and schedules it under
	 * `auto_scheduling.resolve_constraint_conflicts`, so a conflict opens the
	 * dialog. For custom task forms. `write` runs synchronously. The call throws
	 * before `write` runs for an unknown task, inside `gantt.batchUpdate()`,
	 * during a drag, while auto scheduling runs, inside `apply()` or another
	 * `asUserEdit()`, and while a conflict dialog waits for a decision.
	 */
	asUserEdit(id: Id, write: () => void): AutoScheduleUserEditResult;
}

/** What `gantt.ext.autoScheduling.asUserEdit` came to. */
export interface AutoScheduleUserEditResult {
	/**
	 * When the edit creates new constraint conflicts: the choice, or "pending"
	 * when the call returns before the user decides.
	 */
	resolution?: AutoScheduleConflictChoice | "pending";
}

export interface Ext {
	accessibility: Accessibility,
	inlineEditors: InlineEditorMethods,
	ui: UICore,
	emptyStateElement: EmptyState,
	fullscreen?: Fullscreen,
	formatters: Formatters,
	keyboardNavigation?: KeyNav,
	quickInfo?: QuickInfo,
	undo?: Undo,
	overlay?: Overlay,
	tooltips?: Tooltips,
	zoom: ZoomMethods,
	autoScheduling?: AutoScheduling,
	toolbar?: ToolbarExt,
	contextMenu?: ContextMenuExt,
	wbs?: WBS,
	taskForm?: TaskFormExt,

	[customMethod: string]: any;
}

export type HtmlTemplatePolicy =
	| "basic-sanitize"
	| "escape"
	| "unsafe-html"
	| {
		mode: "sanitize";
		sanitize: (html: string) => string;
	};

export declare function escapeHTML(value: string): string;

export declare function allowRawHTML<T>(fn: T): T;

export declare function basicSanitizeHTML(html: string): string;

export declare function applyTemplatePolicy(result: unknown, policy: HtmlTemplatePolicy | undefined, templateFn?: unknown): unknown;

// Named exports of the PRO web entries only. The Community, GPL and Node builds drop the block
// from their declarations (_dev/scripts/tools/premium_exports.js); keep each marker on its own line.

export type Id = string | number;

declare var gantt: GanttStatic;

declare var Gantt: GanttEnterprise;

/**
 * Top-level Toolbar export (T2): a thin alias over
 * `gantt.ext.ui.createToolbar()`. The gantt instance is still required —
 * `new Toolbar({ gantt, items: [...] })`.
 */
export declare const Toolbar: { new(config: UIToolbarConfig): UIToolbar };

export { gantt, Gantt };
