### 7.1.12

Fix the incorrect work of the gantt.isWorkTime() method with the "week" time unit
Fix the issue that prevented tasks and links from being rendered when they were added via the gantt.silent() method
Fix the issue that caused the "Task not found" error message to be shown after data loading in some cases
Fix the incorrect work of the gantt.changeLightboxType() method that left old lightbox elements in DOM
Fix the incorrect calculation of the end dates of tasks when the tasks overlap after the Summer/Winter clock change
Fix the issue that caused the Resource Grid to disappear when the user edited a resource value using the cell editor
Fix the script error that happened when the Gantt layout contained the "resourceGrid"/"resourceTimeline" views but not included the "grid"/"timeline" views
Fix the incorrect work of the autosize config when the Gantt layout contained Resource Panel
Fix the lightbox for split tasks, the lightbox now should be displayed when you double-click on a split task

### 7.1.11

Fix sourcemaps for compressed Gantt files
Fix the incorrect position of markers when autosize = 'y' was applied
Fix the incorrect position of the tooltip and some other elements of Gantt in cases when the Gantt container had extra margin or vertical offsets
Fix the issue that caused rows of the editable resource diagram to change the order after the first cell of the resource assignment was edited
Fix the issue that caused the incorrect work of the smart rendering after expanding or collapsing of tasks in some cases
Fix the issue with the onBeforeDrag event which didn't block the default actions when the click_drag and drag_timeline extensions were activated
Fix the script error that fired when the changeId() method was called for the resource assignments store
Scrollbars of the default Gantt layout no longer require fixed scrollVer/scrollHor names to work correctly
Split tasks now receive the 'gantt_selected' class on selection, in the same way as regular tasks do

### 7.1.10

Fix the issue which caused Gantt not to render a project task if it didn’t have children and the start_date parameter was specified for the task
Fix the issue with resizing a task row by drag and drop if the task ID was either a non-number value or a numeric string with more than 16 symbols
Fix the incorrect work of visibility groups which prevented the sizes of the grid and time scale from being synchronized in the complex layout
Fix the issues with task dates after dragging several tasks horizontally at once
Fix the issue which caused dataProcessor not to send all updates from different datastores when the auto-update mode is disabled
Fix the issue which caused the milestone with the FF link to be moved to the next day
Fix the incorrect calculation of the end_date of milestones when using backward scheduling and setting project_end to the non-working time
Fix the incorrect work of task reordering if HTML elements were displayed above the gantt
Fix the issue with the unsetWorkTime() method when the date/day configuration was removed from the calendar but the changes were not applied immediately
Fix the issue with the clearAll() method which didn’t clear selected tasks if the multiselect extension was enabled
Fix the error appeared when applying the exportToExcel() method with the visual: true parameter and setting the duration_unit config to ‘hour’

### 7.1.9

Fix the issue with alignment of subtasks after dragging a project in the "year" scale and switching between scales dynamically
Fix the issue which caused the duration of the project to change after dragging the project with subtasks in the "month" scale
Fix the issue with Auto Scheduling that caused the constraint type to be changed from "ASAP" to "SNET" after changing the duration of the task
Fix the incorrect work of backward scheduling after changing the start and end dates via inline editors when schedule_from_end is enabled
Now it is possible to open the lightbox for read-only tasks in the read-only mode
Now it is impossible to edit read-only tasks via the lightbox
Fix the issue with the lightbox which caused it not to open for editable tasks in the read-only mode (appeared in v6.3.1)
Fix the issue with resizing columns in grid after hiding the timeline via show_chart
Fix the issue with Auto Scheduling which couldn't be canceled after changing values of project_start and project_end
Fix the issue which caused the gantt to assign constraints to the tasks with disabled auto-scheduling
Fix the issue with defining a year range by the lightbox when the range of dates of tasks is more than 10 years and a range for the year selector isn't specified
Fix the script error that was thrown after loading Gantt if a horizontal scrollbar was attached to 3 or more vertical views
Fix the incorrect work of the onBeforeTaskAutoSchedule event after setting the ASAP constraint for the task without links when the strict mode is enabled
Fix the error occurred when running minified versions of Gantt in Next.js projects
Fix the issue which caused the width of Gantt to be changed after initializing the gantt instance inside an empty container

### 7.1.8

