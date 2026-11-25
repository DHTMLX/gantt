/**
 * Toolbar overflow controller — keeps the toolbar one row on a narrow screen
 * (design docs/internal/toolbar-context-menu/01-toolbar-api.md §7).
 *
 * It owns the "More" / burger menu button, the menu built from the moved items,
 * the popup that shows a moved input field, and the resize observation that
 * re-fits the row. The fit decision itself is the pure fitToolbarItems() in
 * ./toolbar_overflow.ts. The Toolbar widget keeps the items and their activation;
 * this controller reaches them only through IToolbarOverflowHost.
 */
import { el, applyAria, uiLabel } from "./common";
import { Button } from "./button";
import { Menu } from "./menu";
import { IMenuItem, IToolbarBuiltin, IToolbarConfig, IToolbarItem, IUIComponent, IUIOption, ToolbarOverflowMode } from "./types";
import { fitToolbarItems, IToolbarFitEntry, toolbarMenuForm } from "./toolbar_overflow";
import type { IUiKitRuntime } from "../ui_kit";
import type { Popup } from "../popup/popup";

/** an item that is in the overflow menu, not in the row */
export const OVERFLOW_CLASS = "dhx_ui_toolbar_item_overflow";
const MORE_ICON = "dhx_gantt_icon dhx_gantt_icon_dots_vertical";
const MENU_ICON = "dhx_ui_toolbar_burger_icon";

export interface IRenderedField {
	root: HTMLElement;
	input: HTMLElement;
}

/** one rendered toolbar item, as the Toolbar widget keeps it */
export interface IRenderedItem {
	def: IToolbarItem;                 // resolved descriptor (built-in merged + expanded)
	builtin?: IToolbarBuiltin;
	control?: IUIComponent | null;
	field?: IRenderedField;
	menu?: Menu | null;
	node: HTMLElement | null;          // the item's element inside the toolbar row
	teardown?: (() => void) | null;    // built-in bind() teardown
	state: Record<string, any>;        // per-item mutable bag for built-ins
}

/** what the controller needs from the Toolbar widget */
export interface IToolbarOverflowHost {
	kit: IUiKitRuntime;
	config: IToolbarConfig;
	root(): HTMLElement | null;
	items(): IRenderedItem[];
	disabled(): boolean;
	destroyed(): boolean;
	activateClick(rec: IRenderedItem, e: Event | null): void;
	activateChange(rec: IRenderedItem, value: any): void;
	activateSelect(rec: IRenderedItem, leafId: string | number | undefined, leafItem: any): void;
	/** the set of items in the row changed (the roving tab stop may have moved) */
	rowChanged(): void;
}

interface IFieldPopup {
	rec: IRenderedItem;
	popup: Popup;
	placeholder: Comment;
	removeOutsideHandler: () => void;
}

function isSeparator(comp?: string): boolean {
	return comp === "separator";
}
function isSpacer(comp?: string): boolean {
	return comp === "spacer";
}

export class ToolbarOverflowController {
	private _host: IToolbarOverflowHost;
	private _button: Button | null = null;
	private _menu: Menu | null = null;
	private _actions = new Map<IMenuItem, (item: IMenuItem) => void>();
	private _inMenu: boolean[] = [];
	private _collapsed = false;
	private _fieldPopup: IFieldPopup | null = null;
	private _resizeObserver: ResizeObserver | null = null;
	private _windowResize: (() => void) | null = null;
	private _layoutFrame: any = null;

	constructor(host: IToolbarOverflowHost) {
		this._host = host;
	}

	public mode(): ToolbarOverflowMode {
		const mode = this._host.config.overflow;
		return mode === "collapse" || mode === "wrap" ? mode : "menu";
	}

	/** the menu button's node; hidden (OVERFLOW_CLASS) while the menu has no items */
	public buttonNode(): HTMLElement | null {
		return this._button ? this._button.getRootNode() : null;
	}

	public setDisabled(flag: boolean): void {
		if (this._button) {
			this._button.setDisabled(flag);
		}
	}

	/** the "More" / burger button: always the last child of the row, shown only when the menu has items. */
	public renderButton(root: HTMLElement): void {
		const kit = this._host.kit;
		const label = this._label();
		const button = new Button(kit, {
			icon: this._collapsed ? MENU_ICON : MORE_ICON,
			variant: "outline",
			ariaLabel: label,
			onClick: () => this._toggleMenu()
		});
		button.mount(root);
		const node = button.getRootNode() as HTMLElement;
		node.classList.add("dhx_ui_toolbar_overflow_button", OVERFLOW_CLASS);
		applyAria(kit.context, node, { "aria-haspopup": "menu", "aria-expanded": "false" });
		this._button = button;

		const menu = new Menu(kit, {
			items: [],
			label,
			ignoreOutsideClick: [node],
			onSelect: (_id, item) => this._runAction(item)
		});
		menu.attachEvent("onClose", () => {
			this._setExpanded(false);
			// Escape (or a click on nothing focusable) removed the focused list
			const active = node.ownerDocument.activeElement;
			if (!active || active === node.ownerDocument.body) {
				this._focusButton();
			}
		});
		this._menu = menu;
		this._paintButton(node);
	}

