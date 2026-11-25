/**
 * "parent" lightbox section — a task picker. It delegates rendering and value
 * handling to the `select` form block, which is kit-backed (Combo) since the
 * ui-core migration Step 6 §S6.2. Parent-specific work stays here: it rebuilds
 * the option list from the current task tree (excluding the edited task and its
 * descendants) at set_value time, then hands off to `form_blocks.select`.
 *
 * Returns the ready form-block object (no longer a SelectControl subclass — that
 * legacy class was removed with the select→combo flip).
 */
export default function(gantt) {

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
		return gantt.form_blocks.select.render.apply(gantt, [config]);
	}

	return {
		render: function(sns) {
			return _display(sns, false);
		},

		set_value: function(node, value, ev, config) {
			// GS-1051. If the value is `0`, the select won't select the first child
			// because (0 || '') = '';
			if (value === 0) value = "0";

			// GS-1374. Usually the ID is not specified; add it so we can keep the
			// options list current and exclude the edited task
			if (!ev.id && gantt.getState().lightbox) {
				ev.id = gantt.getLightboxValues().id;
			}

			var tmpDom = document.createElement("div");
			tmpDom.innerHTML = _display(config, ev.id);
			var newOptions = tmpDom.removeChild(tmpDom.firstChild);
			node.onselect = null;
			node.parentNode.replaceChild(newOptions, node);

			return gantt.form_blocks.select.set_value.apply(gantt, [newOptions, value, ev, config]);
		},

		get_value: function(node, ev, config) {
			return gantt.form_blocks.select.get_value.apply(gantt, [node, ev, config]);
		},

		focus: function(node) {
			return gantt.form_blocks.select.focus.apply(gantt, [node]);
		}
	};
};
