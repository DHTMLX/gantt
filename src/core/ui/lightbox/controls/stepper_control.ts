import { NumberStepper } from "../../controls/number_stepper";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "stepper" lightbox section — ui-core kit-backed (docs/internal/ui-core).
 * Section config: { type: "stepper", min?, max?, step?, placeholder? }.
 * Returns the ready form-block object (see form_block_adapter for why this
 * differs from the class-returning legacy control modules).
 */
export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new NumberStepper(getGanttUiKit(gantt), {
			min: sns.min,
			max: sns.max,
			step: sns.step,
			placeholder: sns.placeholder
		});
	});
}
