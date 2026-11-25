/**
 * Toolbar — composite widget (Layer A) that turns a declarative item list into
 * kit controls (Button / Toggle / Combo / RadioGroup / Menu) laid out in a
 * `role="toolbar"` row. It uses roving tabindex when Gantt keyboard navigation
 * is enabled at mount.
 *
 * It is instance-bound (needs `gantt` for locale, the ARIA switch, popup
 * lifecycle and the built-in actions). Reachable imperatively via
 * `gantt.ext.ui.createToolbar()` and the top-level `Toolbar` export; the
 * declarative `gantt.config.toolbar` path (ext/toolbar) hosts an instance of it
 * in a layout cell.
 *
 * Item grammar and built-ins: docs/internal/toolbar-context-menu/01-toolbar-api.md
 * and ./toolbar_builtins.ts.
 */
import { el, applyAria, uiLabel, controlUid } from "./common";
import { Button } from "./button";
import { Toggle } from "./toggle";
import { Combo } from "./combo";
import { RadioGroup } from "./radio_group";
import { TextInput } from "./text_input";
import { NumberStepper } from "./number_stepper";
import { DatePicker } from "./datepicker";
import { Menu } from "./menu";
import {
	IToolbar, IToolbarConfig, IToolbarItem, ToolbarItemDef, IUIComponent, IUIControl, IUIOption, IToolbarApi, IToolbarBuiltin, ToolbarBuiltinResolver
} from "./types";
import { IRenderedItem, OVERFLOW_CLASS, ToolbarOverflowController } from "./toolbar_overflow_menu";
import type { IUiKitRuntime } from "../ui_kit";

function isSeparator(comp?: string): boolean {
	return comp === "separator";
}
function isSpacer(comp?: string): boolean {
	return comp === "spacer";
}

export class Toolbar implements IToolbar {
	// eventable API (assigned by eventable())
	public attachEvent!: (name: string, handler: (...args: any[]) => any, settings?: any) => string | number;
	public callEvent!: (name: string, args: any[]) => boolean;
	public detachEvent!: (id: string | number) => void;
	public detachAllEvents!: () => void;

	private $kit: IUiKitRuntime;
	private _config: IToolbarConfig;
	private _defs: IToolbarItem[];              // normalized source (strings expanded to objects)
	private _root: HTMLElement | null = null;
	private _items: IRenderedItem[] = [];
	private _destroyed = false;
	private _disabled = false;
	private _api: IToolbarApi;
	private _resolveBuiltin: ToolbarBuiltinResolver;
	private _rovingHandler: ((e: KeyboardEvent) => void) | null = null;

	private _overflow: ToolbarOverflowController;     // the "More" / burger menu of a narrow row

	constructor(kit: IUiKitRuntime, config?: IToolbarConfig, resolveBuiltin?: ToolbarBuiltinResolver) {
		this.$kit = kit;
		this._config = config || {};
		this._resolveBuiltin = resolveBuiltin || (() => undefined);
		this._defs = this._normalizeAll(this._config.items || []);
		kit.context.eventable(this);
		if (kit.registerComponent) {
			kit.registerComponent(this);
		}

		const self = this;
		this._overflow = new ToolbarOverflowController({
			kit,
			config: this._config,
			root: () => self._root,
			items: () => self._items,
			disabled: () => self._disabled,
			destroyed: () => self._destroyed,
			activateClick: (rec, e) => self._activateClick(rec, e),
			activateChange: (rec, value) => self._activateChange(rec, value),
			activateSelect: (rec, leafId, leafItem) => self._activateSelect(rec, leafId, leafItem),
			rowChanged: () => self._repairRovingTabindex()
		});
		this._api = {
			updateItem: (id, patch) => self.updateItem(id, patch),
			getControl: (id) => self.getControl(id),
			setValue: (id, value) => self.setValue(id, value),
			getValue: (id) => self.getValue(id),
			state: (id) => {
				const rec = self._find(id);
				return rec ? rec.state : {};
			}
		};
	}

