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
/******/ 	return __webpack_require__(__webpack_require__.s = "./sources/ext/tooltip.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./sources/ext/tooltip.js":
/*!********************************!*\
  !*** ./sources/ext/tooltip.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function(){

function getTooltipContainer(){
	return gantt.$task_data || gantt.$root;
}

function getTooltipViewPort(){
	return gantt.$task || gantt.$root;
}

gantt._tooltip = {};
gantt._tooltip_class = "gantt_tooltip";
gantt.config.tooltip_timeout = 30;//,
gantt.config.tooltip_offset_y = 20;
gantt.config.tooltip_offset_x = 10;//,
	// timeout_to_hide: 50,
	// delta_x: 15,
	// delta_y: -20

gantt._create_tooltip = function(){
	if (!this._tooltip_html){
		this._tooltip_html = document.createElement('div');
		this._tooltip_html.className = gantt._tooltip_class;

		this._waiAria.tooltipAttr(this._tooltip_html);

	}

	return this._tooltip_html;
};

gantt._is_cursor_under_tooltip = function(mouse_pos, tooltip) {
	if(mouse_pos.x >= tooltip.pos.x && mouse_pos.x <= (tooltip.pos.x + tooltip.width)) return true;
	if(mouse_pos.y >= tooltip.pos.y && mouse_pos.y <= (tooltip.pos.y + tooltip.height)) return true;
	return false;
};

gantt._show_tooltip = function(text, pos) {
	if (gantt.config.touch && !gantt.config.touch_tooltip) return;

	var tip = this._create_tooltip();

	tip.innerHTML = text;
	getTooltipContainer().appendChild(tip);

	var width = tip.offsetWidth + 20;
	var height = tip.offsetHeight + 40;
	var viewPort = getTooltipViewPort();
	var max_height = viewPort.offsetHeight;
	var max_width = viewPort.offsetWidth;
	var scroll = this.getScrollState();

	if(viewPort === gantt.$root){
		scroll = {x: 0, y: 0};
	}

	gantt._waiAria.tooltipVisibleAttr(tip);

	//pos.x += scroll.x;
	pos.y += scroll.y;

	var mouse_pos = {
		x: pos.x,
		y: pos.y
	};

	pos.x += (gantt.config.tooltip_offset_x*1 || 0);
	pos.y += (gantt.config.tooltip_offset_y*1 || 0);

	pos.y = Math.min(Math.max(scroll.y, pos.y), scroll.y+max_height - height);
	pos.x = Math.min(Math.max(scroll.x, pos.x), scroll.x+max_width - width);

	if (gantt._is_cursor_under_tooltip(mouse_pos, {pos: pos, width: width, height: height})) {
		if((mouse_pos.x+width) > (max_width + scroll.x)) pos.x = mouse_pos.x - (width - 20) - (gantt.config.tooltip_offset_x*1 || 0);
		if((mouse_pos.y+height) > (max_height + scroll.y)) pos.y = mouse_pos.y - (height - 40) - (gantt.config.tooltip_offset_y*1 || 0);
	}

	tip.style.left = pos.x + "px";
	tip.style.top  = pos.y + "px";
};

gantt._hide_tooltip = function(){
	if(this._tooltip_html)
		this._waiAria.tooltipHiddenAttr(this._tooltip_html);

	if (this._tooltip_html && this._tooltip_html.parentNode)
		this._tooltip_html.parentNode.removeChild(this._tooltip_html);
	this._tooltip_id = 0;


};

gantt._is_tooltip = function(ev) {
	var node = ev.target || ev.srcElement;
	return gantt._is_node_child(node, function(node){
		return (node.className == this._tooltip_class);
	});
};

gantt._is_task_line = function(ev){
	var node = ev.target || ev.srcElement;
	return gantt._is_node_child(node, function(node){
		return (node == this.$task_data);
	});
};

gantt._is_node_child = function(node, condition){
	var res = false;
	while (node && !res) {
		res = condition.call(gantt, node);
		node = node.parentNode;
	}
	return res;
};

gantt._tooltip_pos = function(ev) {
	if (ev.pageX || ev.pageY)
		var pos = {x:ev.pageX, y:ev.pageY};

	var d = (document.documentElement ||
		document.body.parentNode ||
		document.body);

	var pos = {
		x:ev.clientX + d.scrollLeft - d.clientLeft,
		y:ev.clientY + d.scrollTop - d.clientTop
	};

	var domHelpers = __webpack_require__(/*! ../utils/dom_helpers */ "./sources/utils/dom_helpers.js");

	var box = domHelpers.getNodePosition(getTooltipContainer());
	pos.x = pos.x - box.x;
	pos.y = pos.y - box.y;
	return pos;
};

