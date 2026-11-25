/**
 * Global types for dhtmlxGantt
 */

import type {
  Id,
	SchedulingEngine,
	Task,
	LinkReference
} from "./types/gantt_types";

export type { LinkReference };

declare global {
	const VERSION: string;
	const LICENSE: string;
	const PRODUCTION: string;
	const GPL: string;
	const BUILD_TIMESTAMP: number;
}

declare type TaskID = Id;
declare type LinkID = Id;

export type TaskType = "task" | "project" | "milestone";

export type GanttPlugin = (gantt: any) => void;
export interface IGanttInitializationConfig {
	container?: string|HTMLElement;
	config?: any;
	calendars?: ICalendarConfig[];
	templates?: any;
	events?: any;
	data?: any;
	plugins?: any;
	locale?: any;
}

export type WorkdayConfig = boolean|number|string|CalendarHoursConfig[];
export type CalendarHoursConfig = number|string;
export type WorkDaysTuple = [WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig];
export type WorkDaysSettings = {
	weekdays: WorkDaysTuple,
	dates: {[date: string]: WorkdayConfig}
}

export interface ICalendarWorktimes {
	hours: CalendarHoursConfig[];
	days: WorkDaysTuple | WorkDaysSettings;
}



export interface ICalendarCustomWeekSettings extends Omit<ICalendarWorktimes, "hours">{
	from: Date;
	to: Date;
	// `false` gives the period no work hours, `true` or an absent value applies the hours of the calendar
	hours?: CalendarHoursConfig[] | boolean;
}

export interface ICalendarWorktimeSettings extends ICalendarWorktimes{
	customWeeks?:{
		[name:string]:ICalendarCustomWeekSettings;
	};
}

export interface ICalendarConfig {
	id: number | string;
	worktime: ICalendarWorktimeSettings;
}

export interface IGanttFactory {
	plugin(plugin: GanttPlugin): void;
	getGanttInstance(settings?: IGanttInitializationConfig) : any;
	/** Makes a scheduling engine selectable by name in `config.auto_scheduling.engine`. */
	registerSchedulingEngine(name: string, createEngine: () => SchedulingEngine): void;
}

export interface ITask extends Task {
	id: TaskID;
	text?: string;
	start_date: Date;
	end_date: Date;
	duration: number;
	progress: number;
	parent: TaskID;
	type?: TaskType;
	constraint_type?: ConstraintTypes | null;
	constraint_date?: Date | null;
	auto_scheduling?: boolean;
	$rendered_type: TaskType;
	$source: any[];
	$target: any[];
	$index: number;
	$level: number;
	$no_end: boolean;
	$no_start: boolean;
	$open: boolean;
	$rendered_parent: TaskID;
	$keep_constraints?: boolean;
}

declare enum LinkType {
	finish_to_start = "0",
	start_to_start = "1",
	finish_to_finish = "2",
	start_to_finish = "3"
}

declare enum ConstraintTypes {
	ASAP = "asap",
	// As Late As Possible (ALAP)
	ALAP = "alap",
	// Start No Earlier Than (SNET)
	SNET = "snet",
	// Start No Later Than (SNLT)
	SNLT = "snlt",
	// Finish No Earlier Than (FNET)
	FNET = "fnet",
	// Finish No Later Than (FNLT)
	FNLT = "fnlt",
	// Must Start On (MSO)
	MSO = "mso",
	// Must Finish On (MFO)
	MFO = "mfo"
}

export interface ILink {
	id: LinkID;
	source: TaskID;
	target: TaskID;
	type: LinkType;
	lag: number;
}

export interface IDurationFormatterLabel {
	full: string;
	plural: string;
	short: string;
}

export interface IDurationFormatter {
	canParse(value: string) : boolean;
	format(value: number) : string;
	parse(value: string) : number | null;
}

export interface ILinkFormatter {
	canParse(value: string) : boolean;
	format(value: ILink) : string;
	parse(value: string) : ILink | null;
}


