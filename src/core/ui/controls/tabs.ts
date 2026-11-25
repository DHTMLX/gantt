import { BaseControl } from "./base_component";
import { ITabsConfig, IUIOption } from "./types";
import { applyAria, el, controlUid } from "./common";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Tabs — tablist header + one panel container per tab (design D4:
 * required by the modernized lightbox layout). IUIControl<TabId>:
 * value = active tab key. Arrow-key navigation per the tabs aria pattern.
 * Panel content is owned by the caller via getPanel(key).
 */
export class Tabs extends BaseControl<string | number> {
	private _config: ITabsConfig;
	private _active: string | number;
	private _uid: string;
	private _tabButtons: Record<string, HTMLElement> = {};
	private _panels: Record<string, HTMLElement> = {};

	constructor(kit: IUiKitRuntime, config: ITabsConfig) {
		super(kit);
		this._config = config || { tabs: [] };
		const tabs = this._config.tabs || [];
		this._active = this._config.active !== undefined ? this._config.active : (tabs.length ? tabs[0].key : "");
		this._uid = controlUid(this.$kit.context, "tabs");
	}

	public getValue(): string | number {
		return this._active;
	}

	public setValue(value: string | number): void {
		if (this._findTab(value)) {
			this._active = value;
			this._syncActive();
		}
	}

	/** Container element for a tab's content; caller renders into it. */
	public getPanel(key: string | number): HTMLElement | null {
		return this._panels[String(key)] || null;
	}

	protected _render(): HTMLElement {
		const root = el("div", "dhx_ui_control dhx_ui_tabs");
		const header = el("div", "dhx_ui_tabs_header");
		applyAria(this.$kit.context, header, { role: "tablist" });
		this._listen(header, "wheel", (e: WheelEvent) => this._onHeaderWheel(e, header));
		const body = el("div", "dhx_ui_tabs_body");

		(this._config.tabs || []).forEach((tab: IUIOption) => {
			const keyStr = String(tab.key);
			const tabId = this._uid + "_tab_" + keyStr;
			const panelId = this._uid + "_panel_" + keyStr;

			const button = el("button", "dhx_ui_tabs_tab", { type: "button", id: tabId });
			button.textContent = tab.label;
			// a hidden copy of the label at the active font weight keeps the tab width (ui_core.less)
			button.setAttribute("data-label", tab.label);
			applyAria(this.$kit.context, button, { role: "tab", "aria-controls": panelId });
			this._listen(button, "click", () => this._activate(tab.key, true));
			this._listen(button, "keydown", (e: KeyboardEvent) => this._onHeaderKeyDown(e, tab.key));
			header.appendChild(button);
			this._tabButtons[keyStr] = button;

			const panel = el("div", "dhx_ui_tabs_panel", { id: panelId });
			applyAria(this.$kit.context, panel, { role: "tabpanel", "aria-labelledby": tabId });
			body.appendChild(panel);
			this._panels[keyStr] = panel;
		});

		root.appendChild(header);
		root.appendChild(body);
		this._onDestroy(() => {
			this._tabButtons = {};
			this._panels = {};
		});

		// defer sync until nodes exist
		this._syncActiveOn(root);
		return root;
	}

	protected _getFocusNode(): HTMLElement | null {
		return this._tabButtons[String(this._active)] || this._root;
	}

	private _activate(key: string | number, focus: boolean): void {
		const changed = this._active !== key;
		this._active = key;
		this._syncActive();
		if (focus) {
			this.focus();
		}
		if (changed) {
			this._emitChange();
		}
	}

	private _onHeaderKeyDown(e: KeyboardEvent, currentKey: string | number): void {
		const tabs = this._config.tabs || [];
		const index = tabs.map(t => t.key).indexOf(currentKey as any);
		let targetIndex = -1;
		if (e.key === "ArrowRight") {
			targetIndex = (index + 1) % tabs.length;
		} else if (e.key === "ArrowLeft") {
			targetIndex = (index - 1 + tabs.length) % tabs.length;
		} else if (e.key === "Home") {
			targetIndex = 0;
		} else if (e.key === "End") {
			targetIndex = tabs.length - 1;
		}
		if (targetIndex !== -1) {
			e.preventDefault();
			this._activate(tabs[targetIndex].key, true);
		}
	}

	/** a vertical mouse wheel scrolls a header whose tabs do not fit */
	private _onHeaderWheel(e: WheelEvent, header: HTMLElement): void {
		// a horizontal wheel or trackpad already scrolls the header; Ctrl+wheel zooms the page
		if (e.ctrlKey || Math.abs(e.deltaX) >= Math.abs(e.deltaY) || header.scrollWidth <= header.clientWidth) {
			return;
		}
		let delta = e.deltaY;
		if (e.deltaMode === 1) { // lines
			delta *= 16;
		} else if (e.deltaMode === 2) { // pages
			delta *= header.clientWidth;
		}
		// scrollLeft runs from 0 to a negative value in a right-to-left header
		const rtl = getComputedStyle(header).direction === "rtl";
		const before = header.scrollLeft;
		header.scrollLeft = before + (rtl ? -delta : delta);
		// at the end of the header the wheel goes on to scroll the page
		if (header.scrollLeft !== before) {
			e.preventDefault();
		}
	}

	private _findTab(key: string | number): IUIOption | undefined {
		return (this._config.tabs || []).filter(t => t.key === key)[0];
	}

	private _syncActive(): void {
		if (this._root) {
			this._syncActiveOn(this._root);
		}
	}

	private _syncActiveOn(root: HTMLElement): void {
		const activeKey = String(this._active);
		for (const key in this._tabButtons) {
			const isActive = key === activeKey;
			this._tabButtons[key].classList.toggle("dhx_ui_tabs_tab_active", isActive);
			applyAria(this.$kit.context, this._tabButtons[key], { "aria-selected": isActive ? "true" : "false" });
			this._tabButtons[key].setAttribute("tabindex", isActive ? "0" : "-1");
			this._panels[key].style.display = isActive ? "" : "none";
		}
		this._revealActive();
	}

	/**
	 * Scrolls the header to show the active tab, clear of the header's scroll-padding.
	 * Screen coordinates give the same result in left-to-right and right-to-left headers.
	 */
	private _revealActive(): void {
		const button = this._tabButtons[String(this._active)];
		const header = button && button.parentNode as HTMLElement;
		if (!header || header.scrollWidth <= header.clientWidth) {
			return;
		}
		const style = getComputedStyle(header);
		const box = header.getBoundingClientRect();
		const tab = button.getBoundingClientRect();
		const left = box.left + header.clientLeft + (parseFloat(style.scrollPaddingLeft) || 0);
		const right = box.left + header.clientLeft + header.clientWidth - (parseFloat(style.scrollPaddingRight) || 0);
		if (tab.left < left) {
			header.scrollLeft += tab.left - left;
		} else if (tab.right > right) {
			header.scrollLeft += tab.right - right;
		}
	}
}
