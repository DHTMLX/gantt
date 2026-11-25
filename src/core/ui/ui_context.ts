/** Day state shared by product adapters and calendar consumers. */
export interface CalendarDayState {
	disabled?: boolean;
	hidden?: boolean;
	className?: string;
	ariaLabel?: string;
}

/** Product-neutral services required by UI-kit primitives. */
export interface IUiContext {
	eventable(target: any): void;
	ariaEnabled(): boolean;
	label(key: string): string;
	uid(prefix: string): string;
	icon(name: string): string;
	getPopupContainer(): HTMLElement | null;
	getDateFormat(format?: string): string;
	getTimeFormat(format?: string): string;
	getTimeStep(step?: number): number;
	dateToString(format: string): (date: Date) => string;
	stringToDate(format: string): (value: string) => Date;
	getWeekStart(): number;
	getDateLocale(): { month_full: string[]; month_short: string[]; day_short: string[] };
	hasWorkCalendar(): boolean;
	isWorkDay(date: Date): boolean;
	getCalendarDayState?(date: Date): CalendarDayState | void;
	dom: {
		closest(node: EventTarget | null, selector: string): HTMLElement | null;
		getTargetNode(event: Event | Element): HTMLElement;
		isChildOf(child: EventTarget | null, parent: EventTarget | null): boolean;
		getActiveElement(): Element;
		getFocusableNodes(root: HTMLElement): HTMLElement[];
	};
}

