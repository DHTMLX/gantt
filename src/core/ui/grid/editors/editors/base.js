export default function (gantt) {

	var BaseEditor = function () {
	};

	BaseEditor.prototype = {
		show: function (id, column, config, placeholder) {
		},
		hide: function () {
		},
		set_value: function (value, id, column, node) {
			this.get_input(node).value = (value === undefined || value === null) ? "" : value;
		},
		get_value: function (id, column, node) {
			return this.get_input(node).value || "";
		},
		is_changed: function (value, id, column, node) {
			var currentValue = this.get_value(id, column, node);
			if (value === undefined || value === null) value = "";
			if (currentValue && value && currentValue.valueOf && value.valueOf) {
				return currentValue.valueOf() != value.valueOf();
			} else {
				return currentValue != value;
			}
		},
		is_valid: function (value, id, column, node) {
			return true;
		},

		save: function (id, column, node) {

		},
		get_input: function (node) {
			return node.querySelector("input");
		},
		focus: function (node) {
			var input = this.get_input(node);
			if (!input) {
				return;
			}
			if (input.focus) {
				input.focus();
			}

			if (input.select) {
				input.select();
			}
		}
	};
	return BaseEditor;
};