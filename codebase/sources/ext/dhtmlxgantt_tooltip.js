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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/tooltip/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/tooltip/index.ts":
/*!**************************************!*\
  !*** ./sources/ext/tooltip/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
gantt.config.tooltip_timeout = 30;
gantt.config.tooltip_offset_y = 20;
gantt.config.tooltip_offset_x = 10;
gantt.config.tooltip_hide_timeout = 30;
var tooltipManager_1 = __webpack_require__(/*! ./tooltipManager */ "./sources/ext/tooltip/tooltipManager.ts");
var tooltipManager = new tooltipManager_1.TooltipManager();
gantt.ext.tooltips = tooltipManager;
gantt.attachEvent("onGanttReady", function () {
    tooltipManager.tooltipFor({
        selector: "[" + gantt.config.task_attribute + "]:not(.gantt_task_row)",
        html: function (event) {
            if (gantt.config.touch && !gantt.config.touch_tooltip) {
                return;
            }
            var targetTaskId = gantt.locate(event);
            if (gantt.isTaskExists(targetTaskId)) {
                var task = gantt.getTask(targetTaskId);
                return gantt.templates.tooltip_text(task.start_date, task.end_date, task);
            }
            return null;
        },
        global: false
    });
});
gantt.attachEvent("onDestroy", function () {
    tooltipManager.destructor();
});
gantt.attachEvent("onLightbox", function () {
    tooltipManager.hideTooltip();
});
var isLinkCreate = function () {
    var state = gantt.getState();
    return !!state.link_source_id;
};
gantt.attachEvent("onBeforeTooltip", function () {
    if (isLinkCreate()) {
        return false;
    }
});
gantt.attachEvent("onGanttScroll", function () {
    tooltipManager.hideTooltip();
});


/***/ }),

/***/ "./sources/ext/tooltip/tooltip.ts":
/*!****************************************!*\
  !*** ./sources/ext/tooltip/tooltip.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var domHelpers = __webpack_require__(/*! ../../utils/dom_helpers */ "./sources/utils/dom_helpers.js");
var Tooltip = /** @class */ (function () {
    function Tooltip() {
    }
    Tooltip.prototype.getNode = function () {
        if (!this._tooltipNode) {
            this._tooltipNode = document.createElement("div");
            this._tooltipNode.className = "gantt_tooltip";
            gantt._waiAria.tooltipAttr(this._tooltipNode);
        }
        return this._tooltipNode;
    };
    Tooltip.prototype.setViewport = function (node) {
        this._root = node;
        return this;
    };
    Tooltip.prototype.show = function (left, top) {
        var container = document.body;
        var node = this.getNode();
        if (!domHelpers.isChildOf(node, container)) {
            this.hide();
            container.appendChild(node);
        }
        if (left instanceof MouseEvent) {
            var position = this._calculateTooltipPosition(left);
            top = position.top;
            left = position.left;
        }
        node.style.top = top + "px";
        node.style.left = left + "px";
        gantt._waiAria.tooltipVisibleAttr(node);
        return this;
    };
    Tooltip.prototype.hide = function () {
        var node = this.getNode();
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
        }
        gantt._waiAria.tooltipHiddenAttr(node);
        return this;
    };
    Tooltip.prototype.setContent = function (html) {
        var node = this.getNode();
        node.innerHTML = html;
        return this;
    };
    Tooltip.prototype._getViewPort = function () {
        return this._root || document.body;
    };
    Tooltip.prototype._calculateTooltipPosition = function (event) {
        // top/left coordinates inside the viewport by mouse position
        var viewport = this._getViewPortSize();
        var tooltipNode = this.getNode();
        var tooltip = {
            top: 0,
            left: 0,
            width: tooltipNode.offsetWidth,
            height: tooltipNode.offsetHeight,
            bottom: 0,
            right: 0
        };
        var offsetX = gantt.config.tooltip_offset_x;
        var offsetY = gantt.config.tooltip_offset_y;
        var container = document.body;
        var mouse = domHelpers.getRelativeEventPosition(event, container);
        tooltip.top = mouse.y;
        tooltip.left = mouse.x;
        tooltip.top += offsetY;
        tooltip.left += offsetX;
        tooltip.bottom = tooltip.top + tooltip.height;
        tooltip.right = tooltip.left + tooltip.width;
        // edge cases when the tooltip element can be partially hidden by edges of the viewport
        if (tooltip.top < viewport.top) {
            tooltip.top = viewport.top;
            tooltip.bottom = tooltip.top + tooltip.height;
        }
        else if (tooltip.bottom > viewport.bottom) {
            tooltip.bottom = viewport.bottom;
            tooltip.top = tooltip.bottom - tooltip.height;
        }
        if (tooltip.left < viewport.left) {
            tooltip.left = viewport.left;
            tooltip.right = viewport.left + tooltip.width;
        }
        else if (tooltip.right > viewport.right) {
            tooltip.right = viewport.right;
            tooltip.left = tooltip.right - tooltip.width;
        }
        if (mouse.x >= tooltip.left && mouse.x <= tooltip.right) {
            tooltip.left = mouse.x - tooltip.width - offsetX;
            tooltip.right = tooltip.left + tooltip.width;
        }
        if (mouse.y >= tooltip.top && mouse.y <= tooltip.bottom) {
            tooltip.top = mouse.y - tooltip.height - offsetY;
            tooltip.bottom = tooltip.top + tooltip.height;
        }
        return tooltip;
    };
    Tooltip.prototype._getViewPortSize = function () {
        var container = this._getViewPort();
        var viewport = container;
        var scrollTop = window.scrollY + document.body.scrollTop;
        var scrollLeft = window.scrollX + document.body.scrollLeft;
        var pos;
        // support for the initial tooltip mode where the tooltip element was attached to the data area of gantt
        if (container === gantt.$task_data) {
            viewport = gantt.$task;
            scrollTop = 0;
            scrollLeft = 0;
            pos = domHelpers.getNodePosition(gantt.$task);
        }
        else {
            pos = domHelpers.getNodePosition(viewport);
        }
        return {
            left: pos.x + scrollLeft,
            top: pos.y + scrollTop,
            width: pos.width,
            height: pos.height,
            bottom: pos.y + pos.height + scrollTop,
            right: pos.x + pos.width + scrollLeft
        };
    };
    return Tooltip;
}());
exports.Tooltip = Tooltip;


