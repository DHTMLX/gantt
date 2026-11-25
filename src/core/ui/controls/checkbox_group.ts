import { BaseControl } from "./base_component";
import { ICheckboxGroupConfig, IUIOption } from "./types";
import { el, controlUid } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * CheckboxGroup — styled native checkboxes. Value = array of checked keys.
 */
export class CheckboxGroup extends BaseControl<Array<string | number>> {
	private _config: ICheckboxGroupConfig;
	private _inputs: Array<{ key: string | number, input: HTMLInputElement }> = [];

	constructor(kit: IUiKitRuntime, config: ICheckboxGroupConfig) {
		super(kit);
		this._config = config || { options: [] };
	}

	public getValue(): Array<string | number> {
		return this._inputs.filter(entry => entry.input.checked).map(entry => entry.key);
	}

	public setValue(value: Array<string | number>): void {
		const values = (value || []).map(String);
		this._inputs.forEach(function(entry) {
			entry.input.checked = values.indexOf(String(entry.key)) !== -1;
		});
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_checkbox_group");
		(this._config.options || []).forEach((option: IUIOption) => {
			const id = controlUid(this.$kit.context, "checkbox");
			const row = el("label", "dhx_ui_checkbox_row", { for: id });
			const input = el("input", "dhx_ui_checkbox", { type: "checkbox", id, value: String(option.key) }) as HTMLInputElement;
			const text = el("span", "dhx_ui_checkbox_label");
			text.textContent = option.label;
			this._listen(input, "change", () => this._emitChange());
			row.appendChild(input);
			row.appendChild(text);
			root.appendChild(row);
			this._inputs.push({ key: option.key, input });
		});
		this._onDestroy(() => {
			this._inputs = [];
		});
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._inputs.length ? this._inputs[0].input : this._root;
	}
}