Fix the script error that was thrown from the gantt.groupBy method when the Resource Histogram and fit_tasks config were enabled
Fix the incorrect work of the Undo extension that didn't send updates to the server when vertical reordering was reverted
Fix the issue with the Export to MS Project module which in some cases caused an Unknown error result when custom properties were sent to the export
Fix the incorrect work of the gantt.silent method, which did not prevent gantt.changeTaskId from triggering API events and repaints
Fix the incorrect work of the gantt.undo method that did not restore the original vertical position of the reverted item
Fix the incorrect work of the resource assignment form which caused gantt to replace the user-provided id of the resource assignment with an auto-generated value
Fix the incorrect work of gantt.changeTaskId in cases when the affected tasks had nested items, which caused the level of nested items to be calculated incorrectly

### 7.1.7

Fix issues with incorrect calculation of the total slack values
Performance improvement for total slack calculation
Style fixes for the lightbox in the Material skin
Fix the issue with the Zoom plugin that prevented the zoom.init method from working when calling the method after gantt.init
Fix the script error that happened when using the inherit_calendar config together with the gantt.groupBy method
Fix the script error thrown when adding tasks via gantt.bathUpdate if the placeholder task is active
Fix the issue that allowed the placeholder task to be sorted, reordered, or accept subtasks
Fix issues with incorrect size of grid columns
Fix the incorrect work of the column's resizers which conflicted with reordering of the columns

### 7.1.6

Fix the incorrect work of the auto_scheduling_move_projects config when schedule_from_end is enabled
Fix the incorrect work of the onrender callback of the column which caused custom elements to disappear when the grid is scrolled quickly
Fix the regression (appeared in v7.1.5) which caused rows of the grid to disappear after the grid cell is resized in complex layouts
Fix the incorrect work of the size/visibility groups which prevented the sizes of columns from being synchronized in the complex layout
Improved the display of the grid when the gantt is rendered in a small container

### 7.1.5

Fix the incorrect work of vertical reordering of tasks in the "marker" mode when gantt rows have different heights
Fix the issue with the sizes of the timeline and the grid in some layouts when the "show_grid" and "show_chart" configs are disabled
The "data-column-name" and "data-column-index" attributes are added for cells of the grid header
Fix the incorrect display of the grid after re-initialization of the gantt after removing all columns from the config
Fix the issue that caused the resource panel configuration to overwrite the main configuration of the gantt in Vue.js applications
Added the ability to modify the configuration of the resource panel on the fly by modifying the configuration object provided to the resource layout

### 7.1.4

Fix the incorrect work of unsetWorkTime that caused affected dates to have incorrect work hours
Fix the script error thrown in the Resource histogram after scrolling the histogram when resource_render_empty_cell is set to false and smart_rendering is enabled
Fix the incorrect work of the editNextRow and editPrevRow methods of the Inline Editors module
Fix the incorrect work of the Quick Info popup that caused the popup to be displayed after clicking on the "add" button in the grid
Fix the incorrect work of the ASAP constraints that caused tasks not to be moved to the earliest date of the project
Fix the incorrect work of Inline Editors that prevented constraints from being edited via the inline editor
Fix the incorrect behavior of the "scroll into view" logic of Keyboard Navigation which called an unnecessary scroll when selected task bars are visible
Fix the script error thrown when the mouse is moved outside the container when the click_drag extension is enabled
Performance improvements for the auto_types configuration option of Gantt

### 7.1.3

Fix the script error thrown on gantt.moveTask call when some tasks are hidden via the onBeforeTaskDisplay event
Fix the issue with the speed of the scroll in the latest Firefox browser
Performance improvement for calculations of working time

### 7.1.2

Major performance improvement of the resource panel
Fix the script error thrown when gantt.destructor is called while gantt.load is in progress
Fix the incorrect behavior of split tasks on change of the task id
Fix the incorrect work of scroll on mouse wheel in Angular

### 7.1.1

Fix the regression in the click_drag plugin
Fix the Security Violation error thrown from the gantt when setting the gantt.config.csp config to the "auto" mode
Fix code build settings that caused the package code v7.1.0 to contain ES6 syntax, the library is again ES5 compatible
Fix the script error fired when trying to resize a grid column when gantt.config.reorder_grid_columns config is enabled
Update TypeScript type definitions
Add the onDestroy event to DataStore
Performance improvement for gantts with a large number of task calendars
Performance improvement for calculations of resource assignment during batchUpdate and autoScheduling

### 7.1.0

