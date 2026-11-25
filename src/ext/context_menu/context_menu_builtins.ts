/**
 * Context-menu built-in registry (design 02-context-menu-api.md §3 + 08 §6).
 *
 * Each built-in is a dumb record keyed by name; it owns:
 *   zones     — which zones it is valid in
 *   hidden    — degradation / readonly filtering (item omitted)
 *   disabled  — render but non-actionable (indent/outdent at an edge)
 *   resolve   — the IMenuItem descriptor (single, a submenu, or an array the
 *               plugin spreads — e.g. the header column list)
 *   action    — run on selection of the built-in item or one of its submenu
 *               leaves (the selected leaf is passed in)
 *
 * Rendering is the shipped Menu control; these records add gantt behavior.
 */
import { IMenuItem } from "../../core/ui/controls/types";
import { uiLabel } from "../../core/ui/controls/common";
import { DEFAULT_THEMES } from "../../core/ui/controls/toolbar_builtins";
import treeHelpers from "../../utils/task_tree_helpers";
import { getGanttUiKit } from "../../core/ui/gantt_ui_kit";
import { ContextZone } from "./zones";
import type { Id, Task } from "../../types/gantt_types";
import { dataColumns, guardColumnItem } from "./column_menu_guards";

export interface IContextMenuEventContext {
	zone: ContextZone;
	id: string | number | null;
	task?: any;
	link?: any;
	area?: "grid" | "timeline";
	date?: Date;
	column?: string | null;
	items: IMenuItem[];
	event: any;
	x: number;
	y: number;
}

export interface IContextMenuBuiltin {
	name: string;
	zones: ContextZone[];
	hidden?(gantt: any, ctx: IContextMenuEventContext): boolean;
	disabled?(gantt: any, ctx: IContextMenuEventContext): boolean;
	resolve(gantt: any, ctx: IContextMenuEventContext): IMenuItem | IMenuItem[];
	action?(gantt: any, ctx: IContextMenuEventContext, item: IMenuItem): void;
}

const ICON = {
	edit: "dhx_gantt_icon dhx_gantt_icon_edit",
	add: "dhx_gantt_icon dhx_gantt_icon_plus",
	indent: "dhx_gantt_icon dhx_gantt_icon_indent",
	outdent: "dhx_gantt_icon dhx_gantt_icon_outdent",
	del: "dhx_gantt_icon dhx_gantt_icon_delete",
	theme: "dhx_gantt_icon dhx_gantt_icon_contrast",
	check: "dhx_gantt_icon dhx_gantt_icon_check",
	expand: "dhx_gantt_icon dhx_gantt_icon_expand_all",
	collapse: "dhx_gantt_icon dhx_gantt_icon_collapse_all",
	predecessor: "dhx_gantt_icon dhx_gantt_icon_predecessor",
	successor: "dhx_gantt_icon dhx_gantt_icon_successor",
	subtask: "dhx_gantt_icon dhx_gantt_icon_subtask",
	cut: "dhx_gantt_icon dhx_gantt_icon_cut",
	copy: "dhx_gantt_icon dhx_gantt_icon_copy",
	pasteChild: "dhx_gantt_icon dhx_gantt_icon_paste_child",
	pasteAfter: "dhx_gantt_icon dhx_gantt_icon_paste_after",
	clipboardClear: "dhx_gantt_icon dhx_gantt_icon_clipboard_clear",
	milestone: "dhx_gantt_icon dhx_gantt_icon_milestone",
	task: "dhx_gantt_icon dhx_gantt_icon_task",
	split: "dhx_gantt_icon dhx_gantt_icon_split",
	unsplit: "dhx_gantt_icon dhx_gantt_icon_unsplit",
	linkOff: "dhx_gantt_icon dhx_gantt_icon_link_off",
	sortAsc: "dhx_gantt_icon dhx_gantt_icon_sort_asc",
	sortDesc: "dhx_gantt_icon dhx_gantt_icon_sort_desc",
	eyeOff: "dhx_gantt_icon dhx_gantt_icon_eye_off",
	taskAbove: "dhx_gantt_icon dhx_gantt_icon_task_above",
	taskBelow: "dhx_gantt_icon dhx_gantt_icon_task_below"
};

