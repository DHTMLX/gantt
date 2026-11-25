/**
 * Public contracts of the UI-core control kit (design §6.2).
 * These are designed as public API from day one (decision D5):
 * they will be exposed via gantt.ext.ui and typed in gantt_types.ts.
 */

/** Base contract implemented by every kit member. */
export interface IUIComponent {
	mount(target: HTMLElement): void;
	focus(): void;
	destroy(): void;
	setDisabled(flag: boolean): void;
	getRootNode(): HTMLElement | null;
}

/** Value-bearing controls. Only these are eligible for registry adapters. */
export interface IUIControl<TValue> extends IUIComponent {
	getValue(): TValue;
	setValue(value: TValue): void;
	onChange(handler: (value: TValue) => void): void;
}

export interface IUIOption {
	key: string | number;
	label: string;
	/** semantic or product-resolved icon class, e.g. "dhx_ui_icon dhx_ui_icon_edit" */
	icon?: string;
	/** optional product-owned class applied to the option row */
	css?: string;
}

export interface IButtonConfig {
	label?: string;
	/** css class part of an icon glyph from icons.less, e.g. "gantt_close" */
	icon?: string;
	variant?: "primary" | "outline" | "danger" | "link";
	onClick?: (e: Event) => void;
	ariaLabel?: string;
}

export interface ITextInputConfig {
	placeholder?: string;
	multiline?: boolean;
	/** rows for multiline mode */
	rows?: number;
	maxLength?: number;
}

export interface INumberStepperConfig {
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
	ariaLabel?: string;
	// ArrowUp/ArrowDown step the value (default true). Disabled by the grid
	// inline editor so the arrows fall through to keyboard-navigation row
	// movement (parity with the legacy number editor). The +/- buttons always step.
	stepOnArrowKeys?: boolean;
}

export interface IComboConfig {
	options?: IUIOption[];
	placeholder?: string;
	/** whether typing filters options (default true) */
	filtering?: boolean;
	/** legacy-compatible option row height in pixels */
	optionHeight?: number;
	/** allow empty value; renders a clear affordance */
	allowClear?: boolean;
	/**
	 * async options provider — called with the current search query on open and
	 * on each (debounced) keystroke; returns options (or a Promise of them). When
	 * set, filtering is delegated to the provider (no client-side filtering) and a
	 * loading state shows while it resolves. Stale responses are discarded.
	 */
	dataProvider?: (query: string) => IUIOption[] | Promise<IUIOption[]>;
	/** debounce in ms for `dataProvider` calls while typing (default 200) */
	debounce?: number;
	/**
	 * a mouse click in the text field opens the full list, as on a native select.
	 * Off by default: in a grid inline editor, a click and Enter must finish the edit
	 * rather than pick the first option of an open list
	 */
	openOnClick?: boolean;
}

export interface IDatePickerConfig {
	/**
	 * date format string understood by gantt.date. Defaults to
	 * gantt.config.date_grid (the grid display format) — NOT date_format, which
	 * is the backend parse format. By default the DatePicker is calendar-only
	 * (D3); pair it with TimeInput for a split date+time layout, or set
	 * `withTime` for a single combined date+time input (see below).
	 */
	format?: string;
	min?: Date;
	max?: Date;
	/** mark non-working days in the calendar using the worktime API (default true when work_time is enabled) */
	markNonWorkTime?: boolean;
	placeholder?: string;
	/**
	 * combine date + time in this ONE control: the masked input gains time slots
	 * (HH:MM(+AM/PM)) and the calendar popup gains a time-picker section, editing
	 * a full Date. Use it where a split DatePicker+TimeInput is too wide (e.g. a
	 * grid cell). The lightbox keeps the split layout. Default false (calendar-only).
	 */
	withTime?: boolean;
	/** time format for the `withTime` slots; 12h/24h derived from it, defaults to gantt.config.time_picker */
	timeFormat?: string;
	/** rounding step (minutes) for the `withTime` popup time columns, defaults to gantt.config.time_step */
	timeStep?: number;
}

export interface ITimeInputConfig {
	/**
	 * time format string understood by gantt.date, defaults to
	 * gantt.config.time_picker. 24h vs 12h (AM/PM) is derived from it —
	 * the same source the legacy time picker reads.
	 */
	format?: string;
	/** rounding granularity in minutes on commit, defaults to gantt.config.time_step */
	step?: number;
	/** earliest selectable minute of day (inclusive) */
	min?: number;
	/** latest selectable minute of day (inclusive) */
	max?: number;
	placeholder?: string;
	/**
	 * show the multi-column (hours · minutes · optional AM/PM) dropdown selector
	 * and its clock toggle (Phase 2). Defaults to true; set false for a masked
	 * text-only field.
	 */
	dropdown?: boolean;
}

