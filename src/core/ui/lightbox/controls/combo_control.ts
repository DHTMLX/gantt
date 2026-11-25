import { Combo } from "../../controls/combo";
import { formBlockAdapter } from "./form_block_adapter";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "combo" lightbox section — ui-core kit-backed (docs/internal/ui-core).
 * Section config: { type: "combo", options: [{key, label, icon?}], placeholder?,
 * dataProvider?, debounce? }. `options` may carry per-option `icon` glyphs;
 * `dataProvider` supplies options asynchronously (search).
 * Returns the ready form-block object (see form_block_adapter for why this
 * differs from the class-returning legacy control modules).
 */
export default function(gantt: any): any {
	return formBlockAdapter(gantt, function(sns: any) {
		return new Combo(getGanttUiKit(gantt), {
			options: sns.options || [],
			placeholder: sns.placeholder,
			dataProvider: sns.dataProvider,
			debounce: sns.debounce,
			openOnClick: true
		});
	});
}
