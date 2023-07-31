// Type definitions for dhtmlxGantt 8.0.4
// Project: https://dhtmlx.com/docs/products/dhtmlxGantt

type GanttCallback = (...args: any[]) => any;


export type GanttEventName = "onAfterAutoSchedule" | "onAfterBatchUpdate" | "onAfterBranchLoading" | "onAfterLightbox" | "onAfterLinkAdd" | "onAfterLinkDelete" | "onAfterLinkUpdate" | "onAfterQuickInfo" | "onAfterRedo" | "onAfterRowResize" | "onAfterSort" | "onAfterTaskAdd" | "onAfterTaskAutoSchedule" | "onAfterTaskDelete" | "onAfterTaskDrag" | "onAfterTaskMove" | "onAfterTaskUpdate" | "onAfterUndo" | "onAjaxError" | "onAutoScheduleCircularLink" | "onBeforeAutoSchedule" | "onBeforeBatchUpdate" | "onBeforeBranchLoading" | "onBeforeCollapse" | "onBeforeDataRender" | "onBeforeExpand" | "onBeforeGanttReady" | "onBeforeGanttRender" | "onBeforeLightbox" | "onBeforeLinkAdd" | "onBeforeLinkDelete" | "onBeforeLinkDisplay" | "onBeforeLinkUpdate" | "onBeforeMultiSelect" | "onBeforeParse" | "onBeforeRedo" | "onBeforeRedoStack" | "onBeforeRollupTaskDisplay" | "onBeforeRowDragEnd" | "onBeforeRowDragMove" | "onBeforeRowResize" | "onBeforeRowResizeEnd" | "onBeforeSplitTaskDisplay" | "onBeforeTaskAdd" | "onBeforeTaskAutoSchedule" | "onBeforeTaskChanged" | "onBeforeTaskDelete" | "onBeforeTaskDisplay" | "onBeforeTaskDrag" | "onBeforeTaskMove" | "onBeforeTaskMultiSelect" | "onBeforeTaskSelected" | "onBeforeTaskUpdate" | "onBeforeUndo" | "onBeforeUndoStack" | "onCircularLinkError" | "onClear" | "onCollapse" | "onColumnResize" | "onColumnResizeEnd" | "onColumnResizeStart" | "onContextMenu" | "onDataProcessorReady" | "onDataRender" | "onDestroy" | "onEmptyClick" | "onError" | "onExpand" | "onGanttLayoutReady" | "onGanttReady" | "onGanttRender" | "onGanttScroll" | "onGridHeaderClick" | "onGridResize" | "onGridResizeEnd" | "onGridResizeStart" | "onLightbox" | "onLightboxButton" | "onLightboxCancel" | "onLightboxChange" | "onLightboxDelete" | "onLightboxSave" | "onLinkClick" | "onLinkCreated" | "onLinkDblClick" | "onLinkIdChange" | "onLinkValidation" | "onLoadEnd" | "onLoadStart" | "onMouseMove" | "onMultiSelect" | "onOptionsLoad" | "onParse" | "onQuickInfo" | "onRowDragEnd" | "onRowDragStart" | "onRowResize" | "onScaleAdjusted" | "onScaleClick" | "onTaskClick" | "onTaskClosed" | "onTaskCreated" | "onTaskDblClick" | "onTaskDrag" | "onTaskIdChange" | "onTaskLoading" | "onTaskMultiSelect" | "onTaskOpened" | "onTaskRowClick" | "onTaskSelected" | "onTaskUnselected" | "onTemplatesReady";


export interface GanttTemplates {

