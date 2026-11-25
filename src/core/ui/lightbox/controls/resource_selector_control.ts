import * as helpers from "../../../../utils/helpers";
import { Combo } from "../../controls/combo";
import { NumberStepper } from "../../controls/number_stepper";
import { Button } from "../../controls/button";
import { DatePicker } from "../../controls/datepicker";
import { IUIComponent } from "../../controls/types";
import { getGanttUiKit } from "../../gantt_ui_kit";

/**
 * "resource_selector" lightbox section — kit-backed since migration Step 7
 * (docs/internal/ui-core/05-step7-resource-consolidation.md). This is the
 * RICH per-assignment editor (multiple assignments per task, each with its
 * own resource / amount / dates / duration); the simple resource→amount
 * editor is the separate `resources` section.
 *
 * Before Step 7 this control reused the internal grid view (`GridRL`) plus
 * the inline-editor system. That grid was NOT keyboard-operable: the "Add"
 * control was a `<div role=button>` with no tabindex and the assignment cells
 * only opened editors on click (GS-3145 audit findings #28/#29). This
 * rewrite drops `GridRL`/`ext._inlineEditors` and renders a semantic
 * `<table>` composed of kit controls that are focusable and editable by
 * keyboard on every row — closing #28/#29 — while keeping the same columns,
 * layout and behavior.
 *
 * What is preserved: the `temp_resource_assignment_store` staging datastore
 * (clone-on-open, commit-on-save, `gantt.$data.tempAssignmentsStore` — the
 * undo monitor keys off it), the public `gantt.resource_table` config
 * (columns + default assignment), the section shell + filter + "Add"
 * button + placeholder, and the form-block contract
 * (`render`/`set_value(...,initialized)`/`get_value(...,type)`/`button_click`).
 *
 * The legacy `GridRL` view (`grid/resource_grid_lightbox.js`) and its
 * `keyboard_mappings/default.js` glue were removed once this control stopped
 * instantiating them (Step 7 cleanup).
 */