function readonly(gantt: any, ctx: IContextMenuEventContext): boolean {
	if (gantt.config.readonly) {
		return true;
	}
	if (ctx.zone === "task" && ctx.id != null) {
		return !!gantt.isReadonly(ctx.id);
	}
	if (ctx.zone === "link" && ctx.id != null && gantt.isLinkExists(ctx.id)) {
		return !!gantt.isReadonly(gantt.getLink(ctx.id));
	}
	return false;
}

function contextTask(gantt: any, ctx: IContextMenuEventContext): any {
	if (ctx.task) {
		return ctx.task;
	}
	return (ctx.id != null && gantt.isTaskExists(ctx.id)) ? gantt.getTask(ctx.id) : null;
}

function isMilestone(gantt: any, task: any): boolean {
	return !!task && task.type == gantt.config.types.milestone;
}

function createLinkedTask(gantt: any, ctx: IContextMenuEventContext, before: boolean): void {
	const targetId = ctx.id;
	const task = gantt.getTask(targetId);
	const id = gantt.createTask({}, task.parent, gantt.getTaskIndex(targetId) + (before ? 0 : 1));
	if (id === null || id === undefined) {
		return;
	}

	function addLink(): void {
		if (!gantt.isTaskExists(id) || !gantt.isTaskExists(targetId)) {
			return;
		}
		gantt.addLink({
			source: before ? id : targetId,
			target: before ? targetId : id,
			type: gantt.config.links.finish_to_start
		});
	}

	// with details_on_create the task is only parked in the store until its lightbox
	// is saved; linking it now would leave a link pointing at nothing if the user
	// cancels, because cancelling drops the task without the link cleanup
	if (gantt.isTaskExists(id) && gantt.getTask(id).$new) {
		const handlers: any[] = [];
		const stop = () => handlers.forEach((h) => gantt.detachEvent(h));
		handlers.push(gantt.attachEvent("onAfterTaskAdd", (addedId: any) => {
			if (addedId == id) {
				stop();
				addLink();
			}
			return true;
		}));

		handlers.push(gantt.attachEvent("onLightboxCancel", () => { stop(); return true; }));
		handlers.push(gantt.attachEvent("onLightboxDelete", () => { stop(); return true; }));
		return;
	}
	addLink();
}

function eachOpen(gantt: any, open: boolean): void {
	gantt.eachTask((task: any) => { task.$open = open; });
	gantt.render();
}

/* ---------------- clipboard (cut / copy / paste) ---------------- */

interface IMenuClipboard {
	mode: "cut" | "copy";
	id: Id;
	task: Task;
}

function clipboard(gantt: any): IMenuClipboard | null {
	const clip = gantt.$menuClipboard;
	return clip && gantt.isTaskExists(clip.id) && gantt.getTask(clip.id) === clip.task ? clip : null;
}

export function clipboardMark(gantt: any, taskId: string | number): string {
	const clip = gantt.$menuClipboard;
	if (!clip || String(clip.id) !== String(taskId) || !clipboard(gantt)) {
		return "";
	}
	return (clip.mode === "cut") ? "gantt_menu_cut" : "gantt_menu_copied";
}

function setClipboard(gantt: any, mode: "cut" | "copy", id: string | number): void {
	const previous = clipboard(gantt);
	gantt.$menuClipboard = { mode, id, task: gantt.getTask(id) };
	if (previous && String(previous.id) !== String(id)) {
		gantt.refreshTask(previous.id);
	}
	gantt.refreshTask(id);
}

export function clearClipboard(gantt: any): void {
	const clip = clipboard(gantt);
	gantt.$menuClipboard = null;
	if (clip) {
		gantt.refreshTask(clip.id);
	}
}

export function discardRemovedClipboard(gantt: any): void {
	if (gantt.$menuClipboard && !clipboard(gantt)) {
		gantt.$menuClipboard = null;
	}
}

function taskSeed(gantt: any, task: any): any {
	const seed = gantt.copy(task);
	Object.keys(seed).forEach((key) => {
		if (key.charAt(0) === "$" || key === "id" || key === "parent") {
			delete seed[key];
		}
	});
	return seed;
}

/**
 * Copy a whole branch under `parentId`. Links are recreated only when both ends
 * are inside the branch - keeping a link to the original would silently
 * reschedule the source side.
 */