/***/ }),

/***/ "./sources/ext/tooltip/tooltipManager.ts":
/*!***********************************************!*\
  !*** ./sources/ext/tooltip/tooltipManager.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var domEventsScope = __webpack_require__(/*! ../../utils/dom_event_scope */ "./sources/utils/dom_event_scope.js");
var domHelpers = __webpack_require__(/*! ../../utils/dom_helpers */ "./sources/utils/dom_helpers.js");
var helpers = __webpack_require__(/*! ../../utils/helpers */ "./sources/utils/helpers.js");
var tooltip_1 = __webpack_require__(/*! ./tooltip */ "./sources/ext/tooltip/tooltip.ts");
var TooltipManager = /** @class */ (function () {
    function TooltipManager() {
        this.tooltip = new tooltip_1.Tooltip();
        this._listeners = {};
        this._domEvents = domEventsScope();
        this._initDelayedFunctions();
    }
    TooltipManager.prototype.destructor = function () {
        this.tooltip.hide();
        this._domEvents.detachAll();
    };
    TooltipManager.prototype.hideTooltip = function () {
        this.delayHide();
    };
    TooltipManager.prototype.attach = function (config) {
        var _this = this;
        var root = document.body;
        if (!config.global) {
            root = gantt.$root;
        }
        var watchableTarget = null;
        var handler = function (event) {
            var eventTarget = domHelpers.getTargetNode(event);
            var targetNode = domHelpers.closest(eventTarget, config.selector);
            if (domHelpers.isChildOf(eventTarget, _this.tooltip.getNode())) {
                return;
            }
            var doOnMouseEnter = function () {
                watchableTarget = targetNode;
                config.onmouseenter(event, targetNode);
            };
            if (watchableTarget) {
                if (targetNode && targetNode === watchableTarget) {
                    config.onmousemove(event, targetNode);
                }
                else {
                    config.onmouseleave(event, watchableTarget);
                    watchableTarget = null;
                    if (targetNode && targetNode !== watchableTarget) {
                        doOnMouseEnter();
                    }
                }
            }
            else {
                if (targetNode) {
                    doOnMouseEnter();
                }
            }
        };
        this.detach(config.selector);
        this._domEvents.attach(root, "mousemove", handler);
        this._listeners[config.selector] = {
            node: root,
            handler: handler
        };
    };
    TooltipManager.prototype.detach = function (selector) {
        var listener = this._listeners[selector];
        if (listener) {
            this._domEvents.detach(listener.node, "mousemove", listener.handler);
        }
    };
    TooltipManager.prototype.tooltipFor = function (config) {
        var _this = this;
        var cloneDomEvent = function (event) {
            var clone = event;
            // making events survive timeout in ie
            // tslint:disable-next-line no-string-literal
            if (document["createEventObject"] && !document.createEvent) {
                // tslint:disable-next-line no-string-literal
                clone = document["createEventObject"](event);
            }
            return clone;
        };
        this._initDelayedFunctions();
        this.attach({
            selector: config.selector,
            global: config.global,
            onmouseenter: function (event, node) {
                var html = config.html(event, node);
                if (html) {
                    _this.delayShow(cloneDomEvent(event), html);
                }
            },
            onmousemove: function (event, node) {
                var html = config.html(event, node);
                if (html) {
                    _this.delayShow(cloneDomEvent(event), html);
                }
                else {
                    _this.delayShow.$cancelTimeout();
                    _this.delayHide();
                }
            },
            onmouseleave: function () {
                _this.delayShow.$cancelTimeout();
                _this.delayHide();
            },
        });
    };
    TooltipManager.prototype._initDelayedFunctions = function () {
        var _this = this;
        // reset delayed functions in order to apply current values of tooltip_timeout
        if (this.delayShow) {
            this.delayShow.$cancelTimeout();
        }
        if (this.delayHide) {
            this.delayHide.$cancelTimeout();
        }
        this.tooltip.hide();
        this.delayShow = helpers.delay(function (event, html) {
            if (gantt.callEvent("onBeforeTooltip", [event]) === false) {
                _this.tooltip.hide();
            }
            else {
                _this.tooltip.setContent(html);
                _this.tooltip.show(event);
            }
        }, gantt.config.tooltip_timeout || 1);
        this.delayHide = helpers.delay(function () {
            _this.delayShow.$cancelTimeout();
            _this.tooltip.hide();
        }, gantt.config.tooltip_hide_timeout || 1);
    };
    return TooltipManager;
}());
exports.TooltipManager = TooltipManager;


