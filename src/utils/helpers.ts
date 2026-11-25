const units = {
	second: 1,
	minute: 60,
	hour: 60 * 60,
	day: 60 * 60 * 24,
	week: 60 * 60 * 24 * 7,
	month: 60 * 60 * 24 * 30,
	quarter: 60 * 60 * 24 * 30 * 3,
	year: 60 * 60 * 24 * 365
} as const;

function getSecondsInUnit(unit: keyof typeof units | string): number {
	return units[unit as keyof typeof units] || units.hour;
}

function forEach<T>(arr: T[], callback: (item: T, index: number) => void): void {
	if (arr.forEach) {
		arr.forEach(callback);
	} else {
		const workArray = arr.slice();
		for (let i = 0; i < workArray.length; i++) {
			callback(workArray[i], i);
		}
	}
}

function arrayMap<T, R>(arr: T[], callback: (item: T, index: number) => R): R[] {
	if (arr.map) {
		return arr.map(callback);
	} else {
		const workArray = arr.slice();
		const resArray: R[] = [];

		for (let i = 0; i < workArray.length; i++) {
			resArray.push(callback(workArray[i], i));
		}
		return resArray;
	}
}

function arrayFind<T>(arr: T[], callback: (item: T, index: number) => boolean): T | undefined {
	if (arr.find) {
		return arr.find(callback);
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				return arr[i];
			}
		}
	}
	return undefined;
}

function arrayIncludes<T>(arr: T[], item: T): boolean {
	if (arr.includes) {
		return arr.includes(item);
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] === item) {
				return true;
			}
		}
		return false;
	}
}

// iframe-safe array type check instead of using instanceof
function isArray<T = unknown>(obj: unknown): obj is T[] {
	if (Array.isArray) {
		return Array.isArray(obj);
	} else {
		return !!(obj && (obj as T[] & { pop?: unknown; push?: unknown; length?: unknown }).length !== undefined && (obj as T[] & { pop?: unknown }).pop && (obj as T[] & { push?: unknown }).push);
	}
}

// non-primitive string object, e.g. new String("abc")
function isStringObject(obj: unknown): obj is String {
	return !!(obj && typeof obj === "object"
		&& Function.prototype.toString.call((obj as { constructor: Function }).constructor) === "function String() { [native code] }");
}

// non-primitive number object, e.g. new Number(5)
function isNumberObject(obj: unknown): obj is Number {
	return !!(obj && typeof obj === "object"
		&& Function.prototype.toString.call((obj as { constructor: Function }).constructor) === "function Number() { [native code] }");
}

// non-primitive number object, e.g. new Boolean(true)
function isBooleanObject(obj: unknown): obj is Boolean {
	return !!(obj && typeof obj === "object"
		&& Function.prototype.toString.call((obj as { constructor: Function }).constructor) === "function Boolean() { [native code] }");
}

function isDate(obj: unknown): obj is Date {
	if (obj && typeof obj === "object") {
		const dateLike = obj as Date;
		return !!(typeof dateLike.getFullYear == "function" && typeof dateLike.getMonth == "function" && typeof dateLike.getDate == "function");
	} else {
		return false;
	}
}

function isValidDate(obj: unknown): obj is Date {
	return isDate(obj) && !isNaN(obj.getTime());
}

function arrayFilter<T>(arr: T[], callback: (item: T, index: number) => boolean): T[] {
	const result: T[] = [];

	if (arr.filter) {
		return arr.filter(callback);
	} else {
		for (let i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				result[result.length] = arr[i];
			}
		}
		return result;
	}
}

function hashToArray<T>(hash: Record<string, T>): T[] {
	const result: T[] = [];

	for (const key in hash) {
		if (Object.prototype.hasOwnProperty.call(hash, key)) {
			result.push(hash[key]);
		}
	}

	return result;
}

function arraySome<T>(arr: T[], callback: (item: T, index: number, arr: T[]) => boolean): boolean {
	if (arr.length === 0) return false;

	for (let i = 0; i < arr.length; i++) {
		if (callback(arr[i], i, arr)) {
			return true;
		}
	}
	return false;
}