The ability to assign resources to the specific dates of the task
The new gantt.getTaskAssignments() method
The ability to manage the resource assignments via the new gantt.config.process_resource_assignments and gantt.updateTaskAssignments() Gantt API
Rollup tasks and milestones
The ability to hide task bars and milestones in the timeline area
The ability to set different working hours for different time spans
The ability to set the height for a separate row in the grid
The ability to resize a row in the grid by drag-and-drop
The ability to get the height of the DOM element of the task via the gantt.getTaskBarHeight() method
New events: onBeforeRowResize, onRowResize, onBeforeRowResizeEnd, onAfterRowResize
The onrender callback for rendering a grid cell into DOM is added
The onrender callback for rendering a custom element of the task layer into DOM is added
Fix the issue with reordering tasks vertically in the resource view when resources have values assigned
Fix the issue that caused “resource_cell_value” not being called and the resource markers not being rendered if a task doesn’t start at the beginning of the timeline cell
Fix the issue that caused Gantt to stop working when deleting the task with the id that already exists in the data store
Fix the script error thrown when specifying the 0 number value as a task id even if the “root_id” parameter is set
Fix the issue that caused the resizer listener not to work in Salesforce environment
Fix the script error appeared when applying Fullscreen Extension several times together with its methods
Fix the issue with Keyboard Navigation Extension that caused navigation in Grid to stop working when adding the plugin several times
Fix the issue with Inline Editors when the editor couldn't be opened in a cell that is located after a column that is hidden via hide:true property

### 7.0.13

Fix the script error happened when the layout configuration is changed dynamically and gantt.addTaskLayer is used
Fix the issue with the initial inner height of the resource histogram when the fetchTasks option is used
Fix the incorrect work of the predecessor editor which caused it to delete existing links when the value is edited
Fix the incorrect work of the gantt when a task with a non-unique ID is added to the gantt via the gantt.addTask and gantt.parse methods
Performance improvement for drag and drop when the auto_types and drag_project configuration options are enabled
Performance improvement for calculation of working time when duration_unit is set to "day"

### 7.0.12

Fix some minor issues with vertical drag and drop in large projects
Fix the issue with the incorrect size of the container when the "autosize" config is used
Keyboard navigation should now work correctly with the horizontal scroll of the grid
HTML views of Layout now support external scrollbars
Fix the issue that caused the incorrect state of the grid after reordering tasks, if the additional grid was added to the layout
Fix the script error that happened after clearing and reloading the resource panel if a resource was selected
Add the ability to disable automatic correction of the end date in the time section of the lightbox, which was applied when the selected start date was greater than the end date
Fix a typo in the default config of Duration Formatter
Fix the script error thrown when the gantt is destroyed while a popup message is shown
Fix the initial position of the horizontal scroll in Grid and Timeline in the RTL mode
Fix the incorrect work of the lightbox which caused the selected type of a task not to be saved if the typeselect control was not added to the lightbox configuration
Fix the issue that caused markers to disappear after calling the "gantt.resetLayout()" method
Fix the performance issue with the "drag_project" config used in large projects
Fix the issue that prevented the QuickInfo popup from being displayed in the read-only mode when custom buttons were added to the config

### 7.0.11

Add the container_resize_timeout config for changing the timeout before redrawing Gantt when resizing the container
Add the wheel_scroll_sensitivity config for changing the speed of scrolling the gantt by the mouse wheel
Fix the bug with Auto Scheduling when using different working calendars
Fix the conflict between placeholder tasks and Auto Scheduling
Fix redundant repaints when api/gantt_sort_config.md is enabled
Fix the issue with Inline Editors and a scrollable grid, when inline editors lose focus right after click
Fix the issue that caused Gantt to close the Quick Info popup when the user clicks on it

### 7.0.10

Fix the incorrect work of vertical resizers (the regression appeared in v7.0.9)
Prevent unexpected page refresh which happened during vertical reordering of tasks on Android Chrome (pull-to-refresh)
Fix the script error which fired during creating a link on mobile Firefox
Fix the incorrect work of task selection when the multiselect config is enabled but the multiselect plugin is not activated
Improve the work of HTML select controls inside Inline Editors
Fix the incorrect work of Auto Scheduling when linked tasks use different work calendars
The gantt.plugins method will not activate plugins which are specified with false value
Fix the conflict between Inline Editors and Keyboard Navigation
Fix the issue that caused Inline Editors to close on double click

### 7.0.9

Fix the script error on the second initialization of Gantt when custom datastores are added
Fix the incorrect work of auto-scheduling when using with FF and SS links and when the source and target tasks use different working calendars
Fix the incorrect calculation of working time when duration_unit is set to "minute" and the start time is set to the middle of a non-working day
Fix touch support for Safari iPad on iPadOS v13.6
Fix the sizes of the Lightbox modal overlay on mobile devices
Fix the incorrect display of lightbox buttons in some browsers
Fix support of Italian and Portuguese locales in the gantt.i18n module
Fix the bug in the Parent control of the Lightbox which caused the incorrect work when tasks were assigned to the root level
Fix the script error which happened when initializing a gantt inside an iframe
Fix the incorrect work of the redo config when the undo config is disabled

