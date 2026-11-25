// import type * as PublicTypes from "./gantt_types";
import type {
  GanttStatic,
  GanttCallback,
  InlineEditorMethods,
  Id,
	Task,
	Link
} from "./gantt_types";

import type DatastoreInternal from "../core/datastore/datastore";
import type TreeDatastoreInternal from "../core/datastore/treedatastore";

export interface GanttInternal extends Omit <GanttStatic, "ext"> {
	attachEvent(name: string, callback: (...args: any[]) => any, settings?: any): string;
	callEvent(name: string, params: any[]): boolean | undefined;
	createDatastore(config: any): DatastoreInternal | TreeDatastoreInternal;
	getDatastore(name: string): DatastoreInternal | TreeDatastoreInternal;
	getState(name?: string): any;

	_clear_data(): void;
	_correct_dst_change(date: Date, prevOffset: number, step: number, unit: string): Date;
	_getAutoSchedulingConfig(): { schedule_on_parse?: boolean };
	_init_task_timing(task: Task): void;
	_is_icon_open_click(e: Event): boolean;
	_isAllowedUnscheduledTask(task: Task): boolean;
	_quickRefresh(callback: GanttCallback): void;
	_set_default_task_timing(task: Task): void;
	_update_flags(oldId: Id | null, newId: Id | null): void;
	_update_parents(id: Id, silent?: boolean, updateAll?: boolean, recalculateAll?: boolean): void;
	_isStoredTaskActive(task: Task, stopAtId?: Id): boolean;
	_canAddSubtask(item: Id | Task | null, viewConfig?: object, forRendering?: boolean): boolean;
	_isStoredLinkActive(link: Link): boolean;
	_hasInactiveTasks(): boolean;

	ext: Omit<GanttStatic["ext"], "inlineEditors"> & {
		inlineEditors: InlineEditorsWithMultiselect;
	};

	$data: {
		tasksStore: TreeDatastoreInternal,
		linksStore: DatastoreInternal,
		resourceStore?: TreeDatastoreInternal,
		assignmentsStore?: DatastoreInternal,
		baselineStore?: DatastoreInternal,
	};
	$destroyed?: boolean;

	$layout?: {
		resize(): void;
	};

	$services: ServicesInternal;

}

export interface GanttDataInternal {
	data: Task[];
	links: Link[] 
}

export interface StateServiceInternal {
	registerProvider(name: string, callback: () => Record<string, any>): void;
}

export interface ServicesInternal {
	// getService(name: "state"): StateServiceInternal;
	getService(name: string): any;
}

interface InlineEditorState {
	id: Id;
	columnName: string;
	placeholder?: HTMLElement;
}

interface InlineEditorCell {
	id: Id;
	columnName: string;
}

interface InlineEditorsWithMultiselect extends InlineEditorMethods {
	getState(): InlineEditorState;
	locateCell(node: HTMLElement): InlineEditorCell | null;
	getEditorConfig(columnName: string): unknown;
}
