/**
 * ext/toolbar (Layer B) — the declarative toolbar plugin.
 *
 *   gantt.plugins({ toolbar: true });
 *   gantt.config.toolbar = { items: ["add_task", "|", "undo", "spacer", "theme"] };
 *
 * Responsibilities:
 *  - register the "toolbar" layout view (hosts the Layer A widget);
 *  - auto-inject a full-width toolbar row into config.layout at init when the
 *    config is truthy and no explicit `view:"toolbar"` cell exists (idempotent);
 *  - route widget item events to the gantt events onToolbarItemClick /
 *    onToolbarItemChange (T7), with return-false cancellation (T8);
 *  - expose the runtime API gantt.ext.toolbar.
 *
 * Design: docs/internal/toolbar-context-menu/01-toolbar-api.md.
 */
import { DEFAULT_TOOLBAR_PRESET } from "../../core/ui/controls/toolbar_builtins";
import { createToolbarView, DEFAULT_TOOLBAR_HEIGHT } from "./toolbar_view";

interface IResolvedToolbarConfig {
	items: any[];
	css?: string;
	overflow?: string;
	collapseWidth?: number;
}

/** Build the Toolbar-widget config from gantt.config.toolbar. Returns null to suppress. */
function resolveToolbarConfig(gantt: any): IResolvedToolbarConfig | null {
	const raw = gantt.config.toolbar;
	if (raw === false) {
		return null;
	}
	if (raw === undefined || raw === null || raw === true) {
		return { items: DEFAULT_TOOLBAR_PRESET.slice() };
	}
	if (Array.isArray(raw)) {
		return { items: raw.slice() };
	}
	if (typeof raw === "object") {
		if (raw.items === false) {
			return null;
		}
		return {
			items: (raw.items || DEFAULT_TOOLBAR_PRESET).slice(),
			css: raw.css,
			overflow: raw.overflow,
			collapseWidth: raw.collapseWidth
		};
	}
	return null;
}

/** recursively test whether a layout config already contains a toolbar cell. */
function hasToolbarCell(node: any): boolean {
	if (!node || typeof node !== "object") {
		return false;
	}
	if (node.view === "toolbar") {
		return true;
	}
	const children = node.rows || node.cols || node.views;
	if (children && children.length) {
		for (let i = 0; i < children.length; i++) {
			if (hasToolbarCell(children[i])) {
				return true;
			}
		}
	}
	return false;
}

export default function (gantt: any): void {
	if (gantt.$_toolbarPluginInit) {
		return;
	}
	gantt.$_toolbarPluginInit = true;

	// per-instance ext state
	const ext: any = {
		_widget: null,
		_cell: null
	};

	// forward widget activation to gantt events (T7/T8: return false cancels)
	function forwardClick(id: any, item: any, e: any): boolean | void {
		return gantt.callEvent("onToolbarItemClick", [id, item, e]);
	}
	function forwardChange(id: any, value: any, item: any): boolean | void {
		return gantt.callEvent("onToolbarItemChange", [id, value, item]);
	}

	function buildWidgetConfig(g: any): any {
		const resolved = resolveToolbarConfig(g);
		const base: IResolvedToolbarConfig = resolved || { items: [] };
		return {
			items: base.items,
			css: base.css,
			overflow: base.overflow,
			collapseWidth: base.collapseWidth,
			onItemClick: forwardClick,
			onItemChange: forwardChange
		};
	}

	// register the layout view once
	const ToolbarView = createToolbarView(buildWidgetConfig, function (widget: any, cell: any) {
		ext._widget = widget;
		ext._cell = cell;
	});
	if (gantt.$ui && gantt.$ui.registerView) {
		gantt.$ui.registerView("toolbar", ToolbarView);
	}

	// auto-inject the toolbar row before the layout is built (idempotent).
	gantt.attachEvent("onBeforeGanttReady", function () {
		const cfg = resolveToolbarConfig(gantt);
		if (!cfg) {
			return;                                  // toolbar:false → no cell
		}
		const layout = gantt.config.layout;
		if (!layout || hasToolbarCell(layout)) {
			return;                                  // explicit placement or already wrapped
		}
		const inner = Object.assign({}, layout);
		const wrapperCss = layout.css || "gantt_container";
		delete inner.css;
		gantt.config.layout = {
			css: wrapperCss,
			rows: [
				{ view: "toolbar", id: "toolbar", height: DEFAULT_TOOLBAR_HEIGHT },
				inner
			]
		};
	});

	// runtime API — thin proxy over the hosted widget
	gantt.ext.toolbar = {
		setItems(items: any[]): void {
			if (ext._widget) {
				ext._widget.setItems(items);
			}
		},
		updateItem(id: any, patch: any): void {
			if (ext._widget) {
				ext._widget.updateItem(id, patch);
			}
		},
		getItem(id: any): any {
			return ext._widget ? ext._widget.getItem(id) : null;
		},
		getValue(id: any): any {
			return ext._widget ? ext._widget.getValue(id) : undefined;
		},
		setValue(id: any, value: any): void {
			if (ext._widget) {
				ext._widget.setValue(id, value);
			}
		},
		show(): void {
			if (ext._cell && ext._cell.show) {
				ext._cell.show(true);
			}
		},
		hide(): void {
			if (ext._cell && ext._cell.hide) {
				ext._cell.hide();
			}
		},
		refresh(): void {
			if (ext._widget) {
				ext._widget.setItems(buildWidgetConfig(gantt).items);
			}
		},
		getToolbar(): any {
			return ext._widget;
		}
	};
}
