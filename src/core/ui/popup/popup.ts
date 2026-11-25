import { IUiContext } from "../ui_context";
import {
	computeAnchorPosition, computeCenterPosition, computeCursorPosition,
	computePointPosition, IBoundaryBox, PopupSide
} from "./position";

export type PopupRole = "dialog" | "alertdialog" | "tooltip" | "menu" | "listbox" | "none";
export type PopupZBand = "popup" | "modal" | "notification";
export type PopupContent = HTMLElement | string | ((body: HTMLElement) => void);

export interface IPopupPositionConfig {
	/** "none": the popup never positions its node — the caller owns the
	 * coordinates entirely (docked panels, e.g. attached-mode quick info) */
	type?: "center" | "anchor" | "point" | "cursor" | "none";
	/** anchor mode: the element the popup is attached to */
	target?: HTMLElement;
	side?: PopupSide;
	flip?: boolean;
	/** Keep vertical popups above/below and horizontal popups left/right,
	 * clamping cross-axis overflow instead of changing axes. */
	lockAxis?: boolean;
	offset?: number;
	/** anchor mode: stretch popup min-width to the anchor width (combo dropdowns) */
	matchTargetWidth?: boolean;
	/** point/cursor mode coordinates, viewport-relative */
	x?: number;
	y?: number;
	/** point mode: set false to place at the exact coordinates without viewport clamping */
	clamp?: boolean;
	/** cursor mode: gap between the cursor and the popup (tooltip_offset_*) */
	offsetX?: number;
	offsetY?: number;
	/** cursor/anchor/center mode: element whose box constrains the popup; defaults to the window viewport */
	boundary?: HTMLElement | (() => HTMLElement | null);
}

export interface IPopupDismissConfig {
	escape?: boolean;
	outsideClick?: boolean;
}

export interface IPopupConfig {
	container?: HTMLElement | (() => HTMLElement | null);
	role?: PopupRole;
	label?: string | (() => string);
	position?: IPopupPositionConfig;
	dismiss?: IPopupDismissConfig;
	/**
	 * Elements that don't count as "outside" for outside-click dismissal
	 * (e.g. the input a dropdown is anchored to).
	 */
	ignoreOutsideClick?: HTMLElement[];
	className?: string;
	zBand?: PopupZBand;
	/**
	 * Legacy-compat options for migrated overlays whose CSS class predates
	 * the ui-core skin (e.g. gantt_tooltip):
	 * - unstyled: the node gets ONLY config.className — no dhx_ui_popup
	 *   skin and no z-band class, the legacy stylesheet stays in charge;
	 * - bareContent: content is placed directly into the popup node (no
	 *   .dhx_ui_popup_body wrapper), so user CSS with child combinators
	 *   keeps matching;
	 * - cssPosition "absolute": legacy overlays rendered position:absolute;
	 *   fixed-position nodes land on a compositing layer where Chrome drops
	 *   subpixel antialiasing, which visibly changes text rendering (caught
	 *   by the legacy_tooltip screenshot baseline). Computed viewport
	 *   coordinates are translated to page coordinates automatically;
	 * - node: ADOPT an existing element as the popup node instead of creating
	 *   one — markup, classes and aria attributes stay with the owner, the
	 *   popup only manages container/visibility/position/lifecycle (message
	 *   boxes build their legacy gantt_modal_box element and hand it over).
	 */
	unstyled?: boolean;
	bareContent?: boolean;
	cssPosition?: "fixed" | "absolute";
	node?: HTMLElement;
	/**
	 * Modal-only legacy-compat options:
	 * - autoFocus false: skip the intrinsic focus-first on show (message
	 *   boxes keep their own delayed focus, which the kb-nav extension's
	 *   save/restore logic depends on);
	 * - backdropClassName: replaces the default backdrop classes so the
	 *   legacy cover CSS (e.g. dhx_modal_cover, z-index 17) keeps working;
	 * - nestInBackdrop: the popup node is appended INSIDE the backdrop —
	 *   the lightbox DOM contract is `.gantt_cal_cover > .gantt_cal_light`
	 *   and user CSS relies on that nesting.
	 */
	autoFocus?: boolean;
	backdropClassName?: string;
	nestInBackdrop?: boolean;
	/**
	 * Element that drags the popup (the lightbox header under
	 * config.drag_lightbox). While the user has dragged the popup,
	 * reposition() is suspended until the next hide().
	 */
	dragHandle?: HTMLElement | (() => HTMLElement | null);
}

