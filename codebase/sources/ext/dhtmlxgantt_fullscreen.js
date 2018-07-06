/*
@license

dhtmlxGantt v.5.2.0 Standard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.

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
	//Array of objects to run after fullscreen change
	// {
	//      confition: function() {}, // Condition to check screen changed
	//      callback: function() {} // Screen change callback
	// }
	gantt._fs_change = [];

	var getState = gantt.getState;
	gantt.getState = function () {
		var state = getState.apply(this, arguments);
		state.fullscreen = !!this._expanded;
		return state;
	};

	//For fullscreen closing via ESC button
	gantt._onFullScreenChange = function () {
		if(!gantt.$container){
			// do nothing if gantt is not yet initialized
			return;
		}

		var isFullScreen = gantt.getState().fullscreen;
		if (isFullScreen) {
			if (!gantt._isFullScreenActive()) {
				gantt.collapse();
			}
		}
		var fsChange = gantt._fs_change.length ? gantt._fs_change.pop() : null;

		gantt._expanded = !gantt._expanded;
		if (!fsChange) {
			gantt.render();
		}
		else {
			if (fsChange.condition()) {
				fsChange.callback();
			}
			else {
				var interval = setInterval(function () {
					if (fsChange.condition()) {
						clearInterval(interval);
						interval = null;
						fsChange.callback();
					}
				}, 10);

				setTimeout(function () {
					if (!interval) return;
					clearInterval(interval);
					fsChange.callback();
				}, 100);
			}
		}
	};

	gantt._isFullScreenActive = function () {
		return (document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement);
	};

	gantt._isFullScreenAvailable = function () {
		return document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled;
	};

	gantt.event(document, "webkitfullscreenchange", gantt._onFullScreenChange);
	gantt.event(document, "mozfullscreenchange", gantt._onFullScreenChange);
	gantt.event(document, "MSFullscreenChange", gantt._onFullScreenChange);
//For IE on Win 10
	gantt.event(document, "fullscreenChange", gantt._onFullScreenChange);
	gantt.event(document, "fullscreenchange", gantt._onFullScreenChange);

	gantt.expand = function () {
		if (!gantt.callEvent("onBeforeExpand", []))
			return;
		gantt._toggleFullScreen(true);
		var ganttBlock = gantt.$root;

		do {
			ganttBlock._position = ganttBlock.style.position || "";
			ganttBlock.style.position = "static";
		} while ((ganttBlock = ganttBlock.parentNode) && ganttBlock.style);
		ganttBlock = gantt.$root;
		ganttBlock.style.position = "absolute";
		ganttBlock._width = ganttBlock.style.width;
		ganttBlock._height = ganttBlock.style.height;
		ganttBlock.style.width = ganttBlock.style.height = "100%";
		ganttBlock.style.top = ganttBlock.style.left = "0px";

		var top = document.body;
		top.scrollTop = 0;

		top = top.parentNode;
		if (top)
			top.scrollTop = 0;
		document.body._overflow = document.body.style.overflow || "";
		document.body.style.overflow = "hidden";
		document.body._width = document.body.style.width;
		document.body._height = document.body.style.height;

		var callback = function () {
			//IE11 Full screen Hack
			if (document.documentElement.msRequestFullscreen && gantt.$root) {
				gantt.$root.style.width = document.body.style.width = window.outerWidth + "px";
				gantt.$root.style.height = document.body.style.height = window.outerHeight + "px";
			}

			gantt.render();
			gantt.callEvent("onExpand", []);
		};

		if (!gantt._isFullScreenAvailable()) {
			gantt._expanded = !gantt._expanded;
			callback();
		}
		else {
			var oldGanttHeight = window.outerHeight;
			var oldGanttWidth = window.outerWidth;
			gantt._fs_change.push({
				condition: function () {
					return oldGanttHeight < window.outerHeight && oldGanttWidth <= window.outerWidth;
				},
				callback: callback
			});
		}
	};

	gantt.collapse = function () {
		if (!gantt.callEvent("onBeforeCollapse", []))
			return;
		var ganttBlock = gantt.$root;
		do {
			ganttBlock.style.position = ganttBlock._position;
		} while ((ganttBlock = ganttBlock.parentNode) && ganttBlock.style);
		ganttBlock = gantt.$root;
		ganttBlock.style.width = ganttBlock._width;
		ganttBlock.style.height = ganttBlock._height;
		document.body.style.overflow = document.body._overflow;
		document.body.style.width = document.body._width;
		document.body.style.height = document.body._height;

		gantt._toggleFullScreen(false);

		var callback = function () {
			gantt.render();
			gantt.callEvent("onCollapse", []);
		};

		if (!gantt._isFullScreenAvailable()) {
			gantt._expanded = !gantt._expanded;
			callback();
		}
		else {
			var oldGanttHeight = window.outerHeight;
			var oldGanttWidth = window.outerWidth;
			gantt._fs_change.push({
				condition: function () {
					return oldGanttHeight > window.outerHeight && oldGanttWidth >= window.outerWidth;
				},
				callback: callback
			});
		}
	};

	gantt._toggleFullScreen = function (on) {
		if (on || (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)) {  // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	};
})();

/***/ })

/******/ });