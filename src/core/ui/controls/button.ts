import { BaseComponent } from "./base_component";
import { IButtonConfig } from "./types";
import { applyAria, el } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

const VARIANT_CLASSES: Record<string, string> = {
	primary: "dhx_ui_btn",
	outline: "dhx_ui_btn_outline",
	danger: "dhx_ui_btn_danger",
	link: "dhx_ui_btn_link"
};

/**
 * Button — thin wrapper over the existing buttons.less mixin variants.
 * IUIComponent (no value semantics); click via config.onClick.
 */
export class Button extends BaseComponent {
	private _config: IButtonConfig;

	constructor(kit: IUiKitRuntime, config?: IButtonConfig) {
		super(kit);
		this._config = config || {};
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const variant = VARIANT_CLASSES[config.variant || "primary"] || VARIANT_CLASSES.primary;
		const button = el("button", "dhx_ui_button " + variant, { type: "button" }) as HTMLButtonElement;

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
		if (config.ariaLabel || (!config.label && config.icon)) {
			applyAria(this.$kit.context, button, { "aria-label": config.ariaLabel || config.icon || "" });
		}

		if (config.onClick) {
			this._listen(button, "click", (e: Event) => {
				if (!this._disabled) {
					config.onClick(e);
				}
			});
		}
		return button;
	}
}
