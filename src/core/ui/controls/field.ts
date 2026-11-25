import { BaseComponent } from "./base_component";
import { IUIComponent, IFieldConfig } from "./types";
import { applyAria, el, controlUid } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Field — label/description/validation wrapper around another kit component.
 * Handles label association and the validation-message slot.
 */
export class Field extends BaseComponent {
	private _config: IFieldConfig;
	private _child: IUIComponent;
	private _validationEl: HTMLElement | null = null;
	private _labelId: string;

	constructor(kit: IUiKitRuntime, config: IFieldConfig, child: IUIComponent) {
		super(kit);
		this._config = config || {};
		this._child = child;
		this._labelId = controlUid(this.$kit.context, "field_label");
	}

	/** Shows a validation message; pass null to clear. */
	public setValidity(message: string | null): void {
		if (!this._validationEl || !this._root) {
			return;
		}
		if (message) {
			this._validationEl.textContent = message;
			this._validationEl.style.display = "";
			this._root.classList.add("dhx_ui_field_invalid");
		} else {
			this._validationEl.textContent = "";
			this._validationEl.style.display = "none";
			this._root.classList.remove("dhx_ui_field_invalid");
		}
	}

	public focus(): void {
		this._child.focus();
	}

	public setDisabled(flag: boolean): void {
		super.setDisabled(flag);
		this._child.setDisabled(flag);
	}

	public destroy(): void {
		this._child.destroy();
		super.destroy();
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const root = el("div", "dhx_ui_field");

		let label: HTMLLabelElement | undefined;
		if (config.label) {
			label = el("label", "dhx_ui_field_label", { id: this._labelId }) as HTMLLabelElement;
			label.textContent = config.label;
			if (config.required) {
				const marker = el("span", "dhx_ui_field_required");
				marker.textContent = "*";
				applyAria(this.$kit.context, marker, { "aria-hidden": "true" });
				label.appendChild(marker);
			}
			root.appendChild(label);
		}

		const controlHost = el("div", "dhx_ui_field_control");
		this._child.mount(controlHost);
		const childRoot = this._child.getRootNode();
		if (childRoot && label) {
			const switchInput = childRoot.querySelector(":scope.dhx_ui_switch > .dhx_ui_switch_input");
			if (switchInput?.id) {
				label.htmlFor = switchInput.id;
			} else {
				applyAria(this.$kit.context, childRoot, { "aria-labelledby": this._labelId });
			}
		}
		root.appendChild(controlHost);

		if (config.description) {
			const description = el("div", "dhx_ui_field_description");
			description.textContent = config.description;
			root.appendChild(description);
		}

		const validation = el("div", "dhx_ui_field_validation");
		validation.style.display = "none";
		applyAria(this.$kit.context, validation, { role: "alert" });
		root.appendChild(validation);
		this._validationEl = validation;
		this._onDestroy(() => {
			this._validationEl = null;
		});

		return root;
	}
}
