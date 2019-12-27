/*
@license

dhtmlxGantt v.6.3.4 Standard

This version of dhtmlxGantt is distributed under GPL 2.0 license and can be legally used in GPL projects.

To use dhtmlxGantt in non-GPL projects (and get Pro version of the product), please obtain Commercial/Enterprise or Ultimate license on our site https://dhtmlx.com/docs/products/dhtmlxGantt/#licensing or contact us at sales@dhtmlx.com

(c) XB Software Ltd.

*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ext/dhtmlxgantt_undo", [], factory);
	else if(typeof exports === 'object')
		exports["ext/dhtmlxgantt_undo"] = factory();
	else
		root["ext/dhtmlxgantt_undo"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/undo/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/undo/index.ts":
/*!***********************************!*\
  !*** ./sources/ext/undo/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var monitor_1 = __webpack_require__(/*! ./monitor */ "./sources/ext/undo/monitor.ts");
var undo_1 = __webpack_require__(/*! ./undo */ "./sources/ext/undo/undo.ts");
var _undo = new undo_1.Undo();
var monitor = new monitor_1.Monitor(_undo);
gantt.config.undo = true;
gantt.config.redo = true;
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
    remove: "remove",
    add: "add",
    move: "move" // move task in grid
};
if (!gantt.ext) {
    gantt.ext = {};
}
gantt.ext.undo = {
    undo: function () { return _undo.undo(); },
    redo: function () { return _undo.redo(); },
    getUndoStack: function () { return _undo.getUndoStack(); },
    getRedoStack: function () { return _undo.getRedoStack(); },
    clearUndoStack: function () { return _undo.clearUndoStack(); },
    clearRedoStack: function () { return _undo.clearRedoStack(); },
    saveState: function (id, type) { return monitor.store(id, type, true); }
};
gantt.undo = gantt.ext.undo.undo;
gantt.redo = gantt.ext.undo.redo;
gantt.getUndoStack = gantt.ext.undo.getUndoStack;
gantt.getRedoStack = gantt.ext.undo.getRedoStack;
gantt.clearUndoStack = gantt.ext.undo.clearUndoStack;
gantt.clearRedoStack = gantt.ext.undo.clearRedoStack;
function updTask(task, oldId, newId) {
    if (!task) {
        return;
    }
    if (task.id === oldId) {
        task.id = newId;
    }
    if (task.parent === oldId) {
        task.parent = newId;
    }
}
function changeTaskCommandId(command, oldId, newId) {
    updTask(command.value, oldId, newId);
    updTask(command.oldValue, oldId, newId);
}
function updLink(link, oldTaskId, newTaskId) {
    if (!link) {
        return;
    }
    if (link.source === oldTaskId) {
        link.source = newTaskId;
    }
    if (link.target === oldTaskId) {
        link.target = newTaskId;
    }
}
function changeLinkCommandId(command, oldId, newId) {
    updLink(command.value, oldId, newId);
    updLink(command.oldValue, oldId, newId);
}
function updateTasksIds(log, oldId, newId) {
    var undo = _undo;
    for (var i = 0; i < log.length; i++) {
        var entry = log[i];
        for (var j = 0; j < entry.commands.length; j++) {
            if (entry.commands[j].entity === undo.command.entity.task) {
                changeTaskCommandId(entry.commands[j], oldId, newId);
            }
            else if (entry.commands[j].entity === undo.command.entity.link) {
                changeLinkCommandId(entry.commands[j], oldId, newId);
            }
        }
    }
}
function updateLinksIds(log, oldId, newId) {
    var undo = _undo;
    for (var i = 0; i < log.length; i++) {
        var entry = log[i];
        for (var j = 0; j < entry.commands.length; j++) {
            var command = entry.commands[j];
            if (command.entity === undo.command.entity.link) {
                if (command.value && command.value.id === oldId) {
                    command.value.id = newId;
                }
                if (command.oldValue && command.oldValue.id === oldId) {
                    command.oldValue.id = newId;
                }
            }
        }
    }
}
gantt.attachEvent("onTaskIdChange", function (oldId, newId) {
    var undo = _undo;
    updateTasksIds(undo.getUndoStack(), oldId, newId);
    updateTasksIds(undo.getRedoStack(), oldId, newId);
});
gantt.attachEvent("onLinkIdChange", function (oldId, newId) {
    var undo = _undo;
    updateLinksIds(undo.getUndoStack(), oldId, newId);
    updateLinksIds(undo.getRedoStack(), oldId, newId);
});
gantt.attachEvent("onGanttReady", function () {
    _undo.updateConfigs();
});


