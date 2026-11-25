import { durationRowHtml, initDurationRow } from "./duration_row";
import { Button } from "../../controls/button";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "baselines" lightbox section — kit-backed since migration Step 6 §S6.6. Each
 * baseline row reuses the S6.4 duration composite (DatePicker + TimeInput +
 * NumberStepper + read-only end-date label); rows can be added and removed.
 *
 * Preserves the per-row add/remove UX, the baseline data shape/map_to, the
 * `gantt_section_baselines` / `gantt_duration*` classes, and the PRO gating.
 * Returns the ready form-block object (with the `button_click` add/remove-all
 * handler the lightbox dispatches to).
 */
export default function(gantt: any): any {

	function generateBaselineRow(container: any, baseline: any, task: any, config: any): void {
		const rowNode: any = document.createElement("div");
		rowNode.className = "gantt_section_time gantt_section_duration";
		rowNode.setAttribute("data-baseline-id", baseline.id);
		rowNode.innerHTML = durationRowHtml(gantt, config, { deletable: true }) + "<br>";
		container.appendChild(rowNode);

		// a baseline is not the task interval: the task calendar, without its pauses
		const calendar = gantt.getTaskCalendar(task);
		const duration = gantt.calculateDuration({
			start_date: baseline.start_date,
			end_date: baseline.end_date,
			calendar: calendar
		});
		rowNode.$uiRow = initDurationRow(gantt, rowNode, {
			start_date: baseline.start_date || new Date(),
			duration: duration,
			calendar: calendar
		}, task, config);

		const deleteHost = rowNode.querySelector("[data-baseline-delete]");
		if (deleteHost) {
			const removeRow = function() {
				const section = rowNode.parentNode as HTMLElement;
				rowNode.innerHTML = "";
				rowNode.remove();
				if (section && section.innerHTML === "") {
					section.innerHTML = gantt.locale.labels.baselines_section_placeholder;
				}
			};
			// kit Button (link variant) — same component the resource selector
			// delete cell and the toolbar icon buttons use, so it picks up the
			// shared button styling instead of a bare raw <button>.
			const deleteBtn = new Button(getGanttUiKit(gantt), {
				icon: "dhx_gantt_icon dhx_gantt_icon_delete",
				variant: "link",
				ariaLabel: gantt.locale.labels.baselines_remove_button || "Delete",
				onClick: removeRow
			});
			deleteBtn.mount(deleteHost);
			const btnNode = deleteBtn.getRootNode();
			if (btnNode) {
				// preserve the legacy class the retest / consumers click on
				btnNode.classList.add("baseline_delete_button");
				// keep the trashbin glyph neutral gray like the datepicker /
				// time toggles instead of taking the link variant's accent color
				btnNode.classList.add("dhx_ui_button_neutral_icon");
			}
		}
	}

	return {
		render: function(sns: any): string {

			const fixedHeight = !!sns.height;
			let maxHeight = fixedHeight ? fixedHeight : 100;
			return `<div style='height: ${fixedHeight ? (sns.height + 'px') : "auto"};max-height: ${maxHeight}px; font-size:inherit;' class='gantt_section_baselines'></div>`;
		},

		set_value: function(node: any, value: any, task: any, config: any): void {
			if (task.baselines) {
				node.innerHTML = "";
				task.baselines.forEach(function(baseline: any) {
					generateBaselineRow(node, baseline, task, config);
				});
			} else {
				node.innerHTML = gantt.locale.labels.baselines_section_placeholder;
			}
		},

		get_value: function(node: any, task: any, config: any): any {
			const baselines: any[] = [];
			const baselineRows = node.querySelectorAll("[data-baseline-id]");
			baselineRows.forEach(function(baselineNode: any) {
				const baselineId = baselineNode.getAttribute("data-baseline-id");
				const baselineStore = gantt.getDatastore("baselines");
				const baseline = baselineStore.getItem(baselineId);
				let updatedBaseline;
				if (baseline) {
					updatedBaseline = gantt.copy(baseline);
				} else {
					updatedBaseline = {
						id: gantt.uid(),
						task_id: task.id,
						text: "Baseline 1"
					};
				}
				const row = baselineNode.$uiRow;
				updatedBaseline.start_date = row ? row.getStartDate() : new Date();
				updatedBaseline.duration = row ? row.getDuration() : 1;
				updatedBaseline.end_date = gantt.calculateEndDate({
					start_date: updatedBaseline.start_date,
					duration: updatedBaseline.duration,
					calendar: gantt.getTaskCalendar(task)
				});
				baselines.push(updatedBaseline);
			});
			return baselines;
		},

		button_click: function(index: any, el: any, section: any, container: any): void {
			if (gantt.callEvent("onSectionButton", [gantt._lightbox_id, section]) === false) {
				return;
			}
			if (el.closest(".gantt_custom_button.gantt_remove_baselines")) {
				container.innerHTML = gantt.locale.labels.baselines_section_placeholder;
			}
			if (el.closest(".gantt_custom_button.gantt_add_baselines")) {
				if (container.innerHTML == gantt.locale.labels.baselines_section_placeholder) {
					container.innerHTML = "";
				}
				const task = gantt.getTask(gantt._lightbox_id);
				const baseline = {
					id: gantt.uid(),
					task_id: task.id,
					text: "Baseline 1",
					start_date: task.start_date,
					end_date: task.end_date
				};
				const config = gantt._get_typed_lightbox_config()[index];
				generateBaselineRow(container, baseline, task, config);
			}
		},

		focus: function(node: any): void {
			const host = node.querySelector("[data-time-start]");
			if (host && host.$uiControl) {
				host.$uiControl.focus();
			}
		}
	};
}
