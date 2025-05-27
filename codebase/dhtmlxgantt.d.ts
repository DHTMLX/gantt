// Type definitions for dhtmlxGantt 9.0.11
// Project: https://dhtmlx.com/docs/products/dhtmlxGantt

type GanttCallback = (...args: any[]) => any;


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
	 * fires if the server returns an error
	 * @param request XML HTTP request object
	*/
	"onAjaxError"(request: any): boolean;

	/**
	 * fires if some dependency loops were found during auto scheduling
	 * @param groups an array of dependency loops found in gantt
	*/
	"onAutoScheduleCircularLink"(groups: any[]): void;

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
	 * fires when the circular reference has been detected and auto scheduling is not possible
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
	"onTaskDblClick"(id: string, e?: Event): boolean;

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
	marker_class(marker: any): void;

	[customTemplate: string]: any;
}

export interface GanttConfigOptions {

	/**
	 * enables auto scheduling
	*/
	auto_scheduling: boolean | AutoSchedulingConfig;

	/**
	 * disables usage of time contraints for tasks
	*/
	auto_scheduling_compatibility: boolean;

	/**
	 * allows or forbids creating links from parent tasks (projects) to their children
	*/
	auto_scheduling_descendant_links: boolean;

	/**
	 * defines whether gantt will do autoscheduling on data loading/parsing
	*/
	auto_scheduling_initial: boolean;

	/**
	 * defines whether the whole project will be moved (see the details below)
	*/
	auto_scheduling_move_projects: boolean;

	/**
	 * defines whether tasks should inherit the constraint type from their parent project
	*/
	auto_scheduling_project_constraint: boolean;

	/**
	 * enables the auto scheduling mode, in which tasks will always be rescheduled to the earliest possible date
	*/
	auto_scheduling_strict: boolean;

