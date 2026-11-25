import { Combo } from "../../controls/combo";
import { ensureDateTime } from "./datetime_section";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "constraint" lightbox section — kit-backed since migration Step 6 §S6.5,
 * replacing the legacy `<select>` (type) + multi-`<select>` (date). Renders a
 * Combo for the constraint type and a DatePicker + TimeInput composite for the
 * constraint date; the date+time is disabled for the non-timed ASAP/ALAP types.
 *
 * Preserves the constraint-type option set + labels, the enable/disable-on-type
 * behavior, the `map_to` object contract, the `data-constraint-*` hooks and the
 * PRO-edition gating (constraints are PRO). Returns the ready form-block object.
 */
export default function(gantt: any): any {

	function isNonTimedConstraint(value: any): boolean {
		return !value ||
			value === gantt.config.constraint_types.ASAP ||
			value === gantt.config.constraint_types.ALAP;
	}

	function typeHost(node: any): any {
		return node.querySelector("[data-constraint-type-select]");
	}
	function dateHost(node: any): any {
		return node.querySelector("[data-constraint-datetime]");
	}

	function ensureCombo(host: any, sns: any): Combo {
		if (!host.$uiControl) {
			const combo = new Combo(getGanttUiKit(gantt), { options: sns.options || [], openOnClick: true });
			combo.mount(host);
			if (sns.readonly) {
				combo.setDisabled(true);
			}
			host.$uiControl = combo;
		}
		return host.$uiControl;
	}

	function toggleDate(dateCtl: any, typeValue: any): void {
		dateCtl.setDisabled(isNonTimedConstraint(typeValue));
	}

	return {
		render: function(sns: any): string {
			const height = sns.height ? `height:${sns.height}px;` : "";
			let html = `<div class='gantt_cal_ltext gantt_section_${sns.name}' ${height ? `style='${height}'` : ""}>`;

			const options = [];
			for (const i in gantt.config.constraint_types) {
				const key = gantt.config.constraint_types[i];
				options.push({ key: key, label: gantt.locale.labels[key] });
			}
			sns.options = sns.options || options;

			html += "<span data-constraint-type-select></span>";
			const timeLabel = gantt.locale.labels["constraint_date"] || "Constraint date";
			html += "<label data-constraint-time-select>" + timeLabel + ": <span data-constraint-datetime></span></label>";
			html += "</div>";
			return html;
		},

		set_value: function(node: any, value: any, task: any, config: any): void {
			const mapping = gantt._resolve_default_mapping(config);
			const typeCombo = ensureCombo(typeHost(node), config);
			const dateCtl = ensureDateTime(gantt, dateHost(node), config);

			const constraintDate = task[mapping.constraint_date] || new Date();
			dateCtl.setValue(constraintDate);

			const constraintType = task[mapping.constraint_type] || gantt.getConstraintType(task);
			typeCombo.setValue(constraintType);
			toggleDate(dateCtl, constraintType);

			if (!node.$uiConstraintWired) {
				node.$uiConstraintWired = true;
				typeCombo.onChange(function(v: any) {
					toggleDate(dateCtl, v);
				});
			}
		},

		get_value: function(node: any, task: any, config: any): any {
			const typeCombo = typeHost(node) && typeHost(node).$uiControl;
			const dateCtl = dateHost(node) && dateHost(node).$uiControl;

			const constraintType = typeCombo ? typeCombo.getValue() : null;
			let constraintDate = null;
			if (!isNonTimedConstraint(constraintType) && dateCtl) {
				constraintDate = dateCtl.getValue();
			}

			return {
				constraint_type: constraintType,
				constraint_date: constraintDate
			};
		},

		focus: function(node: any): void {
			const host = typeHost(node);
			if (host && host.$uiControl) {
				host.$uiControl.focus();
			}
		}
	};
}