/**
 * DateTimePicker — a calendar-only DatePicker composed with an optional
 * TimeInput, merging into a single Date value (migration Step 6, §S6.3).
 * `showTime` decides whether the time half is rendered; the built-in
 * lightbox sections derive it through `showTimeInput()` (duration_unit +
 * explicit section time_format). Pair the DatePicker's date part with the
 * TimeInput's minutes-past-midnight losslessly.
 */
export interface IDateTimePickerConfig {
	/** date display/parse format for the calendar half; defaults to gantt.config.date_grid */
	dateFormat?: string;
	/** time format for the time half; 12h/24h derived from it, defaults to gantt.config.time_picker */
	timeFormat?: string;
	/** rounding step (minutes) for the time half; defaults to gantt.config.time_step */
	timeStep?: number;
	/** earliest/latest selectable minute of day, forwarded to TimeInput */
	minTime?: number;
	maxTime?: number;
	/** render the time half; when false the control is date-only (time part of the value is preserved) */
	showTime?: boolean;
	min?: Date;
	max?: Date;
	/** mark non-working days in the calendar (forwarded to the DatePicker) */
	markNonWorkTime?: boolean;
	placeholder?: string;
}

export interface ITabsConfig {
	tabs: IUIOption[];
	/** initially active tab key; defaults to the first tab */
	active?: string | number;
}

export interface ICheckboxGroupConfig {
	options: IUIOption[];
	/** render as a single checkbox when one option is given and singleValue is true */
	singleValue?: boolean;
}

export interface IRadioGroupConfig {
	options: IUIOption[];
	name?: string;
}

export interface IFieldConfig {
	label?: string;
	description?: string;
	required?: boolean;
}

export interface IToggleConfig {
	label?: string;
	icon?: string;
	ariaLabel?: string;
	/** initial pressed state */
	pressed?: boolean;
}

export interface ISwitchConfig {
	label?: string;
	ariaLabel?: string;
}

/**
 * Menu item descriptor — dumb serializable object (design D7):
 * no function-valued properties; activation is reported via
 * Menu config.onSelect / the "onSelect" event.
 */
export interface IMenuItem {
	id?: string | number;
	label?: string;
	/** css class part of an icon glyph from icons.less */
	icon?: string;
	disabled?: boolean;
	separator?: boolean;
	/**
	 * turns the item into a checkable one (role=menuitemcheckbox): the tick is
	 * drawn from this state, and picking the item toggles it in place without
	 * closing the menu — so several items can be toggled in one opening.
	 */
	checked?: boolean;
	radio?: boolean;
	/** submenu items (any nesting depth) */
	items?: IMenuItem[];
}

export interface IMenuConfig {
	items?: IMenuItem[];
	/** accessible name of the menu */
	label?: string;
	onSelect?: (id: string | number | undefined, item: IMenuItem) => void;
	resolveItemDisabled?: (item: IMenuItem) => boolean | undefined;
	/** elements that don't count as outside-click (e.g. the opener button) */
	ignoreOutsideClick?: HTMLElement[];
}

/* ------------------------------------------------------------------ *
 * Toolbar composition surface (design: docs/internal/toolbar-context-menu)
 * ------------------------------------------------------------------ */

/**
 * How the toolbar handles items that do not fit its width:
 * - "menu": items move, from the end, into a "More" menu button (default);
 * - "collapse": all items except pinned ones are in one menu (burger) button;
 * - "wrap": items wrap to new lines, and the toolbar grows.
 */
export type ToolbarOverflowMode = "menu" | "collapse" | "wrap";

/**
 * Per-item overflow preference:
 * - "auto": can move into the overflow menu (default);
 * - "never": pinned, always stays in the toolbar row;
 * - "always": is only in the overflow menu.
 */
export type ToolbarItemOverflow = "auto" | "never" | "always";

export type ToolbarItemComp =
	"button" | "toggle" | "menu" | "combo" | "segmented" |
	"text" | "stepper" | "datepicker" | "label" | "separator" | "spacer";

