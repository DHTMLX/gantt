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
		define("ext/dhtmlxgantt_fullscreen", [], factory);
	else if(typeof exports === 'object')
		exports["ext/dhtmlxgantt_fullscreen"] = factory();
	else
		root["ext/dhtmlxgantt_fullscreen"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/fullscreen/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/fullscreen/index.ts":
/*!*****************************************!*\
  !*** ./sources/ext/fullscreen/index.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function isExpanded() {
    var element = (document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement);
    return !!(element && element === document.body);
}
function isFullscreenAvailable() {
    return document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled;
}
var state = gantt.$services.getService("state");
state.registerProvider("fullscreen", function () {
    return { fullscreen: isExpanded() };
});
var backupBodyPadding = {
    overflow: null,
    padding: null,
    paddingTop: null,
    paddingRight: null,
    paddingBottom: null,
    paddingLeft: null
};
var backupElementSizes = {
    width: null,
    height: null,
    top: null,
    left: null,
    position: null,
    zIndex: null,
    modified: false
};
var backupPositioning = null;
function resetParentPositioning(root) {
    var parent = root.parentNode;
    var positions = [];
    while (parent && parent.style) {
        positions.push({
            element: parent,
            originalPositioning: parent.style.position
        });
        parent.style.position = "static";
        parent = parent.parentNode;
    }
    return positions;
}
function restoreParentPositioning(positions) {
    positions.forEach(function (record) {
        record.element.style.position = record.originalPositioning;
    });
}
// expand gantt root element to fullscreen automatically
function setFullScreenSizes() {
    var root = gantt.ext.fullscreen.getFullscreenElement();
    var body = document.body;
    updateSizes(root.style, backupElementSizes);
    backupBodyPadding = {
        overflow: body.style.overflow,
        padding: body.style.padding ? body.style.padding : null,
        paddingTop: body.style.paddingTop ? body.style.paddingTop : null,
        paddingRight: body.style.paddingRight ? body.style.paddingRight : null,
        paddingBottom: body.style.paddingBottom ? body.style.paddingBottom : null,
        paddingLeft: body.style.paddingLeft ? body.style.paddingLeft : null
    };
    if (body.style.padding) {
        body.style.padding = "0";
    }
    if (body.style.paddingTop) {
        body.style.paddingTop = "0";
    }
    if (body.style.paddingRight) {
        body.style.paddingRight = "0";
    }
    if (body.style.paddingBottom) {
        body.style.paddingBottom = "0";
    }
    if (body.style.paddingLeft) {
        body.style.paddingLeft = "0";
    }
    body.style.overflow = "hidden";
    root.style.width = "100vw";
    root.style.height = "100vh";
    root.style.top = "0px";
    root.style.left = "0px";
    root.style.position = "absolute";
    root.style.zIndex = 1;
    backupElementSizes.modified = true;
    backupPositioning = resetParentPositioning(root);
}
function restoreSizes() {
    var root = gantt.ext.fullscreen.getFullscreenElement();
    var body = document.body;
    if (backupElementSizes.modified) {
        if (backupBodyPadding.padding) {
            body.style.padding = backupBodyPadding.padding;
        }
        if (backupBodyPadding.paddingTop) {
            body.style.paddingTop = backupBodyPadding.paddingTop;
        }
        if (backupBodyPadding.paddingRight) {
            body.style.paddingRight = backupBodyPadding.paddingRight;
        }
        if (backupBodyPadding.paddingBottom) {
            body.style.paddingBottom = backupBodyPadding.paddingBottom;
        }
        if (backupBodyPadding.paddingLeft) {
            body.style.paddingLeft = backupBodyPadding.paddingLeft;
        }
        body.style.overflow = backupBodyPadding.overflow;
        backupBodyPadding = {
            overflow: null,
            padding: null,
            paddingTop: null,
            paddingRight: null,
            paddingBottom: null,
            paddingLeft: null
        };
        updateSizes(backupElementSizes, root.style);
        backupElementSizes.modified = false;
    }
    restoreParentPositioning(backupPositioning);
    backupPositioning = null;
}
function updateSizes(source, target) {
    target.width = source.width;
    target.height = source.height;
    target.top = source.top;
    target.left = source.left;
    target.position = source.position;
    target.zIndex = source.zIndex;
}
function addDOMEvents() {
    gantt.event(document, "webkitfullscreenchange", onFullScreenChange);
    gantt.event(document, "mozfullscreenchange", onFullScreenChange);
    gantt.event(document, "MSFullscreenChange", onFullScreenChange);
    // For IE on Win 10
    gantt.event(document, "fullscreenChange", onFullScreenChange);
    gantt.event(document, "fullscreenchange", onFullScreenChange);
}
var expandGantt = false;
function onFullScreenChange() {
    if (!gantt.$container) {
        // do nothing if gantt is not yet initialized
        return;
    }
    var event;
    var isBodyExpanded = isExpanded();
    if (isBodyExpanded) {
        if (expandGantt) {
            event = "onExpand";
            setFullScreenSizes();
        }
    }
    else if (expandGantt) {
        expandGantt = false;
        event = "onCollapse";
        restoreSizes();
    }
    setTimeout(function () {
        gantt.render();
    });
    setTimeout(function () {
        gantt.callEvent(event, [gantt.ext.fullscreen.getFullscreenElement()]);
    });
}
function cantFullscreen() {
    if (!gantt.$container) { // check is gantt initialized or not
        return true;
    }
    if (!gantt.ext.fullscreen.getFullscreenElement()) {
        return true;
    }
    if (!isFullscreenAvailable()) {
        // tslint:disable-next-line: no-console
        var method = console.warning || console.log;
        method("The `fullscreen` feature not being allowed, or full-screen mode not being supported");
        return true;
    }
    return false;
}
gantt.ext.fullscreen = {
    expand: function () {
        if (cantFullscreen()) {
            return;
        }
        if (isExpanded()) {
            return;
        }
        if (!gantt.callEvent("onBeforeExpand", [this.getFullscreenElement()])) {
            return;
        }
        expandGantt = true;
        // we switch body to fullscreen and then expand fullscreen element to viewport
        // we do it to correct display common elements: lightboxes, tooltip etc.
        var element = document.body;
        var requestArguments = element.webkitRequestFullscreen ?
            [Element.ALLOW_KEYBOARD_INPUT] : [];
        var requestFullscreen = element.msRequestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen ||
            element.requestFullscreen;
        if (requestFullscreen) {
            requestFullscreen.apply(element, requestArguments);
        }
    },
    collapse: function () {
        if (cantFullscreen()) {
            return;
        }
        if (!isExpanded()) {
            return;
        }
        if (!gantt.callEvent("onBeforeCollapse", [this.getFullscreenElement()])) {
            return;
        }
        var requestExitFullscreen = document.msExitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen ||
            document.exitFullscreen;
        if (requestExitFullscreen) {
            requestExitFullscreen.apply(document);
        }
    },
    toggle: function () {
        if (cantFullscreen()) {
            return;
        }
        if (!isExpanded()) {
            this.expand();
        }
        else {
            this.collapse();
        }
    },
    getFullscreenElement: function () {
        return gantt.$root;
    },
};
gantt.expand = function () {
    gantt.ext.fullscreen.expand();
};
gantt.collapse = function () {
    gantt.ext.fullscreen.collapse();
};
gantt.attachEvent("onGanttReady", addDOMEvents);


/***/ })

/******/ });
});