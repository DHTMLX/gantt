import { IMenuConfig, IMenuItem } from "./types";
import { applyAria, el, controlUid } from "./common";
import { Popup } from "../popup/popup";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Returns the next keyboard-navigable item index, skipping separators and
 * disabled items, wrapping around. dir = +1 / -1; current = -1 for "none".
 * Pure — exported for unit tests.
 */
export function nextNavigableIndex(
	items: IMenuItem[], current: number, dir: number, isDisabled = (item: IMenuItem) => !!item.disabled
): number {
	if (!items || !items.length) {
		return -1;
	}
	const count = items.length;
	let index = current;
	for (let step = 0; step < count; step++) {
		index = (index + dir + count) % count;
		const item = items[index];
		if (!item.separator && !isDisabled(item)) {
			return index;
		}
	}
	return -1;
}

const SUBMENU_HOVER_DELAY = 200;
const CHECK_ICON = "dhx_gantt_icon dhx_gantt_icon_check";
const SUBMENU_ICON = "dhx_gantt_icon dhx_gantt_icon_chevron_right";

/** an item is checkable once it carries a `checked` state (even a false one) */
function isCheckable(item: IMenuItem): boolean {
	return item.checked !== undefined;
}

function checkIconClass(item: IMenuItem): string {
	return item.checked ? CHECK_ICON : "";
}

interface IMenuLevel {
	popup: Popup;
	items: IMenuItem[];
	listNode: HTMLElement;
	activeIndex: number;
	parentLevel: number;
	iconSlot: boolean;
}

/**
 * Menu — a multi-level dropdown/context menu built on the popup primitive
 * (menu ARIA pattern: role=menu/menuitem, full keyboard support).
 *
 * Items are dumb serializable descriptors (design D7):
 *   { id, label, icon?, disabled?, separator?, items? }
 * Activation is delivered through config.onSelect(id, item) and the
 * "onSelect" event — never through function-valued item properties.
 *
 * open modes: openFor(anchorElement) — dropdown below a toolbar button;
 *             openAt(x, y)           — context-menu at cursor coordinates.
 * Submenus open to the right of their parent item (viewport-aware flip),
 * on hover (delayed), click, or ArrowRight; ArrowLeft closes one level.
 */
export class Menu {
	// eventable API
	public attachEvent!: (name: string, handler: (...args: any[]) => any, settings?: any) => string | number;
	public callEvent!: (name: string, args: any[]) => boolean;
	public detachEvent!: (id: string | number) => void;
	public detachAllEvents!: () => void;

	private $kit: IUiKitRuntime;
	private _config: IMenuConfig;
	private _levels: IMenuLevel[] = [];
	private _uid: string;
	private _hoverTimer: any = null;
	private _destroyed: boolean = false;
	private _returnFocus: HTMLElement | null = null;

	constructor(kit: IUiKitRuntime, config?: IMenuConfig) {
		this.$kit = kit;
		this._config = config || {};
		this._uid = controlUid(kit.context, "menu");
		kit.context.eventable(this);
		if (kit.registerComponent) {
			kit.registerComponent(this);
		}
	}

	public setItems(items: IMenuItem[]): void {
		this._config.items = items || [];
	}

	/** accessible name of the menu; an open menu keeps its name until it opens again */
	public setLabel(label: string): void {
		this._config.label = label;
	}

	public isOpen(): boolean {
		return this._levels.length > 0;
	}

	public openFor(anchor: HTMLElement): void {
		this.close();
		this._rememberFocus();
		this._openLevel(this._config.items || [], {
			type: "anchor", target: anchor, side: "bottom", flip: true, lockAxis: true, matchTargetWidth: false
		}, -1);
	}

	public openAt(x: number, y: number): void {
		this.close();
		this._rememberFocus();
		this._openLevel(this._config.items || [], { type: "point", x, y }, -1);
	}

