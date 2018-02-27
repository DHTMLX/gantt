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
/******/ 	return __webpack_require__(__webpack_require__.s = 46);
/******/ })
/************************************************************************/
/******/ ({

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(47);


/***/ }),

/***/ 47:
/***/ (function(module, exports) {

gantt.locale = {
	date: {
		month_full: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
		month_short: ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"],
		day_full: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
		day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"]
	},
	labels: {
		new_task: "Nowe zadanie",
		dhx_cal_today_button: "Dziś",
		day_tab: "Dzień",
		week_tab: "Tydzień",
		month_tab: "Miesiąc",
		new_event: "Nowe zdarzenie",
		icon_save: "Zapisz",
		icon_cancel: "Anuluj",
		icon_details: "Szczegóły",
		icon_edit: "Edytuj",
		icon_delete: "Usuń",
		confirm_closing: "", //Zmiany zostaną usunięte, jesteś pewien?
		confirm_deleting: "Zdarzenie zostanie usunięte na zawsze, kontynuować?",
		section_description: "Opis",
		section_time: "Okres czasu",
		section_type: "Typ",
		/* grid columns */

		column_wbs : "WBS",
		column_text : "Nazwa zadania",
		column_start_date : "Początek",
		column_duration : "Czas trwania",
		column_add : "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting:"zostanie usunięty",
		link_start: " (początek)",
		link_end: " (koniec)",

		type_task: "Zadanie",
		type_project: "Projekt",
		type_milestone: "Milestone",


		minutes: "Minuty",
		hours: "Godziny",
		days: "Dni",
		weeks: "Tydzień",
		months: "Miesiące",
		years: "Lata",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Anuluj"
	}
};



/***/ })

/******/ });