import { BaseControl } from "./base_component";
import { IComboConfig, IUIOption } from "./types";
import { applyAria, el, controlUid, uiLabel } from "./common";
import { Popup } from "../popup/popup";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Case-insensitive substring filter over option labels. Exported for unit tests.
 */
export function filterOptions(options: IUIOption[], query: string): IUIOption[] {
	if (!query) {
		return options.slice();
	}
	const needle = query.toLowerCase();
	return options.filter(function(option) {
		return String(option.label).toLowerCase().indexOf(needle) !== -1;
	});
}

/**
 * Combo — searchable select: text input + listbox dropdown on the popup
 * primitive. Keyboard-complete (ArrowUp/Down, Enter, Escape, Tab, typing
 * filters), combobox aria pattern. Value = option key (or null). Options may
 * carry an `icon` (rendered in the dropdown and as a field prefix) and may be
 * supplied asynchronously via `config.dataProvider` (search-as-you-type).
 *
 * The dropdown Popup is created lazily on open and destroyed on close, so a
 * closed (or leaked) combo holds no document-level listeners (D-impl-2).
 */
export class Combo extends BaseControl<string | number | null> {
	private _config: IComboConfig;
	private _input: HTMLInputElement | null = null;
	private _fieldIcon: HTMLElement | null = null;
	private _value: string | number | null = null;
	// remembered so the field keeps the right label/icon even when the current
	// option is no longer in the loaded set (async provider swaps the list)
	private _selectedOption: IUIOption | null = null;
	private _dropdown: Popup | null = null;
	private _list: HTMLElement | null = null;
	private _filtered: IUIOption[] = [];
	private _activeIndex: number = -1;
	private _listboxId: string;
	private _filtering: boolean = false;
	// async load bookkeeping: a monotonic sequence discards stale responses,
	// a timer debounces provider calls while typing
	private _requestSeq: number = 0;
	private _loadTimer: any = null;

	constructor(kit: IUiKitRuntime, config?: IComboConfig) {
		super(kit);
		this._config = config || {};
		this._listboxId = controlUid(this.$kit.context, "listbox");
	}

	public getValue(): string | number | null {
		return this._value;
	}

	public setValue(value: string | number | null): void {
		const option = this._findOption(value);
		if (option) {
			// keep the option (label + icon) so an async combo whose current value
			// isn't in the freshly-loaded list still renders the right label
			this._value = option.key;
			this._selectedOption = option;
		} else if (this._config.dataProvider && value !== null && value !== undefined) {
			// async: the value may reference an option not currently loaded — keep
			// it, and keep a remembered option only while it still matches
			this._value = value;
			if (!this._selectedOption || this._selectedOption.key != value) {
				this._selectedOption = null;
			}
		} else {
			// sync: an unknown value clears (unchanged legacy behavior)
			this._value = null;
			this._selectedOption = null;
		}
		this._syncInputToValue();
	}

	public getOptions(): IUIOption[] {
		return this._config.options || [];
	}

	public setOptions(options: IUIOption[]): void {
		this._config.options = options || [];
		// keep the value only if it still exists
		if (this._value !== null && !this._findOption(this._value)) {
			this._value = null;
			this._syncInputToValue();
		}
		if (this._isOpen()) {
			this._refreshList(this._filtering ? this._input.value : "");
		}
	}

	public destroy(): void {
		this._clearLoadTimer();
		this._closeDropdown();
		super.destroy();
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_combo");

		// field prefix icon (shown only when the selected option carries an icon)
		const fieldIcon = el("span", "dhx_ui_combo_field_icon");
		applyAria(this.$kit.context, fieldIcon, { "aria-hidden": "true" });
		this._fieldIcon = fieldIcon;

		const input = el("input", "dhx_ui_input dhx_ui_combo_input", {
			type: "text",
			autocomplete: "off"
		}) as HTMLInputElement;
		if (this._config.placeholder) {
			input.setAttribute("placeholder", this._config.placeholder);
		}
		if (this._config.filtering === false) {
			input.readOnly = true;
		}
		applyAria(this.$kit.context, input, {
			role: "combobox",
			"aria-expanded": "false",
			"aria-autocomplete": "list",
			"aria-haspopup": "listbox",
			"aria-controls": this._listboxId
		});

		const toggle = el("span", "dhx_ui_combo_toggle");
		applyAria(this.$kit.context, toggle, { "aria-hidden": "true" });

		this._listen(input, "input", () => {
			if (this._config.filtering === false) return;
			this._filtering = true;
			this._openDropdown(input.value);
		});
		// openOnClick: typing still filters the list; focus alone (Tab, a label click)
		// does not open it
		this._listen(input, "mousedown", (e: MouseEvent) => {
			if (!this._config.openOnClick || this._disabled || this._isOpen() || e.button !== 0) {
				return;
			}
			this._filtering = false;
			this._openDropdown("");
		});
		this._listen(input, "keydown", (e: KeyboardEvent) => this._onKeyDown(e));
		this._listen(input, "blur", () => {
			// let option mousedown run first (dropdown handles it on mousedown)
			setTimeout(() => {
				if (!this._isOpen()) {
					this._syncInputToValue();
				}
			}, 0);
		});
		this._listen(toggle, "mousedown", (e: Event) => {
			e.preventDefault();
			if (this._disabled) {
				return;
			}
			if (this._isOpen()) {
				this._closeDropdown();
			} else {
				this._filtering = false;
				this._openDropdown("");
				this.focus();
			}
		});

		root.appendChild(fieldIcon);
		root.appendChild(input);
		root.appendChild(toggle);
		this._input = input;
		this._onDestroy(() => {
			this._input = null;
			this._fieldIcon = null;
		});
		this._syncInputToValue();
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._input;
	}