function copyBranch(gantt: any, rootId: string | number, parentId: string | number, index?: number): void {
	const links = treeHelpers.getSubtreeLinks(gantt, rootId);
	const idMap = new Map<string, Id>();
	const rootCopy = taskSeed(gantt, gantt.getTask(rootId));
	const descendants: { id: Id; parent: Id; seed: any }[] = [];
	// The destination can be in the source subtree, so collect every copy before inserting.
	gantt.eachTask((child: any) => {
		descendants.push({ id: child.id, parent: child.parent, seed: taskSeed(gantt, child) });
	}, rootId);

	rootCopy.id = gantt.uid();
	gantt.addTask(rootCopy, parentId, index);
	if (!gantt.isTaskExists(rootCopy.id)) {
		return;
	}
	idMap.set(String(rootId), rootCopy.id);

	for (const child of descendants) {
		const parent = idMap.get(String(child.parent));
		if (parent === undefined || !gantt.isTaskExists(parent)) {
			continue;
		}
		child.seed.id = gantt.uid();
		gantt.addTask(child.seed, parent);
		if (gantt.isTaskExists(child.seed.id)) {
			idMap.set(String(child.id), child.seed.id);
		}
	}

	Object.keys(links).forEach((key) => {
		const link = links[key];
		const source = idMap.get(String(link.source));
		const target = idMap.get(String(link.target));
		if (source !== undefined && target !== undefined && gantt.isTaskExists(source) && gantt.isTaskExists(target)) {
			gantt.addLink({ source, target, type: link.type, lag: link.lag });
		}
	});
}

function pasteFromClipboard(gantt: any, parentId: string | number, index?: number): void {
	const clip = clipboard(gantt);
	if (!clip) {
		return;
	}
	gantt.batchUpdate(() => {
		if (clip.mode === "cut") {
			// moveTask interprets the index after it removes the source from its old position.
			let destination = index === undefined ? -1 : index;
			if (String(gantt.getParent(clip.id)) === String(parentId) && gantt.getTaskIndex(clip.id) < destination) {
				destination--;
			}
			gantt.moveTask(clip.id, destination, parentId);
		} else {
			copyBranch(gantt, clip.id, parentId, index);
		}
		if (gantt.isTaskExists(parentId)) {
			gantt.open(parentId);
		}
	});
	clearClipboard(gantt);
}

function pasteBlocked(gantt: any, ctx: IContextMenuEventContext): boolean {
	const clip = clipboard(gantt);
	if (!clip) {
		return true;
	}
	return clip.mode === "cut" && (gantt.isReadonly(clip.id) || String(clip.id) === String(ctx.id) || gantt.isChildOf(ctx.id, clip.id));
}

/* ---------------- split / unsplit ---------------- */

function splitPoint(gantt: any, ctx: IContextMenuEventContext, task: any): Date | null {
	if (!gantt.$splitTaskSupported || !ctx.date || !task || gantt.hasChild(task.id) || task.render === "split") {
		return null;
	}
	const cut = new Date(ctx.date);
	const start = task.start_date;
	const end = task.end_date;
	if (!(start < cut && cut < end)) {
		return null;
	}
	return gantt.calculateDuration(start, cut, task) > 0 && gantt.calculateDuration(cut, end, task) > 0 ? cut : null;
}

/** the split task the menu should act on: the target itself or its parent */
function splitRoot(gantt: any, ctx: IContextMenuEventContext): any {
	const task = contextTask(gantt, ctx);
	if (!task) {
		return null;
	}
	if (task.render === "split") {
		return task;
	}
	if (gantt.isTaskExists(task.parent) && gantt.getTask(task.parent).render === "split") {
		return gantt.getTask(task.parent);
	}
	return null;
}

function editableSplitRoot(gantt: any, ctx: IContextMenuEventContext): Task | null {
	if (readonly(gantt, ctx) || !gantt.$splitTaskSupported) {
		return null;
	}
	const root = splitRoot(gantt, ctx);
	if (!root || gantt.isReadonly(root)) {
		return null;
	}

	let hasReadonlyPart = false;
	gantt.eachTask((part: Task) => {
		hasReadonlyPart ||= !!gantt.isReadonly(part);
	}, root.id);
	return hasReadonlyPart ? null : root;
}

