import { BaseControl } from "./base_component";
import { IRadioGroupConfig, IUIOption } from "./types";
import { el, controlUid } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * RadioGroup — styled native radios. Value = checked key (or null).
 */
export class RadioGroup extends BaseControl<string | number | null> {
	private _config: IRadioGroupConfig;
	private _inputs: Array<{ key: string | number, input: HTMLInputElement }> = [];
	private _name: string;

	constructor(kit: IUiKitRuntime, config: IRadioGroupConfig) {
		super(kit);
		this._config = config || { options: [] };
		this._name = this._config.name || controlUid(this.$kit.context, "radio_group");
	}

	public getValue(): string | number | null {
		const checked = this._inputs.filter(entry => entry.input.checked)[0];
		return checked ? checked.key : null;
	}

	public setValue(value: string | number | null): void {
		this._inputs.forEach(function(entry) {
			// loose equality on purpose: gantt data often mixes numeric and string ids
			entry.input.checked = entry.key == value;
		});
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_radio_group");
		(this._config.options || []).forEach((option: IUIOption) => {
			const id = controlUid(this.$kit.context, "radio");
			const row = el("label", "dhx_ui_radio_row", { for: id });
			const input = el("input", "dhx_ui_radio", { type: "radio", id, name: this._name, value: String(option.key) }) as HTMLInputElement;
			const text = el("span", "dhx_ui_radio_label");
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
		const checked = this._inputs.filter(entry => entry.input.checked)[0];
		return checked ? checked.input : (this._inputs.length ? this._inputs[0].input : this._root);
	}
}
