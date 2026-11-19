import * as helpers from "../../utils/helpers";

function clearTaskStoreHandler(self) {
	if (self._delayRender) {
		self._delayRender.$cancelTimeout();
	}

	if (!self.$gantt) {
		return;
	}

	var tasks = self.$gantt.$data.tasksStore;
	var ownStore = self.$config.rowStore;

	if (!ownStore){
		return;
	}

	var handlerIdProperty = "_attached_" + ownStore.$config.name;
	if (self[handlerIdProperty]) {
		tasks.detachEvent(self[handlerIdProperty]);
		self[handlerIdProperty] = null;
	}

	if (ownStore.$attachedResourceViewHandler) {
		ownStore.detachEvent(ownStore.$attachedResourceViewHandler);
		ownStore.$attachedResourceViewHandler = null;

		tasks.detachEvent(ownStore.$attachedTaskStoreHandler);
		ownStore.$attachedTaskStoreHandler = null;
	}
}

function createMixin(_super){

	var initGrid = _super.prototype.init,
		destroyGrid = _super.prototype.destructor;

	return {
		init: function() {
			initGrid.apply(this, arguments);
			this._linkToTaskStore();
		},

		destructor: function() {
			clearTaskStoreHandler(this);
			destroyGrid.apply(this, arguments);
		},

		previousDragId: null,
		relevantResources: null,

		_linkToTaskStore: function () {
			if (this.$config.rowStore && this.$gantt.$data.tasksStore) {
				var tasks = this.$gantt.$data.tasksStore;
				var ownStore = this.$config.rowStore;
				clearTaskStoreHandler(this);

				var self = this;
				var delayRender = helpers.delay(function() {
					if (self.$gantt.getState().lightbox) {
						delayRender();
					} else {
						const linkedStore = self.$config.rowStore;

						// Repaint only relevant resources for task drag
						const repaintStack = self._getRelevantResources();
						// GS-2822: extra check for resource store
						if (repaintStack && linkedStore.$config.name === self.$gantt.config.resource_store){
							if (repaintStack == "nothing_to_repaint"){
								return;
							}
							linkedStore._quick_refresh = true;
							self.relevantResources.forEach(function(id){
								const row = linkedStore.getItem(id);
								if (row && row.$role === "task") {
									// Quick refresh skips the filter that normally rebuilds fetched copies.
									// Keep their display range current without updating assignment data.
									const gantt = self.$gantt;
									const task = gantt.getTask(row.$task_id);
									row.start_date = gantt.copy(task.start_date);
									row.end_date = gantt.copy(task.end_date);
									row.duration = task.duration;
								}
								linkedStore.refresh(id);
							});
							linkedStore._quick_refresh = false;
						} else {
							// because rowstore could be changed during timeout
							linkedStore.refresh();
						}
					}
				}, 300);
				this._delayRender = delayRender;
				var handlerIdProperty = "_attached_" + ownStore.$config.name;

				if (!self[handlerIdProperty]) {
					self[handlerIdProperty] = tasks.attachEvent("onStoreUpdated", function(){
						if(!delayRender.$pending && !this._skipResourceRepaint){
							// don't repaint if we update progress
							const state = self.$gantt.getState();
							if (state.drag_mode == "progress"){
								return true;
							} else if (state.drag_mode && state.drag_id){
								// we need it here because if you started dragging a task and quickly stopped the drag_id is removed 
								// from the state before we record it, so we cannot repaint only the relevant resources
								self.previousDragId = state.drag_id;
							}
							delayRender();
						}
						return true;
					});
				}

				this.$gantt.attachEvent("onDestroy", function() {
					// detach events to don't call delayed tasks
					clearTaskStoreHandler(self);
					return true;
				});

				if (!ownStore.$attachedResourceViewHandler) {
					ownStore.$attachedResourceViewHandler = ownStore.attachEvent("onBeforeFilter", function() {
						if (self.$gantt.getState().lightbox) {
							return false;
						}

						if (delayRender.$pending) {
							delayRender.$cancelTimeout();
						}
						self._updateNestedTasks();
						return true;
					});

					ownStore.$attachedTaskStoreHandler = tasks.attachEvent("onAfterDelete", function(){
						ownStore._mark_recompute = true;
					});
				}
			}
		},

		_getRelevantResources: function (){
			// GS-2199. process_resource_assignments is disabled,
			// so we cannot get only the relevant assignment resources
			if (!this.$gantt.getTaskAssignments){
				return null;
			}
			const state = this.$gantt.getState();
			const linkedStore = this.$config.rowStore;

			let resourceIds = [];
			if (state.drag_mode && state.drag_id && linkedStore.$config.name === this.$gantt.config.resource_store){
				if (this.previousDragId == state.drag_id){ // we continue dragging the task
					if (this.relevantResources) {
						return this.relevantResources;
					} else {
						resourceIds = this._getIdsFromAssignments(this.previousDragId);
					}
				}
				else { // we started the task drag
					this.previousDragId = state.drag_id;
					resourceIds = this._getIdsFromAssignments(this.previousDragId);
				}
			} else if (this.previousDragId){ // finished task drag, but the resources are still the same
				resourceIds = this._getIdsFromAssignments(this.previousDragId);
				this.previousDragId = null;
			} else {
				return null;
			}
			if (!resourceIds.length){
				return this.relevantResources = "nothing_to_repaint";
			}
			
			resourceIds.forEach(function(resourceId){
				//GS-2598: linkedstore could be a temp assignment store
				if(linkedStore.eachParent){
					linkedStore.eachParent(function(parent){
						resourceIds.push(parent.id);
					}, resourceId);
				}
			});

			return this.relevantResources = [...new Set(resourceIds)];
		},

		_getIdsFromAssignments: function(id){
			const gantt = this.$gantt;
			const linkedStore = this.$config.rowStore;
			const resourceIds = [];
			const addAssignmentRows = function(assignment){
				resourceIds.push(assignment.resource_id);
				if (linkedStore.$config.fetchTasks) {
					// GS-3700. Fetched tasks are separate rows; refreshing their resource does not repaint them.
					const rowId = assignment.task_id + "_" + assignment.resource_id;
					if (linkedStore.exists(rowId)) {
						resourceIds.push(rowId);
					}
				}
			};

			const task = gantt.getTask(id);
			let assignments = gantt.getTaskAssignments(id);
			assignments.forEach(addAssignmentRows);

			// get child assignments when dragging project task
			if (gantt.isSummaryTask(task) && gantt.config.drag_project) {
				gantt.eachTask(function(child){
					const childAssignments = gantt.getTaskAssignments(child.id);
					childAssignments.forEach(addAssignmentRows);
				}, id);
			}

			// get assignments of other selected tasks
			if (gantt.config.drag_multiple && gantt.getSelectedTasks){
				const selectedIds = gantt.getSelectedTasks();
				selectedIds.forEach(function(selectedId){
					const selectedAssignments = gantt.getTaskAssignments(selectedId);
					selectedAssignments.forEach(addAssignmentRows);
				});
			}

			return resourceIds;
		},

		_updateNestedTasks: function(){
			var gantt = this.$gantt;
			var resourceStore = gantt.getDatastore(gantt.config.resource_store);
			if (!resourceStore.$config.fetchTasks) {
				return;
			}

			resourceStore.silent(function(){
				var toAddArray = [];
				var toAdd = {};
				var toDelete = {};

				resourceStore.eachItem(function(resource){
					if (resource.$role == "task") {
						toDelete[resource.id] = true;
						return;
					}

					var assignments = gantt.getResourceAssignments(resource.id);
					var addedTasks = {};

					// GS-1505. We need to sort assignments before updating tasks. 
					// Iterating them without that will affect the order of featched tasks in the resource store
					assignments.sort(function (a, b) {
						const resourceData = resourceStore.pull;
						const resource1 = resourceData[`${a.task_id}_${a.resource_id}`];
						const resource2 = resourceData[`${b.task_id}_${b.resource_id}`];
						if (resource1 && resource2) {
							return resource1.$local_index - resource2.$local_index;
						} else {
							return 0;
						}
					});

					assignments.forEach(function(a) {
						if(addedTasks[a.task_id] || !gantt.isTaskExists(a.task_id)){
							return;
						}
						addedTasks[a.task_id] = true;

						var task = gantt.getTask(a.task_id);
						var copy;
						//GS-2711: deep copy from task
						if(resourceStore.$config.copyOnParse){
							copy = gantt.copy(task);
						} else {
							copy = Object.create(task);
						}

						copy.id = task.id + '_' + resource.id;

						copy.$task_id = task.id;
						copy.$resource_id = resource.id;
						copy[resourceStore.$parentProperty] = resource.id;
						copy.$role = "task";
						toAddArray.push(copy);
						toAdd[copy.id] = true;
					});
				});
				for (var id in toDelete) {
					if (!toAdd[id]) {
						resourceStore.removeItem(id);
					}
				}
				if(toAddArray.length){
					resourceStore.parse(toAddArray);
				}
			});
		}
	};
}

export default createMixin;