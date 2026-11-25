import type { KeyboardCommand, GanttWithKeyboardNavigation, KeyboardNavigationNode } from "./types";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.dispatcher = {
		isActive: false,
		activeNode: null,
		globalNode: new gantt.$keyboardNavigation.GanttNode(),

		enable: function (): void {
			this.isActive = true;
			this.setActiveNode(this.getActiveNode());
		},

		disable: function (): void {
			this.isActive = false;
		},

		isEnabled: function (): boolean {
			return !!this.isActive;
		},

		getDefaultNode: function (): KeyboardNavigationNode | null | undefined {
			let node: KeyboardNavigationNode;
			if (gantt.config.keyboard_navigation_cells) {
				node = new gantt.$keyboardNavigation.TaskCell();
			} else {
				node = new gantt.$keyboardNavigation.TaskRow();
			}

			if (!node.isValid()) {
				node = node.fallback()!;
			}
			return node;
		},

		setDefaultNode: function (): void {
			this.setActiveNode(this.getDefaultNode());
		},

		getActiveNode: function (): KeyboardNavigationNode | null | undefined {
			let node = this.activeNode;
			if (node && !node.isValid()) {
				node = node.fallback() || null;
			}
			return node;
		},

		fromDomElement: function(e: Event): KeyboardNavigationNode | null{
			const inputs = [
				gantt.$keyboardNavigation.TaskRow,
				gantt.$keyboardNavigation.TaskCell,
				gantt.$keyboardNavigation.HeaderCell,
				gantt.$keyboardNavigation.ResourceGridCell,
				gantt.$keyboardNavigation.ResourceGridRow,
				gantt.$keyboardNavigation.ResourceCell
			];
			for(let i = 0; i < inputs.length; i++){
				if(inputs[i].prototype.fromDomElement){
					const node = inputs[i].prototype.fromDomElement(e);
					if(node) return node;
				}
			}
			return null;
		},

		focusGlobalNode: function (): void {
			this.blurNode(this.globalNode);
			this.focusNode(this.globalNode);
		},

		setActiveNode: function (el: KeyboardNavigationNode | null | undefined): void {
			//console.trace()
			let focusChanged = true;
			if (this.activeNode) {
				if (this.activeNode.compareTo(el)) {
					focusChanged = false;
				}
			}
			if (this.isEnabled()) {
				if(focusChanged)
					this.blurNode(this.activeNode);

				this.activeNode = el || null;
				this.focusNode(this.activeNode, !focusChanged);
			}
		},

		focusNode: function (el: KeyboardNavigationNode | null | undefined, keptFocus?: boolean): void {
			if (el && el.focus) {
				el.focus(keptFocus);
			}
		},
		blurNode: function (el: KeyboardNavigationNode | null | undefined): void {
			if (el && el.blur) {
				el.blur();
			}
		},

		keyDownHandler: function (e: KeyboardEvent): void {

			if (gantt.$keyboardNavigation.isModal())
				return;

			if (!this.isEnabled())
				return;

			if(e.defaultPrevented){
				return;
			}

			const ganttNode = this.globalNode;

			const command: KeyboardCommand = gantt.$keyboardNavigation.shortcuts.getCommandFromEvent(e);

			const activeElement = this.getActiveNode();
			const eventFacade = gantt.$keyboardNavigation.facade;
			if(eventFacade.callEvent("onKeyDown", [command, e]) === false){
				return;
			}

			if (!activeElement) {
				this.setDefaultNode();
			} else if (activeElement.findHandler(command)) {
				activeElement.doAction(command, e);
			} else if (ganttNode.findHandler(command)) {
				ganttNode.doAction(command, e);
			}

		},
		_timeout: null,
		awaitsFocus: function(): boolean{
			return this._timeout !== null;
		},
		delay: function(callback: () => void, delay?: number): void{

			clearTimeout(this._timeout || undefined);
			this._timeout = setTimeout(gantt.bind(function(){
				this._timeout = null;
				callback();
			}, this)  , delay || 1);

		},
		clearDelay: function(): void{
			clearTimeout(this._timeout || undefined);
		}
	};

};
