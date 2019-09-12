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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/click_drag/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/click_drag/eventsManager.ts":
/*!*************************************************!*\
  !*** ./sources/ext/click_drag/eventsManager.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventsManager = /** @class */ (function () {
    function EventsManager() {
        this._mouseDown = false;
        this._eventsIds = [];
    }
    EventsManager.prototype.attach = function (selectedRegion, useKey) {
        var _this = this;
        var _target = selectedRegion.getViewPort();
        this._originPosition = window.getComputedStyle(_target).display;
        this._restoreOriginPosition = function () {
            _target.style.position = _this._originPosition;
        };
        if (this._originPosition === "static") {
            _target.style.position = "relative";
        }
        var state = gantt.$services.getService("state");
        state.registerProvider("clickDrag", function () {
            var result = { autoscroll: false };
            return result;
        });
        var scheduledDndCoordinates = null;
        var startDragAndDrop = function () {
            if (!scheduledDndCoordinates) {
                return;
            }
            _this._mouseDown = true;
            selectedRegion.setStart(scheduledDndCoordinates);
            selectedRegion.setPosition(scheduledDndCoordinates);
            selectedRegion.setEnd(scheduledDndCoordinates);
            scheduledDndCoordinates = null;
        };
        this._eventsIds[this._eventsIds.length] = gantt.event(_target, "mousedown", function (event) {
            scheduledDndCoordinates = null;
            if (gantt.utils.dom.closest(event.target, ".gantt_task_line, .gantt_task_link")) {
                return;
            }
            state.registerProvider("clickDrag", function () {
                var result = { autoscroll: _this._mouseDown };
                return result;
            });
            if (useKey && event[useKey] !== true) {
                return;
            }
            scheduledDndCoordinates = _this._getCoordinates(event, selectedRegion);
        });
        this._eventsIds[this._eventsIds.length] = gantt.event(document.body, "mouseup", function (event) {
            scheduledDndCoordinates = null;
            if (useKey && event[useKey] !== true) {
                return;
            }
            if (_this._mouseDown === true) {
                _this._mouseDown = false;
                var coordinates = _this._getCoordinates(event, selectedRegion);
                selectedRegion.dragEnd(coordinates);
            }
        });
        this._eventsIds[this._eventsIds.length] = gantt.event(_target, "mousemove", function (event) {
            if (useKey && event[useKey] !== true) {
                return;
            }
            var coordinates = null;
            if (!_this._mouseDown && scheduledDndCoordinates) {
                coordinates = _this._getCoordinates(event, selectedRegion);
                if (Math.abs(scheduledDndCoordinates.relative.left - coordinates.relative.left) > 5) {
                    // add small threshold not to start dnd on simple click
                    startDragAndDrop();
                }
                return;
            }
            if (_this._mouseDown === true) {
                coordinates = _this._getCoordinates(event, selectedRegion);
                selectedRegion.setEnd(coordinates);
                selectedRegion.render();
            }
        });
    };
    EventsManager.prototype.detach = function () {
        this._restoreOriginPosition();
        this._eventsIds.forEach(function (eventId) {
            gantt.eventRemove(eventId);
        });
        var state = gantt.$services.getService("state");
        state.unregisterProvider("clickDrag");
    };
    EventsManager.prototype.destructor = function () {
        this.detach();
    };
    EventsManager.prototype._getCoordinates = function (event, selectedRegion) {
        var viewPort = selectedRegion.getViewPort();
        var viewPortBounds = viewPort.getBoundingClientRect();
        var clientX = event.clientX, clientY = event.clientY;
        var result = {
            absolute: {
                left: clientX,
                top: clientY,
            },
            relative: {
                left: clientX - viewPortBounds.left + viewPort.scrollLeft,
                top: clientY - viewPortBounds.top + viewPort.scrollTop
            }
        };
        return result;
    };
    return EventsManager;
}());
exports.EventsManager = EventsManager;


/***/ }),

/***/ "./sources/ext/click_drag/index.ts":
/*!*****************************************!*\
  !*** ./sources/ext/click_drag/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventsManager_1 = __webpack_require__(/*! ./eventsManager */ "./sources/ext/click_drag/eventsManager.ts");