	// --- dropdown ------------------------------------------------------

	private _isOpen(): boolean {
		return !!(this._dropdown && this._dropdown.isVisible());
	}

	private _openDropdown(query: string): void {
		if (this._disabled || !this._root || !this._input) {
			return;
		}
		if (!this._dropdown) {
			this._dropdown = this._createDropdownPopup();
		}
		if (!this._dropdown.isVisible()) {
			const list = el("div", "dhx_ui_combo_list", { id: this._listboxId });
			applyAria(this.$kit.context, list, { role: "listbox" });
			this._list = list;
			this._dropdown.show(list);
			applyAria(this.$kit.context, this._input, { "aria-expanded": "true" });
		}
		this._refreshList(query);
	}

	private _createDropdownPopup(): Popup {
		const config = {
			className: "dhx_ui_combo_dropdown",
			role: "listbox" as const,
			position: {
				type: "anchor" as const,
				target: this._root,
				side: "bottom" as const,
				flip: true,
				matchTargetWidth: true
			},
			dismiss: { escape: false, outsideClick: true },
			ignoreOutsideClick: [this._root]
		};
		const popup: Popup = this.$kit.createPopup(config);
		popup.attachEvent("onHide", () => {
			this._clearLoadTimer();
			this._requestSeq++; // invalidate any in-flight async load
			this._activeIndex = -1;
			this._list = null;
			if (this._input) {
				applyAria(this.$kit.context, this._input, { "aria-expanded": "false" });
				this._input.removeAttribute("aria-activedescendant");
			}
			this._syncInputToValue();
		});
		return popup;
	}

	private _closeDropdown(): void {
		if (this._dropdown) {
			this._dropdown.destroy();
			this._dropdown = null;
			this._list = null;
			this._activeIndex = -1;
		}
	}

	private _refreshList(query: string): void {
		if (!this._list) {
			return;
		}
		if (this._config.dataProvider) {
			this._loadAsync(query);
			return;
		}
		const options = this.getOptions();
		this._filtered = this._filtering ? filterOptions(options, query) : options.slice();
		this._renderOptions();
	}

	/** async path: debounce the provider call, discard stale/closed responses,
	 * cache the returned options (so selection can resolve the key) */
	private _loadAsync(query: string): void {
		this._renderLoading();
		this._clearLoadTimer();
		const delay = this._config.debounce !== undefined ? this._config.debounce : 200;
		const seq = ++this._requestSeq;
		const run = () => {
			this._loadTimer = null;
			let result: IUIOption[] | Promise<IUIOption[]>;
			try {
				result = this._config.dataProvider!(query);
			} catch {
				this._onLoaded(seq, []);
				return;
			}
			Promise.resolve(result).then(
				(options) => this._onLoaded(seq, options || []),
				() => this._onLoaded(seq, [])
			);
		};
		if (delay > 0) {
			this._loadTimer = setTimeout(run, delay);
		} else {
			run();
		}
	}

	private _onLoaded(seq: number, options: IUIOption[]): void {
		// ignore results from a superseded request or after the dropdown closed
		if (seq !== this._requestSeq || !this._isOpen()) {
			return;
		}
		this._config.options = options; // cache so _findOption resolves selections
		this._filtered = options.slice();
		this._renderOptions();
	}

	private _clearLoadTimer(): void {
		if (this._loadTimer) {
			clearTimeout(this._loadTimer);
			this._loadTimer = null;
		}
	}

	private _renderLoading(): void {
		if (!this._list) {
			return;
		}
		this._list.innerHTML = "";
		const loading = el("div", "dhx_ui_combo_loading");
		loading.textContent = uiLabel(this.$kit.context, "ui_combo_loading");
		this._list.appendChild(loading);
		this._setActiveIndex(-1);
		if (this._dropdown) {
			this._dropdown.reposition();
		}
	}