function unsplitTask(gantt: any, task: any): void {
	gantt.batchUpdate(() => {
		gantt.getChildren(task.id).slice().forEach((childId: any) => {
			if (gantt.isTaskExists(childId)) {
				gantt.deleteTask(childId);
			}
		});
		delete task.render;
		task.type = gantt.config.types.task;
		gantt.updateTask(task.id);
	});
}

function columnConfig(gantt: any, name: string): any {
	const columns = gantt.config.columns || [];
	for (let i = 0; i < columns.length; i++) {
		if (columns[i].name == name) {
			return columns[i];
		}
	}
	return null;
}

function sortMethod(gantt: any, name: string): any {
	const config = columnConfig(gantt, name);
	if (config && config.sort !== undefined && config.sort !== true) {
		return config.sort || null;
	}
	return name;
}

function sortHidden(gantt: any, ctx: IContextMenuEventContext): boolean {
	return !gantt.config.sort || !ctx.column || !sortMethod(gantt, ctx.column);
}

function applySort(gantt: any, column: string, desc: boolean): void {
	gantt._sort = { name: column, direction: desc ? "desc" : "asc" };
	gantt.sort(sortMethod(gantt, column), desc);
}

function columnHideSupported(gantt: any): boolean {
	return !!gantt.$columnHideSupported;
}

/** resolve built-in names into submenu leaves (used by the `add` container) */
function resolveSubmenu(gantt: any, ctx: IContextMenuEventContext, names: string[]): IMenuItem[] {
	const items: IMenuItem[] = [];
	names.forEach((name) => {
		if (name === "|") {
			items.push({ separator: true });
			return;
		}
		const builtin = REGISTRY[name];
		if (!builtin || (builtin.hidden && builtin.hidden(gantt, ctx))) {
			return;
		}
		const resolved = builtin.resolve(gantt, ctx);
		const disabled = !!(builtin.disabled && builtin.disabled(gantt, ctx));
		(Array.isArray(resolved) ? resolved : [resolved]).forEach((one) => {
			if (disabled) {
				one.disabled = true;
			}
			items.push(one);
		});
	});
	return items;
}

const ADD_SUBMENU = ["add_child", "add_before", "add_after", "|", "add_predecessor", "add_successor"];

function ganttUiLabel(gantt: any, key: string): string {
	return uiLabel(getGanttUiKit(gantt).context, key);
}

export function contextMenuLabel(gantt: any): string {
	return ganttUiLabel(gantt, "ui_toolbar_menu");
}

function themeLabel(gantt: any, t: any): string {
	if (t.label) {
		return ganttUiLabel(gantt, t.label);
	}
	if (t.contrast) {
		return ganttUiLabel(gantt, "ui_theme_high_contrast");
	}
	return ganttUiLabel(gantt, (t.mode === "dark") ? "ui_theme_dark" : "ui_theme_light");
}

function columnLabel(gantt: any, col: any): string {
	const labels = (gantt.locale && gantt.locale.labels) || {};
	const raw = (typeof col.label === "string" && col.label) ? col.label : (labels["column_" + col.name] || labels[col.name]);
	const text = raw ? String(raw).replace(/<[^>]*>/g, "").trim() : "";
	return text || String(col.name);
}

function confirmDelete(gantt: any, text: string, title: string | undefined, run: () => void): void {
	const opts: any = { text: text, callback: (result: boolean) => { if (result) { run(); } } };
	if (title) {
		opts.title = title;
	}
	gantt.confirm(opts);
}

