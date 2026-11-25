import { ensureDateTime } from "./datetime_section";
import { NumberStepper } from "../../controls/number_stepper";
import { getGanttUiKit } from "../../gantt_ui_kit";
import type { DurationFormatter } from "../../../../types/gantt_types";

/**
 * Shared "duration composite" row (migration Step 6 §S6.4): a DatePicker +
 * TimeInput start composite, a NumberStepper for the duration value, and a
 * read-only end-date label recomputed from start + duration. Used by the
 * `duration` section (a single row) and the `baselines` section (one row per
 * baseline, with a delete button). Preserves the legacy `gantt_duration`,
 * `gantt_duration_value` and `gantt_duration_end_date` class contract.
 */

function durationUnitLabel(gantt: any, config: any): string {
	return config.formatter ? "" : (" " + gantt.locale.labels[gantt.config.duration_unit + "s"] + " ");
}

/** Inner HTML of one duration row (start composite + stepper + end-date label
 * + optional delete button). Wrap it in your own section/row element. */
export function durationRowHtml(gantt: any, config: any, opts?: { deletable?: boolean }): string {
	opts = opts || {};
	const singleDate = config.single_date ? " style='display:none'" : "";
	const label = durationUnitLabel(gantt, config);
	let del = "";
	if (opts.deletable) {
		// mount point only — the actual delete control is a kit Button created
		// by the caller (baseline_control), so it shares the toolbar / resource
		// selector button styling instead of a hand-written raw <button>.
		del = "<div data-baseline-delete></div>";
	}
	return "<div class='gantt_time_selects' data-time-start></div>" +
		"<div class='gantt_duration'" + singleDate + ">" +
			"<div class='gantt_duration_stepper' data-duration-stepper></div>" +
			"<div class='gantt_duration_end_date'>" + label + "<span data-duration-end-date></span></div>" +
		"</div>" + del;
}

export interface IDurationRow {
	getStartDate(): Date;
	getDuration(): number;
	getEndDate(): Date;
	recalcEndDate(): Date;
}

/** Mount/reuse the composite + stepper inside `rowNode`, wire the end-date
 * recompute and return value accessors. `values` carries the initial
 * start_date / duration for this row. */
export function initDurationRow(gantt: any, rowNode: any, values: any, task: any, config: any): IDurationRow {
	const startHost = rowNode.querySelector("[data-time-start]");
	const stepperHost = rowNode.querySelector("[data-duration-stepper]");
	const endDateLabel = rowNode.querySelector(".gantt_duration_end_date");
	const endspan = endDateLabel.querySelector("[data-duration-end-date]");

	const startCtl = ensureDateTime(gantt, startHost, config);
	startCtl.setValue(values.start_date || new Date());

	let stepper: NumberStepper = stepperHost.$uiControl;
	if (!stepper) {
		stepper = new NumberStepper(getGanttUiKit(gantt), {
			min: 1,
			step: gantt.config.duration_step || 1,
			ariaLabel: gantt.locale.labels.column_duration || "Duration",
			get formatter(): DurationFormatter | undefined {
				return config.formatter;
			}
		});
		stepper.mount(stepperHost);
		if (config.readonly) {
			stepper.setDisabled(true);
		}
		stepperHost.$uiControl = stepper;
	}
	const durationInput = stepperHost.querySelector(".dhx_ui_stepper_input");
	if (durationInput) {
		durationInput.classList.add("gantt_duration_value");
		durationInput.classList.toggle("gantt_duration_value_formatted", Boolean(config.formatter));
	}
	endDateLabel.innerHTML = durationUnitLabel(gantt, config);
	endDateLabel.appendChild(endspan);
	const initialDuration = Math.round(values.duration) || 1;
	stepper.setValue(initialDuration);

	function readDuration(): number {
		let d = stepper.getValue();
		if (d === null || (config.formatter && d === 0)) {
			d = 1;
		}
		if (d < 0) {
			d = -d;
		}
		return d;
	}

	function recalcEndDate(): Date {
		const start = startCtl.getValue() || new Date();
		const duration = readDuration();
		const end = gantt.calculateEndDate({ start_date: start, duration: duration, task: task });
		const template = gantt.templates.task_end_date || gantt.templates.task_date;
		endspan.innerHTML = template(end);
		if (durationInput) {
			const formatter: DurationFormatter | undefined = config.formatter;
			const text = formatter ? formatter.format(duration) : durationInput.value;
			gantt._waiAria.lightboxDurationInputValueAttr(durationInput, duration, text);
		}
		return end;
	}

	if (!rowNode.$uiDurationWired) {
		rowNode.$uiDurationWired = true;
		startCtl.onChange(recalcEndDate);
		stepper.onChange(recalcEndDate);
	}
	recalcEndDate();

	return {
		getStartDate: function(): Date {
			return startCtl.getValue() || new Date();
		},
		getDuration: readDuration,
		getEndDate: function(): Date {
			return gantt.calculateEndDate({ start_date: this.getStartDate(), duration: readDuration(), task: task });
		},
		recalcEndDate: recalcEndDate
	};
}
