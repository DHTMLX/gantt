import TemplateControlConstructor from "./controls/template_control";
import TextareaControlConstructor from "./controls/textarea_control";
import timeControlFactory from "./controls/time_control";
import timeSelectControlFactory from "./controls/time_select_control";
import selectControlFactory from "./controls/select_control";
import CheckboxControlConstructor from "./controls/checkbox_control";
import RadioControlConstructor from "./controls/radio_control";
import durationControlFactory from "./controls/duration_control";
import durationSelectControlFactory from "./controls/duration_select_control";
import parentControlFactory from "./controls/parent_control";
import resourcesControlFactory from "./controls/resources_control";
import constraintControlFactory from "./controls/constraint_control";
import TypeselectControlConstructor from "./controls/typeselect_control";
import baselineControlFactory from "./controls/baseline_control";
import resourceSelectorControlFactory from "./controls/resource_selector_control";
import comboControlFactory from "./controls/combo_control";
import datepickerControlFactory from "./controls/datepicker_control";
import stepperControlFactory from "./controls/stepper_control";
import textControlFactory from "./controls/text_control";
import switchControlFactory from "./controls/switch_control";
import progressControlFactory from "./controls/progress_control";
import calendarControlFactory from "./controls/calendar_control";

import * as domHelpers from "../utils/dom_helpers";
import * as helpers from "../../../utils/helpers";
import { getGanttUiKit } from "../gantt_ui_kit";
import { defaultLightboxSections } from "../../common/config";