/**
 * Popup — the shared overlay primitive of the UI core (design §5).
 * Owns: container resolution, positioning, dismissal, lifecycle events.
 * Modality (backdrop, focus trap, stacking) lives in ModalPopup.
 *
 * No DOM is touched until show() is called, so constructing popups is safe
 * in headless/stub environments.
 */
export class Popup {
	// eventable API, mixed in by the constructor
	public attachEvent: (name: string, handler: (...args: any[]) => any, settings?: any) => string | number;
	public callEvent: (name: string, args: any[]) => boolean;
	public detachEvent: (id: string | number) => void;
	public detachAllEvents: () => void;

	protected _context: IUiContext;
	protected _config: IPopupConfig;
	protected _node: HTMLElement | null = null;
	protected _body: HTMLElement | null = null;
	protected _visible: boolean = false;
	protected _destroyed: boolean = false;

	private _documentHandlers: Array<{ target: EventTarget, event: string, handler: any }> = [];
	private _dragHandlers: Array<{ target: EventTarget, event: string, handler: any }> = [];
	private _dragState: { startX: number, startY: number, left: number, top: number } | null = null;
	private _draggedByUser: boolean = false;
	private _dragUserSelect: string = "";

	constructor(context: IUiContext, config?: IPopupConfig) {
		this._context = context;
		this._config = config || {};
		context.eventable(this);
	}

	public show(content?: PopupContent): void {
		if (this._destroyed) {
			return;
		}
		const node = this._ensureNode();
		if (content !== undefined) {
			this.setContent(content);
		}

		if (this._visible) {
			const currentContainer = this._getContainer();
			if (!node.isConnected || node.parentNode !== currentContainer) {
				// a host layout rebuild can detach the node without hide() (e.g.
				// gantt.render()); reattach, skipping the fresh-show side effects
				currentContainer.appendChild(node);
				this._elevateAboveHost();
			}
			// repeated show (e.g. a tooltip following the cursor): only update
			// the position — re-attaching dismiss handlers would duplicate them
			// and lifecycle events must fire per visibility transition
			this.reposition();
			return;
		}

		const container = this._getContainer();
		if (node.parentNode !== container) {
			// also REPARENTS adopted nodes that are pre-attached elsewhere
			// (the lightbox is kept hidden in _lightbox_root for section
			// queries and moves inside the cover on show)
			container.appendChild(node);
		}

		// measure while invisible, then position. Show by CLEARING the inline
		// display (not forcing "block") so the element's CSS keeps control —
		// .gantt_tooltip is display:flex and lost its 4px flex gaps otherwise
		// (caught by the legacy_tooltip screenshot baseline, retest 26_ui_core/090)
		node.style.visibility = "hidden";
		node.style.display = "";
		this._visible = true;

		this._elevateAboveHost();
		this.reposition();
		node.style.visibility = "";

		this._attachDismissHandlers();
		this._attachDragHandle();
		this.callEvent("onShow", []);
	}

	public hide(): void {
		if (!this._visible) {
			return;
		}
		this._visible = false;
		this._endDrag();
		this._draggedByUser = false;
		this._detachDismissHandlers();
		if (this._node) {
			this._node.style.display = "none";
			if (this._node.parentNode) {
				this._node.parentNode.removeChild(this._node);
			}
		}
		this.callEvent("onHide", []);
	}

	public destroy(): void {
		if (this._destroyed) {
			return;
		}
		this.hide();
		this._destroyed = true;
		this._node = null;
		this._body = null;
		this.callEvent("onDestroy", []);
		this.detachAllEvents();
	}

	public isVisible(): boolean {
		return this._visible;
	}

	/** True after the user dragged the popup by its drag handle, until the next hide(). */
	public isDraggedByUser(): boolean {
		return this._draggedByUser;
	}

	public getNode(): HTMLElement | null {
		return this._node;
	}

