import type { DatastoreMethods } from "../../types/gantt_types";
import { checkZeroId } from "../../utils/helpers";

/**
 * Returns the own id of the item that `rawId` names, so that an id read from a DOM attribute or an
 * object key (always a string) gets the type that the application gave the item (GS-3658).
 * An id that names no item is returned as is.
 *
 * The own id `0` is returned as `"0"`: callers test these ids for truthiness, and Gantt already
 * refers to a task with the id `0` as `"0"` (see `replaceValidZeroId`).
 */
export function getOwnItemId(store: Pick<DatastoreMethods, "getItem">, rawId: string | number): string | number {
	const item = store.getItem(rawId);
	if (!item) {
		return rawId;
	}
	return checkZeroId(item.id) ? "0" : item.id;
}
