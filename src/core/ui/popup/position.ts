/**
 * Pure positioning engine for the popup primitive.
 * No DOM access — everything works on plain rects so it is unit-testable
 * in the node-based test environment (see docs/internal/ui-core/00-PLAN.md).
 */

export interface IRect {
	left: number;
	top: number;
	width: number;
	height: number;
}

export interface ISize {
	width: number;
	height: number;
}

export type PopupSide = "top" | "bottom" | "left" | "right";

export interface IComputedPosition {
	left: number;
	top: number;
	side: PopupSide;
}

function placeAt(anchor: IRect, size: ISize, side: PopupSide, offset: number): { left: number, top: number } {
	switch (side) {
		case "top":
			return { left: anchor.left, top: anchor.top - size.height - offset };
		case "bottom":
			return { left: anchor.left, top: anchor.top + anchor.height + offset };
		case "left":
			return { left: anchor.left - size.width - offset, top: anchor.top };
		case "right":
		default:
			return { left: anchor.left + anchor.width + offset, top: anchor.top };
	}
}

function fitsBox(pos: { left: number, top: number }, size: ISize, box: IBoundaryBox): boolean {
	return pos.left >= box.left && pos.top >= box.top &&
		pos.left + size.width <= box.right &&
		pos.top + size.height <= box.bottom;
}

function fitsMainAxis(pos: { left: number, top: number }, size: ISize, box: IBoundaryBox, side: PopupSide): boolean {
	if (side === "top" || side === "bottom") {
		return pos.top >= box.top && pos.top + size.height <= box.bottom;
	}
	return pos.left >= box.left && pos.left + size.width <= box.right;
}

/**
 * Clamps a position into an arbitrary box (a popup larger than the box is
 * pinned to the box's top/left edge).
 */
export function clampToBox(pos: { left: number, top: number }, size: ISize, box: IBoundaryBox): { left: number, top: number } {
	let left = pos.left;
	let top = pos.top;
	if (left + size.width > box.right) {
		left = box.right - size.width;
	}
	if (top + size.height > box.bottom) {
		top = box.bottom - size.height;
	}
	if (left < box.left) {
		left = box.left;
	}
	if (top < box.top) {
		top = box.top;
	}
	return { left, top };
}

const oppositeSide: Record<PopupSide, PopupSide> = {
	top: "bottom",
	bottom: "top",
	left: "right",
	right: "left"
};

/**
 * Clamps a position so the popup stays inside the viewport
 * (a popup larger than the viewport is pinned to the top/left edge).
 */
export function clampToViewport(pos: { left: number, top: number }, size: ISize, viewport: ISize): { left: number, top: number } {
	let left = pos.left;
	let top = pos.top;
	if (left + size.width > viewport.width) {
		left = viewport.width - size.width;
	}
	if (top + size.height > viewport.height) {
		top = viewport.height - size.height;
	}
	if (left < 0) {
		left = 0;
	}
	if (top < 0) {
		top = 0;
	}
	return { left, top };
}

/**
 * Positions a popup of the given size next to the anchor rect.
 * Tries the preferred side first; when `flip` is enabled and the popup
 * does not fit, tries the opposite side, then the remaining sides,
 * finally falls back to the preferred side clamped into the box.
 * With `lockAxis`, cross-axis overflow is clamped instead of moving a vertical
 * dropdown to the left/right (or a horizontal submenu above/below).
 * All coordinates are viewport-relative. `boundary` constrains fitting
 * and clamping to an arbitrary box (e.g. the gantt data area — GS-871);
 * it defaults to the whole viewport.
 */
