import eventable from "../../utils/eventable";
import * as domHelpers from "../../core/ui/utils/dom_helpers";

import keyboard_shortcuts from "./common/keyboard_shortcuts";
import eventhandler from "./common/eventhandler";
import gantt_node from "./elements/gantt_node";
import nav_node from "./elements/nav_node";
import header_cell from "./elements/header_cell";
import task_row from "./elements/task_row";
import task_cell from "./elements/task_cell";
import resource_grid_row from "./elements/resource_grid_row";
import resource_grid_cell from "./elements/resource_grid_cell";
import resource_cell, { activateFirstResourceCell } from "./elements/resource_cell";
import { getBoundGridViews, viewIndexForGlobalColumn } from "./helpers/grid_views_helpers";
import modals from "./modals";
import core from "./core";
import type { GanttStatic, GridColumn, Id, Task } from "../../types/gantt_types";
import type {
	KeyboardCommand,
	KeyboardNavigationActiveNode,
	KeyboardNavigationFacade,
	KeyboardNavigationFocusConfig,
	GanttWithKeyboardNavigation,
	KeyboardNavigationGridView,
	KeyboardNavigationNode,
	KeyboardScope,
	KeyboardShortcutHandler
} from "./types";

interface EventableFactory {
	(target: KeyboardNavigationFacade): void;
}

type TaskNodeConstructor = Function & {
	new(id?: Id | null, index?: number): KeyboardNavigationNode;
	prototype: KeyboardNavigationNode;
};

type SmartRenderRedraw = (this: unknown, renderers: unknown, items: Task[]) => unknown;

