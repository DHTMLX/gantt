/*!
 * @license
 * 
 * dhtmlxGantt v.5.1.0 Stardard
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
/******/ 	return __webpack_require__(__webpack_require__.s = 23);
/******/ })
/************************************************************************/
/******/ ({

/***/ 23:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(24);


/***/ }),

/***/ 24:
/***/ (function(module, exports) {

gantt.config.smart_rendering = true;

gantt._smart_render = {
	getViewPort: function(){
		var timelineSize = gantt.$ui.getView("timeline").getSize();
		var scrollPos = gantt.getScrollState();

		return {
			y: scrollPos.y,
			y_end: scrollPos.y + timelineSize.y
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

		this._redrawItems(taskRenderer.getLayers(), visibleTasks);
		this._redrawItems(linkRenderer.getLayers(), visibleLinks);
		gantt.callEvent("onSmartRender", []);
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

			var visibleTasks = gantt._smart_render.getRange();
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