	public close(): void {
		this._clearHoverTimer();
		// destroy from deepest level up
		for (let i = this._levels.length - 1; i >= 0; i--) {
			this._levels[i].popup.destroy();
		}
		this._levels = [];
	}

	public destroy(): void {
		if (this._destroyed) {
			return;
		}
		this.close();
		this._destroyed = true;
		this.detachAllEvents();
		if (this.$kit.unregisterComponent) {
			this.$kit.unregisterComponent(this);
		}
	}

	// --- levels ----------------------------------------------------------

	private _openLevel(items: IMenuItem[], position: any, parentLevel: number): void {
		if (this._destroyed || !items.length) {
			return;
		}
		const levelIndex = this._levels.length;
		const popupConfig = {
			className: "dhx_ui_menu",
			role: "none" as const,
			position,
			// root level owns dismissal for the whole tree; sublevels are
			// closed programmatically so they don't race the root's handlers
			dismiss: levelIndex === 0 ? { escape: true, outsideClick: true } : { escape: false, outsideClick: false },
			ignoreOutsideClick: this._config.ignoreOutsideClick
		};
		const popup: Popup = this.$kit.createPopup(popupConfig);

		const listNode = el("div", "dhx_ui_menu_list", { tabindex: "-1", id: this._uid + "_level_" + levelIndex });
		applyAria(this.$kit.context, listNode, { role: "menu", "aria-label": this._config.label || "" });

		const level: IMenuLevel = {
			popup, items: items.slice(), listNode, activeIndex: -1, parentLevel,
			iconSlot: items.some((one) => !!one.icon || isCheckable(one))
		};
		this._levels.push(level);

		level.items.forEach((item, index) => {
			listNode.appendChild(this._renderItem(level, item, index));
		});

		listNode.addEventListener("keydown", (e: KeyboardEvent) => this._onKeyDown(e));
		// sublevel popups are not DOM children of the root popup — swallow
		// mousedown so the root's outside-click dismissal never sees clicks
		// inside ANY level (and focus stays on the list for keyboard nav)
		listNode.addEventListener("mousedown", (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		});

		if (levelIndex === 0) {
			popup.attachEvent("onDismiss", (reason?: string) => {
				// root dismissed by ESC/outside-click → close the WHOLE tree.
				// Sublevels are separate popup instances (not DOM children of
				// the root), so they must be destroyed explicitly — clearing
				// the array alone leaves them visible on screen.
				this.close();
				if (reason === "escape") {
					this._restoreFocus();
				}
				this._returnFocus = null;
				this.callEvent("onClose", []);
			});
		}

		popup.show(listNode);
		listNode.focus();
	}

	private _rememberFocus(): void {
		this._returnFocus = this.$kit.context.dom.getActiveElement() as HTMLElement | null;
	}

	private _restoreFocus(): void {
		const target = this._returnFocus;
		this._returnFocus = null;
		if (target && target.focus && target.isConnected) {
			try {
				target.focus();
			} catch {
				// silent, the opener may have become unfocusable
			}
		}
	}

