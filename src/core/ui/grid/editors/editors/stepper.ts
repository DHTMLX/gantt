import { NumberStepper } from "../../../controls/number_stepper";
import { inlineEditorAdapter } from "./inline_editor_adapter";
import { getGanttUiKit } from "../../../gantt_ui_kit";

/**
 * "stepper" inline editor — ui-core kit-backed (docs/internal/ui-core).
 * Editor config: { type: "stepper", map_to, min?, max?, step?, placeholder? }.
 * Rejects empty values (saving null is invalid) — use the built-in "number"
 * editor if empty-clears-value semantics are needed.
 * Returns the ready editor object (see inline_editor_adapter for why this
 * differs from the class-returning legacy editor modules).
 */
export default function(gantt: any): any {
	return inlineEditorAdapter(gantt, function(column: any, config: any) {
		return new NumberStepper(getGanttUiKit(gantt), {
			min: config.min,
			max: config.max,
			step: config.step,
			placeholder: config.placeholder,
			// in the grid, ArrowUp/Down move between rows (keyboard-navigation),
			// not step the value — matches the legacy number editor
			stepOnArrowKeys: false
		});
	}, {
		isValid: function(value: any, config: any): boolean {
			if (value === null || value === undefined || isNaN(value)) {
				return false;
			}
			if (config.min !== undefined && value < config.min) {
				return false;
			}
			if (config.max !== undefined && value > config.max) {
				return false;
			}
			return true;
		}
	});
}
