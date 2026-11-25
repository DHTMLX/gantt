/**
 * ext/context_menu (Layer B) — declarative right-click menus.
 *
 *   gantt.plugins({ context_menu: true });
 *   gantt.config.context_menu = { task: ["edit", "|", "delete"], empty: ["add_task"] };
 *
 * Rendering is the shipped Menu control; this plugin adds zone resolution,
 * per-zone defaults + config, built-in merge/degradation, gantt-event routing
 * (onBeforeContextMenu / onContextMenuItemClick), and the gantt.ext.contextMenu
 * runtime API. Design: docs/internal/toolbar-context-menu/02-context-menu-api.md.
 */
import * as domHelpers from "../../core/ui/utils/dom_helpers";
import { IMenuItem } from "../../core/ui/controls/types";
import { resolveZone, IZoneInfo, ContextZone } from "./zones";
import {
	getContextMenuBuiltin, DEFAULT_CONTEXT_MENUS, clipboardMark, clearClipboard,
	discardRemovedClipboard, contextMenuLabel,
	IContextMenuBuiltin, IContextMenuEventContext
} from "./context_menu_builtins";
import {
	bindColumnGuards, collectColumnGuards, mergeContextMenuItem, refreshColumnMenuItems, resolveColumnItemDisabled
} from "./column_menu_guards";
import type { ColumnMenuGuards } from "./column_menu_guards";

type ContextMenuItemDef = string | IMenuItem;

/** resolve the item list for a zone from gantt.config.context_menu. */
function resolveZoneConfig(gantt: any, zone: ContextZone): ContextMenuItemDef[] | null {
	const raw = gantt.config.context_menu;
	if (raw === false) {
		return null;                                   // plugin fully off
	}
	if (raw === undefined || raw === null || raw === true) {
		return DEFAULT_CONTEXT_MENUS[zone] || null;    // defaults-on
	}
	if (typeof raw === "object") {
		if (Object.prototype.hasOwnProperty.call(raw, zone)) {
			const z = raw[zone];
			if (z === false) {
				return null;                           // this zone off
			}
			if (Array.isArray(z)) {
				return z;                              // present array replaces the default
			}
			return DEFAULT_CONTEXT_MENUS[zone] || null;
		}
		return DEFAULT_CONTEXT_MENUS[zone] || null;    // absent key → default
	}
	return null;
}

/** drop leading/trailing separators and collapse consecutive ones (so a zone
 *  that filters all its actionable items — e.g. readonly — yields no menu). */
function cleanSeparators(items: IMenuItem[]): IMenuItem[] {
	const out: IMenuItem[] = [];
	items.forEach((it) => {
		if (it.separator) {
			if (!out.length || out[out.length - 1].separator) {
				return;
			}
		}
		out.push(it);
	});
	while (out.length && out[out.length - 1].separator) {
		out.pop();
	}
	return out;
}

/** register the built-in owner for an item and all of its submenu leaves. */
function registerOwners(item: IMenuItem, builtin: IContextMenuBuiltin, owners: Record<string, IContextMenuBuiltin>): void {
	if (item.id !== undefined && item.id !== null) {
		owners[String(item.id)] = builtin;
	}
	if (item.items && item.items.length) {
		item.items.forEach((leaf) => registerOwners(leaf, builtin, owners));
	}
}

/** build the resolved item list + a leaf-id → built-in ownership map. */
function buildItems(gantt: any, zone: ContextZone, defs: ContextMenuItemDef[], ctx: IContextMenuEventContext): {
	items: IMenuItem[], owners: Record<string, IContextMenuBuiltin>
} {
	const items: IMenuItem[] = [];
	const owners: Record<string, IContextMenuBuiltin> = {};
	
	const orphan = (zone === "task" && !(ctx.id != null && gantt.isTaskExists(ctx.id))) ||
		(zone === "link" && !(ctx.id != null && gantt.isLinkExists(ctx.id)));

	defs.forEach((def) => {
		if (def === "|" || def === "separator") {
			items.push({ separator: true });
			return;
		}
		const isStr = typeof def === "string";
		const id = isStr ? def : (def as IMenuItem).id;
		const builtin = (id !== undefined && id !== null) ? getContextMenuBuiltin(String(id)) : undefined;

		if (builtin) {
			if (orphan) {
				return;
			}
			if (builtin.zones.indexOf(zone) === -1) {
				return;                                       // not valid in this zone
			}
			if (builtin.hidden && builtin.hidden(gantt, ctx)) {
				return;                                       // degradation / readonly
			}
			const resolved = builtin.resolve(gantt, ctx);
			const arr = Array.isArray(resolved) ? resolved : [resolved];
			const disabled = !!(builtin.disabled && builtin.disabled(gantt, ctx));
			arr.forEach((one) => {
				let item = one;
				if (!isStr) {
					item = mergeContextMenuItem(one, def as IMenuItem);   // user override on the built-in
				}
				if (disabled) {
					item.disabled = true;
				}
				items.push(item);
				registerOwners(item, builtin, owners);
			});
		} else if (!isStr) {
			const custom = def as IMenuItem;
			if (custom.items && custom.items.length) {
				const nested = buildItems(gantt, zone, custom.items as ContextMenuItemDef[], ctx);
				Object.keys(nested.owners).forEach((key) => { owners[key] = nested.owners[key]; });
				items.push(Object.assign({}, custom, { items: nested.items }));
				return;
			}
			items.push(custom);
		}
		// unknown string built-in name → skipped
	});

	return { items: cleanSeparators(items), owners };
}

