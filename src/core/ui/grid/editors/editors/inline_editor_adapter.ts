import { IUIControl } from "../../../controls/types";
import { resolveAriaEnabled } from "../../../accessibility";

/**
 * Wraps a ui-core kit control factory into the grid inline-editor contract
 * ({show, hide, set_value, get_value, is_changed, is_valid, focus} —
 * design §6.3, docs/internal/ui-core).
 *
 * Unlike the legacy editor modules (which export a class to be instantiated
 * by the controller), kit-backed editor modules use this adapter and export
 * a factory returning the ready editor object. One editor object per type
 * lives in gantt.config.editor_types; per-edit state is kept on the
 * placeholder node the controller passes into every method, so a single
 * editor object safely serves any number of grids.
 */
export function inlineEditorAdapter(
	gantt: any,
	createControl: (column: any, config: any) => IUIControl<any>,
	options?: {
		isValid?: (value: any, config: any) => boolean
	}
): any {
	return {
		show: function(id: any, column: any, config: any, placeholder: any): void {
			const cell = document.createElement("div");
			cell.className = "dhx_ui_inline_editor";
			if (resolveAriaEnabled(gantt.config)) {
				cell.setAttribute("role", "cell");
			}
			placeholder.appendChild(cell);
			const control = createControl(column, config);
			control.mount(cell);
			// legacy editors named their input after the column; custom code selects by it
			const input = cell.querySelector("input, select, textarea");
			if (input && column && column.name) {
				input.setAttribute("name", column.name);
			}
			placeholder.$uiControl = control;
		},
		hide: function(placeholder: any): void {
			// the controller calls hide(placeholder); guard for missing arg
			if (placeholder && placeholder.$uiControl) {
				placeholder.$uiControl.destroy();
				placeholder.$uiControl = null;
			}
		},
		set_value: function(value: any, id: any, column: any, placeholder: any): void {
			if (placeholder.$uiControl) {
				placeholder.$uiControl.setValue(value);
			}
		},
		get_value: function(id: any, column: any, placeholder: any): any {
			return placeholder.$uiControl ? placeholder.$uiControl.getValue() : undefined;
		},
		is_changed: function(value: any, id: any, column: any, placeholder: any): boolean {
			const current = this.get_value(id, column, placeholder);
			if (current && value && current.valueOf && value.valueOf) {
				return current.valueOf() !== value.valueOf();
			}
			// loose inequality on purpose, mirrors the base editor's is_changed
			return current != value;
		},
		is_valid: function(value: any, id: any, column: any, placeholder: any): boolean {
			if (options && options.isValid) {
				const editorConfig = column && column.editor ? column.editor : {};
				return options.isValid(value, editorConfig);
			}
			return true;
		},
		focus: function(placeholder: any): void {
			if (placeholder.$uiControl) {
				placeholder.$uiControl.focus();
				// Parity with the legacy editors' base focus() (editors/base.js):
				// select the input text so the first keystroke replaces the
				// current value. This is what makes "open the cell and type to
				// overwrite" work, and lets the printable key that starts
				// keyboard-navigation editing land on a fully-selected input
				// (retest 18_inline_editors/003, /26).
				const root = placeholder.$uiControl.getRootNode
					? placeholder.$uiControl.getRootNode()
					: null;
				const input = root ? root.querySelector("input") : null;
				if (input && input.select) {
					try {
						input.select();
					} catch {
						// silent, matches gantt._focus
					}
				}
			}
		}
	};
}