	/** closes the menu and the field popup and drops the button; the items are rendered again after it. */
	public teardown(): void {
		this._closeFieldPopup(false);
		if (this._menu) {
			this._menu.destroy();
			this._menu = null;
		}
		if (this._button) {
			this._button.destroy();
			this._button = null;
		}
		this._actions.clear();
		this._inMenu = [];
	}

	/** starts the resize observation (once, after mount). */
	public install(): void {
		const root = this._host.root();
		if (!root) {
			return;
		}
		const view = root.ownerDocument.defaultView || window;
		const Observer = (view as any).ResizeObserver;
		if (typeof Observer === "function") {
			this._resizeObserver = new Observer(() => this._scheduleLayout());
			this.observeItems();
		} else {
			this._windowResize = () => this._scheduleLayout();
			view.addEventListener("resize", this._windowResize);
		}
	}

	/** the row and every item: a resize of the row, a font load or a label change re-fits the row. */
	public observeItems(): void {
		const observer = this._resizeObserver;
		const root = this._host.root();
		if (!observer || !root) {
			return;
		}
		observer.disconnect();
		observer.observe(root);
		this._host.items().forEach(rec => {
			if (rec.node) {
				observer.observe(rec.node);
			}
		});
	}

	public destroy(): void {
		this.teardown();
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
			this._resizeObserver = null;
		}
		const root = this._host.root();
		const view = (root && root.ownerDocument.defaultView) || window;
		if (this._windowResize) {
			view.removeEventListener("resize", this._windowResize);
			this._windowResize = null;
		}
		if (this._layoutFrame !== null) {
			(view.cancelAnimationFrame || clearTimeout)(this._layoutFrame);
			this._layoutFrame = null;
		}
	}

	/**
	 * Measures the items and decides which of them stay in the row.
	 * All items are shown for the measurement and hidden again in the same
	 * task, so the browser paints only the result.
	 */
	public layout(): void {
		const root = this._host.root();
		const button = this.buttonNode();
		if (!root || !button || this._host.destroyed() || !root.isConnected || this._fieldPopup) {
			return;
		}
		const view = root.ownerDocument.defaultView || window;
		const style = view.getComputedStyle(root);
		const available = root.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
		if (available <= 0) {
			return;           // hidden toolbar, or a zero-width host (only the padding is left): keep the last layout
		}
		const gap = parseFloat(style.columnGap) || 0;

		const outerWidth = (node: HTMLElement): number => {
			const box = node.getBoundingClientRect().width;
			const nodeStyle = view.getComputedStyle(node);
			return box + (parseFloat(nodeStyle.marginLeft) || 0) + (parseFloat(nodeStyle.marginRight) || 0);
		};
		const items = this._host.items();
		items.forEach(rec => {
			if (rec.node) {
				rec.node.classList.remove(OVERFLOW_CLASS);
			}
		});
		button.classList.remove(OVERFLOW_CLASS);
		const menuWidth = outerWidth(button);
		const entries: IToolbarFitEntry[] = items.map(rec => {
			const comp = rec.def.comp;
			const hidden = !rec.node || rec.node.style.display === "none";
			return {
				kind: isSeparator(comp) ? "separator" : (isSpacer(comp) ? "spacer" : "item"),
				width: hidden || isSpacer(comp) ? 0 : outerWidth(rec.node as HTMLElement),
				overflow: rec.def.overflow,
				hidden,
				label: comp === "label"
			};
		});

		const fit = fitToolbarItems({
			entries, available, gap, menuWidth,
			mode: this.mode(),
			collapseWidth: this._host.config.collapseWidth
		});
		items.forEach((rec, i) => {
			if (rec.node && !fit.inRow[i]) {
				rec.node.classList.add(OVERFLOW_CLASS);
			}
		});
		button.classList.toggle(OVERFLOW_CLASS, !fit.menu);
		const changed = fit.inMenu.some((flag, i) => flag !== !!this._inMenu[i]) || fit.collapsed !== this._collapsed;
		this._inMenu = fit.inMenu;
		if (fit.collapsed !== this._collapsed) {
			this._collapsed = fit.collapsed;
			this._paintButton(button);
		}
		if (changed) {
			if (this._menu && this._menu.isOpen()) {
				this._menu.close();
				this._setExpanded(false);
			}
			this._host.rowChanged();
		}
	}

	// --- button and menu -----------------------------------------------------

	private _label(): string {
		return uiLabel(this._host.kit.context, this._collapsed ? "ui_toolbar_menu" : "ui_toolbar_more");
	}

	/** the button and its menu share one accessible name: "More", or "Menu" when collapsed */
	private _paintButton(button: HTMLElement): void {
		const label = this._label();
		const icon = button.querySelector(".dhx_ui_button_icon");
		if (icon) {
			icon.className = "dhx_ui_button_icon " + (this._collapsed ? MENU_ICON : MORE_ICON);
		}
		button.classList.toggle("dhx_ui_toolbar_overflow_collapsed", this._collapsed);
		button.setAttribute("title", label);
		applyAria(this._host.kit.context, button, { "aria-label": label });
		if (this._menu) {
			this._menu.setLabel(label);
		}
	}

	private _setExpanded(flag: boolean): void {
		const node = this.buttonNode();
		if (node) {
			applyAria(this._host.kit.context, node, { "aria-expanded": flag ? "true" : "false" });
		}
	}

	private _focusButton(): void {
		const node = this.buttonNode();
		if (node && node.isConnected) {
			try { node.focus(); } catch { /* ignore */ }
		}
	}

	private _toggleMenu(): void {
		const menu = this._menu;
		const node = this.buttonNode();
		if (!menu || !node) {
			return;
		}
		if (menu.isOpen()) {
			menu.close();
			this._setExpanded(false);
			return;
		}
		this._closeFieldPopup(false);
		menu.setItems(this._buildMenu());
		menu.openFor(node);
		this._setExpanded(menu.isOpen());
	}

	private _runAction(item: IMenuItem): void {
		const run = this._actions.get(item);
		if (!run) {
			return;
		}
		const toggling = item.checked !== undefined && !item.radio;
		if (!toggling) {
			// the menu is closed already: give the focus back before the action,
			// so an action that opens a dialog keeps the focus it moves
			this._setExpanded(false);
			this._focusButton();
		}
		run(item);
	}

	private _itemLabel(rec: IRenderedItem, preferTooltip: boolean): string {
		const def = rec.def;
		const first = preferTooltip ? def.tooltip : def.label;
		const second = preferTooltip ? def.label : def.tooltip;
		const key = first || second || def.ariaLabel || def.placeholder;
		return key ? uiLabel(this._host.kit.context, key) : String(def.id === undefined ? "" : def.id);
	}

	private _isItemDisabled(rec: IRenderedItem): boolean {
		if (this._host.disabled()) {
			return true;
		}
		const root = rec.control ? rec.control.getRootNode() : null;
		return !!root && (root.classList.contains("dhx_ui_disabled") || !!(root as HTMLButtonElement).disabled);
	}

	private _itemOptions(rec: IRenderedItem): IUIOption[] {
		const control: any = rec.control;
		if (control && typeof control.getOptions === "function") {
			return control.getOptions() || [];
		}
		return (rec.def.options || []) as IUIOption[];
	}

	/** builds the overflow menu from the current state of the moved items. */
	private _buildMenu(): IMenuItem[] {
		this._actions.clear();
		const result: IMenuItem[] = [];
		let separatorPending = false;
		this._host.items().forEach((rec, index) => {
			if (isSeparator(rec.def.comp)) {
				separatorPending = result.length > 0;
				return;
			}
			if (!this._inMenu[index]) {
				return;
			}
			const entry = this._menuEntry(rec);
			if (!entry) {
				return;
			}
			if (separatorPending) {
				result.push({ separator: true });
				separatorPending = false;
			}
			result.push(entry);
		});
		return result;
	}

	private _menuEntry(rec: IRenderedItem): IMenuItem | null {
		const host = this._host;
		const def = rec.def;
		const control: any = rec.control;
		const disabled = this._isItemDisabled(rec);
		const options = def.comp === "combo" ? this._itemOptions(rec) : [];
		const form = toolbarMenuForm(def.comp, options.length > 0);
		switch (form) {
			case "action": {
				const entry: IMenuItem = { id: def.id, label: this._itemLabel(rec, false), icon: def.icon, disabled };
				this._actions.set(entry, () => host.activateClick(rec, null));
				return entry;
			}
			case "check": {
				const entry: IMenuItem = { id: def.id, label: this._itemLabel(rec, false), checked: !!(control && control.getValue()), disabled };
				this._actions.set(entry, (item) => {
					const value = !!item.checked;
					if (control) {
						control.setValue(value);
					}
					host.activateChange(rec, value);
					// a cancelled change reverted the control; the tick follows it
					item.checked = control ? !!control.getValue() : value;
				});
				return entry;
			}
			case "submenu": {
				const items = def.items || [];
				this._registerLeaves(rec, items);
				return { id: def.id, label: this._itemLabel(rec, true), icon: def.icon, disabled: disabled || !items.length, items };
			}
			case "choice": {
				const list = def.comp === "segmented" ? (def.options || []) as IUIOption[] : options;
				const current = control ? control.getValue() : def.value;
				const items: IMenuItem[] = list.map(option => {
					// loose equality on purpose, as in RadioGroup.setValue
					const choice: IMenuItem = { id: option.key, label: option.label, radio: true, checked: option.key == current };
					this._actions.set(choice, () => {
						if (control) {
							control.setValue(option.key);
						}
						host.activateChange(rec, option.key);
					});
					return choice;
				});
				return { id: def.id, label: this._itemLabel(rec, true), disabled: disabled || !items.length, items };
			}
			case "field": {
				const entry: IMenuItem = { id: def.id, label: this._itemLabel(rec, false), icon: def.icon, disabled };
				this._actions.set(entry, () => this._openFieldPopup(rec));
				return entry;
			}
			default:
				return null;
		}
	}

	private _registerLeaves(rec: IRenderedItem, items: IMenuItem[]): void {
		items.forEach(leaf => {
			if (leaf.separator) {
				return;
			}
			if (leaf.items && leaf.items.length) {
				this._registerLeaves(rec, leaf.items);
				return;
			}
			this._actions.set(leaf, () => this._host.activateSelect(rec, leaf.id, leaf));
		});
	}

	// --- field popup ---------------------------------------------------------

	/** shows the real field of a moved text / stepper / datepicker item in a popup under the menu button. */
	private _openFieldPopup(rec: IRenderedItem): void {
		this._closeFieldPopup(false);
		const anchor = this.buttonNode();
		const node = rec.node;
		if (!anchor || !node || !node.parentNode) {
			return;
		}
		const doc = node.ownerDocument;
		const placeholder = doc.createComment("toolbar item");
		node.parentNode.insertBefore(placeholder, node);
		node.classList.remove(OVERFLOW_CLASS);
		const panel = el("div", "dhx_ui_toolbar dhx_ui_toolbar_overflow_panel");
		panel.appendChild(node);

		const popup = this._host.kit.createPopup({
			className: "dhx_ui_toolbar_overflow_popup",
			role: "dialog",
			label: this._itemLabel(rec, false),
			position: { type: "anchor", target: anchor, side: "bottom", flip: true, lockAxis: true },
			dismiss: { escape: true, outsideClick: false }
		});
		popup.attachEvent("onDismiss", () => this._closeFieldPopup(true));

		// own outside-click check: a calendar or dropdown opened by the field is
		// a separate popup, and a click in it must not close this one
		const onOutside = (e: Event) => {
			const target = e.target as HTMLElement | null;
			const popupNode = popup.getNode();
			if (!target || (popupNode && popupNode.contains(target)) || anchor.contains(target) ||
				(target.closest && target.closest(".dhx_ui_popup"))) {
				return;
			}
			this._closeFieldPopup(false);
		};
		doc.addEventListener("mousedown", onOutside, true);
		doc.addEventListener("touchstart", onOutside, true);
		this._fieldPopup = {
			rec, popup, placeholder,
			removeOutsideHandler: () => {
				doc.removeEventListener("mousedown", onOutside, true);
				doc.removeEventListener("touchstart", onOutside, true);
			}
		};
		popup.show(panel);
		const input = rec.field ? rec.field.input : null;
		if (input) {
			try { input.focus(); } catch { /* ignore */ }
		}
	}

	private _closeFieldPopup(restoreFocus: boolean): void {
		const state = this._fieldPopup;
		if (!state) {
			return;
		}
		this._fieldPopup = null;
		state.removeOutsideHandler();
		const node = state.rec.node;
		if (node && state.placeholder.parentNode) {
			state.placeholder.parentNode.replaceChild(node, state.placeholder);
		} else if (state.placeholder.parentNode) {
			state.placeholder.parentNode.removeChild(state.placeholder);
		}
		state.popup.destroy();
		this.layout();
		if (restoreFocus) {
			this._focusButton();
		}
	}

	// --- scheduling ----------------------------------------------------------

	private _scheduleLayout(): void {
		const root = this._host.root();
		if (this._layoutFrame !== null || this._host.destroyed() || !root) {
			return;
		}
		const view = root.ownerDocument.defaultView || window;
		const raf = view.requestAnimationFrame ? view.requestAnimationFrame.bind(view) : (fn: () => void) => setTimeout(fn, 16);
		this._layoutFrame = raf(() => {
			this._layoutFrame = null;
			this.layout();
		});
	}
}
