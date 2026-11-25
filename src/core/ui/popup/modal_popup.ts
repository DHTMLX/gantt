import { Popup, IPopupConfig, PopupContent } from "./popup";
import { IModalStack } from "./modal_stack";
import { trapFocus, focusFirst } from "./focus_trap";
import { IUiContext } from "../ui_context";

/**
 * ModalPopup — Popup + modality: backdrop, modal-stack registration,
 * intrinsic focus trap (works without the keyboard_navigation extension),
 * aria-modal, focus save/restore.
 */
export class ModalPopup extends Popup {
	private _stack: IModalStack;
	private _backdrop: HTMLElement | null = null;
	private _releaseTrap: (() => void) | null = null;
	private _previousFocus: HTMLElement | null = null;

	constructor(context: IUiContext, config: IPopupConfig, stack: IModalStack) {
		super(context, Object.assign({ zBand: "modal" as const }, config));
		this._stack = stack;
	}

	public show(content?: PopupContent): void {
		if (this._destroyed) {
			return;
		}
		if (this.isVisible()) {
			// repeated show: update content/position only — the focus snapshot,
			// stack entry, backdrop and trap are already in place
			this._ensureBackdrop();
			super.show(content);
			return;
		}
		this._previousFocus = this._context.dom.getActiveElement() as HTMLElement;

		this._ensureBackdrop();
		super.show(content);

		this._stack.push(this);

		const node = this.getNode();
		if (node) {
			// mark the surface as a modal host so nested kit popups (a combo or
			// datepicker opened inside the box) elevate above it — adopted legacy
			// boxes (lightbox, message) skip _buildClassName, so they would not
			// otherwise carry this marker. Style-free for them: the only
			// dhx_ui_popup_modal CSS rule targets .dhx_ui_popup_body children,
			// which the legacy boxes don't have. See Popup._elevateAboveHost.
			node.classList.add("dhx_ui_popup_modal");
			if (this._context.ariaEnabled()) {
				node.setAttribute("aria-modal", "true");
			}
			if (!node.hasAttribute("tabindex")) {
				node.setAttribute("tabindex", "-1");
			}
			this._releaseTrap = trapFocus(node, this._context);
			if (this._config.autoFocus !== false) {
				focusFirst(node, this._context);
			}
		}
	}

	public hide(): void {
		if (!this.isVisible()) {
			return;
		}
		if (this._releaseTrap) {
			this._releaseTrap();
			this._releaseTrap = null;
		}
		this._stack.remove(this);
		this._removeBackdrop();
		super.hide();
		this._restoreFocus();
	}

	public destroy(): void {if (this._releaseTrap) {
			this._releaseTrap();
			this._releaseTrap = null;
		}
		this._stack.remove(this);
		this._removeBackdrop();
		super.destroy();
		this._restoreFocus();
	}

	protected _buildClassName(): string {
		return super._buildClassName() + " dhx_ui_popup_modal";
	}

	protected _getContainer(): HTMLElement {
		if (this._config.nestInBackdrop && this._backdrop) {
			// the node lives INSIDE the backdrop (lightbox DOM contract:
			// .gantt_cal_cover > .gantt_cal_light); the backdrop itself is
			// appended through super._getContainer()
			return this._backdrop;
		}
		return super._getContainer();
	}

	protected _onEscape(e: KeyboardEvent): boolean {
		// only the topmost modal reacts to ESC
		return this._stack.isTop(this);
	}

	private _ensureBackdrop(): void {
		if (!this._backdrop) {
			const backdrop = document.createElement("div");
			backdrop.className = this._config.backdropClassName || "dhx_ui_backdrop dhx_ui_zband_modal";
			this._backdrop = backdrop;
		}
		const container = super._getContainer();
		if (this._backdrop.parentNode !== container) {
			container.appendChild(this._backdrop);
		}
	}

	private _removeBackdrop(): void {
		if (this._backdrop && this._backdrop.parentNode) {
			this._backdrop.parentNode.removeChild(this._backdrop);
		}
		this._backdrop = null;
	}

	private _restoreFocus(): void {
		const previous = this._previousFocus;
		this._previousFocus = null;
		if (previous && previous.focus && document.body.contains(previous)) {
			try {
				previous.focus();
			} catch {
				// silent, element may have become unfocusable
			}
		}
	}
}