export default function(gantt: any): any {

	const STORE_NAME = "temp_resource_assignment_store";
	const dateToStr = gantt.date.date_to_str("%d-%m-%Y");

	const localCache: any = {
		built: false,
		filterValue: null,
		initialValues: [],
		newValues: [],
		controls: [],      // kit IUIComponent instances to destroy on re-render
		container: null,   // the table wrapper node
		tbody: null
	};

	// Public config surface (unchanged from the legacy control) — users may
	// customize columns / default assignment through gantt.resource_table.
	gantt.resource_table = {
		scale_height: 35,
		row_height: 35,
		columns: [
			{
				name: "resource", label: "Resource", align: "center", width: 80,
				editor: { type: "select", map_to: "resource_id", options: gantt.serverList("resourceOptions") },
				template: function (assignment: any) {
					const resource = gantt.getDatastore(gantt.config.resource_store).getItem(assignment.resource_id);
					return resource ? resource.text : "Unassigned";
				}
			},
			{
				name: "hours/Day", label: "Hours/Day", align: "center", width: 90,
				editor: { type: "number", map_to: "value", min: 0, max: 100 },
				template: function (assignment: any) {
					return assignment.value ? +assignment.value : ``;
				}
			},
			{
				name: "start", label: "Start", align: "center", width: 100, template: function (assignment: any) {
					return assignment.start_date ? dateToStr(assignment.start_date) : ``;
				}
			},
			{
				name: "end", label: "End", align: "center", width: 100, template: function (assignment: any) {
					return assignment.end_date ? dateToStr(assignment.end_date) : ``;
				}
			},
			{
				name: "duration", label: "Duration", align: "center", width: 80, template: function (assignment: any) {
					if (assignment.duration) {
						return `${assignment.duration} day${assignment.duration == 1 ? '' : 's'}`;
					}
					return ``;
				}
			},
			{
				name: "delete", label: "Delete", align: "center", width: 60, template: function (assignment: any) {
					return `<div data-assignment-id='${assignment.id}' data-assignment-delete='${assignment.id}' class='dhx_gantt_icon dhx_gantt_icon_delete'></div>`;
				}
			}
		],
		resource_default_assignment: {
			duration: null,
			value: 8,
			start_date: null,
			end_date: null,
			mode: "default"
		}
	};

	gantt.attachEvent("onAfterLightbox", clearCache);

	// --- config helpers ------------------------------------------------

	function getResourceConfig(sns: any): any {
		return (sns && sns.config) || gantt.resource_table;
	}
	function getColumns(sns: any): any[] {
		return getResourceConfig(sns).columns || gantt.resource_table.columns;
	}

	// --- staging datastore ---------------------------------------------

	function ensureStore(task: any): any {
		let store = gantt.getDatastore(STORE_NAME);
		if (!store) {
			store = gantt.createDatastore({
				name: STORE_NAME,
				initItem: function (item: any) {
					if (!item.id) {
						item.id = gantt.uid();
					}
					return item;
				}
			});
		}
		store.clearAll();
		gantt.$data.tempAssignmentsStore = store;

		const main = gantt.getDatastore(gantt.config.resource_assignment_store);
		const items: any[] = [];
		main.eachItem(function (item: any) {
			if (item.task_id && item.task_id == task.id) {
				items.push(item);
			}
		});
		store.parse(structuredClone(items));
		return store;
	}

	function storeAssignments(task: any): any[] {
		const store = gantt.getDatastore(STORE_NAME);
		if (!store) {
			return [];
		}
		return store.find(function (a: any) {
			return a.task_id == task.id;
		});
	}

	// --- table rendering ------------------------------------------------

	function destroyControls(): void {
		for (let i = 0; i < localCache.controls.length; i++) {
			localCache.controls[i].destroy();
		}
		localCache.controls = [];
	}

	function setAriaLabel(control: IUIComponent, label: string): void {
		const root = control.getRootNode();
		const input = root && root.querySelector("input");
		if (input && label) {
			input.setAttribute("aria-label", label);
		}
	}

	/** Build one cell's content: a kit control for editable columns, a kit
	 * delete button for the delete column, or the read-only template output. */
	function buildCell(cell: any, column: any, assignment: any, task: any, sns: any): IUIComponent | null {
		if (column.name === "delete") {
			const btn = new Button(getGanttUiKit(gantt), {
				icon: "dhx_gantt_icon dhx_gantt_icon_delete",
				variant: "link",
				ariaLabel: gantt.locale.labels.column_delete || "Delete",
				onClick: function () { confirmDelete(assignment.id, task, sns); }
			});
			btn.mount(cell);
			const node = btn.getRootNode();
			if (node) {
				node.setAttribute("data-assignment-id", assignment.id);
				node.setAttribute("data-assignment-delete", assignment.id);
				// keep the trashbin glyph neutral gray like the datepicker /
				// time toggles instead of taking the link variant's accent color
				node.classList.add("dhx_ui_button_neutral_icon");
			}
			return btn;
		}

		if (column.editor) {
			const map_to = column.editor.map_to;
			if (column.editor.type === "select") {
				const combo = new Combo(getGanttUiKit(gantt), {
					options: column.editor.options || gantt.serverList("resourceOptions"),
					openOnClick: true
				});
				combo.mount(cell);
				combo.setValue(assignment[map_to]);
				combo.onChange(function () { assignment[map_to] = combo.getValue(); });
				setAriaLabel(combo, column.label || column.name);
				return combo;
			}
			if (column.editor.type === "number") {
				const stepper = new NumberStepper(getGanttUiKit(gantt), {
					min: column.editor.min,
					max: column.editor.max,
					step: column.editor.step || 1,
					ariaLabel: column.label || column.name
				});
				stepper.mount(cell);
				const val = assignment[map_to];
				stepper.setValue(val === undefined || val === null || val === "" ? null : parseFloat(val));
				stepper.onChange(function () { assignment[map_to] = stepper.getValue(); });
				setAriaLabel(stepper, column.label || column.name);
				return stepper;
			}
			if (column.editor.type === "date") {
				const picker = new DatePicker(getGanttUiKit(gantt));
				picker.mount(cell);
				const dv = assignment[map_to];
				picker.setValue(dv instanceof Date ? dv : (dv ? new Date(dv) : null));
				picker.onChange(function () { assignment[map_to] = picker.getValue(); });
				setAriaLabel(picker, column.label || column.name);
				return picker;
			}
		}

		// read-only display column
		cell.innerHTML = column.template ? column.template(assignment) : "";
		return null;
	}

	function renderRows(task: any, sns: any): void {
		if (!localCache.tbody) {
			return;
		}
		destroyControls();
		localCache.tbody.innerHTML = "";

		const columns = getColumns(sns);
		const query = localCache.filterValue;
		const resourceStore = gantt.getDatastore(gantt.config.resource_store);

		storeAssignments(task).forEach(function (assignment: any) {
			if (query) {
				const resource = resourceStore.getItem(assignment.resource_id);
				const text = resource ? String(resource.text).toLowerCase() : "";
				if (text.indexOf(query) === -1) {
					return;
				}
			}

			const row: any = document.createElement("tr");
			// NB: deliberately NOT the legacy `gantt_row`/`gantt_cell`/
			// `gantt_grid_data` classes — those carry the virtual-grid's
			// display:flex/block layout, which overrides native table-layout
			// and desyncs body columns from the header.
			row.className = "dhx_ui_resource_row";
			row.setAttribute("data-assignment-id", assignment.id);

			columns.forEach(function (column: any, colIndex: number) {
				const cell = document.createElement("td");
				cell.className = "dhx_ui_resource_cell dhx_ui_resource_cell_" + column.name;
				if (column.align) {
					cell.style.textAlign = column.align;
				}
				// widths come from the header row (table-layout:fixed)
				const control = buildCell(cell, column, assignment, task, sns);
				if (control) {
					localCache.controls.push(control);
					// expose the control on its host cell (same convention as
					// form_block_adapter) so retest helpers / consumers can reach it
					(cell as any).$uiControl = control;
					if (colIndex === 0) {
						row.$firstControl = control;
					}
				}
				row.appendChild(cell);
			});
			localCache.tbody.appendChild(row);
		});
	}

	function buildTable(node: any, task: any, sns: any): void {
		const container = document.createElement("div");
		container.className = "gantt_resource_selector_grid dhx_ui_resource_grid";

		// a plain native <table> (not role="grid"): read-only cells are announced
		// by SR table navigation with their <th scope="col"> header, and the
		// editable cells are reached through the natural tab order of their
		// controls — no roving-tabindex grid semantics to promise.
		const table = document.createElement("table");
		table.className = "dhx_ui_resource_table";

		const thead = document.createElement("thead");
		const headRow = document.createElement("tr");
		// distribute the configured column widths proportionally so the table
		// always fills the section width (table-layout:fixed honours the %),
		// mirroring the legacy grid which stretched columns to the lightbox width
		const columns = getColumns(sns);
		const totalWidth = columns.reduce(function (sum: number, c: any) { return sum + (c.width || 80); }, 0) || 1;
		columns.forEach(function (column: any) {
			const th = document.createElement("th");
			th.className = "dhx_ui_resource_head_cell dhx_ui_resource_head_" + column.name;
			th.setAttribute("scope", "col");
			th.style.width = ((column.width || 80) / totalWidth * 100).toFixed(4) + "%";
			if (column.align) {
				th.style.textAlign = column.align;
			}
			const labels = gantt.locale.labels;
			th.textContent = column.label || labels["column_" + column.name] || labels[column.name] || "";
			headRow.appendChild(th);
		});
		thead.appendChild(headRow);

		const tbody = document.createElement("tbody");
		tbody.className = "dhx_ui_resource_body";

		table.appendChild(thead);
		table.appendChild(tbody);
		container.appendChild(table);
		node.appendChild(container);

		// with many assignments, Tabbing cell-by-cell down to the
		// lightbox footer is tedious. Ctrl/Cmd+Enter from anywhere in the grid
		// jumps focus straight to the Save button (Shift+Tab from there reaches
		// Cancel)
		container.addEventListener("keydown", function (e: KeyboardEvent) {
			if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
				const lightbox = gantt.getLightbox();
				const saveBtn = lightbox && (
					lightbox.querySelector(".gantt_btn_set.gantt_save_btn_set") ||
					lightbox.querySelector(".gantt_btn_set")
				);
				if (saveBtn && saveBtn.focus) {
					e.preventDefault();
					e.stopPropagation();
					saveBtn.focus();
				}
			}
		});

		localCache.container = container;
		localCache.tbody = tbody;
	}

	// --- add / delete ---------------------------------------------------

	function addDefaultAssignment(task: any, sns: any): void {
		let resource_id: any;
		const assignments = gantt.getTaskAssignments(task.id);
		if (assignments.length) {
			resource_id = assignments[0].resource_id;
		} else {
			const resources = gantt.serverList("resourceOptions");
			if (resources.length) {
				resource_id = resources[0].key !== undefined ? resources[0].key : resources[0].id;
			} else {
				throw new Error(`There is no any resources in resource store, please check your data:
					https://docs.dhtmlx.com/gantt/desktop__resource_management.html#assigningresources`);
			}
		}

		const config = getResourceConfig(sns).resource_default_assignment || gantt.resource_table.resource_default_assignment;
		const store = gantt.getDatastore(STORE_NAME);
		store.addItem({
			resource_id,
			task_id: task.id,
			duration: config.duration ?? gantt.calculateDuration(task),
			value: config.value,
			start_date: config.start_date ?? task.start_date,
			end_date: config.end_date ?? task.end_date,
			mode: config.mode
		});
		renderRows(task, sns);
	}

	function confirmDelete(assignmentId: any, task: any, sns: any): void {
		gantt.confirm({
			text: "Resource assignment will be deleted permanently, are you sure?",
			cancel: "No",
			ok: "Delete",
			callback: function (result: boolean) {
				if (!result) {
					return;
				}
				const store = gantt.getDatastore(STORE_NAME);
				store.removeItem(assignmentId);
				renderRows(task, sns);
				updateVisibility(sns, task);
				keepFocusInLightbox(sns);
			}
		});
	}

	function keepFocusInLightbox(sns: any): void {
		const lightbox = gantt.getLightbox();
		if (!lightbox || lightbox.contains(document.activeElement)) {
			return;
		}
		focusLastRow();
		if (!lightbox.contains(document.activeElement)) {
			const addBtn = sectionNodes(sns).firstAddBtn;
			if (addBtn && addBtn.focus) {
				addBtn.focus();
			}
		}
	}

	// --- section visibility (header add btn / body / placeholder) -------

	function sectionNodes(sns: any): any {
		return {
			firstAddBtn: document.querySelector("[data-resource-selector-section]"),
			placeholder: document.querySelector(".resources_section_placeholder"),
			filterWrap: document.querySelector(`.gantt_section_${sns.name} .gantt_resource_selector_filter_wrapper`),
			grid: document.querySelector(`.gantt_section_${sns.name} .dhx_ui_resource_grid`)
		};
	}

	function updateVisibility(sns: any, task: any): void {
		const nodes = sectionNodes(sns);
		const hasItems = storeAssignments(task).length > 0;
		if (hasItems) {
			if (nodes.filterWrap) nodes.filterWrap.style.display = "flex";
			if (nodes.grid) nodes.grid.style.display = "block";
			if (nodes.placeholder) nodes.placeholder.style.display = "none";
			if (nodes.firstAddBtn) nodes.firstAddBtn.style.display = "none";
		} else {
			if (nodes.filterWrap) nodes.filterWrap.style.display = "none";
			if (nodes.grid) nodes.grid.style.display = "none";
			if (nodes.placeholder) nodes.placeholder.style.display = "block";
			if (nodes.firstAddBtn) nodes.firstAddBtn.style.display = "flex";
		}
	}

	// --- initial / commit values ---------------------------------------

	function setInitialValues(task: any): void {
		localCache.initialValues = [];
		localCache.newValues = [];
		const main = gantt.$data.assignmentsStore;
		const items = main.find(function (a: any) {
			return a.task_id == task.id;
		});
		for (let i = 0; i < items.length; i++) {
			localCache.initialValues[i] = { resource_id: items[i].resource_id, value: items[i].value, id: items[i].id };
		}
	}

	// --- markup ---------------------------------------------------------

	function inputSectionHtml(index: number, name: string): string {
		const filterPlaceholder = gantt.locale.labels.resources_filter_placeholder || "Search...";
		const addLabel = gantt.locale.labels.resources_add_button || "";
		return `<div class='gantt_resource_selector_filter_wrapper gantt_cal_lsection' data-section-name='${name}'>` +
			`<div class='gantt_cal_ltext gantt_resources_filter'>` +
				`<label class="dhx_gantt_icon dhx_gantt_icon_search">` +
					`<input type='text' class='gantt_resources_filter_input' placeholder='${filterPlaceholder}'>` +
				`</label>` +
			`</div>` +
			`<button type='button' aria-label='${addLabel}' class='gantt_custom_button gantt_add_resources' data-index='${index}' data-section-name='${name}'>` +
				`<div class='gantt_custom_button_add_resources gantt_add'></div>` +
				`<div class='gantt_custom_button_label'>${addLabel}</div>` +
			`</button>` +
		`</div>`;
	}

	function initEvents(node: any, task: any, sns: any): void {
		const input: any = node.querySelector(".gantt_resources_filter_input");
		if (!input) {
			return;
		}
		const runFilter = helpers.throttle(function () {
			localCache.filterValue = (input.value || "").toLowerCase();
			renderRows(task, sns);
		}, 100);
		input.addEventListener("input", runFilter);
	}

	// --- form-block contract --------------------------------------------

	return {
		render: function (sns: any): string {
			if (!sns.options) {
				sns.options = gantt.serverList("resourceOptions");
			}
			if (!sns.map_to || sns.map_to === "resource_selector" || sns.map_to === "auto") {
				sns.map_to = gantt.config.resource_property;
			}
			const height = !isNaN(sns.height) ? " style='height:auto;'" : "";
			return `<div${height} class='gantt_section_${sns.name}' data-section-name='${sns.name}'>` +
				inputSectionHtml(sns.index, sns.name) +
			`</div>` +
			`<div class="resources_section_placeholder" style='display:none;'>${gantt.locale.labels.resources_section_placeholder}</div>`;
		},

		set_value: function (node: any, assignments: any, task: any, sns: any, initialized: boolean): void {
			setInitialValues(task);
			if (!initialized) {
				ensureStore(task);
				buildTable(node, task, sns);
				initEvents(node, task, sns);
				renderRows(task, sns);
			}
			updateVisibility(sns, task);
			gantt._center_lightbox(gantt.getLightbox());
		},

		get_value: function (node: any, task: any, sns: any, type: string): any {
			const items = storeAssignments(task);
			localCache.newValues = [];
			for (let i = 0; i < items.length; i++) {
				localCache.newValues[i] = {
					resource_id: items[i].resource_id != null ? items[i].resource_id.toString() : items[i].resource_id,
					value: items[i].value,
					id: items[i].id,
					start_date: items[i].start_date,
					end_date: items[i].end_date,
					duration: items[i].duration,
					mode: items[i].mode,
					delay: items[i].delay
				};
			}
			return type === "save" ? localCache.newValues : localCache.initialValues;
		},

		button_click: function (index: number, el: any, section: any, container: any): void {
			const sectionName = (section && section.getAttribute("data-section-name")) || (container && container.getAttribute("data-section-name"));
			const nodes = sectionNodes({ name: sectionName });
			if (nodes.firstAddBtn) {
				nodes.firstAddBtn.style.display = "none";
			}

			if (gantt.callEvent("onSectionButton", [gantt._lightbox_id, section]) === false) {
				return;
			}

			if (el && el.closest && el.closest(".gantt_custom_button.gantt_add_resources")) {
				const task = gantt.getTask(gantt._lightbox_id);
				const sns = gantt.getLightboxSection(sectionName).section;
				if (nodes.placeholder) nodes.placeholder.style.display = "none";
				if (nodes.filterWrap) nodes.filterWrap.style.display = "flex";
				if (nodes.grid) nodes.grid.style.display = "block";
				addDefaultAssignment(task, sns);
				focusLastRow();
			}
		},

		focus: function (node: any): void {
			focusLastRow();
		}
	};

	function focusLastRow(): void {
		if (!localCache.tbody) {
			return;
		}
		const rows = localCache.tbody.querySelectorAll(".dhx_ui_resource_row");
		const lastRow: any = rows[rows.length - 1];
		if (lastRow && lastRow.$firstControl) {
			lastRow.$firstControl.focus();
		}
	}

	function clearCache(): void {
		destroyControls();
		localCache.built = false;
		localCache.filterValue = null;
		localCache.initialValues = [];
		localCache.newValues = [];
		localCache.container = null;
		localCache.tbody = null;
	}
}
