/**
 * Toolbar built-in registry (Layer A, design docs/internal/toolbar-context-menu).
 *
 * Each built-in is a dumb record next to the Toolbar widget so that
 * `createToolbar({ items: ["undo"] })` works without any plugin. A record can
 * hook four points of the widget lifecycle:
 *
 *   available(gantt)          — degradation: return false to HIDE the item when
 *                               the backing facility is absent (never disabled).
 *   resolve(gantt, item)      — expand the (possibly theme-specific) descriptor
 *                               into a fully generic one the widget can render.
 *   action(gantt, api, item, value) — run on activation (click / change / menu
 *                               select). `value` is the toggle pressed-state, the
 *                               combo/segmented value, or the selected menu id.
 *   bind(gantt, control, api, item) → teardown — after mount: seed the control
 *                               face + attach any listeners; the returned function
 *                               is called on destroy / rebuild.
 *
 * The star of the current slice is `theme` (design 08-theme-switcher.md).
 */
import { IToolbarItem, IThemeOption, IUIComponent, IMenuItem, IUIOption, IToolbarApi, IToolbarBuiltin } from "./types";
import { resolveLabel } from "./common";
export type { IToolbarApi, IToolbarBuiltin } from "./types";

// ---------------------------------------------------------------------------
// theme built-in
// ---------------------------------------------------------------------------

const ICON_LIGHT = "dhx_gantt_icon dhx_gantt_icon_theme_light";  // sun
const ICON_DARK = "dhx_gantt_icon dhx_gantt_icon_theme_dark";    // moon
const ICON_CONTRAST = "dhx_gantt_icon dhx_gantt_icon_contrast";

const STORAGE_KEY = "gantt_theme";

/** default offered set when the item carries no `themes` (design 08 §3). */
export const DEFAULT_THEMES: IThemeOption[] = [
	{ id: "terrace", mode: "light", label: "ui_theme_light" },
	{ id: "dark", mode: "dark", label: "ui_theme_dark" },
	{ id: "contrast-white", mode: "light", contrast: true, label: "ui_theme_contrast_light" },
	{ id: "contrast-black", mode: "dark", contrast: true, label: "ui_theme_contrast_dark" },
	{ id: "auto", mode: "auto", label: "ui_theme_auto" }
];

/** hyphen id → mode; unknown ids fall back to the known dark-skin set. */
const KNOWN_DARK: Record<string, boolean> = { "dark": true, "contrast-black": true };

function themeList(item: IToolbarItem): IThemeOption[] {
	return (item.themes && item.themes.length) ? item.themes : DEFAULT_THEMES;
}

function firstOfMode(themes: IThemeOption[], mode: string, preferPlain?: boolean): IThemeOption | null {
	const matches = themes.filter(t => (t.mode || "light") === mode);
	if (!matches.length) {
		return null;
	}
	if (preferPlain) {
		const plain = matches.filter(t => !t.contrast)[0];
		if (plain) {
			return plain;
		}
	}
	return matches[0];
}

function currentIsDark(gantt: any, themes: IThemeOption[]): boolean {
	const skin = gantt && gantt.skin;
	const known = themes.filter(t => t.id === skin)[0];
	if (known) {
		return (known.mode || "light") === "dark";
	}
	return !!KNOWN_DARK[skin];
}

function themeLabel(gantt: any, t: IThemeOption): string {
	const label = (key: string) => resolveLabel(gantt && gantt.locale && gantt.locale.labels, key);
	if (t.label) {
		return label(t.label);
	}
	if (t.mode === "auto" || t.id === "auto") {
		return label("ui_theme_auto");
	}
	if (t.contrast) {
		return label("ui_theme_high_contrast");
	}
	return label((t.mode === "dark") ? "ui_theme_dark" : "ui_theme_light");
}

function matchMediaDark(): any {
	if (typeof window === "undefined" || !window.matchMedia) {
		return null;
	}
	try {
		return window.matchMedia("(prefers-color-scheme: dark)");
	} catch {
		return null;
	}
}

function persist(item: IToolbarItem, value: string): void {
	if (!item.remember) {
		return;
	}
	try {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem(STORAGE_KEY, value);
		}
	} catch { /* ignore */ }
}

function readPersisted(item: IToolbarItem): string | null {
	if (!item.remember) {
		return null;
	}
	try {
		return (typeof localStorage !== "undefined") ? localStorage.getItem(STORAGE_KEY) : null;
	} catch {
		return null;
	}
}

