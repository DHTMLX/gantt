import { Switch } from "../../controls/switch";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new Switch(getGanttUiKit(gantt), {
			label: sns.switch_label,
			ariaLabel: sns.label || (gantt.locale.labels as any)["section_" + sns.name] || sns.name
		});
	}, {
		toControl: (value: any, _task: any, sns: any) => (value === undefined || value === null)
			? !!(sns && sns.default_value)
			: !!value,
		fromControl: (value: any) => !!value
	});
}