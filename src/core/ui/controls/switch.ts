import { BaseControl } from "./base_component";
import { ISwitchConfig } from "./types";
import { applyAria, el, controlUid } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Switch - a boolean field control. Unlike Toggle (a pressed-state toolbar
 * button) this is a form field: a real checkbox with role="switch" under the
 * paint, so keyboard, screen readers and label semantics come for free while
 * only the track and the knob are styled and animated.
 */
export class Switch extends BaseControl<boolean> {
	private _config: ISwitchConfig;
	private _input: HTMLInputElement | null = null;

	constructor(kit: IUiKitRuntime, config?: ISwitchConfig) {
		super(kit);
		this._config = config || {};
	}

	public getValue(): boolean {
		return !!(this._input && this._input.checked);
	}

	public setValue(value: boolean): void {
		if (this._input) {
			this._input.checked = !!value;
			this._syncChecked();
		}
	}

	public setDisabled(flag: boolean): void {
		super.setDisabled(flag);
		if (this._input) {
			this._input.disabled = !!flag;
		}
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const root = el("label", "dhx_ui_control dhx_ui_switch");
		const input = el("input", "dhx_ui_switch_input", {
			type: "checkbox",
			id: controlUid(this.$kit.context, "switch")
		}) as HTMLInputElement;
		applyAria(this.$kit.context, input, { role: "switch" });
		if (config.ariaLabel && !config.label) {
			applyAria(this.$kit.context, input, { "aria-label": config.ariaLabel });
		}

		const track = el("span", "dhx_ui_switch_track");
		track.appendChild(el("span", "dhx_ui_switch_knob"));
		applyAria(this.$kit.context, track, { "aria-hidden": "true" });

		root.appendChild(input);
		root.appendChild(track);
		if (config.label) {
			const text = el("span", "dhx_ui_switch_label");
			text.textContent = config.label;
			root.appendChild(text);
		}

		this._listen(input, "change", () => {
			this._syncChecked();
			this._emitChange();
		});

		this._input = input;
		this._onDestroy(() => {
			this._input = null;
		});
		this._syncChecked();
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}

	private _syncChecked(): void {
		if (!this._input) {
			return;
		}
		applyAria(this.$kit.context, this._input, { "aria-checked": this._input.checked ? "true" : "false" });
	}
}