gantt.attachEvent("onMouseMove", function(event_id, ev) { // (gantt event_id, browser event)
	if(this.config.tooltip_timeout){
		//making events survive timeout in ie
		if(document.createEventObject && !document.createEvent)
			ev = document.createEventObject(ev);

		var delay = this.config.tooltip_timeout;

		if(this._tooltip_id && !event_id){
			if(!isNaN(this.config.tooltip_hide_timeout)){
				delay = this.config.tooltip_hide_timeout;
			}
		}

		clearTimeout(gantt._tooltip_ev_timer);
		gantt._tooltip_ev_timer = setTimeout(function(){
			gantt._init_tooltip(event_id, ev);
		}, delay);

	}else{
		gantt._init_tooltip(event_id, ev);
	}
});
gantt._init_tooltip = function(event_id, ev){
	if (this._is_tooltip(ev)) return;
	if (event_id == this._tooltip_id && !this._is_task_line(ev)) return;
	if (!event_id)
		return this._hide_tooltip();

	if(!this.isTaskExists(event_id)){
		return this._hide_tooltip();
	}

	this._tooltip_id = event_id;

	var task = this.getTask(event_id);
	var text = this.templates.tooltip_text(task.start_date, task.end_date, task);
	if (!text){
		this._hide_tooltip();
		return;
	}
	this._show_tooltip(text, this._tooltip_pos(ev));
};
gantt.attachEvent("onMouseLeave", function(ev){
	if (gantt._is_tooltip(ev)) return;
	this._hide_tooltip();
});

})();


/***/ }),