export default function(ganttBase: GanttStatic): void{
	const gantt = ganttBase as unknown as GanttWithKeyboardNavigation;
	function setupKeyNav(gantt: GanttWithKeyboardNavigation): void{
		gantt.config.keyboard_navigation = true;
		gantt.config.keyboard_navigation_cells = false;

		gantt.$keyboardNavigation = {} as GanttWithKeyboardNavigation["$keyboardNavigation"];

		gantt._compose = function(...parts: unknown[]): any{
			const res: Record<string, unknown> = {};
			for(let i = 0; i < parts.length; i++){
				let obj = parts[i] as Record<string, unknown> | TaskNodeConstructor;
				if(typeof obj == "function"){
					obj = new obj() as unknown as Record<string, unknown>;
				}

				for(const p in obj){
					res[p] = obj[p];
				}
			}
			return res;
		};

		keyboard_shortcuts(gantt);
		eventhandler(gantt);
		gantt_node(gantt);
		nav_node(gantt);
		header_cell(gantt);
		task_row(gantt);
		task_cell(gantt);
		resource_grid_row(gantt);
		resource_grid_cell(gantt);
		resource_cell(gantt);
		modals(gantt);
		core(gantt);


		(function(){
			const dispatcher = gantt.$keyboardNavigation.dispatcher;

			dispatcher.isTaskFocused = function(id: Id): boolean{
				const node = dispatcher.activeNode;
				if(node && ((node as object) instanceof gantt.$keyboardNavigation.TaskRow || (node as object) instanceof gantt.$keyboardNavigation.TaskCell)) {
					if (node.taskId == id) {
						return true;
					}
				}
				return false;
			};

			const keyDownHandler = function(e: Event): void{
				if(!gantt.config.keyboard_navigation) return;
				// GS-734 & GS-1078: we don't need keyboard navigation inside inline editors
				if(!gantt.config.keyboard_navigation_cells && isInlineEditorCell(e)) return;

				if (isNoKeyboardNavigationElement(e) || isLightboxElement(e) || isKitWidgetElement(e.target)){
					return;
				}
				
				if (isNativeControl(e)){
					return;
				}

				if (handleGridViewTabJump(e as KeyboardEvent)){
					return;
				}

				return dispatcher.keyDownHandler(e as KeyboardEvent);
			};

			const focusHandler = function(e: Event): false | void{
				if(dispatcher.$preventDefault){
					e.preventDefault();
					gantt.$container.blur();
					return false;
				// do nothing if key-nav focus is already planned
				} else if (!dispatcher.awaitsFocus()) {
					focusTaskArea();
				}

			};

			function focusTaskArea(): void{
				if(isResourceNode(dispatcher.activeNode)){
					dispatcher.delay(function(){
						dispatcher.enable();
						dispatcher.setDefaultNode();
					});
				}else{
					dispatcher.focusGlobalNode();
				}
			}

			const reFocusActiveNode = function(): void{
				if(!dispatcher.isEnabled())
					return;

				const activeElement = document.activeElement;
				const outsideGantt = !domHelpers.isChildOf(activeElement, gantt.$container) && activeElement?.localName != "body";
				const activeNode = dispatcher.getActiveNode();
				if(!activeNode || outsideGantt || isKitWidgetElement(activeElement))
					return;

				const domElement = activeNode.getNode();
				let top: number | undefined;
				let left: number | undefined;
				if(domElement && domElement.parentNode){
					const parentNode = domElement.parentNode as HTMLElement;
					top = parentNode.scrollTop;
					left = parentNode.scrollLeft;

				}

				activeNode.focus(true);

				if(domElement && domElement.parentNode){
					const parentNode = domElement.parentNode as HTMLElement;
					if (top !== undefined) parentNode.scrollTop = top;
					if (left !== undefined) parentNode.scrollLeft = left;
				}
			};


			gantt.attachEvent("onDataRender", function(){
				if(!gantt.config.keyboard_navigation) return;
				reFocusActiveNode();
			});

			// onDataRender defers while the confirm dialog is open; retry on close if
			// focus was stranded on <body> (the deleted row's focus restore is a no-op).
			gantt.attachEvent("onAfterLightbox", function(){
				if(!gantt.config.keyboard_navigation) return;
				if(document.activeElement?.localName != "body") return;
				reFocusActiveNode();
			});

			gantt.attachEvent("onGanttRender", function(){
				//GS-2230: in case if `getGanttInstance` created without container
				if(!gantt.$root) return;
				gantt.eventRemove(gantt.$root, "keydown", keyDownHandler);
				gantt.eventRemove(gantt.$container, "focus", focusHandler);
				gantt.eventRemove(gantt.$container, "mousedown", mousedownHandler);

				if(gantt.config.keyboard_navigation){

					gantt.event(gantt.$root, "keydown", keyDownHandler);
					gantt.event(gantt.$container, "focus", focusHandler);
					gantt.event(gantt.$container, "mousedown", mousedownHandler);
					const toolbarZone = setupTaskGridZone();
					gantt.$container.setAttribute("tabindex", toolbarZone ? "-1" : "0");
					setupResourceZones();

				}else{
					gantt.$container.removeAttribute("tabindex");
				}
			});

			function attachResourceZone(node: HTMLElement & { $resZoneAttached?: boolean }, activate: () => void): void{
				const focusInside = domHelpers.isChildOf(document.activeElement, node) || document.activeElement === node;
				node.setAttribute("tabindex", focusInside ? "-1" : "0");
				if(node.$resZoneAttached) return;
				node.$resZoneAttached = true;

				gantt.event(node, "focusin", function(): void{
					node.setAttribute("tabindex", "-1");
				});
				gantt.event(node, "focus", function(e: Event): void{
					if(e.target !== node) return; // only the container itself (Tab landed here)
					node.setAttribute("tabindex", "-1");
					dispatcher.delay(function(){
						dispatcher.enable();
						activate();
					});
				});
				gantt.event(node, "focusout", function(): void{
					setTimeout(function(){
						if(!domHelpers.isChildOf(document.activeElement, node) && document.activeElement !== node){
							node.setAttribute("tabindex", "0");
						}
					});
				});
			}

			// GS-3490: make each resource-bound panel view (grid and timeline - the
			// load matrix / histogram) its own Tab-stop. Found by store binding, not by
			// layout id (that id varies between configs). The grid navigates by row or
			// cell depending on keyboard_navigation_cells; the timeline is always
			// cell-granular.
			function setupResourceZones(): void{
				const layout = (gantt as unknown as { $layout?: { getCellsByType(t: string): Array<{ $config?: { id?: string } }> } }).$layout;
				if(!layout || !layout.getCellsByType) return;
				const cells = layout.getCellsByType("viewCell");
				for(let i = 0; i < cells.length; i++){
					const cell = cells[i];
					const id = cell && cell.$config && cell.$config.id;
					const view = (id ? gantt.$ui.getView(id) : null) as unknown as
						{ $config?: { bind?: string }, $grid?: HTMLElement, $grid_data?: HTMLElement, $task?: HTMLElement, $task_data?: HTMLElement } | null;
					if(!(view && view.$config && view.$config.bind === gantt.config.resource_store)){
						continue;
					}

					if(view.$grid){
						const node = (view.$grid_data || view.$grid) as (HTMLElement & { $resZoneAttached?: boolean });
						if(node){
							attachResourceZone(node, function(){
								const ResourceNode = gantt.config.keyboard_navigation_cells
									? gantt.$keyboardNavigation.ResourceGridCell
									: gantt.$keyboardNavigation.ResourceGridRow;
								dispatcher.setActiveNode(new ResourceNode());
							});
						}
					}else if(view.$task){
						const node = (view.$task_data || view.$task) as (HTMLElement & { $resZoneAttached?: boolean });
						if(node){
							attachResourceZone(node, function(){
								activateFirstResourceCell(gantt);
							});
						}
					}
				}
			}

			function setupTaskGridZone(): boolean{
				if(!gantt.$container.querySelector(".dhx_ui_toolbar")) return false;
				const grid = gantt.$ui.getView("grid") as unknown as { $grid_data?: HTMLElement } | null;
				const node = grid && grid.$grid_data;
				if(!node) return false;
				attachResourceZone(node, focusTaskArea);
				return true;
			}

			function getTaskNodeConstructor(): TaskNodeConstructor{
				if (gantt.config.keyboard_navigation_cells) {
					return gantt.$keyboardNavigation.TaskCell;
				} else {
					return gantt.$keyboardNavigation.TaskRow;
				}
			}

			function isInlineEditorCell(e: Event): boolean{
				return !!domHelpers.closest(e.target, ".gantt_grid_editor_placeholder");
			}
			// GS-1445. Cancel keyboard navigation within custom elements
			function isNoKeyboardNavigationElement(e: Event): boolean{
				return !!domHelpers.closest(e.target, ".no_keyboard_navigation");
			}
			function isLightboxElement(e: Event): boolean{
				return !!domHelpers.closest(e.target, ".gantt_cal_light");
			}

			function isKitWidgetElement(node: EventTarget | null): boolean{
				if(!node || !(node as Element).nodeType) return false;
				return !!domHelpers.closest(node, ".dhx_ui_toolbar, .dhx_ui_menu, .dhx_ui_popup");
			}
			function isResourceNode(node: KeyboardNavigationNode | null | undefined): boolean{
				if(!node) return false;
				const kn = gantt.$keyboardNavigation;
				return (!!kn.ResourceGridRow && (node as object) instanceof kn.ResourceGridRow) ||
					(!!kn.ResourceGridCell && (node as object) instanceof kn.ResourceGridCell) ||
					(!!kn.ResourceCell && (node as object) instanceof kn.ResourceCell);
			}
			function isNativeControl(e: Event): boolean{
				const target = e.target as HTMLElement | null;
				if(!target || !target.tagName) return false;
				if(domHelpers.closest(target, ".gantt_grid_editor_placeholder")) return false;
				const tag = target.tagName.toLowerCase();
				if(tag == "input" || tag == "select" || tag == "textarea" || tag == "option") return true;
				return !!(target as HTMLElement).isContentEditable;
			}

			function handleGridViewTabJump(e: KeyboardEvent): boolean{
				if(e.key !== "Tab") return false;

				const activeNode = dispatcher.getActiveNode();
				if(!activeNode) return false;

				const kn = gantt.$keyboardNavigation;
				let bind: string | undefined;
				let isHeader = false;
				if((activeNode as object) instanceof kn.TaskCell){
					bind = "task";
				}else if((activeNode as object) instanceof kn.HeaderCell){
					bind = "task";
					isHeader = true;
				}else if((activeNode as object) instanceof kn.ResourceGridCell){
					bind = gantt.config.resource_store;
				}else{
					return false;
				}
				if(!bind) return false;

				const views = getBoundGridViews(gantt, bind);
				if(views.length < 2) return false;

				const currentGlobalIndex = isHeader ? (activeNode.index || 0) : (activeNode.columnIndex || 0);
				const viewIndex = viewIndexForGlobalColumn(views, currentGlobalIndex);
				if(viewIndex < 0) return false;

				const targetViewIndex = e.shiftKey ? viewIndex - 1 : viewIndex + 1;
				if(targetViewIndex < 0 || targetViewIndex >= views.length) return false;

				const targetView = views[targetViewIndex];
				if(!targetView.columns.length) return false;
				const targetLocalIndex = e.shiftKey ? targetView.columns.length - 1 : 0;
				const targetGlobalIndex = targetView.offset + targetLocalIndex;

				let targetNode: KeyboardNavigationNode;
				if(isHeader){
					targetNode = new kn.HeaderCell(targetGlobalIndex);
				}else if((activeNode as object) instanceof kn.ResourceGridCell){
					targetNode = new kn.ResourceGridCell(activeNode.resourceId, targetGlobalIndex);
				}else{
					targetNode = new kn.TaskCell(activeNode.taskId, targetGlobalIndex);
				}

				dispatcher.setActiveNode(targetNode);
				e.preventDefault();
				return true;
			}

			function mousedownHandler(e: Event): true | void{
				if(!gantt.config.keyboard_navigation) return true;
				// GS-734 & GS-1078: we don't need keyboard navigation inside inline editors
				if(!gantt.config.keyboard_navigation_cells && isInlineEditorCell(e)) return true;

				if (isNoKeyboardNavigationElement(e)){
					return;
				}

				let focusNode: KeyboardNavigationNode | undefined;
				let locateTask = dispatcher.fromDomElement(e);
				if(locateTask){
					//let node = getTaskNodeConstructor();
					if(e.target && dispatcher.activeNode instanceof gantt.$keyboardNavigation.TaskCell && domHelpers.isChildOf(e.target, gantt.$task)){
						locateTask = new gantt.$keyboardNavigation.TaskCell(locateTask.taskId, dispatcher.activeNode.columnIndex);
					}
					focusNode = locateTask;
					// GS-1541 and GS-1542. If you click on the task row element (possible with custom styles)
					// or the task bar element, there is no information about the target grid cell,
					// so we need to set focus on the first visible cell
					const visibleGrid = gantt.config.show_grid && gantt.$ui.getView("grid");
					if(e.target && visibleGrid && gantt.config.keyboard_navigation_cells){
						const taskRow = (e.target as HTMLElement).classList.contains("gantt_row");
						const taskBar = (e.target as HTMLElement).closest(".gantt_task_line");

						const gridLeft = gantt.utils.dom.getNodePosition(gantt.$grid).x;
						const gridRight = gridLeft + gantt.$grid.offsetWidth;
						const nodePosition = gantt.utils.dom.getNodePosition(document.activeElement).x;
						const nodeHidden = nodePosition < gridLeft || gridRight < nodePosition;

						if (taskRow || (taskBar && nodeHidden)){
							let scrollPosition = gantt.$grid.scrollLeft;
							const rightPosition = scrollPosition + gantt.$grid.offsetWidth;
							let positionX = 0;
							if (taskRow){
								scrollPosition = gantt.utils.dom.getRelativeEventPosition(e as MouseEvent, gantt.$grid).x;
							}
							for (let i = 0; i < gantt.config.columns.length; i++) {
								const column = gantt.config.columns[i];
								if (column.hide){
									continue;
								}
								positionX += column.width;
								if (scrollPosition < positionX){
									if (rightPosition < positionX){
										positionX -= column.width;
									}
									focusNode.columnIndex = i;
									break;
								}
							}
						}
					}
				}
				if (focusNode) {
					if (!dispatcher.isEnabled()) {
						dispatcher.activeNode = focusNode;
					} else {
						dispatcher.delay(function () {
							dispatcher.setActiveNode(focusNode);
						});
					}
				} else {
					// empty click should drop focus from gantt, insert of reselecting default node
					dispatcher.$preventDefault = true;
					setTimeout(function(){
						dispatcher.$preventDefault = false;
					}, 300);
				}
			}

			const onReady = gantt.attachEvent("onGanttReady", function(){
				// restore focus on repainted tasks
				gantt.detachEvent(onReady);

				gantt.$data.tasksStore.attachEvent("onStoreUpdated", function(id: Id){
					if (gantt.config.keyboard_navigation && dispatcher.isEnabled()) {
						const currentNode = dispatcher.getActiveNode();
						const grid = gantt.$ui.getView("grid") as KeyboardNavigationGridView | null | undefined;
						if (!grid || !grid.$grid_data){
							return;
						}
						const top = grid.getItemTop(id);
						const gridDataTopScroll = grid.$grid_data.scrollTop;
						const gridDataBottomScroll = gridDataTopScroll + grid.$grid_data.getBoundingClientRect().height;
						if(currentNode && currentNode.taskId == id){
							// GS-2539: Don't refocus the node if it is selected and outside the visible range in the grid
							if(gridDataTopScroll <= top && gridDataBottomScroll >= top){
								reFocusActiveNode();
							}
						}
					}
				});

				const resourceStore = gantt.getDatastore(gantt.config.resource_store);
				if(resourceStore && resourceStore.attachEvent){
					resourceStore.attachEvent("onStoreUpdated", function(): void{
						if(gantt.config.keyboard_navigation && dispatcher.isEnabled() && isResourceNode(dispatcher.getActiveNode())){
							reFocusActiveNode();
						}
					});
				}

				if(gantt._smart_render){
					const updateRender = gantt._smart_render._redrawTasks as SmartRenderRedraw;
					gantt._smart_render._redrawTasks = function(renderers: unknown, items: Task[]): unknown{
						if(gantt.config.keyboard_navigation && dispatcher.isEnabled()){
							const currentNode = dispatcher.getActiveNode();
							if(currentNode && currentNode.taskId !== undefined && currentNode.taskId !== null){
								let focusedItemVisible = false;
								for(let i = 0; i < items.length; i++){
									if(items[i].id == currentNode.taskId && items[i].start_date){
										focusedItemVisible = true;
										break;
									}
								}
								if(!focusedItemVisible){
									items.push(gantt.getTask(currentNode.taskId));
								}
							}
						}
						const res = updateRender.apply(this, [renderers, items]);

						return res;
					};
				}
			});


			let createdTaskId: Id | null = null;
			let keepFocusOnNewTask = false;
			gantt.attachEvent("onTaskCreated", function (task: Task) {
				createdTaskId = task.id;
				return true;
			});

			gantt.attachEvent("onAfterTaskAdd", function(id: Id,item: Task){
				if(!gantt.config.keyboard_navigation) return true;
				if(dispatcher.isEnabled()){

					// GS-1394. After adding a new task, the focus shouldn't change to the placeholder task
					if (id == createdTaskId) {
						keepFocusOnNewTask = true;
						setTimeout(() => {
							keepFocusOnNewTask = false;
							createdTaskId = null;
						});
					}
					if (keepFocusOnNewTask && item.type == gantt.config.types.placeholder) {
						return;
					}

					let columnIndex = 0;
					const node = dispatcher.activeNode;
					if(node instanceof gantt.$keyboardNavigation.TaskCell){
						columnIndex = node.columnIndex || 0;
					}
					const nodeConstructor = getTaskNodeConstructor();

					if (item.type == gantt.config.types.placeholder && gantt.config.placeholder_task.focusOnCreate === false) {
						// do not focus on the placeholder task
					} else {
						dispatcher.setActiveNode(new nodeConstructor(id, columnIndex));
					}


				}
			});

			gantt.attachEvent("onTaskIdChange", function(oldId: Id, newId: Id){
				if(!gantt.config.keyboard_navigation) return true;

				const node = dispatcher.activeNode;
				if(dispatcher.isTaskFocused && dispatcher.isTaskFocused(oldId) && node){
					node.taskId = newId;
				}

				return true;
			});

			const interval = setInterval(function(){
				if(!gantt.config.keyboard_navigation) return;
				if(!dispatcher.isEnabled()){
					dispatcher.enable();
				}
				return;
			}, 500);

			gantt.attachEvent("onDestroy", function(){
				clearInterval(interval);
			});

			function getScopeName(obj: KeyboardNavigationNode | null | undefined): KeyboardScope | null{
				if(obj && (obj as object) instanceof gantt.$keyboardNavigation.GanttNode){
					return "gantt";
				}else if(obj && (obj as object) instanceof gantt.$keyboardNavigation.HeaderCell){
					return "headerCell";
				}else if(obj && (obj as object) instanceof gantt.$keyboardNavigation.TaskRow){
					return "taskRow";
				}else if(obj && (obj as object) instanceof gantt.$keyboardNavigation.TaskCell){
					return "taskCell";
				}
				return null;
			}

			function getScope(mode?: KeyboardScope | string | null): TaskNodeConstructor{
				const scopes: Record<KeyboardScope, TaskNodeConstructor> = {
					"gantt":gantt.$keyboardNavigation.GanttNode,
					"headerCell": gantt.$keyboardNavigation.HeaderCell,
					"taskRow": gantt.$keyboardNavigation.TaskRow,
					"taskCell": gantt.$keyboardNavigation.TaskCell
				};

				return scopes[mode as KeyboardScope] || scopes.gantt;
			}

			function findVisibleColumnIndex(columnName?: string | number): number {
				const columns = gantt.getGridColumns();
				for (let i = 0; i < columns.length; i++){
					if(columns[i].name == columnName){
						return i;
					}
				}
				return 0;
			}

			const keyNavFacade = {} as KeyboardNavigationFacade;
			(eventable as EventableFactory)(keyNavFacade);
			gantt.mixin(keyNavFacade, {
				addShortcut: function(shortcut: string, handler: KeyboardShortcutHandler, scope?: KeyboardScope | string): void{
					const scopeObject = getScope(scope);
					if(scopeObject){
						scopeObject.prototype.bind(shortcut, handler);
					}
				},
				getShortcutHandler: function(shortcut: string, scope?: KeyboardScope | string): KeyboardShortcutHandler | undefined{
					const commands = gantt.$keyboardNavigation.shortcuts.parse(shortcut);
					if(commands.length){
						return keyNavFacade.getCommandHandler(commands[0], scope);
					}
				},
				getCommandHandler: function(command: KeyboardCommand, scope?: KeyboardScope | string): KeyboardShortcutHandler | undefined{
					const scopeObject = getScope(scope);
					if(scopeObject){
						if(command){
							return scopeObject.prototype.findHandler(command);
						}
					}
				},
				removeShortcut: function(shortcut: string, scope?: KeyboardScope | string): void{
					const scopeObject = getScope(scope);
					if(scopeObject){
						scopeObject.prototype.unbind(shortcut);
					}
				},
				focus: function(config?: KeyboardNavigationFocusConfig): void{
					const type = config ? config.type : null;
					const constructor = getScope(type);
					let node: KeyboardNavigationNode | undefined;
					switch (type){
						case "taskCell":
							node = new constructor(config?.id, findVisibleColumnIndex(config?.column));
							break;
						case "taskRow":
							node = new constructor(config?.id);
							break;
						case "headerCell":
							node = new constructor(findVisibleColumnIndex(config?.column));
							break;
						default:

							break;
					}
					dispatcher.delay(function(){
						if(node){
							dispatcher.setActiveNode(node);
						}else{
							dispatcher.enable();
							if(!dispatcher.getActiveNode()){

								dispatcher.setDefaultNode();
							}else{

								if(!dispatcher.awaitsFocus()){
									dispatcher.enable();
								}

							}
						}

					});
				},

				getActiveNode: function(): KeyboardNavigationActiveNode | null{
					if(dispatcher.isEnabled()){
						const node = dispatcher.getActiveNode();
						const scope = getScopeName(node);
						const columns = gantt.getGridColumns() as GridColumn[];
						switch (scope){
							case "taskCell":
								return {type:"taskCell", id:node!.taskId, column:columns[node!.columnIndex || 0].name};
							case "taskRow":
								return {type:"taskRow", id:node!.taskId};
							case "headerCell":
								return {type:"headerCell", column:columns[node!.index || 0].name};
						}
					}
					return null;
				}
			});

			gantt.$keyboardNavigation.facade = keyNavFacade;

			gantt.ext.keyboardNavigation = keyNavFacade;
			gantt.focus = function(): void{
				keyNavFacade.focus();
			};
			gantt.addShortcut = keyNavFacade.addShortcut as unknown as typeof gantt.addShortcut;
			gantt.getShortcutHandler = keyNavFacade.getShortcutHandler as unknown as typeof gantt.getShortcutHandler;
			gantt.removeShortcut = keyNavFacade.removeShortcut as unknown as typeof gantt.removeShortcut;
		})();


	}

	setupKeyNav(gantt);
};
