import type { Id } from "../../types/gantt_types";
import type DatastoreInternal from "../datastore/datastore";
import type TreeDatastoreInternal from "../datastore/treedatastore";

interface SelectMixin {
	select(this: TreeDatastoreInternal, id: Id): Id | false | null;
	getSelectedId(): Id | null;
	isSelected(id: Id): boolean;
	unselect(this: TreeDatastoreInternal, id?: Id | null): void;
}

function createDataStoreSelectMixin(store: DatastoreInternal | TreeDatastoreInternal): SelectMixin{
	let selectedId: Id | null = null;

	const deleteItem = store._removeItemInner;
	
	function unselect(this: DatastoreInternal | TreeDatastoreInternal, id: Id | null): void{
		selectedId = null;
		this.callEvent("onAfterUnselect", [id]);
	}

	store._removeItemInner = function(this: DatastoreInternal | TreeDatastoreInternal, id: Id): void{
		if(selectedId == id){
			unselect.call(this, id);
		}

		if(selectedId && this.eachItem){
			this.eachItem(function(subItem){
				if(subItem !== undefined && subItem?.id == selectedId){
					unselect.call(this, subItem.id);
				}
			}, id);
		}

		return deleteItem.apply(this, arguments as any);
	};

	store.attachEvent("onIdChange", function(oldId: Id, newId: Id) {
		if (store.getSelectedId() == oldId) {
			store.silent(function () {
				store.unselect(oldId);
				store.select(newId);
			});
		}
	});

	return {
		select: function(this: DatastoreInternal | TreeDatastoreInternal, id: Id): Id | false | null{
			if (id){

				if(selectedId == id)
					return selectedId;

				if(!this._skip_refresh) {
					if (!this.callEvent("onBeforeSelect", [id])) {
						return false;
					}
				}

				this.unselect();

				selectedId = id;

				if(!this._skip_refresh) {
					this.refresh(id);
					this.callEvent("onAfterSelect", [id]);
				}
			}
			return selectedId;
		},
		getSelectedId: function(): Id | null{
			return selectedId;
		},
		isSelected: function(id: Id): boolean{
			return id == selectedId;
		},
		unselect: function(this: DatastoreInternal | TreeDatastoreInternal, id?: Id | null): void{
			id = id || selectedId;
			if(!id)
				return;
			selectedId = null;
			if(!this._skip_refresh){
				this.refresh(id);
				unselect.call(this, id);
			}
		}
	};
}

export default createDataStoreSelectMixin;
