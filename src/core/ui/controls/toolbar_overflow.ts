/**
 * Toolbar overflow — pure layout decisions for the one-row toolbar
 * (design docs/internal/toolbar-context-menu/01-toolbar-api.md §7).
 *
 * The widget measures its items, then asks fitToolbarItems() which of them stay
 * in the row and which move into the overflow ("More" / burger) menu button.
 * No DOM here, so the decisions are unit-tested without a browser.
 */
import { ToolbarItemOverflow, ToolbarOverflowMode } from "./types";

export type ToolbarEntryKind = "item" | "separator" | "spacer";

export interface IToolbarFitEntry {
	kind: ToolbarEntryKind;
	/** outer width in CSS pixels, margins included (0 for a spacer) */
	width: number;
	/** item-level preference; ignored for separators and spacers */
	overflow?: ToolbarItemOverflow;
	/** `hidden: true` items are in neither the row nor the menu */
	hidden?: boolean;
	/**
	 * a standalone text item (`comp: "label"`). It has no menu form, so it is
	 * hidden instead of moved. Without its own `overflow` it captions the item
	 * right after it and is shown exactly while that item is in the row.
	 */
	label?: boolean;
}

export interface IToolbarFitInput {
	entries: IToolbarFitEntry[];
	/** content width of the toolbar row (padding excluded) */
	available: number;
	/** flex gap between two displayed children */
	gap: number;
	/** outer width of the menu button */
	menuWidth: number;
	mode: ToolbarOverflowMode;
	/** with mode "menu": below this available width the toolbar collapses */
	collapseWidth?: number;
}

export interface IToolbarFitResult {
	/** per entry: displayed in the row */
	inRow: boolean[];
	/** per entry: listed in the menu (items only; separators are derived) */
	inMenu: boolean[];
	/** the menu button is shown (at least one entry is in the menu) */
	menu: boolean;
	/** the effective mode is "collapse" (burger button) */
	collapsed: boolean;
}

/**
 * Hides a separator whose group of items on one side was emptied by the
 * overflow. A group is the run of entries between two separators (or an end);
 * the spacer does not count as content. Separators of a toolbar that fits stay
 * exactly as configured.
 */
function dropLooseSeparators(entries: IToolbarFitEntry[], shown: boolean[]): void {
	// per group: [had a displayed item originally, has one now]
	const groups: Array<{ before: boolean, now: boolean }> = [{ before: false, now: false }];
	const groupOf: number[] = [];
	entries.forEach((entry, i) => {
		if (entry.kind === "separator") {
			groupOf[i] = groups.length - 1;   // the group on its left
			groups.push({ before: false, now: false });
			return;
		}
		groupOf[i] = groups.length - 1;
		if (entry.kind === "item" && !entry.hidden) {
			const group = groups[groups.length - 1];
			group.before = true;
			group.now = group.now || shown[i];
		}
	});
	const emptied = (g: number) => groups[g].before && !groups[g].now;
	entries.forEach((entry, i) => {
		if (entry.kind === "separator" && shown[i] && (emptied(groupOf[i]) || emptied(groupOf[i] + 1))) {
			shown[i] = false;
		}
	});
	// "a | b | c" with b moved: keep one separator between a and c
	let previousItem = -1;
	entries.forEach((entry, i) => {
		if (entry.kind !== "item" || !shown[i]) {
			return;
		}
		if (previousItem >= 0 && groupOf[previousItem] !== groupOf[i]) {
			let firstSeparator = -1;
			let anyShown = false;
			for (let k = previousItem + 1; k < i; k++) {
				if (entries[k].kind === "separator") {
					anyShown = anyShown || shown[k];
					firstSeparator = firstSeparator < 0 ? k : firstSeparator;
				}
			}
			if (!anyShown && firstSeparator >= 0) {
				shown[firstSeparator] = true;
			}
		}
		previousItem = i;
	});
}

