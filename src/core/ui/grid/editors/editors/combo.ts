import { Combo } from "../../../controls/combo";
import { inlineEditorAdapter } from "./inline_editor_adapter";
import { getGanttUiKit } from "../../../gantt_ui_kit";

/**
 * "combo" inline editor — ui-core kit-backed (docs/internal/ui-core).
 * Editor config: { type: "combo", map_to, options: [{key, label, icon?}],
 * placeholder?, dataProvider?, debounce? }. `options` may carry per-option
 * `icon` glyphs; `dataProvider` supplies options asynchronously (search).
 * Returns the ready editor object (see inline_editor_adapter for why this
 * differs from the class-returning legacy editor modules).
 */
export default function(gantt: any): any {
	return inlineEditorAdapter(gantt, function(column: any, config: any) {
		return new Combo(getGanttUiKit(gantt), {
			options: config.options || [],
			placeholder: config.placeholder,
			dataProvider: config.dataProvider,
			debounce: config.debounce
		});
	});
}