	/**
	 * sets the way the scheduling algorithms process completed tasks
	*/
	auto_scheduling_use_progress: boolean;

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
	constraint_types: {
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
	 * defines internal implementation of the code of date formatting methods
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
	 * @param custom inline editors
	*/
	editor_types: {
		text?: InlineEditor,
		number?: InlineEditor,
		duration?: InlineEditor,
		date?: InlineEditor,
		select?: InlineEditor,
		predecessor?: InlineEditor,
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
	external_render: {
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
	grid_width: number;

	/**
	 * shows the critical path in the chart
	*/
	highlight_critical_path: boolean;

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
	keyboard_navigation: boolean;

	/**
	 * enables keyboard navigation by cells
	*/
	keyboard_navigation_cells: boolean;

	/**
	 * sets the name of the attribute of the task layer's DOM element
	*/
	layer_attribute: string;

	/**
	 * specifies the layout object
	*/
	layout: any;

	/**
	 * specifies the lightbox object
	*/
	lightbox: LightboxSections;

	/**
	 * increases the height of the lightbox
	*/
	lightbox_additional_height: number;

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
	link_line_width: number;

	/**
	 * sets the radius for rounding corners of link lines in the timeline
	*/
	link_radius: number;

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
	multiselect: boolean;

	/**
	 * specifies whether multi-task selection will be available within one or any level
	*/
	multiselect_one_level: boolean;

	/**
	 * enables the possibility to expand/collapse split tasks by clicking the +/- button
	*/
	open_split_tasks: boolean;

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
	quick_info_detached: boolean;

	/**
	 * stores a collection of buttons resided in the pop-up task's details form
	*/
	quickinfo_buttons: any[];

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
	redo: boolean;

	/**
	 * enables the possibility to reorder grid columns by drag and drop
	*/
	reorder_grid_columns: boolean;

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
	resource_attribute: string;

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
	scale_height: number;

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
	schedule_from_end: boolean;

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
	show_markers: boolean;

	/**
	 * enables displaying of the progress inside the task bars
	*/
	show_progress: boolean;

	/**
	 * activates/disables the 'quick_info' extension (pop-up task's details form)
	*/
	show_quick_info: boolean;

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
	tooltip_hide_timeout: number;

	/**
	 * sets the right (if positive) offset of the tooltip's position
	*/
	tooltip_offset_x: number;

	/**
	 * sets the top (if positive) offset of the tooltip's position
	*/
	tooltip_offset_y: number;

	/**
	 * sets the timeout in milliseconds before the tooltip is displayed for a task
	*/
	tooltip_timeout: number;

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
	undo: boolean;

	/**
	 * sets the actions that the Undo operation will revert
	 * @param the name of the "update" action
	 * @param the name of the "remove" action
	 * @param the name of the "add" action
	 * @param the name of the "move" action
	*/
	undo_actions: {
		update?: string,
		remove?: string,
		add?: string,
		move?: string
	}

	/**
	 * sets the number of steps that should be reverted by the undo method
	*/
	undo_steps: number;

	/**
	 * sets the types of entities for which the Undo operation will be applied
	 * @param the name of the "link" entity
	 * @param the name of the "task" entity
	*/
	undo_types: {
		link?: string,
		task?: string
	}

	/**
	 * enables WAI-ARIA support to make the component recognizable for screen readers
	*/
	wai_aria_attributes: boolean;

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
	confirm_closing: string;
	confirm_deleting: string;
	section_description: string;
	section_time: string;
	section_type: string;
	section_deadline: string;
	section_baselines: string;

	/* grid columns */
	column_wbs: string;
	column_text: string;
	column_start_date: string;
	column_duration: string;
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

	[customLabel: string]: any;
}

export interface GanttLocale {
	date: GanttLocaleDate;
	labels: GanttLocaleLabels;
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
	export_api?: boolean;
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

export interface GanttEnterprise {
	plugin(plugin: GanttPlugin): void;
	getGanttInstance(settings?: GanttInitializationConfig): GanttStatic;
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
		parent?: LightboxControl,
		radio?: LightboxControl,
		resources?: LightboxControl,
		select?: LightboxControl,
		template?: LightboxControl,
		textarea?: LightboxControl,
		time?: LightboxControl,
		time_optional?: LightboxControl,
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
	addLink(link: any): string | number;

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
	addTask(task: NewTask, parent?: string | number, index?: number): string | number;

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
	callEvent(name: string, params?: any[]): boolean;

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
	createTask(task?: NewTask, parent?: string | number, index?: number): string | number;

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
	eachParent(code: GanttCallback, startTask: string | number, master?: any): void;

	/**
	 * iterates over all selected tasks in the Gantt chart
	 * @param code a function that will iterate over tasks. Takes a task id as a parameter
	*/
	eachSelectedTask(code: GanttCallback): void;

	/**
	 * iterates over all child tasks of a specific task or the of whole Gantt chart
	 * @param code a function that will iterate over tasks. Takes a task object as a parameter
	 * @param parent the parent id. If specified, the function will iterate over children of the <br> specified parent
	 * @param master the object, that 'this'  will refer to
	*/
	eachTask(code: GanttCallback, parent?: string | number, master?: any): void;

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
	getConstraintType(task: Task): string;

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
	getLastSelectedTask(): string | number;

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
	getMarker(markerId: string | number): any;

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
	 * returns the id of the selected task
	*/
	getSelectedId(): string;

	/**
	 * returns an array of the currently selected tasks
	*/
	getSelectedTasks(): any[];

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
	*/
	getTaskByWBSCode(code: string): Task;

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
	*/
	getWBSCode(task: Task): string;

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
	parse(data: string | DataToLoad1 | DataToLoad2, type?: string): void;

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
	 * rounds the start and end task's dates to the nearest dates in the time scale
	 * @param task the task object
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
	selectTask(id: string | number): string | number;

	/**
	 * serializes the data into JSON or XML format
	 * @param type the format that the data will be serialized into. <br> Possible values: 'json' (<i>default</i> ), 'xml'.
	*/
	serialize(type?: string): any;

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
	toggleTaskSelection(taskId: string | number): void;

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
	unselectTask(id?: string | number): void;

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
	end_date: Date | number,

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
	 * defines the column's id. The name 'add' allows you to add a column with the '+' sign
	*/
	name?: string | number,

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
	 * @param formatter for the date and predecessor types
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
	 * optional, the lightbox sections array for regular tasks
	*/
	sections?: LightboxSection[],

	/**
	 * optional, the lightbox sections array for project tasks
	*/
	project_sections?: LightboxSection[],

	/**
	 * optional, the lightbox sections array for milestones
	*/
	milestone_sections?: LightboxSection[],

	/**
	 * the lightbox sections array for the custom type
	*/
	[lightboxType: string]: LightboxSection[] | undefined
}

export interface LightboxSection {

	/**
	 * the section's name (according to this name, dhtmlxGantt will take the section's label from the *locale.labels* collection).
	*/
	name: string,

	/**
	 * the name of a data property that will be mapped to the section.
	*/
	map_to: string,

	/**
	 * the [type of the section control](desktop/default_edit_form.md#lightboxcontrols) (editor).
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
	 * optional, a formatter for the section
	*/
	formatter?: DurationFormatter | LinkFormatter,

	/**
	 * optional, if you set the "true" value, the section will be read-only
	*/
	readonly?: boolean,

	/**
	 * optional, sets a range for the year selector. Can be set in 2 ways:
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
	text?: string | number,

	/**
	 * the marker's tooltip
	*/
	title?: string | number
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
	drag_id: string | null | undefined,

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
	lightbox: string | null | undefined,

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
	selected_task: string | null | undefined
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
	groups: СollectionItem[],

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
	save_tree_structure?: boolean
}

export interface AutoSchedulingConfig {

	/**
	 * turns auto-scheduling on or off (same as using a boolean value directly).
	*/
	enabled: boolean,

	/**
	 * controls the display of task constraints on the Gantt chart.
	*/
	show_constraints?: boolean
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

export interface DataToLoad1 {

	/**
	 * the array with the task data
	*/
	data: [] | NewTask[]
	tasks?: undefined
	/**
	 * the array with the link data
	*/
	links?: Link[]

	/**
	 * the array with the resource data
	*/
	resources?: NewResourceItem[]

	/**
	 * the array with the assignment data
	*/
	assignments?: NewAssignmentItem[]

	/**
	 * the object that has the arrays with the custom data
	*/
	collections?: Сollections
}

export interface DataToLoad2 {

	/**
	 * the array with the task data
	*/
	tasks: [] | NewTask[]
	data?: undefined
	/**
	 * the array with the link data
	*/
	links?: Link[]

	/**
	 * the array with the resource data
	*/
	resources?: NewResourceItem[]

	/**
	 * the array with the assignment data
	*/
	assignments?: NewAssignmentItem[]

	/**
	 * the object that has the arrays with the custom data
	*/
	collections?: Сollections
}

/**
 * the task object that will be added to Gantt. It can have the following properties:
 * @param optional, the task ID, auto-generated if not set.
 * @param optional, the date when a task is scheduled to begin.
 * @param optional, the task duration.
 * @param optional, the date when a task is scheduled to be completed.
 * @param optional, the task name.
 * @param optional, specifies if the task will be opened on load (to show child tasks).
 * @param optional, the ID of the parent task.
 * @param optional, the date of the task constraint.
 * @param any other property you want to add, including the ones from the [**Task** object](desktop/task_properties.md)
*/
export type NewTask = string | {} | {
	id?: string | number,
	start_date?: string | Date,
	duration?: number,
	end_date?: string | Date,
	text?: string,
	open?: boolean,
	parent?: string | number,
	constraint_date?: string | Date,
	[customProperty: string]: any
}


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
export type NewResourceItem = {
	id?: string | number,
	parent?: string | number,
	text?: string,
	open?: boolean,
	unit?: string | number,
	default_value?: string | number,
	[customProperty: string]: any
}


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
export type NewAssignmentItem = {
	id?: string | number,
	task_id: string | number,
	resource_id: string | number,
	value: number | string,
	mode?: string,
	delay?: number,
	start_date?: string | Date,
	duration?: number,
	end_date?: string | Date,
	[customProperty: string]: any
}


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

export type Scales = ScaleArray<Scale>;

export interface Scale {

	/**
	 * the name of the scale unit. The available values are: "minute", "hour", "day" (default), "week", "quarter", "month", "year".
	*/
	unit: string,

	/**
	 * the step of the time scale (X-Axis), 1 by default.
	*/
	step?: number,

	/**
	 * makes the scale label visible if the scale cell is larger than the viewport width
	*/
	sticky?: boolean,

	/**
	 * a function that returns the name of a CSS class that will be applied to the scale units. Takes a date object as a parameter.
	 * @param a date that will be checked
	*/
	css?(date: Date): any,

	/**
	 * the format of the scale's labels. If set as a function, expects a date object as a parameter.
	 * @param a date that will be converted
	*/
	format?: string | ((date: Date,) => any),

	/**
	 * the format of the scale's labels. If set as a function, expects a date object as a parameter.
	 * @param a date that will be converted
	*/
	date?: string | ((date: Date,) => any)
}

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
		days?: WorkDaysTuple,
		customWeeks?: {
			[timespan: string]: {
				from: Date,
				to: Date,
				hours?: Array<string | number>,
				days?: WorkDaysTuple | boolean,
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
	deleteAfterConfirmation?: boolean
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
	 * resets the time part of the provided date to 00:00:00
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
	 * resets the time part of the provided date to 00:00:00. Alias of the  date_part  method. Used by the Day view to set the display date and can be redefined to provide the default behaviour
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
	to_fixed(num: number): string,

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
					hours?: string[] | number[],
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
			task?: Task,
		},
		end?: Date
	): number

	[customMethod: string]: any;
}

export interface DomHelpers {

	/**
	 * returns position of the element on the screen in the format of `{x:number, y:number,width:number, height:number}` object
	 * @param DOM element that will be checked
	*/
	getNodePosition(node: HTMLElement): object,

	/**
	 * returns mouse coordinates relatively to the DOM element in the format of `{x:number, y:number}` object
	 * @param event that occured
	 * @param DOM element that will be checked
	*/
	getRelativeEventPosition(e: Event, node: HTMLElement): object,

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
	 * optional, preprocesses items loaded into the datastore. It is a good place to set the default values of the datastore items. The function takes the following parameter:
	 * @param the resource item.
	*/
	initItem?(item: any): any
}

export interface DatastoreMethods {

	/**
	 * loads data from an array
	 * @param the data to load
	*/
	parse(data: Array<object>): void,

	/**
	 * returns the item by its id
	 * @param the id of the item
	*/
	getItem(id: string | number): object | void,

	/**
	 * updates the specified item
	 * @param the id of the item
	 * @param an object the item
	*/
	updateItem(id: string | number, item?: object): void,

	/**
	 * deletes the specified item
	 * @param the id of the item
	*/
	removeItem(id: string | number): void,

	/**
	 * checks whether the specified item is visible or hidden via filters
	 * @param the id of the item
	*/
	isVisible(id: string | number): boolean,

	/**
	 * returns the array of visible items
	*/
	getVisibleItems(): Array<object>,

	/**
	 * adds a new item to the datastore
	 * @param the item object
	 * @param the position the task will be added into (0 or greater)
	*/
	addItem(item: object, index?: number): number | string,

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
	exists(id: string | number): boolean,

	/**
	 * moves an item to a new position
	 * @param the index of the current position of the task
	 * @param the index of the position that the item will be moved to
	*/
	move(sindex: number, tindex: number): void,

	/**
	 * clears the datastore
	*/
	clearAll(): void,

	/**
	 * execute the code without firing API events of the datastore
	 * @param the callback function
	*/
	silent(callback: Function): void,

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
	eachItem(callback: Function): void,

	/**
	 * runs the filters and updates visible array of items
	*/
	filter(): void,

	/**
	 * sorts items in the resource grid
	 * @param the name of the column that the resource grid will be sorted by or a custom sorting function
	 * @param specifies the sorting direction: true - descending sort and false - ascending sort. By default, false
	 * @param the id of the parent item. Specify the parameter if you want to sort items only in the branch of the specified parent.
	 * @param specifies whether rendering should be invoked after reordering items
	*/
	sort(field: string | Function, desc?: boolean, parent?: string | number, silent?: boolean): void,

	/**
	 * returns records between the specified indexes
	 * @param the position of the start record
	 * @param the position of the end record
	*/
	getIndexRange(from: number, to: number): Array<object>,

	/**
	 * returns all records of the datastore
	*/
	getItems(): Array<object>,

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
	attachEvent<T extends keyof TreeDatastoreEvents>(event: T, handler: TreeDatastoreEvents[T], settings?: object): string,

	/**
	 * calls an inner event
	 * @param the event's name, case-insensitive
	 * @param an array of the event-related data
	*/
	callEvent(name: string, params: Array<any>): boolean,

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
	 * fires when the id of an item is changed
	 * @param the id of an item
	 * @param the new id of the item
	*/
	"onIdChange": (id: string | number, newId: string | number) => any,

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
	 * fires after the destructor() method of the datastore is called
	*/
	"onDestroy": () => any

	[customEvent: string]: any;
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
	 * returns the 1st-level child items of the specified parent branch
	 * @param the id of the parent branch
	*/
	getChildren(id: string | number): Array<number | string | object>,

	/**
	 * checks whether an item is a child of a different item
	 * @param the id of an item that you want to check as a child
	 * @param the id of an item that you want to check as a parent
	*/
	isChildOf(childId: string | number, parentId: string | number): boolean,

	/**
	 * returns siblings of the specified item (including itself)
	 * @param the id of the item
	*/
	getSiblings(id: string | number): Array<number | string | object>,

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
	getParent(id: string | number): number | string,

	/**
	 * calculates the level of nesting of an item
	 * @param the item's object
	*/
	calculateItemLevel(item: object): number,

	/**
	 * sets the parent for an item. The parent id will be writen to the property specified by `parentProperty` config, "item.parent" by default.
	 * @param the item's object
	 * @param the id of the parent
	*/
	setParent(item: object, newParentId: string | number | null): void,

	/**
	 * iterates over all children of a specific item
	 * @param the callback function
	 * @param the id of the parent
	*/
	eachItem(callback: Function, parentId?: string | number): void,

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
	 * closes the branch with the specified id
	 * @param the branch id
	*/
	close(id: string | number): void,

	/**
	 * sorts items in the resource grid
	 * @param the name of the column that the resource grid will be sorted by or a custom sorting function
	 * @param specifies the sorting direction: true - descending sort and false - ascending sort. By default, false
	 * @param the id of the parent item. Specify the parameter if you want to sort items only in the branch of the specified parent.
	 * @param specifies whether rendering should be invoked after reordering items
	*/
	sort(field: string | Function, desc?: boolean, parent?: string | number, silent?: boolean): void
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
		zoomConfig: {
			levels: ZoomLevel[],
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
		}
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
	callEvent(name: string, params: Array<any>): boolean,

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

export interface Ext {
	inlineEditors: InlineEditorMethods,
	emptyStateElement: EmptyState,
	fullscreen: Fullscreen,
	formatters: Formatters,
	keyboardNavigation: KeyNav,
	quickInfo: QuickInfo,
	undo: Undo,
	overlay: Overlay,
	tooltips: Tooltips,
	zoom: ZoomMethods,

	[customMethod: string]: any;
}

declare var gantt: GanttStatic;

declare var Gantt: GanttEnterprise;

export { gantt, Gantt };