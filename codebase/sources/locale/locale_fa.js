/*
@license

dhtmlxGantt v.5.2.0 Standard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.

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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/locale/locale_fa.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/locale/locale_fa.js":
/*!*************************************!*\
  !*** ./sources/locale/locale_fa.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
 dhtmlxGantt Persian (Farsi, fa_IR) locale by Mohammad Shokri http://slashsbin.com/
 */
/*jshint -W100*/
gantt.locale = {
	date:{
		month_full:[
			"ژانویه",
			"فوریه",
			"مارس",
			"آوریل",
			"مه",
			"ژوئن",
			"ژوئیه",
			"اوت",
			"سپتامبر",
			"اکتبر",
			"نوامبر",
			"دسامبر"
		],
		month_short:[ "1","2","3","4","5","6","7","8","9","10","11","12" ],
		day_full:[
			"يکشنبه",
			"دوشنبه",
			"سه‌شنبه",
			"چهارشنبه",
			"پنجشنبه",
			"جمعه",
			"شنبه"
		],
		day_short:[
			"ی",
			"د",
			"س",
			"چ",
			"پ",
			"ج",
			"ش"
		]
	},
	labels:{
		new_task:"وظیفه جدید",
		new_event: "رویداد جدید",
		icon_save:"ذخیره",
		icon_cancel:"لغو",
		icon_details:"جزییات",
		icon_edit:"ویرایش",
		icon_delete:"حذف",
		confirm_closing:"تغییرات شما ازدست خواهد رفت، آیا مطمئن هستید؟",
		confirm_deleting:"این مورد برای همیشه حذف خواهد شد، آیا مطمئن هستید؟",
		section_description:"توضیحات",
		section_time:"مدت زمان",
		section_type:"نوع",

		/* grid columns */

		column_wbs : "WBS",
		column_text : "عنوان",
		column_start_date : "زمان شروع",
		column_duration : "مدت",
		column_add : "",

		/* link confirmation */
		link: "ارتباط",
		confirm_link_deleting:"حذف خواهد شد",
		link_start: " (آغاز)",
		link_end: " (پایان)",

		type_task: "وظیفه",
		type_project: "پروژه",
		type_milestone: "نگارش",

		minutes: "دقایق",
		hours: "ساعات",
		days: "روزها",
		weeks: "هفته",
		months: "ماه‌ها",
		years: "سال‌ها",

		/* message popup */
		message_ok: "تایید",
		message_cancel: "لغو"

	}
};



/***/ })

/******/ });