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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/quick_info.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/quick_info.js":
/*!***********************************!*\
  !*** ./sources/ext/quick_info.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

gantt.config.quickinfo_buttons = ["icon_delete","icon_edit"];
gantt.config.quick_info_detached = true;
gantt.config.show_quick_info = true;

gantt.attachEvent("onTaskClick", function(id){
	setTimeout(function() {
		gantt.showQuickInfo(id);
	}, 0);
	
	return true;
});

(function(){
	var events = ["onEmptyClick", "onViewChange", "onLightbox", "onBeforeTaskDelete", "onBeforeDrag"];
	var hiding_function = function(){
		gantt._hideQuickInfo();
		return true;
	};
	for (var i=0; i<events.length; i++)
		gantt.attachEvent(events[i], hiding_function);
})();

gantt.templates.quick_info_title = function(start, end, ev){ return ev.text.substr(0,50); };
gantt.templates.quick_info_content = function(start, end, ev){ return ev.details || ev.text; };
gantt.templates.quick_info_date = function(start, end, ev){
		return gantt.templates.task_time(start, end, ev);
};
gantt.templates.quick_info_class = function(start, end, task){ return ""; };

gantt.showQuickInfo = function(id){
	if (id == this._quick_info_box_id || !this.config.show_quick_info) return;
	this.hideQuickInfo(true);
	var offset = 6; // offset TASK <> QI-BOX in 'px'

	var pos = this._get_event_counter_part(id, offset);
	
	if (pos){
		this._quick_info_box = this._init_quick_info(pos, id);
		this._quick_info_task = id;
		this._quick_info_box.className = gantt._prepare_quick_info_classname(id);

		this._fill_quick_data(id);
		this._show_quick_info(pos, offset);
		this.callEvent("onQuickInfo", [id]);
	}
};
gantt._hideQuickInfo = function(){
	gantt.hideQuickInfo();
};
gantt.hideQuickInfo = function(forced){
	var qi = this._quick_info_box;
	this._quick_info_box_id = 0;
	var taskId = this._quick_info_task;
	this._quick_info_task = null;

	if (qi && qi.parentNode){

		if (gantt.config.quick_info_detached) {
			this.callEvent("onAfterQuickInfo", [taskId]);
			return qi.parentNode.removeChild(qi);
		}

		qi.className += " gantt_qi_hidden";
		if (qi.style.right == "auto")
			qi.style.left = "-350px";
		else
			qi.style.right = "-350px";

		if (forced) {
			qi.style.left = qi.style.right = "";
			qi.parentNode.removeChild(qi);
		}
		this.callEvent("onAfterQuickInfo", [taskId]);
	}
};
gantt.event(window, "keydown", function(e){
	if (e.keyCode == 27)
		gantt.hideQuickInfo();
});

gantt._show_quick_info = function(pos, offset){
	var qi = gantt._quick_info_box;
	if (gantt.config.quick_info_detached){
		if (!qi.parentNode || 
			qi.parentNode.nodeName.toLowerCase() == "#document-fragment")//IE8
			gantt.$task_data.appendChild(qi);
		var width = qi.offsetWidth;
		var height = qi.offsetHeight;

		var scrolls = this.getScrollState();
		var screen_width = this.$task.offsetWidth + scrolls.x - width;

		//pos.dy = (pos.top + height - scrolls.y > (gantt._y - gantt.config.scale_height)*0.96) ? 1 : 0; // uncomment to show QI at the bottom of task always

		qi.style.left = Math.min(Math.max(scrolls.x, pos.left - pos.dx*(width - pos.width)), screen_width) + "px";
		qi.style.top = pos.top - (pos.dy ? (height + pos.height + 2*offset) : 0) + "px";
	} else {
		qi.style.top = 20 + "px";
		if (pos.dx == 1){
			qi.style.right = "auto";
			qi.style.left = "-300px";
			
			setTimeout(function(){
				qi.style.left = "10px";
			},1);
		} else {
			qi.style.left = "auto";
			qi.style.right = "-300px";
			
			setTimeout(function(){
				qi.style.right = "10px";
			},1);
		}
		qi.className += " gantt_qi_"+(pos.dx == 1 ? "left" : "right");
		gantt.$root.appendChild(qi);
	}
};
gantt._prepare_quick_info_classname = function(id){
	var task = gantt.getTask(id);

	var css = "gantt_cal_quick_info",
		template = this.templates.quick_info_class(task.start_date, task.end_date, task);

	if(template){
		css += " " + template;
	}
	return css;
};

gantt._init_quick_info = function(pos, id){
	var task = gantt.getTask(id);
	if(typeof this._quick_info_readonly == "boolean"){
		if(this.isReadonly(task) !== this._quick_info_readonly){
			gantt.hideQuickInfo(true);
			this._quick_info_box = null;
		}
	}

	this._quick_info_readonly = this.isReadonly(task);

	if (!this._quick_info_box){
		var qi = this._quick_info_box = document.createElement("div");

		this._waiAria.quickInfoAttr(qi);


	//title
		var ariaAttr = gantt._waiAria.quickInfoHeaderAttrString();
		var html = "<div class=\"gantt_cal_qi_title\" "+ariaAttr+">" +
			"<div class=\"gantt_cal_qi_tcontent\"></div><div  class=\"gantt_cal_qi_tdate\"></div>" +
			"</div>" +
			"<div class=\"gantt_cal_qi_content\"></div>";

	//buttons
		html += "<div class=\"gantt_cal_qi_controls\">";
		var buttons = gantt.config.quickinfo_buttons;

		var is_editor = {"icon_delete":true,"icon_edit":true};

		for (var i = 0; i < buttons.length; i++){
			if(this._quick_info_readonly && is_editor[buttons[i]])
				continue;

			var ariaAttr = gantt._waiAria.quickInfoButtonAttrString(gantt.locale.labels[buttons[i]]);

			html += "<div class=\"gantt_qi_big_icon "+buttons[i]+"\" title=\""+gantt.locale.labels[buttons[i]]+"\" " + ariaAttr +"><div class='gantt_menu_icon " + buttons[i] + "'></div><div>"+gantt.locale.labels[buttons[i]]+"</div></div>";
		}
		html += "</div>";

		qi.innerHTML = html;

		var buttonClick = function(ev){
			ev = ev || event;
			gantt._qi_button_click(ev.target || ev.srcElement);
		};

		gantt.event(qi, "click", buttonClick);
		gantt.event(qi, "keypress", function(e){
			e = e || event;
			var code = e.which||event.keyCode;
			if (code == 13 || code == 32){
				setTimeout(function(){
					gantt._qi_button_click(e.target || e.srcElement);
				},1);
			}
		});
		if (gantt.config.quick_info_detached)
			gantt.event(gantt.$task_data, "scroll", function(){  gantt.hideQuickInfo(); });
	}

	return this._quick_info_box;
};

gantt._qi_button_click = function(node){
	var box = gantt._quick_info_box;
	if (!node || node == box) return;

	var mask = node.className;
	if (mask.indexOf("_icon")!=-1){
		var id = gantt._quick_info_box_id;
		gantt.$click.buttons[mask.split(" ")[1].replace("icon_","")](id);
	} else
		gantt._qi_button_click(node.parentNode);
};
gantt._get_event_counter_part = function(id, offset){
	var domEv = gantt.getTaskNode(id);
	if (!domEv)
		return null;
	var left = 0;
	var top = offset + domEv.offsetTop + domEv.offsetHeight;

	var node = domEv;
	while (node && node.className != "gantt_task"){
		left += node.offsetLeft;
	 	node = node.offsetParent;
	}
	
	var scroll = this.getScrollState();

	if(node){
		var dx = (left + domEv.offsetWidth/2) - scroll.x > (gantt.$container.offsetWidth/2) ? 1 : 0;
		var dy = (top + domEv.offsetHeight/2) - scroll.y > (gantt.$container.offsetHeight/2) ? 1 : 0;

		return { left:left, top:top, dx:dx, dy:dy,
			width:domEv.offsetWidth, height:domEv.offsetHeight };
	}
	return null;
};

gantt._fill_quick_data  = function(id){
	var ev = gantt.getTask(id);
	var qi = gantt._quick_info_box;

	gantt._quick_info_box_id = id;

//title content

	var header = {
		content: gantt.templates.quick_info_title(ev.start_date, ev.end_date, ev),
		date: gantt.templates.quick_info_date(ev.start_date, ev.end_date, ev)
	};
	var titleContent = qi.firstChild.firstChild;
	titleContent.innerHTML = header.content;
	var titleDate = titleContent.nextSibling;
	titleDate.innerHTML = header.date;


	gantt._waiAria.quickInfoHeader(qi, [header.content, header.date].join(" "));

//main content
	var main = qi.firstChild.nextSibling;
	main.innerHTML = gantt.templates.quick_info_content(ev.start_date, ev.end_date, ev);
};


/***/ })

/******/ });