### 7.0.8

- Fix some issues with touch support on Android/iOS devices
- Fix regression (appeared in v7.0.6) with link creation and gantt.isLinkAllowed method
- Fix the script error which was thrown when the 'locale' parameter was used in gantt.getGanttInstance
- Fix the script error that was thrown from gantt.destructor when the Keyboard Navigation and the Quick Info extensions were used

### 7.0.7

- Fix the syntax error in type definition of gantt.Promise

### 7.0.6

- Fix script errors that were fired on touch devices during drag and drop
- Fix the incorrect work of the Auto Scheduling extension when types of links were defined using numeric values
- Reduced the number of redundant repaints of the resource histogram
- Performance improvements for the task grouping extension
- Fix the ability to scroll a resource timeline on touch devices
- Fix the incorrect work of the resource control when the 'hide empty' button is used
- The return type of gantt.Promise in type definitions is fixed

### 7.0.5

- Performance improvements for work time calculation when the duration_unit config is set to "hour"
- Performance improvements for work time calculation when the duration_unit config is set to "minute"
- The ability to specify working calendars in the configuration object of Gantt.getGanttInstance is added

### 7.0.4

- Removed the 10000px limit on the gantt size in the autosize mode, which should allow printing larger charts
- Drag and drop now finishes when the user releases the mouse button over any part of the document body rather than over the gantt container only
- Portuguese locale was updated
- The return type of gantt.columnIndexByDate in type definitions is fixed
- Fix script errors that were fired when the Gantt instance was destroyed during drag and drop
- Fix the incorrect calculation of end_date/duration when duration_unit is set to "minute" and the last worktime interval finishes after 23:00
- Fix the issue which caused groups of the grouping extension to expand whenever the user modified any task
- Fix the issue which caused the second parameter of dataProcessor.setTransactionMode to be ignored if an object was passed into the first parameter
- Fix the issue which caused the active inline editor to disappear after repaint of Gantt
- Fix the issue with the static_background extension which caused mouse click on empty cells to be interpreted as a click on task elements
- Gantt now dynamically repaints links between split tasks during drag and drop
- Fix the script error which was thrown from gantt.addTask in node.js package
- Fix the script error which was thrown from gantt.destructor in node.js package

### 7.0.3

- Fix regression in the setWorkTime method which caused a script error when the working time is set for a specific day
- Fix the incorrect work of the Keyboard Navigation extension when Gantt is used inside a SalesForce Lightning Web Component

### 7.0.2

- Fix the incorrect work of date formatters when gantt.config.csp is set to true.
- Fix regression in the Click Drag and Drag Timeline extensions which caused the incorrect work when multiple instances of Gantt were created
- Fix the incorrect css class of a task row element after returning the error status from the dataProcessor router function
- Fix the incorrect work of inline editors inside Shadow DOM

### 7.0.1

- Major performance improvement for calculation tasks' duration in the working minutes
- Fix regression in the Tooltip and Undo extensions which caused the incorrect work when multiple instances of Gantt were created
- Fix the issue with the reordering of grid columns which caused the timeline to scroll when a mouse pointer moved to the edge of the grid during drag and drop
- Fix the incorrect position of the column after its dragging and dropping to the right side of the grid border
- dataProcessor custom router should now work correctly with rejected promises
- Fix the regression in smart rendering which caused some links not to be visible
- Split tasks now display not only the first level children but also all nested subtasks
- Fix the issue with split tasks and smart rendering which happened when a split task had the 'task' type
- Fix the issue with split tasks which caused the gantt not to calculate the duration of the 'project' tasks nested in a split task
- Fix the incorrect position of a placeholder after opening an inline editor in the RTL mode

### 7.0.0

- Nodejs-compatible build of dhtmlxGantt is now available
- Update TypeScript type definitions
- Extensions and Locales are now bundled with dhtmlxgantt.js core file and are enabled from config
- Ability to specify work time in minutes
- Ability to merge several work time calendars
- Changed default work hours from 8:00-17:00 to 8:00-12:00, 13:00-17:00
- Simpler format for entering work time intervals for Calendars
- Extend the API of the QuickInfo extension
- CSP mode is enabled by default
- All custom HTML attributes were changed to `data-` attributes
- Add the ability to use `text-overflow:ellipsis` on grid cells
- Add the ability to reorder grid columns by drag and drop
- Add support for 'elastic' column width for the scrollable grid
- gantt.templates.xml_date/gantt.templates.xml_format were replaced with gantt.templates.parse_date/gantt.templates.format_date
- gantt.config.xml_date was replaced with gantt.config.date_format
- Fix the bug which caused a column to change width after hiding and showing the column again
- Fix the bug which disabled the ability to select any task when the multiselect extension was disabled via the `multiselect` config
- Fix the incorrect work of `gantt.sort` for tasks with equal start dates
- Fix drag and drop of a link when Gantt is initialized inside a Web Component

