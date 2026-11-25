import type { GanttStatic, GridColumn, Id, Task } from "../../types/gantt_types";
import type { GanttInternal } from "../../types/gantt_internal_types";

type NodeConstructor<T extends KeyboardNavigationNode = KeyboardNavigationNode> = Function & {
	new(taskId?: Id | null, index?: number): T;
	prototype: T;
};

type DomListener = (event: Event) => void | boolean;

export type KeyboardScope = "gantt" | "headerCell" | "taskRow" | "taskCell";

export type KeyboardModifier = "shift" | "alt" | "ctrl" | "meta";

export interface KeyboardCommand {
	modifiers: Record<KeyboardModifier, boolean>;
	keyCode: number | null;
}

export type KeyboardShortcutHandler = (this: KeyboardNavigationNode, event: KeyboardEvent) => void;
export type KeyboardShortcutMap = Record<string, KeyboardShortcutHandler>;

export interface KeyboardShortcuts {
	createCommand(): KeyboardCommand;
	parse(shortcut: string): KeyboardCommand[];
	getCommandFromEvent(domEvent: KeyboardEvent): KeyboardCommand;
	getHashFromEvent(domEvent: KeyboardEvent): string;
	getHash(command: KeyboardCommand): string;
	getExpressions(shortcut: string): string[];
	getWords(term: string): string[];
	trim(shortcut: string): string;
	junctionChar: string;
	combinationChar: string;
	commandKeys: Record<KeyboardModifier, number | boolean>;
	specialKeys: Record<string, number>;
}

export interface EventHandlerNode {
	_handlers: Record<string, KeyboardShortcutHandler> | null;
	keys?: KeyboardShortcutMap;
	findHandler(command: KeyboardCommand): KeyboardShortcutHandler | undefined;
	doAction(command: KeyboardCommand, event: KeyboardEvent): void;
	bind(shortcut: string, handler: KeyboardShortcutHandler): void;
	unbind(shortcut: string): void;
	bindAll(map: KeyboardShortcutMap): void;
	initKeys(): void;
}

export interface KeyboardNavigationNode extends EventHandlerNode {
	taskId?: Id | null;
	resourceId?: Id | null;
	index?: number;
	globalIndex?: number;
	columnIndex?: number;
	splitItem?: boolean;
	parentId?: Id;
	isValid(): boolean;
	fallback(): KeyboardNavigationNode | null | undefined;
	moveTo(element: KeyboardNavigationNode | null | undefined): void;
	compareTo(element: KeyboardNavigationNode | null | undefined): boolean;
	fromDomElement?(event: Event): KeyboardNavigationNode | null;
	getNode(): HTMLElement | null | undefined;
	focus(keptFocus?: boolean): void;
	blur(): void;
	scrollHorizontal?(dir: number): void;
	scrollVertical?(dir: number): void;
}

export interface KeyboardNavigationDispatcher {
	isActive: boolean;
	activeNode: KeyboardNavigationNode | null;
	globalNode: KeyboardNavigationNode;
	$preventDefault?: boolean;
	enable(): void;
	disable(): void;
	isEnabled(): boolean;
	getDefaultNode(): KeyboardNavigationNode | null | undefined;
	setDefaultNode(): void;
	getActiveNode(): KeyboardNavigationNode | null | undefined;
	fromDomElement(event: Event): KeyboardNavigationNode | null;
	focusGlobalNode(): void;
	setActiveNode(element: KeyboardNavigationNode | null | undefined): void;
	focusNode(element: KeyboardNavigationNode | null | undefined, keptFocus?: boolean): void;
	blurNode(element: KeyboardNavigationNode | null | undefined): void;
	keyDownHandler(event: KeyboardEvent): void;
	_timeout: ReturnType<typeof setTimeout> | null;
	awaitsFocus(): boolean;
	delay(callback: () => void, delay?: number): void;
	clearDelay(): void;
	isTaskFocused?(id: Id): boolean;
}

