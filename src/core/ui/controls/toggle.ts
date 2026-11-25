import { BaseControl } from "./base_component";
import { IToggleConfig } from "./types";
import { applyAria, el } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Toggle — a pressed-state button (toolbar toggles: critical path on/off,
 * show baselines, …). IUIControl<boolean>: value = pressed.
 * Uses the button ARIA pattern with aria-pressed.
 */
export class Toggle extends BaseControl<boolean> {
	private _config: IToggleConfig;
	private _button: HTMLButtonElement | null = null;
	private _pressed: boolean;

	constructor(kit: IUiKitRuntime, config?: IToggleConfig) {
		super(kit);
		this._config = config || {};
		this._pressed = !!this._config.pressed;
	}

	public getValue(): boolean {
		return this._pressed;
	}

	public setValue(value: boolean): void {
		this._pressed = !!value;
		this._syncPressed();
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const button = el("button", "dhx_ui_button dhx_ui_toggle dhx_ui_btn_outline", { type: "button" }) as HTMLButtonElement;

		if (config.icon) {
			const icon = el("span", "dhx_ui_button_icon " + config.icon);
			applyAria(this.$kit.context, icon, { "aria-hidden": "true" });
			button.appendChild(icon);
		}
		if (config.label) {
			const label = el("span", "dhx_ui_button_label");
			label.textContent = config.label;
			button.appendChild(label);
		}
		if (!config.label && (config.ariaLabel || config.icon)) {
			applyAria(this.$kit.context, button, { "aria-label": config.ariaLabel || config.icon || "" });
		}

		this._listen(button, "click", () => {
			if (this._disabled) {
				return;
			}
			this._pressed = !this._pressed;
			this._syncPressed();
			this._emitChange();
		});

		this._button = button;
		this._onDestroy(() => {
			this._button = null;
		});
		this._syncPressed();
		return button;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._button;
	}

	private _syncPressed(): void {
		if (!this._button) {
			return;
		}
		this._button.classList.toggle("dhx_ui_toggle_pressed", this._pressed);
		applyAria(this.$kit.context, this._button, { "aria-pressed": this._pressed ? "true" : "false" });
	}
}