	private _renderOptions(): void {
		if (!this._list) {
			return;
		}
		this._list.innerHTML = "";

		if (!this._filtered.length) {
			const empty = el("div", "dhx_ui_combo_empty");
			empty.textContent = uiLabel(this.$kit.context, "ui_combo_no_results");
			this._list.appendChild(empty);
			this._setActiveIndex(-1);
			if (this._dropdown) {
				this._dropdown.reposition();
			}
			return;
		}

		this._filtered.forEach((option, index) => {
			const item = el("div", "dhx_ui_combo_option", { id: this._listboxId + "_" + index });
			if (option.css) item.classList.add.apply(item.classList, option.css.split(/\s+/).filter(Boolean));
			if (this._config.optionHeight) item.style.height = this._config.optionHeight + "px";
			applyAria(this.$kit.context, item, { role: "option" });
			if (option.icon) {
				const icon = el("span", "dhx_ui_combo_option_icon " + option.icon);
				applyAria(this.$kit.context, icon, { "aria-hidden": "true" });
				item.appendChild(icon);
			}
			// label in its own span so the icon glyph (::before content) never
			// bleeds into textContent — keeps the option's accessible/queried text
			const label = el("span", "dhx_ui_combo_option_label");
			label.textContent = option.label;
			item.appendChild(label);
			if (option.key === this._value) {
				item.classList.add("dhx_ui_combo_option_selected");
				applyAria(this.$kit.context, item, { "aria-selected": "true" });
			}
			// plain listeners on purpose: option nodes are discarded on every
			// list refresh and GC together with their handlers — routing them
			// through _listen would grow the destroy-cleanup list unboundedly
			item.addEventListener("mousedown", (e: Event) => {
				e.preventDefault();
				this._selectOption(option);
			});
			item.addEventListener("mousemove", () => {
				this._setActiveIndex(index);
			});
			this._list!.appendChild(item);
		});

		const selectedIndex = this._filtered.map(o => o.key).indexOf(this._value as any);
		this._setActiveIndex(selectedIndex !== -1 ? selectedIndex : 0);
		if (this._dropdown) {
			this._dropdown.reposition();
		}
	}

	private _setActiveIndex(index: number): void {
		if (!this._list) {
			return;
		}
		const items = this._list.querySelectorAll(".dhx_ui_combo_option");
		for (let i = 0; i < items.length; i++) {
			items[i].classList.toggle("dhx_ui_combo_option_active", i === index);
		}
		this._activeIndex = index;
		if (this._input) {
			if (index >= 0) {
				applyAria(this.$kit.context, this._input, { "aria-activedescendant": this._listboxId + "_" + index });
				const active = items[index] as HTMLElement;
				if (active && active.scrollIntoView) {
					active.scrollIntoView({ block: "nearest" });
				}
			} else {
				this._input.removeAttribute("aria-activedescendant");
			}
		}
	}

	private _onKeyDown(e: KeyboardEvent): void {
		if (this._disabled) {
			return;
		}
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (!this._isOpen()) {
					this._filtering = false;
					this._openDropdown("");
				} else {
					this._setActiveIndex(Math.min(this._activeIndex + 1, this._filtered.length - 1));
				}
				break;
			case "ArrowUp":
				e.preventDefault();
				if (this._isOpen()) {
					this._setActiveIndex(Math.max(this._activeIndex - 1, 0));
				}
				break;
			case "Enter":
				if (this._isOpen()) {
					e.preventDefault();
					const option = this._filtered[this._activeIndex];
					if (option) {
						this._selectOption(option);
					}
				}
				break;
			case "Escape":
				if (this._isOpen()) {
					e.preventDefault();
					e.stopPropagation();
					this._closeDropdownKeepFocus();
				}
				break;
			case "Tab":
				if (this._isOpen()) {
					this._closeDropdownKeepFocus();
				}
				break;
		}
	}

	private _closeDropdownKeepFocus(): void {
		if (this._dropdown) {
			this._dropdown.hide();
		}
	}

	private _selectOption(option: IUIOption): void {
		const changed = this._value !== option.key;
		this._value = option.key;
		this._selectedOption = option; // remember for label/icon after async reloads
		this._filtering = false;
		this._closeDropdownKeepFocus();
		this._syncInputToValue();
		if (changed) {
			this._emitChange();
		}
	}

	private _findOption(key: string | number | null): IUIOption | null {
		if (key === null || key === undefined) {
			return null;
		}
		const options = this.getOptions();
		for (let i = 0; i < options.length; i++) {
			// loose equality on purpose: gantt data often mixes numeric and string ids
			if (options[i].key == key) {
				return options[i];
			}
		}
		return null;
	}

	private _syncInputToValue(): void {
		if (!this._input) {
			return;
		}
		const option = this._currentOption();
		this._input.value = option ? option.label : "";
		this._reflectFieldIcon(option);
	}

	/** the option backing the current value: the remembered selection when it
	 * still matches (async), otherwise a lookup in the loaded options (sync) */
	private _currentOption(): IUIOption | null {
		if (this._selectedOption && this._selectedOption.key == this._value) {
			return this._selectedOption;
		}
		return this._findOption(this._value);
	}

	private _reflectFieldIcon(option: IUIOption | null): void {
		if (!this._fieldIcon || !this._root) {
			return;
		}
		const icon = option && option.icon;
		this._fieldIcon.className = "dhx_ui_combo_field_icon" + (icon ? " " + icon : "");
		this._root.classList.toggle("dhx_ui_combo_has_icon", !!icon);
	}
}
