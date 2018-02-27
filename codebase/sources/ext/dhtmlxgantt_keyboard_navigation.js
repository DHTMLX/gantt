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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function(){
	function setupKeyNav(gantt){
		gantt.config.keyboard_navigation = true;
		gantt.config.keyboard_navigation_cells = false;

		gantt.addShortcut = function(shortcut, handler, scope){
			var scopeObject = getScope(scope);
			if(scopeObject){
				scopeObject.prototype.bind(shortcut, handler);
			}
		};

		gantt.getShortcutHandler = function(shortcut, scope){
			var scopeObject = getScope(scope);
			if(scopeObject){
				var commands = gantt.$keyboardNavigation.shortcuts.parse(shortcut);
				if(commands.length){
					return scopeObject.prototype.findHandler(commands[0]);
				}
			}
		};

		gantt.removeShortcut = function(shortcut, scope){
			var scopeObject = getScope(scope);
			if(scopeObject){
				scopeObject.prototype.unbind(shortcut);
			}
		};

		gantt.focus = function(){

			var disp = gantt.$keyboardNavigation.dispatcher;
			disp.enable();
			if(!disp.getActiveNode()){
				disp.setDefaultNode();
			}else{
				disp.focusNode(disp.getActiveNode());
			}

		};



		function getScope(mode){
			var scopes = {
				"gantt":gantt.$keyboardNavigation.GanttNode,
				"headerCell": gantt.$keyboardNavigation.HeaderCell,
				"taskRow": gantt.$keyboardNavigation.TaskRow,
				"taskCell": gantt.$keyboardNavigation.HeaderCell
			};

			return scopes[mode] || scopes.gantt;
		}

		gantt.$keyboardNavigation = {};

		gantt._compose = function(){
			var parts = Array.prototype.slice.call(arguments, 0);
			var res = {};
			for(var i = 0; i < parts.length; i++){
				var obj = parts[i];
				if(typeof obj == "function"){
					obj = new obj();
				}

				for(var p in obj){
					res[p] = obj[p];
				}
			}
			return res;
		};

		__webpack_require__ (7)(gantt);
		__webpack_require__ (8)(gantt);
		__webpack_require__ (9)(gantt);
		__webpack_require__ (10)(gantt);
		__webpack_require__ (11)(gantt);
		__webpack_require__ (12)(gantt);
		__webpack_require__ (13)(gantt);
		__webpack_require__ (14)(gantt);
		__webpack_require__ (15)(gantt);
		__webpack_require__ (16)(gantt);

		(function(){
			var dispatcher = gantt.$keyboardNavigation.dispatcher;

			var keyDownHandler = function(e){
				if(!gantt.config.keyboard_navigation) return;

				return dispatcher.keyDownHandler(e);
			};

			var focusHandler = function(){
				dispatcher.focusGlobalNode();
			};

			gantt.attachEvent("onDataRender", function(){
				if(!gantt.config.keyboard_navigation) return;
				if(dispatcher.isEnabled()){
					var activeNode = dispatcher.getActiveNode();
					if(activeNode){
						activeNode.focus();
					}
				}
			});

			gantt.attachEvent("onGanttRender", function(){
				gantt.eventRemove(document, "keydown", keyDownHandler);
				gantt.eventRemove(gantt.$container, "focus", focusHandler);
				gantt.eventRemove(gantt.$container, "mousedown", mousedownHandler);

				if(gantt.config.keyboard_navigation){

					gantt.event(document, "keydown", keyDownHandler);
					gantt.event(gantt.$container, "focus", focusHandler);
					gantt.event(gantt.$container, "mousedown", mousedownHandler);
					gantt.$container.setAttribute("tabindex", "0");

				}else{
					gantt.$container.removeAttribute("tabindex");
				}
			});

			function mousedownHandler(e){
				if(!gantt.config.keyboard_navigation) return true;

				var focusNode;
				if(gantt._locateHTML(e, gantt.config.task_attribute)){
					focusNode = new gantt.$keyboardNavigation.TaskRow(
						gantt._locateHTML(e, gantt.config.task_attribute)
							.getAttribute(gantt.config.task_attribute));
				}

				if(focusNode) {
					if (!dispatcher.isEnabled()) {
						dispatcher.activeNode = focusNode;

					} else {
						dispatcher.delay(function () {
							dispatcher.setActiveNode(focusNode);
						});
					}

				}
			}


			var onReady = gantt.attachEvent("onGanttReady", function(){
				// restore focus on repainted tasks
				gantt.detachEvent(onReady);

				var skipNext = false;
				gantt.$data.tasksStore.attachEvent("onStoreUpdated", function(id){
					if(skipNext){
						skipNext = false;
						return;
					}

					if(gantt.config.keyboard_navigation && dispatcher.isEnabled()){
						var currentNode = dispatcher.getActiveNode();
						if(currentNode && currentNode.taskId == id){
							skipNext = true;
							dispatcher.focusNode(currentNode);
						}

					}
				});

				if(gantt._smart_render){
					var updateRender = gantt._smart_render._redrawItems;
					gantt._smart_render._redrawItems = function(renderers, items){
						if(gantt.config.keyboard_navigation && dispatcher.isEnabled()){
							var currentNode = dispatcher.getActiveNode();
							if(currentNode && currentNode.taskId !== undefined){
								var focusedItemVisible = false;
								for(var i = 0; i < items.length; i++){
									if(items[i].id == currentNode.taskId && items[i].start_date){
										focusedItemVisible = true;
										break;
									}
								}
								if(!focusedItemVisible){
									items.push(gantt.getTask(currentNode.taskId));
								}
							}
						}
						var res = updateRender.apply(this, arguments);

						return res;
					};
				}
			});



			gantt.attachEvent("onAfterTaskAdd", function(id,item){
				if(!gantt.config.keyboard_navigation) return true;
				if(dispatcher.isEnabled()){
					dispatcher.setActiveNode(new gantt.$keyboardNavigation.TaskRow(id));
				}
			});

			gantt.attachEvent("onTaskIdChange", function(oldId, newId){
				if(!gantt.config.keyboard_navigation) return true;

				var node = dispatcher.activeNode;
				if(node instanceof gantt.$keyboardNavigation.TaskRow || node instanceof gantt.$keyboardNavigation.TaskCell){
					if(node.taskId == oldId){
						node.taskId = newId;
					}
				}

				return true;
			});

			gantt.attachEvent("onTaskClick", function(id){
				if(!gantt.config.keyboard_navigation) return true;
				dispatcher.enable();
				dispatcher.setActiveNode(new gantt.$keyboardNavigation.TaskRow(id));
				return true;
			});

			gantt.attachEvent("onEmptyClick", function(){
				if(!gantt.config.keyboard_navigation) return true;
				dispatcher.enable();
			});

			var interval = setInterval(function(){
				if(!gantt.config.keyboard_navigation) return;

				var enable;
				var focusElement = document.activeElement;

				var parent = gantt.$container;
				// halt key nav when focus is outside gantt or in quick info popup
				if(!focusElement || gantt._locate_css(focusElement, "gantt_cal_quick_info")){
					enable = false;
				}else{
					while(focusElement != parent &&  focusElement){
						focusElement = focusElement.parentNode;
					}

					if(focusElement == parent){
						enable = true;
					}else{
						enable = false;
					}
				}

				if(enable && !dispatcher.isEnabled()){
					dispatcher.enable();
				}else if(!enable && dispatcher.isEnabled()){
					dispatcher.disable();
				}

			}, 500);

			gantt.attachEvent("onDestroy", function(){
				clearInterval(interval);
			});

		})();

	}


	if(window.Gantt){
		window.Gantt.plugin(setupKeyNav);
	}else{
		setupKeyNav(window.gantt);
	}
})();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.shortcuts = {
		createCommand: function () {
			return {
				modifiers: {
					"shift": false,
					"alt": false,
					"ctrl": false,
					"meta": false
				},
				keyCode: null
			};
		},
		parse: function (shortcut) {
			var commands = [];

			var expr = this.getExpressions(this.trim(shortcut));
			for (var i = 0; i < expr.length; i++) {
				var words = this.getWords(expr[i]);

				var command = this.createCommand();

				for (var j = 0; j < words.length; j++) {
					if (this.commandKeys[words[j]]) {
						command.modifiers[words[j]] = true;
					} else if (this.specialKeys[words[j]]) {
						command.keyCode = this.specialKeys[words[j]];
					} else {
						command.keyCode = words[j].charCodeAt(0);
					}
				}

				commands.push(command);
			}
			return commands;
		},

		getCommandFromEvent: function (domEvent) {
			var command = this.createCommand();
			command.modifiers.shift = !!domEvent.shiftKey;
			command.modifiers.alt = !!domEvent.altKey;
			command.modifiers.ctrl = !!domEvent.ctrlKey;
			command.modifiers.meta = !!domEvent.metaKey;
			command.keyCode = domEvent.which || domEvent.keyCode;

			if(command.keyCode >= 96 && command.keyCode <= 105){
				// numpad keys 96-105 -> 48-57
				command.keyCode -= 48;//convert numpad  number code to regular number code
			}

			var printableKey = String.fromCharCode(command.keyCode);
			if (printableKey) {
				command.keyCode = printableKey.toLowerCase().charCodeAt(0);
			}
			return command;
		},

		getHashFromEvent: function (domEvent) {
			return this.getHash(this.getCommandFromEvent(domEvent));
		},

		getHash: function (command) {
			var parts = [];
			for (var i in command.modifiers) {
				if (command.modifiers[i]) {
					parts.push(i);
				}
			}
			parts.push(command.keyCode);

			return parts.join(this.junctionChar);
		},

		getExpressions: function (shortcut) {
			return shortcut.split(this.junctionChar);
		},
		getWords: function (term) {
			return term.split(this.combinationChar);
		},
		trim: function (shortcut) {
			return shortcut.replace(/\s/g, "");
		},
		junctionChar: ",",
		combinationChar: "+",
		commandKeys: {
			"shift": 16,
			"alt": 18,
			"ctrl": 17,
			"meta": true
		},
		specialKeys: {
			"backspace": 8,
			"tab": 9,
			"enter": 13,
			"esc": 27,
			"space": 32,
			"up": 38,
			"down": 40,
			"left": 37,
			"right": 39,
			"home": 36,
			"end": 35,
			"pageup": 33,
			"pagedown": 34,
			"delete": 46,
			"insert": 45,
			"plus": 107,
			"f1": 112,
			"f2": 113,
			"f3": 114,
			"f4": 115,
			"f5": 116,
			"f6": 117,
			"f7": 118,
			"f8": 119,
			"f9": 120,
			"f10": 121,
			"f11": 122,
			"f12": 123
		}
	};
};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.EventHandler = {
		_handlers: null,
		findHandler: function (command) {
			if (!this._handlers) this._handlers = {};
			var shortcuts = gantt.$keyboardNavigation.shortcuts;
			var hash = shortcuts.getHash(command);

			return this._handlers[hash];
		},

		doAction: function (command, e) {
			var handler = this.findHandler(command);
			if (handler) {
				handler.call(this, e);

				if (e.preventDefault) e.preventDefault();
				else e.returnValue = false;

			}
		},
		bind: function (shortcut, handler) {
			if (!this._handlers) this._handlers = {};

			var shortcuts = gantt.$keyboardNavigation.shortcuts;

			var commands = shortcuts.parse(shortcut);
			for (var i = 0; i < commands.length; i++) {
				this._handlers[shortcuts.getHash(commands[i])] = handler;
			}
		},
		unbind: function (shortcut) {
			var shortcuts = gantt.$keyboardNavigation.shortcuts;

			var commands = shortcuts.parse(shortcut);
			for (var i = 0; i < commands.length; i++) {
				if (this._handlers[shortcuts.getHash(commands[i])]) {
					delete this._handlers[shortcuts.getHash(commands[i])];
				}
			}
		},

		bindAll: function (map) {
			for (var i in map) {
				this.bind(i, map[i]);
			}
		},
		initKeys: function () {
			if (!this._handlers)
				this._handlers = {};
			if (this.keys) {
				this.bindAll(this.keys);
			}
		}
	};

};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function(gantt) {

	(function () {
		var domHelpers = __webpack_require__(0);
		gantt.$keyboardNavigation.getFocusableNodes = domHelpers.getFocusableNodes;

		gantt.$keyboardNavigation.trapFocus = function trapFocus(root, e) {
			if (e.keyCode != 9) return false;

			var focusable = gantt.$keyboardNavigation.getFocusableNodes(root);
			var currentFocus = document.activeElement;
			var currentIndex = -1;
			for (var i = 0; i < focusable.length; i++) {
				if (focusable[i] == currentFocus) {
					currentIndex = i;
					break;
				}
			}

			if (e.shiftKey) {
				// back tab
				if (currentIndex <= 0) {
					// go to the last element if we focused on the first
					var lastItem = focusable[focusable.length - 1];
					if (lastItem) {
						lastItem.focus();
						e.preventDefault();
						return true;
					}
				}

			} else {
				// forward tab
				if (currentIndex >= focusable.length - 1) {
					// forward tab from last element should go back to the first element
					var firstItem = focusable[0];
					if (firstItem) {
						firstItem.focus();
						e.preventDefault();
						return true;
					}
				}
			}

			return false;
		};
	})();

};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.GanttNode = function () {
	};

	gantt.$keyboardNavigation.GanttNode.prototype = gantt._compose(
		gantt.$keyboardNavigation.EventHandler,
		{

			focus: function () {
				gantt.focus();
			},

			blur: function () {

			},

			disable: function () {
				gantt.$container.setAttribute("tabindex", "0");
			},
			enable: function () {
				if (gantt.$container)
					gantt.$container.removeAttribute("tabindex");
			},
			isEnabled: function () {
				return gantt.$container.hasAttribute("tabindex");
			},

			scrollHorizontal: function scrollHorizontal(dir) {
				var date = gantt.dateFromPos(gantt.getScrollState().x);
				var step = dir < 0 ? -gantt.config.step : gantt.config.step;
				date = gantt.date.add(date, step, gantt.config.scale_unit);
				gantt.scrollTo(gantt.posFromDate(date));
			},

			scrollVertical: function scrollVertical(dir) {
				var top = gantt.getScrollState().y;
				var step = gantt.config.row_height;
				gantt.scrollTo(null, top + (dir < 0 ? -1 : 1) * step);
			},

			keys: {
				"alt+left": function (e) {
					this.scrollHorizontal(-1);
				},
				"alt+right": function (e) {
					this.scrollHorizontal(1);
				},
				"alt+up": function (e) {
					this.scrollVertical(-1);
				},
				"alt+down": function (e) {
					this.scrollVertical(1);
				},

				// undo
				"ctrl+z": function () {
					if (gantt.undo) gantt.undo();
				},

				// redo
				"ctrl+r": function () {
					if (gantt.redo) gantt.redo();
				}
			}
		}
	);

	gantt.$keyboardNavigation.GanttNode.prototype.bindAll(gantt.$keyboardNavigation.GanttNode.prototype.keys);

};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.KeyNavNode = function () {
	};

	gantt.$keyboardNavigation.KeyNavNode.prototype = gantt._compose(
		gantt.$keyboardNavigation.EventHandler,
		{
			isValid: function () {
				return true;
			},
			fallback: function () {
				return null;
			},

			moveTo: function (element) {
				gantt.$keyboardNavigation.dispatcher.setActiveNode(element);
			},

			compareTo: function (b) {
				// good enough comparison of two random objects
				if (!b) return false;
				for (var i in this) {
					if (!!this[i] != !!b[i]) return false;

					var canStringifyThis = !!(this[i] && this[i].toString);
					var canStringifyThat = !!(b[i] && b[i].toString);
					if (canStringifyThat != canStringifyThis) return false;
					if (!(canStringifyThat && canStringifyThis)) {
						if (b[i] != this[i]) return false;
					} else {
						if (b[i].toString() != this[i].toString())
							return false;
					}
				}
			},

			getNode: function () {
			},
			focus: function () {
				var node = this.getNode();
				if (node) {
					node.setAttribute("tabindex", "-1");
					//node.className += " gantt_focused";
					if (node.focus) node.focus();
				}

			},
			blur: function () {
				var node = this.getNode();
				if (node) {
					node.setAttribute("tabindex", "-1");
					//node.className = (node.className || "").replace(/ ?gantt_focused/g, "");
				}
			}
		}
	);

};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.HeaderCell = function (index) {
		this.index = index || 0;
	};

	gantt.$keyboardNavigation.HeaderCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,

			isValid: function () {
				if (!gantt.config.show_grid) {
					if (gantt.getVisibleTaskCount())
						return false;
				}
				return !!gantt.getGridColumns()[this.index] || !gantt.getVisibleTaskCount();
			},
			fallback: function () {
				if (!gantt.config.show_grid) {
					if (gantt.getVisibleTaskCount()) {
						return new gantt.$keyboardNavigation.TaskRow();
					}
					return null;
				}
				var visibleColumns = gantt.getGridColumns();
				var index = this.index;
				while (index >= 0) {
					if (visibleColumns[index])
						break;
					index--;
				}
				if (visibleColumns[index]) {
					return new gantt.$keyboardNavigation.HeaderCell(index);
				} else {
					return null;
				}
			},

			getNode: function () {
				var cells = gantt.$grid_scale.childNodes;
				return cells[this.index];
			},


			keys: {

				"left": function () {
					if (this.index > 0) {
						this.moveTo(new gantt.$keyboardNavigation.HeaderCell(this.index - 1));
					}
				},
				"right": function () {
					var columns = gantt.getGridColumns();
					if (this.index < columns.length - 1) {
						this.moveTo(new gantt.$keyboardNavigation.HeaderCell(this.index + 1));
					}
				},
				"down": function () {
					var taskRow;
					var rootLevel = gantt.getChildren(gantt.config.root_id);
					if (rootLevel[0]) {
						taskRow = rootLevel[0];
					}
					if (taskRow) {
						if (gantt.config.keyboard_navigation_cells) {
							this.moveTo(new gantt.$keyboardNavigation.TaskCell(taskRow, this.index));
						} else {
							this.moveTo(new gantt.$keyboardNavigation.TaskRow(taskRow));
						}
					}
				},

				"end": function () {
					var columns = gantt.getGridColumns();
					this.moveTo(new gantt.$keyboardNavigation.HeaderCell(columns.length - 1));
				},
				"home": function () {
					this.moveTo(new gantt.$keyboardNavigation.HeaderCell(0));
				},


				// press header button
				"enter, space": function () {
					var node = document.activeElement;
					node.click();
				},

				// add new task
				"ctrl+enter": function () {
					gantt.createTask({}, this.taskId);
				}
			}
		}
	);

	gantt.$keyboardNavigation.HeaderCell.prototype.bindAll(gantt.$keyboardNavigation.HeaderCell.prototype.keys);

};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.TaskRow = function (taskId) {
		if (!taskId) {
			var rootLevel = gantt.getChildren(gantt.config.root_id);
			if (rootLevel[0]) {
				taskId = rootLevel[0];
			}
		}
		this.taskId = taskId;
		if (gantt.isTaskExists(this.taskId)) {
			this.index = gantt.getTaskIndex(this.taskId);
		}
	};

	gantt.$keyboardNavigation.TaskRow.prototype = gantt._compose(
		gantt.$keyboardNavigation.KeyNavNode,
		{
			_handlers: null,
			isValid: function () {
				return gantt.isTaskExists(this.taskId) && (gantt.getTaskIndex(this.taskId) > -1);
			},
			fallback: function () {
				if (!gantt.getVisibleTaskCount()) {
					var header = new gantt.$keyboardNavigation.HeaderCell();
					if (!header.isValid()) return null;
					else return header;
				} else {

					var nextIndex = -1;
					if (gantt.getTaskByIndex(this.index - 1)) {
						nextIndex = this.index - 1;
					} else if (gantt.getTaskByIndex(this.index + 1)) {
						nextIndex = this.index + 1;
					} else {
						var index = this.index;
						while (index >= 0) {
							if (gantt.getTaskByIndex(index) !== undefined) {
								nextIndex = index;
								break;
							}
							index--;
						}

					}
					if (nextIndex > -1) {
						return new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(nextIndex).id);
					}
				}
			},

			getNode: function () {
				if (gantt.isTaskExists(this.taskId) && gantt.isTaskVisible(this.taskId)) {
					if (gantt.config.show_grid) {
						return gantt.$grid.querySelector(".gantt_row[" + gantt.config.task_attribute + "='" + this.taskId + "']");
					} else {
						return gantt.getTaskNode(this.taskId);
					}
				}
			},

			focus: function () {
				var pos = gantt.getTaskPosition(gantt.getTask(this.taskId));
				var height = gantt.config.row_height;
				var scroll = gantt.getScrollState();
				if (pos.top < scroll.y || pos.top + height > (scroll.y + scroll.inner_height)) {

					gantt.scrollTo(null, pos.top - height*5);

				} else if (gantt.config.show_chart && (pos.left < scroll.x || pos.left > (scroll.x + scroll.inner_width))) {
					gantt.scrollTo(pos.left - gantt.config.task_scroll_offset);

				}

				gantt.$keyboardNavigation.KeyNavNode.prototype.focus.apply(this);
			},

			keys: {
				"pagedown": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(gantt.getVisibleTaskCount() - 1).id));
					}
				},
				"pageup": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(gantt.getTaskByIndex(0).id));
					}
				},
				"up": function () {
					var nextElement = null;
					var prevTask = gantt.getPrev(this.taskId);
					if (!prevTask) {
						nextElement = new gantt.$keyboardNavigation.HeaderCell();
					} else {
						nextElement = new gantt.$keyboardNavigation.TaskRow(prevTask);
					}
					this.moveTo(nextElement);
				},
				"down": function () {
					var nextTask = gantt.getNext(this.taskId);
					if (nextTask) {
						this.moveTo(new gantt.$keyboardNavigation.TaskRow(nextTask));
					}
				},

				// select
				"space": function (e) {
					if (gantt.getState().selected_task != this.taskId) {
						gantt.selectTask(this.taskId);
					} else {
						gantt.unselectTask(this.taskId);
					}
				},

				// collapse
				"ctrl+left": function (e) {
					gantt.close(this.taskId);
				},
				// expand
				"ctrl+right": function (e) {
					gantt.open(this.taskId);
				},

				// delete task
				"delete": function (e) {
					gantt.$click.buttons["delete"](this.taskId);
				},

				// open lightbox
				"enter": function () {
					gantt.showLightbox(this.taskId);
				},

				// add subtask
				"ctrl+enter": function () {
					gantt.createTask({}, this.taskId);
				}
			}
		}
	);
	gantt.$keyboardNavigation.TaskRow.prototype.bindAll(gantt.$keyboardNavigation.TaskRow.prototype.keys);

};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.TaskCell = function (taskId, index) {
		if (!taskId) {
			var rootLevel = gantt.getChildren(gantt.config.root_id);
			if (rootLevel[0]) {
				taskId = rootLevel[0];
			}
		}
		this.taskId = taskId;
		this.columnIndex = index || 0;
		this.index = gantt.getTaskIndex(this.taskId);
	};

	gantt.$keyboardNavigation.TaskCell.prototype = gantt._compose(
		gantt.$keyboardNavigation.TaskRow,
		{
			_handlers: null,
			isValid: function () {

				return gantt.$keyboardNavigation.TaskRow.prototype.isValid.call(this) && !!gantt.getGridColumns()[this.columnIndex];
			},
			fallback: function () {
				var node = gantt.$keyboardNavigation.TaskRow.prototype.fallback.call(this);
				if (node instanceof gantt.$keyboardNavigation.TaskRow) {
					var visibleColumns = gantt.getGridColumns();
					var index = this.columnIndex;
					while (index >= 0) {
						if (visibleColumns[index])
							break;
						index--;
					}
					if (visibleColumns[index]) {
						return new gantt.$keyboardNavigation.TaskCell(node.taskId, index);
					} else {
						return node;
					}
				}

			},

			getNode: function () {
				if (gantt.isTaskExists(this.taskId) && gantt.isTaskVisible(this.taskId)) {
					if (gantt.config.show_grid) {
						var row = gantt.$grid.querySelector(".gantt_row[" + gantt.config.task_attribute + "='" + this.taskId + "']");
						return row.childNodes[this.columnIndex];
					} else {
						return gantt.getTaskNode(this.taskId);
					}
				}
			},

			keys: {
				"up": function () {

					var nextElement = null;
					var prevTask = gantt.getPrev(this.taskId);
					if (!prevTask) {
						nextElement = new gantt.$keyboardNavigation.HeaderCell(this.columnIndex);
					} else {
						nextElement = new gantt.$keyboardNavigation.TaskCell(prevTask, this.columnIndex);
					}
					this.moveTo(nextElement);
				},
				"down": function () {
					var nextTask = gantt.getNext(this.taskId);
					if (nextTask) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(nextTask, this.columnIndex));
					}
				},
				"left": function () {
					if (this.columnIndex > 0) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex - 1));
					}
				},
				"right": function () {
					var columns = gantt.getGridColumns();
					if (this.columnIndex < columns.length - 1) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, this.columnIndex + 1));
					}
				},

				"end": function () {
					var columns = gantt.getGridColumns();
					this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, columns.length - 1));
				},
				"home": function () {
					this.moveTo(new gantt.$keyboardNavigation.TaskCell(this.taskId, 0));
				},
				"pagedown": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(gantt.getTaskByIndex(gantt.getVisibleTaskCount() - 1), this.columnIndex));
					}
				},
				"pageup": function () {
					if (gantt.getVisibleTaskCount()) {
						this.moveTo(new gantt.$keyboardNavigation.TaskCell(gantt.getTaskByIndex(0), this.columnIndex));
					}
				}
			}
		}
	);


	gantt.$keyboardNavigation.TaskCell.prototype.bindAll(gantt.$keyboardNavigation.TaskRow.prototype.keys);
	gantt.$keyboardNavigation.TaskCell.prototype.bindAll(gantt.$keyboardNavigation.TaskCell.prototype.keys);

};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	(function () {
		var modalsStack = [];

		function isModal() {
			return !!modalsStack.length;
		}

		function afterPopup(box) {
			setTimeout(function () {
				if (!isModal())
					gantt.focus();
			}, 1);
		}

		function startModal(box) {
			gantt.eventRemove(box, "keydown", trapFocus);
			gantt.event(box, "keydown", trapFocus);
			modalsStack.push(box);
			//gantt.$keyboardNavigation.dispatcher.disable();
		}

		function endModal() {
			var box = modalsStack.pop();
			if (box) {
				gantt.eventRemove(box, "keydown", trapFocus);
			}
			afterPopup(box);

		}


		function isTopModal(box) {
			return box == modalsStack[modalsStack.length - 1];
		}

		function trapFocus(event) {
			var event = event || window.event;
			var target = event.currentTarget;
			if (!isTopModal(target)) return;

			gantt.$keyboardNavigation.trapFocus(target, event);
		}

		function traceLightbox() {
			startModal(gantt.getLightbox());
		}

		gantt.attachEvent("onLightbox", traceLightbox);
		gantt.attachEvent("onAfterLightbox", endModal);
		gantt.attachEvent("onLightboxChange", function () {
			endModal();
			traceLightbox();
		});


		gantt.attachEvent("onAfterQuickInfo", function () {
			afterPopup();
		});

		gantt.attachEvent("onMessagePopup", function (box) {
			saveFocus();
			startModal(box);
		});
		gantt.attachEvent("onAfterMessagePopup", function () {
			endModal();
			restoreFocus();
		});

		var focusElement = null;

		function saveFocus() {
			focusElement = document.activeElement;
		}

		function restoreFocus() {
			setTimeout(function () {
				if (focusElement) {
					focusElement.focus();
					focusElement = null;
				}
			}, 1);
		}

		gantt.$keyboardNavigation.isModal = isModal;


	})();

};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function(gantt) {

	gantt.$keyboardNavigation.dispatcher = {
		isActive: false,
		activeNode: null,
		globalNode: new gantt.$keyboardNavigation.GanttNode(),

		enable: function () {
			this.isActive = true;
			this.globalNode.enable();
			this.setActiveNode(this.getActiveNode());
		},

		disable: function () {
			this.isActive = false;
			this.globalNode.disable();
		},

		isEnabled: function () {
			return !!this.isActive;
		},

		getDefaultNode: function () {
			var node;
			if (gantt.config.keyboard_navigation_cells) {
				node = new gantt.$keyboardNavigation.TaskCell();
			} else {
				node = new gantt.$keyboardNavigation.TaskRow();
			}

			if (!node.isValid()) {
				node = node.fallback();
			}
			return node;
		},

		setDefaultNode: function () {
			this.setActiveNode(this.getDefaultNode());
		},

		getActiveNode: function () {
			var node = this.activeNode;
			if (node && !node.isValid()) {
				node = node.fallback();
			}
			return node;
		},

		focusGlobalNode: function () {
			this.blurNode(this.globalNode);
			this.focusNode(this.globalNode);
		},

		setActiveNode: function (el) {
			if (this.activeNode) {
				if (this.activeNode.compareTo(el)) {
					return;
				}
			}
			if (this.isEnabled()) {
				this.blurNode(this.activeNode);
				this.activeNode = el;
				this.focusNode(this.activeNode);
			}
		},

		focusNode: function (el) {
			if (el && el.focus) {
				el.focus();
			}
		},
		blurNode: function (el) {
			if (el && el.blur) {
				el.blur();
			}
		},

		keyDownHandler: function (e) {

			if (gantt.$keyboardNavigation.isModal())
				return;

			if (!this.isEnabled())
				return;

			e = e || window.event;

			var ganttNode = this.globalNode;

			var command = gantt.$keyboardNavigation.shortcuts.getCommandFromEvent(e);

			var activeElement = this.getActiveNode();

			if (!activeElement) {
				this.setDefaultNode();
			} else if (activeElement.findHandler(command)) {
				activeElement.doAction(command, e);
			} else if (ganttNode.findHandler(command)) {
				ganttNode.doAction(command, e);
			}

		},
		_timeout: null,
		delay: function(callback, delay){

			clearTimeout(this._timeout);
			this._timeout = setTimeout(callback, delay || 1);

		}
	};

};

/***/ })
/******/ ]);