	private _renderItem(level: IMenuLevel, item: IMenuItem, index: number): HTMLElement {
		if (item.separator) {
			const separator = el("div", "dhx_ui_menu_separator");
			applyAria(this.$kit.context, separator, { role: "separator" });
			return separator;
		}

		const node = el("div", "dhx_ui_menu_item", {
			"data-menu-index": String(index),
			id: this._uid + "_item_" + this._levels.indexOf(level) + "_" + index
		});
		const checkable = isCheckable(item);
		applyAria(this.$kit.context, node, {
			role: checkable ? (item.radio ? "menuitemradio" : "menuitemcheckbox") : "menuitem"
		});
		this._paintDisabledState(item, node);

		if (level.iconSlot) {
			const icon = el("span", "dhx_ui_menu_item_icon " + (checkable ? checkIconClass(item) : (item.icon || "")));
			applyAria(this.$kit.context, icon, { "aria-hidden": "true" });
			node.appendChild(icon);
		}
		if (checkable) {
			applyAria(this.$kit.context, node, { "aria-checked": item.checked ? "true" : "false" });
		}
		const label = el("span", "dhx_ui_menu_item_label");
		label.textContent = item.label || "";
		node.appendChild(label);

		const hasSubmenu = !!(item.items && item.items.length);
		if (hasSubmenu) {
			const arrow = el("span", "dhx_ui_menu_item_arrow " + SUBMENU_ICON);
			applyAria(this.$kit.context, arrow, { "aria-hidden": "true" });
			node.appendChild(arrow);
			applyAria(this.$kit.context, node, { "aria-haspopup": "menu", "aria-expanded": "false" });
		}

		// plain listeners: item nodes die with their level popup
		node.addEventListener("mouseenter", () => {
			const levelIndex = this._levels.indexOf(level);
			if (levelIndex === -1) {
				return;
			}
			this._setActive(level, index);
			this._clearHoverTimer();
			if (this._isItemDisabled(item)) {
				return;
			}
			this._hoverTimer = setTimeout(() => {
				this._closeDeeperThan(levelIndex);
				if (hasSubmenu) {
					this._openSubmenu(level, item, node);
				}
			}, SUBMENU_HOVER_DELAY);
		});

		node.addEventListener("mousedown", (e: Event) => {
			e.preventDefault();
			e.stopPropagation();
		});

		node.addEventListener("click", (e: Event) => {
			e.stopPropagation();
			if (this._isItemDisabled(item)) {
				return;
			}
			if (hasSubmenu) {
				const levelIndex = this._levels.indexOf(level);
				this._closeDeeperThan(levelIndex);
				this._openSubmenu(level, item, node);
			} else {
				this._select(item, node);
			}
		});

		return node;
	}

	private _openSubmenu(parentLevel: IMenuLevel, item: IMenuItem, itemNode: HTMLElement): void {
		applyAria(this.$kit.context, itemNode, { "aria-expanded": "true" });
		this._openLevel(item.items || [], {
			type: "anchor", target: itemNode, side: "right", flip: true, offset: -4
		}, this._levels.indexOf(parentLevel));
	}

	private _closeDeeperThan(levelIndex: number): void {
		for (let i = this._levels.length - 1; i > levelIndex; i--) {
			const level = this._levels[i];
			level.popup.destroy();
			this._levels.pop();
		}
		const current = this._levels[levelIndex];
		if (current) {
			// collapse aria-expanded on items whose submenu just closed
			const expanded = current.listNode.querySelectorAll("[aria-expanded='true']");
			for (let i = 0; i < expanded.length; i++) {
				expanded[i].setAttribute("aria-expanded", "false");
			}
		}
	}

	private _select(item: IMenuItem, node?: HTMLElement | null): void {
		const toggling = isCheckable(item) && !item.radio;
		if (toggling) {
			item.checked = !item.checked;
			this._paintCheckState(item, node);
		} else {
			this.close();
			this._restoreFocus();
		}
		if (this._config.onSelect) {
			this._config.onSelect(item.id, item);
		}
		this.callEvent("onSelect", [item.id, item]);
		
		if (toggling) {
			this._paintCheckState(item, node);
			for (const level of this._levels) {
				level.items.forEach((entry, index) => {
					if (!entry.separator) {
						this._paintDisabledState(entry, level.listNode.children[index] as HTMLElement);
					}
				});
			}
		}
	}

	private _isItemDisabled = (item: IMenuItem): boolean => {
		return this._config.resolveItemDisabled?.(item) ?? !!item.disabled;
	};

	private _paintDisabledState(item: IMenuItem, node: HTMLElement): void {
		const disabled = this._isItemDisabled(item);
		node.classList.toggle("dhx_ui_menu_item_disabled", disabled);
		if (disabled) {
			applyAria(this.$kit.context, node, { "aria-disabled": "true" });
		} else {
			node.removeAttribute("aria-disabled");
		}
	}