	// --- lifecycle -----------------------------------------------------------

	public mount(target: HTMLElement): void {
		if (this._destroyed || this._root) {
			return;
		}
		const wrap = this._overflow.mode() === "wrap" ? " dhx_ui_toolbar_wrap" : "";
		this._root = el("div", "dhx_ui_toolbar" + wrap + (this._config.css ? " " + this._config.css : ""));
		applyAria(this.$kit.context, this._root, { role: "toolbar", "aria-label": uiLabel(this.$kit.context, "ui_toolbar_label") });
		this._renderItems();
		target.appendChild(this._root);
		this._overflow.install();
		this._overflow.layout();
		this._installRoving();
		if (this._disabled) {
			this.setDisabled(true);
		}
	}

	public destroy(): void {
		if (this._destroyed) {
			return;
		}
		this._destroyed = true;
		this._teardownItems();
		this._overflow.destroy();
		if (this._rovingHandler && this._root) {
			this._root.removeEventListener("keydown", this._rovingHandler);
		}
		this._rovingHandler = null;
		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}
		this._root = null;
		this.detachAllEvents();
		if (this.$kit.unregisterComponent) {
			this.$kit.unregisterComponent(this);
		}
	}

	public focus(): void {
		const focusables = this._focusables();
		if (focusables.length) {
			try { focusables[0].focus(); } catch { /* ignore */ }
		}
	}

	public setDisabled(flag: boolean): void {
		this._disabled = !!flag;
		this._items.forEach(rec => {
			if (rec.control && rec.control.setDisabled) {
				rec.control.setDisabled(this._disabled);
			}
		});
		this._overflow.setDisabled(this._disabled);
	}

	public getRootNode(): HTMLElement | null {
		return this._root;
	}

	// --- imperative item API -------------------------------------------------

	public setItems(items: ToolbarItemDef[]): void {
		this._defs = this._normalizeAll(items || []);
		this._config.items = items;
		this._rerender();
	}

	public refresh(): void {
		this._rerender();
	}

	public updateItem(id: string | number, patch: Partial<IToolbarItem>): void {
		const source = this._findDef(id);
		if (!source) {
			return;
		}
		Object.assign(source, patch);

		const rec = this._find(id);
		const structuralKeys = ["comp", "label", "icon", "items", "options", "variant", "themes"];
		const structural = structuralKeys.some(k => k in patch);
		if (!rec || structural) {
			this._rerender();
			return;
		}
		if (rec.field && "width" in patch) {
			rec.def.width = patch.width;
			this._setFieldWidth(rec.field.root, patch.width);
		}
		if (rec.field && "ariaLabel" in patch) {
			rec.def.ariaLabel = patch.ariaLabel;
			this._setFieldAccessibleName(rec.def, rec.field.input);
		}
		// cheap in-place updates
		if ("hidden" in patch && rec.node) {
			rec.node.style.display = patch.hidden ? "none" : "";
			this._overflow.layout();
		}
		if ("overflow" in patch) {
			rec.def.overflow = patch.overflow;
			this._overflow.layout();
		}
		if ("disabled" in patch && rec.control && rec.control.setDisabled) {
			rec.control.setDisabled(!!patch.disabled);
		}
		if ("pressed" in patch && rec.control && (rec.control as any).setValue) {
			(rec.control as any).setValue(!!patch.pressed);
		}
		if ("value" in patch && rec.control && (rec.control as any).setValue) {
			(rec.control as any).setValue(patch.value);
		}
	}

	public getItem(id: string | number): IToolbarItem | null {
		const rec = this._find(id);
		return rec ? JSON.parse(JSON.stringify(stripCallbacks(rec.def))) : null;
	}

	public getControl(id: string | number): IUIComponent | null {
		const rec = this._find(id);
		return rec ? (rec.control || null) : null;
	}

	public getValue(id: string | number): any {
		const rec = this._find(id);
		if (rec && rec.control && (rec.control as any).getValue) {
			return (rec.control as any).getValue();
		}
		return undefined;
	}

	public setValue(id: string | number, value: any): void {
		const rec = this._find(id);
		if (rec && rec.control && (rec.control as any).setValue) {
			(rec.control as any).setValue(value);
		}
	}

	// --- normalization -------------------------------------------------------

	private _normalizeAll(defs: ToolbarItemDef[]): IToolbarItem[] {
		return defs.map(d => this._normalize(d)).filter(Boolean) as IToolbarItem[];
	}

	private _normalize(def: ToolbarItemDef): IToolbarItem | null {
		if (def === "|" || def === "separator") {
			return { comp: "separator" };
		}
		if (def === "spacer") {
			return { comp: "spacer" };
		}
		if (typeof def === "string") {
			return { id: def };
		}
		if (def && typeof def === "object") {
			return Object.assign({}, def);
		}
		return null;
	}

	/** merge built-in descriptor + run its resolve(); returns null when degraded out. */
	private _resolve(source: IToolbarItem): IRenderedItem | null {
		if (isSeparator(source.comp) || isSpacer(source.comp) || source.comp === "label") {
			return { def: Object.assign({}, source), node: null, state: {} };
		}
		let builtin: IToolbarBuiltin | undefined;
		if (source.id !== undefined && source.id !== null) {
			builtin = this._resolveBuiltin(String(source.id));
		}
		let item: IToolbarItem = Object.assign({}, source);
		if (builtin) {
			if (builtin.available && !builtin.available(this.$kit.owner)) {
				return null;                              // degradation → hidden
			}
			// user object overrides the built-in descriptor (id-merge, design 01 §4)
			item = Object.assign({}, builtin.descriptor, source);
			if (builtin.resolve) {
				item = builtin.resolve(this.$kit.owner, item);
			}
		}
		if (!item.comp) {
			item.comp = item.items ? "menu" : (item.options ? "combo" : "button");
		}
		return { def: item, builtin, node: null, state: {} };
	}

	// --- rendering -----------------------------------------------------------

	private _renderItems(): void {
		if (!this._root) {
			return;
		}
		this._items = [];
		this._defs.forEach(source => {
			const rec = this._resolve(source);
			if (!rec) {
				return;                                   // degraded out
			}
			this._renderOne(rec);
			this._items.push(rec);
		});
		this._overflow.renderButton(this._root);
		// built-in bind() lifecycle — after all controls are in the DOM
		this._items.forEach(rec => {
			if (rec.builtin && rec.builtin.bind) {
				const teardown = rec.builtin.bind(this.$kit.owner, rec.control || null, this._api, rec.def);
				rec.teardown = teardown || null;
			}
		});
	}

	private _renderOne(rec: IRenderedItem): void {
		const item = rec.def;
		const root = this._root as HTMLElement;
		const comp = item.comp || "button";

		if (isSeparator(comp)) {
			rec.node = el("div", "dhx_ui_toolbar_separator");
			applyAria(this.$kit.context, rec.node, { role: "separator", "aria-orientation": "vertical" });
			root.appendChild(rec.node);
			return;
		}
		if (isSpacer(comp)) {
			rec.node = el("div", "dhx_ui_toolbar_spacer");
			root.appendChild(rec.node);
			return;
		}

		const label = item.label ? uiLabel(this.$kit.context, item.label) : "";
		const tooltip = item.tooltip ? uiLabel(this.$kit.context, item.tooltip) : "";

		switch (comp) {
			case "toggle": {
				const toggle = new Toggle(this.$kit, {
					label, icon: item.icon, ariaLabel: tooltip || label, pressed: !!item.pressed
				});
				toggle.onChange((value: boolean) => this._activateChange(rec, value));
				toggle.mount(root);
				rec.control = toggle;
				rec.node = toggle.getRootNode();
				break;
			}
			case "label": {
				const caption = el("span", "dhx_ui_toolbar_label");
				caption.textContent = label;
				root.appendChild(caption);
				rec.node = caption;
				break;
			}
			case "combo":
				this._mountField(rec, new Combo(this.$kit, { options: item.options || [], placeholder: item.placeholder }), label);
				break;
			case "text":
				this._mountField(rec, new TextInput(this.$kit, { placeholder: item.placeholder, ...item.config }), label);
				break;
			case "stepper":
				this._mountField(rec, new NumberStepper(this.$kit, { placeholder: item.placeholder, ...item.config }), label);
				break;
			case "datepicker":
				this._mountField(rec, new DatePicker(this.$kit, { ...item.config }), label);
				break;
			case "segmented": {
				const group = new RadioGroup(this.$kit, { options: (item.options || []) as IUIOption[] });
				group.mount(root);
				if (item.value !== undefined) {
					group.setValue(item.value);
				}
				group.onChange((value: any) => this._activateChange(rec, value));
				rec.control = group;
				rec.node = group.getRootNode();
				if (rec.node) {
					rec.node.classList.add("dhx_ui_segmented");
				}
				break;
			}
			case "menu": {
				const button = new Button(this.$kit, {
					label, icon: item.icon, variant: item.variant || "outline",
					ariaLabel: tooltip || label,
					onClick: () => this._openMenu(rec)
				});
				button.mount(root);
				rec.control = button;
				rec.node = button.getRootNode();
				if (rec.node) {
					rec.node.classList.add("dhx_ui_toolbar_menu_button");
					applyAria(this.$kit.context, rec.node, { "aria-haspopup": "menu", "aria-expanded": "false" });
				}
				rec.menu = new Menu(this.$kit, {
					items: item.items || [],
					label: tooltip || label,
					ignoreOutsideClick: rec.node ? [rec.node] : [],
					onSelect: (leafId, leafItem) => this._activateSelect(rec, leafId, leafItem)
				});
				break;
			}
			default: {   // "button"
				const button = new Button(this.$kit, {
					label, icon: item.icon, variant: item.variant || "outline",
					ariaLabel: tooltip || label,
					onClick: (e: Event) => this._activateClick(rec, e)
				});
				button.mount(root);
				rec.control = button;
				rec.node = button.getRootNode();
			}
		}

		if (rec.node) {
			if (tooltip) {
				rec.node.setAttribute("title", tooltip);
			}
			if (item.hidden) {
				rec.node.style.display = "none";
			}
			if (item.disabled && rec.control && rec.control.setDisabled) {
				rec.control.setDisabled(true);
			}
		}
	}

	private _mountField(rec: IRenderedItem, control: IUIControl<any>, label: string): void {
		const root = this._root as HTMLElement;
		const labelNode = label ? el("label", "dhx_ui_toolbar_label") as HTMLLabelElement : null;
		const host = labelNode ? el("div", "dhx_ui_toolbar_field") : root;
		if (labelNode) {
			labelNode.textContent = label;
			host.appendChild(labelNode);
			root.appendChild(host);
		}

		control.mount(host);
		const field = control.getRootNode()!;
		const input = field.querySelector<HTMLElement>("input, textarea")!;
		field.classList.add("dhx_ui_toolbar_input");
		if (labelNode) {
			input.id = controlUid(this.$kit.context, "toolbar_input");
			labelNode.htmlFor = input.id;
		}

		rec.control = control;
		rec.node = labelNode ? host : field;
		rec.field = { root: field, input };
		this._setFieldWidth(field, rec.def.width);
		this._setFieldAccessibleName(rec.def, input);
		if (rec.def.value !== undefined) {
			control.setValue(rec.def.value);
		}
		control.onChange((value) => this._activateChange(rec, value));
	}

	private _setFieldWidth(root: HTMLElement, width?: number): void {
		root.style.width = typeof width === "number" && Number.isFinite(width) && width > 0 ? width + "px" : "";
	}

	private _setFieldAccessibleName(item: IToolbarItem, input: HTMLElement): void {
		const name = item.ariaLabel ? uiLabel(this.$kit.context, item.ariaLabel) : item.config?.ariaLabel;
		if (name) {
			applyAria(this.$kit.context, input, { "aria-label": name });
		} else {
			input.removeAttribute("aria-label");
		}
	}

	private _openMenu(rec: IRenderedItem): void {
		if (rec.menu && rec.node) {
			// keep item.items fresh (theme built-in re-ticks the current entry)
			rec.menu.setItems(rec.def.items || []);
			if (rec.menu.isOpen()) {
				rec.menu.close();
				this._setExpanded(rec, false);
			} else {
				rec.menu.openFor(rec.node);
				this._setExpanded(rec, true);
				rec.menu.attachEvent("onClose", () => this._setExpanded(rec, false));
			}
		}
	}

	private _setExpanded(rec: IRenderedItem, flag: boolean): void {
		if (rec.node) {
			applyAria(this.$kit.context, rec.node, { "aria-expanded": flag ? "true" : "false" });
		}
	}

	// --- activation ----------------------------------------------------------

	private _activateClick(rec: IRenderedItem, e: Event | null): void {
		const item = rec.def;
		const id = item.id as string | number;
		if (this._veto("onItemClick", [id, item, e], () => item.onClick ? item.onClick(e, item) : undefined)) {
			return;
		}
		if (rec.builtin && rec.builtin.action) {
			rec.builtin.action(this.$kit.owner, this._api, item);
		}
	}

	private _activateSelect(rec: IRenderedItem, leafId: string | number | undefined, leafItem: any): void {
		this._setExpanded(rec, false);
		if (this._veto("onItemClick", [leafId, leafItem, null], () => rec.def.onClick ? rec.def.onClick(null, leafItem) : undefined)) {
			return;
		}
		if (rec.builtin && rec.builtin.action) {
			rec.builtin.action(this.$kit.owner, this._api, rec.def, leafId);
		}
	}

	private _activateChange(rec: IRenderedItem, value: any): void {
		const item = rec.def;
		const id = item.id as string | number;
		if (this._veto("onItemChange", [id, value, item], () => item.onChange ? item.onChange(value, item) : undefined)) {
			// revert the control's UI so it matches the cancelled state (toggle mainly)
			if (rec.control && (rec.control as any).setValue) {
				if (rec.def.comp === "toggle") {
					(rec.control as any).setValue(!value);
				}
			}
			return;
		}
		if (rec.builtin && rec.builtin.action) {
			rec.builtin.action(this.$kit.owner, this._api, item, value);
		}
	}

	/** fires event + config catch-all + item callback; returns true if any vetoed. */
	private _veto(eventName: string, args: any[], itemCallback: () => boolean | void): boolean {
		let cancelled = false;
		if (this.callEvent(eventName, args) === false) {
			cancelled = true;
		}
		const catchAll = (eventName === "onItemClick") ? this._config.onItemClick : this._config.onItemChange;
		if (catchAll && (catchAll as any).apply(null, args) === false) {
			cancelled = true;
		}
		if (itemCallback() === false) {
			cancelled = true;
		}
		return cancelled;
	}

	// --- roving tabindex -----------------------------------------------------

	private _focusables(): HTMLElement[] {
		if (!this._root) {
			return [];
		}
		const selector = "button, input, select, textarea, [tabindex]";
		const root = this._root;
		const shown = (node: HTMLElement | null): node is HTMLElement => {
			return !!node && node.style.display !== "none" && !node.classList.contains(OVERFLOW_CLASS) && root.contains(node);
		};
		const nodes = this._items.flatMap(({ node }) => {
			if (!shown(node)) {
				return [];
			}
			return node.matches(selector) ? [node] : Array.from(node.querySelectorAll<HTMLElement>(selector));
		});
		const more = this._overflow.buttonNode();
		if (shown(more)) {
			nodes.push(more);
		}
		return nodes.filter(node => node.style.display !== "none" && !(node as HTMLButtonElement).disabled);
	}

	private _installRoving(): void {
		const gantt = this.$kit.owner;
		if (!this._root || !gantt?.ext?.keyboardNavigation || !gantt.config.keyboard_navigation) {
			return;
		}
		this._syncRovingTabindex(0);
		this._rovingHandler = (e: KeyboardEvent) => this._onRovingKey(e);
		this._root.addEventListener("keydown", this._rovingHandler);
		this._root.addEventListener("focusin", (e: Event) => {
			const focusables = this._focusables();
			const idx = focusables.indexOf(e.target as HTMLElement);
			if (idx >= 0) {
				this._syncRovingTabindex(idx);
			}
		});
	}

	private _syncRovingTabindex(activeIndex: number): void {
		const focusables = this._focusables();
		// moved items and the hidden menu button leave the roving sequence too
		if (this._root) {
			const selector = "button, input, select, textarea, [tabindex]";
			this._root.querySelectorAll<HTMLElement>("." + OVERFLOW_CLASS).forEach(node => {
				const targets = node.matches(selector) ? [node] : Array.from(node.querySelectorAll<HTMLElement>(selector));
				targets.forEach(target => target.setAttribute("tabindex", "-1"));
			});
		}
		focusables.forEach((node, i) => {
			node.setAttribute("tabindex", i === activeIndex ? "0" : "-1");
		});
	}

	private _onRovingKey(e: KeyboardEvent): void {
		if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") {
			return;
		}
		const focusables = this._focusables();
		if (!focusables.length) {
			return;
		}
		const current = focusables.indexOf(document.activeElement as HTMLElement);
		let next = current;
		if (e.key === "ArrowRight") {
			next = current < 0 ? 0 : (current + 1) % focusables.length;
		} else if (e.key === "ArrowLeft") {
			next = current < 0 ? focusables.length - 1 : (current - 1 + focusables.length) % focusables.length;
		} else if (e.key === "Home") {
			next = 0;
		} else if (e.key === "End") {
			next = focusables.length - 1;
		}
		e.preventDefault();
		this._syncRovingTabindex(next);
		try { focusables[next].focus(); } catch { /* ignore */ }
	}

	/** keeps one tab stop when roving tabindex is on and the old one moved into the menu. */
	private _repairRovingTabindex(): void {
		if (!this._rovingHandler) {
			return;
		}
		const focusables = this._focusables();
		const current = focusables.findIndex(node => node.getAttribute("tabindex") === "0");
		this._syncRovingTabindex(current < 0 ? 0 : current);
	}

	// --- helpers -------------------------------------------------------------

	private _rerender(): void {
		if (!this._root) {
			return;
		}
		this._teardownItems();
		this._root.innerHTML = "";
		this._renderItems();
		this._overflow.observeItems();
		this._overflow.layout();
		if (this._rovingHandler) {
			this._syncRovingTabindex(0);
		}
		if (this._disabled) {
			this.setDisabled(true);
		}
	}

	private _teardownItems(): void {
		this._overflow.teardown();
		this._items.forEach(rec => {
			if (rec.teardown) {
				try { rec.teardown(); } catch { /* ignore */ }
			}
			if (rec.menu) {
				rec.menu.destroy();
			}
			if (rec.control && rec.control.destroy) {
				rec.control.destroy();
			}
		});
		this._items = [];
	}

	private _find(id: string | number): IRenderedItem | null {
		for (let i = 0; i < this._items.length; i++) {
			if (this._items[i].def.id === id || String(this._items[i].def.id) === String(id)) {
				return this._items[i];
			}
		}
		return null;
	}

	private _findDef(id: string | number): IToolbarItem | null {
		for (let i = 0; i < this._defs.length; i++) {
			if (this._defs[i].id === id || String(this._defs[i].id) === String(id)) {
				return this._defs[i];
			}
		}
		return null;
	}
}

function stripCallbacks(item: IToolbarItem): IToolbarItem {
	const copy = Object.assign({}, item);
	delete copy.onClick;
	delete copy.onChange;
	return copy;
}
