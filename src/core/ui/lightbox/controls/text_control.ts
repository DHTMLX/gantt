import { TextInput } from "../../controls/text_input";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "text" lightbox section — a single-line text field, ui-core kit-backed (docs/internal/ui-core).
 * Section config: { type: "text", map_to, placeholder? }.
 * A missing value shows as an empty field; the field returns a string.
 * Returns the ready form-block object (see form_block_adapter for why this
 * differs from the class-returning legacy control modules).
 */
export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new TextInput(getGanttUiKit(gantt), {
			placeholder: sns.placeholder
		});
	});
}
