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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/marker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/marker.js":
/*!*******************************!*\
  !*** ./sources/ext/marker.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {


(function(){

if(!gantt._markers) {
	gantt._markers = gantt.createDatastore({
		name: "marker",
		initItem: function (marker) {
			marker.id = marker.id || gantt.uid();
			return marker;
		}
	});
}

gantt.config.show_markers = true;

function render_marker(marker){
	if(!gantt.config.show_markers)
		return false;

	if(!marker.start_date)
		return false;

	var state = gantt.getState();
	if(+marker.start_date > +state.max_date)
		return;
	if((!marker.end_date || +marker.end_date < +state.min_date) && +marker.start_date < +state.min_date)
		return;

	var div = document.createElement("div");

	div.setAttribute("data-marker-id", marker.id);

	var css = "gantt_marker";
	if(gantt.templates.marker_class)
		css += " " + gantt.templates.marker_class(marker);

	if(marker.css){
		css += " " + marker.css;
	}

	if(marker.title){
		div.title = marker.title;
	}
	div.className = css;

	var start = gantt.posFromDate(marker.start_date);
	div.style.left = start + "px";
	div.style.height = Math.max(gantt.getRowTop(gantt.getVisibleTaskCount()), 0) + "px";
	if(marker.end_date){
		var end = gantt.posFromDate(marker.end_date);
		div.style.width = Math.max((end - start), 0) + "px";

	}

	if(marker.text){
		div.innerHTML = "<div class='gantt_marker_content' >" + marker.text + "</div>";
	}

	return div;
}

function initMarkerArea(){
	if(!gantt.$task_data)
		return;

	var markerArea = document.createElement("div");
	markerArea.className = "gantt_marker_area";
	gantt.$task_data.appendChild(markerArea);
	gantt.$marker_area = markerArea;
}

gantt.attachEvent("onBeforeGanttRender", function(){
	if(!gantt.$marker_area)
		initMarkerArea();
});

gantt.attachEvent("onDataRender", function(){
	if(!gantt.$marker_area){
		initMarkerArea();
		gantt.renderMarkers();
	}
});

gantt.attachEvent("onGanttReady", function(){
	initMarkerArea();

	var layers = gantt.$services.getService("layers");
	var markerRenderer = layers.createDataRender({
		name: "marker",
		defaultContainer: function(){ return gantt.$marker_area;}
	});
	markerRenderer.addLayer(render_marker);
});

gantt.getMarker = function(id){
	if(!this._markers) return null;

	return this._markers.getItem(id);
};

gantt.addMarker = function(marker){
	return this._markers.addItem(marker);
};

gantt.deleteMarker = function(id){
	if(!this._markers.exists(id))
		return false;

	this._markers.removeItem(id);
	return true;
};
gantt.updateMarker = function(id){
	this._markers.refresh(id);
};

gantt._getMarkers = function(){
	return this._markers.getItems();
};

gantt.renderMarkers = function () {
	this._markers.refresh();
};

})();

/***/ })

/******/ });
});