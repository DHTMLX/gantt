/*
@license

dhtmlxGantt v.6.2.5 Standard

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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/multiselect.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/multiselect.js":
/*!************************************!*\
  !*** ./sources/ext/multiselect.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

gantt.config.multiselect = true;
gantt.config.multiselect_one_level = false;

gantt._multiselect = {
	_selected: {},
	_one_level: false,
	_active: true,
	_first_selected_when_shift: null,
	getDefaultSelected: function() {
		var selected = this.getSelected();
		return selected.length ? selected[selected.length - 1] : null;
	},
	setFirstSelected: function(id) {
		this._first_selected_when_shift = id;
	},
	getFirstSelected: function() {
		return this._first_selected_when_shift;
	},
	isActive: function() {
		this.updateState();
		return this._active;
	},
	updateState: function() {
		this._one_level = gantt.config.multiselect_one_level;
		var active = this._active;
		this._active = gantt.config.multiselect;
		if (this._active != active) {
			this.reset();
		}
	},
	reset: function () {
		this._selected = {};
	},
	setLastSelected: function (id) {
		gantt.$data.tasksStore.silent(function(){
			var store = gantt.$data.tasksStore;
			if (id)
				store.select(id+"");
			else
				store.unselect(null);
		});
	},
	getLastSelected: function () {
		var last = gantt.$data.tasksStore.getSelectedId();
		if (last && gantt.isTaskExists(last))
			return last;
		return null;
	},
	select: function (id, e) {
		if (id && gantt.callEvent("onBeforeTaskMultiSelect", [id, true, e]) && gantt.callEvent("onBeforeTaskSelected", [id])) {
			this._selected[id] = true;
			this.setLastSelected(id);
			this.afterSelect(id);
			gantt.callEvent("onTaskMultiSelect", [id, true, e]);
			gantt.callEvent("onTaskSelected", [id]);
			return true;
		}
		return false;
	},
	toggle: function (id, e) {
		if (this._selected[id]) {
			this.unselect(id, e);
		} else {
			this.select(id, e);
		}
	},
	unselect: function (id, e) {
		if (id && gantt.callEvent("onBeforeTaskMultiSelect", [id, false, e])) {
			this._selected[id] = false;
			if (this.getLastSelected() == id)
				this.setLastSelected(this.getDefaultSelected());
			this.afterSelect(id);
			gantt.callEvent("onTaskMultiSelect", [id, false, e]);
			gantt.callEvent("onTaskUnselected", [id]);
		}
	},
	isSelected: function (id) {
		return !!(gantt.isTaskExists(id) && this._selected[id]);
	},
	getSelected: function () {
		var res = [];
		for (var i in this._selected) {
			if (this._selected[i] && gantt.isTaskExists(i)) {
				res.push(i);
			} else {
				this._selected[i] = false;
			}
		}
		res.sort(function(a, b) {
			return gantt.getGlobalTaskIndex(a) > gantt.getGlobalTaskIndex(b) ? 1 : -1;
		});
		return res;
	},
	forSelected: function (callback) {
		var selected = this.getSelected();
		for (var i = 0; i < selected.length; i++) {
			callback(selected[i]);
		}
	},
	isSameLevel: function(id) {
		if (!this._one_level)
			return true;
		var last = this.getLastSelected();
		if (!last)
			return true;
		if (!(gantt.isTaskExists(last) && gantt.isTaskExists(id)))
			return true;
		return !!(gantt.calculateTaskLevel(gantt.getTask(last)) == gantt.calculateTaskLevel(gantt.getTask(id)));
	},
	afterSelect: function(id) {
		if (gantt.isTaskExists(id))
			gantt.refreshTask(id);
	},
	doSelection: function(e) {
		if (!this.isActive())
			return false;

		// deny selection when click on 'expand' or 'collapse' icons
		if (gantt._is_icon_open_click(e))
			return false;

		var target_ev = gantt.locate(e);
		if (!target_ev)
			return false;

		if (!gantt.callEvent("onBeforeMultiSelect", [e]))
			return false;

		var selected = this.getSelected();
		var defaultLast = this.getFirstSelected();
		var isLast = false;
		var last = this.getLastSelected();

		if (e.shiftKey) {
			if (!gantt.isTaskExists(this.getFirstSelected()) || this.getFirstSelected() === null) {
				this.setFirstSelected(target_ev);
			}
		} else if (e.ctrlKey || e.metaKey) {
			if (!this.isSelected(target_ev))
				this.setFirstSelected(target_ev);
		} else {
			this.setFirstSelected(target_ev);
		}
		if (e.ctrlKey || e.metaKey) {
			if (target_ev) {
				this.toggle(target_ev, e);
			}
		} else if (e.shiftKey && selected.length) {
			if (!last)
				last = target_ev;
			else if (target_ev) {
				var first_indx = gantt.getGlobalTaskIndex(this.getFirstSelected());
				var target_indx = gantt.getGlobalTaskIndex(target_ev);
				var last_indx = gantt.getGlobalTaskIndex(last);

				// clear prev selection
				var tmp = last;
				while (gantt.getGlobalTaskIndex(tmp) !== first_indx) {
					this.unselect(tmp, e);
					tmp = (first_indx > last_indx) ? gantt.getNext(tmp) : gantt.getPrev(tmp);
				}
				tmp = target_ev;
				while (gantt.getGlobalTaskIndex(tmp) !== first_indx) {
					if (this.select(tmp, e) && !isLast) {
						isLast = true;
						defaultLast = tmp;
					}
					tmp = (first_indx > target_indx) ? gantt.getNext(tmp) : gantt.getPrev(tmp);
				}
			}
		} else { // no key press when mouse click
			if (!this.isSelected(target_ev)) {
				this.select(target_ev, e);
			}
			selected = this.getSelected();
			for (var i=0; i<selected.length; i++) {
				if (selected[i] !== target_ev) {
					this.unselect(selected[i], e);
				}
			}
		}

		if (this.isSelected(target_ev)) {
			this.setLastSelected(target_ev);
		} else if (defaultLast) {
			if (target_ev == last)
				this.setLastSelected(e.shiftKey ? defaultLast : this.getDefaultSelected());
		} else {
			this.setLastSelected(null);
		}

		if (!this.getSelected().length)
			this.setLastSelected(null);

		if (!this.getLastSelected() || !this.isSelected(this.getFirstSelected()))
			this.setFirstSelected(this.getLastSelected());

		return true;
	}
};

(function(){
	var old_selectTask = gantt.selectTask;
	gantt.selectTask = function(id) {
		if (!id)
			return false;
		var multiselect = gantt._multiselect;
		var res = id;
		if (multiselect.isActive()) {
			if (multiselect.select(id, null)) {
				multiselect.setLastSelected(id);
			}
			multiselect.setFirstSelected(multiselect.getLastSelected());
		} else {
			res = old_selectTask.call(this, id);
		}
		return res;
	};

	var old_unselectTask = gantt.unselectTask;
	gantt.unselectTask = function(id) {
		var multiselect = gantt._multiselect;
		var isActive = multiselect.isActive();
		id = id || multiselect.getLastSelected();
		if(id && isActive) {
			multiselect.unselect(id, null);
			if (id == multiselect.getLastSelected())
				multiselect.setLastSelected(null);
			gantt.refreshTask(id);
			multiselect.setFirstSelected(multiselect.getLastSelected());
		}
		var res = id;
		if (!isActive)
			res = old_unselectTask.call(this, id);
		return res;
	};

	gantt.toggleTaskSelection = function(id) {
		var multiselect = gantt._multiselect;
		if (id && multiselect.isActive()) {
			multiselect.toggle(id);
			multiselect.setFirstSelected(multiselect.getLastSelected());
		}
	};
	gantt.getSelectedTasks = function() {
		var multiselect = gantt._multiselect;
		multiselect.isActive();
		return multiselect.getSelected();
	};
	gantt.eachSelectedTask = function(callback){
		return this._multiselect.forSelected(callback);
	};
	gantt.isSelectedTask = function(id){
		return this._multiselect.isSelected(id);
	};
	gantt.getLastSelectedTask = function(){
		return this._multiselect.getLastSelected();
	};
	gantt.attachEvent("onGanttReady", function(){
		gantt.$data.tasksStore.isSelected = function(id){
			return gantt._multiselect.isSelected(id);
		};
	});
})();

gantt.attachEvent("onTaskIdChange", function (id, new_id) {
	var multiselect = gantt._multiselect;
	if (!multiselect.isActive())
		return true;
	if (gantt.isSelectedTask(id)) {
		multiselect.unselect(id, null);
		multiselect.select(new_id, null);
	}
});

gantt.attachEvent("onAfterTaskDelete", function (id, item) {
	var multiselect = gantt._multiselect;
	if (!multiselect.isActive())
		return true;

	if (multiselect._selected[id]) {
		multiselect.unselect(id, null);
		multiselect._selected[id] = false;
		multiselect.setLastSelected(multiselect.getDefaultSelected());
	}

	multiselect.forSelected(function (task_id) {
		if (!gantt.isTaskExists(task_id))
			multiselect.unselect(task_id, null);
	});
});

gantt.attachEvent("onBeforeTaskMultiSelect", function(id, state, e){
	var multiselect = gantt._multiselect;
	if (state && multiselect.isActive()) {
		if (multiselect._one_level) {
			return multiselect.isSameLevel(id);
		}
	}
	return true;
});

gantt.attachEvent("onTaskClick", function(id, e) {
	if (gantt._multiselect.doSelection(e))
		gantt.callEvent("onMultiSelect", [e]);
	return true;
});

/***/ })

/******/ });
});