/***/ "./sources/utils/dom_helpers.js":
/*!**************************************!*\
  !*** ./sources/utils/dom_helpers.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

//returns position of html element on the page
function elementPosition(elem) {
	var top=0, left=0, right=0, bottom=0;
	if (elem.getBoundingClientRect) { //HTML5 method
		var box = elem.getBoundingClientRect();
		var body = document.body;
		var docElem = (document.documentElement ||
			document.body.parentNode ||
			document.body);

		var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		var clientTop = docElem.clientTop || body.clientTop || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		top  = box.top +  scrollTop - clientTop;
		left = box.left + scrollLeft - clientLeft;

		right = document.body.offsetWidth - box.right;
		bottom = document.body.offsetHeight - box.bottom;
	} else { //fallback to naive approach
		while(elem) {
			top = top + parseInt(elem.offsetTop,10);
			left = left + parseInt(elem.offsetLeft,10);
			elem = elem.offsetParent;
		}

		right = document.body.offsetWidth - elem.offsetWidth - left;
		bottom = document.body.offsetHeight - elem.offsetHeight - top;
	}
	return { y: Math.round(top), x: Math.round(left), width:elem.offsetWidth, height:elem.offsetHeight, right: Math.round(right), bottom: Math.round(bottom) };
}

function isVisible(node){
	var display = false,
		visibility = false;
	if(window.getComputedStyle){
		var style = window.getComputedStyle(node, null);
		display = style["display"];
		visibility = style["visibility"];
	}else if(node.currentStyle){
		display = node.currentStyle["display"];
		visibility = node.currentStyle["visibility"];
	}
	return (display != "none" && visibility != "hidden");
}

function hasNonNegativeTabIndex(node){
	return !isNaN(node.getAttribute("tabindex")) && (node.getAttribute("tabindex")*1 >= 0);
}

function hasHref(node){
	var canHaveHref = {"a": true, "area": true};
	if(canHaveHref[node.nodeName.loLowerCase()]){
		return !!node.getAttribute("href");
	}
	return true;
}

function isEnabled(node){
	var canDisable = {"input":true, "select":true, "textarea":true, "button":true, "object":true};
	if(canDisable[node.nodeName.toLowerCase()]){
		return !node.hasAttribute("disabled");
	}

	return true;
}

function getFocusableNodes(root){
	var nodes = root.querySelectorAll([
		"a[href]",
		"area[href]",
		"input",
		"select",
		"textarea",
		"button",
		"iframe",
		"object",
		"embed",
		"[tabindex]",
		"[contenteditable]"
	].join(", "));

	var nodesArray = Array.prototype.slice.call(nodes, 0);
	for(var i = 0; i < nodesArray.length; i++){
		var node = nodesArray[i];
		var isValid = (hasNonNegativeTabIndex(node)  || isEnabled(node) || hasHref(node)) && isVisible(node);
		if(!isValid){
			nodesArray.splice(i, 1);
			i--;
		}
	}
	return nodesArray;
}

function getScrollSize(){
	var div = document.createElement("div");
	div.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;";

	document.body.appendChild(div);
	var width = div.offsetWidth-div.clientWidth;
	document.body.removeChild(div);

	return width;
}

function getClassName(node){
	if(!node) return "";

	var className = node.className || "";
	if(className.baseVal)//'className' exist but not a string - IE svg element in DOM
		className = className.baseVal;

	if(!className.indexOf)
		className = '';

	return _trimString(className);
}

function addClassName(node, className){
	if (className && node.className.indexOf(className) === -1) {
		node.className += " " + className;
	}
}

function removeClassName(node, name) {
	name = name.split(" ");
	for (var i = 0; i < name.length; i++) {
		var regEx = new RegExp('\\s?\\b' + name[i] + '\\b(?![-_\.])', "");
		node.className = node.className.replace(regEx, "");
	}
}

function toNode(node) {
	if (typeof node === "string") {
		return (document.getElementById(node) || document.querySelector(node) || document.body);
	}
	return node || document.body;
}

var _slave = document.createElement("div");
function insert(node, newone) {
	_slave.innerHTML = newone;
	var child = _slave.firstChild;
	node.appendChild(child);
	return child;
}

function remove(node) {
	if (node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function getChildren(node, css) {
	var ch = node.childNodes;
	var len = ch.length;
	var out = [];
	for (var i = 0; i < len; i++) {
		var obj = ch[i];
		if (obj.className && obj.className.indexOf(css) !== -1) {
			out.push(obj);
		}
	}
	return out;
}

function getTargetNode(e){
	var trg;
	if (e.tagName)
		trg = e;
	else {
		e=e||window.event;
		trg=e.target||e.srcElement;
	}
	return trg;
}

function locateAttribute(e, attribute) {
	if(!attribute) return;

	var trg = getTargetNode(e);

	while (trg){
		if (trg.getAttribute){	//text nodes has not getAttribute
			var test = trg.getAttribute(attribute);
			if (test) return trg;
		}
		trg=trg.parentNode;
	}
	return null;
}

function _trimString(str){
	var func = String.prototype.trim || function(){ return this.replace(/^\s+|\s+$/g, ""); };
	return func.apply(str);
}

function locateClassName(e, classname, strict){
	if(strict === undefined)
		strict = true;

	var trg = getTargetNode(e);
	var css = '';
	var test = false;
	while (trg){
		css = getClassName(trg);

		if(css){
			var ind = css.indexOf(classname);
			if (ind >= 0){
				if (!strict)
					return trg;

				//check that we have exact match
				var left = (ind === 0) || (!_trimString(css.charAt(ind - 1)));
				var right = ((ind + classname.length >= css.length)) || (!_trimString(css.charAt(ind + classname.length)));

				if (left && right)
					return trg;
			}
		}

		trg=trg.parentNode;
	}
	return null;
}

/*
event position relatively to DOM element
 */
function getRelativeEventPosition(ev, node){
	if (ev.pageX || ev.pageY)
		var pos = {x: ev.pageX, y: ev.pageY};

	var d = document.documentElement;
	var pos = {
		x: ev.clientX + d.scrollLeft - d.clientLeft,
		y: ev.clientY + d.scrollTop - d.clientTop
	};

	var box = elementPosition(node);
	pos.x = pos.x - box.x + node.scrollLeft;
	pos.y = pos.y - box.y + node.scrollTop;
	return pos;
}


function isChildOf(child, parent){
	if(!child || !parent){
		return false;
	}

	while(child && child != parent) {
		child = child.parentNode;
	}

	return child === parent;
}

module.exports = {
	getNodePosition: elementPosition,
	getFocusableNodes: getFocusableNodes,
	getScrollSize: getScrollSize,
	getClassName: getClassName,
	addClassName: addClassName,
	removeClassName: removeClassName,
	insertNode: insert,
	removeNode: remove,
	getChildNodes: getChildren,
	toNode: toNode,
	locateClassName:locateClassName,
	locateAttribute: locateAttribute,
	getTargetNode: getTargetNode,
	getRelativeEventPosition: getRelativeEventPosition,
	isChildOf: isChildOf,
};

/***/ })

/******/ });