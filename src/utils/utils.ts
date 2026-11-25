import * as helpers from "./helpers";

export interface EventElement {
		addEventListener?: (event: string, handler: EventListenerOrEventListenerObject, options?: boolean) => void;
		attachEvent?: (event: string, handler: EventListenerOrEventListenerObject) => void;
		removeEventListener?: (event: string, handler: EventListenerOrEventListenerObject, options?: boolean) => void;
		detachEvent?: (event: string, handler: EventListenerOrEventListenerObject) => void;
	}

const plainObjectConstructor = ({}).constructor.toString();
function isCustomType(object: { constructor: { toString(): string } }): boolean {
	const constructorString = object.constructor.toString();

	return constructorString !== plainObjectConstructor;
}

function isExternalType(object: { $$typeof?: { toString(): string } }): boolean {
	// react elements are not plain objects, but they are not custom types either
	// can't deep copy them
	return !!(object.$$typeof && object.$$typeof.toString().includes("react."));
}

function copy<T>(object: T): T {
	let i: string | number;
	let result: any;

	if (object && typeof object === "object") {
		switch (true) {
			case helpers.isDate(object):
				result = new Date(object);
				break;
			case helpers.isArray(object):
				result = new Array(object.length);
				for (i = 0; i < object.length; i++) {
					result[i] = copy(object[i]);
				}
				break;
			default:
				if (isCustomType(object as { constructor: { toString(): string } })) {
					result = Object.create(object);
				} else if (isExternalType(object as { $$typeof?: { toString(): string } })) {
					result = object;
					return result;
				} else {
					result = {};
				}

				for (i in object) {
					if (Object.prototype.hasOwnProperty.apply(object, [i])) {
						result[i] = copy((object as Record<string, any>)[i]);
					}
				}
				break;
		}
	}
	return (result || object) as T;
}

function mixin<T extends Record<string, any>, U extends Record<string, any>>(target: T, source: U, force?: boolean): T & U {
	for (const f in source) {
		if (target[f] === undefined || force) {
			(target as Record<string, any>)[f] = source[f];
		}
	}
	return target as T & U;
}

function defined<T>(obj: T | undefined): obj is T {
	return typeof obj !== "undefined";
}

let seed: number | undefined;
function uid(): number {
	if (!seed) {
		seed = new Date().valueOf();
	}

	seed++;
	return seed;
}

//creates function with specified "this" pointer
function bind<T extends (...args: any[]) => any, TObject>(functor: T, object: TObject): (...args: Parameters<T>) => ReturnType<T> {
	if (functor.bind) {
		return functor.bind(object);
	} else {
		return function(...args: Parameters<T>): ReturnType<T> {
			return functor.apply(object, args);
		};
	}
}

function event(
	el: EventElement,
	event: string,
	handler: EventListenerOrEventListenerObject,
	capture?: boolean
): void {
	if (el.addEventListener) {
		el.addEventListener(event, handler, capture === undefined ? false : capture);
	} else if (el.attachEvent) {
		el.attachEvent("on" + event, handler);
	}
}

function eventRemove(
	el: EventElement,
	event: string,
	handler: EventListenerOrEventListenerObject,
	capture?: boolean
): void {
	if (el.removeEventListener) {
		el.removeEventListener(event, handler, capture === undefined ? false : capture);
	} else if (el.detachEvent) {
		el.detachEvent("on" + event, handler);
	}
}

export {
	copy,
	defined,
	mixin,
	uid,
	bind,
	event,
	eventRemove
};
