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
		define("ext/dhtmlxgantt_drag_timeline", [], factory);
	else if(typeof exports === 'object')
		exports["ext/dhtmlxgantt_drag_timeline"] = factory();
	else
		root["ext/dhtmlxgantt_drag_timeline"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/drag_timeline/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/drag_timeline/eventsManager.ts":
/*!****************************************************!*\
  !*** ./sources/ext/drag_timeline/eventsManager.ts ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(/*! ../../utils/helpers */ "./sources/utils/helpers.js");
var EventsManager = /** @class */ (function () {
    function EventsManager() {
        var _this = this;
        this._mouseDown = false;
        this._calculateDirectionVector = function () {
            var traceSteps = 10;
            if (_this._trace.length >= traceSteps) {
                var dots = _this._trace.slice(_this._trace.length - traceSteps);
                var vectors = [];
                for (var i = 1; i < dots.length; i++) {
                    vectors.push({
                        x: dots[i].x - dots[i - 1].x,
                        y: dots[i].y - dots[i - 1].y
                    });
                }
                var resultVector_1 = { x: 0, y: 0 };
                vectors.forEach(function (vector) {
                    resultVector_1.x += vector.x;
                    resultVector_1.y += vector.y;
                });
                var magnitude = Math.sqrt(resultVector_1.x * resultVector_1.x + resultVector_1.y * resultVector_1.y);
                var angleDegrees = Math.atan2(Math.abs(resultVector_1.y), Math.abs(resultVector_1.x)) * 180 / Math.PI;
                return {
                    magnitude: magnitude,
                    angleDegrees: angleDegrees
                };
            }
            return null;
        };
        this._applyDndReadyStyles = function () {
            _this._timeline.$task.classList.add("gantt_timeline_move_available");
        };
        this._clearDndReadyStyles = function () {
            _this._timeline.$task.classList.remove("gantt_timeline_move_available");
        };
        this._getScrollPosition = function (timeline) {
            return {
                x: gantt.$ui.getView(timeline.$config.scrollX).getScrollState().position,
                y: gantt.$ui.getView(timeline.$config.scrollY).getScrollState().position
            };
        };
        this._countNewScrollPosition = function (coords) {
            var vector = _this._calculateDirectionVector();
            var shiftX = _this._startPoint.x - coords.x;
            var shiftY = _this._startPoint.y - coords.y;
            if (vector) {
                if (vector.angleDegrees < 15) {
                    shiftY = 0;
                }
                else if (vector.angleDegrees > 75) {
                    shiftX = 0;
                }
            }
            var result = {
                x: _this._scrollState.x + shiftX,
                y: _this._scrollState.y + shiftY
            };
            return result;
        };
        this._setScrollPosition = function (timeline, coords) {
            helpers_1.requestAnimationFrame(function () {
                gantt.$ui.getView(timeline.$config.scrollX).scroll(coords.x);
                gantt.$ui.getView(timeline.$config.scrollY).scroll(coords.y);
            });
        };
        this._stopDrag = function (event) {
            _this._trace = [];
            gantt.$root.classList.remove("gantt_noselect");
            if (_this._originalReadonly !== undefined) {
                gantt.config.readonly = _this._originalReadonly;
            }
            if (_this._originAutoscroll !== undefined) {
                gantt.config.autoscroll = _this._originAutoscroll;
            }
            var useKey = gantt.config.drag_timeline.useKey;
            if (useKey && event[useKey] !== true) {
                return;
            }
            if (_this._mouseDown) {
                _this._mouseDown = false;
            }
        };
        this._startDrag = function (event) {
            _this._originAutoscroll = gantt.config.autoscroll;
            gantt.config.autoscroll = false;
            gantt.$root.classList.add("gantt_noselect");
            _this._originalReadonly = gantt.config.readonly;
            gantt.config.readonly = true;
            _this._trace = [];
            _this._mouseDown = true;
            var _a = _this._getScrollPosition(_this._timeline), x = _a.x, y = _a.y;
            _this._scrollState = { x: x, y: y };
            _this._startPoint = { x: event.clientX, y: event.clientY };
            _this._trace.push(_this._startPoint);
        };
        this._domEvents = gantt._createDomEventScope();
        this._trace = [];
    }
    EventsManager.create = function () {
        return new EventsManager();
    };
    EventsManager.prototype.destructor = function () {
        this._domEvents.detachAll();
    };
    EventsManager.prototype.attach = function (timeline) {
        var _this = this;
        this._timeline = timeline;
        this._domEvents.attach(timeline.$task, "mousedown", function (event) {
            var _a = gantt.config.drag_timeline, useKey = _a.useKey, ignore = _a.ignore, enabled = _a.enabled;
            if (enabled === false) {
                return;
            }
            var filterTargets = ".gantt_task_line, .gantt_task_link";
            if (ignore !== undefined) {
                if (ignore instanceof Array) {
                    filterTargets = ignore.join(", ");
                }
                else {
                    filterTargets = ignore;
                }
            }
            if (filterTargets) {
                if (gantt.utils.dom.closest(event.target, filterTargets)) {
                    return;
                }
            }
            if (useKey && event[useKey] !== true) {
                return;
            }
            _this._startDrag(event);
        });
        this._domEvents.attach(document, "keydown", function (event) {
            var useKey = gantt.config.drag_timeline.useKey;
            if (useKey && event[useKey] === true) {
                _this._applyDndReadyStyles();
            }
        });
        this._domEvents.attach(document, "keyup", function (event) {
            var useKey = gantt.config.drag_timeline.useKey;
            if (useKey && event[useKey] === false) {
                _this._clearDndReadyStyles();
                _this._stopDrag(event);
            }
        });
        this._domEvents.attach(document, "mouseup", function (event) {
            _this._stopDrag(event);
        });
        this._domEvents.attach(gantt.$root, "mouseup", function (event) {
            _this._stopDrag(event);
        });
        this._domEvents.attach(document, "mouseleave", function (event) {
            _this._stopDrag(event);
        });
        this._domEvents.attach(gantt.$root, "mouseleave", function (event) {
            _this._stopDrag(event);
        });
        this._domEvents.attach(gantt.$root, "mousemove", function (event) {
            var useKey = gantt.config.drag_timeline.useKey;
            if (useKey && event[useKey] !== true) {
                return;
            }
            if (_this._mouseDown === true) {
                _this._trace.push({ x: event.clientX, y: event.clientY });
                var scrollPosition = _this._countNewScrollPosition({ x: event.clientX, y: event.clientY });
                _this._setScrollPosition(timeline, scrollPosition);
                _this._scrollState = scrollPosition;
                _this._startPoint = { x: event.clientX, y: event.clientY };
            }
        });
    };
    return EventsManager;
}());
exports.EventsManager = EventsManager;


