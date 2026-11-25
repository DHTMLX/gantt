import { NumberStepper } from "../../controls/number_stepper";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new NumberStepper(getGanttUiKit(gantt), {
			min: sns.min !== undefined ? sns.min : 0,
			max: sns.max !== undefined ? sns.max : 100,
			step: sns.step !== undefined ? sns.step : 5
		});
	}, {
		toControl: (value: any) => Math.round((Number(value) || 0) * 100),
		fromControl: (value: any) => (Number(value) || 0) / 100
	});
}