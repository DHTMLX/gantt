import isHeadless from "../../utils/is_headless";
import type { Id } from "../../types/gantt_types";
import type { DatastoreItem } from "../../types/gantt_types";
import type { GanttInternal } from "../../types/gantt_internal_types";
import TreeDatastoreInternal from "./treedatastore";


interface DataLayer {
	render_item(item: DatastoreItem): void;
	render_items(items: DatastoreItem[]): void;
	clear(): void;
	change_id(oldId: Id, newId: Id): void;
	get_visible_range?: (store: TreeDatastoreInternal) => {
		start?: number;
		end?: number;
		ids?: Id[];
	};
	prepare_data?: (data: DatastoreItem[], layer?: DataLayer) => void;
	update_items?: (data: DatastoreItem[]) => void;
}

interface DataRenderer {
	getLayers(): DataLayer[];
	onUpdateRequest?: (layer: DataLayer) => void;
}

const storeRenderCreator = function(name: string, gantt: GanttInternal): void{

	const store = gantt.getDatastore(name);

	const itemRepainter = {
		renderItem: function(id: Id, renderer: DataRenderer): void{

			const renders = renderer.getLayers();

			const item = store.getItem(id);
			if(item && store.isVisible(id)) {
				for (let i = 0; i < renders.length; i++)
					renders[i].render_item(item);
			}
		},
		renderItems: function(renderer: DataRenderer): void{
			const renderers = renderer.getLayers();
			for (let i = 0; i < renderers.length; i++) {
				renderers[i].clear();
			}

			let allData: DatastoreItem[] = [];

			const loadedRanges: Record<string, DatastoreItem[]> = {};
			for (let i = 0; i < renderers.length; i++) {
				const layer = renderers[i];
				let layerData: DatastoreItem[];
				if(layer.get_visible_range){

					const range = layer.get_visible_range(store as TreeDatastoreInternal);
					if(range.start !== undefined && range.end !== undefined){
						const key = range.start + " - " + range.end;
						if(loadedRanges[key]){
							layerData = loadedRanges[key];
						}else{
							layerData = store.getIndexRange(range.start, range.end);
							loadedRanges[key] = layerData;
						}
					}else if(range.ids !== undefined){
						layerData = range.ids.map(function(id){
							return store.getItem(id) as DatastoreItem;
						});
					}else{
						throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
					}
				}else{
					if(!allData.length){
						allData = store.getVisibleItems();
					}
					layerData = allData;
				}

				if (layer.prepare_data) {
					// GS-1605. Highlight timeline cells below tasks and in an empty chart
					layer.prepare_data(layerData);
				}

				renderers[i].render_items(layerData);
			}
		},
		updateItems: function(layer: DataLayer): void {
			if(layer.update_items){
				let data: DatastoreItem[] = [];
				if(layer.get_visible_range){

					const range = layer.get_visible_range(store as TreeDatastoreInternal);
					if(range.start !== undefined && range.end !== undefined){
						data = store.getIndexRange(range.start, range.end);
					}
					if(range.ids !== undefined){
						let extraDataArr = range.ids.map(function(id){
							return store.getItem(id);
						});
						// GS-2502: range.ids might not exist in other datastores
						if(extraDataArr.length > 0){
							extraDataArr = extraDataArr.filter(element => element !== undefined);
							data = data.concat(extraDataArr as DatastoreItem[]);
						}
					}
					if((range.start == undefined || range.end == undefined) && range.ids == undefined)  {
						throw new Error("Invalid range returned from 'getVisibleRange' of the layer");
					}
				}else{
					data = store.getVisibleItems();
				}

				if (layer.prepare_data) {
					// GS-1605. Highlight timeline cells below tasks and in an empty chart
					layer.prepare_data(data, layer);
				}
				layer.update_items(data);
			}
		}
	};

	store.attachEvent("onStoreUpdated", function(){
		if(isHeadless(gantt)){
			return true;
		}

		const renderer = gantt.$services.getService("layers").getDataRender(name) as DataRenderer | undefined;
		if(renderer){
			renderer.onUpdateRequest = function(layer: DataLayer): void{
				itemRepainter.updateItems(layer);
			};
		}
	});

	function skipRepaint(gantt: GanttInternal): boolean{
		const state = gantt.$services.getService("state");
		if(state.getState("batchUpdate").batch_update){
			return true;
		}else{
			return false;
		}
	}

	store.attachEvent("onStoreUpdated", function(id: Id | null, item: DatastoreItem | null, action: string | null){
		if(skipRepaint(gantt)){
			return;
		}
		if(!id || action == "move" || action == "delete"){
			store.callEvent("onBeforeRefreshAll", []);
			store.callEvent("onAfterRefreshAll", []);
		}else if(item){
			// GS-3535. `id` is the key the store applied the change to, `item` is whatever the
			// caller passed: updateItem(id, {prop: value}) is a documented form and its partial
			// object carries no id of its own, which used to repaint getItem(undefined)
			store.callEvent("onBeforeRefreshItem", [id]);
			store.callEvent("onAfterRefreshItem", [id]);
		}
	});

	store.attachEvent("onAfterRefreshAll", function(){
		if(isHeadless(gantt)){
			return true;
		}

		const renderer = gantt.$services.getService("layers").getDataRender(name) as DataRenderer | undefined;
		if(renderer && !skipRepaint(gantt)){
			itemRepainter.renderItems(renderer);
		}
	});
	store.attachEvent("onAfterRefreshItem", function(id: Id){
		if(isHeadless(gantt)){
			return true;
		}

		const renderer = gantt.$services.getService("layers").getDataRender(name) as DataRenderer | undefined;
		if(renderer){
			itemRepainter.renderItem(id, renderer);
		}
	});

	// TODO: probably can be done more in a more efficient way
	store.attachEvent("onItemOpen", function(){
		if(isHeadless(gantt) || store.isSilent()){
			return true;
		}

		gantt.render();
	});

	store.attachEvent("onItemClose", function(){
		if(isHeadless(gantt) || store.isSilent()){
			return true;
		}

		gantt.render();
	});

	function refreshId(renders: DataLayer[], oldId: Id, newId: Id): void {
		for (let i = 0; i < renders.length; i++) {
			renders[i].change_id(oldId, newId);
		}
	}

	store.attachEvent("onIdChange", function(oldId: Id, newId: Id){
		if(isHeadless(gantt)){
			return true;
		}

		// in case of linked datastores (tasks <-> links), id change should recalculate something in linked datastore before any repaint
		// use onBeforeIdChange for this hook.
		// TODO: use something more reasonable instead
		store.callEvent("onBeforeIdChange", [oldId, newId]);

		if(skipRepaint(gantt)){
			return;
		}
		if(!store.isSilent()){
			const renderer = gantt.$services.getService("layers").getDataRender(name) as DataRenderer | undefined;
			if(renderer){ // missing check for renderer GS-1814
				refreshId(renderer.getLayers(), oldId, newId);
				itemRepainter.renderItem(newId, renderer);
			}else{
				// GS-1814 repaint ui to apply new id when the datastore don't have own renderer
				gantt.render();
			}
		}
	});

};

export default {
	bindDataStore: storeRenderCreator
};