/***/ }),

/***/ "./sources/utils/dom_event_scope.js":
/*!******************************************!*\
  !*** ./sources/utils/dom_event_scope.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(/*! ./utils */ "./sources/utils/utils.js");

function createScope(addEvent, removeEvent) {
	addEvent = addEvent || utils.event;
	removeEvent = removeEvent || utils.eventRemove;

	var handlers = [];

	var eventScope = {
		attach: function(el, event, callback, capture){
			handlers.push({element: el, event:event, callback: callback, capture: capture});
			addEvent(el, event, callback, capture);
		},
		detach: function(el, event, callback, capture){
			removeEvent(el, event, callback, capture);
			for(var i = 0; i < handlers.length; i++){
				var handler = handlers[i];
				if (handler.element === el && handler.event === event && handler.callback === callback && handler.capture === capture) {
					handlers.splice(i, 1);
					i--;
				}
			}
		},
		detachAll: function () {
			var staticArray = handlers.slice();
			// original handlers array can be spliced on every iteration
			for (var i = 0; i < staticArray.length; i++){
				var handler = staticArray[i];
				eventScope.detach(handler.element, handler.event, handler.callback, handler.capture);
				eventScope.detach(handler.element, handler.event, handler.callback, undefined);
				eventScope.detach(handler.element, handler.event, handler.callback, false);
				eventScope.detach(handler.element, handler.event, handler.callback, true);
			}
			handlers.splice(0, handlers.length);
		},
		extend: function(){
			return createScope(this.event, this.eventRemove);
		}
	};

	if (!window.scopes) {
		window.scopes = [];
	}
	window.scopes.push(handlers);
	return eventScope;
}

module.exports = createScope;

/***/ }),