/***/ }),

/***/ "./sources/ext/undo/monitor.ts":
/*!*************************************!*\
  !*** ./sources/ext/undo/monitor.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var noTrack = {
    onBeforeUndo: "onAfterUndo",
    onBeforeRedo: "onAfterRedo"
};
var batchActions = [
    "onTaskDragStart",
    "onAfterTaskUpdate",
    "onAfterTaskDelete",
    "onBeforeBatchUpdate"
];
var Monitor = /** @class */ (function () {
    function Monitor(undo) {
        this._batchAction = null;
        this._batchMode = false;
        this._ignore = false;
        this._ignoreMoveEvents = false;
        this._initialTasks = {};
        this._initialLinks = {};
        this._nestedTasks = {};
        this._nestedLinks = {};
        this._undo = undo;
        this._attachEvents();
    }
    Monitor.prototype.store = function (id, type, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        if (type === gantt.config.undo_types.task) {
            return this._storeTask(id, overwrite);
        }
        if (type === gantt.config.undo_types.link) {
            return this._storeLink(id, overwrite);
        }
        return false;
    };
    Monitor.prototype.isMoveEventsIgnored = function () {
        return this._ignoreMoveEvents;
    };
    Monitor.prototype.toggleIgnoreMoveEvents = function (newValue) {
        this._ignoreMoveEvents = newValue || false;
    };
    Monitor.prototype.startIgnore = function () {
        this._ignore = true;
    };
    Monitor.prototype.stopIgnore = function () {
        this._ignore = false;
    };
    Monitor.prototype.startBatchAction = function () {
        var _this = this;
        // try catching updates made from event handlers using timeout
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(function () {
            _this.stopBatchAction();
        }, 10);
        if (this._ignore || this._batchMode) {
            return;
        }
        this._batchMode = true;
        this._batchAction = this._undo.action.create();
    };
    Monitor.prototype.stopBatchAction = function () {
        if (this._ignore) {
            return;
        }
        var undo = this._undo;
        if (this._batchAction) {
            undo.logAction(this._batchAction);
        }
        this._batchMode = false;
        this._batchAction = null;
    };
    Monitor.prototype.onTaskAdded = function (task) {
        if (!this._ignore) {
            this._storeTaskCommand(task, this._undo.command.type.add);
        }
    };
    Monitor.prototype.onTaskUpdated = function (task) {
        if (!this._ignore) {
            this._storeTaskCommand(task, this._undo.command.type.update);
        }
    };
    Monitor.prototype.onTaskMoved = function (task) {
        if (!this._ignore) {
            this._storeEntityCommand(task, this.getInitialTask(task.id), this._undo.command.type.move, this._undo.command.entity.task);
        }
    };
    Monitor.prototype.onTaskDeleted = function (task) {
        if (!this._ignore) {
            this._storeTaskCommand(task, this._undo.command.type.remove);
            if (this._nestedTasks[task.id]) {
                var children = this._nestedTasks[task.id];
                for (var i = 0; i < children.length; i++) {
                    this._storeTaskCommand(children[i], this._undo.command.type.remove);
                }
            }
            if (this._nestedLinks[task.id]) {
                var childrenLinks = this._nestedLinks[task.id];
                for (var i = 0; i < childrenLinks.length; i++) {
                    this._storeLinkCommand(childrenLinks[i], this._undo.command.type.remove);
                }
            }
        }
    };
    Monitor.prototype.onLinkAdded = function (link) {
        if (!this._ignore) {
            this._storeLinkCommand(link, this._undo.command.type.add);
        }
    };
    Monitor.prototype.onLinkUpdated = function (link) {
        if (!this._ignore) {
            this._storeLinkCommand(link, this._undo.command.type.update);
        }
    };
    Monitor.prototype.onLinkDeleted = function (link) {
        if (!this._ignore) {
            this._storeLinkCommand(link, this._undo.command.type.remove);
        }
    };
    Monitor.prototype.setNestedTasks = function (id, taskIds) {
        var task = null;
        var tasks = [];
        var linkIds = this._getLinks(gantt.getTask(id));
        for (var i = 0; i < taskIds.length; i++) {
            task = this.setInitialTask(taskIds[i]);
            linkIds = linkIds.concat(this._getLinks(task));
            tasks.push(task);
        }
        var uniqueLinks = {};
        for (var i = 0; i < linkIds.length; i++) {
            uniqueLinks[linkIds[i]] = true;
        }
        var links = [];
        for (var i in uniqueLinks) {
            links.push(this.setInitialLink(i));
        }
        this._nestedTasks[id] = tasks;
        this._nestedLinks[id] = links;
    };
    Monitor.prototype.setInitialTask = function (id, overwrite) {
        if (overwrite || (!this._initialTasks[id] || !this._batchMode)) {
            var task = gantt.copy(gantt.getTask(id));
            task.$index = gantt.getTaskIndex(id);
            this.setInitialTaskObject(id, task);
        }
        return this._initialTasks[id];
    };
    Monitor.prototype.getInitialTask = function (id) {
        return this._initialTasks[id];
    };
    Monitor.prototype.clearInitialTasks = function () {
        this._initialTasks = {};
    };
    Monitor.prototype.setInitialTaskObject = function (id, object) {
        this._initialTasks[id] = object;
    };
    Monitor.prototype.setInitialLink = function (id, overwrite) {
        if (!this._initialLinks[id] || !this._batchMode) {
            this._initialLinks[id] = gantt.copy(gantt.getLink(id));
        }
        return this._initialLinks[id];
    };
    Monitor.prototype.getInitialLink = function (id) {
        return this._initialLinks[id];
    };
    Monitor.prototype.clearInitialLinks = function () {
        this._initialLinks = {};
    };
    Monitor.prototype._attachEvents = function () {
        var _this = this;
        var deleteCacheCooldown = null;
        var saveInitialAll = function () {
            if (!deleteCacheCooldown) {
                deleteCacheCooldown = setTimeout(function () {
                    deleteCacheCooldown = null;
                });
                _this.clearInitialTasks();
                gantt.eachTask(function (task) {
                    _this.setInitialTask(task.id);
                });
                _this.clearInitialLinks();
                gantt.getLinks().forEach(function (link) {
                    _this.setInitialLink(link.id);
                });
            }
        };
        var getMoveObjectByTaskId = function (id) {
            return gantt.copy(gantt.getTask(id));
        };
        for (var i in noTrack) {
            gantt.attachEvent(i, function () {
                _this.startIgnore();
                return true;
            });
            gantt.attachEvent(noTrack[i], function () {
                _this.stopIgnore();
                return true;
            });
        }
        for (var i = 0; i < batchActions.length; i++) {
            gantt.attachEvent(batchActions[i], function () {
                _this.startBatchAction();
                return true;
            });
        }
        gantt.attachEvent("onParse", function () {
            _this._undo.clearUndoStack();
            _this._undo.clearRedoStack();
            saveInitialAll();
        });
        gantt.attachEvent("onAfterTaskAdd", function (id, task) {
            _this.setInitialTask(id, true);
            _this.onTaskAdded(task);
        });
        gantt.attachEvent("onAfterTaskUpdate", function (id, task) {
            _this.onTaskUpdated(task);
        });
        gantt.attachEvent("onAfterTaskDelete", function (id, task) {
            _this.onTaskDeleted(task);
        });
        gantt.attachEvent("onAfterLinkAdd", function (id, link) {
            _this.setInitialLink(id, true);
            _this.onLinkAdded(link);
        });
        gantt.attachEvent("onAfterLinkUpdate", function (id, link) {
            _this.onLinkUpdated(link);
        });
        gantt.attachEvent("onAfterLinkDelete", function (id, link) {
            _this.onLinkDeleted(link);
        });
        gantt.attachEvent("onRowDragEnd", function (id, target) {
            _this.onTaskMoved(getMoveObjectByTaskId(id));
            _this.toggleIgnoreMoveEvents();
            return true;
        });
        gantt.attachEvent("onBeforeTaskDelete", function (id) {
            _this.store(id, gantt.config.undo_types.task);
            var nested = [];
            // remember task indexes in case their being deleted in a loop, so they could be restored in the correct order
            saveInitialAll();
            gantt.eachTask(function (task) {
                nested.push(task.id);
            }, id);
            _this.setNestedTasks(id, nested);
            return true;
        });
        var datastore = gantt.getDatastore("task");
        datastore.attachEvent("onBeforeItemMove", function (id, parent, tindex) {
            if (!_this.isMoveEventsIgnored()) {
                saveInitialAll();
            }
            return true;
        });
        datastore.attachEvent("onAfterItemMove", function (id, parent, tindex) {
            if (!_this.isMoveEventsIgnored()) {
                _this.onTaskMoved(getMoveObjectByTaskId(id));
            }
            return true;
        });
        gantt.attachEvent("onRowDragStart", function (id, target, e) {
            _this.toggleIgnoreMoveEvents(true);
            saveInitialAll();
            return true;
        });
        gantt.attachEvent("onBeforeTaskDrag", function (taskId) { return _this.store(taskId, gantt.config.undo_types.task); });
        gantt.attachEvent("onLightbox", function (taskId) { return _this.store(taskId, gantt.config.undo_types.task); });
        gantt.attachEvent("onBeforeTaskAutoSchedule", function (task) {
            _this.store(task.id, gantt.config.undo_types.task);
            return true;
        });
        if (gantt.ext.inlineEditors) {
            gantt.ext.inlineEditors.attachEvent("onEditStart", function (state) {
                _this.store(state.id, gantt.config.undo_types.task);
            });
        }
    };
    Monitor.prototype._storeCommand = function (command) {
        var undo = this._undo;
        undo.updateConfigs();
        if (!undo.undoEnabled) {
            return;
        }
        if (this._batchMode) {
            this._batchAction.commands.push(command);
        }
        else {
            var action = undo.action.create([command]);
            undo.logAction(action);
        }
    };
    Monitor.prototype._storeEntityCommand = function (obj, old, actionType, entityType) {
        var undo = this._undo;
        var command = undo.command.create(obj, old, actionType, entityType);
        this._storeCommand(command);
    };
    Monitor.prototype._storeTaskCommand = function (obj, type) {
        this._storeEntityCommand(obj, this.getInitialTask(obj.id), type, this._undo.command.entity.task);
    };
    Monitor.prototype._storeLinkCommand = function (obj, type) {
        this._storeEntityCommand(obj, this.getInitialLink(obj.id), type, this._undo.command.entity.link);
    };
    Monitor.prototype._getLinks = function (task) {
        return task.$source.concat(task.$target);
    };
    Monitor.prototype._storeTask = function (taskId, overwrite) {
        var _this = this;
        if (overwrite === void 0) { overwrite = false; }
        this.setInitialTask(taskId, overwrite);
        gantt.eachTask(function (child) {
            _this.setInitialTask(child.id);
        }, taskId);
        return true;
    };
    Monitor.prototype._storeLink = function (linkId, overwrite) {
        if (overwrite === void 0) { overwrite = false; }
        this.setInitialLink(linkId, overwrite);
        return true;
    };
    return Monitor;
}());
exports.Monitor = Monitor;


