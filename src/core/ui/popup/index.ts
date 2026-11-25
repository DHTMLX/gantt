import { Popup, IPopupConfig } from "./popup";
import { ModalPopup } from "./modal_popup";
import { createModalStack, IModalStack } from "./modal_stack";
import { IUiContext } from "../ui_context";

export interface IPopupApi {
	createPopup(config?: IPopupConfig): Popup;
	createModal(config?: IPopupConfig): ModalPopup;
	getModalStack(): IModalStack;
	destroyAll(): void;
}

/**
 * Per-UI-kit popup factory.
 * Tracks every popup it creates and destroys all of them with the owning kit,
 * so no document-level listeners can outlive that UI scope.
 * Registration is DOM-free; DOM is only touched when a popup is shown.
 */
export function createPopupApi(context: IUiContext): IPopupApi {
	const stack = createModalStack();
	const live: Set<Popup> = new Set();

	function track<T extends Popup>(popup: T): T {
		live.add(popup);
		popup.attachEvent("onDestroy", function() {
			live.delete(popup);
		});
		return popup;
	}

	const api: IPopupApi = {
		createPopup(config?: IPopupConfig): Popup {
			return track(new Popup(context, config));
		},
		createModal(config?: IPopupConfig): ModalPopup {
			return track(new ModalPopup(context, config || {}, stack));
		},
		getModalStack(): IModalStack {
			return stack;
		},
		destroyAll(): void {
			// copy: destroy() mutates the set through the onDestroy handler
			Array.from(live).forEach(function(popup) {
				popup.destroy();
			});
		}
	};

	return api;
}

export { Popup, ModalPopup };
export type { IPopupConfig };
