import htmlHelpers from "../../utils/html_helpers";
import { TYPESELECT_WRAPPED_HANDLER } from "../stock_sections";

/**
 * "typeselect" lightbox section — stays LEGACY (native `<select>`) per the
 * ui-core migration plan (Step 6 §S6.2: "typeselect/resources stay legacy").
 * It used to extend the shared SelectControl class; that class was removed when
 * the plain `select` section flipped to the kit Combo, so the small native
 * `<select>` render/get/set is inlined here to keep typeselect self-contained.
 */
export default function(gantt) {

	function TypeselectControl() {}

	TypeselectControl.prototype.render = function(sns) {
		var types = gantt.config.types,
			locale = gantt.locale.labels,
			options = [];

		var filter = sns.filter || function (typeKey, typeValue) {
			if (!types.placeholder || typeValue !== types.placeholder) {
				return true;
			}
			return false;
		};
		for (var i in types) {
			if (!filter(i, types[i]) === false) {
				options.push({ key: types[i], label: locale["type_" + i] });
			}
		}
		sns.options = options;

		var oldOnChange = sns.onchange;
		sns.onchange = function () {
			gantt._lightbox_current_type = this.value;
			gantt.changeLightboxType(this.value);
			if (typeof oldOnChange == 'function') {
				oldOnChange.apply(this, arguments);
			}
		};
		// lets the advanced form find the handler of the app under the wrappers of earlier renders
		sns.onchange[TYPESELECT_WRAPPED_HANDLER] = oldOnChange;

		var height = sns.height ? `height:${sns.height}px;` : '';
		var html = `<div class='gantt_cal_ltext gantt_section_${sns.name}' ${height ? `style='${height}'` : ''}>`;
		html += htmlHelpers.getHtmlSelect(sns.options, [{ key: "style", value: "width:100%;" }, { key: "title", value: sns.name }]);
		html += "</div>";
		return html;
	};

	TypeselectControl.prototype.set_value = function(node, value, ev, sns) {
		var select = node.firstChild;
		if (!select._dhx_onchange && sns.onchange) {
			select.onchange = sns.onchange;
			select._dhx_onchange = true;
		}
		if (typeof value === "undefined")
			value = (select.options[0] || {}).value;
		select.value = value || "";
	};

	TypeselectControl.prototype.get_value = function(node) {
		return node.firstChild.value;
	};

	TypeselectControl.prototype.focus = function(node) {
		gantt._focus(node.firstChild, true);
	};

	return TypeselectControl;
};
