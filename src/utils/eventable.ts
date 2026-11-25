import { GanttCallback, HandlerSettings } from "../types/gantt_types";

type EventId = string | number;

interface EventStorage {
	(eventArguments?: any[]): boolean;
	addEvent(handler: GanttCallback, settings?: HandlerSettings | string): EventId | false;
	removeEvent(id: EventId): void;
	clear(): void;
}

interface EventHostType {
	_silent_mode: boolean;
	listeners: Record<string, EventStorage>;
}

export interface EventableObject {
	attachEvent(eventName: string, handler: GanttCallback, settings?: HandlerSettings | string): EventId;
	attachAll(callback: GanttCallback): void;
	callEvent(name: string, eventArguments: any[]): boolean | undefined;
	checkEvent(name: string): boolean;
	detachEvent(id?: EventId): void;
	detachAllEvents(): void;
	[key: string]: any;
}

const EventHost = function(this: EventHostType): void {
	this._silent_mode = false;
	this.listeners = {};
};

// Probably, it is obsolete code as it is not used anywhere
EventHost.prototype = {
	_silentStart: function(this: EventHostType): void {
		this._silent_mode = true;
	},
	_silentEnd: function(this: EventHostType): void {
		this._silent_mode = false;
	}
};


// The listener key for an event name, memoized process-wide: `callEvent` runs once per item on a
// filter pass, and the concatenation allocated a string every time.
//
// Only `attachEvent` fills the cache - `callEvent`/`checkEvent` names come from calling code, and
// generated ones would evict the vocabulary the hot path needs. The limit bounds generated
// *attached* names; the library uses ~200, past it the key is derived as before.
const LISTENER_KEY_CACHE_LIMIT = 1000;
const listenerKeys = new Map<string, string>();
const listenerKey = function(eventName: string, memoize?: boolean): string {
	const cached = listenerKeys.get(eventName);
	if (cached !== undefined) {
		return cached;
	}
	const key = "ev_" + eventName.toLowerCase();
	if (memoize && listenerKeys.size < LISTENER_KEY_CACHE_LIMIT) {
		listenerKeys.set(eventName, key);
	}
	return key;
};

const createEventStorage = function(obj: unknown): EventStorage {
	let handlers: Record<string, GanttCallback> = {};
	// Cached handler ids, in `Object.keys` order (same as `for...in` for own keys); `null` when
	// stale.
	let handlerIds: string[] | null = null;
	let index = 0;
	// Takes the argument array directly: a rest parameter allocated a second array per dispatch.
	const eventStorage = function(eventArguments?: any[]): boolean | undefined {
		const ids = handlerIds || (handlerIds = Object.keys(handlers));
		let combinedResult = true;
		for (let i = 0; i < ids.length; i++) {
			// A handler can go away mid-dispatch - detached by an earlier handler, a `once`
			// wrapper, or `clear()`. `for...in` skipped those too (and threw on `clear()`).
			const handler = handlers[ids[i]];
			if (handler === undefined) {
				continue;
			}
			const handlerResult = handler.apply(obj, eventArguments);
			combinedResult = combinedResult && handlerResult;
		}
		return combinedResult;
	} as EventStorage;

	eventStorage.addEvent = function(handler: GanttCallback, settings?: HandlerSettings): EventId | false {
		if (typeof handler === "function") {
			let handlerId: EventId;
			if (settings && settings.id !== undefined) {
				handlerId = settings.id;
			} else {
				handlerId = index;
				index++;
			}

			if (settings && settings.once) {
				const originalHandler = handler;
				handler = function(this: unknown, ...args: any[]): any {
					eventStorage.removeEvent(handlerId);
					return originalHandler.apply(this, args);
				};
			}

			handlers[String(handlerId)] = handler;
			handlerIds = null;
			return handlerId;
		}
		return false;
	};

	eventStorage.removeEvent = function(id: EventId): void {
		// `detachEvent` calls this on every storage the host has, so only invalidate when this
		// storage actually held the id - otherwise each detach rebuilds every event's id list.
		const key = String(id);
		if (handlers[key] !== undefined) {
			delete handlers[key];
			handlerIds = null;
		}
	};

	eventStorage.clear = function(): void {
		handlers = {};
		handlerIds = null;
	};

	return eventStorage;
};

function makeEventable<T extends Record<string, any>>(obj: T): asserts obj is T & EventableObject {
	const eventHost = new (EventHost as unknown as { new(): EventHostType })();
	const target = obj as T & Partial<EventableObject>;
	target.attachEvent = function(eventName: string, handler: GanttCallback, settings?: HandlerSettings | string): EventId {
		eventName = listenerKey(eventName, true);
		if (!eventHost.listeners[eventName]) {
			eventHost.listeners[eventName] = createEventStorage(this);
		}

		if (settings && typeof settings !== "string" && settings.thisObject) {
			handler = handler.bind(settings.thisObject);
		}

		const innerId = eventHost.listeners[eventName].addEvent(handler, settings);
		let handlerId: EventId = eventName + ":" + innerId;
		if (settings && typeof settings !== "string" && settings.id !== undefined) {
			handlerId = settings.id;
		}
		return handlerId;
	};

	target.attachAll = function(callback: GanttCallback): void {
		if (this.attachEvent){
			this.attachEvent("listen_all", callback);
		}
	};

	target.callEvent = function(name: string, eventArguments: any[]): boolean | undefined {
		if (eventHost._silent_mode) return true;

		const handlerName = listenerKey(name);
		const listeners = eventHost.listeners;
		if (listeners["ev_listen_all"]) {
			listeners["ev_listen_all"]([name].concat(eventArguments));
		}

		if (listeners[handlerName]) {
			return listeners[handlerName](eventArguments);
		}
		return true;
	};

	target.checkEvent = function(name: string): boolean {
		const listeners = eventHost.listeners;
		return !!listeners[listenerKey(name)];
	};

	target.detachEvent = function(id?: EventId): void {
		if (id !== undefined && id !== null) {
			const listeners = eventHost.listeners;
			for (const i in listeners) {
				listeners[i].removeEvent(id);
			}

			const list = String(id).split(":");
			if (list.length === 2) {
				const eventName = list[0];
				const eventId = list[1];
				if (listeners[eventName]) {
					listeners[eventName].removeEvent(eventId);
				}
			}
		}
	};

	target.detachAllEvents = function(): void {
		for (const name in eventHost.listeners) {
			eventHost.listeners[name].clear();
		}
	};
}

export default makeEventable;
