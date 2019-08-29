/*
@license

dhtmlxGantt v.6.2.3 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/sources/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/undo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/undo.js":
/*!*****************************!*\
  !*** ./sources/ext/undo.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

gantt.config.undo_steps = 10;
gantt.config.undo = true;
gantt.config.redo = true;

gantt.undo = function(){
	this._undo.undo();
};

gantt.getUndoStack = function(){
	return this._undo._undoStack;
};

gantt.getRedoStack = function(){
	return this._undo._redoStack;
};

gantt.clearUndoStack = function(){
	this._undo._undoStack = [];
};

gantt.clearRedoStack = function(){
	this._undo._redoStack = [];
};

gantt.redo = function(){
	this._undo.redo();
};

/**
 * entities that require different processing for undoing-redoing changes
 * @type {{link: string, task: string}}
 */
gantt.config.undo_types = {
	link: "link",
	task: "task"
};

/**
 * types of traced actions
 * @type {{update: string, remove: string, add: string}}
 */
gantt.config.undo_actions = {
	update: "update",
	remove: "remove", // remove item from datastore
	add: "add",
	move: "move" // move task in grid
};

gantt._undo = {
	_undoStack:[],
	_redoStack:[],
	maxSteps:10,
	undo_enabled: true,
	redo_enabled: true,
	_push: function(stack, action){
		if(!action.commands.length)
			return;

		var event = stack === this._undoStack ? "onBeforeUndoStack" : "onBeforeRedoStack";
		if(gantt.callEvent(event, [action]) === false){
			return;
		}
		// commands can be removed from event handler
		if(!action.commands.length)
			return;

		stack.push(action);
		while(stack.length > this.maxSteps){
			stack.shift();
		}
		return action;
	},
	_pop:function(stack){
		return stack.pop();
	},

	_reorderCommands: function(action){
		// firstly process tasks and only then links
		// in order to ensure links are added not earlier than their tasks
		// firstly to 'move' actions and only then updates
		var weights = {any: 0, link:1, task:2};
		var actionWeights = {move: 1, any:0};
		action.commands.sort(function(a, b){
			if(a.entity == "task" && b.entity == "task"){
				if(a.type != b.type){
					return (actionWeights[b.type] || 0) - (actionWeights[a.type] || 0);
				}else if(a.type == "move" && a.oldValue && b.oldValue && b.oldValue.parent == a.oldValue.parent) {
					return a.$index - b.$index;
				}else{
					return 0;
				}

			}else{
				var weightA = weights[a.entity] || weights.any;
				var weightB = weights[b.entity] || weights.any;
				return weightB - weightA;
			}

		});
	},
	undo:function(){
		this.updateConfigs();
		if(!this.undo_enabled)
			return;

		var action = this._pop(this._undoStack);
		if(action)
			this._reorderCommands(action);
		if(gantt.callEvent("onBeforeUndo", [action]) !== false){
			if(action){

				this._applyAction(this.action.invert(action));
				this._push(this._redoStack, gantt.copy(action));
				gantt.callEvent("onAfterUndo", [action]);
				return;
			}
		}
		gantt.callEvent("onAfterUndo", [null]);
	},

	redo:function(){
		this.updateConfigs();
		if(!this.redo_enabled)
			return;

		var action = this._pop(this._redoStack);
		if(action)
			this._reorderCommands(action);

		if(gantt.callEvent("onBeforeRedo", [action]) !== false){
			if(action){
				this._applyAction(action);
				this._push(this._undoStack, gantt.copy(action));
				gantt.callEvent("onAfterRedo", [action]);
				return;
			}
		}
		gantt.callEvent("onAfterRedo", [null]);
	},

	_applyAction:function(action){
		var command = null,
			entities = this.command.entity,
			actions = this.command.type;

		var methods = {};
		methods[entities.task] = {
			add: "addTask",
			update: "updateTask",
			remove: "deleteTask",
			move: "moveTask",
			isExists: "isTaskExists"
		};
		methods[entities.link] = {
			add: "addLink",
			update: "updateLink",
			remove: "deleteLink",
			isExists: "isLinkExists"
		};

		gantt.batchUpdate(function() {
			for (var i = 0; i < action.commands.length; i++) {
				command = action.commands[i];
				var method = methods[command.entity][command.type],
					check = methods[command.entity]["isExists"];

				if (command.type == actions.add) {
					gantt[method](command.oldValue, command.oldValue.parent, command.oldValue.$index);
				} else if (command.type == actions.remove) {
					if (gantt[check](command.value.id))
						gantt[method](command.value.id);
				} else if (command.type == actions.update) {
					gantt[method](command.value.id, command.value);
				} else if (command.type == actions.move) {
					gantt[method](command.value.id, command.value.$index, command.value.parent);
				}
			}
		});
	},

	//storeUndo:
	logAction: function(action){
		this._push(this._undoStack, action);
		this._redoStack = [];
	},

	action: {
		create: function(commands){
			return {commands: commands ? commands.slice() : []};
		},
		invert: function(action){
			var revert = gantt.copy(action);
			var commands = gantt._undo.command;

			for(var i = 0; i < action.commands.length; i++){
				var command = revert.commands[i] = commands.invert(revert.commands[i]);
				if(command.type == commands.type.update || command.type == commands.type.move){
					var value = command.value;
					command.value = command.oldValue;
					command.oldValue = value;
				}
			}
			return revert;
		}
	},

	command:{
		create: function(value, oldValue, type, entity){
			return {
				entity:entity,
				type:type,
				value:gantt.copy(value),
				oldValue:gantt.copy(oldValue || value)
			};
		},
		invert: function(command){
			var revert = gantt.copy(command);
			revert.type = this.inverseCommands(command.type);
			return revert;
		},
		// entities that require different processing for undoing-redoing changes
		entity:null,

		//types of traced actions
		type:null,
		inverseCommands:function(command){
			switch (command){
				case this.type.update:
					return this.type.update;
				case this.type.remove:
					return this.type.add;
				case this.type.add:
					return this.type.remove;
				case this.type.load:
					return this.type.clear;
				case this.type.clear:
					return this.type.load;
				case this.type.move:
					return this.type.move;
				default:
					gantt.assert(false, "Invalid command "+ command);
					return null;
			}
		}
	},

	monitor: {
		_batchAction: null,
		_batchMode: false,
		_ignore: false,
		_ignoreMoveEvents: false,
		isMoveEventsIgnored: function() {
			return this._ignoreMoveEvents;
		},
		toggleIgnoreMoveEvents: function(newValue) {
			this._ignoreMoveEvents = newValue || false;
		},
		startIgnore: function(){
			this._ignore = true;
		},
		stopIgnore: function(){
			this._ignore = false;
		},
		startBatchAction : function(){
			// try catching updates made from event handlers using timeout
			if(this.timeout){
				clearTimeout(this.timeout);
			}
			this.timeout = setTimeout(function(){
				gantt._undo.monitor.stopBatchAction();
			}, 10);


			if(this._ignore || this._batchMode)
				return;

			this._batchMode = true;
			this._batchAction = gantt._undo.action.create();
		},
		stopBatchAction: function(){
			if(this._ignore)
				return;
			var undo = gantt._undo;
			if(this._batchAction){
				undo.logAction(this._batchAction);
			}
			this._batchMode = false;
			this._batchAction = null;
		},

		_storeCommand: function(command){
			var undo = gantt._undo;
			undo.updateConfigs();

			if(!undo.undo_enabled)
				return;

			if(this._batchMode){
				this._batchAction.commands.push(command);
			}else{
				var action = undo.action.create([command]);
				undo.logAction(action);
			}
		},
		_storeEntityCommand: function(obj, old, actionType, entityType){
			var undo = gantt._undo;
			var command = undo.command.create(obj, old, actionType, entityType);
			this._storeCommand(command);
		},
		_storeTaskCommand: function(obj, type){
			this._storeEntityCommand(obj, this.getInitialTask(obj.id), type, gantt._undo.command.entity.task);
		},
		_storeLinkCommand: function(obj, type){
			this._storeEntityCommand(obj, this.getInitialLink(obj.id), type, gantt._undo.command.entity.link);
		},
		onTaskAdded:function(task){
			if(!this._ignore)
				this._storeTaskCommand(task, gantt._undo.command.type.add);
		},
		onTaskUpdated:function(task){
			if(!this._ignore)
				this._storeTaskCommand(task, gantt._undo.command.type.update);
		},
		onTaskMoved: function(task){
			if (!this._ignore) {
				this._storeEntityCommand(
					task,
					this.getInitialTask(task.id),
					gantt._undo.command.type.move,
					gantt._undo.command.entity.task
				);
			}
		},
		onTaskDeleted: function(task){
			if(!this._ignore){
				this._storeTaskCommand(task, gantt._undo.command.type.remove);
				if(this._nestedTasks[task.id]){
					var children = this._nestedTasks[task.id];
					for(var i = 0; i < children.length; i++){
						this._storeTaskCommand(children[i], gantt._undo.command.type.remove);
					}
				}
				if(this._nestedLinks[task.id]){
					var childrenLinks = this._nestedLinks[task.id];
					for(var i = 0; i < childrenLinks.length; i++){
						this._storeLinkCommand(childrenLinks[i], gantt._undo.command.type.remove);
					}
				}
			}
		},

		onLinkAdded: function(link){
			if(!this._ignore)
				this._storeLinkCommand(link, gantt._undo.command.type.add);
		},
		onLinkUpdated: function(link){
			if(!this._ignore)
				this._storeLinkCommand(link, gantt._undo.command.type.update);
		},
		onLinkDeleted: function(link){
			if(!this._ignore)
				this._storeLinkCommand(link, gantt._undo.command.type.remove);
		},
		_initialTasks:{},
		_nestedTasks:{},
		_nestedLinks:{},
		_getLinks: function(task){
			return task.$source.concat(task.$target);
		},
		setNestedTasks: function(id, taskIds){
			var task = null,
				tasks = [],
				linkIds = this._getLinks(gantt.getTask(id));

			for(var i = 0; i < taskIds.length; i++){
				task = this.setInitialTask(taskIds[i]);

				linkIds = linkIds.concat(this._getLinks(task));


				tasks.push(task);
			}

			var uniqueLinks = {};
			for(var i = 0; i < linkIds.length; i++){
				uniqueLinks[linkIds[i]] = true;
			}
			var links = [];
			for(var i in uniqueLinks){
				links.push(this.setInitialLink(i));
			}
			this._nestedTasks[id] = tasks;
			this._nestedLinks[id] = links;
		},
		setInitialTask: function(id, overwrite){
			if (overwrite || (!this._initialTasks[id] || !this._batchMode)) {
				var task = gantt.copy(gantt.getTask(id));
				task.$index = gantt.getTaskIndex(id);
				this.setInitialTaskObject(id, task);
			}
			return this._initialTasks[id];
		},
		getInitialTask: function(id){
			return this._initialTasks[id];
		},
		clearInitialTasks: function(){
			this._initialTasks = {};
		},
		setInitialTaskObject: function(id, object) {
			this._initialTasks[id] = object;
		},

		_initialLinks:{},
		setInitialLink: function(id){
			if(!this._initialLinks[id] || !this._batchMode)
				this._initialLinks[id] = gantt.copy(gantt.getLink(id));

			return this._initialLinks[id];
		},
		getInitialLink: function(id){
			return this._initialLinks[id];
		}
	}


};
gantt._undo.updateConfigs = function(){
	gantt._undo.maxSteps = gantt.config.undo_steps;
	gantt._undo.command.entity = gantt.config.undo_types;
	gantt._undo.command.type = gantt.config.undo_actions;
	gantt._undo.undo_enabled = !!gantt.config.undo;
	gantt._undo.redo_enabled = (!!gantt.config.undo) && (!!gantt.config.redo);
};


