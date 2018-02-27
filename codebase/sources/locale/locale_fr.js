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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ({

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(25);


/***/ }),

/***/ 25:
/***/ (function(module, exports) {

gantt.locale = {
	date: {
		month_full: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
		month_short: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
		day_full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
		day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
	},
	labels:{
		new_task:"Nouvelle tâche",
		new_event: "Nouvel évènement",
		icon_save:"Enregistrer",
		icon_cancel:"Annuler",
		icon_details:"Détails",
		icon_edit:"Modifier",
		icon_delete:"Effacer",
		confirm_closing:"",//Vos modifications seront perdus, êtes-vous sûr ?
		confirm_deleting:"L'événement sera effacé sans appel, êtes-vous sûr ?",

		section_description:"Description",
		section_time:"Période",
		section_type:"Type",

		/* grid columns */

		column_wbs : "OTP",
		column_text : "Nom de la tâche",
		column_start_date : "Date initiale",
		column_duration : "Durée",
		column_add : "",


		/* link confirmation */
		link: "Le lien",
		confirm_link_deleting:"sera supprimé",
		link_start: "(début)",
		link_end: "(fin)",

		type_task: "Task",
		type_project: "Project",
		type_milestone: "Milestone",


		minutes: "Minutes",
		hours: "Heures",
		days: "Jours",
		weeks: "Semaines",
		months: "Mois",
		years: "Années",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Annuler"
	}
};


/***/ })

/******/ });