	public setContent(content: PopupContent): void {
		const node = this._ensureNode();
		const body = this._body || node;
		if (typeof content === "function") {
			body.innerHTML = "";
			content(body);
		} else if (typeof content === "string") {
			// html strings are an explicit caller decision, same contract as gantt templates
			body.innerHTML = content;
		} else if (content) {
			body.innerHTML = "";
			body.appendChild(content);
		}
	}

	public reposition(): void {
		const node = this._node;
		if (!node || !this._visible) {
			return;
		}
		if (this._draggedByUser) {
			// the user placed the popup; keep it there until the next hide()
			return;
		}
		const position = this._config.position || { type: "center" };
		const viewport = { width: window.innerWidth, height: window.innerHeight };

		if (position.type === "none") {
			return;
		}

		if (position.type === "anchor" && position.target) {
			if (position.matchTargetWidth) {
				node.style.minWidth = position.target.getBoundingClientRect().width + "px";
			}
			const anchorRect = position.target.getBoundingClientRect();
			const size = { width: node.offsetWidth, height: node.offsetHeight };
			const result = computeAnchorPosition(
				{ left: anchorRect.left, top: anchorRect.top, width: anchorRect.width, height: anchorRect.height },
				size,
				viewport,
				position.side || "bottom",
				position.flip !== false,
				position.offset || 0,
				position.boundary ? this._resolveBoundary(position, viewport) : undefined,
				!!position.lockAxis
			);
			node.setAttribute("data-popup-side", result.side);
			this._moveTo(result.left, result.top);
		} else if (position.type === "cursor") {
			const size = { width: node.offsetWidth, height: node.offsetHeight };
			const result = computeCursorPosition(
				{ x: position.x || 0, y: position.y || 0 },
				size,
				this._resolveBoundary(position, viewport),
				position.offsetX || 0,
				position.offsetY || 0
			);
			this._moveTo(result.left, result.top);
		} else if (position.type === "point") {
			if (position.clamp === false) {
				// exact placement requested by the caller (legacy tooltip.show(x, y))
				this._moveTo(position.x || 0, position.y || 0);
				return;
			}
			const size = { width: node.offsetWidth, height: node.offsetHeight };
			const result = computePointPosition({ x: position.x || 0, y: position.y || 0 }, size, viewport);
			this._moveTo(result.left, result.top);
		} else {
			const size = { width: node.offsetWidth, height: node.offsetHeight };
			const result = computeCenterPosition(
				size,
				viewport,
				position.boundary ? this._resolveBoundary(position, viewport) : undefined
			);
			this._moveTo(result.left, result.top);
		}
	}

	protected _ensureNode(): HTMLElement {
		if (this._node) {
			return this._node;
		}
		if (this._config.node) {
			// adoption: the owner keeps className/content/aria, the popup
			// manages everything else (see IPopupConfig)
			const adopted = this._config.node;
			adopted.style.position = this._config.cssPosition || "fixed";
			this._node = adopted;
			this._body = null;
			return adopted;
		}
		const node = document.createElement("div");
		node.className = this._buildClassName();
		node.style.position = this._config.cssPosition || "fixed";
		node.style.display = "none";
		this._applyAria(node);

		if (this._config.bareContent) {
			// content goes directly into the node (legacy-compat, see IPopupConfig)
			this._body = null;
		} else {
			const body = document.createElement("div");
			body.className = "dhx_ui_popup_body";
			node.appendChild(body);
			this._body = body;
		}

		this._node = node;
		return node;
	}

	protected _buildClassName(): string {
		if (this._config.unstyled) {
			// migrated legacy overlays keep their own class contract (see IPopupConfig)
			return this._config.className || "";
		}
		const classes = ["dhx_ui_popup", "dhx_ui_zband_" + (this._config.zBand || "popup")];
		if (this._config.className) {
			classes.push(this._config.className);
		}
		return classes.join(" ");
	}

	protected _applyAria(node: HTMLElement): void {
		if (!this._context.ariaEnabled() || this._config.role === "none") {
			return;
		}
		node.setAttribute("role", this._config.role || "dialog");
		const label = this._resolveLabel();
		if (label) {
			node.setAttribute("aria-label", label);
		}
	}