export default function (gantt) {

	/*
	 * Lightbox shell — ui-core migration Step 4
	 * (docs/internal/ui-core/03-migration-status.md): the cover, centering,
	 * show/hide lifecycle and drag_lightbox ride on the ModalPopup primitive,
	 * which ADOPTS the legacy-built gantt_cal_light element and nests it
	 * inside the backdrop, preserving the `.gantt_cal_cover > .gantt_cal_light`
	 * DOM contract. The section/control system, the save/cancel keyboard
	 * handling on the box (edit_save/edit_cancel are button semantics, not
	 * shell dismissal) and all lightbox events are untouched. A legacy
	 * cover fallback remains in showCover/hideCover for custom lightboxes
	 * (gantt._custom_lightbox) that were never built by getLightbox.
	 */
	function createLightboxPopup(box) {
		var config = {
			node: box,
			container: function() { return gantt._lightbox_root || gantt.$root; },
			position: {
				type: "center",
				boundary: function() { return gantt._lightbox_root || gantt.$root; }
			},
			// ESC = edit_cancel semantics, handled by the box's own keydown
			dismiss: { escape: false, outsideClick: false },
			// sections own the initial focus (section.focus flag)
			autoFocus: false,
			backdropClassName: "gantt_cal_cover",
			nestInBackdrop: true,
			cssPosition: "absolute",
			dragHandle: gantt.config.drag_lightbox ? box.firstChild : undefined
		};
		return getGanttUiKit(gantt).createModal(config);
	}


	var TemplateControl = TemplateControlConstructor(gantt);
	var TextareaControl = TextareaControlConstructor(gantt);
	var CheckboxControl = CheckboxControlConstructor(gantt);
	var RadioControl = RadioControlConstructor(gantt);
	var ParentControl = parentControlFactory(gantt);
	var TypeselectControl = TypeselectControlConstructor(gantt);

	gantt._lightbox_methods = {};
	gantt._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>";
	gantt._lightbox_template = `<div class='gantt_cal_ltitle'><div class="dhx_cal_ltitle_descr"><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='dhx_title'></span>
</div>
<div class="gantt_cal_ltitle_controls">
	<a class="gantt_cal_ltitle_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>

</div></div><div class='gantt_cal_larea'></div>`;

	// GS-1952. Attaching the lightbox to the BODY element is not considered secure.
	// Attach it to Gantt container for Salesforce and other secure environments
	gantt._lightbox_root = gantt.$root;
	function setParentNode() {
		const cspEnvironment = gantt.config.csp === true;
		if (cspEnvironment || gantt.env.isSalesforce) {
			gantt._lightbox_root = gantt.$root;
		} else {
			gantt._lightbox_root = document.body;
		}
	}

	//TODO: gantt._lightbox_id is changed from data.js and accessed from autoscheduling, check if it can be removed from gantt object
	var state = gantt.$services.getService("state");
	state.registerProvider("lightbox", function () {
		return {
			lightbox: gantt._lightbox_id
		};
	});

	gantt.showLightbox = function (id) {
		var task = this.getTask(id);
		if (!this.callEvent("onBeforeLightbox", [id])) {
			if(gantt.isTaskExists(id) && gantt.getTask(id).$new){
				//GS-2340 if 'onBeforeLightbox' returns 'false' need update the order in datastore
				this.$data.tasksStore._updateOrder();
			}
			return;
		}

		var box = this.getLightbox(this.getTaskType(task.type));

		this.showCover(box);
		this._fill_lightbox(id, box);
		this._setLbPosition(box);
		this._waiAria.lightboxVisibleAttr(box);

		this.callEvent("onLightbox", [id]);
	};

	function _is_chart_visible(gantt) {
		var timeline = gantt.$ui.getView("timeline");
		if (timeline && timeline.isVisible()) {
			return true;
		} else {
			return false;
		}
	}

	gantt._get_timepicker_step = function () {
		if (this.config.round_dnd_dates) {
			var step;
			if (_is_chart_visible(this)) {
				var scale = gantt.getScale();
				step = (helpers.getSecondsInUnit(scale.unit) * scale.step) / 60;//timepicker step is measured in minutes
			}

			if (!step || step >= 60 * 24) {
				step = this.config.time_step;
			}
			return step;
		}
		return this.config.time_step;
	};
	gantt.getLabel = function (property, key) {
		var sections = this._get_typed_lightbox_config();
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].map_to == property) {
				var options = sections[i].options;
				for (var j = 0; j < options.length; j++) {
					if (options[j].key == key) {
						return options[j].label;
					}
				}
			}
		}
		return "";
	};

	gantt.updateCollection = function (list_name, collection) {
		collection = collection.slice(0);
		var list = gantt.serverList(list_name);
		if (!list) return false;
		list.splice(0, list.length);
		list.push.apply(list, collection || []);
		gantt.resetLightbox();
	};
	gantt.getLightboxType = function () {
		return this.getTaskType(this._lightbox_type);
	};

	// how the advanced task form (the task_form plugin) stands in this instance
	function taskFormState() {
		const extensions = gantt.$services.getService("extensionState");
		if (!extensions || !extensions.isAvailable("task_form")) {
			return "absent";
		}
		return extensions.isActive("task_form") ? "active" : "inactive";
	}

	// what the app has to do to get the advanced task form; the classic lightbox renders
	// with the plugin active only when the app turned the form off
	function taskFormAdvice() {
		const lightbox = gantt.config.lightbox;
		const turnedOff = !!lightbox && lightbox.advanced === false;
		switch (taskFormState()) {
			case "absent":
				return ", which this build of Gantt does not include";
			case "active":
				return ": remove gantt.config.lightbox.advanced = false";
			default:
				return turnedOff
					? ": call gantt.plugins({ task_form: true }) and remove gantt.config.lightbox.advanced = false"
					: ": call gantt.plugins({ task_form: true })";
		}
	}

	// `advanced: true` does nothing without the plugin. Silent when the build has no plugin,
	// so that one app config runs on the free and the paid builds.
	function warnAboutInactiveTaskForm() {
		const lightbox = gantt.config.lightbox;
		if (gantt.$_taskFormWarned || !(lightbox && lightbox.advanced) || taskFormState() !== "inactive") {
			return;
		}
		gantt.$_taskFormWarned = true;
		// eslint-disable-next-line no-console
		console.warn("gantt.config.lightbox.advanced is set, but the task_form plugin is not active, "
			+ "so the classic lightbox is used. Call gantt.plugins({ task_form: true }) to turn on the advanced task form.");
	}

	gantt.getLightbox = function (type) {
		var lightboxDiv;
		var fullWidth;
		var html;
		var sns;
		var ds;
		var classNames = "";
		setParentNode();

		if (type === undefined)
			type = this.getLightboxType();

		if (!this._lightbox || this.getLightboxType() != this.getTaskType(type)) {
			warnAboutInactiveTaskForm();
			this._lightbox_type = this.getTaskType(type);
			lightboxDiv = document.createElement("div");
			classNames = "gantt_cal_light";
			fullWidth = this._is_lightbox_timepicker();

			if (gantt.config.wide_form)
				classNames += " gantt_cal_light_wide";

			if (fullWidth) {
				classNames += " gantt_cal_light_full";
			}

			lightboxDiv.className = classNames;

			lightboxDiv.style.visibility = "hidden";
			html = this._lightbox_template;
			html += "<div class='gantt_cal_lcontrols'>";
			html += getHtmlButtons(this.config.buttons_left);
			html += "<div class='gantt_cal_lcontrols_push_right'></div>";
			html += getHtmlButtons(this.config.buttons_right, true);
			html += "</div>";

			lightboxDiv.innerHTML = html;

			gantt._waiAria.lightboxAttr(lightboxDiv);

			if (gantt.config.drag_lightbox) {
				// dragging itself is handled by the popup (dragHandle config)
				lightboxDiv.firstChild.onselectstart = function () {
					return false;
				};
				lightboxDiv.firstChild.style.cursor = "pointer";
			}

			// GS-1428: If there is lightbox node, we need to remove it from the DOM
			if (this._lightbox){
				this.resetLightbox();
			}
			// keep the hidden box in the DOM: sections are queried by id
			// through _lightbox_root before the lightbox is shown; the popup
			// reparents it into the cover on show
			gantt._lightbox_root.appendChild(lightboxDiv);
			this._lightbox = lightboxDiv;
			lightboxDiv.$lbPopup = createLightboxPopup(lightboxDiv);

			sns = this._get_typed_lightbox_config(type);
			html = this._render_sections(sns);

			ds = lightboxDiv.querySelector("div.gantt_cal_larea");
			
			//GS-1131. If gantt_cal_larea is displayed, Firefox renders buttons incorrectly;
			var backup_overflow = ds.style.overflow;
			ds.style.overflow = 'hidden';

			ds.innerHTML = html;

			

			bindLabelsToInputs(sns);

			ds.style.overflow = backup_overflow;

			this._init_lightbox_events(this);
			lightboxDiv.style.display = "none";
			lightboxDiv.style.visibility = "visible";
		}
		return this._lightbox;
	};

	gantt._render_sections = function (sns) {
		var html = "";
		for (var i = 0; i < sns.length; i++) {
			var block = this.form_blocks[sns[i].type];
			if (!block) {
				// rows and columns lay out the advanced task form only
				this.assert(!(Array.isArray(sns[i].cols) || Array.isArray(sns[i].rows)),
					"Lightbox: cols and rows entries need the advanced task form" + taskFormAdvice()
					+ "; their sections are not shown");
				continue; //ignore incorrect blocks
			}
			sns[i].id = "area_" + this.uid();

			var display = sns[i].hidden ? " style='display:none'" : "";
			var button = "";
			if (sns[i].button) {
				button = "<button class='gantt_custom_button' data-index='" + i + "'><div class='gantt_custom_button_" + sns[i].button + "'></div><div class='gantt_custom_button_label'>" + this.locale.labels["button_" + sns[i].button] + "</div></button>";
			}
			if (sns[i].type == "baselines") {
				button = "<button class='gantt_custom_button gantt_remove_baselines' data-index='" + i + "'><div class='gantt_custom_button_delete_baselines'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_remove_all_button + "</div></button>" +
				"<button class='gantt_custom_button gantt_add_baselines' data-index='" + i + "'><div class='gantt_custom_button_add_baseline'></div><div class='gantt_custom_button_label'>" + this.locale.labels.baselines_add_button + "</div></button>";
			}
			if (sns[i].type == "resource_selector") {
				sns[i].index = i;
				button = `<button class='gantt_custom_button gantt_add_resources' data-index='${i}' data-resource-selector-section='${i}' data-section-name='${sns.name}'><div class='gantt_custom_button_add_resources gantt_add'></div><div class='gantt_custom_button_label'>${this.locale.labels.resources_add_button}</div></button>`;
			}
			if (this.config.wide_form) {
				html += "<div class='gantt_wrap_section' " + display + ">";
			}
			// buttons are kept OUTSIDE the <label>: a control-less <label> is
			// implicitly associated with its first labelable descendant, so a
			// button nested here would receive the label's forwarded :hover (and
			// click) — lighting up the first button whenever any part of the
			// section header is hovered. As direct children of the section they
			// keep the same flex placement (order:1 + margin-left:auto) via the
			// `.gantt_cal_lsection .gantt_custom_button` descendant selectors.
			html += "<div id='" + sns[i].id + "' class='gantt_cal_lsection'>" + button + "<label>" + (sns[i].label || this.locale.labels["section_" + sns[i].name]||sns[i].name) + "</label></div>" + block.render.call(this, sns[i]);
			html += "</div>";
		}
		return html;
	};

	gantt._center_lightbox = function(box){
		gantt._setLbPosition(box);
	};
	gantt._setLbPosition = function(box) {
		if(!box){
			return;
		}
		const popup = box.$lbPopup;
		// isDraggedByUser is not in the public UIPopup typing: a popup from a replaced
		// gantt.ext.ui.createModal may lack it
		if (popup && popup.isDraggedByUser && popup.isDraggedByUser()) {
			return;
		}
		const rootElement = gantt._lightbox_root || gantt.$root;
		box.style.top = Math.max(rootElement.offsetHeight / 2 - box.offsetHeight/2, 0) + "px";
		box.style.left = Math.max(rootElement.offsetWidth / 2 - box.offsetWidth/2, 0) + "px";
	};

	gantt.showCover = function (box) {
		if (box && box.$lbPopup) {
			// popup path: cover + centering + focus trap + aria-modal
			box.$lbPopup.show();
			return;
		}
		// legacy path: custom lightboxes and cover-only calls
		if (box){
			box.style.display="block";

			this._setLbPosition(box);
		}
		show_cover();
		this._cover.style.display = "";
	};
	const show_cover=function(){
		if(gantt._cover) {
			return;
		}

		gantt._cover=document.createElement("div");
		gantt._cover.className="gantt_cal_cover";
		gantt._cover.style.display = "none";

		const rootElement = gantt._lightbox_root || gantt.$root;
		rootElement.appendChild(gantt._cover);
	};

	gantt._init_lightbox_events = function () {
		gantt.lightbox_events = {};


		gantt.lightbox_events.gantt_save_btn = function () {
			gantt._save_lightbox();
		};


		gantt.lightbox_events.gantt_delete_btn = function () {
			gantt._lightbox_current_type = null;
			if (!gantt.callEvent("onLightboxDelete", [gantt._lightbox_id]))
				return;

			if (gantt.isTaskExists(gantt._lightbox_id)) {
				gantt.$click.buttons["delete"](gantt._lightbox_id);
			} else {
				gantt.hideLightbox();
			}

		};


		gantt.lightbox_events.gantt_cancel_btn = function () {
			gantt._cancel_lightbox();
		};


		gantt.lightbox_events["default"] = function (e, src) {
			if (src.getAttribute("data-dhx-button")) {
				gantt.callEvent("onLightboxButton", [src.className, src, e]);
			} else {
				var index, block, sec;

				var className = domHelpers.getClassName(src);
				if (className.indexOf("gantt_custom_button") != -1) {
					if (className.indexOf("gantt_custom_button_") != -1) {
						index = src.parentNode.getAttribute("data-index");
						sec = src;
						while (sec && domHelpers.getClassName(sec).indexOf("gantt_cal_lsection") == -1) {
							sec = sec.parentNode;
						}
					} else {
						index = src.getAttribute("data-index");
						sec = src.closest(".gantt_cal_lsection");
						src = src.firstChild;
					}
				}

				var sections = gantt._get_typed_lightbox_config();

				if (index) {
					index = index * 1;
					block = gantt.form_blocks[sections[index * 1].type];
					block.button_click(index, src, sec, sec.nextSibling);
				}
			}
		};
		this.event(gantt.getLightbox(), "click", function (e) {
			if(e.target.closest(".gantt_cal_ltitle_close_btn")){
				gantt._cancel_lightbox();
			}
			var src = domHelpers.getTargetNode(e);

			var className = domHelpers.getClassName(src);
			if (!className) {
				src = src.previousSibling;
				className = domHelpers.getClassName(src);
			}
			if (src && className && className.indexOf("gantt_btn_set") === 0) {
				src = src.firstChild;
				className = domHelpers.getClassName(src);
			}
			if (src && className) {
				var func = gantt.defined(gantt.lightbox_events[src.className]) ? gantt.lightbox_events[src.className] : gantt.lightbox_events["default"];
				return func(e, src);
			}
			return false;
		});

		gantt.getLightbox().onkeydown = function (e) {
			var event = e || window.event;
			var target = e.target || e.srcElement;
			var buttonTarget = domHelpers.getClassName(target).indexOf("gantt_btn_set") > -1;
			var interactiveTarget = target && target.closest && (
				target.tagName === "BUTTON" ||
				!!target.closest(".dhx_ui_resource_grid")
			);

			switch ((e || event).keyCode) {
				case gantt.constants.KEY_CODES.SPACE: {
					if ((e || event).shiftKey) return;
					if (buttonTarget && target.click) {
						target.click();
					}
					break;
				}
				case gantt.keys.edit_save:
					if ((e || event).shiftKey || (e || event).defaultPrevented) return;
					if (buttonTarget && target.click) {
						target.click();
					} else if (!interactiveTarget) {
						gantt._save_lightbox();
					}
					break;
				case gantt.keys.edit_cancel:
					gantt._cancel_lightbox();
					break;
				default:
					break;
			}
		};
	};

	gantt._cancel_lightbox = function () {
		var task = this.getLightboxValues("cancel");
		gantt._lightbox_current_type = null;
		this.callEvent("onLightboxCancel", [this._lightbox_id, task.$new]);
		if (gantt.isTaskExists(task.id) && task.$new) {
			this.silent(function () {
				gantt.$data.tasksStore.removeItem(task.id);
				gantt._update_flags(task.id, null);
			});
			this.refreshData();
		}

		this.hideLightbox();
	};

	gantt._save_lightbox = function () {
		var task = this.getLightboxValues("save");
		gantt._lightbox_current_type = null;
		if (!this.callEvent("onLightboxSave", [this._lightbox_id, task, !!task.$new]))
			return;

		// GS-2170. Do not recalculate the indexes and dates of other tasks
		// as they will be recalculated in the `refreshData`
		gantt.$data.tasksStore._skipTaskRecalculation = "lightbox";
		if (task.$new) {
			delete task.$new;
			this.addTask(task, task.parent, this.getTaskIndex(task.id));
		} else if (this.isTaskExists(task.id)) {
			this.mixin(this.getTask(task.id), task, true);
			this.refreshTask(task.id);
			this.updateTask(task.id);
		}
		gantt.$data.tasksStore._skipTaskRecalculation = false;
		this.refreshData();

		// TODO: do we need any blockable events here to prevent closing lightbox?
		this.hideLightbox();
		return true;
	};

	gantt._resolve_default_mapping = function (section) {
		var mapping = section.map_to;
		var time_controls = {
			time: true, time_optional: true, duration: true, duration_optional: true,
			time_select: true, time_select_optional: true, duration_select: true, duration_select_optional: true
		};
		if (time_controls[section.type]) {
			if (section.map_to == "auto") {
				mapping = { start_date: "start_date", end_date: "end_date", duration: "duration" };
			} else if (typeof (section.map_to) === "string") {
				mapping = { start_date: section.map_to };
			}
		} else if (section.type === "constraint") {
			if (!section.map_to || typeof (section.map_to) === "string") {
				mapping = { constraint_type: "constraint_type", constraint_date: "constraint_date" };
			}
		}

		return mapping;
	};

	gantt.getLightboxValues = function (type) {
		let task = {};

		if (gantt.isTaskExists(this._lightbox_id)) {
			task = this.mixin({}, this.getTask(this._lightbox_id));
		}

		const sns = this._get_typed_lightbox_config();
		// GS-2370: if there is a resource with its calendar
		// need to place time section at the end
		const sortedSns = [...sns].sort((a, b) => {
			if (a.name === "time") return 1;
			if (b.name === "time") return -1;
			return 0;
		});
		for (let i = 0; i < sortedSns.length; i++) {
			let node = gantt._lightbox_root.querySelector("#" + sortedSns[i].id);
			node = (node ? node.nextSibling : node);
			let block = this.form_blocks[sortedSns[i].type];
			if (!block) continue;
			let res = block.get_value.call(this, node, task, sortedSns[i], type);
			let map_to = gantt._resolve_default_mapping(sortedSns[i]);
			if (typeof map_to == "string" && map_to != "auto") {
				task[map_to] = res;
			} else if (typeof map_to == "object") {
				for (let property in map_to) {
					if (map_to[property])
						task[map_to[property]] = res[property];
				}
			}
		}
		// GS-1282 We need to preserve the task type even if the lightbox doesn't have the typeselect section
		// GS-2460 set the current type from selector
		if (gantt._lightbox_current_type) {
			task.type = gantt._lightbox_current_type;
		}

		return task;
	};


	gantt.hideLightbox = function () {
		var box = this.getLightbox();
		if (box) box.style.display = "none";

		this._waiAria.lightboxHiddenAttr(box);
		this._lightbox_id = null;

		this.hideCover(box);
		this.resetLightbox();
		this.callEvent("onAfterLightbox", []);
	};
	gantt.hideCover = function (box) {
		if (box && box.$lbPopup) {
			// removes the cover, restores focus, pops the modal stack
			box.$lbPopup.hide();
		} else if (box) {
			box.style.display = "none";
		}
		if (this._cover)
			this._cover.parentNode.removeChild(this._cover);
		this._cover = null;
	};
	function destroyLightboxControls(box) {
		if (!box || !box.querySelectorAll) {
			return;
		}
		// Controls may be exposed on section hosts, resource rows, or
		// resource-selector cells. Destroy each instance once before removing
		// the lightbox DOM so child dropdown popups release their listeners.
		var controls = [];
		function collect(node) {
			["$uiControl", "$uiAmount", "$firstControl"].forEach(function (key) {
				var control = node && node[key];
				if (control && typeof control.destroy === "function" && controls.indexOf(control) === -1) {
					controls.push(control);
				}
			});
		}
		collect(box);
		var nodes = box.querySelectorAll("*");
		for (var i = 0; i < nodes.length; i++) {
			collect(nodes[i]);
		}
		controls.forEach(function (control) {
			try {
				control.destroy();
			} catch (e) {
				// A custom control must not prevent lightbox removal.
			}
		});
	}

	gantt.resetLightbox = function () {
		if (gantt._lightbox && !gantt._custom_lightbox){
			if (gantt._lightbox.$lbPopup){
				gantt._lightbox.$lbPopup.destroy();
				gantt._lightbox.$lbPopup = null;
			}
			destroyLightboxControls(gantt._lightbox);
			gantt._lightbox.remove();
		}
		gantt._lightbox = null;
	};
	gantt._set_lightbox_values = function (data, box) {
		var task = data;
		var s = box.getElementsByTagName("span");
		var lightboxHeader = [];
		if (gantt.templates.lightbox_header) {
			lightboxHeader.push("");
			lightboxHeader.push(gantt.templates.lightbox_header(task.start_date, task.end_date, task));
			s[1].innerHTML = "";
			s[2].innerHTML = gantt.templates.lightbox_header(task.start_date, task.end_date, task);
		} else {
			lightboxHeader.push(this.templates.task_time(task.start_date, task.end_date, task));
			lightboxHeader.push(String(this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70)); //IE6 fix
			s[1].innerHTML = this.templates.task_time(task.start_date, task.end_date, task);
			s[2].innerHTML = String(this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70); //IE6 fix
		}
		s[1].innerHTML = lightboxHeader[0];
		s[2].innerHTML = lightboxHeader[1];

		gantt._waiAria.lightboxHeader(box, lightboxHeader.join(" "));

		var sns = this._get_typed_lightbox_config(this.getLightboxType());
		for (var i = 0; i < sns.length; i++) {
			var section = sns[i];

			if (!this.form_blocks[section.type]) {
				continue;//skip incorrect sections, same check is done during rendering
			}


			var node = gantt._lightbox_root.querySelector("#" + section.id).nextSibling;
			var block = this.form_blocks[section.type];
			var map_to = gantt._resolve_default_mapping(sns[i]);
			var value = this.defined(task[map_to]) ? task[map_to] : section.default_value;
			block.set_value.call(gantt, node, value, task, section);

			if (section.focus)
				block.focus.call(gantt, node);
		}
		// kit-backed sections (switch, combo, datepicker...) mount their input on the
		// first set_value, after the build bound the labels: bind them again
		bindLabelsToInputs(sns);
		if (gantt.isTaskExists(data.id)){
			gantt._lightbox_id = data.id;
		}
	};
	gantt._fill_lightbox = function (id, box) {
		var task = this.getTask(id);
		this._set_lightbox_values(task, box);
	};


	gantt.getLightboxSection = function (name) {
		var config = this._get_typed_lightbox_config();
		var i = 0;
		for (i; i < config.length; i++)
			if (config[i].name == name)
				break;
		var section = config[i];
		if (!section)
			return null;

		if (!this._lightbox)
			this.getLightbox();
		// a section that the lightbox did not render, for example a field of the advanced task form
		var header = section.id ? gantt._lightbox_root.querySelector("#" + section.id) : null;
		if (!header)
			return null;
		var node = header.nextSibling;

		var result = {
			section: section,
			header: header,
			node: node,
			getValue: function (ev) {
				return gantt.form_blocks[section.type].get_value.call(gantt, node, (ev || {}), section);
			},
			setValue: function (value, ev) {
				return gantt.form_blocks[section.type].set_value.call(gantt, node, value, (ev || {}), section);
			}
		};

		var handler = this._lightbox_methods["get_" + section.type + "_control"];
		return handler ? handler(result) : result;
	};

	gantt._lightbox_methods.get_template_control = function (result) {
		result.control = result.node;
		return result;
	};
	gantt._lightbox_methods.get_select_control = function (result) {
		// ui-core Step 6: the select section is a kit Combo — expose its <input>
		// (the value is the option label; use getValue()/get_value for the key)
		result.control = result.node.getElementsByTagName("input")[0];
		return result;
	};
	gantt._lightbox_methods.get_textarea_control = function (result) {
		result.control = result.node.getElementsByTagName("textarea")[0];
		return result;
	};
	gantt._lightbox_methods.get_time_control = function (result) {
		// ui-core Step 6: the time section is a DatePicker + TimeInput composite —
		// expose the <input>s (was the array of native <select>s)
		result.control = result.node.getElementsByTagName("input"); // array-like
		return result;
	};
	function getNativeDateSelects(result) {
		result.control = result.node.getElementsByTagName("select");
		return result;
	}
	gantt._lightbox_methods.get_time_select_control = getNativeDateSelects;
	gantt._lightbox_methods.get_time_select_optional_control = getNativeDateSelects;
	gantt._lightbox_methods.get_duration_select_control = getNativeDateSelects;
	gantt._lightbox_methods.get_duration_select_optional_control = getNativeDateSelects;


	// drag_lightbox moving is implemented by the popup primitive
	// (dragHandle config in createLightboxPopup) since ui-core Step 4

	gantt._focus = function (node, select) {
		if (node && node.focus) {
			if (gantt.config.touch) {
				//do not focus editor, to prevent auto-zoom
			} else {
				try {
					if (select && node.select) node.select();
					node.focus();
				} catch (e) {
					// silent errors
				}
			}
		}
	};


	gantt.form_blocks = {
		template: new TemplateControl(),
		textarea: new TextareaControl(),
		select: selectControlFactory(gantt),
		time: timeControlFactory(gantt),
		duration: durationControlFactory(gantt),
		time_select: timeSelectControlFactory(gantt),
		duration_select: durationSelectControlFactory(gantt),
		parent: ParentControl,
		radio: new RadioControl(),
		checkbox: new CheckboxControl(),
		resources: resourcesControlFactory(gantt),
		constraint: constraintControlFactory(gantt),
		baselines: baselineControlFactory(gantt),
		typeselect: new TypeselectControl(),
		resource_selector: resourceSelectorControlFactory(gantt),
		// ui-core kit-backed blocks (docs/internal/ui-core): the factories
		// return ready form-block objects, not classes — per-section state
		// lives on the section node (see controls/form_block_adapter.ts)
		combo: comboControlFactory(gantt),
		datepicker: datepickerControlFactory(gantt),
		stepper: stepperControlFactory(gantt),
		text: textControlFactory(gantt),
		switch: switchControlFactory(gantt),
		progress: progressControlFactory(gantt),
		calendar: calendarControlFactory(gantt)
	};

	gantt._is_lightbox_timepicker = function () {
		var s = this._get_typed_lightbox_config();
		for (var i = 0; i < s.length; i++)
			if (s[i].name === "time" && (s[i].type === "time" || s[i].type === "time_select"))
				return true;
		return false;
	};

	gantt._delete_task_confirm = function ({task, message, title, callback, ok}){
		gantt._simple_confirm(message, title, callback, ok);
	};
	gantt._delete_link_confirm = function({link, message, title, callback, ok}){
		gantt._simple_confirm(message, title, callback, ok);
	};

	gantt._simple_confirm = function (message, title, callback, ok) {
		if (!message)
			return callback();
		var opts = { text: message };
		if (title)
			opts.title = title;
		if (ok) {
			opts.ok = ok;
		}
		if (callback) {
			opts.callback = function (result) {
				if (result)
					callback();
			};
		}
		gantt.confirm(opts);
	};

	function _get_type_name(type_value) {
		for (var i in this.config.types) {
			if (this.config.types[i] == type_value) {
				return i;
			}
		}
		return "task";
	}

	gantt._get_typed_lightbox_config = function (type) {
		if (type === undefined) {
			type = this.getLightboxType();
		}

		var field = _get_type_name.call(this, type);

		if (gantt.config.lightbox[field + "_sections"]) {
			return classicSections(gantt.config.lightbox[field + "_sections"], field);
		} else {
			return classicSections(gantt.config.lightbox.sections, field);
		}
	};

	// the default sections of this gantt, for a lightbox setting without sections. They are
	// made once: rendering stamps an id on each section, and saving finds the section by it
	let defaultSections = null;

	// the flat section array of a setting that the advanced task form also accepts
	function classicSections(config, typeName) {
		if (config && !Array.isArray(config) && Array.isArray(config.tabs)) {
			// grouped sections: the sections of all tabs in order. cols and rows entries stay,
			// so that _render_sections reports them
			const sections = [];
			config.tabs.forEach(function (tab) {
				if (tab && Array.isArray(tab.children)) {
					tab.children.forEach(function (entry) {
						if (entry) {
							sections.push(entry);
						}
					});
				}
			});
			return sections;
		}
		// only a missing list gets the defaults: other values are read as they are
		if (config !== undefined && config !== null) {
			return config;
		}
		if (!defaultSections) {
			defaultSections = defaultLightboxSections();
		}
		return defaultSections[typeName + "_sections"] || defaultSections.sections;
	}

	gantt._silent_redraw_lightbox = function (type) {
		var oldType = this.getLightboxType();

		if (this.getState().lightbox) {
			var taskId = this.getState().lightbox;
			var formData = this.getLightboxValues(),
				task = this.copy(this.getTask(taskId));

			this.resetLightbox();

			var updTask = this.mixin(task, formData, true);
			var box = this.getLightbox(type ? type : undefined);
			this._set_lightbox_values(updTask, box);
			this.showCover(box);
		} else {
			this.resetLightbox();
			this.getLightbox(type ? type : undefined);
		}
		this.callEvent("onLightboxChange", [oldType, this.getLightboxType()]);
	};

	function bindLabelsToInputs(sns) {
		var section;
		var label;
		var labelBlock;
		var inputBlock;
		var input;
		var i;

		for (i = 0; i < sns.length; i++) {
			section = sns[i];
			labelBlock = gantt._lightbox_root.querySelector("#" + section.id);

			if (!section.id || !labelBlock) continue;

			label = labelBlock.querySelector("label");
			inputBlock = labelBlock.nextSibling;

			if (!inputBlock) continue;

			input = inputBlock.querySelector("input, select, textarea");
			if (input && label) {
				input.id = input.id || "input_" + gantt.uid();
				section.inputId = input.id;
				label.setAttribute("for", section.inputId);
			}
		}
	}

	function getHtmlButtons(buttons, floatRight) {
		var button;
		var ariaAttr;
		var html = "";
		var i;

		for (i = 0; i < buttons.length; i++) {
			// needed to migrate from 'dhx_something' to 'gantt_something' naming in a lightbox
			button = gantt.config._migrate_buttons[buttons[i]] ? gantt.config._migrate_buttons[buttons[i]] : buttons[i];

			ariaAttr = gantt._waiAria.lightboxButtonAttrString(button);
			html += "<div " + ariaAttr + " class='gantt_btn_set gantt_left_btn_set " + button + "_set'" + "><div dhx_button='1' data-dhx-button='1' class='" + button + "'></div><div>" + gantt.locale.labels[button] + "</div></div>";
		}
		return html;
	}
};
