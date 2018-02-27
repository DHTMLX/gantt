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
/******/ 	return __webpack_require__(__webpack_require__.s = 42);
/******/ })
/************************************************************************/
/******/ ({

/***/ 42:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);


/***/ }),

/***/ 43:
/***/ (function(module, exports) {

gantt.locale = {
	date: {
		month_full: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
		month_short: ["Jan", "Feb", "mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
		day_full: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
		day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"]
	},
	labels: {
		new_task: "Nieuwe taak",
		dhx_cal_today_button: "Vandaag",
		day_tab: "Dag",
		week_tab: "Week",
		month_tab: "Maand",
		new_event: "Nieuw item",
		icon_save: "Opslaan",
		icon_cancel: "Annuleren",
		icon_details: "Details",
		icon_edit: "Bewerken",
		icon_delete: "Verwijderen",
		confirm_closing: "", //Your changes will be lost, are your sure ?
		confirm_deleting: "Item zal permanent worden verwijderd, doorgaan?",
		section_description: "Beschrijving",
		section_time: "Tijd periode",
		section_type:"Type",
		/* grid columns */

		column_wbs : "WBS",
		column_text : "Taak omschrijving",
		column_start_date : "Startdatum",
		column_duration : "Duur",
		column_add : "",

		/* link confirmation */
		link: "Koppeling",
		confirm_link_deleting:"zal worden verwijderd",
		link_start: " (start)",
		link_end: " (eind)",

		type_task: "Task",
		type_project: "Project",
		type_milestone: "Milestone",


		minutes: "minuten",
		hours: "uren",
		days: "dagen",
		weeks: "weken",
		months: "maanden",
		years: "jaren",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Annuleren"
	}
};



/***/ })

/******/ });