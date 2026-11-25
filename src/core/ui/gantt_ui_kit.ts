import { createUiKit, IUiKit } from "./ui_kit";
import { createGanttUiContext } from "./gantt_ui_context";
import { getToolbarBuiltin } from "./controls/toolbar_builtins";
import { createGanttUiClasses } from "./gantt_ui_classes";

/** Lazily creates the single UI kit owned by a Gantt instance. */
export function getGanttUiKit(gantt: any): IUiKit {
	if (!gantt.$uiKit) {
		gantt.$uiKit = createUiKit(createGanttUiContext(gantt), {
			owner: gantt,
			resolveToolbarBuiltin: getToolbarBuiltin,
			onDestroy: (handler) => {
				if (gantt && gantt.attachEvent) gantt.attachEvent("onDestroy", handler);
			}
		});
		Object.assign(gantt.$uiKit.classes, createGanttUiClasses(getGanttUiKit));
	}
	return gantt.$uiKit;
}

