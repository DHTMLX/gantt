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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/fullscreen.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/fullscreen.js":
/*!***********************************!*\
  !*** ./sources/ext/fullscreen.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function() {
	var getState = gantt.getState;
	gantt.getState = function () {
		var state = getState.apply(this, arguments);
		state.fullscreen = isExpanded();
		return state;
	};

	function isExpanded(){
		var element = (document.fullscreenElement ||
			document.mozFullScreenElement ||
			document.webkitFullscreenElement ||
			document.msFullscreenElement);

		return element && element === document.body;
	}

	function isFullscreenAvailable(){
		return document.fullscreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.msFullscreenEnabled;
	}

	var expanded = false;

	var backupElementSizes = {
		width:null,
		height:null,
		top:null,
		position:null,
		modified: false
	};

	// expand gantt root element to fullscreen automatically
	function setFullScreenSizes(){
		var root = gantt.$root;
		backupElementSizes.width = root.style.width;
		backupElementSizes.height = root.style.height;
		backupElementSizes.top = root.style.top;
		backupElementSizes.position = root.style.position;
		root.style.width = '100vw';
		root.style.height = '100vh';
		root.style.top = '0';
		root.style.position = 'absolute';
		backupElementSizes.modified = true;
	}

	function setNotFullScreenSizes(){
		var root = gantt.$root;
		if(backupElementSizes.modified){
			root.style.width = backupElementSizes.width;
			root.style.height = backupElementSizes.height;
			root.style.top = backupElementSizes.top;
			root.style.position = backupElementSizes.position;
			backupElementSizes.modified = false;
		}
	}

	function prepareGanttContainer(isGanttExpanded){
		if(isGanttExpanded){
			setFullScreenSizes();
			setTimeout(function(){
				gantt.render();
			});
		}
		else {
			setNotFullScreenSizes();
			gantt.render();
		}
	}

	function onFullScreenChange() {
		if(!gantt.$container){
			// do nothing if gantt is not yet initialized
			return;
		}

		var isGanttExpanded = isExpanded();
		prepareGanttContainer(isGanttExpanded);
		if(isGanttExpanded){
			expanded = true;
			setTimeout(function(){
				gantt.callEvent("onExpand");
			});
		}else if (expanded){
			expanded = false;
			setTimeout(function(){
				gantt.callEvent("onCollapse");
			});
		}
	}

	function addDOMEvents(){
		gantt.event(document, "webkitfullscreenchange", onFullScreenChange);
		gantt.event(document, "mozfullscreenchange", onFullScreenChange);
		gantt.event(document, "MSFullscreenChange", onFullScreenChange);
		//For IE on Win 10
		gantt.event(document, "fullscreenChange", onFullScreenChange);
		gantt.event(document, "fullscreenchange", onFullScreenChange);
	}	
	gantt.attachEvent("onGanttReady", addDOMEvents);

	function cantFullscreen(){
		if(!gantt.$container){
			return true;
		}
		if(!isFullscreenAvailable()){
			// eslint-disable-next-line no-console
			var method = console.warning || console.log;
			method("The `fullscreen` feature not being allowed, or full-screen mode not being supported");
			return true;
		}

		return false;
	}

	gantt.expand = function () {
		if(cantFullscreen()){
			return;
		}

		if (!gantt.callEvent("onBeforeExpand", []))
			return;
		var element = document.body;

		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	};

	gantt.collapse = function () {
		if(cantFullscreen()){
			return;
		}

		if(!isExpanded()){
			return;
		}

		if (!gantt.callEvent("onBeforeCollapse", []))
			return;

		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	};

})();

/***/ })

/******/ });
});