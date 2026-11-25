import type { DatastoreItem, Id, Link, Task } from "../types/gantt_types";
import type { GanttInternal } from "../types/gantt_internal_types";
import type DatastoreInternal from "./datastore/datastore";

// Turns true when an item with `active: false` enters the store or is updated - also inside
// silent() - and false again only on clearAll(). A stale `true` costs a check, never a wrong answer.
function trackInactiveItems(store: DatastoreInternal): () => boolean {
	let found = false;
	// Not a listener: one attached later could still set `active` after a listener has read it
	store.$onItemWrite = function(item: DatastoreItem): void {
		if (item.active === false) found = true;
	};

	store.attachEvent("onClearAll", function(){
		found = false;
		return true;
	});

	return () => found;
}

// GS-3542. `active: false` switches off a task together with its branch. Most charts have no such
// task or link, and there the checks return before they read anything. Otherwise a task check walks
// up the parents; nothing is cached, so no edit can leave a stale answer behind.
export default function initTaskActivity(gantt: GanttInternal): void {
	const tasksStore = gantt.$data.tasksStore;
	const linksStore = gantt.$data.linksStore;
	const hasInactiveTasks = trackInactiveItems(tasksStore);
	const hasInactiveLinks = trackInactiveItems(linksStore);

	// The data parent, not getParent(): grouping renders tasks under virtual groups
	function isAncestryActive(task: Task, stopAtId?: Id): boolean {
		const rootId = tasksStore.$getRootId();
		let parentId: Id = task[tasksStore.$parentProperty];
		while (parentId !== undefined && parentId !== null && parentId != rootId && (stopAtId === undefined || parentId != stopAtId)) {
			const parent = tasksStore.getItem(parentId) as Task | undefined;
			if (!parent) return true;
			if (parent.active === false) return false;
			parentId = parent[tasksStore.$parentProperty];
		}
		return true;
	}

	gantt.isTaskActive = function(task: Task | Id): boolean {
		// An object can be detached from the store (a lightbox copy), so its own flag is always read
		const item = typeof task === "object" ? task : (task || task === 0 ? tasksStore.getItem(task) as Task : undefined);
		if (!item || item.active === false) return false;
		return !hasInactiveTasks() || isAncestryActive(item);
	};

	gantt.isLinkActive = function(link: Link | Id): boolean {
		const item = typeof link === "object" ? link : (link || link === 0 ? linksStore.getItem(link) as Link : undefined);
		if (!item || item.active === false) return false;
		return gantt.isTaskActive(item.source) && gantt.isTaskActive(item.target);
	};

	// For items that are in the stores: their flags passed the trackers, so while nothing is
	// inactive these return without reading the item. `stopAtId` is an ancestor known to be active.
	gantt._isStoredTaskActive = function(task: Task, stopAtId?: Id): boolean {
		return !hasInactiveTasks() || (task.active !== false && isAncestryActive(task, stopAtId));
	};

	gantt._isStoredLinkActive = function(link: Link): boolean {
		if (hasInactiveLinks() && link.active === false) return false;
		if (!hasInactiveTasks()) return true;
		const source = tasksStore.getItem(link.source) as Task | undefined;
		const target = tasksStore.getItem(link.target) as Task | undefined;
		return !!source && !!target && gantt._isStoredTaskActive(source) && gantt._isStoredTaskActive(target);
	};

	gantt._hasInactiveTasks = hasInactiveTasks;
}
