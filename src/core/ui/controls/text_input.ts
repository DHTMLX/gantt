import { BaseControl } from "./base_component";
import { ITextInputConfig } from "./types";
import { el } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * TextInput — native input/textarea inside the kit contract.
 */
export class TextInput extends BaseControl<string> {
	private _config: ITextInputConfig;
	private _input: HTMLInputElement | HTMLTextAreaElement | null = null;

	constructor(kit: IUiKitRuntime, config?: ITextInputConfig) {
		super(kit);
		this._config = config || {};
	}

	public getValue(): string {
		return this._input ? this._input.value : "";
	}

	public setValue(value: string): void {
		if (this._input) {
			this._input.value = value === null || value === undefined ? "" : String(value);
		}
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const root = el("div", "dhx_ui_control dhx_ui_text_input");

		let input: HTMLInputElement | HTMLTextAreaElement;
		if (config.multiline) {
			input = el("textarea", "dhx_ui_input") as HTMLTextAreaElement;
			(input as HTMLTextAreaElement).rows = config.rows || 3;
		} else {
			input = el("input", "dhx_ui_input", { type: "text" }) as HTMLInputElement;
		}
		if (config.placeholder) {
			input.setAttribute("placeholder", config.placeholder);
		}
		if (config.maxLength) {
			input.setAttribute("maxlength", String(config.maxLength));
		}

		this._listen(input, "input", () => this._emitChange());

		root.appendChild(input);
		this._input = input;
		this._onDestroy(() => {
			this._input = null;
		});
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}
}