export default function (gantt: any): void {
	if (gantt.$_contextMenuPluginInit) {
		return;
	}
	gantt.$_contextMenuPluginInit = true;

	/**
	 * Mark the task waiting in the clipboard so "Cut"/"Copy" are visible in the
	 * chart, not only in the menu. 
	 */
	gantt.attachEvent("onTemplatesReady", function () {
		["grid_row_class", "task_class"].forEach((name: string) => {
			const original = gantt.templates[name];
			gantt.templates[name] = function (start: any, end: any, task: any): string {
				const own = original ? original.apply(this, arguments as any) : "";
				const mark = task ? clipboardMark(gantt, task.id) : "";
				if (!mark) {
					return own || "";
				}
				return own ? (own + " " + mark) : mark;
			};
		});
		return true;
	});

	const state: {
		menu: any,
		context: IContextMenuEventContext | null,
		owners: Record<string, IContextMenuBuiltin>,
		keepOpen: boolean,
		columnEntries: ColumnMenuGuards
	} = { menu: null, context: null, owners: {}, keepOpen: false, columnEntries: new Map() };

	function hasContextTarget(ctx: IContextMenuEventContext): boolean {
		if (ctx.zone === "task") {
			return ctx.id != null && gantt.isTaskExists(ctx.id) && gantt.getTask(ctx.id) === ctx.task;
		}
		if (ctx.zone === "link") {
			return ctx.id != null && gantt.isLinkExists(ctx.id);
		}
		return true;
	}

	/** a checkbox item toggles without closing the menu (column visibility) */
	function isCheckbox(item: IMenuItem): boolean {
		return !!item && item.checked !== undefined && !item.radio;
	}

	function getMenu(): any {
		if (!state.menu) {
			state.menu = gantt.ext.ui.controls.menu({
				label: contextMenuLabel(gantt),
				resolveItemDisabled: (item: IMenuItem) => resolveColumnItemDisabled(item, state.columnEntries),
				onSelect: (leafId: any, leafItem: IMenuItem) => handleSelect(leafId, leafItem)
			});
		}
		return state.menu;
	}

	function handleSelect(leafId: any, leafItem: IMenuItem): void {
		const ctx = state.context;
		if (!ctx) {
			return;
		}
		// T8: the event fires BEFORE the built-in action; return false cancels it
		if (gantt.callEvent("onContextMenuItemClick", [leafId, leafItem, ctx]) === false) {
			if (isCheckbox(leafItem)) {
				closeMenu();
			}
			return;
		}
		
		if (!hasContextTarget(ctx)) {
			closeMenu();
			return;
		}
		const builtin = state.owners[String(leafId)];
		if (builtin && builtin.action) {
			if ((builtin.hidden && builtin.hidden(gantt, ctx)) || (builtin.disabled && builtin.disabled(gantt, ctx))) {
				if (isCheckbox(leafItem)) {
					closeMenu();
				}
				return;
			}
			state.keepOpen = isCheckbox(leafItem);
			try {
				builtin.action(gantt, ctx, leafItem);
				if (builtin.name === "columns") {
					refreshColumnMenuItems(gantt, state.columnEntries);
				}
			} finally {
				state.keepOpen = false;
			}
		}
	}

	function enrich(gantt: any, zoneInfo: IZoneInfo, e: any): IContextMenuEventContext {
		const ctx: IContextMenuEventContext = {
			zone: zoneInfo.zone,
			id: zoneInfo.id,
			area: zoneInfo.area,
			column: zoneInfo.column,
			items: [],
			event: e,
			x: e && typeof e.clientX === "number" ? e.clientX : 0,
			y: e && typeof e.clientY === "number" ? e.clientY : 0
		};
		if (zoneInfo.zone === "task" && zoneInfo.id != null && gantt.isTaskExists(zoneInfo.id)) {
			ctx.task = gantt.getTask(zoneInfo.id);
		}
		if (zoneInfo.zone === "link" && zoneInfo.id != null && gantt.isLinkExists(zoneInfo.id)) {
			ctx.link = gantt.getLink(zoneInfo.id);
		}
		// the cursor date is meaningful anywhere in the timeline: "New task" starts
		// there, "Split task" cuts the bar there
		if (zoneInfo.area === "timeline" && gantt.$task_data) {
			try {
				const pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);
				const date = gantt.dateFromPos(pos.x);
				if (date) {
					ctx.date = date;
				}
			} catch { /* no timeline / off-range — leave date undefined */ }
		}
		return ctx;
	}

	function openMenuForContext(ctx: IContextMenuEventContext): boolean {
		const guards = ctx.zone === "header" && Object.keys(state.owners).length ? collectColumnGuards(ctx.items) : null;
		// onBeforeContextMenu fires AFTER built-in resolution; false vetoes (native
		// menu is NOT suppressed); handlers may mutate ctx.items.
		if (gantt.callEvent("onBeforeContextMenu", [ctx]) === false) {
			return false;
		}
		if (!ctx.items || !ctx.items.length) {
			return false;
		}
		selectTarget(ctx);
		state.context = ctx;
		state.columnEntries = guards ? bindColumnGuards(ctx.items, guards) : new Map();
		refreshColumnMenuItems(gantt, state.columnEntries);
		const menu = getMenu();
		menu.setItems(ctx.items);
		menu.openAt(ctx.x, ctx.y);
		return true;
	}

	function selectTarget(ctx: IContextMenuEventContext): void {
		if (ctx.zone !== "task" || ctx.id == null) {
			return;
		}
		if (!gantt.config.select_task || !gantt.isTaskExists(ctx.id) || gantt.isSelectedTask(ctx.id)) {
			return;
		}
		if (gantt._multiselect && gantt.getSelectedTasks) {
			gantt.getSelectedTasks().forEach((id: any) => gantt.unselectTask(id));
		}
		gantt.selectTask(ctx.id);
	}

	gantt.attachEvent("onContextMenu", function (taskId: any, linkId: any, e: any) {
		const zoneInfo = resolveZone(gantt, e);
		if (!zoneInfo) {
			return true;                                   // reserved region → native menu
		}
		const defs = resolveZoneConfig(gantt, zoneInfo.zone);
		if (!defs) {
			return true;                                   // zone / plugin off → native menu
		}
		const ctx = enrich(gantt, zoneInfo, e);
		const built = buildItems(gantt, zoneInfo.zone, defs, ctx);
		ctx.items = built.items;
		state.owners = built.owners;

		const opened = openMenuForContext(ctx);
		// return false to suppress the native menu ONLY when we actually show one
		return opened ? false : true;
	});

	// stale-anchor safety: close on scroll and on data re-render
	function closeMenu(): void {
		if (state.keepOpen) {
			return;
		}
		if (state.menu && state.menu.isOpen()) {
			state.menu.close();
		}
	}
	gantt.attachEvent("onGanttScroll", function () { closeMenu(); return true; });
	gantt.attachEvent("onDataRender", function () { closeMenu(); return true; });

	gantt.attachEvent("onClear", function () { clearClipboard(gantt); return true; });
	gantt.attachEvent("onAfterTaskDelete", function () { discardRemovedClipboard(gantt); return true; });

	gantt.attachEvent("onDestroy", function () {
		if (state.menu) {
			state.menu.destroy();
			state.menu = null;
		}
		return true;
	});

	// runtime API
	gantt.ext.contextMenu = {
		open(request: { zone: ContextZone, id?: any, x?: number, y?: number, items?: IMenuItem[], area?: "grid" | "timeline", column?: string }): void {
			const ctx: IContextMenuEventContext = {
				zone: request.zone,
				id: request.id != null ? request.id : null,
				area: request.area,
				column: request.column,
				items: [],
				event: null,
				x: request.x || 0,
				y: request.y || 0
			};
			if (request.zone === "task" && ctx.id != null && gantt.isTaskExists(ctx.id)) {
				ctx.task = gantt.getTask(ctx.id);
			}
			if (request.zone === "link" && ctx.id != null && gantt.isLinkExists(ctx.id)) {
				ctx.link = gantt.getLink(ctx.id);
			}
			if (request.items) {
				ctx.items = request.items;
				state.owners = {};                         // caller-supplied items bypass built-in resolution
			} else {
				const defs = resolveZoneConfig(gantt, request.zone) || [];
				const built = buildItems(gantt, request.zone, defs, ctx);
				ctx.items = built.items;
				state.owners = built.owners;
			}
			openMenuForContext(ctx);
		},
		close(): void { closeMenu(); },
		isOpen(): boolean { return !!(state.menu && state.menu.isOpen()); },
		getMenu(): any { return getMenu(); }
	};
}