function rowWidth(entries: IToolbarFitEntry[], shown: boolean[], gap: number, extra: number): number {
	let total = 0;
	let count = 0;
	for (let i = 0; i < entries.length; i++) {
		if (shown[i]) {
			total += entries[i].kind === "spacer" ? 0 : entries[i].width;
			count++;
		}
	}
	if (extra > 0) {
		total += extra;
		count++;
	}
	return total + Math.max(0, count - 1) * gap;
}

/** per entry: the index of the item a label captions, or -1 */
function captionTargets(entries: IToolbarFitEntry[]): number[] {
	return entries.map((entry, i) => {
		const next = entries[i + 1];
		const free = !entry.overflow || entry.overflow === "auto";
		return entry.label && free && next && next.kind === "item" && !next.label ? i + 1 : -1;
	});
}

/**
 * Decides which entries are displayed in the row and which go into the menu.
 * Items move from the end; pinned (`overflow: "never"`) items always stay;
 * `overflow: "always"` items are only in the menu. The moved items keep their
 * original order. A label is never listed in the menu: it is hidden, and a
 * caption label follows the item it captions.
 */
export function fitToolbarItems(input: IToolbarFitInput): IToolbarFitResult {
	const entries = input.entries;
	const collapsed = input.mode === "collapse" ||
		(input.mode === "menu" && typeof input.collapseWidth === "number" && input.available < input.collapseWidth);
	const captions = captionTargets(entries);

	const inRow = entries.map(entry => !entry.hidden && (entry.kind !== "item" || entry.overflow !== "always"));
	const inMenu = entries.map(entry => !entry.hidden && entry.kind === "item" && !entry.label && entry.overflow === "always");
	const move = (i: number) => {
		inRow[i] = false;
		inMenu[i] = !entries[i].label;
	};

	if (collapsed) {
		entries.forEach((entry, i) => {
			if (entry.kind === "item" && !entry.hidden && entry.overflow !== "never" && captions[i] < 0) {
				move(i);
			}
		});
	}

	const menuCount = () => inMenu.filter(Boolean).length;
	const settle = () => {
		const shown = inRow.slice();
		captions.forEach((target, i) => {
			if (target >= 0 && inMenu[target]) {
				shown[i] = false;             // its item moved into the menu
			}
		});
		dropLooseSeparators(entries, shown);
		return shown;
	};

	let shown = settle();
	if (input.mode === "menu" && !collapsed) {
		const fits = () => rowWidth(entries, shown, input.gap, menuCount() ? input.menuWidth : 0) <= input.available;
		for (let i = entries.length - 1; i >= 0 && !fits(); i--) {
			const entry = entries[i];
			if (entry.kind !== "item" || !inRow[i] || entry.overflow === "never" || captions[i] >= 0) {
				continue;
			}
			move(i);
			shown = settle();
		}
	}

	return { inRow: shown, inMenu, menu: menuCount() > 0, collapsed };
}

/** the descriptor kinds a moved item can take in the menu. */
export type ToolbarMenuForm = "action" | "check" | "submenu" | "choice" | "field" | "none";

/**
 * How an item of a given comp appears in the overflow menu:
 * - action: a plain menu item (button);
 * - check: a checkable item (toggle);
 * - submenu: the item's own menu items (dropdown);
 * - choice: a submenu of radio items (segmented, combo with options);
 * - field: an item that opens the real field in a popup (text, stepper,
 *   datepicker, combo without static options);
 * - none: not listed (label, separator, spacer).
 */
export function toolbarMenuForm(comp: string | undefined, hasOptions: boolean): ToolbarMenuForm {
	switch (comp || "button") {
		case "button":
			return "action";
		case "toggle":
			return "check";
		case "menu":
			return "submenu";
		case "segmented":
			return "choice";
		case "combo":
			return hasOptions ? "choice" : "field";
		case "text":
		case "stepper":
		case "datepicker":
			return "field";
		default:
			return "none";
	}
}