### 6.3.7

- Significant performance improvement for smart rendering of chart and resource panel

### 6.3.6

- Fix the regression in gantt.resetLayout which caused the script error
- Fix the issue with the QuickInfo popup which caused it to be positioned behind the resource panel in some cases
- Fix the script error thrown from the gantt.getShortcutHandler method
- Fix the script error thrown from the tooltip.show(x, y) method
- gantt.getTaskNode now returns the correct HTML element for split tasks
- Fix the issue with horizontal scrollbars not being displayed when visibility groups are specified in some layout configurations

### 6.3.5

- Fix the issue with task grouping which caused vertical scroll position to reset after moving any task with drag and drop
- Fix the script error which happened when drag_timeline config was set to null
- Fix the incorrect position of highlighted cells when static_background and static_background_cells are enabled and smart_rendering is disabled
- Fix the issue with the onAfterBranchLoading event not being called
- Fix the incorrect work of smart rendering when the value of task_height is less than the value of row_height
- A public method for rebuilding gantt layout after changing its config is added

### 6.3.4

- Fix crashes of the resource load diagram when smart rendering is switched off
- Fix issue with the custom task property named "unit", as gantt considered it as a duration unit value and multiplied the task duration after its dragging
- Fix the incorrect Tooltip position when the autosize config is enabled
- Fix the incorrect alignment behavior of grid cells when both the scrollable property and autofit config are set to true
- Creating a link between a task in the timeline and a placeholder in the grid is now blocked
- Fix the bug with the auto scheduling extension that caused gantt to freeze when a task has the constraint type (SNET/FNET/SNLT/FNLT) with no date specified, or with an invalid date

### 6.3.3

- Fix the incorrect resizing behavior of grid that disabled the Timeline in some cases
- gantt.parse should now correctly update the project tree when a parent task is loaded after its children
- Fix compatibility with SalesForce Lightning Aura components framework (Evaluation build)
- Fix the incorrect position of the Tooltip in SalesForce environment
- Fix the incorrect Tooltip position when the gantt container has a vertical margin
- Add missing WAI-ARIA attributes to elements inside the gantt
- Fix the incorrect work of the min_duration config
- Fix the incorrect work of link formatters with custom instances of the gantt

### 6.3.2

- Fix the script error which happened when gantt.destructor was called when the click-drag feature was enabled
- gantt.parse no longer modifies data objects passed into arguments, deep copies are made instead
- TypeScript type definitions were updated
- onBeforeBranchLoading and onAfterBranchLoading public events were added so it would be possible to modify the url or dynamic parameters of dynamic loading requests
- Added a public method for changing the url of the dataProcessor after its initialization

### 6.3.1

- Fix the regression in the smart rendering which caused links not to be rendered in some cases.
- Fix the bug that allowed modifying and creating new tasks with keyboard navigation when the read-only mode is activated
- Fix the display issue with Fullscreen extension which allowed some page elements to be displayed over the gantt in the fullscreen mode
- Fix the bug that caused the drag-timeline extension to reset the value of the readonly config

### 6.3

- Ability to specify decimal units for the duration of tasks
- Ability to scroll the timeline via mouse click and drag
- Ability to drag and drop multiple tasks horizontally

- Ability to display tasks outside the explicit start_date and end_date range of the time scale
- Add a new task_end_date template for formatting end dates of tasks
- Ability to add custom actions to the Undo stack
- Ability to connect custom layers to smart rendering
- Inline editors for predecessors now support formatted values of links
- Remove default limits for input values in date inline editors
- Ability to specify the root node for the Fullscreen extension
- Ability either to change or disable horizontal scroll by shiftKey+mousewheel
- Roboto font was removed from Material skin and has to be imported manually

- Fix crashes of the resource histogram when smart rendering is switched off
- Fix compatibility with r.js compressor
- Fix various conflicts between keyboard navigation and inline editors
- Fix the incorrect state of the DataProcessor when tasks and links were modified sequentially from a custom router
- A correct data object of Task/Link is now also passed into delete call of a custom router

### 6.2.7

- Fix the issue with vertical resizing of grids with horizontal scroll in complex layouts
- Fix the incorrect work of the resource histogram when the scale step is greater than one
- Fix the reopened bug with collapsed branches after calling gantt.parse from v6.2.4 bugfix