/** apply a concrete skin id (canonical hyphen form; see 08 §7 gotcha). */
function applySkin(gantt: any, id: string): void {
	if (gantt && typeof gantt.setSkin === "function" && gantt.skin !== id) {
		gantt.setSkin(id);
	}
}

/** swap the toggle button glyph to reflect the CURRENT mode (moon in light → click for dark). */
function updateToggleIcon(root: HTMLElement | null, isDark: boolean): void {
	if (!root) {
		return;
	}
	const iconNode = root.querySelector(".dhx_ui_button_icon") as HTMLElement | null;
	if (iconNode) {
		iconNode.className = "dhx_ui_button_icon " + (isDark ? ICON_LIGHT : ICON_DARK);
	}
}

/** tick the current entry in a dropdown menu (icon-as-check on the active leaf). */
function syncMenuChecked(item: IToolbarItem, selected: string): void {
	if (!item.items) {
		return;
	}
	item.items.forEach(leaf => {
		leaf.icon = (leaf.id === selected) ? "dhx_gantt_icon dhx_gantt_icon_check" : undefined;
	});
}

function enableAuto(gantt: any, api: IToolbarApi, item: IToolbarItem, themes: IThemeOption[]): void {
	const st = api.state(item.id);
	disableAuto(api, item);              // clear any previous listener first
	const mql = matchMediaDark();
	const apply = () => {
		const mode = (mql && mql.matches) ? "dark" : "light";
		const t = firstOfMode(themes, mode, true) || firstOfMode(themes, mode);
		if (t) {
			applySkin(gantt, t.id);
		}
	};
	apply();
	if (mql && mql.addEventListener) {
		mql.addEventListener("change", apply);
		st.autoCleanup = () => mql.removeEventListener("change", apply);
	} else if (mql && mql.addListener) {          // older Safari
		mql.addListener(apply);
		st.autoCleanup = () => mql.removeListener(apply);
	}
	st.selected = "auto";
}

function disableAuto(api: IToolbarApi, item: IToolbarItem): void {
	const st = api.state(item.id);
	if (st.autoCleanup) {
		st.autoCleanup();
		st.autoCleanup = null;
	}
}

const themeBuiltin: IToolbarBuiltin = {
	name: "theme",
	descriptor: { comp: "toggle", tooltip: "ui_toolbar_theme" },

	resolve(gantt: any, item: IToolbarItem): IToolbarItem {
		const themes = themeList(item);
		const comp = item.comp || "toggle";
		const resolved: IToolbarItem = Object.assign({}, item);
		resolved.themes = themes;

		if (comp === "menu") {
			resolved.comp = "menu";
			resolved.icon = item.icon || ICON_CONTRAST;
			resolved.tooltip = item.tooltip || "ui_toolbar_theme";
			resolved.items = themes.map((t): IMenuItem => ({ id: t.id, label: themeLabel(gantt, t), icon: t.icon }));
		} else if (comp === "segmented") {
			resolved.comp = "segmented";
			resolved.options = themes.map((t): IUIOption => ({ key: t.id, label: themeLabel(gantt, t) }));
		} else {
			resolved.comp = "toggle";
			const isDark = currentIsDark(gantt, themes);
			resolved.pressed = isDark;
			resolved.icon = isDark ? ICON_LIGHT : ICON_DARK;
			resolved.tooltip = item.tooltip || "ui_toolbar_theme";
		}
		return resolved;
	},

	action(gantt: any, api: IToolbarApi, item: IToolbarItem, value?: any): void {
		const themes = themeList(item);

		if ((item.comp || "toggle") === "toggle") {
			// binary: value is the next pressed state (true = go dark)
			disableAuto(api, item);
			const target = firstOfMode(themes, value ? "dark" : "light", true) || firstOfMode(themes, value ? "dark" : "light");
			if (target) {
				applySkin(gantt, target.id);
				persist(item, target.id);
				api.state(item.id).selected = target.id;
			}
			const control = api.getControl(item.id);
			updateToggleIcon(control ? control.getRootNode() : null, !!value);
			return;
		}

		// menu / segmented: value is the chosen entry id
		const chosen = themes.filter(t => t.id === value)[0];
		if (!chosen) {
			return;
		}
		if (chosen.mode === "auto" || chosen.id === "auto") {
			enableAuto(gantt, api, item, themes);
			persist(item, "auto");
		} else {
			disableAuto(api, item);
			applySkin(gantt, chosen.id);
			persist(item, chosen.id);
			api.state(item.id).selected = chosen.id;
		}
		if ((item.comp) === "menu") {
			syncMenuChecked(item, String(value));
		} else {
			api.setValue(item.id, value);
		}
	},

	bind(gantt: any, control: IUIComponent | null, api: IToolbarApi, item: IToolbarItem): (() => void) {
		const themes = themeList(item);
		const st = api.state(item.id);
		const persisted = readPersisted(item);

		// seed selection: persisted pick → else the current skin (if offered) → else raw skin
		let selected = persisted || (gantt && gantt.skin) || "terrace";
		st.selected = selected;

		if (selected === "auto") {
			enableAuto(gantt, api, item, themes);
		} else if (persisted) {
			// remember: restore the persisted concrete theme on mount
			applySkin(gantt, persisted);
		}

		const comp = item.comp || "toggle";
		if (comp === "toggle") {
			const isDark = currentIsDark(gantt, themes);
			if (control && (control as any).setValue) {
				(control as any).setValue(isDark);
			}
			updateToggleIcon(control ? control.getRootNode() : null, isDark);
		} else if (comp === "menu") {
			syncMenuChecked(item, String(st.selected));
		} else if (comp === "segmented") {
			if (control && (control as any).setValue) {
				(control as any).setValue(st.selected);
			}
		}

		return () => disableAuto(api, item);
	}
};

