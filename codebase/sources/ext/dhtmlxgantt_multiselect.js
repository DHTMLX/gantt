/*!
 * @license
 * 
 * dhtmlxGantt v.5.0.5 Stardard
 * This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.
 * 
 * (c) Dinamenta, UAB.
 * 
 */
/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ({

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),

/***/ 20:
/***/ (function(module, exports) {

gantt.config.multiselect = true;
gantt.config.multiselect_one_level = false;

gantt._multiselect = {
	selected: {},
	one_level: true,
	active: true,
	_first_selected_when_shift: null,
	isActive: function(){
		this.update_state();
		return this.active;
	},
	update_state: function(){
		this.one_level = gantt.config.multiselect_one_level;
		var active = this.active;
		this.active = gantt.config.multiselect;
		if(this.active != active){
			this.reset();
		}
	},
	reset: function () {
		this.selected = {};
	},
	set_last_selected: function (id) {
		this.last_selected = id;
	},
	getLastSelected: function () {
		var last = this.last_selected;
		if(last && gantt.isTaskExists(last))
			return last;
		return null;
	},
	select: function (id, e) {
		if(gantt.callEvent("onBeforeTaskMultiSelect", [id, true, e])){
			this.selected[id] = true;
			this.set_last_selected(id);
			gantt.callEvent("onTaskMultiSelect", [id, true, e]);
		}
	},
	toggle: function (id, e) {
		if(this.selected[id]){
			this.unselect(id, e);
		}else{
			this.select(id, e);
		}
	},
	unselect: function (id, e) {
		if(gantt.callEvent("onBeforeTaskMultiSelect", [id, false, e])){
			this.selected[id] = false;
			if(this.last_selected == id)
			 	this.last_selected = null;
			gantt.callEvent("onTaskMultiSelect", [id, false, e]);
		}
	},
	isSelected: function (id) {
		return !!(gantt.isTaskExists(id) && this.selected[id]);
	},
	getSelected: function () {
		var res = [];
		for (var i in this.selected) {
			if (this.selected[i] && gantt.isTaskExists(i)) {
				res.push(i);
			}else{
				this.selected[i] = false;
			}
		}

		res.sort(function(a, b){
			return gantt.calculateTaskLevel(gantt.getTask(a)) > gantt.calculateTaskLevel(gantt.getTask(b)) ? 1 : -1;
		});
		
		return res;
	},
	forSelected: function (callback) {
		var selected = this.getSelected();
		for (var i = 0; i < selected.length; i++) {
			callback(selected[i]);
		}
	},
	is_same_level: function(id){
		if(!this.one_level)
			return true;
		var last = this.getLastSelected();
		if(!last)
			return true;

		if(!(gantt.isTaskExists(last) && gantt.isTaskExists(id)))
			return true;

		return !!(gantt.calculateTaskLevel(gantt.getTask(last)) == gantt.calculateTaskLevel(gantt.getTask(id)));
	},
	_after_select: function(target){
		gantt.refreshTask(target);
	},
	_do_selection: function(e) {
		/* add onclick handler to gantt container, hook up multiselection */
		if(!this.isActive())
			return true;
		if(!gantt.callEvent("onBeforeMultiSelect", [e]))
			return true;

		var target_ev = gantt.locate(e);
		if (!target_ev)
			return true;

		var last = this.getLastSelected();
		var selected = this.getSelected();

		if (e.shiftKey) {
			if (!gantt.isTaskExists(this._first_selected_when_shift) || this._first_selected_when_shift === null) {
				this._first_selected_when_shift = target_ev;
			}
		} else if (e.ctrlKey || e.metaKey) {
			if (!this.isSelected(target_ev)) // if the task was selected - it becames unselected now, so _first_selected shouldn't point to it
				this._first_selected_when_shift = target_ev;
		} else {
			this._first_selected_when_shift = target_ev;
		}
		
		if (e.ctrlKey || e.metaKey) {
			if (target_ev && (target_ev !== this._first_selected_when_shift || !this.isSelected(this._first_selected_when_shift))) { // cannot trigger _first_selected task
				this.toggle(target_ev, e);
				this._after_select(target_ev);
			}
		} else if (e.shiftKey && selected.length) {			
			if (!last)
			 	last = target_ev;			
			if (target_ev) {
				var first_indx = gantt.getGlobalTaskIndex(this._first_selected_when_shift);
				var target_indx = gantt.getGlobalTaskIndex(target_ev);
				var last_indx = gantt.getGlobalTaskIndex(last);			
				
				// clear prev selection
				var tmp = last;
				while (gantt.getGlobalTaskIndex(tmp) != first_indx) {
					this.unselect(tmp);
					this._after_select(tmp);
					tmp = (first_indx > last_indx) ? gantt.getNext(tmp) : gantt.getPrev(tmp);
				}
				tmp = target_ev;
				while (gantt.getGlobalTaskIndex(tmp) != first_indx) {
					this.select(tmp); 
					this._after_select(tmp);
					tmp = (first_indx > target_indx) ? gantt.getNext(tmp) : gantt.getPrev(tmp);
				}
			}
		} else { // no key press when mouse click
			if (!this.isSelected(target_ev)) {
				this.select(target_ev);
				this._after_select(target_ev);
			}
			for (var i=0; i<selected.length; i++) {
				if (selected[i] !== target_ev) {
					this.unselect(selected[i]);
					this._after_select(selected[i]);
				}	
			}
		}
		if(!this.isSelected(target_ev)){
			return false;
		}
		return true;
	}
};


(function(){
	var old_selectTask = gantt.selectTask;
	gantt.selectTask = function(id){
		var res = old_selectTask.call(this, id);
		if(this.config.multiselect)
			this._multiselect.select(id);

		return res;
	};
	var old_unselectTask = gantt.unselectTask;
	gantt.unselectTask = function(id){
		if(id !== undefined && this.config.multiselect)
			this._multiselect.unselect(id);
		var res = old_unselectTask.call(this, id);
		return res;
	};

	gantt.toggleTaskSelection = function(id){
		if(this.config.multiselect)
			this._multiselect.toggle(id);
	};
	gantt.getSelectedTasks = function(){
		return this._multiselect.getSelected();
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

})();

gantt.attachEvent("onTaskIdChange", function (id, new_id) {
	var multiselect = gantt._multiselect;
	if(!multiselect.isActive())
		return true;

	if (gantt.isSelectedTask(id)) {
		multiselect.unselect(id, null);
		multiselect.select(new_id, null);
		gantt.refreshTask(new_id);
	}
});

gantt.attachEvent("onAfterTaskDelete", function (id, item) {
	var multiselect = gantt._multiselect;
	if(!multiselect.isActive())
		return true;

	if (multiselect.selected[id])
		multiselect.unselect(id, null);

	multiselect.forSelected(function (task_id) {
		if (!gantt.isTaskExists(task_id))
			multiselect.unselect(task_id, null);
	});
});

gantt.attachEvent("onBeforeTaskMultiSelect", function(id, select, e){
	var multiselect = gantt._multiselect;
	if(select && multiselect.isActive()){
		return multiselect.is_same_level(id);
	}
	return true;
});

gantt.attachEvent("onTaskClick", function(id, e){
	var res = gantt._multiselect._do_selection(e);
	gantt.callEvent("onMultiSelect", [e]);
	return res;
});

gantt.attachEvent("onEmptyClick", function (e){
	gantt._multiselect._do_selection(e);
	gantt.callEvent("onMultiSelect", [e]);
	return true;
});

/***/ })

/******/ });