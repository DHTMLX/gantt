import * as utils from "../../../utils/utils";
import { EventElement } from "../../../utils/utils";

type EventBinder = (
	el: EventElement,
	event: string,
	handler: EventListenerOrEventListenerObject,
	capture?: boolean
) => void;

interface ScopeHandler {
	element: EventElement;
	event: string;
	callback: EventListenerOrEventListenerObject;
	capture?: boolean;
}

interface EventScope {
	attach(el: EventElement, event: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
	detach(el: EventElement, event: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
	detachAll(): void;
	extend(): EventScope;
}

function createScope(addEvent?: EventBinder, removeEvent?: EventBinder): EventScope {
	const addEventFn = addEvent || utils.event;
	const removeEventFn = removeEvent || utils.eventRemove;

	const handlers: ScopeHandler[] = [];

	const eventScope: EventScope = {
		attach: function(el, event, callback, capture){
			handlers.push({element: el, event: event, callback: callback, capture: capture});
			addEventFn(el, event, callback, capture);
		},
		detach: function(el, event, callback, capture){
			removeEventFn(el, event, callback, capture);
			for(let i = 0; i < handlers.length; i++){
				const handler = handlers[i];
				if (handler.element === el && handler.event === event && handler.callback === callback && handler.capture === capture) {
					handlers.splice(i, 1);
					i--;
				}
			}
		},
		detachAll: function () {
			const staticArray = handlers.slice();
			// original handlers array can be spliced on every iteration
			for (let i = 0; i < staticArray.length; i++){
				const handler = staticArray[i];
				eventScope.detach(handler.element, handler.event, handler.callback, handler.capture);
				eventScope.detach(handler.element, handler.event, handler.callback, undefined);
				eventScope.detach(handler.element, handler.event, handler.callback, false);
				eventScope.detach(handler.element, handler.event, handler.callback, true);
			}
			handlers.splice(0, handlers.length);
		},
		extend: function(this: { event?: EventBinder; eventRemove?: EventBinder }){
			// NOT a bug: extend() is exposed as `gantt._createDomEventScope`, so `this` is gantt
			// and `this.event`/`this.eventRemove` resolve to the root scope's binders. That routes
			// child handlers through the root, so `_eventRemoveAll()` removes them on destroy.
			// Switching to the closure binders leaks handlers past destroy.
			return createScope(this.event, this.eventRemove);
		}
	};

	return eventScope;
}

export default createScope;
