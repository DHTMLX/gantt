import { IToolbarConfig } from "./types";

/**
 * Top-level `Toolbar` export (design T2): a thin, gantt-required alias over
 * `gantt.ext.ui.createToolbar()` so consumers can
 *
 *   import { gantt, Toolbar } from "dhtmlx-gantt";
 *   new Toolbar({ gantt, items: ["undo", "redo", "spacer", "theme"] }).mount(el);
 *
 * The constructor returns the widget instance (createToolbar's result), so the
 * declared type is `{ new(config): UIToolbar }`. A missing gantt throws.
 */
export class Toolbar {
	constructor(config: IToolbarConfig) {
		if (!config || !config.gantt) {
			throw new Error(
				"Toolbar requires a gantt instance: new Toolbar({ gantt, items: [...] })"
			);
		}
		const gantt = config.gantt;
		const rest: IToolbarConfig = Object.assign({}, config);
		delete rest.gantt;
		return gantt.ext.ui.createToolbar(rest);
	}
}
