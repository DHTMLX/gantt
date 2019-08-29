/*
@license

dhtmlxGantt v.6.2.3 Standard

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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/locale/locale_es.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/locale/locale_es.js":
/*!*************************************!*\
  !*** ./sources/locale/locale_es.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 @Autor Manuel Fernandez Panzuela - www.mfernandez.es

 Update 30/10/2015:
 Translation of new labels by Jorge Macias
 https://disqus.com/by/disqus_bTuZk1voC7/
 */
gantt.locale = {
	date: {
		month_full: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		month_short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		day_full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
		day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
	},
	labels: {
		new_task: "Nueva tarea",
		dhx_cal_today_button: "Hoy",
		day_tab: "Día",
		week_tab: "Semana",
		month_tab: "Mes",
		new_event: "Nuevo evento",
		icon_save: "Guardar",
		icon_cancel: "Cancelar",
		icon_details: "Detalles",
		icon_edit: "Editar",
		icon_delete: "Eliminar",
		confirm_closing: "", //"Sus cambios se perderán, continuar ?"
		confirm_deleting: "El evento se borrará definitivamente, ¿continuar?",
		section_description: "Descripción",
		section_time: "Período",
		section_type: "Tipo",
		/* grid columns */

		column_wbs: "EDT",
		column_text: "Tarea",
		column_start_date: "Inicio",
		column_duration: "Duración",
		column_add: "",

		/* link confirmation */
		link: "Enlace",
		confirm_link_deleting: "será borrada",
		link_start: " (inicio)",
		link_end: " (fin)",

		type_task: "Tarea",
		type_project: "Proyecto",
		type_milestone: "Hito",


		minutes: "Minutos",
		hours: "Horas",
		days: "Días",
		weeks: "Semanas",
		months: "Meses",
		years: "Años",

		/* message popup */
		message_ok: "OK",
		message_cancel: "Cancelar",

		/* constraints */
		section_constraint: "Constraint",
		constraint_type: "Constraint type",
		constraint_date: "Constraint date",
		asap: "As Soon As Possible",
		alap: "As Late As Possible",
		snet: "Start No Earlier Than",
		snlt: "Start No Later Than",
		fnet: "Finish No Earlier Than",
		fnlt: "Finish No Later Than",
		mso: "Must Start On",
		mfo: "Must Finish On",

		/* resource control */
		resources_filter_placeholder: "type to filter",
		resources_filter_label: "hide empty"
	}
};


/***/ })

/******/ });
});