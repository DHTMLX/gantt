import type { Id } from "../../types/gantt_types";
import type { IQuickInfoContent } from "../../types.d.ts";
import { Popup } from "../../core/ui/popup/popup";
import { getGanttUiKit } from "../../core/ui/gantt_ui_kit";

interface IQuickInfoContainer{
	parent: HTMLElement;
	xViewport: HTMLElement;
	yViewport: HTMLElement;
}

/**
 * QuickInfo — the public gantt.ext.quickInfo facade.
 *
 * Since the ui-core migration (Step 2, docs/internal/ui-core/03-migration-status.md)
 * the node lifecycle and the detached-mode positioning are delegated to the
 * popup primitive (anchor mode with the gantt viewport as the boundary box —
 * GS-871); this class keeps the legacy contracts intact:
 * - API: show(id) / show(x, y) / hide(forced) / getNode / setContainer / setContent;
 * - DOM: a bare `<div class="gantt_cal_quick_info">` (the popup runs
 *   `unstyled` + `bareContent` + `cssPosition:"absolute"` — quickinfo.less
 *   stays the single owner of the look), appended into the same container
 *   as before (task data area / grid data area / custom via setContainer);
 * - content pipeline: quick_info_* templates, quickinfo_buttons, readonly
 *   button filtering, $click.buttons routing — unchanged;
 * - events: onQuickInfo / onAfterQuickInfo timing preserved. Dismissal stays
 *   event-driven in ext/quick_info/index.ts (gantt's onEmptyClick semantics —
 *   clicks OUTSIDE the gantt must NOT hide the box, unlike the primitive's
 *   document-level outside-click).
 * - attached mode (quick_info_detached: false) docks the box at the left or
 *   right edge of gantt.$root (position type "none": the caller owns the
 *   coordinates); the slide-in animation is dropped by design decision D6.
 */
export class QuickInfo {
	private _quickInfoTask: Id | null = null;
	private _quickInfoBoxId: number | string | null = null;
	private _quickInfoBox: HTMLElement | null = null;
	private _quickInfoReadonly: boolean | null = null;
	private _container: HTMLElement | null = null;
	private _gantt: any;
	private _popup: Popup | null = null;
	private _position: any = null;

	constructor(gantt: any) {
		this._gantt = gantt;
	}

	// show at coordinates:
	// show(x: number, y: number)
	// show for a task:
	// show(id: TaskID)
	show : {
		(x: number, y: number) : void;
		(id: Id) : void;
	} = (id: Id | number, y? : number) : void => {
		if (y === undefined) {
			this._showForTask(id);
		} else {
			this._showAtCoordinates(id as number, y);
		}
	};

	hide = (forced?: boolean) : any => {
		const gantt = this._gantt;
		const qi = this._quickInfoBox;
		this._quickInfoBoxId = 0;
		const taskId = this._quickInfoTask;
		this._quickInfoTask = null;

		if (this._popup && this._popup.isVisible()){
			// a host layout rebuild can detach the node without hide(); test the
			// popup state, not parentNode, which Popup.hide() tolerates missing
			this._popup.hide();
			gantt.callEvent("onAfterQuickInfo", [taskId]);
		} else if (qi && qi.parentNode) {
			qi.parentNode.removeChild(qi);
			gantt.callEvent("onAfterQuickInfo", [taskId]);
		}
	};

	getNode = (): HTMLElement | null => {
		if(this._quickInfoBox) {
			return this._quickInfoBox;
		}
		return null;
	};

	setContainer = (container: string|HTMLElement): void => {
		if(container){
			this._container = typeof container === "string" ? document.getElementById(container) : container;
		}
	};