	protected _resolveLabel(): string {
		const label = this._config.label;
		if (typeof label === "function") {
			return label();
		}
		return label || "";
	}

	protected _getContainer(): HTMLElement {
		let container = this._config.container;
		if (typeof container === "function") {
			// resolved lazily so construction stays DOM-free (stub-DOM environments)
			container = container();
		}
		return container ||
			this._context.getPopupContainer() ||
			document.body;
	}

	protected _moveTo(left: number, top: number): void {
		const node = this._node;
		if (!node) {
			return;
		}
		if (this._config.cssPosition === "absolute") {
			// positions are computed viewport-relative; an absolute node is
			// laid out from its offset parent's padding box — translate
			// only when that offset parent is genuinely positioned (see below)
			const parent = node.offsetParent as HTMLElement;
			if (parent && this._isPositioned(parent)) {
				const rect = parent.getBoundingClientRect();
				left = left - rect.left - parent.clientLeft + parent.scrollLeft;
				top = top - rect.top - parent.clientTop + parent.scrollTop;
			} else {
				left += window.pageXOffset || 0;
				top += window.pageYOffset || 0;
			}
		}
		// whole pixels: anchor/boundary rects are fractional, and a popup on
		// a fractional coordinate renders blurred edges (and breaks
		// pixel-exact screenshot comparisons of the migrated legacy overlays)
		node.style.left = Math.round(left) + "px";
		node.style.top = Math.round(top) + "px";
	}

	/**
	 * offsetParent falls back to <body> when nothing is positioned, but body is
	 * then NOT the real containing block - the page-origin-anchored one is.
	 */
	private _isPositioned(el: HTMLElement): boolean {
		const view = (el.ownerDocument && el.ownerDocument.defaultView) || window;
		return view.getComputedStyle(el).position !== "static";
	}

	private _resolveBoundary(position: IPopupPositionConfig, viewport: { width: number, height: number }): IBoundaryBox {
		let boundary = position.boundary;
		if (typeof boundary === "function") {
			boundary = boundary();
		}
		if (boundary && boundary.getBoundingClientRect) {
			const rect = boundary.getBoundingClientRect();
			return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
		}
		return { left: 0, top: 0, right: viewport.width, bottom: viewport.height };
	}

	/**
	 * When an anchored popup opens from inside another popup (e.g. a combo
	 * dropdown inside a modal), the z-band tokens alone would put it BELOW
	 * the host (popup band 20 < modal band 30). Elevate above the host's
	 * computed z-index so nested overlays always stack over their opener.
	 */
	private _elevateAboveHost(): void {
		const node = this._node;
		const position = this._config.position;
		const target = position && position.target;
		if (!node || !target) {
			return;
		}
		// .dhx_ui_popup_modal also matches adopted legacy modals (lightbox,
		// message box) which carry no dhx_ui_popup skin class but sit at the
		// modal z-band and still host kit popups — ModalPopup tags them.
		const host = this._context.dom.closest(target, ".dhx_ui_popup, .dhx_ui_popup_modal");
		if (!host || host === node) {
			node.style.zIndex = "";
			return;
		}
		const view = (host.ownerDocument && host.ownerDocument.defaultView) || window;
		const hostZ = parseInt(view.getComputedStyle(host).zIndex, 10);
		if (!isNaN(hostZ)) {
			node.style.zIndex = String(hostZ + 1);
		}
	}

	// --- dismissal -----------------------------------------------------

	protected _onEscape(e: KeyboardEvent): boolean {
		// subclasses (modal) coordinate with the modal stack
		return true;
	}

	private _attachDismissHandlers(): void {
		const dismiss = this._config.dismiss || {};
		const doc = this._getDocument();

		if (dismiss.outsideClick) {
			const clickHandler = (e: Event) => {
				if (!this._visible) {
					return;
				}
				const target = this._context.dom.getTargetNode(e) as HTMLElement;
				if (this._isInsidePopup(target)) {
					return;
				}
				this.callEvent("onDismiss", ["outsideClick"]);
				this.hide();
			};
			this._addDocumentHandler(doc, "mousedown", clickHandler);
			this._addDocumentHandler(doc, "touchstart", clickHandler);
		}

		if (dismiss.escape) {
			const keyHandler = (e: KeyboardEvent) => {
				if (!this._visible || e.key !== "Escape") {
					return;
				}
				if (!this._onEscape(e)) {
					return;
				}
				e.stopPropagation();
				this.callEvent("onDismiss", ["escape"]);
				this.hide();
			};
			this._addDocumentHandler(doc, "keydown", keyHandler);
		}

		const resizeHandler = () => {
			if (this._visible) {
				this.reposition();
			}
		};
		this._addDocumentHandler(window, "resize", resizeHandler);
	}

