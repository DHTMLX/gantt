export default function(gantt) {
	gantt.isReadonly = function (item) {

		if((typeof item == "number" || typeof item == "string") && gantt.isTaskExists(item)){
			item = gantt.getTask(item);
		}
		if (item && item[this.config.editable_property]) {
			return false;
		} else {
			return (item && item[this.config.readonly_property]) || this.config.readonly;
		}
	};

	// The chart-level read-only value: a layout view's own config.readonly, else gantt.config.readonly.
	// A timeline drag sets the latter for its duration; for drawing, read the value from before the drag.
	function chartReadonly(gantt, viewConfig, valueBeforeDrag) {
		for (var config = viewConfig; config && config !== gantt.config; config = Object.getPrototypeOf(config)) {
			if (Object.prototype.hasOwnProperty.call(config, "readonly")) {
				return config.readonly;
			}
		}
		var dragTimeline = gantt.ext && gantt.ext.dragTimeline;
		if (valueBeforeDrag && dragTimeline && dragTimeline._readonlyBeforeDrag !== undefined) {
			return dragTimeline._readonlyBeforeDrag;
		}
		return gantt.config.readonly;
	}

	// The grid "+" and Ctrl+Enter. A grouping group row is read-only only to protect the group itself;
	// adding a task into it sets the group value, so it follows only the chart-level value.
	gantt._canAddSubtask = function (item, viewConfig, forRendering) {
		if ((typeof item == "number" || typeof item == "string") && gantt.isTaskExists(item)) {
			item = gantt.getTask(item);
		}
		var readonly = chartReadonly(this, viewConfig, forRendering);
		if (item && item.$virtual) {
			return !readonly;
		}
		if (item && item[this.config.editable_property]) {
			return true;
		}
		return !((item && item[this.config.readonly_property]) || readonly);
	};
};