	/**
	 * specifies the content of start date or end date columns in grid
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
	drag_link_class(from: string | number, from_start: boolean, to: string | number, to_start: boolean): string;

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
	 * specifies the format of dates in the "Start time" column
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
	grid_header_class(columnName: string, column: any): string;

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
	grid_row_class(start: Date, end: Date, task: Task): string;

	/**
	 * defines the height of the filled area in the resourceHistogram
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_allocated(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): void;

	/**
	 * specifies the height of the line that defines the available capacity of the resource
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_capacity(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): void;

	/**
	 * defines the CSS class which is applied to a cell of the resource panel
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_class(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): void;

	/**
	 * defines the label inside a cell
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to the specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	histogram_cell_label(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): void;

	/**
	 * specifies the CSS class that will be applied to a link
	 * @param link the link object
	*/
	link_class(link: Link): string;

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
	progress_text(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the CSS class that will be applied to  the pop-up edit form
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	quick_info_class(start: Date, end: Date, task: Task): void;

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
	quick_info_title(start: Date, end: Date, task: Task): string;

	/**
	 * defines the CSS class names of cells in the resource timeline cells
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	resource_cell_class(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string;

	/**
	 * defines the HTML content of resource timeline cells
	 * @param start_date start date of the scale cell
	 * @param end_date end date of the scale cell
	 * @param resource the resource object
	 * @param tasks tasks that are assigned to specified resource and overlap start/end dates of the cell
	 * @param assignments resource assignments that are assigned to the specified start/end dates of the task
	*/
	resource_cell_value(start_date: Date, end_date: Date, resource: any, tasks: Array<Task>, assignments: any[]): string;

	/**
	 * specifies the CSS class that will be applied to cells of the time scale of the timeline area
	 * @param date the date of a cell
	*/
	scale_cell_class(date: Date): string;

	/**
	 * specifies the CSS class that will be applied to the time scale
	 * @param scale the scale's configuration object
	*/
	scale_row_class(scale: Scale): string;

	/**
	 * specifies the CSS class that will be applied to task bars
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_class(start: Date, end: Date, task: Task): string;

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
	task_row_class(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the text in the task bars and the header of the lightbox
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	task_text(start: Date, end: Date, task: Task): string;

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
	task_unscheduled_time(task: Task): void;

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
	timeline_cell_class(item: any, date: Date): string;

	/**
	 * specifies custom HTML content in the timeline cells
	 * @param task the task's object
	 * @param date the date of a cell
	*/
	timeline_cell_content(task: Task, date: Date): string;

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
	tooltip_text(start: Date, end: Date, task: Task): string;

	/**
	 * a string from an XML file is converted into a date object in conformity with this template
	 * @param date the date which needs formatting
	*/
	xml_date(date: Date): string;

	/**
	 * a date object is converted into a string in conformity with this template. Used to send data back to the server
	 * @param date the date which needs formatting
	*/
	xml_format(date: Date): string;

	/**
	 * specifies the text assigned to tasks bars on the right side
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	rightside_text(start: Date, end: Date, task: Task): string;

	/**
	 * specifies the text assigned to tasks bars on the left side
	 * @param start the date when a task is scheduled to begin
	 * @param end the date when a task is scheduled to be completed
	 * @param task the task object
	*/
	leftside_text(start: Date, end: Date, task: Task): string;

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
	auto_scheduling: boolean;

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
	buttons_left: any[];

	/**
	 * stores a collection of buttons resided in the right bottom corner of the lightbox
	*/
	buttons_right: any[];

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
	click_drag: ClickDrag;

	/**
	 * configures the columns of the table
	*/
	columns: GridColumn[];

	/**
	 * contains all available constraint types
	*/
	constraint_types: any;

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
	 * sets the format of the time scale (X-Axis)
	*/
	date_scale: string;

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
	*/
	drag_mode: any;

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
	*/
	drag_timeline: any;

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
	*/
	editor_types: any;

	/**
	 * sets the end value of the time scale
	*/
	end_date: Date | undefined;

	/**
	 * renders an external component into the DOM
	*/
	external_render: any;

	/**
	 * 'says' the Gantt chart to automatically extend the time scale in order to fit all displayed tasks
	*/
	fit_tasks: boolean;

	/**
	 * adjusts the width of columns inside a scrollable grid
	*/
	grid_elastic_columns: boolean | string;

	/**
	 * makes the grid resizable by dragging the right grid's border
	*/
	grid_resize: boolean;

	/**
	 * sets the name of the attribute  of the grid resizer's  DOM element
	*/
	grid_resizer_attribute: string;

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
	lightbox: any;

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
	 * sets the width of the area (over the link) sensitive to clicks
	*/
	link_wrapper_width: number;

	/**
	 * stores the types of links dependencies
	*/
	links: any;

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
	 * specifies whether the gantt container should block the mousewheel event, or should it be propagated up to the window element
	*/
	prevent_default_scroll: boolean;

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
	*/
	resource_calendars: any;

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
	*/
	resources: any;

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
	 * sets the unit of the time scale (X-Axis)
	*/
	scale_unit: string;

	/**
	 * defines configuration settings of the time scale
	*/
	scales: Scale[];

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
	 * sets the step of the time scale (X-Axis)
	*/
	step: number;

	/**
	 * specifies the second time scale(s) (deprecated)
	*/
	subscales: any[];

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
	 * sets the height of task bars in the timeline area
	*/
	task_height: number | string;

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
	type_renderers: any;

	/**
	 * stores the names of lightbox's structures (used for different types of tasks)
	*/
	types: any;

	/**
	 * enables the Undo functionality for the gantt
	*/
	undo: boolean;

	/**
	 * sets the actions that the Undo operation will revert
	*/
	undo_actions: any;

	/**
	 * sets the number of steps that should be reverted by the undo method
	*/
	undo_steps: number;

	/**
	 * sets the types of entities for which the Undo operation will be applied
	*/
	undo_types: any;

	/**
	 * enables WAI-ARIA support to make the component recognizable for screen readers
	*/
	wai_aria_attributes: boolean;

	/**
	 * specifies the speed of scrolling the gantt by the mouse wheel
	*/
	wheel_scroll_sensitivity: any;

	/**
	 * sets both the section and its label on the same line
	*/
	wide_form: boolean;

	/**
	 * enables calculating the duration of tasks in working time instead of calendar time
	*/
	work_time: boolean;

	/**
	 * defines date formats that are used to parse data from a data set and to send data to a server
	*/
	xml_date: string;

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
	getLocale(language?: string): GanttLocale;
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
	addCalendar(calendar: any): string;

	/**
	 * adds a new dependency link
	 * @param link the link object
	*/
	addLink(link: any): string | number;

	/**
	 * displays an additional layer with custom elements for a link in the timeline area
	 * @param func a render function or a config object
	*/
	addLinkLayer(func: any): string;

	/**
	 * adds a marker to the timeline area
	 * @param marker the marker's configuration object
	*/
	addMarker(marker: any): string;

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
	addTask(task: any, parent?: string | number, index?: number): string | number;

	/**
	 * displays an additional layer with custom elements for a task in the timeline area
	 * @param func a render function or a config object
	*/
	addTaskLayer(func: any): string;

	/**
	 * calls an alert message box
	 * @param config either an object with the alert box's configuration or the text to show
	*/
	alert(config: any): HTMLElement;

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
	attachEvent(name: GanttEventName, handler: GanttCallback, settings?: any): string;

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
	checkEvent(name: GanttEventName): boolean;

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
	confirm(config: any): HTMLElement;

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
	createDataProcessor(config: any): any;

	/**
	 * creates a datastore according to the provided configuration
	 * @param config a configuration object of a datastore
	*/
	createDatastore(config: any): DatastoreMethods & TreeDatastoreMethods;

	/**
	 * adds a new task and opens the lightbox to confirm
	 * @param task optional, the task object
	 * @param parent optional, the parent's id
	 * @param index optional, the position the task will be added into (0 or greater)
	*/
	createTask(task?: any, parent?: string | number, index?: number): string | number;

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
	 * detaches all events from dhtmlxGantt (both custom and inner ones)
	*/
	detachAllEvents(): void;

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
	event(node: HTMLElement | string, event: string, handler: GanttCallback, options?: any): void;

	/**
	 * removes an event handler from an HTML element
	 * @param node the HTML node or its id
	 * @param event the name of an HTML event (without the 'on' prefix)
	 * @param handler the event handler
	 * @param options optional, the value of either the <i>useCapture</i> or <i>options</i> parameter. <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener">Read details</a>
	*/
	eventRemove(node: HTMLElement | string, event: string, handler: GanttCallback, options?: any): void;

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
	getGridColumn(name: string | number): any;

	/**
	 * gets columns of the Gantt chart
	*/
	getGridColumns(): any[];

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
	getLightboxSection(name: string | number): any;

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
	getRedoStack(): any[];

	/**
	 * returns all tasks assigned to the resource
	 * @param resourceId the id of the resource
	 * @param taskId the id of the task
	*/
	getResourceAssignments(resourceId: string | number, taskId?: string | number): any[];

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
	getScrollState(): any;

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
	 * checks how much time (in the current duration unit) a task has before it starts to affect other tasks
	 * @param task1 the object of the 1st task to check the slack for
	 * @param task2 the object of the 2nd task to check the slack for
	*/
	getSlack(task1: any, task2: any): number | string;

	/**
	 * gets the current state of the Gantt chart
	*/
	getState(): any;

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
	getTaskAssignments(taskId: string | number): any[];

	/**
	 * returns the height (in pixels) of the DOM element of the task
	 * @param taskId the task's id
	*/
	getTaskBarHeight(taskId: number | string): number;

	/**
	 * finds a task by the specified criteria
	 * @param propertyName the name of the property to match, or a filter function
	 * @param propertyValue the property value
	 * @param types an object with types of the tasks which should be returned
	*/
	getTaskBy(propertyName: string | GanttCallback, propertyValue?: string | number | any[], types?: any): Array<Task>;

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
	getUndoStack(): any[];

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
	groupBy(config: any): void;

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
	 * @param link the link object
	*/
	isLinkAllowed(link: any): boolean;

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
	 * @param calendars an array of calendars' objects
	*/
	mergeCalendars(calendars: any[]): void;

	/**
	 * calls a message box of the specified type
	 * @param config either an object with the message box's configuration or the text to show
	*/
	message(config: any): HTMLElement;

	/**
	 * adds properties of the 'source' object into the 'target' object
	 * @param target the target object
	 * @param source the source object
	 * @param force optional, if true, properties of the 'source' will overwrite matching properties of the 'target', if there are any. If false (by default), properties that already exist in the 'target' will be omitted
	*/
	mixin(target: any, source: any, force?: boolean): void;

	/**
	 * calls a modalbox
	 * @param config the modal box's configuration
	*/
	modalbox(config: any): HTMLElement;

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
	parse(data: any, type?: string): void;

	/**
	 * activates specified extensions
	 * @param ext an object with extension names that need to be activated
	*/
	plugins(ext: any): void;

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
	removeShortcut(shortcut: string, scope: any): void;

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
	roundDate(date: any): Date;

	/**
	 * rounds the start and end task's dates to the nearest dates in the time scale
	 * @param task the task object
	*/
	roundTaskDates(task: Task): void;

	/**
	 * scrolls the layout view to the specified position
	 * @param name the name of the layout view
	 * @param x optional, value of horizontal scroll or 'null' (if the scroll position shouldn't be changed)
	 * @param y optional, value of vertical scroll or 'null' (if the scroll position shouldn't be changed)
	*/
	scrollLayoutCell(name: string, x: number | null, y: number | null): void;

	/**
	 * scrolls the Gantt container to the specified position
	 * @param x optional, value of horizontal scroll or 'null' (if the scroll position shouldn't be changed)
	 * @param y optional, value of vertical scroll or 'null' (if the scroll position shouldn't be changed)
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
	sort(field: string | GanttCallback, desc?: boolean, parent?: string | number, silent?: boolean): void;

	/**
	 * selects the specified task if it was unselected and vice versa
	 * @param task the task's id
	*/
	toggleTaskSelection(task: string | number): void;

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
	label?: string | number,

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
	 * sort configuration after clicking on the column header. When it is set to *false*, sorting is disabled. Otherwise you can set a different task property in the *string* to sort the column or use a custom sorting function
	 * @param the first task that will be sorted
	 * @param the second task that will be sorted
	*/
	sort?: boolean | string | ((task1: Task, task2: Task,) => any)
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
			hours?: Array<string | number> | boolean,
			customWeeks?: {
				[timespan: string]: {
					from: Date,
					to: Date,
					hours?: Array<string | number>,
					days?: Array<string | number | Array<string | number>> | boolean,
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
			hours?: Array<string | number> | boolean,
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
	attachEvent<T extends keyof TreeDatastoreEvents>(event: T, handler: TreeDatastoreEvents[T], settings?: object): boolean,

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
	attachEvent<T extends keyof InlineEditorEvents>(event: T, handler: InlineEditorEvents[T]): boolean,

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
	 * @param the method that will be called when the inline editor is opened
	 * @param the method that will be called when the inline editor is closed
	 * @param the method to destroy mapping
	*/
	setMapping(
		mapping: {
			init: Function,
			onShow: Function,
			onHide: Function,
			destroy: Function,
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
			}
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
	getUndoStack(): Array<object>,

	/**
	 * returns the stack of stored redo user actions
	*/
	getRedoStack(): Array<object>,

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
	 * @param optional, the ID of the overlay
	*/
	addOverlay(render: Function, id?: number | string): string | number,

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

export interface ZoomLevels {

	/**
	 * required, an array of zooming levels, each of which includes the following properties:
	 * @param the name of the level
	 * @param the height of the scale
	 * @param the height of the scale
	 * @param the minimal width of a column. It has a higher priority than minColumnWidth and maxColumnWidth
	 * @param an array of scales to switch between while zooming in/out on this level
	*/
	name: string,
	scale_height?: number,
	height?: number,
	min_column_width?: number,
	scales: Scale[],
}

export interface ZoomMethods {

	/**
	 * initialize the extension with the provided configuration.
	 * @param an object with configuration settings that contains the *levels* array of zooming levels and a number of additional properties:
	 * @param required, an array of zooming levels, each of which includes the following properties:
	 * @param allows specifying a custom handler of the mouse wheel to work with zooming manually
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
			levels: ZoomLevels[],
			handler?: Function,
			startDate?: Date,
			endDate?: Date,
			activeLevelIndex?: number,
			widthStep?: number,
			minColumnWidth?: number,
			maxColumnWidth?: number,
			useKey?: string,
			trigger?: string | null | undefined,
			element?: HTMLElement | Function,
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
	detachEvent(id: string): void

	[customMethod: string]: any;
}

export interface ZoomEvents {

	/**
	 * fires during switching of the zooming level
	 * @param the number of the level
	 * @param the config of the level
	*/
	"onAfterZoom": (level: number | string, config: ZoomLevels) => any
}

export interface Tooltip {

	/**
	 * returns the HTML element of the tooltip
	*/
	getNode(): HTMLElement
	/**
	 * locks the position of tooltip to the boundaries of the specified HTML element
	 * @param the HTML element under the question
	*/
	setViewport(node: HTMLElement): object
	/**
	 * displays the tooltip at specific coordinates (relative to document.body). The method can take different parameters, depending on the position you want to show the tooltip at. To display tooltip at specific coordinates (relative to document.body), pass x,y coordinates. To display tooltip at the mouse event coordinates pass the Event object. The *tooltip_offset_x/y* and viewport will be taken into account.
	 * @param the X coordinate or the mouse event object
	 * @param the Y coordinate
	*/
	show(config?: number | Event, top?: number): object
	/**
	 * hides the tooltip element
	*/
	hide(): object
	/**
	 * puts HTML content into the tooltip. Takes as a parameter:
	 * @param a string with HTML content for the tooltip
	*/
	setContent(html: string): object
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
	 * @param a handler called when the mouse pointer moves inside the element. The parameters are:
	 * @param a native mouse event
	 * @param the HTML node
	 * @param a handler called when the mouse pointer leaves the element. The parameters are:
	 * @param a native mouse event
	 * @param the HTML node
	 * @param defines whether the module listens to mouse events on the whole page (*true*) or only inside a gantt element (*false*). By default the option is set to *false*.
	*/
	attach(
		config: {
			selector: string,
			onmouseenter: ((
				event: MouseEvent,
				node: HTMLElement,
			) => any),
			onmousemove?: ((
				event: MouseEvent,
				node: HTMLElement,
			) => any),
			onmouseleave: ((
				event: MouseEvent,
				node: HTMLElement,
			) => any),
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
			) => any),
			global?: boolean,
		}
	): void,

	/**
	 * removes tooltip. As a parameter the method takes:
	 * @param the CSS selector of a Gantt element
	*/
	detach(selector: string): void
}

export interface DurationFormatter {

	/**
	 * returns *true* if the provided string can be parsed into the duration value, otherwise
	 * @param the string that will be checked
	*/
	canParse(value: string): boolean
	/**
	 * converts the provided duration value into the duration string
	 * @param the duration value that will be converted
	*/
	format(value: number): string
	/**
	 * parses the provided string into the duration value. If the value can’t be parsed, ‘null’ will be returned
	 * @param the string that will be converted
	*/
	parse(value: string): number
}

export interface LinkFormatter {

	/**
	 * returns *true* if the provided string can be parsed into the link object, otherwise
	 * @param the string that will be checked
	*/
	canParse(value: string): boolean
	/**
	 * converts the provided link value into the string
	 * @param the link object that will be converted
	*/
	format(value: Link): string
	/**
	 * parses the provided string into the link object. If the value can’t be parsed, ‘null’ will be returned. **Note** that the *link.target* of the given link will have "null" value
	 * @param the string that will be converted
	*/
	parse(value: string): object
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
	): LinkFormatter
}

export interface EmptyState {

	/**
	 * an array with the IDs of the attached handlers. Modified by the *attachAddTaskEvent* and *detachAddTaskEvents* methods.
	*/
	clickEvents?: Array<string>,

	/**
	 * returns *true* if there is no data loaded into the Gantt chart, otherwise
	 * @param the container element
	*/
	isGanttEmpty(container: HTMLElement): boolean,

	/**
	 * returns *true* if the api/gantt_show_empty_state_config.md property is enabled, otherwise
	 * @param the container element
	*/
	isEnabled(container: HTMLElement): boolean,

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
	 * returns the DOM node of the empty state element.
	*/
	getNode(): HTMLElement | null,

	/**
	 * displays the "empty state". Returns *false* if there is no container for the Empty State Element.  The extension calls the method by itself
	*/
	show(): null | void,

	/**
	 * hides the "empty state". Returns *false* if there is no Empty State Element node, so there is nothing to hide.  The extension calls the method by itself
	*/
	hide(): boolean | void,

	/**
	 * adds the handler that will fire after clicking on the Empty State Element. By default, used to add a new task.
	*/
	attachAddTaskEvent(): void,

	/**
	 * removes the handlers that were used to add a task after clicking on the Empty State Element.
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