/***/ }),

/***/ "./sources/ext/drag_timeline/index.ts":
/*!********************************************!*\
  !*** ./sources/ext/drag_timeline/index.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventsManager_1 = __webpack_require__(/*! ./eventsManager */ "./sources/ext/drag_timeline/eventsManager.ts");
if (!gantt.ext) {
    gantt.ext = {};
}
gantt.ext.dragTimeline = {
    create: function () { return eventsManager_1.EventsManager.create(); }
};
gantt.config.drag_timeline = {
    enabled: true
};


/***/ }),

/***/ "./sources/utils/helpers.js":
/*!**********************************!*\
  !*** ./sources/utils/helpers.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var units = {
	"second": 1,
	"minute": 60,
	"hour": 60 * 60,
	"day": 60 * 60 * 24,
	"week": 60 * 60 * 24 * 7,
	"month": 60 * 60 * 24 * 30,
	"quarter": 60 * 60 * 24 * 30 * 3,
	"year": 60 * 60 * 24 * 365
};
function getSecondsInUnit(unit){
	return units[unit] || units.hour;
}

function forEach(arr, callback) {
	if (arr.forEach) {
		arr.forEach(callback);
	} else {
		var workArray = arr.slice();
		for (var i = 0; i < workArray.length; i++) {
			callback(workArray[i], i);
		}
	}
}

function arrayMap(arr, callback) {
	if (arr.map) {
		return arr.map(callback);
	} else {
		var workArray = arr.slice();
		var resArray = [];

		for (var i = 0; i < workArray.length; i++) {
			resArray.push(callback(workArray[i], i));
		}
		return resArray;
	}
}


function arrayFind(arr, callback) {
	if (arr.find) {
		return arr.find(callback);
	} else {
		for (var i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				return arr[i];
			}
		}
	}
}

// iframe-safe array type check instead of using instanceof
function isArray(obj){
	if(Array.isArray){
		return Array.isArray(obj);
	}else{
		// close enough
		return (obj && obj.length !== undefined && obj.pop && obj.push);
	}
}

// non-primitive string object, e.g. new String("abc")
function isStringObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function String() { [native code] }";
}

// non-primitive number object, e.g. new Number(5)
function isNumberObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function Number() { [native code] }";
}

// non-primitive number object, e.g. new Boolean(true)
function isBooleanObject(obj){
	return obj && typeof obj === "object"
		&& Function.prototype.toString.call(obj.constructor) === "function Boolean() { [native code] }";
}

function isDate(obj) {
	if (obj && typeof obj === "object") {
		return !!(obj.getFullYear && obj.getMonth && obj.getDate);
	} else {
		return false;
	}
}

function isValidDate(obj){
	return isDate(obj) && !isNaN(obj.getTime());
}

function arrayFilter(arr, callback) {
	var result = [];

	if (arr.filter) {
		return arr.filter(callback);
	} else {
		for (var i = 0; i < arr.length; i++) {
			if (callback(arr[i], i)) {
				result[result.length] = arr[i];
			}
		}
		return result;
	}
}

function hashToArray(hash) {
	var result = [];

	for (var key in hash) {
		if (hash.hasOwnProperty(key)) {
			result.push(hash[key]);
		}
	}

	return result;
}

function arraySome(arr, callback) {
	if (arr.length === 0) return false;

	for (var i = 0; i < arr.length; i++) {
		if (callback(arr[i], i, arr)) {
			return true;
		}
	}
	return false;
}

function arrayDifference(arr, callback) {
	return arrayFilter(arr, function(item, i) {
		return !callback(item, i);
	});
}

function throttle (callback, timeout) {
	var wait = false;

	return function () {
		if (!wait) {
			callback.apply(null, arguments);
			wait = true;
			setTimeout(function () {
				wait = false;
			}, timeout);
		}
	};
}

function delay (callback, timeout){
	var timer;

	var result = function() {
		result.$cancelTimeout();
		callback.$pending = true;
		var args = Array.prototype.slice.call(arguments);
		timer = setTimeout(function(){
			callback.apply(this, args);
			result.$pending = false;
		}, timeout);
	};
	
	result.$pending = false;
	result.$cancelTimeout = function(){
		clearTimeout(timer);
		callback.$pending = false;
	};
	result.$execute = function(){
		callback();
		callback.$cancelTimeout();
	};

	return result;
}

function sortArrayOfHash(arr, field, desc) {
	var compare = function(a, b) {
		return a < b;
	};

	arr.sort(function(a, b) {
		if (a[field] === b[field]) return 0;

		return desc ? compare(a[field], b[field]) : compare(b[field], a[field]);
	});
}

function objectKeys(obj) {
	if (Object.keys) {
		return Object.keys(obj);
	}
	var result = [];
	var key;
	for (key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result.push(key);
		}
	}
	return result;
}

function requestAnimationFrame(callback) {
	var w = window;
	var foundRequestAnimationFrame = w.requestAnimationFrame
		|| w.webkitRequestAnimationFrame
		|| w.msRequestAnimationFrame
		|| w.mozRequestAnimationFrame
		|| w.oRequestAnimationFrame
		|| function(cb) { setTimeout(cb, 1000/60); };
	return foundRequestAnimationFrame(callback);
}

function isEventable(obj) {
	return obj.attachEvent && obj.detachEvent;
}

module.exports = {
	getSecondsInUnit: getSecondsInUnit,
	forEach: forEach,
	arrayMap: arrayMap,
	arrayFind: arrayFind,
	arrayFilter: arrayFilter,
	arrayDifference: arrayDifference,
	arraySome: arraySome,
	hashToArray: hashToArray,
	sortArrayOfHash: sortArrayOfHash,
	throttle: throttle,
	isArray: isArray,
	isDate: isDate,
	isValidDate: isValidDate,
	isStringObject: isStringObject,
	isNumberObject: isNumberObject,
	isBooleanObject: isBooleanObject,
	delay: delay,
	objectKeys: objectKeys,
	requestAnimationFrame: requestAnimationFrame,
	isEventable: isEventable
};

/***/ })

/******/ });
});