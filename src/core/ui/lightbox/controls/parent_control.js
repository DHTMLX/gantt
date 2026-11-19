import __extends from "../../../../utils/extends";
import SelectControl from "./select_control";
export default function(gantt) {
	var _super = SelectControl(gantt);

	function ParentControl() {
		var self = _super.apply(this, arguments) || this; 

		return self; 
	}

	__extends(ParentControl, _super);


	ParentControl.prototype.render = function(sns) {
		return _display(sns, false);
	};

	ParentControl.prototype.set_value = function(node, value, ev, config) {
		// GS-1051. If the value is `0`, the set_value function in the select control won't select 
		// the first child because (0 || '') = '';
		if (value === 0) value = "0";

		// GS-1374. Usually, the ID is not specified,
		// we need to add it to keep the options and exclude the current task
		if (!ev.id && gantt.getState().lightbox) {
			ev.id = gantt.getLightboxValues().id;
		}

		var tmpDom = document.createElement("div");
		tmpDom.innerHTML = _display(config, ev.id);
		var newOptions = tmpDom.removeChild(tmpDom.firstChild);
		node.onselect = null;
		node.parentNode.replaceChild(newOptions, node);

		return gantt.form_blocks.select.set_value.apply(gantt, [newOptions, value, ev, config]);
	};

	ParentControl.prototype.get_value = function(node, ev, config) {
		const value = gantt.form_blocks.select.get_value.apply(gantt, arguments);
		// GS-3658. The select gives the option value as a string; the parent is the option's own key
		const option = (config.options || []).find(function(item) {
			return String(item.key) === value;
		});
		return option ? option.key : value;
	};

	function _display(config, item_id) {
		var tasks = [],
			options = [];
		if (item_id) {
			tasks = gantt.getTaskByTime();
			if (config.allow_root) {
				tasks.unshift({id: gantt.config.root_id, text: config.root_label || ""});
			}
			tasks = _filter(tasks, config, item_id);
			if (config.sort) {
				tasks.sort(config.sort);
			}
		}
		var text = config.template || gantt.templates.task_text;
		for (var i = 0; i < tasks.length; i++) {
			var label = text.apply(gantt, [tasks[i].start_date, tasks[i].end_date, tasks[i]]);
			if (label === undefined) {
				label = "";
			}
			options.push({
				key: tasks[i].id,
				label: label
			});
		}
		config.options = options;
		config.map_to = config.map_to || "parent";
		return gantt.form_blocks.select.render.apply(this, arguments);
	}

	function _filter(options, config, item_id) {
		var filter = config.filter || function() {
			return true;
		};

		options = options.slice(0);

		for (var i = 0; i < options.length; i++) {
			var task = options[i];
			if (task.id == item_id || gantt.isChildOf(task.id, item_id) || filter(task.id, task) === false) {
				options.splice(i, 1);
				i--;
			}
		}
		return options;
	}
	return ParentControl;
};