### 6.2.6

- Fix the regression in v6.2 Smart Rendering which in some cases caused incorrect vertical positions of tasks after re-initialization of the Gantt
- Fix the issue with QuickInfo popup not being displayed for unscheduled tasks
- Fix incorrect work of extension files with the Ultimate build of Gantt

### 6.2.5

- Fix incorrect initial values of subtasks in the onBeforeTaskChanged event handler after dragging a project with subtasks
- Fix incorrect work of the grouping extension when auto task types are enabled
- Fix the script error after returning the false value from the onTaskLoading event handler
- Add clearer error messages for the exceptions that can be thrown from gantt.load and gantt.parse

### 6.2.4

- Fix the issue with task branches being collapsed after updating data using gantt.parse
- Fix the incorrect work of smart rendering in the resource view
- Fix the issue which caused the Zoom module to attach redundant DOM event handlers on each re-initialization of the Gantt

### 6.2.3

- Fix the incorrect work of the Constraint control in IE11 and MS Edge browsers
- Fix the size of the Gantt element in Fullscreen mode
- Fix the issue with onExpand and onCollapse events not being called from Fullscreen mode
- Correct the Tooltip position when the mouse pointer is near the left/right edge of the screen
- The Tooltip should now be hidden when the Lightbox is opened
- The Tooltip should now be hidden when the chart is scrolled
- Fix the incorrect work of Tooltip which caused the tooltip not to be updated when mouse pointer moved between two elements matching the same selector
- Fix the incorrect work of getTaskBy when null or 0 is provided as a second argument
- Fix the issue with WBS column not being updated after sorting the gantt
- Fix the incorrect display of static_background in Material skin

### 6.2.2

- Add the `gantt.license` property
- Add the `onLinkCreated` API event for new links, similarly to the `onTaskCreated` functionality for new tasks
- `gantt.moveTask` returns false when the action is prevented using onBeforeTaskMove
- Fix the issue which caused a link line to disappear when the render method is called while a user creates a new link
- Fix the issue when markers were not displayed when their start date was set earlier than the minimal date of the time scale
- Fix the issue when markers were not displayed when gantt was initialized with the `gantt.config.show_chart = false` config
- Fix a disappearing modal overlay of the lightbox when a user changed the type of a task
- Fix the issue in keyboard navigation presets, when onAfterTaskUpdate was fired after Shift+left arrow hotkey even if the action was canceled using onBeforeTaskMove

### 6.2.1

- Fix IE11 compatibility of the click-drag feature
- Fix the script error which happened when the user tried to add a new task into an empty chart with the resource view
- Fix the incorrect behavior of the grouping extension which caused assigning an incorrect group value to new tasks
- Fix a script error in the keyboard navigation extension thrown from the Alt+Arrow key shortcut
- Filtering in the resource control is changed to ignore text case
- Task dragging and drag-and-drop may finish on mouseup on any gantt element
- Fix the script error which happened after saving an unscheduled task

### 6.2.0

- Smart rendering is now embedded into the component
- Smart rendering works for rows and cells in all timelines
- static_background allows rendering highlighted cells
- Ability to expand/collapse split tasks (PRO)
- Add new Zoom module, add the ability to zoom by mousewheel
- New options for inline editors
- Simplified scales API
- Fix bug that caused multiple selected tasks to lose CSS classes after repaint
- Fix script error when destroying Gantt from data processor handler

### 6.1.7

- Fix incorrect behavior of getClosestWorkTime
- Fix issue with the autoscroll which happened after toggling visibility of the timeline
- Fix bug in the Multiselect extension which caused selected tasks to lose highlight after chart repaint
- Fix script error which happened after vertical drag-and-drop if smart rendering and keyboard navigation extensions were enabled
- Fix incorrect behavior which happened when users tried to switch between inline editors using the Tab key if some columns of the grid were hidden
- Fix unexpected behavior which prevented the lightbox and inline editors from overriding constraint dates

### 6.1.6

- Fix issue with not working click handlers of QuickInfo popup after a second gantt.init call
- Fix issue with QuickInfo popup not showing up if show_chart config is set to false
- Fix incorrect `action` argument for dataProcessor router after vertical drag-and-drop
- Fix issue when gantt.createTask ignores the `index` parameter

### 6.1.5

- Fix script error on a second gantt.init call when show_chart config is disabled
- Fix incorrect position of order_branch placeholder in the marker mode

### 6.1.4

