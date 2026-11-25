function addResizeListener(gantt){
	var containerStyles = window.getComputedStyle(gantt.$root);
	if(containerStyles.getPropertyValue("position") == "static"){
		gantt.$root.style.position = "relative";
	}

	var resizeWatcher = document.createElement('iframe');
	resizeWatcher.className = "gantt_container_resize_watcher";
	resizeWatcher.tabIndex = -1;
	if(gantt.ext.accessibility.isEnabled()){
		resizeWatcher.setAttribute("role", "none");
		resizeWatcher.setAttribute("aria-hidden", true);
	}

	if (gantt.env.isSalesforce){
		gantt.config.container_resize_method = "timeout";
	}

	// in some environments (namely, in SalesForce) iframe.contentWindow is not available
	gantt.$root.appendChild(resizeWatcher);
	if (resizeWatcher.contentWindow) {
		listenWindowResize(gantt, resizeWatcher.contentWindow);
	} else {
		// if so - ditch the iframe and fallback to listening the main window resize
		gantt.$root.removeChild(resizeWatcher);
		listenWindowResize(gantt, window);
	}
}

function listenWindowResize(gantt, window){
	var resizeTimeout = gantt.config.container_resize_timeout || 20;
	var resizeDelay;
	let previousSize = getContainerSize(gantt);

	if (gantt.config.container_resize_method == "timeout"){
		lowlevelResizeWatcher();
	}
	else {
		try {
			gantt.event(window, "resize", function () {
				if (gantt.$scrollbarRepaint) {
					gantt.$scrollbarRepaint = null;
				}
				else {
					// GS-2140. Don't repaint Gantt if it has the same sizes
					let currentSize = getContainerSize(gantt);
					if (previousSize.x == currentSize.x && previousSize.y == currentSize.y){
						return;
					}
					previousSize = currentSize;
					repaintGantt();
				}
			});
		}
		catch (e) {
			lowlevelResizeWatcher();
		}
	}

	function repaintGantt(){
		clearTimeout(resizeDelay);
		resizeDelay = setTimeout(function(){
			if(!gantt.$destroyed){
				gantt.render();
			}
		}, resizeTimeout);
	}

	var previousHeight = gantt.$root.offsetHeight;
	var previousWidth = gantt.$root.offsetWidth;	

	function lowlevelResizeWatcher(){
		if (gantt.$root.offsetHeight != previousHeight ||
				gantt.$root.offsetWidth != previousWidth){
				repaintGantt();
		}

		previousHeight = gantt.$root.offsetHeight;
		previousWidth = gantt.$root.offsetWidth;

		setTimeout(lowlevelResizeWatcher, resizeTimeout);
	}
}

function getContainerSize(gantt){
	return {
		x: gantt.$root.offsetWidth,
		y: gantt.$root.offsetHeight
	};
}

export default addResizeListener;