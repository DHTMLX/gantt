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
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ({

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);


/***/ }),

/***/ 18:
/***/ (function(module, exports) {


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

gantt.attachEvent("onGanttReady", function(){
	var markerArea = document.createElement("div");
	markerArea.className = "gantt_marker_area";
	gantt.$task_data.appendChild(markerArea);
	gantt.$marker_area = markerArea;

	var layers = gantt.$services.getService("layers");
	var markerRenderer = layers.createDataRender({
		name: "marker",
		defaultContainer: function(){ return gantt.$marker_area;}
	});
	markerRenderer.addLayer(render_marker);

	function render_marker(marker){
		if(!gantt.config.show_markers)
			return false;

		if(!marker.start_date)
			return false;

		var state = gantt.getState();
		if(+marker.start_date > +state.max_date)
			return;
		if(+marker.end_date && +marker.end_date < +state.min_date || +marker.start_date < +state.min_date)
			return;

		var div = document.createElement("div");

		div.setAttribute("marker_id", marker.id);

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


/***/ })

/******/ });