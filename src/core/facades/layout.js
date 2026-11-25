function createLayoutFacade(){

	function getTimeline(gantt){
		return gantt.$ui.getView("timeline");
	}

	function getGrid(gantt){
		return gantt.$ui.getView("grid");
	}

	function getBaseCell(gantt){
		var timeline = getTimeline(gantt);
		if (timeline && !timeline.$config.hidden){
			return timeline;
		} else{
			var grid = getGrid(gantt);
			if (grid && !grid.$config.hidden){
				return grid;
			} else {
				return null;
			}
		}
	}

	function getVerticalScrollbar(gantt){
		var baseCell = null;
		// GS-1150: if we reorder or resize something in the grid, we should obtain the grid container
		var gridDrag = false;
		var gridMarkers = [
			".gantt_drag_marker.gantt_grid_resize_area",
			".gantt_drag_marker .gantt_row.gantt_row_task",
			".gantt_drag_marker.gantt_grid_dnd_marker"
		];
		gridMarkers.forEach(function (selector) {
			gridDrag = gridDrag || !!document.querySelector(selector);
		});
		if (gridDrag){
			baseCell = getGrid(gantt);
		} else{
			baseCell = getBaseCell(gantt);
		}

		// GS-1827. If there is no grid and timeline, there is no scrollbar for them
		if (!baseCell){
			return null;
		}

		var verticalScrollbar = getAttachedScrollbar(gantt, baseCell, "scrollY");
		return verticalScrollbar;
	}

	function getHorizontalScrollbar(gantt){
		var baseCell = getBaseCell(gantt);
		if (!baseCell || baseCell.id == "grid"){
			return null; // if the timeline is not displayed, do not return the scrollbar
		}
		var horizontalScrollbar = getAttachedScrollbar(gantt, baseCell, "scrollX");
		return horizontalScrollbar;
	}

	function getAttachedScrollbar(gantt, cell, type){
		var attachedScrollbar = cell.$config[type];
		var scrollbarView = gantt.$ui.getView(attachedScrollbar);
		return scrollbarView;
	}

	var DEFAULT_VALUE = "DEFAULT_VALUE";

	function tryCall(getView, method, args, fallback){
		var view = getView(this);
		if (!(view && view.isVisible())) {
			if(fallback){
				return fallback();
			}else{
				return DEFAULT_VALUE;
			}
		} else {
			return view[method].apply(view, args);
		}
	}

	return {

		getColumnIndex: function(name) {
			var res = tryCall.call(this, getGrid, "getColumnIndex", [name]);
			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},

		dateFromPos: function(x) {
			var res = tryCall.call(this, getTimeline, "dateFromPos", Array.prototype.slice.call(arguments));
			if(res === DEFAULT_VALUE){
				return this.getState().min_date;
			}else{
				return res;
			}
		},

		posFromDate: function(date) {
			var res = tryCall.call(this, getTimeline, "posFromDate", Array.prototype.slice.call(arguments));
			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},

		getRowTop: function(index) {
			var self = this;
			var res = tryCall.call(self, getTimeline, "getRowTop", [index],
				function(){ return tryCall.call(self, getGrid, "getRowTop", [index]);}
				);

			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},

		getTaskTop: function(id) {
			var self = this;
			var res = tryCall.call(self, getTimeline, "getItemTop", [id],
				function(){ return tryCall.call(self, getGrid, "getItemTop", [id]);}
			);

			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},


		getTaskPosition: function(task, start_date, end_date) {
			var res = tryCall.call(this, getTimeline, "getItemPosition", [task, start_date, end_date]);

			if(res === DEFAULT_VALUE){
				var top = this.getTaskTop(task.id);
				var height = this.getTaskBarHeight(task.id);

				return {
					left: 0,
					top: top,
					height: height,
					width: 0
				};
			}else{
				return res;
			}
		},

		getTaskBarHeight: function(taskId, isMilestoneRender) {
			var self = this;
			var res = tryCall.call(self, getTimeline, "getBarHeight", [taskId, isMilestoneRender],
				function(){ return tryCall.call(self, getGrid, "getItemHeight", [taskId]);}
			);

			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},

		getTaskHeight: function(taskId) {
			var self = this;
			var res = tryCall.call(self, getTimeline, "getItemHeight", [taskId],
				function(){ return tryCall.call(self, getGrid, "getItemHeight", [taskId]);}
			);

			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},


		columnIndexByDate: function(date) {
			var res = tryCall.call(this, getTimeline, "columnIndexByDate", [date]);
			if(res === DEFAULT_VALUE){
				return 0;
			}else{
				return res;
			}
		},

		roundTaskDates: function(task) {
			tryCall.call(this, getTimeline, "roundTaskDates", [task]);
		},

		getScale: function() {
			var res = tryCall.call(this, getTimeline, "getScale", []);
			if(res === DEFAULT_VALUE){
				return null;
			}else{
				return res;
			}
		},

		getTaskNode: function(id) {
			var timeline = getTimeline(this);
			if (!timeline || !timeline.isVisible()) {
				return null;
			} else {
				var node = timeline._taskRenderer.rendered[id];
				if(!node){
					var domAttr = timeline.$config.item_attribute;
					node = timeline.$task_bars.querySelector("[" +domAttr+ "='"+id+"']");
				}

				return node || null;
			}
		},


		getLinkNode: function(id) {
			var timeline = getTimeline(this);
			if (!timeline.isVisible()) {
				return null;
			} else {
				return timeline._linkRenderer.rendered[id];
			}
		},

		scrollTo: function(left, top){
			var vertical = getVerticalScrollbar(this);
			var horizontal = getHorizontalScrollbar(this);

			var oldH = {position: 0},
				oldV = {position: 0};

			if(vertical){
				oldV = vertical.getScrollState();
			}
			if(horizontal){
				oldH = horizontal.getScrollState();
			}

			var scrollHorizontal = (horizontal && left*1 == left);
			var scrollVertical = (vertical && top*1 == top);
			var scrollBoth = scrollHorizontal && scrollVertical;

			if(scrollBoth){
				// some views will be scrolled both horizontally and vertically and smart rendering can be called twice
				// set flag in order not to invoke smart rendering at the horizontal scroll stage
				// so it will repaint only once when the scroll is completed
				var verticalViews = vertical._getLinkedViews();
				var horizontalViews = horizontal._getLinkedViews();

				var commonViews = [];
				for(var i = 0; i < verticalViews.length; i++){
					for(var j = 0; j < horizontalViews.length; j++){

						if(verticalViews[i].$config.id && horizontalViews[j].$config.id && verticalViews[i].$config.id === horizontalViews[j].$config.id){
							commonViews.push(verticalViews[i].$config.id);
						}
					}
				}
			}

			if (scrollHorizontal){
				if(commonViews){
					commonViews.forEach((function(viewId){
						this.$ui.getView(viewId).$config.$skipSmartRenderOnScroll = true;
					}).bind(this));
				}

				horizontal.scroll(left);
				if(commonViews){
					commonViews.forEach((function(viewId){
						this.$ui.getView(viewId).$config.$skipSmartRenderOnScroll = false;
					}).bind(this));
				}
			}
			if(scrollVertical){
				vertical.scroll(top);
			}

			var newV = {position: 0},
				newH = {position: 0};
			if(vertical){
				newV = vertical.getScrollState();
			}
			if(horizontal){
				newH = horizontal.getScrollState();
			}

			this.callEvent("onGanttScroll", [oldH.position, oldV.position, newH.position, newV.position]);
		},

		showDate: function(date){
			var date_x = this.posFromDate(date);
			var scroll_to = Math.max(date_x - this.config.task_scroll_offset, 0);
			this.scrollTo(scroll_to);
		},
		showTask: function(id) {
			var pos = this.getTaskPosition(this.getTask(id));

			// GS-1261: we need to show the start_date even in the RTL mode
			var leftPos = pos.left;
			if (this.config.rtl) leftPos = pos.left + pos.width;

			var left = Math.max(leftPos - this.config.task_scroll_offset, 0);

			var dataHeight = this._scroll_state().y;
			var top;
			if(!dataHeight){
				top = pos.top;
			}else{
				top = pos.top - (dataHeight - this.getTaskBarHeight(id))/2;
			}

			this.scrollTo(left, top);
			// GS-1150: if the grid and timeline have different scrollbars, we need to scroll thegrid to show the task
			var gridCell = getGrid(this);
			var timelineCell = getTimeline(this);
			if (gridCell && timelineCell && gridCell.$config.scrollY != timelineCell.$config.scrollY){
				var gridScrollbar = getAttachedScrollbar(this, gridCell, "scrollY");
				gridScrollbar.scrollTo(null, top);
			}
		},
		_scroll_state: function(){
			var result = {
				x: false,
				y: false,
				x_pos: 0,
				y_pos: 0,
				scroll_size: this.config.scroll_size + 1,//1px for inner content
				x_inner: 0,
				y_inner: 0
			};

			var scrollVer = getVerticalScrollbar(this),
				scrollHor = getHorizontalScrollbar(this);
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
		},
		getScrollState: function(){
			var state = this._scroll_state();
			return { x:state.x_pos, y:state.y_pos, inner_width:state.x, inner_height:state.y, width: state.x_inner, height: state.y_inner };
		},

		getLayoutView: function(cellName){
			return this.$ui.getView(cellName);
		},

		scrollLayoutCell: function(cellName, left, top){
			const cell = this.$ui.getView(cellName);
			if (!cell){
				return false;
			}
			if (left !== null){
				const horizontalScroll = this.$ui.getView(cell.$config.scrollX);
				if (horizontalScroll){
					horizontalScroll.scrollTo(left, null);
				}
			}
			if (top !== null){
				const verticalScroll = this.$ui.getView(cell.$config.scrollY);
				if (verticalScroll){
					verticalScroll.scrollTo(null, top);
				}
			}
		}

	};

}

export default createLayoutFacade;