var selectedRegion_1 = __webpack_require__(/*! ./selectedRegion */ "./sources/ext/click_drag/selectedRegion.ts");
if (!gantt.ext) {
    gantt.ext = {};
}
var defaultConfig = {
    className: "gantt_click_drag_rect",
    useRequestAnimationFrame: true,
    callback: undefined,
    singleRow: false
};
var eventsManager = new eventsManager_1.EventsManager();
gantt.ext.clickDrag = eventsManager;
gantt.attachEvent("onGanttReady", function () {
    var config = __assign({ viewPort: gantt.$task_data }, defaultConfig);
    if (gantt.config.click_drag) {
        var clickDrag = gantt.config.click_drag;
        config.render = clickDrag.render || defaultConfig.render;
        config.className = clickDrag.className || defaultConfig.className;
        config.callback = clickDrag.callback || defaultConfig.callback;
        config.viewPort = clickDrag.viewPort || gantt.$task_data;
        config.useRequestAnimationFrame = clickDrag.useRequestAnimationFrame === undefined ?
            defaultConfig.useRequestAnimationFrame : clickDrag.useRequestAnimationFrame;
        config.singleRow = clickDrag.singleRow === undefined ? defaultConfig.singleRow : clickDrag.singleRow;
        var selectedRegion = new selectedRegion_1.SelectedRegion(config);
        gantt.ext.clickDrag.attach(selectedRegion, clickDrag.useKey);
    }
});
gantt.attachEvent("onDestroy", function () {
    eventsManager.destructor();
});


/***/ }),

/***/ "./sources/ext/click_drag/selectedRegion.ts":
/*!**************************************************!*\
  !*** ./sources/ext/click_drag/selectedRegion.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventable = __webpack_require__(/*! ../../utils/eventable */ "./sources/utils/eventable.js");
var helpers_1 = __webpack_require__(/*! ../../utils/helpers */ "./sources/utils/helpers.js");
function _countSize(start, end) {
    var result = start - end;
    if (result >= 0) {
        return result;
    }
    return -result;
}
var SelectedRegion = /** @class */ (function () {
    function SelectedRegion(config) {
        var _this = this;
        this._el = document.createElement("div");
        this._viewPort = config.viewPort;
        this._el.classList.add(config.className);
        if (typeof config.callback === "function") {
            this._callback = config.callback;
        }
        if (typeof config.render === "function") {
            this.render = function () {
                _this._el = config.render(_this._startPoint, _this._endPoint);
                if (config.className !== "") {
                    _this._el.classList.add(config.className);
                }
                _this.draw();
            };
        }
        if (!helpers_1.isEventable(this._viewPort)) {
            eventable(this._viewPort);
        }
        this._singleRow = config.singleRow;
        this._useRequestAnimationFrame = config.useRequestAnimationFrame;
    }
    SelectedRegion.prototype.setStyles = function () {
        if (this._singleRow) {
            var height = gantt.config.row_height;
            this._el.style.height = height + "px";
            this._el.style.top = (Math.ceil(this._positionPoint.relative.top / height) - 1) * height + "px";
        }
        else {
            this._el.style.height = _countSize(this._endPoint.relative.top, this._startPoint.relative.top) + "px";
            this._el.style.top = this._positionPoint.relative.top + "px";
        }
        this._el.style.width = _countSize(this._endPoint.relative.left, this._startPoint.relative.left) + "px";
        this._el.style.left = this._positionPoint.relative.left + "px";
    };
    SelectedRegion.prototype.render = function () {
        this.setStyles();
        this.draw();
    };
    SelectedRegion.prototype.draw = function () {
        var _this = this;
        if (this._useRequestAnimationFrame) {
            return helpers_1.requestAnimationFrame(function () {
                _this._viewPort.appendChild(_this.getElement());
            });
        }
        else {
            this._viewPort.appendChild(this.getElement());
        }
    };
    SelectedRegion.prototype.clear = function () {
        var _this = this;
        if (this._useRequestAnimationFrame) {
            return helpers_1.requestAnimationFrame(function () {
                if (!_this._el.parentNode) {
                    return;
                }
                _this._viewPort.removeChild(_this._el);
            });
        }
        else {
            if (!this._el.parentNode) {
                return;
            }
            this._viewPort.removeChild(this._el);
        }
    };
    SelectedRegion.prototype.getElement = function () {
        return this._el;
    };
    SelectedRegion.prototype.getViewPort = function () {
        return this._viewPort;
    };
    SelectedRegion.prototype.setStart = function (startPoint) {
        this._startPoint = startPoint;
        this._startDate = gantt.dateFromPos(this._startPoint.relative.left);
        this._viewPort.callEvent("onBeforeDrag", [this._startPoint]);
    };
    SelectedRegion.prototype.setEnd = function (endPoint) {
        this._endPoint = endPoint;
        if (this._singleRow) {
            var height = gantt.config.row_height;
            this._endPoint.relative.top = (Math.ceil(this._startPoint.relative.top / height)) * height;
        }
        this._endDate = gantt.dateFromPos(this._endPoint.relative.left);
        if (this._startPoint.relative.left > this._endPoint.relative.left) {
            this._positionPoint = {
                relative: { left: this._endPoint.relative.left, top: this._positionPoint.relative.top },
                absolute: { left: this._endPoint.absolute.left, top: this._positionPoint.absolute.top }
            };
        }
        if (this._startPoint.relative.top > this._endPoint.relative.top) {
            this._positionPoint = {
                relative: { left: this._positionPoint.relative.left, top: this._endPoint.relative.top },
                absolute: { left: this._positionPoint.absolute.left, top: this._endPoint.absolute.top }
            };
        }
        this._viewPort.callEvent("onDrag", [this._startPoint, this._endPoint]);
    };
    SelectedRegion.prototype.setPosition = function (positionPoint) {
        this._positionPoint = positionPoint;
    };
    SelectedRegion.prototype.dragEnd = function (endPoint) {
        var _a;
        if (endPoint.relative.left < 0) {
            endPoint.relative.left = 0;
        }
        this._viewPort.callEvent("onBeforeDragEnd", [this._startPoint, endPoint]);
        this.setEnd(endPoint);
        if (this._startDate.valueOf() > this._endDate.valueOf()) {
            _a = [this._endDate, this._startDate], this._startDate = _a[0], this._endDate = _a[1];
        }
        this.clear();
        var tasksByTime = gantt.getTaskByTime(this._startDate, this._endDate);
        var tasksByIndex = this._getTasksByTop(this._startPoint.relative.top, this._endPoint.relative.top);
        this._viewPort.callEvent("onDragEnd", [this._startPoint, this._endPoint]);
        if (this._callback) {
            this._callback(this._startPoint, this._endPoint, this._startDate, this._endDate, tasksByTime, tasksByIndex);
        }
    };
    SelectedRegion.prototype.getInBounds = function () {
        return this._singleRow;
    };
    SelectedRegion.prototype._getTasksByTop = function (start, end) {
        var startValue = start;
        var endValue = end;
        if (start > end) {
            startValue = end;
            endValue = start;
        }
        var height = gantt.config.row_height;
        var startIndex = Math.ceil(startValue / height) - 1;
        var endIndex = Math.ceil(endValue / height) - 1;
        var result = [];
        for (var i = startIndex; i <= endIndex; i++) {
            var task = gantt.getTaskByIndex(i);
            if (task) {
                result.push(gantt.getTaskByIndex(i));
            }
        }
        return result;
    };
    return SelectedRegion;
}());
exports.SelectedRegion = SelectedRegion;