/***/ }),

/***/ "./sources/ext/undo/undo.ts":
/*!**********************************!*\
  !*** ./sources/ext/undo/undo.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MAX_UNDO_STEPS = 10;
var Undo = /** @class */ (function () {
    function Undo() {
        var _this = this;
        this.maxSteps = MAX_UNDO_STEPS;
        this.undoEnabled = true;
        this.redoEnabled = true;
        this.action = {
            create: function (commands) {
                return { commands: (commands ? commands.slice() : []) };
            },
            invert: function (action) {
                var _a;
                var revert = gantt.copy(action);
                var commands = _this.command;
                for (var i = 0; i < action.commands.length; i++) {
                    var command = revert.commands[i] = commands.invert(revert.commands[i]);
                    if (command.type === commands.type.update || command.type === commands.type.move) {
                        _a = [command.oldValue, command.value], command.value = _a[0], command.oldValue = _a[1];
                    }
                }
                return revert;
            }
        };
        this.command = {
            // entities that require different processing for undoing-redoing changes (gantt.config.undo_types)
            entity: null,
            // types of traced actions (gantt.config.undo_actions)
            type: null,
            create: function (value, oldValue, type, entity) {
                return {
                    entity: entity,
                    type: type,
                    value: gantt.copy(value),
                    oldValue: gantt.copy(oldValue || value)
                };
            },
            invert: function (command) {
                var revert = gantt.copy(command);
                revert.type = this.inverseCommands(command.type);
                return revert;
            },
            inverseCommands: function (command) {
                switch (command) {
                    case this.type.update:
                        return this.type.update;
                    case this.type.remove:
                        return this.type.add;
                    case this.type.add:
                        return this.type.remove;
                    case this.type.move:
                        return this.type.move;
                    default:
                        gantt.assert(false, "Invalid command " + command);
                        return null;
                }
            }
        };
        this._undoStack = [];
        this._redoStack = [];
    }
    Undo.prototype.getUndoStack = function () {
        return this._undoStack;
    };
    Undo.prototype.getRedoStack = function () {
        return this._redoStack;
    };
    Undo.prototype.clearUndoStack = function () {
        this._undoStack = [];
    };
    Undo.prototype.clearRedoStack = function () {
        this._redoStack = [];
    };
    Undo.prototype.updateConfigs = function () {
        this.maxSteps = gantt.config.undo_steps || MAX_UNDO_STEPS;
        this.command.entity = gantt.config.undo_types;
        this.command.type = gantt.config.undo_actions;
        this.undoEnabled = !!gantt.config.undo;
        this.redoEnabled = (!!gantt.config.undo) && (!!gantt.config.redo);
    };
    Undo.prototype.undo = function () {
        this.updateConfigs();
        if (!this.undoEnabled) {
            return;
        }
        var action = this._pop(this._undoStack);
        if (action) {
            this._reorderCommands(action);
        }
        if (gantt.callEvent("onBeforeUndo", [action]) !== false) {
            if (action) {
                this._applyAction(this.action.invert(action));
                this._push(this._redoStack, gantt.copy(action));
                gantt.callEvent("onAfterUndo", [action]);
                return;
            }
        }
        gantt.callEvent("onAfterUndo", [null]);
    };
    Undo.prototype.redo = function () {
        this.updateConfigs();
        if (!this.redoEnabled) {
            return;
        }
        var action = this._pop(this._redoStack);
        if (action) {
            this._reorderCommands(action);
        }
        if (gantt.callEvent("onBeforeRedo", [action]) !== false) {
            if (action) {
                this._applyAction(action);
                this._push(this._undoStack, gantt.copy(action));
                gantt.callEvent("onAfterRedo", [action]);
                return;
            }
        }
        gantt.callEvent("onAfterRedo", [null]);
    };
    // storeUndo:
    Undo.prototype.logAction = function (action) {
        this._push(this._undoStack, action);
        this._redoStack = [];
    };
    Undo.prototype._push = function (stack, action) {
        if (!action.commands.length) {
            return;
        }
        var event = stack === this._undoStack ? "onBeforeUndoStack" : "onBeforeRedoStack";
        if (gantt.callEvent(event, [action]) === false) {
            return;
        }
        // commands can be removed from event handler
        if (!action.commands.length) {
            return;
        }
        stack.push(action);
        while (stack.length > this.maxSteps) {
            stack.shift();
        }
        return action;
    };
    Undo.prototype._pop = function (stack) {
        return stack.pop();
    };
    Undo.prototype._reorderCommands = function (action) {
        // firstly process tasks and only then links
        // in order to ensure links are added not earlier than their tasks
        // firstly to 'move' actions and only then updates
        var weights = { any: 0, link: 1, task: 2 };
        var actionWeights = { move: 1, any: 0 };
        action.commands.sort(function (a, b) {
            if (a.entity === "task" && b.entity === "task") {
                if (a.type !== b.type) {
                    return (actionWeights[b.type] || 0) - (actionWeights[a.type] || 0);
                }
                else if (a.type === "move" && a.oldValue && b.oldValue && b.oldValue.parent === a.oldValue.parent) {
                    return a.oldValue.$index - b.oldValue.$index;
                }
                else {
                    return 0;
                }
            }
            else {
                var weightA = weights[a.entity] || weights.any;
                var weightB = weights[b.entity] || weights.any;
                return weightB - weightA;
            }
        });
    };
    Undo.prototype._applyAction = function (action) {
        var command = null;
        var entities = this.command.entity;
        var actions = this.command.type;
        var methods = {};
        methods[entities.task] = {
            add: "addTask",
            get: "getTask",
            update: "updateTask",
            remove: "deleteTask",
            move: "moveTask",
            isExists: "isTaskExists"
        };
        methods[entities.link] = {
            add: "addLink",
            get: "getLink",
            update: "updateLink",
            remove: "deleteLink",
            isExists: "isLinkExists"
        };
        gantt.batchUpdate(function () {
            for (var i = 0; i < action.commands.length; i++) {
                command = action.commands[i];
                var method = methods[command.entity][command.type];
                var getMethod = methods[command.entity].get;
                var check = methods[command.entity].isExists;
                if (command.type === actions.add) {
                    gantt[method](command.oldValue, command.oldValue.parent, command.oldValue.$index);
                }
                else if (command.type === actions.remove) {
                    if (gantt[check](command.value.id)) {
                        gantt[method](command.value.id);
                    }
                }
                else if (command.type === actions.update) {
                    var item = gantt[getMethod](command.value.id);
                    for (var prop in command.value) {
                        if (!prop.startsWith("$") && !prop.startsWith("_")) {
                            item[prop] = command.value[prop];
                        }
                    }
                    gantt[method](command.value.id);
                }
                else if (command.type === actions.move) {
                    gantt[method](command.value.id, command.value.$index, command.value.parent);
                }
            }
        });
    };
    return Undo;
}());
exports.Undo = Undo;


/***/ })

/******/ });
});