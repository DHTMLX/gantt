import { Combo } from "../../controls/combo";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "select" lightbox section — kit-backed (Combo) since migration Step 6 §S6.2,
 * replacing the legacy native `<select>`. Preserves the legacy contract:
 * `options`/`map_to`, `readonly`, `onchange`, and — for parity with the old
 * `<select>` — defaulting to the first option when the task has no value for the
 * mapped field. The rendered value is the option `key`.
 *
 * Note: this is the plain single-select section. `typeselect` and `resources`
 * stay on their own legacy controls.
 *
 * Returns the ready form-block object (see form_block_adapter for why this
 * differs from the class-returning legacy control modules).
 */
export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new Combo(getGanttUiKit(gantt), {
			options: sns.options || [],
			placeholder: sns.placeholder,
			openOnClick: true
		});
	}, {
		toControl: function(value: any, task: any, sns: any) {
			if ((value === undefined || value === null || value === "") && sns.options && sns.options.length) {
				// the legacy <select> showed the first option when nothing matched
				return sns.options[0].key;
			}
			return value;
		}
	});
}
