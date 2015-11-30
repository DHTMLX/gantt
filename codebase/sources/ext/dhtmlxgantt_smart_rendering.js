/*
@license

dhtmlxGantt v.4.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt.config.smart_rendering = true;

gantt._smart_render = {
	getViewPort: function(){
		var scrollSize = this.getScrollSizes();

		var scrollPos = gantt._restore_scroll_state();
		scrollPos.y = Math.min(scrollSize.y_inner - scrollSize.y, scrollPos.y);
		return {
			y: scrollPos.y,
			y_end: scrollPos.y + scrollSize.y
		};
	},
	getScrollSizes: function(){
		var scroll = gantt._scroll_sizes();
		scroll.x = scroll.x || 0;
		scroll.y = scroll.y || gantt._order.length*gantt.config.row_height;
		return scroll;
	},
	isInViewPort: function(item, viewPort){
		return !!(item.y < viewPort.y_end && item.y_end > viewPort.y);
	},

	isTaskDisplayed: function(id){
		return this.isInViewPort(this.getTaskPosition(id), this.getViewPort());
	},
	isLinkDisplayed: function(id){
		return this.isInViewPort(this.getLinkPosition(id), this.getViewPort());
	},
	getTaskPosition: function(id){
		var y = gantt.getTaskTop(id);
		return {
			y: y,
			y_end: y + gantt.config.row_height
		};
	},
	getLinkPosition: function(id){
		var link = gantt.getLink(id);
		var from_pos = gantt.getTaskTop(link.source),
			to_pos = gantt.getTaskTop(link.target);

		return {
			y: Math.min(from_pos, to_pos),
			y_end: Math.max(from_pos, to_pos) + gantt.config.row_height
		};
	},
	getRange: function(buffer){
		buffer = buffer || 0;

		var port = this.getViewPort();

		var firstTask = Math.floor(Math.max(0, port.y) / gantt.config.row_height) - buffer;
		var lastTask = Math.ceil(Math.max(0, port.y_end) / gantt.config.row_height) + buffer;

		var visible_ids = gantt._order.slice(firstTask, lastTask);
		return visible_ids;
	},
	_redrawItems: function(renderers, visibleItems){
		for(var i in renderers){
			var render = renderers[i];

			for(var i in render.rendered){
				render.hide(i);
			}

			for(var t = 0; t < visibleItems.length; t++){
				render.restore(visibleItems[t]);
			}
		}
	},

	_getVisibleTasks: function(){
		return gantt._get_tasks_data();
	},
	_getVisibleLinks: function(){
		var visible_links = [];
		var links = gantt._get_links_data();

		for(var i = 0; i < links.length; i++){
			if(this.isLinkDisplayed(links[i].id)){
				visible_links.push(links[i]);
			}
		}
		return visible_links;
	},
	updateRender: function(){
		this._redrawItems(gantt._get_task_renderers(), this._getVisibleTasks());
		this._redrawItems(gantt._get_link_renderers(), this._getVisibleLinks());
	},

	cached:{},

	_takeFromCache: function(id, payload, cacheName){
		if(!this.cached[cacheName])
			this.cached[cacheName] = null;
		var cached = this.cached[cacheName];

		if(id !== undefined){
			if(!cached){
				cached = this.cached[cacheName] = {};
			}

			if(cached[id] === undefined){
				cached[id] = payload(id);
			}

			return cached[id];
		}else{
			if(!cached){
				cached = payload();
			}
			return cached;
		}

	},
	initCache:function(){
		var caches = [
			"getLinkPosition",
			"getTaskPosition",
			"isTaskDisplayed",
			"isLinkDisplayed",
			"getViewPort",
			"getScrollSizes"
		];

		for(var i = 0; i < caches.length; i++){
			var method = caches[i];
			var payload = gantt.bind(this[method], this);

			this[method] = (function(calculate, cache){
				return function(id){
					return this._takeFromCache(id, calculate, cache);
				};
			})(payload, method);
		}

		this.invalidateCache();
		this.initCache = function(){};
	},
	invalidateCache: function(){
		var smartRender = this;


		function clearViewPortCache(){
			smartRender.cached.getViewPort = null;
			smartRender.cached.getScrollSizes = null;
			smartRender.cached.isTaskDisplayed = null;
			smartRender.cached.isLinkDisplayed = null;
		}
		function clearDataCache(){
			smartRender.cached.isTaskDisplayed = null;
			smartRender.cached.isLinkDisplayed = null;
			smartRender.cached.getLinkPosition = null;
			smartRender.cached.getTaskPosition = null;
		}

		function clearAllCache(){
			clearViewPortCache();
			clearDataCache();
		}

		function clearTaskCache(id){
			if(smartRender.cached.isTaskDisplayed){
				smartRender.cached.isTaskDisplayed[id] = undefined;
			}
			if(smartRender.cached.getTaskPosition){
				smartRender.cached.getTaskPosition[id] = undefined;
			}
		}


		function clearLinkCache(id){
			if(smartRender.cached.isLinkDisplayed){
				smartRender.cached.isLinkDisplayed[id] = undefined;
			}
			if(smartRender.cached.getLinkPosition){
				smartRender.cached.getLinkPosition[id] = undefined;
			}
		}
		gantt.attachEvent("onClear", function(){
			clearAllCache();
		});
		gantt.attachEvent("onParse", function(){
			clearAllCache();
		});

		gantt.attachEvent("onAfterLinkUpdate", clearLinkCache);
		gantt.attachEvent("onAfterTaskAdd", clearAllCache);
		gantt.attachEvent("onAfterTaskDelete", clearAllCache);
		gantt.attachEvent("onAfterTaskUpdate", clearTaskCache);
		gantt.attachEvent("onGanttScroll",  clearViewPortCache);
		gantt.attachEvent("onDataRender", clearAllCache);

		this.invalidateCache = function(){};
	}

};

gantt._smart_render.initCache();
gantt.attachEvent("onGanttScroll", function(oldLeft, oldTop, left, top){
	if(gantt.config.smart_rendering){
		if(oldTop != top){
			gantt._smart_render.updateRender();
		}
	}
});

gantt.attachEvent("onDataRender", function() {
	if(gantt.config.smart_rendering){
		gantt._smart_render.updateRender();
	}
});

(function(){
	function proxy(original, override){
		return function(){
			if(gantt.config.smart_rendering){
				return override.apply(this, arguments);
			}else{
				return original.apply(this, arguments);
			}
		};
	}

	var taskFilters = gantt._get_task_filters;
	gantt._get_task_filters = proxy(gantt._get_task_filters, function(){
		var res = taskFilters.call(gantt);
		res.push(function(id){
			if(gantt.config.smart_rendering){
				return gantt._smart_render.isTaskDisplayed(id);
			}else{
				return true;
			}
		});
		return res;
	});


	var linkFilters = gantt._get_link_filters;
	gantt._get_link_filters = proxy(gantt._get_link_filters, function(){
		var res = linkFilters.call(gantt);
		res.push(function(id){
			if(gantt.config.smart_rendering){
				return gantt._smart_render.isLinkDisplayed(id);
			}else{
				return true;
			}
		});
		return res;
	});

	gantt._get_data_range = proxy(gantt._get_data_range, function(){
		return this._smart_render.getRange();
	});
})();