// ---------------------------------------------------------------------------
// simple action built-ins (default preset). Kept thin; disabled-state sync for
// undo/redo/zoom bounds is a documented follow-up (design 01 §4).
// ---------------------------------------------------------------------------

function eachOpen(gantt: any, open: boolean): void {
	gantt.eachTask(function (t: any) { t.$open = open; });
	gantt.render();
}

/** zoom is always constructed on gantt.ext.zoom, but has no levels until init(). */
function zoomInitialized(gantt: any): boolean {
	const z = gantt.ext && gantt.ext.zoom;
	if (!z || typeof z.getLevels !== "function") {
		return false;
	}
	try {
		const levels = z.getLevels();
		return !!(levels && levels.length);
	} catch {
		return false;
	}
}

function zoomLevelId(level: any, index: number): string | number {
	return (level && level.name != null) ? level.name : index;
}

function zoomLevelLabel(level: any, index: number): string {
	return (level && level.name != null) ? String(level.name) : ("Level " + (index + 1));
}

/**
 * disabled-state sync for a stack-backed button (undo/redo). The undo ext fires
 * `onAfterUndoStackChange` on every stack mutation (record / undo / redo / clear),
 * including the batched recorder's deferred commit — a single reliable signal, no
 * data-event polling. Detached on teardown.
 */
function bindStackSync(gantt: any, control: IUIComponent | null, getStack: () => any[]): (() => void) | void {
	if (!control || !(control as any).setDisabled) {
		return undefined;
	}
	const update = () => {
		let empty = true;
		try {
			const stack = getStack();
			empty = !(stack && stack.length);
		} catch { empty = true; }
		(control as any).setDisabled(empty);
	};
	update();
	const id = gantt.attachEvent("onAfterUndoStackChange", () => { update(); });
	return () => gantt.detachEvent(id);
}

