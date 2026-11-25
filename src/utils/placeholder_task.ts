import { GanttInternal } from "../types/gantt_internal_types";
import { IGanttConfig } from "../core/common/config";
import TreeDatastoreInternal from "../core/datastore/treedatastore";

/**
 * Check the over task or draggble task is placeholder task
 */

interface CustomConfig {
	placeholder_task?: IGanttConfig["placeholder_task"];
	types?: IGanttConfig["types"];
}

export default function isPlaceholderTask(
	id: string | number,
	gantt: GanttInternal | null,
	store: TreeDatastoreInternal,
	config?: IGanttConfig | CustomConfig
): boolean {
	const actualConfig = gantt ? gantt.config : config;
	if (actualConfig && actualConfig.placeholder_task) {
		if (store.exists(id)) {
			const item = store.getItem(id);
			if (item){
				return item.type === actualConfig.types?.placeholder;
			}
		}
	}
	return false;
};