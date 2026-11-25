import type { GanttWithKeyboardNavigation, KeyboardNavigationNode } from "../types";

type FocusableNode = HTMLElement & { $eventAttached?: boolean };

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.KeyNavNode = function () {
	} as unknown as typeof gantt.$keyboardNavigation.KeyNavNode;

	gantt.$keyboardNavigation.KeyNavNode.prototype = gantt._compose(
		gantt.$keyboardNavigation.EventHandler,
		{
			isValid: function (): boolean {
				return true;
			},
			fallback: function (): null {
				return null;
			},

			moveTo: function (element: KeyboardNavigationNode | null | undefined): void {
				gantt.$keyboardNavigation.dispatcher.setActiveNode(element);
			},

			compareTo: function (this: KeyboardNavigationNode, b: KeyboardNavigationNode | null | undefined): boolean {
				// good enough comparison of two random objects
				if (!b) return false;
				for (const i in this) {
					const key = i as keyof KeyboardNavigationNode;
					if (!!this[key] != !!b[key]) return false;

					const thisValue = this[key] as unknown;
					const thatValue = b[key] as unknown;
					const canStringifyThis = !!(thisValue && (thisValue as { toString?: unknown }).toString);
					const canStringifyThat = !!(thatValue && (thatValue as { toString?: unknown }).toString);
					if (canStringifyThat != canStringifyThis) return false;
					if (!(canStringifyThat && canStringifyThis)) {
						if (thatValue != thisValue) return false;
					} else {
						if (String(thatValue) != String(thisValue))
							return false;
					}
				}
				return true;
			},

			getNode: function (): undefined {
			},
			focus: function (this: KeyboardNavigationNode): void {
				let node = this.getNode() as FocusableNode | null | undefined;
				if(!node)
					return;

				const eventFacade = gantt.$keyboardNavigation.facade;

				if(eventFacade.callEvent("onBeforeFocus", [node]) === false){
					return;
				}

				if (node) {
					node.setAttribute("tabindex", "-1");
					if(!node.$eventAttached){
						node.$eventAttached = true;
						gantt.event(node, "focus",function(e){
							e.preventDefault();
							return false;
						}, false);
					}
					//node.className += " gantt_focused";
					if (gantt.utils.dom.isChildOf(document.activeElement, node)){
						node = document.activeElement as FocusableNode;
					}
					if (node.focus) node.focus();

					eventFacade.callEvent("onFocus", [this.getNode()]);
				}

			},
			blur: function (this: KeyboardNavigationNode): void {
				const node = this.getNode();
				if (node) {
					const eventFacade = gantt.$keyboardNavigation.facade;
					eventFacade.callEvent("onBlur", [node]);
					node.setAttribute("tabindex", "-1");
					//node.className = (node.className || "").replace(/ ?gantt_focused/g, "");
				}
			}
		}
	);

};