export interface IDurationFormatterConfig {
	enter: string;
	store: string;
	format: string | string[];
	short: boolean;
	minutesPerHour: number;
	hoursPerDay: number;
	hoursPerWeek: number;
	daysPerMonth: number;
	daysPerYear: number;
	labels: { [unit: string]: IDurationFormatterLabel };
}

export interface ILinkFormatterConfig {
	durationFormatter: IDurationFormatter;
	labels: {
		finish_to_finish: string,
		finish_to_start: string,
		start_to_start: string,
		start_to_finish: string
	};
	/** @default "legacy" */
	reference?: LinkReference;
}

export interface IQuickInfoContent {
	taskId?: TaskID;
	header?: {
		title: string,
		date: string
	};
	content?: string;
	buttons?: string[];
}


export type MonthLabelList = [string, string, string, string, string, string, string, string, string, string, string, string];
export type WeekDayLabelList = [string, string, string, string, string, string, string];

export interface IGanttLocaleDate {
	month_full: MonthLabelList;
	month_short: MonthLabelList;
	day_full: WeekDayLabelList;
	day_short: WeekDayLabelList;
}

export interface IGanttLocaleLabels {
	new_task: string;
	icon_save: string;
	icon_cancel: string;
	icon_details: string;
	icon_edit: string;
	icon_delete: string;
	confirm_deleting: string;
	section_description: string;
	section_time: string;
	section_type: string;
	section_deadline: string;
	section_baselines: string;
	section_new_resources: string;
	/* advanced task form - optional until every locale carries them */
	section_progress?: string;
	section_predecessors?: string;
	section_successors?: string;
	section_resources?: string;
	section_effort_driven?: string;
	section_wbs?: string;
	section_auto_scheduling?: string;
	section_unscheduled?: string;
	section_hide_bar?: string;
	section_rollup?: string;
	section_priority?: string;
	section_calendar?: string;
	calendar_none?: string;
	tab_general?: string;
	tab_predecessors?: string;
	tab_successors?: string;
	tab_resources?: string;
	tab_advanced?: string;
	task_form_link_id?: string;
	task_form_link_task?: string;
	task_form_link_type?: string;
	task_form_link_lag?: string;
	task_form_add_predecessor?: string;
	task_form_add_successor?: string;
	task_form_no_predecessors?: string;
	task_form_no_successors?: string;
	task_form_select_task?: string;
	task_form_remove_row?: string;
	task_form_error_cycle?: string;

	/* effort-driven tasks */
	section_work: string;
	section_scheduling_mode: string;
	fixed_duration: string;
	fixed_units: string;
	fixed_work: string;

	/* grid columns */
	column_wbs: string;
	column_text: string;
	column_start_date: string;
	column_duration: string;
	column_predecessors: string;
	column_successors: string;
	column_work: string;
	column_add: string;

	/* link confirmation */
	link: string;
	confirm_link_deleting: string;
	link_start: string;
	link_end: string;

	type_task: string;
	type_project: string;
	type_milestone: string;

	minutes: string;
	hours: string;
	days: string;
	weeks: string;
	months: string;
	years: string;

	/* message popup */
	message_ok: string;
	message_cancel: string;

	/* constraints */
	section_constraint: string;
	constraint_type: string;
	constraint_date: string;
	asap: string;
	alap: string;
	snet: string;
	snlt: string;
	fnet: string;
	fnlt: string;
	mso: string;
	mfo: string;

	/* auto-scheduling conflict dialog (GS-1557): {name} placeholders are filled by gantt */
	as_conflict_title: string;
	as_conflict_intro_many: string;
	as_conflict_text_start: string;
	as_conflict_text_start_many: string;
	as_conflict_text_finish: string;
	as_conflict_text_finish_many: string;
	as_conflict_link_from: string;
	as_conflict_link_to: string;
	as_conflict_link_between: string;
	as_conflict_links_unknown: string;
	as_conflict_and: string;
	as_conflict_question: string;
	as_conflict_adjust: string;
	as_conflict_adjust_many: string;
	as_conflict_deactivate: string;
	as_conflict_remove: string;
	as_conflict_remove_many: string;
	as_conflict_keep: string;
	as_conflict_keep_many: string;
	as_conflict_apply: string;
	as_conflict_cancel: string;
	as_conflict_link_unmet: string;
	as_conflict_loop: string;