function arrayDifference<T>(arr: T[], callback: (item: T, index: number) => boolean): T[] {
	return arrayFilter(arr, function(item, i) {
		return !callback(item, i);
	});
}

function throttle<T extends (...args: any[]) => unknown>(callback: T, timeout: number): (...args: Parameters<T>) => void {
	let wait = false;

	return function(...args: Parameters<T>): void {
		if (!wait) {
			callback.apply(null, args);
			wait = true;
			setTimeout(function() {
				wait = false;
			}, timeout);
		}
	};
}

interface DelayedFunction<T extends (...args: any[]) => unknown> {
	(...args: Parameters<T>): void;
	$pending: boolean;
	$cancelTimeout: () => void;
	$execute: (...args: Parameters<T>) => void;
}

function delay<T extends (...args: any[]) => unknown>(callback: T, timeout: number): DelayedFunction<T> {
	let timer: ReturnType<typeof setTimeout> | undefined;

	const result = function(...args: Parameters<T>): void {
		result.$cancelTimeout();
		result.$pending = true;
		timer = setTimeout(function() {
			callback.apply(this, args);
			result.$pending = false;
		}, timeout);
	} as DelayedFunction<T>;

	result.$pending = false;
	result.$cancelTimeout = function(): void {
		if (timer !== undefined) {
			clearTimeout(timer);
		}
		result.$pending = false;
	};
	result.$execute = function(...args: Parameters<T>): void {
		callback.apply(this, args);
		result.$cancelTimeout();
	};

	return result;
}

function sortArrayOfHash<T extends Record<string, any>>(arr: T[], field: keyof T, desc: boolean): void {
	const compare = function(a: T[keyof T], b: T[keyof T]): number {
		if (a === b) return 0;
		return a < b ? -1 : 1;
	};

	arr.sort(function(a, b) {
		if (a[field] === b[field]) return 0;

		return desc ? compare(a[field], b[field]) : compare(b[field], a[field]);
	});
}

function objectKeys<T extends object>(obj: T): string[] {
	if (Object.keys) {
		return Object.keys(obj);
	}
	const result: string[] = [];
	let key: keyof T;
	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result.push(String(key));
		}
	}
	return result;
}

function isEventable(obj: unknown): boolean {
	return !!(obj && (obj as { attachEvent?: unknown }).attachEvent && (obj as { detachEvent?: unknown }).detachEvent);
}

//GS-1090: A task should be able to have the id = 0
function replaceValidZeroId(id: string | number, rootId: string | number): string | number {
	if (checkZeroId(id) && !checkZeroId(rootId)) {
		id = "0";
	}
	return id;
}

function checkZeroId(id: unknown): boolean {
	if (id === 0) {
		return true;
	}
	return false;
}

function findBinary(array: Array<number | string>, target: number): number {
	// modified binary search, target value not exactly match array elements, looking for closest one

	let low = 0;
	let high = array.length - 1;
	let i: number;
	let item: number;
	let prev: number;
	while (low <= high) {

		i = Math.floor((low + high) / 2);
		item = +array[i];
		prev = +array[i - 1];
		if (item < target) {
			low = i + 1;
			continue;
		}
		if (item > target) {
			if (!(!isNaN(prev) && prev < target)) {
				high = i - 1;
				continue;
			} else {
				// if target is between 'i' and 'i-1' return 'i - 1'
				return i - 1;
			}

		}
		while (+array[i] === +array[i + 1]) i++;

		return i;
	}
	return array.length - 1;
}

export {
	getSecondsInUnit,
	forEach,
	arrayMap,
	arrayIncludes,
	arrayFind,
	arrayFilter,
	arrayDifference,
	arraySome,
	hashToArray,
	sortArrayOfHash,
	throttle,
	isArray,
	isDate,
	isValidDate,
	isStringObject,
	isNumberObject,
	isBooleanObject,
	delay,
	objectKeys,
	isEventable,
	replaceValidZeroId,
	checkZeroId,
	findBinary
};