	setContent = (content?: IQuickInfoContent) => {
		const gantt = this._gantt;

		const defaultContent = {
			taskId: null,
			header: {
				title: "",
				date: ""
			},
			content: "",
			buttons: gantt.config.quickinfo_buttons
		};

		if(!content){
			content = defaultContent;
		}

		if(!content.taskId){
			content.taskId = defaultContent.taskId;
		}

		if(!content.header){
			content.header = defaultContent.header;
		}

		if(!content.header.title){
			content.header.title = defaultContent.header.title;
		}
		if(!content.header.date){
			content.header.date = defaultContent.header.date;
		}
		if(!content.content){
			content.content = defaultContent.content;
		}
		if(!content.buttons){
			content.buttons = defaultContent.buttons;
		}


		let qi = this.getNode();
		if(!qi){
			qi = this._createQuickInfoElement();
		}

		if(content.taskId){
			this._quickInfoBoxId = content.taskId;
		}

		const titleBox = qi.querySelector(".gantt_cal_qi_title") as HTMLElement;
		const titleContent = titleBox.querySelector(".gantt_cal_qi_tcontent");
		const titleDate = titleBox.querySelector(".gantt_cal_qi_tdate");
		const main = qi.querySelector(".gantt_cal_qi_content");
		const controls = qi.querySelector(".gantt_cal_qi_controls") as HTMLElement;

		gantt._waiAria.quickInfoHeader(qi, [content.header.title, content.header.date].join(" "));

		titleContent!.innerHTML = `<span>${content.header.title}</span>`;
		titleDate!.innerHTML = content.header.date;

		if(!content.header.title && !content.header.date){
			titleBox.style.display = "none";
		}else{
			titleBox.style.display = "";
		}
		main!.innerHTML = content.content;

		const buttons = content.buttons;
		if(buttons && !buttons.length){
			controls.style.display = "none";
		}else{
			controls.style.display = "";
		}
		let html = "";
		for (let i = 0; i < buttons!.length; i++){

			const ariaAttr = gantt._waiAria.quickInfoButtonAttrString(gantt.locale.labels[buttons![i]]);

			html += `<div class="gantt_qi_big_icon ${buttons![i]} dhx_gantt_${buttons![i]}" title="${gantt.locale.labels[buttons![i]]}" ${ariaAttr}>
            <div class='dhx_menu_icon dhx_gantt_icon ${buttons![i]} gantt_menu_icon dhx_gantt_${buttons![i]}'></div>
            <div>${gantt.locale.labels[buttons![i]]}</div>
         </div>`;
		}
		controls.innerHTML = html;

		gantt.eventRemove(qi, "click", this._qiButtonClickHandler);
		gantt.eventRemove(qi, "keypress", this._qiKeyPressHandler);

		gantt.event(qi, "click", this._qiButtonClickHandler);
		gantt.event(qi, "keypress", this._qiKeyPressHandler);
	};

	private _qiButtonClickHandler = (ev: any) => {
		this._qi_button_click(ev.target);
	};

	private _qiKeyPressHandler = (e: any) => {

		const code = e.which;
		if (code === 13 || code === 32){
			setTimeout(() => {
				this._qi_button_click(e.target);
			},1);
		}
	};

	private _showAtCoordinates(x: number, y: number) : void {
		this.hide(true);
		this._quickInfoBoxId = 0;
		this._quickInfoTask = null;
		if(!this._quickInfoBox){
			this._createQuickInfoElement();
			this.setContent();
		}

		// the documented coordinates are relative to the container; popup
		// coordinates are viewport-relative (the absolute-mode popup
		// translates them back at placement time)
		const parent = this._getContainer().parent;
		const rect = parent.getBoundingClientRect();
		const position = this._position;
		position.type = "point";
		position.clamp = false;
		position.x = x + rect.left + parent.clientLeft - parent.scrollLeft;
		position.y = y + rect.top + parent.clientTop - parent.scrollTop;
		this._popup!.show();

		this._gantt.callEvent("onQuickInfo", [null]);
	}

	private _showForTask(id: Id) : void {
		const gantt = this._gantt;
		if ((
			id === this._quickInfoBoxId &&
			gantt.utils.dom.isChildOf(this._quickInfoBox, document.body)
		) || !gantt.config.show_quick_info) {
			// not show if the quick info is already displayed for this task, or if it shouldn't be displayed
			return;
		}
		this.hide(true);

		let anchor = gantt.getTaskNode(id);
		if (!anchor) {
			anchor = gantt.getTaskRowNode(id);
			if (!anchor) {
				return;
			}
		}

		const offset = 6; // offset TASK <> QI-BOX in 'px'
		this._quickInfoBox = this._init_quick_info(id);
		this._quickInfoTask = id;
		this._quickInfoBox.className = this._prepare_quick_info_classname(id);

		this._fill_quick_data(id);

		const position = this._position;
		if (gantt.config.quick_info_detached) {
			// anchor below the task, flipped above when it does not fit,
			// kept inside the visible gantt viewport (GS-871)
			position.type = "anchor";
			position.target = anchor;
			position.side = "bottom";
			position.flip = true;
			position.offset = offset;
			this._popup!.show();
		} else {
			// docked panel at the far edge of gantt.$root — the popup only
			// manages the node; the coordinates are owned here (slide-in
			// animation dropped by decision D6)
			position.type = "none";
			this._popup!.show();
			const qi = this._quickInfoBox;
			const xViewport = this._getContainer().xViewport;
			const anchorRect = anchor.getBoundingClientRect();
			const viewRect = xViewport.getBoundingClientRect();
			const dockLeft = (anchorRect.left + anchorRect.width / 2 - viewRect.left) > viewRect.width / 2;
			qi.style.top = "20px";
			if (dockLeft) {
				qi.style.right = "auto";
				qi.style.left = "10px";
			} else {
				qi.style.left = "auto";
				qi.style.right = "10px";
			}
			qi.className += " gantt_qi_" + (dockLeft ? "left" : "right");
		}

		gantt.callEvent("onQuickInfo", [id]);
	}

