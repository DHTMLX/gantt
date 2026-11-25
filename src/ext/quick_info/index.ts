import type { Id, Task } from "../../types/gantt_types";

import { QuickInfo } from "./quickInfo";

export default function(gantt: any){

if (!gantt.ext) {
	gantt.ext = {};
}
gantt.ext.quickInfo = new QuickInfo(gantt);

gantt.config.quickinfo_buttons = ["icon_edit", "icon_delete"];
gantt.config.quick_info_detached = true;
gantt.config.show_quick_info = true;

gantt.templates.quick_info_title = function(start: Date, end: Date, task: Task){ return task.text.substr(0,50); };
gantt.templates.quick_info_content = function(start: Date, end: Date, task: Task){ return task.details || task.text; };
gantt.templates.quick_info_date = function(start: Date, end: Date, task: Task){
	return gantt.templates.task_time(start, end, task);
};
gantt.templates.quick_info_class = function(start: Date, end: Date, task: Task){ return ""; };

gantt.attachEvent("onTaskClick", function(id: Id, e: any){
	// GS-1460 and GS-1787. Don't show Quick Info when clicking on the add, collapse, and expand buttons
	const addButton = gantt.utils.dom.closest(e.target, ".gantt_add");
	const collapseButton = gantt.utils.dom.closest(e.target, ".gantt_close");
	const expandButton = gantt.utils.dom.closest(e.target, ".gantt_open");
	const showQuickInfo = !addButton && !collapseButton && !expandButton;
	if (showQuickInfo){
		setTimeout(function() {
			gantt.ext.quickInfo.show(id);
		}, 0);
	}

	return true;
});

const events = ["onViewChange", "onLightbox", "onBeforeTaskDelete", "onBeforeDrag"];
const hidingFunction = function(){
	gantt.ext.quickInfo.hide();
	return true;
};
for (let i=0; i<events.length; i++){
	gantt.attachEvent(events[i], hidingFunction);
}
// GS-957: We don't want to hide QuickInfo when we click on it.
gantt.attachEvent("onEmptyClick", function(e: any){
	let hideQuickInfo = true;
	const parent = document.querySelector(".gantt_cal_quick_info");
	if (parent){
		const quickInfoClick = gantt.utils.dom.isChildOf(e.target, parent);
		if (quickInfoClick){
			hideQuickInfo = false;
		}
	}
	if (hideQuickInfo){
		hidingFunction();
	}
});
function clearQuickInfo() {
	gantt.ext.quickInfo.hide();
	gantt.ext.quickInfo._quickInfoBox = null;
	return true;
}
gantt.attachEvent("onGanttReady", clearQuickInfo);
gantt.attachEvent("onDestroy", clearQuickInfo);

// eslint-disable-next-line no-restricted-globals
gantt.event(window, "keydown", function(e: any){
	if (e.keyCode === 27){
		gantt.ext.quickInfo.hide();
	}
});

gantt.showQuickInfo = function(){
	gantt.ext.quickInfo.show.apply(gantt.ext.quickInfo, arguments);
};
gantt.hideQuickInfo = function(){
	gantt.ext.quickInfo.hide.apply(gantt.ext.quickInfo, arguments);
};

}