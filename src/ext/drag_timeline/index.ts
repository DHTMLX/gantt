import { EventsManager } from "./eventsManager";
export default function(gantt: any){
	if (!gantt.ext){
		gantt.ext = {};
	}

	gantt.ext.dragTimeline = {
		create: () => EventsManager.create(gantt),
		_isDragInProgress: () => EventsManager._isDragInProgress,
		// the drag sets config.readonly for its duration; this keeps the value from before it, undefined when no drag runs
		_readonlyBeforeDrag: undefined
	};

	gantt.config.drag_timeline = {
		enabled: true,
		render: false
	};
}