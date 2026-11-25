import type { Id } from "../../types/gantt_types";

/**
 * Canonical order (GS-3626): the real tree — the parent of each task plus the
 * order of each parent's children. Only a structural command changes it; sort,
 * filter, grouping, collapsing and rendering must not.
 *
 * `_branches` already is that order — only `sort()` and grouping reorder a
 * branch. So a branch no view has touched stores nothing here and `getOrder()`
 * hands back the live array; a view that is about to destroy an order snapshots
 * it first, and the structural mutation points maintain the snapshot afterwards.
 *
 * Snapshots live in this object rather than on the branch arrays (the
 * `$positionById` precedent) because grouping throws every branch array away.
 *
 * The per-snapshot position index follows the `$positionById` policy verbatim:
 * append and in-place id replacement keep it exact, removal and mid-insert drop
 * it instead of paying O(branch) to repair it. `undefined` means never built,
 * so any reader may build it; `null` means dropped by a mutation, so only
 * read-heavy callers rebuild it.
 */

interface Snapshot {
	order: Id[];
	positions?: Map<string, number> | null;
}

// ids may be stored as numbers and looked up as strings, or the other way round
function scanPosition(order: Id[], id: Id): number{
	let index = order.indexOf(id);
	if(index === -1){
		index = order.indexOf(id + "" as unknown as Id);
	}
	if(index === -1){
		index = order.indexOf(+id as unknown as Id);
	}
	return index;
}

function buildPositions(snapshot: Snapshot): Map<string, number>{
	const positions = new Map<string, number>();
	for(let i = 0; i < snapshot.order.length; i++){
		if(snapshot.order[i] !== undefined){
			positions.set(String(snapshot.order[i]), i);
		}
	}
	snapshot.positions = positions;
	return positions;
}

export default class CanonicalOrder {
	/**
	 * Bumped by every change of the real tree, never by a sort, filter or
	 * collapse. Consumers key a cached full-tree walk on it.
	 */
	revision = 0;

	private _snapshots = new Map<string, Snapshot>();

	/** true while no branch has been reordered, so the live tree is canonical */
	get pristine(): boolean{
		return this._snapshots.size === 0;
	}

	touch(): void{
		this.revision++;
	}

	/**
	 * Records the order of a branch a view is about to reorder. An existing
	 * snapshot is kept: a later view reorder must not redefine canonical order.
	 */
	snapshotBranch(parent: Id, ids: ArrayLike<Id>): void{
		const key = String(parent);
		if(this._snapshots.has(key)) return;

		const order: Id[] = [];
		for(let i = 0; i < ids.length; i++){
			// holes exist only inside the bulk reparent window (GS-477)
			if(ids[i] !== undefined){
				order.push(ids[i]);
			}
		}
		this._snapshots.set(key, { order });
	}

	hasSnapshot(parent: Id): boolean{
		return this._snapshots.has(String(parent));
	}

	getOrder(parent: Id, live: ArrayLike<Id>): ArrayLike<Id>{
		const snapshot = this._snapshots.get(String(parent));
		return snapshot ? snapshot.order : live;
	}

	/** read-side lookup: builds or rebuilds the position index */
	getPosition(parent: Id, id: Id, live: ArrayLike<Id>): number{
		const snapshot = this._snapshots.get(String(parent));
		if(!snapshot){
			return scanPosition(live as Id[], id);
		}
		const positions = snapshot.positions || buildPositions(snapshot);
		const position = positions.get(String(id));
		return position === undefined ? -1 : position;
	}

	// mutation-side lookup: never rebuilds an index a previous mutation dropped
	private _findPosition(snapshot: Snapshot, id: Id): number{
		const positions = snapshot.positions === undefined ? buildPositions(snapshot) : snapshot.positions;
		if(!positions){
			return scanPosition(snapshot.order, id);
		}
		const position = positions.get(String(id));
		return position === undefined ? -1 : position;
	}

	append(parent: Id, id: Id): void{
		this.touch();
		const snapshot = this._snapshots.get(String(parent));
		if(!snapshot) return;
		if(this._findPosition(snapshot, id) > -1) return;

		snapshot.order.push(id);
		if(snapshot.positions){
			snapshot.positions.set(String(id), snapshot.order.length - 1);
		}
	}

	insertBefore(parent: Id, id: Id, anchor: Id | undefined | null): void{
		this.touch();
		const snapshot = this._snapshots.get(String(parent));
		if(!snapshot) return;
		if(this._findPosition(snapshot, id) > -1) return;

		const at = anchor === undefined || anchor === null ? -1 : this._findPosition(snapshot, anchor);
		if(at === -1){
			snapshot.order.push(id);
			if(snapshot.positions){
				snapshot.positions.set(String(id), snapshot.order.length - 1);
			}
			return;
		}

		snapshot.order.splice(at, 0, id);
		snapshot.positions = null;
	}

	remove(parent: Id, id: Id): void{
		this.touch();
		const snapshot = this._snapshots.get(String(parent));
		if(!snapshot) return;

		const at = this._findPosition(snapshot, id);
		if(at === -1) return;

		snapshot.order.splice(at, 1);
		snapshot.positions = null;
	}

	replaceId(parent: Id, oldId: Id, newId: Id): void{
		this.touch();
		const snapshot = this._snapshots.get(String(parent));
		if(snapshot){
			const at = this._findPosition(snapshot, oldId);
			if(at > -1){
				snapshot.order[at] = newId;
				if(snapshot.positions){
					snapshot.positions.delete(String(oldId));
					snapshot.positions.set(String(newId), at);
				}
			}
		}

		// the renamed row's own branch is keyed by its id
		const ownBranch = this._snapshots.get(String(oldId));
		if(ownBranch){
			this._snapshots.delete(String(oldId));
			this._snapshots.set(String(newId), ownBranch);
		}
	}

	dropBranch(parent: Id): void{
		if(this._snapshots.delete(String(parent))){
			this.touch();
		}
	}

	clear(): void{
		this._snapshots.clear();
		this.touch();
	}
}