const BUILTINS: IContextMenuBuiltin[] = [
	{
		name: "edit",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "edit", label: ganttUiLabel(gantt, "ui_menu_edit"), icon: ICON.edit }),
		action: (gantt, ctx) => { gantt.showLightbox(ctx.id); }
	},
	{
		name: "add_child",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "add_child", label: ganttUiLabel(gantt, "ui_menu_add_child"), icon: ICON.subtask }),
		action: (gantt, ctx) => { gantt.createTask({}, ctx.id); }
	},
	{
		name: "add_after",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "add_after", label: ganttUiLabel(gantt, "ui_menu_add_after"), icon: ICON.taskBelow }),
		action: (gantt, ctx) => {
			const task = gantt.getTask(ctx.id);
			gantt.createTask({}, task.parent, gantt.getTaskIndex(ctx.id) + 1);
		}
	},
	{
		name: "add_before",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "add_before", label: ganttUiLabel(gantt, "ui_menu_add_before"), icon: ICON.taskAbove }),
		action: (gantt, ctx) => {
			const task = gantt.getTask(ctx.id);
			gantt.createTask({}, task.parent, gantt.getTaskIndex(ctx.id));
		}
	},
	{
		name: "add_predecessor",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({
			id: "add_predecessor", label: ganttUiLabel(gantt, "ui_menu_add_predecessor"), icon: ICON.predecessor
		}),
		action: (gantt, ctx) => { createLinkedTask(gantt, ctx, true); }
	},
	{
		name: "add_successor",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({
			id: "add_successor", label: ganttUiLabel(gantt, "ui_menu_add_successor"), icon: ICON.successor
		}),
		action: (gantt, ctx) => { createLinkedTask(gantt, ctx, false); }
	},
	{
		name: "add",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt, ctx) => ({
			id: "add",
			label: ganttUiLabel(gantt, "ui_menu_add"),
			icon: ICON.add,
			items: resolveSubmenu(gantt, ctx, ADD_SUBMENU)
		}),
		action: (gantt, ctx, item) => {
			const leaf = (item && item.id != null) ? REGISTRY[String(item.id)] : undefined;
			if (leaf && leaf.action) {
				leaf.action(gantt, ctx, item);
			}
		}
	},
	{
		name: "convert_to_milestone",
		zones: ["task"],
		hidden: (gantt, ctx) => {
			if (readonly(gantt, ctx)) {
				return true;
			}
			const task = contextTask(gantt, ctx);
			return !task || task.type == gantt.config.types.project || !!gantt.hasChild(task.id);
		},
		resolve: (gantt, ctx) => ({
			id: "convert_to_milestone",
			label: ganttUiLabel(gantt, isMilestone(gantt, contextTask(gantt, ctx))
				? "ui_menu_convert_to_task" : "ui_menu_convert_to_milestone"),
			icon: isMilestone(gantt, contextTask(gantt, ctx)) ? ICON.task : ICON.milestone
		}),
		action: (gantt, ctx) => {
			const task = gantt.getTask(ctx.id);
			if (isMilestone(gantt, task)) {
				task.type = gantt.config.types.task;
				task.duration = task.duration || 1;
				task.end_date = gantt.calculateEndDate(task);
			} else {
				task.type = gantt.config.types.milestone;
				task.duration = 0;
				task.end_date = new Date(task.start_date);
			}
			gantt.updateTask(task.id);
		}
	},
	{
		name: "indent",
		zones: ["task"],
		hidden: readonly,
		disabled: (gantt, ctx) => !gantt.getPrevSibling(ctx.id),
		resolve: (gantt) => ({ id: "indent", label: ganttUiLabel(gantt, "ui_menu_indent"), icon: ICON.indent }),
		action: (gantt, ctx) => {
			const prev = gantt.getPrevSibling(ctx.id);
			if (prev) {
				gantt.moveTask(ctx.id, -1, prev);
				// a leaf that just became a parent is collapsed, which would hide the
				// task the user has just moved
				gantt.open(prev);
				gantt.render();
			}
		}
	},
	{
		name: "outdent",
		zones: ["task"],
		hidden: readonly,
		disabled: (gantt, ctx) => {
			const parent = gantt.getParent(ctx.id);
			return !parent || parent == gantt.config.root_id;
		},
		resolve: (gantt) => ({ id: "outdent", label: ganttUiLabel(gantt, "ui_menu_outdent"), icon: ICON.outdent }),
		action: (gantt, ctx) => {
			const parent = gantt.getParent(ctx.id);
			if (parent && parent != gantt.config.root_id) {
				const grandparent = gantt.getParent(parent);
				const parentIndex = gantt.getTaskIndex(parent);
				gantt.moveTask(ctx.id, parentIndex + 1, grandparent);
				gantt.render();
			}
		}
	},
	{
		name: "cut",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "cut", label: ganttUiLabel(gantt, "ui_menu_cut"), icon: ICON.cut }),
		action: (gantt, ctx) => {
			const task = contextTask(gantt, ctx);
			if (task) {
				setClipboard(gantt, "cut", task.id);
			}
		}
	},
	{
		name: "copy",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "copy", label: ganttUiLabel(gantt, "ui_menu_copy"), icon: ICON.copy }),
		action: (gantt, ctx) => {
			const task = contextTask(gantt, ctx);
			if (task) {
				setClipboard(gantt, "copy", task.id);
			}
		}
	},
	{
		name: "clear_clipboard",
		zones: ["task", "empty"],
		hidden: (gantt, ctx) => readonly(gantt, ctx) || !clipboard(gantt),
		resolve: (gantt) => ({
			id: "clear_clipboard", label: ganttUiLabel(gantt, "ui_menu_clear_clipboard"), icon: ICON.clipboardClear
		}),
		action: (gantt) => { clearClipboard(gantt); }
	},
	{
		name: "paste_child",
		zones: ["task"],
		hidden: readonly,
		disabled: pasteBlocked,
		resolve: (gantt) => ({ id: "paste_child", label: ganttUiLabel(gantt, "ui_menu_paste_child"), icon: ICON.pasteChild }),
		action: (gantt, ctx) => {
			const task = contextTask(gantt, ctx);
			if (task) {
				pasteFromClipboard(gantt, task.id);
			}
		}
	},
	{
		name: "paste_after",
		zones: ["task"],
		hidden: readonly,
		disabled: pasteBlocked,
		resolve: (gantt) => ({ id: "paste_after", label: ganttUiLabel(gantt, "ui_menu_paste_after"), icon: ICON.pasteAfter }),
		action: (gantt, ctx) => {
			const task = contextTask(gantt, ctx);
			if (!task) {
				return;
			}
			pasteFromClipboard(gantt, task.parent, gantt.getTaskIndex(task.id) + 1);
		}
	},
	{
		name: "split",
		zones: ["task"],
		hidden: (gantt, ctx) => readonly(gantt, ctx) || !splitPoint(gantt, ctx, contextTask(gantt, ctx)),
		resolve: (gantt) => ({ id: "split", label: ganttUiLabel(gantt, "ui_menu_split"), icon: ICON.split }),
		action: (gantt, ctx) => {
			const task = contextTask(gantt, ctx);
			const cut = splitPoint(gantt, ctx, task);
			if (!cut) {
				return;
			}
			gantt.batchUpdate(() => {
				const left = taskSeed(gantt, task);
				left.id = gantt.uid();
				left.end_date = cut;
				left.type = gantt.config.types.task;

				const right = taskSeed(gantt, task);
				right.id = gantt.uid();
				right.start_date = cut;
				right.type = gantt.config.types.task;

				task.render = "split";
				task.type = gantt.config.types.project;
				gantt.updateTask(task.id);
				gantt.close(task.id);

				gantt.addTask(left, task.id);
				gantt.addTask(right, task.id);
			});
		}
	},
	{
		name: "unsplit",
		zones: ["task"],
		hidden: (gantt, ctx) => !editableSplitRoot(gantt, ctx),
		resolve: (gantt) => ({ id: "unsplit", label: ganttUiLabel(gantt, "ui_menu_unsplit"), icon: ICON.unsplit }),
		action: (gantt, ctx) => {
			const root = editableSplitRoot(gantt, ctx);
			if (root) {
				unsplitTask(gantt, root);
			}
		}
	},
	{
		name: "complete",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt, ctx) => ({
			id: "complete",
			label: ganttUiLabel(gantt, "ui_menu_complete"),
			checked: contextTask(gantt, ctx) ? contextTask(gantt, ctx).progress === 1 : false
		}),
		action: (gantt, ctx, item) => {
			const task = gantt.getTask(ctx.id);
			task.progress = item.checked ? 1 : 0;
			gantt.updateTask(task.id);
		}
	},
	{
		name: "rollup",
		zones: ["task"],
		hidden: (gantt, ctx) => readonly(gantt, ctx) || !gantt.$rollupSupported,
		resolve: (gantt, ctx) => ({
			id: "rollup",
			label: ganttUiLabel(gantt, "ui_menu_rollup"),
			checked: !!(contextTask(gantt, ctx) || {}).rollup
		}),
		action: (gantt, ctx, item) => {
			const task = gantt.getTask(ctx.id);
			task.rollup = !!item.checked;
			gantt.updateTask(task.id);
		}
	},
	{
		name: "hide_bar",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt, ctx) => ({
			id: "hide_bar",
			label: ganttUiLabel(gantt, "ui_menu_hide_bar"),
			checked: !!(contextTask(gantt, ctx) || {}).hide_bar
		}),
		action: (gantt, ctx, item) => {
			const task = gantt.getTask(ctx.id);
			task.hide_bar = !!item.checked;
			gantt.updateTask(task.id);
		}
	},
	{
		name: "delete",
		zones: ["task"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "delete", label: ganttUiLabel(gantt, "ui_menu_delete"), icon: ICON.del }),
		action: (gantt, ctx) => {
			const labels = gantt.locale.labels;
			confirmDelete(gantt, labels.confirm_deleting, labels.confirm_deleting_title,
				() => {
					if (gantt.isTaskExists(ctx.id) && !readonly(gantt, ctx)) {
						gantt.deleteTask(ctx.id);
					}
				});
		}
	},
	{
		// GS-1557: switch a dependency off and on again, e.g. one deactivated to resolve a scheduling conflict
		name: "deactivate_link",
		zones: ["link"],
		hidden: (gantt, ctx) => readonly(gantt, ctx) || ctx.id == null || !gantt.isLinkExists(ctx.id),
		resolve: (gantt, ctx) => {
			// the link's own flag: isLinkActive() is also false for a link to an inactive task
			const active = gantt.getLink(ctx.id).active !== false;
			return active
				? { id: "deactivate_link", label: ganttUiLabel(gantt, "ui_menu_deactivate_link"), icon: ICON.eyeOff }
				: { id: "deactivate_link", label: ganttUiLabel(gantt, "ui_menu_activate_link"), icon: ICON.check };
		},
		action: (gantt, ctx) => {
			if (!gantt.isLinkExists(ctx.id) || readonly(gantt, ctx)) {
				return;
			}
			const link = gantt.getLink(ctx.id);
			// undo records an update against the link state it stored last, as for a lightbox save
			if (gantt.ext && gantt.ext.undo && gantt.ext.undo.saveState) {
				gantt.ext.undo.saveState(link.id, (gantt.config.undo_types && gantt.config.undo_types.link) || "link");
			}
			// a copy, so that a cancelled update leaves the link as it is
			gantt.updateLink(link.id, { ...link, active: link.active === false });
		}
	},
	{
		name: "delete_link",
		zones: ["link"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "delete_link", label: ganttUiLabel(gantt, "ui_menu_delete_link"), icon: ICON.linkOff }),
		action: (gantt, ctx) => {
			const labels = gantt.locale.labels;
			const link = gantt.getLink(ctx.id);
			const desc = gantt.templates.link_description ? gantt.templates.link_description(link) : "";
			const text = (labels.link || "") + " " + desc + " " + (labels.confirm_link_deleting || "");
			confirmDelete(gantt, text, undefined, () => {
				if (gantt.isLinkExists(ctx.id) && !readonly(gantt, ctx)) {
					gantt.deleteLink(ctx.id);
				}
			});
		}
	},
	{
		name: "add_task",
		zones: ["empty"],
		hidden: readonly,
		resolve: (gantt) => ({ id: "add_task", label: ganttUiLabel(gantt, "ui_menu_add_task"), icon: ICON.add }),
		action: (gantt, ctx) => {
			gantt.createTask(ctx.date ? { start_date: ctx.date } : {});
		}
	},
	{
		name: "expand_all",
		zones: ["empty"],
		resolve: (gantt) => ({ id: "expand_all", label: ganttUiLabel(gantt, "ui_menu_expand_all"), icon: ICON.expand }),
		action: (gantt) => { eachOpen(gantt, true); }
	},
	{
		name: "collapse_all",
		zones: ["empty"],
		resolve: (gantt) => ({ id: "collapse_all", label: ganttUiLabel(gantt, "ui_menu_collapse_all"), icon: ICON.collapse }),
		action: (gantt) => { eachOpen(gantt, false); }
	},
	{
		name: "sort_asc",
		zones: ["header"],
		hidden: sortHidden,
		resolve: (gantt) => ({ id: "sort_asc", label: ganttUiLabel(gantt, "ui_menu_sort_asc"), icon: ICON.sortAsc }),
		action: (gantt, ctx) => { applySort(gantt, String(ctx.column), false); }
	},
	{
		name: "sort_desc",
		zones: ["header"],
		hidden: sortHidden,
		resolve: (gantt) => ({ id: "sort_desc", label: ganttUiLabel(gantt, "ui_menu_sort_desc"), icon: ICON.sortDesc }),
		action: (gantt, ctx) => { applySort(gantt, String(ctx.column), true); }
	},
	{
		name: "hide_column",
		zones: ["header"],
		hidden: (gantt, ctx) => !columnHideSupported(gantt) || !ctx.column || ctx.column === "add",
		resolve: (gantt, ctx) => {
			const item = { id: "hide_column", label: ganttUiLabel(gantt, "ui_menu_hide_column"), icon: ICON.eyeOff };
			const visible = dataColumns(gantt);
			const columnName = String(ctx.column);
			guardColumnItem(item, {
				blocked: visible.length <= 1 || !visible.some((column) => column.name === columnName),
				hideColumn: columnName
			});
			return item;
		},
		action: (gantt, ctx) => {
			const col = gantt.getGridColumn(String(ctx.column));
			if (col && !col.hide && dataColumns(gantt).length > 1) {
				col.hide = true;
				gantt.render();
			}
		}
	},
	{
		name: "theme",
		zones: ["task", "link", "empty", "header"],
		resolve: (gantt) => ({
			id: "theme",
			label: ganttUiLabel(gantt, "ui_menu_theme"),
			icon: ICON.theme,
			// radio: one theme at a time, so picking one closes the menu
			items: DEFAULT_THEMES.filter((t) => t.mode !== "auto").map((t): IMenuItem => ({
				id: t.id,
				label: themeLabel(gantt, t),
				checked: gantt.skin === t.id,
				radio: true
			}))
		}),
		action: (gantt, _ctx, item) => {
			if (item && item.id != null && typeof gantt.setSkin === "function") {
				gantt.setSkin(String(item.id));
			}
		}
	},
	{
		name: "columns",
		zones: ["header"],
		hidden: (gantt) => !columnHideSupported(gantt),
		resolve: (gantt) => {
			const columns = gantt.config.columns || [];
			const visible: Record<string, boolean> = {};
			dataColumns(gantt).forEach((c: any) => { visible[c.name] = true; });
			// checkable items keep the menu open, so several columns can be
			// toggled without reopening it
			const visibleCount = Object.keys(visible).length;
			return columns
				.filter((c: any) => c.name !== "add")
				.map((c: any): IMenuItem => {
					const item: IMenuItem = {
						id: c.name,
						label: columnLabel(gantt, c),
						checked: !!visible[c.name]
					};
					guardColumnItem(item, { blocked: !!visible[c.name] && visibleCount === 1, applicationDisabled: false });
					return item;
				});
		},
		action: (gantt, _ctx, item) => {
			const col = gantt.getGridColumn(String(item.id));
			if (!col) {
				return;
			}
			
			if (!col.hide && dataColumns(gantt).length <= 1) {
				item.checked = true;
				return;
			}
			col.hide = !col.hide;
			gantt.render();
		}
	}
];

const REGISTRY: Record<string, IContextMenuBuiltin> = {};
BUILTINS.forEach((b) => { REGISTRY[b.name] = b; });

export function getContextMenuBuiltin(name: string): IContextMenuBuiltin | undefined {
	return REGISTRY[name];
}

/** defaults per zone (what `true`/unset gives). */
export const DEFAULT_CONTEXT_MENUS: Record<ContextZone, string[]> = {
	task: ["edit", "|", "add", "|", "convert_to_milestone", "|", "indent", "outdent", "|", "delete"],
	link: ["deactivate_link", "delete_link"],
	empty: ["add_task", "|", "expand_all", "collapse_all"],
	header: ["sort_asc", "sort_desc", "|", "hide_column", "|", "columns"]
};
