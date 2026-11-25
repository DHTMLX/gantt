/**
 * The default lightbox section settings of one gantt instance (GS-3543).
 *
 * The advanced task form uses its built-in layout only for a setting that the app has not
 * configured. The record is taken when the instance creates its config, before any app code
 * runs, so the test does not depend on when the task_form plugin is turned on.
 */
const STOCK_KEYS = ["sections", "project_sections", "milestone_sections"];

/** the property of the typeselect onchange wrapper that holds the handler it wraps */
export const TYPESELECT_WRAPPED_HANDLER = "$typeselectHandler";

export interface IStockSections {
	/**
	 * true when `value` is still the default object that the instance created for `key`,
	 * with its content unchanged
	 */
	isStock(key: string, value: unknown): boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * What rendering writes onto a section: the core stamps `id`, `inputId` and `index`, the
 * typeselect block stores its `options`, the task form adds `tab` and `$`-prefixed state.
 */
function isWrittenByRendering(key: string, holder: Record<string, unknown>): boolean {
	return key === "id" || key === "inputId" || key === "index" || key === "tab" || key.charAt(0) === "$"
		|| (key === "options" && holder.type === "typeselect");
}

/** the typeselect block wraps `onchange` on each render; compare the handler of the app */
function ownValue(key: string, holder: Record<string, unknown>): unknown {
	let value: any = holder[key];
	if (key === "onchange" && holder.type === "typeselect") {
		while (typeof value === "function" && Object.prototype.hasOwnProperty.call(value, TYPESELECT_WRAPPED_HANDLER)) {
			value = value[TYPESELECT_WRAPPED_HANDLER];
		}
	}
	return value;
}

/** a copy of arrays and plain objects; functions and other values are kept by reference */
function snapshot(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(snapshot);
	}
	if (isPlainObject(value)) {
		const copy: Record<string, unknown> = {};
		Object.keys(value).forEach(key => {
			copy[key] = snapshot(value[key]);
		});
		return copy;
	}
	return value;
}

function sameContent(recorded: unknown, current: unknown): boolean {
	if (recorded === current) {
		return true;
	}
	if (Array.isArray(recorded) && Array.isArray(current)) {
		return recorded.length === current.length && recorded.every((item, index) => sameContent(item, current[index]));
	}
	if (isPlainObject(recorded) && isPlainObject(current)) {
		const keys = Object.keys(recorded).concat(Object.keys(current)
			.filter(key => !Object.prototype.hasOwnProperty.call(recorded, key)));
		return keys.every(key => isWrittenByRendering(key, current) || isWrittenByRendering(key, recorded)
			|| sameContent(ownValue(key, recorded), ownValue(key, current)));
	}
	return false;
}

export function recordStockSections(lightboxConfig: Record<string, unknown>): IStockSections {
	const objects: Record<string, unknown> = {};
	const contents: Record<string, unknown> = {};
	STOCK_KEYS.forEach(key => {
		objects[key] = lightboxConfig[key];
		contents[key] = snapshot(lightboxConfig[key]);
	});

	return {
		isStock(key: string, value: unknown): boolean {
			return value !== undefined && value !== null
				&& STOCK_KEYS.indexOf(key) !== -1
				&& objects[key] === value && sameContent(contents[key], value);
		}
	};
}
