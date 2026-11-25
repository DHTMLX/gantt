/**
 * Shared helpers of the control kit: locale-key label resolution,
 * aria application (respecting the resolved ARIA master switch), small DOM
 * builders. Everything here must stay callable in stub-DOM environments as
 * long as no control is actually mounted.
 */
import { IUiContext } from "../ui_context";

/**
 * English fallbacks for every UI-core locale key.
 * Locale files carry translations (`gantt.locale.labels.ui_*`); this map
 * guarantees text is never missing for locales that lack the new keys.
 */
const FALLBACK_LABELS: Record<string, string> = {
	ui_combo_no_results: "No results",
	ui_combo_loading: "Loading…",
	ui_datepicker_today: "Today",
	ui_datepicker_clear: "Clear",
	ui_datepicker_prev_month: "Previous month",
	ui_datepicker_next_month: "Next month",
	ui_stepper_increment: "Increase value",
	ui_stepper_decrement: "Decrease value",

	// toolbar / context-menu composition surface
	ui_toolbar_label: "Toolbar",
	ui_toolbar_add_task: "New task",
	ui_toolbar_undo: "Undo",
	ui_toolbar_redo: "Redo",
	ui_toolbar_zoom_in: "Zoom in",
	ui_toolbar_zoom_out: "Zoom out",
	ui_toolbar_zoom_level: "Zoom level",
	ui_toolbar_expand_all: "Expand all",
	ui_toolbar_collapse_all: "Collapse all",
	ui_toolbar_today: "Today",
	ui_toolbar_critical_path: "Show critical path",
	ui_toolbar_fullscreen: "Fullscreen",
	ui_toolbar_theme: "Theme",
	ui_toolbar_more: "More",
	ui_toolbar_menu: "Menu",

	// context-menu built-ins
	ui_menu_edit: "Edit",
	ui_menu_add: "Add",
	ui_menu_add_child: "Add subtask",
	ui_menu_add_before: "Add task above",
	ui_menu_add_after: "Add task below",
	ui_menu_add_predecessor: "Add predecessor",
	ui_menu_add_successor: "Add successor",
	ui_menu_convert_to_milestone: "Convert to milestone",
	ui_menu_convert_to_task: "Convert to task",
	ui_menu_indent: "Indent",
	ui_menu_outdent: "Outdent",
	ui_menu_cut: "Cut",
	ui_menu_copy: "Copy",
	ui_menu_paste_child: "Paste as subtask",
	ui_menu_paste_after: "Paste below",
	ui_menu_clear_clipboard: "Cancel copy/cut",
	ui_menu_split: "Split task",
	ui_menu_unsplit: "Unsplit task",
	ui_menu_complete: "Mark as complete",
	ui_menu_rollup: "Rollup",
	ui_menu_hide_bar: "Hide task bar",
	ui_menu_delete: "Delete",
	ui_menu_delete_link: "Delete link",
	ui_menu_deactivate_link: "Deactivate link",
	ui_menu_activate_link: "Activate link",
	ui_menu_add_task: "New task",
	ui_menu_expand_all: "Expand all",
	ui_menu_collapse_all: "Collapse all",
	ui_menu_sort_asc: "Sort ascending",
	ui_menu_sort_desc: "Sort descending",
	ui_menu_hide_column: "Hide column",

	// theme switcher (design 08-theme-switcher.md)
	ui_menu_theme: "Theme",
	ui_theme_light: "Light",
	ui_theme_dark: "Dark",
	ui_theme_high_contrast: "High contrast",
	ui_theme_contrast_light: "High contrast (light)",
	ui_theme_contrast_dark: "High contrast (dark)",
	ui_theme_auto: "Auto"
};

export function uiLabel(context: IUiContext, key: string): string {
	return context.label(key) || FALLBACK_LABELS[key] || key;
}

/** exported for unit tests */
export function resolveLabel(labels: Record<string, string> | null, key: string): string {
	if (labels && labels[key]) {
		return labels[key];
	}
	return FALLBACK_LABELS[key] || key;
}

/** Sets aria attributes unless the resolved ARIA master switch is disabled. */
export function applyAria(context: IUiContext, node: HTMLElement, attrs: Record<string, string>): void {
	if (!context.ariaEnabled()) {
		return;
	}
	for (const name in attrs) {
		node.setAttribute(name, attrs[name]);
	}
}

export function el(tag: string, className?: string, attrs?: Record<string, string>): HTMLElement {
	const node = document.createElement(tag);
	if (className) {
		node.className = className;
	}
	if (attrs) {
		for (const name in attrs) {
			node.setAttribute(name, attrs[name]);
		}
	}
	return node;
}

export function controlUid(context: IUiContext, prefix: string): string {
	return context.uid(prefix);
}
