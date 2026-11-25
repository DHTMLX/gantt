import { BaseControl } from "./base_component";
import { INumberStepperConfig } from "./types";
import { applyAria, el, uiLabel } from "./common";
import type { IUiKitRuntime } from "../ui_kit";
import type { DurationFormatter } from "../../../types/gantt_types";

type NumberStepperConfig = INumberStepperConfig & {
	formatter?: Pick<DurationFormatter, "format" | "parse">;
};

/**
 * Clamps and step-aligns a raw numeric value. Exported for unit tests.
 */
export function normalizeStepperValue(raw: number, min?: number, max?: number, step: number = 1): number {
	let value = raw;
	if (isNaN(value)) {
		value = min !== undefined ? min : 0;
	}
	if (step > 0) {
		const base = min !== undefined ? min : 0;
		value = base + Math.round((value - base) / step) * step;
		// avoid float artifacts like 0.30000000000000004
		const precision = (String(step).split(".")[1] || "").length;
		if (precision) {
			value = parseFloat(value.toFixed(precision));
		}
	}
	if (min !== undefined && value < min) {
		value = min;
	}
	if (max !== undefined && value > max) {
		value = max;
	}
	return value;
}

/**
 * NumberStepper — text input with +/- buttons, ArrowUp/Down keyboard support
 * and the full spinbutton aria pattern (closes GS-3145 finding #6 for kit consumers).
 */
export class NumberStepper extends BaseControl<number | null> {
	private _config: NumberStepperConfig;
	private _input: HTMLInputElement | null = null;
	private _formattedValue: { value: number; text: string } | null = null;

	constructor(kit: IUiKitRuntime, config?: NumberStepperConfig) {
		super(kit);
		this._config = config || {};
	}

	public getValue(): number | null {
		if (!this._input) {
			return null;
		}
		const text = this._input.value;
		const formatted = this._formattedValue;
		if (formatted && formatted.text === text) {
			return formatted.value;
		}
		if (text === "") {
			return null;
		}
		const formatter = this._config.formatter;
		const parsed = formatter ? formatter.parse(text) : parseFloat(text);
		return parsed === null || isNaN(parsed) ? null : parsed;
	}

	public setValue(value: number | null): void {
		if (!this._input) {
			return;
		}
		const formatter = this._config.formatter;
		const inputMode = formatter ? "text" : "decimal";
		if (this._input.inputMode !== inputMode) {
			this._input.inputMode = inputMode;
		}
		this._formattedValue = null;
		if (value === null || value === undefined || isNaN(value as number)) {
			this._input.value = "";
		} else if (formatter) {
			this._input.value = formatter.format(value);
			// The formatter may round the text. Keep the exact value until the user edits it.
			this._formattedValue = { value, text: this._input.value };
		} else {
			this._input.value = String(value);
		}
		this._syncAria();
	}

	protected _render(): HTMLElement {
		const config = this._config;
		const root = el("div", "dhx_ui_control dhx_ui_stepper");

		const decrement = el("button", "dhx_ui_stepper_btn dhx_ui_stepper_decrement", { type: "button", tabindex: "-1" });
		decrement.textContent = "−";
		applyAria(this.$kit.context, decrement, { "aria-label": uiLabel(this.$kit.context, "ui_stepper_decrement") });

		const input = el("input", "dhx_ui_input dhx_ui_stepper_input", {
			type: "text",
			inputmode: config.formatter ? "text" : "decimal",
			autocomplete: "off"
		}) as HTMLInputElement;
		if (config.placeholder) {
			input.setAttribute("placeholder", config.placeholder);
		}
		const inputAria: { [key: string]: string } = { role: "spinbutton" };
		if (config.ariaLabel) {
			inputAria["aria-label"] = config.ariaLabel;
		}
		applyAria(this.$kit.context, input, inputAria);

		const increment = el("button", "dhx_ui_stepper_btn dhx_ui_stepper_increment", { type: "button", tabindex: "-1" });
		increment.textContent = "+";
		applyAria(this.$kit.context, increment, { "aria-label": uiLabel(this.$kit.context, "ui_stepper_increment") });

		this._listen(decrement, "click", () => this._stepBy(-1));
		this._listen(increment, "click", () => this._stepBy(1));
		this._listen(input, "input", () => {
			this._formattedValue = null;
			this._syncAria();
			this._emitChange();
		});
		this._listen(input, "change", () => this._commit());
		this._listen(input, "keydown", (e: KeyboardEvent) => {
			if (config.stepOnArrowKeys === false) {
				// grid inline editor: let ArrowUp/Down bubble to keyboard-navigation
				// for row movement (legacy number-editor parity)
				return;
			}
			if (e.key === "ArrowUp") {
				e.preventDefault();
				this._stepBy(1);
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				this._stepBy(-1);
			}
		});

		root.appendChild(decrement);
		root.appendChild(input);
		root.appendChild(increment);
		this._input = input;
		this._onDestroy(() => {
			this._input = null;
		});
		this._syncAria();
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}

	private _stepBy(direction: number): void {
		if (this._disabled || !this._input) {
			return;
		}
		const config = this._config;
		const step = config.step || 1;
		const current = this.getValue();
		if (config.formatter) {
			const raw = (current ?? 0) + direction * step;
			// Formatted durations step from the current value without snapping to the step grid.
			this.setValue(normalizeStepperValue(raw, config.min, config.max, 0));
		} else {
			const raw = (current === null ? (config.min !== undefined ? config.min : 0) : current + direction * step);
			this.setValue(normalizeStepperValue(raw, config.min, config.max, step));
		}
		this._emitChange();
	}

	private _commit(): void {
		const config = this._config;
		if (!config.formatter) {
			const current = this.getValue();
			if (current !== null) {
				this.setValue(normalizeStepperValue(current, config.min, config.max, config.step || 1));
			}
		}
		this._emitChange();
	}

	private _syncAria(): void {
		if (!this._input) {
			return;
		}
		const config = this._config;
		const attrs: Record<string, string> = {};
		if (config.min !== undefined) {
			attrs["aria-valuemin"] = String(config.min);
		}
		if (config.max !== undefined) {
			attrs["aria-valuemax"] = String(config.max);
		}
		const value = this.getValue();
		if (value !== null) {
			attrs["aria-valuenow"] = String(value);
		}
		applyAria(this.$kit.context, this._input, attrs);
	}
}
