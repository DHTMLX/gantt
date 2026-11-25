import __extends from "../../../../utils/extends";

import Super from "./base_control";

export default function(gantt) {
	const _super = Super(gantt);

	function TextareaControl() {
		var self = _super.apply(this, arguments) || this;

		return self; 
	}

	__extends(TextareaControl, _super);

	TextareaControl.prototype.render = function(sns) {
		const height = (sns.height || "130") + "px";
		const placeholder = sns.placeholder ? `placeholder='${sns.placeholder}'` : "";
		const ariaAttr = gantt._waiAria.lightboxTextareaAttrString(sns);
		return `<div class='gantt_cal_ltext gantt_section_${sns.name}' style='height:${height};' ${placeholder}><textarea ${ariaAttr}></textarea></div>`;
	};

	TextareaControl.prototype.set_value = function(node, value) {
		gantt.form_blocks.textarea._get_input(node).value = value || "";
	};

	TextareaControl.prototype.get_value = function(node) {
		return gantt.form_blocks.textarea._get_input(node).value;
	};

	TextareaControl.prototype.focus = function(node) {
		var a = gantt.form_blocks.textarea._get_input(node);
		gantt._focus(a, true);
	};

	TextareaControl.prototype._get_input = function(node) {
		return node.querySelector("textarea");
	};

	return TextareaControl;
};