	/* resource control */
	resources_add_button: string;
	resources_filter_placeholder: string;
	resources_filter_label: string;
	resources_section_placeholder: string;
	/* empty state screen */
	empty_state_text_link: string;
	empty_state_text_description: string;

	/* baselines control */
	baselines_section_placeholder: string;
	baselines_add_button: string;
	baselines_remove_button: string;
	baselines_remove_all_button: string;

	/* deadline control */
	deadline_enable_button: string;
	deadline_disable_button: string;

	/* ui core control kit (optional: runtime falls back to English) */
	ui_combo_no_results?: string;
	ui_datepicker_today?: string;
	ui_datepicker_clear?: string;
	ui_datepicker_prev_month?: string;
	ui_datepicker_next_month?: string;
	ui_stepper_increment?: string;
	ui_stepper_decrement?: string;

	/* context-menu built-ins (optional: falls back to English) */
	ui_menu_edit?: string;
	ui_menu_add?: string;
	ui_menu_add_child?: string;
	ui_menu_add_before?: string;
	ui_menu_add_after?: string;
	ui_menu_add_predecessor?: string;
	ui_menu_add_successor?: string;
	ui_menu_convert_to_milestone?: string;
	ui_menu_convert_to_task?: string;
	ui_menu_indent?: string;
	ui_menu_outdent?: string;
	ui_menu_cut?: string;
	ui_menu_copy?: string;
	ui_menu_paste_child?: string;
	ui_menu_paste_after?: string;
	ui_menu_clear_clipboard?: string;
	ui_menu_split?: string;
	ui_menu_unsplit?: string;
	ui_menu_complete?: string;
	ui_menu_rollup?: string;
	ui_menu_hide_bar?: string;
	ui_menu_delete?: string;
	ui_menu_delete_link?: string;
	ui_menu_deactivate_link?: string;
	ui_menu_activate_link?: string;
	ui_menu_add_task?: string;
	ui_menu_expand_all?: string;
	ui_menu_collapse_all?: string;
	ui_menu_sort_asc?: string;
	ui_menu_sort_desc?: string;
	ui_menu_hide_column?: string;

	/* toolbar + context-menu composition surface (optional: falls back to English) */
	ui_toolbar_label?: string;
	ui_toolbar_add_task?: string;
	ui_toolbar_undo?: string;
	ui_toolbar_redo?: string;
	ui_toolbar_zoom_in?: string;
	ui_toolbar_zoom_out?: string;
	ui_toolbar_zoom_level?: string;
	ui_toolbar_expand_all?: string;
	ui_toolbar_collapse_all?: string;
	ui_toolbar_today?: string;
	ui_toolbar_critical_path?: string;
	ui_toolbar_fullscreen?: string;
	ui_toolbar_theme?: string;
	ui_toolbar_more?: string;
	ui_toolbar_menu?: string;
	ui_menu_theme?: string;
	ui_theme_light?: string;
	ui_theme_dark?: string;
	ui_theme_high_contrast?: string;
	ui_theme_contrast_light?: string;
	ui_theme_contrast_dark?: string;
	ui_theme_auto?: string;

	/* screen reader (ARIA) labels */
	aria_grid: string;
	aria_dialog_lightbox: string;
	aria_dialog_quickinfo: string;
	aria_sort_ascending: string;
	aria_sort_descending: string;
	aria_resource_load: string;
	aria_resource_load_date: string;
	aria_resource_hours_date: string;
	aria_task_duration: string;
	aria_task_progress: string;
	aria_toggle_row: string;
	aria_link_finish_to_start: string;
	aria_link_start_to_start: string;
	aria_link_finish_to_finish: string;
	aria_link_start_to_finish: string;
}

export interface IGanttLocale {
	date: IGanttLocaleDate;
	labels: IGanttLocaleLabels;
}