	private _createQuickInfoElement() : HTMLElement {
		const gantt = this._gantt;

		if (this._popup) {
			this._popup.destroy();
		}
		// the visible gantt viewport constrains anchor positioning (GS-871)
		this._position = {
			boundary: () => this._getContainer().xViewport
		};
		const popup = getGanttUiKit(gantt).createPopup({
			className: "gantt_cal_quick_info",
			role: "dialog",
			unstyled: true,
			bareContent: true,
			cssPosition: "absolute",
			container: () => gantt.config.quick_info_detached ?
				this._getContainer().parent :
				gantt.$root,
			position: this._position
		});
		this._popup = popup;

		// title
		const ariaAttr = gantt._waiAria.quickInfoHeaderAttrString();
		var html = `
		<div class="gantt_cal_qi_tcontrols">
			<a class="gantt_cal_qi_close_btn dhx_gantt_icon dhx_gantt_icon_close"></a>
		</div>
		<div class="gantt_cal_qi_title" ${ariaAttr}>

				<div class="gantt_cal_qi_tcontent"></div>
				<div class="gantt_cal_qi_tdate"></div>
			</div>
			<div class="gantt_cal_qi_content"></div>`;

		//buttons
		html += "<div class=\"gantt_cal_qi_controls\">";

		html += "</div>";

		popup.setContent(html);
		const qi = popup.getNode() as HTMLElement;
		gantt._waiAria.quickInfoAttr(qi);

		if (gantt.config.quick_info_detached) {
			const container = this._getContainer();
			gantt.event(container.parent, "scroll", () => { this.hide(); });
		}

		this._quickInfoBox = qi;
		return qi;
	}

	private _init_quick_info(id: Id) : HTMLElement {
		const gantt = this._gantt;
		const task = gantt.getTask(id);


		if(typeof this._quickInfoReadonly === "boolean"){
			if(gantt.isReadonly(task) !== this._quickInfoReadonly){
				this.hide(true);
				this._quickInfoBox = null;
			}
		}

		this._quickInfoReadonly = gantt.isReadonly(task);

		if (!this._quickInfoBox){
			this._quickInfoBox = this._createQuickInfoElement();
		}

		return this._quickInfoBox;
	}

	private _prepare_quick_info_classname(id: Id) : string {
		const gantt = this._gantt;
		const task = gantt.getTask(id);
		const taskType = gantt.getTaskType(task);

		let css = `gantt_cal_quick_info gantt_${taskType}`;
		const template = gantt.templates.quick_info_class(task.start_date, task.end_date, task);

		if(template){
			css += " " + template;
		}
		return css;
	}

	private _fill_quick_data(id: Id) : void {
		const gantt = this._gantt;
		const ev = gantt.getTask(id);

		this._quickInfoBoxId = id;

		let allowedButtons = [];
		if (this._quickInfoReadonly){
			const buttons = gantt.config.quickinfo_buttons;
			const isEditor: any = {icon_delete: true, icon_edit: true};
			for (let i = 0; i < buttons.length; i++){
				if(this._quickInfoReadonly && isEditor[buttons[i]]){
					continue;
				}
				allowedButtons.push(buttons[i]);
			}
		} else {
			allowedButtons = gantt.config.quickinfo_buttons;
		}

		this.setContent({
			header: {
				title: gantt.templates.quick_info_title(ev.start_date, ev.end_date, ev),
				date: gantt.templates.quick_info_date(ev.start_date, ev.end_date, ev)
			},
			content: gantt.templates.quick_info_content(ev.start_date, ev.end_date, ev),
			buttons: allowedButtons
		});
	}

	private _qi_button_click(node: any) : void {
		const gantt = this._gantt;
		const box = this._quickInfoBox;
		if (!node || node === box){
			return;
		}
		if(node.closest(".gantt_cal_qi_close_btn")){
			this.hide();
			return;
		}

		const mask = node.className;
		if (mask.indexOf("_icon") !== -1){
			const id = this._quickInfoBoxId;
			gantt.$click.buttons[mask.split(" ")[1].replace("icon_","")](id);
		} else {
			this._qi_button_click(node.parentNode);
		}
	}

	private _getContainer(): IQuickInfoContainer{
		const gantt = this._gantt;
		let container = this._container ? this._container : gantt.$task_data;
		if (container && container.offsetHeight && container.offsetWidth) {
			return {
				parent: container,
				xViewport: gantt.$task,
				yViewport: gantt.$task_data
			};
		}
		container = this._container ? this._container : gantt.$grid_data;
		if (container && container.offsetHeight && container.offsetWidth) {
			return {
				parent: container,
				xViewport: gantt.$grid,
				yViewport: gantt.$grid_data
			};
		}

		return {
			parent: this._container ? this._container : gantt.$layout,
			xViewport: gantt.$layout,
			yViewport: gantt.$layout
		};
	}
}
