/*
@license

dhtmlxGantt v.4.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
//For fullscreen closing via ESC button
gantt._onFullScreenChange = function () {
	if (gantt.getState().fullscreen && (document.fullscreenElement === null ||
		document.mozFullScreenElement === null || document.webkitFullscreenElement === null ||
		document.msFullscreenElement === null)) {
		gantt.collapse();
	}
};

if (document.addEventListener) {
	document.addEventListener("webkitfullscreenchange", gantt._onFullScreenChange);
	document.addEventListener("mozfullscreenchange", gantt._onFullScreenChange);
	document.addEventListener("MSFullscreenChange", gantt._onFullScreenChange);
	//For IE on Win 10
	document.addEventListener("fullscreenChange", gantt._onFullScreenChange);
	document.addEventListener("fullscreenchange", gantt._onFullScreenChange);
}

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

	//IE11 Full screen Hack
	if(document.documentElement.msRequestFullscreen && gantt._obj) {
		window.setTimeout(function() {
			gantt._obj.style.width = window.outerWidth + "px";
		}, 1);
	}

	gantt._maximize();
	gantt.callEvent("onExpand", []);
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

	gantt._toggleFullScreen(false);
	gantt._maximize();
	gantt.callEvent("onCollapse", []);
};

(function(){
	var getState = gantt.getState;
	gantt.getState = function(){
		var state = getState.apply(this, arguments);
		state.fullscreen = !!this._expanded;
		return state;
	};
})();

gantt._maximize = function () {
	this._expanded = !this._expanded;
	this.render();
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