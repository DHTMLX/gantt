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
/******/ 	return __webpack_require__(__webpack_require__.s = 58);
/******/ })
/************************************************************************/
/******/ ({

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(59);


/***/ }),

/***/ 59:
/***/ (function(module, exports) {

/*
	Translation by Peter Eriksson
 */
gantt.locale = {
	date: {
		month_full: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
		month_short: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		day_full: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
		day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"]
	},
	labels: {
		new_task: "Ny uppgift",
		dhx_cal_today_button: "Idag",
		day_tab: "Dag",
		week_tab: "Vecka",
		month_tab: "Månad",
		new_event: "Ny händelse",
		icon_save: "Spara",
		icon_cancel: "Avbryt",
		icon_details: "Detajer",
		icon_edit: "Ändra",
		icon_delete: "Ta bort",
		confirm_closing: "",
		confirm_deleting: "Är du säker på att du vill ta bort händelsen permanent?",
		section_description: "Beskrivning",
		section_time: "Tid",
		section_type: "Typ",

		/* grid columns */

		column_wbs : "WBS",
		column_text: "Uppgiftsnamn",
		column_start_date: "Starttid",
		column_duration: "Varaktighet",
		column_add: "",

		/* link confirmation */

		link: "Länk",
		confirm_link_deleting: "kommer tas bort",
		link_start: " (start)",
		link_end: " (slut)",
		type_task: "Uppgift",
		type_project: "Projekt",
		type_milestone: "Milstolpe",

		minutes: "Minuter",
		hours: "Timmar",
		days: "Dagar",
		weeks: "Veckor",
		months: "Månader",
		years: "År",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Avbryt"
	}
};

/***/ })

/******/ });