import { IUiContext } from "../ui_context";

/**
 * Keeps Tab / Shift+Tab focus cycling inside `root`.
 * Returns a detach function. The keydown listener is attached to `root`
 * itself, so it dies with the element and never leaks to `document`.
 */
export function trapFocus(root: HTMLElement, context: IUiContext): () => void {
	function onKeyDown(e: KeyboardEvent): void {
		if (e.key !== "Tab") {
			return;
		}
		const focusable = context.dom.getFocusableNodes(root);
		if (!focusable.length) {
			e.preventDefault();
			return;
		}
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = context.dom.getActiveElement();

		if (e.shiftKey) {
			if (active === first || !root.contains(active)) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (active === last || !root.contains(active)) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	root.addEventListener("keydown", onKeyDown);
	return function detach(): void {
		root.removeEventListener("keydown", onKeyDown);
	};
}

/**
 * Focuses the first focusable node inside `root` (or `root` itself as a fallback).
 */
export function focusFirst(root: HTMLElement, context: IUiContext): void {
	const focusable = context.dom.getFocusableNodes(root);
	const target = focusable.length ? focusable[0] : root;
	if (target && target.focus) {
		try {
			target.focus();
		} catch {
			// silent, matches gantt._focus behavior
		}
	}
}
