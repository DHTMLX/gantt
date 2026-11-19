export default function(gantt) {
	function isEnabled() {
		return gantt.config.auto_types && // if enabled
			(gantt.getTaskType(gantt.config.types.project) == gantt.config.types.project);// and supported
	}

	function callIfEnabled(callback) {
		return function() {
			if (!isEnabled()) {
				return true;
			}
			return callback.apply(this, arguments);
		};
	}

	function checkTaskType(id, changedTypes) {
		var task = gantt.getTask(id);
		var targetType = getTaskTypeToUpdate(task);
		if (targetType !== false && gantt.getTaskType(task) !== targetType) {
			changedTypes.$needsUpdate = true;
			changedTypes[task.id] = {task: task, type: targetType};
		}
	}

	function getUpdatedTypes(id, changedTypes) {
		changedTypes = changedTypes || {};
		
		checkTaskType(id, changedTypes);
		gantt.eachParent(function(parent) {
			checkTaskType(parent.id, changedTypes);
		}, id);

		return changedTypes;
	}

	function applyChanges(changedTypes) {
		for (var i in changedTypes) {
			if(changedTypes[i] && changedTypes[i].task){
				var task = changedTypes[i].task;
				task.type = changedTypes[i].type;
				gantt.updateTask(task.id);
			}
		}
	}

	function updateParentTypes(startId) {
		if (gantt.getState().group_mode) {
			return;
		}
		
		var changedTypes = getUpdatedTypes(startId);
		if (changedTypes.$needsUpdate) {
			gantt.batchUpdate(function() {
				applyChanges(changedTypes);
			});
		}
	}

	var delTaskParent;

	function updateTaskType(task, targetType) {
		if(!gantt.getState().group_mode){
			task.type = targetType;
			gantt.updateTask(task.id);
		}
	}

	function getTaskTypeToUpdate(task) {
		var allTypes = gantt.config.types;
		var hasChildren = gantt.hasChild(task.id);
		var taskType = gantt.getTaskType(task.type);
		if (hasChildren && (taskType === allTypes.task || taskType === allTypes.milestone)) {
			if (taskType !== allTypes.project) {
				task.$originalType = taskType;
			}
			return allTypes.project;
		}

		if (!hasChildren && taskType === allTypes.project) {
			if (task.$originalType) {
				return task.$originalType;
			}
			return allTypes.task;
		}

		return false;
	}

	var isParsingDone = true;

	gantt.attachEvent("onParse", callIfEnabled(function() {
		isParsingDone = false;
		if(gantt.getState().group_mode){
			return;
		}

		gantt.batchUpdate(function() {
			gantt.eachTask(function(task) {
				var targetType = getTaskTypeToUpdate(task);
				if (targetType !== false) {
					updateTaskType(task, targetType);
				}
			});
		});

		isParsingDone = true;
	}));

	gantt.attachEvent("onAfterTaskAdd", callIfEnabled(function(id) {
		if (isParsingDone) {
			updateParentTypes(id);
		}
	}));

	gantt.attachEvent("onAfterTaskUpdate", callIfEnabled(function(id) {
		if (isParsingDone) {
			updateParentTypes(id);
		}
	}));

	function updateAfterRemoveChild(id){
		if (id != gantt.config.root_id && gantt.isTaskExists(id)) {
			updateParentTypes(id);
		}
	}

	gantt.attachEvent("onBeforeTaskDelete", callIfEnabled(function(id, task) {
		delTaskParent = gantt.getParent(id);
		return true;
	}));

	gantt.attachEvent("onAfterTaskDelete", callIfEnabled(function(id, task) {
		updateAfterRemoveChild(delTaskParent);
	}));


	var originalRowDndParent;

	gantt.attachEvent("onRowDragStart", callIfEnabled(function(id, target, e) {
		originalRowDndParent = gantt.getParent(id);
		return true;
	}));

	gantt.attachEvent("onRowDragEnd", callIfEnabled(function(id, target) {
		updateAfterRemoveChild(originalRowDndParent);
		updateParentTypes(id);
	}));

	var originalMoveTaskParent;

	gantt.attachEvent("onBeforeTaskMove", callIfEnabled(function(sid, parent, tindex) {
		originalMoveTaskParent = gantt.getParent(sid);
		return true;
	}));

	gantt.attachEvent("onAfterTaskMove", callIfEnabled(function(id, parent, tindex) {
		if (document.querySelector(".gantt_drag_marker")) {
			// vertical dnd in progress
			return;
		}
		updateAfterRemoveChild(originalMoveTaskParent);
		updateParentTypes(id);
	}));

	// Silent moves must update both parents; the store supplies the old parent.
	gantt.$data.tasksStore.attachEvent("onAfterSilentMove", callIfEnabled(function(id, parent, tindex, oldParent) {
		updateAfterRemoveChild(oldParent);
		updateParentTypes(id);
	}));
};