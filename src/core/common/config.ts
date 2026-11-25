import type { Scale, TimeUnit } from "./scale_types";
import type { GanttConfigOptions } from "../../types/gantt_types";

type Align = "left" | "center" | "right";
type SectionType = "textarea"
					| "time"
					| "duration"
					| "select"
					| "typeselect"
					| "parent"
					| "template"
					| "checkbox"
					| "radio"
					| "resources"
					| "constraint";

type LightboxSection = Array<ILightboxSection
	| ILightboxTimeAndDurationSection
	| ILightboxInputControl
	| ILightboxSelectControl
	| ILightboxParentControl
	| ILightboxTypeselectControl>;

type LayoutView = "grid"
	| "timeline"
	| "resizer"
	| "scrollbar"
	| "resourceGrid"
	| "resourceTimeline";

interface IColumnItem {
	name: string;
	label?: string;
	tree?: boolean;
	align?: Align;
	hide?: boolean;
	max_width?: number;
	min_width?: number;
	resize?: boolean;
	template?: (obj: any) => string;
	width?: number | "*";
}

export type TModifierKeys = "metaKey" | "ctrlKey" | "altKey" | "shiftKey" | false | undefined;

interface ILightboxSection {
	name: string;
	map_to: string;
	type: SectionType;
	height?: number;
	focus?: boolean;
}

interface ILightboxTimeAndDurationSection extends ILightboxSection {
	readonly: boolean;
	year_range: number[] | number;
	single_date: boolean;
	time_format: string;
}

interface ILightboxInputControl extends ILightboxSection {
	default_value?: any;
	options?: Array<{key: string, label: string}>;
}

interface ILightboxSelectControl extends ILightboxInputControl {
	onchange: () => boolean | undefined;
}

interface ILightboxParentControl extends ILightboxSection {
	allow_root: boolean;
	root_label: string;
	sort?: (a: any, b: any) => -1 | 0 | 1;
	filter?: (task: string | number | object) => boolean;
	template?: (start: Date, end: Date, ev: object) => string;
}

interface ILightboxTypeselectControl extends ILightboxSection {
	filter?: (typeName: string) => boolean;
}


interface ILayoutScrollbar {
	view: "scrollbar";
	scroll?: "x" | "y";
	id: string;
	height?: number;
	width?: number;
}

interface ILayoutView {
	view: LayoutView;
	id?: string;
	scrollX?: string;
	scrollY?: string;
	config?: object;
}

interface ILayoutGrid extends ILayoutView {
	view: "grid";
	bind?: string;
}

interface ILayoutTimeline extends ILayoutView {
	view: "timeline";
	bindLinks?: string;
	layers?: any[];
}

interface ILayoutResizer {
	view?: undefined;
	resizer: boolean;
	width: number;
}

interface ILayoutResourceGrid extends ILayoutView {
	view: "resourceGrid";
	width: number;
	group: "string";
}

interface ILayoutResourceTimeline extends ILayoutView {
	view: "resourceTimeline";
	width: number;
	group: "string";
}

interface ILayoutHtml {
	html: string;
	css: string;
	width: number;
}

type LayoutRow = ILayoutGrid
	| ILayoutTimeline
	| ILayoutResizer
	| ILayoutResourceGrid
	| ILayoutResourceTimeline
	| ILayoutHtml
	| ILayoutScrollbar
	| { cols: LayoutCol[] };

type LayoutCol = ILayoutGrid
	| ILayoutTimeline
	| ILayoutResizer
	| ILayoutResourceGrid
	| ILayoutResourceTimeline
	| ILayoutHtml
	| ILayoutScrollbar
	| { rows: LayoutRow[] };

interface ILayout {
	css: string;
	rows?: LayoutRow[];
	cols?: LayoutCol[];
}

// "auto" is kept for backward compatibility; it no longer affects date formatting.
type TCsp = boolean | "auto";

export interface IAccessibilityConfig {
	aria: boolean;
	announcements: boolean;
	grid_semantics: boolean;
	colorblind_friendly?: boolean;
	increase_contrast?: boolean;
}

interface IResourceConfig {
	dataprocessor_assignments?: boolean;
	dataprocessor_resources?: boolean;
	editable_resource_diagram?: boolean;
	resource_store?: {
		type?: "treeDataStore"|"dataStore"|string;
		fetchTasks?: boolean;
		initItem?: (item: any) => any;
	};
	lightbox_resources?: (resources: any[]) => any[];

}

/**
 * Effort-driven tasks config
 */