(function(){

	var monitor = gantt._undo.monitor;

	var noTrack = {
		"onBeforeUndo":"onAfterUndo",
		"onBeforeRedo": "onAfterRedo"
	};
	for(var i in noTrack){
		gantt.attachEvent(i, function(){
			monitor.startIgnore();
			return true;
		});
		gantt.attachEvent(noTrack[i], function(){
			monitor.stopIgnore();
			return true;
		});
	}

	var batchActions = [
		"onTaskDragStart",
		"onAfterTaskUpdate",
		"onAfterTaskDelete",
		"onBeforeBatchUpdate"
	];

	for(var i  = 0; i < batchActions.length; i++){
		gantt.attachEvent(batchActions[i], function(){
			monitor.startBatchAction();
			return true;
		});
	}
	function store(id){
		monitor.setInitialTask(id);
		gantt.eachTask(function(child){
			monitor.setInitialTask(child.id);
		}, id);
		return true;
	}

	gantt.attachEvent("onBeforeTaskDrag", store);
	gantt.attachEvent("onLightbox", store);
	gantt.attachEvent("onBeforeTaskAutoSchedule", function(task){ store(task.id);  return true;});

	var deleteCacheCooldown = null;

	function saveInitialAll(){
		if(!deleteCacheCooldown){
			deleteCacheCooldown = setTimeout(function(){
				deleteCacheCooldown = null;
			});

			monitor.clearInitialTasks();
			gantt.eachTask(function(task){
				monitor.setInitialTask(task.id);
			});
		}
	}

	gantt.attachEvent("onBeforeTaskDelete", function(id){
		store(id);
		var nested = [];

		// remember task indexes in case their being deleted in a loop, so they could be restored in the correct order
		saveInitialAll();

		gantt.eachTask(function(task){
			nested.push(task.id);
		}, id);
		monitor.setNestedTasks(id, nested);
		return true;
	});
	if(gantt.ext.inlineEditors){
		gantt.ext.inlineEditors.attachEvent("onEditStart", function(state){
			store(state.id);
		});
	}

	gantt.attachEvent("onAfterTaskAdd", function (id, task) {
		monitor.setInitialTask(id, true);
		monitor.onTaskAdded(task);
	});
	gantt.attachEvent("onAfterTaskUpdate", function(id, task){
		monitor.onTaskUpdated(task);
	});
	gantt.attachEvent("onAfterTaskDelete", function(id, task){
		monitor.onTaskDeleted(task);
	});

	gantt.attachEvent("onAfterLinkAdd", function(id, task){
		monitor.onLinkAdded(task);
	});
	gantt.attachEvent("onAfterLinkUpdate", function(id, task){
		monitor.onLinkUpdated(task);
	});
	gantt.attachEvent("onAfterLinkDelete", function(id, task){
		monitor.onLinkDeleted(task);
	});

	var datastore = gantt.getDatastore("task");

	datastore.attachEvent("onBeforeItemMove", function(id, parent, tindex){
		if (!monitor.isMoveEventsIgnored()) {

			saveInitialAll();
		}
		return true;
	});


	datastore.attachEvent("onAfterItemMove", function(id, parent, tindex){
		if (!monitor.isMoveEventsIgnored()) {
			monitor.onTaskMoved(getMoveObjectByTaskId(id));
		}
		return true;
	});

	gantt.attachEvent("onRowDragStart", function(id, target, e) {
		monitor.toggleIgnoreMoveEvents(true);
		saveInitialAll();
		return true;
	});

	gantt.attachEvent("onRowDragEnd", function(id, target) {
		monitor.onTaskMoved(getMoveObjectByTaskId(id));
		monitor.toggleIgnoreMoveEvents();
		return true;
	});

	function getMoveObjectByTaskId(id) {
		return gantt.copy(gantt.getTask(id));
	}

	function updTask(task, oldId, newId){
		if(!task) return;

		if(task.id == oldId){
			task.id = newId;
		}

		if(task.parent == oldId){
			task.parent = newId;
		}
	}

	function changeTaskCommandId(command, oldId, newId){
		updTask(command.value, oldId, newId);
		updTask(command.oldValue, oldId, newId);
	}

	function updLink(link, oldTaskId, newTaskId){
		if(!link) return;
		if(link.source == oldTaskId){
			link.source = newTaskId;
		}
		if(link.target == oldTaskId){
			link.target = newTaskId;
		}
	}

	function changeLinkCommandId(command, oldId, newId){
		updLink(command.value, oldId, newId);
		updLink(command.oldValue, oldId, newId);
	}

	function updateTasksIds(log, oldId, newId) {
		var undo = gantt._undo;

		for (var i = 0; i < log.length; i++) {
			var entry = log[i];
			for (var j = 0; j < entry.commands.length; j++) {
				if (entry.commands[j].entity == undo.command.entity.task) {
					changeTaskCommandId(entry.commands[j], oldId, newId);
				} else if (entry.commands[j].entity == undo.command.entity.link) {
					changeLinkCommandId(entry.commands[j], oldId, newId);
				}
			}
		}
	}

	function updateLinksIds(log, oldId, newId){
		var undo = gantt._undo;

		for (var i = 0; i < log.length; i++) {
			var entry = log[i];
			for (var j = 0; j < entry.commands.length; j++) {
				var command = entry.commands[j];
				if (command.entity == undo.command.entity.link) {
					if(command.value && command.value.id == oldId){
						command.value.id = newId;
					}
					if(command.oldValue && command.oldValue.id == oldId){
						command.oldValue.id = newId;
					}
				}
			}
		}
	}

	gantt.attachEvent("onTaskIdChange", function(oldId, newId){
		var undo = gantt._undo;
		updateTasksIds(undo._undoStack,oldId, newId);
		updateTasksIds(undo._redoStack,oldId, newId);
	});
	gantt.attachEvent("onLinkIdChange", function(oldId, newId){
		var undo = gantt._undo;
		updateLinksIds(undo._undoStack,oldId, newId);
		updateLinksIds(undo._redoStack,oldId, newId);
	});
	gantt.attachEvent("onGanttReady", function(){
		gantt._undo.updateConfigs();
	});
})();


/***/ })

/******/ });
});