export interface KeyboardNavigationFacade {
	addShortcut(shortcut: string, handler: KeyboardShortcutHandler, scope?: KeyboardScope | string): void;
	getShortcutHandler(shortcut: string, scope?: KeyboardScope | string): KeyboardShortcutHandler | undefined;
	getCommandHandler(command: KeyboardCommand, scope?: KeyboardScope | string): KeyboardShortcutHandler | undefined;
	removeShortcut(shortcut: string, scope?: KeyboardScope | string): void;
	focus(config?: KeyboardNavigationFocusConfig): void;
	getActiveNode(): KeyboardNavigationActiveNode | null;
	attachEvent?: GanttStatic["attachEvent"];
	callEvent(eventName: string, args: unknown[]): boolean | void;
	[customMethod: string]: unknown;
}

export interface KeyboardNavigationApi {
	shortcuts: KeyboardShortcuts;
	EventHandler: EventHandlerNode;
	GanttNode: NodeConstructor;
	KeyNavNode: NodeConstructor;
	TaskRow: NodeConstructor;
	TaskCell: NodeConstructor;
	HeaderCell: NodeConstructor;
	ResourceGridRow: NodeConstructor;
	ResourceGridCell: NodeConstructor;
	ResourceCell: NodeConstructor;
	dispatcher: KeyboardNavigationDispatcher;
	facade: KeyboardNavigationFacade;
	getFocusableNodes(root: HTMLElement): HTMLElement[];
	// trapFocus was removed with the kb-nav modal glue (ui-core Step 5):
	// every modal carries the popup primitive's intrinsic focus trap
	isModal(): boolean;
}

export interface KeyboardNavigationFocusConfig {
	type?: KeyboardScope | string | null;
	id?: Id;
	column?: string | number;
}

export type KeyboardNavigationActiveNode =
	| { type: "taskCell"; id: Id | null | undefined; column: string | number | undefined }
	| { type: "taskRow"; id: Id | null | undefined }
	| { type: "headerCell"; column: string | number | undefined };

export interface KeyboardNavigationGridView {
	$grid: HTMLElement;
	$grid_data?: HTMLElement;
	$config: {
		scrollX?: string;
		scrollY?: string;
		scrollable?: boolean;
	};
	getItemTop(id: Id): number;
	scrollTo(x?: number | null, y?: number | null): void;
}

export interface GanttWithKeyboardNavigation extends Omit<GanttInternal, "ext" | "locate"> {
	$keyboardNavigation: KeyboardNavigationApi;
	_compose(...parts: unknown[]): any;
	$ui: {
		getView(name: string): KeyboardNavigationGridView | HTMLElement | null | undefined;
	};
	_smart_render?: {
		_redrawTasks(renderers: unknown, items: Task[]): unknown;
	};
	config: GanttInternal["config"] & {
		columns: Array<GridColumn & { width: number; }>;
		placeholder_task: { focusOnCreate?: boolean };
	};
	ext: Omit<GanttStatic["ext"], "keyboardNavigation"> & {
		keyboardNavigation?: KeyboardNavigationFacade;
	};
	locate(e: Event | Element): Id;
	isReadonly(item?: Id | Task | KeyboardNavigationNode): boolean;
	bind<T extends object, A extends unknown[], R>(handler: (this: T, ...args: A) => R, context: T): (...args: A) => R;
	event(node: HTMLElement | Document | Window, eventName: string, handler: DomListener, options?: boolean | AddEventListenerOptions): void;
	eventRemove(node: HTMLElement | Document | Window, eventName: string, handler: DomListener): void;
	getScale(): { step: number; unit: string };
	getTaskPosition(task: Task, from?: Date, to?: Date): { left: number; top: number; width: number; height?: number };
	$click: {
		buttons: Record<string, (id: Id) => void>;
	};
}