	private _paintCheckState(item: IMenuItem, node?: HTMLElement | null): void {
		if (!node) {
			return;
		}
		applyAria(this.$kit.context, node, { "aria-checked": item.checked ? "true" : "false" });
		const icon = node.querySelector(".dhx_ui_menu_item_icon");
		if (icon) {
			icon.className = "dhx_ui_menu_item_icon " + checkIconClass(item);
		}
	}

	// --- keyboard ---------------------------------------------------------

	private _onKeyDown(e: KeyboardEvent): void {
		const level = this._levels[this._levels.length - 1];
		if (!level) {
			return;
		}
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				this._setActive(level, nextNavigableIndex(level.items, level.activeIndex, 1, this._isItemDisabled));
				break;
			case "ArrowUp":
				e.preventDefault();
				this._setActive(level, nextNavigableIndex(level.items, level.activeIndex, -1, this._isItemDisabled));
				break;
			case "ArrowRight": {
				e.preventDefault();
				const item = level.items[level.activeIndex];
				if (item && item.items && item.items.length && !this._isItemDisabled(item)) {
					const node = this._itemNode(level, level.activeIndex);
					if (node) {
						this._openSubmenu(level, item, node);
						const child = this._levels[this._levels.length - 1];
						this._setActive(child, nextNavigableIndex(child.items, -1, 1, this._isItemDisabled));
					}
				}
				break;
			}
			case "ArrowLeft":
				e.preventDefault();
				if (this._levels.length > 1) {
					this._closeDeeperThan(this._levels.length - 2);
					const parent = this._levels[this._levels.length - 1];
					parent.listNode.focus();
				}
				break;
			case "Home":
				e.preventDefault();
				this._setActive(level, nextNavigableIndex(level.items, -1, 1, this._isItemDisabled));
				break;
			case "End":
				e.preventDefault();
				this._setActive(level, nextNavigableIndex(level.items, 0, -1, this._isItemDisabled));
				break;
			case "Enter":
			case " ": {
				e.preventDefault();
				const active = level.items[level.activeIndex];
				if (!active || this._isItemDisabled(active)) {
					return;
				}
				if (active.items && active.items.length) {
					const node = this._itemNode(level, level.activeIndex);
					if (node) {
						this._openSubmenu(level, active, node);
						const child = this._levels[this._levels.length - 1];
						this._setActive(child, nextNavigableIndex(child.items, -1, 1, this._isItemDisabled));
					}
				} else {
					this._select(active, this._itemNode(level, level.activeIndex));
				}
				break;
			}
			case "Escape":
				// levels > 0: close one level; the root popup's own ESC handler
				// dismisses the whole menu when only the root remains
				if (this._levels.length > 1) {
					e.preventDefault();
					e.stopPropagation();
					this._closeDeeperThan(this._levels.length - 2);
					this._levels[this._levels.length - 1].listNode.focus();
				}
				break;
		}
	}

	private _itemNode(level: IMenuLevel, index: number): HTMLElement | null {
		return level.listNode.querySelector("[data-menu-index='" + index + "']");
	}

	private _setActive(level: IMenuLevel, index: number): void {
		level.activeIndex = index;
		const nodes = level.listNode.querySelectorAll(".dhx_ui_menu_item");
		for (let i = 0; i < nodes.length; i++) {
			const nodeIndex = parseInt(nodes[i].getAttribute("data-menu-index") || "", 10);
			nodes[i].classList.toggle("dhx_ui_menu_item_active", nodeIndex === index);
		}
		const active = this._itemNode(level, index);
		if (active) {
			applyAria(this.$kit.context, level.listNode, { "aria-activedescendant": active.id || "" });
			if ((active as any).scrollIntoView) {
				active.scrollIntoView({ block: "nearest" });
			}
		}
	}

	private _clearHoverTimer(): void {
		if (this._hoverTimer) {
			clearTimeout(this._hoverTimer);
			this._hoverTimer = null;
		}
	}
}
