import { IUIControl } from "../../controls/types";

/**
 * Wraps a ui-core kit control factory into the lightbox form-block contract
 * ({render, set_value, get_value, focus} — design §6.3, docs/internal/ui-core).
 *
 * Unlike the legacy `*_control.js` modules (which export a class to be
 * instantiated), kit-backed control modules use this adapter and export a
 * factory returning the ready form-block object: the block itself is
 * stateless, per-section state lives on the section node.
 *
 * The rendered section div carries the same legacy classes as built-in
 * blocks (gantt_cal_ltext + gantt_section_{name}) so user CSS keeps working.
 * The control instance is created lazily on the first set_value call and
 * stored on the section node; lightbox DOM is reused between openings, so
 * the instance lives as long as the section node does (see D-impl-2 in
 * docs/internal/ui-core/00-PLAN.md for the leak-safety reasoning).
 */
export function formBlockAdapter(
	gantt: any,
	createControl: (sns: any) => IUIControl<any>,
	mapValue?: {
		toControl?: (value: any, task: any, sns: any) => any,
		fromControl?: (value: any, task: any, sns: any) => any
	}
): any {
	function getInstance(node: any, sns: any): IUIControl<any> {
		if (!node.$uiControl) {
			const control = createControl(sns);
			control.mount(node);
			if (sns && sns.readonly) {
				control.setDisabled(true);
			}
			node.$uiControl = control;
		}
		return node.$uiControl;
	}

	return {
		render: function(sns: any): string {
			const height = sns.height ? ` style='height:${parseInt(sns.height, 10)}px;'` : "";
			return `<div class='gantt_cal_ltext gantt_section_${sns.name} dhx_ui_form_block'${height}></div>`;
		},
		set_value: function(node: any, value: any, task: any, sns: any): void {
			const control = getInstance(node, sns);
			const mapped = mapValue && mapValue.toControl ? mapValue.toControl(value, task, sns) : value;
			control.setValue(mapped);
			if (sns && sns.onchange && !node.$uiOnChange) {
				node.$uiOnChange = true;
				control.onChange(function() {
					sns.onchange.call(control);
				});
			}
		},
		get_value: function(node: any, task: any, sns: any): any {
			if (!node || !node.$uiControl) {
				return undefined;
			}
			const raw = node.$uiControl.getValue();
			return mapValue && mapValue.fromControl ? mapValue.fromControl(raw, task, sns) : raw;
		},
		focus: function(node: any): void {
			if (node && node.$uiControl) {
				node.$uiControl.focus();
			}
		}
	};
}