const simpleBuiltins: IToolbarBuiltin[] = [
	{
		name: "add_task",
		descriptor: { comp: "button", variant: "primary", label: "ui_toolbar_add_task", tooltip: "ui_toolbar_add_task" },
		available: (gantt) => !gantt.config.readonly,
		action: (gantt) => { gantt.createTask(); }
	},
	{
		name: "undo",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_undo", tooltip: "ui_toolbar_undo" },
		available: (gantt) => typeof gantt.undo === "function",
		action: (gantt) => { gantt.undo(); },
		bind: (gantt, control) => bindStackSync(gantt, control, () => gantt.getUndoStack())
	},
	{
		name: "redo",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_redo", tooltip: "ui_toolbar_redo" },
		available: (gantt) => typeof gantt.redo === "function",
		action: (gantt) => { gantt.redo(); },
		bind: (gantt, control) => bindStackSync(gantt, control, () => gantt.getRedoStack())
	},
	{
		name: "zoom_in",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_zoom_in", tooltip: "ui_toolbar_zoom_in" },
		available: (gantt) => zoomInitialized(gantt),
		action: (gantt) => { gantt.ext.zoom.zoomIn(); }
	},
	{
		name: "zoom_out",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_zoom_out", tooltip: "ui_toolbar_zoom_out" },
		available: (gantt) => zoomInitialized(gantt),
		action: (gantt) => { gantt.ext.zoom.zoomOut(); }
	},
	{
		name: "zoom_level",
		descriptor: { comp: "menu", tooltip: "ui_toolbar_zoom_level" },
		available: (gantt) => zoomInitialized(gantt),
		resolve: (gantt, item) => {
			const levels = gantt.ext.zoom.getLevels() || [];
			const current = gantt.ext.zoom.getCurrentLevel();
			const resolved: IToolbarItem = Object.assign({}, item, { comp: "menu" as const });
			resolved.items = levels.map((lvl: any, i: number): IMenuItem => ({
				id: zoomLevelId(lvl, i),
				label: zoomLevelLabel(lvl, i),
				icon: (i === current) ? "dhx_gantt_icon dhx_gantt_icon_check" : undefined
			}));
			resolved.label = zoomLevelLabel(levels[current], current);
			return resolved;
		},
		action: (gantt, _api, _item, value) => {
			if (value !== undefined && value !== null) {
				gantt.ext.zoom.setLevel(value);
			}
		},
		bind: (gantt, control, _api, item) => {
			const zoom = gantt.ext.zoom;
			if (!zoom || typeof zoom.attachEvent !== "function") {
				return undefined as any;
			}
			const sync = () => {
				const levels = zoom.getLevels() || [];
				const cur = zoom.getCurrentLevel();
				const root = control && control.getRootNode ? control.getRootNode() : null;
				if (root) {
					const lbl = root.querySelector(".dhx_ui_button_label");
					if (lbl) {
						lbl.textContent = zoomLevelLabel(levels[cur], cur);
					}
				}
				// re-tick the current entry in place (menu is re-read from item.items on open)
				if (item.items) {
					item.items.forEach((leaf, i) => {
						leaf.icon = (zoomLevelId(levels[i], i) === zoomLevelId(levels[cur], cur))
							? "dhx_gantt_icon dhx_gantt_icon_check" : undefined;
					});
				}
			};
			sync();
			const id = zoom.attachEvent("onAfterZoom", sync);
			return () => zoom.detachEvent(id);
		}
	},
	{
		name: "expand_all",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_expand_all", tooltip: "ui_toolbar_expand_all" },
		action: (gantt) => eachOpen(gantt, true)
	},
	{
		name: "collapse_all",
		descriptor: { comp: "button", icon: "dhx_gantt_icon dhx_gantt_icon_collapse_all", tooltip: "ui_toolbar_collapse_all" },
		action: (gantt) => eachOpen(gantt, false)
	},
	{
		name: "today",
		descriptor: { comp: "button", variant: "link", label: "ui_toolbar_today", tooltip: "ui_toolbar_today" },
		action: (gantt) => { gantt.showDate(new Date()); }
	},
	{
		name: "critical_path",
		descriptor: { comp: "toggle", label: "ui_toolbar_critical_path", tooltip: "ui_toolbar_critical_path" },
		available: (gantt) => typeof gantt.isCriticalTask === "function",
		action: (gantt, _api, _item, value) => {
			gantt.config.highlight_critical_path = !!value;
			gantt.render();
		},
		bind: (gantt, control) => {
			if (control && (control as any).setValue) {
				(control as any).setValue(!!gantt.config.highlight_critical_path);
			}
			return undefined as any;
		}
	},
	{
		name: "fullscreen",
		descriptor: { comp: "toggle", icon: "dhx_gantt_icon dhx_gantt_icon_fullscreen", tooltip: "ui_toolbar_fullscreen" },
		available: (gantt) => !!(gantt.ext && gantt.ext.fullscreen),
		action: (gantt) => { gantt.ext.fullscreen.toggle(); }
	},
	themeBuiltin
];

const REGISTRY: Record<string, IToolbarBuiltin> = {};
simpleBuiltins.forEach(b => { REGISTRY[b.name] = b; });

export function getToolbarBuiltin(name: string): IToolbarBuiltin | undefined {
	return REGISTRY[name];
}

/** default preset rendered by `gantt.config.toolbar = true` / unset (design 01 §4 + theme). */
export const DEFAULT_TOOLBAR_PRESET: string[] = [
	"add_task", "|",
	"undo", "redo", "|",
	"zoom_in", "zoom_out", "zoom_level", "|","critical_path",
	"expand_all", "collapse_all", 
	"spacer", "theme", "fullscreen"
];