/***/ "./sources/utils/dom_helpers.js":
/*!**************************************!*\
  !*** ./sources/utils/dom_helpers.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//returns position of html element on the page
function elementPosition(elem) {
	var top=0, left=0, right=0, bottom=0;
	if (elem.getBoundingClientRect) { //HTML5 method
		var box = elem.getBoundingClientRect();
		var body = document.body;
		var docElem = (document.documentElement ||
			document.body.parentNode ||
			document.body);

		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		top  = box.top +  scrollTop - clientTop;
		left = box.left + scrollLeft - clientLeft;

		right = document.body.offsetWidth - box.right;
		bottom = document.body.offsetHeight - box.bottom;
	} else { //fallback to naive approach
		while(elem) {
			top = top + parseInt(elem.offsetTop,10);
			left = left + parseInt(elem.offsetLeft,10);
			elem = elem.offsetParent;
		}

		right = document.body.offsetWidth - elem.offsetWidth - left;
		bottom = document.body.offsetHeight - elem.offsetHeight - top;
	}
	return { y: Math.round(top), x: Math.round(left), width:elem.offsetWidth, height:elem.offsetHeight, right: Math.round(right), bottom: Math.round(bottom) };
}

function isVisible(node){
	var display = false,
		visibility = false;
	if(window.getComputedStyle){
		var style = window.getComputedStyle(node, null);
		display = style["display"];
		visibility = style["visibility"];
	}else if(node.currentStyle){
		display = node.currentStyle["display"];
		visibility = node.currentStyle["visibility"];
	}
	return (display != "none" && visibility != "hidden");
}

function hasNonNegativeTabIndex(node){
	return !isNaN(node.getAttribute("tabindex")) && (node.getAttribute("tabindex")*1 >= 0);
}

function hasHref(node){
	var canHaveHref = {"a": true, "area": true};
	if(canHaveHref[node.nodeName.loLowerCase()]){
		return !!node.getAttribute("href");
	}
	return true;
}

function isEnabled(node){
	var canDisable = {"input":true, "select":true, "textarea":true, "button":true, "object":true};
	if(canDisable[node.nodeName.toLowerCase()]){
		return !node.hasAttribute("disabled");
	}

	return true;
}

function getFocusableNodes(root){
	var nodes = root.querySelectorAll([
		"a[href]",
		"area[href]",
		"input",
		"select",
		"textarea",
		"button",
		"iframe",
		"object",
		"embed",
		"[tabindex]",
		"[contenteditable]"
	].join(", "));

	var nodesArray = Array.prototype.slice.call(nodes, 0);
	for(var i = 0; i < nodesArray.length; i++){
		var node = nodesArray[i];
		var isValid = (hasNonNegativeTabIndex(node)  || isEnabled(node) || hasHref(node)) && isVisible(node);
		if(!isValid){
			nodesArray.splice(i, 1);
			i--;
		}
	}
	return nodesArray;
}

function getScrollSize(){
	var div = document.createElement("div");
	div.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;";

	document.body.appendChild(div);
	var width = div.offsetWidth-div.clientWidth;
	document.body.removeChild(div);

	return width;
}

function getClassName(node){
	if(!node) return "";

	var className = node.className || "";
	if(className.baseVal)//'className' exist but not a string - IE svg element in DOM
		className = className.baseVal;

	if(!className.indexOf)
		className = "";

	return _trimString(className);
}

function addClassName(node, className){
	if (className && node.className.indexOf(className) === -1) {
		node.className += " " + className;
	}
}

function removeClassName(node, name) {
	name = name.split(" ");
	for (var i = 0; i < name.length; i++) {
		var regEx = new RegExp("\\s?\\b" + name[i] + "\\b(?![-_.])", "");
		node.className = node.className.replace(regEx, "");
	}
}

function hasClass(element, className){
	if ('classList' in element) {
		return element.classList.contains(className);
	} else { 
		return new RegExp("\\b" + className + "\\b").test(element.className);
	}
}

function toNode(node) {
	if (typeof node === "string") {
		return (document.getElementById(node) || document.querySelector(node) || document.body);
	}
	return node || document.body;
}

var _slave = document.createElement("div");
function insert(node, newone) {
	_slave.innerHTML = newone;
	var child = _slave.firstChild;
	node.appendChild(child);
	return child;
}

function remove(node) {
	if (node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function getChildren(node, css) {
	var ch = node.childNodes;
	var len = ch.length;
	var out = [];
	for (var i = 0; i < len; i++) {
		var obj = ch[i];
		if (obj.className && obj.className.indexOf(css) !== -1) {
			out.push(obj);
		}
	}
	return out;
}

function getTargetNode(e){
	var trg;
	if (e.tagName)
		trg = e;
	else {
		e=e||window.event;
		trg=e.target||e.srcElement;
	}
	return trg;
}

function locateAttribute(e, attribute) {
	if(!attribute) return;

	var trg = getTargetNode(e);

	while (trg){
		if (trg.getAttribute){	//text nodes has not getAttribute
			var test = trg.getAttribute(attribute);
			if (test) return trg;
		}
		trg=trg.parentNode;
	}
	return null;
}

function _trimString(str){
	var func = String.prototype.trim || function(){ return this.replace(/^\s+|\s+$/g, ""); };
	return func.apply(str);
}

function locateClassName(e, classname, strict){
	var trg = getTargetNode(e);
	var css = "";

	if(strict === undefined)
		strict = true;

	while (trg){
		css = getClassName(trg);
		if(css){
			var ind = css.indexOf(classname);
			if (ind >= 0){
				if (!strict)
					return trg;

				//check that we have exact match
				var left = (ind === 0) || (!_trimString(css.charAt(ind - 1)));
				var right = ((ind + classname.length >= css.length)) || (!_trimString(css.charAt(ind + classname.length)));

				if (left && right)
					return trg;
			}
		}
		trg=trg.parentNode;
	}
	return null;
}

/*
event position relatively to DOM element
 */