/***/ }),

/***/ "./sources/utils/eventable.js":
/*!************************************!*\
  !*** ./sources/utils/eventable.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var EventHost = function(){
	this._connected = [];
	this._silent_mode = false;
};

EventHost.prototype = {
	_silentStart: function() {
		this._silent_mode = true;
	},
	_silentEnd: function() {
		this._silent_mode = false;
	}
};

var	createEventStorage = function(obj) {
	var dhx_catch = [];
	var z = function(){
		var res = true;
		for (var i = 0; i < dhx_catch.length; i++){
			if (dhx_catch[i]){
				var zr = dhx_catch[i].apply(obj, arguments);
				res=res&&zr;
			}
		}
		return res;
	};
	z.addEvent=function(ev){
		if (typeof (ev) == "function")
			return dhx_catch.push(ev)-1;
		return false;
	};
	z.removeEvent=function(id){
		dhx_catch[id]=null;
	};
	return z;
};

function makeEventable(obj){

	var eventHost = new EventHost();
	obj.attachEvent=function(name, catcher, callObj){
		name='ev_'+name.toLowerCase();
		if (!eventHost[name])
			eventHost[name] = createEventStorage(callObj||this);

		return(name+':'+eventHost[name].addEvent(catcher)); //return ID (event name & event ID)
	};
	obj.attachAll = function(callback, callObj){
		this.attachEvent('listen_all', callback, callObj);
	};

	obj.callEvent=function(name, arg0, callObj){
		if (eventHost._silent_mode) return true;

		var handlerName = 'ev_'+name.toLowerCase();

		if (eventHost['ev_listen_all']){
			eventHost['ev_listen_all'].apply(callObj || this, [name].concat(arg0));
		}

		if (eventHost[handlerName])
			return eventHost[handlerName].apply(callObj || this, arg0);
		return true;
	};
	obj.checkEvent=function(name){
		return (!!eventHost['ev_'+name.toLowerCase()]);
	};
	obj.detachEvent=function(id){
		if (id){
			var list = id.split(':');//get EventName and ID
			var eventName = list[0];
			var eventId = list[1];

			if(eventHost[eventName]){
				eventHost[eventName].removeEvent(eventId); //remove event
			}
		}
	};
	obj.detachAllEvents = function(){
		for (var name in eventHost){
			if (name.indexOf("ev_") === 0)
				delete eventHost[name];
		}
	};

}

module.exports = makeEventable;

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