- Fix script error on reinitialization of gantt in the IE browser
- Fix incorrect behavior of Tooltip extension when gantt.destructor is called
- Fix incorrect work of inline editors in keyboard_navigation_cell mode when grid contains hidden columns
- Fix bug in the Undo extension when Redo action for recreation of new tasks did not restore all properties
- Fix regression in GPL build which caused a script error on a second gantt.init call

### 6.1.3

- gantt.createTask/gantt.addTask should use root_id config value instead of hardcoded 0 id
- Performance increase for worktime calculations for minute and hour duration units
- Minor performance increase for rendering large lists of tasks in the smart rendering mode
- Ensure vertical drag-and-drop doesn't start when the user selects text inside an inline editor
- Fix script error from keyboard navigation in the cell mode after deleting last tasks from the chart
- Ensure Gantt cleans up autogenerated static background style elements after destruction or reinitialization
- Ensure inline editors are not active when read-only mode is enabled
- Fix incorrect selection of grid header cells in the cell mode of keyboard navigation when the sort config is enabled
- Fix regression in the auto_types config which prevented auto type change when new tasks are added
- Fix bug when returning false from onTaskDblClick blocked onLinkDblClick as well
- Fix script error when parsing constraint dates from JSON data
- Fix incorrect position of tasks and markers with the skip_off_time config
- Fix incorrect height of markers after reordering tasks via drag and drop
- New tasks receive the initial value of the progress property
- Fix incorrect task position after vertical drag and drop in the marker mode
- Fix script error from gantt.destructor when the resource panel is enabled
- Fix the bug which caused an empty line to be displayed in a typeselect block
- Fix the bug which caused a task not to be recognized as a part of critical path after id change

### 6.1.2

- Keyboard navigation: add a method for getting the active cell
- Fix incorrect work of the resource panel after creating a new datastore to overwrite the previous one
- Fix incorrect values of query parameters in the POST mode of dataProcessor
- Fix incorrect result of gantt.getClosestWorkTime when called without specifying a direction
- Fix issue when the English locale couldn't override the previously added locale
- Fix script error with gantt.undo and indent actions in the grid
- Fix SalesForce compatibility: new resize listener was broken in SF, fallback is added

### 6.1.1

- Add missing locale options for the resource lightbox control
- Fix script error when using gantt.destructor together with the dataProcessor
- Fix script error when using gantt.destructor together with the resource panel
- Fix the filesize of the tooltip extension
- Fix unexpected call of the onTaskDblClick event while double clicking on a link element
- Fix stuck lightbox cover if gantt.init is called while lightbox is opened
- Fix issues with lightbox and the tooltip extension in the full-screen mode

### 6.1.0

- Ability to add an overlay for the Gantt Chart (PRO)
- Time constraints for tasks (PRO)
- Routing options for dataProcessor
- Project-level working calendars (PRO)
- Ability to create tooltips for all the elements of dhtmlxGantt
- Ability to import dhtmlxGantt as an ES6 module

### 6.0.7

- reduce the number of redundant repaints of the resource diagram
- fix script error from the resource diagram after deleting a task
- fix script error from the fullscreen extension after exiting fullscreen mode on the `Esc` key
- fix incorrect state of links drag and drop when dragging a link between multiple charts on the page. Creating links between gantts is not supported
- fix script error after deleting multiple selected tasks using keyboard navigation extension
- fix default mapping of inline editors. Inline editors shouldn't block keyboard shortcuts on task cells

### 6.0.4

- fix incorrect task position after task vertical dnd in order_branch='marker' mode
- fix script error after deleting a sub-tree which contains selected task
- fix script error on Save/Cancel lightbox containing resource filters

### 6.0.2

- Fix referenceError: getResourceAssignments is not defined when importing Gantt into Vue.js project
- Fix script error on deleting task after assigning resource to it via resource form
- Fix JS error in resource diagram after second initialization of Gantt
- Fix script error on toggle timeline visibility when marker extension is used
- Fix page freeze on gantt.parse if tasks tree contains cyclic references, script error is thrown instead

### 6.0

- Advanced resource management
- New lightbox control for resource management
- Resource histogram
- Add ability to group by multiple resources
- Updated branch ordering
- Public methods for total slack and free slack
- Add JSON-REST dataprocessor mode
- Import from Excel added to online service
- Auto resize when container size changes
- Performance update for auto_types
- Performance update for auto scheduling

### 5.2

- Inline editing in grid
- Split task support
- Updated keyboard navigation
- Add checkbox and radio controls to the lightbox
- Add ability to set task types automatically
- Add ability to use a placeholder row for creating new tasks
- Auto Scheduling performance improvements
- New methods and events for Auto scheduling and Undo extension
- Updated Content Security Policy extension
- Various bugfixes

