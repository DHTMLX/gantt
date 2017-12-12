/*!
 * @license
 * 
 * dhtmlxGantt v.5.0.5 Stardard
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
/******/ 	return __webpack_require__(__webpack_require__.s = 19);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var dateHelper = __webpack_require__(3);

function copy(object) {
	var i, t, result; // iterator, types array, result

	if (object && typeof object == "object") {
		result = {};
		t = [Array,Number,String,Boolean];
		for (i=0; i<t.length; i++) {
			if (object instanceof t[i])
				result = i ? new t[i](object) : new t[i](); // first one is array
		}

		if (dateHelper.isDate(object)) {
			result = new Date(object);
		}

		for (i in object) {
			if (Object.prototype.hasOwnProperty.apply(object, [i]))
				result[i] = copy(object[i]);
		}
	}
	return result || object;
}

function mixin (target, source, force){
	for (var f in source)
		if ((!target[f] || force)) target[f]=source[f];
	return target;
}

function defined(obj) {
	return typeof(obj) != "undefined";
}

var seed;
function uid() {
	if (!seed)
		seed = (new Date()).valueOf();

	seed++;
	return seed;
}

//creates function with specified "this" pointer
function bind(functor, object){
	if(functor.bind)
		return functor.bind(object);
	else
		return function(){ return functor.apply(object,arguments); };
}

function event(el, event, handler){
	if (el.addEventListener)
		el.addEventListener(event, handler, false);

	else if (el.attachEvent)
		el.attachEvent("on"+event, handler);
}

function eventRemove(el, event, handler){
	if (el.removeEventListener)
		el.removeEventListener(event, handler, false);

	else if (el.detachEvent)
		el.detachEvent("on"+event, handler);
}


module.exports = {
	copy: copy,
	defined: defined,
	mixin: mixin,
	uid: uid,
	bind: bind,
	event: event,
	eventRemove: eventRemove
};

/***/ }),
/* 1 */
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
	while(child && child != parent) {
		child = child.parentNode;
	}
	return child == parent;
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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var EventHost = function(){
	this._connected = [];
	this._silent_mode = false;
};

EventHost.prototype = {
	_silentStart: function() {
		this._silent_mode = true;
	},
	_silentEnd: function() {
		this._silent_mode = false;
	}
};

var	EventCatcher = function(obj){
	var dhx_catch = [];
	var z = function(){
		var res = true;
		for (var i = 0; i < dhx_catch.length; i++){
			if (dhx_catch[i]){
				var zr = dhx_catch[i].apply(obj, arguments);
				res=res&&zr;
			}
		}
		return res;
	};
	z.addEvent=function(ev){
		if (typeof (ev) == "function")
			return dhx_catch.push(ev)-1;
		return false;
	};
	z.removeEvent=function(id){
		dhx_catch[id]=null;
	};
	return z;
};

function makeEventable(obj){

	var eventHost = new EventHost();
	obj.attachEvent=function(name, catcher, callObj){
		name='ev_'+name.toLowerCase();
		if (!eventHost[name])
			eventHost[name] = new EventCatcher(callObj||this);

		return(name+':'+eventHost[name].addEvent(catcher)); //return ID (event name & event ID)
	};
	obj.attachAll = function(callback, callObj){
		this.attachEvent('listen_all', callback, callObj);
	};

	obj.callEvent=function(name, arg0, callObj){
		if (eventHost._silent_mode) return true;

		var handlerName = 'ev_'+name.toLowerCase();

		if (eventHost['ev_listen_all']){
			eventHost['ev_listen_all'].apply(callObj || this, [name].concat(arg0));
		}

		if (eventHost[handlerName])
			return eventHost[handlerName].apply(callObj || this, arg0);
		return true;
	};
	obj.checkEvent=function(name){
		return (!!eventHost['ev_'+name.toLowerCase()]);
	};
	obj.detachEvent=function(id){
		if (id){
			var list = id.split(':');           //get EventName and ID
			eventHost[list[0]].removeEvent(list[1]); //remove event
		}
	};
	obj.detachAllEvents = function(){
		for (var name in eventHost){
			if (name.indexOf("ev_") === 0)
				delete eventHost[name];
		}
	};

}

module.exports = makeEventable;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

function isDate(obj) {
	var fields = [
		"getFullYear",
		"getMonth",
		"getDate"
	];
	
	if (obj && typeof obj == "object") {
		for (var i=0; i<fields.length; i++) {
			if (!obj[fields[i]])
				return false;
		}
	} else {
		return false;
	}

	return true;
}

module.exports = {
	isDate: isDate
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0),
	eventable = __webpack_require__(2),
	domHelpers = __webpack_require__(1);

var Cell = (function () {
	"use strict";

	function Cell(parent, config, factory, gantt) {
		if (parent) {
			this.$container = domHelpers.toNode(parent);
			this.$parent = parent;
		}
		// save config
		this.$config = utils.mixin(config, {
			headerHeight: 33
		});
		this.$gantt = gantt;
		// set id
		this.$id = config.id || "c" + utils.uid();

		this.$name = "cell";
		this.$factory = factory;

		eventable(this);

	}

	Cell.prototype.destructor = function () {
		this.$parent = this.$container = this.$view = null;

		this.callEvent("onDestroy", []);
		this.detachAllEvents();
	};
	Cell.prototype.cell = function (id) {
		return null;
	};

	Cell.prototype.scrollTo = function(left, top){

		if (left*1 == left){
			this.$view.scrollLeft = left;
		}
		if(top*1 == top){
			this.$view.scrollTop = top;
		}
	};

	Cell.prototype.clear = function(){
		this.getNode().innerHTML = "";
		this.getNode().className = "gantt_layout_content";
		this.getNode().style.padding = "0";
	};

	Cell.prototype.resize = function (final) {
		if (this.$parent) {
			return this.$parent.resize(final);
		}

		if(final === false){
			this.$preResize = true;
		}

		var topCont = this.$container;
		var x = topCont.offsetWidth;
		var y = topCont.offsetHeight;
		var topSize = this.getSize();
		if (topCont === document.body) {
			x = document.body.offsetWidth;
			y = document.body.offsetHeight;
		}
		if (x < topSize.minWidth) {
			x = topSize.minWidth;
		}
		if (x > topSize.maxWidth) {
			x = topSize.maxWidth;
		}
		if (y < topSize.minHeight) {
			y = topSize.minHeight;
		}
		if (y > topSize.maxHeight) {
			y = topSize.maxHeight;
		}
		this.setSize(x, y);

		var self = this;

		if(!this.$preResize){
		//	self.callEvent("onResize", [x, y]);
		}
		this.$preResize = false;
	};

	Cell.prototype.hide = function () {
		this._hide(true);
		this.resize();
	};
	Cell.prototype.show = function (force) {
		this._hide(false);
		if (force && this.$parent) {
			this.$parent.show();
		}
		this.resize();
	};
	Cell.prototype._hide = function (mode) {
		if (mode === true && this.$view.parentNode) {
			this.$view.parentNode.removeChild(this.$view);
		}
		else if (mode === false && !this.$view.parentNode) {
			var index = this.$parent.cellIndex(this.$id);
			this.$parent.moveView(this, index);
		}
		this.$config.hidden = mode;
	};
	Cell.prototype.$toHTML = function (content, css) {
		if (content === void 0) { content = ""; }
		css = [(css || ""), (this.$config.css || "")].join(" ");
		var obj = this.$config;
		var header = "";
		if (obj.raw) {
			content = typeof obj.raw === "string" ? obj.raw : "";
		}
		else {
			if (!content) {
				content = "<div class='gantt_layout_content' "+(css ? " class='"+css+"' " : "")+" >" + (obj.html || "") + "</div>";
			}
			if (obj.header) {
				var collapseIcon = obj.canCollapse ? "<div class='gantt_layout_header_arrow'></div>" : "";
				header = "<div class='gantt_layout_header'>" + collapseIcon + "<div class='gantt_layout_header_content'>" + obj.header + "</div></div>";
			}
		}
		return "<div class='gantt_layout_cell " + css + "' data-cell-id='" + this.$id + "'>" + header + content + "</div>";
	};
	Cell.prototype.$fill = function (node, parent) {
		this.$view = node;
		this.$parent = parent;
		this.init();
	};
	Cell.prototype.getNode = function () {
		return (this.$view.querySelector("gantt_layout_cell") || this.$view);
	};
	Cell.prototype.init = function () {
		// [NOT-GOOD] code is executed for each component, while it still has only one handler, it is no good

		var self = this;
		var mouse = this.$gantt.$services.getService("mouseEvents");
		mouse.delegate("click", "gantt_header_arrow", function(e){
			var cellId = domHelpers.locateAttribute(e, "data-cell-id");
			if(cellId == self.$id){
				self.toggle();
			}
		});

		this.callEvent("onReady", []);
	};
	Cell.prototype.toggle = function () {
		this.$config.collapsed = !this.$config.collapsed;
		this.resize();
	};
	Cell.prototype.getSize = function () {
		var size = {
			height: this.$config.height || 0,
			width: this.$config.width || 0,
			gravity: this.$config.gravity || 1,
			minHeight: this.$config.minHeight || 0,
			minWidth: this.$config.minWidth || 0,
			maxHeight: this.$config.maxHeight || 100000,
			maxWidth: this.$config.maxWidth || 100000
		};
		if (this.$config.collapsed) {
			var mode = this.$config.mode === "x";
			size[mode ? "width" : "height"] = size[mode ? "maxWidth" : "maxHeight"] = this.$config.headerHeight;
		}
		return size;
	};

	Cell.prototype.getContentSize = function(){

		var width = this.$lastSize.contentX;
		if(width !== width*1){
			width = this.$lastSize.width;
		}

		var height = this.$lastSize.contentY;
		if(height !== height*1){
			height = this.$lastSize.height;
		}

		return {
			width: width,
			height: height
		};
	};

	Cell.prototype._getBorderSizes = function(){
		var borders = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			horizontal: 0,
			vertical: 0
		};
		if(this._currentBorders){
			if(this._currentBorders[this._borders.left]){
				borders.left = 1;
				borders.horizontal++;
			}

			if(this._currentBorders[this._borders.right]){
				borders.right = 1;
				borders.horizontal++;
			}

			if(this._currentBorders[this._borders.top]){
				borders.top = 1;
				borders.vertical++;
			}

			if(this._currentBorders[this._borders.bottom]){
				borders.bottom = 1;
				borders.vertical++;
			}
		}

		return borders;

	};

	Cell.prototype.setSize = function (x, y) {
		this.$view.style.width = x + "px";
		this.$view.style.height = y + "px";

		var borders = this._getBorderSizes();
		var contentY = y - borders.vertical;
		var contentX = x - borders.horizontal;

		this.$lastSize = { x: x, y: y, contentX: contentX, contentY: contentY };
		if (this.$config.header) {
			this._sizeHeader();
		}else{
			this._sizeContent();
		}
	};

	Cell.prototype._borders = {
		"left":"gantt_layout_cell_border_left",
		"right":"gantt_layout_cell_border_right",
		"top":"gantt_layout_cell_border_top",
		"bottom":"gantt_layout_cell_border_bottom"
	};

	Cell.prototype._setBorders = function(css, view){
		if(!view) {
			view = this;
		}
		var node = view.$view;

		for( var i in this._borders){
			domHelpers.removeClassName(node, this._borders[i]);
		}

		if(typeof css == "string"){
			css = [css];
		}

		var cssHash = {};

		for(var i = 0; i < css.length; i++){
			domHelpers.addClassName(node, css[i]);
			cssHash[css[i]] = true;
		}

		view._currentBorders = cssHash;
	};


	Cell.prototype._sizeContent = function(){
		var content = this.$view.childNodes[0];
		if(content.className == "gantt_layout_content"){
			content.style.height = this.$lastSize.contentY + "px";
		}
	};

	Cell.prototype._sizeHeader = function () {
		var size = this.$lastSize;
		size.contentY -= this.$config.headerHeight;
		var header = this.$view.childNodes[0];
		var content = this.$view.childNodes[1];
		var xLayout = this.$config.mode === "x";
		if (this.$config.collapsed) {
			content.style.display = "none";
			if (xLayout) {
				header.className = "gantt_layout_header collapsed_x";
				header.style.width = size.y + "px";
				var d = Math.floor(size.y / 2 - size.x / 2);
				header.style.transform = "rotate(90deg) translate(" + d + "px, " + d + "px)";
				content.style.display = "none";
			}
			else {
				header.className = "gantt_layout_header collapsed_y";
			}
		}
		else {
			if (xLayout) {
				header.className = "gantt_layout_header";
			}
			else {
				header.className = "gantt_layout_header vertical";
			}
			header.style.width = 'auto';
			header.style.transform = '';
			content.style.display = "";
			content.style.height = size.contentY + "px";
		}
		header.style.height = this.$config.headerHeight + "px";
	};
	return Cell;
}());

module.exports = Cell;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	function __() { this.constructor = d; }
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var env = {
	isIE: (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0),
	isIE6: (!window.XMLHttpRequest && navigator.userAgent.indexOf("MSIE") >= 0),
	isIE7: (navigator.userAgent.indexOf("MSIE 7.0") >= 0 && navigator.userAgent.indexOf("Trident") < 0),
	isIE8: (navigator.userAgent.indexOf("MSIE 8.0") >= 0 && navigator.userAgent.indexOf("Trident") >= 0),
	isOpera: (navigator.userAgent.indexOf("Opera") >= 0),
	isChrome: (navigator.userAgent.indexOf("Chrome") >= 0),
	isKHTML: (navigator.userAgent.indexOf("Safari") >= 0 || navigator.userAgent.indexOf("Konqueror") >= 0),
	isFF: (navigator.userAgent.indexOf("Firefox") >= 0),
	isIPad: (navigator.userAgent.search(/iPad/gi) >= 0),
	isEdge: (navigator.userAgent.indexOf("Edge")!=-1)
};

module.exports = env;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __extends = __webpack_require__(5),
	domHelpers = __webpack_require__(1),
	utils = __webpack_require__(0),
	Cell = __webpack_require__(4);

var Layout = (function (_super) {
	"use strict";

	__extends(Layout, _super);
	function Layout(parent, config, factory) {
		var _this = _super.apply(this, arguments) || this;

		if(parent)
			_this.$root = true;

		_this._parseConfig(config);
		_this.$name = "layout";
		return _this;
	}

	Layout.prototype.destructor = function () {
		if (this.$container && this.$view) {
			domHelpers.removeNode(this.$view);
		}

		for (var i = 0; i < this.$cells.length; i++) {
			var child = this.$cells[i];
			child.destructor();
		}
		this.$cells = [];

		_super.prototype.destructor.call(this);
	};

	Layout.prototype.resize = function(startStage){
		var mainCall = false;
		if(this.$root && !this._resizeInProgress){
			this.callEvent("onBeforeResize", []);
			mainCall = true;
			this._resizeInProgress = true;
		}

		_super.prototype.resize.call(this, true);
		_super.prototype.resize.call(this, false);

		if(mainCall){

			var contentViews = [];
			contentViews = contentViews.concat(this.getCellsByType("viewCell"));
			contentViews = contentViews.concat(this.getCellsByType("viewLayout"));
			contentViews = contentViews.concat(this.getCellsByType("hostCell"));

			for(var i = 0; i < contentViews.length; i++){
				if(!contentViews[i].$config.hidden)
					contentViews[i].setContentSize();
			}

			var scrollChanged = false;

			if(this.$config.autosize){
				scrollChanged = true;
				this.autosize(this.$config.autosize);
			}else{
				for(var i = 0; i < contentViews.length; i++){
					if(contentViews[i].$content && contentViews[i].$content.$name == "scroller"){
						if(contentViews[i].$content.shouldHide()){
							contentViews[i].hide();
							scrollChanged = true;
						}else if(contentViews[i].$content.shouldShow()){
							contentViews[i].show();
							scrollChanged = true;
						}
					}
				}
			}

			if(scrollChanged){
				this.resize();
				for(var i = 0; i < contentViews.length; i++){
					if(!contentViews[i].$config.hidden)
						contentViews[i].setContentSize();
				}
			}


			this.callEvent("onResize", []);
		}
		if(mainCall){
			this._resizeInProgress = false;
		}
	};

	Layout.prototype.getCellsByType = function(type){
		var res = [];
		if(type === this.$name){
			res.push(this);
		}

		if(this.$cells){
			for(var i = 0; i < this.$cells.length; i++){
				var children = Layout.prototype.getCellsByType.call(this.$cells[i], type);
				if(children.length){
					res.push.apply(res, children);
				}
			}
		}
		return res;
	};

	Layout.prototype.getNextSibling = function(cellId){
		var index = this.cellIndex(cellId);
		if(index >= 0 && this.$cells[index + 1]){
			return this.$cells[index + 1];
		}else{
			return null;
		}
	};

	Layout.prototype.getPrevSibling = function(cellId){
		var index = this.cellIndex(cellId);
		if(index >= 0 && this.$cells[index - 1]){
			return this.$cells[index - 1];
		}else{
			return null;
		}
	};


	Layout.prototype.cell = function (id) {
		for (var i = 0; i < this.$cells.length; i++) {
			var child = this.$cells[i];
			if (child.$id === id) {
				return child;
			}
			var sub = child.cell(id);
			if (sub) {
				return sub;
			}
		}
	};
	Layout.prototype.cellIndex = function (id) {
		for (var i = 0; i < this.$cells.length; i++) {
			if (this.$cells[i].$id === id) {
				return i;
			}
		}
		return -1;
	};
	Layout.prototype.moveView = function (view, ind) {
		if (this.$cells[ind] !== view) {
			return window.alert("Not implemented");
		}
		else {
			ind += this.$config.header ? 1 : 0;
			var node = this.$view;
			if (ind >= node.childNodes.length) {
				node.appendChild(view.$view);
			}
			else {
				node.insertBefore(view.$view, node.childNodes[ind]);
			}
		}
	};
	Layout.prototype._parseConfig = function (config) {
		this.$cells = [];
		this._xLayout = !config.rows;
		var cells = config.rows || config.cols || config.views;
		for (var i = 0; i < cells.length; i++) {
			var cell = cells[i];
			cell.mode = this._xLayout ? "x" : "y";
			var $content = this.$factory.initUI(cell);
			if(!$content){
				cells.splice(i, 1);
				i--;
			}else{
				$content.$parent = this;
				this.$cells.push($content);
			}
		}
	};
	Layout.prototype.getCells = function () {
		return this.$cells;
	};
	Layout.prototype.render = function () {
		var view = domHelpers.insertNode(this.$container, this.$toHTML());
		this.$fill(view, null);
		this.callEvent("onReady", []);
		this.resize();

		// do simple repaint after the first call
		this.render = this.resize;
	};
	Layout.prototype.$fill = function (node, parent) {
		this.$view = node;
		this.$parent = parent;
		var cells = domHelpers.getChildNodes(node, "gantt_layout_cell");
		for (var i = cells.length - 1; i >= 0; i--) {
			var sub = this.$cells[i];
			sub.$fill(cells[i], this);
			// initially hidden cell
			if (sub.$config.hidden) {
				sub.$view.parentNode.removeChild(sub.$view);
			}
		}
	};
	Layout.prototype.$toHTML = function () {
		var mode = this._xLayout ? "x" : "y";
		var html = [];
		for (var i = 0; i < this.$cells.length; i++) {
			html.push(this.$cells[i].$toHTML());
		}
		return _super.prototype.$toHTML.call(this, html.join(""), (this.$root ? "gantt_layout_root " : "") + "gantt_layout gantt_layout_" + mode);
	};

	Layout.prototype.getContentSize = function(){
		var contentWidth = 0,
			contentHeight = 0;

		var cellSize, cell, borders;
		for (var i = 0; i < this.$cells.length; i++) {
			cell = this.$cells[i];
			if(cell.$config.hidden)
				continue;

			cellSize = cell.getContentSize();

			if(cell.$config.view === "scrollbar"){
				cellSize.height = 0;
				cellSize.width = 0;
			}

			if(cell.$config.resizer){
				if(this._xLayout){
					cellSize.height = 0;
				}else{
					cellSize.width = 0;
				}
			}

			borders = cell._getBorderSizes();

			if(this._xLayout){
				contentWidth += (cellSize.width + borders.horizontal);
				contentHeight = Math.max(contentHeight, (cellSize.height + borders.vertical));
			}else{
				contentWidth = Math.max(contentWidth, cellSize.width + borders.horizontal);
				contentHeight += cellSize.height + borders.vertical;
			}
		}

		borders = this._getBorderSizes();
		contentWidth += borders.horizontal;
		contentHeight += borders.vertical;

		if(this.$root){
			contentWidth += 1;
			contentHeight += 1;
		}

		return {
			width: contentWidth,
			height: contentHeight
		};
	};

	Layout.prototype._cleanElSize = function(value){
		return ((value || "").toString().replace("px", "") * 1 || 0);
	};
	Layout.prototype._getBoxStyles = function(div){
		var computed = null;
		if(window.getComputedStyle){
			computed = window.getComputedStyle(div, null);
		}else{
			//IE with elem.currentStyle does not calculate sizes from %, so will use the default approach
			computed = {
				"width":div.clientWidth,
				"height":div.clientHeight
			};
		}
		var properties = [
			"width",
			"height",

			"paddingTop",
			"paddingBottom",
			"paddingLeft",
			"paddingRight",

			"borderLeftWidth",
			"borderRightWidth",
			"borderTopWidth",
			"borderBottomWidth"
		];
		var styles = {
			boxSizing:(computed.boxSizing == "border-box")
		};

		if(computed.MozBoxSizing){
			styles.boxSizing = (computed.MozBoxSizing == "border-box");
		}
		for(var i =0; i < properties.length; i++){
			styles[properties[i]] = computed[properties[i]] ? this._cleanElSize(computed[properties[i]]) : 0;
		}


		var box = {
			horPaddings : (styles.paddingLeft + styles.paddingRight + styles.borderLeftWidth + styles.borderRightWidth),
			vertPaddings : (styles.paddingTop + styles.paddingBottom + styles.borderTopWidth + styles.borderBottomWidth),
			borderBox: styles.boxSizing,
			innerWidth : styles.width,
			innerHeight : styles.height,
			outerWidth : styles.width,
			outerHeight : styles.height
		};


		if(box.borderBox){
			box.innerWidth -= box.horPaddings;
			box.innerHeight -= box.vertPaddings;
		}else{
			box.outerWidth += box.horPaddings;
			box.outerHeight += box.vertPaddings;
		}

		return box;
	};

	Layout.prototype.autosize = function(mode) {
		var res = {x:false, y:false};
		if(mode === "xy"){
			res.x = res.y = true;
		}else if(mode === "y" || mode === true){
			res.y = true;
		}else if(mode === "x"){
			res.x = true;
		}
		var boxSizes = this._getBoxStyles(this.$container);
		var contentSizes = this.getContentSize();

		var node = this.$container;
		if(res.x){
			if(boxSizes.borderBox){
				contentSizes.width += boxSizes.horPaddings;
			}
			node.style.width = contentSizes.width + "px";
		}
		if(res.y){
			if(boxSizes.borderBox){
				contentSizes.height += boxSizes.vertPaddings;
			}
			node.style.height = contentSizes.height + "px";
		}
	};

	Layout.prototype.getSize = function () {
		this._sizes = [];
		var width = 0;
		var minWidth = 0;
		var maxWidth = 100000;
		var height = 0;
		var maxHeight = 100000;
		var minHeight = 0;

		for (var i = 0; i < this.$cells.length; i++) {

			var size = this._sizes[i] = this.$cells[i].getSize();
			if (this.$cells[i].$config.hidden) {
				continue;
			}
			if (this._xLayout) {
				if (!size.width && size.minWidth) {
					width += size.minWidth;
				}
				else {
					width += size.width;
				}
				maxWidth += size.maxWidth;
				minWidth += size.minWidth;
				height = Math.max(height, size.height);
				maxHeight = Math.min(maxHeight, size.maxHeight); // min of maxHeight
				minHeight = Math.max(minHeight, size.minHeight); // max of minHeight
			}
			else {
				if (!size.height && size.minHeight) {
					height += size.minHeight;
				}
				else {
					height += size.height;
				}
				maxHeight += size.maxHeight;
				minHeight += size.minHeight;
				width = Math.max(width, size.width);
				maxWidth = Math.min(maxWidth, size.maxWidth); // min of maxWidth
				minWidth = Math.max(minWidth, size.minWidth); // max of minWidth
			}
		}
		var self = _super.prototype.getSize.call(this);
		// maxWidth
		if (self.maxWidth >= 100000) {
			self.maxWidth = maxWidth;
		}
		// maxHeight
		if (self.maxHeight >= 100000) {
			self.maxHeight = maxHeight;
		}
		// minWidth
		self.minWidth = self.minWidth !== self.minWidth ? 0 : self.minWidth;// || self.width || Math.max(minWidth, width);
		// minHeight
		self.minHeight = self.minHeight !== self.minHeight ? 0 : self.minHeight;//self.minHeight || self.height || Math.max(minHeight, height);
		// sizes with paddings and margins
		if (this._xLayout) {
			self.minWidth += this.$config.margin * (this.$cells.length) || 0;
			self.minWidth += this.$config.padding * 2 || 0;
			self.minHeight += (this.$config.padding * 2) || 0;
		}
		else {
			self.minHeight += this.$config.margin * (this.$cells.length) || 0;
			self.minHeight += (this.$config.padding * 2) || 0;
		}
		
		return self;
	};
	// calc total gravity and free space
	Layout.prototype._calcFreeSpace = function (s, cell, xLayout) {
		var min = xLayout ? cell.minWidth : cell.minHeight;
		var max = xLayout ? cell.maxWidth : cell.maxWidth;
		var side = s;
		if (!side) {
			side = Math.floor(this._free / this._gravity * cell.gravity);
			if (side > max) {
				side = max;
				this._free -= side;
				this._gravity -= cell.gravity;
			}
			if (side < min) {
				side = min;
				this._free -= side;
				this._gravity -= cell.gravity;
			}
		}
		else {
			if (side > max) {
				side = max;
			}
			if (side < min) {
				side = min;
			}
			this._free -= side;
		}
		return side;
	};
	Layout.prototype._calcSize = function (s, size, xLayout) {
		var side = s;
		var min = xLayout ? size.minWidth : size.minHeight;
		var max = xLayout ? size.maxWidth : size.maxHeight;
		if (!side) {
			side = Math.floor(this._free / this._gravity * size.gravity);
		}
		if (side > max) {
			side = max;
		}
		if (side < min) {
			side = min;
		}
		return side;
	};

	Layout.prototype._configureBorders = function(){
		if(this.$root){
			this._setBorders([
				this._borders.left,
				this._borders.top,
				this._borders.right,
				this._borders.bottom
			],
			this);
		}

		var borderClass = this._xLayout ? this._borders.right : this._borders.bottom;

		var cells = this.$cells;

		var lastVisibleIndex = cells.length - 1;
		for(var i = lastVisibleIndex; i >= 0; i--){
			if (!cells[i].$config.hidden) {
				lastVisibleIndex = i;
				break;
			}
		}

		for (var i = 0; i < cells.length; i++) {
			if (cells[i].$config.hidden) {
				continue;
			}

			var lastCell = i >= lastVisibleIndex;
			var borderColorClass = "";
			if(!lastCell && cells[i + 1]){
				if(cells[i + 1].$config.view == "scrollbar"){
					if(this._xLayout){
						lastCell = true;
					}else{
						borderColorClass = "gantt_layout_cell_border_transparent";
					}

				}
			}


			this._setBorders(lastCell ? [] : [borderClass, borderColorClass], cells[i]);
		}
	};

	Layout.prototype._updateCellVisibility = function(){
		var oldVisibleCells = this._visibleCells || {};
		var firstCall = !this._visibleCells;
		var visibleCells = {};
		var cell;
		for (var i = 0; i < this._sizes.length; i++) {
			cell = this.$cells[i];

			if (!firstCall && cell.$config.hidden && oldVisibleCells[cell.$id]) {
				cell._hide(true);
			}else if(!cell.$config.hidden && !oldVisibleCells[cell.$id]){
				cell._hide(false);
			}

			if(!cell.$config.hidden){
				visibleCells[cell.$id] = true;
			}
		}
		this._visibleCells = visibleCells;
	};

	Layout.prototype.setSize = function (x, y) {
		this._configureBorders();
		_super.prototype.setSize.call(this, x, y);
		y = this.$lastSize.contentY;
		x = this.$lastSize.contentX;

		var padding = (this.$config.padding || 0);
		this.$view.style.padding = padding + "px";
		this._gravity = 0;
		this._free = this._xLayout ? x : y;
		this._free -= padding * 2;
		// calc all gravity

		var cell,
			size;

		this._updateCellVisibility();

		for (var i = 0; i < this._sizes.length; i++) {
			cell = this.$cells[i];

			if (cell.$config.hidden) {
				continue;
			}
			var margin = (this.$config.margin || 0);
			if(cell.$name == "resizer" && !margin){
				margin = -1;
			}

			// set margins to child cell
			var cellView = cell.$view;

			var marginSide = this._xLayout ? "marginRight" : "marginBottom";
			if (i !== this.$cells.length - 1) {
				cellView.style[marginSide] = margin + "px";
				this._free -= margin; // calc free space without margin
			}
			size = this._sizes[i];
			if (this._xLayout) {
				if (!size.width) {
					this._gravity += size.gravity;
				}
			}
			else {
				if (!size.height) {
					this._gravity += size.gravity;
				}
			}
		}
		for (var i = 0; i < this._sizes.length; i++) {
			cell = this.$cells[i];

			if (cell.$config.hidden) {
				continue;
			}
			size = this._sizes[i];
			var width = size.width;
			var height = size.height;
			if (this._xLayout) {
				this._calcFreeSpace(width, size, true);
			}
			else {
				this._calcFreeSpace(height, size, false);
			}
		}
		for (var i = 0; i < this.$cells.length; i++) {
			cell = this.$cells[i];

			if (cell.$config.hidden) {
				continue;
			}
			size = this._sizes[i];
			var dx = void 0;
			var dy = void 0;
			if (this._xLayout) {
				dx = this._calcSize(size.width, size, true);
				dy = y - padding * 2; // layout height without paddings
			}
			else {
				dx = x - padding * 2; // layout width without paddings
				dy = this._calcSize(size.height, size, false);
			}

			cell.setSize(dx, dy);
		}

		/*if(this.$root && !this._updatingScrollbars){
			this._updatingScrollbars = true;
			eachCell(function(cell){
				if(cell.$content && cell.$content.$name == "scroller"){
					cell.$content.toggleVisibility();
				}
			}, this);
			this._updatingScrollbars = false;
		}*/

	};

	function eachCell(code, root){
		if(root.$cells){
			for(var i = 0; i < root.$cells.length; i++){
				code(root.$cells[i]);
				eachCell(code, root.$cells[i]);
			}
		}
	}


	return Layout;
}(Cell));

module.exports = Layout;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

function checkTimeout(host, updPerSecond){
	if(!updPerSecond)
		return true;
	var timeout = 1000/updPerSecond;
	if(timeout < 1) return true;

	if(host._on_timeout)
		return false;

	setTimeout(function(){
		delete host._on_timeout;
	}, timeout);

	host._on_timeout = true;
	return true;
}

module.exports = checkTimeout;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var uiFactory = function createFactory(gantt){
	var views = {
		"layout": __webpack_require__(7),
		"multiview": __webpack_require__(10),
		"viewcell": __webpack_require__(11),
		"resizer": __webpack_require__(12),
		"cell": __webpack_require__(4)
	};

	function ui(cell) {
		var content;

		if (cell.view){
			content = createView.call(this, "viewcell", null, cell);
		}else if (cell.resizer) {
			content = createView.call(this, "resizer", null, cell);
		}
		else if (cell.rows || cell.cols) {
			content = createView.call(this, "layout", null, cell);
		}
		else if (cell.views) {
			content = createView.call(this, "multiview", null, cell);
		}
		else {
			content = createView.call(this, "cell", null, cell);
		}
		return content;
	}
	
	var createdViews = {};

	function createView(name, parent, config) {
		var creator = views[name];

		if(!creator || !creator.create)
			return false;

		var config = utils.copy(config);
		if(config.id && !config.css){
			config.css = config.id+"_cell";
		}

		var view = new creator.create(parent, config, this, gantt);

		if(creator.configure){
			creator.configure(view);
		}

		if(!view.$id){
			view.$id = config.id || gantt.uid();
		}

		if(!view.$parent && typeof parent == "object"){
			view.$parent = parent;
		}
		if(!view.$config){
			view.$config = config;
		}

		if(createdViews[view.$id]){
			view.$id = gantt.uid();
		}

		createdViews[view.$id] = view;

		return view;
	}

	function reset(){
		createdViews = {};
	}

	function register(name, viewConstructor, configure){
		views[name] = {create: viewConstructor, configure: configure};
	}

	function getView(id){
		return createdViews[id];
	}

	var factory = {
		initUI:ui,
		reset: reset,
		registerView: register,
		createView: createView,
		getView: getView
	};

	return factory;
};

module.exports = {
	createFactory: uiFactory
};



/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __extends = __webpack_require__(5),
	Layout = __webpack_require__(7),
	Cell = __webpack_require__(4);

var ViewLayout = (function (_super) {
	"use strict";

	__extends(ViewLayout, _super);
	function ViewLayout(parent, config, factory) {
		var _this = _super.apply(this, arguments) || this;
		for (var i = 0; i < _this.$cells.length; i++) {
			_this.$cells[i].$config.hidden = (i !== 0);
		}
		_this.$cell = _this.$cells[0];
		_this.$name = "viewLayout";

		return _this;
	}
	ViewLayout.prototype.cell = function (id) {
		var cell = _super.prototype.cell.call(this, id);
		if (!cell.$view) {
			this.$fill(null, this);
		}
		return cell;
	};
	ViewLayout.prototype.moveView = function (view) {
		var body = this.$view;
		if (this.$cell) {
			this.$cell.$config.hidden = true;
			body.removeChild(this.$cell.$view);
		}
		this.$cell = view;
		body.appendChild(view.$view);
	};
	ViewLayout.prototype.setSize = function (x, y) {
		Cell.prototype.setSize.call(this, x, y);
	};

	ViewLayout.prototype.setContentSize = function(){
		var size = this.$lastSize;
		this.$cell.setSize(size.contentX, size.contentY);
	};

	ViewLayout.prototype.getSize = function () {
		var sizes = _super.prototype.getSize.call(this);
		if (this.$cell) {
			var cellSize = this.$cell.getSize();
			if (this.$config.byMaxSize) {
				for (var i = 0; i < this.$cells.length; i++) {
					var otherCell = this.$cells[i].getSize();
					for (var cell in cellSize) {
						cellSize[cell] = Math.max(cellSize[cell], otherCell[cell]);
					}
				}
			}
			for (var size in sizes) {
				sizes[size] = sizes[size] || cellSize[size];
			}
			sizes.gravity = Math.max(sizes.gravity, cellSize.gravity);
		}
		return sizes;
	};
	return ViewLayout;
}(Layout));

module.exports = ViewLayout;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var __extends = __webpack_require__(5),
	utils = __webpack_require__(0),
	factory = __webpack_require__(9),
	Cell = __webpack_require__(4);

var ViewCell = (function (_super) {
	"use strict";

	__extends(ViewCell, _super);
	function ViewCell(parent, config, factory) {

		var _this = _super.apply(this, arguments) || this;

		if(config.view){
			if(config.id){
				// pass id to the nested view
				this.$id = utils.uid();
			}
			this.$content = this.$factory.createView(config.view, this, config);
			if(!this.$content)
				return false;
		}

		_this.$name = "viewCell";
		return _this;
	}

	ViewCell.prototype.destructor = function(){
		this.clear();
		_super.prototype.destructor.call(this);
	};

	ViewCell.prototype.clear = function(){

		this.$initialized = false;

		// call destructor
		if (this.$content){
			var method = this.$content.unload || this.$content.destructor;
			if (method){
				method.call(this.$content);
			}
		}

		_super.prototype.clear.call(this);

	};

	ViewCell.prototype.scrollTo = function(left, top){

		if(this.$content && this.$content.scrollTo){
			this.$content.scrollTo(left, top);
		}else{
			_super.prototype.scrollTo.call(this, left, top);
		}
	};

	ViewCell.prototype._setContentSize = function(x, y){
		var borders = this._getBorderSizes();
		var outerX = x + borders.horizontal;
		var outerY = y + borders.vertical;
		this.$config.width = outerX;
		this.$config.height = outerY;
	};

	ViewCell.prototype.setSize = function(x, y){
		_super.prototype.setSize.call(this, x, y);

		if(!this.$preResize && this.$content) {
			if (!this.$initialized) {
				this.$initialized = true;
				var header = this.$view.childNodes[0];
				var content = this.$view.childNodes[1];
				if(!content) content = header;

				/*if(this.$content.$config){
					this.$content.$config.width = this.$lastSize.contentX;
					this.$content.$config.height = this.$lastSize.contentY;
				}*/
				this.$content.init(content);
			}
		}
	};

	ViewCell.prototype.setContentSize = function(){
		if(!this.$preResize && this.$content) {
			if (this.$initialized) {
				this.$content.setSize(this.$lastSize.contentX, this.$lastSize.contentY);
			}
		}
	};


	ViewCell.prototype.getContentSize = function(){
		var size = _super.prototype.getContentSize.call(this);

		if(this.$content && this.$initialized){
			var childSize = this.$content.getSize();
			size.width = childSize.contentX === undefined ? childSize.width : childSize.contentX;
			size.height = childSize.contentY === undefined ? childSize.height : childSize.contentY;
		}

		var borders = this._getBorderSizes();
		size.width += borders.horizontal;
		size.height += borders.vertical;

		return size;
	};

	return ViewCell;
}(Cell));

module.exports = ViewCell;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = null;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

function ScaleHelper(gantt){
	var dateHelper = gantt.date;
	var services = gantt.$services;

	return {
		getSum: function (sizes, from, to) {
			if (to === undefined)
				to = sizes.length - 1;
			if (from === undefined)
				from = 0;

			var summ = 0;
			for (var i = from; i <= to; i++)
				summ += sizes[i];

			return summ;
		},
		setSumWidth: function (sum_width, scale, from, to) {
			var parts = scale.width;

			if (to === undefined)
				to = parts.length - 1;
			if (from === undefined)
				from = 0;
			var length = to - from + 1;

			if (from > parts.length - 1 || length <= 0 || to > parts.length - 1)
				return;

			var oldWidth = this.getSum(parts, from, to);

			var diff = sum_width - oldWidth;

			this.adjustSize(diff, parts, from, to);
			this.adjustSize(-diff, parts, to + 1);

			scale.full_width = this.getSum(parts);
		},
		splitSize: function (width, count) {
			var arr = [];
			for (var i = 0; i < count; i++) arr[i] = 0;

			this.adjustSize(width, arr);
			return arr;

		},
		adjustSize: function (width, parts, from, to) {
			if (!from)
				from = 0;
			if (to === undefined)
				to = parts.length - 1;

			var length = to - from + 1;

			var full = this.getSum(parts, from, to);

			var shared = 0;

			for (var i = from; i <= to; i++) {
				var share = Math.floor(width * (full ? (parts[i] / full) : (1 / length)));

				full -= parts[i];
				width -= share;
				length--;

				parts[i] += share;
				shared += share;
			}
			parts[parts.length - 1] += width;
			//parts[parts.length - 1] += width - shared;
		},
		sortScales: function (scales) {
			function cellSize(unit, step) {
				var d = new Date(1970, 0, 1);
				return dateHelper.add(d, step, unit) - d;
			}

			scales.sort(function (a, b) {
				if (cellSize(a.unit, a.step) < cellSize(b.unit, b.step)) {
					return 1;
				} else if (cellSize(a.unit, a.step) > cellSize(b.unit, b.step)) {
					return -1;
				} else {
					return 0;
				}
			});

			for (var i = 0; i < scales.length; i++) {
				scales[i].index = i;
			}
		},
		primaryScale: function () {

			var config = services.getService("templateLoader");
			config.initTemplate("date_scale", undefined, undefined, services.config(), services.templates());

			return {
				unit: services.config().scale_unit,
				step: services.config().step,
				template: services.templates().date_scale,
				date: services.config().date_scale,
				css: services.templates().scale_cell_class
			};
		},

		prepareConfigs: function (scales, min_coll_width, container_width, scale_height, minDate, maxDate) {
			var heights = this.splitSize(scale_height, scales.length);
			var full_width = container_width;

			var configs = [];
			for (var i = scales.length - 1; i >= 0; i--) {
				var main_scale = (i == scales.length - 1);
				var cfg = this.initScaleConfig(scales[i], minDate, maxDate);
				if (main_scale) {
					this.processIgnores(cfg);
				}

				this.initColSizes(cfg, min_coll_width, full_width, heights[i]);
				this.limitVisibleRange(cfg);

				if (main_scale) {
					full_width = cfg.full_width;
				}

				configs.unshift(cfg);
			}


			for (var i = 0; i < configs.length - 1; i++) {
				this.alineScaleColumns(configs[configs.length - 1], configs[i]);
			}
			for (var i = 0; i < configs.length; i++) {
				this.setPosSettings(configs[i]);
			}
			return configs;

		},
		setPosSettings: function (config) {
			for (var i = 0, len = config.trace_x.length; i < len; i++) {
				config.left.push((config.width[i - 1] || 0) + (config.left[i - 1] || 0));
			}
		},

		_ignore_time_config: function (date, scale) {

			if (services.config().skip_off_time) {
				var skip = true;
				var probe = date;

				// check dates in case custom scale unit, e.g. {unit: "month", step: 3}
				for (var i = 0; i < scale.step; i++) {
					if (i) {
						probe = dateHelper.add(date, i, scale.unit);
					}

					skip = skip && !this.isWorkTime(probe, scale.unit);
				}

				return skip;
			}
			return false;
		},
		//defined in an extension
		processIgnores: function (config) {
			config.ignore_x = {};
			config.display_count = config.count;
		},
		initColSizes: function (config, min_col_width, full_width, line_height) {
			var cont_width = full_width;

			config.height = line_height;

			var column_count = config.display_count === undefined ? config.count : config.display_count;

			if (!column_count)
				column_count = 1;

			config.col_width = Math.floor(cont_width / column_count);

			if (min_col_width) {
				if (config.col_width < min_col_width) {
					config.col_width = min_col_width;
					cont_width = config.col_width * column_count;
				}
			}
			config.width = [];
			var ignores = config.ignore_x || {};
			for (var i = 0; i < config.trace_x.length; i++) {
				if (ignores[config.trace_x[i].valueOf()] || (config.display_count == config.count)) {
					config.width[i] = 0;
				} else {
					// width of month columns should be proportional month duration
					var width = 1;
					if (config.unit == "month") {
						var days = Math.round((dateHelper.add(config.trace_x[i], config.step, config.unit) - config.trace_x[i]) / (1000 * 60 * 60 * 24));
						width = days;
					}
					config.width[i] = width;
				}
			}

			this.adjustSize(cont_width - this.getSum(config.width)/* 1 width per column from the code above */, config.width);
			config.full_width = this.getSum(config.width);
		},
		initScaleConfig: function (config, min_date, max_date) {
			var cfg = utils.mixin({
				count: 0,
				col_width: 0,
				full_width: 0,
				height: 0,
				width: [],
				left: [],
				trace_x: [],
				trace_indexes: {},
				min_date: new Date(min_date),
				max_date: new Date(max_date)
			}, config);

			this.eachColumn(config.unit, config.step, min_date, max_date, function (date) {
				cfg.count++;
				cfg.trace_x.push(new Date(date));
				cfg.trace_indexes[date.valueOf()] = cfg.trace_x.length - 1;
			});

			return cfg;
		},
		iterateScales: function (lower_scale, upper_scale, from, to, callback) {
			var upper_dates = upper_scale.trace_x;
			var lower_dates = lower_scale.trace_x;

			var prev = from || 0;
			var end = to || (lower_dates.length - 1);
			var prevUpper = 0;


			for (var up = 1; up < upper_dates.length; up++) {
				var target_index = (lower_scale.trace_indexes[+upper_dates[up]]);
				if (target_index !== undefined && target_index <= end) {
					if (callback) {
						callback.apply(this, [prevUpper, up, prev, target_index]);
					}
					prev = target_index;
					prevUpper = up;
					continue;
				}
			}
		},
		alineScaleColumns: function (lower_scale, upper_scale, from, to) {
			this.iterateScales(lower_scale, upper_scale, from, to, function (upper_start, upper_end, lower_start, lower_end) {
				var targetWidth = this.getSum(lower_scale.width, lower_start, lower_end - 1);
				var actualWidth = this.getSum(upper_scale.width, upper_start, upper_end - 1);
				if (actualWidth != targetWidth) {
					this.setSumWidth(targetWidth, upper_scale, upper_start, upper_end - 1);
				}

			});
		},

		eachColumn: function (unit, step, min_date, max_date, callback) {
			var start = new Date(min_date),
				end = new Date(max_date);
			if (dateHelper[unit + "_start"]) {
				start = dateHelper[unit + "_start"](start);
			}

			var curr = new Date(start);
			if (+curr >= +end) {
				end = dateHelper.add(curr, step, unit);
			}
			while (+curr < +end) {
				callback.call(this, new Date(curr));
				var tzOffset = curr.getTimezoneOffset();
				curr = dateHelper.add(curr, step, unit);
				curr = gantt._correct_dst_change(curr, tzOffset, step, unit);
				if (dateHelper[unit + '_start'])
					curr = dateHelper[unit + "_start"](curr);
			}
		},
		limitVisibleRange: function (cfg) {
			var dates = cfg.trace_x;

			var left = 0, right = cfg.width.length - 1;
			var diff = 0;
			if (+dates[0] < +cfg.min_date && left != right) {
				var width = Math.floor(cfg.width[0] * ((dates[1] - cfg.min_date) / (dates[1] - dates[0])));
				diff += cfg.width[0] - width;
				cfg.width[0] = width;

				dates[0] = new Date(cfg.min_date);
			}

			var last = dates.length - 1;
			var lastDate = dates[last];
			var outDate = dateHelper.add(lastDate, cfg.step, cfg.unit);
			if (+outDate > +cfg.max_date && last > 0) {
				var width = cfg.width[last] - Math.floor(cfg.width[last] * ((outDate - cfg.max_date) / (outDate - lastDate)));
				diff += cfg.width[last] - width;
				cfg.width[last] = width;
			}

			if (diff) {
				var full = this.getSum(cfg.width);
				var shared = 0;
				for (var i = 0; i < cfg.width.length; i++) {
					var share = Math.floor(diff * (cfg.width[i] / full));
					cfg.width[i] += share;
					shared += share;
				}
				this.adjustSize(diff - shared, cfg.width);
			}

		}
	};
}

module.exports = ScaleHelper;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var configurable = function(){
	return {
		$getConfig: function(){
			var own = this.$config.config;
			var global = this.$gantt.config;
			if(own){
				return utils.mixin(own, global);
			}else{
				return global;
			}
		}
	};
};

module.exports = function(obj){
	utils.mixin(obj, configurable());
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var powerArray = __webpack_require__(16);
var utils = __webpack_require__(0);
var eventable = __webpack_require__(2);

var DataStore = function(config){
	this.pull = {};
	this.$initItem = config.initItem;
	this.visibleOrder = powerArray.$create();
	this.fullOrder = powerArray.$create();
	this._skip_refresh = false;
	this._filterRule = null;
	this._searchVisibleOrder = {};
	eventable(this);
	return this;
};
DataStore.prototype = {

	_parseInner: function(data){
		var item = null,
			loaded = [];
		for(var i = 0, len = data.length; i< len; i++){
			item = data[i];
			if(this.$initItem){
				item = this.$initItem(item);
			}
			if(this.callEvent("onItemLoading", [item])){
				this.pull[item.id] = item;
				this.fullOrder.push(item.id);
				loaded.push(item);
			}
		}
		return loaded;
	},
	parse: function(data){
		this.callEvent("onBeforeParse", [data]);
		var loaded = this._parseInner(data);
		this.refresh();
		this.callEvent("onParse", [loaded]);
	},
	getItem: function(id){
		return this.pull[id];
	},

	_updateOrder: function(code){
		code.call(this.visibleOrder);
		code.call(this.fullOrder);
	},
	updateItem: function(id, item){
		if (!utils.defined(item)) item = this.getItem(id);

		if (!this._skip_refresh) {
			if (this.callEvent("onBeforeUpdate", [id, item]) === false) return false;
		}
		this.pull[id]=item;
		if (!this._skip_refresh) {
			this.callEvent("onAfterUpdate", [id, item]);
			this.callEvent("onStoreUpdated", [id, item, "update"]);
		}
	},

	_removeItemInner: function(id){
		//clear from collections
		//this.visibleOrder.$remove(id);
		this._updateOrder(function(){ this.$remove(id);});
		delete this.pull[id];
	},

	removeItem: function(id){
		//utils.assert(this.exists(id), "Not existing ID in remove command"+id);

		var obj = this.getItem(id);	//save for later event
		if (!this._skip_refresh) {
			if (this.callEvent("onBeforeDelete", [id, obj]) === false) return false;
		}

		this._removeItemInner(id);

		if (!this._skip_refresh) {
			this.filter();
			this.callEvent("onAfterDelete", [id, obj]);
			//repaint signal
			this.callEvent("onStoreUpdated", [id, obj, "delete"]);
		}
	},

	_addItemInner: function(item, index){
		//in case of treetable order is sent as 3rd parameter
		//var order = index;

		if(this.exists(item.id)){
			this.silent(function(){this.updateItem(item.id, item);});
		}else{
			var order = this.visibleOrder;

			//by default item is added to the end of the list
			var data_size = order.length;

			if (!utils.defined(index) || index < 0)
				index = data_size;
			//check to prevent too big indexes
			if (index > data_size){
				//dhx.log("Warning","DataStore:add","Index of out of bounds");
				index = Math.min(order.length,index);
			}
		}


		//gantt.assert(!this.exists(id), "Not unique ID");

		this.pull[item.id]=item;
		if (!this._skip_refresh){
			this._updateOrder(function(){ this.$insertAt(item.id,index);});
		}

		//order.$insertAt(item.id,index);
	},


	isVisible: function(id){
		return this.visibleOrder.$find(id) > -1;
	},
	getVisibleItems: function(){
		return this.getIndexRange();
	},

	addItem: function(item, index){
		if (!utils.defined(item.id))
			item.id = utils.uid();


		var id = item.id;

		if(this.$initItem){
			item = this.$initItem(item);
		}

		if (!this._skip_refresh){
			if (this.callEvent("onBeforeAdd", [id, item]) === false) return false;
		}


		this._addItemInner(item, index);

		if (!this._skip_refresh){
			this.callEvent("onAfterAdd",[id, item]);
			//repaint signal
			this.callEvent("onStoreUpdated",[id,item,"add"]);
		}
		return id;
	},

	_changeIdInner: function(oldId, newId){
		if(this.pull[oldId])
			this.pull[newId] = this.pull[oldId];

		this.pull[newId].id = newId;
		this._updateOrder(function(){
			this[this.$find(oldId)] = newId;
		});
		this._searchVisibleOrder[newId] = this._searchVisibleOrder[oldId];
		delete this._searchVisibleOrder[oldId];

		//this.visibleOrder[this.visibleOrder.$find(oldId)]=newId;
		delete this.pull[oldId];
	},
	changeId: function(oldId, newId){
		this._changeIdInner(oldId, newId);

		this.callEvent("onIdChange", [oldId, newId]);

	},
	exists: function(id){
		return !!(this.pull[id]);
	},

	_moveInner: function(sindex, tindex){
		var id = this.getIdByIndex(sindex);

		this._updateOrder(function(){
			this.$removeAt(sindex);
			this.$insertAt(id,Math.min(this.length, tindex));
		});
		//this.visibleOrder.$removeAt(sindex);	//remove at old position
		//if (sindex<tindex) tindex--;	//correct shift, caused by element removing
		//this.visibleOrder.$insertAt(id,Math.min(this.visibleOrder.length, tindex));	//insert at new position
	},

	move: function(sindex, tindex){
		//gantt.assert(sindex>=0 && tindex>=0, "DataStore::move","Incorrect indexes");

		var id = this.getIdByIndex(sindex);
		var obj = this.getItem(id);
		this._moveInner(sindex, tindex);


		if (!this._skip_refresh) {
			//repaint signal
			this.callEvent("onStoreUpdated", [id, obj, "move"]);
		}
	},
	clearAll: function(){
		this.pull = {};
		this.visibleOrder = powerArray.$create();
		this.fullOrder = powerArray.$create();
		if (this._skip_refresh) return;
		this.callEvent("onClearAll",[]);
		this.refresh();
	},

	silent:function(code, master){
		this._skip_refresh = true;
		code.call(master||this);
		this._skip_refresh = false;
	},

	arraysEqual: function (arr1, arr2) {
		if(arr1.length !== arr2.length)
			return false;
		for(var i = 0; i < arr1.length; i++) {
			if(arr1[i] !== arr2[i])
				return false;
		}

		return true;
	},

	refresh: function(id){
		if (this._skip_refresh) return;

		if(id){
			// if item changes visible order (e.g. expand-collapse branch) - do a complete repaint
			var oldOrder = this.visibleOrder;
			this.filter();
			if(!this.arraysEqual(oldOrder, this.visibleOrder)){
				id = undefined;
			}
		}else{
			this.filter();
		}

		if (id)
			this.callEvent("onStoreUpdated",[id, this.pull[id], "paint"]);
		else
			this.callEvent("onStoreUpdated",[null,null,null]);
	},

	count: function(){
		return this.fullOrder.length;
	},
	countVisible: function(){
		return this.visibleOrder.length;
	},

	sort: function(sort){},

	serialize: function(){},

	eachItem: function(code){
		for (var i=0; i<this.fullOrder.length; i++) {
			var item = this.pull[this.fullOrder[i]];
			code.call(this, item);
		}
	},
	
	filter: function(rule){
		var filteredOrder = powerArray.$create();
		this.eachItem(function(item){
			if(this.callEvent("onFilterItem", [item.id, item])){
				filteredOrder.push(item.id);
			}
		});

		this.visibleOrder = filteredOrder;
		this._searchVisibleOrder = {};
		for(var i = 0; i < this.visibleOrder.length; i++){
			this._searchVisibleOrder[this.visibleOrder[i]] = i;
		}
	},

	getIndexRange: function(from, to){
		to=Math.min((to||Infinity),this.countVisible()-1);

		var ret= [];
		for (var i=(from||0); i <= to; i++)
			ret.push(this.getItem(this.visibleOrder[i]));
		return ret;
	},
	getItems: function(){
		var res = [];
		for(var i = 0; i < this.fullOrder.length; i++){
			res.push(this.pull[this.fullOrder[i]]);
		}
		return res;
	},

	getIdByIndex: function(index){
		return this.visibleOrder[index];
	},
	getIndexById: function(id){
		var res = this._searchVisibleOrder[id];
		if(res === undefined){
			res = -1;
		}
		return res;
	},
	gerFirst: function(){
		return this.visibleOrder[0];
	},
	getLast: function(){
		return this.visibleOrder[this.visibleOrder.length-1];
	},
	getNext: function(id){
		return this.visibleOrder[this.getIndexById(id) + 1];
	},
	getPrev: function(id){
		return this.visibleOrder[this.getIndexById(id) - 1];
	}
};

module.exports = DataStore;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var $powerArray  = {
	$create: function(array){
		return utils.mixin(array || [], this);
	},
	//remove element at specified position
	$removeAt:function(pos,len){
		if (pos>=0) this.splice(pos,(len||1));
	},
	//find element in collection and remove it
	$remove:function(value){
		this.$removeAt(this.$find(value));
	},
	//add element to collection at specific position
	$insertAt:function(data,pos){
		if (!pos && pos!==0) 	//add to the end by default
			this.push(data);
		else {
			var b = this.splice(pos,(this.length-pos));
			this[pos] = data;
			this.push.apply(this,b); //reconstruct array without loosing this pointer
		}
	},
	//return index of element, -1 if it doesn't exists
	$find:function(data){
		for (var i=0; i<this.length; i++)
			if (data==this[i]) return i;
		return -1;
	},
	//execute some method for each element of array
	$each:function(functor,master){
		for (var i=0; i < this.length; i++)
			functor.call((master||this),this[i]);
	},
	//create new array from source, by using results of functor
	$map:function(functor,master){
		for (var i=0; i < this.length; i++)
			this[i]=functor.call((master||this),this[i]);
		return this;
	},
	$filter:function(functor, master){
		for (var i=0; i < this.length; i++)
			if (!functor.call((master||this),this[i])){
				this.splice(i,1);
				i--;
			}
		return this;
	}
};

module.exports = $powerArray;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var ScaleHelper = __webpack_require__(13);


function dateRangeResolver(gantt){
	//reset project timing
	//_get_tasks_data(gantt);
	return gantt.getSubtaskDates();
}

function defaultRangeResolver(){
	return {
		start_date: new Date(),
		end_date: new Date()
	};
}

function resolveConfigRange(unit, gantt){
	var range = {
		start_date:null,
		end_date:null
	};

	if (gantt.config.start_date && gantt.config.end_date) {
		range.start_date = gantt.date[unit + "_start"](new Date(gantt.config.start_date));

		var end = new Date(gantt.config.end_date);
		var start_interval = gantt.date[unit + "_start"](new Date(end));
		if (+end != +start_interval) {
			end = gantt.date.add(start_interval, 1, unit);
		} else {
			end = start_interval;
		}

		range.end_date = end;
	}
	return range;
}

function _scale_range_unit(gantt) {
	var unit = gantt.config.scale_unit;
	if (gantt.config.scale_offset_minimal) {

		var helper = new ScaleHelper(gantt);
		var scales = [helper.primaryScale()].concat(gantt.config.subscales);

		helper.sortScales(scales);
		unit = scales[scales.length - 1].unit;
	}
	return unit;
}

function _init_tasks_range(gantt) {
	var unit = _scale_range_unit(gantt);
	var range = resolveConfigRange(unit, gantt);

	if(!(range.start_date && range.end_date)){
		range = dateRangeResolver(gantt);
		if(!range.start_date || !range.end_date){
			range = defaultRangeResolver(gantt);
		}

		range.start_date = gantt.date[unit + "_start"](range.start_date);
		range.start_date = gantt.calculateEndDate({
			start_date: gantt.date[unit + "_start"](range.start_date),
			duration: -1,
			unit: unit
		});//one free column before first task

		range.end_date = gantt.date[unit + "_start"](range.end_date);
		range.end_date = gantt.calculateEndDate({start_date: range.end_date, duration: 2, unit: unit});//one free column after last task
	}

	gantt._min_date = range.start_date;
	gantt._max_date = range.end_date;
}

function _adjust_scales(gantt) {
	if (gantt.config.fit_tasks) {
		var old_min = +gantt._min_date,
			old_max = +gantt._max_date;
		//this._init_tasks_range();
		if (+gantt._min_date != old_min || +gantt._max_date != old_max) {
			gantt.render();

			gantt.callEvent("onScaleAdjusted", []);
			return true;
		}
	}
	return false;
}

module.exports = function updateTasksRange(gantt){
	_init_tasks_range(gantt);
	_adjust_scales(gantt);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var dateHelper = __webpack_require__(3);

var calendarArgumentsHelper = function(gantt){
	return {
		getWorkHoursArguments: function () {
			var config = arguments[0];
			if (dateHelper.isDate(config)) {
				config = {
					date: config
				};
			} else {
				config = utils.mixin({}, config);
			}
			return config;
		},
		setWorkTimeArguments: function () {
			return arguments[0];
		},
		unsetWorkTimeArguments: function () {
			return arguments[0];
		},
		isWorkTimeArguments: function () {
			var config = arguments[0];
			if (!config.date) {
				config = {};
				config.date = arguments[0];
				config.unit = arguments[1];
				config.task = arguments[2];
				config.calendar = arguments[3];
			} else {
				config = utils.mixin({}, config);
				config.unit = config.unit || gantt.config.duration_unit;
				config.task = config.task || null;
				config.calendar = config.calendar || null;
			}

			config.unit = config.unit || gantt.config.duration_unit;

			return config;
		},
		getClosestWorkTimeArguments: function (config) {
			config = arguments[0];
			if (dateHelper.isDate(config)) {
				config = {
					date: config
				};
			} else {
				config = utils.mixin({}, config);
			}
			config.dir = config.dir || 'any';
			config.unit = config.unit || gantt.config.duration_unit;

			return config;
		},

		getDurationConfig: function (start, end, task, calendar) {
			this.start_date = start;
			this.end_date = end;
			this.task = task;
			this.calendar = calendar;
			this.unit = null;
			this.step = null;
			return this;
		},
		_getStartEndConfig: function (param) {
			var argumentType = this.getDurationConfig;
			var config;
			if (param instanceof argumentType)
				return param;

			if (dateHelper.isDate(param)) {
				config = new argumentType(arguments[0], arguments[1], arguments[2], arguments[3]);
			} else {
				config = new argumentType(param.start_date, param.end_date, param.task);
				if (param.id) {
					config.task = param;
				}
			}

			config.unit = config.unit || gantt.config.duration_unit;
			config.step = config.step || gantt.config.duration_step;
			config.start_date = config.start_date || config.start || config.date;

			return config;
		},

		getDurationArguments: function (start, end, unit, step) {
			return this._getStartEndConfig.apply(this, arguments);
		},

		hasDurationArguments: function (start, end, unit, step) {
			return this._getStartEndConfig.apply(this, arguments);
		},

		calculateEndDateArguments: function (start, duration, unit, step) {
			var config = arguments[0];
			if (dateHelper.isDate(config)) {
				config = {
					start_date: arguments[0],
					duration: arguments[1],
					unit: arguments[2],
					task: arguments[3],
					calendar: arguments[4]
				};
			} else {
				config = utils.mixin({}, config);
			}

			config.unit = config.unit || gantt.config.duration_unit;
			config.step = config.step || gantt.config.duration_step;

			return config;
		}
	};
};


module.exports = calendarArgumentsHelper;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(20);


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {


window.gantt = __webpack_require__(21)();

__webpack_require__(96)(window.gantt);


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function() {

	var gantt = {
		version: "5.0.5",
		templates: {},
		keys: {
			edit_save: 13,
			edit_cancel: 27
		}
	};

	__webpack_require__(22)(gantt);

	gantt.$services = gantt.$inject(__webpack_require__(23));
	gantt.config = gantt.$inject(__webpack_require__(24));
	gantt.ajax =  __webpack_require__(25)(gantt);
	gantt.date = __webpack_require__(26)(gantt);
	var dnd = __webpack_require__(27)(gantt);
	gantt.$services.setService("dnd", function(){return dnd;});

	gantt.$services.setService("config", function () {
		return gantt.config;
	});
	gantt.$services.setService("date", function () {
		return gantt.date;
	});
	gantt.$services.setService("locale", function () {
		return gantt.locale;
	});
	gantt.$services.setService("templates", function () {
		return gantt.templates;
	});

	var templatesLoader = __webpack_require__(28)(gantt);
	gantt.$services.setService("templateLoader", function () {
		return templatesLoader;
	});

	var eventable = __webpack_require__(2);
	eventable(gantt);

	var StateService = __webpack_require__(29);
	var stateService = new StateService();

	stateService.registerProvider("global", function () {
		return {
			min_date: gantt._min_date,
			max_date: gantt._max_date,
			selected_task: gantt._selected_task
		};
	});
	gantt.getState = stateService.getState;
	gantt.$services.setService("state", function () {
		return stateService;
	});

	var utils = __webpack_require__(0);
	utils.mixin(gantt, utils);
	gantt.env = __webpack_require__(6);

	utils.mixin(gantt, __webpack_require__(30)(gantt));
	var uiApi = __webpack_require__(31).init(gantt);
	gantt.$ui = uiApi.factory;
	gantt.$ui.layers = uiApi.render;
	gantt.$mouseEvents = uiApi.mouseEvents;
	gantt.$services.setService("mouseEvents", function () {
		return gantt.$mouseEvents;
	});
	gantt.mixin(gantt, uiApi.layersApi);

	__webpack_require__(51)(gantt);

	gantt.$services.setService("layers", function () {
		return uiApi.layersService;
	});

	__webpack_require__(52)(gantt);

	__webpack_require__(58)(gantt);
	__webpack_require__(61)(gantt);

	__webpack_require__(67)(gantt);
	__webpack_require__(68)(gantt);
	__webpack_require__(69)(gantt);
	__webpack_require__(70)(gantt);
	__webpack_require__(71)(gantt);
	__webpack_require__(72)(gantt);
	__webpack_require__(79)(gantt);
	__webpack_require__(80)(gantt);
	__webpack_require__(81)(gantt);
	__webpack_require__(82)(gantt);
	__webpack_require__(83)(gantt);
	__webpack_require__(84)(gantt);
	__webpack_require__(85)(gantt);
	__webpack_require__(86)(gantt);
	__webpack_require__(87)(gantt);
	__webpack_require__(88)(gantt);
	__webpack_require__(89)(gantt);
	__webpack_require__(90)(gantt);
	__webpack_require__(91)(gantt);
	__webpack_require__(92)(gantt);
	__webpack_require__(93)(gantt);
	__webpack_require__(94)(gantt);

	return gantt;
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = function(gantt){
	gantt.$inject = function(module){
		return module(this.$services);
	};
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = function(){
	var services = {};
	function register (name, getter){
		services[name] = getter;
	}

	function getService(name){
		if(!services[name]){
			return null;
		}
		return services[name]();
	}

	var servicesEnum = {
		"config": "config",
		"templates": "templates",
		"locale": "locale"
	};

	return {
		services: servicesEnum,
		setService: register,
		getService: getService,
		config: function(){
			return this.getService("config");
		},
		templates: function(){
			return this.getService("templates");
		},
		locale: function(){
			return this.getService("locale");
		}
	};
};
/*
var services = {};
function register (name, getter){
	services[name] = getter;
}

function getService(name){
	if(!services[name]){
		return null;
	}
	return services[name]();
}

var servicesEnum = {
	"config": "config",
	"templates": "templates",
	"locale": "locale"
};

module.exports = {
	services: servicesEnum,
	setService: register,
	getService: getService,
	config: function(){
		return this.getService("config");
	},
	templates: function(){
		return this.getService("templates");
	},
	locale: function(){
		return this.getService("locale");
	}
};*/

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function() {
	return {
		layout: {
			css: "gantt_container",
			rows: [
				{
					cols: [
						{view: "grid", id: "grid", scrollX: "scrollHor", scrollY: "scrollVer"},
						{resizer: true, width: 1},
						{view: "timeline", id: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
						{view: "scrollbar", scroll: "y", id: "scrollVer"}
					]

				},
				{view: "scrollbar", scroll: "x", id: "scrollHor", height: 20}
			]
		},
		links: {
			"finish_to_start": "0",
			"start_to_start": "1",
			"finish_to_finish": "2",
			"start_to_finish": "3"
		},
		types: {
			'task': 'task',
			'project': 'project',
			'milestone': 'milestone'
		},
		duration_unit: "day",
		work_time: false,
		correct_work_time: false,
		skip_off_time: false,

		cascade_delete: true,

		autosize: false,
		autosize_min_width: 0,
		autoscroll: true,
		autoscroll_speed: 30,

		show_links: true,
		show_task_cells: true,
		// replace backgroung of the task area with a canvas img
		static_background: false,
		branch_loading: false,
		show_loading: false,
		show_chart: true,
		show_grid: true,
		min_duration: 60 * 60 * 1000,
		xml_date: "%d-%m-%Y %H:%i",
		api_date: "%d-%m-%Y %H:%i",
		start_on_monday: true,
		server_utc: false,
		show_progress: true,
		fit_tasks: false,
		select_task: true,
		scroll_on_click: true,
		preserve_scroll: true,
		readonly: false,

		/*grid */
		date_grid: "%Y-%m-%d",

		drag_links: true,
		drag_progress: true,
		drag_resize: true,
		drag_move: true,
		drag_mode: {
			"resize": "resize",
			"progress": "progress",
			"move": "move",
			"ignore": "ignore"
		},
		round_dnd_dates: true,
		link_wrapper_width: 20,
		root_id: 0,

		autofit: false, // grid column automatic fit grid_width config
		columns: [
			{name: "text", tree: true, width: '*', resize: true},
			{name: "start_date", align: "center", resize: true},
			{name: "duration", align: "center"},
			{name: "add", width: '44'}
		],

		/*scale*/
		step: 1,
		scale_unit: "day",
		scale_offset_minimal: true,
		subscales: [],

		inherit_scale_class: false,

		time_step: 60,
		duration_step: 1,
		date_scale: "%d %M",
		task_date: "%d %F %Y",
		time_picker: "%H:%i",
		task_attribute: "task_id",
		link_attribute: "link_id",
		layer_attribute: "data-layer",
		buttons_left: [
			"gantt_save_btn",
			"gantt_cancel_btn"
		],
		_migrate_buttons: {
			"dhx_save_btn": "gantt_save_btn",
			"dhx_cancel_btn": "gantt_cancel_btn",
			"dhx_delete_btn": "gantt_delete_btn"
		},
		buttons_right: [
			"gantt_delete_btn"
		],
		lightbox: {
			sections: [
				{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
				{name: "time", type: "duration", map_to: "auto"}
			],
			project_sections: [
				{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
				{name: "type", type: "typeselect", map_to: "type"},
				{name: "time", type: "duration", readonly: true, map_to: "auto"}
			],
			milestone_sections: [
				{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
				{name: "type", type: "typeselect", map_to: "type"},
				{name: "time", type: "duration", single_date: true, map_to: "auto"}
			]
		},
		drag_lightbox: true,
		sort: false,
		details_on_create: true,
		details_on_dblclick: true,
		initial_scroll: true,
		task_scroll_offset: 100,

		order_branch: false,
		order_branch_free: false,

		task_height: "full",//number px of 'full' for row height
		min_column_width: 70,

		// min width for grid column (when resizing)
		min_grid_column_width: 70,
		// name of the attribute with column index for resize element
		grid_resizer_column_attribute: "column_index",
		// name of the attribute with column index for resize element
		grid_resizer_attribute: "grid_resizer",

		// grid width can be increased after the column has been resized
		keep_grid_width: false,

		// grid width can be adjusted
		grid_resize: false,

		show_unscheduled: true,

		//
		readonly_property: "readonly",
		editable_property: "editable",
		calendar_property: "calendar_id",
		resource_calendars: {},

		type_renderers: {},

		open_tree_initially: false,
		optimize_render: true,
		prevent_default_scroll: false,
		show_errors: true,
		wai_aria_attributes: true,
		smart_scales: true
	};
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var env = __webpack_require__(6);

module.exports = function(gantt){
	return {

		// if false - dhxr param will added to prevent caching on client side (default),
		// if true - do not add extra params
		cache: true,

		// default method for load/loadStruct, post/get allowed
		// get - since 4.1.1, this should fix 412 error for macos safari
		method: "get",

		parse: function(data) {
			if (typeof data !== "string") return data;

			var obj;
			data = data.replace(/^[\s]+/,"");
			if (window.DOMParser && !env.isIE) { // ff,ie9
				obj = (new window.DOMParser()).parseFromString(data, "text/xml");
			} else if (window.ActiveXObject !== window.undefined) {
				obj = new window.ActiveXObject("Microsoft.XMLDOM");
				obj.async = "false";
				obj.loadXML(data);
			}
			return obj;
		},
		xmltop: function(tagname, xhr, obj) {
			if (typeof xhr.status == "undefined" || xhr.status < 400) {
				var xml = (!xhr.responseXML) ? this.parse(xhr.responseText || xhr) : (xhr.responseXML || xhr);
				if (xml && xml.documentElement !== null && !xml.getElementsByTagName("parsererror").length) {
					return xml.getElementsByTagName(tagname)[0];
				}
			}
			if (obj !== -1) gantt.callEvent("onLoadXMLError",["Incorrect XML", arguments[1], obj]);
			return document.createElement("DIV");
		},
		xpath: function(xpathExp, docObj) {
			if (!docObj.nodeName) docObj = docObj.responseXML || docObj;
			if (env.isIE) {
				return docObj.selectNodes(xpathExp)||[];
			} else {
				var rows = [];
				var first;
				var col = (docObj.ownerDocument||docObj).evaluate(xpathExp, docObj, null, XPathResult.ANY_TYPE, null);

				while (true){
					first = col.iterateNext();
					if(first){
						rows.push(first);
					}else{
						break;
					}
				}
				return rows;
			}
		},
		query: function(config) {
			this._call(
				(config.method || "GET"),
				config.url,
				config.data || "",
				(config.async || true),
				config.callback,
				null,
				config.headers
			);
		},
		get: function(url, onLoad) {
			this._call("GET", url, null, true, onLoad);
		},
		getSync: function(url) {
			return this._call("GET", url, null, false);
		},
		put: function(url, postData, onLoad) {
			this._call("PUT", url, postData, true, onLoad);
		},
		del: function(url, postData, onLoad) {
			this._call("DELETE", url, postData, true, onLoad);
		},
		post: function(url, postData, onLoad) {
			if (arguments.length == 1) {
				postData = "";
			} else if (arguments.length == 2 && (typeof(postData) == "function" || typeof(window[postData]) == "function")) {
				onLoad = postData;
				postData = "";
			} else {
				postData = String(postData);
			}
			this._call("POST", url, postData, true, onLoad);
		},
		postSync: function(url, postData) {
			postData = (postData === null ? "" : String(postData));
			return this._call("POST", url, postData, false);
		},
		getLong: function(url, onLoad) {
			this._call("GET", url, null, true, onLoad, {url:url});
		},
		postLong: function(url, postData, onLoad) {
			if (arguments.length == 2 && (typeof(postData) == "function" || typeof(window[postData]))) {
				onLoad = postData;
				postData = "";
			}
			this._call("POST", url, postData, true, onLoad, {url:url, postData:postData});
		},
		_call: function(method, url, postData, async, onLoad, longParams, headers) {

			var t = (window.XMLHttpRequest && !env.isIE ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
			var isQt = (navigator.userAgent.match(/AppleWebKit/) !== null && navigator.userAgent.match(/Qt/) !== null && navigator.userAgent.match(/Safari/) !== null);

			if (!!async) {
				t.onreadystatechange = function() {
					if ((t.readyState == 4) || (isQt && t.readyState == 3)) { // what for long response and status 404?
						if (t.status != 200 || t.responseText === "")
							if (!gantt.callEvent("onAjaxError", [t])) return;

						window.setTimeout(function(){
							if (typeof(onLoad) == "function") {
								onLoad.apply(window, [{xmlDoc:t, filePath:url}]); // dhtmlx-compat, response.xmlDoc.responseXML/responseText
							}
							if (longParams) {
								if (typeof(longParams.postData) != "undefined") {
									this.postLong(longParams.url, longParams.postData, onLoad);
								} else {
									this.getLong(longParams.url, onLoad);
								}
							}
							onLoad = null;
							t = null;
						},1);
					}
				};
			}

			if (method == "GET" && !this.cache) {
				url += (url.indexOf("?")>=0?"&":"?")+"dhxr"+new Date().getTime()+"=1";
			}

			t.open(method, url, async);

			if (headers){
				for (var key in headers)
					t.setRequestHeader(key, headers[key]);
			} else if (method.toUpperCase() == "POST" || method == "PUT" || method == "DELETE") {
				t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			} else if (method == "GET") {
				postData = null;
			}

			t.setRequestHeader("X-Requested-With", "XMLHttpRequest");

			t.send(postData);

			if (!async) return {xmlDoc:t, filePath:url}; // dhtmlx-compat, response.xmlDoc.responseXML/responseText

		},
		urlSeparator: function(str){
			if (str.indexOf("?") != -1)
				return "&";
			else
				return "?";
		}
	};
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	var dateHelper = {
		init: function () {
			var locale = gantt.locale;

			var s = locale.date.month_short;
			var t = locale.date.month_short_hash = {};
			for (var i = 0; i < s.length; i++)
				t[s[i]] = i;

			var s = locale.date.month_full;
			var t = locale.date.month_full_hash = {};
			for (var i = 0; i < s.length; i++)
				t[s[i]] = i;
		},
		date_part: function (date) {
			var old = new Date(date);
			date.setHours(0);
			this.hour_start(date);
			if (date.getHours() && //shift to yesterday on dst
				(date.getDate() < old.getDate() || date.getMonth() < old.getMonth() || date.getFullYear() < old.getFullYear()))
				date.setTime(date.getTime() + 60 * 60 * 1000 * (24 - date.getHours()));
			return date;
		},
		time_part: function (date) {
			return (date.valueOf() / 1000 - date.getTimezoneOffset() * 60) % 86400;
		},
		week_start: function (date) {
			var shift = date.getDay();
			if (gantt.config.start_on_monday) {
				if (shift === 0) shift = 6;
				else shift--;
			}
			return this.date_part(this.add(date, -1 * shift, "day"));
		},
		month_start: function (date) {
			date.setDate(1);
			return this.date_part(date);
		},
		quarter_start: function (date) {
			this.month_start(date);
			var m = date.getMonth(),
				res_month;

			if (m >= 9) {
				res_month = 9;
			} else if (m >= 6) {
				res_month = 6;
			} else if (m >= 3) {
				res_month = 3;
			} else {
				res_month = 0;
			}

			date.setMonth(res_month);
			return date;
		},
		year_start: function (date) {
			date.setMonth(0);
			return this.month_start(date);
		},
		day_start: function (date) {
			return this.date_part(date);
		},
		hour_start: function (date) {
			if (date.getMinutes())
				date.setMinutes(0);
			this.minute_start(date);

			return date;
		},
		minute_start: function (date) {
			if (date.getSeconds())
				date.setSeconds(0);
			if (date.getMilliseconds())
				date.setMilliseconds(0);
			return date;
		},
		_add_days: function (date, inc) {
			var ndate = new Date(date.valueOf());

			ndate.setDate(ndate.getDate() + inc);
			if (inc >= 0 && (!date.getHours() && ndate.getHours()) &&//shift to yesterday on dst
				(ndate.getDate() <= date.getDate() || ndate.getMonth() < date.getMonth() || ndate.getFullYear() < date.getFullYear()))
				ndate.setTime(ndate.getTime() + 60 * 60 * 1000 * (24 - ndate.getHours()));
			return ndate;
		},

		add: function (date, inc, mode) {
			/*jsl:ignore*/
			var ndate = new Date(date.valueOf());
			switch (mode) {
				case "day":
					ndate = this._add_days(ndate, inc);
					break;
				case "week":
					ndate = this._add_days(ndate, inc * 7);
					break;
				case "month":
					ndate.setMonth(ndate.getMonth() + inc);
					break;
				case "year":
					ndate.setYear(ndate.getFullYear() + inc);
					break;
				case "hour":
					/*
						adding hours/minutes via setHour(getHour() + inc) gives weird result when
						adding one hour to the time before switch to a Daylight Saving time

						example: //Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)
						new Date(2014, 02, 30, 1).setHours(2)
						>>Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)

						setTime seems working as expected
					 */
					ndate.setTime(ndate.getTime() + inc * 60 * 60 * 1000);
					break;
				case "minute":

					ndate.setTime(ndate.getTime() + inc * 60 * 1000);

					break;
				default:
					return this["add_" + mode](date, inc, mode);
			}
			return ndate;
			/*jsl:end*/
		},
		add_quarter: function (date, inc) {
			return this.add(date, inc * 3, "month");
		},

		to_fixed: function (num) {
			if (num < 10) return "0" + num;
			return num;
		},
		copy: function (date) {
			return new Date(date.valueOf());
		},
		date_to_str: function (format, utc) {
			format = format.replace(/%[a-zA-Z]/g, function (a) {
				switch (a) {
					case "%d":
						return "\"+to_fixed(date.getDate())+\"";
					case "%m":
						return "\"+to_fixed((date.getMonth()+1))+\"";
					case "%j":
						return "\"+date.getDate()+\"";
					case "%n":
						return "\"+(date.getMonth()+1)+\"";
					case "%y":
						return "\"+to_fixed(date.getFullYear()%100)+\"";
					case "%Y":
						return "\"+date.getFullYear()+\"";
					case "%D":
						return "\"+locale.date.day_short[date.getDay()]+\"";
					case "%l":
						return "\"+locale.date.day_full[date.getDay()]+\"";
					case "%M":
						return "\"+locale.date.month_short[date.getMonth()]+\"";
					case "%F":
						return "\"+locale.date.month_full[date.getMonth()]+\"";
					case "%h":
						return "\"+to_fixed((date.getHours()+11)%12+1)+\"";
					case "%g":
						return "\"+((date.getHours()+11)%12+1)+\"";
					case "%G":
						return "\"+date.getHours()+\"";
					case "%H":
						return "\"+to_fixed(date.getHours())+\"";
					case "%i":
						return "\"+to_fixed(date.getMinutes())+\"";
					case "%a":
						return "\"+(date.getHours()>11?\"pm\":\"am\")+\"";
					case "%A":
						return "\"+(date.getHours()>11?\"PM\":\"AM\")+\"";
					case "%s":
						return "\"+to_fixed(date.getSeconds())+\"";
					case "%W":
						return "\"+to_fixed(getISOWeek(date))+\"";
					default:
						return a;
				}
			});
			if (utc) format = format.replace(/date\.get/g, "date.getUTC");
			var dateToStr = new Function("date", "to_fixed", "locale", "getISOWeek", "return \"" + format + "\";");

			return function (date) {
				return dateToStr(date, dateHelper.to_fixed, gantt.locale, dateHelper.getISOWeek);
			};
		},
		str_to_date: function (format, utc) {
			var splt = "var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
			var mask = format.match(/%[a-zA-Z]/g);
			for (var i = 0; i < mask.length; i++) {
				switch (mask[i]) {
					case "%j":
					case "%d":
						splt += "set[2]=temp[" + i + "]||1;";
						break;
					case "%n":
					case "%m":
						splt += "set[1]=(temp[" + i + "]||1)-1;";
						break;
					case "%y":
						splt += "set[0]=temp[" + i + "]*1+(temp[" + i + "]>50?1900:2000);";
						break;
					case "%g":
					case "%G":
					case "%h":
					case "%H":
						splt += "set[3]=temp[" + i + "]||0;";
						break;
					case "%i":
						splt += "set[4]=temp[" + i + "]||0;";
						break;
					case "%Y":
						splt += "set[0]=temp[" + i + "]||0;";
						break;
					case "%a":
					case "%A":
						splt += "set[3]=set[3]%12+((temp[" + i + "]||'').toLowerCase()=='am'?0:12);";
						break;
					case "%s":
						splt += "set[5]=temp[" + i + "]||0;";
						break;
					case "%M":
						splt += "set[1]=locale.date.month_short_hash[temp[" + i + "]]||0;";
						break;
					case "%F":
						splt += "set[1]=locale.date.month_full_hash[temp[" + i + "]]||0;";
						break;
					default:
						break;
				}
			}
			var code = "set[0],set[1],set[2],set[3],set[4],set[5]";
			if (utc) code = " Date.UTC(" + code + ")";
			var strToDate = new Function("date", "locale", "var set=[0,0,1,0,0,0]; " + splt + " return new Date(" + code + ");");

			return function (dateString) {
				return strToDate(dateString, gantt.locale);
			};
		},
		getISOWeek: function (ndate) {
			if (!ndate) return false;
			var nday = ndate.getDay();
			if (nday === 0) {
				nday = 7;
			}
			var first_thursday = new Date(ndate.valueOf());
			first_thursday.setDate(ndate.getDate() + (4 - nday));
			var year_number = first_thursday.getFullYear(); // year of the first Thursday
			var ordinal_date = Math.round((first_thursday.getTime() - new Date(year_number, 0, 1).getTime()) / 86400000); //ordinal date of the first Thursday - 1 (so not really ordinal date)
			var week_number = 1 + Math.floor(ordinal_date / 7);
			return week_number;
		},
		getUTCISOWeek: function (ndate) {
			return this.getISOWeek(ndate);
		},
		convert_to_utc: function (date) {
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		},
		parseDate: function (date, format) {
			// raw date may be of type string, number (timestamp) or something else
			// do not check for instanceof Date explicitly, since we may swap native date with different date implementation at some point
			if (date && !date.getFullYear) {
				if (gantt.defined(format)) {
					if (typeof(format) == "string")
						format = gantt.defined(gantt.templates[format]) ? gantt.templates[format] : gantt.date.str_to_date(format);
					else
						format = gantt.templates.xml_date;
				}
				if (date)
					date = format(date);
				else
					date = null;
			}
			return date;
		}
	};
	return dateHelper;
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var eventable = __webpack_require__(2);
var utils = __webpack_require__(0);
var timeout = __webpack_require__(8);

module.exports = function(gantt){
	function DnD(obj, config) {
		this._obj = obj;
		if (config) {
			this._settings = config;
		}
		eventable(this);

		var inputMethods = this.getInputMethods();

		this._drag_start_timer = null;
		gantt.attachEvent("onGanttScroll", utils.bind(function (left, top) {
			this.clearDragTimer();
		}, this));

		for(var i = 0; i < inputMethods.length; i++){
			(utils.bind(function(input){

				utils.event(obj, input.down, utils.bind(function (e) {
					if(!input.accessor(e)){
						return;
					}

					config.original_target = {target: e.target || e.srcElement};
					if (gantt.config.touch) {
						this.clearDragTimer();

						this._drag_start_timer = setTimeout(utils.bind(function () {
							this.dragStart(obj, e, input);
						}, this), gantt.config.touch_drag);
					}
					else {
						this.dragStart(obj, e, input);
					}
				}, this));

				utils.event(document.body, input.up, utils.bind(function (e) {
					if(!input.accessor(e)){
						return;
					}
					this.clearDragTimer();
				}, this));

			}, this))(inputMethods[i]);
		}
	}

	DnD.prototype = {
		traceDragEvents: function (domElement, inputMethod) {
			var mousemove = utils.bind(function (e) {
				return this.dragMove(domElement, e, inputMethod.accessor);
			}, this);
			var scroll = utils.bind(function (e) {
				return this.dragScroll(domElement, e);
			}, this);

			var limited_mousemove = utils.bind(function (e) {
				if (e && e.preventDefault) //Cancel default action on DND
					e.preventDefault();
				(e || event).cancelBubble = true;
				if (utils.defined(this.config.updates_per_second)) {
					if (!timeout(this, this.config.updates_per_second))
						return true;
				}
				return mousemove(e);
			}, this);

			var mouseup = utils.bind(function (e) {
				utils.eventRemove(document.body, inputMethod.move, limited_mousemove);
				utils.eventRemove(document.body, inputMethod.up, mouseup);
				return this.dragEnd(domElement);
			}, this);


			utils.event(document.body, inputMethod.move, limited_mousemove);
			utils.event(document.body, inputMethod.up, mouseup);
		},
		checkPositionChange: function (pos) {
			var diff_x = pos.x - this.config.pos.x;
			var diff_y = pos.y - this.config.pos.y;
			var distance = Math.sqrt(Math.pow(Math.abs(diff_x), 2) + Math.pow(Math.abs(diff_y), 2));

			if (distance > this.config.sensitivity) {
				return true;
			} else {
				return false;
			}
		},
		initDnDMarker: function () {
			// create dnd placeholder and put it in dom
			var marker = this.config.marker = document.createElement("div");
			marker.className = "gantt_drag_marker";
			marker.innerHTML = "Dragging object";
			document.body.appendChild(marker);
		},
		backupEventTarget: function (domEvent, getEvent) {
			if (!gantt.config.touch) {
				return;
			}

			// keep original event target in DOM in order to keep dnd on touchmove event
			var e = getEvent(domEvent);

			var el = e.target || e.srcElement;
			var copy = el.cloneNode(true);
			//this.config.target.target = copy;
			this.config.original_target = {target: copy};
			this.config.backup_element = el;
			el.parentNode.appendChild(copy);

			el.style.display = "none";
			document.body.appendChild(el);
		},
		getInputMethods: function () {
			// bind actions to browser events
			var inputMethods = [];

			inputMethods.push({
				"move": "mousemove",
				"down": "mousedown",
				"up": "mouseup",
				"accessor": function (e) {
					return e;
				}
			});

			if (gantt.config.touch) {

				var touchEventsSupported = true;
				try{
					document.createEvent("TouchEvent");
				}catch (e){
					touchEventsSupported = false;
				}

				if(touchEventsSupported){
					inputMethods.push({
						"move": "touchmove",
						"down": "touchstart",
						"up": "touchend",
						"accessor": function (ev) {
							if (ev.touches && ev.touches.length > 1) return null;
							if (ev.touches[0])
								return {
									target: document.elementFromPoint(ev.touches[0].clientX, ev.touches[0].clientY),
									pageX: ev.touches[0].pageX,
									pageY: ev.touches[0].pageY,
									clientX: ev.touches[0].clientX,
									clientY: ev.touches[0].clientY
								};
							else
								return ev;
						}
					});
				}else if(window.navigator.pointerEnabled){
					inputMethods.push({
						"move": "pointermove",
						"down": "pointerdown",
						"up": "pointerup",
						"accessor": function (ev) {
							if (ev.pointerType == "mouse") return null;
							return ev;
						}
					});

				}else if (window.navigator.msPointerEnabled){
					inputMethods.push({
						"move": "MSPointerMove",
						"down": "MSPointerDown",
						"up": "MSPointerUp",
						"accessor": function (ev) {
							if (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE) return null;
							return ev;
						}
					});
				}
			}

			return inputMethods;
		},
		clearDragTimer: function () {
			if (this._drag_start_timer) {
				clearTimeout(this._drag_start_timer);
				this._drag_start_timer = null;
			}
		},
		dragStart: function (obj, e, inputMethod) {
			this.config = {
				obj: obj,
				marker: null,
				started: false,
				pos: this.getPosition(e),
				sensitivity: 4
			};
			if (this._settings)
				utils.mixin(this.config, this._settings, true);


			this.traceDragEvents(obj, inputMethod);

			gantt._prevent_touch_scroll = true;
			document.body.className += " gantt_noselect";

			if (gantt.config.touch) {
				this.dragMove(obj, e, inputMethod.accessor);
			}

		},
		dragMove: function (obj, e, getEvent) {
			var source = getEvent(e);
			if (!source) return;

			if (!this.config.marker && !this.config.started) {
				var pos = this.getPosition(source);

				if (gantt.config.touch || this.checkPositionChange(pos)) {
					// real drag starts here,
					// when user moves mouse at first time after onmousedown
					this.config.started = true;
					this.config.ignore = false;
					if (this.callEvent("onBeforeDragStart", [obj, this.config.original_target]) === false) {
						this.config.ignore = true;
						return true;
					}
					this.backupEventTarget(e, getEvent);
					this.initDnDMarker();
					gantt._touch_feedback();
					this.callEvent("onAfterDragStart", [obj, this.config.original_target]);
				} else {
					this.config.ignore = true;
				}
			}


			if (!this.config.ignore) {
				source.pos = this.getPosition(source);
				this.config.marker.style.left = source.pos.x + "px";
				this.config.marker.style.top = source.pos.y + "px";
				this.callEvent("onDragMove", [obj, source]);
				return false;
			}
		},

		dragEnd: function (obj) {
			var target = this.config.backup_element;
			if (target && target.parentNode) {
				target.parentNode.removeChild(target);
			}
			gantt._prevent_touch_scroll = false;
			if (this.config.marker) {
				this.config.marker.parentNode.removeChild(this.config.marker);
				this.config.marker = null;

				this.callEvent("onDragEnd", []);
			}
			document.body.className = document.body.className.replace(" gantt_noselect", "");
		},

		getPosition: function (e) {
			var x = 0, y = 0;
			e = e || window.event;
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			} else if (e.clientX || e.clientY) {
				x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			return {x: x, y: y};
		}
	};

	return DnD;
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

/*
 %d - the day as a number with a leading zero ( 01 to 31 );
 %j - the day as a number without a leading zero ( 1 to 31 );
 %D - the day as an abbreviation ( Sun to Sat );
 %l - the day as a full name ( Sunday to Saturday );
 %W - the ISO-8601 week number of the year. Weeks start on Monday; 1)
 %m - the month as a number without a leading zero ( 1 to 12 );
 %n - the month as a number with a leading zero ( 01 to 12);
 %M - the month as an abbreviation ( Jan to Dec );
 %F - the month as a full name ( January to December );
 %y - the year as a two-digit number ( 00 to 99 );
 %Y - the year as a four-digit number ( 1900–9999 );
 %h - the hour based on the 12-hour clock ( 00 to 11 );
 %H - the hour based on the 24-hour clock ( 00 to 23 );
 %i - the minute as a number with a leading zero ( 00 to 59 );
 %s - the second as a number without a leading zero ( 00 to 59 ); 2)
 %a - displays am (for times from midnight until noon) and pm (for times from noon until midnight);
 %A - displays AM (for times from midnight until noon) and PM (for times from noon until midnight).

 */

module.exports = function(gantt) {

	var regTemplates = {};

	function initTemplate(name, initial, template_name) {
		template_name = template_name || name;
		var config = gantt.config,
			templates = gantt.templates;

		if (gantt.config[name] && regTemplates[template_name] != config[name]) {
			if (!(initial && templates[template_name])) {
				templates[template_name] = gantt.date.date_to_str(config[name]);
				regTemplates[template_name] = config[name];
			}
		}
	}

	function initTemplates() {
		var labels = gantt.locale.labels;
		labels.gantt_save_btn = labels.icon_save;
		labels.gantt_cancel_btn = labels.icon_cancel;
		labels.gantt_delete_btn = labels.icon_delete;


		var date = gantt.date;

		//build configuration based templates
		var d = date.date_to_str;
		var c = gantt.config;
		initTemplate("date_scale", true, undefined, gantt.config, gantt.templates);
		initTemplate("date_grid", true, "grid_date_format", gantt.config, gantt.templates);
		initTemplate("task_date", true, undefined, gantt.config, gantt.templates);

		gantt.mixin(gantt.templates, {
			xml_date: date.str_to_date(c.xml_date, c.server_utc),
			xml_format: d(c.xml_date, c.server_utc),
			api_date: date.str_to_date(c.api_date),
			progress_text: function (start, end, task) {
				return "";
			},
			grid_header_class: function (column, config) {
				return "";
			},

			task_text: function (start, end, task) {
				return task.text;
			},
			task_class: function (start, end, task) {
				return "";
			},
			grid_row_class: function (start, end, task) {
				return "";
			},
			task_row_class: function (start, end, task) {
				return "";
			},
			task_cell_class: function (item, date) {
				return "";
			},
			scale_cell_class: function (date) {
				return "";
			},
			scale_row_class: function (date) {
				return "";
			},

			grid_indent: function (item) {
				return "<div class='gantt_tree_indent'></div>";
			},
			grid_folder: function (item) {
				return "<div class='gantt_tree_icon gantt_folder_" + (item.$open ? "open" : "closed") + "'></div>";
			},
			grid_file: function (item) {
				return "<div class='gantt_tree_icon gantt_file'></div>";
			},
			grid_open: function (item) {
				return "<div class='gantt_tree_icon gantt_" + (item.$open ? "close" : "open") + "'></div>";
			},
			grid_blank: function (item) {
				return "<div class='gantt_tree_icon gantt_blank'></div>";
			},
			date_grid: function (date, item) {
				if (item && gantt.isUnscheduledTask(item) && gantt.config.show_unscheduled) {
					return gantt.templates.task_unscheduled_time(item);
				} else {
					return gantt.templates.grid_date_format(date);
				}
			},

			task_time: function (start, end, ev) {
				if (gantt.isUnscheduledTask(ev) && gantt.config.show_unscheduled) {
					return gantt.templates.task_unscheduled_time(ev);
				} else {
					return gantt.templates.task_date(start) + " - " + gantt.templates.task_date(end);
				}
			},

			task_unscheduled_time: function (task) {
				return "";
			},

			time_picker: d(c.time_picker),
			link_class: function (link) {
				return "";
			},
			link_description: function (link) {
				var from = gantt.getTask(link.source),
					to = gantt.getTask(link.target);

				return "<b>" + from.text + "</b> &ndash;  <b>" + to.text + "</b>";
			},

			drag_link: function (from, from_start, to, to_start) {
				from = gantt.getTask(from);
				var labels = gantt.locale.labels;

				var text = "<b>" + from.text + "</b> " + (from_start ? labels.link_start : labels.link_end) + "<br/>";
				if (to) {
					to = gantt.getTask(to);
					text += "<b> " + to.text + "</b> " + (to_start ? labels.link_start : labels.link_end) + "<br/>";
				}
				return text;
			},
			drag_link_class: function (from, from_start, to, to_start) {
				var add = "";

				if (from && to) {
					var allowed = gantt.isLinkAllowed(from, to, from_start, to_start);
					add = " " + (allowed ? "gantt_link_allow" : "gantt_link_deny");
				}

				return "gantt_link_tooltip" + add;
			},

			/* used for aria-labels of bar elements and for tooltip.js */
			tooltip_date_format: date.date_to_str("%Y-%m-%d"),
			tooltip_text: function (start, end, event) {
				return "<b>Task:</b> " + event.text + "<br/><b>Start date:</b> " + gantt.templates.tooltip_date_format(start) + "<br/><b>End date:</b> " + gantt.templates.tooltip_date_format(end);
			}
		});
	}

	return {
		initTemplates: initTemplates,
		initTemplate: initTemplate
	};

};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var StateService = (function(){
	var stateProviders = {};

	function getState(){
		var res = {};
		for(var i in stateProviders){
			utils.mixin(res, stateProviders[i](), true);
		}
		return res;
	}

	function registerProvider(name, provider){
		stateProviders[name] = provider;
	}

	function unregisterProvider(name){
		delete stateProviders[name];
	}

	return {
		getState: getState,
		registerProvider: registerProvider,
		unregisterProvider: unregisterProvider
	};
});

module.exports = StateService;



/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var domHelpers = __webpack_require__(1);

module.exports = function(gantt) {

	var _dhx_msg_cfg = null;

	function callback(config, result) {
		var usercall = config.callback;
		modalBox.hide(config.box);

		_dhx_msg_cfg = config.box = null;
		if (usercall)
			usercall(result);
	}

	function modal_key(e) {
		if (_dhx_msg_cfg) {
			e = e || event;
			var code = e.which || event.keyCode;
			var preventDefault = false;

			if (messageBox.keyboard) {
				if (code == 13 || code == 32) {
					// default behavior is to confirm/submit popup on space/enter
					// if browser focus is set on button element - do button click instead of default behavior
					var target = e.target || e.srcElement;
					if (domHelpers.getClassName(target).indexOf("gantt_popup_button") > -1 && target.click) {
						target.click();
					} else {
						callback(_dhx_msg_cfg, true);
						preventDefault = true;
					}
				}

				if (code == 27) {
					callback(_dhx_msg_cfg, false);
					preventDefault = true;
				}
			}

			if (preventDefault) {
				if (e.preventDefault)
					e.preventDefault();
				return !(e.cancelBubble = true);
			}
			return;
		}
	}

	if (document.attachEvent)
		document.attachEvent("onkeydown", modal_key);
	else
		document.addEventListener("keydown", modal_key, true);

	function modality(mode) {
		if (!modality.cover) {
			modality.cover = document.createElement("DIV");
			//necessary for IE only
			modality.cover.onkeydown = modal_key;
			modality.cover.className = "dhx_modal_cover";
			document.body.appendChild(modality.cover);
		}
		var height = document.body.scrollHeight;
		modality.cover.style.display = mode ? "inline-block" : "none";
	}

	function button(text, className, result) {
		var buttonAriaAttrs = gantt._waiAria.messageButtonAttrString(text);
		var button_css = "gantt_" + className.toLowerCase().replace(/ /g, "_") + "_button" + " dhtmlx_" + className.toLowerCase().replace(/ /g, "_") + "_button"; // dhtmlx_ok_button, dhtmlx_click_me_button
		return "<div " + buttonAriaAttrs + " class='gantt_popup_button dhtmlx_popup_button " + button_css + "' result='" + result + "' ><div>" + text + "</div></div>";
	}

	function info(text) {
		if (!messageBox.area) {
			messageBox.area = document.createElement("DIV");
			messageBox.area.className = "gantt_message_area dhtmlx_message_area";
			messageBox.area.style[messageBox.position] = "5px";
			document.body.appendChild(messageBox.area);
		}

		messageBox.hide(text.id);
		var message = document.createElement("DIV");
		message.innerHTML = "<div>" + text.text + "</div>";
		message.className = "gantt-info dhtmlx-info gantt-" + text.type + " dhtmlx-" + text.type;
		message.onclick = function () {
			messageBox.hide(text.id);
			text = null;
		};

		gantt._waiAria.messageInfoAttr(message);

		if (messageBox.position == "bottom" && messageBox.area.firstChild)
			messageBox.area.insertBefore(message, messageBox.area.firstChild);
		else
			messageBox.area.appendChild(message);

		if (text.expire > 0)
			messageBox.timers[text.id] = window.setTimeout(function () {
				messageBox.hide(text.id);
			}, text.expire);

		messageBox.pull[text.id] = message;
		message = null;

		return text.id;
	}

	function getFirstDefined() {
		var values = [].slice.apply(arguments, [0]);

		for (var i = 0; i < values.length; i++) {
			if (values[i]) {
				return values[i];
			}
		}

	}

	function _boxStructure(config, ok, cancel) {
		var box = document.createElement("DIV");

		var locale = gantt.locale;

		var contentId = utils.uid();
		gantt._waiAria.messageModalAttr(box, contentId);


		box.className = " gantt_modal_box dhtmlx_modal_box gantt-" + config.type + " dhtmlx-" + config.type;
		box.setAttribute("dhxbox", 1);

		var inner = '';

		if (config.width)
			box.style.width = config.width;
		if (config.height)
			box.style.height = config.height;
		if (config.title)
			inner += '<div class="gantt_popup_title dhtmlx_popup_title">' + config.title + '</div>';
		inner += '<div class="gantt_popup_text dhtmlx_popup_text" id="' + contentId + '"><span>' + (config.content ? '' : config.text) + '</span></div><div  class="gantt_popup_controls dhtmlx_popup_controls">';
		if (ok)
			inner += button(getFirstDefined(config.ok, gantt.locale.labels.message_ok, "OK"), "ok", true);
		if (cancel)
			inner += button(getFirstDefined(config.cancel, gantt.locale.labels.message_cancel, "Cancel"), "cancel", false);

		if (config.buttons) {
			for (var i = 0; i < config.buttons.length; i++) {
				var btn = config.buttons[i];
				if (typeof btn == "object") {
					// Support { label:"Save", css:"main_button", value:"save" }
					var label = btn.label;
					var css = btn.css || ("gantt_" + btn.label.toLowerCase() + "_button dhtmlx_" + btn.label.toLowerCase() + "_button");
					var value = btn.value || i;
					inner += button(label, css, value);
				} else {
					inner += button(btn, btn, i);
				}
			}
		}

		inner += '</div>';
		box.innerHTML = inner;

		if (config.content) {
			var node = config.content;
			if (typeof node == "string")
				node = document.getElementById(node);
			if (node.style.display == 'none')
				node.style.display = "";
			box.childNodes[config.title ? 1 : 0].appendChild(node);
		}

		box.onclick = function (e) {
			e = e || event;
			var source = e.target || e.srcElement;
			if (!source.className) source = source.parentNode;
			if (source.className.split(" ")[0] == "gantt_popup_button") {
				var result = source.getAttribute("result");
				result = (result == "true") || (result == "false" ? false : result);
				callback(config, result);
			}
		};
		config.box = box;
		if (ok || cancel)
			_dhx_msg_cfg = config;

		return box;
	}

	function _createBox(config, ok, cancel) {
		var box = config.tagName ? config : _boxStructure(config, ok, cancel);

		if (!config.hidden)
			modality(true);
		document.body.appendChild(box);
		var x = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - box.offsetWidth) / 2));
		var y = Math.abs(Math.floor(((window.innerHeight || document.documentElement.offsetHeight) - box.offsetHeight) / 2));
		if (config.position == "top")
			box.style.top = "-3px";
		else
			box.style.top = y + 'px';
		box.style.left = x + 'px';
		//necessary for IE only
		box.onkeydown = modal_key;

		modalBox.focus(box);

		if (config.hidden)
			modalBox.hide(box);

		gantt.callEvent("onMessagePopup", [box]);
		return box;
	}

	function alertPopup(config) {
		return _createBox(config, true, false);
	}

	function confirmPopup(config) {
		return _createBox(config, true, true);
	}

	function boxPopup(config) {
		return _createBox(config);
	}

	function box_params(text, type, callback) {
		if (typeof text != "object") {
			if (typeof type == "function") {
				callback = type;
				type = "";
			}
			text = {text: text, type: type, callback: callback};
		}
		return text;
	}

	function params(text, type, expire, id) {
		if (typeof text != "object")
			text = {text: text, type: type, expire: expire, id: id};
		text.id = text.id || utils.uid();
		text.expire = text.expire || messageBox.expire;
		return text;
	}

	var alertBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";
		return alertPopup(text);
	};
	var confirmBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return confirmPopup(text);
	};
	var modalBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return boxPopup(text);
	};
	modalBox.hide = function (node) {
		while (node && node.getAttribute && !node.getAttribute("dhxbox"))
			node = node.parentNode;
		if (node) {
			node.parentNode.removeChild(node);
			modality(false);

			gantt.callEvent("onAfterMessagePopup", [node]);
		}
	};

	var domHelpers = __webpack_require__(1);

	modalBox.focus = function (node) {
		setTimeout(function () {
			var focusable = domHelpers.getFocusableNodes(node);
			if (focusable.length) {
				if (focusable[0].focus) focusable[0].focus();
			}
		}, 1);
	};

	var messageBox = function (text, type, expire, id) {
		text = params.apply(this, arguments);
		text.type = text.type || "info";

		var subtype = text.type.split("-")[0];
		switch (subtype) {
			case "alert":
				return alertPopup(text);
			case "confirm":
				return confirmPopup(text);
			case "modalbox":
				return boxPopup(text);
			default:
				return info(text);
		}
	};

	messageBox.seed = (new Date()).valueOf();
	messageBox.uid = utils.uid;
	messageBox.expire = 4000;
	messageBox.keyboard = true;
	messageBox.position = "top";
	messageBox.pull = {};
	messageBox.timers = {};

	messageBox.hideAll = function () {
		for (var key in messageBox.pull)
			messageBox.hide(key);
	};
	messageBox.hide = function (id) {
		var obj = messageBox.pull[id];
		if (obj && obj.parentNode) {
			window.setTimeout(function () {
				obj.parentNode.removeChild(obj);
				obj = null;
			}, 2000);
			obj.className += " hidden";

			if (messageBox.timers[id])
				window.clearTimeout(messageBox.timers[id]);
			delete messageBox.pull[id];
		}
	};

	return {
		alert: alertBox,
		confirm: confirmBox,
		message: messageBox,
		modalbox: modalBox
	};
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var uiFactory = __webpack_require__(9),
	mouseEvents = __webpack_require__(32),
	createLayers = __webpack_require__(33),
	Cell = __webpack_require__(4),
	Layout = __webpack_require__(7),
	ViewLayout = __webpack_require__(10),
	ViewCell = __webpack_require__(11),
	Resizer = __webpack_require__(12),
	Scrollbar = __webpack_require__(36),
	Timeline = __webpack_require__(37),
	Grid = __webpack_require__(39);

var renderTaskBar = __webpack_require__(41),
	renderTaskBg = __webpack_require__(42),
	renderLink = __webpack_require__(43),
	gridRenderer = __webpack_require__(44);

var mainGridInitializer = __webpack_require__(45);
var mainTimelineInitializer = __webpack_require__(47);
var mainLayoutInitializer = __webpack_require__(50);

function initUI(gantt){
	function inheritGridConfig(id){
		return {
			//width: gantt.config.grid_width
		};
	}

	function attachInitializer(view, initializer){
		var ext = initializer(gantt);
		if(ext.onCreated)
			ext.onCreated(view);
		view.attachEvent("onReady", function(){
			if(ext.onInitialized)
				ext.onInitialized(view);
		});
		view.attachEvent("onDestroy", function(){
			if(ext.onDestroyed)
				ext.onDestroyed(view);
		});
	}

	var factory = uiFactory.createFactory(gantt);
	factory.registerView("cell", Cell);
	factory.registerView("resizer", Resizer);
	factory.registerView("scrollbar", Scrollbar);
	factory.registerView("layout", Layout, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "main"){
			attachInitializer(view, mainLayoutInitializer);
		}
	});
	factory.registerView("viewcell", ViewCell);
	factory.registerView("multiview", ViewLayout);
	factory.registerView("timeline", Timeline, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "timeline" || view.$config.bind == "task"){
			attachInitializer(view, mainTimelineInitializer);
		}
	});
	factory.registerView("grid", Grid, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "grid" || view.$config.bind == "task"){
			attachInitializer(view, mainGridInitializer);
		}
	});

	var layersEngine = createLayers(gantt);

	return {
		factory:factory,
		mouseEvents: mouseEvents.init(gantt),
		layersApi: layersEngine.init(),
		render:{
			gridLine: gridRenderer(gantt),
			taskBg: renderTaskBg(gantt),
			taskBar: renderTaskBar(gantt),
			link: renderLink(gantt)
		},
		layersService: {
			getDataRender: function(name){
				return layersEngine.getDataRender(name, gantt);
			},
			createDataRender: function(config){
				return layersEngine.createDataRender(config, gantt);
			}
		}
	};
}

module.exports = {
	init: initUI
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1);

var createMouseHandler = (function(domHelpers) {
	return function (gantt) {
		var eventHandlers = {
			"click": {},
			"doubleclick": {},
			"contextMenu": {}
		};

		function addEventTarget(event, className, handler, root) {
			if(!eventHandlers[event][className]){
				eventHandlers[event][className] = [];
			}

			eventHandlers[event][className].push({
				handler: handler,
				root: root
			});
		}

		function callHandler(eventName, className, root, args) {
			var handlers = eventHandlers[eventName][className];
			if(handlers){
				for(var i = 0; i < handlers.length; i++){
					if(!root || root == handlers[i].root == root){
						handlers[i].handler.apply(this, args);
					}
				}
			}
		}

		function onClick(e) {
			e = e || window.event;
			var trg = e.target || e.srcElement;
			var id = gantt.locate(e);

			var res = true;
			if (id !== null) {
				res = !gantt.checkEvent("onTaskClick") || gantt.callEvent("onTaskClick", [id, e]);
			} else {
				gantt.callEvent("onEmptyClick", [e]);
			}

			var targets = eventHandlers.click;

			if (res) {
				var default_action = findEventHandler(e, trg, targets, id);
				if (!default_action)
					return;

				if (id && gantt.getTask(id) && gantt.config.select_task) {
					gantt.selectTask(id);
				}
			}
		}

		function onContextMenu(e) {
			e = e || window.event;
			var src = e.target || e.srcElement,
				taskId = gantt.locate(src),
				linkId = gantt.locate(src, gantt.config.link_attribute);

			var res = !gantt.checkEvent("onContextMenu") || gantt.callEvent("onContextMenu", [taskId, linkId, e]);
			if (!res) {
				if (e.preventDefault)
					e.preventDefault();
				else
					e.returnValue = false;
			}
			return res;
		}

		function findEventHandler(e, trg, hash, id) {
			var res = true;
			while (trg) {
				var css = domHelpers.getClassName(trg);
				if (css) {
					css = css.split(" ");
					for (var i = 0; i < css.length; i++) {
						if (!css[i]) continue;
						if (hash[css[i]]) {
							var delegateHandlers = hash[css[i]];

							for(var h = 0; h < delegateHandlers.length; h++){
								if(delegateHandlers[h].root){
									if(!domHelpers.isChildOf(trg, delegateHandlers[h].root)){
										continue;
									}
								}
								var handler = delegateHandlers[h].handler.call(gantt, e, id, trg);
								res = res && !(typeof handler != "undefined" && handler !== true);
							}
						}
					}
				}
				trg = trg.parentNode;
			}
			return res;
		}

		function onDoubleClick(e) {
			e = e || window.event;
			var trg = e.target || e.srcElement;
			var id = gantt.locate(e);
			var res = !gantt.checkEvent("onTaskDblClick") || gantt.callEvent("onTaskDblClick", [id, e]);
			if (res) {
				var default_action = findEventHandler(e, trg, eventHandlers.doubleclick, id);
				if (!default_action)
					return;

				if (id !== null && gantt.getTask(id)) {
					if (res && gantt.config.details_on_dblclick) {
						gantt.showLightbox(id);
					}
				}
			}
		}

		function onMouseMove(e) {
			if (gantt.checkEvent("onMouseMove")) {
				var id = gantt.locate(e);
				gantt._last_move_event = e;
				gantt.callEvent("onMouseMove", [id, e]);
			}
		}

		function detach(eventName, className, handler, root) {
			if (eventHandlers[eventName]) {
				for(var i = 0; i < eventHandlers[eventName].length; i++){
					if(eventHandlers[eventName][i].root == root){
						eventHandlers[eventName].splice(i, 1);
						i--;
					}
				}
			}
		}

		var globalHandlers = [];

		function reset(node){

			for(var i = 0; i < globalHandlers.length; i++){
				gantt.eventRemove(globalHandlers[i][0], globalHandlers[i][1], globalHandlers[i][2]);
			}
			globalHandlers = [];

			if(node){
				globalHandlers.push([node, "click", onClick]);
				globalHandlers.push([node, "dblclick", onDoubleClick]);
				globalHandlers.push([node, "mousemove", onMouseMove]);
				globalHandlers.push([node, "contextmenu", onContextMenu]);
				for(var i = 0; i < globalHandlers.length; i++){
					gantt.event(globalHandlers[i][0], globalHandlers[i][1], globalHandlers[i][2]);
				}
			}
		}



		return {
			reset: reset,
			global: function(event, classname, handler){
				addEventTarget(event, classname, handler, null);
			},
			delegate: addEventTarget,
			detach: detach,
			callHandler: callHandler,
			onDoubleClick: onDoubleClick,
			onMouseMove: onMouseMove,
			onContextMenu: onContextMenu,
			onClick: onClick

		};
	};

})(domHelpers);


module.exports = {
	init:createMouseHandler
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var createLayerFactory = __webpack_require__(34);

var createLayerEngine = function(gantt){
	var factory = createLayerFactory(gantt);
	return {
		getDataRender: function(name){
			return gantt.$services.getService("layer:" + name) || null;
		},
		createDataRender: function(config){
			var name = config.name,
				defaultContainer = config.defaultContainer,
				previusSiblingContainer = config.defaultContainerSibling;

			var layers = factory.createGroup(
				defaultContainer,
				previusSiblingContainer,
				function(item){
					if(layers.filters){
						for(var i = 0; i < layers.filters.length; i++){
							if(layers.filters[i](item) === false){
								return false;
							}
						}
					}else{
						return true;
					}
				}
			);

			gantt.$services.setService("layer:" + name, function(){
				return layers;
			});

			gantt.attachEvent("onGanttReady", function () {
				layers.addLayer();// init layers on start
			});

			return layers;
		},
		init: function(){
			var taskLayers = this.createDataRender({
				name: "task",
				defaultContainer: function(){
					if(gantt.$task_data){
						return gantt.$task_data;
					}else if(gantt.$ui.getView("timeline")){
						return gantt.$ui.getView("timeline").$task_data;
					}
				},
				defaultContainerSibling: function(){
					if(gantt.$task_links){
						return gantt.$task_links;
					}else if(gantt.$ui.getView("timeline")){
						return gantt.$ui.getView("timeline").$task_links;
					}
				},
				filter: function(item){

				}
			}, gantt);

			var linkLayers = this.createDataRender({
				name: "link",
				defaultContainer: function(){
					if(gantt.$task_data){
						return gantt.$task_data;
					}else if(gantt.$ui.getView("timeline")){
						return gantt.$ui.getView("timeline").$task_data;
					}
				}
			}, gantt);

			return {
				addTaskLayer: function(config){
					return taskLayers.addLayer(config);
				},

				/*getTaskLayer: function(id){
					return taskLayers.getLayer(id);
				},*/

				_getTaskLayers: function(){
					return taskLayers.getLayers();
				},
				removeTaskLayer: function(id){
					taskLayers.removeLayer(id);
				},
				/*eachTaskLayer: function(code){
					taskLayers.eachLayer(code);
				},*/
				_clearTaskLayers: function(){
					taskLayers.clear();
				},
				addLinkLayer: function(config){
					return linkLayers.addLayer(config);
				},
				/*getLinkLayer: function(id){
					return linkLayers.getLayer(id);
				},*/
				_getLinkLayers: function(){
					return linkLayers.getLayers();
				},
				removeLinkLayer: function(id){
					linkLayers.removeLayer(id);
				},
				/*eachLinkLayer: function(code){
					linkLayers.eachLayer(code);
				},*/
				_clearLinkLayers: function(){
					linkLayers.clear();
				}
			};
		}
	};
};

module.exports = createLayerEngine;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var renderFactoryProvider = __webpack_require__(35);
var utils = __webpack_require__(0);

var layerFactory = function(gantt){

	var renderFactory = renderFactoryProvider(gantt);
	return {
	createGroup: function (get_container, rel_root, defaultFilters) {

		return {
			tempCollection: [],
			renderers: {},
			container: get_container,
			filters: [],
			getLayers: function () {
				var res = [];
				for (var i in this.renderers) {
					res.push(this.renderers[i]);
				}
				return res;
			},
			getLayer: function (id) {
				return this.renderers[id];
			},
			_add: function (layer) {
				if (layer) {
					layer.id = layer.id || utils.uid();
					this.tempCollection.push(layer);
				}

				if (!this.container()) return;

				var container = this.container();

				var pending = this.tempCollection;
				for (var i = 0; i < pending.length; i++) {
					layer = pending[i];


					var node = layer.container,
						id = layer.id,
						topmost = layer.topmost;
					if (!node.parentNode) {
						//insert on top or below the tasks
						if (topmost) {
							container.appendChild(node);
						} else {
							var rel = rel_root ? rel_root() : container.firstChild;
							if (rel)
								container.insertBefore(node, rel);
							else
								container.appendChild(node);
						}
					}
					this.renderers[id] = renderFactory.getRenderer(
						id,
						layer,
						node
					);
					this.tempCollection.splice(i, 1);
					i--;
				}
			},
			addLayer: function (config) {
				//config = prepareConfig(config);
				if(config){
					if(typeof config == "function"){
						config = {renderer: config};
					}

					if(config.filter === undefined){
						config.filter = mergeFilters(defaultFilters || []);
					}else if(config.filter instanceof Array){
						config.filter.push(defaultFilters);
						config.filter = mergeFilters(config.filter);
					}

					if(!config.container){
						config.container = document.createElement("div");
					}
				}
				this._add(config);
				return (config ? config.id : undefined);
			},
			eachLayer: function(code){
				for (var i in this.renderers) {
					code(this.renderers[i]);
				}
			},
			removeLayer: function (id) {
				this.renderers[id].unload();
				delete this.renderers[id];
			},
			clear: function () {
				for (var i in this.renderers) {
					this.renderers[i].unload();
				}
				this.renderers = {};
			}//,
			//prepareConfig: prepareConfig
		};
	}
};};


function mergeFilters(filter_methods){
	if(!(filter_methods instanceof Array)){
		filter_methods = Array.prototype.slice.call(arguments, 0);
	}

	return function(obj){
		var res = true;
		for(var i = 0, len = filter_methods.length; i < len; i++){
			var filter_method = filter_methods[i];
			if(filter_method){
				res = res && (filter_method(obj.id, obj) !== false);
			}
		}

		return res;
	};
}


module.exports = layerFactory;


/***/ }),
/* 35 */
/***/ (function(module, exports) {

var rendererFactory = function(gantt){
	var services = gantt.$services;

	//hash of dom elements is needed to redraw single bar/link
	var task_area_pulls = {},
		task_area_renderers = {};

	function getRenderer(id, layer, node) {

		if (task_area_renderers[id])
			return task_area_renderers[id];

		if (!layer.renderer)
			gantt.assert(false, "Invalid renderer call");

		var renderOne = function(item){
			return layer.renderer.call(this, item, layer.host);
		} ;

		var filter = layer.filter;

		if (node)
			node.setAttribute(services.config().layer_attribute, true);

		task_area_renderers[id] = {
			render_item: function (item, container) {
				container = container || node;

				if (filter) {
					if (!filter(item)) {
						this.remove_item(item.id);
						return;
					}
				}

				var dom = renderOne.call(gantt, item);
				this.append(item, dom, container);

			},

			clear: function (container) {
				this.rendered = task_area_pulls[id] = {};
				this.clear_container(container);
			},
			clear_container: function (container) {
				container = container || node;
				if (container)
					container.innerHTML = "";
			},
			render_items: function (items, container) {
				container = container || node;

				var buffer = document.createDocumentFragment();
				this.clear(container);
				for (var i = 0, vis = items.length; i < vis; i++) {
					this.render_item(items[i], buffer);
				}

				container.appendChild(buffer);
			},
			append: function (item, node, container) {
				if (!node) {
					if (this.rendered[item.id]) {
						this.remove_item(item.id);
					}
					return;
				}

				if (this.rendered[item.id] && this.rendered[item.id].parentNode) {
					this.replace_item(item.id, node);
				} else {
					container.appendChild(node);
				}
				this.rendered[item.id] = node;

			},
			replace_item: function (item_id, newNode) {
				var item = this.rendered[item_id];
				if (item && item.parentNode) {
					item.parentNode.replaceChild(newNode, item);
				}
				this.rendered[item_id] = newNode;
			},
			remove_item: function (item_id) {
				this.hide(item_id);
				delete this.rendered[item_id];
			},
			hide: function (item_id) {
				var item = this.rendered[item_id];
				if (item && item.parentNode) {
					item.parentNode.removeChild(item);
				}
			},
			restore: function (item) {
				var dom = this.rendered[item.id];
				if (dom) {
					if (!dom.parentNode) {
						this.append(item, dom, node);
					}
				} else {
					this.render_item(item, node);
				}
			},
			change_id: function (oldid, newid) {
				this.rendered[newid] = this.rendered[oldid];
				delete this.rendered[oldid];
			},
			rendered: task_area_pulls[id],
			node: node,
			unload: function () {
				this.clear();
				delete task_area_renderers[id];
				delete task_area_pulls[id];
			}
		};

		return task_area_renderers[id];
	}


	function clearRenderers() {
		for (var i in task_area_renderers) {
			getRenderer(i).unload();
		}
	}

	return {
		getRenderer: getRenderer,
		clearRenderers: clearRenderers
	};

};

module.exports = rendererFactory;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var __extends = __webpack_require__(5),
	domHelpers = __webpack_require__(1),
	utils = __webpack_require__(0),
	env = __webpack_require__(6),
	eventable = __webpack_require__(2),
	Cell = __webpack_require__(4);

var ScrollbarCell = (function (_super) {
	"use strict";

	__extends(ScrollbarCell, _super);
	function ScrollbarCell(parent, config, factory, gantt) {

		var _this = _super.apply(this, arguments) || this;
		this.$config = utils.mixin(config, {scroll: "x"});
		_this._scrollHorizontalHandler = utils.bind(_this._scrollHorizontalHandler, _this);
		_this._scrollVerticalHandler = utils.bind(_this._scrollVerticalHandler, _this);
		_this._outerScrollVerticalHandler = utils.bind(_this._outerScrollVerticalHandler, _this);
		_this._outerScrollHorizontalHandler = utils.bind(_this._outerScrollHorizontalHandler, _this);
		_this._mouseWheelHandler = utils.bind(_this._mouseWheelHandler, _this);

		this.$config.hidden = true;
		var size = gantt.config.scroll_size;
		if(this._isHorizontal()){
			_this.$config.height = size;
			_this.$parent.$config.height = size;
		}else{
			_this.$config.width = size;
			_this.$parent.$config.width = size;
		}

		this.$config.scrollPosition = 0;

		_this.$name = "scroller";
		return _this;
	}

	ScrollbarCell.prototype.init = function(container){
		container.innerHTML = this.$toHTML();
		this.$view = container.firstChild;

		if(!this.$view){
			this.init();
		}
		if(this._isVertical()){
			this._initVertical();
		}else{
			this._initHorizontal();
		}
		this._initMouseWheel();
		this._initLinkedViews();
	};

	ScrollbarCell.prototype.$toHTML = function () {
		var className = this._isHorizontal() ? "gantt_hor_scroll" : "gantt_ver_scroll";
		return "<div class='gantt_layout_cell "+className+"'><div style='"+(this._isHorizontal() ? "width:2000px" : "height:2000px")+"'></div></div>";
	};

	ScrollbarCell.prototype._getRootParent = function(){
		var parent = this.$parent;
		while(parent && parent.$parent){
			parent = parent.$parent;
		}
		if(parent){
			return parent;
		}
	};


	function eachCell(root, res){
		res.push(root);
		if(root.$cells){
			for(var i = 0; i < root.$cells.length; i++){
				eachCell(root.$cells[i], res);
			}
		}
	}
	ScrollbarCell.prototype._eachView = function(){
		var res = [];
		eachCell(this._getRootParent(), res);
		return res;
	};

	ScrollbarCell.prototype._getLinkedViews = function(){
		var views = this._eachView();
		var res = [];
		for(var i = 0; i < views.length; i++){
			if(views[i].$config && ((this._isVertical() && views[i].$config.scrollY == this.$id) || (this._isHorizontal() && views[i].$config.scrollX == this.$id)) ){
				res.push(views[i]);
			}
		}
		return res;
	};


	ScrollbarCell.prototype._initHorizontal = function(){
		this.$scroll_hor = this.$view;
		utils.event(this.$view, "scroll", this._scrollHorizontalHandler);

	};

	ScrollbarCell.prototype._initLinkedViews = function(){
		var views = this._getLinkedViews();
		var css = this._isVertical() ?"gantt_layout_outer_scroll gantt_layout_outer_scroll_vertical" : "gantt_layout_outer_scroll gantt_layout_outer_scroll_horizontal";
		for(var i = 0; i < views.length; i++){
			//views[i].$config.css = [views[i].$config.css || "", css].join(" ");
			domHelpers.addClassName(views[i].$view || views[i].getNode(), css);
		}
	};

	ScrollbarCell.prototype._initVertical = function(){
		this.$scroll_ver = this.$view;
		utils.event(this.$view, "scroll", this._scrollVerticalHandler);
	};

	ScrollbarCell.prototype._updateLinkedViews = function(){
		var root = this._getRootParent();
	};

	ScrollbarCell.prototype._initMouseWheel = function(){
		var ff = env.isFF;
		if (ff)
			utils.event(this._getRootParent().$view, "wheel", this._mouseWheelHandler);
		else
			utils.event(this._getRootParent().$view, "mousewheel", this._mouseWheelHandler);
	};




	ScrollbarCell.prototype.scrollHorizontally = function(left){
		if(this._scrolling) return;
		this._scrolling = true;

		this.$scroll_hor.scrollLeft = left;
		this.$config.codeScrollLeft = left;
		left = this.$scroll_hor.scrollLeft;

		var views = this._getLinkedViews();
		for(var i = 0; i < views.length; i++){
			if(views[i].scrollTo){
				views[i].scrollTo(left, undefined);
			}
		}
		var oldSize = this.$config.scrollPosition;
		this.$config.scrollPosition = left;
		this.callEvent("onScroll", [oldSize, left, this.$config.scroll]);
		this._scrolling = false;
	};
	ScrollbarCell.prototype.scrollVertically = function(top){
		if(this._scrolling) return;
		this._scrolling = true;

		this.$scroll_ver.scrollTop = top;
		top = this.$scroll_ver.scrollTop;

		var views = this._getLinkedViews();

		for(var i = 0; i < views.length; i++){
			if(views[i].scrollTo){
				views[i].scrollTo(undefined, top);
			}
		}
		var oldSize = this.$config.scrollPosition;
		this.$config.scrollPosition = top;
		this.callEvent("onScroll", [oldSize, top, this.$config.scroll]);
		this._scrolling = false;
	};

	ScrollbarCell.prototype._isVertical = function(){
		return this.$config.scroll == "y";
	};
	ScrollbarCell.prototype._isHorizontal = function(){
		return this.$config.scroll == "x";
	};
	ScrollbarCell.prototype._scrollHorizontalHandler = function (e) {
		if(this._isVertical() || this._scrolling){
			return;
		}

		//in safari we can catch previous onscroll after setting new value from mouse-wheel event
		//set delay to prevent value drifiting
		if ((new Date()) - ( this._wheel_time || 0 ) < 100) return true;
		if (this.$gantt._touch_scroll_active) return;
		var left = this.$scroll_hor.scrollLeft;

		this.scrollHorizontally(left);

		this._oldLeft = this.$scroll_hor.scrollLeft;
	};
	ScrollbarCell.prototype._outerScrollHorizontalHandler = function(e){
		if(this._isVertical()){
			return;
		}
	};

	ScrollbarCell.prototype.show = function(){
		this.$parent.show();
	};
	ScrollbarCell.prototype.hide = function(){
		this.$parent.hide();
	};

	ScrollbarCell.prototype._getScrollSize = function(){
		var scrollSize = 0;
		var outerSize = 0;

		var linked = this._getLinkedViews();
		var view;
		var scrollProperty = this._isHorizontal() ? "scrollWidth" : "scrollHeight",
			innerSizeProperty = this._isHorizontal() ? "contentX" : "contentY";
		var outerProperty = this._isHorizontal() ? "x" : "y";
		var offset = this._getScrollOffset();

		for(var i = 0; i < linked.length; i++){
			view = linked[i];
			if(!(view && view.$content && view.$content.getSize)) continue;

			var sizes = view.$content.getSize();
			var cellScrollSize;
			if(sizes.hasOwnProperty(scrollProperty)){
				cellScrollSize = sizes[scrollProperty];
			}else{
				cellScrollSize = sizes[innerSizeProperty];
			}

			if(sizes[innerSizeProperty] > sizes[outerProperty] && sizes[innerSizeProperty] > scrollSize && (cellScrollSize > (sizes[outerProperty] - offset + 2))){
				scrollSize = cellScrollSize;
				outerSize = sizes[outerProperty];
			}
		}

		return {
			outerScroll: outerSize,
			innerScroll: scrollSize
		};
	};

	ScrollbarCell.prototype.scroll = function(position){
		if(this._isHorizontal()){
			this.scrollHorizontally(position);
		}else{
			this.scrollVertically(position);
		}
	};

	ScrollbarCell.prototype.getScrollState = function(){
		return {
			visible: this._isVisible(),
			direction: this.$config.scroll,
			size: this.$config.outerSize,
			scrollSize: this.$config.scrollSize || 0,
			position: this.$config.scrollPosition || 0
		};
	};

	ScrollbarCell.prototype.setSize = function(width, height){
		_super.prototype.setSize.apply(this, arguments);

		var scrollSizes = this._getScrollSize();
		if(scrollSizes.innerScroll && width > scrollSizes.outerScroll){
			scrollSizes.innerScroll += (width - scrollSizes.outerScroll);
		}
		this.$config.scrollSize = scrollSizes.innerScroll;

		this.$config.width = width;
		this.$config.height = height;
		this._setScrollSize(scrollSizes.innerScroll);
	};

	ScrollbarCell.prototype._isVisible = function(){
		return !!(this.$parent && this.$parent.$view.parentNode);
	};

	ScrollbarCell.prototype.shouldShow = function(){
		var scrollSizes = this._getScrollSize();
		if(!scrollSizes.innerScroll && (this.$parent && this.$parent.$view.parentNode)){
			return false;
		}else if(scrollSizes.innerScroll && !(this.$parent && this.$parent.$view.parentNode)){
			return true;
		}else{
			return false;
		}
	};

	ScrollbarCell.prototype.shouldHide = function(){
		var scrollSizes = this._getScrollSize();
		if(!scrollSizes.innerScroll && (this.$parent && this.$parent.$view.parentNode)){
			return true;
		}else{
			return false;
		}
	};


	ScrollbarCell.prototype.toggleVisibility = function(){
		if(this.shouldHide()){
			this.hide();
		}else if(this.shouldShow()){
			this.show();
		}
	};

	ScrollbarCell.prototype._getScrollOffset = function(){
		var offset = 0;
		if(this._isVertical()){
			var prev = null;
			var cells = this.$parent.$parent.getCells();

			for (var i = 0; i < cells.length; i++) {
				if (this.$parent === cells[i]) {
					prev = cells[i - 1];
				}
			}
			if(prev && (prev.$config.view == "timeline" || prev.$config.view == "grid")){
				offset = prev.$content.$getConfig().scale_height;
			}
		}else{
			var linked = this._getLinkedViews();

			for (var i = 0; i < linked.length; i++) {
				var view = linked[i],
					vparent = view.$parent;
				var cells = vparent.$cells;

				var last = cells[cells.length - 1];

				if (last && last.$config.view == "scrollbar" && last.$config.hidden === false) {
					offset = last.$config.width;
					break;
				}

			}
		}
		return offset;
	};

	ScrollbarCell.prototype._setScrollSize = function(size){
		var property = this._isHorizontal() ? "width" : "height";
		var scrollbar = this._isHorizontal() ? this.$scroll_hor : this.$scroll_ver;

		var offset = this._getScrollOffset();

		var node = scrollbar.firstChild;

		if(offset){
			if(this._isVertical()){

				this.$config.outerSize = (this.$config.height - offset + 3);
				scrollbar.style.height = this.$config.outerSize + "px";
				scrollbar.style.top = (offset-1) + "px";
				domHelpers.addClassName(scrollbar, this.$parent._borders.top);
				domHelpers.addClassName(scrollbar.parentNode, "gantt_task_vscroll");
			}else{
				this.$config.outerSize = (this.$config.width - offset + 1);
				scrollbar.style.width = this.$config.outerSize + "px";
				//domHelpers.addClassName(scrollbar, this.$parent._borders.right);
			}
		}else{
			scrollbar.style.top = "auto";
			domHelpers.removeClassName(scrollbar, this.$parent._borders.top);
			domHelpers.removeClassName(scrollbar.parentNode, "gantt_task_vscroll");
		}

		node.style[property] = size + "px";
	};

	ScrollbarCell.prototype._scrollVerticalHandler = function (e) {
		if(this._scrollHorizontalHandler() || this._scrolling){
			return;
		}

		if (this.$gantt._touch_scroll_active) return;
		var top = this.$scroll_ver.scrollTop;
		var prev = this._oldTop;
		if(top == prev) return;

		this.scrollVertically(top);

		this._oldTop = this.$scroll_ver.scrollTop;

	};
	ScrollbarCell.prototype._outerScrollVerticalHandler = function(e){
		if(this._scrollHorizontalHandler()){
			return;
		}
	};

	ScrollbarCell.prototype._checkWheelTarget = function(targetNode){
		var connectedViews = this._getLinkedViews().concat(this);

		for(var i = 0; i < connectedViews.length; i++){
			var node = connectedViews[i].$view;
			if(domHelpers.isChildOf(targetNode, node)){
				return true;
			}
		}

		return false;
	};

	ScrollbarCell.prototype._mouseWheelHandler = function(e){
		var target = e.target || e.srcElement;

		if(!this._checkWheelTarget(target))
			return;

		this._wheel_time = new Date();

		var res = {};
		var ff = env.isFF;
		var wx = ff ? (e.deltaX*-20) : e.wheelDeltaX*2;
		var wy = ff ? (e.deltaY*-40) : e.wheelDelta;

		if(e.shiftKey && !(e.deltaX || e.wheelDeltaX)){
			// shift+mousewheel for horizontal scroll
			wx = wy*2;
			wy = 0;
		}

		if (wx && Math.abs(wx) > Math.abs(wy)){
			if(this._isVertical()){
				return;
			}

			if(res.x) return true;//no horisontal scroll, must not block scrolling
			if(!this.$scroll_hor || !this.$scroll_hor.offsetWidth) return true;

			var dir  = wx/-40;
			var oldLeft = this._oldLeft;
			var left = oldLeft+dir*30;
			this.scrollHorizontally(left);
			this.$scroll_hor.scrollLeft = left;
			// not block scroll if position hasn't changed
			if(oldLeft == this.$scroll_hor.scrollLeft){
				return true;
			}

			this._oldLeft = this.$scroll_hor.scrollLeft;
		} else {
			if(this._isHorizontal()){
				return;
			}

			if(res.y) return true;//no vertical scroll, must not block scrolling
			if(!this.$scroll_ver || !this.$scroll_ver.offsetHeight) return true;

			var dir  = wy/-40;
			if (typeof wy == "undefined")
				dir = e.detail;

			var oldTop = this._oldTop;
			var top = this.$scroll_ver.scrollTop+dir*30;

			//if(!this.$gantt.config.prevent_default_scroll &&
			//	(this.$gantt._cached_scroll_pos && ((this.$gantt._cached_scroll_pos.y == top) || (this.$gantt._cached_scroll_pos.y <= 0 && top <= 0)))) return true;


			this.scrollVertically(top);
			this.$scroll_ver.scrollTop = top;

			// not block scroll if position hasn't changed
			if(oldTop == this.$scroll_ver.scrollTop){
				return true;
			}
			this._oldTop = this.$scroll_ver.scrollTop;
		}

		if (e.preventDefault)
			e.preventDefault();
		e.cancelBubble=true;
		return false;
	};

	return ScrollbarCell;
})(Cell);

module.exports = ScrollbarCell;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var ScaleHelper = __webpack_require__(13);
var configurable = __webpack_require__(14);
var eventable = __webpack_require__(2);
var utils = __webpack_require__(0);

var canvasRender = __webpack_require__(38);

var Timeline = function(parent, config, factory, gantt){
	this.$config = utils.mixin({}, config || {});
	this.$scaleHelper = new ScaleHelper(gantt);
	this.$gantt = gantt;
	eventable(this);
	configurable(this);
};

Timeline.prototype = {
	init: function(container){
		container.innerHTML += "<div class='gantt_task' style='width:inherit;height:inherit;'></div>";
		this.$task = container.childNodes[0];

		this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'></div>";
		this.$task_scale = this.$task.childNodes[0];

		this.$task_data = this.$task.childNodes[1];
		this.$task_data.innerHTML = "<div class='gantt_task_bg'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div>";
		this.$task_bg = this.$task_data.childNodes[0];
		this.$task_links = this.$task_data.childNodes[1];
		this.$task_bars = this.$task_data.childNodes[2];

		this._tasks = {
			col_width: 0,
			width: [], // width of each column
			full_width: 0, // width of all columns
			trace_x: [],
			rendered: {}
		};

		var config = this.$getConfig();
		var attr = config[this.$config.bind + "_attribute"];
		var linksAttr = config[this.$config.bindLinks + "_attribute"];
		if(!attr && this.$config.bind){
			attr = this.$config.bind + "_id";
		}
		if(!linksAttr && this.$config.bindLinks){
			linksAttr = this.$config.bindLinks + "_id";
		}
		this.$config.item_attribute = attr || null;
		this.$config.link_attribute = linksAttr || null;

		var layers = this._createLayerConfig();
		if(!this.$config.layers){
			this.$config.layers = layers.tasks;
		}
		if(!this.$config.linkLayers){
			this.$config.linkLayers = layers.links;
		}

		this._attachLayers(this.$gantt);
		this.callEvent("onReady", []);
		//this.refresh();
	},

	setSize: function(width, height){
		var config = this.$getConfig();

		if(width*1 === width){
			this.$config.width = width;
		}
		if(height*1 === height){

			this.$config.height = height;
			var dataHeight = Math.max(this.$config.height - config.scale_height);
			this.$task_data.style.height = dataHeight + 'px';
		}

		this.refresh();
		this.$task_bg.style.backgroundImage = "";

		if(config.smart_rendering){
			var store = this.$gantt.getDatastore(this.$config.bind);
			this.$task_bg.style.height = config.row_height * store.countVisible() +"px";
		}else{
			this.$task_bg.style.height = "";
		}

		var scale = this._tasks;
		//timeline area layers
		var data_els = this.$task_data.childNodes;
		for(var i= 0, len = data_els.length; i < len; i++){
			var el = data_els[i];
			if(el.hasAttribute("data-layer") && el.style)
				el.style.width = scale.full_width + "px";
		}
	},

	isVisible: function(){
		if(this.$parent && this.$parent.$config){
			return !this.$parent.$config.hidden;
		}else{
			return this.$task.offsetWidth;
		}
	},

	getSize: function(){
		var config = this.$getConfig();
		var store = this.$gantt.getDatastore(this.$config.bind);

		var contentHeight = store ? config.row_height * store.countVisible() : 0,
			contentWidth = this._tasks.full_width;

		return {
			x: this.$config.width,
			y: this.$config.height,
			contentX: this.isVisible() ? contentWidth : 0,
			contentY: this.isVisible() ? (config.scale_height + contentHeight) : 0,
			scrollHeight: this.isVisible() ? contentHeight : 0,
			scrollWidth: this.isVisible() ? contentWidth : 0
		};
	},

	scrollTo: function(left, top){
		if(!this.isVisible())
			return;

		if(top*1 === top){
			this.$config.scrollTop = top;
			this.$task_data.scrollTop = this.$config.scrollTop;
		}
		if (left*1 === left){
			this.$task.scrollLeft = left;
			this.$config.scrollLeft = this.$task.scrollLeft;
		}

		this._refreshScales();
	},

	_refreshScales: function _refreshScales() {
		if(!this.isVisible())
			return;

		var config = this.$getConfig();
		if (!config.smart_scales) return;

		var x = this.$config.scrollLeft;
		var width = this.$config.width;

		var scales = this._scales;
		this.$task_scale.innerHTML = this._getScaleChunkHtml(scales, x, x + width);
	},
	_createLayerConfig: function(){
		var self = this;
		var taskFilter = function(){
			return self.isVisible();
		};

		var taskLayers = [
			{
				expose: true,
				renderer: this.$gantt.$ui.layers.taskBar,
				container: this.$task_bars,
				filter: [taskFilter]
			},
			{
				renderer: this.$gantt.$ui.layers.taskBg,
				container: this.$task_bg,
				filter: [
					function(){
						return !self.$getConfig().static_background;
					},
					taskFilter
				]
			}
		];

		var linkLayers = [
			{
				expose: true,
				renderer: this.$gantt.$ui.layers.link,
				container: this.$task_links,
				filter: [taskFilter]
			}
		];

		return {
			tasks: taskLayers,
			links: linkLayers
		};

	},

	_attachLayers: function(gantt){
		this._taskLayers = [];
		this._linkLayers = [];

		var self = this;

		var layers = this.$gantt.$services.getService("layers");

		if(this.$config.bind){
			var taskRenderer = layers.getDataRender(this.$config.bind);

			if(!taskRenderer){
				taskRenderer = layers.createDataRender({
					name: this.$config.bind,
					defaultContainer: function(){ return self.$task_data;}
				});
			}

			taskRenderer.container = function(){ return self.$task_data;};

			var taskLayers = this.$config.layers;
			for(var i = 0; taskLayers && i < taskLayers.length; i++){
				var layer = taskLayers[i];

				if(typeof layer == "function"){
					layer = {renderer: layer};
				}

				layer.host = this;
				var bar_layer = taskRenderer.addLayer(layer);
				this._taskLayers.push(bar_layer);
				if(layer.expose){
					this._taskRenderer = taskRenderer.getLayer(bar_layer);
				}
			}

			var staticRender = canvasRender.create();
			this.$gantt.attachEvent("onDataRender", function () {
				if(!self.isVisible())
					return;
				var config = self.$getConfig();
				if(config.static_background) {
					var store = self.$gantt.getDatastore(self.$config.bind);
					staticRender.render(self.$task_bg, config, self.getScale(), config.row_height * store.countVisible());
				}
			});
		}

		if(this.$config.bindLinks){
			var linkRenderer = layers.getDataRender(this.$config.bindLinks);

			if(!linkRenderer){
				linkRenderer = layers.createDataRender({
					name: this.$config.bindLinks,
					defaultContainer: function(){ return self.$task_data;}
				});
			}
			var linkLayers = this.$config.linkLayers;
			for(var i = 0; linkLayers && i < linkLayers.length; i++){
				var layer = linkLayers[i];
				layer.host = this;
				var linkLayer = linkRenderer.addLayer(layer);
				this._taskLayers.push(linkLayer);
				if(linkLayers[i].expose){
					this._linkRenderer = linkRenderer.getLayer(linkLayer);
				}
			}
		}
	},

	_clearLayers: function(gantt){
		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);
		var linkRenderer = layers.getDataRender(this.$config.bindLinks);

		for(var i = 0; i < this._taskLayers.length; i++){
			taskRenderer.removeLayer(this._taskLayers[i]);
		}
		for(var i = 0; i < this._linkLayers.length; i++){
			linkRenderer.removeLayer(this._linkLayers[i]);
		}

		this._linkLayers = [];
		this._taskLayers = [];
	},

	_render_tasks_scales: function _render_tasks_scales() {
		var config = this.$getConfig();

		var scales_html = "",
			outer_width = 0,
			scale_height = 0;

		var state = this.$gantt.getState();

		if (this.isVisible()) {
			var helpers = this.$scaleHelper;
			var scales = this._getScales();
			scale_height = config.scale_height;

			var availWidth = this.$config.width;
			if(config.autosize == "x" || config.autosize == "xy"){
				availWidth = Math.max(config.autosize_min_width, 0);
			}

			var cfgs = helpers.prepareConfigs(scales, config.min_column_width, availWidth, scale_height - 1, state.min_date, state.max_date);
			var cfg = this._tasks = cfgs[cfgs.length - 1];
			this._scales = cfgs;

			scales_html = this._getScaleChunkHtml(cfgs, 0, this.$config.width);

			outer_width = cfg.full_width + "px";//cfg.full_width + (this._scroll_sizes().y ? scrollSizes.scroll_size : 0) + "px";
			scale_height += "px";
		}

		this.$task_scale.style.height = scale_height;

		this.$task_data.style.width =
			this.$task_scale.style.width = outer_width;

		this.$task_scale.innerHTML = scales_html;

	},

	_getScaleChunkHtml: function _get_scale_chunk_html (scales, fromPos, toPos) {
		var templates = this.$gantt.$services.templates();
		var html = [];

		var css = templates.scale_row_class;
		for (var i = 0; i < scales.length; i++) {
			var cssClass = "gantt_scale_line";
			var tplClass = css(scales[i]);
			if (tplClass) {
				cssClass += " " + tplClass;
			}

			html.push("<div class=\"" + cssClass + "\" style=\"height:" + (scales[i].height) +
				"px;position:relative;line-height:" + (scales[i].height) + "px\">" + this._prepareScaleHtml(scales[i], fromPos, toPos) + "</div>");
		}

		return html.join("");
	},
	_prepareScaleHtml: function _prepare_scale_html(config, fromPos, toPos) {
		var globalConfig = this.$getConfig();
		var globalTemplates = this.$gantt.$services.templates();

		var cells = [];
		var date = null, content = null, css = null;

		if (config.template || config.date) {
			content = config.template || this.$gantt.date.date_to_str(config.date);
		}

		var startIndex = 0,
			endIndex = config.count;

		if (globalConfig.smart_scales && (!isNaN(fromPos) && !isNaN(toPos))) {
			startIndex = _findBinary(config.left, fromPos);
			endIndex = _findBinary(config.left, toPos) + 1;
		}

		css = config.css || function () {
			};
		if (!config.css && globalConfig.inherit_scale_class) {
			css = globalTemplates.scale_cell_class;
		}

		for (var i = startIndex; i < endIndex; i++) {
			if (!config.trace_x[i]) break;

			date = new Date(config.trace_x[i]);
			var value = content.call(this, date),
				width = config.width[i],
				height = config.height,
				left = config.left[i],
				style = "",
				template = "",
				cssclass = "";

			if (width) {
				var position = globalConfig.smart_scales ? ("position:absolute;left:" + left + "px") : "";

				style = "width:" + (width) + "px;height:" + height + "px;" + position;
				cssclass = "gantt_scale_cell" + (i == config.count - 1 ? " gantt_last_cell" : "");

				template = css.call(this, date);
				if (template) cssclass += " " + template;

				var ariaAttr = this.$gantt._waiAria.getTimelineCellAttr(value);
				var cell = "<div class='" + cssclass + "'" + ariaAttr + " style='" + style + "'>" + value + "</div>";
				cells.push(cell);
			} else {
				//do not render ignored cells
			}

		}
		return cells.join("");
	},
	dateFromPos: function dateFromPos(x) {
		var scale = this._tasks;
		if (x < 0 || x > scale.full_width || !scale.full_width) {
			return null;
		}

		var ind = _findBinary(this._tasks.left, x);
		var summ = this._tasks.left[ind];

		var col_width = scale.width[ind] || scale.col_width;
		var part = 0;
		if (col_width)
			part = (x - summ) / col_width;

		var unit = 0;
		if (part) {
			unit = this._getColumnDuration(scale, scale.trace_x[ind]);
		}

		var date = new Date(scale.trace_x[ind].valueOf() + Math.round(part * unit));
		return date;
	},
	posFromDate: function posFromDate(date) {
		if (!this.isVisible())
			return 0;

		var ind = this.columnIndexByDate(date);
		this.$gantt.assert(ind >= 0, "Invalid day index");

		var wholeCells = Math.floor(ind);
		var partCell = ind % 1;

		var pos = this._tasks.left[Math.min(wholeCells, this._tasks.width.length - 1)];
		if (wholeCells == this._tasks.width.length)
			pos += this._tasks.width[this._tasks.width.length - 1];
		//for(var i=1; i <= wholeCells; i++)
		//	pos += gantt._tasks.width[i-1];

		if (partCell) {
			if (wholeCells < this._tasks.width.length) {
				pos += this._tasks.width[wholeCells] * (partCell % 1);
			} else {
				pos += 1;
			}

		}
		return Math.round(pos);
	},
	columnIndexByDate: function columnIndexByDate(date) {
		var pos = new Date(date).valueOf();
		var days = this._tasks.trace_x,
			ignores = this._tasks.ignore_x;

		var state = this.$gantt.getState();

		if (pos <= state.min_date)
			return 0;

		if (pos >= state.max_date)
			return days.length;

		/*var day = null;
		 for (var xind = 0, length = days.length-1; xind < length; xind++) {
		 // | 8:00, 8:30 | 8:15 should be checked against 8:30
		 // clicking at the most left part of the cell, say 8:30 should create event in that cell, not previous one
		 day = +days[xind+1];
		 if (pos < day && !ignores[day])
		 break;
		 }*/

		var day_ind = _findBinary(days, pos);
		var day = +this._tasks.trace_x[day_ind];
		while (ignores[day]) {
			day = this._tasks.trace_x[++day_ind];
		}

		if (!day) return 0;

		return day_ind + ((date - days[day_ind]) / this._getColumnDuration(this._tasks, days[day_ind]));
	},
	getItemPosition:function (task, start_date, end_date) {
		var x = this.posFromDate(start_date || task.start_date);
		var x2 = this.posFromDate(end_date || task.end_date);
		x2 = Math.max(x, x2);
		var y = this.getItemTop(task.id);
		var height = this.$gantt.getTaskHeight();
		return {
			left: x,
			top: y,
			height: height,
			width: Math.max((x2 - x), 0)
		};
	},

	getItemHeight: function(){
		var config = this.$getConfig();

		// height of the bar item
		var height = config.task_height;

		if (height == "full") {
			var offset = config.task_height_offset || 5;
			height = config.row_height - offset;
		}
		//item height cannot be bigger than row height
		height = Math.min(height, config.row_height);
		return Math.max(height, 0);
	},

	getRowTop: function(index){
		return index * this.$getConfig().row_height;
	},

	getItemTop: function (task_id) {
		if(this.$config.bind){
			var store = this.$gantt.getDatastore(this.$config.bind);
			if(!store) return 0;

			return store.getIndexById(task_id) * this.$gantt.config.row_height;

		}else{
			return 0;
		}

	},

	getScale: function(){
		return this._tasks;
	},

	_getScales: function _get_scales() {
		var config = this.$getConfig();
		var helpers = this.$scaleHelper;
		var scales = [helpers.primaryScale()].concat(config.subscales);

		helpers.sortScales(scales);
		return scales;
	},

	_getColumnDuration: function _get_coll_duration(scale, date) {
		return this.$gantt.date.add(date, scale.step, scale.unit) - date;
	},

	refresh: function(){
		this._render_tasks_scales();
	},

	destroy: function(){
		var gantt = this.$gantt;
		this._clearLayers(gantt);

		this.$task = null;
		this.$task_scale = null;
		this.$task_data = null;
		this.$task_bg = null;
		this.$task_links = null;
		this.$task_bars = null;

		this.$gantt = null;
	}
};

module.exports = Timeline;

function _findBinary(array, target) {
	// modified binary search, target value not exactly match array elements, looking for closest one

	var low = 0, high = array.length - 1, i, item, prev;
	while (low <= high) {

		i = Math.floor((low + high) / 2);
		item = +array[i];
		prev = +array[i - 1];
		if (item < target) {
			low = i + 1;
			continue;
		}
		if (item > target) {
			if (!(!isNaN(prev) && prev < target)) {
				high = i - 1;
				continue;
			} else {
				// if target is between 'i' and 'i-1' return 'i - 1'
				return i - 1;
			}

		}
		while (+array[i] == +array[i + 1]) i++;

		return i;
	}
	return array.length - 1;
}



/***/ }),
/* 38 */
/***/ (function(module, exports) {

var createStaticBgHelper = function(){
	return {
		render: function(){}
	};
};

module.exports = {
	create: function(){
		return createStaticBgHelper();
	}
};



/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1),
	utils = __webpack_require__(0),
	eventable = __webpack_require__(2),
	gridResize = __webpack_require__(40),
	configurable = __webpack_require__(14);

var Grid = function(parent, config, factory, gantt){
	this.$config = utils.mixin({}, config || {});
	this.$gantt = gantt;
	this.$parent = parent;
	configurable(this);
	eventable(this);
	this.$state = {};
};

Grid.prototype = {
	init: function(container){
		var gantt = this.$gantt;
		var gridAriaAttr = gantt._waiAria.gridAttrString();
		var gridDataAriaAttr = gantt._waiAria.gridDataAttrString();

		container.innerHTML = "<div class='gantt_grid' style='height:inherit;width:inherit;' "+gridAriaAttr+"></div>";
		this.$grid = container.childNodes[0];

		this.$grid.innerHTML = "<div class='gantt_grid_scale' "+
			gantt._waiAria.gridScaleRowAttrString()+"></div><div class='gantt_grid_data' "+gridDataAriaAttr+"></div>";

		this.$grid_scale = this.$grid.childNodes[0];
		this.$grid_data = this.$grid.childNodes[1];

		var attr = this.$getConfig()[this.$config.bind + "_attribute"];
		if(!attr && this.$config.bind){
			attr = this.$config.bind + "_id";
		}
		this.$config.item_attribute = attr || null;
		var layers = this._createLayerConfig();
		if(!this.$config.layers){
			this.$config.layers = layers;
		}

		var resizer = gridResize(this.$gantt, this);
		resizer.init();
		this._renderHeaderResizers = resizer.doOnRender;

		this._addLayers(this.$gantt);
		this.callEvent("onReady", []);
		//this.refresh();
	},
	setSize: function(width, height){
		this.$config.width = width + 1;
		this.$state.width = width;
		this.$state.height = height;
		var colsWidth = this._setColumnsWidth(this.$config.width);
		this.$config.width -= 1;

		var config = this.$getConfig();
		if(colsWidth !== width){
			config.grid_width = colsWidth;
			this.$config.width = colsWidth - 1;
		}

		var dataHeight = Math.max(this.$state.height - config.scale_height, 0);
		this.$grid_data.style.height = dataHeight + "px";
		this.refresh();
	},
	getSize: function(){

		var config = this.$getConfig();

		var store = this.$gantt.getDatastore(this.$config.bind);

		var contentHeight = store ? config.row_height * store.countVisible() : 0,
			contentWidth = this._getGridWidth();

		var size = {
			x: this.$state.width,
			y: this.$state.height,
			contentX: this.isVisible() ? contentWidth: 0,
			contentY: this.isVisible() ? (config.scale_height + contentHeight) : 0,
			scrollHeight: this.isVisible() ? contentHeight: 0,
			scrollWidth: this.isVisible() ? contentWidth : 0
		};

		return size;
	},
	refresh: function(){
		this._calculateGridWidth();
		this._renderGridHeader();
	},
	scrollTo: function(left, top){
		if(!this.isVisible())
			return;

		if (left*1 == left){
			this.$grid.scrollLeft = left;
			this.$state.scrollLeft = this.$grid.scrollLeft;
		}

		var config = this.$getConfig();
		if(top*1 == top){
			this.$grid_data.scrollTop = top;
			this.$state.scrollTop = this.$grid_data.scrollTop;
			if(config.smart_rendering && this.$grid_data.scrollTop !== top){
				this.$grid_data.scrollTop = top % config.row_height;
				this.$state.scrollTop = this.$grid_data.scrollTop;
			}
		}else{
			if(config.smart_rendering && this.$grid_data.scrollTop !== this.$state.scrollTop){
				this.$grid_data.scrollTop = this.$state.scrollTop % config.row_height;
			}
		}
	},
	getGridColumns: function(){
		var config = this.$getConfig();
		return config.columns;
	},
	isVisible: function(){
		if(this.$parent && this.$parent.$config){
			return !this.$parent.$config.hidden;
		}else{
			return this.$grid.offsetWidth;
		}
	},

	_createLayerConfig: function(){
		var gantt = this.$gantt;
		var self = this;
		var layers = [
			{
				renderer: gantt.$ui.layers.gridLine,
				container: this.$grid_data,
				filter: [function(){
					return self.isVisible();
				}]
			}
		];
		return layers;
	},

	_addLayers: function(gantt){
		if(!this.$config.bind)
			return;

		this._taskLayers = [];

		var self = this;

		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);

		if(!taskRenderer){
			taskRenderer = layers.createDataRender({
				name: this.$config.bind,
				defaultContainer: function(){ return self.$grid_data;}
			});
		}

		var taskLayers = this.$config.layers;
		for(var i = 0; taskLayers && i < taskLayers.length; i++){
			var layer = taskLayers[i];
			layer.host = this;
			var bar_layer = taskRenderer.addLayer(layer);
			this._taskLayers.push(bar_layer);
		}
	},

	_clearLayers: function(gantt){
		var layers = this.$gantt.$services.getService("layers");
		var taskRenderer = layers.getDataRender(this.$config.bind);

		for(var i = 0; i < this._taskLayers.length; i++){
			taskRenderer.removeLayer(this._taskLayers[i]);
		}

		this._taskLayers = [];
	},

	_setColumnsWidth: function(newWidth){
		var config = this.$getConfig();
		var columns = this.getGridColumns(),
			columns_width = 0,
			final_width = newWidth;

		for (var i = 0, l = columns.length; i < l; i++) {
			columns_width += columns[i].width*1;
		}

		if(isNaN(columns_width)){
			this._calculateGridWidth();
		}
		columns_width = 0;
		for (var i = 0, l = columns.length; i < l; i++) {
			columns_width += columns[i].width*1;
		}

		var columns_count = columns.length,
			extra_width = final_width - columns_width;

		var colShare = 0;
		for (var i = 0; i < columns_count; i++) {
			var share = Math.floor(extra_width * (columns[i].width / columns_width));
			columns_width -= columns[i].width;
			colShare = columns[i].width + share;

			if ((columns[i].min_width && colShare >= columns[i].min_width) || !columns[i].min_width ||
				colShare > columns[i].width) {
				extra_width -= share;
				columns[i].width = colShare;
			}

		}

		var iterator = extra_width > 0 ? 1 : -1;
		while ((extra_width > 0 && iterator === 1) || (extra_width < 0 && iterator === -1)) {
			var curExtra = extra_width;
			for (i = 0; i < columns_count; i++) {
				var newWidth = columns[i].width + iterator;

				if ((columns[i].min_width && newWidth >= columns[i].min_width) || !columns[i].min_width ||
					colShare > columns[i].width) {
					extra_width -= iterator;
					columns[i].width = newWidth;
					if (!extra_width) {
						break;
					}
				}
			}
			if (curExtra == extra_width) {
				break;
			}
		}

		//if (this.callEvent("onGridResizeEnd", [config.grid_width, final_width]) === false)
		//	return;

		return final_width;
	},

	_getColsTotalWidth: function(){
		var columns = this.getGridColumns();
		var cols_width = 0;

		for (var i = 0; i < columns.length; i++) {
			var v = parseFloat(columns[i].width);
			if (window.isNaN(v)) {
				return false;
			}
			cols_width += v;
		}
		return cols_width;
	},
	_calculateGridWidth: function(){
		var config = this.$getConfig();
		var columns = this.getGridColumns();
		var cols_width = 0;
		var unknown = [];
		var width = [];

		for (var i = 0; i < columns.length; i++) {
			var v = parseFloat(columns[i].width);
			if (window.isNaN(v)) {
				v = 50;
				unknown.push(i);
			}
			width[i] = v;
			cols_width += v;
		}
		var gridWidth = this._getGridWidth();
		if (config.autofit || unknown.length) {
			var diff = gridWidth - cols_width;
			// TODO: logic may be improved for proportional changing of width
			var step = diff / (unknown.length > 0 ? unknown.length : (width.length > 0 ? width.length : 1));
			if (unknown.length > 0) {
				// there are several columns with undefined width
				var delta = diff / (unknown.length ? unknown.length : 1);
				for (var i = 0; i < unknown.length; i++) {
					var index = unknown[i];
					width[index] += delta;
				}
			} else {
				// delta must be added for all columns
				var delta = diff / (width.length ? width.length : 1);
				for (var i = 0; i < width.length; i++)
					width[i] += delta;
			}

			for (var i = 0; i < width.length; i++) {
				columns[i].width = width[i];
			}
		} else {
			var changed = (gridWidth != cols_width);
			this.$config.width = cols_width - 1;
			config.grid_width = cols_width;
			if(changed){
				this.$parent._setContentSize(this.$config.width, this.$config.height);
//				this.$parent.$config.width = cols_width;
			}
		}
	},

	_renderGridHeader: function(){
		var gantt = this.$gantt;
		var config = this.$getConfig();
		var locale = this.$gantt.locale;
		var templates = this.$gantt.templates;

		var columns = this.getGridColumns();
		var cells = [];
		var width = 0,
			labels = locale.labels;

		var lineHeigth = config.scale_height - 1;

		for (var i = 0; i < columns.length; i++) {
			var last = i == columns.length - 1;
			var col = columns[i];

			// ensure columns have non-empty names
			if (!col.name) {
				col.name = gantt.uid() + "";
			}

			var colWidth = col.width * 1;

			var gridWidth = this._getGridWidth();
			if (last && gridWidth > width + colWidth)
				col.width = colWidth = gridWidth - width;
			width += colWidth;
			var sort = (gantt._sort && col.name == gantt._sort.name) ? ("<div class='gantt_sort gantt_" + gantt._sort.direction + "'></div>") : "";
			var cssClass = ["gantt_grid_head_cell",
				("gantt_grid_head_" + col.name),
				(last ? "gantt_last_cell" : ""),
				templates.grid_header_class(col.name, col)].join(" ");

			var style = "width:" + (colWidth - (last ? 1 : 0)) + "px;";
			var label = (col.label || labels["column_" + col.name]);
			label = label || "";

			var ariaAttrs = gantt._waiAria.gridScaleCellAttrString(col, label);

			var cell = "<div class='" + cssClass + "' style='" + style + "' " + ariaAttrs + " column_id='" + col.name + "'>" + label + sort + "</div>";
			cells.push(cell);
		}
		this.$grid_scale.style.height = (config.scale_height) + "px";
		this.$grid_scale.style.lineHeight = lineHeigth + "px";
		this.$grid_scale.style.width = "inherit";
		this.$grid_scale.innerHTML = cells.join("");

		if(this._renderHeaderResizers){
			this._renderHeaderResizers();
		}
	},

	_getGridWidth: function(){
		return this.$config.width;
	},

	destroy: function(){
		this._clearLayers(this.$gantt);

		this.$grid = null;
		this.$grid_scale = null;
		this.$grid_data = null;
		this.$gantt = null;
		this.callEvent("onDestroy", []);
		this.detachAllEvents();
	}
};

module.exports = Grid;


/***/ }),
/* 40 */
/***/ (function(module, exports) {

function createResizer(gantt, grid){
	return {
		init: function(){},
		doOnRender: function(){}
	};
}

module.exports = createResizer;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

function createTaskRenderer(gantt){

	function _render_task_element(task, view) {
		var config = view.$getConfig();
		var painters = config.type_renderers;
		var renderer = painters[gantt.getTaskType(task.type)],
			defaultRenderer = _task_default_render;

		if (!renderer) {
			renderer = defaultRenderer;
		}
		return renderer.call(gantt, task, view, gantt.bind(defaultRenderer, gantt));
	}

	function _task_default_render(task, view) {
		if (gantt._isAllowedUnscheduledTask(task))
			return;


		var pos = view.getItemPosition(task);

		var cfg = view.$getConfig();
		var height = view.getItemHeight();

		var taskType = gantt.getTaskType(task.type);

		var padd = Math.floor((gantt.config.row_height - height) / 2);
		if (taskType == cfg.types.milestone && cfg.link_line_width > 1) {
			//little adjust milestone position, so horisontal corners would match link arrow when thickness of link line is more than 1px
			padd += 1;
		}

		if (taskType == cfg.types.milestone){
			pos.left -= Math.round(height / 2);
			pos.width = height;
		}

		var div = document.createElement("div");

		var width = Math.round(pos.width);

		if(view.$config.item_attribute){
			div.setAttribute(view.$config.item_attribute, task.id);
		}

		if (cfg.show_progress && taskType != cfg.types.milestone) {
			_render_task_progress(task, div, width);
		}

		//use separate div to display content above progress bar
		var content = _render_task_content(task, width);
		if (task.textColor) {
			content.style.color = task.textColor;
		}
		div.appendChild(content);

		var css = _combine_item_class("gantt_task_line",
			gantt.templates.task_class(task.start_date, task.end_date, task),
			task.id,
			view);
		if (task.color || task.progressColor || task.textColor) {
			css += " gantt_task_inline_color";
		}
		div.className = css;

		var styles = [
			"left:" + pos.left + "px",
			"top:" + (padd + pos.top) + 'px',
			"height:" + height + 'px',
			"line-height:" + (Math.max(height < 30 ? height - 2 : height, 0)) + 'px',
			"width:" + width + 'px'
		];
		if (task.color) {
			styles.push("background-color:" + task.color);
		}
		if (task.textColor) {
			styles.push("color:" + task.textColor);
		}

		div.style.cssText = styles.join(";");
		var side = _render_leftside_content(task);
		if (side) div.appendChild(side);

		side = _render_rightside_content(task);
		if (side) div.appendChild(side);

		gantt._waiAria.setTaskBarAttr(task, div);

		var state = gantt.getState();

		if (!gantt.isReadonly(task)) {
			if (cfg.drag_resize && !gantt.isSummaryTask(task) && taskType != cfg.types.milestone) {
				_render_pair(div, "gantt_task_drag", task, function (css) {
					var el = document.createElement("div");
					el.className = css;
					return el;
				});
			}
			if (cfg.drag_links && cfg.show_links) {
				_render_pair(div, "gantt_link_control", task, function (css) {
					var outer = document.createElement("div");
					outer.className = css;
					outer.style.cssText = [
						"height:" + height + 'px',
						"line-height:" + height + 'px'
					].join(";");
					var inner = document.createElement("div");
					inner.className = "gantt_link_point";

					var showLinkPoints = false;
					if(state.link_source_id && cfg.touch){
						showLinkPoints = true;
					}

					inner.style.display = showLinkPoints ? "block" : "";
					outer.appendChild(inner);
					return outer;
				});
			}
		}
		return div;
	}

	function _render_side_content(task, template, cssClass) {
		if (!template) return null;

		var text = template(task.start_date, task.end_date, task);
		if (!text) return null;
		var content = document.createElement("div");
		content.className = "gantt_side_content " + cssClass;
		content.innerHTML = text;
		return content;
	}

	function _render_leftside_content(task) {
		var css = "gantt_left " + _get_link_crossing_css(true, task);
		return _render_side_content(task, gantt.templates.leftside_text, css);
	}

	function _render_rightside_content(task) {
		var css = "gantt_right " + _get_link_crossing_css(false, task);
		return _render_side_content(task, gantt.templates.rightside_text, css);
	}

	function _get_link_crossing_css(left, task) {
		var cond = _get_conditions(left);

		for (var i in cond) {
			var links = task[i];
			for (var ln = 0; ln < links.length; ln++) {
				var link = gantt.getLink(links[ln]);

				for (var tp = 0; tp < cond[i].length; tp++) {
					if (link.type == cond[i][tp]) {
						return "gantt_link_crossing";
					}
				}
			}
		}
		return "";
	}


	function _render_task_content(task, width) {
		var content = document.createElement("div");
		if (gantt.getTaskType(task.type) != gantt.config.types.milestone)
			content.innerHTML = gantt.templates.task_text(task.start_date, task.end_date, task);
		content.className = "gantt_task_content";
		//content.style.width = width + 'px';
		return content;
	}

	function _render_task_progress(task, element, maxWidth) {
		var done = task.progress * 1 || 0;

		maxWidth = Math.max(maxWidth - 2, 0);//2px for borders
		var pr = document.createElement("div");
		var width = Math.round(maxWidth * done);

		width = Math.min(maxWidth, width);
		if (task.progressColor) {
			pr.style.backgroundColor = task.progressColor;
			pr.style.opacity = 1;
		}
		pr.style.width = width + 'px';
		pr.className = "gantt_task_progress";
		pr.innerHTML = gantt.templates.progress_text(task.start_date, task.end_date, task);

		var wrapper = document.createElement("div");
		wrapper.className = "gantt_task_progress_wrapper";
		wrapper.appendChild(pr);
		element.appendChild(wrapper);

		if (gantt.config.drag_progress && !gantt.isReadonly(task)) {
			var drag = document.createElement("div");
			drag.style.left = width + 'px';
			drag.className = "gantt_task_progress_drag";
			pr.appendChild(drag);
			element.appendChild(drag);
		}
	}

	function _get_conditions(leftside) {
		if (leftside) {
			return {
				$source: [
					gantt.config.links.start_to_start
				],
				$target: [
					gantt.config.links.start_to_start,
					gantt.config.links.finish_to_start
				]
			};
		} else {
			return {
				$source: [
					gantt.config.links.finish_to_start,
					gantt.config.links.finish_to_finish
				],
				$target: [
					gantt.config.links.finish_to_finish
				]
			};
		}
	}

	function _combine_item_class(basic, template, itemId, view) {
		var cfg = view.$getConfig();
		var css = [basic];
		if (template)
			css.push(template);

		var state = gantt.getState();

		var task = gantt.getTask(itemId);

		if (gantt.getTaskType(task.type) == cfg.types.milestone) {
			css.push("gantt_milestone");
		}

		if (gantt.getTaskType(task.type) == cfg.types.project) {
			css.push("gantt_project");
		}

		if (gantt.isSummaryTask(task))
			css.push("gantt_dependent_task");

		if (cfg.select_task && itemId == state.selected_task)
			css.push("gantt_selected");

		if (itemId == state.drag_id) {
			css.push("gantt_drag_" + state.drag_mode);
			if (state.touch_drag) {
				css.push("gantt_touch_" + state.drag_mode);
			}
		}

		if (state.link_source_id == itemId)
			css.push("gantt_link_source");

		if (state.link_target_id == itemId)
			css.push("gantt_link_target");


		if (cfg.highlight_critical_path && gantt.isCriticalTask) {
			if (gantt.isCriticalTask(task))
				css.push("gantt_critical_task");
		}

		if (state.link_landing_area &&
			(state.link_target_id && state.link_source_id) &&
			(state.link_target_id != state.link_source_id)) {

			var from_id = state.link_source_id;
			var from_start = state.link_from_start;
			var to_start = state.link_to_start;

			var allowDrag = gantt.isLinkAllowed(from_id, itemId, from_start, to_start);

			var dragClass = "";
			if (allowDrag) {
				if (to_start)
					dragClass = "link_start_allow";
				else
					dragClass = "link_finish_allow";
			} else {
				if (to_start)
					dragClass = "link_start_deny";
				else
					dragClass = "link_finish_deny";
			}
			css.push(dragClass);
		}
		return css.join(" ");
	}

	function _render_pair(parent, css, task, content) {
		var state = gantt.getState();

		if (+task.start_date >= +state.min_date)
			parent.appendChild(content(css + " task_left"));

		if (+task.end_date <= +state.max_date)
			parent.appendChild(content(css + " task_right"));
	}

	return _render_task_element;
}

module.exports = createTaskRenderer;

/***/ }),
/* 42 */
/***/ (function(module, exports) {

function createTaskBgRender(gantt){
	//this.getTaskTop
	function _render_bg_line(item, view) {
		var config = view.$getConfig();
		var cfg = view.getScale();
		var count = cfg.count;
		var row = document.createElement("div");
		if (config.show_task_cells) {
			for (var j = 0; j < count; j++) {
				var width = cfg.width[j],
					cssclass = "";

				if (width > 0) {//do not render skipped columns
					var cell = document.createElement("div");
					cell.style.width = (width) + "px";

					cssclass = "gantt_task_cell" + (j == count - 1 ? " gantt_last_cell" : "");
					cssTemplate = gantt.templates.task_cell_class(item, cfg.trace_x[j]);
					if (cssTemplate)
						cssclass += " " + cssTemplate;
					cell.className = cssclass;

					row.appendChild(cell);
				}

			}
		}
		var odd = gantt.getGlobalTaskIndex(item.id) % 2 !== 0;
		var cssTemplate = gantt.templates.task_row_class(item.start_date, item.end_date, item);
		var css = "gantt_task_row" + (odd ? " odd" : "") + (cssTemplate ? ' ' + cssTemplate : '');

		if (gantt.getState().selected_task == item.id) {
			css += " gantt_selected";
		}

		//var row = "<div class='" + css + "' " + this.config.task_attribute + "='" + item.id + "'>" + cells.join("") + "</div>";

		row.className = css;

		if (config.smart_rendering) {
			row.style.position = "absolute";
			row.style.top = view.getItemPosition(item).top + "px";
			row.style.width = "100%";
		}
		row.style.height = (config.row_height) + "px";

		if(view.$config.item_attribute){
			row.setAttribute(view.$config.item_attribute, item.id);
		}

		return row;
	}

	return _render_bg_line;
}

module.exports = createTaskBgRender;

/***/ }),
/* 43 */
/***/ (function(module, exports) {


function createLinkRender(gantt){

function _render_link_element(link, view) {
	var config = view.$getConfig();
	var dots = path_builder.get_points(link, view);
	var lines = drawer.get_lines(dots, view);

	var div = document.createElement("div");

	var css = "gantt_task_link";

	if (link.color) {
		css += " gantt_link_inline_color";
	}
	var cssTemplate = gantt.templates.link_class ? gantt.templates.link_class(link) : "";
	if (cssTemplate) {
		css += " " + cssTemplate;
	}

	if (config.highlight_critical_path && gantt.isCriticalLink) {
		if (gantt.isCriticalLink(link))
			css += " gantt_critical_link";
	}

	div.className = css;

	if(view.$config.link_attribute){
		div.setAttribute(view.$config.link_attribute, link.id);
	}

	for (var i = 0; i < lines.length; i++) {
		if (i == lines.length - 1) {
			lines[i].size -= config.link_arrow_size;
		}
		var el = drawer.render_line(lines[i], lines[i + 1], view);
		if (link.color) {
			el.firstChild.style.backgroundColor = link.color;
		}
		div.appendChild(el);
	}

	var direction = lines[lines.length - 1].direction;
	var endpoint = _render_link_arrow(dots[dots.length - 1], direction, view);
	if (link.color) {
		endpoint.style.borderColor = link.color;
	}
	div.appendChild(endpoint);

	gantt._waiAria.linkAttr(link, div);

	return div;
}

function _render_link_arrow(point, direction, view) {
	var config = view.$getConfig();
	var div = document.createElement("div");
	var top = point.y;
	var left = point.x;

	var size = config.link_arrow_size;
	var line_width = config.row_height;
	var className = "gantt_link_arrow gantt_link_arrow_" + direction;
	switch (direction) {
		case drawer.dirs.right:
			top -= (size - line_width) / 2;
			left -= size;
			break;
		case drawer.dirs.left:
			top -= (size - line_width) / 2;
			break;
		case drawer.dirs.up:
			left -= size;
			break;
		case drawer.dirs.down:
			top += size * 2;
			left -= size;
			break;
		default:
			break;
	}
	div.style.cssText = [
		"top:" + top + "px",
		"left:" + left + 'px'].join(';');
	div.className = className;

	return div;
}


var drawer = {
	current_pos: null,
	dirs: {"left": 'left', "right": 'right', "up": 'up', "down": 'down'},
	path: [],
	clear: function () {
		this.current_pos = null;
		this.path = [];
	},
	point: function (pos) {
		this.current_pos = gantt.copy(pos);
	},
	get_lines: function (dots) {
		this.clear();
		this.point(dots[0]);
		for (var i = 1; i < dots.length; i++) {
			this.line_to(dots[i]);
		}
		return this.get_path();
	},
	line_to: function (pos) {
		var next = gantt.copy(pos);
		var prev = this.current_pos;

		var line = this._get_line(prev, next);
		this.path.push(line);
		this.current_pos = next;
	},
	get_path: function () {
		return this.path;
	},
	get_wrapper_sizes: function (v, view) {
		var config = view.$getConfig();
		var res,
			wrapper_size = config.link_wrapper_width,
			line_size = config.link_line_width,
			y = v.y + (config.row_height - wrapper_size) / 2;
		switch (v.direction) {
			case this.dirs.left:
				res = {
					top: y,
					height: wrapper_size,
					lineHeight: wrapper_size,
					left: v.x - v.size - wrapper_size / 2,
					width: v.size + wrapper_size
				};
				break;
			case this.dirs.right:
				res = {
					top: y,
					lineHeight: wrapper_size,
					height: wrapper_size,
					left: v.x - wrapper_size / 2,
					width: v.size + wrapper_size
				};
				break;
			case this.dirs.up:
				res = {
					top: y - v.size,
					lineHeight: v.size + wrapper_size,
					height: v.size + wrapper_size,
					left: v.x - wrapper_size / 2,
					width: wrapper_size
				};
				break;
			case this.dirs.down:
				res = {
					top: y /*- wrapper_size/2*/,
					lineHeight: v.size + wrapper_size,
					height: v.size + wrapper_size,
					left: v.x - wrapper_size / 2,
					width: wrapper_size
				};
				break;
			default:
				break;
		}

		return res;
	},
	get_line_sizes: function (v, view) {
		var config = view.$getConfig();
		var res,
			line_size = config.link_line_width,
			wrapper_size = config.link_wrapper_width,
			size = v.size + line_size;
		switch (v.direction) {
			case this.dirs.left:
			case this.dirs.right:
				res = {
					height: line_size,
					width: size,
					marginTop: (wrapper_size - line_size) / 2,
					marginLeft: (wrapper_size - line_size) / 2
				};
				break;
			case this.dirs.up:
			case this.dirs.down:
				res = {
					height: size,
					width: line_size,
					marginTop: (wrapper_size - line_size) / 2,
					marginLeft: (wrapper_size - line_size) / 2
				};
				break;
			default:
				break;
		}


		return res;
	},
	render_line: function (v, end, view) {
		var pos = this.get_wrapper_sizes(v, view);
		var wrapper = document.createElement("div");
		wrapper.style.cssText = [
			"top:" + pos.top + "px",
			"left:" + pos.left + "px",
			"height:" + pos.height + "px",
			"width:" + pos.width + "px"
		].join(';');
		wrapper.className = "gantt_line_wrapper";

		var innerPos = this.get_line_sizes(v, view);
		var inner = document.createElement("div");
		inner.style.cssText = [
			"height:" + innerPos.height + "px",
			"width:" + innerPos.width + "px",
			"margin-top:" + innerPos.marginTop + "px",
			"margin-left:" + innerPos.marginLeft + "px"
		].join(";");

		inner.className = "gantt_link_line_" + v.direction;
		wrapper.appendChild(inner);

		return wrapper;
	},
	_get_line: function (from, to) {
		var direction = this.get_direction(from, to);
		var vect = {
			x: from.x,
			y: from.y,
			direction: this.get_direction(from, to)
		};
		if (direction == this.dirs.left || direction == this.dirs.right) {
			vect.size = Math.abs(from.x - to.x);
		} else {
			vect.size = Math.abs(from.y - to.y);
		}
		return vect;
	},
	get_direction: function (from, to) {
		var direction = 0;
		if (to.x < from.x) {
			direction = this.dirs.left;
		} else if (to.x > from.x) {
			direction = this.dirs.right;
		} else if (to.y > from.y) {
			direction = this.dirs.down;
		} else {
			direction = this.dirs.up;
		}
		return direction;
	}

};

var path_builder = {

	path: [],
	clear: function () {
		this.path = [];
	},
	current: function () {
		return this.path[this.path.length - 1];
	},
	point: function (next) {
		if (!next)
			return this.current();

		this.path.push(gantt.copy(next));
		return next;
	},
	point_to: function (direction, diff, point) {
		if (!point)
			point = gantt.copy(this.point());
		else
			point = {x: point.x, y: point.y};
		var dir = drawer.dirs;
		switch (direction) {
			case (dir.left):
				point.x -= diff;
				break;
			case (dir.right):
				point.x += diff;
				break;
			case (dir.up):
				point.y -= diff;
				break;
			case (dir.down):
				point.y += diff;
				break;
			default:
				break;
		}
		return this.point(point);
	},
	get_points: function (link, view) {
		var config = view.$getConfig();
		var pt = this.get_endpoint(link, view);
		var xy = gantt.config;


		var dy = pt.e_y - pt.y;
		var dx = pt.e_x - pt.x;

		var dir = drawer.dirs;

		this.clear();
		this.point({x: pt.x, y: pt.y});

		var shiftX = 2 * xy.link_arrow_size;//just random size for first line


		var forward = (pt.e_x > pt.x);
		if (link.type == config.links.start_to_start) {
			this.point_to(dir.left, shiftX);
			if (forward) {
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}
			this.point_to(dir.right, shiftX);

		} else if (link.type == config.links.finish_to_start) {
			forward = (pt.e_x > (pt.x + 2 * shiftX));
			this.point_to(dir.right, shiftX);
			if (forward) {
				dx -= shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				dx -= 2 * shiftX;
				var sign = dy > 0 ? 1 : -1;

				this.point_to(dir.down, sign * (xy.row_height / 2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (xy.row_height / 2)));
				this.point_to(dir.right, shiftX);
			}

		} else if (link.type == config.links.finish_to_finish) {
			this.point_to(dir.right, shiftX);
			if (forward) {
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			} else {
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}
			this.point_to(dir.left, shiftX);
		} else if (link.type == config.links.start_to_finish) {

			forward = (pt.e_x > (pt.x - 2 * shiftX));
			this.point_to(dir.left, shiftX);

			if (!forward) {
				dx += shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				dx += 2 * shiftX;
				var sign = dy > 0 ? 1 : -1;
				this.point_to(dir.down, sign * (xy.row_height / 2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (xy.row_height / 2)));
				this.point_to(dir.left, shiftX);
			}

		}

		return this.path;
	},
	get_endpoint: function (link, view) {
		var config = view.$getConfig();
		var types = config.links;
		var from_start = false, to_start = false;

		if (link.type == types.start_to_start) {
			from_start = to_start = true;
		} else if (link.type == types.finish_to_finish) {
			from_start = to_start = false;
		} else if (link.type == types.finish_to_start) {
			from_start = false;
			to_start = true;
		} else if (link.type == types.start_to_finish) {
			from_start = true;
			to_start = false;
		} else {
			gantt.assert(false, "Invalid link type");
		}

		var source = gantt.getTask(link.source);
		var target = gantt.getTask(link.target);

		var from = getMilestonePosition(source, view),
			to = getMilestonePosition(target, view);

		return {
			x: from_start ? from.left : (from.left + from.width),
			e_x: to_start ? to.left : (to.left + to.width),
			y: from.top,
			e_y: to.top
		};
	}
};

function getMilestonePosition(task, view){
	var config = view.$getConfig();
	var pos = view.getItemPosition(task);
	if(gantt.getTaskType(task.type) == config.types.milestone){
		var milestoneHeight = gantt.getTaskHeight();
		var milestoneWidth = Math.sqrt(2*milestoneHeight*milestoneHeight);
		pos.left -= milestoneWidth / 2;
		pos.width = milestoneWidth;
	}
	return pos;
}

return _render_link_element;

}

module.exports = createLinkRender;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var dateHelper = __webpack_require__(3);

function createGridLineRender(gantt){
	function _render_grid_item(item, view) {
		//if (!_is_grid_visible.call(this))
		//	return null;

		var columns = view.getGridColumns();
		var config = view.$getConfig();

		var cells = [];
		var width = 0;
		var has_child;
		for (var i = 0; i < columns.length; i++) {
			var last = i == columns.length - 1;
			var col = columns[i];
			var cell;

			var value;
			var textValue;
			if (col.name == "add") {
				var aria = gantt._waiAria.gridAddButtonAttrString(col);

				value = "<div " + aria + " class='gantt_add'></div>";
				textValue = "";
			} else {
				if (col.template)
					value = col.template(item);
				else
					value = item[col.name];

				if (dateHelper.isDate(value))
					value = gantt.templates.date_grid(value, item);
				textValue = value;
				value = "<div class='gantt_tree_content'>" + value + "</div>";
			}
			var css = "gantt_cell" + (last ? " gantt_last_cell" : "");

			var tree = "";
			if (col.tree) {
				for (var j = 0; j < item.$level; j++)
					tree += gantt.templates.grid_indent(item);

				has_child = gantt._has_children(item.id);
				if (has_child) {
					tree += gantt.templates.grid_open(item);
					tree += gantt.templates.grid_folder(item);
				} else {
					tree += gantt.templates.grid_blank(item);
					tree += gantt.templates.grid_file(item);
				}
			}
			var style = "width:" + (col.width - (last ? 1 : 0)) + "px;";
			if (this.defined(col.align))
				style += "text-align:" + col.align + ";";

			var aria = gantt._waiAria.gridCellAttrString(col, textValue);

			cell = "<div class='" + css + "' style='" + style + "' " + aria + ">" + tree + value + "</div>";
			cells.push(cell);
		}
		var css = gantt.getGlobalTaskIndex(item.id) % 2 === 0 ? "" : " odd";
		css += (item.$transparent) ? " gantt_transparent" : "";

		css += (item.$dataprocessor_class ? " " + item.$dataprocessor_class : "");

		if (gantt.templates.grid_row_class) {
			var css_template = gantt.templates.grid_row_class.call(gantt, item.start_date, item.end_date, item);
			if (css_template)
				css += " " + css_template;
		}

		if (gantt.getState().selected_task == item.id) {
			css += " gantt_selected";
		}
		var el = document.createElement("div");
		el.className = "gantt_row" + css;
		el.style.height = config.row_height + "px";
		el.style.lineHeight = (config.row_height) + "px";
		
		if(view.$config.item_attribute){
			el.setAttribute(view.$config.item_attribute, item.id);
		}

		gantt._waiAria.taskRowAttr(item, el);

		el.innerHTML = cells.join("");
		return el;
	}

	return _render_grid_item;
}

module.exports = createGridLineRender;



/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var rowDnd = __webpack_require__(46);

var initializer = (function(){
	return function(gantt){
		return {
			onCreated: function (grid) {
				grid.$config = utils.mixin(grid.$config, {
					bind: "task"
				});
				if(grid.$config.id == "grid") {
					this.extendGantt(grid);
				}
			},
			onInitialized: function (grid) {
				var config = grid.$getConfig();
				if (config.order_branch) {
					rowDnd.init(grid.$gantt, grid);
				}

				this.initEvents(grid, gantt);
				if(grid.$config.id == "grid") {
					this.extendDom(grid);
				}
			},
			onDestroyed: function (grid) {
				this.clearEvents(grid, gantt);
			},

			initEvents: function (grid, gantt) {
				this._eventHandlers = [];
				var mouseEvents = gantt.$services.getService("mouseEvents");

				this._eventHandlers.push(["click", "gantt_close", gantt.bind(function (e, id, trg) {
					this.close(id);
					return false;
				}, gantt)]);
				this._eventHandlers.push(["click", "gantt_open", gantt.bind(function (e, id, trg) {
					this.open(id);
					return false;
				}, gantt)]);

				this._eventHandlers.push(["click", "gantt_row", gantt.bind(function (e, id, trg) {
					var config = grid.$getConfig();
					if (id !== null) {
						var task = this.getTask(id);
						if (config.scroll_on_click)
							this.showDate(task.start_date);
						gantt.callEvent("onTaskRowClick", [id, trg]);
					}
				}, gantt)]);

				this._eventHandlers.push(["click", "gantt_grid_head_cell", gantt.bind(function (e, id, trg) {
					var column = trg.getAttribute("column_id");

					if (!gantt.callEvent("onGridHeaderClick", [column, e]))
						return;

					var config = grid.$getConfig();

					if (column == "add") {
						mouseEvents.callHandler("click", "gantt_add", undefined, [e, config.root_id]);
						return;
					}

					if (config.sort) {
						var sorting_method = column,
							conf;

						for (var i = 0; i < config.columns.length; i++) {
							if (config.columns[i].name == column) {
								conf = config.columns[i];
								break;
							}
						}

						if (conf && conf.sort !== undefined && conf.sort !== true) {
							sorting_method = conf.sort;

							if (!sorting_method) { // column sort property 'false', no sorting
								return;
							}
						}

						var sort = (this._sort && this._sort.direction && this._sort.name == column) ? this._sort.direction : "desc";
						// invert sort direction
						sort = (sort == "desc") ? "asc" : "desc";
						this._sort = {
							name: column,
							direction: sort
						};
						this.sort(sorting_method, sort == "desc");
					}
				}, gantt)]);
				this._eventHandlers.push(["click", "gantt_add", gantt.bind(function (e, id, trg) {
					var config = grid.$getConfig();
					if (config.readonly) return;

					var item = {};
					this.createTask(item, id ? id : gantt.config.root_id);

					return false;
				}, gantt)]);

				for (var i = 0; i < this._eventHandlers.length; i++) {
					var h = this._eventHandlers[i];
					mouseEvents.delegate(h[0], h[1], h[2], this.$grid);
				}
			},

			clearEvents: function(grid, gantt){
				var mouseEvents = gantt.$services.getService("mouseEvents");
				for(var i = 0; i < this._eventHandlers.length; i++){
					var h = this._eventHandlers[i];
					mouseEvents.detach(h[0], h[1], h[2], grid.$grid);
				}
				this._eventHandlers = [];
			},

			extendDom: function(grid){
				gantt.$grid = grid.$grid;
				gantt.$grid_scale = grid.$grid_scale;
				gantt.$grid_data = grid.$grid_data;
			},
			extendGantt: function(grid){

				gantt.getGridColumns = gantt.bind(grid.getGridColumns, grid);

				grid.attachEvent("onColumnResizeStart", function(){
					return gantt.callEvent("onColumnResizeStart", arguments);
				});
				grid.attachEvent("onColumnResize", function(){
					return gantt.callEvent("onColumnResize", arguments);
				});
				grid.attachEvent("onColumnResizeEnd", function(){
					return gantt.callEvent("onColumnResizeEnd", arguments);
				});

				grid.attachEvent("onColumnResizeComplete", function(columns, totalWidth){
					gantt.config.grid_width = totalWidth;
				});
			}
		};
	};
})();

module.exports = initializer;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1);

function _init_dnd(gantt, grid) {
	var DnD = gantt.$services.getService("dnd");

	if(!grid.$config.bind || !gantt.getDatastore(grid.$config.bind)){
		return;
	}

	function locate(e){
		return domHelpers.locateAttribute(e, grid.$config.item_attribute);
	}

	function getStore(){
		return gantt.getDatastore(grid.$config.bind);
	}

	var dnd = new DnD(grid.$grid_data, {updates_per_second: 60});
	if (gantt.defined(grid.$getConfig().dnd_sensitivity))
		dnd.config.sensitivity = grid.$getConfig().dnd_sensitivity;

	dnd.attachEvent("onBeforeDragStart", gantt.bind(function (obj, e) {
		var el = locate(e);
		if (!el) return false;
		if (gantt.hideQuickInfo) gantt._hideQuickInfo();

		var id = el.getAttribute(grid.$config.item_attribute);

		var datastore = getStore();

		var task = datastore.getItem(id);

		if (gantt.isReadonly(task))
			return false;

		dnd.config.initial_open_state = task.$open;
		if (!gantt.callEvent("onRowDragStart", [id, e.target || e.srcElement, e])) {
			return false;
		}

	}, gantt));

	dnd.attachEvent("onAfterDragStart", gantt.bind(function (obj, e) {
		var el = locate(e);
		dnd.config.marker.innerHTML = el.outerHTML;
		dnd.config.id = el.getAttribute(grid.$config.item_attribute);

		var store = getStore();

		var task = store.getItem(dnd.config.id);
		dnd.config.index = store.getBranchIndex(dnd.config.id);
		dnd.config.parent = task.parent;
		task.$open = false;
		task.$transparent = true;
		this.refreshData();
	}, gantt));

	dnd.lastTaskOfLevel = function (level) {
		var last_item = null;
		var store = getStore();
		var tasks = store.getItems();
		for (var i = 0, len = tasks.length; i < len; i++) {
			if (tasks[i].$level == level) {
				last_item = tasks[i];
			}
		}
		return last_item ? last_item.id : null;
	};
	dnd._getGridPos = gantt.bind(function (e) {
		var pos = domHelpers.getNodePosition(grid.$grid_data);
		var store = getStore();
		// row offset
		var x = pos.x;
		var y = e.pos.y - 10;

		var config = grid.$getConfig();
		// prevent moving row out of grid_data container
		if (y < pos.y) y = pos.y;
		var gridHeight = store.countVisible() * config.row_height;
		if (y > pos.y + gridHeight - config.row_height) y = pos.y + gridHeight - config.row_height;

		pos.x = x;
		pos.y = y;
		return pos;
	}, gantt);
	dnd._getTargetY = gantt.bind(function (e) {
		var pos = domHelpers.getNodePosition(grid.$grid_data);

		var y = e.pageY - pos.y + grid.$state.scrollTop;
		if (y < 0)
			y = 0;
		return y;
	}, gantt);
	dnd._getTaskByY = gantt.bind(function (y, dropIndex) {

		var config = grid.$getConfig(),
			store = getStore();

		y = y || 0;
		if (config.smart_rendering) {
			y += grid.$grid_data.scrollTop;
		}

		var index = Math.floor(y / config.row_height);
		index = dropIndex < index ? index - 1 : index;

		if (index > store.countVisible() - 1)
			return null;

		return store.getIdByIndex(index);
	}, gantt);
	dnd.attachEvent("onDragMove", gantt.bind(function (obj, e) {
		var dd = dnd.config;
		var pos = dnd._getGridPos(e);

		var config = grid.$getConfig(),
			store = getStore();

		// setting position of row
		dd.marker.style.left = pos.x + 10 + "px";
		dd.marker.style.top = pos.y + "px";

		// highlight row when mouseover
		var item = store.getItem(dnd.config.id);
		var targetY = dnd._getTargetY(e);
		var el = dnd._getTaskByY(targetY, store.getIndexById(item.id));

		if (!store.exists(el)) {
			el = dnd.lastTaskOfLevel(config.order_branch_free ? item.$level : 0);
			if (el == dnd.config.id) {
				el = null;
			}
		}

		function allowedLevel(next, item) {
			return (!(store.isChildOf(over.id, item.id)) && (next.$level == item.$level || config.order_branch_free));
		}

		if (store.exists(el)) {
			var over = store.getItem(el);

			if (store.getIndexById(over.id) * config.row_height + config.row_height / 2 < targetY) {
				//hovering over bottom part of item, check can be drop to bottom
				var index = store.getIndexById(over.id);
				var nextId = store.getNext(over.id);//adds +1 when hovering over placeholder
				var next = store.getItem(nextId);
				if (next) {
					if (next.id != item.id) {
						over = next; //there is a valid target
					}
					else {
						if (config.order_branch_free) {
							if (!(store.isChildOf(item.id, over.id) && store.getChildren(over.id).length == 1))
								return;
							else {
								store.move(item.id, store.getBranchIndex(over.id) + 1, store.getParent(over.id));
								return;
							}
						}
						else {
							return;
						}
					}
				} else {
					//we at end of the list, check and drop at the end of list
					nextId = store.getIdByIndex(index);
					next = store.getItem(nextId);

					if (allowedLevel(next, item) && next.id != item.id) {
						store.move(item.id, -1, store.getParent(next.id));
						return;
					}
				}
			}
			else if (config.order_branch_free) {
				if (over.id != item.id && allowedLevel(over, item)) {
					if (!store.hasChild(over.id)) {
						over.$open = true;
						store.move(item.id, -1, over.id);
						return;
					}
					if (store.getIndexById(over.id) || config.row_height / 3 < targetY) return;
				}
			}
			//if item is on different level, check the one before it
			var index = store.getIndexById(over.id),
				prevId = store.getIdByIndex(index - 1);

			var prev = store.getItem(prevId);

			var shift = 1;
			while ((!prev || prev.id == over.id) && index - shift >= 0) {

				prevId = store.getIdByIndex(index - shift);
				prev = store.getItem(prevId);
				shift++;
			}

			if (item.id == over.id) return;
			//replacing item under cursor
			if (allowedLevel(over, item) && item.id != over.id) {
				store.move(item.id, 0, 0, over.id);

			} else if (over.$level == item.$level - 1 && !store.getChildren(over.id).length) {
				store.move(item.id, 0, over.id);

			} else if (prev && (allowedLevel(prev, item)) && (item.id != prev.id)) {
				store.move(item.id, -1, store.getParent(prev.id));

			}
		}
		return true;
	}, gantt));

	dnd.attachEvent("onDragEnd", gantt.bind(function () {
		var store = getStore();
		var task = store.getItem(dnd.config.id);
		task.$transparent = false;
		task.$open = dnd.config.initial_open_state;

		if (this.callEvent("onBeforeRowDragEnd", [dnd.config.id, dnd.config.parent, dnd.config.index]) === false) {
			store.move(dnd.config.id, dnd.config.index, dnd.config.parent);
			task.$drop_target = null;
		} else {
			this.callEvent("onRowDragEnd", [dnd.config.id, task.$drop_target]);
		}

		store.refresh(task.id);
		//this.refreshData();
	}, gantt));
}

module.exports = {
	init: _init_dnd
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0),
	taskDnD = __webpack_require__(48),
	linkDnD = __webpack_require__(49),
	domHelpers = __webpack_require__(1);

var initializer = (function(){
	return function(gantt){
		var services = gantt.$services;
		return {
			onCreated: function (timeline) {
				var config = timeline.$config;
				config.bind = utils.defined(config.bind) ? config.bind : "task";
				config.bindLinks = utils.defined(config.bindLinks) ? config.bindLinks : "link";

				timeline._linksDnD = linkDnD.createLinkDND();
				timeline._tasksDnD = taskDnD.createTaskDND();
				timeline._tasksDnD.extend(timeline);

				if(timeline.$config.id == "timeline") {
					this.extendGantt(timeline);
				}
			},
			onInitialized: function (timeline) {
				this._attachDomEvents(gantt);
				this._attachGanttEvents(gantt);
				this._attachStateProvider(gantt, timeline);

				timeline._tasksDnD.init(timeline, gantt);
				timeline._linksDnD.init(timeline, gantt);

				if(timeline.$config.id == "timeline"){
					this.extendDom(timeline);
				}

			},
			onDestroyed: function (timeline) {
				this._clearGanttEvents(gantt);
				this._clearDomEvents(gantt);
				this._clearStateProvider(gantt);
			},
			extendDom: function(timeline){
				gantt.$task = timeline.$task;
				gantt.$task_scale = timeline.$task_scale;
				gantt.$task_data = timeline.$task_data;
				gantt.$task_bg = timeline.$task_bg;
				gantt.$task_links = timeline.$task_links;
				gantt.$task_bars = timeline.$task_bars;
			},

			extendGantt: function(timeline){
				gantt.dateFromPos = gantt.bind(timeline.dateFromPos, timeline);
				gantt.posFromDate = gantt.bind(timeline.posFromDate, timeline);
				gantt.getRowTop = gantt.bind(timeline.getRowTop, timeline);
				gantt.getTaskTop = gantt.bind(timeline.getItemTop, timeline);
				gantt.getTaskPosition = gantt.bind(timeline.getItemPosition, timeline);
				gantt.getTaskHeight = gantt.bind(timeline.getItemHeight, timeline);
				gantt.columnIndexByDate = gantt.bind(timeline.columnIndexByDate, timeline);
				gantt.roundTaskDates = gantt.bind(timeline.roundTaskDates, timeline);
				gantt.getScale = gantt.bind(timeline.getScale, timeline);
				gantt.getTaskNode = function (id) {
					return timeline._taskRenderer.rendered[id];
				};
				gantt.getLinkNode = function (id) {
					return timeline._linkRenderer.rendered[id];
				};

			},

			_attachDomEvent: function (event, className, handler){
				if(!this._events){
					this._events = [];
				}
				var mouseEvents = services.getService("mouseEvents");
				var e = {event:event, className: className, handler:handler, root:this.$task};
				mouseEvents.delegate(e.event, e.className, e.handler, e.root);
				this._events.push(e);
			},

			_clearDomEvents: function(){
				var mouseEvents = services.getService("mouseEvents");
				for(var i = 0; i < this._events.length; i++){
					var e = this._events[i];
					mouseEvents.detach(e.event, e.className, e.handler, e.root);
				}
				this._events = [];
			},

			_attachDomEvents: function(gantt){
				function _delete_link_handler(id, e) {
					if (id && this.callEvent("onLinkDblClick", [id, e])) {

						var link = this.getLink(id);
						if (this.isReadonly(link)) return;

						var title = "";
						var question = this.locale.labels.link + " " + this.templates.link_description(this.getLink(id)) + " " + this.locale.labels.confirm_link_deleting;

						window.setTimeout(function () {
							gantt._dhtmlx_confirm(question, title, function () {
								gantt.deleteLink(id);
							});
						}, (this.config.touch ? 300 : 1));
					}
				}

				this._attachDomEvent("click", "gantt_task_link", gantt.bind(function (e, trg) {
					var id = this.locate(e, this.config.link_attribute);
					if (id) {
						this.callEvent("onLinkClick", [id, e]);
					}
				}, gantt));

				this._attachDomEvent("click", "gantt_scale_cell", gantt.bind(function (e, trg) {
					var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);
					var date = gantt.dateFromPos(pos.x);
					var coll = Math.floor(gantt.columnIndexByDate(date));

					var coll_date = gantt.getScale().trace_x[coll];

					gantt.callEvent("onScaleClick", [e, coll_date]);
				}, gantt));

				this._attachDomEvent("doubleclick", "gantt_task_link", gantt.bind(function (e, id, trg) {
					var id = this.locate(e, gantt.config.link_attribute);
					_delete_link_handler.call(this, id, e);
				}, gantt));

				this._attachDomEvent("doubleclick", "gantt_link_point", gantt.bind(function (e, id, trg) {
					var id = this.locate(e),
						task = this.getTask(id);

					var link = null;
					if (trg.parentNode && domHelpers.getClassName(trg.parentNode)) {
						if (domHelpers.getClassName(trg.parentNode).indexOf("_left") > -1) {
							link = task.$target[0];
						} else {
							link = task.$source[0];
						}
					}
					if (link)
						_delete_link_handler.call(this, link, e);
					return false;
				}, gantt));
			},

			_attachGanttEvents: function(gantt){
				this._clearGanttEvents(gantt);

				function refreshId(renders, oldId, newId, item) {
					for (var i = 0; i < renders.length; i++) {
						renders[i].change_id(oldId, newId);
						renders[i].render_item(item);
					}
				}

				this._onTaskIdChange = gantt.attachEvent("onTaskIdChange", function (oldId, newId) {
					refreshId(gantt._getTaskLayers(), oldId, newId, gantt.getTask(newId));
				});

				if (this._onLinkIdChange)
					gantt.detachEvent(this._onLinkIdChange);

				this._onLinkIdChange = gantt.attachEvent("onLinkIdChange", function (oldId, newId) {
					refreshId(gantt._getLinkLayers(), oldId, newId, gantt.getLink(newId));
				});
			},

			_clearGanttEvents: function(gantt){
				if (this._onTaskIdChange)
					gantt.detachEvent(this._onTaskIdChange);
				if (this._onLinkIdChange)
					gantt.detachEvent(this._onLinkIdChange);
			},

			_attachStateProvider: function(gantt, timeline){
				var self = timeline;
				var state = services.getService("state");
				state.registerProvider("tasksTimeline", function(){
					return {
						scale_unit: self._tasks ? self._tasks.unit : undefined,
						scale_step:  self._tasks ? self._tasks.step  : undefined
					};
				});
			},

			_clearStateProvider: function(){
				var state = services.getService("state");
				state.unregisterProvider("tasksTimeline");
			}
		};
	};

})();

module.exports = initializer;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1),
	utils = __webpack_require__(0);
var timeout = __webpack_require__(8);

function createTaskDND(timeline, gantt){
	var services = gantt.$services;
	return {
		drag: null,
		_events: {
			before_start: {},
			before_finish: {},
			after_finish: {}
		},
		_handlers: {},
		init: function () {
			this.clear_drag_state();
			var drag = gantt.config.drag_mode;
			this.set_actions();

			var stateService = services.getService("state");
			stateService.registerProvider("tasksDnd", utils.bind(function(){
				return {
					drag_id : this.drag ? this.drag.id : undefined,
					drag_mode : this.drag ? this.drag.mode : undefined,
					drag_from_start : this.drag ? this.drag.left : undefined
				};
			}, this));

			var evs = {
				"before_start": "onBeforeTaskDrag",
				"before_finish": "onBeforeTaskChanged",
				"after_finish": "onAfterTaskDrag"
			};
			//for now, all drag operations will trigger the same events
			for (var stage in this._events) {
				for (var mode in drag) {
					this._events[stage][mode] = evs[stage];
				}
			}

			this._handlers[drag.move] = this._move;
			this._handlers[drag.resize] = this._resize;
			this._handlers[drag.progress] = this._resize_progress;

		},
		set_actions: function () {
			var data = timeline.$task_data;
			gantt.event(data, "mousemove", gantt.bind(function (e) {
				this.on_mouse_move(e || event);
			}, this));
			gantt.event(data, "mousedown", gantt.bind(function (e) {
				this.on_mouse_down(e || event);
			}, this));
			gantt.event(data, "mouseup", gantt.bind(function (e) {
				this.on_mouse_up(e || event);
			}, this));
		},

		clear_drag_state: function () {
			this.drag = {
				id: null,
				mode: null,
				pos: null,
				start_x: null,
				start_y: null,
				obj: null,
				left: null
			};
		},
		_resize: function (ev, shift, drag) {
			var cfg = timeline.$getConfig();
			var coords_x = this._drag_task_coords(ev, drag);
			if (drag.left) {
				ev.start_date = gantt.dateFromPos(coords_x.start + shift);
				if (!ev.start_date) {
					ev.start_date = new Date(gantt.getState().min_date);
				}
			} else {
				ev.end_date = gantt.dateFromPos(coords_x.end + shift);
				if (!ev.end_date) {
					ev.end_date = new Date(gantt.getState().max_date);
				}
			}

			if (ev.end_date - ev.start_date < cfg.min_duration) {
				if (drag.left)
					ev.start_date = gantt.calculateEndDate({start_date: ev.end_date, duration: -1, task: ev});
				else
					ev.end_date = gantt.calculateEndDate({start_date: ev.start_date, duration: 1, task: ev});
			}
			gantt._init_task_timing(ev);
		},
		_resize_progress: function (ev, shift, drag) {
			var coords_x = this._drag_task_coords(ev, drag);

			var diff = Math.max(0, drag.pos.x - coords_x.start);
			ev.progress = Math.min(1, diff / (coords_x.end - coords_x.start));
		},
		_move: function (ev, shift, drag) {
			var coords_x = this._drag_task_coords(ev, drag);
			var new_start = gantt.dateFromPos(coords_x.start + shift),
				new_end = gantt.dateFromPos(coords_x.end + shift);
			if (!new_start) {
				ev.start_date = new Date(gantt.getState().min_date);
				ev.end_date = gantt.dateFromPos(gantt.posFromDate(ev.start_date) + (coords_x.end - coords_x.start));
			} else if (!new_end) {
				ev.end_date = new Date(gantt.getState().max_date);
				ev.start_date = gantt.dateFromPos(gantt.posFromDate(ev.end_date) - (coords_x.end - coords_x.start));
			} else {
				ev.start_date = new_start;
				ev.end_date = new_end;
			}
		},
		_drag_task_coords: function (t, drag) {
			var start = drag.obj_s_x = drag.obj_s_x || gantt.posFromDate(t.start_date);
			var end = drag.obj_e_x = drag.obj_e_x || gantt.posFromDate(t.end_date);
			return {
				start: start,
				end: end
			};
		},
		_mouse_position_change: function (oldPos, newPos) {
			var dx = oldPos.x - newPos.x,
				dy = oldPos.y - newPos.y;
			return Math.sqrt(dx * dx + dy * dy);
		},
		_is_number: function (n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},

		on_mouse_move: function (e) {
			if (this.drag.start_drag) {
				var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);

				var sX = this.drag.start_drag.start_x,
					sY = this.drag.start_drag.start_y;

				if ((Date.now() - this.drag.timestamp > 50) ||
					(this._is_number(sX) && this._is_number(sY) && this._mouse_position_change({
						x: sX,
						y: sY
					}, pos) > 20)) {
					this._start_dnd(e);
				}
			}

			var drag = this.drag;

			if (drag.mode) {
				if (!timeout(this, 40))//limit update frequency
					return;

				this._update_on_move(e);

			}
		},
		_update_on_move: function (e) {
			var drag = this.drag;

			if (drag.mode) {
				var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);
				if (drag.pos && drag.pos.x == pos.x)
					return;

				drag.pos = pos;

				var curr_date = gantt.dateFromPos(pos.x);
				if (!curr_date || isNaN(curr_date.getTime()))
					return;


				var shift = pos.x - drag.start_x;
				var ev = gantt.getTask(drag.id);


				if (this._handlers[drag.mode]) {
					var original = gantt.mixin({}, ev);
					var copy = gantt.mixin({}, ev);
					this._handlers[drag.mode].apply(this, [copy, shift, drag]);
					gantt.mixin(ev, copy, true);
					//gantt._update_parents(drag.id, true);
					gantt.callEvent("onTaskDrag", [ev.id, drag.mode, copy, original, e]);

					gantt.mixin(ev, copy, true);
					gantt._update_parents(drag.id);
					gantt.refreshTask(drag.id);
				}

			}
		},

		on_mouse_down: function (e, src) {
			// on Mac we do not get onmouseup event when clicking right mouse button leaving us in dnd state
			// let's ignore right mouse button then
			if (e.button == 2 && e.button !== undefined)
				return;

			var config = timeline.$getConfig();
			var id = gantt.locate(e);
			var task = null;
			if (gantt.isTaskExists(id)) {
				task = gantt.getTask(id);
			}

			if (gantt.isReadonly(task) || this.drag.mode) return;

			this.clear_drag_state();

			src = src || (e.target || e.srcElement);

			var className = domHelpers.getClassName(src);
			if (!className || !this._get_drag_mode(className)) {
				if (src.parentNode)
					return this.on_mouse_down(e, src.parentNode);
				else
					return;
			}

			var drag = this._get_drag_mode(className);

			if (!drag) {
				if (gantt.checkEvent("onMouseDown") && gantt.callEvent("onMouseDown", [className.split(" ")[0]])) {
					if (src.parentNode)
						return this.on_mouse_down(e, src.parentNode);

				}
			} else {
				if (drag.mode && drag.mode != config.drag_mode.ignore && config["drag_" + drag.mode]) {
					id = gantt.locate(src);
					task = gantt.copy(gantt.getTask(id) || {});

					if (gantt.isReadonly(task)) {
						this.clear_drag_state();
						return false;
					}

					if (gantt.isSummaryTask(task) && drag.mode != config.drag_mode.progress) {//only progress drag is allowed for tasks with flexible duration
						this.clear_drag_state();
						return;
					}

					drag.id = id;
					var pos = domHelpers.getRelativeEventPosition(e, gantt.$task_data);

					drag.start_x = pos.x;
					drag.start_y = pos.y;
					drag.obj = task;
					this.drag.start_drag = drag;
					this.drag.timestamp = Date.now();

				} else
					this.clear_drag_state();
			}
		},
		_fix_dnd_scale_time: function (task, drag) {
			var config = timeline.$getConfig();
			var unit = gantt.getScale().unit,
				step = gantt.getScale().step;
			if (!config.round_dnd_dates) {
				unit = 'minute';
				step = config.time_step;
			}

			function fixStart(task) {
				if (!gantt.config.correct_work_time)
					return;
				var config = timeline.$getConfig();
				if (!gantt.isWorkTime(task.start_date, undefined, task))
					task.start_date = gantt.calculateEndDate({
						start_date: task.start_date,
						duration: -1,
						unit: config.duration_unit,
						task: task
					});
			}

			function fixEnd(task) {
				if (!gantt.config.correct_work_time)
					return;
				var config = timeline.$getConfig();
				if (!gantt.isWorkTime(new Date(task.end_date - 1), undefined, task))
					task.end_date = gantt.calculateEndDate({
						start_date: task.end_date,
						duration: 1,
						unit: config.duration_unit,
						task: task
					});
			}

			if (drag.mode == config.drag_mode.resize) {
				if (drag.left) {
					task.start_date = gantt.roundDate({date: task.start_date, unit: unit, step: step});
					fixStart(task);
				} else {
					task.end_date = gantt.roundDate({date: task.end_date, unit: unit, step: step});
					fixEnd(task);
				}
			} else if (drag.mode == config.drag_mode.move) {
				task.start_date = gantt.roundDate({date: task.start_date, unit: unit, step: step});
				fixStart(task);
				task.end_date = gantt.calculateEndDate(task);				
			}
		},
		_fix_working_times: function (task, drag) {
			var config = timeline.$getConfig();
			var drag = drag || {mode: config.drag_mode.move};
			
			if (drag.mode == config.drag_mode.resize) {
				if (drag.left) {
					task.start_date = gantt.getClosestWorkTime({date: task.start_date, dir: 'future', task: task});
				} else {
					task.end_date = gantt.getClosestWorkTime({date: task.end_date, dir: 'past', task: task});
				}
			} else if (drag.mode == config.drag_mode.move) {
				gantt.correctTaskWorkTime(task);
			}
		},
		on_mouse_up: function (e) {

			var drag = this.drag;
			if (drag.mode && drag.id) {
				var config = timeline.$getConfig();
				//drop
				var ev = gantt.getTask(drag.id);

				if (config.work_time && config.correct_work_time) {
					this._fix_working_times(ev, drag);
				}

				this._fix_dnd_scale_time(ev, drag);

				gantt._init_task_timing(ev);

				if (!this._fireEvent("before_finish", drag.mode, [drag.id, drag.mode, gantt.copy(drag.obj), e])) {
					//drag.obj._dhx_changed = false;
					this.clear_drag_state();
					drag.obj._dhx_changed = false;
					gantt.mixin(ev, drag.obj, true);

					gantt.refreshTask(ev.id);
				} else {
					var drag_id = drag.id;

					gantt._init_task_timing(ev);

					this.clear_drag_state();
					gantt.updateTask(ev.id);
					this._fireEvent("after_finish", drag.mode, [drag_id, drag.mode, e]);
				}
			}
			this.clear_drag_state();
		},
		_get_drag_mode: function (className) {
			var config = timeline.$getConfig();
			var modes = config.drag_mode;
			var classes = (className || "").split(" ");
			var classname = classes[0];
			var drag = {mode: null, left: null};
			switch (classname) {
				case "gantt_task_line":
				case "gantt_task_content":
					drag.mode = modes.move;
					break;
				case "gantt_task_drag":
					drag.mode = modes.resize;
					if (classes[1] && classes[1].indexOf("left", classes[1].length - "left".length) !== -1) {
						drag.left = true;
					} else {
						drag.left = false;
					}
					break;
				case "gantt_task_progress_drag":
					drag.mode = modes.progress;
					break;
				case "gantt_link_control":
				case "gantt_link_point":
					drag.mode = modes.ignore;
					break;
				default:
					drag = null;
					break;
			}
			return drag;

		},

		_start_dnd: function (e) {
			var drag = this.drag = this.drag.start_drag;
			delete drag.start_drag;

			var cfg = timeline.$getConfig();
			var id = drag.id;
			if (!cfg["drag_" + drag.mode] || !gantt.callEvent("onBeforeDrag", [id, drag.mode, e]) || !this._fireEvent("before_start", drag.mode, [id, drag.mode, e])) {
				this.clear_drag_state();
			} else {
				delete drag.start_drag;
				gantt.callEvent("onTaskDragStart", []);
			}

		},
		_fireEvent: function (stage, mode, params) {
			gantt.assert(this._events[stage], "Invalid stage:{" + stage + "}");

			var trigger = this._events[stage][mode];

			gantt.assert(trigger, "Unknown after drop mode:{" + mode + "}");
			gantt.assert(params, "Invalid event arguments");


			if (!gantt.checkEvent(trigger))
				return true;

			return gantt.callEvent(trigger, params);
		},

		round_task_dates: function(task){
			var drag_state = this.drag;
			var config = timeline.$getConfig();
			if (!drag_state) {
				drag_state = {mode: config.drag_mode.move};
			}
			this._fix_dnd_scale_time(task, drag_state);
		}
	};
}

function initTaskDND() {
	var _tasks_dnd;
	return {
		extend: function(timeline){
			timeline.roundTaskDates = function (task) {
				_tasks_dnd.round_task_dates(task);
			};

		},
		init: function(timeline, gantt){
			_tasks_dnd = createTaskDND(timeline, gantt);
			// TODO: entry point for touch handlers, move touch to timeline
			timeline._tasks_dnd = _tasks_dnd;
			return _tasks_dnd.init(gantt);
		},
		destroy: function(){

		}
	};
}

module.exports = {
	createTaskDND: initTaskDND
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1);

var initLinksDND = function(timeline, gantt) {
	var _link_landing,
		_link_target_task,
		_link_target_task_start,
		_link_source_task,
		_link_source_task_start;


	function getMilestoneWidth() {
		return timeline.getItemHeight();
	}

	function getVisibleMilestoneWidth() {
		var origWidth = timeline.getItemHeight();//m-s have square shape
		return Math.sqrt(2 * origWidth * origWidth);
	}

	function getDndState(){
		return {
			link_source_id : _link_source_task,
			link_target_id : _link_target_task,
			link_from_start : _link_source_task_start,
			link_to_start : _link_target_task_start,
			link_landing_area : _link_landing
		};
	}

	var services = gantt.$services;

	var state = services.getService("state");
	var DnD = services.getService("dnd");

	state.registerProvider("linksDnD", getDndState);

	var dnd = new DnD(timeline.$task_bars, { sensitivity : 0, updates_per_second : 60 }),
		start_marker = "task_left",
		end_marker = "task_right",
		link_edge_marker = "gantt_link_point",
		link_landing_hover_area = "gantt_link_control";

	dnd.attachEvent("onBeforeDragStart", gantt.bind(function(obj,e) {
		var target = (e.target||e.srcElement);
		resetDndState();
		if(gantt.getState().drag_id)
			return false;

		if(domHelpers.locateClassName(target, link_edge_marker)){
			if(domHelpers.locateClassName(target, start_marker))
				_link_source_task_start = true;

			var sid = gantt.locate(e);
			_link_source_task = sid;

			var t = gantt.getTask(sid);
			if(gantt.isReadonly(t)){
				resetDndState();
				return false;
			}

			var shift = 0;
			if(gantt.getTaskType(t.type) == gantt.config.types.milestone){
				shift = (getVisibleMilestoneWidth() - getMilestoneWidth())/2;
			}

			this._dir_start = getLinePos(t, !!_link_source_task_start, shift);
			return true;
		}else{
			return false;
		}

	}, this));

	dnd.attachEvent("onAfterDragStart", gantt.bind(function(obj,e) {
		if(gantt.config.touch) {
			gantt.refreshData();
		}
		updateMarkedHtml(dnd.config.marker);
	}, this));

	function getLinePos(task, to_start, shift){
		var taskPos = getMilestonePosition(task, function(task){ return gantt.getTaskPosition(task);});

		var pos = {x: taskPos.x, y: taskPos.y};
		if(!to_start){
			pos.x = taskPos.xEnd;
		}

		//var pos = gantt._get_task_pos(task, !!to_start);
		pos.y += gantt.config.row_height/2;

		shift = shift || 0;
		pos.x += (to_start ? -1 : 1)*shift;
		return pos;
	}

	function getMilestonePosition(task, getTaskPosition){
		var pos = getTaskPosition(task);

		var res = {
			x: pos.left,
			y: pos.top,
			width: pos.width,
			height: pos.height
		};
		res.xEnd = res.x + res.width;
		res.yEnd = res.y + res.height;

		if(gantt.getTaskType(task.type) == gantt.config.types.milestone){
			var milestoneHeight = gantt.getTaskHeight();
			var milestoneWidth = Math.sqrt(2*milestoneHeight*milestoneHeight);
			pos.x -= milestoneWidth / 2;
			pos.xEnd += milestoneWidth / 2;
			pos.width = pos.xEnd - pos.x;
		}


		return res;
	}

	dnd.attachEvent("onDragMove", gantt.bind(function(obj,e) {
		var dd = dnd.config;
		var pos = dnd.getPosition(e);
		advanceMarker(dd.marker, pos);
		var landing = !!domHelpers.locateClassName(e, link_landing_hover_area);

		var prevTarget = _link_target_task;
		var prevLanding = _link_landing;
		var prevToStart = _link_target_task_start;

		var targ = gantt.locate(e),
			to_start = true;
		if(landing){
			//refreshTask
			to_start = !domHelpers.locateClassName(e, end_marker);
			landing = !!targ;
		}

		_link_target_task = targ;
		_link_landing = landing;
		_link_target_task_start = to_start;

		if(landing){
			var t = gantt.getTask(targ);

			var node = domHelpers.locateClassName(e, link_landing_hover_area);
			var shift = 0;
			if(node){
				shift = Math.floor(node.offsetWidth  / 2);
			}

			this._dir_end = getLinePos(t, !!_link_target_task_start,shift);
		}else{
			this._dir_end = domHelpers.getRelativeEventPosition(e, timeline.$task_data);
		}

		var targetChanged = !(prevLanding == landing && prevTarget == targ && prevToStart == to_start);
		if(targetChanged){
			if(prevTarget)
				gantt.refreshTask(prevTarget, false);
			if(targ)
				gantt.refreshTask(targ, false);
		}

		if(targetChanged){
			updateMarkedHtml(dd.marker);
		}

		showDirectingLine(this._dir_start.x, this._dir_start.y, this._dir_end.x, this._dir_end.y);

		return true;
	}, this));


	dnd.attachEvent("onDragEnd", gantt.bind(function() {
		var drag = getDndState();

		if(drag.link_source_id && drag.link_target_id && drag.link_source_id != drag.link_target_id){
			var type = gantt._get_link_type(drag.link_from_start, drag.link_to_start);

			var link = {source : drag.link_source_id, target: drag.link_target_id, type:type};
			if(link.type && gantt.isLinkAllowed(link))
				gantt.addLink(link);
		}

		resetDndState();

		if(gantt.config.touch) {
			gantt.refreshData();
		}
		else {
			if (drag.link_source_id)
				gantt.refreshTask(drag.link_source_id, false);
			if (drag.link_target_id)
				gantt.refreshTask(drag.link_target_id, false);
		}
		removeDirectionLine();
	}, this));

	function updateMarkedHtml(marker){
		var link = getDndState();

		var css = ["gantt_link_tooltip"];
		if(link.link_source_id && link.link_target_id){
			if(gantt.isLinkAllowed(link.link_source_id, link.link_target_id, link.link_from_start, link.link_to_start)){
				css.push("gantt_allowed_link");
			}else{
				css.push("gantt_invalid_link");
			}
		}

		var className = gantt.templates.drag_link_class(link.link_source_id, link.link_from_start, link.link_target_id, link.link_to_start);
		if(className)
			css.push(className);

		var html = "<div class='"+className+ "'>" +
			gantt.templates.drag_link(link.link_source_id, link.link_from_start, link.link_target_id, link.link_to_start) +
			"</div>";
		marker.innerHTML = html;
	}

	function advanceMarker(marker, pos){
		marker.style.left = pos.x + 5 + "px";
		marker.style.top = pos.y + 5 + "px";
	}

	function resetDndState(){
		_link_source_task =
			_link_source_task_start =
				_link_target_task = null;
		_link_target_task_start = true;
	}
	function showDirectingLine(s_x, s_y, e_x, e_y){
		var div = getDirectionLine();

		var link = getDndState();

		var css = ["gantt_link_direction"];
		if(gantt.templates.link_direction_class){
			css.push(gantt.templates.link_direction_class(link.link_source_id, link.link_from_start, link.link_target_id, link.link_to_start));
		}

		var dist =Math.sqrt( (Math.pow(e_x - s_x, 2)) + (Math.pow(e_y - s_y, 2)) );
		dist = Math.max(0, dist - 3);
		if(!dist)
			return;

		div.className = css.join(" ");
		var tan = (e_y - s_y)/(e_x - s_x),
			angle = Math.atan(tan);

		if(coordinateCircleQuarter(s_x, e_x, s_y, e_y) == 2){
			angle += Math.PI;
		}else if(coordinateCircleQuarter(s_x, e_x, s_y, e_y) == 3){
			angle -= Math.PI;
		}



		var sin = Math.sin(angle),
			cos = Math.cos(angle),
			top = Math.round(s_y),
			left = Math.round(s_x);


		var style = [
			"-webkit-transform: rotate("+angle+"rad)",
			"-moz-transform: rotate("+angle+"rad)",
			"-ms-transform: rotate("+angle+"rad)",
			"-o-transform: rotate("+angle+"rad)",
			"transform: rotate("+angle+"rad)",
			"width:" + Math.round(dist) + "px"
		];

		if(window.navigator.userAgent.indexOf("MSIE 8.0") != -1){
			//ms-filter breaks styles in ie9, so add it only for 8th
			style.push("-ms-filter: \"" + ieTransform(sin, cos) + "\"");

			var shiftLeft = Math.abs(Math.round(s_x - e_x)),
				shiftTop = Math.abs(Math.round(e_y - s_y));
			//fix rotation axis
			switch(coordinateCircleQuarter(s_x, e_x, s_y, e_y)){
				case 1:
					top -= shiftTop;
					break;
				case 2:
					left -= shiftLeft;
					top -= shiftTop;
					break;
				case 3:
					left -= shiftLeft;
					break;
				default:
					break;
			}

		}

		style.push("top:" +  top + "px");
		style.push("left:" +  left + "px");

		div.style.cssText = style.join(";");
	}

	function ieTransform(sin, cos){
		return "progid:DXImageTransform.Microsoft.Matrix("+
			"M11 = "+cos+","+
			"M12 = -"+sin+","+
			"M21 = "+sin+","+
			"M22 = "+cos+","+
			"SizingMethod = 'auto expand'"+
		")";
	}
	function coordinateCircleQuarter(sX, eX, sY, eY){
		if(eX >= sX){
			if(eY <= sY){
				return 1;
			}else{
				return 4;
			}
		}else{
			if(eY <= sY){
				return 2;
			}else{
				return 3;
			}
		}

	}
	function getDirectionLine(){
		if(!dnd._direction){
			dnd._direction = document.createElement("div");
			timeline.$task_links.appendChild(dnd._direction);
		}
		return dnd._direction;
	}
	function removeDirectionLine(){
		if(dnd._direction){
			if (dnd._direction.parentNode)	//the event line can be detached because of data refresh
				dnd._direction.parentNode.removeChild(dnd._direction);

			dnd._direction = null;
		}
	}
};

module.exports = {
	createLinkDND: function(){
		return {
			init: initLinksDND
		};
	}
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

var initializer = (function() {
	return function (gantt) {
		return {

			getVerticalScrollbar: function(){
				return gantt.$ui.getView("scrollVer");
			},
			getHorizontalScrollbar: function(){
				return gantt.$ui.getView("scrollHor");
			},

			_legacyGridResizerClass: function(layout){
				var resizers = layout.getCellsByType("resizer");
				for(var i = 0; i < resizers.length; i++){
					var r = resizers[i];
					var prev = r.$parent.getPrevSibling(r.$id);
					if(prev && prev.$config && prev.$config.id === "grid"){
						r.$config.css = (r.$config.css ? r.$config.css + " " : "") + "gantt_grid_resize_wrap";
					}
				}
			},

			onCreated: function (layout) {
				var first = true;

				this._legacyGridResizerClass(layout);

				layout.attachEvent("onBeforeResize", function(){
					var mainTimeline = gantt.$ui.getView("timeline");
					mainTimeline.$config.hidden = mainTimeline.$parent.$config.hidden = !gantt.config.show_chart;

					var mainGrid = gantt.$ui.getView("grid");
					var showGrid = gantt.config.show_grid;
					if(first) {
						var colsWidth = mainGrid._getColsTotalWidth();
						if(colsWidth !== false){
							gantt.config.grid_width = colsWidth;
						}
						showGrid = showGrid && !!gantt.config.grid_width;
						gantt.config.show_grid = showGrid;
					}
					mainGrid.$config.hidden = mainGrid.$parent.$config.hidden = !showGrid;

					if(!mainGrid.$config.hidden){
						mainGrid.$config.width = gantt.config.grid_width - 1;
						if(!first){
							mainGrid.$parent._setContentSize(mainGrid.$config.width, mainGrid.$config.height);
						}else{
							mainGrid.$parent.$config.width = gantt.config.grid_width;
						}
					}

					first = false;

				});

				gantt._getVerticalScrollbar = this.getVerticalScrollbar;
				gantt._getHorizontalScrollbar = this.getHorizontalScrollbar;

				var vertical = this.getVerticalScrollbar();
				var horizontal = this.getHorizontalScrollbar();
				if(vertical){
					vertical.attachEvent("onScroll", function(oldPos, newPos, dir){
						var scrollState = gantt.getScrollState();
						gantt.callEvent("onGanttScroll", [scrollState.x, oldPos, scrollState.x, newPos]);
					});
				}
				if(horizontal){
					horizontal.attachEvent("onScroll", function(oldPos, newPos, dir){
						var scrollState = gantt.getScrollState();
						gantt.callEvent("onGanttScroll", [oldPos, scrollState.y, newPos, scrollState.y]);
					});
				}

				layout.attachEvent("onResize", function(){
					if(vertical && !gantt.$scroll_ver){
						gantt.$scroll_ver = vertical.$scroll_ver;
					}

					if(horizontal && !gantt.$scroll_hor){
						gantt.$scroll_hor = horizontal.$scroll_hor;
					}
				});

			},
			onInitialized: function (layout) {
				var grid = gantt.$ui.getView("grid");
				if(!(grid.$parent && grid.$parent.$parent && grid.$parent.$parent._xLayout)){
					return;
				}

				var parent = grid.$parent.$parent;

				var next = parent.getNextSibling(grid.$parent.$id);

				// expose grid resize events
				if(next && next.$name == "resizer"){
					var initialWidth;
					next.attachEvent("onResizeStart", function(prevCellWidth, nextCellWidth){

						var grid = gantt.$ui.getView("grid");
						var viewCell = grid ? grid.$parent : null;
						if(viewCell){
							var minWidth = 0;
							var cols = gantt.getGridColumns();
							for(var i = 0; i < cols.length; i++){
								minWidth += cols[i].min_width ? cols[i].min_width : gantt.config.min_grid_column_width;
							}

							viewCell.$config.minWidth = minWidth;
						}
						initialWidth = prevCellWidth;
						return gantt.callEvent("onGridResizeStart", [prevCellWidth]);
					});
					next.attachEvent("onResize", function(newBehindSize, newFrontSize){
						return gantt.callEvent("onGridResize", [initialWidth, newBehindSize]);
					});
					next.attachEvent("onResizeEnd", function(oldBackSize, oldFrontSize, newBackSize, newFrontSize){

						var grid = gantt.$ui.getView("grid");
						var viewCell = grid ? grid.$parent : null;
						if(viewCell){
							viewCell.$config.minWidth = undefined;
						}
						var res = gantt.callEvent("onGridResizeEnd", [oldBackSize, newBackSize]);
						if(res){
							gantt.config.grid_width = newBackSize;
						}

						return res;
					});
				}

			},
			onDestroyed: function (timeline) {

			}
		};
	};
})();

module.exports = initializer;

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	delete gantt.addTaskLayer;
	delete gantt.addLinkLayer;
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var facadeFactory = __webpack_require__(53);
var calculateScaleRange = __webpack_require__(17);
function initDataStores(gantt){

	var facade = facadeFactory.create();
	utils.mixin(gantt, facade);
	var tasksStore = gantt.createDatastore({
		name: "task",
		type: "treeDatastore",
		initItem: utils.bind(_init_task, gantt)
	});

	var linksStore = gantt.createDatastore({
		name: "link",
		initItem: utils.bind(_init_link, gantt)
	});

	var scrollState;
	tasksStore.attachEvent("onBeforeRefreshAll", function(){
		gantt.callEvent("onBeforeDataRender", []);
		scrollState = gantt.getScrollState();

		var order = tasksStore.getVisibleItems();

		for(var i=0; i < order.length; i++){
			var item = order[i];
			item.$index = i;
			gantt.resetProjectDates(item);
		}

	});

	tasksStore.attachEvent("onAfterRefreshAll", function(){
		if(scrollState.x || scrollState.y){
			gantt.scrollTo(scrollState.x, scrollState.y);
		}
		gantt.callEvent("onDataRender", []);
	});

	tasksStore.attachEvent("onFilterItem", function(id, task){
		var min = null, max = null;
		if (gantt.config.start_date && gantt.config.end_date) {
			if (gantt._isAllowedUnscheduledTask(task)) return true;
			min = gantt.config.start_date.valueOf();
			max = gantt.config.end_date.valueOf();

			if (+task.start_date > max || +task.end_date < +min)
				return false;
		}
		return true;
	});

	tasksStore.attachEvent("onIdChange", function(oldId, newId){
		gantt._update_flags(oldId, newId);
	});

	tasksStore.attachEvent("onAfterUpdate", function(id){
		gantt._update_parents(id);
	});

	tasksStore.attachEvent("onAfterItemMove", function(sid, parent, tindex){
		var source = gantt.getTask(sid);

		if(this.getNext(sid)){
			source.$drop_target = this.getNext(sid);
		}else{
			var prev = this.getPrev(sid);
			if(prev){
				if(prev.id == this.getParent(sid)){
					source.$drop_target = parent;
				}else{
					source.$drop_target = "next:" + prev;
				}
			}
		}
		return true;
	});

	tasksStore.attachEvent("onStoreUpdated", function(id, item, action){
		if(action == "delete"){
			gantt._update_flags(id, null);
		}

		if(gantt.config.fit_tasks && action !== "paint"){
			var oldState = gantt.getState();
			calculateScaleRange(gantt);
			var newState = gantt.getState();

			//this._init_tasks_range();
			if (+oldState.min_date != +newState.min_date || +oldState.max_date != +newState.max_date) {
				gantt.render();

				gantt.callEvent("onScaleAdjusted", []);
				return true;
			}

		}

		if(action == "add" || action == "move" || action == "delete"){
			gantt.$layout.resize();
		}else if(!id){
			linksStore.refresh();
		}

	});

	linksStore.attachEvent("onAfterAdd", function(id, link){
		sync_link(link);
	});
	linksStore.attachEvent("onAfterUpdate", function(id, link){
		sync_links();
	});
	linksStore.attachEvent("onAfterDelete", function(id, link){
		sync_link_delete(link);
	});
	linksStore.attachEvent("onIdChange", function(oldId, newId){
		sync_link_delete(gantt.mixin({id:oldId}, gantt.$data.linksStore.getItem(newId)));
		sync_link(gantt.$data.linksStore.getItem(newId));
	});

	linksStore.attachEvent("onFilterItem", function(id, link){
		if (!gantt.config.show_links) {
			return false;
		}

		if (!(gantt.isTaskVisible(link.source) && gantt.isTaskVisible(link.target)) ||
			gantt._isAllowedUnscheduledTask(gantt.getTask(link.source)) || gantt._isAllowedUnscheduledTask(gantt.getTask(link.target)))
			return false;

		return gantt.callEvent("onBeforeLinkDisplay", [id, link]);
	});


	gantt.attachEvent("onAfterLinkDelete", function(id, link) {
		gantt.refreshTask(link.source);
		gantt.refreshTask(link.target);
	});

	gantt.attachEvent("onParse", sync_links);

	mapEvents({
		source: linksStore,
		target: gantt,
		events:{
			"onItemLoading":"onLinkLoading",
			"onBeforeAdd":"onBeforeLinkAdd",
			"onAfterAdd":"onAfterLinkAdd",
			"onBeforeUpdate":"onBeforeLinkUpdate",
			"onAfterUpdate":"onAfterLinkUpdate",
			"onBeforeDelete":"onBeforeLinkDelete",
			"onAfterDelete":"onAfterLinkDelete",
			"onIdChange":"onLinkIdChange"
		}
	});

	mapEvents({
		source: tasksStore,
		target: gantt,
		events:{
			"onItemLoading":"onTaskLoading",
			"onBeforeAdd":"onBeforeTaskAdd",
			"onAfterAdd":"onAfterTaskAdd",
			"onBeforeUpdate":"onBeforeTaskUpdate",
			"onAfterUpdate":"onAfterTaskUpdate",
			"onBeforeDelete":"onBeforeTaskDelete",
			"onAfterDelete":"onAfterTaskDelete",
			"onIdChange":"onTaskIdChange",
			"onBeforeItemMove":"onBeforeTaskMove",
			"onAfterItemMove":"onAfterTaskMove",
			"onFilterItem":"onBeforeTaskDisplay"
		}
	});

	gantt.$data = {
		tasksStore: tasksStore,
		linksStore: linksStore
	};

	function sync_link(link){
		if(gantt.isTaskExists(link.source)){
			var sourceTask = gantt.getTask(link.source);
			sourceTask.$source = sourceTask.$source || [];
			sourceTask.$source.push(link.id);
		}
		if(gantt.isTaskExists(link.target)){
			var targetTask = gantt.getTask(link.target);
			targetTask.$target = targetTask.$target || [];
			targetTask.$target.push(link.id);
		}
	}

	function sync_link_delete(link){
		if(gantt.isTaskExists(link.source)){
			var sourceTask = gantt.getTask(link.source);
			for(var i = 0; i < sourceTask.$source.length; i++){
				if(sourceTask.$source[i] == link.id){
					sourceTask.$source.splice(i, 1);
					break;
				}
			}
		}
		if(gantt.isTaskExists(link.target)){
			var targetTask = gantt.getTask(link.target);
			for(var i = 0; i < targetTask.$target.length; i++){
				if(targetTask.$target[i] == link.id){
					targetTask.$target.splice(i, 1);
					break;
				}
			}
		}
	}

	function sync_links() {
		var task = null;
		var tasks = gantt.$data.tasksStore.getItems();

		for(var i = 0, len = tasks.length; i < len; i++){
			task = tasks[i];
			task.$source = [];
			task.$target = [];
		}

		var links = gantt.$data.linksStore.getItems();
		for (var i = 0, len = links.length; i < len; i++) {

			var link = links[i];
			sync_link(link);
		}
	}

	function mapEvents(conf){
		var mapFrom = conf.source;
		var mapTo = conf.target;
		for(var i in conf.events){
			(function(sourceEvent, targetEvent){
				mapFrom.attachEvent(sourceEvent, function(){
					return mapTo.callEvent(targetEvent, Array.prototype.slice.call(arguments));
				}, targetEvent);
			})(i, conf.events[i]);
		}
	}

	function _init_task(task) {
		if (!this.defined(task.id))
			task.id = this.uid();

		if (task.start_date)
			task.start_date = gantt.date.parseDate(task.start_date, "xml_date");
		if (task.end_date)
			task.end_date = gantt.date.parseDate(task.end_date, "xml_date");


		var duration = null;
		if (task.duration || task.duration === 0) {
			task.duration = duration = task.duration * 1;
		}

		if (duration) {
			if (task.start_date && !task.end_date) {
				task.end_date = this.calculateEndDate(task);
			} else if (!task.start_date && task.end_date) {
				task.start_date = this.calculateEndDate({
					start_date: task.end_date,
					duration: -task.duration,
					task: task
				});
			}
		}


		if (this._isAllowedUnscheduledTask(task)) {
			this._set_default_task_timing(task);
		}
		this._init_task_timing(task);
		if (task.start_date && task.end_date)
			this.correctTaskWorkTime(task);

		task.$source = [];
		task.$target = [];
		if (task.parent === undefined) {
			this.setParent(task, this.config.root_id);
		}

		if (!this.defined(task.$open)) {
			task.$open = this.defined(task.open) ? task.open : this.config.open_tree_initially;
		}
		task.$level = this.calculateTaskLevel(task);
		return task;
	}

	function _init_link(link) {
		if (!this.defined(link.id))
			link.id = this.uid();
		return link;
	}
}


module.exports = initDataStores;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var createTasksFacade = __webpack_require__(54),
	createLinksFacade = __webpack_require__(55),
	DataStore = __webpack_require__(15),
	TreeDataStore = __webpack_require__(56);
var datastoreRender = __webpack_require__(57);

function getDatastores(){
	var storeNames = this.$services.getService("datastores");
	var res = [];
	for(var i = 0; i < storeNames.length; i++){
		res.push(this.getDatastore(storeNames[i]));
	}
	return res;
}

var createDatastoreFacade = function(){
	return {
	createDatastore: function(config){

		var $StoreType = (config.type || "").toLowerCase() == "treedatastore" ? TreeDataStore : DataStore;

		var store = new $StoreType({
			initItem: config.initItem
		});

		if(config.name){

			this.$services.setService("datastore:" + config.name, function(){return store;});
			var storeList = this.$services.getService("datastores");
			if(!storeList){
				storeList = [];
				this.$services.setService("datastores", function(){return storeList;});
			}
			storeList.push(config.name);

			datastoreRender.bindDataStore(config.name, this);
		}

		return store;
	},
	getDatastore: function(name){
		return this.$services.getService("datastore:" + name);
	},

	refreshData: function () {
		var stores = getDatastores.call(this);
		for(var i = 0; i < stores.length; i++){
			stores[i].refresh();
		}
	},

	isChildOf: function(childId, parentId){
		return this.$data.tasksStore.isChildOf(childId, parentId);
	},

	refreshTask: function (taskId, refresh_links) {
		var task = this.getTask(taskId);
		if (task && this.isTaskVisible(taskId)) {
			this.$data.tasksStore.refresh(taskId);

			if (refresh_links !== undefined && !refresh_links)
				return;
			for (var i = 0; i < task.$source.length; i++) {
				this.refreshLink(task.$source[i]);
			}
			for (var i = 0; i < task.$target.length; i++) {
				this.refreshLink(task.$target[i]);
			}
		}

	},
	refreshLink: function (linkId) {
		this.$data.linksStore.refresh(linkId);
	},

	silent: function(code){
		var gantt = this;
		gantt.$data.tasksStore.silent(function(){
			gantt.$data.linksStore.silent(function(){
				code();
			});
		});
	},
	sort: function (field, desc, parent, silent) {
		var render = !silent;//4th argument to cancel redraw after sorting

		if (!this.isTaskExists(parent)) {
			parent = this.config.root_id;
		}

		if (!field) field = "order";
		var criteria = (typeof(field) == "string") ? (function (a, b) {
			if (a[field] == b[field]) {
				return 0;
			}

			var result = a[field] > b[field];
			return result ? 1 : -1;
		}) : field;

		if (desc) {
			var original_criteria = criteria;
			criteria = function (a, b) {
				return original_criteria(b, a);
			};
		}

		var els = this.getChildren(parent);
		if (els) {
			var temp = [];
			for (var i = els.length - 1; i >= 0; i--)
				temp[i] = this.$data.tasksStore.getItem(els[i]);

			temp.sort(criteria);

			for (var i = 0; i < temp.length; i++) {
				els[i] = temp[i].id;
				this.sort(field, desc, els[i], true);
			}
		}

		if (render) {
			this.render();
		}
	},
	clearAll: function () {
		var stores = getDatastores.call(this);
		for(var i = 0; i < stores.length; i++){
			stores[i].clearAll();
		}

		this._update_flags();
		this.userdata = {};
		this.callEvent("onClear", []);
		this.render();
	},
	_clear_data: function () {
		this.$data.tasksStore.clearAll();
		this.$data.linksStore.clearAll();
		this._update_flags();
		this.userdata = {};
	},

	_has_children: function (id) {
		return this.getChildren(id).length > 0;
	}
};
};

function createFacade(){
	var res = utils.mixin({}, createDatastoreFacade());
	utils.mixin(res, createTasksFacade());
	utils.mixin(res, createLinksFacade());
	return res;
}




module.exports = {create: createFacade};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

var createTasksDatastoreFacade = function(){
	return {
	getTask: function (id) {
		this.assert(id, "Invalid argument for gantt.getTask");
		var task = this.$data.tasksStore.getItem(id);
		this.assert(task, "Task not found id=" + id);
		return task;
	},
	getTaskByTime: function (from, to) {
		var p = this.$data.tasksStore.getItems();

		var res = [];

		if (!(from || to)) {
			res = p;
		} else {
			from = +from || -Infinity;
			to = +to || Infinity;
			for (var t = 0; t < p.length; t++){
				var task = p[t];
				if (+task.start_date < to && +task.end_date > from)
					res.push(task);
			}
		}
		return res;
	},
	isTaskExists: function (id) {
		return this.$data.tasksStore.exists(id);
	},
	updateTask: function (id, item) {
		if (!utils.defined(item)) item = this.getTask(id);
		this.$data.tasksStore.updateItem(id, item);
		this.refreshTask(id);
	},
	addTask: function (item, parent, index) {
		if (!utils.defined(item.id))
			item.id = utils.uid();

		if (!utils.defined(parent)) parent = this.getParent(item) || 0;
		if (!this.isTaskExists(parent)) parent = 0;
		this.setParent(item, parent);

		return this.$data.tasksStore.addItem(item, index, parent);
	},
	deleteTask: function (id) {
		return this.$data.tasksStore.removeItem(id);
	},
	getTaskCount: function () {
		return this.$data.tasksStore.count();
	},
	getVisibleTaskCount: function () {
		return this.$data.tasksStore.countVisible();
	},
	getTaskIndex: function (id) {
		return this.$data.tasksStore.getBranchIndex(id);
	},
	getGlobalTaskIndex: function (id) {
		this.assert(id, "Invalid argument");
		return this.$data.tasksStore.getIndexById(id);
	},
	eachTask: function (code, parent, master) {
		return this.$data.tasksStore.eachItem(utils.bind(code, master||this), parent);
	},
	eachParent: function (callback, startTask, master) {
		return this.$data.tasksStore.eachParent(utils.bind(callback, master || this), startTask);
	},
	changeTaskId: function (oldid, newid) {
		this.$data.tasksStore.changeId(oldid, newid);
		var task = this.$data.tasksStore.getItem(newid);

		var links = [];

		if (task.$source) {
			links = links.concat(task.$source);
		}
		if (task.$target) {
			links = links.concat(task.$target);
		}

		for (var i = 0; i < links.length; i++) {
			var link = this.getLink(links[i]);
			if (link.source == oldid) {
				link.source = newid;
			}
			if (link.target == oldid) {
				link.target = newid;
			}
		}
	},
	calculateTaskLevel: function (item) {
		return this.$data.tasksStore.calculateItemLevel(item);
	},
	getNext: function (id) {
		return this.$data.tasksStore.getNext(id);
	},
	getPrev: function (id) {
		return this.$data.tasksStore.getPrev(id);
	},
	getParent: function (id) {
		return this.$data.tasksStore.getParent(id);
	},
	setParent: function (task, new_pid) {
		return this.$data.tasksStore.setParent(task, new_pid);
	},
	getSiblings: function (id) {
		return this.$data.tasksStore.getChildren(id);
	},
	getNextSibling: function (id) {
		return this.$data.tasksStore.getNextSibling(id);
	},
	getPrevSibling: function (id) {
		return this.$data.tasksStore.getPrevSibling(id);
	},
	getTaskByIndex: function(index){
		var id = this.$data.tasksStore.getIdByIndex(index);
		if(this.isTaskExists(id)){
			return this.getTask(id);
		}else{
			return null;
		}
	},
	getChildren: function (id) {
		return this.$data.tasksStore.getChildren(id);
	},
	hasChild: function (id) {
		return this.$data.tasksStore.hasChild(id);
	},
	open: function (id) {
		this._set_item_state(id, true);
		this.callEvent("onTaskOpened", [id]);
	},
	close: function (id) {
		this._set_item_state(id, false);
		this.callEvent("onTaskClosed", [id]);
	},
	_set_item_state:function (id, state) {
		if(this.isTaskExists(id)){
			this.getTask(id).$open = !!state;
			this._refresh_on_toggle_element(id);
		}
	},
	_refresh_on_toggle_element: function (id) {
		this.render();
	},
	moveTask: function (sid, tindex, parent) {
		this.$data.tasksStore.move.apply(this.$data.tasksStore, arguments);
	}
};
};

module.exports = createTasksDatastoreFacade;




/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);


var createLinksStoreFacade = function(){
	return {
	getLinkCount: function () {
		return this.$data.linksStore.count();
	},

	getLink : function (id) {
		return this.$data.linksStore.getItem(id);
	},

	getLinks : function () {
		return this.$data.linksStore.getIndexRange();
	},

	isLinkExists : function (id) {
		return this.$data.linksStore.exists(id);
	},

	addLink : function (link) {
		return this.$data.linksStore.addItem(link);
	},

	updateLink : function (id, data) {
		if (!utils.defined(data))
			data = this.getLink(id);
		this.$data.linksStore.updateItem(id, data);
	},

	deleteLink : function (id) {
		return this.$data.linksStore.removeItem(id);
	},

	changeLinkId : function (oldid, newid) {
		return this.$data.linksStore.changeId(oldid, newid);
	}
};
};

module.exports = createLinksStoreFacade;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var powerArray = __webpack_require__(16);
var utils = __webpack_require__(0);
var eventable = __webpack_require__(2);
var DataStore = __webpack_require__(15);

var TreeDataStore = function(config){
	this._branches = {};

	this.pull = {};
	this.$initItem = config.initItem;
	this.$parentProperty = config.parentProperty || "parent";
	this.$rootId = config.rootId || 0;

	this.visibleOrder = powerArray.$create();
	this.fullOrder = powerArray.$create();
	this._searchVisibleOrder = {};
	this._skip_refresh = false;
	this._filterRule = null;
	eventable(this);

	this.attachEvent("onFilterItem", function(id, item){
		var open = true;
		this.eachParent(function(parent){
			open = open && parent.$open;
		}, item);
		return !!open;
	});

	return this;
};

TreeDataStore.prototype = utils.mixin({

		_buildTree: function(data){
			var item = null;
			for (var i = 0, len = data.length; i < len; i++){
				item = data[i];
				this.setParent(item, this.getParent(item) || this.$rootId);
			}

			// calculating $level for each item
			for (var i = 0, len = data.length; i < len; i++){
				item = data[i];
				this._add_branch(item);
				item.$level = this.calculateItemLevel(item);
			}
		},

		parse: function(data){
			this.callEvent("onBeforeParse", [data]);
			var loaded = this._parseInner(data);
			this._buildTree(loaded);
			this.filter();
			this.callEvent("onParse", [loaded]);
		},

		_addItemInner: function(item, index){

			var parent = this.getParent(item);

			if(!utils.defined(parent)){
				parent = this.$rootId;
				this.setParent(item, parent);
			}

			var parentIndex = this.getIndexById(parent);
			var targetIndex = parentIndex + Math.min(Math.max(index, 0), this.visibleOrder.length);

			DataStore.prototype._addItemInner.call(this, item, targetIndex);
			this.setParent(item, parent);

			if(item.hasOwnProperty("$rendered_parent")){
				this._move_branch(item, item.$rendered_parent);
			}
			this._add_branch(item, index);
		},
		_changeIdInner: function(oldId, newId){

			var children = this.getChildren(newId);
			DataStore.prototype._changeIdInner.call(this, oldId, newId);

			var parent = this.getParent(newId);

			this._replace_branch_child(parent, oldId, newId);
			for(var i = 0; i < children.length; i++){
				this.setParent(this.getItem[children[i]], newId);
			}
		},
		_removeItemInner: function(id){

			var items = [];
			this.eachItem(function(child){
				items.push(child);
			}, id);

			items.push(this.getItem(id));

			for(var i = 0; i < items.length; i++){

				this._move_branch(items[i], this.getParent(items[i]), null);
				DataStore.prototype._removeItemInner.call(this, items[i].id);
				this._move_branch(items[i], this.getParent(items[i].id), null);
			}
		},

		move: function(sid, tindex, parent){
			//target id as 4th parameter
			var id = arguments[3];
			if (id) {
				if (id === sid) return;

				parent = this.getParent(id);
				tindex = this.getBranchIndex(id);
			}
			if(sid == parent){
				return;
			}
			parent = parent || this.$rootId;
			var source = this.getItem(sid);
			var source_pid = this.getParent(source.id);
			var sbranch = this.getChildren(this.getParent(source.id));

			var tbranch = this.getChildren(parent);
			if (tindex == -1)
				tindex = tbranch.length + 1;
			if (source_pid == parent) {
				var sindex = this.getBranchIndex(sid);
				if (sindex == tindex) return;
			}

			if(this.callEvent("onBeforeItemMove", [sid, parent, tindex]) === false)
				return;

			this._replace_branch_child(source_pid, sid);
			tbranch = this.getChildren(parent);

			var tid = tbranch[tindex];
			if (!tid) //adding as last element
				tbranch.push(sid);
			else
				tbranch = tbranch.slice(0, tindex).concat([ sid ]).concat(tbranch.slice(tindex));

			this.setParent(source, parent);
			this._branches[parent] = tbranch;

			var diff = this.calculateItemLevel(source) - source.$level;
			source.$level += diff;
			this.eachItem(function(item){
				item.$level += diff;
			}, source.id, this);


			this._moveInner(this.getIndexById(sid), this.getIndexById(parent) + tindex);

			if(!this.callEvent("onAfterItemMove", [sid, parent, tindex]))
				return;
			this.refresh();
		},

		getBranchIndex: function(id){
			var branch = this.getChildren(this.getParent(id));
			for (var i = 0; i < branch.length; i++)
				if (branch[i] == id)
					return i;

			return -1;
		},
		hasChild: function(id){
			return (utils.defined(this._branches[id]) && this._branches[id].length);
		},
		getChildren: function(id){
			return utils.defined(this._branches[id]) ? this._branches[id] : powerArray.$create();
		},

		isChildOf: function(childId, parentId){
			if (!this.exists(childId))
				return false;
			if (parentId === this.$rootId)
				return true;

			var item = this.getItem(childId);
			var pid = this.getParent(childId);

			while (item && this.exists(pid)) {
				item = this.getItem(pid);

				if (item && item.id == parentId)
					return true;
				pid = this.getParent(item);
			}
			return false;
		},

		getSiblings: function(id){
			if(!this.exists(id)){
				return powerArray.$create();
			}
			var parent = this.getParent(id);
			return this.getChildren(parent);

		},
		getNextSibling: function(id){
			var siblings = this.getSiblings(id);
			for(var i= 0, len = siblings.length; i < len; i++){
				if(siblings[i] == id)
					return siblings[i+1] || null;
			}
			return null;
		},
		getPrevSibling: function(id){
			var siblings = this.getSiblings(id);
			for(var i= 0, len = siblings.length; i < len; i++){
				if(siblings[i] == id)
					return siblings[i-1] || null;
			}
			return null;
		},
		getParent: function(id){
			var item = null;
			if(id.id !== undefined){
				item = id;
			}else{
				item = this.getItem(id);
			}

			var parent = this.$rootId;
			if(item){
				parent = item[this.$parentProperty];
			}
			return parent;

		},

		clearAll: function(){
			this._branches = {};
			DataStore.prototype.clearAll.call(this);
		},

		calculateItemLevel: function(item){
			var level = 0;
			this.eachParent(function(){
				level++;
			}, item);
			return level;
		},
		setParent: function(item, new_pid){
			if(item.hasOwnProperty("$rendered_parent")){
				this._move_branch(item, item.$rendered_parent, new_pid);
			}else{
				this._move_branch(item, item[this.$parentProperty], new_pid);
			}

			item[this.$parentProperty] = new_pid;
		},
		eachItem: function(code, parent){
			parent = parent || this.$rootId;


			var branch = this.getChildren(parent);
			if (branch)
				for (var i=0; i<branch.length; i++){
					var item = this.pull[branch[i]];
					code.call(this, item);
					if (this.hasChild(item.id))
						this.eachItem(code, item.id);
				}
		},
		eachParent: function(code, startItem){
			var item = startItem;
			while (this.getParent(item)) {
				if (!this.exists(this.getParent(item))) break;
				item = this.getItem(this.getParent(item));
				code.call(this, item);
			}
		},
		_add_branch: function(item, index){
			var pid = this.getParent(item);
			if (!this.hasChild(pid))
				this._branches[pid] = powerArray.$create();
			var branch = this.getChildren(pid);
			var added_already = false;
			for(var i = 0, length = branch.length; i < length; i++){
				if(branch[i] == item.id){
					added_already = true;
					break;
				}
			}
			if(!added_already){
				if(index*1 == index){

					branch.splice(index, 0, item.id);
				}else{
					branch.push(item.id);
				}

				item.$rendered_parent = pid;
			}
		},
		_move_branch: function(item, old_parent, new_parent){
			//this.setParent(item, new_parent);
			//this._sync_parent(task);
			this._replace_branch_child(old_parent, item.id);
			if(this.exists(new_parent) || new_parent == this.$rootId){

				this._add_branch(item);
			}else{
				delete this._branches[item.id];
			}
			item.$level =  this.calculateItemLevel(item);
			this.eachItem(function(child){
				child.$level = this.calculateItemLevel(child);
			}, item.id);
		},

		_replace_branch_child: function(node, old_id, new_id){
			var branch = this.getChildren(node);
			if (branch){
				var newbranch = powerArray.$create();
				for (var i=0; i<branch.length; i++){
					if (branch[i] != old_id)
						newbranch.push(branch[i]);
					else if (new_id)
						newbranch.push(new_id);
				}
				this._branches[node] = newbranch;
			}

		},


		filter: function(rule){
			for(var i  in this.pull){
				if(this.pull[i].$rendered_parent !== this.getParent(this.pull[i])){
					this._move_branch(this.pull[i], this.pull[i].$rendered_parent, this.getParent(this.pull[i]));
				}
			}
			return DataStore.prototype.filter.apply(this, arguments);
		}
	},
	DataStore.prototype
);

module.exports = TreeDataStore;

/***/ }),
/* 57 */
/***/ (function(module, exports) {

var storeRenderCreator = function(name, gantt){
	var store = gantt.getDatastore(name);

	var itemRepainter = {
		renderItem: function(id, renderer){

			var renders = renderer.getLayers();

			var item = store.getItem(id);
			if(item && store.isVisible(id)) {
				for (var i = 0; i < renders.length; i++)
					renders[i].render_item(item);
			}
		},
		renderItems: function(renderer){
			var renderers = renderer.getLayers();
			for (var i = 0; i < renderers.length; i++) {
				renderers[i].clear();
			}

			var data = store.getVisibleItems();

			for (var i = 0; i < renderers.length; i++) {
				renderers[i].render_items(data);
			}
		}
	};

	store.attachEvent("onStoreUpdated", function(id, item, action){
		var renderer = gantt.$services.getService("layers").getDataRender(name);

		if(renderer){
			if(!id || action == "move" || action == "delete"){
				store.callEvent("onBeforeRefreshAll", []);
				itemRepainter.renderItems(renderer);
				store.callEvent("onAfterRefreshAll", []);
			}else{
				store.callEvent("onBeforeRefreshItem", [id]);
				itemRepainter.renderItem(id, renderer);
				store.callEvent("onAfterRefreshItem", [id]);
			}
		}

	});
};

module.exports = {
	bindDataStore: storeRenderCreator
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var liveUpdateHooks = __webpack_require__(59);
var dateHelper = __webpack_require__(3);

function addDataProcessorHooks(gantt) {

	gantt.dataProcessor = __webpack_require__(60);

	gantt._dp_init = function(dp) {
		dp.setTransactionMode("POST", true);
		dp.serverProcessor += (dp.serverProcessor.indexOf("?") != -1 ? "&" : "?") + "editing=true";
		dp._serverProcessor = dp.serverProcessor;
		dp.$gantt = this;
		dp.styles = {
			updated:"gantt_updated",
			order:"gantt_updated",
			inserted:"gantt_inserted",
			deleted:"gantt_deleted",
			invalid:"gantt_invalid",
			error:"gantt_error",
			clear:""
		};

		dp._methods=["_row_style","setCellTextStyle","_change_id","_delete_task"];

		dp.setGanttMode = function(mode){
			var modes = dp.modes || {};
			if(dp._ganttMode){
				modes[dp._ganttMode] = {
					_in_progress : dp._in_progress,
					_invalid : dp._invalid,
					updatedRows : dp.updatedRows
				};
			}

			var newState = modes[mode];
			if(!newState){
				newState = modes[mode] = {
					_in_progress : {},
					_invalid : {},
					updatedRows : []
				};
			}
			dp._in_progress = newState._in_progress;
			dp._invalid = newState._invalid;
			dp.updatedRows = newState.updatedRows;
			dp.modes = modes;
			dp._ganttMode = mode;
		};

		this._sendTaskOrder = function(id, item){
			if(item.$drop_target){
				dp.setGanttMode("tasks");
				this.getTask(id).target = item.$drop_target;
				dp.setUpdated(id, true,"order");
				delete this.getTask(id).$drop_target;
			}
		};
		this.attachEvent("onAfterTaskAdd", function(id, item) {
			dp.setGanttMode("tasks");
			dp.setUpdated(id,true,"inserted");
		});
		this.attachEvent("onAfterTaskUpdate", function(id, item) {
			dp.setGanttMode("tasks");
			dp.setUpdated(id,true);

			gantt._sendTaskOrder(id, item);
		});

		function clientSideDelete(id){
			var updated = dp.updatedRows.slice();
			var clientOnly = false;

			for(var i = 0; i < updated.length && !dp._in_progress[id]; i++){
				if(updated[i] == id ){
					if(gantt.getUserData(id, "!nativeeditor_status") == "inserted"){
						clientOnly = true;
					}
					dp.setUpdated(id,false);
				}
			}
			return clientOnly;
		}

		this.attachEvent("onAfterTaskDelete", function(id, item) {
			dp.setGanttMode("tasks");

			// not send delete request if item is not inserted into the db - just remove it from the client
			var needDbDelete = !clientSideDelete(id);
			if(!needDbDelete)
				return;

			dp.setUpdated(id,true,"deleted");

			if(dp.updateMode != 'off' && !dp._tSend){
				dp.sendAllData();
			}

		});

		this.attachEvent("onAfterLinkUpdate", function(id, item) {
			dp.setGanttMode("links");
			dp.setUpdated(id, true);
		});
		this.attachEvent("onAfterLinkAdd", function(id, item) {
			dp.setGanttMode("links");
			dp.setUpdated(id, true,"inserted");
		});
		this.attachEvent("onAfterLinkDelete", function(id, item) {
			dp.setGanttMode("links");

			var needDbDelete = !clientSideDelete(id);
			if(!needDbDelete)
				return;

			dp.setUpdated(id, true,"deleted");
		});
		this.attachEvent("onRowDragEnd", function(id, target) {
			gantt._sendTaskOrder(id, gantt.getTask(id));
		});


		function getTaskLinks(task){
			var links = [];

			if (task.$source) {
				links = links.concat(task.$source);
			}
			if (task.$target) {
				links = links.concat(task.$target);
			}

			return links;
		}

		var tasks = null,
			links = null;
		this.attachEvent("onTaskIdChange",function(oldId, newId){
			if(!dp._waitMode) return;

			var children = gantt.getChildren(newId);
			if(children.length) {
				tasks = tasks || {};

				for (var i = 0; i < children.length; i++) {
					var ch = this.getTask(children[i]);
					tasks[ch.id] = ch;
				}
			}

			var item = this.getTask(newId),
				itemLinks = getTaskLinks(item);

			if(itemLinks.length) {
				links = links || {};

				for (var i = 0; i < itemLinks.length; i++) {
					var link = this.getLink(itemLinks[i]);
					links[link.id] = link;
				}
			}
		});

		dp.attachEvent("onAfterUpdateFinish", function(){
			if(tasks || links){
				gantt.batchUpdate(function(){
					for(var id in tasks){
						gantt.updateTask(tasks[id].id);
					}

					for(var id in links){
						gantt.updateLink(links[id].id);
					}
					tasks = null;
					links = null;
				});
				if(tasks) {
					gantt._dp.setGanttMode("tasks");
				}else{
					gantt._dp.setGanttMode("links");
				}
			}
		});

		dp.attachEvent("onBeforeDataSending", function() {
			var url = this._serverProcessor;
			if(this._tMode == "REST"){
				var mode = this._ganttMode.substr(0, this._ganttMode.length - 1);// links, tasks -> /link/id, /task/id

				url = url.substring(0, url.indexOf("?") > -1 ? url.indexOf("?") : url.length);
				//editing=true&
				this.serverProcessor = url + (url.slice(-1) == "/" ? "" : "/") + mode;
			}else{
				this.serverProcessor = url + gantt.ajax.urlSeparator(url) + "gantt_mode=" + this._ganttMode;
			}

			return true;
		});

		liveUpdateHooks(gantt, dp);

		var afterUpdate = dp.afterUpdate;
		dp.afterUpdate = function(){
			var xml;
			if(arguments.length == 3){
				xml = arguments[1];
			}else{
				// old dataprocessor
				xml = arguments[4];
			}
			var mode = dp._ganttMode;
			var reqUrl = xml.filePath;

			if(this._tMode != "REST"){
				if (reqUrl.indexOf("gantt_mode=links") != -1) {
					mode = "links";
				}else{
					mode = "tasks";
				}
			}else{
				if(reqUrl.indexOf("/link") > reqUrl.indexOf("/task")){
					mode = "links";
				}else{
					mode = "tasks";
				}
			}
			dp.setGanttMode(mode);

			var res = afterUpdate.apply(dp, arguments);
			dp.setGanttMode(mode);
			return res;
		};

		dp._getRowData=gantt.bind(function(id, pref) {
			var task;
			if (dp._ganttMode == "tasks")
				task = this.isTaskExists(id) ? this.getTask(id) : { id: id };
			else
				task = this.isLinkExists(id) ? this.getLink(id) : { id: id };

			task = gantt.copy(task);

			var data = {};
			for (var key in task) {
				if (key.substr(0, 1) == "$") continue;
				var value = task[key];
				if (dateHelper.isDate(value))
					data[key] = this.templates.xml_format(value);
				else if(value === null)
					data[key] = "";
				else
					data[key] = value;
			}

			var taskTiming = this._get_task_timing_mode(task);
			if(taskTiming.$no_start){
				task.start_date = "";
				task.duration = "";
			}
			if(taskTiming.$no_end){
				task.end_date = "";
				task.duration = "";
			}
			data[dp.action_param] = this.getUserData(id, dp.action_param);
			return data;
		}, this);

		this._change_id = gantt.bind(function(oldid, newid) {
			if (dp._ganttMode != "tasks")
				this.changeLinkId(oldid, newid);
			else
				this.changeTaskId(oldid, newid);
		}, this);

		this._row_style = function(row_id, classname){
			if (dp._ganttMode != "tasks") return;
			if(!gantt.isTaskExists(row_id))
				return;

			var task = gantt.getTask(row_id);
			task.$dataprocessor_class = classname;
			gantt.refreshTask(row_id);
		};

		// fake method for dataprocessor
		this._delete_task = function(row_id, node){};

		this._dp = dp;
	};


	gantt.getUserData = function(id, name) {
		if (!this.userdata) this.userdata = {};
		if (this.userdata[id] && this.userdata[id][name]) return this.userdata[id][name];
		return "";
	};
	gantt.setUserData = function(id, name, value) {
		if (!this.userdata) this.userdata = {};
		if (!this.userdata[id]) this.userdata[id] = {};
		this.userdata[id][name] = value;
	};
}

module.exports = addDataProcessorHooks;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__ (0);

function updateCallback(upd, id) {
	var data = upd.data || this.xml._xmlNodeToJSON(upd.firstChild);
	if(!this.isTaskExists(id))
		return;
	var objData = this.getTask(id);
	for(var key in data) {
		var property = data[key];
		switch(key) {
			case "id":
				continue;
			case "start_date":
			case "end_date":
				property = this.templates.xml_date(property);
				break;
			case "duration":
				objData.end_date = this.calculateEndDate({start_date: objData.start_date, duration: property, task:objData});
				break;
		}
		objData[key] = property;
	}
	this.updateTask(id);
	this.refreshData();
}

function insertCallback(upd, id, parent, mode) {
	var data = upd.data || this.xml._xmlNodeToJSON(upd.firstChild),
		methods = {
			add: this.addTask,
			isExist: this.isTaskExists
		};
	if(mode == "links") {
		methods.add = this.addLink;
		methods.isExist = this.isLinkExists;
	}
	if(methods.isExist.call(this, id))
		return;
	data.id = id;
	methods.add.call(this, data);
}

function deleteCallback(upd, id, parent, mode) {
	var methods = {
		"delete": this.deleteTask,
		"isExist": this.isTaskExists
	};
	if(mode == "links") {
		methods["delete"] = this.deleteLink;
		methods.isExist = this.isLinkExists;
	}
	if(methods.isExist.call(this, id))
		methods["delete"].call(this, id);
}

function patchDataProcessor(gantt, dataprocessor){
	dataprocessor.attachEvent("insertCallback", utils.bind(insertCallback, gantt));
	dataprocessor.attachEvent("updateCallback",  utils.bind(deleteCallback, gantt));
	dataprocessor.attachEvent("deleteCallback",  utils.bind(deleteCallback, gantt));
}

module.exports = patchDataProcessor;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var eventable = __webpack_require__(2);

/**
	* 	@desc: constructor, data processor object 
	*	@param: serverProcessorURL - url used for update
	*	@type: public
	*/
var dataProcessor = function(serverProcessorURL){
    this.serverProcessor = serverProcessorURL;
    this.action_param="!nativeeditor_status";
    
	this.object = null;
	this.updatedRows = []; //ids of updated rows
	
	this.autoUpdate = true;
	this.updateMode = "cell";
	this._tMode="GET"; 
	this._headers = null;
	this._payload = null;
	this.post_delim = "_";
	
    this._waitMode=0;
    this._in_progress={};//?
    this._invalid={};
    this.mandatoryFields=[];
    this.messages=[];
    
    this.styles={
    	updated:"font-weight:bold;",
    	inserted:"font-weight:bold;",
    	deleted:"text-decoration : line-through;",
    	invalid:"background-color:FFE0E0;",
    	invalid_cell:"border-bottom:2px solid red;",
    	error:"color:red;",
    	clear:"font-weight:normal;text-decoration:none;"
    };
    
    this.enableUTFencoding(true);
	eventable(this);

    return this;
};

dataProcessor.prototype={
	setTransactionMode:function(mode,total){
		if (typeof mode == "object"){
			this._tMode = mode.mode || this._tMode;

			if(utils.defined(mode.headers)){
				this._headers = mode.headers;
			}

			if(utils.defined(mode.payload)){
				this._payload = mode.payload;
			}
			
		} else {
     	    this._tMode=mode;
			this._tSend=total;
		}

		if (this._tMode == "REST"){
			this._tSend = false;
			this._endnm = true;
		}

		if (this._tMode == "JSON"){
			this._tSend = false;
			this._endnm = true;
			this._headers = this._headers || {};
			this._headers["Content-type"] = "application/json";
		}
    },
    escape:function(data){
    	if (this._utf)
    		return encodeURIComponent(data);
    	else
        	return escape(data);
	},
    /**
	* 	@desc: allows to set escaping mode
	*	@param: true - utf based escaping, simple - use current page encoding
	*	@type: public
	*/	
	enableUTFencoding:function(mode){
        this._utf=!!mode;
    },
    /**
	* 	@desc: allows to define, which column may trigger update
	*	@param: val - array or list of true/false values
	*	@type: public
	*/
	setDataColumns:function(val){
		this._columns=(typeof val == "string")?val.split(","):val;
    },
    /**
	* 	@desc: get state of updating
	*	@returns:   true - all in sync with server, false - some items not updated yet.
	*	@type: public
	*/
	getSyncState:function(){
		return !this.updatedRows.length;
	},
	/**
	* 	@desc: enable/disable named field for data syncing, will use column ids for grid
	*	@param:   mode - true/false
	*	@type: public
	*/
	enableDataNames:function(mode){
		this._endnm= !!mode;
	},
	/**
	* 	@desc: enable/disable mode , when only changed fields and row id send to the server side, instead of all fields in default mode
	*	@param:   mode - true/false
	*	@type: public
	*/
	enablePartialDataSend:function(mode){
		this._changed= !!mode;
	},
	/**
	* 	@desc: set if rows should be send to server automaticaly
	*	@param: mode - "row" - based on row selection changed, "cell" - based on cell editing finished, "off" - manual data sending
	*	@type: public
	*/
	setUpdateMode:function(mode,dnd){
		this.autoUpdate = (mode=="cell");
		this.updateMode = mode;
		this.dnd=dnd;
	},
	ignore:function(code,master){
		this._silent_mode=true;
		code.call(master||window);
		this._silent_mode=false;
	},
	/**
	* 	@desc: mark row as updated/normal. check mandatory fields,initiate autoupdate (if turned on)
	*	@param: rowId - id of row to set update-status for
	*	@param: state - true for "updated", false for "not updated"
	*	@param: mode - update mode name
	*	@type: public
	*/
	setUpdated:function(rowId,state,mode){
		if (this._silent_mode) return;
		var ind=this.findRow(rowId);
		
		mode=mode||"updated";
		var existing = this.obj.getUserData(rowId,this.action_param);
		if (existing && mode == "updated") mode=existing;
		if (state){
			this.set_invalid(rowId,false); //clear previous error flag
			this.updatedRows[ind]=rowId;
			this.obj.setUserData(rowId,this.action_param,mode);
			if (this._in_progress[rowId]) 
				this._in_progress[rowId]="wait";
		} else{
			if (!this.is_invalid(rowId)){
				this.updatedRows.splice(ind,1);
				this.obj.setUserData(rowId,this.action_param,"");
			}
		}

		//clear changed flag
		if (!state)
			this._clearUpdateFlag(rowId);
     			
		this.markRow(rowId,state,mode);
		if (state && this.autoUpdate) this.sendData(rowId);
	},
	_clearUpdateFlag:function(id){},
	markRow:function(id,state,mode){ 
		var str="";
		var invalid=this.is_invalid(id);
		if (invalid){
        	str=this.styles[invalid];
        	state=true;
    	}
		if (this.callEvent("onRowMark",[id,state,mode,invalid])){
			//default logic
			str=this.styles[state?mode:"clear"]+str;
			
        	this.obj[this._methods[0]](id,str);

			if (invalid && invalid.details){
				str+=this.styles[invalid+"_cell"];
				for (var i=0; i < invalid.details.length; i++)
					if (invalid.details[i])
        				this.obj[this._methods[1]](id,i,str);
			}
		}
	},
	getState:function(id){
		return this.obj.getUserData(id,this.action_param);
	},
	is_invalid:function(id){
		return this._invalid[id];
	},
	set_invalid:function(id,mode,details){ 
		if (details) mode={value:mode, details:details, toString:function(){ return this.value.toString(); }};
		this._invalid[id]=mode;
	},
	/**
	* 	@desc: check mandatory fields and varify values of cells, initiate update (if specified)
	*	@param: rowId - id of row to set update-status for
	*	@type: public
	*/
	checkBeforeUpdate:function(rowId){ 
		return true;
	},
	/**
	* 	@desc: send row(s) values to server
	*	@param: rowId - id of row which data to send. If not specified, then all "updated" rows will be send
	*	@type: public
	*/
	sendData:function(rowId){
		if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return;
		if (this.obj.editStop) this.obj.editStop();
	
		
		if(typeof rowId == "undefined" || this._tSend) return this.sendAllData();
		if (this._in_progress[rowId]) return false;
		
		this.messages=[];
		if (!this.checkBeforeUpdate(rowId) && this.callEvent("onValidationError",[rowId,this.messages])) return false;
		this._beforeSendData(this._getRowData(rowId),rowId);
    },
    _beforeSendData:function(data,rowId){
    	if (!this.callEvent("onBeforeUpdate",[rowId,this.getState(rowId),data])) return false;	
		this._sendData(data,rowId);
    },
    serialize:function(data, id){
    	if (typeof data == "string")
    		return data;
    	if (typeof id != "undefined")
    		return this.serialize_one(data,"");
    	else{
    		var stack = [];
    		var keys = [];
    		for (var key in data)
    			if (data.hasOwnProperty(key)){
    				stack.push(this.serialize_one(data[key],key+this.post_delim));
    				keys.push(key);
				}
    		stack.push("ids="+this.escape(keys.join(",")));
    		if (this.$gantt.security_key)
				stack.push("dhx_security="+this.$gantt.security_key);
    		return stack.join("&");
    	}
    },
    serialize_one:function(data, pref){
    	if (typeof data == "string")
    		return data;
    	var stack = [];
    	for (var key in data)
    		if (data.hasOwnProperty(key)){
    			if ((key == "id" || key == this.action_param) && this._tMode == "REST") continue;
    			stack.push(this.escape((pref||"")+key)+"="+this.escape(data[key]));
    		}
		return stack.join("&");
    },
	_applyPayload:function(url){
		var ajax = this.$gantt.ajax;
		if (this._payload)
			for (var key in this._payload)
				url = url + ajax.urlSeparator(url) + this.escape(key) + "=" + this.escape(this._payload[key]);
		return url;
	},
    _sendData:function(a1,rowId){
    	if (!a1) return; //nothing to send
		if (!this.callEvent("onBeforeDataSending",rowId?[rowId,this.getState(rowId),a1]:[null, null, a1])) return false;				
		
    	if (rowId)
			this._in_progress[rowId]=(new Date()).valueOf();

		var that = this;
		var back = function(xml){
			var ids = [];
			if (rowId)
				ids.push(rowId);
			else if (a1)
				for (var key in a1)
					ids.push(key);

			return that.afterUpdate(that,xml,ids);
		};
		var ajax = this.$gantt.ajax;

		var a3 = this.serverProcessor+(this._user?(ajax.urlSeparator(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+this.obj.getUserData(0,"version")].join("&")):"");
		var a4 = this._applyPayload(a3);

		if (this._tMode=="GET") {
			ajax.query({
				url: a4 + ajax.urlSeparator(a4) + this.serialize(a1, rowId),
				method: "GET",
				callback: back,
				headers: this._headers
			});
		} else if (this._tMode == "POST") {
			ajax.query({
				url: a4,
				method: "POST",
				headers: this._headers,
				data: this.serialize(a1, rowId),
				callback: back
			});
		} else if (this._tMode == "JSON"){
			var action = a1[this.action_param];
			var data = {};
			for (var key in a1) data[key] = a1[key];
			delete data[this.action_param];
			delete data.id;
			delete data.gr_id;

			ajax.query({
				url:a4,
				method:"POST",
				headers:this._headers,
				callback:back,
				data:JSON.stringify({
					id: rowId,
					action: action,
					data: data
				})
			});
		}
        else if (this._tMode == "REST"){
        	var state = this.getState(rowId);
        	var url = a3.replace(/(\&|\?)editing\=true/,"");
        	var data = "";
        	var method = "post";

        	if (state == "inserted"){
        		data = this.serialize(a1, rowId);
        	} else if (state == "deleted"){
        		method = "DELETE";
        		url = url + (url.slice(-1) == "/" ? "" : "/") + rowId;
        	} else {
        		method = "PUT";
        		data = this.serialize(a1, rowId);
        		url = url + (url.slice(-1) == "/" ? "" : "/") + rowId;
        	}


        	url = this._applyPayload(url);
        	ajax.query({
        		url:url,
        		method:method,
        		headers:this._headers,
        		data:data,
        		callback:back
        	});
        }

		this._waitMode++;
    },
	sendAllData:function(){
		if (!this.updatedRows.length) return;			

		this.messages=[]; var valid=true;
		for (var i=0; i<this.updatedRows.length; i++)
			valid&=this.checkBeforeUpdate(this.updatedRows[i]);
		if (!valid && !this.callEvent("onValidationError",["",this.messages])) return false;
	
		if (this._tSend) 
			this._sendData(this._getAllData());
		else
			for (var i=0; i<this.updatedRows.length; i++)
				if (!this._in_progress[this.updatedRows[i]]){
					if (this.is_invalid(this.updatedRows[i])) continue;
					this._beforeSendData(this._getRowData(this.updatedRows[i]),this.updatedRows[i]);
					if (this._waitMode && (this.obj.mytype=="tree" || this.obj._h2)) return; //block send all for tree
				}
	},

	_getAllData:function(rowId){
		var out={};
		var has_one = false;
		for(var i=0;i<this.updatedRows.length;i++){
			var id=this.updatedRows[i];
			if (this._in_progress[id] || this.is_invalid(id)) continue;
			var row = this._getRowData(id);
			if (!this.callEvent("onBeforeUpdate",[id,this.getState(id), row])) continue;
			out[id]=row;
			has_one = true;
			this._in_progress[id]=(new Date()).valueOf();
		}
		return has_one?out:null;
	},
	
	
	/**
	* 	@desc: specify column which value should be varified before sending to server
	*	@param: ind - column index (0 based)
	*	@param: verifFunction - function (object) which should verify cell value (if not specified, then value will be compared to empty string). Two arguments will be passed into it: value and column name
	*	@type: public
	*/
	setVerificator:function(ind,verifFunction){
		this.mandatoryFields[ind] = verifFunction||(function(value){return (value!=="");});
	},
	/**
	* 	@desc: remove column from list of those which should be verified
	*	@param: ind - column Index (0 based)
	*	@type: public
	*/
	clearVerificator:function(ind){
		this.mandatoryFields[ind] = false;
	},
	
	
	
	
	
	findRow:function(pattern){
		var i=0;
    	for(i=0;i<this.updatedRows.length;i++)
		    if(pattern==this.updatedRows[i]) break;
	    return i;
    },

   
	


    





	/**
	* 	@desc: define custom actions
	*	@param: name - name of action, same as value of action attribute
	*	@param: handler - custom function, which receives a XMl response content for action
	*	@type: private
	*/
	defineAction:function(name,handler){
        if (!this._uActions) this._uActions=[];
            this._uActions[name]=handler;
	},




	/**
*     @desc: used in combination with setOnBeforeUpdateHandler to create custom client-server transport system
*     @param: sid - id of item before update
*     @param: tid - id of item after up0ate
*     @param: action - action name
*     @type: public
*     @topic: 0
*/
	afterUpdateCallback:function(sid, tid, action, btag) {
		var marker = sid;
		var correct=(action!="error" && action!="invalid");
		if (!correct) this.set_invalid(sid,action);
		if ((this._uActions)&&(this._uActions[action])&&(!this._uActions[action](btag)))
			return (delete this._in_progress[marker]);

		if (this._in_progress[marker]!="wait")
			this.setUpdated(sid, false);

		var soid = sid;

		switch (action) {
			case "inserted":
			case "insert":
				if (tid != sid) {
					this.setUpdated(sid,false);
					this.obj[this._methods[2]](sid, tid);
					sid = tid;
				}
				break;
			case "delete":
			case "deleted":
				this.obj.setUserData(sid, this.action_param, "true_deleted");
				this.obj[this._methods[3]](sid);
				delete this._in_progress[marker];
				return this.callEvent("onAfterUpdate", [sid, action, tid, btag]);
		}

		if (this._in_progress[marker]!="wait"){
			if (correct) this.obj.setUserData(sid, this.action_param,'');
			delete this._in_progress[marker];
		} else {
			delete this._in_progress[marker];
			this.setUpdated(tid,true,this.obj.getUserData(sid,this.action_param));
		}

		this.callEvent("onAfterUpdate", [soid, action, tid, btag]);
	},

	/**
	* 	@desc: response from server
	*	@param: xml - XMLLoader object with response XML
	*	@type: private
	*/
	afterUpdate:function(that,xml,id){
		var ajax = this.$gantt.ajax;
		//try to use json first
		if (window.JSON){
			var tag;

			try{
				tag = JSON.parse(xml.xmlDoc.responseText);
			} catch(e){

				// empty response also can be processed by json handler
				if(!xml.xmlDoc.responseText.length){
					tag = {};
				}
			}

			if(tag){
				var action = tag.action || this.getState(id) || "updated";
				var sid = tag.sid || id[0];
				var tid = tag.tid || id[0];
				that.afterUpdateCallback(sid, tid, action, tag);
				that.finalizeUpdate();
				return;
			}
		}
		//xml response
		var top = ajax.xmltop("data", xml.xmlDoc); //fix incorrect content type in IE
		if (!top) return this.cleanUpdate(id);
		var atag=ajax.xpath("//data/action", top);
		if (!atag.length) return this.cleanUpdate(id);

		for (var i=0; i<atag.length; i++){
        	var btag=atag[i];
			var action = btag.getAttribute("type");
			var sid = btag.getAttribute("sid");
			var tid = btag.getAttribute("tid");
			
			that.afterUpdateCallback(sid,tid,action,btag);
		}
		that.finalizeUpdate();
	},
	cleanUpdate:function(id){
		if (id)
			for (var i = 0; i < id.length; i++)
				delete this._in_progress[id[i]];
	},
	finalizeUpdate:function(){
		if (this._waitMode) this._waitMode--;
		
		if ((this.obj.mytype=="tree" || this.obj._h2) && this.updatedRows.length) 
			this.sendData();
		this.callEvent("onAfterUpdateFinish",[]);
		if (!this.updatedRows.length)
			this.callEvent("onFullSync",[]);
	},




	
	/**
	* 	@desc: initializes data-processor
	*	@param: anObj - dhtmlxGrid object to attach this data-processor to
	*	@type: public
	*/
	init:function(anObj){
		this.obj = anObj;
		if (this.obj._dp_init) 
			this.obj._dp_init(this);
	},
	
	
	setOnAfterUpdate:function(ev){
		this.attachEvent("onAfterUpdate",ev);
	},
	enableDebug:function(mode){
	},
	setOnBeforeUpdateHandler:function(func){  
		this.attachEvent("onBeforeDataSending",func);
	},



	/* starts autoupdate mode
		@param interval
			time interval for sending update requests
	*/
	setAutoUpdate: function(interval, user) {
		interval = interval || 2000;
		
		this._user = user || (new Date()).valueOf();
		this._need_update = false;
		//this._loader = null;
		this._update_busy = false;
		
		this.attachEvent("onAfterUpdate",function(sid,action,tid,xml_node){
			this.afterAutoUpdate(sid, action, tid, xml_node);
		});
		this.attachEvent("onFullSync",function(){
			this.fullSync();
		});
		
		var self = this;
		window.setInterval(function(){
			self.loadUpdate();
		}, interval);
	},


	/* process updating request answer
		if status == collision version is depricated
		set flag for autoupdating immidiatly
	*/
	afterAutoUpdate: function(sid, action, tid, xml_node) {
		if (action == 'collision') {
			this._need_update = true;
			return false;
		} else {
			return true;
		}
	},


	/* callback function for onFillSync event
		call update function if it's need
	*/
	fullSync: function() {
		if (this._need_update) {
			this._need_update = false;
			this.loadUpdate();
		}
		return true;
	},


	/* sends query to the server and call callback function
	*/
	getUpdates: function(url,callback){
		var ajax = this.$gantt.ajax;
		if (this._update_busy) 
			return false;
		else
			this._update_busy = true;
		
		//this._loader = this._loader || new dtmlXMLLoaderObject(true);
		
		//this._loader.async=true;
		//this._loader.waitCall=callback;
		//this._loader.loadXML(url);
		ajax.get(url, callback);

	},


	/* returns xml node value
		@param node
			xml node
	*/
	_v: function(node) {
		if (node.firstChild) return node.firstChild.nodeValue;
		return "";
	},


	/* returns values array of xml nodes array
		@param arr
			array of xml nodes
	*/
	_a: function(arr) {
		var res = [];
		for (var i=0; i < arr.length; i++) {
			res[i]=this._v(arr[i]);
		}
		return res;
	},


	/* loads updates and processes them
	*/
	loadUpdate: function(){
		var ajax = this.$gantt.ajax;
		var self = this;
		var version = this.obj.getUserData(0,"version");
		var url = this.serverProcessor+ajax.urlSeparator(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+version].join("&");
		url = url.replace("editing=true&","");
		this.getUpdates(url, function(xml){
			var vers = ajax.xpath("//userdata", xml);
			self.obj.setUserData(0,"version",self._v(vers[0]));
			
			var upds = ajax.xpath("//update", xml);
			if (upds.length){
				self._silent_mode = true;
				
				for (var i=0; i<upds.length; i++) {
					var status = upds[i].getAttribute('status');
					var id = upds[i].getAttribute('id');
					var parent = upds[i].getAttribute('parent');
					switch (status) {
						case 'inserted':
							self.callEvent("insertCallback",[upds[i], id, parent]);
							break;
						case 'updated':
							self.callEvent("updateCallback",[upds[i], id, parent]);
							break;
						case 'deleted':
							self.callEvent("deleteCallback",[upds[i], id, parent]);
							break;
					}
				}
				
				self._silent_mode = false;
			}
			
			self._update_busy = false;
			self = null;
		});
	}

};

module.exports = dataProcessor;

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function(gantt){
	var modules = [
		__webpack_require__(62),
		__webpack_require__(63),
		__webpack_require__(64),
		__webpack_require__(65),
		__webpack_require__(66)
	];

	for(var i = 0; i < modules.length; i++){
		if(modules[i])
			modules[i](gantt);
	}
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1);

module.exports = function(gantt){

	var scrollRange = 50,
		scrollStep = 30,
		scrollDelay = 10,
		scrollSpeed = 50;

	var interval = null,
		isMove = false,
		delayTimeout = null,
		box = {},
		startPos = {
			started: false
		},
		eventPos = {};

	function isScrollState() {
		var dragMarker = !!document.querySelector(".gantt_drag_marker");
		var isResize = !!document.querySelector(".gantt_drag_marker.gantt_grid_resize_area");
		var isLink = !!document.querySelector(".gantt_link_direction");
		isMove = dragMarker && !isResize && !isLink;
		return !((!gantt.getState().drag_mode && !dragMarker) || isResize);
	}

	function defineDelayTimeout(state) {
		if (delayTimeout) {
			clearTimeout(delayTimeout);
			delayTimeout = null;
		}
		if (state) {
			var speed = gantt.config.autoscroll_speed;
			if (speed && speed < 10) // limit speed value to 10 
				speed = 10;

			delayTimeout = setTimeout(function() {
				interval = setInterval(tick, speed || scrollSpeed);
				box = domHelpers.getNodePosition(gantt.$task);
			}, gantt.config.autoscroll_delay || scrollDelay);
		}
	}

	function defineScrollInterval(state) {
		if (state) {
			defineDelayTimeout(true);
			if (!startPos.started) {
				startPos.x = eventPos.x;
				startPos.y = eventPos.y;
				startPos.started = true;
			}
		} else {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			defineDelayTimeout(false);
			startPos.started = false;
		}
	}

	function autoscrollInterval(event) {

		var isScroll = isScrollState();

		if ((interval || delayTimeout) && !isScroll) { 
			defineScrollInterval(false);
		}

		if (!gantt.config.autoscroll || !isScroll) {
			return false;
		}

		eventPos = {
			x: event.clientX,
			y: event.clientY
		};

		if (!interval && isScroll) {
			defineScrollInterval(true);
		}
	}

	function tick() {

		if (!isScrollState()) {
			defineScrollInterval(false);
			return false;
		}

		var box = domHelpers.getNodePosition(gantt.$task);
		var posX = eventPos.x - box.x; 
		var posY = eventPos.y - box.y;

		var scrollLeft = isMove ? 0 : need_scroll(posX, box.width, startPos.x - box.x);
		var scrollTop = need_scroll(posY, box.height, startPos.y - box.y);

		var scrollState = gantt.getScrollState();

		var currentScrollTop = scrollState.y,
			scrollOuterHeight = scrollState.inner_height,
			scrollInnerHeight = scrollState.height,
			currentScrollLeft = scrollState.x,
			scrollOuterWidth = scrollState.inner_width,
			scrollInnerWidth = scrollState.width;

		// do scrolling only if we have scrollable area to do so
		if (scrollTop && !scrollOuterHeight) {
			scrollTop = 0;
		} else if (scrollTop < 0 && !currentScrollTop) {
			scrollTop = 0;
		} else if (scrollTop > 0 && currentScrollTop + scrollOuterHeight >= scrollInnerHeight + 2) {
			scrollTop = 0;
		}

		if (scrollLeft && !scrollOuterWidth) {
			scrollLeft = 0;
		} else if (scrollLeft < 0 && !currentScrollLeft) {
			scrollLeft = 0;
		} else if (scrollLeft > 0 && currentScrollLeft + scrollOuterWidth >= scrollInnerWidth) {
			scrollLeft = 0;
		}

		var step = gantt.config.autoscroll_step;

		if (step && step < 2) // limit step value to 2
			step = 2;

		scrollLeft = scrollLeft * (step || scrollStep);
		scrollTop = scrollTop * (step || scrollStep);

		if (scrollLeft || scrollTop) {
			scroll(scrollLeft, scrollTop);
		} 

	}

	function need_scroll(pos, boxSize, startCoord) {
		if ((pos - scrollRange < 0) && (pos < startCoord))
			return -1;
		else if ((pos > boxSize - scrollRange) && (pos > startCoord))
			return 1;
		return 0;
	}

	function scroll(left, top) {
		var scrollState = gantt.getScrollState();

		var scrollLeft = null,
			scrollTop = null;

		if (left) {
			scrollLeft = scrollState.x + left;
			scrollLeft = Math.min(scrollState.width, scrollLeft);
			scrollLeft = Math.max(0, scrollLeft);
		}

		if (top) {
			scrollTop = scrollState.y + top;
			scrollTop = Math.min(scrollState.height, scrollTop);
			scrollTop = Math.max(0, scrollTop);
		}

		gantt.scrollTo(scrollLeft, scrollTop);
	}

	gantt.attachEvent("onGanttReady", function() {
		gantt.eventRemove(document.body, "mousemove", autoscrollInterval);
		gantt.event(document.body, "mousemove", autoscrollInterval);
	});

};

/***/ }),
/* 63 */
/***/ (function(module, exports) {

function createMethod(){
	var methods = {};
	var isActive = false;
	function disableMethod(methodName, dummyMethod){
		dummyMethod = typeof dummyMethod == "function" ? dummyMethod : function(){};

		if(!methods[methodName]){
			methods[methodName] = this[methodName];
			this[methodName] = dummyMethod;
		}
	}
	function restoreMethod(methodName){
		if(methods[methodName]){
			this[methodName] = methods[methodName];
			methods[methodName] = null;
		}
	}
	function disableMethods(methodsHash){
		for(var i in methodsHash){
			disableMethod.call(this, i, methodsHash[i]);
		}
	}
	 function restoreMethods(){
		for(var i in methods){
			restoreMethod.call(this, i);
		}
	}

	function batchUpdatePayload(callback){
		try{
			callback();
		}catch(e){
			window.console.error(e);
		}
	}

	return function batchUpdate(callback, noRedraw) {
		if(isActive){
			// batch mode is already active
			batchUpdatePayload(callback);
			return;
		}

		var call_dp = (this._dp && this._dp.updateMode != "off");
		var dp_mode;
		if (call_dp){
			dp_mode = this._dp.updateMode;
			this._dp.setUpdateMode("off");
		}

		// temporary disable some methods while updating multiple tasks
		var resetProjects = {};
		var methods = {
			"render":true,
			"refreshData":true,
			"refreshTask":true,
			"refreshLink":true,
			"resetProjectDates":function(task){
				resetProjects[task.id] = task;
			}
		};

		disableMethods.call(this, methods);

		isActive = true;
		this.callEvent("onBeforeBatchUpdate", []);

		batchUpdatePayload(callback);

		this.callEvent("onAfterBatchUpdate", []);

		restoreMethods.call(this);

		// do required updates after changes applied
		for(var i in resetProjects){
			this.resetProjectDates(resetProjects[i]);
		}

		isActive = false;

		if(!noRedraw){
			this.render();
		}

		if (call_dp) {
			this._dp.setUpdateMode(dp_mode);
			this._dp.setGanttMode("tasks");
			this._dp.sendData();
			this._dp.setGanttMode("links");
			this._dp.sendData();
		}
	};
}

module.exports = function(gantt){
	gantt.batchUpdate = createMethod();
};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

var createWbs = (function(gantt){
	return {
	_needRecalc: true,
	reset: function(){
		this._needRecalc = true;
	},
	_isRecalcNeeded: function(){
		return (!this._isGroupSort() && this._needRecalc);
	},
	_isGroupSort: function() {
		return !!(gantt._groups && gantt._groups.is_active());
	},
	_getWBSCode: function(task) {
		if(!task) return "";

		if(this._isRecalcNeeded()){
			this._calcWBS();
		}

		if(task.$virtual) return "";
		if(this._isGroupSort()) return task.$wbs || "";

		if(!task.$wbs) {
			this.reset();
			this._calcWBS();
		}
		return task.$wbs;
	},
	_setWBSCode: function(task, value) {
		task.$wbs = value;
	},
	getWBSCode: function(task) {
		return this._getWBSCode(task);
	},
	_calcWBS: function() {
		if(!this._isRecalcNeeded()) return;

		var _isFirst = true;
		gantt.eachTask(function(ch) {
			if(_isFirst) {
				_isFirst = false;
				this._setWBSCode(ch, "1");
				return;
			}
			var _prevSibling = gantt.getPrevSibling(ch.id);
			if (_prevSibling !== null) {
				var _wbs = gantt.getTask(_prevSibling).$wbs;
				if(_wbs) {
					_wbs = _wbs.split(".");
					_wbs[_wbs.length-1]++;
					this._setWBSCode(ch, _wbs.join("."));
				}
			} else {
				var _parent = gantt.getParent(ch.id);
				this._setWBSCode(ch, gantt.getTask(_parent).$wbs + ".1");
			}
		}, gantt.config.root_id, this);

		this._needRecalc = false;
	}
};
});

module.exports = function(gantt){
	var wbs = createWbs(gantt);
	gantt.getWBSCode = function getWBSCode(task) {
		return wbs.getWBSCode(task);
	};

	gantt.attachEvent("onAfterTaskMove", function() {
		wbs.reset();
		return true;
	});

	gantt.attachEvent("onBeforeParse", function() {
		wbs.reset();
		return true;
	});

	gantt.attachEvent("onAfterTaskDelete", function() {
		wbs.reset();
		return true;
	});

	gantt.attachEvent("onAfterTaskAdd", function() {
		wbs.reset();
		return true;
	});
};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

if (window.jQuery){

	(function( $ ){

		var methods = [];
		$.fn.dhx_gantt = function(config){
			config = config || {};
			if (typeof(config) === 'string') {
				if (methods[config] ) {
					return methods[config].apply(this, []);
				}else {
					$.error('Method ' +  config + ' does not exist on jQuery.dhx_gantt');
				}
			} else {
				var views = [];
				this.each(function() {
					if (this && this.getAttribute){
						if (!this.gantt && !(window.gantt.$root == this)){

							var newgantt = (window.gantt.$container && window.Gantt) ? window.Gantt.getGanttInstance():window.gantt;
							for (var key in config)
								if (key!="data")
									newgantt.config[key] = config[key];

							newgantt.init(this);
							if (config.data)
								newgantt.parse(config.data);

							views.push(newgantt);
						} else
							views.push(typeof this.gantt == "object" ? this.gantt : window.gantt);
					}
				});


				if (views.length === 1) return views[0];
				return views;
			}
		};

	})(jQuery);

}


module.exports = null;

/***/ }),
/* 66 */
/***/ (function(module, exports) {

if (window.dhtmlx){

	if (!dhtmlx.attaches)
		dhtmlx.attaches = {};

	dhtmlx.attaches.attachGantt=function(start, end, gantt){
		var obj = document.createElement("DIV");

		gantt = gantt || window.gantt;

		obj.id = "gantt_"+ gantt.uid();
		obj.style.width = "100%";
		obj.style.height = "100%";
		obj.cmp = "grid";

		document.body.appendChild(obj);
		this.attachObject(obj.id);
		this.dataType = "gantt";
		this.dataObj = gantt;

		var that = this.vs[this.av];
		that.grid = gantt;

		gantt.init(obj.id, start, end);
		obj.firstChild.style.border = "none";

		that.gridId = obj.id;
		that.gridObj = obj;

		var method_name="_viewRestore";
		return this.vs[this[method_name]()].grid;
	};

}
if (typeof(window.dhtmlXCellObject) != "undefined") {

	dhtmlXCellObject.prototype.attachGantt=function(start, end, gantt){
		gantt = gantt || window.gantt;

		var obj = document.createElement("DIV");
		obj.id = "gantt_"+gantt.uid();
		obj.style.width = "100%";
		obj.style.height = "100%";
		obj.cmp = "grid";

		document.body.appendChild(obj);
		this.attachObject(obj.id);

		this.dataType = "gantt";
		this.dataObj = gantt;

		gantt.init(obj.id, start, end);
		obj.firstChild.style.border = "none";
		var method_name="_viewRestore";
		obj = null;
		this.callEvent("_onContentAttach",[]);

		return this.dataObj;
	};
}

module.exports = null;

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
};

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	gantt.getGridColumn = function (name) {
		var columns = gantt.config.columns;

		for (var i = 0; i < columns.length; i++) {
			if (columns[i].name == name)
				return columns[i];
		}

		return null;
	};
};

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = function(gantt){

	var htmlTags = new RegExp("<(?:.|\n)*?>", "gm");
	var extraSpaces = new RegExp(" +", "gm");

	function stripHTMLLite(htmlText){
		return (htmlText + "")
			.replace(htmlTags, " ").
			replace(extraSpaces, " ");
	}

	var singleQuotes = new RegExp("'", "gm");
	function escapeQuotes(text){
		return (text + "").replace(singleQuotes, "&#39;");
	}

	gantt._waiAria = {
		getAttributeString: function(attr){
			var attributes = [" "];
			for(var i in attr){
				var text = escapeQuotes(stripHTMLLite(attr[i]));
				attributes.push(i + "='" + text + "'");
			}
			attributes.push(" ");
			return attributes.join(" ");

		},

		getTimelineCellAttr:function(dateString){

			return gantt._waiAria.getAttributeString({"aria-label": dateString});
		},


		_taskCommonAttr: function(task, div){

			if(!(task.start_date && task.end_date))
				return;

			div.setAttribute("aria-label", stripHTMLLite(gantt.templates.tooltip_text(task.start_date, task.end_date, task)));

			if(gantt.isReadonly(task)){
				div.setAttribute("aria-readonly", true);


			}

			if(task.$dataprocessor_class){
				div.setAttribute("aria-busy", true);
			}


			div.setAttribute("aria-selected",
				(gantt.getState().selected_task == task.id || (gantt.isSelectedTask && gantt.isSelectedTask(task.id))) ? "true" : "false");
		},

		setTaskBarAttr: function(task, div){
			this._taskCommonAttr(task, div);

			if(!gantt.isReadonly(task) && gantt.config.drag_move){
				if(task.id != gantt.getState().drag_id){
					div.setAttribute("aria-grabbed", false);
				}else{
					div.setAttribute("aria-grabbed", true);
				}
			}
		},

		taskRowAttr: function(task, div){

			this._taskCommonAttr(task, div);

			if(!gantt.isReadonly(task) && gantt.config.order_branch){
				div.setAttribute("aria-grabbed", false);
			}

			div.setAttribute("role", "row");

			div.setAttribute("aria-level", task.$level);

			if(gantt.hasChild(task.id)){
				div.setAttribute("aria-expanded", task.$open ? "true" : "false");
			}
		},

		linkAttr: function(link, div){

			var linkTypes = gantt.config.links;

			var toStart = link.type == linkTypes.finish_to_start || link.type == linkTypes.start_to_start;
			var fromStart = link.type == linkTypes.start_to_start || link.type == linkTypes.start_to_finish;

			var content = gantt.locale.labels.link + " " +  gantt.templates.drag_link(link.source, fromStart, link.target, toStart);

			div.setAttribute("aria-label", stripHTMLLite(content));
			if(gantt.isReadonly(link)){
				div.setAttribute("aria-readonly", true);
			}
		},

		gridSeparatorAttr: function(div){
			div.setAttribute("role", "separator");
		},

		lightboxHiddenAttr: function(div){
			div.setAttribute("aria-hidden", "true");
		},

		lightboxVisibleAttr: function(div){
			div.setAttribute("aria-hidden", "false");
		},

		lightboxAttr: function(div){
			div.setAttribute("role", "dialog");
			div.setAttribute("aria-hidden", "true");
			div.firstChild.setAttribute("role", "heading");
		},

		lightboxButtonAttrString:function(buttonName){
			return this.getAttributeString({"role":"button", "aria-label":gantt.locale.labels[buttonName], "tabindex":"0"});
		},

		lightboxHeader: function(div, headerText){
			div.setAttribute("aria-label", headerText);
		},

		lightboxSelectAttrString: function(time_option){
			var label = "";

			switch (time_option) {
				case "%Y":
					label = gantt.locale.labels.years;
					break;
				case "%m":
					label = gantt.locale.labels.months;
					break;
				case "%d":
					label = gantt.locale.labels.days;
					break;
				case "%H:%i":
					label = gantt.locale.labels.hours + gantt.locale.labels.minutes;
					break;
				default:
					break;
			}

			return gantt._waiAria.getAttributeString({"aria-label": label});
		},

		lightboxDurationInputAttrString: function(section){
			return this.getAttributeString({"aria-label": gantt.locale.labels.column_duration, "aria-valuemin": "0"});
		},

		gridAttrString: function(){
			return [" role='treegrid'", gantt.config.multiselect ? "aria-multiselectable='true'" : "aria-multiselectable='false'", " "].join(" ");
		},


		gridScaleRowAttrString: function(){
			return "role='row'";
		},

		gridScaleCellAttrString: function(column, label){
			var attrs = "";
			if(column.name == "add"){
				attrs = this.getAttributeString({"role":"button", "aria-label": gantt.locale.labels.new_task});
			}else{

				var attributes = {
					"role":"columnheader",
					"aria-label": label
				};

				if(gantt._sort && gantt._sort.name == column.name){
					if(gantt._sort.direction == "asc"){
						attributes["aria-sort"] = "ascending";
					}else{
						attributes["aria-sort"] = "descending";
					}
				}

				attrs = this.getAttributeString(attributes);
			}
			return attrs;
		},

		gridDataAttrString: function(){
			return "role='rowgroup'";
		},

		gridCellAttrString: function(column, textValue){
			return this.getAttributeString({"role":"gridcell", "aria-label": textValue});
		},

		gridAddButtonAttrString: function(column){
			return this.getAttributeString({"role":"button", "aria-label": gantt.locale.labels.new_task});
		},

		messageButtonAttrString: function(buttonLabel){
			return "tabindex='0' role='button' aria-label='"+buttonLabel+"'";
		},

		messageInfoAttr: function(div){
			div.setAttribute("role", "alert");
			//div.setAttribute("tabindex", "-1");
		},

		messageModalAttr: function(div, uid){
			div.setAttribute("role", "dialog");
			if(uid){
				div.setAttribute("aria-labelledby", uid);
			}

		//	div.setAttribute("tabindex", "-1");
		},

		quickInfoAttr: function(div){
			div.setAttribute("role", "dialog");
		},

		quickInfoHeaderAttrString: function(){
			return " role='heading' ";
		},

		quickInfoHeader: function(div, header){
			div.setAttribute("aria-label", header);
		},

		quickInfoButtonAttrString: function(label){
			return gantt._waiAria.getAttributeString({"role":"button", "aria-label":label, "tabindex":"0"});
		},

		tooltipAttr: function(div){
			div.setAttribute("role", "tooltip");
		},

		tooltipVisibleAttr: function(div){
			div.setAttribute("aria-hidden", "false");
		},

		tooltipHiddenAttr: function(div){
			div.setAttribute("aria-hidden", "true");
		}
	};

	function isDisabled(){
		return !gantt.config.wai_aria_attributes;
	}

	for(var i in gantt._waiAria){
		gantt._waiAria[i] = (function(payload){
			return function(){
				if(isDisabled()){
					return "";
				}
				return payload.apply(this, arguments);
			};
		})(gantt._waiAria[i]);
	}


};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	gantt._is_chart_visible = function () {
		return !!this.config.show_chart;
	};



	gantt._get_links_data = function () {
		return this.$data.linksStore.getVisibleItems();
	};




	gantt.isReadonly = function (item) {
		if (item && item[this.config.editable_property]) {
			return false;
		} else {
			return (item && item[this.config.readonly_property]) || this.config.readonly;
		}
	};

	gantt._get_line = function (step) {
		var steps = {
			"second": 1,
			"minute": 60,
			"hour": 60 * 60,
			"day": 60 * 60 * 24,
			"week": 60 * 60 * 24 * 7,
			"month": 60 * 60 * 24 * 30,
			"quarter": 60 * 60 * 24 * 30 * 3,
			"year": 60 * 60 * 24 * 365
		};
		return steps[step] || steps.hour;
	};

};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var dateHelper = __webpack_require__(3);

module.exports = function(gantt) {

	gantt.load = function (url, type, callback) {
		this._load_url = url;
		this.assert(arguments.length, "Invalid load arguments");

		var tp = 'json', cl = null;
		if (arguments.length >= 3) {
			tp = type;
			cl = callback;
		} else {
			if (typeof arguments[1] == "string")
				tp = arguments[1];
			else if (typeof arguments[1] == "function")
				cl = arguments[1];
		}

		this._load_type = tp;

		this.callEvent("onLoadStart", [url, tp]);

		this.ajax.get(url, gantt.bind(function (l) {
			this.on_load(l, tp);
			this.callEvent("onLoadEnd", [url, tp]);
			if (typeof cl == "function")
				cl.call(this);
		}, this));
	};
	gantt.parse = function (data, type) {
		this.on_load({xmlDoc: {responseText: data}}, type);
	};

	gantt.serialize = function (type) {
		type = type || "json";
		return this[type].serialize();
	};

	/*
	tasks and relations
	{
	data:[
		{
			"id":"string",
			"text":"...",
			"start_date":"Date or string",
			"end_date":"Date or string",
			"duration":"number",
			"progress":"0..1",
			"parent_id":"string",
			"order":"number"
		},...],
	links:[
		{
			id:"string",
			source:"string",
			target:"string",
			type:"string"
		},...],
	collections:{
			collectionName:[
				{key:, label:, optional:...},...
			],...
		}
	}

	* */

	gantt.on_load = function (resp, type) {
		this.callEvent("onBeforeParse", []);
		if (!type)
			type = "json";
		this.assert(this[type], "Invalid data type:'" + type + "'");

		var raw = resp.xmlDoc.responseText;

		var data = this[type].parse(raw, resp);
		this._process_loading(data);
	};

	gantt._process_loading = function (data) {
		if(data.collections)
			this._load_collections(data.collections);

		this.$data.tasksStore.parse(data.data);
		var links = data.links || (data.collections ? data.collections.links : []);
		this.$data.linksStore.parse(links);

		//this._sync_links();
		this.callEvent("onParse", []);
		this.render();
		if(this.config.initial_scroll){
			var firstTask = this.getTaskByIndex(0);
			var id = firstTask ? firstTask.id : this.config.root_id;
			if(id)
				this.showTask(id);
		}
	};


	gantt._load_collections = function (collections) {
		var collections_loaded = false;
		for (var key in collections) {
			if (collections.hasOwnProperty(key)) {
				collections_loaded = true;
				var collection = collections[key];
				var arr = this.serverList[key];
				if (!arr) continue;
				arr.splice(0, arr.length); //clear old options
				for (var j = 0; j < collection.length; j++) {
					var option = collection[j];
					var obj = this.copy(option);
					obj.key = obj.value;// resulting option object

					for (var option_key in option) {
						if (option.hasOwnProperty(option_key)) {
							if (option_key == "value" || option_key == "label")
								continue;
							obj[option_key] = option[option_key]; // obj['value'] = option['value']
						}
					}
					arr.push(obj);
				}
			}
		}
		if (collections_loaded)
			this.callEvent("onOptionsLoad", []);
	};

	gantt.attachEvent("onBeforeTaskDisplay", function (id, task) {
		return !task.$ignore;
	});

	gantt.json = {
		parse: function (data) {
			gantt.assert(data, "Invalid data");

			if (typeof data == "string") {
				if (window.JSON)
					data = JSON.parse(data);
				else {
					gantt.assert(false, "JSON is not supported");
				}
			}

			if (data.dhx_security)
				gantt.security_key = data.dhx_security;
			return data;
		},
		serializeTask: function (task) {
			return this._copyObject(task);
		},
		serializeLink: function (link) {
			return this._copyLink(link);
		},
		_copyLink: function (obj) {
			var copy = {};
			for (var key in obj)
				copy[key] = obj[key];
			return copy;
		},
		_copyObject: function (obj) {
			var copy = {};
			for (var key in obj) {
				if (key.charAt(0) == "$")
					continue;
				copy[key] = obj[key];

				if (dateHelper.isDate(copy[key])) {
					copy[key] = gantt.templates.xml_format(copy[key]);
				}
			}
			return copy;
		},
		serialize: function () {
			var tasks = [];
			var links = [];

			gantt.eachTask(function (obj) {
				gantt.resetProjectDates(obj);
				tasks.push(this.serializeTask(obj));
			}, gantt.config.root_id, this);

			var rawLinks = gantt.getLinks();
			for (var i = 0; i < rawLinks.length; i++) {
				links.push(this.serializeLink(rawLinks[i]));
			}

			return {
				data: tasks,
				links: links
			};
		}
	};

	/*
	<data>
		<task id:"some" parent_id="0" progress="0.5">
			<text>My task 1</text>
			<start_date>16.08.2013</start_date>
			<end_date>22.08.2013</end_date>
		</task>
		<coll_options>
			<links>
				<link source='a1' target='b2' type='c3' />
			</links>
		</coll_options>
	</data>
	*/

	gantt.xml = {
		_xmlNodeToJSON: function (node, attrs_only) {
			var t = {};
			for (var i = 0; i < node.attributes.length; i++)
				t[node.attributes[i].name] = node.attributes[i].value;

			if (!attrs_only) {
				for (var i = 0; i < node.childNodes.length; i++) {
					var child = node.childNodes[i];
					if (child.nodeType == 1)
						t[child.tagName] = child.firstChild ? child.firstChild.nodeValue : "";
				}

				if (!t.text) t.text = node.firstChild ? node.firstChild.nodeValue : "";
			}

			return t;
		},
		_getCollections: function (loader) {
			var collection = {};
			var opts = gantt.ajax.xpath("//coll_options", loader);
			for (var i = 0; i < opts.length; i++) {
				var bind = opts[i].getAttribute("for");
				var arr = collection[bind] = [];
				var itms = gantt.ajax.xpath(".//item", opts[i]);
				for (var j = 0; j < itms.length; j++) {
					var itm = itms[j];
					var attrs = itm.attributes;
					var obj = {key: itms[j].getAttribute("value"), label: itms[j].getAttribute("label")};
					for (var k = 0; k < attrs.length; k++) {
						var attr = attrs[k];
						if (attr.nodeName == "value" || attr.nodeName == "label")
							continue;
						obj[attr.nodeName] = attr.nodeValue;
					}
					arr.push(obj);
				}
			}
			return collection;
		},
		_getXML: function (text, loader, toptag) {
			toptag = toptag || "data";
			if (!loader.getXMLTopNode) {
				loader = gantt.ajax.parse(loader);
			}

			var xml = gantt.ajax.xmltop(toptag, loader.xmlDoc);
			if (!xml || xml.tagName != toptag) throw "Invalid XML data";

			var skey = xml.getAttribute("dhx_security");
			if (skey)
				gantt.security_key = skey;

			return xml;
		},
		parse: function (text, loader) {
			loader = this._getXML(text, loader);
			var data = {};

			var evs = data.data = [];
			var xml = gantt.ajax.xpath("//task", loader);

			for (var i = 0; i < xml.length; i++)
				evs[i] = this._xmlNodeToJSON(xml[i]);

			data.collections = this._getCollections(loader);
			return data;
		},
		_copyLink: function (obj) {
			return "<item id='" + obj.id + "' source='" + obj.source + "' target='" + obj.target + "' type='" + obj.type + "' />";
		},
		_copyObject: function (obj) {
			return "<task id='" + obj.id + "' parent='" + (obj.parent || "") + "' start_date='" + obj.start_date + "' duration='" + obj.duration + "' open='" + (!!obj.open) + "' progress='" + obj.progress + "' end_date='" + obj.end_date + "'><![CDATA[" + obj.text + "]]></task>";
		},
		serialize: function () {
			var tasks = [];
			var links = [];

			var json = gantt.json.serialize();
			for (var i = 0, len = json.data.length; i < len; i++) {
				tasks.push(this._copyObject(json.data[i]));
			}
			for (var i = 0, len = json.links.length; i < len; i++) {
				links.push(this._copyLink(json.links[i]));
			}
			return "<data>" + tasks.join("") + "<coll_options for='links'>" + links.join("") + "</coll_options></data>";
		}
	};


	gantt.oldxml = {
		parse: function (text, loader) {
			loader = gantt.xml._getXML(text, loader, "projects");
			var data = {collections: {links: []}};

			var evs = data.data = [];
			var xml = gantt.ajax.xpath("//task", loader);

			for (var i = 0; i < xml.length; i++) {
				evs[i] = gantt.xml._xmlNodeToJSON(xml[i]);
				var parent = xml[i].parentNode;

				if (parent.tagName == "project")
					evs[i].parent = "project-" + parent.getAttribute("id");
				else
					evs[i].parent = parent.parentNode.getAttribute("id");
			}

			xml = gantt.ajax.xpath("//project", loader);
			for (var i = 0; i < xml.length; i++) {
				var ev = gantt.xml._xmlNodeToJSON(xml[i], true);
				ev.id = "project-" + ev.id;
				evs.push(ev);
			}

			for (var i = 0; i < evs.length; i++) {
				var ev = evs[i];
				ev.start_date = ev.startdate || ev.est;
				ev.end_date = ev.enddate;
				ev.text = ev.name;
				ev.duration = ev.duration / 8;
				ev.open = 1;
				if (!ev.duration && !ev.end_date) ev.duration = 1;
				if (ev.predecessortasks)
					data.collections.links.push({
						target: ev.id,
						source: ev.predecessortasks,
						type: gantt.config.links.finish_to_start
					});
			}

			return data;
		},
		serialize: function () {
			gantt.message("Serialization to 'old XML' is not implemented");
		}
	};

	gantt.serverList = function (name, array) {
		if (array) {
			this.serverList[name] = array.slice(0);
		} else if (!this.serverList[name]) {
			this.serverList[name] = [];
		}
		return this.serverList[name];
	};

};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var CalendarManager = __webpack_require__(73),
	TimeCalculator = __webpack_require__(76),
	worktimeFacadeFactory = __webpack_require__(78),
	utils = __webpack_require__(0);

module.exports = function (gantt) {
	var manager = new CalendarManager(gantt),
	timeCalculator = new TimeCalculator(manager);
	var facade = worktimeFacadeFactory.create(manager, timeCalculator);
	utils.mixin(gantt, facade);
};


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var createArgumentsHelper = __webpack_require__(18);
var CalendarWorktimeStrategy = __webpack_require__(74);

function CalendarManager (gantt){
	this.$gantt = gantt;
	this._calendars = {};
}

CalendarManager.prototype = {
	_calendars: {},
	_getDayHoursForMultiple: function (calendars, date) {
		var units = [],
			tick = true,
			currPos = 0,
			is_work_hour = false,
			start = this.$gantt.date.day_start(new Date(date));
		for (var hour = 0; hour < 24; hour++) {
			is_work_hour = calendars.reduce(function (acc, calendar) {
				return acc && calendar._is_work_hour(start);
			}, true);
			if (is_work_hour) {
				if (tick) {
					units[currPos] = hour;
					units[currPos + 1] = (hour + 1);
					currPos += 2;
				} else {
					units[currPos - 1] += 1;
				}
				tick = false;
			} else if (!tick) {
				tick = true;
			}
			start = this.$gantt.date.add(start, 1, "hour");
		}
		if (!units.length)
			units = false;
		return units;
	},
	mergeCalendars: function () {
		var newCalendar = this.createCalendar(),
			day,
			units = [];
		var calendars = Array.prototype.slice.call(arguments, 0);
		newCalendar.worktime.hours = [0, 24];
		newCalendar.worktime.dates = {};
		var start = this.$gantt.date.day_start(new Date(259200000)); // 1970 day=0
		for (day = 0; day < 7; day++) {
			units = this._getDayHoursForMultiple(calendars, start);
			newCalendar.worktime.dates[day] = units;
			start = this.$gantt.date.add(start, 1, "day");
		}
		for (var i = 0; i < calendars.length; i++) {
			for (var value in calendars[i].worktime.dates) if (+value > 10000) {
				units = this._getDayHoursForMultiple(calendars, new Date(+value));
				newCalendar.worktime.dates[value] = units;
			}
		}
		return newCalendar;
	},

	_convertWorktimeSettings: function (settings) {
		var days = settings.days;
		if (days) {
			settings.dates = settings.dates || {};
			for (var i = 0; i < days.length; i++) {
				settings.dates[i] = days[i];
				if (!(days[i] instanceof Array)) {
					settings.dates[i] = !!days[i];
				}
			}
			delete settings.days;
		}
		return settings;
	},

	createCalendar: function (parentCalendar) {
		var settings;

		if (!parentCalendar) {
			parentCalendar = {};
		}

		if (parentCalendar.worktime) {
			settings = utils.copy(parentCalendar.worktime);
		} else {
			settings = utils.copy(parentCalendar);
		}

		var defaults = utils.copy(this.defaults.fulltime.worktime);
		utils.mixin(settings, defaults);

		var id = utils.uid();
		var calendar = {
			id: id + "",
			worktime: this._convertWorktimeSettings(settings)
		};

		var apiCore = new CalendarWorktimeStrategy(this.$gantt, createArgumentsHelper(this.$gantt));
		utils.mixin(apiCore, calendar);

		// validate/check if empty calendar
		if (!apiCore._tryChangeCalendarSettings(function () {
			})) {
			return null;
		} else {
			return apiCore;
		}
	},

	getCalendar: function (id) {
		id = id || "global";
		this.createDefaultCalendars();
		return this._calendars[id];
	},

	getCalendars: function () {
		var res = [];
		for (var i in this._calendars) {
			res.push(this.getCalendar(i));
		}
		return res;
	},

	getTaskCalendar: function (task) {
		var config = this.$gantt.$services.config();
		if (!task) {
			return this.getCalendar();
		} else if (task[config.calendar_property]) {
			return this.getCalendar(task[config.calendar_property]);
		} else if (config.resource_calendars) {

			for (var field in config.resource_calendars) {
				var resource = config.resource_calendars[field];
				if (task[field]) {
					var calendarId = resource[task[field]];
					if (calendarId) {
						return this.getCalendar(calendarId);
					}
				}
			}
		}

		return this.getCalendar();
	},

	addCalendar: function (calendar) { // puts new calendar to Global Storage - gantt.calendarManager._calendars {}
		if (!(calendar instanceof CalendarWorktimeStrategy)) {
			var id = calendar.id;
			calendar = this.createCalendar(calendar);
			calendar.id = id;
		}
		var config = this.$gantt.$services.config();

		calendar.id = calendar.id || utils.uid();
		this._calendars[calendar.id] = calendar;
		if (!config.worktimes)
			config.worktimes = {};
		config.worktimes[calendar.id] = calendar.worktime;
		return calendar.id;
	},

	deleteCalendar: function (calendar) {
		var config = this.$gantt.$services.config();
		if (!calendar) return false;
		if (this._calendars[calendar]) {
			delete this._calendars[calendar];
			if (config.worktimes && config.worktimes[calendar])
				delete config.worktimes[calendar];
			return true;
		} else {
			return false;
		}	},

	restoreConfigCalendars: function (configs) {
		for (var i in configs) {
			if (this._calendars[i])
				continue;

			var settings = configs[i];
			var calendar = this.createCalendar(settings);
			calendar.id = i;
			this.addCalendar(calendar);
		}
	},

	defaults: {
		global: {
			id: "global",
			worktime: {
				hours: [8, 17],
				days: [0, 1, 1, 1, 1, 1, 0]
			}
		},
		fulltime: {
			id: "fulltime",
			worktime: {
				hours: [0, 24],
				days: [1, 1, 1, 1, 1, 1, 1]
			}
		}
	},

	createDefaultCalendars: function () {
		var config = this.$gantt.$services.config();
		this.restoreConfigCalendars(this.defaults);
		this.restoreConfigCalendars(config.worktimes);
	}
};

module.exports = CalendarManager;

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

var Cache = __webpack_require__(75),
	utils = __webpack_require__(0);

function CalendarWorkTimeStrategy(gantt, argumentsHelper){
	this.argumentsHelper = argumentsHelper;
	this.$gantt = gantt;
	this._workingUnitsCache = new Cache();
}

CalendarWorkTimeStrategy.prototype = {
	units: [
		"year",
		"month",
		"week",
		"day",
		"hour",
		"minute"
	],
	// cache previously calculated worktime
	_getUnitOrder: function (unit) {
		for (var i = 0, len = this.units.length; i < len; i++) {
			if (this.units[i] == unit)
				return i;
		}
	},
	_timestamp: function (settings) {

		var timestamp = null;
		if ((settings.day || settings.day === 0)) {
			timestamp = settings.day;
		} else if (settings.date) {
			// store worktime datestamp in utc so it could be recognized in different timezones (e.g. opened locally and sent to the export service in different timezone)
			timestamp = Date.UTC(settings.date.getFullYear(), settings.date.getMonth(), settings.date.getDate());
		}
		return timestamp;
	},
	_checkIfWorkingUnit: function (date, unit, order) {
		if (order === undefined) {
			order = this._getUnitOrder(unit);
		}

		// disable worktime check for custom time units
		if (order === undefined) {
			return true;
		}
		if (order) {
			//check if bigger time unit is a work time (hour < day < month...)
			//i.e. don't check particular hour if the whole day is marked as not working
			if (!this._isWorkTime(date, this.units[order - 1], order - 1))
				return false;
		}
		if (!this["_is_work_" + unit])
			return true;
		return this["_is_work_" + unit](date);
	},
	//checkings for particular time units
	//methods for month-year-week can be defined, otherwise always return 'true'
	_is_work_day: function (date) {
		var val = this._getWorkHours(date);

		if (val instanceof Array) {
			return val.length > 0;
		}
		return false;
	},
	_is_work_hour: function (date) {
		var hours = this._getWorkHours(date); // [7,12] or []
		var hour = date.getHours();
		for (var i = 0; i < hours.length; i += 2) {
			if (hours[i + 1] === undefined) {
				return hours[i] == hour;
			} else {
				if (hour >= hours[i] && hour < hours[i + 1])
					return true;
			}
		}
		return false;
	},
	_internDatesPull: {},
	_nextDate: function (start, unit, step) {
		var dateHelper = this.$gantt.date;
		return dateHelper.add(start, step, unit);

		/*var start_value = +start,
			key = unit + "_" + step;
		var interned = this._internDatesPull[key];
		if(!interned){
			interned = this._internDatesPull[key] = {};
		}
		var calculated;
		if(!interned[start_value]){
			interned[start_value] = calculated = dateHelper.add(start, step, unit);
			//interned[start_value] = dateHelper.add(start, step, unit);
		}
		return calculated || interned[start_value];*/
	},
	_getWorkUnitsBetweenGeneric: function (from, to, unit, step) {
		var dateHelper = this.$gantt.date;
		var start = new Date(from),
			end = new Date(to);
		step = step || 1;
		var units = 0;


		var next = null;
		var stepStart,
			stepEnd;

		// calculating decimal durations, i.e. 2016-09-20 00:05:00 - 2016-09-20 01:00:00 ~ 0.95 instead of 1
		// and also  2016-09-20 00:00:00 - 2016-09-20 00:05:00 ~ 0.05 instead of 1
		// durations must be rounded later
		var checkFirst = false;
		stepStart = dateHelper[unit + "_start"](new Date(start));
		if (stepStart.valueOf() != start.valueOf()) {
			checkFirst = true;
		}
		var checkLast = false;
		stepEnd = dateHelper[unit + "_start"](new Date(to));
		if (stepEnd.valueOf() != to.valueOf()) {
			checkLast = true;
		}

		var isLastStep = false;
		while (start.valueOf() < end.valueOf()) {
			next = this._nextDate(start, unit, step);
			isLastStep = (next.valueOf() > end.valueOf());

			if (this._isWorkTime(start, unit)) {
				if (checkFirst || (checkLast && isLastStep)) {
					stepStart = dateHelper[unit + "_start"](new Date(start));
					stepEnd = dateHelper.add(stepStart, step, unit);
				}

				if (checkFirst) {
					checkFirst = false;
					next = this._nextDate(stepStart, unit, step);
					units += ((stepEnd.valueOf() - start.valueOf()) / (stepEnd.valueOf() - stepStart.valueOf()));
				} else if (checkLast && isLastStep) {
					checkLast = false;
					units += ((end.valueOf() - start.valueOf()) / (stepEnd.valueOf() - stepStart.valueOf()));

				} else {
					units++;
				}
			}
			start = next;
		}
		return units;
	},
	_getHoursPerDay: function (date) {
		var hours = this._getWorkHours(date);
		var res = 0;
		for (var i = 0; i < hours.length; i += 2) {
			res += ((hours[i + 1] - hours[i]) || 0);
		}
		return res;
	},
	_getWorkHoursForRange: function (from, to) {
		var hours = 0;
		var start = new Date(from),
			end = new Date(to);

		while (start.valueOf() < end.valueOf()) {
			if (this._isWorkTime(start, "day"))
				hours += this._getHoursPerDay(start);
			start = this._nextDate(start, "day", 1);
		}
		return hours;
	},
	_getWorkUnitsBetweenHours: function (from, to, unit, step) {
		var start = new Date(from),
			end = new Date(to);
		step = step || 1;

		var firstDayStart = new Date(start);
		var firstDayEnd = this.$gantt.date.add(this.$gantt.date.day_start(new Date(start)), 1, "day");

		if (end.valueOf() <= firstDayEnd.valueOf()) {
			return this._getWorkUnitsBetweenGeneric(from, to, unit, step);
		} else {

			var lastDayStart = this.$gantt.date.day_start(new Date(end));
			var lastDayEnd = end;

			var startPart = this._getWorkUnitsBetweenGeneric(firstDayStart, firstDayEnd, unit, step);
			var endPart = this._getWorkUnitsBetweenGeneric(lastDayStart, lastDayEnd, unit, step);

			var hourRange = this._getWorkHoursForRange(firstDayEnd, lastDayStart);
			hourRange = ((hourRange / step) + startPart + endPart);

			return hourRange;
		}
	},

	_getCalendar: function () {
		return this.worktime;
	},
	_setCalendar: function (settings) {
		this.worktime = settings;
	},

	_tryChangeCalendarSettings: function (payload) {
		var backup = JSON.stringify(this._getCalendar());
		payload();
		if (this._isEmptyCalendar(this._getCalendar())) {
			this.$gantt.assert(false, "Invalid calendar settings, no worktime available");
			this._setCalendar(JSON.parse(backup));
			this._workingUnitsCache.clear();
			return false;
		}
		return true;

	},

	_isEmptyCalendar: function (settings) {
		var result = false,
			datesArray = [],
			isFullWeekSet = true;
		for (var i in settings.dates) {
			result |= !!settings.dates[i];
			datesArray.push(i);
		}

		var checkFullArray = [];
		for (var i = 0; i < datesArray.length; i++) {
			if (datesArray[i] < 10) {
				checkFullArray.push(datesArray[i]);
			}
		}
		checkFullArray.sort();

		for (var i = 0; i < 7; i++) {
			if (checkFullArray[i] != i)
				isFullWeekSet = false;
		}
		if (isFullWeekSet)
			return !result;
		return !(result || !!settings.hours); // can still return false if separated dates are set to true
	},

	getWorkHours: function () {
		var config = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments);
		return this._getWorkHours(config.date);
	},
	_getWorkHours: function (date) {
		var t = this._timestamp({date: date});
		var hours = true;
		var calendar = this._getCalendar();
		if (calendar.dates[t] !== undefined) {
			hours = calendar.dates[t];//custom day
		} else if (calendar.dates[date.getDay()] !== undefined) {
			hours = calendar.dates[date.getDay()];//week day
		}
		if (hours === true) {
			return calendar.hours;
		} else if (hours) {
			return hours;
		}
		return [];
	},

	setWorkTime: function (settings) {
		return this._tryChangeCalendarSettings(utils.bind(function () {
			var hours = settings.hours !== undefined ? settings.hours : true;
			var timestamp = this._timestamp(settings);
			if (timestamp !== null) {
				this._getCalendar().dates[timestamp] = hours;
			} else {
				this._getCalendar().hours = hours;
			}
			this._workingUnitsCache.clear();
		}, this));
	},

	unsetWorkTime: function (settings) {
		return this._tryChangeCalendarSettings(utils.bind(function () {
			if (!settings) {
				this.reset_calendar();
			} else {

				var timestamp = this._timestamp(settings);

				if (timestamp !== null) {
					delete this._getCalendar().dates[timestamp];
				}
			}
			// Clear work units cache
			this._workingUnitsCache.clear();
		}, this));
	},

	_isWorkTime: function (date, unit, order) {
		//Check if this item has in the cache
		var is_work_unit = this._workingUnitsCache.get(unit, date);

		if (is_work_unit == -1) {
			// calculate if not cached
			is_work_unit = this._checkIfWorkingUnit(date, unit, order);
			this._workingUnitsCache.put(unit, date, is_work_unit);
		}

		return is_work_unit;
	},

	isWorkTime: function () {
		var config =  this.argumentsHelper.isWorkTimeArguments.apply( this.argumentsHelper, arguments);
		return this._isWorkTime(config.date, config.unit);
	},

	calculateDuration: function () {
		var config =  this.argumentsHelper.getDurationArguments.apply( this.argumentsHelper, arguments);

		if (!config.unit) {
			return false;
		}

		var res = 0;
		if (config.unit == "hour") {
			res = this._getWorkUnitsBetweenHours(config.start_date, config.end_date, config.unit, config.step);
		} else {
			res = this._getWorkUnitsBetweenGeneric(config.start_date, config.end_date, config.unit, config.step);
		}

		// getDuration.. returns decimal durations
		return Math.round(res);
	},
	hasDuration: function () {
		var config =  this.argumentsHelper.getDurationArguments.apply( this.argumentsHelper, arguments);

		var from = config.start_date,
			to = config.end_date,
			unit = config.unit,
			step = config.step;

		if (!unit) {
			return false;
		}
		var start = new Date(from),
			end = new Date(to);
		step = step || 1;

		while (start.valueOf() < end.valueOf()) {
			if (this._isWorkTime(start, unit))
				return true;
			start = this._nextDate(start, unit, step);
		}
		return false;
	},

	calculateEndDate: function () {
		var config =  this.argumentsHelper.calculateEndDateArguments.apply( this.argumentsHelper, arguments);

		var from = config.start_date,
			duration = config.duration,
			unit = config.unit,
			step = config.step;

		var mult = (config.duration >= 0) ? 1 : -1;
		return this._calculateEndDate(from, duration, unit, step * mult);
	},
	_calculateEndDate: function (from, duration, unit, step) {
		if (!unit)
			return false;

		var start = new Date(from),
			added = 0;
		step = step || 1;
		duration = Math.abs(duration * 1);

		while (added < duration) {
			var next = this._nextDate(start, unit, step);
			//if(this.isWorkTime(step > 0 ? start : next, unit))
			if (this._isWorkTime(step > 0 ? new Date(next.valueOf() - 1) : new Date(next.valueOf() + 1), unit))
				added++;
			start = next;
		}
		return start;
	},

	getClosestWorkTime: function () {
		var config =  this.argumentsHelper.getClosestWorkTimeArguments.apply( this.argumentsHelper, arguments);
		return this._getClosestWorkTime(config);
	},

	_getClosestWorkTime: function (settings) {
		if (this._isWorkTime(settings.date, settings.unit))
			return settings.date;

		var unit = settings.unit;

		var curr = this.$gantt.date[unit + '_start'](settings.date);

		var future_target = new Date(curr),
			prev_target = new Date(curr),
			tick = true,
			maximum_loop = 3000,//be extra sure we won't fall into infinite loop, 3k seems big enough
			count = 0,
			both_directins = (settings.dir == 'any' || !settings.dir);

		var inc = 1;
		if (settings.dir == 'past')
			inc = -1;

		//will seek closest working hour in future or in past, one step in one direction per iteration
		while (!this._isWorkTime(curr, unit)) {

			if (both_directins) {
				curr = tick ? future_target : prev_target;
				inc = inc * (-1);
			}
			var tzOffset = curr.getTimezoneOffset();
			curr = this.$gantt.date.add(curr, inc, unit);

			curr = this.$gantt._correct_dst_change(curr, tzOffset, inc, unit);
			if (this.$gantt.date[unit + '_start'])
				curr = this.$gantt.date[unit + '_start'](curr);

			if (both_directins) {
				if (tick) {
					future_target = curr;
				} else {
					prev_target = curr;
				}
			}
			tick = !tick;
			count++;
			if (count > maximum_loop) {
				this.$gantt.assert(false, "Invalid working time check");
				return false;
			}
		}

		if (curr == prev_target || settings.dir == 'past') {
			curr = this.$gantt.date.add(curr, 1, unit);
		}

		return curr;
	}
};

module.exports = CalendarWorkTimeStrategy;

/***/ }),
/* 75 */
/***/ (function(module, exports) {

function WorkUnitsCache() {
	this._cache = {};
}

WorkUnitsCache.prototype = {
	// cache previously calculated worktime
	get: function (unit, date) {
		var result = -1;// default value (if not existed in the cache)

		var cache = this._cache;
		if (cache && cache[unit]) {
			var units = cache[unit];
			var time = date.getTime();
			if (units[time] !== undefined)
				result = units[time];
		}
		return result;
	},

	put: function (unit, date, value) {
		if (!unit || !date) return false;

		var cache = this._cache;

		var time = date.getTime();

		value = !!value;

		if (!cache) return false;
		if (!cache[unit]) cache[unit] = {};
		cache[unit][time] = value;
		return true;
	},

	clear: function () {
		this._cache = {};
	}
};

module.exports = WorkUnitsCache;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var createArgumentsHelper = __webpack_require__(18),
	NoWorkTimeCalendar = __webpack_require__(77);

function TimeCalculator(calendarManager){

	this.$gantt = calendarManager.$gantt;
	this.argumentsHelper = createArgumentsHelper(this.$gantt);
	this.calendarManager = calendarManager;
	this.$disabledCalendar = new NoWorkTimeCalendar(this.$gantt, this.argumentsHelper);
}

TimeCalculator.prototype = {
	_getCalendar: function (config) {
		var calendar;
		if (!this.$gantt.$services.config().work_time) {
			calendar = this.$disabledCalendar;
		} else {
			var manager = this.calendarManager;
			if (config.task) {
				calendar = manager.getTaskCalendar(config.task);
			} else if (config.id) {
				calendar = manager.getTaskCalendar(config);
			} else if (config.calendar) {
				calendar = config.calendar;
			}
			if (!calendar) {
				calendar = manager.getTaskCalendar();
			}
		}
		return calendar;
	},

	getWorkHours: function (config) {
		config = this.argumentsHelper.getWorkHoursArguments.apply(this.argumentsHelper, arguments);

		var calendar = this._getCalendar(config);

		return calendar.getWorkHours(config.date);
	},

	setWorkTime: function (config, calendar) {
		config = this.argumentsHelper.setWorkTimeArguments.apply(this.argumentsHelper, arguments);

		if (!calendar)
			calendar = this.calendarManager.getCalendar(); // Global
		return calendar.setWorkTime(config);
	},

	unsetWorkTime: function (config, calendar) {
		config = this.argumentsHelper.unsetWorkTimeArguments.apply(this.argumentsHelper, arguments);

		if (!calendar)
			calendar = this.calendarManager.getCalendar(); // Global
		return calendar.unsetWorkTime(config);
	},
	isWorkTime: function (date, unit, task, calendar) {
		var config = this.argumentsHelper.isWorkTimeArguments.apply(this.argumentsHelper, arguments);

		calendar = this._getCalendar(config);
		return calendar.isWorkTime(config);
	},
	getClosestWorkTime: function (config) {
		config = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments);

		var calendar = this._getCalendar(config);

		return calendar.getClosestWorkTime(config);
	},

	calculateDuration: function () { // start_date_date, end_date, task
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);


		var calendar = this._getCalendar(config);
		return calendar.calculateDuration(config);
	},
	hasDuration: function () {
		var config = this.argumentsHelper.hasDurationArguments.apply(this.argumentsHelper, arguments);

		var calendar = this._getCalendar(config);

		return calendar.hasDuration(config);
	},
	calculateEndDate: function (config) { // start_date, duration, unit, task
		var config = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments);

		var calendar = this._getCalendar(config);
		return calendar.calculateEndDate(config);
	}
};

module.exports = TimeCalculator;



/***/ }),
/* 77 */
/***/ (function(module, exports) {

function CalendarDisabledTimeStrategy(gantt, argumentsHelper){
	this.argumentsHelper = argumentsHelper;
	this.$gantt = gantt;
}

CalendarDisabledTimeStrategy.prototype = {
	getWorkHours: function () {
		return [0, 24];
	},
	setWorkTime: function () {
		return true;
	},
	unsetWorkTime: function () {
		return true;
	},
	isWorkTime: function () {
		return true;
	},
	getClosestWorkTime: function (config) {
		var config = this.argumentsHelper.getClosestWorkTimeArguments.apply(this.argumentsHelper, arguments);
		return config.date;
	},

	calculateDuration: function () {
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
		var from = config.start_date,
			to = config.end_date,
			unit = config.unit,
			step = config.step;

		return this._calculateDuration(from, to, unit, step);
	},
	_calculateDuration: function (start, end, unit, step) {
		var dateHelper = this.$gantt.date;
		var fixedUnits = {
			"week": 1000 * 60 * 60 * 24 * 7,
			"day": 1000 * 60 * 60 * 24,
			"hour": 1000 * 60 * 60,
			"minute": 1000 * 60
		};

		var res = 0;
		if (fixedUnits[unit]) {
			res = Math.round((end - start) / (step * fixedUnits[unit]));
		} else {
			var from = new Date(start),
				to = new Date(end);
			while (from.valueOf() < to.valueOf()) {
				res += 1;
				from = dateHelper.add(from, step, unit);
			}

			if (from.valueOf() != end.valueOf()) {
				res += (to - from) / (dateHelper.add(from, step, unit) - from);
			}
		}

		return Math.round(res);
	},

	hasDuration: function () {
		var config = this.argumentsHelper.getDurationArguments.apply(this.argumentsHelper, arguments);
		var from = config.start_date,
			to = config.end_date,
			unit = config.unit,
			step = config.step;

		if (!unit) {
			return false;
		}
		from = new Date(from);
		to = new Date(to);

		return (from.valueOf() < to.valueOf());
	},

	calculateEndDate: function () {
		var config = this.argumentsHelper.calculateEndDateArguments.apply(this.argumentsHelper, arguments);

		var start = config.start_date,
			duration = config.duration,
			unit = config.unit,
			step = config.step;

		return this.$gantt.date.add(start, step * duration, unit);
	}
};

module.exports = CalendarDisabledTimeStrategy;

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

// TODO: rework public api for date methods
var utils = __webpack_require__(0);

var createWorktimeFacade = function(calendarManager, timeCalculator){
	return {
		getWorkHours: function (date) {
			return timeCalculator.getWorkHours(date);
		},

		setWorkTime: function (config) {
			return timeCalculator.setWorkTime(config);
		},

		unsetWorkTime: function (config) {
			timeCalculator.unsetWorkTime(config);
		},

		isWorkTime: function (date, unit, task) {
			return timeCalculator.isWorkTime(date, unit, task);
		},

		getClosestWorkTime: function (config) {
			return timeCalculator.getClosestWorkTime(config);
		},

		calculateDuration: function (start_date, end_date, task) {
			return timeCalculator.calculateDuration(start_date, end_date, task);
		},
		_hasDuration: function (start_date, end_date, task) {
			return timeCalculator.hasDuration(start_date, end_date, task);
		},

		calculateEndDate: function (start, duration, unit, task) {
			return timeCalculator.calculateEndDate(start, duration, unit, task);
		},

		createCalendar: utils.bind(calendarManager.createCalendar, calendarManager),
		addCalendar: utils.bind(calendarManager.addCalendar, calendarManager),
		getCalendar: utils.bind(calendarManager.getCalendar, calendarManager),
		getCalendars: utils.bind(calendarManager.getCalendars, calendarManager),
		getTaskCalendar: utils.bind(calendarManager.getTaskCalendar, calendarManager),
		deleteCalendar: utils.bind(calendarManager.deleteCalendar, calendarManager)
	};
};


module.exports = { create: createWorktimeFacade };


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var dateHelper = __webpack_require__(3);

module.exports = function(gantt) {

	gantt.isUnscheduledTask = function (task) {
		return (!!task.unscheduled || !task.start_date);
	};

	gantt._isAllowedUnscheduledTask = function (task) {
		return !!(task.unscheduled && gantt.config.show_unscheduled);
	};

	gantt.isTaskVisible = function (id) {
		if (!this.isTaskExists(id))
			return false;

		var task = this.getTask(id),
			type = this.getTaskType(task.type);

		if (!((+task.start_date <= +this._max_date && +task.end_date >= +this._min_date) || gantt._isAllowedUnscheduledTask(task))){
			return false;
		}

		return !!(gantt.getGlobalTaskIndex(id) >= 0);
	};

	gantt._defaultTaskDate = function (item, parent_id) {
		var parent = (parent_id && parent_id != this.config.root_id) ? this.getTask(parent_id) : false,
			startDate = '';
		if (parent) {
			startDate = parent.start_date;
		} else {
			var first = this.getTaskByIndex(0);
			startDate = first ? (first.start_date ? first.start_date : (first.end_date ? this.calculateEndDate({
				start_date: first.end_date,
				duration: -this.config.duration_step
			}) : '')) : this.config.start_date || this.getState().min_date;
		}
		gantt.assert(startDate, "Invalid dates");
		return new Date(startDate);
	};

	gantt._set_default_task_timing = function (task) {
		task.start_date = task.start_date || gantt._defaultTaskDate(task, this.getParent(task));
		task.duration = task.duration || this.config.duration_step;
		task.end_date = task.end_date || this.calculateEndDate(task);
	};

	gantt.createTask = function (item, parent, index) {
		item = item || {};
		if (!gantt.defined(item.id))
			item.id = gantt.uid();

		if (!item.start_date) {
			item.start_date = gantt._defaultTaskDate(item, parent);
		}
		if (item.text === undefined) {
			item.text = gantt.locale.labels.new_task;
		}
		if (item.duration === undefined) {
			item.duration = 1;
		}

		if (parent) {
			this.setParent(item, parent);
			var parentObj = this.getTask(parent);
			parentObj.$open = true;
		}

		if (!this.callEvent("onTaskCreated", [item])) {
			return null;
		}
		if (this.config.details_on_create) {
			item.$new = true;
			this.silent(function(){
				gantt.$data.tasksStore.addItem(item, index);
			});
			this.selectTask(item.id);
			this.refreshData();
			this.showLightbox(item.id);
		} else {
			if (this.addTask(item, parent, index)) {
				this.showTask(item.id);
				this.selectTask(item.id);
			}
		}
		return item.id;
	};

//TODO: do something with overcomplicated dataprocessor logic
	gantt._getChildLinks = function (id) {
		var item = this.getTask(id);
		if (!item) {
			return [];
		}

		var links = item.$source.concat(item.$target);

		var branches = this.getChildren(item.id);
		for (var i = 0; i < branches.length; i++) {
			links = links.concat(this._getChildLinks(branches[i]));
		}

		var res = {};
		for (var i = 0; i < links.length; i++) {
			res[links[i]] = true;
		}
		links = [];
		for (var i in res) {
			if (this.isLinkExists(i))
				links.push(i);
		}

		return links;
	};
	gantt._getTaskTree = function (id) {
		var item = this.getTask(id);
		if (!item) {
			return [];
		}

		var items = [];
		var branches = this.getChildren(item.id);
		for (var i = 0; i < branches.length; i++) {
			items.push(branches[i]);
			items = items.concat(this._getTaskTree(branches[i]));
		}
		return items;
	};
	gantt._deleteRelatedLinks = function (links, silent) {
		var use_dp = (this._dp && !silent) && this.config.cascade_delete;
		var prev_mode = '';
		var send_changes = use_dp ? this._dp.updateMode != 'off' : false;
		if (use_dp) {
			prev_mode = this._dp.updateMode;
			this._dp.setUpdateMode("off");
		}
		for (var i = 0; i < links.length; i++) {
			if (use_dp) {
				this._dp.setGanttMode("links");
				this._dp.setUpdated(links[i], true, "deleted");
			}
		}

		this.$data.linksStore.silent(function(){
			for(var i =0; i < links.length; i++) {
				this.$data.linksStore.removeItem(links[i]);
			}
		}, this);

		if (use_dp) {
			this._dp.setUpdateMode(prev_mode);
			if (send_changes)
				this._dp.sendAllData();
		}
	};
	gantt._deleteRelatedTasks = function (id, silent) {
		var use_dp = (this._dp && !silent) && this.config.cascade_delete;
		var prev_mode = '';

		if (use_dp) {
			prev_mode = this._dp.updateMode;
			this._dp.setGanttMode("tasks");
			this._dp.setUpdateMode("off");
		}
		var tree = this._getTaskTree(id);
		for (var i = 0; i < tree.length; i++) {
			// add deleted subrow into dataprocessor update list manually
			// because silent mode is on
			var t_id = tree[i];

			this.$data.tasksStore.silent(function(){
				this.$data.tasksStore.removeItem(t_id);
			});

			if (use_dp) {
				this._dp.setUpdated(t_id, true, "deleted");
			}
		}
		if (use_dp) {

			this._dp.setUpdateMode(prev_mode);
		}
	};



	gantt._update_flags = function (oldid, newid) {
		//  TODO: need a proper way to update all possible flags
		if (oldid === undefined) {
			this._lightbox_id = this._selected_task = null;
			if (this._tasks_dnd && this._tasks_dnd.drag) {
				this._tasks_dnd.drag.id = null;
			}
		} else {
			if (this._lightbox_id == oldid)
				this._lightbox_id = newid;
			if (this._selected_task == oldid) {
				this._selected_task = newid;
			}
			if (this._tasks_dnd && this._tasks_dnd.drag && this._tasks_dnd.drag.id == oldid) {
				this._tasks_dnd.drag.id = newid;
			}
		}
	};


	gantt._get_duration_unit = function () {
		return (gantt._get_line(this.config.duration_unit) * 1000) || this.config.duration_unit;
	};

	gantt.getTaskType = function (type) {
		return "task";
	};
	gantt._get_type_name = function (type_value) {
		for (var i in this.config.types) {
			if (this.config.types[i] == type_value) {
				return i;
			}
		}
		return "task";
	};

	gantt._get_task_timing_mode = function (task, force) {
		var task_type = this.getTaskType(task.type);

		var state = {
			type: task_type,
			$no_start: false,
			$no_end: false
		};

		if (!force && task_type == task.$rendered_type) {
			state.$no_start = task.$no_start;
			state.$no_end = task.$no_end;
			return state;
		}

		if (task_type == this.config.types.project) {
			//project duration is always defined by children duration
			state.$no_end = state.$no_start = true;
		} else if (task_type != this.config.types.milestone) {
			//tasks can have fixed duration, children duration(as projects), or one date fixed, and other defined by nested items
			state.$no_end = !(task.end_date || task.duration);
			state.$no_start = !task.start_date;

			if (this._isAllowedUnscheduledTask(task)) {
				state.$no_end = state.$no_start = false;
			}
		}

		return state;
	};

	gantt._init_task_timing = function (task) {
		var task_mode = gantt._get_task_timing_mode(task, true);

		var dirty = task.$rendered_type != task_mode.type;

		var task_type = task_mode.type;

		if (dirty) {
			task.$no_start = task_mode.$no_start;
			task.$no_end = task_mode.$no_end;
			task.$rendered_type = task_mode.type;
		}

		if (dirty && task_type != this.config.types.milestone) {
			if (task_type == this.config.types.project) {
				//project duration is always defined by children duration
				this._set_default_task_timing(task);
			}
		}

		if (task_type == this.config.types.milestone) {
			task.end_date = task.start_date;
		}
		if (task.start_date && task.end_date) {
			task.duration = this.calculateDuration(task);
		}
		task.duration = task.duration || 0;
	};

	gantt.isSummaryTask = function (task) {
		var mode = gantt._get_task_timing_mode(task);

		return !!(mode.$no_end || mode.$no_start);
	};

// downward calculation of project duration
	gantt.resetProjectDates = function (task) {
		var taskMode = this._get_task_timing_mode(task);
		if (taskMode.$no_end || taskMode.$no_start) {
			var dates = this.getSubtaskDates(task.id);
			this._assign_project_dates(task, dates.start_date, dates.end_date);
		}
	};

	gantt.getSubtaskDates = function (task_id) {
		var min = null,
			max = null,
			root = task_id !== undefined ? task_id : gantt.config.root_id;

		this.eachTask(function (child) {
			if (this.getTaskType(child.type) == gantt.config.types.project || this.isUnscheduledTask(child))
				return;

			if ((child.start_date && !child.$no_start) && (!min || min > child.start_date.valueOf()))
				min = child.start_date.valueOf();
			if ((child.end_date && !child.$no_end) && (!max || max < child.end_date.valueOf()))
				max = child.end_date.valueOf();
		}, root);

		return {
			start_date: min ? new Date(min) : null,
			end_date: max ? new Date(max) : null
		};
	};

	gantt._assign_project_dates = function (task, from, to) {
		var taskTiming = this._get_task_timing_mode(task);
		if (taskTiming.$no_start) {
			if (from && from != Infinity) {
				task.start_date = new Date(from);
			} else {
				task.start_date = this._defaultTaskDate(task, this.getParent(task));
			}
		}

		if (taskTiming.$no_end) {
			if (to && to != -Infinity) {
				task.end_date = new Date(to);
			} else {
				task.end_date = this.calculateEndDate({
					start_date: task.start_date,
					duration: this.config.duration_step,
					task: task
				});
			}
		}
		if (taskTiming.$no_start || taskTiming.$no_end) {
			this._init_task_timing(task);
		}
	};

// upward calculation of project duration
	gantt._update_parents = function (taskId, silent) {
		if (!taskId) return;

		var task = this.getTask(taskId);
		var pid = this.getParent(task);

		var taskTiming = this._get_task_timing_mode(task);

		var has_changed = true;

		if (taskTiming.$no_start || taskTiming.$no_end) {
			var oldStart = task.start_date.valueOf(),
				oldEnd = task.end_date.valueOf();

			gantt.resetProjectDates(task);

			// not refresh parent projects if dates hasn't changed
			if (oldStart == task.start_date.valueOf() && oldEnd == task.end_date.valueOf()) {
				has_changed = false;
			}

			if (has_changed && !silent) {
				this.refreshTask(task.id, true);
			}
		}


		if (has_changed && pid && this.isTaskExists(pid)) {
			this._update_parents(pid, silent);
		}
	};

	gantt.roundDate = function (config) {
		if (dateHelper.isDate(config)) {
			config = {
				date: config,
				unit: gantt.getScale().unit,
				step: gantt.getScale().step
			};
		}
		var date = config.date,
			steps = config.step,
			unit = config.unit;

		var upper, lower, colIndex;
		if (unit == gantt.getScale().unit && steps == gantt.getScale().step &&
			+date >= +gantt._min_date && +date <= +gantt._max_date) {
			//find date in time scale config
			colIndex = Math.floor(gantt.columnIndexByDate(date));

			if (!gantt.getScale().trace_x[colIndex]) {
				colIndex -= 1;// end of time scale
			}
			lower = new Date(gantt.getScale().trace_x[colIndex]);

			upper = new Date(lower);
			if (gantt.getScale().trace_x[colIndex + 1]) {
				upper = new Date(gantt.getScale().trace_x[colIndex + 1]);
			} else {
				upper = gantt.date.add(lower, steps, unit);
			}
		} else {
			colIndex = Math.floor(gantt.columnIndexByDate(date));

			upper = gantt.date[unit + "_start"](new Date(this._min_date));
			if (gantt.getScale().trace_x[colIndex]) {
				upper = gantt.date[unit + "_start"](gantt.getScale().trace_x[colIndex]);// end of time scale
			}

			while (+upper < +date) {
				upper = gantt.date[unit + "_start"](gantt.date.add(upper, steps, unit));

				var tzOffset = upper.getTimezoneOffset();

				upper = gantt._correct_dst_change(upper, tzOffset, upper, unit);
				if (gantt.date[unit + '_start'])
					upper = gantt.date[unit + '_start'](upper);
			}

			lower = gantt.date.add(upper, -1 * steps, unit);

		}
		if (config.dir && config.dir == 'future')
			return upper;
		if (config.dir && config.dir == 'past')
			return lower;

		if (Math.abs(date - lower) < Math.abs(upper - date)) {
			return lower;
		} else {
			return upper;
		}

	};

	gantt.correctTaskWorkTime = function (task) {
		if (gantt.config.work_time && gantt.config.correct_work_time) {
			if (!this.isWorkTime(task.start_date, undefined, task)) {
				task.start_date = this.getClosestWorkTime({date: task.start_date, dir: 'future', task: task});
				task.end_date = this.calculateEndDate(task);
			} else if (!this.isWorkTime(new Date(+task.end_date - 1), undefined, task)) {
				task.end_date = this.calculateEndDate(task);
			}
		}
	};

	gantt.attachEvent("onBeforeTaskUpdate", function (id, task) {
		gantt._init_task_timing(task);
		return true;
	});
	gantt.attachEvent("onBeforeTaskAdd", function (id, task) {
		gantt._init_task_timing(task);
		return true;
	});

	gantt.sort = function(field, desc, parent, silent) {
		var render = !silent;//4th argument to cancel redraw after sorting

		if (!this.isTaskExists(parent)) {
			parent = this.config.root_id;
		}

		if (!field) field = "order";
		var criteria = (typeof(field) == "string") ? (function(a, b) {
			if(a[field] == b[field]){
				return 0;
			}

			var result = a[field] > b[field];
			return result ? 1 : -1;
		}) : field;

		if (desc) {
			var original_criteria = criteria;
			criteria = function (a, b) {
				return original_criteria(b, a);
			};
		}

		var els = this.getChildren(parent);
		if (els){
			var temp = [];
			for (var i = els.length - 1; i >= 0; i--)
				temp[i] = this.getTask(els[i]);

			temp.sort(criteria);

			for (var i = 0; i < temp.length; i++) {
				els[i] = temp[i].id;
				this.sort(field, desc, els[i], true);
			}
		}

		if (render) {
			this.render();
		}
	};

	gantt._isTask = function (task) {
		var taskTiming = this._get_task_timing_mode(task);
		return (!task.type || task.type != gantt.config.types.project) && !(taskTiming.$no_start || taskTiming.$no_end);
	};

	gantt._isProject = function (task) {
		return !this._isTask(task);
	};

};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function(gantt) {
	var domHelpers = __webpack_require__(1);

	gantt._lightbox_methods = {};
	gantt._lightbox_template = "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>";


	//TODO: gantt._lightbox_id is changed from data.js and accessed from autoscheduling, check if it can be removed from gantt object
	var state = gantt.$services.getService("state");
	state.registerProvider("lightbox", function(){
		return {
			lightbox: gantt._lightbox_id
		};
	});

	gantt.showLightbox = function (id) {
		if (!id || gantt.isReadonly(this.getTask(id))) return;
		if (!this.callEvent("onBeforeLightbox", [id])) return;

		var task = this.getTask(id);

		var box = this.getLightbox(this.getTaskType(task.type));
		this._center_lightbox(box);
		this.showCover();
		this._fill_lightbox(id, box);

		this._waiAria.lightboxVisibleAttr(box);

		this.callEvent("onLightbox", [id]);
	};
	gantt._get_timepicker_step = function () {
		if (this.config.round_dnd_dates) {
			var scale = gantt.getScale(),
				step = (this._get_line(scale.unit) * scale.step) / 60;//timepicker step is measured in minutes
			if (step >= 60 * 24 || !this._is_chart_visible()) {
				step = this.config.time_step;
			}
			return step;
		}
		return this.config.time_step;
	};
	gantt.getLabel = function (property, key) {
		var sections = this._get_typed_lightbox_config();
		for (var i = 0; i < sections.length; i++) {
			if (sections[i].map_to == property) {
				var options = sections[i].options;
				for (var j = 0; j < options.length; j++) {
					if (options[j].key == key) {
						return options[j].label;
					}
				}
			}
		}
		return "";
	};

	gantt.updateCollection = function (list_name, collection) {
		collection = collection.slice(0);
		var list = gantt.serverList(list_name);
		if (!list) return false;
		list.splice(0, list.length);
		list.push.apply(list, collection || []);
		gantt.resetLightbox();
	};
	gantt.getLightboxType = function () {
		return this.getTaskType(this._lightbox_type);
	};
	gantt.getLightbox = function (type) {
		if (type === undefined)
			type = this.getLightboxType();

		if (!this._lightbox || this.getLightboxType() != this.getTaskType(type)) {
			this._lightbox_type = this.getTaskType(type);
			var d = document.createElement("DIV");
			d.className = "gantt_cal_light";

			var full_width = this._is_lightbox_timepicker();
			if (gantt.config.wide_form || full_width)
				d.className += " gantt_cal_light_wide";

			if (full_width) {
				gantt.config.wide_form = true;
				d.className += " gantt_cal_light_full";
			}


			d.style.visibility = "hidden";

			var html = this._lightbox_template;

			var ariaAttr;
			var buttons = this.config.buttons_left;
			for (var i = 0; i < buttons.length; i++) {
				// needed to migrate from 'dhx_something' to 'gantt_something' naming in a lightbox
				var button = this.config._migrate_buttons[buttons[i]] ? this.config._migrate_buttons[buttons[i]] : buttons[i];

				ariaAttr = this._waiAria.lightboxButtonAttrString(button);
				html += "<div " + ariaAttr + " class='gantt_btn_set gantt_left_btn_set " + button + "_set'><div dhx_button='1' class='" + button + "'></div><div>" + this.locale.labels[button] + "</div></div>";

			}
			buttons = this.config.buttons_right;
			for (var i = 0; i < buttons.length; i++) {
				var button = this.config._migrate_buttons[buttons[i]] ? this.config._migrate_buttons[buttons[i]] : buttons[i];
				ariaAttr = this._waiAria.lightboxButtonAttrString(button);

				html += "<div " + ariaAttr + " class='gantt_btn_set gantt_right_btn_set " + button + "_set' style='float:right;'><div dhx_button='1' class='" + button + "'></div><div>" + this.locale.labels[button] + "</div></div>";

			}
			html += "</div>";
			d.innerHTML = html;

			gantt._waiAria.lightboxAttr(d);

			if (gantt.config.drag_lightbox) {
				d.firstChild.onmousedown = gantt._ready_to_dnd;
				d.firstChild.onselectstart = function () {
					return false;
				};
				d.firstChild.style.cursor = "pointer";
				gantt._init_dnd_events();

			}

			document.body.insertBefore(d, document.body.firstChild);
			this._lightbox = d;

			var sns = this._get_typed_lightbox_config(type);
			html = this._render_sections(sns);

			var ds = d.getElementsByTagName("div");
			for (var i = 0; i < ds.length; i++) {
				var t_ds = ds[i];
				if (t_ds.className == "gantt_cal_larea") {
					t_ds.innerHTML = html;
					break;
				}
			}

			// bind labels to lightbox inputs
			for (var i = 0; i < sns.length; i++) {
				var section = sns[i];
				if (!section.id || !document.getElementById(section.id))
					continue;

				var labelBlock = document.getElementById(section.id);
				var label = labelBlock.querySelector("label");
				var inputBlock = labelBlock.nextSibling;
				if (!inputBlock)
					continue;

				var input = inputBlock.querySelector("input, select, textarea");
				if (input) {
					section.inputId = input.id || "input_" + gantt.uid();
					if (!input.id)
						input.id = section.inputId;

					label.setAttribute("for", section.inputId);
				}
			}

			//sizes
			this.resizeLightbox();

			this._init_lightbox_events(this);
			d.style.display = "none";
			d.style.visibility = "visible";
		}
		return this._lightbox;
	};

	gantt._render_sections = function (sns) {
		var html = "";
		for (var i = 0; i < sns.length; i++) {
			var block = this.form_blocks[sns[i].type];
			if (!block) continue; //ignore incorrect blocks
			sns[i].id = "area_" + this.uid();

			var display = sns[i].hidden ? " style='display:none'" : "";
			var button = "";
			if (sns[i].button) {
				button = "<div class='gantt_custom_button' index='" + i + "'><div class='gantt_custom_button_" + sns[i].button + "'></div><div class='gantt_custom_button_label'>" + this.locale.labels["button_" + sns[i].button] + "</div></div>";
			}
			if (this.config.wide_form) {
				html += "<div class='gantt_wrap_section' " + display + ">";
			}
			html += "<div id='" + sns[i].id + "' class='gantt_cal_lsection'><label>" + button + this.locale.labels["section_" + sns[i].name] + "</label></div>" + block.render.call(this, sns[i]);
			html += "</div>";
		}
		return html;
	};


	gantt.resizeLightbox = function () {
		var d = this._lightbox;
		if (!d) return;

		var con = d.childNodes[1];
		con.style.height = "0px";
		con.style.height = con.scrollHeight + "px";
		d.style.height = con.scrollHeight + this.config.lightbox_additional_height + "px";
		con.style.height = con.scrollHeight + "px"; //it is incredible , how ugly IE can be


	};

	gantt._center_lightbox = function (box) {
		if (box) {
			box.style.display = "block";

			var scroll_top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
			var scroll_left = window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft;

			var view_height = window.innerHeight || document.documentElement.clientHeight;

			if (scroll_top) // if vertical scroll on window
				box.style.top = Math.round(scroll_top + Math.max((view_height - box.offsetHeight) / 2, 0)) + "px";
			else // vertical scroll on body
				box.style.top = Math.round(Math.max(((view_height - box.offsetHeight) / 2), 0) + 9) + "px"; // +9 for compatibility with auto tests

			// not quite accurate but used for compatibility reasons
			if (document.documentElement.scrollWidth > document.body.offsetWidth) // if horizontal scroll on the window
				box.style.left = Math.round(scroll_left + (document.body.offsetWidth - box.offsetWidth) / 2) + "px";
			else // horizontal scroll on the body
				box.style.left = Math.round((document.body.offsetWidth - box.offsetWidth) / 2) + "px";
		}
	};
	gantt.showCover = function () {
		if (this._cover) return;

		this._cover = document.createElement("DIV");
		this._cover.className = "gantt_cal_cover";
		var _document_height = ((document.height !== undefined) ? document.height : document.body.offsetHeight);
		var _scroll_height = ((document.documentElement) ? document.documentElement.scrollHeight : 0);
		this._cover.style.height = Math.max(_document_height, _scroll_height) + 'px';
		document.body.appendChild(this._cover);
	};


	gantt._init_lightbox_events = function () {
		gantt.lightbox_events = {};


		gantt.lightbox_events["gantt_save_btn"] = function (e) {
			gantt._save_lightbox();
		};


		gantt.lightbox_events["gantt_delete_btn"] = function (e) {
			if (!gantt.callEvent("onLightboxDelete", [gantt._lightbox_id]))
				return;

			if (gantt.isTaskExists(gantt._lightbox_id)) {
				gantt.$click.buttons["delete"](gantt._lightbox_id);
			} else {
				gantt.hideLightbox();
			}

		};


		gantt.lightbox_events["gantt_cancel_btn"] = function (e) {
			gantt._cancel_lightbox();
		};


		gantt.lightbox_events["default"] = function (e, src) {
			if (src.getAttribute("dhx_button")) {
				gantt.callEvent("onLightboxButton", [src.className, src, e]);
			} else {
				var index, block, sec;

				var className = domHelpers.getClassName(src);
				if (className.indexOf("gantt_custom_button") != -1) {
					if (className.indexOf("gantt_custom_button_") != -1) {
						index = src.parentNode.getAttribute("index");
						sec = src;
						while (sec && domHelpers.getClassName(sec).indexOf("gantt_cal_lsection") == -1) {
							sec = sec.parentNode;
						}
					} else {
						index = src.getAttribute("index");
						sec = src.parentNode;
						src = src.firstChild;
					}
				}

				var sections = gantt._get_typed_lightbox_config();

				if (index) {
					index = index * 1;
					block = gantt.form_blocks[sections[index * 1].type];
					block.button_click(index, src, sec, sec.nextSibling);
				}
			}
		};
		this.event(gantt.getLightbox(), "click", function (e) {
			e = e || window.event;
			var src = e.target ? e.target : e.srcElement;

			var className = domHelpers.getClassName(src);
			if (!className) {
				src = src.previousSibling;
				className = domHelpers.getClassName(src);
			}
			if (src && className && className.indexOf("gantt_btn_set") === 0) {
				src = src.firstChild;
				className = domHelpers.getClassName(src);
			}
			if (src && className) {
				var func = gantt.defined(gantt.lightbox_events[src.className]) ? gantt.lightbox_events[src.className] : gantt.lightbox_events["default"];
				return func(e, src);
			}
			return false;
		});

		gantt.getLightbox().onkeydown = function (e) {
			var event = e || window.event;
			var target = e.target || e.srcElement;
			var buttonTarget = !!(domHelpers.getClassName(target).indexOf("gantt_btn_set") > -1);

			switch ((e || event).keyCode) {
				case 32: {//space
					if ((e || event).shiftKey) return;
					if (buttonTarget && target.click) {
						target.click();
					}
					break;
				}
				case gantt.keys.edit_save:
					if ((e || event).shiftKey) return;
					if (buttonTarget && target.click) {
						target.click();
					} else {
						gantt._save_lightbox();
					}
					break;
				case gantt.keys.edit_cancel:
					gantt._cancel_lightbox();
					break;
				default:
					break;
			}
		};
	};

	gantt._cancel_lightbox = function () {
		var task = this.getLightboxValues();
		this.callEvent("onLightboxCancel", [this._lightbox_id, task.$new]);
		if (gantt.isTaskExists(task.id) && task.$new) {
			this.silent(function(){
				gantt.$data.tasksStore.removeItem(task.id);
				gantt._update_flags(task.id, null);
			});
		}

		this.refreshData();
		this.hideLightbox();
	};

	gantt._save_lightbox = function () {
		var task = this.getLightboxValues();
		if (!this.callEvent("onLightboxSave", [this._lightbox_id, task, !!task.$new]))
			return;

		if (task.$new) {
			delete task.$new;
			this.addTask(task);
		}else if(this.isTaskExists(task.id)){
			this.mixin(this.getTask(task.id), task, true);
			this.refreshTask(task.id);
			this.updateTask(task.id);
		}
		this.refreshData();

		// TODO: do we need any blockable events here to prevent closing lightbox?
		this.hideLightbox();
	};

	gantt._resolve_default_mapping = function (section) {
		var mapping = section.map_to;
		var time_controls = {"time": true, "time_optional": true, "duration": true, "duration_optional": true};
		if (time_controls[section.type]) {
			if (section.map_to == 'auto') {
				mapping = {start_date: "start_date", end_date: "end_date", duration: "duration"};
			} else if (typeof(section.map_to) === "string") {
				mapping = {start_date: section.map_to};
			}
		}

		return mapping;
	};

	gantt.getLightboxValues = function () {
		var task = {};

		if (gantt.isTaskExists(this._lightbox_id)) {
			task = this.mixin({}, this.getTask(this._lightbox_id));
		}

		var sns = this._get_typed_lightbox_config();
		for (var i = 0; i < sns.length; i++) {
			var node = document.getElementById(sns[i].id);
			node = (node ? node.nextSibling : node);
			var block = this.form_blocks[sns[i].type];
			if (!block) continue;
			var res = block.get_value.call(this, node, task, sns[i]);
			var map_to = gantt._resolve_default_mapping(sns[i]);
			if (typeof map_to == "string" && map_to != "auto") {
				task[map_to] = res;
			} else if (typeof map_to == "object") {
				for (var property in map_to) {
					if (map_to[property])
						task[map_to[property]] = res[property];
				}
			}
		}
		return task;
	};


	gantt.hideLightbox = function () {
		var box = this.getLightbox();
		if (box) box.style.display = "none";

		this._waiAria.lightboxHiddenAttr(box);
		this._lightbox_id = null;

		this.hideCover();
		this.callEvent("onAfterLightbox", []);
	};
	gantt.hideCover = function () {
		if (this._cover)
			this._cover.parentNode.removeChild(this._cover);
		this._cover = null;
	};

	gantt.resetLightbox = function () {
		if (gantt._lightbox && !gantt._custom_lightbox)
			gantt._lightbox.parentNode.removeChild(gantt._lightbox);
		gantt._lightbox = null;
	};
	gantt._set_lightbox_values = function (data, box) {
		var task = data;
		var s = box.getElementsByTagName("span");
		var lightboxHeader = [];
		if (gantt.templates.lightbox_header) {
			lightboxHeader.push("");
			lightboxHeader.push(gantt.templates.lightbox_header(task.start_date, task.end_date, task));
			s[1].innerHTML = "";
			s[2].innerHTML = gantt.templates.lightbox_header(task.start_date, task.end_date, task);
		} else {
			lightboxHeader.push(this.templates.task_time(task.start_date, task.end_date, task));
			lightboxHeader.push((this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70)); //IE6 fix
			s[1].innerHTML = this.templates.task_time(task.start_date, task.end_date, task);
			s[2].innerHTML = (this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70); //IE6 fix
		}
		s[1].innerHTML = lightboxHeader[0];
		s[2].innerHTML = lightboxHeader[1];

		gantt._waiAria.lightboxHeader(box, lightboxHeader.join(" "));

		var sns = this._get_typed_lightbox_config(this.getLightboxType());
		for (var i = 0; i < sns.length; i++) {
			var section = sns[i];

			if (!this.form_blocks[section.type]) {
				continue;//skip incorrect sections, same check is done during rendering
			}


			var node = document.getElementById(section.id).nextSibling;
			var block = this.form_blocks[section.type];
			var map_to = gantt._resolve_default_mapping(sns[i]);
			var value = this.defined(task[map_to]) ? task[map_to] : section.default_value;
			block.set_value.call(gantt, node, value, task, section);

			if (section.focus)
				block.focus.call(gantt, node);
		}
		if (data.id)
			gantt._lightbox_id = data.id;
	};
	gantt._fill_lightbox = function (id, box) {
		var task = this.getTask(id);
		this._set_lightbox_values(task, box);
	};


	gantt.getLightboxSection = function (name) {
		var config = this._get_typed_lightbox_config();
		var i = 0;
		for (i; i < config.length; i++)
			if (config[i].name == name)
				break;
		var section = config[i];
		if (!section)
			return null;

		if (!this._lightbox)
			this.getLightbox();
		var header = document.getElementById(section.id);
		var node = header.nextSibling;

		var result = {
			section: section,
			header: header,
			node: node,
			getValue: function (ev) {
				return gantt.form_blocks[section.type].get_value.call(gantt, node, (ev || {}), section);
			},
			setValue: function (value, ev) {
				return gantt.form_blocks[section.type].set_value.call(gantt, node, value, (ev || {}), section);
			}
		};

		var handler = this._lightbox_methods["get_" + section.type + "_control"];
		return handler ? handler(result) : result;
	};

	gantt._lightbox_methods.get_template_control = function (result) {
		result.control = result.node;
		return result;
	};
	gantt._lightbox_methods.get_select_control = function (result) {
		result.control = result.node.getElementsByTagName('select')[0];
		return result;
	};
	gantt._lightbox_methods.get_textarea_control = function (result) {
		result.control = result.node.getElementsByTagName('textarea')[0];
		return result;
	};
	gantt._lightbox_methods.get_time_control = function (result) {
		result.control = result.node.getElementsByTagName('select'); // array
		return result;
	};


	gantt._init_dnd_events = function () {
		this.event(document.body, "mousemove", gantt._move_while_dnd);
		this.event(document.body, "mouseup", gantt._finish_dnd);
		gantt._init_dnd_events = function () {
		};
	};
	gantt._move_while_dnd = function (e) {
		if (gantt._dnd_start_lb) {
			if (!document.gantt_unselectable) {
				document.body.className += " gantt_unselectable";
				document.gantt_unselectable = true;
			}
			var lb = gantt.getLightbox();
			var now = (e && e.target) ? [e.pageX, e.pageY] : [event.clientX, event.clientY];
			lb.style.top = gantt._lb_start[1] + now[1] - gantt._dnd_start_lb[1] + "px";
			lb.style.left = gantt._lb_start[0] + now[0] - gantt._dnd_start_lb[0] + "px";
		}
	};
	gantt._ready_to_dnd = function (e) {
		var lb = gantt.getLightbox();
		gantt._lb_start = [parseInt(lb.style.left, 10), parseInt(lb.style.top, 10)];
		gantt._dnd_start_lb = (e && e.target) ? [e.pageX, e.pageY] : [event.clientX, event.clientY];
	};
	gantt._finish_dnd = function () {
		if (gantt._lb_start) {
			gantt._lb_start = gantt._dnd_start_lb = false;
			document.body.className = document.body.className.replace(" gantt_unselectable", "");
			document.gantt_unselectable = false;
		}
	};


	gantt._focus = function (node, select) {
		if (node && node.focus) {
			if (gantt.config.touch) {
				//do not focus editor, to prevent auto-zoom
			} else {
				try {
					if (select && node.select) node.select();
					node.focus();
				} catch (e) {
				}
			}
		}
	};


	gantt.form_blocks = {
		getTimePicker: function (sns, hidden) {
			var time_format = sns.time_format;
			if (!time_format) {
				// default order
				var time_format = ["%d", "%m", "%Y"];
				if (gantt._get_line(gantt.getScale().unit) < gantt._get_line("day")) {
					time_format.push("%H:%i");
				}
			}
			// map: default order => real one
			sns._time_format_order = {size: 0};


			var cfg = this.config;
			var dt = this.date.date_part(new Date(gantt._min_date.valueOf()));
			var last = 24 * 60, first = 0;
			if (gantt.config.limit_time_select) {
				last = 60 * cfg.last_hour + 1;
				first = 60 * cfg.first_hour;
				dt.setHours(cfg.first_hour);
			}
			var html = "";

			for (var p = 0; p < time_format.length; p++) {
				var time_option = time_format[p];

				// adding spaces between selects
				if (p > 0) {
					html += " ";
				}

				var options = '';
				switch (time_option) {
					case "%Y":
						sns._time_format_order[2] = p;
						sns._time_format_order.size++;
						//year

						var range, offset, start_year, end_year;

						if (sns.year_range) {
							if (!isNaN(sns.year_range)) {
								range = sns.year_range;
							} else if (sns.year_range.push) {
								// if
								start_year = sns.year_range[0];
								end_year = sns.year_range[1];
							}
						}

						range = range || 10;
						offset = offset || Math.floor(range / 2);
						start_year = start_year || dt.getFullYear() - offset;
						end_year = end_year || start_year + range;


						for (var i = start_year; i < end_year; i++)
							options += "<option value='" + (i) + "'>" + (i) + "</option>";
						break;
					case "%m":
						sns._time_format_order[1] = p;
						sns._time_format_order.size++;
						//month
						for (var i = 0; i < 12; i++)
							options += "<option value='" + i + "'>" + this.locale.date.month_full[i] + "</option>";
						break;
					case "%d":
						sns._time_format_order[0] = p;
						sns._time_format_order.size++;
						//days
						for (var i = 1; i < 32; i++)
							options += "<option value='" + i + "'>" + i + "</option>";
						break;
					case "%H:%i":
						//  var last = 24*60, first = 0;
						sns._time_format_order[3] = p;
						sns._time_format_order.size++;
						//hours
						var i = first;
						var tdate = dt.getDate();
						sns._time_values = [];

						while (i < last) {
							var time = this.templates.time_picker(dt);
							options += "<option value='" + i + "'>" + time + "</option>";
							sns._time_values.push(i);
							dt.setTime(dt.valueOf() + this._get_timepicker_step() * 60 * 1000);
							var diff = (dt.getDate() != tdate) ? 1 : 0; // moved or not to the next day
							i = diff * 24 * 60 + dt.getHours() * 60 + dt.getMinutes();
						}
						break;
					default:
						break;
				}

				if (options) {

					var ariaAttrs = gantt._waiAria.lightboxSelectAttrString(time_option);

					var readonly = sns.readonly ? "disabled='disabled'" : "";
					var display = hidden ? " style='display:none' " : "";
					html += "<select " + readonly + display + ariaAttrs + ">" + options + "</select>";
				}
			}
			return html;
		},
		_fill_lightbox_select: function (s, i, d, map, cfg) {
			s[i + map[0]].value = d.getDate();
			s[i + map[1]].value = d.getMonth();
			s[i + map[2]].value = d.getFullYear();
			if (gantt.defined(map[3])) {
				var v = d.getHours() * 60 + d.getMinutes();
				v = Math.round(v / gantt._get_timepicker_step()) * gantt._get_timepicker_step();
				var input = s[i + map[3]];
				input.value = v;
				//in case option not shown
				input.setAttribute('data-value', v);
			}
		},
		template: {
			render: function (sns) {
				var height = (sns.height || "30") + "px";
				return "<div class='gantt_cal_ltext gantt_cal_template' style='height:" + height + ";'></div>";
			},
			set_value: function (node, value, ev, config) {
				node.innerHTML = value || "";
			},
			get_value: function (node, ev, config) {
				return node.innerHTML || "";
			},
			focus: function (node) {
			}
		},
		textarea: {
			render: function (sns) {
				var height = (sns.height || "130") + "px";
				return "<div class='gantt_cal_ltext' style='height:" + height + ";'><textarea></textarea></div>";
			},
			set_value: function (node, value, ev) {
				this.form_blocks.textarea._get_input(node).value = value || "";
			},
			get_value: function (node, ev) {
				return this.form_blocks.textarea._get_input(node).value;
			},
			focus: function (node) {
				var a = this.form_blocks.textarea._get_input(node);
				gantt._focus(a, true);
			},
			_get_input: function (node) {
				return node.querySelector("textarea");
			}
		},
		select: {
			render: function (sns) {
				var height = (sns.height || "23") + "px";
				var html = "<div class='gantt_cal_ltext' style='height:" + height + ";'><select style='width:100%;'>";
				for (var i = 0; i < sns.options.length; i++)
					html += "<option value='" + sns.options[i].key + "'>" + sns.options[i].label + "</option>";
				html += "</select></div>";
				return html;
			},
			set_value: function (node, value, ev, sns) {
				var select = node.firstChild;
				if (!select._dhx_onchange && sns.onchange) {
					select.onchange = sns.onchange;
					select._dhx_onchange = true;
				}
				if (typeof value == "undefined")
					value = (select.options[0] || {}).value;
				select.value = value || "";
			},
			get_value: function (node, ev) {
				return node.firstChild.value;
			},
			focus: function (node) {
				var a = node.firstChild;
				gantt._focus(a, true);
			}
		},
		time: {
			render: function (sns) {
				var time = this.form_blocks.getTimePicker.call(this, sns);
				var parts = ["<div style='height:" + (sns.height || 30) + "px;padding-top:0px;font-size:inherit;text-align:center;' class='gantt_section_time'>"];
				parts.push(time);

				if (sns.single_date) {
					time = this.form_blocks.getTimePicker.call(this, sns, true);
					parts.push("<span></span>");
				} else {
					parts.push("<span style='font-weight:normal; font-size:10pt;'> &nbsp;&ndash;&nbsp; </span>");
				}

				parts.push(time);
				parts.push("</div>");
				return parts.join('');
			},
			set_value: function (node, value, ev, config) {
				var cfg = config;
				var s = node.getElementsByTagName("select");

				var map = config._time_format_order;
				var map_size = config._time_format_size;

				if (cfg.auto_end_date) {
					var _update_lightbox_select = function () {
						start_date = new Date(s[map[2]].value, s[map[1]].value, s[map[0]].value, 0, 0);
						end_date = gantt.calculateEndDate({start_date: start_date, duration: 1, task: ev});
						this.form_blocks._fill_lightbox_select(s, map.size, end_date, map, cfg);
					};
					for (var i = 0; i < 4; i++) {
						s[i].onchange = _update_lightbox_select;
					}
				}

				var mapping = gantt._resolve_default_mapping(config);

				if (typeof(mapping) === "string") mapping = {start_date: mapping};

				var start_date = ev[mapping.start_date] || new Date();
				var end_date = ev[mapping.end_date] || gantt.calculateEndDate({
					start_date: start_date,
					duration: 1,
					task: ev
				});

				this.form_blocks._fill_lightbox_select(s, 0, start_date, map, cfg);
				this.form_blocks._fill_lightbox_select(s, map.size, end_date, map, cfg);
			},

			get_value: function (node, ev, config) {
				var s = node.getElementsByTagName("select");
				var map = config._time_format_order;

				var hours = 0, minutes = 0;
				if (gantt.defined(map[3])) {
					var time = parseInt(s[map[3]].value, 10);
					hours = Math.floor(time / 60);
					minutes = time % 60;
				}
				var start_date = new Date(s[map[2]].value, s[map[1]].value, s[map[0]].value, hours, minutes);

				hours = minutes = 0;
				if (gantt.defined(map[3])) {
					var time = parseInt(s[map.size + map[3]].value, 10);
					hours = Math.floor(time / 60);
					minutes = time % 60;
				}
				var end_date = new Date(s[map[2] + map.size].value, s[map[1] + map.size].value, s[map[0] + map.size].value, hours, minutes);

				if (end_date <= start_date)
					end_date = gantt.date.add(start_date, gantt._get_timepicker_step(), "minute");

				var mapped_fields = gantt._resolve_default_mapping(config);

				var res = {
					start_date: new Date(start_date),
					end_date: new Date(end_date)
				};
				if (typeof mapped_fields == "string") {
					return res.start_date;
				} else {
					return res;
				}
			},
			focus: function (node) {
				gantt._focus(node.getElementsByTagName("select")[0]);
			}
		},
		duration: {
			render: function (sns) {
				var time = this.form_blocks.getTimePicker.call(this, sns);
				time = "<div class='gantt_time_selects'>" + time + "</div>";
				var label = this.locale.labels[this.config.duration_unit + "s"];

				var singleDate = sns.single_date ? ' style="display:none"' : "";
				var readonly = sns.readonly ? " disabled='disabled'" : "";

				var ariaAttr = this._waiAria.lightboxDurationInputAttrString(sns);

				var duration = "<div class='gantt_duration' " + singleDate + ">" +
					"<input type='button' class='gantt_duration_dec' value='−'" + readonly + ">" +
					"<input type='text' value='5' class='gantt_duration_value'" + readonly + " " + ariaAttr + ">" +
					"<input type='button' class='gantt_duration_inc' value='+'" + readonly + "> " + label + " <span></span>" +
					"</div>";
				var html = "<div style='height:" + (sns.height || 30) + "px;padding-top:0px;font-size:inherit;' class='gantt_section_time'>" + time + " " + duration + "</div>";
				return html;
			},
			set_value: function (node, value, ev, config) {
				var cfg = config;
				var s = node.getElementsByTagName("select");
				var inps = node.getElementsByTagName("input");

				var duration = inps[1];
				var btns = [inps[0], inps[2]];
				var endspan = node.getElementsByTagName("span")[0];

				var map = config._time_format_order;

				function _calc_date() {
					var start_date = gantt.form_blocks.duration._get_start_date.call(gantt, node, config);
					var duration = gantt.form_blocks.duration._get_duration.call(gantt, node, config);
					var end_date = gantt.calculateEndDate({start_date: start_date, duration: duration, task: ev});

					endspan.innerHTML = gantt.templates.task_date(end_date);
				}

				function _change_duration(step) {
					var value = duration.value;
					value = parseInt(value, 10);
					if (window.isNaN(value))
						value = 0;
					value += step;
					if (value < 1) value = 1;
					duration.value = value;
					_calc_date();
				}

				btns[0].onclick = gantt.bind(function () {
					_change_duration(-1 * this.config.duration_step);
				}, this);
				btns[1].onclick = gantt.bind(function () {
					_change_duration(1 * this.config.duration_step);
				}, this);
				s[0].onchange = _calc_date;
				s[1].onchange = _calc_date;
				s[2].onchange = _calc_date;
				if (s[3]) s[3].onchange = _calc_date;
				duration.onkeydown = gantt.bind(function (e) {
					e = e || window.event;
					// up
					var code = (e.charCode || e.keyCode || e.which);

					if (code == 40) {
						_change_duration(-1 * this.config.duration_step);
						return false;
					}
					// down
					if (code == 38) {
						_change_duration(1 * this.config.duration_step);
						return false;
					}
					window.setTimeout(function (e) {
						_calc_date();
					}, 1);
				}, this);

				duration.onchange = gantt.bind(function (e) {
					_calc_date();
				}, this);

				var mapping = gantt._resolve_default_mapping(config);
				if (typeof(mapping) === "string") mapping = {start_date: mapping};

				var start_date = ev[mapping.start_date] || new Date();
				var end_date = ev[mapping.end_date] || gantt.calculateEndDate({
					start_date: start_date,
					duration: 1,
					task: ev
				});
				var duration_val = Math.round(ev[mapping.duration]) || gantt.calculateDuration({
					start_date: start_date,
					end_date: end_date,
					task: ev
				});

				gantt.form_blocks._fill_lightbox_select(s, 0, start_date, map, cfg);
				duration.value = duration_val;
				_calc_date();
			},

			_get_start_date: function (node, config) {
				var s = node.getElementsByTagName("select");
				var map = config._time_format_order;
				var hours = 0;
				var minutes = 0;
				if (gantt.defined(map[3])) {
					var input = s[map[3]];
					var time = parseInt(input.value, 10);
					if (isNaN(time) && input.hasAttribute("data-value")) {
						time = parseInt(input.getAttribute("data-value"), 10);
					}

					hours = Math.floor(time / 60);
					minutes = time % 60;
				}
				return new Date(s[map[2]].value, s[map[1]].value, s[map[0]].value, hours, minutes);
			},
			_get_duration: function (node, config) {
				var duration = node.getElementsByTagName("input")[1];
				duration = parseInt(duration.value, 10);
				if (!duration || window.isNaN(duration)) duration = 1;
				if (duration < 0) duration *= -1;
				return duration;
			},

			get_value: function (node, ev, config) {
				var start_date = gantt.form_blocks.duration._get_start_date(node, config);
				var duration = gantt.form_blocks.duration._get_duration(node, config);

				var end_date = gantt.calculateEndDate({start_date: start_date, duration: duration, task: ev});
				var mapped_fields = gantt._resolve_default_mapping(config);
				var res = {
					start_date: new Date(start_date),
					end_date: new Date(end_date),
					duration: duration
				};
				if (typeof mapped_fields == "string") {
					return res.start_date;
				} else {
					return res;
				}
			},
			focus: function (node) {
				gantt._focus(node.getElementsByTagName("select")[0]);
			}
		},
		parent: {
			_filter: function (options, config, item_id) {
				var filter = config.filter || function () {
					return true;
				};

				options = options.slice(0);

				for (var i = 0; i < options.length; i++) {
					var task = options[i];
					if (task.id == item_id || gantt.isChildOf(task.id, item_id) || filter(task.id, task) === false) {
						options.splice(i, 1);
						i--;
					}
				}
				return options;
			},

			_display: function (config, item_id) {
				var tasks = [],
					options = [];
				if (item_id) {
					tasks = gantt.getTaskByTime();
					if (config.allow_root) {
						tasks.unshift({id: gantt.config.root_id, text: config.root_label || ""});
					}
					tasks = this._filter(tasks, config, item_id);
					if (config.sort) {
						tasks.sort(config.sort);
					}
				}
				var text = config.template || gantt.templates.task_text;
				for (var i = 0; i < tasks.length; i++) {
					var label = text.apply(gantt, [tasks[i].start_date, tasks[i].end_date, tasks[i]]);
					if (label === undefined) {
						label = "";
					}
					options.push({
						key: tasks[i].id,
						label: label
					});
				}
				config.options = options;
				config.map_to = config.map_to || "parent";
				return gantt.form_blocks.select.render.apply(this, arguments);
			},
			render: function (sns) {
				return gantt.form_blocks.parent._display(sns, false);
			},
			set_value: function (node, value, ev, config) {
				var tmpDom = document.createElement("div");
				tmpDom.innerHTML = gantt.form_blocks.parent._display(config, ev.id);
				var newOptions = tmpDom.removeChild(tmpDom.firstChild);
				node.onselect = null;
				node.parentNode.replaceChild(newOptions, node);

				return gantt.form_blocks.select.set_value.apply(gantt, [newOptions, value, ev, config]);
			},
			get_value: function () {
				return gantt.form_blocks.select.get_value.apply(gantt, arguments);
			},
			focus: function () {
				return gantt.form_blocks.select.focus.apply(gantt, arguments);
			}
		}
	};

	gantt._is_lightbox_timepicker = function () {
		var s = this._get_typed_lightbox_config();
		for (var i = 0; i < s.length; i++)
			if (s[i].name == "time" && s[i].type == "time")
				return true;
		return false;
	};

	gantt._dhtmlx_confirm = function (message, title, callback, ok) {
		if (!message)
			return callback();
		var opts = {text: message};
		if (title)
			opts.title = title;
		if (ok) {
			opts.ok = ok;
		}
		if (callback) {
			opts.callback = function (result) {
				if (result)
					callback();
			};
		}
		gantt.confirm(opts);
	};

	gantt._get_typed_lightbox_config = function (type) {
		if (type === undefined) {
			type = this.getLightboxType();
		}

		var field = this._get_type_name(type);

		if (gantt.config.lightbox[field + "_sections"]) {
			return gantt.config.lightbox[field + "_sections"];
		} else {
			return gantt.config.lightbox.sections;
		}
	};

	gantt._silent_redraw_lightbox = function (type) {
		var oldType = this.getLightboxType();

		if (this.getState().lightbox) {
			var taskId = this.getState().lightbox;
			var formData = this.getLightboxValues(),
				task = this.copy(this.getTask(taskId));

			this.resetLightbox();

			var updTask = this.mixin(task, formData, true);
			var box = this.getLightbox(type ? type : undefined);
			this._center_lightbox(this.getLightbox());
			this._set_lightbox_values(updTask, box);
		} else {
			this.resetLightbox();
			this.getLightbox(type ? type : undefined);
		}
		this.callEvent("onLightboxChange", [oldType, this.getLightboxType()]);
	};

};

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt._extend_to_optional = function (lightbox_block) {

		var duration = lightbox_block;
		var optional_time = {
			render: duration.render,
			focus: duration.focus,
			set_value: function (node, value, task, section) {
				var mapping = gantt._resolve_default_mapping(section);
				if (!task[mapping.start_date] || (mapping.start_date == "start_date" && this._isAllowedUnscheduledTask(task))) {
					optional_time.disable(node, section);
					var val = {};

					for (var i in mapping) {
						//take default values from the time control from task start/end dates
						val[mapping[i]] = task[i];
					}

					return duration.set_value.call(gantt, node, value, val, section);//set default value
				} else {
					optional_time.enable(node, section);
					return duration.set_value.call(gantt, node, value, task, section);
				}
			},
			get_value: function (node, task, section) {
				if (section.disabled) {
					return {start_date: null};
				} else {
					return duration.get_value.call(gantt, node, task, section);
				}
			},
			update_block: function (node, section) {
				gantt.callEvent("onSectionToggle", [gantt._lightbox_id, section]);
				node.style.display = section.disabled ? "none" : "block";

				if (section.button) {
					var button = node.previousSibling.querySelector(".gantt_custom_button_label"),
						labels = gantt.locale.labels;

					var button_text = section.disabled ? labels[section.name + "_enable_button"] : labels[section.name + "_disable_button"];

					button.innerHTML = button_text;
				}
				gantt.resizeLightbox();
			},
			disable: function (node, section) {
				section.disabled = true;
				optional_time.update_block(node, section);

			},
			enable: function (node, section) {
				section.disabled = false;
				optional_time.update_block(node, section);
			},
			button_click: function (index, el, section, container) {
				if (gantt.callEvent("onSectionButton", [gantt._lightbox_id, section]) === false) {
					return;
				}
				var config = gantt._get_typed_lightbox_config()[index];
				if (config.disabled) {
					optional_time.enable(container, config);
				} else {
					optional_time.disable(container, config);
				}
			}
		};
		return optional_time;
	};

	gantt.form_blocks.duration_optional = gantt._extend_to_optional(gantt.form_blocks.duration);
	gantt.form_blocks.time_optional = gantt._extend_to_optional(gantt.form_blocks.time);

};

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = function(gantt) {


};

/***/ }),
/* 83 */
/***/ (function(module, exports) {

/*
 reuse results of functions that can be recalculated during rendering
 greatly increases the rendering speed when critical path enabled
 Sample - 94_dev/critical_path.html

 */
module.exports = function(gantt){

gantt._cached_functions = {
	cache: {},
	mode: false,
	critical_path_mode: false,
	wrap_methods : function(methods, object){
		if(object._prefetch_originals){
			for(var i in object._prefetch_originals){
				object[i] = object._prefetch_originals[i];
			}
		}
		object._prefetch_originals = {};
		for(var i = 0; i < methods.length; i++)
			this.prefetch(methods[i], object);

	},
	prefetch : function(methodname, host){
		var original = host[methodname];
		if(original){
			var optimizer = this;

			host._prefetch_originals[methodname] = original;
			host[methodname] = function get_prefetched_value(){

				var argumentsArray = new Array(arguments.length);
				for (var i = 0, l = arguments.length; i < l; i++) {
					argumentsArray[i] = arguments[i];
				}

				if(optimizer.active){
					var args = optimizer.get_arguments_hash(Array.prototype.slice.call(argumentsArray));
					if(!optimizer.cache[methodname]){
						optimizer.cache[methodname] = {};
					}

					var cached_values = optimizer.cache[methodname];

					if(optimizer.has_cached_value(cached_values, args)){
						return optimizer.get_cached_value(cached_values, args);
					}else{
						var value = original.apply(this, argumentsArray);
						optimizer.cache_value(cached_values, args, value);
						return value;
					}
				}

				return original.apply(this, argumentsArray);
			};
		}
		return original;
	},
	cache_value: function(cache, arguments_hash, value){
		if(this.is_date(value))
			value = new Date(value);
		cache[arguments_hash] = value;
	},
	has_cached_value: function(cache, arguments_hash){
		return cache.hasOwnProperty(arguments_hash);
	},
	get_cached_value: function(cache, arguments_hash){
		var data = cache[arguments_hash];

		//for cached dates - return copy
		if(this.is_date(data)){
			data = new Date(data);
		}
		return data;
	},
	is_date: function(value){
		return (value && value.getUTCDate);
	},
	get_arguments_hash:function(args){
		var values = [];
		for(var i = 0; i < args.length; i++){
			values.push(this.stringify_argument(args[i]));
		}
		return "(" + values.join(";") + ")";
	},
	stringify_argument: function(value){
		//expecting task or link, or any other data entries, dates and primitive values
		var ret = "";
		if(value.id){
			ret = value.id;
		}else if(this.is_date(value)){
			ret = value.valueOf();
		}else{
			ret = value;
		}
		return ret + "";
	},
	activate: function(){
		this.clear();
		this.active = true;
	},
	deactivate: function(){
		this.clear();
		this.active = false;
	},
	clear: function(){
		this.cache = {};
	},

	setup: function(gantt){
		var override_gantt = [];

		var gantt_methods  = [
			'_isCriticalTask',
			'isCriticalLink',
			'_isProjectEnd',
			'_getProjectEnd',
			'_getSlack'
		];



		if(this.mode == 'auto'){
			if(gantt.config.highlight_critical_path){
				override_gantt = gantt_methods;
			}
		}else if(this.mode === true){
			override_gantt = gantt_methods;
		}

		this.wrap_methods(override_gantt, gantt);

	},
	update_if_changed: function(gantt){
		var changed = (this.critical_path_mode != gantt.config.highlight_critical_path ||
						this.mode !== gantt.config.optimize_render);
		if(changed){
			this.critical_path_mode = gantt.config.highlight_critical_path;
			this.mode = gantt.config.optimize_render;
			this.setup(gantt);
		}
	}
};

function activate(){
	gantt._cached_functions.update_if_changed(gantt);
	if(!gantt._cached_functions.active){
		gantt._cached_functions.activate();
	}
	return true;
}
gantt.attachEvent("onBeforeGanttRender", activate);
gantt.attachEvent("onBeforeDataRender", activate);
gantt.attachEvent("onBeforeSmartRender",  function(){
	activate();
});
gantt.attachEvent("onBeforeParse", activate);
gantt.attachEvent("onDataRender", function(){
	gantt._cached_functions.deactivate();
});
var deactivTimeout = null;
gantt.attachEvent("onSmartRender", function(){
	if(deactivTimeout)
		clearTimeout(deactivTimeout);
	deactivTimeout = setTimeout(function(){
		gantt._cached_functions.deactivate();
	}, 1000);
});

gantt.attachEvent("onBeforeGanttReady", function(){
	gantt._cached_functions.update_if_changed(gantt);
	return true;
});

};

/***/ }),
/* 84 */
/***/ (function(module, exports) {

function _configure(col, data, force) {
	for (var key in data)
		if (typeof col[key] == "undefined" || force)
			col[key] = data[key];
}

function _get_skin(force, gantt) {
	var skin = gantt.skin;
	if (!skin || force) {
		var links = document.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var res = links[i].href.match("dhtmlxgantt_([a-z\_]+).css");
			if (res) {
				if (gantt.skins[res[1]] || !skin) {
					skin = res[1];
					break;
				}
			}
		}
	}

	gantt.skin = skin || "terrace";
	var skinset = gantt.skins[gantt.skin] || gantt.skins["terrace"];

	//apply skin related settings
	_configure(gantt.config, skinset.config, force);

	var config = gantt.getGridColumns();
	if (config[1] && typeof config[1].width == "undefined")
		config[1].width = skinset._second_column_width;
	if (config[2] && typeof config[2].width == "undefined")
		config[2].width = skinset._third_column_width;

	if (skinset.config.task_height)
		gantt.config.task_height = skinset.config.task_height || "full"; 

	if (skinset._lightbox_template)
		gantt._lightbox_template = skinset._lightbox_template;

	if (skinset._redefine_lightbox_buttons) {
		gantt.config.buttons_right = skinset._redefine_lightbox_buttons["buttons_right"];
		gantt.config.buttons_left = skinset._redefine_lightbox_buttons["buttons_left"];
	}


	gantt.resetLightbox();
}

module.exports = function(gantt) {
	if(!gantt.resetSkin){
		gantt.resetSkin = function () {
			this.skin = "";
			_get_skin(true, this);
		};
		gantt.skins = {};

		gantt.attachEvent("onGanttLayoutReady", function(){
			_get_skin(false, this);
		});
	}
};

/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
gantt.skins.skyblue = {
	config:{
		grid_width:350,
		row_height: 27,
		scale_height: 27,
		link_line_width:1,
		link_arrow_size:8,
		lightbox_additional_height:75
	},
	_second_column_width:95,
	_third_column_width:80
};

};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
gantt.skins.meadow = {
	config:{
		grid_width:350,
		row_height: 27,
		scale_height: 30,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:72
	},
	_second_column_width:95,
	_third_column_width:80
};

};

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
gantt.skins.terrace = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:75
	},
	_second_column_width:90,
	_third_column_width:70		
};

};

/***/ }),
/* 88 */
/***/ (function(module, exports) {



module.exports = function(gantt) {
	gantt.skins.broadway = {
		config: {
			grid_width: 360,
			row_height: 35,
			scale_height: 35,
			link_line_width: 1,
			link_arrow_size: 7,
			lightbox_additional_height: 86
		},
		_second_column_width: 90,
		_third_column_width: 80,

		_lightbox_template: "<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>",
		_config_buttons_left: {},
		_config_buttons_right: {
			"gantt_delete_btn": "icon_delete",
			"gantt_save_btn": "icon_save"
		}
	};
};

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	gantt.skins.material = {
		config: {
			grid_width: 411,
			row_height: 34,
			task_height_offset: 6,
			scale_height: 36,
			link_line_width: 2,
			link_arrow_size: 6,
			lightbox_additional_height: 80
		},
		_second_column_width: 110,
		_third_column_width: 75,
		_redefine_lightbox_buttons: {
			"buttons_left": ["dhx_delete_btn"],
			"buttons_right": ["dhx_save_btn", "dhx_cancel_btn"]
		}
	};

	gantt.attachEvent("onAfterTaskDrag", function (id) {
		var t = gantt.getTaskNode(id);
		if (t) {
			t.className += " gantt_drag_animation";
			setTimeout(function () {
				var indx = t.className.indexOf(" gantt_drag_animation");
				if (indx > -1) {
					t.className = t.className.slice(0, indx);
				}
			}, 200);
		}
	});

};

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
gantt.skins["contrast_black"] = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:75
	},
	_second_column_width:100,
	_third_column_width:80
};

};

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
gantt.skins["contrast_white"] = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		link_line_width:2,
		link_arrow_size:6,
		lightbox_additional_height:75
	},
	_second_column_width:100,
	_third_column_width:80
};

};

/***/ }),
/* 92 */
/***/ (function(module, exports) {

/*
TODO: bug, touch event dissapears after gantt.init is called second time

 */

module.exports = function(gantt) {

	gantt.config.touch_drag = 500; //nearly immediate dnd
	gantt.config.touch = true;
	gantt.config.touch_feedback = true;
	gantt.config.touch_feedback_duration = 1;
	gantt._prevent_touch_scroll = false;


	gantt._touch_feedback = function () {
		if (gantt.config.touch_feedback) {
			if (navigator.vibrate)
				navigator.vibrate(gantt.config.touch_feedback_duration);
		}
	};

	gantt.attachEvent("onGanttReady", gantt.bind(function(){
		if (this.config.touch != "force")
			this.config.touch = this.config.touch &&
				((navigator.userAgent.indexOf("Mobile") != -1) ||
					(navigator.userAgent.indexOf("iPad") != -1) ||
					(navigator.userAgent.indexOf("Android") != -1) ||
					(navigator.userAgent.indexOf("Touch") != -1));

		if (this.config.touch) {

			var touchEventsSupported = true;
			try {
				document.createEvent("TouchEvent");
			} catch (e) {
				touchEventsSupported = false;
			}

			if (touchEventsSupported) {
				this._touch_events(["touchmove", "touchstart", "touchend"], function (ev) {
					if (ev.touches && ev.touches.length > 1) return null;
					if (ev.touches[0])
						return {
							target: ev.target,
							pageX: ev.touches[0].pageX,
							pageY: ev.touches[0].pageY,
							clientX: ev.touches[0].clientX,
							clientY: ev.touches[0].clientY
						};
					else
						return ev;
				}, function () {
					return false;
				});
			} else if (window.navigator.pointerEnabled) {
				this._touch_events(["pointermove", "pointerdown", "pointerup"], function (ev) {
					if (ev.pointerType == "mouse") return null;
					return ev;
				}, function (ev) {
					return (!ev || (ev.pointerType == "mouse" ));
				});
			} else if (window.navigator.msPointerEnabled) {
				this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function (ev) {
					if (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE) return null;
					return ev;
				}, function (ev) {
					return (!ev || ev.pointerType == ev.MSPOINTER_TYPE_MOUSE);
				});
			}

		}
	}, gantt));


	function getTaskDND(){
		var _tasks_dnd;
		if(gantt.$ui.getView("timeline")){
			_tasks_dnd = gantt.$ui.getView("timeline")._tasks_dnd;
		}
		return _tasks_dnd;
	}

	var touchHandlers = [];

//we can't use native scrolling, as we need to sync momentum between different parts
//so we will block native scroll and use the custom one
//in future we can add custom momentum
	gantt._touch_events = function (names, accessor, ignore) {
		//webkit on android need to be handled separately
		var dblclicktime = 0;
		var action_mode = false;
		var scroll_mode = false;
		var dblclick_timer = 0;
		var action_start = null;
		var scroll_state;
		var long_tap_timer = null;
		var current_target = null;



		for(var i = 0; i < touchHandlers.length; i++){
			gantt.eventRemove(touchHandlers[i][0], touchHandlers[i][1], touchHandlers[i][2]);
		}
		touchHandlers = [];

		//touch move
		touchHandlers.push([gantt.$container, names[0], function (e) {
			var _tasks_dnd = getTaskDND();

				if (ignore(e)) return;

				//ignore common and scrolling moves
				if (!action_mode) return;

				if (long_tap_timer) clearTimeout(long_tap_timer);

				var source = accessor(e);
				if (_tasks_dnd && (_tasks_dnd.drag.id || _tasks_dnd.drag.start_drag)) {
					_tasks_dnd.on_mouse_move(source);
					if (e.preventDefault)
						e.preventDefault();
					e.cancelBubble = true;
					return false;
				}
				if (!gantt._prevent_touch_scroll) {
					if (source && action_start) {
						var dx = action_start.pageX - source.pageX;
						var dy = action_start.pageY - source.pageY;
						if (!scroll_mode && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
							gantt._touch_scroll_active = scroll_mode = true;
							dblclicktime = 0;
							scroll_state = gantt.getScrollState();
						}

						if (scroll_mode) {
							gantt.scrollTo(scroll_state.x + dx, scroll_state.y + dy);
							var new_scroll_state = gantt.getScrollState();

							if ((scroll_state.x != new_scroll_state.x && dy > 2 * dx) ||
								(scroll_state.y != new_scroll_state.y && dx > 2 * dy )) {
								return block_action(e);
							}
						}
					}
					return block_action(e);
				}
				return true;
			}]);


		//block touch context menu in IE10
		touchHandlers.push([this.$container, "contextmenu", function (e) {
			if (action_mode)
				return block_action(e);
		}]);

		//touch start
		touchHandlers.push([this.$container, names[1], function (e) {
			if (ignore(e)) return;
			if (e.touches && e.touches.length > 1) {
				action_mode = false;
				return;
			}

			action_start = accessor(e);
			if (!gantt._locate_css(action_start, "gantt_hor_scroll") && !gantt._locate_css(action_start, "gantt_ver_scroll")) {
				action_mode = true;
			}
			var _tasks_dnd = getTaskDND();

			//long tap
			long_tap_timer = setTimeout(function () {
				var taskId = gantt.locate(action_start);
				if (_tasks_dnd && (taskId && !gantt._locate_css(action_start, "gantt_link_control") && !gantt._locate_css(action_start, "gantt_grid_data"))) {
					_tasks_dnd.on_mouse_down(action_start);

					if (_tasks_dnd.drag && _tasks_dnd.drag.start_drag) {
						cloneTaskRendered(taskId);
						_tasks_dnd._start_dnd(action_start);
						gantt._touch_drag = true;

						gantt.refreshTask(taskId);

						gantt._touch_feedback();
					}

				}

				long_tap_timer = null;
			}, gantt.config.touch_drag);
		}]);

		//touch end
		touchHandlers.push([this.$container, names[2], function (e) {
			if (ignore(e)) return;
			if (long_tap_timer) clearTimeout(long_tap_timer);
			gantt._touch_drag = false;
			action_mode = false;
			var source = accessor(e);

			var _tasks_dnd = getTaskDND();

			if(_tasks_dnd)
				_tasks_dnd.on_mouse_up(source);

			if (current_target) {
				gantt.refreshTask(gantt.locate(current_target));
				if (current_target.parentNode) {
					current_target.parentNode.removeChild(current_target);
					gantt._touch_feedback();
				}
			}

			gantt._touch_scroll_active = action_mode = scroll_mode = false;
			current_target = null;

			//dbl-tap handling
			if (action_start && dblclicktime) {
				var now = new Date();
				if ((now - dblclicktime) < 500) {

					var mouseEvents = gantt.$services.getService("mouseEvents");
					mouseEvents.onDoubleClick(action_start);
					block_action(e);
				} else
					dblclicktime = now;
			} else {
				dblclicktime = new Date();
			}
		}]);

		for(var i = 0; i < touchHandlers.length; i++){
			gantt.event(touchHandlers[i][0], touchHandlers[i][1], touchHandlers[i][2]);
		}

		//common helper, prevents event
		function block_action(e) {
			if (e && e.preventDefault)
				e.preventDefault();
			(e || event).cancelBubble = true;
			return false;
		}

		function cloneTaskRendered(taskId) {
			var renders = gantt._getTaskLayers();
			var task = gantt.getTask(taskId);
			if (task && gantt.isTaskVisible(taskId)) {
				for (var i = 0; i < renders.length; i++) {
					task = renders[i].rendered[taskId];
					if (task && task.getAttribute("task_id") && task.getAttribute("task_id") == taskId) {
						var copy = task.cloneNode(true);
						current_target = task;
						renders[i].rendered[taskId] = copy;
						task.style.display = "none";
						copy.className += " gantt_drag_move ";
						task.parentNode.appendChild(copy);
						//return copy;
					}
				}
			}
		}
	};

};

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = function(gantt) {
	gantt.locale = {
		date: {
			month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		},
		labels: {
			new_task: "New task",
			icon_save: "Save",
			icon_cancel: "Cancel",
			icon_details: "Details",
			icon_edit: "Edit",
			icon_delete: "Delete",
			confirm_closing: "",//Your changes will be lost, are you sure?
			confirm_deleting: "Task will be deleted permanently, are you sure?",
			section_description: "Description",
			section_time: "Time period",
			section_type: "Type",

			/* grid columns */
			column_wbs: "WBS",
			column_text: "Task name",
			column_start_date: "Start time",
			column_duration: "Duration",
			column_add: "",

			/* link confirmation */
			link: "Link",
			confirm_link_deleting: "will be deleted",
			link_start: " (start)",
			link_end: " (end)",

			type_task: "Task",
			type_project: "Project",
			type_milestone: "Milestone",

			minutes: "Minutes",
			hours: "Hours",
			days: "Days",
			weeks: "Week",
			months: "Months",
			years: "Years",

			/* message popup */
			message_ok: "OK",
			message_cancel: "Cancel"

		}
	};
};



/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var domHelpers = __webpack_require__(1);

module.exports = function(gantt){
	var calculateScaleRange = __webpack_require__(17);

	gantt.assert = __webpack_require__(95)(gantt);

//initial initialization
	gantt.init = function(node, from, to){
		if(from && to){
			this.config.start_date = this._min_date = new Date(from);
			this.config.end_date = this._max_date = new Date(to);
		}
		this.date.init();

		if (!this.config.scroll_size)
			this.config.scroll_size = domHelpers.getScrollSize() || 1;

		var resizeDelay;
		gantt.event(window, "resize", function(){
			clearTimeout(resizeDelay);
			resizeDelay = setTimeout(function(){
				gantt.render();
			}, 300);
		});

		//can be called only once
		this.init = function(node){
			if (this.$container && this.$container.parentNode){
				this.$container.parentNode.removeChild(this.$container);
				this.$container = null;
			}

			if(this.$layout){
				this.$layout.clear();
			}
			this._reinit(node);
		};

		this._reinit(node);
	};

	gantt._reinit = function(node){
		this.callEvent("onBeforeGanttReady", []);
		//this._init_tasks_range();
		this.resetLightbox();
		this._update_flags();


		var config = this.$services.getService("templateLoader");
		config.initTemplates(this);

		this._clearTaskLayers();
		this._clearLinkLayers();

		//this.clear
		if(this.$layout){
			this.$layout.destructor();
			this.$ui.reset();
		}

		this.$root = domHelpers.toNode(node);
		if(this.$root){
			this.$root.innerHTML = "";
		}
		node.gantt = this;
		calculateScaleRange(this);
		this.config.layout.id = "main";
		this.$layout = this.$ui.createView("layout", node, this.config.layout);

		this.$layout.attachEvent("onBeforeResize", function(){
			var storeNames = gantt.$services.getService("datastores");
			for(var i = 0; i < storeNames.length; i++){
				gantt.getDatastore(storeNames[i]).filter();
			}
		});

		this.$layout.attachEvent("onResize", function(){
			gantt.refreshData();
		});

		this.callEvent("onGanttLayoutReady", []);
		this.$layout.render();

		gantt.$container = this.$layout.$container.firstChild;
		this.callEvent("onTemplatesReady",[]);
		this.$mouseEvents.reset(this.$root);
		this.callEvent("onGanttReady", []);

		this.render();
	};

	gantt.$click={
		buttons:{
			"edit":function(id){
				gantt.showLightbox(id);
			},
			"delete":function(id){
				var question = gantt.locale.labels.confirm_deleting;
				var title = gantt.locale.labels.confirm_deleting_title;

				gantt._dhtmlx_confirm(question, title, function(){
					if(!gantt.isTaskExists(id)){
						gantt.hideLightbox();
						return;
					}

					var task = gantt.getTask(id);
					if(task.$new){
						gantt.silent(function(){
							gantt.deleteTask(id, true);
						});
						gantt.refreshData();
					}else{
						gantt.deleteTask(id);
					}

					gantt.hideLightbox();
				});
			}
		}
	};

	gantt.getScrollState = function(){
		var state = this._scroll_state();
		return { x:state.x_pos, y:state.y_pos, inner_width:state.x, inner_height:state.y, width: state.x_inner, height: state.y_inner };
	};

	gantt.scrollTo = function(left, top){
		var vertical = this._getVerticalScrollbar();
		var horizontal = this._getHorizontalScrollbar();

		var oldV = vertical.getScrollState(),
			oldH = horizontal.getScrollState();

		if (left*1 == left){
			horizontal.scroll(left);
		}
		if(top*1 == top){
			vertical.scroll(top);
		}

		var newV = vertical.getScrollState(),
			newH = horizontal.getScrollState();

		this.callEvent("onGanttScroll", [oldH.position, oldV.position, newH.position, newV.position]);
	};

	gantt.showDate = function(date){
		var date_x = this.posFromDate(date);
		var scroll_to = Math.max(date_x - this.config.task_scroll_offset, 0);
		this.scrollTo(scroll_to);
	};
	gantt.showTask = function(id) {
		var pos = this.getTaskPosition(this.getTask(id));

		var left = Math.max(pos.left - this.config.task_scroll_offset, 0);

		var dataHeight = this._scroll_state().y;
		var top;
		if(!dataHeight){
			top = pos.top;
		}else{
			top = pos.top - (dataHeight - this.config.row_height)/2;
		}

		this.scrollTo(left, top);
	};

//renders self
	gantt.render = function(){
		this.callEvent("onBeforeGanttRender", []);

		var pos = this.getScrollState();
		var posX = pos ? pos.x : 0;
		if(this._getHorizontalScrollbar()){
			var scrollbar = this._getHorizontalScrollbar();
			posX = scrollbar.$config.codeScrollLeft || posX || 0;
		}


		var visible_date = null;
		if(posX){
			visible_date = gantt.dateFromPos(posX + this.config.task_scroll_offset);
		}
		calculateScaleRange(this);

		this.$layout.$config.autosize = this.config.autosize;
		this.$layout.resize();

		if(this.config.preserve_scroll && pos){

			if(posX){
				var new_pos = gantt.getScrollState();
				var new_date = gantt.dateFromPos(new_pos.x);
				if(!(+visible_date == +new_date && new_pos.y == pos.y)){
					if(visible_date){
						this.showDate(visible_date);
					}
					if(pos.y)
						gantt.scrollTo(undefined, pos.y);
				}
			}
		}

		this.callEvent("onGanttRender", []);
	};

	//TODO: add layout.resize method that wouldn't trigger data repaint
	gantt.setSizes = gantt.render;

	gantt._scroll_state = function(){
		var result = {
			x: false,
			y: false,
			x_pos: 0,
			y_pos: 0,
			scroll_size: this.config.scroll_size + 1,//1px for inner content
			x_inner: 0,
			y_inner: 0
		};

		var scrollVer = gantt._getVerticalScrollbar(),
			scrollHor = gantt._getHorizontalScrollbar();
		if(scrollHor){
			var horState = scrollHor.getScrollState();
			if(horState.visible){
				result.x = horState.size;
				result.x_inner = horState.scrollSize;
			}
			result.x_pos = horState.position || 0;
		}

		if(scrollVer){
			var verState = scrollVer.getScrollState();
			if(verState.visible){
				result.y = verState.size;

				result.y_inner = verState.scrollSize;
			}
			result.y_pos = verState.position || 0;
		}

		return result;
	};

	gantt.locate = function(e) {
		var trg = domHelpers.getTargetNode(e);

		//ignore empty cells
		var className = domHelpers.getClassName(trg);
		if ((className || "").indexOf("gantt_task_cell") >= 0) return null;

		var targetAttribute = arguments[1] || this.config.task_attribute;

		var node = domHelpers.locateAttribute(trg, targetAttribute);
		if(node){
			return node.getAttribute(targetAttribute);
		}else{
			return null;
		}
	};

	gantt._locate_css = function(e, classname, strict){
		return domHelpers.locateClassName(e, classname, strict);
	};

	gantt._locateHTML = function(e, attribute) {
		return domHelpers.locateAttribute(e, attribute || this.config.task_attribute);
	};

	gantt.getTaskRowNode = function(id) {
		var els = this.$grid_data.childNodes;
		var attribute = this.config.task_attribute;
		for (var i = 0; i < els.length; i++) {
			if (els[i].getAttribute) {
				var value = els[i].getAttribute(attribute);
				if (value == id) return els[i];
			}
		}
		return null;
	};

	gantt.selectTask = function(id){
		if(!this.config.select_task)
			return false;
		if (id){

			if(this._selected_task == id)
				return this._selected_task;

			if(!this.callEvent("onBeforeTaskSelected", [id])){
				return false;
			}

			this.unselectTask();
			this._selected_task = id;

			this.refreshTask(id);
			this.callEvent("onTaskSelected", [id]);
		}
		return this._selected_task;
	};
	gantt.unselectTask = function(id){
		var id = id || this._selected_task;
		if(!id)
			return;
		this._selected_task = null;
		this.refreshTask(id);
		this.callEvent("onTaskUnselected", [id]);
	};
	gantt.getSelectedId = function() {
		return this.defined(this._selected_task) ? this._selected_task : null;
	};

	gantt.changeLightboxType = function(type){
		if(this.getLightboxType() == type)
			return true;
		gantt._silent_redraw_lightbox(type);
	};


	gantt._get_link_type = function (from_start, to_start) {
		var type = null;
		if (from_start && to_start) {
			type = gantt.config.links.start_to_start;
		} else if (!from_start && to_start) {
			type = gantt.config.links.finish_to_start;
		} else if (!from_start && !to_start) {
			type = gantt.config.links.finish_to_finish;
		} else if (from_start && !to_start) {
			type = gantt.config.links.start_to_finish;
		}
		return type;
	};

	gantt.isLinkAllowed = function (from, to, from_start, to_start) {
		var link = null;
		if (typeof(from) == "object") {
			link = from;
		} else {
			link = {source: from, target: to, type: this._get_link_type(from_start, to_start)};
		}

		if (!link) return false;
		if (!(link.source && link.target && link.type)) return false;
		if (link.source == link.target) return false;

		var res = true;
		//any custom rules
		if (this.checkEvent("onLinkValidation"))
			res = this.callEvent("onLinkValidation", [link]);

		return res;
	};


	gantt._correct_dst_change = function(date, prevOffset, step, unit){
		var time_unit = gantt._get_line(unit) * step;
		if(time_unit > 60*60 && time_unit < 60*60*24){
			//correct dst change only if current unit is more than one hour and less than day (days have own checking), e.g. 12h
			var offsetChanged = date.getTimezoneOffset() - prevOffset;
			if(offsetChanged){
				date = gantt.date.add(date, offsetChanged, "minute");
			}
		}
		return date;
	};

};

/***/ }),
/* 95 */
/***/ (function(module, exports) {

/*
 	asserts will be removed in final code, so you can place them anythere
	without caring about performance impacts
*/

module.exports = function(gantt){
	return function assert(check, message){
		//jshint -W087
		if (!check){
			if(gantt.config.show_errors && gantt.callEvent("onError",[message]) !== false) {
				gantt.message({type: "error", text: message, expire: -1});
				debugger;
			}
		}
	};
};

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = function(gantt){

	function deprecated(badCode, goodCode) {

		var formatting = gantt.env.isIE ? "" : "%c";


		var message = [
			formatting, "\"", badCode, "\"",  formatting,
			" has been deprecated in dhtmlxGantt v4.0 and will stop working in v6.0. Use ",
			formatting, "\"", goodCode, "\"",  formatting,
			" instead. \nSee more details at http://docs.dhtmlx.com/gantt/migrating.html "
		].join("");

		var log = window.console.warn || window.console.log;

		var args = [message];
		if(!gantt.env.isIE){
			args = args.concat(["font-weight:bold", "font-weight:normal", "font-weight:bold", "font-weight:normal"]);
		}

		log.apply(window.console, args);
	}

	function wrapDeprecated(method) {
		return function () {
			deprecated("dhtmlx." + method, "gantt." + method);
			return gantt[method].apply(gantt, arguments);
		};
	}

	/* dhtmlx */


	if (!window.dhtmlx)
		window.dhtmlx = {};

	var dhtmlxMethods = [
		"message",
		"alert",
		"confirm",
		"modalbox",
		"uid",
		"copy",
		"mixin",
		"defined",
		"bind",
		"assert"
	];

	for(var i = 0; i < dhtmlxMethods.length; i++){
		// wrap dhtmlx methods with 'deprecated' warnings
		// do not wrap if methods are defined by dhtmlxSuite
		if(!window.dhtmlx[dhtmlxMethods[i]]){
			dhtmlx[dhtmlxMethods[i]] = wrapDeprecated(dhtmlxMethods[i]);
		}
	}
	/* global functions */


	if (!window.dataProcessor) {
		window.dataProcessor = function (url) {
			deprecated("new dataProcessor(url)", "new gantt.dataProcessor(url)");
			return new gantt.dataProcessor(url);
		};
	}

};

/***/ })
/******/ ]);