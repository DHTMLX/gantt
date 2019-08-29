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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/smart_rendering.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/smart_rendering.js":
/*!****************************************!*\
  !*** ./sources/ext/smart_rendering.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

gantt.config.smart_rendering = true;

gantt._smart_render = {
	getViewPort: function(){

		var timeline = gantt.$ui.getView("timeline");
		var grid = gantt.$ui.getView("grid");
		var view = gantt.$layout;
		if (timeline && timeline.isVisible()) {
			view = timeline;
		} else if (grid && grid.isVisible()) {
			view = grid;
		}

		var viewSize = view.getSize();
		var scrollPos = gantt.getScrollState();

		return {
			y: scrollPos.y,
			y_end: scrollPos.y + viewSize.y,
			x: scrollPos.x,
			x_end: scrollPos.x + viewSize.x
		};
	},
	getScrollSizes: function(){
		var scroll = gantt.getScrollState();
		scroll.x = scroll.x || 0;
		scroll.y = scroll.y || gantt.getVisibleTaskCount()*gantt.config.row_height;
		return scroll;
	},
	isInViewPort: function(item, viewPort){
		return !!(item.y < viewPort.y_end && item.y_end > viewPort.y);
	},

	isTaskDisplayed: function(id, task){
		if(gantt.$keyboardNavigation && gantt.$keyboardNavigation.dispatcher.isTaskFocused(id)){
			return true;
		}

		return this.isInViewPort(this.getTaskPosition(id), this.getViewPort());
	},
	isLinkDisplayed: function(id, link){
		return this.isInViewPort(this.getLinkPosition(id, link), this.getViewPort());
	},
	getTaskPosition: function(id){
		var y = gantt.getTaskTop(id);
		return {
			y: y,
			y_end: y + gantt.config.row_height
		};
	},
	getLinkPosition: function(id, link){
		var from_pos = gantt.getTaskTop(link.source),
			to_pos = gantt.getTaskTop(link.target);

		return {
			y: Math.min(from_pos, to_pos),
			y_end: Math.max(from_pos, to_pos) + gantt.config.row_height
		};
	},
	getRange: function(buffer){
		buffer = buffer || 0;

		var port = this.getViewPort();

		var firstTask = Math.floor(Math.max(0, port.y) / gantt.config.row_height) - buffer;
		var lastTask = Math.ceil(Math.max(0, port.y_end) / gantt.config.row_height) + buffer;

		var visibleTasks = gantt.$data.tasksStore.getIndexRange(firstTask, lastTask);
		var visibleIds = [];
		for(var i = 0; i < visibleTasks.length; i++){
			visibleIds.push(visibleTasks[i].id);
		}

		return visibleIds;
	},
	_redrawItems: function(renderers, visibleItems){
		var shouldBeVisible = {};
		for(var t = 0; t < visibleItems.length; t++){
			shouldBeVisible[visibleItems[t].id] = true;
		}
		var alreadyVisible = {};

		for(var r = 0; r < renderers.length; r++){
			var render = renderers[r];

			for(var i in render.rendered){
				if(!shouldBeVisible[i]){
					render.hide(i);
				}else{
					var node = render.rendered[i];
					if(node && node.parentNode) {
						alreadyVisible[i] = true;
					}
				}
			}

			for(var t = 0; t < visibleItems.length; t++){
				if(!alreadyVisible[visibleItems[t].id])
					render.restore(visibleItems[t]);
			}
		}
	},

	_getVisibleTasks: function(){
		var ids = this.getRange();
		var rows = [];
		for(var i=0; i < ids.length; i++){
			var item = gantt.getTask(ids[i]);
			item.$index = i;
			//this._update_parents(item.id, true);
			gantt.resetProjectDates(item);
			rows.push(item);
		}
		return rows;
	},
	_getVisibleLinks: function(){
		var visible_links = [];
		var links = gantt.$data.linksStore.getIndexRange();

		for(var i = 0; i < links.length; i++){
			if(this.isLinkDisplayed(links[i].id, links[i])){
				visible_links.push(links[i]);
			}
		}
		return visible_links;
	},

	_recalculateLinkedProjects: function(visibleLinks){
		// projects have dynamic duration, make sure that durations are recalculated before links display,
		// so links are shown on correct dates
		var recalculateTasks = {};
		for(var i = 0; i < visibleLinks.length; i++){
			recalculateTasks[visibleLinks[i].source] = true;
			recalculateTasks[visibleLinks[i].target] = true;
		}

		for(var i in recalculateTasks){
			if(gantt.isTaskExists(i))
				gantt.resetProjectDates(gantt.getTask(i));
		}
	},
	updateRender: function(){
		gantt.callEvent("onBeforeSmartRender", []);
		var visibleTasks = this._getVisibleTasks();
		var visibleLinks = this._getVisibleLinks();

		// TODO: performance test
		this._recalculateLinkedProjects(visibleLinks);

		var layers = gantt.$services.getService("layers");

		var taskRenderer = layers.getDataRender("task");
		var linkRenderer = layers.getDataRender("link");

		this._redrawTasks(taskRenderer.getLayers(), visibleTasks);
		this._redrawItems(linkRenderer.getLayers(), visibleLinks);
		gantt.callEvent("onSmartRender", []);
	},

	// hook to override from key nav
	_redrawTasks: function(layers, visibleTasks){
		this._redrawItems(layers, visibleTasks);
	},

	cached:{},

	_takeFromCache: function(id, payload, cacheName){
		if(!this.cached[cacheName])
			this.cached[cacheName] = null;
		var cached = this.cached[cacheName];

		if(id !== undefined){
			if(!cached){
				cached = this.cached[cacheName] = {};
			}

			if(cached[id] === undefined){
				cached[id] = payload(id);
			}

			return cached[id];
		}else{
			if(!cached){
				cached = payload();
			}
			return cached;
		}

	},
	initCache:function(){
		var caches = [
			"getLinkPosition",
			"getTaskPosition",
			"isTaskDisplayed",
			"isLinkDisplayed",
			"getViewPort",
			"getScrollSizes"
		];

		for(var i = 0; i < caches.length; i++){
			var method = caches[i];
			var payload = gantt.bind(this[method], this);

			this[method] = (function(calculate, cache){
				return function(id){
					return this._takeFromCache(id, calculate, cache);
				};
			})(payload, method);
		}

		this.invalidateCache();
		this.initCache = function(){};
	},
	invalidateCache: function(){
		var smartRender = this;


		function clearViewPortCache(){
			smartRender.cached.getViewPort = null;
			smartRender.cached.getScrollSizes = null;
			smartRender.cached.isTaskDisplayed = null;
			smartRender.cached.isLinkDisplayed = null;
		}
		function clearDataCache(){
			smartRender.cached.isTaskDisplayed = null;
			smartRender.cached.isLinkDisplayed = null;
			smartRender.cached.getLinkPosition = null;
			smartRender.cached.getTaskPosition = null;
		}

		function clearAllCache(){
			clearViewPortCache();
			clearDataCache();
		}

		function clearTaskCache(id){
			if(smartRender.cached.isTaskDisplayed){
				smartRender.cached.isTaskDisplayed[id] = undefined;
			}
			if(smartRender.cached.getTaskPosition){
				smartRender.cached.getTaskPosition[id] = undefined;
			}
		}


		function clearLinkCache(id){
			if(smartRender.cached.isLinkDisplayed){
				smartRender.cached.isLinkDisplayed[id] = undefined;
			}
			if(smartRender.cached.getLinkPosition){
				smartRender.cached.getLinkPosition[id] = undefined;
			}
		}
		gantt.attachEvent("onClear", function(){
			clearAllCache();
		});
		gantt.attachEvent("onParse", function(){
			clearAllCache();
		});

		gantt.attachEvent("onAfterLinkUpdate", clearLinkCache);
		gantt.attachEvent("onAfterTaskAdd", clearAllCache);
		gantt.attachEvent("onAfterTaskDelete", clearAllCache);
		gantt.attachEvent("onAfterTaskUpdate", clearTaskCache);
		gantt.attachEvent("onGanttScroll",  clearViewPortCache);
		gantt.attachEvent("onDataRender", clearAllCache);

		this.invalidateCache = function(){};
	}

};

gantt.attachEvent("onGanttScroll", function(oldLeft, oldTop, left, top){
	if(gantt.config.smart_rendering){

		if((oldTop != top) || (oldLeft == left)){

			//var visibleTasks = gantt._smart_render.getRange();
			gantt._smart_render.updateRender();

		}

	}
});

gantt.attachEvent("onDataRender", function() {
	if(gantt.config.smart_rendering){
		gantt._smart_render.updateRender();
	}
});

(function(){
	var attachOnce = gantt.attachEvent("onGanttReady", function(){
		var layers = gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender("task");
		taskRenderer.filters.push(function(id, task){
			if(!gantt.config.smart_rendering)
				return true;
			else
				return !!gantt._smart_render.isTaskDisplayed(id, task);
		});

		var linkRenderer = layers.getDataRender("link");
		linkRenderer.filters.push(function(id, link){
			if(!gantt.config.smart_rendering)
				return true;
			else
				return !!gantt._smart_render.isLinkDisplayed(id, link);
		});

		gantt.detachEvent(attachOnce);
	});
})();



/***/ })

/******/ });
});