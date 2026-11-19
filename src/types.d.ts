/**
 * Global types for dhtmlxGantt
 */

declare const VERSION: string;
declare const LICENSE: string;
declare const PRODUCTION: string;
declare const GPL: string;
declare const BUILD_TIMESTAMP: number;

declare type TaskID = number | string;
declare type LinkID = number | string;

type TaskType = "task" | "project" | "milestone";

type GanttPlugin = (gantt: any) => void;
interface IGanttInitializationConfig {
	container?: string|HTMLElement;
	config?: any;
	calendars?: ICalendarConfig[];
	templates?: any;
	events?: any;
	data?: any;
	plugins?: any;
	locale?: any;
}

type WorkdayConfig = boolean|number|string|CalendarHoursConfig[];
type CalendarHoursConfig = number|string;
type WorkDaysTuple = [WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig, WorkdayConfig];
type WorkDaysSettings = {
	weekdays: WorkDaysTuple,
	dates: {[date: string]: WorkdayConfig}
}

interface ICalendarWorktimes {
	hours: CalendarHoursConfig[];
	days: WorkDaysTuple | WorkDaysSettings;
}



interface ICalendarCustomWeekSettings extends Omit<ICalendarWorktimes, "hours">{
	from: Date;
	to: Date;
	// `false` gives the period no work hours, `true` or an absent value applies the hours of the calendar
	hours?: CalendarHoursConfig[] | boolean;
}

interface ICalendarWorktimeSettings extends ICalendarWorktimes{
	customWeeks?:{
		[name:string]:ICalendarCustomWeekSettings;
	};
}

interface ICalendarConfig {
	id: number | string;
	worktime: ICalendarWorktimeSettings;
}

interface IGanttFactory {
	plugin(plugin: GanttPlugin): void;
	getGanttInstance(settings?: IGanttInitializationConfig) : any;
}

interface ITask {
	id: TaskID;
	text: string;
	start_date: Date;
	end_date: Date;
	duration: number;
	progress: number;
	parent: TaskID;
	type: TaskType;
	constraint_type: ConstraintTypes;
	constraint_date: Date;
	auto_scheduling: boolean;
	$rendered_type: TaskType;
	$source: any[];
	$target: any[];
	$index: number;
	$level: number;
	$no_end: boolean;
	$no_start: boolean;
	$open: boolean;
	$rendered_parent: TaskID;
	$keep_constraints: boolean;
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

interface ILink {
	id: LinkID;
	source: TaskID;
	target: TaskID;
	type: LinkType;
	lag: number;
}

interface IConnectedGroup {
	tasks: TaskID[];
	links: LinkID[];
}

interface IConnectedGroupsDetailed {
	tasks: TaskID[];
	links: LinkID[];
	processedLinks: IInternalLink[];
}

/**
 * Internal representation of link, used for auto scheduling and graph network calculations
 */
interface IInternalLink {
	hashSum: string;
	id: LinkID;
	lag: number;
	sourceLag: number;
	targetLag: number;
	trueLag: number;
	link: LinkType;
	preferredStart: Date;
	source: TaskID;
	sourceParent: TaskID;
	target: TaskID;
	targetParent: TaskID;
	subtaskLink?: boolean;
}

interface IDurationFormatterLabel {
	full: string;
	plural: string;
	short: string;
}

interface IDurationFormatter {
	canParse(value: string) : boolean;
	format(value: number) : string;
	parse(value: string) : number;
}

interface ILinkFormatter {
	canParse(value: string) : boolean;
	format(value: ILink) : string;
	parse(value: string) : ILink;
}


interface IDurationFormatterConfig {
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

interface ILinkFormatterConfig {
	durationFormatter: IDurationFormatter;
	labels: {
		finish_to_finish: string,
		finish_to_start: string,
		start_to_start: string,
		start_to_finish: string
	};
}

interface ILinkFormatterConfig {
	durationFormatter: IDurationFormatter;
	labels: {
		finish_to_finish: string,
		finish_to_start: string,
		start_to_start: string,
		start_to_finish: string
	};
}

interface IQuickInfoContent {
	taskId?: TaskID;
	header?: {
		title: string,
		date: string
	};
	content?: string;
	buttons?: string[];
}


type MonthLabelList = [string, string, string, string, string, string, string, string, string, string, string, string];
type WeekDayLabelList = [string, string, string, string, string, string, string];

interface IGanttLocaleDate {
	month_full: MonthLabelList;
	month_short: MonthLabelList;
	day_full: WeekDayLabelList;
	day_short: WeekDayLabelList;
}

interface IGanttLocaleLabels {
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

	/* grid columns */
	column_wbs: string;
	column_text: string;
	column_start_date: string;
	column_duration: string;
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
}

interface IGanttLocale {
	date: IGanttLocaleDate;
	labels: IGanttLocaleLabels;
}