	private _detachDismissHandlers(): void {
		this._documentHandlers.forEach(function(entry) {
			entry.target.removeEventListener(entry.event, entry.handler);
		});
		this._documentHandlers = [];
	}

	private _addDocumentHandler(target: EventTarget, event: string, handler: any): void {
		target.addEventListener(event, handler);
		this._documentHandlers.push({ target, event, handler });
	}

	private _getDocument(): Document {
		// resolve through the container so listeners land in the right
		// document when gantt lives inside an iframe / shadow host page
		const container = this._getContainer();
		return (container && container.ownerDocument) || document;
	}

	// --- dragging (dragHandle config) ----------------------------------

	private _attachDragHandle(): void {
		let handle = this._config.dragHandle;
		if (typeof handle === "function") {
			handle = handle();
		}
		if (!handle) {
			return;
		}
		// registered alongside the dismiss handlers so they detach on hide
		this._addDocumentHandler(handle, "mousedown", (e: MouseEvent) => {
			this._startDrag(e);
		});
		this._addDocumentHandler(handle, "touchstart", (e: TouchEvent) => {
			if (e.touches && e.touches[0]) {
				this._startDrag(e.touches[0]);
			}
		});
	}

	private _startDrag(point: { pageX: number, pageY: number }): void {
		const node = this._node;
		if (!node) {
			return;
		}
		this._dragState = {
			startX: point.pageX,
			startY: point.pageY,
			left: node.offsetLeft,
			top: node.offsetTop
		};

		const doc = this._getDocument();
		const move = (e: any) => {
			this._dragMove(e.touches ? e.touches[0] : e, e);
		};
		const end = () => this._endDrag();
		[
			{ target: doc as EventTarget, event: "mousemove", handler: move },
			{ target: doc as EventTarget, event: "mouseup", handler: end },
			{ target: doc as EventTarget, event: "touchmove", handler: move },
			{ target: doc as EventTarget, event: "touchend", handler: end }
		].forEach((entry) => {
			entry.target.addEventListener(entry.event, entry.handler);
			this._dragHandlers.push(entry);
		});

		const body = doc.body;
		if (body) {
			this._dragUserSelect = body.style.userSelect || "";
			body.style.userSelect = "none";
		}
	}

	private _dragMove(point: { pageX: number, pageY: number }, rawEvent: Event): void {
		const state = this._dragState;
		const node = this._node;
		if (!state || !node) {
			return;
		}
		if (rawEvent.cancelable) {
			// stops text selection (mouse) and page scrolling (touch)
			rawEvent.preventDefault();
		}
		node.style.left = (state.left + point.pageX - state.startX) + "px";
		node.style.top = (state.top + point.pageY - state.startY) + "px";
		this._draggedByUser = true;
	}

	private _endDrag(): void {
		if (!this._dragState && !this._dragHandlers.length) {
			return;
		}
		this._dragState = null;
		this._dragHandlers.forEach(function(entry) {
			entry.target.removeEventListener(entry.event, entry.handler);
		});
		this._dragHandlers = [];
		const body = this._getDocument().body;
		if (body) {
			body.style.userSelect = this._dragUserSelect;
			this._dragUserSelect = "";
		}
	}

	private _isInsidePopup(target: HTMLElement | null): boolean {
		if (!target) {
			return false;
		}
		if (this._node && this._context.dom.isChildOf(target, this._node)) {
			return true;
		}
		const ignore = this._config.ignoreOutsideClick || [];
		for (let i = 0; i < ignore.length; i++) {
			if (ignore[i] && (ignore[i] === target || this._context.dom.isChildOf(target, ignore[i]))) {
				return true;
			}
		}
		return false;
	}
}
