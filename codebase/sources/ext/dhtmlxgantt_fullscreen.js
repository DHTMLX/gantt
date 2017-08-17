/*
@license

dhtmlxGantt v.4.2.1 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
(function() {
	//Array of objects to run after fullscreen change
	// {
	//      confition: function() {}, // Condition to check screen changed
	//      callback: function() {} // Screen change callback
	// }
	gantt._fs_change = [];

	var getState = gantt.getState;
	gantt.getState = function () {
		var state = getState.apply(this, arguments);
		state.fullscreen = !!this._expanded;
		return state;
	};

	//For fullscreen closing via ESC button
	gantt._onFullScreenChange = function () {
		if(!gantt.$container){
			// do nothing if gantt is not yet initialized
			return;
		}

		var isFullScreen = gantt.getState().fullscreen;
		if (isFullScreen) {
			if (!gantt._isFullScreenActive()) {
				gantt.collapse();
			}
		}
		var fsChange = gantt._fs_change.length ? gantt._fs_change.pop() : null;

		gantt._expanded = !gantt._expanded;
		if (!fsChange) {
			gantt.render();
		}
		else {
			if (fsChange.condition()) {
				fsChange.callback();
			}
			else {
				var interval = setInterval(function () {
					if (fsChange.condition()) {
						clearInterval(interval);
						interval = null;
						fsChange.callback();
					}
				}, 10);

				setTimeout(function () {
					if (!interval) return;
					clearInterval(interval);
					fsChange.callback();
				}, 100);
			}
		}
	};

	gantt._isFullScreenActive = function () {
		return (document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		document.msFullscreenElement);
	};

	gantt._isFullScreenAvailable = function () {
		return document.fullscreenEnabled ||
			document.webkitFullscreenEnabled ||
			document.mozFullScreenEnabled ||
			document.msFullscreenEnabled;
	};

	gantt.event(document, "webkitfullscreenchange", gantt._onFullScreenChange);
	gantt.event(document, "mozfullscreenchange", gantt._onFullScreenChange);
	gantt.event(document, "MSFullscreenChange", gantt._onFullScreenChange);
//For IE on Win 10
	gantt.event(document, "fullscreenChange", gantt._onFullScreenChange);
	gantt.event(document, "fullscreenchange", gantt._onFullScreenChange);

	gantt.expand = function () {
		if (!gantt.callEvent("onBeforeExpand", []))
			return;
		gantt._toggleFullScreen(true);
		var ganttBlock = gantt._obj;

		do {
			ganttBlock._position = ganttBlock.style.position || "";
			ganttBlock.style.position = "static";
		} while ((ganttBlock = ganttBlock.parentNode) && ganttBlock.style);
		ganttBlock = gantt._obj;
		ganttBlock.style.position = "absolute";
		ganttBlock._width = ganttBlock.style.width;
		ganttBlock._height = ganttBlock.style.height;
		ganttBlock.style.width = ganttBlock.style.height = "100%";
		ganttBlock.style.top = ganttBlock.style.left = "0px";

		var top = document.body;
		top.scrollTop = 0;

		top = top.parentNode;
		if (top)
			top.scrollTop = 0;
		document.body._overflow = document.body.style.overflow || "";
		document.body.style.overflow = "hidden";
		document.body._width = document.body.style.width;
		document.body._height = document.body.style.height;

		var callback = function () {
			//IE11 Full screen Hack
			if (document.documentElement.msRequestFullscreen && gantt._obj) {
				gantt._obj.style.width = document.body.style.width = window.outerWidth + "px";
				gantt._obj.style.height = document.body.style.height = window.outerHeight + "px";
			}

			gantt.render();
			gantt.callEvent("onExpand", []);
		};

		if (!gantt._isFullScreenAvailable()) {
			gantt._expanded = !gantt._expanded;
			callback();
		}
		else {
			var oldGanttHeight = window.outerHeight;
			var oldGanttWidth = window.outerWidth;
			gantt._fs_change.push({
				condition: function () {
					return oldGanttHeight < window.outerHeight && oldGanttWidth <= window.outerWidth;
				},
				callback: callback
			});
		}
	};

	gantt.collapse = function () {
		if (!gantt.callEvent("onBeforeCollapse", []))
			return;
		var ganttBlock = gantt._obj;
		do {
			ganttBlock.style.position = ganttBlock._position;
		} while ((ganttBlock = ganttBlock.parentNode) && ganttBlock.style);
		ganttBlock = gantt._obj;
		ganttBlock.style.width = ganttBlock._width;
		ganttBlock.style.height = ganttBlock._height;
		document.body.style.overflow = document.body._overflow;
		document.body.style.width = document.body._width;
		document.body.style.height = document.body._height;

		gantt._toggleFullScreen(false);

		var callback = function () {
			gantt.render();
			gantt.callEvent("onCollapse", []);
		};

		if (!gantt._isFullScreenAvailable()) {
			gantt._expanded = !gantt._expanded;
			callback();
		}
		else {
			var oldGanttHeight = window.outerHeight;
			var oldGanttWidth = window.outerWidth;
			gantt._fs_change.push({
				condition: function () {
					return oldGanttHeight > window.outerHeight && oldGanttWidth >= window.outerWidth;
				},
				callback: callback
			});
		}
	};

	gantt._toggleFullScreen = function (on) {
		if (on || (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement)) {  // current working methods
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}
	};
})();