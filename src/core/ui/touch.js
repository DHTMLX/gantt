export default function(gantt) {

	gantt.config.touch_drag = 75; //nearly immediate dnd
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

	gantt.attachEvent("onGanttReady", function(){
		if (gantt.$container)	{
			addTouchEvents();
		}
	});
	gantt.attachEvent("onGanttLayoutReady", function(){
		if (gantt.$container)	{
				gantt.attachEvent("onGanttRender", addTouchEvents, {once: true});
		}
	});

	const DRAG_HANDLE_CLASSES = ["gantt_task_drag", "gantt_task_progress_drag", "gantt_link_point", "gantt_link_control"];

	function classifyTouchTarget(node) {
		let rank = -1;
		let inBar = false;
		let target = node;
		while (target) {
			if (target.classList) {
				if (!inBar && target.classList.contains("gantt_task_line")) {
					inBar = true;
				}
				if (rank === -1) {
					for (let i = 0; i < DRAG_HANDLE_CLASSES.length; i++) {
						if (target.classList.contains(DRAG_HANDLE_CLASSES[i])) {
							rank = i;
							break;
						}
					}
				}
			}
			target = target.parentNode;
		}
		return { rank, inBar };
	}

	function addTouchEvents(){
		if (gantt.config.touch != "force")
			gantt.config.touch = gantt.config.touch &&
				((navigator.userAgent.indexOf("Mobile") != -1) ||
					(navigator.userAgent.indexOf("iPad") != -1) ||
					(navigator.userAgent.indexOf("Android") != -1) ||
					(navigator.userAgent.indexOf("Touch") != -1)) ||
					((navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

		if (gantt.config.touch) {
			// IE doesn't support touch events. In other cases, a user may connect
			// a touch device at any time, so it should work in the forced touch mode
			const touchEventsSupported = !gantt.env.isIE || !!window.navigator.maxTouchPoints;

			if (touchEventsSupported) {
				gantt._touch_events(["touchmove", "touchstart", "touchend"], function (ev) {
					if (ev.touches && ev.touches.length > 1) return null;
					if (ev.touches[0]) {
						const touch = ev.touches[0];
						let target = ev.target;
						if (ev.type === "touchstart") {
							const native = classifyTouchTarget(target);
							
							if (native.inBar && native.rank !== 0) {
								const root = (target.getRootNode && target.getRootNode()) || document;
								const atPoint = root.elementFromPoint(touch.clientX, touch.clientY);
								const atRank = atPoint ? classifyTouchTarget(atPoint).rank : -1;
								if (atRank !== -1 && (native.rank === -1 || atRank < native.rank)) {
									target = atPoint;
								}
							}
						}
						return {
							target: target,
							pageX: touch.pageX,
							pageY: touch.pageY,
							clientX: touch.clientX,
							clientY: touch.clientY
						};
					} else {
						return ev;
					}
				}, function (ev) {
					return ev.defaultPrevented;
				});
			} else if (window.PointerEvent) {
				gantt._touch_events(["pointermove", "pointerdown", "pointerup"], function (ev) {
					if (ev.pointerType == "mouse") return null;
					return ev;
				}, function (ev) {
					return (!ev || (ev.pointerType == "mouse" ));
				});
			}

		}
	}


	function findTargetView(event){
		var allViews = gantt.$layout.getCellsByType("viewCell");

		for(var i = 0; i < allViews.length; i++){
			var box = allViews[i].$view.getBoundingClientRect();
			if(event.clientX >= box.left && event.clientX <= box.right &&
				event.clientY <= box.bottom && event.clientY >= box.top){
					return allViews[i];
				}
		}
	}

	function getScrollState(view){
		var scrollX = view.$config.scrollX ? gantt.$ui.getView(view.$config.scrollX) : null;
		var scrollY = view.$config.scrollY ? gantt.$ui.getView(view.$config.scrollY) : null;

		var scrollState = {x: null, y: null};
		if(scrollX){
			var state = scrollX.getScrollState();
			if(state.visible){
				scrollState.x = scrollX.$view.scrollLeft;
			}
		}
		if(scrollY){
			var state = scrollY.getScrollState();
			if(state.visible){
				scrollState.y = scrollY.$view.scrollTop;
			}
		}
		return scrollState;
	}

	function scrollView(view, left, top){
		var scrollX = view.$config.scrollX ? gantt.$ui.getView(view.$config.scrollX) : null;
		var scrollY = view.$config.scrollY ? gantt.$ui.getView(view.$config.scrollY) : null;

		if(scrollX){
			scrollX.scrollTo(left, null);
		}
		if(scrollY){
			scrollY.scrollTo(null, top);
		}
	}

	function getTaskDND(){
		var tasksDnD;
		if(gantt.$ui.getView("timeline")){
			tasksDnD = gantt.$ui.getView("timeline")._tasks_dnd;
		}
		return tasksDnD;
	}

	var touchHandlers = [];

//we can't use native scrolling, as we need to sync momentum between different parts
//so we will block native scroll and use the custom one
//in future we can add custom momentum
	gantt._touch_events = function (names, accessor, ignore) {
		//webkit on android need to be handled separately
		var dblclicktime = 0;
		var actionMode = false;
		var scrollMode = false;
		var actionStart = null;
		var previousActionStart = null;
		var scrollState;
		var longTapTimer = null;
		var currentDndId = null;
		var dndNodes = [];
		var targetView = null;
		let multiTouchEvents = {};

		for(var i = 0; i < touchHandlers.length; i++){
			gantt.eventRemove(touchHandlers[i][0], touchHandlers[i][1], touchHandlers[i][2]);
		}
		touchHandlers = [];

		//touch move
		touchHandlers.push([gantt.$container, names[0], function (e) {
			var tasksDnD = getTaskDND();

				if (ignore(e)) return;

				//ignore common and scrolling moves
				if (!actionMode) return;

				if (longTapTimer) clearTimeout(longTapTimer);

				var source = accessor(e);
				if (tasksDnD && (tasksDnD.drag.id || tasksDnD.drag.start_drag)) {
					tasksDnD.on_mouse_move(source);
					if (e.preventDefault)
						e.preventDefault();
					e.cancelBubble = true;
					return false;
				}
				if (!gantt._prevent_touch_scroll) {
					if (source && actionStart) {
						var dx = actionStart.pageX - source.pageX;
						var dy = actionStart.pageY - source.pageY;
						if (!scrollMode && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
							scrollMode = true;
							//gantt._touch_scroll_active = scroll_mode = true;
							dblclicktime = 0;

							if(targetView){
								scrollState = getScrollState(targetView);
							}else{
								scrollState = gantt.getScrollState();
							}
						}

						if (scrollMode) {

							var newScrollState;
							var scrollX = scrollState.x + dx;
							var scrollY = scrollState.y + dy;
							if(targetView){
								scrollView(targetView, scrollX, scrollY);
								newScrollState = getScrollState(targetView);
							}else{
								gantt.scrollTo(scrollX, scrollY);
								newScrollState = gantt.getScrollState();
							}

							if ((scrollState.x != newScrollState.x && dy > 2 * dx) ||
								(scrollState.y != newScrollState.y && dx > 2 * dy )) {
								return block_action(e);
							}
						}
					}
					return block_action(e);
				}
				return true;
			}]);

		// prevent page drag on touch move
		try{
			document.addEventListener('touchmove', function(e) {
				if (gantt._touch_drag) {
					block_action(e);
				}
			}, { passive: false });
		}
		catch(e){
			// eslint-disable-next-line no-console
			console.warn("Cannot prevent touch event for the page drag");
		}

		//block touch context menu in IE10
		touchHandlers.push([this.$container, "contextmenu", function (e) {
			if (actionMode)
				return block_action(e);
		}]);

		//touch start
		touchHandlers.push([this.$container, names[1], function (e) {
			multiTouchEvents = e.touches.length;
			// block pull-to-refresh
			if(document && document.body){
				document.body.classList.add("gantt_touch_active");
			}

			if (ignore(e)) return;
			if (e.touches && e.touches.length > 1) {
				actionMode = false;
				return;
			}

			actionStart = accessor(e);
			targetView = findTargetView(actionStart);
			if (!gantt._locate_css(actionStart, "gantt_hor_scroll") && !gantt._locate_css(actionStart, "gantt_ver_scroll")) {
				actionMode = true;
			}
			var tasksDnD = getTaskDND();

			//long tap
			longTapTimer = setTimeout(function () {
				var taskId = gantt.locate(actionStart);
				if (tasksDnD && (taskId && !gantt._locate_css(actionStart, "gantt_link_control") && !gantt._locate_css(actionStart, "gantt_grid_data"))) {
					tasksDnD.on_mouse_down(actionStart);

					if (tasksDnD.drag && tasksDnD.drag.start_drag) {
						// we need that as touch events break if the target node is removed from the DOM
						cloneTaskRendered(taskId);
						tasksDnD._start_dnd(actionStart);
						gantt._touch_drag = true;

						gantt.refreshTask(taskId);

						gantt._touch_feedback();
					}

				}

				longTapTimer = null;
			}, gantt.config.touch_drag);
		}]);

		//touch end
		touchHandlers.push([this.$container, names[2], function (e) {
			if(document && document.body){
				document.body.classList.remove("gantt_touch_active");
			}
			if (ignore(e)) return;
			if (longTapTimer) clearTimeout(longTapTimer);
			gantt._touch_drag = false;
			actionMode = false;
			var source = accessor(e);

			var tasksDnD = getTaskDND();

			if(tasksDnD)
				tasksDnD.on_mouse_up(source);

			if (currentDndId && gantt.isTaskExists(currentDndId)) {
				gantt.refreshTask(currentDndId);
				if(dndNodes.length){
					dndNodes.forEach(function(node){
						if(node.parentNode){
							node.parentNode.removeChild(node);
						}
					});
					gantt._touch_feedback();
				}
			}

			//gantt._touch_scroll_active = action_mode = scroll_mode = false;
			actionMode = scrollMode = false;
			dndNodes = [];
			currentDndId = null;

			//dbl-tap handling
			if (actionStart && dblclicktime) {
				var now = new Date();
				// doubletap shouldn't happen with multitouch
				const noMultitouch = multiTouchEvents <= 1;
				// double click events shouldn't fire when we quickly tap on different nodes
				const sameTarget = previousActionStart && previousActionStart.target.innerHTML == actionStart.target.innerHTML;
				if ((now - dblclicktime) < 500 && noMultitouch && sameTarget) {

					var mouseEvents = gantt.$services.getService("mouseEvents");
					mouseEvents.onDoubleClick(actionStart);
					block_action(e);
				} else {
					dblclicktime = now;
					previousActionStart = actionStart;
				}
			} else {
				dblclicktime = new Date();
			}
		}]);

		for(var i = 0; i < touchHandlers.length; i++){
			gantt.event(touchHandlers[i][0], touchHandlers[i][1], touchHandlers[i][2]);
		}

		//common helper, prevents event
		function block_action(e) {
			if (e && e.preventDefault && e.cancelable){
				e.preventDefault();
			}
			e.cancelBubble = true;
			return false;
		}

		function cloneTaskRendered(taskId) {
			const renders = gantt._getTaskLayers();
			let task = gantt.getTask(taskId);
			if (task) {
				let visible = gantt.isTaskVisible(taskId);
				if (visible){
					currentDndId = taskId;
					for (let i = 0; i < renders.length; i++) {
						const taskNode = renders[i].rendered[taskId];
						if (taskNode && taskNode.getAttribute(gantt.config.task_attribute) && taskNode.getAttribute(gantt.config.task_attribute) == taskId) {
							const copy = taskNode.cloneNode(true);
							dndNodes.push(taskNode);
							renders[i].rendered[taskId] = copy;
							taskNode.style.display = "none";
							copy.className += " gantt_drag_move ";
							taskNode.parentNode.appendChild(copy);
							//return copy;
						}
						if (task.rollup){
							const parentNodes = renders[i].rendered;
							for (let parentId in parentNodes) {
								const parentNode = parentNodes[parentId];
								const rollupNode = parentNode.querySelector(`[${gantt.config.task_attribute}="${task.id}"]`);
								if (rollupNode) {
									// move the rollup node to a different parent as the task bar will be repainted
									// and the initial node will be lost
									const copy = rollupNode.cloneNode(true);
									parentNode.appendChild(copy);

									gantt.$task_bars.appendChild(rollupNode);
									rollupNode.style.display = "none";

									// don't add the node as rendered otherwise it will be lost:
									// renders[i].rendered[taskId] = taskNode;
									// instead, add it to dndNodes as its elements will be removed after drag
									dndNodes.push(rollupNode);
								}
							}
						}
					}
				} else if (task.$split_subtask){
					let renderedParent = task.$rendered_parent;
					visible = gantt.isTaskVisible(renderedParent);
					if (!visible){
						return;
					}
					currentDndId = taskId;
					for (let i = 0; i < renders.length; i++) {
						const parent = renders[i].rendered[renderedParent];
						let taskNode;
						if (parent && parent.childNodes){
							taskNode = parent.querySelector(`[${gantt.config.task_attribute}="${task.id}"]`);
						}
						if (taskNode) {
							// move the child node to a different parent as the task bar will be repainted
							// and the initial node will be lost
							const copy = taskNode.cloneNode(true);
							taskNode.parentNode.appendChild(copy);

							gantt.$task_bars.appendChild(taskNode);
							taskNode.style.display = "none";

							// don't add the node as rendered otherwise it will be lost:
							// renders[i].rendered[taskId] = taskNode;
							// instead, add it to dndNodes as its elements will be removed after drag
							dndNodes.push(taskNode);

							taskNode = null;
						}
					}
				}
			}
		}
	};

};