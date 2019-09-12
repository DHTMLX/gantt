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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/csp.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/csp.js":
/*!****************************!*\
  !*** ./sources/ext/csp.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 Compatibility with Content Security Policy
 https://github.com/denys86/gantt/commit/f64f62f14086a8ec33d5667cfc5dc3a7e775fd2a

 Removes evil JS. Inline styles are still used for rendering, may need to allow them or redefine unsafe methods
 style-src 'unsafe-inline'

*/

gantt.date.date_to_str = function(format,utc){
	return function(date) {
		return format.replace(/%[a-zA-Z]/g, function (a) {
			switch (a) {
				case "%d": return utc ? gantt.date.to_fixed(date.getUTCDate()) : gantt.date.to_fixed(date.getDate());
				case "%m": return utc ? gantt.date.to_fixed((date.getUTCMonth() + 1)) : gantt.date.to_fixed((date.getMonth() + 1));
				case "%j": return utc ? date.getUTCDate() : date.getDate();
				case "%n": return utc ? (date.getUTCMonth() + 1) : (date.getMonth() + 1);
				case "%y": return utc ? gantt.date.to_fixed(date.getUTCFullYear() % 100) : gantt.date.to_fixed(date.getFullYear() % 100);
				case "%Y": return utc ? date.getUTCFullYear() : date.getFullYear();
				case "%D": return utc ? gantt.locale.date.day_short[date.getUTCDay()] : gantt.locale.date.day_short[date.getDay()];
				case "%l": return utc ? gantt.locale.date.day_full[date.getUTCDay()] : gantt.locale.date.day_full[date.getDay()];
				case "%M": return utc ? gantt.locale.date.month_short[date.getUTCMonth()] : gantt.locale.date.month_short[date.getMonth()];
				case "%F": return utc ? gantt.locale.date.month_full[date.getUTCMonth()] : gantt.locale.date.month_full[date.getMonth()];
				case "%h": return utc ? gantt.date.to_fixed((date.getUTCHours() + 11) % 12 + 1) : gantt.date.to_fixed((date.getHours() + 11) % 12 + 1);
				case "%g": return utc ? ((date.getUTCHours() + 11) % 12 + 1) : ((date.getHours() + 11) % 12 + 1);
				case "%G": return utc ? date.getUTCHours() : date.getHours();
				case "%H": return utc ? gantt.date.to_fixed(date.getUTCHours()) : gantt.date.to_fixed(date.getHours());
				case "%i": return utc ? gantt.date.to_fixed(date.getUTCMinutes()) : gantt.date.to_fixed(date.getMinutes());
				case "%a": return utc ? (date.getUTCHours() > 11 ? "pm" : "am") : (date.getHours() > 11 ? "pm" : "am");
				case "%A": return utc ? (date.getUTCHours() > 11 ? "PM" : "AM") : (date.getHours() > 11 ? "PM" : "AM");
				case "%s": return utc ? gantt.date.to_fixed(date.getUTCSeconds()) : gantt.date.to_fixed(date.getSeconds());
				case "%W": return utc ? gantt.date.to_fixed(gantt.date.getUTCISOWeek(date)) : gantt.date.to_fixed(gantt.date.getISOWeek(date));
				default: return a;
			}
		});
	};
};
gantt.date.str_to_date = function(format,utc){
	return function(date) {
		var set = [0, 0, 1, 0, 0, 0];
		var temp = date.match(/[a-zA-Z]+|[0-9]+/g);
		var mask = format.match(/%[a-zA-Z]/g);

		for (var i = 0; i < mask.length; i++) {
			switch (mask[i]) {
				case "%j":
				case "%d":
					set[2] = temp[i] || 1;
					break;
				case "%n":
				case "%m":
					set[1] = (temp[i] || 1) - 1;
					break;
				case "%y":
					set[0] = temp[i] * 1 + (temp[i] > 50 ? 1900 : 2000);
					break;
				case "%g":
				case "%G":
				case "%h":
				case "%H":
					set[3] = temp[i] || 0;
					break;
				case "%i":
					set[4] = temp[i] || 0;
					break;
				case "%Y":
					set[0] = temp[i] || 0;
					break;
				case "%a":
				case "%A":
					set[3] = set[3] % 12 + ((temp[i] || '').toLowerCase() == 'am' ? 0 : 12);
					break;
				case "%s":
					set[5] = temp[i] || 0;
					break;
				case "%M":
					set[1] = gantt.locale.date.month_short_hash[temp[i]] || 0;
					break;
				case "%F":
					set[1] = gantt.locale.date.month_full_hash[temp[i]] || 0;
					break;
				default:
					break;
			}
		}

		if (utc) {
			return new Date(Date.UTC(set[0], set[1], set[2], set[3], set[4], set[5]));
		}

		return new Date(set[0], set[1], set[2], set[3], set[4], set[5]);
	};
};

// custom DOM attributes may be stripped in some environemnts, make sure data attributes used instead
gantt.config.task_attribute = "data-task-id";
gantt.config.link_attribute = "data-link-id";
gantt.config.grid_resizer_column_attribute = "data-column-index";
gantt.config.grid_resizer_attribute = "data-grid-resizer";

/***/ })

/******/ });
});