export function computeAnchorPosition(
	anchor: IRect,
	size: ISize,
	viewport: ISize,
	side: PopupSide = "bottom",
	flip: boolean = true,
	offset: number = 0,
	boundary?: IBoundaryBox,
	lockAxis: boolean = false
): IComputedPosition {
	const box: IBoundaryBox = boundary ||
		{ left: 0, top: 0, right: viewport.width, bottom: viewport.height };

	const preferred = placeAt(anchor, size, side, offset);
	if (lockAxis) {
		if (!flip || fitsMainAxis(preferred, size, box, side)) {
			const clamped = clampToBox(preferred, size, box);
			return { left: clamped.left, top: clamped.top, side };
		}

		const opposite = oppositeSide[side];
		const oppositePosition = placeAt(anchor, size, opposite, offset);
		if (fitsMainAxis(oppositePosition, size, box, opposite)) {
			const clamped = clampToBox(oppositePosition, size, box);
			return { left: clamped.left, top: clamped.top, side: opposite };
		}

		const clamped = clampToBox(preferred, size, box);
		return { left: clamped.left, top: clamped.top, side };
	}
	if (!flip || fitsBox(preferred, size, box)) {
		const clamped = clampToBox(preferred, size, box);
		return { left: clamped.left, top: clamped.top, side };
	}

	const candidates: PopupSide[] = [oppositeSide[side]];
	(["bottom", "top", "right", "left"] as PopupSide[]).forEach(function(s) {
		if (s !== side && candidates.indexOf(s) === -1) {
			candidates.push(s);
		}
	});

	for (let i = 0; i < candidates.length; i++) {
		const pos = placeAt(anchor, size, candidates[i], offset);
		if (fitsBox(pos, size, box)) {
			return { left: pos.left, top: pos.top, side: candidates[i] };
		}
	}

	const clamped = clampToBox(preferred, size, box);
	return { left: clamped.left, top: clamped.top, side };
}

/**
 * Positions a popup so it is centered inside the viewport — or inside an
 * arbitrary boundary box (the lightbox centers within gantt._lightbox_root,
 * which is the gantt container in Salesforce/CSP environments).
 * Never above/left of the box origin for popups larger than the box.
 */
export function computeCenterPosition(size: ISize, viewport: ISize, boundary?: IBoundaryBox): { left: number, top: number } {
	const box: IBoundaryBox = boundary ||
		{ left: 0, top: 0, right: viewport.width, bottom: viewport.height };
	return {
		left: box.left + Math.max(Math.round(((box.right - box.left) - size.width) / 2), 0),
		top: box.top + Math.max(Math.round(((box.bottom - box.top) - size.height) / 2), 0)
	};
}

/**
 * Positions a popup at an explicit point (e.g. cursor), keeping it inside the viewport.
 */
export function computePointPosition(point: { x: number, y: number }, size: ISize, viewport: ISize, offsetX: number = 0, offsetY: number = 0): { left: number, top: number } {
	return clampToViewport({ left: point.x + offsetX, top: point.y + offsetY }, size, viewport);
}

export interface IBoundaryBox {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

/**
 * Positions a popup relative to the cursor — the tooltip pattern
 * (migrated from ext/tooltip _calculateTooltipPosition, ui-core Step 1):
 * below-right of the cursor by the given offsets, clamped into the boundary
 * box; when clamping makes the box overlap the cursor, the popup flips to
 * the other side of the cursor on that axis (so the pointer never covers
 * the content). An overlong popup pins to the left edge (GS-2827).
 * All coordinates are viewport-relative.
 */
export function computeCursorPosition(
	cursor: { x: number, y: number },
	size: ISize,
	boundary: IBoundaryBox,
	offsetX: number = 0,
	offsetY: number = 0
): { left: number, top: number } {
	let top = cursor.y + offsetY;
	let left = cursor.x + offsetX;
	let bottom = top + size.height;
	let right = left + size.width;

	if (top < boundary.top) {
		top = boundary.top;
		bottom = top + size.height;
	} else if (bottom > boundary.bottom) {
		bottom = boundary.bottom;
		top = bottom - size.height;
	}

	if (left < boundary.left) {
		left = boundary.left;
		right = boundary.left + size.width;
	} else if (right > boundary.right) {
		right = boundary.right;
		left = right - size.width;
	}

	if (cursor.x >= left && cursor.x <= right) {
		left = cursor.x - size.width - offsetX;
		right = left + size.width;
	}
	if (cursor.y >= top && cursor.y <= bottom) {
		top = cursor.y - size.height - offsetY;
		bottom = top + size.height;
	}

	// GS-2827: content wider than the boundary must not escape the viewport
	if (left < 0) {
		left = 0;
	}

	return { left, top };
}