interface IEffortConfig {
	/** master switch; `false` -> feature inert. Default `false`. */
	enabled: boolean;
	/** which axis is held constant. Default `"fixed_duration"`. */
	mode: "fixed_duration" | "fixed_units" | "fixed_work";
	/** keep Work constant when assignments change. Default `false`. */
	effort_driven: boolean;
	/** unit of `task.work` and of assignment `value` (per day). Default `"hour"`. */
	work_unit: TimeUnit;
	/** `work_unit` per full day. Default `8`. */
	hours_per_day: number;
}

export interface IGanttConfig {
	layout: ILayout;
	links: {
		finish_to_start: "0";
		start_to_start: "1";
		finish_to_finish: "2";
		start_to_finish: "3";
	};
	types: {
		task: string;
		project: string;
		milestone: string;
		placeholder: string;
		[typeName: string]: string | number | undefined
	};
	auto_types: boolean;
	duration_unit: TimeUnit;
	work_time: boolean;
	correct_work_time: boolean;
	deadlines: boolean;
	leveling_delays: boolean;
	skip_off_time: boolean;
	cascade_delete: boolean;
	autosize: boolean | string;
	autoscroll: boolean;
	show_links: boolean;
	show_task_cells: boolean;
	autosize_min_width: number;
	autoscroll_speed: number;
	deepcopy_on_parse: boolean;
	static_background: boolean;
	static_background_cells: boolean;
	branch_loading: boolean;
	branch_loading_property: string;
	show_loading: boolean;
	show_chart: boolean;
	show_grid: boolean;
	min_duration: number;
	date_format: string; // use instead xml_date
	xml_date?: string; // deprecated
	start_on_monday: boolean;
	server_utc: boolean;
	show_progress: boolean;
	fit_tasks: boolean;
	select_task: boolean;
	scroll_on_click: boolean;
	smart_rendering: boolean;
	preserve_scroll: boolean;
	readonly: boolean;
	container_resize_timeout: number;

	/*grid */
	date_grid: string;

	drag_links: boolean;
	drag_progress: boolean;
	drag_resize: boolean;
	drag_project: boolean;
	drag_move: boolean;
	drag_mode: {
		resize: "resize",
		progress: "progress",
		move: "move",
		ignore: "ignore"
	};
	round_dnd_dates: boolean;
	link_wrapper_width: number;
	root_id: string | number;

	link_arrow_size:number;

	autofit: boolean;
	columns: IColumnItem[];

	/* scale*/
	scales: Scale[];

	scale_offset_minimal: boolean;

	inherit_scale_class: boolean;


	time_step: number;
	duration_step: number;


	task_date: string;
	time_picker: string;
	task_attribute: string;
	link_attribute: string;
	layer_attribute: string;
	buttons_left: string[];
	_migrate_buttons: {
		dhx_save_btn: "gantt_save_btn",
		dhx_cancel_btn: "gantt_cancel_btn",
		dhx_delete_btn: "gantt_delete_btn"
	};

	buttons_right: string[];


	lightbox: {
		sections?: LightboxSection,
		project_sections?: LightboxSection,
		milestone_sections?: LightboxSection
	};
	drag_lightbox: boolean;
	sort: boolean;
	details_on_create: boolean;
	details_on_dblclick: boolean;
	initial_scroll: boolean;
	task_scroll_offset: number;

	order_branch: boolean;
	order_branch_free: boolean;

	// task_height is deprecated, use 'bar_height` instead
	task_height: number | "full" | undefined;
	bar_height: number | "full";
	min_column_width: number;
	bar_height_padding: number,
	row_height: number,

	// min width for grid column (when resizing)
	min_grid_column_width: number;
	// name of the attribute with column index for resize element
	grid_resizer_column_attribute: string;
	// name of the attribute with column index for resize element
	// grid_resizer_attribute: string; // usage of this parameter is not found

	// grid width can be increased after the column has been resized
	keep_grid_width: boolean;

	// grid width can be adjusted
	grid_resize: boolean;
	grid_elastic_columns: boolean;
	show_tasks_outside_timescale: boolean;
	show_unscheduled: boolean;
	readonly_property: string;
	editable_property: string;
	calendar_property: string;
	resource_calendars: object;
	dynamic_resource_calendars: boolean;
	inherit_calendar: boolean;
	type_renderers: object;

	resize_rows: boolean;
	// name of the attribute with row index for resize element
	task_grid_row_resizer_attribute: string;
	// min height for row (when resizing)
	min_task_grid_row_height: number;

