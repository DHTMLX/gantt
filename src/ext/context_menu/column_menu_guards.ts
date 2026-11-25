import type { IMenuItem } from "../../core/ui/controls/types";

interface ColumnVisibilityGuard {
	blocked: boolean;
	hideColumn?: string;
}

interface ColumnGuard extends ColumnVisibilityGuard {
	applicationDisabled?: boolean;
}

interface ResolvedColumnItem {
	item: IMenuItem;
	guard: ColumnGuard;
}

type ResolvedColumnItems = ReadonlyMap<IMenuItem["id"], ResolvedColumnItem>;
export type ColumnMenuGuards = ReadonlyMap<IMenuItem, ColumnVisibilityGuard>;

const columnGuards = new WeakMap<IMenuItem, ColumnGuard>();

export function dataColumns(gantt: any): any[] {
	return (gantt.getGridColumns() || []).filter((column: any) => column.name !== "add");
}

export function guardColumnItem(item: IMenuItem, guard: ColumnGuard): void {
	columnGuards.set(item, guard);
	// Descriptor copies carry application disables, so a visibility guard cannot become permanent.
	Object.defineProperty(item, "disabled", {
		enumerable: !!guard.applicationDisabled,
		configurable: true,
		get: () => guard.blocked || guard.applicationDisabled,
		set: (disabled: boolean | undefined) => {
			guard.applicationDisabled = disabled;
			Object.defineProperty(item, "disabled", { enumerable: !!disabled });
		}
	});
}

export function mergeContextMenuItem(base: IMenuItem, override: IMenuItem): IMenuItem {
	const item = Object.assign({}, base, override);
	const guard = columnGuards.get(base);
	if (guard) {
		guardColumnItem(item, { ...guard, applicationDisabled: override.disabled ?? guard.applicationDisabled });
	}
	return item;
}

function visitItems(items: IMenuItem[], visit: (item: IMenuItem) => void): void {
	for (const item of items) {
		visit(item);
		if (item.items) {
			visitItems(item.items, visit);
		}
	}
}

export function collectColumnGuards(items: IMenuItem[]): ResolvedColumnItems {
	const resolved = new Map<IMenuItem["id"], ResolvedColumnItem>();
	visitItems(items, (item) => {
		const guard = columnGuards.get(item);
		if (guard) {
			resolved.set(item.id, { item, guard });
		}
	});
	return resolved;
}

export function bindColumnGuards(items: IMenuItem[], resolved: ResolvedColumnItems): ColumnMenuGuards {
	const entries = new Map<IMenuItem, ColumnVisibilityGuard>();
	visitItems(items, (item) => {
		const original = resolved.get(item.id);
		if (original) {
			// Only descriptors resolved for this opening can share their original guard.
			const { blocked, hideColumn } = original.guard;
			entries.set(item, item === original.item ? original.guard : { blocked, hideColumn });
		}
	});
	return entries;
}

export function resolveColumnItemDisabled(item: IMenuItem, entries: ColumnMenuGuards): boolean | undefined {
	const guard = entries.get(item);
	const descriptorGuard = columnGuards.get(item);
	if (!guard && !descriptorGuard) {
		return undefined;
	}
	return !!guard?.blocked || !!(descriptorGuard ? descriptorGuard.applicationDisabled : item.disabled);
}

export function refreshColumnMenuItems(gantt: any, entries: ColumnMenuGuards): void {
	if (!entries.size) {
		return;
	}
	const visible = new Set(dataColumns(gantt).map((column) => column.name));
	entries.forEach((guard, item) => {
		guard.blocked = guard.hideColumn === undefined
			? visible.size === 1 && visible.has(item.id)
			: visible.size <= 1 || !visible.has(guard.hideColumn);
	});
}
