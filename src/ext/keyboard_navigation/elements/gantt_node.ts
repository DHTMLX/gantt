import type { GanttWithKeyboardNavigation, KeyboardShortcutMap } from "../types";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.GanttNode = function () {
	} as unknown as typeof gantt.$keyboardNavigation.GanttNode;

	gantt.$keyboardNavigation.GanttNode.prototype = gantt._compose(
		gantt.$keyboardNavigation.EventHandler,
		{

			focus: function (): void {
				gantt.focus();
			},

			blur: function (): void {

			},

			isEnabled: function (): boolean {
				return gantt.$container.hasAttribute("tabindex");
			},

			scrollHorizontal: function scrollHorizontal(dir: number): void {
				let date = gantt.dateFromPos(gantt.getScrollState().x);
				const scale = gantt.getScale();
				const step = dir < 0 ? -scale.step : scale.step;
				date = gantt.date.add(date, step, scale.unit);
				gantt.scrollTo(gantt.posFromDate(date));
			},

			scrollVertical: function scrollVertical(dir: number): void {
				const top = gantt.getScrollState().y;
				const step = gantt.config.row_height;
				gantt.scrollTo(null, top + (dir < 0 ? -1 : 1) * step);
			},

			keys: {
				"alt+left": function () {
					this.scrollHorizontal!(-1);
				},
				"alt+right": function () {
					this.scrollHorizontal!(1);
				},
				"alt+up": function () {
					this.scrollVertical!(-1);
				},
				"alt+down": function () {
					this.scrollVertical!(1);
				},

				// undo
				"ctrl+z": function () {
					if (gantt.undo) gantt.undo();
				},

				// redo
				"ctrl+r": function () {
					if (gantt.redo) gantt.redo();
				}
			} as KeyboardShortcutMap
		}
	);

	gantt.$keyboardNavigation.GanttNode.prototype.bindAll(gantt.$keyboardNavigation.GanttNode.prototype.keys!);

};