/**
 * One offered theme on a `theme` toolbar/context-menu item (design 08 §3).
 * Dumb serializable object (D7); `id` is the skin id passed to gantt.setSkin
 * (hyphen form, e.g. "contrast-black") or the reserved literal "auto".
 */
export interface IThemeOption {
	id: string;
	label?: string;
	mode?: "light" | "dark" | "auto";
	/** marks a high-contrast variant — ignored by the binary toggle */
	contrast?: boolean;
	icon?: string;
}

/**
 * Toolbar item descriptor — a dumb serializable object (D7) when it lives in
 * gantt.config; the imperative factory additionally accepts the onClick/onChange
 * callbacks (which never enter gantt.config).
 */
export interface IToolbarItem {
	/** routing key for events; REQUIRED for custom actionable items.
	 *  An id matching a built-in name customizes that built-in. */
	id?: string | number;
	comp?: ToolbarItemComp;
	label?: string;
	/** Control width in CSS pixels for combo, text, stepper and datepicker items. */
	width?: number;
	/** Accessible name for an input item. Defaults to its visible label. */
	ariaLabel?: string;
	/** glyph class supplied by the product icon resolver */
	icon?: string;
	tooltip?: string;
	variant?: "primary" | "outline" | "danger" | "link";
	disabled?: boolean;
	hidden?: boolean;
	/** where the item goes when the toolbar is too narrow (default "auto") */
	overflow?: ToolbarItemOverflow;

	items?: IMenuItem[];        // comp:"menu" — dropdown
	options?: IUIOption[];      // comp:"combo" / "segmented"
	placeholder?: string;       // comp:"combo" / "text" / "stepper"
	pressed?: boolean;          // comp:"toggle" — initial state
	value?: any;                // initial value for value-bearing comps
	/** extra config forwarded to the underlying kit control
	 *  (comp:"text"/"stepper"/"datepicker" — e.g. { min, max, step } / { format }) */
	config?: Record<string, any>;

	/** theme item only (id === "theme"): offered skins (design 08). */
	themes?: IThemeOption[];
	/** theme item only: persist the pick in localStorage. */
	remember?: boolean;

	/** imperative-only callbacks (never serialized into gantt.config). */
	onClick?: (e: Event | null, item: IToolbarItem) => boolean | void;
	onChange?: (value: any, item: IToolbarItem) => boolean | void;
}

export type ToolbarItemDef = string | IToolbarItem;

export interface IToolbarConfig {
	/** the gantt instance — required for the top-level Toolbar export */
	gantt?: any;
	items?: ToolbarItemDef[];
	/** optional extra class on the toolbar root */
	css?: string;
	/** how items that do not fit are handled (default "menu") */
	overflow?: ToolbarOverflowMode;
	/** with overflow "menu": below this toolbar width (CSS pixels) the toolbar collapses into one menu button */
	collapseWidth?: number;
	/** catch-all activation handlers (imperative path) */
	onItemClick?: (id: string | number, item: IToolbarItem, e?: Event | null) => boolean | void;
	onItemChange?: (id: string | number, value: any, item: IToolbarItem) => boolean | void;
}

export interface IToolbar extends IUIComponent {
	setItems(items: ToolbarItemDef[]): void;
	updateItem(id: string | number, patch: Partial<IToolbarItem>): void;
	getItem(id: string | number): IToolbarItem | null;
	getValue(id: string | number): any;
	setValue(id: string | number, value: any): void;
	getControl(id: string | number): IUIComponent | null;
	/** re-read items + re-apply degradation without a full re-mount */
	refresh(): void;
	attachEvent(name: string, handler: (...args: any[]) => any, settings?: any): string | number;
	detachEvent(id: string | number): void;
}

export interface IToolbarApi {
	updateItem(id: string | number, patch: Partial<IToolbarItem>): void;
	getControl(id: string | number): IUIComponent | null;
	setValue(id: string | number, value: any): void;
	getValue(id: string | number): any;
	state(id: string | number): Record<string, any>;
}

export interface IToolbarBuiltin {
	name: string;
	descriptor: Partial<IToolbarItem>;
	available?(owner: any): boolean;
	resolve?(owner: any, item: IToolbarItem): IToolbarItem;
	action?(owner: any, api: IToolbarApi, item: IToolbarItem, value?: any): void;
	bind?(owner: any, control: IUIComponent | null, api: IToolbarApi, item: IToolbarItem): (() => void) | void;
}

export type ToolbarBuiltinResolver = (name: string) => IToolbarBuiltin | undefined;