function getRelativeEventPosition(ev, node){
	var d = document.documentElement;
	var box = elementPosition(node);

	return {
		x: ev.clientX + d.scrollLeft - d.clientLeft - box.x + node.scrollLeft,
		y: ev.clientY + d.scrollTop - d.clientTop - box.y + node.scrollTop
	};
}

function isChildOf(child, parent){
	if(!child || !parent){
		return false;
	}

	while(child && child != parent) {
		child = child.parentNode;
	}

	return child === parent;
}

function closest(element, selector){
	if(element.closest){
		return element.closest(selector);
	}else if(element.matches || element.msMatchesSelector || element.webkitMatchesSelector){
		var el = element;
		if (!document.documentElement.contains(el)) return null;
		do {
			var method = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;

			if (method.call(el, selector)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	}else{
		// eslint-disable-next-line no-console
		console.error("Your browser is not supported");
		return null;
	}
}

module.exports = {
	getNodePosition: elementPosition,
	getFocusableNodes: getFocusableNodes,
	getScrollSize: getScrollSize,
	getClassName: getClassName,
	addClassName: addClassName,
	removeClassName: removeClassName,
	insertNode: insert,
	removeNode: remove,
	getChildNodes: getChildren,
	toNode: toNode,
	locateClassName:locateClassName,
	locateAttribute: locateAttribute,
	getTargetNode: getTargetNode,
	getRelativeEventPosition: getRelativeEventPosition,
	isChildOf: isChildOf,
	hasClass: hasClass,
	closest: closest
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

/***/ }),

/***/ "./sources/utils/utils.js":
/*!********************************!*\
  !*** ./sources/utils/utils.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var helpers = __webpack_require__(/*! ./helpers */ "./sources/utils/helpers.js");

function copy(object) {
	var i, result; // iterator, types array, result

	if (object && typeof object == "object") {

		switch (true){
			case (helpers.isDate(object)):
				result = new Date(object);
				break;
			case (helpers.isArray(object)):
				result = new Array(object.length);
				for(i = 0; i < object.length; i++){
					result[i] = copy(object[i]);
				}
				break;
			case (helpers.isStringObject(object)):
				result = new String(object);
				break;
			case (helpers.isNumberObject(object)):
				result = new Number(object);
				break;
			case (helpers.isBooleanObject(object)):
				result = new Boolean(object);
				break;
			default:
				result = {};
				for (i in object) {
					if (Object.prototype.hasOwnProperty.apply(object, [i]))
						result[i] = copy(object[i]);
				}
			break;
		}
	}
	return result || object;
}

function mixin (target, source, force){
	for (var f in source)
		if (((target[f] === undefined) || force)) target[f]=source[f];
	return target;
}

function defined(obj) {
	return typeof(obj) != "undefined";
}

var seed;
function uid() {
	if (!seed)
		seed = (new Date()).valueOf();

	seed++;
	return seed;
}

//creates function with specified "this" pointer
function bind(functor, object){
	if(functor.bind)
		return functor.bind(object);
	else
		return function(){ return functor.apply(object,arguments); };
}

function event(el, event, handler, capture){
	if (el.addEventListener)
		el.addEventListener(event, handler, capture === undefined ? false : capture);

	else if (el.attachEvent)
		el.attachEvent("on"+event, handler);
}

function eventRemove(el, event, handler, capture){
	if (el.removeEventListener)
		el.removeEventListener(event, handler, capture === undefined ? false : capture);

	else if (el.detachEvent)
		el.detachEvent("on"+event, handler);
}

module.exports = {
	copy: copy,
	defined: defined,
	mixin: mixin,
	uid: uid,
	bind: bind,
	event: event,
	eventRemove: eventRemove
};

/***/ })

/******/ });
});