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
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ({

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(29);


/***/ }),

/***/ 29:
/***/ (function(module, exports) {

/*
  Translation by Davor
 http://docs.dhtmlx.com/gantt/desktop__localization.html#comment-2569116291
 */

gantt.locale = {
	date: {
		month_full: ["Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj", "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac"],
		month_short: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
		day_full: ["Nedjelja", "Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Petak", "Subota"],
		day_short: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"]
	},
	labels: {
		new_task: "Novi Zadatak",
		new_event: "Novi događaj",
		icon_save: "Spremi",
		icon_cancel: "Odustani",
		icon_details: "Detalji",
		icon_edit: "Izmjeni",
		icon_delete: "Obriši",
		confirm_closing: "",
		confirm_deleting: "Zadatak će biti trajno izbrisan, jeste li sigurni?",
		section_description: "Opis",
		section_time: "Vremenski Period",
		section_type: "Tip",

		/* grid columns */
		column_wbs: "WBS",
		column_text: "Naziv Zadatka",
		column_start_date: "Početno Vrijeme",
		column_duration: "Trajanje",
		column_add: "",

		/* link confirmation */
		link: "Poveznica",
		confirm_link_deleting: "će biti izbrisan",
		link_start: " (početak)",
		link_end: " (kraj)",

		type_task: "Zadatak",
		type_project: "Projekt",
		type_milestone: "Milestone",

		minutes: "Minute",
		hours: "Sati",
		days: "Dani",
		weeks: "Tjedni",
		months: "Mjeseci",
		years: "Godine",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Odustani"
	}
};

/***/ })

/******/ });