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
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ({

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(35);


/***/ }),

/***/ 35:
/***/ (function(module, exports) {

/*
 Update 29/12/2015:
 New labels translation by ARCANGELI CLAUDIO

 */

gantt.locale = {
	date: {
		month_full: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
		month_short: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
		day_full: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
		day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"]
	},
	labels: {
		new_task: "Nuovo compito",
		dhx_cal_today_button: "Oggi",
		day_tab: "Giorno",
		week_tab: "Settimana",
		month_tab: "Mese",
		new_event: "Nuovo evento",
		icon_save: "Salva",
		icon_cancel: "Chiudi",
		icon_details: "Dettagli",
		icon_edit: "Modifica",
		icon_delete: "Elimina",
		confirm_closing: "",//"Sei sicuro di confermare la chiusura?",
		confirm_deleting: "Sei sicuro di confermare l'eliminazione?",
		section_description: "Descrizione",
		section_time: "Periodo di tempo",
		section_type: "Tipo",
		/* grid columns */

		column_wbs : "WBS",
		column_text: "Nome Attività",
		column_start_date: "Inizio",
		column_duration: "Durata",
		column_add: "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting: "sarà eliminato",
		link_start: " (inizio)",
		link_end: " (fine)",

		type_task: "Task",
		type_project: "Project",
		type_milestone: "Milestone",


		minutes: "Minuti",
		hours: "Ore",
		days: "Giorni",
		weeks: "Settimane",
		months: "Mesi",
		years: "Anni",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Chiudi"
	}
};

/***/ })

/******/ });