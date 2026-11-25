import { GanttStatic, Task, Link } from "../types/gantt_types";
import type { GanttInternal } from "../types/gantt_internal_types";

type Id = string | number;

type LinkMap = Record<string, Link>;
type TaskMap = Record<string, Task>;


function copyLinkIdsArray(gantt: GanttInternal, linkIds: Id[], targetHash: LinkMap): void {
	for (let i = 0; i < linkIds.length; i++) {
		if (gantt.isLinkExists(linkIds[i])) {
			targetHash[String(linkIds[i])] = gantt.getLink(linkIds[i]);
		}
	}
}

function copyLinkIds(gantt: GanttInternal, task: Task, targetHash: LinkMap): void {
	if (task.$source && task.$target){
		copyLinkIdsArray(gantt, task.$source, targetHash);
		copyLinkIdsArray(gantt, task.$target, targetHash);
	}
}

function getSubtreeLinks(gantt: GanttInternal, rootId: Id): LinkMap {
	const res: LinkMap = {};

	if (gantt.isTaskExists(rootId)) {
		copyLinkIds(gantt, gantt.getTask(rootId), res);
	}

	gantt.eachTask(function(child: Task) {
		copyLinkIds(gantt, child, res);
	}, rootId);

	return res;
}

function getSubtreeTasks(gantt: GanttStatic, rootId: Id): TaskMap {
	const res: TaskMap = {};

	gantt.eachTask(function(child) {
		res[String(child.id)] = child;
	}, rootId);

	return res;
}

export default {
	getSubtreeLinks,
	getSubtreeTasks
};