### 5.1

- Resource load diagram
- RTL mode
- Horizontal scroll for grid and other layout improvements
- Destructors for gantt and data processor instances
- Ability to set min/max widths of grid columns
- Updated API events for a multiselect extension
- Ability to drag and drop projects
- Fixed issues with keyboard navigation in smart rendering mode
- Many bugfixes

### 5.0

- Major architecture overhaul
- Added global layout config
- Added material skin
- Various bugfixes

### 4.2

- Work Time calendars at the task and resource levels
- WBS code (outline numbers) calculation
- Autoscroll for drag and drop operations
- Persian (Farsi) locale
- The getter function for key navigation shortcuts
- The config for cascade deleting of nested tasks and links
- The ability to scroll timeline horizontally on Shift+a mouse wheel movement
- German and Italian locales are updated
- GIF images in the Gantt skins are replaced with PNG
- various fixes

### 4.1

- Added keyboard navigation
- Added WAI-ARIA support
- Added High-contrast themes
- Updated Auto Scheduling and Critical Path calculations (PRO version)
- Performance improvements for worktime calculation and timescale rendering
- Croatian locale added
- Turkish locale updated
- Fixed bug redrawing vertical markers using gantt.updateMarker
- Fixed bug with gantt.showTask error in smart rendering mode
- Bugfixes for skip_off_time config and multi-tier scales configurations
- Bugfixes with dataProcessor and REST mode support

### 4.0

- Added Smart rendering of big data sets feature
- Added Undo/Redo feature
- Public API improvements - public helpers for popups, ajax, environment variables
- Public API cleanup - remove redundant global objects, resolve conflicts with dhtmlxSuite
- Updated critical path calculation - add support for lag/lead of links
- Updated Spanish and Chinese locales
- Minor bugfixes

### 3.3

- Added dependency Auto Scheduling feature *
- Added support for Fullscreen mode
- Added support of unscheduled tasks
- Added initial support of Content Security Policy
- Allow specifying per column grid sorting settings
- Improved branch ordering feature - allow D'n'D between levels
- Support of REST mode for ajax loading/saving
- Support of backward planning

* The marked functionality requires Commercial or Enterprise license, and not provided under GPL

### 3.2

- Added ability to group tasks by custom properties
- Added multiple selection
- Added export to iCal and to Excel
- Added public events for managing tasks reordering in a grid
- Added ability to specify time range in year selector
- Major performance improvement of worktime and critical path calculations
- New samples and API events

### 3.1

- Added ability to drag tasks on touch devices
- Incorrect tooltip behavior on expand/collapse task tree fixed
- Order of API events during gantt initialization fixed
- Issues with markers and multiple initialization of the gantt fixed
- Issues with markers and gantt.clearAll fixed
- Issues with gantt.serialize method and nested projects of gantt tree fixed
- Fixes in French locale
- Improvements in time range calculation

### 3.0

- Support of Baselines, Deadlines and other custom elements of the timeline *
- Critical path support *

- Ability to display vertical lines in a timeline area (Today line, Status line, etc.)

- Ability to resize Grid by D'n'D, ability to hide/show columns dynamically *
- Simplified API for coloring tasks and links *
- New performance-related options - dynamic loading and simple background rendering *

- Extended configuration for managing 'readonly' state of the tasks
- Extended set of methods for managing task tree hierarchy

- Support of task types and ability to skip time from the scale was removed from a Free version of the component

* The marked functionality requires Commercial or Enterprise license, and not provided under GPL


### 2.1

- Milestone and Projects support
- Custom configuration of the lightbox for different task types
- Non-linear scales, ability to skip time from the scale

- Ability to calculate duration in work days/hours instead of calendar time

- Support of multiple gantts on the page (requires PRO version)

- Updated some localisations
- Added more configurations and API methods events
- Various bugfixes

### 2.0

- jQuery integration
- Major performance improvements
- Ready-to-use PHP integration

- Configurable multi-line scales
- Configurable multi-column grid with optional sorting and Drag-n-Drop
- Configurable popup form for editing tasks
- All text elements can be defined through templates
- All date strings can be configured
- All text labels can be localized

- Default skin changed to "terrace"
- 3 new skins
- Bars can have an optional inner resizer
- Optional UI for task creation
- Vertical and horizontal lines can be colored based on custom rules

- Loading and serialization from JSON
- Loading and serialization with the simplified XML format
- 3 types of task linking
- Gantt charts work on touch devices

- A LOT of events added
- Templates and configuration options added
- API simplified, it uses a single gantt object instead of a bunch of different objects