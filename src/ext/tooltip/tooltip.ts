import { Popup } from "../../core/ui/popup/popup";
import { getGanttUiKit } from "../../core/ui/gantt_ui_kit";
import globalScope from "../../utils/global";

/**
 * Tooltip — the public gantt.ext.tooltips.tooltip facade.
 *
 * Since the ui-core migration (Step 1, docs/internal/ui-core/03-migration-status.md)
 * container handling, positioning and lifecycle are delegated to the popup
 * primitive; this class keeps the legacy API (getNode/setViewport/show/hide/
 * setContent) and the legacy DOM contract intact:
 * - a bare `<div class="gantt_tooltip">` node — the popup runs `unstyled`,
 *   so tooltip.less stays the single owner of the look (incl. z-index) and
 *   user CSS overrides keep their specificity;
 * - content placed directly inside the node (`bareContent`), so user CSS
 *   with child combinators keeps matching;
 * - attached to document.body (not gantt._lightbox_root), as before.
 *
 * Cursor positioning semantics (offsets, boundary clamping, flip to the
 * other side of the cursor, GS-2827 left >= 0) moved to the pure
 * computeCursorPosition in core/ui/popup/position.ts — unit-tested there.
 */
export class Tooltip {
	private _gantt: any;
	private _root: HTMLElement;
	private _popup: Popup;
	private _position: any;

	constructor(gantt: any){
		this._gantt = gantt;
		this._position = {
			type: "cursor",
			x: 0,
			y: 0,
			offsetX: 0,
			offsetY: 0,
			boundary: () => this._getViewPort()
		};
		this._popup = getGanttUiKit(gantt).createPopup({
			className: "gantt_tooltip",
			role: "tooltip",
			unstyled: true,
			bareContent: true,
			cssPosition: "absolute",
			container: () => document.body,
			position: this._position
		});
	}

	getNode() : HTMLElement {
		if (!this._popup.getNode()) {
			// force lazy node creation without showing (legacy getNode contract:
			// always returns an element, e.g. for hover-target checks)
			this._popup.setContent("");
		}
		return this._popup.getNode();
	}

	setViewport(node: HTMLElement):Tooltip{
		this._root = node;
		return this;
	}

	show(left: number, top: number): Tooltip;
	show(event: MouseEvent): Tooltip;
	show(left: number | MouseEvent, top?: number): Tooltip {
		const gantt = this._gantt;
		const position = this._position;

		if (this._isLikeMouseEvent(left)) {
			const event = left as MouseEvent;
			position.type = "cursor";
			position.x = event.clientX;
			position.y = event.clientY;
			position.offsetX = gantt.config.tooltip_offset_x;
			position.offsetY = gantt.config.tooltip_offset_y;
		} else {
			// explicit coordinates are documented as relative to document.body:
			// exact placement, no boundary handling. Popup coordinates are
			// viewport-relative (the absolute-mode popup adds the page scroll
			// back), so the page coordinates are converted here
			position.type = "point";
			position.clamp = false;
			position.x = (left as number) - (globalScope.pageXOffset || 0);
			position.y = (top as number) - (globalScope.pageYOffset || 0);
		}

		this._popup.show();
		gantt._waiAria.tooltipVisibleAttr(this.getNode());
		return this;
	}

	hide() : Tooltip{
		this._popup.hide();
		this._gantt._waiAria.tooltipHiddenAttr(this.getNode());
		return this;
	}

	setContent(html: string) : Tooltip{
		this._popup.setContent(html);
		return this;
	}

	// it is for salesforce, because it proxies event to it own events
	private _isLikeMouseEvent(event: any): boolean {
		if (!event || typeof event !== "object") {
			return false;
		}
		return "clientX" in event && "clientY" in event;
	}

	private _getViewPort() : HTMLElement {
		const gantt = this._gantt;
		let root = this._root || document.body;
		// support for the initial tooltip mode where the tooltip element
		// was attached to the data area of gantt
		if (root === gantt.$task_data) {
			root = gantt.$task;
		}
		return root;
	}
}