	open_tree_initially: boolean;
	optimize_render: boolean;
	prevent_default_scroll: boolean;
	show_errors: boolean;
	wai_aria_attributes?: boolean;
	accessibility: IAccessibilityConfig;
	smart_scales: boolean;
	rtl: boolean;
	placeholder_task: boolean | object;
	horizontal_scroll_key: TModifierKeys;
	drag_timeline: {
		useKey: TModifierKeys;
		ignore: string;
		render?: boolean;
	};
	drag_multiple: boolean;
	/**
	 * @deprecated for date formatting. Date parsing/formatting is always CSP-safe and no longer
	 * depends on this option. The value is still read as a secure-environment hint by the lightbox.
	 */
	csp: TCsp;

	resources?: false | IResourceConfig;

	auto_scheduling: object;

	effort: IEffortConfig;

	// TODO : consolidate IGanttConfig and GanttConfigOptions types
	auto_scheduling_compatibility?: boolean;
	baselines: any;
	click_drag: boolean | undefined;
	constraint_types: any;
	container_resize_method: any;
	editor_types : any;
	end_date: any;
}

/** new objects of the default lightbox sections of each task type */
export function defaultLightboxSections(): GanttConfigOptions["lightbox"] {
	return {
		sections: [
			{ name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
			{ name: "time", type: "duration", map_to: "auto" }
		],
		project_sections: [
			{ name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
			{ name: "type", type: "typeselect", map_to: "type" },
			{ name: "time", type: "duration", readonly: true, map_to: "auto" }
		],
		milestone_sections: [
			{ name: "description", height: 70, map_to: "text", type: "textarea", focus: true },
			{ name: "type", type: "typeselect", map_to: "type" },
			{ name: "time", type: "duration", single_date: true, map_to: "auto" }
		]
	};
}

// TODO : consolidate IGanttConfig and GanttConfigOptions types
export default () => {
	const result: GanttConfigOptions = {
		layout: {
			css: "gantt_container",
			rows: [
				{
					cols: [
						{ view: "grid", scrollX: "scrollHor", scrollY: "scrollVer" },
						{ resizer: true, width: 1 },
						{ view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
						{ view: "scrollbar", id: "scrollVer" }
					]
				},
				{ view: "scrollbar", id: "scrollHor", height: 20 }
			]
		},
		links: {
			finish_to_start: "0",
			start_to_start: "1",
			finish_to_finish: "2",
			start_to_finish: "3"
		},
		types: {
			task: "task",
			project: "project",
			milestone: "milestone",
			placeholder: "placeholder"
		},
		auto_types: false,
		duration_unit: "day",
		work_time: false,
		correct_work_time: false,
		skip_off_time: false,

		cascade_delete: true,

		autosize: false,
		autosize_min_width: 0,
		autoscroll: true,
		autoscroll_speed: 30,
		deepcopy_on_parse: false,
		show_links: true,
		show_task_cells: true,
		// replace backgroung of the task area with a canvas img
		static_background: false,
		static_background_cells: true,
		branch_loading: false,
		branch_loading_property: "$has_child",
		show_loading: false,
		show_chart: true,
		show_grid: true,
		min_duration: 60 * 60 * 1000,
		date_format: "%d-%m-%Y %H:%i", // use instead xml_date
		xml_date: undefined, // "%d-%m-%Y %H:%i", // deprecated
		start_on_monday: true,
		server_utc: false,
		show_progress: true,
		fit_tasks: false,
		select_task: true,
		scroll_on_click: true,
		smart_rendering: true,
		preserve_scroll: true,
		readonly: false,
		container_resize_timeout: 20,
		deadlines: true,
		leveling_delays: false,

		/*grid */
		date_grid: "%Y-%m-%d",

		drag_links: true,
		drag_progress: true,
		drag_resize: true,
		drag_project: false,
		drag_move: true,
		drag_mode: {
			resize: "resize",
			progress: "progress",
			move: "move",
			ignore: "ignore"
		},
		round_dnd_dates: true,
		link_wrapper_width: 20,
		link_arrow_size: 12,
		root_id: 0,

		autofit: false, // grid column automatic fit grid_width config
		columns: [
			{ name: "text", tree: true, width: "*", resize: true },
			{ name: "start_date", align: "center", resize: true },
			{ name: "duration", align: "center" },
			{ name: "add", width: 44 }
		],

		/*scale*/
		scale_offset_minimal: true,
		inherit_scale_class: false,

		scales: [
			{
				unit: "day",
				step: 1,
				date: "%d %M"
			}
		],

		time_step: 60,
		duration_step: 1,
		task_date: "%d %F %Y",
		time_picker: "%H:%i",
		task_attribute: "data-task-id",
		link_attribute: "data-link-id",
		layer_attribute: "data-layer",
		buttons_left: [
			"gantt_save_btn",
			"gantt_cancel_btn"
		],
		_migrate_buttons: {
			dhx_save_btn: "gantt_save_btn",
			dhx_cancel_btn: "gantt_cancel_btn",
			dhx_delete_btn: "gantt_delete_btn"
		},
		buttons_right: [
			"gantt_delete_btn"
		],
		lightbox: defaultLightboxSections(),
		drag_lightbox: true,
		sort: false,
		details_on_create: true,
		details_on_dblclick: true,
		initial_scroll: true,
		task_scroll_offset: 100,

		order_branch: false,
		order_branch_free: false,

		// task height is deprecated, use 'bar_height' instead
		task_height: undefined, // number px of 'full' for row height
		bar_height: "full",
		bar_height_padding: 9,
		min_column_width: 70,

		// min width for grid column (when resizing)
		min_grid_column_width: 70,
		// name of the attribute with column index for resize element
		grid_resizer_column_attribute: "data-column-index",
		// name of the attribute with column index for resize element
		// grid_resizer_attribute: "grid_resizer", // - usage of this parameter is not found in code

		// grid width can be increased after the column has been resized
		keep_grid_width: false,

		// grid width can be adjusted
		grid_resize: false,
		grid_elastic_columns: false,
		show_tasks_outside_timescale: false,
		show_unscheduled: true,

		resize_rows: false,
		// name of the attribute with row index for resize element
		task_grid_row_resizer_attribute: "data-row-index",
		// min height for row (when resizing)
		min_task_grid_row_height: 30,
		row_height: 36,

		//
		readonly_property: "readonly",
		editable_property: "editable",
		calendar_property: "calendar_id",
		resource_calendars: {},
		dynamic_resource_calendars: false,
		inherit_calendar: false,
		type_renderers: {},

		open_tree_initially: false,
		optimize_render: true,
		prevent_default_scroll: false,
		show_errors: true,
		wai_aria_attributes: undefined,
		accessibility: {
			aria: true,
			announcements: true,
			grid_semantics: true,
			colorblind_friendly: false,
			increase_contrast: false
		},
		smart_scales: true,
		rtl: false,
		placeholder_task: false,
		horizontal_scroll_key: "shiftKey",
		drag_timeline: {
			useKey: undefined,
			ignore: ".gantt_task_line, .gantt_task_link",
			render: false
		},
		drag_multiple: true,
		csp: "auto",
		auto_scheduling: {},
		// unset on purpose: runtime distinguishes "not configured" from an explicit value (GS-2083)
		auto_scheduling_compatibility: undefined,
		effort: {
			enabled: false,
			mode: "fixed_duration",
			effort_driven: false,
			work_unit: "hour",
			hours_per_day: 8
		},

		baselines: false,
		click_drag: undefined,
		constraint_types: undefined,
		container_resize_method: undefined,
		editor_types: {
			text: undefined,
			number: undefined,
			duration: undefined,
			date: undefined,
			select: undefined,
			predecessor: undefined
		},
		end_date: undefined,
		external_render: undefined,
		grid_width: undefined,
		highlight_critical_path: undefined,
		inline_editors_date_processing: undefined,
		inline_editors_multiselect_open: undefined,
		keyboard_navigation: undefined,
		keyboard_navigation_cells: undefined,
		link_line_width: undefined,
		link_radius: undefined,
		multiselect: undefined,
		multiselect_one_level: undefined,
		open_split_tasks: undefined,
		process_resource_assignments: true,
		project_end: undefined,
		project_start: undefined,
		quick_info_detached: undefined,
		quickinfo_buttons: undefined,
		redo: undefined,
		reorder_grid_columns: undefined,
		resource_assignment_store: "resourceAssignments",
		resource_attribute: undefined,
		resource_property: "owner_id",
		resource_render_empty_cells: false,
		resource_store: "resource",
		resources: false,
		scale_height: undefined,
		schedule_from_end: undefined,
		scroll_size: 15,
		show_empty_state: false,
		show_markers: undefined,
		show_quick_info: undefined,
		start_date: undefined,
		timeline_placeholder: false,
		tooltip_hide_timeout: undefined,
		tooltip_offset_x: undefined,
		tooltip_offset_y: undefined,
		tooltip_timeout: undefined,
		touch: true,
		touch_drag: 75,
		touch_feedback: true,
		touch_feedback_duration: 1,
		undo: undefined,
		undo_actions: undefined,
		undo_steps: undefined,
		undo_types: undefined,
		wheel_scroll_sensitivity: undefined,
		wide_form: false
	};
	return result;
};
