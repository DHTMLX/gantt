import type { GanttWithKeyboardNavigation } from "./types";
import * as domHelpers from "../../core/ui/utils/dom_helpers";

/*
 * Modal bookkeeping for keyboard navigation — ui-core migration Step 5
 * (docs/internal/ui-core/03-migration-status.md).
 *
 * Since Steps 3-4 every modal (message boxes, lightbox, kit modals) carries
 * the popup primitive's INTRINSIC focus trap, so the per-box Tab trapping
 * that used to live here (and its trapFocus implementation in
 * common/trap_modal_focus.ts) is deleted. What remains is dispatcher glue:
 * - the modal stack feeding $keyboardNavigation.isModal() — the dispatcher
 *   suspends gantt keyboard handling while a modal is open;
 * - afterPopup: return keyboard control to the gantt once the last modal
 *   closes (the legacy final-focus contract for the lightbox);
 * - saveFocus/restoreFocus around message popups: the restore fires AFTER
 *   afterPopup's gantt.focus(), keeping the legacy final-focus contract for
 *   message boxes (focus ends on the element focused before the box opened,
 *   even when that element lives outside the gantt).
 */
export default function(gantt: GanttWithKeyboardNavigation): void {

	(function () {
		const modalsStack: HTMLElement[] = [];

		function isModal(): boolean {
			return !!modalsStack.length;
		}

		function afterPopup(box?: HTMLElement | null): void {
			void box;
			setTimeout(function () {
				if (isModal() || gantt.$destroyed) {
					return;
				}
				
				const active = gantt.utils.dom.getActiveElement();
				const restoredOutside = !!active && active.localName !== "body" &&
					!domHelpers.isChildOf(active, gantt.$container);
				if (!restoredOutside) {
					gantt.focus();
				}
			}, 1);
		}

		function startModal(box: HTMLElement): void {
			// Tab cycling is handled by the modal's intrinsic focus trap
			modalsStack.push(box);
		}

		function endModal(): void {
			const box = modalsStack.pop();
			afterPopup(box);
		}

		function traceLightbox(): void {
			startModal(gantt.getLightbox());
		}

		// GS-3503: restore focus to the element that opened the lightbox.
		let pendingLightboxTrigger: HTMLElement | null = null;
		gantt.attachEvent("onBeforeLightbox", function () {
			pendingLightboxTrigger = gantt.utils.dom.getActiveElement();
			return true;
		});
		gantt.attachEvent("onLightbox", function () {
			focusStack.push(pendingLightboxTrigger);
			pendingLightboxTrigger = null;
			traceLightbox();
		});
		gantt.attachEvent("onAfterLightbox", function () {
			endModal();
			restoreFocus();
		});
		gantt.attachEvent("onLightboxChange", function () {
			endModal();
			traceLightbox();
		});


		gantt.attachEvent("onAfterQuickInfo", function () {
			afterPopup();
		});

		gantt.attachEvent("onMessagePopup", function (box: HTMLElement) {
			saveFocus();
			startModal(box);
		});
		gantt.attachEvent("onAfterMessagePopup", function () {
			endModal();
			restoreFocus();
		});

		// LIFO stack (not a single slot) so nested modals restore correctly:
		// e.g. a message box opened on top of the lightbox saves/restores its own
		// trigger without clobbering the lightbox's.
		const focusStack: (HTMLElement | null)[] = [];

		function saveFocus(): void {
			focusStack.push(gantt.utils.dom.getActiveElement());
		}

		function restoreFocus(): void {
			const focusElement = focusStack.pop();
			setTimeout(function () {
				if (focusElement && focusElement.focus && focusElement.isConnected) {
					focusElement.focus();
				}
			}, 1);
		}

		gantt.$keyboardNavigation.isModal = isModal;
		// kept on the object for compatibility (typed member, was assigned by
		// the deleted trap_modal_focus module)
		gantt.$keyboardNavigation.getFocusableNodes = domHelpers.getFocusableNodes;


	})();

};
