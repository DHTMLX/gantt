import { DateTimePicker } from "../../controls/datetime_picker";
import { showTimeInput } from "../../controls/datetime_picker";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * Shared plumbing for the datetime-carrying lightbox sections (migration Step 6
 * §S6.3–S6.6): `time`, `duration`, `constraint` and `baseline` all compose the
 * same DatePicker + TimeInput composite. This module derives the composite
 * config from a section and creates/reuses a DateTimePicker mounted on a host
 * node (the lightbox DOM is rebuilt on every open, so a fresh host means a
 * fresh instance — the same lazy pattern as form_block_adapter).
 */

/** Builds the DateTimePicker config from a lightbox section (time_format,
 * time_step, and the duration_unit/time_format-driven `showTime` rule). */
export function dateTimeConfig(gantt: any, sns: any): any {
	const timeFormat = sns && sns.time_format
		? [].concat(sns.time_format).join(" ")
		: undefined;
	const step = gantt._get_timepicker_step
		? gantt._get_timepicker_step()
		: (gantt.config && gantt.config.time_step);
	return {
		showTime: showTimeInput(gantt, sns),
		timeFormat: timeFormat,
		timeStep: step,
		placeholder: sns && sns.placeholder
	};
}

/** Create-or-reuse a DateTimePicker mounted into `host`, cached on the node. */
export function ensureDateTime(gantt: any, host: any, sns: any): DateTimePicker {
	if (!host.$uiControl) {
		const control = new DateTimePicker(getGanttUiKit(gantt), dateTimeConfig(gantt, sns));
		control.mount(host);
		if (sns && sns.readonly) {
			control.setDisabled(true);
		}
		host.$uiControl = control;
	}
	return host.$uiControl;
}
