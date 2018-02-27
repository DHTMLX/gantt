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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(15);


/***/ }),

/***/ 15:
/***/ (function(module, exports) {

gantt.locale = {
	date: {
		month_full: [" Januar", " Februar", " März ", " April", " Mai", " Juni", " Juli", " August", " September ", " Oktober", " November ", " Dezember"],
		month_short: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
		day_full: [ "Sonntag", "Montag", "Dienstag", " Mittwoch", " Donnerstag", "Freitag", "Samstag"],
		day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
	},
	labels: {
		new_task: "Neue Aufgabe",
		dhx_cal_today_button: "Heute",
		day_tab: "Tag",
		week_tab: "Woche",
		month_tab: "Monat",
		new_event: "Neuer eintrag",
		icon_save: "Speichern",
		icon_cancel: "Abbrechen",
		icon_details: "Details",
		icon_edit: "Ändern",
		icon_delete: "Löschen",
		confirm_closing: "", //"Ihre Veränderungen werden verloren sein, wollen Sie ergänzen? "
		confirm_deleting: "Der Eintrag wird gelöscht",
		section_description: "Beschreibung",
		section_time: "Zeitspanne",
		section_type:"Type",
		/* grid columns */

		column_wbs : "PSP",
		column_text : "Task-Namen",
		column_start_date : "Startzeit",
		column_duration : "Dauer",
		column_add : "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting:"werden gelöscht",
		link_start: "(starten)",
		link_end: "(ende)",

		type_task: "Task",
		type_project: "Project",
		type_milestone: "Milestone",


		minutes: "Minuten",
		hours: "Stunden",
		days: "Tage",
		weeks: "Wochen",
		months: "Monate",
		years: "Jahre",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Abbrechen"
	}
};



/***/ })

/******/ });