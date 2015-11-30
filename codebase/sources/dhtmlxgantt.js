/*
@license

dhtmlxGantt v.4.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/

gantt = {
	version:"4.0.0"
};

/*jsl:ignore*/
//import from dhtmlxcommon.js
gantt.event = function(el, event, handler){
	if (el.addEventListener)
		el.addEventListener(event, handler, false);

	else if (el.attachEvent)
		el.attachEvent("on"+event, handler);
};


gantt.eventRemove = function(el, event, handler){
	if (el.removeEventListener)
		el.removeEventListener(event, handler, false);

	else if (el.detachEvent)
		el.detachEvent("on"+event, handler);
};


/** Overrides event functionality.
 *  Includes all default methods from dhtmlx.common but adds _silentStart, _silendEnd
 *   @desc:
 *   @type: private
 */
gantt._eventable=function(obj){
    obj._silent_mode = false;
    obj._silentStart = function() {
        this._silent_mode = true;
    };
    obj._silentEnd = function() {
        this._silent_mode = false;
    };
	obj.attachEvent=function(name, catcher, callObj){
		name='ev_'+name.toLowerCase();
		if (!this[name])
			this[name]=new this._eventCatcher(callObj||this);

		return(name+':'+this[name].addEvent(catcher)); //return ID (event name & event ID)
	};
	obj.callEvent=function(name, arg0){
        if (this._silent_mode) return true;
		name='ev_'+name.toLowerCase();
		if (this[name])
			return this[name].apply(this, arg0);
		return true;
	};
	obj.checkEvent=function(name){
		return (!!this['ev_'+name.toLowerCase()]);
	};
	obj._eventCatcher=function(obj){
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
	obj.detachEvent=function(id){
		if (id){
			var list = id.split(':');           //get EventName and ID
			this[list[0]].removeEvent(list[1]); //remove event
		}
	};
	obj.detachAllEvents = function(){
		for (var name in this){
			if (name.indexOf("ev_") === 0)
				delete this[name];
		}
	};
	obj = null;
};


/*jsl:end*/


gantt.copy = function(object) {
    var i, t, result; // iterator, types array, result

    if (object && typeof object == "object") {
        result = {};
        t = [Array,Date,Number,String,Boolean];
        for (i=0; i<t.length; i++) {
            if (object instanceof t[i])
                result = i ? new t[i](object) : new t[i](); // first one is array
        }

        for (i in object) {
            if (Object.prototype.hasOwnProperty.apply(object, [i]))
                result[i] = gantt.copy(object[i]);
        }
    }
    return result || object;
};

gantt.mixin = function(target, source, force){
    for (var f in source)
        if ((!target[f] || force)) target[f]=source[f];
    return target;
};


gantt.defined = function(obj) {
    return typeof(obj) != "undefined";
};

gantt.uid = function() {
    if (!this._seed)
        this._seed = (new Date()).valueOf();
    
    this._seed++;
    return this._seed;
};


//creates function with specified "this" pointer
gantt.bind=function(functor, object){
	if(functor.bind)
		return functor.bind(object);
	else
		return function(){ return functor.apply(object,arguments); };
};


//returns position of html element on the page
gantt._get_position = function(elem) {
	var top=0, left=0;
    if (elem.getBoundingClientRect) { //HTML5 method
        var box = elem.getBoundingClientRect();
        var body = document.body;
        var docElem = document.documentElement;
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;
        top  = box.top +  scrollTop - clientTop;
        left = box.left + scrollLeft - clientLeft;
        return { y: Math.round(top), x: Math.round(left), width:elem.offsetWidth, height:elem.offsetHeight };
    } else { //fallback to naive approach
        while(elem) {
            top = top + parseInt(elem.offsetTop,10);
            left = left + parseInt(elem.offsetLeft,10);
            elem = elem.offsetParent;
        }
        return { y: top, x: left, width:elem.offsetWidth, height: elem.offsetHeight};
    }
};


gantt._detectScrollSize = function(){
    var div = document.createElement("div");
    div.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;";

    document.body.appendChild(div);
    var width = div.offsetWidth-div.clientWidth;
    document.body.removeChild(div);

    return width;
};

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

		gantt.init(obj.id, start, end);
		obj.firstChild.style.border = "none";
		var method_name="_viewRestore";
		obj = null;
		this.callEvent("_onContentAttach",[]);

		return this.dataObj;
	};

}


gantt._eventable(gantt);

gantt._click = {};
gantt._dbl_click = {};
gantt._context_menu = {};
gantt._on_click = function(e) {
    e = e || window.event;
    var trg = e.target || e.srcElement;
    var id = gantt.locate(e);

	var res = true;
	if (id !== null){
		res = !gantt.checkEvent("onTaskClick") || gantt.callEvent("onTaskClick", [id, e]);
	}else{
		gantt.callEvent("onEmptyClick", [e]);
	}

	if(res){
		var default_action = gantt._find_ev_handler(e, trg, gantt._click, id);
		if(!default_action)
			return;

		if(id && gantt.getTask(id) && gantt.config.select_task){
			gantt.selectTask(id);
		}
	}

};
gantt._on_contextmenu = function(e){
	e = e || window.event;
	var src = e.target||e.srcElement,
		taskId = gantt.locate(src),
		linkId = gantt.locate(src, gantt.config.link_attribute);

	var res = !gantt.checkEvent("onContextMenu") || gantt.callEvent("onContextMenu", [taskId, linkId, e]);
	if(!res){
		if(e.preventDefault)
			e.preventDefault();
		else
			e.returnValue = false;
	}
	return res;
};
gantt._find_ev_handler = function(e, trg, hash, id){
	var res = true;
	while (trg){
		var css = gantt._getClassName(trg);
		if (css) {
			css = css.split(" ");
			for (var i = 0; i < css.length; i++) {
				if (!css[i]) continue;
				if (hash[css[i]]){
					var handler = hash[css[i]].call(gantt, e, id, trg);
					res = res && !(typeof handler != "undefined" && handler !== true);
				}
			}
		}
		trg=trg.parentNode;
	}
	return res;
};
gantt._on_dblclick = function(e) {
	e = e || window.event;
	var trg = e.target || e.srcElement;
    var id = gantt.locate(e);
	var res = !gantt.checkEvent("onTaskDblClick") || gantt.callEvent("onTaskDblClick", [id, e]);
	if(res){
		var default_action = gantt._find_ev_handler(e, trg, gantt._dbl_click, id);
		if(!default_action)
			return;

		if (id !== null && gantt.getTask(id)){
			if(res && gantt.config.details_on_dblclick){
				gantt.showLightbox(id);
			}
		}
	}
};

gantt._on_mousemove = function(e){
	if (gantt.checkEvent("onMouseMove")){
    	var id = gantt.locate(e);
    	gantt._last_move_event = e;
		gantt.callEvent("onMouseMove", [id,e]);
	}
};
gantt._DnD = function _DnD(obj, config) {
    if(config){
        this._settings = config;
    }
    gantt._eventable(this);
    gantt.event(obj, "mousedown", gantt.bind(function(e) {
        config.original_target = {target : e.target || e.srcElement};
        this.dragStart(obj, e);
    }, this));

};
gantt._DnD.prototype = {
    dragStart: function(obj, e) {
        this.config = {
            obj: obj,
            marker: null,
            started: false,
            pos: this.getPosition(e),
            sensitivity: 4
        };
        if(this._settings)
			gantt.mixin(this.config, this._settings, true);

        var mousemove = gantt.bind(function(e) { return this.dragMove(obj, e); }, this);
        var scroll = gantt.bind(function(e) { return this.dragScroll(obj, e); }, this);

        var limited_mousemove = gantt.bind(function(e) {
            if(gantt.defined(this.config.updates_per_second)){
                if(!gantt._checkTimeout(this, this.config.updates_per_second))
                    return true;
            }

			return mousemove(e);
        }, this);

        var mouseup = gantt.bind(function(e) {
            gantt.eventRemove(document.body, "mousemove", limited_mousemove);
            gantt.eventRemove(document.body, "mouseup", mouseup);
            return this.dragEnd(obj);
        }, this);


        gantt.event(document.body, "mousemove", limited_mousemove);
        gantt.event(document.body, "mouseup", mouseup);
        document.body.className += " gantt_noselect";
    },
    dragMove: function(obj, e) {
        if (!this.config.marker && !this.config.started) {
            var pos = this.getPosition(e);
            var diff_x = pos.x - this.config.pos.x;
            var diff_y = pos.y - this.config.pos.y;
            var distance = Math.sqrt(Math.pow(Math.abs(diff_x), 2) + Math.pow(Math.abs(diff_y), 2));

            if (distance > this.config.sensitivity) {
                // real drag starts here,
                // when user moves mouse at first time after onmousedown
                this.config.started = true;
                this.config.ignore = false;
                if (this.callEvent("onBeforeDragStart", [obj, this.config.original_target]) === false) {
                    this.config.ignore = true;
                    return true;
                }

                // initialize dnd marker
                var marker = this.config.marker = document.createElement("div");
                marker.className = "gantt_drag_marker";
                marker.innerHTML = "Dragging object";
                document.body.appendChild(marker);

                this.callEvent("onAfterDragStart", [obj, this.config.original_target]);
            } else
                this.config.ignore = true;
        }
        if (!this.config.ignore) {
            e.pos = this.getPosition(e);
            this.config.marker.style.left = e.pos.x + "px";
            this.config.marker.style.top = e.pos.y + "px";
            this.callEvent("onDragMove", [obj,e]);
        }
    },

    dragEnd: function(obj) {
        if (this.config.marker) {
            this.config.marker.parentNode.removeChild(this.config.marker);
            this.config.marker = null;
            this.callEvent("onDragEnd", []);
        }
        document.body.className = document.body.className.replace(" gantt_noselect", "");
    },

    getPosition: function(e) {
        var x = 0, y = 0;
        e = e || window.event;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        } else if (e.clientX || e.clientY) 	{
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        return { x:x, y:y };
    }
};
gantt._init_grid = function () {
	this._click.gantt_close = this.bind(function (e, id, trg) {
		this.close(id);
		return false;
	}, this);
	this._click.gantt_open = this.bind(function (e, id, trg) {
		this.open(id);
		return false;
	}, this);


	this._click.gantt_row = this.bind(function (e, id, trg) {
		if (id !== null) {
			var task = this.getTask(id);
			if(this.config.scroll_on_click)
				this.showDate(task.start_date);
			this.callEvent("onTaskRowClick", [id, trg]);
		}
	}, this);

	this._click.gantt_grid_head_cell = this.bind(function (e, id, trg) {
		var column = trg.getAttribute("column_id");

		if (!this.callEvent("onGridHeaderClick", [column, e]))
			return;

		if (column == "add") {
			this._click.gantt_add(e, this.config.root_id);
			return;
		}

		if (this.config.sort) {
			var sorting_method = column,
				conf;

			for(var i = 0; this.config.columns.length; i++){
				if(this.config.columns[i].name == column){
					conf = this.config.columns[i];
					break;
				}
			}

			if(conf && conf.sort !== undefined && conf.sort !== true){
				sorting_method = conf.sort;

				if(!sorting_method){ // column sort property 'false', no sorting
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
	}, this);

	if (!this.config.sort && this.config.order_branch) {
		this._init_dnd();
	}

	this._click.gantt_add = this.bind(function (e, id, trg) {
		if (this.config.readonly) return;

		var item = { };
		this.createTask(item, id ? id : this.config.root_id);

		return false;
	}, this);

	if(this._init_resize){
		this._init_resize();
	}

};

gantt._render_grid = function () {
	if (this._is_grid_visible()) {
		this._calc_grid_width();
		this._render_grid_header();
	}
};

gantt._calc_grid_width = function () {
	var columns = this.getGridColumns();
	var cols_width = 0;
	var unknown = [];
	var width = [];

	for (var i = 0; i < columns.length; i++) {
		var v = parseInt(columns[i].width, 10);
		if (window.isNaN(v)) {
			v = 50;
			unknown.push(i);
		}
		width[i] = v;
		cols_width += v;
	}

	if (this.config.autofit || unknown.length) {
		var diff = this._get_grid_width() - cols_width;
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
	}else{
		this.config.grid_width = cols_width;
	}
};

gantt._render_grid_header = function () {
	var columns = this.getGridColumns();
	var cells = [];
	var width = 0,
		labels = this.locale.labels;

	var lineHeigth = this.config.scale_height - 2;

	for (var i = 0; i < columns.length; i++) {
		var last = i == columns.length - 1;
		var col = columns[i];
		var colWidth = col.width*1;
		if (last && this._get_grid_width() > width + colWidth)
			col.width = colWidth = this._get_grid_width() - width;
		width += colWidth;
		var sort = (this._sort && col.name == this._sort.name) ? ("<div class='gantt_sort gantt_" + this._sort.direction + "'></div>") : "";
		var cssClass = ["gantt_grid_head_cell",
			("gantt_grid_head_" + col.name),
			(last ? "gantt_last_cell" : ""),
			this.templates.grid_header_class(col.name, col)].join(" ");

		var style = "width:" + (colWidth - (last ? 1 : 0)) + "px;";
		var label = (col.label || labels["column_" + col.name]);
		label = label || "";
		var cell = "<div class='" + cssClass + "' style='" + style + "' column_id='" + col.name + "'>" + label + sort + "</div>";
		cells.push(cell);
	}
	this.$grid_scale.style.height = (this.config.scale_height - 1) + "px";
	this.$grid_scale.style.lineHeight = lineHeigth + "px";
	this.$grid_scale.style.width = (width - 1) + "px";
	this.$grid_scale.innerHTML = cells.join("");
};


gantt._render_grid_item = function (item) {
	if (!gantt._is_grid_visible())
		return null;

	var columns = this.getGridColumns();
	var cells = [];
	var width = 0;
	for (var i = 0; i < columns.length; i++) {
		var last = i == columns.length - 1;
		var col = columns[i];
		var cell;

		var value;
		if (col.name == "add") {
			value = "<div class='gantt_add'></div>";
		} else {
			if (col.template)
				value = col.template(item);
			else
				value = item[col.name];

			if (value instanceof Date)
				value = this.templates.date_grid(value, item);
			value = "<div class='gantt_tree_content'>" + value + "</div>";
		}
		var css = "gantt_cell" + (last ? " gantt_last_cell" : "");

		var tree = "";
		if (col.tree) {
			for (var j = 0; j < item.$level; j++)
				tree += this.templates.grid_indent(item);

			var has_child = this._has_children(item.id);
			if (has_child) {
				tree += this.templates.grid_open(item);
				tree += this.templates.grid_folder(item);
			} else {
				tree += this.templates.grid_blank(item);
				tree += this.templates.grid_file(item);
			}
		}
		var style = "width:" + (col.width - (last ? 1 : 0)) + "px;";
		if (this.defined(col.align))
			style += "text-align:" + col.align + ";";
		cell = "<div class='" + css + "' style='" + style + "'>" + tree + value + "</div>";
		cells.push(cell);
	}
	var css = item.$index % 2 === 0 ? "" : " odd";
	css += (item.$transparent) ? " gantt_transparent" : "";

	css += (item.$dataprocessor_class ? " " + item.$dataprocessor_class : "");

	if (this.templates.grid_row_class) {
		var css_template = this.templates.grid_row_class.call(this, item.start_date, item.end_date, item);
		if (css_template)
			css += " " + css_template;
	}

	if (this.getState().selected_task == item.id) {
		css += " gantt_selected";
	}
	var el = document.createElement("div");
	el.className = "gantt_row" + css;
	el.style.height = this.config.row_height + "px";
	el.style.lineHeight = (gantt.config.row_height) + "px";
	el.setAttribute(this.config.task_attribute, item.id);
	el.innerHTML = cells.join("");
	return el;
};


gantt.open = function (id) {
	gantt._set_item_state(id, true);
	this.callEvent("onTaskOpened", [id]);
};
gantt.close = function (id) {
	gantt._set_item_state(id, false);
	this.callEvent("onTaskClosed", [id]);
};
gantt._set_item_state = function (id, state) {
	if (id && this._pull[id]) {
		this._pull[id].$open = state;
		gantt._refresh_on_toggle_element(id);
	}
};

gantt._refresh_on_toggle_element = function(id){
	this.refreshData();
};

gantt._is_grid_visible = function () {
	return (this.config.grid_width && this.config.show_grid);
};
gantt._get_grid_width = function () {
	if (this._is_grid_visible()) {
		if (this._is_chart_visible()) {
			return this.config.grid_width;
		} else {
			return this._x;
		}
	} else {
		return 0;
	}
};


gantt.moveTask = function (sid, tindex, parent) {
	//target id as 4th parameter
	var id = arguments[3];
	if (id) {
		if (id === sid) return;

		parent = this.getParent(id);
		tindex = this.getTaskIndex(id);
	}
	if(sid == parent){
		return;
	}
	parent = parent || this.config.root_id;
	var source = this.getTask(sid);
	var source_pid = this.getParent(source.id);
	var sbranch = this.getChildren(this.getParent(source.id));

	var tbranch = this.getChildren(parent);
	if (tindex == -1)
		tindex = tbranch.length + 1;
	if (source_pid == parent) {
		var sindex = this.getTaskIndex(sid);
		if (sindex == tindex) return;
	}


	/*
	prevent moving to another sub-branch:

	gantt.attachEvent("onBeforeTaskMove", function(id, parent, tindex){
	 var task = gantt.getTask(id);
	 if(task.parent != parent)
	  return false;
	 return true;
	});
	*/
	if(this.callEvent("onBeforeTaskMove", [sid, parent, tindex]) === false)
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

	//var childTree = this._getTaskTree(sid);
	//for(var i = 0; i < childTree.length; i++){
	//	var item = this._pull[childTree[i]];
	//	if(item)

	source.$level = this.calculateTaskLevel(source);
	//}

	if(tindex*1 > 0){
		if(id){
			source.$drop_target = (this.getTaskIndex(sid) > this.getTaskIndex(id) ? "next:" : '') + id;
		}else{
			source.$drop_target = "next:" + gantt.getPrevSibling(sid);
		}
	}else if(tbranch[tindex*1 + 1]){
		source.$drop_target = tbranch[tindex*1 + 1];
	}else{
		source.$drop_target = parent;
	}

	if(!this.callEvent("onAfterTaskMove", [sid, parent, tindex]))
		return;

	this.refreshData();

};

gantt._init_dnd = function () {
	var dnd = new gantt._DnD(this.$grid_data, {updates_per_second: 60});
	if (this.defined(this.config.dnd_sensitivity))
		dnd.config.sensitivity = this.config.dnd_sensitivity;

	dnd.attachEvent("onBeforeDragStart", this.bind(function (obj, e) {
		var el = this._locateHTML(e);
		if (!el) return false;
		if (this.hideQuickInfo) this._hideQuickInfo();

		var id = this.locate(e);

		var task = gantt.getTask(id);

		if(gantt._is_readonly(task))
			return false;

		dnd.config.initial_open_state = task.$open;
		if (!this.callEvent("onRowDragStart", [id, e.target || e.srcElement, e])) {
			return false;
		}

	}, this));

	dnd.attachEvent("onAfterDragStart", this.bind(function (obj, e) {
		var el = this._locateHTML(e);
		dnd.config.marker.innerHTML = el.outerHTML;
		dnd.config.id = this.locate(e);
		var task = this.getTask(dnd.config.id);
		dnd.config.index = this.getTaskIndex(dnd.config.id);
		dnd.config.parent = task.parent;
		task.$open = false;
		task.$transparent = true;
		this.refreshData();
	}, this));


	dnd.lastTaskOfLevel = function (level) {
		var ids = gantt._order,
			pull = gantt._pull,
			last_item = null;
		for (var i = 0, len = ids.length; i < len; i++) {
			if (pull[ids[i]].$level == level) {
				last_item = pull[ids[i]];
			}
		}
		return last_item ? last_item.id : null;
	};
	dnd._getGridPos = this.bind( function(e){
		var pos = this._get_position(this.$grid_data);

		// row offset
		var x = pos.x;
		var y = e.pos.y - 10;

		// prevent moving row out of grid_data container
		if (y < pos.y) y = pos.y;
		if (y > pos.y + this.$grid_data.offsetHeight - this.config.row_height) y = pos.y + this.$grid_data.offsetHeight - this.config.row_height;

		pos.x = x;
		pos.y = y;
		return pos;
	}, this);
	dnd.attachEvent("onDragMove", this.bind(function (obj, e) {
		var dd = dnd.config;
		var pos = dnd._getGridPos(e);


		// setting position of row
		dd.marker.style.left = pos.x + 10 + "px";
		dd.marker.style.top = pos.y + "px";

		//previous action might cause page scroll appear thus change position of the gantt, need to recalculate
		pos = dnd._getGridPos(e);

		var x = pos.x,
			y = pos.y;

		// highlight row when mouseover

		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;

		var target = document.elementFromPoint(pos.x - scrollLeft + 1, y - scrollTop);
		var el = this.locate(target);

		var item = this.getTask(dnd.config.id);
		if (!this.isTaskExists(el)) {
			el = dnd.lastTaskOfLevel(gantt.config.order_branch_free ? item.$level : 0);
			if (el == dnd.config.id) {
				el = null;
			}
		}

		function allowedLevel (next, item){
			return (next.$level == item.$level || gantt.config.order_branch_free);
		}

		if (this.isTaskExists(el)) {
			var box = gantt._get_position(target);
			var over = this.getTask(el);


			if (box.y + target.offsetHeight / 2 < y) {
				//hovering over bottom part of item, check can be drop to bottom
				var index = this.getGlobalTaskIndex(over.id);
				var next = this._pull[this._order[index + 1]]; //adds +1 when hovering over placeholder
				if (next) {
					if (next.id != item.id)
						over = next; //there is a valid target
					else
						return;
				} else {
					//we at end of the list, check and drop at the end of list
					next = this._pull[this._order[index]];
					if (allowedLevel(next, item) && next.id != item.id) {
						this.moveTask(item.id, -1, this.getParent(next.id));

						return;
					}
				}
			}
			//if item is on different level, check the one before it
			var index = this.getGlobalTaskIndex(over.id),
				prev = this._pull[this._order[index-1]];

			var shift = 1;
			while((!prev || prev.id == over.id) && index - shift >= 0){
				prev = this._pull[this._order[index-shift]];
				shift++;
			}

			if (item.id == over.id) return;
			//replacing item under cursor
			if (allowedLevel(over, item) && item.id != over.id) {
				this.moveTask(item.id, 0, 0, over.id);

			}else if(over.$level == item.$level - 1 && !gantt.getChildren(over.id).length){
				this.moveTask(item.id, 0, over.id);

			} else if(prev && (allowedLevel(prev, item)) && (item.id != prev.id)){
				this.moveTask(item.id, -1, this.getParent(prev.id));

			}
		}
		return true;
	}, this));


	dnd.attachEvent("onDragEnd", this.bind(function () {
		var task = this.getTask(dnd.config.id);
		if(this.callEvent("onBeforeRowDragEnd",[dnd.config.id, dnd.config.parent, dnd.config.index]) === false) {
			this.moveTask(dnd.config.id, dnd.config.index, dnd.config.parent);
			task.$drop_target = null;
		}else{
			//var newLevel = task.$level,
			//	oldLevel = !this.isTaskExists(dnd.config.parent) ? 0 : (this.getTask(dnd.config.parent).$level + 1);
			//var levelChanged = newLevel != oldLevel;

			this.callEvent("onRowDragEnd", [dnd.config.id, task.$drop_target]);
		}

		task.$transparent = false;
		task.$open = dnd.config.initial_open_state;
		this.refreshData();

	}, this));
};

/* will be overwriten in order to provide hide/show column functionality in some editions */
gantt.getGridColumns = function () {
	return this.config.columns;
};


gantt._has_children = function(id){
	return this.getChildren(id).length > 0;
};
// --#include core/grid_resize.js
// --#include core/dynamic_loading.js
// --#include core/grid_column_api.js

gantt._scale_helpers = {
	getSum : function(sizes, from, to){
		if(to === undefined)
			to = sizes.length - 1;
		if(from === undefined)
			from = 0;

		var summ = 0;
		for(var i=from; i <= to; i++)
			summ += sizes[i];

		return summ;
	},
	setSumWidth : function(sum_width, scale, from, to){
		var parts = scale.width;

		if(to === undefined)
			to = parts.length - 1;
		if(from === undefined)
			from = 0;
		var length = to - from + 1;

		if(from > parts.length - 1 || length <= 0 || to > parts.length - 1)
			return;

		var oldWidth = this.getSum(parts, from, to);

		var diff = sum_width - oldWidth;

		this.adjustSize(diff, parts, from, to);
		this.adjustSize(- diff, parts, to + 1);

		scale.full_width = this.getSum(parts);
	},
	splitSize : function(width, count){
		var arr = [];
		for(var i=0; i < count; i++) arr[i] = 0;

		this.adjustSize(width, arr);
		return arr;

	},
	adjustSize : function(width, parts, from, to){
		if(!from)
			from = 0;
		if(to === undefined)
			to = parts.length - 1;

		var length = to - from + 1;

		var full = this.getSum(parts, from, to);

		var shared = 0;

		for(var i = from; i <= to; i++){
			var share = Math.floor(width*(full ? (parts[i]/full) : (1/length)));

			full -= parts[i];
			width -= share;
			length--;

			parts[i] += share;
			shared += share;
		}
		parts[parts.length - 1] += width;
		//parts[parts.length - 1] += width - shared;
	},
	sortScales : function(scales){
		function cellSize(unit, step){
			var d = new Date(1970, 0, 1);
			return gantt.date.add(d, step, unit) - d;
		}

		scales.sort(function(a, b){
			if(cellSize(a.unit, a.step) < cellSize(b.unit, b.step)){
				return 1;
			}else if(cellSize(a.unit, a.step) > cellSize(b.unit, b.step)){
				return -1;
			}else{
				return 0;
			}
		});
	},
	primaryScale : function(){

		gantt._init_template("date_scale");

		return {
			unit: gantt.config.scale_unit,
			step: gantt.config.step,
			template : gantt.templates.date_scale,
			date : gantt.config.date_scale,
			css: gantt.templates.scale_cell_class
		};
	},

	prepareConfigs : function(scales, min_coll_width, container_width, scale_height){
		var heights = this.splitSize(scale_height, scales.length);
		var full_width = container_width;

		var configs = [];
		for(var i=scales.length-1; i >= 0; i--){
			var main_scale = (i == scales.length - 1);
			var cfg = this.initScaleConfig(scales[i]);
			if(main_scale){
				this.processIgnores(cfg);
			}

			this.initColSizes(cfg, min_coll_width, full_width, heights[i]);
			this.limitVisibleRange(cfg);

			if(main_scale){
				full_width = cfg.full_width;
			}

			configs.unshift(cfg);
		}


		for( var i =0; i < configs.length-1; i++){
			this.alineScaleColumns(configs[configs.length-1], configs[i]);
		}
		for(var i = 0; i < configs.length; i++){
			this.setPosSettings(configs[i]);
		}
		return configs;

	},
	setPosSettings: function(config){
		for(var i = 0, len = config.trace_x.length; i < len; i++){
			config.left.push((config.width[i - 1] || 0) + (config.left[i - 1] || 0));
		}
	},

	_ignore_time_config : function(date){
		if(this.config.skip_off_time){
			return !this.isWorkTime(date);
		}
		return false;
	},
	//defined in an extension
	processIgnores : function(config){
		config.ignore_x = {};
		config.display_count = config.count;
	},
	initColSizes : function(config, min_col_width, full_width, line_height){
		var cont_width = full_width;

		config.height = line_height;

		var column_count = config.display_count === undefined ? config.count : config.display_count;

		if(!column_count)
			column_count = 1;

		config.col_width = Math.floor(cont_width/column_count);

		if(min_col_width){
			if (config.col_width < min_col_width){
				config.col_width = min_col_width;
				cont_width = config.col_width * column_count;
			}
		}
		config.width = [];
		var ignores = config.ignore_x || {};
		for(var i =0; i < config.trace_x.length; i++){
			if(ignores[config.trace_x[i].valueOf()] || (config.display_count == config.count)){
				config.width[i] = 0;
			}else{
				config.width[i] = 1;
			}
		}

		this.adjustSize(cont_width - this.getSum(config.width)/* 1 width per column from the code above */, config.width);
		config.full_width = this.getSum(config.width);
	},
	initScaleConfig : function(config){
		var cfg = gantt.mixin({
			count:0,
			col_width:0,
			full_width:0,
			height:0,
			width:[],
			left:[],
			trace_x:[]
		}, config);

		this.eachColumn(config.unit, config.step, function(date){
			cfg.count++;
			cfg.trace_x.push(new Date(date));
		});

		return cfg;
	},
	iterateScales : function(lower_scale, upper_scale, from, to, callback){
		var upper_dates = upper_scale.trace_x;
		var lower_dates = lower_scale.trace_x;

		var prev = from || 0;
		var end = to || (lower_dates.length - 1);
		var prevUpper = 0;
		for(var up=1; up < upper_dates.length; up++){
			for(var next=prev; next <= end; next++){
				if(+lower_dates[next] == +upper_dates[up]){
					if(callback){
						callback.apply(this, [prevUpper, up, prev, next]);
					}
					prev = next;
					prevUpper = up;
					continue;
				}
			}
		}
	},
	alineScaleColumns : function(lower_scale, upper_scale, from, to){
		this.iterateScales(lower_scale, upper_scale, from, to, function(upper_start, upper_end, lower_start, lower_end){
			var targetWidth = this.getSum(lower_scale.width, lower_start, lower_end - 1);
			var actualWidth = this.getSum(upper_scale.width, upper_start, upper_end - 1);
			if(actualWidth != targetWidth){
				this.setSumWidth(targetWidth, upper_scale, upper_start, upper_end - 1);
			}

		});
	},

	eachColumn : function(unit, step, callback){
		var start = new Date(gantt._min_date),
			end = new Date(gantt._max_date);
		if(gantt.date[unit + "_start"]){
			start = gantt.date[unit + "_start"](start);
		}

		var curr = new Date(start);
		if(+curr >= +end){
			end = gantt.date.add(curr, step, unit);
		}
		while(+curr < +end){
			callback.call(this, new Date(curr));
			var tzOffset = curr.getTimezoneOffset();
			curr = gantt.date.add(curr, step, unit);
			curr = gantt._correct_dst_change(curr, tzOffset, step, unit);
			if(gantt.date[unit + '_start'])
				curr = gantt.date[unit + "_start"](curr);
		}
	},
	limitVisibleRange : function(cfg){
		var dates = cfg.trace_x;

		var left = 0, right = cfg.width.length-1;
		var diff = 0;
		if(+dates[0] < +gantt._min_date && left != right){
			var width = Math.floor(cfg.width[0] * ((dates[1] - gantt._min_date)/ (dates[1] - dates[0])));
			diff += cfg.width[0] - width;
			cfg.width[0] = width;

			dates[0] = new Date(gantt._min_date);
		}

		var last = dates.length - 1;
		var lastDate = dates[last];
		var outDate = gantt.date.add(lastDate, cfg.step, cfg.unit);
		if(+outDate > +gantt._max_date && last > 0){
			var width = cfg.width[last] - Math.floor(cfg.width[last] * ((outDate - gantt._max_date)/(outDate - lastDate)));
			diff += cfg.width[last] - width;
			cfg.width[last] = width;
		}

		if(diff){
			var full = this.getSum(cfg.width);
			var shared = 0;
			for(var i =0; i < cfg.width.length; i++){
				var share = Math.floor(diff*(cfg.width[i]/full));
				cfg.width[i] += share;
				shared += share;
			}
			this.adjustSize(diff - shared, cfg.width);
		}

	}
};
// --#include core/scales_ignore.js
gantt._tasks_dnd = {
	drag : null,
	_events:{
		before_start:{},
		before_finish:{},
		after_finish:{}
	},
	_handlers:{},
	init:function(){
		this.clear_drag_state();
		var drag = gantt.config.drag_mode;
		this.set_actions();

		var evs = {
			"before_start":"onBeforeTaskDrag",
			"before_finish":"onBeforeTaskChanged",
			"after_finish":"onAfterTaskDrag"
		};
		//for now, all drag operations will trigger the same events
		for(var stage in this._events){
			for(var mode in drag){
				this._events[stage][mode] = evs[stage];
			}
		}

		this._handlers[drag.move] = this._move;
		this._handlers[drag.resize] = this._resize;
		this._handlers[drag.progress] = this._resize_progress;

	},
	set_actions:function(){
		var data = gantt.$task_data;
		gantt.event(data, "mousemove", gantt.bind(function(e){
			this.on_mouse_move(e||event);
		}, this));
		gantt.event(data, "mousedown", gantt.bind(function(e){
			this.on_mouse_down(e||event);
		}, this));
		gantt.event(data, "mouseup", gantt.bind(function(e){
			this.on_mouse_up(e||event);
		}, this));
	},

	clear_drag_state : function(){
		this.drag = {
			id:null,
			mode:null,
			pos:null,
			start_x:null,
			start_y:null,
			obj:null,
			left:null
		};
	},
	_resize : function(ev, shift, drag){
		var cfg = gantt.config;
		var coords_x = this._drag_task_coords(ev, drag);
		if(drag.left){
			ev.start_date = gantt.dateFromPos(coords_x.start + shift);
			if(!ev.start_date){
				ev.start_date = new Date(gantt.getState().min_date);
			}
		}else{
			ev.end_date =gantt.dateFromPos(coords_x.end + shift);
			if(!ev.end_date){
				ev.end_date = new Date(gantt.getState().max_date);
			}
		}

		if (ev.end_date - ev.start_date < cfg.min_duration){
			if(drag.left)
				ev.start_date = gantt.calculateEndDate(ev.end_date, -1);
			else
				ev.end_date = gantt.calculateEndDate(ev.start_date, 1);
		}
		gantt._init_task_timing(ev);
	},
	_resize_progress:function(ev, shift, drag){
		var coords_x = this._drag_task_coords(ev, drag);

		var diff = Math.max(0, drag.pos.x - coords_x.start);
		ev.progress = Math.min(1, diff / (coords_x.end-coords_x.start));
	},
	_move : function(ev, shift, drag){
		var coords_x = this._drag_task_coords(ev, drag);
		var new_start = gantt.dateFromPos(coords_x.start + shift),
			new_end = gantt.dateFromPos(coords_x.end + shift);
		if(!new_start){
			ev.start_date = new Date(gantt.getState().min_date);
			ev.end_date = gantt.dateFromPos(gantt.posFromDate(ev.start_date) + (coords_x.end - coords_x.start));
		}else if(!new_end){
			ev.end_date = new Date(gantt.getState().max_date);
			ev.start_date = gantt.dateFromPos(gantt.posFromDate(ev.end_date) - (coords_x.end - coords_x.start));
		}else{
			ev.start_date = new_start;
			ev.end_date = new_end;
		}
	},
	_drag_task_coords : function(t, drag){
		var start = drag.obj_s_x = drag.obj_s_x || gantt.posFromDate(t.start_date);
		var end = drag.obj_e_x = drag.obj_e_x || gantt.posFromDate(t.end_date);
		return {
			start : start,
			end : end
		};
	},
	on_mouse_move : function(e){
		if(this.drag.start_drag)
			this._start_dnd(e);

		var drag = this.drag;

		if (drag.mode){
			if(!gantt._checkTimeout(this, 40))//limit update frequency
				return;

			this._update_on_move(e);

		}
	},
	_update_on_move : function(e){
		var drag = this.drag;

		if (drag.mode){
			var pos = gantt._get_mouse_pos(e);
			if(drag.pos && drag.pos.x == pos.x)
				return;

			drag.pos=pos;

			var curr_date = gantt.dateFromPos(pos.x);
			if(!curr_date || isNaN( curr_date.getTime() ))
				return;


			var shift = pos.x - drag.start_x;
			var ev = gantt.getTask(drag.id);


			if(this._handlers[drag.mode]){
				var original = gantt.mixin({}, ev);
				var copy =  gantt.mixin({}, ev);
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

	on_mouse_down : function(e, src){
		// on Mac we do not get onmouseup event when clicking right mouse button leaving us in dnd state
		// let's ignore right mouse button then
		if (e.button == 2)
			return;

		var id =gantt.locate(e);
		var task = null;
		if(gantt.isTaskExists(id)){
			task = gantt.getTask(id);
		}

		if (gantt._is_readonly(task) || this.drag.mode) return;

		this.clear_drag_state();

		src = src||(e.target||e.srcElement);

		var className = gantt._getClassName(src);
		if(!className || !this._get_drag_mode(className)){
			if(src.parentNode)
				return this.on_mouse_down(e, src.parentNode);
			else
				return;
		}

		var drag = this._get_drag_mode(className);

		if(!drag){
			if (gantt.checkEvent("onMouseDown") && gantt.callEvent("onMouseDown", [className.split(" ")[0]])) {
				if (src.parentNode)
					return this.on_mouse_down(e,src.parentNode);

			}
		}else{
			if (drag.mode && drag.mode != gantt.config.drag_mode.ignore && gantt.config["drag_" + drag.mode]){
				id =  gantt.locate(src);
				task = gantt.copy(gantt.getTask(id) || {});

				if(gantt._is_readonly(task)){
					this.clear_drag_state();
					return false;
				}

				if(gantt._is_flex_task(task) && drag.mode != gantt.config.drag_mode.progress){//only progress drag is allowed for tasks with flexible duration
					this.clear_drag_state();
					return;
				}

				drag.id = id;
				var pos = gantt._get_mouse_pos(e);

				drag.start_x = pos.x;
				drag.start_y = pos.y;
				drag.obj = task;
				this.drag.start_drag = drag;

			}else
				this.clear_drag_state();
		}
	},
	_fix_dnd_scale_time:function(task, drag){
		var unit = gantt._tasks.unit,
			step = gantt._tasks.step;
		if(!gantt.config.round_dnd_dates){
			unit = 'minute';
			step = gantt.config.time_step;
		}

		function fixStart(task){
			if(!gantt.isWorkTime(task.start_date))
				task.start_date = gantt.calculateEndDate(task.start_date, -1, gantt.config.duration_unit);
		}
		function fixEnd(task){
			if(!gantt.isWorkTime(new Date(task.end_date - 1)))
				task.end_date = gantt.calculateEndDate(task.end_date, 1, gantt.config.duration_unit);
		}
		if(drag.mode == gantt.config.drag_mode.resize){
			if(drag.left){
				task.start_date = gantt.roundDate({date:task.start_date, unit:unit, step:step});
				fixStart(task);
			}else{
				task.end_date = gantt.roundDate({date:task.end_date, unit:unit, step:step});
				fixEnd(task);
			}
		}else if(drag.mode == gantt.config.drag_mode.move){
			task.start_date = gantt.roundDate({date:task.start_date, unit:unit, step:step});
			fixStart(task);

			task.end_date = gantt.calculateEndDate(task.start_date, task.duration, gantt.config.duration_unit);
		}
	},
	_fix_working_times:function(task, drag){
		var drag = drag || {mode : gantt.config.drag_mode.move};
		if(gantt.config.work_time && gantt.config.correct_work_time){
			if(drag.mode == gantt.config.drag_mode.resize){
				if(drag.left){
					task.start_date = gantt.getClosestWorkTime({date:task.start_date, dir:'future'});
				}else{
					task.end_date = gantt.getClosestWorkTime({date:task.end_date, dir:'past'});
				}
			}else if(drag.mode == gantt.config.drag_mode.move){
				gantt.correctTaskWorkTime(task);
			}
		}
	},
	on_mouse_up : function(e){
		var drag = this.drag;
		if (drag.mode && drag.id){
			//drop
			var ev=gantt.getTask(drag.id);

			if(gantt.config.work_time && gantt.config.correct_work_time){
				this._fix_working_times(ev, drag);
			}

			this._fix_dnd_scale_time(ev, drag);

			gantt._init_task_timing(ev);

			if(!this._fireEvent("before_finish", drag.mode, [drag.id, drag.mode, gantt.copy(drag.obj), e])){
				drag.obj._dhx_changed = false;
				gantt.mixin(ev, drag.obj, true);

				gantt.updateTask(ev.id);
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
	_get_drag_mode : function(className){
		var modes = gantt.config.drag_mode;
		var classes = (className || "").split(" ");
		var classname = classes[0];
		var drag = {mode:null, left:null};
		switch (classname) {
			case "gantt_task_line":
			case "gantt_task_content":
				drag.mode = modes.move;
				break;
			case "gantt_task_drag":
				drag.mode = modes.resize;
				if(classes[1] && classes[1].indexOf("left", classes[1].length - "left".length) !== -1){
					drag.left = true;
				}else{
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

	_start_dnd : function(e){
		var drag = this.drag = this.drag.start_drag;
		delete drag.start_drag;

		var cfg = gantt.config;
		var id = drag.id;
		if (!cfg["drag_"+drag.mode] || !gantt.callEvent("onBeforeDrag",[id, drag.mode, e]) || !this._fireEvent("before_start", drag.mode, [id, drag.mode, e])){
			this.clear_drag_state();
		}else {
			delete drag.start_drag;
			gantt.callEvent("onTaskDragStart", []);
		}

	},
	_fireEvent:function(stage, mode, params){
		gantt.assert(this._events[stage], "Invalid stage:{" + stage + "}");

		var trigger = this._events[stage][mode];

		gantt.assert(trigger, "Unknown after drop mode:{" + mode + "}");
		gantt.assert(params, "Invalid event arguments");


		if(!gantt.checkEvent(trigger))
			return true;

		return gantt.callEvent(trigger, params);
	}
};

gantt.roundTaskDates = function(task){
	var drag_state = gantt._tasks_dnd.drag;

	if(!drag_state){
		drag_state = {mode:gantt.config.drag_mode.move};
	}
	gantt._tasks_dnd._fix_dnd_scale_time(task, drag_state);
};







gantt._render_link = function(id){
	var link = this.getLink(id);
	var renders = gantt._get_link_renderers();
	for(var i = 0; i < renders.length; i++)
		renders[i].render_item(link);
};

gantt._get_link_type = function(from_start, to_start){
	var type = null;
	if(from_start && to_start){
		type = gantt.config.links.start_to_start;
	}else if(!from_start && to_start){
		type = gantt.config.links.finish_to_start;
	}else if(!from_start && !to_start){
		type = gantt.config.links.finish_to_finish;
	}else if(from_start && !to_start){
		type = gantt.config.links.start_to_finish;
	}
	return type;
};

gantt.isLinkAllowed = function(from, to, from_start, to_start){
	var link = null;
	if(typeof(from) == "object"){
		link = from;
	}else{
		link = {source:from, target:to, type: this._get_link_type(from_start, to_start)};
	}

	if(!link) return false;
	if(!(link.source && link.target && link.type)) return false;
	if(link.source == link.target) return false;

	var res = true;
	//any custom rules
	if(this.checkEvent("onLinkValidation"))
		res = this.callEvent("onLinkValidation", [link]);

	return res;
};

gantt._render_link_element = function(link){
	var dots = this._path_builder.get_points(link);
	var drawer = gantt._drawer;
	var lines = drawer.get_lines(dots);

	var div = document.createElement("div");


	var css = "gantt_task_link";

	if(link.color){
		css += " gantt_link_inline_color";
	}
	var cssTemplate = this.templates.link_class ? this.templates.link_class(link) : "";
	if(cssTemplate){
		css += " " + cssTemplate;
	}

	if(this.config.highlight_critical_path && this.isCriticalLink){
		if(this.isCriticalLink(link))
			css += " gantt_critical_link";
	}

	div.className = css;
	div.setAttribute(gantt.config.link_attribute, link.id);
	for(var i=0; i < lines.length; i++){
		if(i == lines.length - 1){
			lines[i].size -= gantt.config.link_arrow_size;
		}
		var el = drawer.render_line(lines[i], lines[i+1]);
		if(link.color){
			el.firstChild.style.backgroundColor = link.color;
		}
		div.appendChild(el);
	}

	var direction = lines[lines.length - 1].direction;
	var endpoint = gantt._render_link_arrow(dots[dots.length - 1], direction);
	if(link.color){
		endpoint.style.borderColor = link.color;
	}
	div.appendChild(endpoint);

	return div;
};

gantt._render_link_arrow = function(point, direction){
	var div = document.createElement("div");
	var drawer = gantt._drawer;
	var top = point.y;
	var left = point.x;

	var size = gantt.config.link_arrow_size;
	var line_width = gantt.config.row_height;
	var className = "gantt_link_arrow gantt_link_arrow_" + direction;
	switch (direction){
		case drawer.dirs.right:
			top -= (size - line_width)/2;
			left -= size;
			break;
		case drawer.dirs.left:
			top -= (size - line_width)/2;
			break;
		case drawer.dirs.up:
			left -= size;
			break;
		case drawer.dirs.down:
			top += size*2;
			left -= size;
			break;
		default:
			break;
	}
	div.style.cssText = [
		"top:"+top + "px",
		"left:"+left+'px'].join(';');
	div.className = className;

	return div;
};


gantt._drawer = {
	current_pos:null,
	dirs:{"left":'left',"right":'right',"up":'up', "down":'down'},
	path:[],
	clear:function(){
		this.current_pos = null;
		this.path = [];
	},
	point:function(pos){
		this.current_pos = gantt.copy(pos);
	},
	get_lines:function(dots){
		this.clear();
		this.point(dots[0]);
		for(var i=1; i<dots.length ; i++){
			this.line_to(dots[i]);
		}
		return this.get_path();
	},
	line_to:function(pos){
		var next = gantt.copy(pos);
		var prev = this.current_pos;

		var line = this._get_line(prev, next);
		this.path.push(line);
		this.current_pos = next;
	},
	get_path:function(){
		return this.path;
	},
	get_wrapper_sizes :function(v){
		var res,
			wrapper_size = gantt.config.link_wrapper_width,
			line_size = gantt.config.link_line_width,
			y = v.y + (gantt.config.row_height - wrapper_size)/2;
		switch (v.direction){
			case this.dirs.left:
				res = {	top : y,
					height : wrapper_size,
					lineHeight : wrapper_size,
					left : v.x - v.size - wrapper_size/2 ,
					width : v.size +wrapper_size};
				break;
			case this.dirs.right:
				res = {	top : y,
					lineHeight : wrapper_size,
					height : wrapper_size,
					left : v.x - wrapper_size/2,
					width : v.size + wrapper_size};
				break;
			case this.dirs.up:
				res = {	top : y - v.size ,
					lineHeight: v.size + wrapper_size,
					height : v.size + wrapper_size,
					left : v.x - wrapper_size/2,
					width : wrapper_size};
				break;
			case this.dirs.down:
				res = {	top : y /*- wrapper_size/2*/,
					lineHeight: v.size + wrapper_size,
					height : v.size + wrapper_size,
					left : v.x - wrapper_size/2,
					width : wrapper_size};
				break;
			default:
				break;
		}

		return res;
	},
	get_line_sizes : function(v){
		var res,
			line_size = gantt.config.link_line_width,
			wrapper_size = gantt.config.link_wrapper_width,
			size =  v.size + line_size;
		switch (v.direction){
			case this.dirs.left:
			case this.dirs.right:
				res = {
					height : line_size,
					width : size,
					marginTop: (wrapper_size - line_size)/2,
					marginLeft: (wrapper_size - line_size)/2
				};
				break;
			case this.dirs.up:
			case this.dirs.down:
				res = {
					height : size,
					width : line_size,
					marginTop: (wrapper_size - line_size)/2,
					marginLeft: (wrapper_size - line_size)/2
				};
				break;
			default:
				break;
		}



		return res;
	},
	render_line : function(v){
		var pos = this.get_wrapper_sizes(v);
		var wrapper = document.createElement("div");
		wrapper.style.cssText = [
			"top:" + pos.top + "px",
			"left:" + pos.left + "px",
			"height:" + pos.height + "px",
			"width:" + pos.width + "px"
		].join(';');
		wrapper.className = "gantt_line_wrapper";

		var innerPos = this.get_line_sizes(v);
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
	_get_line:function(from, to){
		var direction = this.get_direction(from, to);
		var vect = {
			x : from.x,
			y : from.y,
			direction : this.get_direction(from, to)
		};
		if(direction == this.dirs.left || direction == this.dirs.right){
			vect.size =  Math.abs(from.x - to.x);
		}else{
			vect.size =  Math.abs(from.y - to.y);
		}
		return vect;
	},
	get_direction:function(from, to){
		var direction = 0;
		if(to.x < from.x){
			direction = this.dirs.left;
		}else if (to.x > from.x){
			direction = this.dirs.right;
		}else if (to.y > from.y){
			direction = this.dirs.down;
		}else {
			direction = this.dirs.up;
		}
		return direction;
	}

};
gantt._y_from_ind = function(index){
	return (index)*gantt.config.row_height;
};
gantt._path_builder = {

	path:[],
	clear:function(){
		this.path = [];
	},
	current:function(){
		return this.path[this.path.length - 1];
	},
	point:function(next){
		if(!next)
			return this.current();

		this.path.push(gantt.copy(next));
		return next;
	},
	point_to:function(direction, diff, point){
		if(!point)
			point = gantt.copy(this.point());
		else
			point = {x:point.x, y:point.y};
		var dir = gantt._drawer.dirs;
		switch (direction){
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
	get_points:function(link){
		var pt = this.get_endpoint(link);
		var xy = gantt.config;


		var dy = pt.e_y - pt.y;
		var dx = pt.e_x - pt.x;

		var dir = gantt._drawer.dirs;

		this.clear();
		this.point({x: pt.x, y : pt.y});

		var shiftX = 2*xy.link_arrow_size;//just random size for first line


		var forward = (pt.e_x > pt.x);
		if(link.type == gantt.config.links.start_to_start){
			this.point_to(dir.left, shiftX);
			if(forward){
				this.point_to(dir.down, dy);
				this.point_to(dir.right,  dx);
			}else{
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}
			this.point_to(dir.right, shiftX);

		}else if(link.type == gantt.config.links.finish_to_start){
			forward = (pt.e_x > (pt.x + 2*shiftX));
			this.point_to(dir.right, shiftX);
			if(forward){
				dx -= shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}else{
				dx -= 2*shiftX;
				var sign = dy > 0 ? 1 : -1;

				this.point_to(dir.down, sign * (xy.row_height/2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (xy.row_height/2)));
				this.point_to(dir.right, shiftX);
			}

		}else if(link.type == gantt.config.links.finish_to_finish){
			this.point_to(dir.right, shiftX);
			if(forward){
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}else{
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}
			this.point_to(dir.left, shiftX);
		}else if(link.type == gantt.config.links.start_to_finish){

			forward = (pt.e_x > (pt.x - 2*shiftX));
			this.point_to(dir.left, shiftX);

			if(!forward){
				dx += shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right,  dx);
			}else{
				dx += 2*shiftX;
				var sign = dy > 0 ? 1 : -1;
				this.point_to(dir.down, sign * (xy.row_height/2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (xy.row_height/2)));
				this.point_to(dir.left, shiftX);
			}

		}

		return this.path;
	},
	get_endpoint : function(link){
		var types = gantt.config.links;
		var from_start = false, to_start = false;

		if(link.type == types.start_to_start){
			from_start = to_start = true;
		}else if(link.type == types.finish_to_finish){
			from_start = to_start = false;
		}else if(link.type == types.finish_to_start){
			from_start = false;
			to_start = true;
		}else if(link.type == types.start_to_finish){
			from_start = true;
			to_start = false;
		}else{
			gantt.assert(false, "Invalid link type");
		}

		var from = gantt._get_task_visible_pos(gantt._pull[link.source], from_start);
		var to = gantt._get_task_visible_pos(gantt._pull[link.target], to_start);

		return {
			x :  from.x,
			e_x : to.x,
			y : from.y ,
			e_y : to.y
		};
	}
};

gantt._init_links_dnd = function() {
	var dnd = new gantt._DnD(this.$task_bars, { sensitivity : 0, updates_per_second : 60 }),
		start_marker = "task_left",
		end_marker = "task_right",
		link_edge_marker = "gantt_link_point",
		link_landing_hover_area = "gantt_link_control";

	dnd.attachEvent("onBeforeDragStart", gantt.bind(function(obj,e) {
		var target = (e.target||e.srcElement);
		resetDndState();
		if(gantt.getState().drag_id)
			return false;


		if(gantt._locate_css(target, link_edge_marker)){
			if(gantt._locate_css(target, start_marker))
				gantt._link_source_task_start = true;

			var sid = gantt._link_source_task = this.locate(e);


			var t = gantt.getTask(sid);
			if(gantt._is_readonly(t)){
				resetDndState();
				return false;
			}

			var shift = 0;
			if(gantt._get_safe_type(t.type) == gantt.config.types.milestone){
				shift = (gantt._get_visible_milestone_width() - gantt._get_milestone_width())/2;
			}

			this._dir_start = getLinePos(t, !!gantt._link_source_task_start, shift);
			return true;
		}else{
			return false;
		}

	}, this));

	dnd.attachEvent("onAfterDragStart", gantt.bind(function(obj,e) {
		updateMarkedHtml(dnd.config.marker);
	}, this));

	function getLinePos(task, to_start, shift){
		var pos = gantt._get_task_pos(task, !!to_start);
		pos.y += gantt._get_task_height()/2;

		shift = shift || 0;
		pos.x += (to_start ? -1 : 1)*shift;
		return pos;
	}

	dnd.attachEvent("onDragMove", gantt.bind(function(obj,e) {
		var dd = dnd.config;
		var pos = dnd.getPosition(e);
		advanceMarker(dd.marker, pos);
		var landing = gantt._is_link_drop_area(e);

		var prevTarget = gantt._link_target_task;
		var prevLanding = gantt._link_landing;
		var prevToStart = gantt._link_target_task_start;

		var targ = gantt.locate(e),
			to_start = true;
		if(landing){
			//refreshTask
			to_start = !gantt._locate_css(e, end_marker);
			landing = !!targ;
		}

		gantt._link_target_task = targ;
		gantt._link_landing = landing;
		gantt._link_target_task_start = to_start;

		if(landing){
			var t = gantt.getTask(targ);

			var node = gantt._locate_css(e, link_landing_hover_area);
			var shift = 0;
			if(node){
				shift = Math.floor(node.offsetWidth  / 2);
			}

			this._dir_end = getLinePos(t, !!gantt._link_target_task_start,shift);
		}else{
			this._dir_end = gantt._get_mouse_pos(e);
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

		if(drag.from && drag.to && drag.from != drag.to){
			var type = gantt._get_link_type(drag.from_start, drag.to_start);

			var link = {source : drag.from, target: drag.to, type:type};
			if(link.type && gantt.isLinkAllowed(link))
				gantt.addLink(link);
		}

		resetDndState();

		if(drag.from)
			gantt.refreshTask(drag.from, false);
		if(drag.to)
			gantt.refreshTask(drag.to, false);
		removeDirectionLine();
	}, this));

	function updateMarkedHtml(marker){
		var link = getDndState();

		var css = ["gantt_link_tooltip"];
		if(link.from && link.to){
			if(gantt.isLinkAllowed(link.from, link.to, link.from_start, link.to_start)){
				css.push("gantt_allowed_link");
			}else{
				css.push("gantt_invalid_link");
			}
		}

		var className = gantt.templates.drag_link_class(link.from, link.from_start, link.to, link.to_start);
		if(className)
			css.push(className);

		var html = "<div class='"+className+ "'>" +
			gantt.templates.drag_link(link.from, link.from_start, link.to, link.to_start) +
			"</div>";
		marker.innerHTML = html;
	}

	function advanceMarker(marker, pos){
		marker.style.left = pos.x + 5 + "px";
		marker.style.top = pos.y + 5 + "px";
	}
	function getDndState(){
		return { from : gantt._link_source_task,
				to : gantt._link_target_task,
				from_start : gantt._link_source_task_start,
				to_start : gantt._link_target_task_start};
	}
	function resetDndState(){
		gantt._link_source_task =
			gantt._link_source_task_start =
				gantt._link_target_task = null;
		gantt._link_target_task_start = true;
	}
	function showDirectingLine(s_x, s_y, e_x, e_y){
		var div = getDirectionLine();

		var link = getDndState();

		var css = ["gantt_link_direction"];
		if(gantt.templates.link_direction_class){
			css.push(gantt.templates.link_direction_class(link.from, link.from_start, link.to, link.to_start));
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
			gantt.$task_links.appendChild(dnd._direction);
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

	gantt._is_link_drop_area = function(e){
		return !!gantt._locate_css(e, link_landing_hover_area);
	};
};
gantt._get_link_state = function(){
	return {
		link_landing_area : this._link_landing,
		link_target_id : this._link_target_task,
		link_target_start : this._link_target_task_start,
		link_source_id : this._link_source_task,
		link_source_start : this._link_source_task_start
	};
};

//helper for rendering bars and links
gantt._task_renderer = function(id, render_one, node, filter){
	//hash of dom elements is needed to redraw single bar/link
	if(!this._task_area_pulls)
		this._task_area_pulls = {};

	if(!this._task_area_renderers)
		this._task_area_renderers = {};

	if(this._task_area_renderers[id])
		return this._task_area_renderers[id];

	if(!render_one)
		this.assert(false, "Invalid renderer call");

	if(node)
		node.setAttribute(this.config.layer_attribute, true);

	this._task_area_renderers[id] = {
		render_item : function(item, container){
			container = container || node;

			if(filter){
				if(!filter(item)){
					this.remove_item(item.id);
					return;
				}
			}

			var dom = render_one.call(gantt, item);
			this.append(item, dom, container);

		},

		clear : function(container){
			this.rendered = gantt._task_area_pulls[id] = {};
			this.clear_container(container);
		},
		clear_container: function(container){
			container = container || node;
			if(container)
				container.innerHTML = "";
		},
		render_items : function(items, container){
			container = container || node;

			var buffer = document.createDocumentFragment();
			this.clear(container);
			for(var i= 0, vis = items.length; i < vis; i++){
				this.render_item(items[i], buffer);
			}

			container.appendChild(buffer);
		},
		append: function(item, node, container){
			if(!node) return;

			if(this.rendered[item.id] && this.rendered[item.id].parentNode){
				this.replace_item(item.id, node);
			}else{
				container.appendChild(node);
			}
			this.rendered[item.id] = node;

		},
		replace_item: function(item_id, newNode){
			var item = this.rendered[item_id];
			if(item && item.parentNode){
				item.parentNode.replaceChild(newNode, item);
			}
			this.rendered[item_id] = newNode;
		},
		remove_item:function(item_id){
			this.hide(item_id);
			delete this.rendered[item_id];
		},
		hide: function(item_id){
			var item = this.rendered[item_id];
			if(item && item.parentNode){
				item.parentNode.removeChild(item);
			}
		},
		restore: function(item){
			var dom = this.rendered[item.id];
			if(dom){
				if(!dom.parentNode){
					this.append(item, dom, node);
				}
			}else{
				this.render_item(item, node);
			}
		},
		change_id: function(oldid, newid) {
			this.rendered[newid] = this.rendered[oldid];
			delete this.rendered[oldid];
		},
		rendered : this._task_area_pulls[id],
		node: node,
		unload : function(){
			this.clear();
			delete gantt._task_area_renderers[id];
			delete gantt._task_area_pulls[id];
		}
	};

	return this._task_area_renderers[id];
};

gantt._clear_renderers = function(){
	for(var i in this._task_area_renderers){
		this._task_renderer(i).unload();
	}
};

gantt._is_layer = function(dom_element){
	return (dom_element && dom_element.hasAttribute && dom_element.hasAttribute(this.config.layer_attribute));
};




gantt._init_tasks = function(){
	//store temporary configs
	this._tasks = {
		col_width:this.config.columnWidth,
        width: [], // width of each column
        full_width: 0, // width of all columns
		trace_x:[],
		rendered:{}
	};


	this._click.gantt_task_link = this.bind(function(e, trg){
		var id = this.locate(e, gantt.config.link_attribute);
		if(id){
			this.callEvent("onLinkClick", [id, e]);
		}
	}, this);

	this._click.gantt_scale_cell = this.bind(function(e, trg){
		var pos = gantt._get_mouse_pos(e);
		var date = gantt.dateFromPos(pos.x);
		var coll = Math.floor(gantt._day_index_by_date(date));

		var coll_date = gantt._tasks.trace_x[coll];

		gantt.callEvent("onScaleClick", [e, coll_date]);
	}, this);

	this._dbl_click.gantt_task_link = this.bind(function(e, id, trg){
		var id = this.locate(e, gantt.config.link_attribute);
		this._delete_link_handler(id, e);
	}, this);

	this._dbl_click.gantt_link_point = this.bind(function(e, id, trg){
		var id = this.locate(e),
			task = this.getTask(id);


		var link = null;
		if(trg.parentNode && gantt._getClassName(trg.parentNode)){
			if(gantt._getClassName(trg.parentNode).indexOf("_left") > -1){
				link = task.$target[0];
			}else{
				link = task.$source[0];
			}
		}
		if(link)
			this._delete_link_handler(link, e);
		return false;
	}, this);

	this._tasks_dnd.init();
	this._init_links_dnd();

	this._link_layers.clear();


	var links_layer = this.addLinkLayer({
		renderer: this._render_link_element,
		container: this.$task_links,
		filter: gantt._create_filter([gantt._filter_link, gantt._is_chart_visible].concat(this._get_link_filters()))
	});
	this._linkRenderer = this._link_layers.getRenderer(links_layer);

	this._task_layers.clear();
	var bar_layer = this.addTaskLayer({
		renderer: this._render_task_element,
		container: this.$task_bars,
		filter: gantt._create_filter([ gantt._filter_task,  gantt._is_chart_visible].concat(this._get_task_filters()))
	});
	this._taskRenderer = this._task_layers.getRenderer(bar_layer);

	this.addTaskLayer({
		renderer: this._render_grid_item,
		container: this.$grid_data,
		filter: gantt._create_filter([ gantt._filter_task,  gantt._is_grid_visible].concat(this._get_task_filters()))
	});
	this.addTaskLayer({
		renderer: this._render_bg_line,
		container: this.$task_bg,
		filter: gantt._create_filter([ gantt._filter_task,  gantt._is_chart_visible,  gantt._is_std_background].concat(this._get_task_filters()))
	});



	function refreshId(renders, oldId, newId, item){
		for(var i =0; i < renders.length; i++){
			renders[i].change_id(oldId, newId);
			renders[i].render_item(item);
		}
	}
	if(this._onTaskIdChange)
		this.detachEvent(this._onTaskIdChange);

	this._onTaskIdChange = this.attachEvent("onTaskIdChange", function(oldId, newId) {
		var render = this._get_task_renderers();
		refreshId(render, oldId, newId, this.getTask(newId));
	});

	if(this._onLinkIdChange)
		this.detachEvent(this._onLinkIdChange);

	this._onLinkIdChange = this.attachEvent("onLinkIdChange", function(oldId, newId){
		var render = this._get_link_renderers();
		refreshId(render, oldId, newId, this.getLink(newId));
	});
};

gantt._get_task_filters = function(){ return [];};
gantt._get_link_filters = function(){ return [];};


gantt._is_chart_visible = function(){
	return !!this.config.show_chart;
};

gantt._filter_task = function(id, task){
	var min = null, max = null;
	if(this.config.start_date && this.config.end_date){
		min = this.config.start_date.valueOf();
		max = this.config.end_date.valueOf();

		if(+task.start_date > max || +task.end_date < +min)
			return false;
	}
	return true;
};
gantt._filter_link = function(id, link){
	if(!this.config.show_links){
		return false;
	}

	if(!(gantt.isTaskVisible(link.source) && gantt.isTaskVisible(link.target)) ||
		gantt._isAllowedUnscheduledTask(gantt.getTask(link.source)) || gantt._isAllowedUnscheduledTask(gantt.getTask(link.target)))
		return false;

	return this.callEvent("onBeforeLinkDisplay", [id, link]);
};
gantt._is_std_background = function(){
	return !this.config.static_background;
};

gantt._delete_link_handler = function(id, e){
	if(id && this.callEvent("onLinkDblClick", [id, e])){
		var link = gantt.getLink(id);
		if(gantt._is_readonly(link)) return;

		var title = "";
		var question = gantt.locale.labels.link + " " +this.templates.link_description(this.getLink(id)) + " " + gantt.locale.labels.confirm_link_deleting;
		
		window.setTimeout(function(){
			gantt._dhtmlx_confirm(question, title, function(){
				gantt.deleteLink(id);
			});		
		},(gantt.config.touch ? 300 : 1));
	}
};
gantt.getTaskNode = function(id){
	return this._taskRenderer.rendered[id];
};
gantt.getLinkNode = function(id){
	return this._linkRenderer.rendered[id];
};





gantt._get_tasks_data = function(){
	var rows = [];
	var order = this._get_data_range();

	for(var i=0; i < order.length; i++){
		var item = this._pull[order[i]];
		item.$index = i;
		//this._update_parents(item.id, true);
		this.resetProjectDates(item);
		rows.push(item);
	}
	return rows;
};

gantt._get_data_range = function(){
	return this._order;
};

gantt._get_links_data = function(){
	return this._links.slice();
};
gantt._render_data = function(){
	this.callEvent("onBeforeDataRender", []);
	if(!this._is_render_active())
		return;

	if(!this._order_synced){
		this._sync_order();
	}else{
		this._order_synced = false;
	}
	this._update_layout_sizes();
	this._scroll_resize();

	var data = this._get_tasks_data();

	var renderers = this._get_task_renderers();
	for(var i=0; i < renderers.length; i++){
		renderers[i].render_items(data);
	}

	var links = gantt._get_links_data();
	renderers = this._get_link_renderers();
	for(var i=0; i < renderers.length; i++)
		renderers[i].render_items(links);

	this.callEvent("onDataRender", []);
};

gantt._update_layout_sizes = function(){
	var cfg = this._tasks;

	cfg.bar_height = this._get_task_height();

	//task bars layer
	this.$task_data.style.height = Math.max(this.$task.offsetHeight - this.config.scale_height, 0) + 'px';

	if(gantt.config.smart_rendering){
		this.$task_bg.style.height = gantt.config.row_height * this.getVisibleTaskCount() +"px";
	}else{
		this.$task_bg.style.height = "";
	}

	this.$task_bg.style.backgroundImage = "";

	//timeline area layers
	var data_els = this.$task_data.childNodes;
	for(var i= 0, len = data_els.length; i < len; i++){
		var el = data_els[i];
		if(this._is_layer(el) && el.style)
			el.style.width = cfg.full_width + "px";
	}

	//grid area
	if(this._is_grid_visible()){
		var columns = this.getGridColumns();
		var width = 0;
		for (var i = 0; i < columns.length; i++)
			width += columns[i].width;
		this.$grid_data.style.width = Math.max(width-1, 0) + "px";
	}
};

gantt._scale_range_unit = function(){
	var unit = this.config.scale_unit;
	if(this.config.scale_offset_minimal){
		var scales = this._get_scales();
		unit = scales[scales.length - 1].unit;
	}
	return unit;
};

gantt._init_tasks_range = function(){
	var unit = this._scale_range_unit();
	if(this.config.start_date && this.config.end_date){
		this._min_date = this.date[unit + "_start"]( new Date(this.config.start_date));

		var end = new Date(this.config.end_date);
		var start_interval = this.date[unit + "_start"](new Date(end));
		if(+end != +start_interval){
			end = this.date.add(start_interval, 1, unit);
		}else{
			end = start_interval;
		}

		this._max_date = end;
		return;
	}

	//reset project timing
	this._get_tasks_data();

	var range = this.getSubtaskDates();
	this._min_date = range.start_date;
	this._max_date = range.end_date;

	if(!(this._max_date && this._max_date)){
		this._min_date = new Date();
		this._max_date = new Date(this._min_date);
	}

	this._min_date = this.date[unit + "_start"](this._min_date);
	this._min_date = this.calculateEndDate(this.date[unit + "_start"](this._min_date), -1, unit);//one free column before first task

	this._max_date = this.date[unit + "_start"](this._max_date);
	this._max_date = this.calculateEndDate(this._max_date, 2, unit);//one free column after last task
};



gantt._prepare_scale_html = function(config){
	var cells = [];
	var date = null, content = null, css = null;

	if(config.template || config.date){
		content = config.template || this.date.date_to_str(config.date);
	}


	css = config.css || function(){};
	if(!config.css && this.config.inherit_scale_class){
		css = gantt.templates.scale_cell_class;
	}

	for (var i = 0; i < config.count; i++) {
		date = new Date(config.trace_x[i]);
		var value = content.call(this, date),
			width = config.width[i],
			style = "",
			template = "",
			cssclass = "";

		if(width){
			style = "width:"+(width)+"px;";
			cssclass = "gantt_scale_cell" + (i == config.count-1 ? " gantt_last_cell" : "");

			template = css.call(this, date);
			if(template) cssclass += " " + template;
			var cell = "<div class='" + cssclass + "' style='" + style + "'>" + value + "</div>";
			cells.push(cell);
		}else{
			//do not render ignored cells
		}

	}
	return cells.join("");
};
gantt._get_scales = function(){
	var helpers = this._scale_helpers;
	var scales = [helpers.primaryScale()].concat(this.config.subscales);

	helpers.sortScales(scales);
	return scales;
};

gantt._render_tasks_scales = function() {
	this._init_tasks_range();
    this._scroll_resize();
    this._set_sizes();

	var scales_html = "",
		outer_width = 0,
		data_width = 0,
		scale_height = 0;

	if(this._is_chart_visible()){
		var helpers = this._scale_helpers;
		var scales = this._get_scales();
		scale_height = (this.config.scale_height-1);
		var resize = this._get_resize_options();
		var avail_width = resize.x ? Math.max(this.config.autosize_min_width, 0) : this.$task.offsetWidth;

		var cfgs = helpers.prepareConfigs(scales,this.config.min_column_width, avail_width, scale_height);
		var cfg = this._tasks = cfgs[cfgs.length - 1];

		var html = [];

		var css = this.templates.scale_row_class;
		for(var i=0; i < cfgs.length; i++){
			var cssClass = "gantt_scale_line";
			var tplClass = css(cfgs[i]);
			if(tplClass){
				cssClass += " " + tplClass;
			}

			html.push("<div class=\""+cssClass+"\" style=\"height:"+(cfgs[i].height)+"px;line-height:"+(cfgs[i].height)+"px\">" + this._prepare_scale_html(cfgs[i]) + "</div>");
		}

		scales_html = html.join("");
		outer_width = cfg.full_width + this.$scroll_ver.offsetWidth + "px";
		data_width = cfg.full_width + "px";
		scale_height += "px";
	}

	if(this._is_chart_visible()){
		this.$task.style.display = "";
	}else{
		this.$task.style.display = "none";
	}

    this.$task_scale.style.height = scale_height;

    this.$task_data.style.width =
	this.$task_scale.style.width = outer_width;

    this.$task_scale.innerHTML = scales_html;

};

gantt._render_bg_line = function(item){
	var cfg = gantt._tasks;
	var count = cfg.count;
	var row = document.createElement("div");
	if(gantt.config.show_task_cells){
		for (var j = 0; j < count; j++) {
			var width = cfg.width[j],
				cssclass = "";

			if(width > 0){//do not render skipped columns
				var cell = document.createElement("div");
				cell.style.width = (width)+"px";

				cssclass = "gantt_task_cell" + (j == count-1 ? " gantt_last_cell" : "");
				cssTemplate = this.templates.task_cell_class(item, cfg.trace_x[j]);
				if(cssTemplate)
					cssclass += " " + cssTemplate;
				cell.className = cssclass;

				row.appendChild(cell);
			}

		}
	}
	var odd = item.$index%2 !== 0;
	var cssTemplate = gantt.templates.task_row_class(item.start_date, item.end_date, item);
	var css = "gantt_task_row" + (odd ? " odd" : "") + (cssTemplate ? ' '+cssTemplate : '');

	if(this.getState().selected_task == item.id){
		css += " gantt_selected";
	}

	//var row = "<div class='" + css + "' " + this.config.task_attribute + "='" + item.id + "'>" + cells.join("") + "</div>";

	row.className = css;


	if(gantt.config.smart_rendering){
		row.style.position = "absolute";
		row.style.top = this.getTaskTop(item.id) + "px";
		row.style.width = "100%";
	}
	row.style.height = (gantt.config.row_height)+"px";
	row.setAttribute(this.config.task_attribute, item.id);
	return row;
};


gantt._adjust_scales = function(){
	if(this.config.fit_tasks){
		var old_min = +this._min_date,
			old_max = +this._max_date;
		this._init_tasks_range();
		if(+this._min_date != old_min || +this._max_date != old_max){
			this.render();

			this.callEvent("onScaleAdjusted", []);
			return true;
		}
	}
	return false;
};

//refresh task and related links
gantt.refreshTask = function(taskId, refresh_links){
	if(!this._is_render_active())
		return;

	var renders = this._get_task_renderers();

	var task = this.getTask(taskId);
	if(task && this.isTaskVisible(taskId)){
		for(var i =0; i < renders.length; i++)
			renders[i].render_item(task);

		if(refresh_links !== undefined && !refresh_links)
			return;

		for(var i=0; i < task.$source.length; i++){
			gantt.refreshLink(task.$source[i]);
		}
		for(var i=0; i < task.$target.length; i++){
			gantt.refreshLink(task.$target[i]);
		}
	}else{
		//this._render_data();
	}
};
gantt.refreshLink = function(linkId){
	if(!this._is_render_active())
		return;

	if(this.isLinkExists(linkId)){
		this._render_link(linkId);
	}else{
		var renders = this._get_link_renderers();
		for(var i =0; i < renders.length; i++)
			renders[i].remove_item(linkId);
	}
};



gantt._combine_item_class = function(basic, template, itemId){
	var css = [basic];
	if(template)
		css.push(template);

	var state = gantt.getState();

	var task = this.getTask(itemId);

	if(this._get_safe_type(task.type) == this.config.types.milestone){
		css.push("gantt_milestone");
	}

	if(this._get_safe_type(task.type) == this.config.types.project){
		css.push("gantt_project");
	}

	if(this._is_flex_task(task))
		css.push("gantt_dependent_task");

	if(this.config.select_task && itemId == state.selected_task)
		css.push("gantt_selected");

	if(itemId == state.drag_id){
		css.push("gantt_drag_" + state.drag_mode);
		if(state.touch_drag){
			css.push("gantt_touch_" + state.drag_mode);
		}
	}
	var links = gantt._get_link_state();
	if(links.link_source_id == itemId)
		css.push("gantt_link_source");

	if(links.link_target_id == itemId)
		css.push("gantt_link_target");


	if(this.config.highlight_critical_path && this.isCriticalTask){
		if(this.isCriticalTask(task))
			css.push("gantt_critical_task");
	}

	if(links.link_landing_area &&
		(links.link_target_id && links.link_source_id) &&
		(links.link_target_id != links.link_source_id)){

		var from_id = links.link_source_id;
		var from_start = links.link_source_start;
		var to_start = links.link_target_start;

		var allowDrag = gantt.isLinkAllowed(from_id, itemId, from_start, to_start);

		var dragClass = "";
		if(allowDrag){
			if(to_start)
				dragClass = "link_start_allow";
			else
				dragClass = "link_finish_allow";
		}else{
			if(to_start)
				dragClass = "link_start_deny";
			else
				dragClass = "link_finish_deny";
		}
		css.push(dragClass);
	}
	return css.join(" ");
};

gantt._render_pair = function(parent, css, task, content){
	var state = gantt.getState();

	if(+task.end_date <= +state.max_date)
		parent.appendChild(content(css+" task_right"));

	if(+task.start_date >= +state.min_date)
		parent.appendChild(content(css+" task_left"));
};

gantt._get_task_height = function(){
	// height of the bar item
	var height = this.config.task_height;
	if(height == "full")
		height = this.config.row_height - 5;
	//item height cannot be bigger than row height
	height = Math.min(height, this.config.row_height);
	return Math.max(height, 0);
};

gantt._get_milestone_width = function(){
	return this._get_task_height();
};
gantt._get_visible_milestone_width = function(){
	var origWidth = gantt._get_task_height();//m-s have square shape
	return Math.sqrt(2*origWidth*origWidth);
};

// TODO: remove reduntant methods for task positioning
gantt.getTaskPosition = function(task, start_date, end_date){
	var x = this.posFromDate(start_date || task.start_date);
	var x2 = this.posFromDate(end_date || task.end_date);
	x2 = Math.max(x, x2);
	var y = this.getTaskTop(task.id);
	var height = gantt._get_task_height();
	return {
		left:x,
		top:y,
		height : height,
		width: Math.max((x2 - x), 0)
	};
};

gantt._get_task_width = function(task, start, end ){
	return Math.round(this._get_task_pos(task, false).x - this._get_task_pos(task, true).x);
};

gantt._is_readonly = function(item){
	if(item && item[this.config.editable_property]){
		return false;
	}else{
		return (item && item[this.config.readonly_property]) || this.config.readonly;
	}
};
gantt._task_default_render = function(task){
	if(this._isAllowedUnscheduledTask(task))
		return;

	var pos = this._get_task_pos(task);

	var cfg = this.config;
	var height = this._get_task_height();

	var padd = Math.floor((this.config.row_height - height)/2);
	if(this._get_safe_type(task.type) == cfg.types.milestone && cfg.link_line_width > 1){
		//little adjust milestone position, so horisontal corners would match link arrow when thickness of link line is more than 1px
		padd += 1;
	}

	var div = document.createElement("div");
	var width = gantt._get_task_width(task);

	var type = this._get_safe_type(task.type);

	div.setAttribute(this.config.task_attribute, task.id);

	if(cfg.show_progress && type != this.config.types.milestone){
		this._render_task_progress(task,div, width);
	}

	//use separate div to display content above progress bar
	var content = gantt._render_task_content(task, width);
	if(task.textColor){
		content.style.color = task.textColor;
	}
	div.appendChild(content);

	var css = this._combine_item_class("gantt_task_line",
		this.templates.task_class(task.start_date, task.end_date, task),
		task.id);
	if(task.color || task.progressColor || task.textColor){
		css += " gantt_task_inline_color";
	}
	div.className = css;

	var styles = [
		"left:" + pos.x + "px",
		"top:" + (padd + pos.y) + 'px',
		"height:" + height + 'px',
		"line-height:" + height + 'px',
		"width:" + width + 'px'
	];
	if(task.color){
		styles.push("background-color:" + task.color);
	}
	if(task.textColor){
		styles.push("color:" + task.textColor);
	}

	div.style.cssText = styles.join(";");
	var side = this._render_leftside_content(task);
	if(side) div.appendChild(side);

	side = this._render_rightside_content(task);
	if(side) div.appendChild(side);

	if(!this._is_readonly(task)){
		if(cfg.drag_resize && !this._is_flex_task(task) && type != this.config.types.milestone){
			gantt._render_pair(div, "gantt_task_drag", task, function(css){
				var el = document.createElement("div");
				el.className = css;
				return el;
			});
		}
		if(cfg.drag_links && this.config.show_links){
			gantt._render_pair(div, "gantt_link_control", task, function(css){
				var outer = document.createElement("div");
				outer.className = css;
				outer.style.cssText = [
					"height:" + height + 'px',
					"line-height:" + height + 'px'
				].join(";");
				var inner = document.createElement("div");
				inner.className = "gantt_link_point";
				outer.appendChild(inner);
				return outer;
			});
		}
	}
	return div;
};

gantt._render_task_element = function(task){
	var painters = this.config.type_renderers;
	var renderer = painters[this._get_safe_type(task.type)],
		defaultRenderer = this._task_default_render;

	if(!renderer){
		renderer = defaultRenderer;
	}
	return renderer.call(this, task, this.bind(defaultRenderer, this));
};

gantt._render_side_content = function(task, template, cssClass){
	if(!template) return null;

	var text = template(task.start_date, task.end_date, task);
	if(!text) return null;
	var content = document.createElement("div");
	content.className = "gantt_side_content " + cssClass;
	content.innerHTML = text;
	return content;
};



gantt._render_leftside_content = function(task){
	var css = "gantt_left " + gantt._get_link_crossing_css(true, task);
	return gantt._render_side_content(task, this.templates.leftside_text, css);
};
gantt._render_rightside_content = function(task){
	var css = "gantt_right " + gantt._get_link_crossing_css(false, task);
	return gantt._render_side_content(task, this.templates.rightside_text, css);
};

gantt._get_conditions = function(leftside){
	if(leftside){
		return {
			$source : [
				gantt.config.links.start_to_start
			],
			$target : [
				gantt.config.links.start_to_start,
				gantt.config.links.finish_to_start
			]
		};
	}else{
		return {
			$source : [
				gantt.config.links.finish_to_start,
				gantt.config.links.finish_to_finish
			],
			$target : [
				gantt.config.links.finish_to_finish
			]
		};
	}
};

gantt._get_link_crossing_css = function(left, task){
	var cond = gantt._get_conditions(left);

	for(var i in cond){
		var links = task[i];
		for(var ln =0; ln < links.length; ln++){
			var link = gantt.getLink(links[ln]);

			for(var tp =0; tp < cond[i].length; tp++){
				if(link.type == cond[i][tp]){
					return "gantt_link_crossing";
				}
			}
		}
	}
	return "";
};



gantt._render_task_content = function(task, width){
	var content = document.createElement("div");
	if(this._get_safe_type(task.type) != this.config.types.milestone)
		content.innerHTML = this.templates.task_text(task.start_date, task.end_date, task);
	content.className = "gantt_task_content";
	//content.style.width = width + 'px';
	return content;
};
gantt._render_task_progress = function(task, element, maxWidth){
	var done = task.progress*1 || 0;

	maxWidth = Math.max(maxWidth - 2, 0);//2px for borders
	var pr = document.createElement("div");
	var width = Math.round(maxWidth*done);

	width = Math.min(maxWidth, width);
	if(task.progressColor){
		pr.style.backgroundColor = task.progressColor;
		pr.style.opacity = 1;
	}
	pr.style.width = width + 'px';
	pr.className = "gantt_task_progress";
	pr.innerHTML = this.templates.progress_text(task.start_date, task.end_date, task);
	element.appendChild(pr);
	if(this.config.drag_progress && !gantt._is_readonly(task)){
		var drag = document.createElement("div");
		drag.style.left = width + 'px';
		drag.className = "gantt_task_progress_drag";
		pr.appendChild(drag);
		element.appendChild(drag);
	}
};
gantt._get_line = function(step) {
    var steps = {
        "second": 1,
        "minute": 60,
        "hour": 60*60,
        "day": 60*60*24,
        "week": 60*60*24*7,
        "month": 60*60*24*30,
        "year": 60*60*24*365
    };
    return steps[step] || 0;
};


gantt.dateFromPos = function(x){
	var scale = this._tasks;
	if(x < 0 || x > scale.full_width || !scale.full_width){
		return null;
	}

	var ind = this._findBinary(this._tasks.left, x);
	var summ = this._tasks.left[ind];

	var col_width = scale.width[ind] || scale.col_width;
	var part = 0;
	if(col_width)
		part = (x - summ)/col_width;

	var unit = 0;
	if(part){
		unit =  gantt._get_coll_duration(scale, scale.trace_x[ind]);
	}

	var date = new Date(scale.trace_x[ind].valueOf() + Math.round(part*unit));
	return date;
};

gantt.posFromDate = function(date){
	var ind = gantt._day_index_by_date(date);
	this.assert(ind >= 0, "Invalid day index");

	var wholeCells = Math.floor(ind);
	var partCell = ind % 1;

	var pos = gantt._tasks.left[Math.min(wholeCells, gantt._tasks.width.length - 1)];
	if(wholeCells == gantt._tasks.width.length)
		pos += gantt._tasks.width[gantt._tasks.width.length - 1];
	//for(var i=1; i <= wholeCells; i++)
	//	pos += gantt._tasks.width[i-1];

	if(partCell){
		if(wholeCells < gantt._tasks.width.length){
			pos += gantt._tasks.width[wholeCells]*(partCell % 1);
		}else{
			pos += 1;
		}

	}
	return pos;
};

gantt._day_index_by_date = function(date){
	var pos = new Date(date).valueOf();
	var days = gantt._tasks.trace_x,
		ignores = gantt._tasks.ignore_x;

	if(pos <= this._min_date)
		return 0;

	if(pos >= this._max_date)
		return days.length;

	/*var day = null;
	for (var xind = 0, length = days.length-1; xind < length; xind++) {
		// | 8:00, 8:30 | 8:15 should be checked against 8:30
		// clicking at the most left part of the cell, say 8:30 should create event in that cell, not previous one
		day = +days[xind+1];
		if (pos < day && !ignores[day])
			break;
	}*/

	var day_ind = gantt._findBinary(days, pos);
	var day = +gantt._tasks.trace_x[day_ind];
	while(ignores[day]){
		day = gantt._tasks.trace_x[++day_ind];
	}

	if(!day) return 0;

	return day_ind + ((date - days[day_ind]) / gantt._get_coll_duration(gantt._tasks, days[day_ind]));


};
gantt._findBinary = function(array, target) {
	// modified binary search, target value not exactly match array elements, looking for closest one

	var low = 0, high = array.length - 1, i, item, prev;
	while (low <= high) {

		i = Math.floor((low + high) / 2);
		item = +array[i];
		prev = +array[i - 1];
		if (item < target){
			low = i + 1; continue;
		}
		if (item > target){
			if(!(!isNaN(prev) && prev < target)) {
				high = i - 1; continue;
			}else{
				// if target is between 'i' and 'i-1' return 'i - 1'
				return i - 1;
			}

		}

		return i;
	}
	return array.length - 1;
};
gantt._get_coll_duration = function(scale, date){
	return gantt.date.add(date, scale.step, scale.unit) -  date;
};

gantt._get_x_pos = function(task, to_start){
	to_start = to_start !== false;
	var x = gantt.posFromDate(to_start ? task.start_date : task.end_date);
};

gantt.getTaskTop = function(task_id){
	return this._y_from_ind(this.getGlobalTaskIndex(task_id));
};

gantt._get_task_coord = function(task, to_start, x_correction){
	to_start = to_start !== false;
	x_correction = x_correction || 0;
	var isMilestone = (this._get_safe_type(task.type) == this.config.types.milestone);

	var date = null;

	if(to_start || isMilestone){
		date = (task.start_date || this._default_task_date(task));
	}else{
		date = (task.end_date || this.calculateEndDate(this._default_task_date(task)));
	}
	var x = this.posFromDate(date),
		y = this.getTaskTop(task.id);

	if(isMilestone){
		if(to_start){
			x -= x_correction;
		}else{
			x += x_correction;
		}
	}
	return {x:x, y:y};
};
gantt._get_task_pos = function(task, to_start){
	to_start = to_start !== false;
	var mstoneCorrection = gantt._get_milestone_width()/2;
	return this._get_task_coord(task, to_start, mstoneCorrection);
};

gantt._get_task_visible_pos = function(task, to_start){
	to_start = to_start !== false;
	var mstoneCorrection = gantt._get_visible_milestone_width()/2;
	return this._get_task_coord(task, to_start, mstoneCorrection);
};


gantt._correct_shift=function(start, back){
	return start-=((new Date(gantt._min_date)).getTimezoneOffset()-(new Date(start)).getTimezoneOffset())*60000*(back?-1:1);
};



gantt._get_mouse_pos = function(ev){
	if (ev.pageX || ev.pageY)
		var pos = {x:ev.pageX, y:ev.pageY};

	var d = gantt.env.isIE ? document.documentElement : document.body;
	var pos = {
		x:ev.clientX + d.scrollLeft - d.clientLeft,
		y:ev.clientY + d.scrollTop - d.clientTop
	};

	var box = gantt._get_position(gantt.$task_data);
	pos.x = pos.x - box.x + gantt.$task_data.scrollLeft;
	pos.y = pos.y - box.y + gantt.$task_data.scrollTop;
	return pos;
};

gantt._is_layer = function(dom_element){
	return (dom_element && dom_element.hasAttribute && dom_element.hasAttribute(this.config.layer_attribute));
};

// --#include core/tasks_canvas_render.js
gantt.attachEvent("onGanttReady", function(){
	gantt._task_layers.add();
	gantt._link_layers.add();
});

gantt._layers = {
	prepareConfig: function(config){
		if(typeof config == "function"){
			config = {renderer: config};
		}

		var id = config.id = gantt.uid();

		if(!config.container)
			config.container = document.createElement("div");

		return config;
	},
	create: function(get_container, rel_root){
		return {
			tempCollection:[],
			renderers:{},
			container: get_container,
			getRenderers: function(){
				var res = [];
				for (var i in this.renderers){
					res.push(this.renderers[i]);
				}
				return res;
			},
			getRenderer: function(id){
				return this.renderers[id];
			},
			add: function(layer){
				if(layer)
					this.tempCollection.push(layer);

				if(!this.container()) return;

				var container = this.container();

				var pending = this.tempCollection;
				for(var i =0; i < pending.length; i++){
					var layer = pending[i];
					var node = layer.container,
						id = layer.id,
						topmost = layer.topmost;
					if(!node.parentNode){
						//insert on top or below the tasks
						if(topmost){
							container.appendChild(node);
						}else{
							var rel = rel_root ? rel_root() : container.firstChild;
							if(rel)
								container.insertBefore(node, rel);
							else
								container.appendChild(node);
						}
					}
					this.renderers[id] = gantt._task_renderer(id, layer.renderer, node, layer.filter);
					this.tempCollection.splice(i,1);
					i--;
				}
			},
			remove: function(id){
				this.renderers[id].unload();
				delete this.renderers[id];
			},
			clear: function(){
				for(var i in this.renderers){
					this.renderers[i].unload();
				}
				this.renderers = {};
			}
		};
	}
};

gantt._create_filter = function(filter_methods){
	if(!(filter_methods instanceof Array)){
		filter_methods = Array.prototype.slice.call(arguments, 0);
	}

	return function(obj){
		var res = true;
		for(var i = 0, len = filter_methods.length; i < len; i++){
			var filter_method = filter_methods[i];
			if(filter_method){
				res = res && (filter_method.apply(gantt, [obj.id, obj]) !== false);
			}
		}

		return res;
	};
};

gantt._add_generic_layer = function(layersManager, filters){
	return function(config){
		if(config.filter === undefined){
			config.filter = gantt._create_filter(filters);
		}
		config = gantt._layers.prepareConfig(config);
		layersManager.add(config);
		return config.id;
	};
};

gantt._task_layers = gantt._layers.create(function(){return gantt.$task_data; }, function(){return gantt.$task_links;});

gantt._link_layers = gantt._layers.create(function(){return gantt.$task_data; });

gantt.addTaskLayer = gantt._add_generic_layer(gantt._task_layers, [gantt._filter_task, gantt._is_chart_visible].concat(gantt._get_task_filters()));

gantt.removeTaskLayer = function(id){
	gantt._task_layers.remove(id);
};

gantt.addLinkLayer = gantt._add_generic_layer(gantt._link_layers, [gantt._filter_link, gantt._is_chart_visible].concat(gantt._get_link_filters()));
gantt.removeLinkLayer = function(id){
	gantt._link_layers.remove(id);
};

gantt._get_task_renderers = function(){
	return this._task_layers.getRenderers();
};
gantt._get_link_renderers = function(){
	return this._link_layers.getRenderers();
};

gantt._pull = {};
gantt._branches = {};
gantt._order = [];
gantt._lpull = {};
gantt._links = [];
gantt._order_full = [];

gantt.load = function(url, type, callback){
	this._load_url = url;
	this.assert(arguments.length, "Invalid load arguments");
	this.callEvent("onLoadStart", []);
	var tp = 'json', cl = null;
	if(arguments.length >= 3){
		tp = type;
		cl = callback;
	}else{
		if(typeof arguments[1] == "string")
			tp = arguments[1];
		else if(typeof arguments[1] == "function")
			cl = arguments[1];
	}

	this._load_type = tp;

	this.ajax.get(url, gantt.bind(function(l) {
		this.on_load(l, tp);
		this.callEvent("onLoadEnd", []);
		if(typeof cl == "function")
			cl.call(this);
	}, this));
};
gantt.parse = function(data, type) {
	this.on_load({xmlDoc: {responseText: data}}, type);
};

gantt.serialize = function(type){
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

 gantt._pull - id to object hash
 gantt._branch - array of per branch arrays of objects|ids
 gantt._order - array of visible elements
 gantt._order_full - array of all elements

 gantt._links
* */

gantt.on_load = function(resp, type){
	this.callEvent("onBeforeParse", []);
	if(!type)
		type = "json";
	this.assert(this[type], "Invalid data type:'" + type + "'");

	var raw = resp.xmlDoc.responseText;

	var data = this[type].parse(raw, resp);
	this._process_loading(data);
};

gantt._load_task = function(task){
	this._init_task(task);
	if (this.callEvent("onTaskLoading", [task])){
		this._pull[task.id] = task;
		return true;
	}
	return false;
};
gantt._build_pull = function(tasks){
	var task = null,
		loaded = [];
	for(var i = 0, len = tasks.length; i< len; i++){
		task = tasks[i];
		if(this._load_task(task))
			loaded.push(task);
	}
	return loaded;
};

gantt._build_hierarchy = function(tasks){
	var task = null;
	for (var i = 0, len = tasks.length; i < len; i++){
		task = tasks[i];
		this.setParent(task, this.getParent(task) || this.config.root_id);
	}

	// calculating $level for each item
	for (var i = 0, len = tasks.length; i < len; i++){
		task = tasks[i];
		this._add_branch(task);
		task.$level = this.calculateTaskLevel(task);
	}
};

gantt._process_loading = function(data){
	if(data.collections)
		this._load_collections(data.collections);

	var order = this._build_pull(data.data);
	this._build_hierarchy(order);

	this._sync_order();
	this._order_synced = true;
	this._init_links(data.links || (data.collections ? data.collections.links : []));
	this.callEvent("onParse", []);
	this.render();
	if(this.config.initial_scroll){
		var id = (this._order[0] || this.config.root_id);
		if(id)
			this.showTask(id);
	}
};


gantt._init_links = function(links){
	if (links)
		for(var i=0; i < links.length; i++){
			if(links[i]){
	        var link = this._init_link(links[i]);
	        this._lpull[link.id] = link;
			}
		}
    this._sync_links();
};


gantt._load_collections = function(collections){
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
				var obj =  this.copy(option);
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

gantt._sync_order = function(silent) {
	this._order = [];
	this._order_full = [];
	this._order_search = {};
	this._sync_order_item({parent:this.config.root_id, $open:true, $ignore:true, id:this.config.root_id});

	if(!silent){
		this._scroll_resize();
		this._set_sizes();
	}
};
gantt.attachEvent("onBeforeTaskDisplay", function(id, task){
	return !task.$ignore;
});
gantt._sync_order_item = function(item, hidden) {
	if(item.id){  //do not trigger event for virtual root

		this._order_full.push(item.id);
		if(!hidden && this._filter_task(item.id, item) &&
			this.callEvent("onBeforeTaskDisplay", [item.id, item])){
			this._order.push(item.id);
			this._order_search[item.id] = this._order.length - 1;
		}
	}

	var children = this.getChildren(item.id);
	if (children){
		for (var i = 0; i < children.length; i++)
			this._sync_order_item(this._pull[children[i]], hidden || !item.$open);
	}
};

gantt.getTaskCount = function(){
	return this._order_full.length;
};

gantt.getLinkCount = function(){
	return this._links.length;
};

gantt.getVisibleTaskCount = function(){
	return this._order.length;
};
gantt.getTaskIndex = function (id) {
	var branch = this.getChildren(this.getParent(id));
	for (var i = 0; i < branch.length; i++)
		if (branch[i] == id)
			return i;

	return -1;
};

gantt.getGlobalTaskIndex = function (id) {
	this.assert(id, "Invalid argument");
	var index = this._order_search[id];
	if(index !== undefined)
		return index;
	else
		return -1;
};

//leave old method for possible backward compatibility issue
gantt._get_visible_order = gantt.getGlobalTaskIndex;

gantt.eachTask = function(code, parent, master){
	parent = parent || this.config.root_id;
	master = master || this;

	var branch = this.getChildren(parent);
	if (branch)
		for (var i=0; i<branch.length; i++){
			var item = this._pull[branch[i]];
			code.call(master, item);
			if (this.hasChild(item.id))
				this.eachTask(code, item.id, master);
		}
};

gantt.json = {
	parse : function(data){
		gantt.assert(data, "Invalid data");

		if (typeof data == "string") {
			if(window.JSON)
				data = JSON.parse(data);
			else{
				gantt.assert(false, "JSON is not supported");
			}
		}

		if (data.dhx_security)
			gantt.security_key = data.dhx_security;
		return data;
	},
	_copyLink:function(obj){
		var copy = {};
		for (var key in obj)
			copy[key] = obj[key];
		return copy;
	},
	_copyObject:function(obj){
		var copy = {};
		for (var key in obj){
			if (key.charAt(0) == "$")
				continue;
			copy[key] = obj[key];

			if(copy[key] instanceof Date){
				copy[key] = gantt.templates.xml_format(copy[key]);
			}
		}
		return copy;
	},
	serialize:function(){
		var tasks = [];
		var links = [];

		gantt.eachTask(function(obj){
			gantt.resetProjectDates(obj);
			tasks.push(this._copyObject(obj));
		}, gantt.config.root_id, this);

		links = gantt._links.slice();

		return {
			data : tasks,
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
	_xmlNodeToJSON:function(node, attrs_only){
		var t = {};
		for (var i = 0; i < node.attributes.length; i++)
			t[node.attributes[i].name] = node.attributes[i].value;

		if (!attrs_only){
			for (var i = 0; i < node.childNodes.length; i++) {
				var child = node.childNodes[i];
				if (child.nodeType == 1)
					t[child.tagName] = child.firstChild ? child.firstChild.nodeValue : "";
			}

			if (!t.text) t.text = node.firstChild ? node.firstChild.nodeValue : "";
		}

		return t;
	},
	_getCollections:function(loader){
		var collection = {};
		var opts =   gantt.ajax.xpath("//coll_options", loader);
		for (var i = 0; i < opts.length; i++) {
			var bind = opts[i].getAttribute("for");
			var arr = collection[bind] = [];
			var itms =  gantt.ajax.xpath(".//item", opts[i]);
			for (var j = 0; j < itms.length; j++) {
				var itm = itms[j];
				var attrs = itm.attributes;
				var obj = { key: itms[j].getAttribute("value"), label: itms[j].getAttribute("label")};
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
	_getXML:function(text, loader, toptag){
		toptag = toptag || "data";
		if (!loader.getXMLTopNode){
			loader = gantt.ajax.parse(loader);
		}

		var xml = gantt.ajax.xmltop(toptag, loader.xmlDoc);
		if (xml.tagName != toptag) throw "Invalid XML data";

		var skey = xml.getAttribute("dhx_security");
		if (skey)
			gantt.security_key = skey;

		return xml;
	},
	parse:function(text, loader){
		loader = this._getXML(text, loader);
		var data = { };

		var evs = data.data = [];
		var xml = gantt.ajax.xpath("//task", loader);

		for (var i = 0; i < xml.length; i++)
			evs[i] = this._xmlNodeToJSON(xml[i]);

		data.collections = this._getCollections(loader);
		return data;
	},
	_copyLink:function(obj){
		return "<item id='"+obj.id+"' source='"+obj.source+"' target='"+obj.target+"' type='"+obj.type+"' />";
	},
	_copyObject:function(obj){
		return "<task id='"+obj.id+"' parent='"+(obj.parent||"")+"' start_date='"+obj.start_date+"' duration='"+obj.duration+"' open='"+(!!obj.open)+"' progress='"+obj.progress+"' end_date='"+obj.end_date+"'><![CDATA["+obj.text+"]]></task>";
	},
	serialize:function(){
		var tasks = [];
		var links = [];

		var json = gantt.json.serialize();
		for(var i= 0, len = json.data.length; i < len; i++){
			tasks.push(this._copyObject(json.data[i]));
		}
		for(var i= 0, len = json.links.length; i < len; i++){
			links.push(this._copyLink(json.links[i]));
		}
		return "<data>"+tasks.join("")+"<coll_options for='links'>"+links.join("")+"</coll_options></data>";			
	}
};


gantt.oldxml = {
	parse:function(text, loader){
		loader = gantt.xml._getXML(text, loader, "projects");
		var data = { collections:{ links:[] } };

		var evs = data.data = [];
		var xml = gantt.ajax.xpath("//task", loader);

		for (var i = 0; i < xml.length; i++){
			evs[i] = gantt.xml._xmlNodeToJSON(xml[i]);
			var parent = xml[i].parentNode;

			if (parent.tagName == "project")
				evs[i].parent = "project-"+parent.getAttribute("id");
			else
				evs[i].parent = parent.parentNode.getAttribute("id");
		}

		xml = gantt.ajax.xpath("//project", loader);
		for (var i = 0; i < xml.length; i++){
			var ev = gantt.xml._xmlNodeToJSON(xml[i], true);
			ev.id ="project-"+ev.id;
			evs.push(ev);
		}

		for (var i=0; i<evs.length; i++){
			var ev = evs[i];
			ev.start_date = ev.startdate || ev.est;
			ev.end_date = ev.enddate;
			ev.text = ev.name;
			ev.duration = ev.duration / 8;
			ev.open = 1;
			if (!ev.duration && !ev.end_date) ev.duration = 1;
			if (ev.predecessortasks)
				data.collections.links.push({ target:ev.id, source:ev.predecessortasks, type:gantt.config.links.finish_to_start });
		}

		return data;
	},
	serialize:function(){
		gantt.message("Serialization to 'old XML' is not implemented");
	}
};

gantt.serverList = function(name, array) {
	if (array) {
		this.serverList[name] = array.slice(0);
	}else if(!this.serverList[name]){
		this.serverList[name] = [];
	}
	return this.serverList[name];
};

gantt._working_time_helper = {
	units : [
		"year",
		"month",
		"week",
		"day",
		"hour",
		"minute"
	],

	hours:[8, 17],
	dates:{
		0:false,
		6:false
	},

	// cache previously calculated worktime
	_working_units_cache: {
		_cache: {},

		get: function(unit, date) {
			var result = -1;// default value (if not existed in the cache)

			var cache = this._cache;
			if(cache && cache[unit]){
				var units = cache[unit];
				var time = date.getTime();
				if(units[time] !== undefined)
					result = units[time];
			}
			return result;
		},

		put: function(unit, date, value) {
			if(!unit || !date) return false;

			var cache = this._cache;

			var time = date.getTime();

			value = !!value;

			if(!cache) return false;
			if(!cache[unit]) cache[unit] = {};
			cache[unit][time] = value;
			return true;
		},

		clear: function() {
			this._cache = {};
		}
	},

	_get_unit_order : function(unit){
		for(var i= 0, len =  this.units.length; i < len; i++){
			if(this.units[i] == unit)
				return i;
		}
		gantt.assert(false, "Incorrect duration unit");
	},

	_timestamp:function(settings){

		var timestamp = null;
		if((settings.day || settings.day === 0)){
			timestamp = settings.day;
		}else if(settings.date){
			timestamp = gantt.date.date_part(new Date(settings.date)).valueOf();
		}
		return timestamp;
	},
	set_time:function(settings){
		var hours = settings.hours !== undefined ? settings.hours : true;

		var timestamp = this._timestamp(settings);

		if(timestamp !== null){
			this.dates[timestamp] = hours;
		}else{
			this.hours = hours;
		}

		this._working_units_cache.clear();
	},
	unset_time:function(settings){


		if(!settings){
			this.hours = [];
		}else{

			var timestamp = this._timestamp(settings);

			if(timestamp !== null){
				delete this.dates[timestamp];
			}
		}
		// Clear work units cache
		this._working_units_cache.clear();
	},

	is_working_unit : function(date, unit, order){
		if(!gantt.config.work_time) return true;

		//Check if this item has in the cache
		var is_work_unit = this._working_units_cache.get(unit, date);

		if(is_work_unit == -1) {
			// calculate if not cached
			is_work_unit = this._check_is_working_unit(date, unit, order);
			this._working_units_cache.put(unit, date, is_work_unit);
		}

		return is_work_unit;
	},

	_check_is_working_unit: function(date, unit, order) {
		if(order === undefined){
			order = this._get_unit_order(unit);
		}
		if(order === undefined){
			return false;
		}
		if(order){
			//check if bigger time unit is a work time (hour < day < month...)
			//i.e. don't check particular hour if the whole day is marked as not working
			if(!this.is_working_unit(date, this.units[order-1], order-1))
				return false;
		}
		if(!this["is_work_" + unit])
			return true;
		return this["is_work_" + unit](date);
	},

	//checkings for particular time units
	//methods for month-year-week can be defined, otherwise always return 'true'
	is_work_day:function(date){
		var val = this.get_working_hours(date);

		if(val instanceof Array){
			return val.length > 0;
		}
		return false;
	},
	is_work_hour:function(date){
		var hours = this.get_working_hours(date);
		var hour = date.getHours();
		for(var i=0; i < hours.length; i += 2){
			if(hours[i+1] === undefined){
				return hours[i] == hour;
			}else{
				if(hour >= hours[i] && hour < hours[i+1])
					return true;
			}
		}
		return false;
	},

	get_working_hours:function(date){
		var t = this._timestamp({date:date});
		var hours = true;
		if(this.dates[t] !== undefined){
			hours = this.dates[t];//custom day
		}else if(this.dates[date.getDay()] !== undefined){
			hours = this.dates[date.getDay()];//week day
		}
		if(hours === true){
			return this.hours;
		}else if(hours){
			return hours;
		}
		return [];


	},

	intern_dates_pull: {},

	next_date: function(start, unit, step){
		var start_value = +start,
			key = unit + "_" + step;
		var interned = this.intern_dates_pull[key];
		if(!interned){
			interned = this.intern_dates_pull[key] = {};
		}
		if(!interned[start_value]){
			interned[start_value] = gantt.date.add(start, step, unit);
		}

		return interned[start_value];
	},
	get_work_units_between:function(from, to, unit, step){
		if(!unit){
			return false;
		}
		var start = new Date(from),
			end = new Date(to),
			step = step || 1;
		var units = 0;

		while(start.valueOf() < end.valueOf()){
			if(this.is_working_unit(start, unit))
				units++;
			start = this.next_date(start, unit, step);
		}
		return units;
	},

	is_work_units_between:function(from, to, unit, step){
		if(!unit){
			return false;
		}
		var start = new Date(from),
			end = new Date(to),
			step = step || 1;

		while(start.valueOf() < end.valueOf()){
			if(this.is_working_unit(start, unit))
				return true;
			start = this.next_date(start, unit, step);
		}
		return false;
	},
	add_worktime : function(from, duration, unit, step){
		if(!unit)
			return false;

		var start = new Date(from),
			added = 0,
			step = step || 1,
			duration = duration*1;

		if(!gantt.config.work_time){
			return gantt.date.add(start, step*duration, unit);
		}else{

			while(added < duration){
				var next = this.next_date(start, unit, step);
				//if(this.is_working_unit(step > 0 ? start : next, unit))
				if(this.is_working_unit(step > 0 ? new Date(next.valueOf() - 1) : new Date(next.valueOf() + 1), unit))
					added++;
				start = next;
			}
			return start;
		}
	},

	/* settings:
		{
		date:date,
		unit:'day'/'hour'...,
		dir:'future'/'past'/'any'/''
		}
	 */
	get_closest_worktime : function(settings){
		if(this.is_working_unit(settings.date, settings.unit))
			return settings.date;

		var unit = settings.unit;

		var curr = gantt.date[unit + '_start'](settings.date);

		var future_target = new Date(curr),
			prev_target = new Date(curr),
			tick = true,
			maximum_loop = 3000,//be extra sure we won't fall into infinite loop, 3k seems big enough
			count = 0,
			both_directins = (settings.dir == 'any' || !settings.dir);

		var inc = 1;
		if(settings.dir == 'past')
			inc = -1;

		//will seek closest working hour in future or in past, one step in one direction per iteration
		while(!this.is_working_unit(curr, unit)){

			if(both_directins){
				curr = tick ? future_target : prev_target;
				inc = inc*(-1);
			}
			var tzOffset = curr.getTimezoneOffset();
			curr = gantt.date.add(curr, inc, unit);

			curr = gantt._correct_dst_change(curr, tzOffset, inc, unit);
			if(gantt.date[unit + '_start'])
				curr = gantt.date[unit + '_start'](curr);

			if(both_directins){
				if(tick){
					future_target = curr;
				}else{
					prev_target = curr;
				}
			}
			tick = !tick;
			count++;
			if(count > maximum_loop){
				gantt.assert(false, "Invalid working time check");
				return false;
			}
		}

		if(curr == prev_target || settings.dir == 'past'){
			curr = gantt.date.add(curr, 1, unit);
		}

		return curr;
	}


};

gantt.getTask = function(id) {
    gantt.assert(id, "Invalid argument for gantt.getTask");
	var task = this._pull[id];
    gantt.assert(task, "Task not found id=" + id);
    return task;
};
gantt.getTaskByTime = function(from, to){
	var p = this._pull,
		res = [],
		pos = 0,
		taken = 0;

	if(!(from || to)){
        for (var t in p) res.push(p[t]);
	}else{
		from = +from || -Infinity;
		to = +to || Infinity;
        for (var t in p){
            var task = p[t];
            if (+task.start_date < to && +task.end_date > from)
                res.push(task);
        }
	}

	return res;
};

gantt.isTaskExists = function(id) {
    return gantt.defined(this._pull[id]);
};

gantt.isUnscheduledTask = function(task){
	return (!!task.unscheduled || !task.start_date);
};

gantt._isAllowedUnscheduledTask = function(task){
	return (task.unscheduled && gantt.config.show_unscheduled);
};
gantt.isTaskVisible = function(id){
	if(!this._pull[id])
		return false;

	var task = this._pull[id];
	if(!((+task.start_date < +this._max_date && +task.end_date > +this._min_date) || gantt._isAllowedUnscheduledTask(task)))
		return false;

	if(this._order_search[id] !== undefined) return true;
	return false;
};


gantt.updateTask = function(id, item) {
    if (!gantt.defined(item)) item = this.getTask(id);
    if (this.callEvent("onBeforeTaskUpdate", [id, item])===false) return false;

    this._pull[item.id] = item;
	if(!this._is_parent_sync(item)){
		this._resync_parent(item);
	}

	if(this._isAllowedUnscheduledTask(item)){
		this._init_task(item);
		this._sync_links();
	}

	this._update_parents(item.id);
    this.refreshTask(item.id);

    this.callEvent("onAfterTaskUpdate", [id, item]);

    this._sync_order();

	this._adjust_scales();
};

gantt._add_branch = function(task, index){
	var pid = this.getParent(task);
	if (!this.hasChild(pid))
		this._branches[pid] = [];
	var branch = this.getChildren(pid);
	var added_already = false;
	for(var i = 0, length = branch.length; i < length; i++){
		if(branch[i] == task.id){
			added_already = true;
			break;
		}
	}
	if(!added_already){
		if(index*1 == index){
			branch.splice(index, 0, task.id);
		}else{
			branch.push(task.id);
		}
	}

	this._sync_parent(task);
};

gantt._move_branch = function(task, old_parent, new_parent){
	this.setParent(task, new_parent);
	this._sync_parent(task);
	this._replace_branch_child(old_parent, task.id);
	if(this.isTaskExists(new_parent) || new_parent == this.config.root_id){

		this._add_branch(task);
	}else{
		delete this._branches[task.id];
	}
	task.$level =  this.calculateTaskLevel(task);
	this._sync_order();
};
gantt._resync_parent = function(task){
	this._move_branch(task, task.$rendered_parent, this.getParent(task));
};
gantt._sync_parent = function(task){
	task.$rendered_parent = this.getParent(task);
};
gantt._is_parent_sync = function(task){
	return (task.$rendered_parent == this.getParent(task));
};


gantt._replace_branch_child = function(node, old_id, new_id){
	var branch = this.getChildren(node);
	if (branch){
		var newbranch = [];
		for (var i=0; i<branch.length; i++){
			if (branch[i] != old_id)
				newbranch.push(branch[i]);
			else if (new_id)
				newbranch.push(new_id);
		}
		this._branches[node] = newbranch;
	}
	this._sync_order();
};

gantt.addTask = function(item, parent, index) {
    if (!gantt.defined(parent)) parent = this.getParent(item) || 0;
    if (!this.isTaskExists(parent)) parent = 0;
    this.setParent(item, parent);
    item = this._init_task(item);

    if (this.callEvent("onBeforeTaskAdd", [item.id, item])===false) return false;

    this._pull[item.id] = item;

	this._add_branch(item, index);
	this.callEvent("onAfterTaskAdd", [item.id, item]);

    this.refreshData();
	this._adjust_scales();

    return item.id;
};


gantt._default_task_date = function(item, parent_id){
	var parent = (parent_id && parent_id != this.config.root_id) ? this.getTask(parent_id) : false,
		startDate = '';
	if(parent){
		startDate = parent.start_date;
	}else{
		var first = this._order[0];
		startDate = first ? (this.getTask(first).start_date ? this.getTask(first).start_date : (this.getTask(first).end_date ? this.calculateEndDate(this.getTask(first).end_date, -this.config.duration_step) : '')) : this.config.start_date || this.getState().min_date;
	}
	gantt.assert(startDate, "Invalid dates");
	return new Date(startDate);
};

gantt._set_default_task_timing = function(task){
	task.start_date = task.start_date || gantt._default_task_date(task, this.getParent(task));
	task.duration = task.duration || this.config.duration_step;
	task.end_date = task.end_date || this.calculateEndDate(task.start_date, task.duration);
};

gantt.createTask = function(item, parent, index){
	item = item || {};
	item.id = gantt.uid();
	if(!item.start_date){
		item.start_date = gantt._default_task_date(item, parent);
	}
	if(item.text === undefined){
		item.text = gantt.locale.labels.new_task;
	}
	if(item.duration === undefined){
		item.duration = 1;
	}

	if(parent){
		this.setParent(item, parent);
		var parentObj = this.getTask(parent);
		parentObj.$open = true;
	}

	if(!this.callEvent("onTaskCreated", [item])){
		return null;
	}
	if (this.config.details_on_create){
		item.$new = true;
		this._pull[item.id] = this._init_task(item);

		this._add_branch(item, index);
		item.$level = this.calculateTaskLevel(item);
		this.selectTask(item.id);
		this.refreshData();
		this.showLightbox(item.id);
	}else{
		if (this.addTask(item, parent, index)){
			this.showTask(item.id);
			this.selectTask(item.id);
		}
	}
	return item.id;
};

gantt.deleteTask = function(id) {
    return this._deleteTask(id);
};

//TODO: do something with overcomplicated dataprocessor logic
gantt._getChildLinks = function(id){
	var item = this.getTask(id);
	if(!item){
		return [];
	}

	var links = item.$source.concat(item.$target);

	var branches = this.getChildren(item.id);
	for (var i = 0; i < branches.length; i++) {
		links = links.concat(this._getChildLinks(branches[i]));
	}

	var res = {};
	for(var i=0; i < links.length; i++){
		res[links[i]] = true;
	}
	links = [];
	for(var i in res){
		links.push(i);
	}

	return links;
};
gantt._getTaskTree = function(id){
	var item = this.getTask(id);
	if(!item){
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
gantt._deleteRelatedLinks = function(links, silent){
	var use_dp = (this._dp && !silent);
	var prev_mode = '';
	var send_changes = use_dp ? this._dp.updateMode != 'off' : false;
	if (use_dp){
		prev_mode = this._dp.updateMode;
		this._dp.setUpdateMode("off");
	}
	for(var i =0; i < links.length; i++){
		if (use_dp) {
			this._dp.setGanttMode("links");
			this._dp.setUpdated(links[i],true,"deleted");
		}
		this._deleteLink(links[i], true);
	}

	if(use_dp){
		this._dp.setUpdateMode(prev_mode);
		if(send_changes)
			this._dp.sendAllData();
	}
};
gantt._deleteRelatedTasks = function(id, silent){
	var use_dp = (this._dp && !silent);
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
		this._unset_task(t_id);
		if(use_dp){
			this._dp.setUpdated(t_id,true,"deleted");
		}
	}
	if(use_dp){

		this._dp.setUpdateMode(prev_mode);
	}
};
gantt._unset_task = function(id){
	var item = this.getTask(id);
	this._update_flags(id, null);
	delete this._pull[id];
	this._move_branch(item, this.getParent(item), null);
};
gantt._deleteTask = function(id, silent) {
    var item = this.getTask(id);
    if (!silent && this.callEvent("onBeforeTaskDelete", [id, item])===false) return false;

	var links = gantt._getChildLinks(id);
	this._deleteRelatedTasks(id, silent);
	this._deleteRelatedLinks(links, silent);
	this._unset_task(id);
    if (!silent) {
        this.callEvent("onAfterTaskDelete", [id, item]);
        this.refreshData();
    }
    return true;
};

gantt.clearAll = function() {
	this._clear_data();
	this.callEvent("onClear", []);
	this.refreshData();
};
gantt._clear_data = function(){
	this._pull = {};
	this._branches = {};
	this._order = [];
	this._order_full = [];
	this._lpull = {};
	this._links = [];
	this._update_flags();
	this.userdata = {};
};

gantt._update_flags = function(oldid, newid){
	// TODO: need a proper way to update all possible flags
	if(oldid === undefined){
		this._lightbox_id = this._selected_task = null;
		if (this._tasks_dnd.drag){
			this._tasks_dnd.drag.id = null;
		}
	}else{
		if (this._lightbox_id == oldid)
			this._lightbox_id = newid;
		if (this._selected_task == oldid){
			this._selected_task = newid;
		}
		if (this._tasks_dnd.drag && this._tasks_dnd.drag.id == oldid){
			this._tasks_dnd.drag.id = newid;
		}
	}
};
gantt.changeTaskId = function(oldid, newid) {
    var item = this._pull[newid] = this._pull[oldid];
    this._pull[newid].id = newid;
    delete this._pull[oldid];

	this._update_flags(oldid, newid);
	this._replace_branch_child(this.getParent(item), oldid, newid);

    for (var id in this._pull) {
		var task = this._pull[id];
		if(this.getParent(task) == oldid) {
			this.setParent(task, newid);
			this._resync_parent(task);
		}
    }

	var links = this._get_task_links(item);

	for(var i = 0; i < links.length; i++) {
		var link = this.getLink(links[i]);
		if (link.source == oldid) {
			link.source = newid;
		}
		if (link.target == oldid) {
			link.target = newid;
		}
	}


	this.callEvent("onTaskIdChange", [oldid, newid]);
};

gantt._get_task_links = function(task){
	var links = [];

	if(task.$source) {
		links = links.concat(task.$source);
	}
	if(task.$target) {
		links = links.concat(task.$target);
	}

	return links;
};

gantt._get_duration_unit = function(){
	return (gantt._get_line(this.config.duration_unit)*1000) || this.config.duration_unit;
};

gantt._get_safe_type = function(type){
	return "task";
};
gantt._get_type_name = function(type_value){
	for(var i in this.config.types){
		if(this.config.types[i] == type_value){
			return i;
		}
	}
	return "task";
};
gantt.getWorkHours = function(date){
	return this._working_time_helper.get_working_hours(date);
};

gantt.setWorkTime = function(config){
	this._working_time_helper.set_time(config);
};

gantt.isWorkTime = function(date, unit){
	var helper = this._working_time_helper;
	return helper.is_working_unit(date, unit || this.config.duration_unit);
};

gantt.correctTaskWorkTime = function(task){
	if(gantt.config.work_time && gantt.config.correct_work_time){
		if(!gantt.isWorkTime(task.start_date)){
			task.start_date = gantt.getClosestWorkTime({date:task.start_date, dir:'future'});
			task.end_date = gantt.calculateEndDate(task.start_date, task.duration);
		}else if(!gantt.isWorkTime(new Date(+task.end_date - 1))){
			task.end_date = gantt.calculateEndDate(task.start_date, task.duration);
		}
	}
};

gantt.getClosestWorkTime = function(config){
	var helper = this._working_time_helper;
	if(config instanceof Date){
		config = {
			date:config
		};
	}
	config.dir = config.dir || 'any';
	config.unit = config.unit || this.config.duration_unit;
	return helper.get_closest_worktime(config);
};

gantt.calculateDuration = function(start_date, end_date){
	var helper = this._working_time_helper;
	return helper.get_work_units_between(start_date, end_date, this.config.duration_unit, this.config.duration_step);
};
gantt._hasDuration = function(start_date, end_date){
	var helper = this._working_time_helper;
	return helper.is_work_units_between(start_date, end_date, this.config.duration_unit, this.config.duration_step);
};

gantt.calculateEndDate = function(start, duration, unit){
	var helper = this._working_time_helper;
	var mult = duration >= 0 ? 1 : -1;
	return helper.add_worktime(start, Math.abs(duration), unit || this.config.duration_unit, mult*this.config.duration_step);
};

gantt._init_task = function(task){
    if (!gantt.defined(task.id))
        task.id = gantt.uid();

	if(task.start_date)
		task.start_date = gantt.date.parseDate(task.start_date, "xml_date");
	if(task.end_date)
		task.end_date = gantt.date.parseDate(task.end_date, "xml_date");



	if(task.start_date){
		if(!task.end_date && task.duration){
			task.end_date = this.calculateEndDate(task.start_date, task.duration);
		}
	} else if(task.end_date && task.duration !== undefined){
		task.start_date = this.calculateEndDate(task.end_date, - task.duration);
	}

	if(this._isAllowedUnscheduledTask(task)){
		this._set_default_task_timing(task);
	}
	gantt._init_task_timing(task);
	if(task.start_date && task.end_date)
		gantt.correctTaskWorkTime(task);

    task.$source = [];
    task.$target = [];
	if(task.parent === undefined){
		this.setParent(task, this.config.root_id);
	}

	if(!gantt.defined(task.$open)){
		task.$open = gantt.defined(task.open) ? task.open : this.config.open_tree_initially;
	}
    task.$level = this.calculateTaskLevel(task);
    return task;
};

gantt._init_task_timing = function(task){
	var task_type = this._get_safe_type(task.type);

	if(task.$rendered_type === undefined){
		task.$rendered_type = task_type;
	}else if(task.$rendered_type != task_type){
		delete task.$no_end;
		delete task.$no_start;
		task.$rendered_type = task_type;
	}

	if((task.$no_end === undefined || task.$no_start === undefined) && task_type != this.config.types.milestone){
		if(task_type == this.config.types.project){
			//project duration is always defined by children duration
			task.$no_end = task.$no_start = true;
			this._set_default_task_timing(task);
		}else{
			//tasks can have fixed duration, children duration(as projects), or one date fixed, and other defined by nested items
			task.$no_end = !(task.end_date || task.duration);
			task.$no_start = !task.start_date;

			if(this._isAllowedUnscheduledTask(task)){
				task.$no_end = task.$no_start = false;
			}

		}
	}

	if(task_type == this.config.types.milestone){
		task.end_date = task.start_date;
	}
	if (task.start_date && task.end_date){
		task.duration = this.calculateDuration(task.start_date, task.end_date);
	}
	task.duration = task.duration || 0;
};
gantt._is_flex_task = function(task){
	return !!(task.$no_end || task.$no_start);
};

// downward calculation of project duration
gantt.resetProjectDates = function(task){
	if(task.$no_end || task.$no_start){
		var dates = this.getSubtaskDates(task.id);
		this._assign_project_dates(task, dates.start_date, dates.end_date);
	}
};

gantt.getSubtaskDates = function(task_id){
	var min = null,
		max = null,
		root = task_id !== undefined ? task_id : gantt.config.root_id;

	this.eachTask(function(child){
		if(this._get_safe_type(child.type) == gantt.config.types.project || this.isUnscheduledTask(child))
			return;

		if((child.start_date && !child.$no_start) && (!min || min > child.start_date.valueOf()))
			min = child.start_date.valueOf();
		if((child.end_date && !child.$no_end) && (!max || max < child.end_date.valueOf()))
			max = child.end_date.valueOf();
	}, root);

	return {
		start_date: min ? new Date(min) : null,
		end_date: max ? new Date(max): null
	};
};

gantt._assign_project_dates = function(task, from, to){
	if(task.$no_start){
		if(from && from != Infinity){
			task.start_date = new Date(from);
		}else{
			task.start_date = this._default_task_date(task, this.getParent(task));
		}
	}

	if(task.$no_end){
		if(to && to != -Infinity){
			task.end_date = new Date(to);
		}else{
			task.end_date = this.calculateEndDate(task.start_date, this.config.duration_step);
		}
	}
	if(task.$no_start || task.$no_end){
		this._init_task_timing(task);
	}
};

// upward calculation of project duration
gantt._update_parents = function(taskId, silent){
	if(!taskId) return;

	var task = this.getTask(taskId);
	var pid = this.getParent(task);

	var has_changed = true;

	if(task.$no_start || task.$no_end){
		var oldStart = task.start_date.valueOf(),
			oldEnd = task.end_date.valueOf();

		gantt.resetProjectDates(task);

		// not refresh parent projects if dates hasn't changed
		if(oldStart == task.start_date.valueOf() && oldEnd == task.end_date.valueOf()){
			has_changed = false;
		}

		if(has_changed && !silent){
			this.refreshTask(task.id, true);
		}
	}


	if(has_changed && pid && this.isTaskExists(pid)){
		this._update_parents(pid, silent);
	}
};
gantt.isChildOf = function(child_id, parent_id){
	if(!this.isTaskExists(child_id))
		return false;
	if(parent_id === this.config.root_id)
		return this.isTaskExists(child_id);

	var task = this.getTask(child_id);
	var pid = this.getParent(child_id);

	while(task && this.isTaskExists(pid)){
		task = this.getTask(pid);

		if(task && task.id == parent_id)
			return true;
		pid = this.getParent(task);
	}
	return false;
};

gantt.roundDate = function(config){
	if(config instanceof Date){
		config = {
			date: config,
			unit: gantt._tasks.unit,
			step: gantt._tasks.step
		};
	}
	var date = config.date,
		steps = config.step,
		unit = config.unit;

	var upper, lower, colIndex;
	if(unit == gantt._tasks.unit && steps == gantt._tasks.step &&
		+date >= +gantt._min_date && +date <= +gantt._max_date){
		//find date in time scale config
		colIndex = Math.floor(gantt._day_index_by_date(date));

		if(!gantt._tasks.trace_x[colIndex]){
			colIndex -= 1;// end of time scale
		}
		lower = new Date(gantt._tasks.trace_x[colIndex]);

		upper = new Date(lower);
		if(gantt._tasks.trace_x[colIndex + 1]){
			upper = new Date(gantt._tasks.trace_x[colIndex + 1]);
		}else{
			upper = gantt.date.add(lower, steps, unit);
		}
	}else{
		colIndex = Math.floor(gantt._day_index_by_date(date));

		upper = gantt.date[unit + "_start"](new Date(this._min_date));
		if(gantt._tasks.trace_x[colIndex]){
			upper = gantt.date[unit + "_start"](gantt._tasks.trace_x[colIndex]);// end of time scale
		}

		while(+upper < +date){
			upper = gantt.date[unit + "_start"](gantt.date.add(upper, steps, unit));

			var tzOffset = upper.getTimezoneOffset();
			upper = gantt.date.add(upper, steps, unit);
			upper = gantt._correct_dst_change(upper, tzOffset, upper, unit);
			if(gantt.date[unit + '_start'])
				upper = gantt.date[unit + '_start'](upper);
		}

		lower = gantt.date.add(upper, -1*steps, unit);

	}
	if(config.dir && config.dir == 'future')
		return upper;
	if(config.dir && config.dir == 'past')
		return lower;

	if(Math.abs(date - lower) < Math.abs(upper - date)){
		return lower;
	}else{
		return upper;
	}

};


gantt.attachEvent("onBeforeTaskUpdate", function(id, task){
	gantt._init_task_timing(task);
	return true;
});
gantt.attachEvent("onBeforeTaskAdd", function(id, task){
	gantt._init_task_timing(task);
	return true;
});

gantt.calculateTaskLevel = function (item) {
    var level = 0;
    while (this.getParent(item)) {
        if (!this.isTaskExists(this.getParent(item))) break;
        item = this.getTask(this.getParent(item));
        level++;
    }
    return level;
};


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
            temp[i] = this._pull[els[i]];

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

gantt.getNext = function(id) {
    for (var i = 0; i < this._order.length-1; i++) {
        if (this._order[i] == id)
            return this._order[i+1];
    }
    return null;
};
gantt.getPrev = function(id) {
    for (var i = 1; i < this._order.length; i++) {
        if (this._order[i] == id)
            return this._order[i-1];
    }
    return null;
};

gantt._get_parent_id = function(task){
	var parent = this.config.root_id;
	if(task){
		parent = task.parent;
	}
	return parent;
};

gantt.getParent = function(id){
	var task = null;
	if(id.id){
		task = id;
	}else{
		task = gantt.getTask(id);
	}

	return this._get_parent_id(task);
};



gantt.setParent = function(task, new_pid){
	task.parent = new_pid;
};

gantt.getSiblings = function(id){
	if(!this.isTaskExists(id)){
		return [];
	}
	var parent = this.getParent(id);
	return this.getChildren(parent);
};
gantt.getNextSibling = function(id){
	var siblings = this.getSiblings(id);
	for(var i= 0, len = siblings.length; i < len; i++){
		if(siblings[i] == id)
			return siblings[i+1] || null;
	}
	return null;
};
gantt.getPrevSibling = function(id){
	var siblings = this.getSiblings(id);
	for(var i= 0, len = siblings.length; i < len; i++){
		if(siblings[i] == id)
			return siblings[i-1] || null;
	}
	return null;
};

gantt._dp_init = function(dp) {
    dp.setTransactionMode("POST", true);
    dp.serverProcessor += (dp.serverProcessor.indexOf("?") != -1 ? "&" : "?") + "editing=true";
    dp._serverProcessor = dp.serverProcessor;

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
    this.attachEvent("onAfterTaskDelete", function(id, item) {
        dp.setGanttMode("tasks");
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
        dp.setUpdated(id, true,"deleted");
    });
    this.attachEvent("onRowDragEnd", function(id, target) {
        gantt._sendTaskOrder(id, gantt.getTask(id));
    });


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
			itemLinks = this._get_task_links(item);

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
			this.serverProcessor = url + gantt._urlSeparator(url) + "gantt_mode=" + this._ganttMode;
		}

        return true;
    });

	this._init_dp_live_update_hooks(dp);

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
            if (value instanceof Date)
                data[key] = this.templates.xml_format(value);
            else if(value === null)
				data[key] = "";
            else
                data[key] = value;
        }
		if(task.$no_start){
			task.start_date = "";
			task.duration = "";
		}
		if(task.$no_end){
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


gantt._init_link = function(link) {
    if (!gantt.defined(link.id))
        link.id = gantt.uid();
    return link;
};

gantt._sync_links = function() {

	var task = null;
	for(var i = 0, len = this._order_full.length; i < len; i++){
		task = this._pull[this._order_full[i]];
		task.$source = [];
		task.$target = [];
	}
	this._links = [];

    for (var id in this._lpull) {

        var link = this._lpull[id];

		this._links.push(link);
        if(this._pull[link.source])
            this._pull[link.source].$source.push(id);
        if(this._pull[link.target])
            this._pull[link.target].$target.push(id);
    }
};

gantt.getLink = function(id) {
	gantt.assert(this._lpull[id], "Link doesn't exist");
    return this._lpull[id];
};

gantt.getLinks = function(){
	var links = [];
	for (var key in gantt._lpull)
		links.push(gantt._lpull[key]);
	return links;
};

gantt.isLinkExists = function(id) {
    return gantt.defined(this._lpull[id]);
};

gantt.addLink = function(link) {
    link = this._init_link(link);

    if (this.callEvent("onBeforeLinkAdd", [link.id, link])===false) return false;

    this._lpull[link.id] = link;
    this._sync_links();
	this._render_link(link.id);
    this.callEvent("onAfterLinkAdd", [link.id, link]);
    return link.id;
};

gantt.updateLink = function(id, data) {
    if (!gantt.defined(data))
        data = this.getLink(id);

    if (this.callEvent("onBeforeLinkUpdate", [id, data]) === false) return false;

    this._lpull[id] = data;
    this._sync_links();
	this._render_link(id);
    this.callEvent("onAfterLinkUpdate", [id, data]);
    return true;
};

gantt.deleteLink = function(id) {
    return this._deleteLink(id);
};

gantt._deleteLink = function(id, silent) {
    var link = this.getLink(id);
    if (!silent && this.callEvent("onBeforeLinkDelete", [id, link])===false) return false;

    delete this._lpull[id];
    this._sync_links();
    this.refreshLink(id);
    if (!silent) this.callEvent("onAfterLinkDelete", [id, link]);
    return true;
};

gantt.changeLinkId = function(oldid, newid) {
	if(this._lpull[oldid]){
		this._lpull[newid] = this._lpull[oldid];
		this._lpull[newid].id = newid;
		delete this._lpull[oldid];

		this._sync_links();
		this.callEvent("onLinkIdChange", [oldid, newid]);
	}
};


gantt.getChildren = function(id) {
    return gantt.defined(this._branches[id]) ? this._branches[id] : [];
};
gantt.hasChild = function(id) {
    return (gantt.defined(this._branches[id]) && this._branches[id].length);
};


gantt.refreshData = function(){
	this._render_data();
};

gantt._isTask = function (task) {
	return (!task.type || task.type != gantt.config.types.project) && !(task.$no_start || task.$no_end);
};

gantt._isProject = function (task) {
	return !this._isTask(task);
};
gantt._configure = function(col, data, force){
	for (var key in data)
		if (typeof col[key] == "undefined" || force)
			col[key] = data[key];
};
gantt._init_skin = function(){
	gantt._get_skin(false);
	gantt._init_skin = function(){};
};
gantt._get_skin = function(force){
	if (!gantt.skin || force){
		var links = document.getElementsByTagName("link");
		for (var i = 0; i < links.length; i++) {
			var res = links[i].href.match("dhtmlxgantt_([a-z]+).css");
			if (res){
				gantt.skin = res[1];
				break;
			}
		}
	}

	if (!gantt.skin) gantt.skin = "terrace";
	var skinset = gantt.skins[gantt.skin];

	//apply skin related settings
	this._configure(gantt.config, skinset.config, force);

	var config = gantt.getGridColumns();
	if (config[1] && typeof config[1].width == "undefined")
		config[1].width = skinset._second_column_width;
	if (config[2] && typeof config[2].width == "undefined")
		config[2].width = skinset._third_column_width;

	if (skinset._lightbox_template)
		gantt._lightbox_template = skinset._lightbox_template;

	gantt.resetLightbox();
};
gantt.resetSkin = function(){
	this.skin = "";
	this._get_skin(true);
};
gantt.skins = {};


gantt._lightbox_methods = {};
gantt._lightbox_template="<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span></div><div class='gantt_cal_larea'></div>";

gantt.showLightbox=function(id){
    if (!id || gantt._is_readonly(this.getTask(id))) return;
    if (!this.callEvent("onBeforeLightbox",[id])) return;

	var task = this.getTask(id);

    var box = this.getLightbox(this._get_safe_type(task.type));
    this._center_lightbox(box);
    this.showCover();
    this._fill_lightbox(id,box);
    this.callEvent("onLightbox",[id]);
};
gantt._get_timepicker_step = function(){
	if(this.config.round_dnd_dates){
		var scale = gantt._tasks,
			step = (this._get_line(scale.unit) * scale.step)/60;//timepicker step is measured in minutes
		if(step >= 60*24 || !this._is_chart_visible()){
			step = this.config.time_step;
		}
		return step;
	}
	return this.config.time_step;
};
gantt.getLabel = function(property, key) {
    var sections = this._get_typed_lightbox_config();
    for (var i=0; i<sections.length; i++) {
        if(sections[i].map_to == property) {
            var options = sections[i].options;
            for (var j=0; j<options.length; j++) {
                if(options[j].key == key) {
                    return options[j].label;
                }
            }
        }
    }
    return "";
};

gantt.updateCollection = function(list_name, collection) {
	collection = collection.slice(0);
	var list = gantt.serverList(list_name);
	if (!list) return false;
	list.splice(0, list.length);
	list.push.apply(list, collection || []);
	gantt.resetLightbox();
};
gantt.getLightboxType = function(){
	return this._get_safe_type(this._lightbox_type);
};
gantt.getLightbox = function(type){
	if(type === undefined)
		type = this.getLightboxType();

    if (!this._lightbox || this.getLightboxType() != this._get_safe_type(type)){
		this._lightbox_type = this._get_safe_type(type);
        var d=document.createElement("DIV");
        d.className="gantt_cal_light";

        var full_width = this._is_lightbox_timepicker();
        if (gantt.config.wide_form || full_width)
            d.className+=" gantt_cal_light_wide";

        if (full_width) {
            gantt.config.wide_form = true;
            d.className+=" gantt_cal_light_full";
        }


        d.style.visibility="hidden";
        var html = this._lightbox_template;

        var buttons = this.config.buttons_left;
        for (var i = 0; i < buttons.length; i++){
			// needed to migrate from 'dhx_something' to 'gantt_something' naming in a lightbox
			var button = this.config._migrate_buttons[buttons[i]] ? this.config._migrate_buttons[buttons[i]] : buttons[i];

            html+="<div class='gantt_btn_set gantt_left_btn_set "+button+"_set'><div dhx_button='1' class='"+button+"'></div><div>"+this.locale.labels[button]+"</div></div>";

		}
        buttons = this.config.buttons_right;
        for (var i = 0; i < buttons.length; i++){
			var button = this.config._migrate_buttons[buttons[i]] ? this.config._migrate_buttons[buttons[i]] : buttons[i];
            html+="<div class='gantt_btn_set gantt_right_btn_set "+button+"_set' style='float:right;'><div dhx_button='1' class='"+button+"'></div><div>"+this.locale.labels[button]+"</div></div>";

		}
        html+="</div>";
        d.innerHTML=html;

        if (gantt.config.drag_lightbox){
            d.firstChild.onmousedown = gantt._ready_to_dnd;
            d.firstChild.onselectstart = function(){ return false; };
            d.firstChild.style.cursor = "pointer";
            gantt._init_dnd_events();

        }

        document.body.insertBefore(d,document.body.firstChild);
        this._lightbox=d;

        var sns = this._get_typed_lightbox_config(type);
        html = this._render_sections(sns);

        var ds=d.getElementsByTagName("div");
        for (var i=0; i<ds.length; i++) {
            var t_ds = ds[i];
            if (t_ds.className == "gantt_cal_larea") {
                t_ds.innerHTML = html;
                break;
            }
        }

        //sizes
        this.resizeLightbox();

        this._init_lightbox_events(this);
        d.style.display="none";
        d.style.visibility="visible";
    }
    return this._lightbox;
};

gantt._render_sections = function(sns) {
    var html="";
    for (var i=0; i < sns.length; i++) {
        var block=this.form_blocks[sns[i].type];
        if (!block) continue; //ignore incorrect blocks
        sns[i].id="area_"+this.uid();

		var display = sns[i].hidden ? " style='display:none'" : "";
        var button = "";
        if (sns[i].button){
            button = "<div class='gantt_custom_button' index='"+i+"'><div class='gantt_custom_button_"+sns[i].button+"'></div><div>"+this.locale.labels["button_"+sns[i].button]+"</div></div>";
        }
        if (this.config.wide_form){
            html+="<div class='gantt_wrap_section' " + display+">";
        }
        html+="<div id='"+sns[i].id+"' class='gantt_cal_lsection'>"+button+this.locale.labels["section_"+sns[i].name]+"</div>"+block.render.call(this,sns[i]);
        html+="</div>";
    }
    return html;
};


gantt.resizeLightbox=function(){
    var d = this._lightbox;
    if (!d) return;

    var con = d.childNodes[1];
    con.style.height="0px";
    con.style.height=con.scrollHeight+"px";
    d.style.height=con.scrollHeight+this.config.lightbox_additional_height+"px";
    con.style.height=con.scrollHeight+"px"; //it is incredible , how ugly IE can be


};

gantt._center_lightbox = function(box) {
    if (box){
        box.style.display="block";

        var scroll_top = window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop;
        var scroll_left = window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft;

        var view_height = window.innerHeight||document.documentElement.clientHeight;

        if(scroll_top) // if vertical scroll on window
            box.style.top=Math.round(scroll_top+Math.max((view_height-box.offsetHeight)/2, 0))+"px";
        else // vertical scroll on body
            box.style.top=Math.round(Math.max(((view_height-box.offsetHeight)/2), 0) + 9)+"px"; // +9 for compatibility with auto tests

        // not quite accurate but used for compatibility reasons
        if(document.documentElement.scrollWidth > document.body.offsetWidth) // if horizontal scroll on the window
            box.style.left=Math.round(scroll_left+(document.body.offsetWidth-box.offsetWidth)/2)+"px";
        else // horizontal scroll on the body
            box.style.left=Math.round((document.body.offsetWidth-box.offsetWidth)/2)+"px";
    }
};
gantt.showCover = function(){
	if(this._cover) return;

    this._cover=document.createElement("DIV");
    this._cover.className="gantt_cal_cover";
    var _document_height = ((document.height !== undefined) ? document.height : document.body.offsetHeight);
    var _scroll_height = ((document.documentElement) ? document.documentElement.scrollHeight : 0);
    this._cover.style.height = Math.max(_document_height, _scroll_height) + 'px';
    document.body.appendChild(this._cover);
};


gantt._init_lightbox_events = function(){
    gantt.lightbox_events = {};


    gantt.lightbox_events["gantt_save_btn"] = function(e) {
        gantt._save_lightbox();
    };


    gantt.lightbox_events["gantt_delete_btn"] = function(e) {
		if(!gantt.callEvent("onLightboxDelete", [gantt._lightbox_id]))
			return;

		if(gantt.isTaskExists(gantt._lightbox_id)){
			gantt.$click.buttons["delete"](gantt._lightbox_id);
		}else{
			gantt.hideLightbox();
		}

    };


    gantt.lightbox_events["gantt_cancel_btn"] = function(e) {
        gantt._cancel_lightbox();
    };


    gantt.lightbox_events["default"] = function(e, src) {
        if (src.getAttribute("dhx_button")) {
            gantt.callEvent("onLightboxButton", [src.className, src, e]);
        } else {
            var index, block, sec;

			var className = gantt._getClassName(src);
            if (className.indexOf("gantt_custom_button") != -1) {
                if (className.indexOf("gantt_custom_button_") != -1) {
                    index = src.parentNode.getAttribute("index");
                    sec = src.parentNode.parentNode;
                } else {
                    index = src.getAttribute("index");
                    sec = src.parentNode;
                    src = src.firstChild;
                }
            }

			var sections = gantt._get_typed_lightbox_config();

            if (index) {
                block = gantt.form_blocks[sections[index].type];
                block.button_click(index, src, sec, sec.nextSibling);
            }
        }
    };
    this.event(gantt.getLightbox(), "click", function(e) {
        e = e || window.event;
        var src = e.target ? e.target : e.srcElement;

		var className = gantt._getClassName(src);
        if (!className){
            src = src.previousSibling;
			className = gantt._getClassName(src);
		}
        if (src && className && className.indexOf("gantt_btn_set") === 0){
            src = src.firstChild;
			className = gantt._getClassName(src);
		}
        if (src && className) {
            var func = gantt.defined(gantt.lightbox_events[src.className]) ? gantt.lightbox_events[src.className] : gantt.lightbox_events["default"];
            return func(e, src);
        }
        return false;
    });

    gantt.getLightbox().onkeydown=function(e){
        switch((e||event).keyCode){
            case gantt.keys.edit_save:
                if ((e||event).shiftKey) return;
                gantt._save_lightbox();
                break;
            case gantt.keys.edit_cancel:
                gantt._cancel_lightbox();
                break;
            default:
                break;
        }
    };
};

gantt._cancel_lightbox=function(){
	var task = this.getLightboxValues();
    this.callEvent("onLightboxCancel",[this._lightbox_id, task.$new]);
	if(gantt.isTaskExists(task.id) && task.$new){
		this._deleteTask(task.id, true);
	}

	this.refreshData();
    this.hideLightbox();
};

gantt._save_lightbox=function(){
    var task = this.getLightboxValues();
	if(!this.callEvent("onLightboxSave", [this._lightbox_id, task, !!task.$new]))
		return;

	if (task.$new){
		delete task.$new;
		this._replace_branch_child(this.getParent(task.id), task.id);

		this.addTask(task);
	}else if(this.isTaskExists(task.id)){
		this.mixin(this.getTask(task.id), task, true);
		this.updateTask(task.id);
	}
	this.refreshData();

    // TODO: do we need any blockable events here to prevent closing lightbox?
    this.hideLightbox();
};

gantt._resolve_default_mapping = function(section) {
	var mapping = section.map_to;
	var time_controls = {"time":true, "time_optional":true, "duration":true, "duration_optional":true};
	if(time_controls[section.type]){
		if(section.map_to == 'auto'){
			mapping = {start_date: "start_date", end_date: "end_date", duration: "duration"};
		}else if(typeof(section.map_to) === "string"){
			mapping = {start_date: section.map_to};
		}
	}

	return mapping;
};

gantt.getLightboxValues=function(){
    var task = {};

    if(gantt.isTaskExists(this._lightbox_id)) {
        task = this.mixin({}, this.getTask(this._lightbox_id));
    }

    var sns = this._get_typed_lightbox_config();
    for (var i=0; i < sns.length; i++) {
        var node = document.getElementById(sns[i].id);
        node=(node?node.nextSibling:node);
        var block=this.form_blocks[sns[i].type];
		if(!block) continue;
        var res=block.get_value.call(this,node,task, sns[i]);
        var map_to = gantt._resolve_default_mapping(sns[i]);
        if (typeof map_to == "string" && map_to != "auto") {
            task[map_to] = res;
		} else if(typeof map_to == "object") {
			for(var property in map_to) {
				if(map_to[property])
					task[map_to[property]] = res[property];
			}
		}
    }
    return task;
};


gantt.hideLightbox=function(){
    var box = this.getLightbox();
    if (box) box.style.display="none";
    this._lightbox_id=null;

    this.hideCover();
    this.callEvent("onAfterLightbox",[]);
};
gantt.hideCover=function(){
    if (this._cover)
        this._cover.parentNode.removeChild(this._cover);
    this._cover=null;
};

gantt.resetLightbox = function(){
    if (gantt._lightbox && !gantt._custom_lightbox)
        gantt._lightbox.parentNode.removeChild(gantt._lightbox);
    gantt._lightbox = null;
};
gantt._set_lightbox_values = function(data, box){
	var task = data;
	var s = box.getElementsByTagName("span");
	if (gantt.templates.lightbox_header) {
		s[1].innerHTML = "";
		s[2].innerHTML = gantt.templates.lightbox_header(task.start_date, task.end_date, task);
	} else {
		s[1].innerHTML = this.templates.task_time(task.start_date, task.end_date, task);
		s[2].innerHTML = (this.templates.task_text(task.start_date, task.end_date, task) || "").substr(0, 70); //IE6 fix
	}


	var sns = this._get_typed_lightbox_config(this.getLightboxType());
	for (var i = 0; i < sns.length; i++) {
		var section = sns[i];

		if(!this.form_blocks[section.type]){
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
	if(data.id)
		gantt._lightbox_id = data.id;
};
gantt._fill_lightbox = function(id, box) {
    var task = this.getTask(id);
    this._set_lightbox_values(task, box);
};


gantt.getLightboxSection = function(name){
    var config = this._get_typed_lightbox_config();
    var i =0;
    for (i; i < config.length; i++)
        if (config[i].name == name)
            break;
    var section = config[i];
    if(!section)
        return null;

    if (!this._lightbox)
        this.getLightbox();
    var header = document.getElementById(section.id);
    var node = header.nextSibling;

    var result = {
        section: section,
        header: header,
        node: node,
        getValue:function(ev){
            return gantt.form_blocks[section.type].get_value.call(gantt, node, (ev||{}), section);
        },
        setValue:function(value, ev){
            return gantt.form_blocks[section.type].set_value.call(gantt, node, value, (ev||{}), section);
        }
    };

    var handler = this._lightbox_methods["get_"+section.type+"_control"];
    return handler?handler(result):result;
};

gantt._lightbox_methods.get_template_control = function(result) {
    result.control = result.node;
    return result;
};
gantt._lightbox_methods.get_select_control = function(result) {
    result.control = result.node.getElementsByTagName('select')[0];
    return result;
};
gantt._lightbox_methods.get_textarea_control = function(result) {
    result.control = result.node.getElementsByTagName('textarea')[0];
    return result;
};
gantt._lightbox_methods.get_time_control = function(result) {
    result.control = result.node.getElementsByTagName('select'); // array
    return result;
};





gantt._init_dnd_events = function(){
    this.event(document.body, "mousemove", gantt._move_while_dnd);
    this.event(document.body, "mouseup", gantt._finish_dnd);
    gantt._init_dnd_events = function(){};
};
gantt._move_while_dnd = function(e){
    if (gantt._dnd_start_lb){
        if (!document.gantt_unselectable){
            document.body.className += " gantt_unselectable";
            document.gantt_unselectable = true;
        }
        var lb = gantt.getLightbox();
        var now = (e&&e.target)?[e.pageX, e.pageY]:[event.clientX, event.clientY];
        lb.style.top = gantt._lb_start[1]+now[1]-gantt._dnd_start_lb[1]+"px";
        lb.style.left = gantt._lb_start[0]+now[0]-gantt._dnd_start_lb[0]+"px";
    }
};
gantt._ready_to_dnd = function(e){
    var lb = gantt.getLightbox();
    gantt._lb_start = [parseInt(lb.style.left,10), parseInt(lb.style.top,10)];
    gantt._dnd_start_lb = (e&&e.target)?[e.pageX, e.pageY]:[event.clientX, event.clientY];
};
gantt._finish_dnd = function(){
    if (gantt._lb_start){
        gantt._lb_start = gantt._dnd_start_lb = false;
        document.body.className = document.body.className.replace(" gantt_unselectable","");
        document.gantt_unselectable = false;
    }
};




gantt._focus = function(node, select){
    if (node && node.focus){
        if (gantt.config.touch){
            //do not focus editor, to prevent auto-zoom
        } else {
            try {
                if (select && node.select) node.select();
                node.focus();
            }catch(e){ }
        }
    }
};


gantt.form_blocks={
    getTimePicker: function(sns, hidden) {
		var time_format = sns.time_format;
        if (!time_format) {
            // default order
            var time_format = ["%d", "%m", "%Y"];
			if(gantt._get_line(gantt._tasks.unit) < gantt._get_line("day")){
				time_format.push("%H:%i");
			}
        }
        // map: default order => real one
        sns._time_format_order = { size:0 };


        var cfg = this.config;
        var dt = this.date.date_part(new Date(gantt._min_date.valueOf()));
        var last = 24*60, first = 0;
        if(gantt.config.limit_time_select){
            last = 60*cfg.last_hour+1;
            first = 60*cfg.first_hour;
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

					if(sns.year_range){
						if(!isNaN(sns.year_range)){
							range = sns.year_range;
						}else if(sns.year_range.push){
							// if
							start_year = sns.year_range[0];
							end_year = sns.year_range[1];
						}
					}

					range = range || 10;
					offset = offset || Math.floor(range/2);
					start_year = start_year || dt.getFullYear() - offset;
					end_year = end_year || start_year + range;


                    for (var i=start_year; i < end_year; i++)
						options+="<option value='"+(i)+"'>"+(i)+"</option>";
                    break;
                case "%m":
                    sns._time_format_order[1] = p;
                    sns._time_format_order.size++;
                    //month
                    for (var i=0; i < 12; i++)
						options+="<option value='"+i+"'>"+this.locale.date.month_full[i]+"</option>";
                    break;
                case "%d":
                    sns._time_format_order[0] = p;
                    sns._time_format_order.size++;
                    //days
                    for (var i=1; i < 32; i++)
						options+="<option value='"+i+"'>"+i+"</option>";
                    break;
                case "%H:%i":
                  //  var last = 24*60, first = 0;
                    sns._time_format_order[3] = p;
                    sns._time_format_order.size++;
                    //hours
                    var i = first;
                    var tdate = dt.getDate();
                    sns._time_values = [];

                    while(i<last){
                        var time=this.templates.time_picker(dt);
						options+="<option value='"+i+"'>"+time+"</option>";
                        sns._time_values.push(i);
                        dt.setTime(dt.valueOf()+this._get_timepicker_step()*60*1000);
                        var diff = (dt.getDate()!=tdate)?1:0; // moved or not to the next day
                        i=diff*24*60+dt.getHours()*60+dt.getMinutes();
                    }
                    break;
                default:
                    break;
            }

			if(options){
				var readonly = sns.readonly ? "disabled='disabled'" : "";
				var display = hidden ? " style='display:none'" : "";
				html += "<select "+readonly+display +">"+options+"</select>";
			}
        }
        return html;
    },
    _fill_lightbox_select: function (s,i,d,map,cfg) {
        s[i+map[0]].value=d.getDate();
        s[i+map[1]].value=d.getMonth();
        s[i+map[2]].value=d.getFullYear();
        if (gantt.defined(map[3])) {
            var v = d.getHours()*60+ d.getMinutes();
            v = Math.round(v/gantt._get_timepicker_step())*gantt._get_timepicker_step();
			var input = s[i+map[3]];
			input.value= v;
			//in case option not shown
			input.setAttribute('data-value', v);
        }
    },
    template:{
        render: function(sns){
            var height=(sns.height||"30")+"px";
            return "<div class='gantt_cal_ltext gantt_cal_template' style='height:"+height+";'></div>";
        },
        set_value:function(node,value,ev,config){
            node.innerHTML = value||"";
        },
        get_value:function(node,ev,config){
            return node.innerHTML||"";
        },
        focus: function(node){
        }
    },
    textarea:{
        render:function(sns){
            var height=(sns.height||"130")+"px";
            return "<div class='gantt_cal_ltext' style='height:"+height+";'><textarea></textarea></div>";
        },
        set_value:function(node,value,ev){
            node.firstChild.value=value||"";
        },
        get_value:function(node,ev){
            return node.firstChild.value;
        },
        focus:function(node){
            var a=node.firstChild; gantt._focus(a, true);
        }
    },
    select:{
        render:function(sns){
            var height=(sns.height||"23")+"px";
            var html="<div class='gantt_cal_ltext' style='height:"+height+";'><select style='width:100%;'>";
            for (var i=0; i < sns.options.length; i++)
                html+="<option value='"+sns.options[i].key+"'>"+sns.options[i].label+"</option>";
            html+="</select></div>";
            return html;
        },
        set_value:function(node,value,ev,sns){
            var select = node.firstChild;
            if (!select._dhx_onchange && sns.onchange) {
                select.onchange = sns.onchange;
                select._dhx_onchange = true;
            }
            if (typeof value == "undefined")
                value = (select.options[0]||{}).value;
            select.value=value||"";
        },
        get_value:function(node,ev){
            return node.firstChild.value;
        },
        focus:function(node){
            var a=node.firstChild; gantt._focus(a, true);
        }
    },
    time:{
        render:function(sns) {
            var time = this.form_blocks.getTimePicker.call(this, sns);
			var parts = ["<div style='height:"+(sns.height || 30)+"px;padding-top:0px;font-size:inherit;text-align:center;' class='gantt_section_time'>"];
			parts.push(time);

			if(sns.single_date){
				time = this.form_blocks.getTimePicker.call(this, sns, true);
				parts.push("<span></span>");
			}else{
				parts.push("<span style='font-weight:normal; font-size:10pt;'> &nbsp;&ndash;&nbsp; </span>");
			}

			parts.push(time);
			parts.push("</div>");
            return parts.join('');
        },
        set_value:function(node,value,ev,config){
            var cfg = config;
            var s=node.getElementsByTagName("select");

            var map = config._time_format_order;
            var map_size = config._time_format_size;

            if(cfg.auto_end_date) {
                var _update_lightbox_select = function() {
                    start_date = new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,0,0);
                    end_date =  gantt.calculateEndDate(start_date, 1);
                    this.form_blocks._fill_lightbox_select(s,map.size, end_date,map,cfg);
                };
                for(var i=0; i<4; i++) {
                    s[i].onchange = _update_lightbox_select;
                }
            }

			var mapping = gantt._resolve_default_mapping(config);

            if(typeof(mapping) === "string") mapping = {start_date: mapping};

			var start_date = ev[mapping.start_date] || new Date();
			var end_date = ev[mapping.end_date] || gantt.calculateEndDate(start_date, 1);

            this.form_blocks._fill_lightbox_select(s,0,start_date,map,cfg);
            this.form_blocks._fill_lightbox_select(s,map.size,end_date,map,cfg);
        },

        get_value:function(node, ev, config) {
            var s=node.getElementsByTagName("select");
            var map = config._time_format_order;

            var hours = 0, minutes = 0;
            if (gantt.defined(map[3])) {
                var time = parseInt(s[map[3]].value, 10);
                hours = Math.floor(time/60);
                minutes = time%60;
            }
            var start_date=new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,hours,minutes);

            hours = minutes = 0;
            if (gantt.defined(map[3])) {
                var time = parseInt(s[map.size+map[3]].value, 10);
                hours = Math.floor(time/60);
                minutes = time%60;
            }
            var end_date=new Date(s[map[2]+map.size].value,s[map[1]+map.size].value,s[map[0]+map.size].value,hours,minutes);

            if (end_date <= start_date)
                end_date = gantt.date.add(start_date, gantt._get_timepicker_step(),"minute");

			var mapped_fields = gantt._resolve_default_mapping(config);

			var res = {
				start_date: new Date(start_date),
				end_date: new Date(end_date)
			};
			if(typeof mapped_fields == "string"){
				return res.start_date;
			}else{
				return res;
			}
        },
        focus:function(node){
            gantt._focus(node.getElementsByTagName("select")[0]);
        }
    },
    duration:{
        render:function(sns) {
            var time = this.form_blocks.getTimePicker.call(this, sns);
            time = "<div class='gantt_time_selects'>"+time+"</div>";
            var label = this.locale.labels[this.config.duration_unit + "s"];

			var singleDate = sns.single_date ? ' style="display:none"' : "";
			var readonly = sns.readonly ? " disabled='disabled'" : "";

            var duration = "<div class='gantt_duration' "+singleDate+">" +
				"<input type='button' class='gantt_duration_dec' value='-'"+readonly+">" +
				"<input type='text' value='5' class='gantt_duration_value'"+readonly+">" +
				"<input type='button' class='gantt_duration_inc' value='+'"+readonly+"> " + label + " <span></span>" +
				"</div>";
            var html = "<div style='height:"+(sns.height || 30)+"px;padding-top:0px;font-size:inherit;' class='gantt_section_time'>"+time+" "+duration+"</div>";
            return html;
        },
        set_value:function(node,value,ev,config){
            var cfg = config;
            var s=node.getElementsByTagName("select");
	        var inps = node.getElementsByTagName("input");

            var duration = inps[1];
            var btns=[inps[0],inps[2]];
            var endspan = node.getElementsByTagName("span")[0];

            var map = config._time_format_order;

            function _calc_date() {
                var start_date = gantt.form_blocks.duration._get_start_date.call(gantt, node ,config);
                var duration = gantt.form_blocks.duration._get_duration.call(gantt, node ,config);
                var end_date = gantt.calculateEndDate(start_date, duration);

                endspan.innerHTML = gantt.templates.task_date(end_date);
            }

            function _change_duration(step) {
                var value = duration.value;
                value = parseInt(value, 10);
                if (window.isNaN(value))
                    value = 0;
                value+=step;
                if (value < 1) value = 1;
                duration.value = value;
                _calc_date();
            }

            btns[0].onclick = gantt.bind(function() { _change_duration(-1*this.config.duration_step); }, this);
            btns[1].onclick = gantt.bind(function() { _change_duration(1*this.config.duration_step); }, this);
            s[0].onchange = _calc_date;
            s[1].onchange = _calc_date;
            s[2].onchange = _calc_date;
            if (s[3]) s[3].onchange = _calc_date;
            duration.onkeydown = gantt.bind(function(e) {
                e = e || window.event;
                // up
                var code = (e.charCode || e.keyCode || e.which);

                if (code == 40) {
                    _change_duration(-1*this.config.duration_step);
                    return false;
                }
                // down
                if (code == 38) {
                    _change_duration(1*this.config.duration_step);
                    return false;
                }
                window.setTimeout(function(e) {
                    _calc_date();
                }, 1);
            }, this);

            duration.onchange = gantt.bind(function(e) { _calc_date(); }, this);

			var mapping = gantt._resolve_default_mapping(config);
			if(typeof(mapping) === "string") mapping = {start_date: mapping};

			var start_date = ev[mapping.start_date] || new Date();
			var end_date = ev[mapping.end_date] || gantt.calculateEndDate(start_date, 1);
			var duration_val = Math.round(ev[mapping.duration]) || gantt.calculateDuration(start_date, end_date);

			gantt.form_blocks._fill_lightbox_select(s, 0, start_date, map, cfg);
            duration.value = duration_val;
            _calc_date();
        },

        _get_start_date: function(node, config) {
            var s=node.getElementsByTagName("select");
            var map = config._time_format_order;
            var hours = 0;
            var minutes = 0;
            if (gantt.defined(map[3])) {
				var input = s[map[3]];
                var time = parseInt(input.value, 10);
				if(isNaN(time) && input.hasAttribute("data-value")){
					time = parseInt(input.getAttribute("data-value"), 10);
				}

                hours = Math.floor(time/60);
                minutes = time%60;
            }
            return new Date(s[map[2]].value,s[map[1]].value,s[map[0]].value,hours,minutes);
        },
        _get_duration: function(node, config) {
            var duration = node.getElementsByTagName("input")[1];
            duration = parseInt(duration.value, 10);
            if (!duration || window.isNaN(duration)) duration = 1;
            if (duration < 0) duration *= -1;
            return duration;
        },

        get_value:function(node, ev, config) {
            var start_date = gantt.form_blocks.duration._get_start_date(node, config);
            var duration = gantt.form_blocks.duration._get_duration(node, config);

            var end_date = gantt.calculateEndDate(start_date, duration);
			var mapped_fields = gantt._resolve_default_mapping(config);
			var res = {
				start_date: new Date(start_date),
				end_date: new Date(end_date),
				duration: duration
			};
			if(typeof mapped_fields == "string"){
				return res.start_date;
			}else{
				return res;
			}
        },
        focus:function(node){
            gantt._focus(node.getElementsByTagName("select")[0]);
        }
    },
	parent: {
		_filter : function(options, config, item_id){
			var filter = config.filter || function(){ return true;};

			options = options.slice(0);

			for(var i=0; i < options.length; i++){
				var task = options[i];
				if(task.id == item_id || gantt.isChildOf(task.id, item_id) || filter(task.id, task) === false){
					options.splice(i, 1);
					i--;
				}
			}
			return options;
		},

		_display : function(config, item_id){
			var tasks = [],
				options = [];
			if(item_id){
				tasks = gantt.getTaskByTime();
				if(config.allow_root){
					tasks.unshift({id:gantt.config.root_id, text:config.root_label || ""});
				}
				tasks = this._filter(tasks, config, item_id);
				if(config.sort){
					tasks.sort(config.sort);
				}
			}
			var text = config.template || gantt.templates.task_text;
			for(var i = 0; i < tasks.length; i++){
				var label = text.apply(gantt, [tasks[i].start_date, tasks[i].end_date, tasks[i]]);
				if(label === undefined){
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
		render : function(sns){
			return gantt.form_blocks.parent._display(sns, false);
		},
		set_value:function(node,value,ev,config){
			var tmpDom = document.createElement("div");
			tmpDom.innerHTML = gantt.form_blocks.parent._display(config, ev.id);
			var newOptions = tmpDom.removeChild(tmpDom.firstChild);
			node.onselect = null;
			node.parentNode.replaceChild(newOptions, node);

			return gantt.form_blocks.select.set_value.apply(gantt, [newOptions,value,ev,config]);
		},
		get_value:function(){
			return gantt.form_blocks.select.get_value.apply(gantt, arguments);
		},
		focus:function(){
			return gantt.form_blocks.select.focus.apply(gantt, arguments);
		}
	}
};

gantt._is_lightbox_timepicker = function() {
    var s = this._get_typed_lightbox_config();
    for (var i = 0; i < s.length; i++)
        if (s[i].name == "time" && s[i].type == "time")
            return true;
    return false;
};

gantt._dhtmlx_confirm = function(message, title, callback, ok) {
    if (!message)
        return callback();
    var opts = { text: message };
    if (title)
        opts.title = title;
	if(ok){
		opts.ok = ok;
	}
    if (callback) {
        opts.callback = function(result) {
            if (result)
                callback();
        };
    }
    gantt.confirm(opts);
};

gantt._get_typed_lightbox_config = function(type){
	if(type === undefined){
		type = this.getLightboxType();
	}

	var field = this._get_type_name(type);

	if(gantt.config.lightbox[field+"_sections"]){
		return gantt.config.lightbox[field+"_sections"];
	}else{
		return gantt.config.lightbox.sections;
	}
};

gantt._silent_redraw_lightbox = function(type){
	var oldType = this.getLightboxType();

	if(this.getState().lightbox){
		var taskId = this.getState().lightbox;
		var formData = this.getLightboxValues(),
			task = this.copy(this.getTask(taskId));

		this.resetLightbox();

		var updTask = this.mixin(task, formData, true);
		var box = this.getLightbox(type ? type : undefined);
		this._center_lightbox(this.getLightbox());
		this._set_lightbox_values(updTask, box);
	}else{
		this.resetLightbox();
		this.getLightbox(type ? type : undefined);
	}
	this.callEvent("onLightboxChange", [oldType, this.getLightboxType()]);
};
gantt._extend_to_optional = function(lightbox_block){

	var duration = lightbox_block;
	var optional_time = {
		render : duration.render,
		focus : duration.focus,
		set_value: function (node, value, task, section){
			var mapping = gantt._resolve_default_mapping(section);
			if(!task[mapping.start_date] || (mapping.start_date == "start_date" && this._isAllowedUnscheduledTask(task))){
				optional_time.disable(node, section);
				var val = {};

				for(var i in mapping){
					//take default values from the time control from task start/end dates
					val[mapping[i]] = task[i];
				}

				return duration.set_value.call(gantt, node, value, val, section);//set default value
			}else{
				optional_time.enable(node, section);
				return duration.set_value.call(gantt, node, value, task, section);
			}
		},
		get_value: function (node, task, section){
			if(section.disabled){
				return {start_date: null};
			}else{
				return duration.get_value.call(gantt, node, task, section);
			}
		},
		update_block : function(node, section){
			gantt.callEvent("onSectionToggle", [gantt._lightbox_id, section]);
			node.style.display = section.disabled ? "none" : "block";

			if(section.button){
				var button = node.previousSibling.firstChild.firstChild,
					labels = gantt.locale.labels;

				var button_text = section.disabled ? labels[section.name + "_enable_button"] : labels[section.name + "_disable_button"];

				button.nextSibling.innerHTML = button_text;
			}
			gantt.resizeLightbox();
		},
		disable: function(node, section){
			section.disabled = true;
			optional_time.update_block(node, section);

		},
		enable:function(node, section){
			section.disabled = false;
			optional_time.update_block(node, section);
		},
		button_click: function(index, el, section, container){
			if(gantt.callEvent("onSectionButton", [gantt._lightbox_id, section]) === false){
				return;
			}
			var config = gantt._get_typed_lightbox_config()[index];
			if(config.disabled){
				optional_time.enable(container, config);
			}else{
				optional_time.disable(container, config);
			}
		}
	};
	return optional_time;
};

gantt.form_blocks.duration_optional = gantt._extend_to_optional(gantt.form_blocks.duration);
gantt.form_blocks.time_optional = gantt._extend_to_optional(gantt.form_blocks.time);
/**
	* 	@desc: constructor, data processor object 
	*	@param: serverProcessorURL - url used for update
	*	@type: public
	*/
gantt.dataProcessor = function(serverProcessorURL){
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
    gantt._eventable(this);

    return this;
};

gantt.dataProcessor.prototype={
	setTransactionMode:function(mode,total){
		if (typeof mode == "object"){
			this._tMode = mode.mode || this._tMode;
			this._headers = this._headers || mode.headers;
			this._payload = this._payload || mode.payload;
		} else {
     	    this._tMode=mode;
			this._tSend=total;
		}

		if (this._tMode == "REST"){
			this._tSend = false;
			this._endnm = true;
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
    		if (gantt.security_key)
				stack.push("dhx_security="+gantt.security_key);
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
		
		var a3 = this.serverProcessor+(this._user?(gantt._urlSeparator(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+this.obj.getUserData(0,"version")].join("&")):"");

		if (this._tMode=="GET")
        	gantt.ajax.get(a3+((a3.indexOf("?")!=-1)?"&":"?")+this.serialize(a1,rowId), back);
		else if (this._tMode == "POST")
        	gantt.ajax.post(a3,this.serialize(a1,rowId), back);
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


        	if (this._payload)
        		for (var key in this._payload)
        			url = url + this._urlSeparator(url) + this.escape(key) + "=" + this.escape(this._payload[key]);

        	gantt.ajax.query({
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
			if (!this.callEvent("onBeforeUpdate",[id,this.getState(id), this._getRowData(id)])) continue;
			out[id]=this._getRowData(id,id+this.post_delim);
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
		//try to use json first
		if (window.JSON){
			try{
				var tag = JSON.parse(xml.xmlDoc.responseText);
				var action = tag.action || this.getState(id) || "updated";
				var sid = tag.sid || id[0];
				var tid = tag.tid || id[0];
				that.afterUpdateCallback(sid, tid, action, tag);
				that.finalizeUpdate();
				return;
			} catch(e){
			}
		}
		//xml response
		var top = gantt.ajax.xmltop("data", xml.xmlDoc); //fix incorrect content type in IE
		if (!top) return this.cleanUpdate(id);
		var atag=gantt.ajax.xpath("//data/action", top);
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
		if (this._update_busy) 
			return false;
		else
			this._update_busy = true;
		
		//this._loader = this._loader || new dtmlXMLLoaderObject(true);
		
		//this._loader.async=true;
		//this._loader.waitCall=callback;
		//this._loader.loadXML(url);
		gantt.ajax.get(url, callback);

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
		var self = this;
		var version = this.obj.getUserData(0,"version");
		var url = this.serverProcessor+gantt._urlSeparator(this.serverProcessor)+["dhx_user="+this._user,"dhx_version="+version].join("&");
		url = url.replace("editing=true&","");
		this.getUpdates(url, function(xml){
			var vers = gantt.ajax.xpath("//userdata", xml);
			self.obj.setUserData(0,"version",self._v(vers[0]));
			
			var upds = gantt.ajax.xpath("//update", xml);
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
gantt._init_dp_live_update_hooks = function(dp){
	dp.attachEvent("insertCallback", gantt._insert_callback);
	dp.attachEvent("updateCallback", gantt._update_callback);
	dp.attachEvent("deleteCallback", gantt._delete_callback);
};

gantt._update_callback = function(upd, id) {
	var data = upd.data || gantt.xml._xmlNodeToJSON(upd.firstChild);
	if(!gantt.isTaskExists(id))
		return;
	var objData = gantt.getTask(id);
	for(var key in data) {
		var property = data[key];
		switch(key) {
			case "id":
				continue;
			case "start_date":
			case "end_date":
				property = gantt.templates.xml_date(property);
				break;
			case "duration":
				objData.end_date = gantt.calculateEndDate(objData.start_date, property);
				break;
		}
		objData[key] = property;
	}
	gantt.updateTask(id);
	gantt.refreshData();
};
gantt._insert_callback = function(upd, id, parent, mode) {
	var data = upd.data || gantt.xml._xmlNodeToJSON(upd.firstChild),
		methods = {
			add: gantt.addTask,
			isExist: gantt.isTaskExists
		};
	if(mode == "links") {
		methods.add = gantt.addLink;
		methods.isExist = gantt.isLinkExists;
	}
	if(methods.isExist.call(gantt, id))
		return;
	data.id = id;
	methods.add.call(gantt, data);
};
gantt._delete_callback = function(upd, id, parent, mode) {
	var methods = {
		"delete": gantt.deleteTask,
		"isExist": gantt.isTaskExists
	};
	if(mode == "links") {
		methods["delete"] = gantt.deleteLink;
		methods.isExist = gantt.isLinkExists;
	}
	if(methods.isExist.call(gantt, id))
		methods["delete"].call(gantt, id);
};


// --#include core/data_task_types.js

/*
 	asserts will be removed in final code, so you can place them anythere
	without caring about performance impacts
*/
gantt.assert = function(check, message){
	//jshint -W087
	if (!check){
		if(gantt.config.show_errors && gantt.callEvent("onError",[message]) !== false) {
			gantt.message({type: "error", text: message, expire: -1});
			//debugger;
		}
	}
};

//initial initialization
gantt.init = function(node, from, to){
	this.callEvent("onBeforeGanttReady", []);
	if(from && to){
		this.config.start_date = this._min_date = new Date(from);
		this.config.end_date = this._max_date = new Date(to);
	}
	this._init_skin();
    this.date.init();

    if (!this.config.scroll_size)
        this.config.scroll_size = this._detectScrollSize();

	gantt.event(window, "resize", this._on_resize);

	//can be called only once
	this.init = function(node){
		if (this.$container && this.$container.parentNode){
			this.$container.parentNode.removeChild(this.$container);
			this.$container = null;

		}
		this._reinit(node);
	};

	this._reinit(node);
};

gantt._reinit = function(node){
    this._init_html_area(node);
    this._set_sizes();

	this._clear_renderers();
	this.resetLightbox();
	this._update_flags();
    this._init_touch_events();
    this._init_templates();
    this._init_grid();
    this._init_tasks();


    this._set_scroll_events();

    gantt.event(this.$container, "click", this._on_click);
	gantt.event(this.$container, "dblclick", this._on_dblclick);
	gantt.event(this.$container, "mousemove", this._on_mousemove);
	gantt.event(this.$container, "contextmenu", this._on_contextmenu);

	this.callEvent("onGanttReady", []);

	this.render();
};

//renders initial html markup
gantt._init_html_area = function(node){
	if (typeof node == "string")
		this._obj = document.getElementById(node);
	else 
		this._obj = node;
	this.assert(this._obj, "Invalid html container: "+node);
    var html = "<div class='gantt_container'><div class='gantt_grid'></div><div class='gantt_task'></div>";
    html += "<div class='gantt_ver_scroll'><div></div></div><div class='gantt_hor_scroll'><div></div></div></div>";
	this._obj.innerHTML = html;
	//store links for further reference
    this.$container = this._obj.firstChild;
    var childs = this.$container.childNodes;
	this.$grid = childs[0];
	this.$task = childs[1];
    this.$scroll_ver = childs[2];
    this.$scroll_hor = childs[3];

    this.$grid.innerHTML = "<div class='gantt_grid_scale'></div><div class='gantt_grid_data'></div>";
    this.$grid_scale = this.$grid.childNodes[0];
    this.$grid_data = this.$grid.childNodes[1];

	this.$task.innerHTML = "<div class='gantt_task_scale'></div><div class='gantt_data_area'><div class='gantt_task_bg'></div><div class='gantt_links_area'></div><div class='gantt_bars_area'></div></div>";
	this.$task_scale = this.$task.childNodes[0];

	this.$task_data = this.$task.childNodes[1];

	this.$task_bg = this.$task_data.childNodes[0];
	this.$task_links = this.$task_data.childNodes[1];
	this.$task_bars = this.$task_data.childNodes[2];
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
					gantt._deleteTask(id, true);
					gantt.refreshData();
				}else{
					gantt.deleteTask(id);
				}

                gantt.hideLightbox();
            });
        }
    }
};

gantt._calculate_content_height = function(){
	var scale_height = this.config.scale_height,
		rows_height = this._order.length*this.config.row_height,
		hor_scroll_height = this._scroll_hor ? this.config.scroll_size + 1 : 0;

	if(!(this._is_grid_visible() || this._is_chart_visible())){
		return 0;
	}else{
		return scale_height + rows_height + 2 + hor_scroll_height;
	}
};
gantt._calculate_content_width = function(){
	var grid_width = this._get_grid_width(),
		chart_width = this._tasks ? this._tasks.full_width : 0,
		ver_scroll_width = this._scroll_ver ? this.config.scroll_size + 1 : 0;

	if(!this._is_chart_visible()){
		chart_width = 0;
	}
	if(!this._is_grid_visible()){
		grid_width = 0;
	}
	return grid_width + chart_width + 1;
};

gantt._get_resize_options = function(){
	var res = {x:false, y:false};
	if(this.config.autosize == "xy"){
		res.x = res.y = true;
	}else if(this.config.autosize == "y" || this.config.autosize === true){
		res.y = true;
	}else if(this.config.autosize == "x"){
		res.x = true;
	}
	return res;
};

gantt._clean_el_size = function(value){
	return ((value || "").toString().replace("px", "") * 1 || 0);
};
gantt._get_box_styles = function(){
	var computed = null;
	if(window.getComputedStyle){
		computed = window.getComputedStyle(this._obj, null);
	}else{
		//IE with elem.currentStyle does not calculate sizes from %, so will use the default approach
		computed = {
			"width":this._obj.clientWidth,
			"height":this._obj.clientHeight
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
		styles[properties[i]] = computed[properties[i]] ? this._clean_el_size(computed[properties[i]]) : 0;
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
gantt._do_autosize = function(){
	var resize = this._get_resize_options();
	var boxSizes = this._get_box_styles();
	if(resize.y){
		var reqHeight = this._calculate_content_height();
		if(boxSizes.borderBox){
			reqHeight += boxSizes.vertPaddings;
		}

		this._obj.style.height = reqHeight + 'px';
	}
	if(resize.x){
		var reqWidth = this._calculate_content_width();
		if(boxSizes.borderBox){
			reqWidth += boxSizes.horPaddings;
		}
		this._obj.style.width = reqWidth + 'px';
	}
};
//set sizes to top level html element
gantt._set_sizes = function(){
	this._do_autosize();

	var boxSizes = this._get_box_styles();
	this._y = boxSizes.innerHeight;

    if (this._y < 20) return;

	//same height
	this.$grid.style.height = this.$task.style.height = Math.max(this._y - this.$scroll_hor.offsetHeight - 2, 0) +"px";

	var dataHeight = Math.max((this._y - (this.config.scale_height||0) - this.$scroll_hor.offsetHeight - 2), 0);
    this.$grid_data.style.height = this.$task_data.style.height =  dataHeight + "px";

	//share width
	var gridWidth = Math.max(this._get_grid_width()-1, 0);
	this.$grid.style.width =  gridWidth +"px";
	this.$grid.style.display = gridWidth === 0 ? 'none' : '';

	boxSizes = this._get_box_styles();
	this._x = boxSizes.innerWidth;

	if (this._x < 20) return;

    this.$grid_data.style.width = Math.max(this._get_grid_width()-1, 0) +"px";
	this.$task.style.width = Math.max(this._x - this._get_grid_width() - 2, 0) +"px";
};

gantt.getScrollState = function(){
	if(this.$task && this.$task_data)
		return { x:this.$task.scrollLeft, y:this.$task_data.scrollTop };
	else
		return null;
};

gantt._save_scroll_state = function(x, y){
	// according to Chrome profiler
	// getting-setting scrollLeft for restoring scroll position after render takes surprisingly big amount of time
	// 2x-3x times more than setting innerHTML (if using gantt.config.static_background)
	// Will store scroll position in memory instead of getting actual values from DOM
	var pos = {};
	this._cached_scroll_pos = this._cached_scroll_pos || {};
	if(x !== undefined){pos.x = Math.max(x, 0);}
	if(y !== undefined){pos.y = Math.max(y, 0);}
	this.mixin(this._cached_scroll_pos, pos, true);

};
gantt._restore_scroll_state = function(){
	var res = {x:0, y:0};
	if(this._cached_scroll_pos){
		res.x = this._cached_scroll_pos.x || res.x;
		res.y = this._cached_scroll_pos.y || res.y;
	}
	return res;
};
gantt.scrollTo = function(left, top){
	var oldScrollState = this._restore_scroll_state();

    if (left*1 == left){
        this.$task.scrollLeft = left;
		this._save_scroll_state(left, undefined);
	}
    if(top*1 == top){
        this.$task_data.scrollTop = top;
		this.$grid_data.scrollTop = top;

		if(gantt.config.smart_rendering){
			if(this.$grid_data.scrollTop != top){
				this.$grid_data.scrollTop = top % gantt.config.row_height;
			}
		}

		this._save_scroll_state(undefined, this.$task_data.scrollTop);
	}

	var scroll = gantt._restore_scroll_state();
	this.callEvent("onGanttScroll", [oldScrollState.x, oldScrollState.y, scroll.x, scroll.y]);
};

gantt.showDate = function(date){
	var date_x = this.posFromDate(date);
	var scroll_to = Math.max(date_x - this.config.task_scroll_offset, 0);
	this.scrollTo(scroll_to);
};
gantt.showTask = function(id) {
	var el = this.getTaskNode(id);
	if(!el)
		return;

	var left = Math.max(el.offsetLeft - this.config.task_scroll_offset, 0);
	var top = el.offsetTop - (this.$task_data.offsetHeight - this.config.row_height)/2;
	this.scrollTo(left, top);
};


//called after window resize
gantt._on_resize = gantt.setSizes = function(){
    gantt._set_sizes();
    gantt._scroll_resize();
};

//renders self
gantt.render = function(){
	if(!this._is_render_active())
		return;
	this.callEvent("onBeforeGanttRender", []);

	var pos = this.copy(this._restore_scroll_state());
	var visible_date = null;
	if(pos){
		visible_date = gantt.dateFromPos(pos.x + this.config.task_scroll_offset);
	}

	this._render_grid();	//grid.js
	this._render_tasks_scales();	//tasks.js
    this._scroll_resize();
    this._on_resize();
	this._render_data();

	if(this.config.preserve_scroll && pos){

		var new_pos =gantt._restore_scroll_state();
		var new_date = gantt.dateFromPos(new_pos.x);
		if(!(+visible_date == +new_date && new_pos.y == pos.y)){
			if(visible_date){
				this.showDate(visible_date);
			}
			gantt.scrollTo(undefined, pos.y);
		}
	}

	this.callEvent("onGanttRender", []);
};


gantt._set_scroll_events = function(){
	this.event(this.$scroll_hor, "scroll", function() {
    	//in safari we can catch previous onscroll after setting new value from mouse-wheel event
    	//set delay to prevent value drifiting
    	if ((new Date()) - ( gantt._wheel_time || 0 ) < 100) return true; 
        if (gantt._touch_scroll_active) return;
        var left = gantt.$scroll_hor.scrollLeft;
        gantt.scrollTo(left);
    });
	this.event(this.$scroll_ver, "scroll", function() {
        if (gantt._touch_scroll_active) return;
        var top = gantt.$scroll_ver.scrollTop;
        gantt.$grid_data.scrollTop = top;
        gantt.scrollTo(null, top);
    });
	this.event(this.$task, "scroll", function() {
        var left = gantt.$task.scrollLeft,
			barLeft = gantt.$scroll_hor.scrollLeft;
		if(barLeft != left)
        	gantt.$scroll_hor.scrollLeft = left;
    });
	this.event(this.$task_data, "scroll", function() {
        var top = gantt.$task_data.scrollTop,
			barTop = gantt.$scroll_ver.scrollTop;
		if(barTop != top)
        	gantt.$scroll_ver.scrollTop = top;
    });

    var ff = gantt.env.isFF;// && !window._KHTMLrv;
	function onMouseWheel(e){
		var res = gantt._get_resize_options();
		gantt._wheel_time = new Date();

		var wx = ff ? (e.deltaX*-20) : e.wheelDeltaX*2;
		var wy = ff ? (e.deltaY*-40) : e.wheelDelta;

		if (wx && Math.abs(wx) > Math.abs(wy)){
			if(res.x) return true;//no horisontal scroll, must not block scrolling
			if(!gantt.$scroll_hor || !gantt.$scroll_hor.offsetWidth) return true;

			var dir  = wx/-40;
			var oldLeft = gantt.$task.scrollLeft;
			var left = oldLeft+dir*30;
			gantt.scrollTo(left, null);
			gantt.$scroll_hor.scrollLeft = left;
			// not block scroll if position hasn't changed
			if(oldLeft == gantt.$task.scrollLeft){
				return true;
			}
		} else {
			if(res.y) return true;//no vertical scroll, must not block scrolling
			if(!gantt.$scroll_ver || !gantt.$scroll_ver.offsetHeight) return true;

			var dir  = wy/-40;
			if (typeof wy == "undefined")
				dir = e.detail;

			var oldTop = gantt.$scroll_ver.scrollTop;
			var top = gantt.$scroll_ver.scrollTop+dir*30;

			if(!gantt.config.prevent_default_scroll &&
				(gantt._cached_scroll_pos && ((gantt._cached_scroll_pos.y == top) || (gantt._cached_scroll_pos.y <= 0 && top <= 0)))) return true;


			gantt.scrollTo(null, top);
			gantt.$scroll_ver.scrollTop = top;

			// not block scroll if position hasn't changed
			if(oldTop == gantt.$scroll_ver.scrollTop){
				return true;
			}
		}

		if (e.preventDefault)
			e.preventDefault();
		e.cancelBubble=true;
		return false;
	}

    if (ff)
		this.event(gantt.$container, "wheel", onMouseWheel);
    else
		this.event(gantt.$container, "mousewheel", onMouseWheel);

};


gantt._scroll_resize = function() {
	if (this._x < 20 || this._y < 20) return;

	var scrolls = this._scroll_sizes();

	if(scrolls.x){
		this.$scroll_hor.style.display = "block";
		this.$scroll_hor.style.height = scrolls.scroll_size + "px";
		this.$scroll_hor.style.width = scrolls.x + "px";
		this.$scroll_hor.firstChild.style.width = scrolls.x_inner + "px";
	}else{
		this.$scroll_hor.style.display = "none";
		this.$scroll_hor.style.height = this.$scroll_hor.style.width = '0px';
	}

	if(scrolls.y){
		this.$scroll_ver.style.display = "block";
		this.$scroll_ver.style.width = scrolls.scroll_size + "px";
		this.$scroll_ver.style.height = scrolls.y + "px";
		this.$scroll_ver.style.top = this.config.scale_height + "px";
		this.$scroll_ver.firstChild.style.height = scrolls.y_inner + "px";
	}else{
		this.$scroll_ver.style.display = "none";
		this.$scroll_ver.style.width = this.$scroll_ver.style.height = '0px';
	}
};

gantt._scroll_sizes = function(){
	var grid_width = this._get_grid_width();

	var task_width = Math.max(this._x - grid_width, 0);
	var task_height = Math.max(this._y - this.config.scale_height, 0);

	var scroll_size = this.config.scroll_size + 1;//1px for inner content

	//var task_data_width = Math.max(this._tasks.full_width - scroll_size, 0);
	var task_data_width = Math.max(this.$task_data.offsetWidth - scroll_size, 0);
	var task_data_height = this.config.row_height*this._order.length;

	var resize = this._get_resize_options();
	var scroll_hor = this._scroll_hor = resize.x ? false : (task_data_width > task_width);
	var scroll_ver = this._scroll_ver = resize.y ? false : (task_data_height > task_height);

	var scrolls = {
		x: false,
		y: false,
		scroll_size: scroll_size,
		x_inner: (task_data_width + grid_width + scroll_size + 2),
		//y_inner: Math.max(task_height, task_data_height)
		y_inner: (this.config.scale_height + task_data_height)
	};
	if(scroll_hor){
		scrolls.x = Math.max((this._x - (scroll_ver ? scroll_size : 2)), 0);
	}
	if(scroll_ver){
		scrolls.y = Math.max((this._y - (scroll_hor ? scroll_size : 0) - this.config.scale_height), 0);
	}
	return scrolls;
};

gantt._getClassName = function(node){
	if(!node) return "";

	var className = node.className || "";
	if(className.baseVal)//'className' exist but not a string - IE svg element in DOM
		className = className.baseVal;

	if(!className.indexOf)
		className = '';

	return gantt._trim(className);
};

gantt.locate = function(e) {
    var trg = gantt._get_target_node(e);

    //ignore empty cells
	var className = gantt._getClassName(trg);

    if ((className || "").indexOf("gantt_task_cell") >= 0) return null;

    var attribute = arguments[1] || this.config.task_attribute;

    while (trg){
        if (trg.getAttribute){	//text nodes has not getAttribute
            var test = trg.getAttribute(attribute);
            if (test) return test;
        }
        trg=trg.parentNode;
    }
    return null;
};
gantt._get_target_node = function(e){
	var trg;
	if (e.tagName)
		trg = e;
	else {
		e=e||window.event;
		trg=e.target||e.srcElement;
	}
	return trg;
};
gantt._trim = function(str){
	var func = String.prototype.trim || function(){ return this.replace(/^\s+|\s+$/g, ""); };
	return func.apply(str);
};

gantt._locate_css = function(e, classname, strict){
	if(strict === undefined)
		strict = true;

	var trg = gantt._get_target_node(e);
	var css = '';
	var test = false;
	while (trg){
		css = gantt._getClassName(trg);

		if(css){
			var ind = css.indexOf(classname);
			if (ind >= 0){
				if (!strict)
					return trg;

				//check that we have exact match
				var left = (ind === 0) || (!gantt._trim(css.charAt(ind - 1)));
				var right = ((ind + classname.length >= css.length)) || (!gantt._trim(css.charAt(ind + classname.length)));

				if (left && right)
					return trg;
			}
		}
		
		trg=trg.parentNode;
	}
	return null;
};
gantt._locateHTML = function(e, attribute) {
	var trg = gantt._get_target_node(e);
    attribute = attribute || this.config.task_attribute;

    while (trg){
        if (trg.getAttribute){	//text nodes has not getAttribute
            var test = trg.getAttribute(attribute);
            if (test) return trg;
        }
        trg=trg.parentNode;
    }
    return null;
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

gantt.getState = function(){
	return {
		drag_id : this._tasks_dnd.drag.id,
		drag_mode : this._tasks_dnd.drag.mode,
		drag_from_start : this._tasks_dnd.drag.left,
		selected_task : this._selected_task,
		min_date : new Date(this._min_date),
		max_date : new Date(this._max_date),
		lightbox : this._lightbox_id,
		touch_drag : this._touch_drag

	};

};


gantt._checkTimeout = function(host, updPerSecond){
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

gantt._is_render_active = function(){
	return !this._skip_render;
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

gantt.batchUpdate = function (callback, noRedraw) {
	var call_dp = (this._dp && this._dp.updateMode != "off");
	var dp_mode;
	if (call_dp){
		dp_mode = this._dp.updateMode;
		this._dp.setUpdateMode("off");
	}

	// temporary disable some methods while updating multiple tasks
	var sync_orig = this._sync_order;
	this._sync_order = function() {};

	var link_sync = this._sync_links;
	this._sync_links = function() {};

	var adjust_scales = this._adjust_scales;
	this._adjust_scales = function(){};

	var resetProjects = {};
	var resetDates = this.resetProjectDates;
	this.resetProjectDates = function(task){
		resetProjects[task.id] = task;
	};

	this._skip_render = true;
		this.callEvent("onBeforeBatchUpdate", []);
	try{
		callback();
	}catch(e){

	}
	this.callEvent("onAfterBatchUpdate", []);

	// do required updates after changes applied
	this._sync_order = sync_orig;
	this._sync_order();

	this._sync_links = link_sync;
	this._sync_links();

	this.resetProjectDates = resetDates;
	for(var i in resetProjects){
	   this.resetProjectDates(resetProjects[i]);
	}
	this._adjust_scales = adjust_scales;
	this._adjust_scales();

	this._skip_render = false;

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


// browser

gantt.env = {
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


gantt.ajax = {

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
		if (window.DOMParser && !gantt.env.isIE) { // ff,ie9
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
			var xml = (!xhr.responseXML) ? gantt.ajax.parse(xhr.responseText || xhr) : (xhr.responseXML || xhr);
			if (xml && xml.documentElement !== null && !xml.getElementsByTagName("parsererror").length) {
				return xml.getElementsByTagName(tagname)[0];
			}
		}
		if (obj !== -1) gantt.callEvent("onLoadXMLError",["Incorrect XML", arguments[1], obj]);
		return document.createElement("DIV");
	},
	xpath: function(xpathExp, docObj) {
		if (!docObj.nodeName) docObj = docObj.responseXML || docObj;
		if (gantt.env.isIE) {
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
		gantt.ajax._call(
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

			var t = (window.XMLHttpRequest && !gantt.env.isIE ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
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
									gantt.ajax.postLong(longParams.url, longParams.postData, onLoad);
								} else {
									gantt.ajax.getLong(longParams.url, onLoad);
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

	}
};


gantt._urlSeparator = function(str){
	if (str.indexOf("?") != -1)
		return "&";
	else
		return "?";
};


(function(){
	var _dhx_msg_cfg = null;
	function callback(config, result){
			var usercall = config.callback;
			modality(false);
			config.box.parentNode.removeChild(config.box);
			_dhx_msg_cfg = config.box = null;
			if (usercall)
				usercall(result);
	}
	function modal_key(e){
		if (_dhx_msg_cfg){
			e = e||event;
			var code = e.which||event.keyCode;
			if (gantt.message.keyboard){
				if (code == 13 || code == 32)
					callback(_dhx_msg_cfg, true);
				if (code == 27)
					callback(_dhx_msg_cfg, false);
			}
			if (e.preventDefault)
				e.preventDefault();
			return !(e.cancelBubble = true);
		}
	}
	if (document.attachEvent)
		document.attachEvent("onkeydown", modal_key);
	else
		document.addEventListener("keydown", modal_key, true);
		
	function modality(mode){
		if(!modality.cover){
			modality.cover = document.createElement("DIV");
			//necessary for IE only
			modality.cover.onkeydown = modal_key;
			modality.cover.className = "dhx_modal_cover";
			document.body.appendChild(modality.cover);
		}
		var height =  document.body.scrollHeight;
		modality.cover.style.display = mode?"inline-block":"none";
	}

	function button(text, result){
		var button_css = "gantt_"+text.toLowerCase().replace(/ /g, "_")+"_button" + " dhtmlx_"+text.toLowerCase().replace(/ /g, "_")+"_button"; // dhtmlx_ok_button, dhtmlx_click_me_button
		return "<div class='gantt_popup_button dhtmlx_popup_button "+button_css+"' result='"+result+"' ><div>"+text+"</div></div>";
	}

	function info(text){
		if (!t.area){
			t.area = document.createElement("DIV");
			t.area.className = "gantt_message_area dhtmlx_message_area";
			t.area.style[t.position]="5px";
			document.body.appendChild(t.area);
		}

		t.hide(text.id);
		var message = document.createElement("DIV");
		message.innerHTML = "<div>"+text.text+"</div>";
		message.className = "gantt-info dhtmlx-info gantt-" + text.type + " dhtmlx-" + text.type;
		message.onclick = function(){
			t.hide(text.id);
			text = null;
		};

		if (t.position == "bottom" && t.area.firstChild)
			t.area.insertBefore(message,t.area.firstChild);
		else
			t.area.appendChild(message);
		
		if (text.expire > 0)
			t.timers[text.id]=window.setTimeout(function(){
				t.hide(text.id);
			}, text.expire);

		t.pull[text.id] = message;
		message = null;

		return text.id;
	}
	function _boxStructure(config, ok, cancel){
		var box = document.createElement("DIV");
		box.className = " gantt_modal_box dhtmlx_modal_box gantt-"+config.type + " dhtmlx-"+config.type;
		box.setAttribute("dhxbox", 1);
			
		var inner = '';

		if (config.width)
			box.style.width = config.width;
		if (config.height)
			box.style.height = config.height;
		if (config.title)
			inner+='<div class="gantt_popup_title dhtmlx_popup_title">'+config.title+'</div>';
		inner+='<div class="gantt_popup_text dhtmlx_popup_text"><span>'+(config.content?'':config.text)+'</span></div><div  class="gantt_popup_controls dhtmlx_popup_controls">';
		if (ok)
			inner += button(config.ok || "OK", true);
		if (cancel)
			inner += button(config.cancel || "Cancel", false);
		if (config.buttons){
			for (var i=0; i<config.buttons.length; i++)
				inner += button(config.buttons[i],i);
		}
		inner += '</div>';
		box.innerHTML = inner;

		if (config.content){
			var node = config.content;
			if (typeof node == "string") 
				node = document.getElementById(node);
			if (node.style.display == 'none')
				node.style.display = "";
			box.childNodes[config.title?1:0].appendChild(node);
		}

		box.onclick = function(e){
			e = e ||event;
			var source = e.target || e.srcElement;
			if (!source.className) source = source.parentNode;
			if (source.className.split(" ")[0] == "gantt_popup_button"){
				var result = source.getAttribute("result");
				result = (result == "true")||(result == "false"?false:result);
				callback(config, result);
			}
		};
		config.box = box;
		if (ok||cancel)
			_dhx_msg_cfg = config;

		return box;
	}
	function _createBox(config, ok, cancel){
		var box = config.tagName ? config : _boxStructure(config, ok, cancel);
		
		if (!config.hidden)
			modality(true);
		document.body.appendChild(box);
		var x = Math.abs(Math.floor(((window.innerWidth||document.documentElement.offsetWidth) - box.offsetWidth)/2));
		var y = Math.abs(Math.floor(((window.innerHeight||document.documentElement.offsetHeight) - box.offsetHeight)/2));
		if (config.position == "top")
			box.style.top = "-3px";
		else
			box.style.top = y+'px';
		box.style.left = x+'px';
		//necessary for IE only
		box.onkeydown = modal_key;

		box.focus();
		if (config.hidden)
			gantt.modalbox.hide(box);

		return box;
	}

	function alertPopup(config){
		return _createBox(config, true, false);
	}
	function confirmPopup(config){
		return _createBox(config, true, true);
	}
	function boxPopup(config){
		return _createBox(config);
	}
	function box_params(text, type, callback){
		if (typeof text != "object"){
			if (typeof type == "function"){
				callback = type;
				type = "";
			}
			text = {text:text, type:type, callback:callback };
		}
		return text;
	}
	function params(text, type, expire, id){
		if (typeof text != "object")
			text = {text:text, type:type, expire:expire, id:id};
		text.id = text.id||t.uid();
		text.expire = text.expire||t.expire;
		return text;
	}
	gantt.alert = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";
		return alertPopup(text);
	};
	gantt.confirm = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return confirmPopup(text);
	};
	gantt.modalbox = function(){
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return boxPopup(text);
	};
	gantt.modalbox.hide = function(node){
		while (node && node.getAttribute && !node.getAttribute("dhxbox"))
			node = node.parentNode;
		if (node){
			node.parentNode.removeChild(node);
			modality(false);
		}
	};
	var t = gantt.message = function(text, type, expire, id){
		text = params.apply(this, arguments);
		text.type = text.type||"info";

		var subtype = text.type.split("-")[0];
		switch (subtype){
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

	t.seed = (new Date()).valueOf();
	t.uid = function(){return t.seed++;};
	t.expire = 4000;
	t.keyboard = true;
	t.position = "top";
	t.pull = {};
	t.timers = {};

	t.hideAll = function(){
		for (var key in t.pull)
			t.hide(key);
	};
	t.hide = function(id){
		var obj = t.pull[id];
		if (obj && obj.parentNode){
			window.setTimeout(function(){
				obj.parentNode.removeChild(obj);
				obj = null;
			},2000);
			obj.className+=" hidden";
			
			if(t.timers[id])
				window.clearTimeout(t.timers[id]);
			delete t.pull[id];
		}
	};
})();

gantt.date={
	init:function(){
		var s = gantt.locale.date.month_short;
		var t = gantt.locale.date.month_short_hash = {};
		for (var i = 0; i < s.length; i++)
			t[s[i]]=i;

		var s = gantt.locale.date.month_full;
		var t = gantt.locale.date.month_full_hash = {};
		for (var i = 0; i < s.length; i++)
			t[s[i]]=i;
	},
	date_part:function(date){
		var old = new Date(date);
		date.setHours(0);
		this.hour_start(date);
		if (date.getHours() && //shift to yesterday on dst
			(date.getDate() < old.getDate() || date.getMonth() < old.getMonth() || date.getFullYear() < old.getFullYear()) )
			date.setTime(date.getTime() + 60 * 60 * 1000 * (24 - date.getHours()));
		return date;
	},
	time_part:function(date){
		return (date.valueOf()/1000 - date.getTimezoneOffset()*60)%86400;
	},
	week_start:function(date){
		var shift=date.getDay();
		if (gantt.config.start_on_monday){
			if (shift===0) shift=6;
			else shift--;
		}
		return this.date_part(this.add(date,-1*shift,"day"));
	},
	month_start:function(date){
		date.setDate(1);
		return this.date_part(date);
	},
	year_start:function(date){
		date.setMonth(0);
		return this.month_start(date);
	},
	day_start:function(date){
		return this.date_part(date);
	},
	hour_start:function(date){
		if(date.getMinutes())
			date.setMinutes(0);
		this.minute_start(date);

		return date;
	},
	minute_start:function(date){
		if(date.getSeconds())
			date.setSeconds(0);
		if(date.getMilliseconds())
			date.setMilliseconds(0);
		return date;
	},
	_add_days:function(date, inc){
		var ndate = new Date(date.valueOf());

		ndate.setDate(ndate.getDate() + inc);
		if (inc >= 0 && (!date.getHours() && ndate.getHours()) &&//shift to yesterday on dst
			(ndate.getDate() <= date.getDate() || ndate.getMonth() < date.getMonth() || ndate.getFullYear() < date.getFullYear()) )
			ndate.setTime(ndate.getTime() + 60 * 60 * 1000 * (24 - ndate.getHours()));
		return ndate;
	},

	add:function(date,inc,mode){
		/*jsl:ignore*/
		var ndate=new Date(date.valueOf());
		switch(mode){
			case "day":
				ndate = gantt.date._add_days(ndate, inc);
				break;
			case "week":
				ndate = gantt.date._add_days(ndate, inc * 7);
				break;
			case "month": ndate.setMonth(ndate.getMonth()+inc); break;
			case "year": ndate.setYear(ndate.getFullYear()+inc); break;
			case "hour":
				/*
					adding hours/minutes via setHour(getHour() + inc) gives weird result when
					adding one hour to the time before switch to a Daylight Saving time

					example: //Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)
					new Date(2014, 02, 30, 1).setHours(2)
					>>Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)

					setTime seems working as expected
				 */
				ndate.setTime(ndate.getTime()+inc * 60 * 60 * 1000);
				break;
			case "minute":

				ndate.setTime(ndate.getTime() + inc * 60 * 1000);

				break;
			default:
				return gantt.date["add_"+mode](date,inc,mode);
		}
		return ndate;
		/*jsl:end*/
	},
	to_fixed:function(num){
		if (num<10)	return "0"+num;
		return num;
	},
	copy:function(date){
		return new Date(date.valueOf());
	},
	date_to_str:function(format,utc){
		format=format.replace(/%[a-zA-Z]/g,function(a){
			switch(a){
				case "%d": return "\"+gantt.date.to_fixed(date.getDate())+\"";
				case "%m": return "\"+gantt.date.to_fixed((date.getMonth()+1))+\"";
				case "%j": return "\"+date.getDate()+\"";
				case "%n": return "\"+(date.getMonth()+1)+\"";
				case "%y": return "\"+gantt.date.to_fixed(date.getFullYear()%100)+\""; 
				case "%Y": return "\"+date.getFullYear()+\"";
				case "%D": return "\"+gantt.locale.date.day_short[date.getDay()]+\"";
				case "%l": return "\"+gantt.locale.date.day_full[date.getDay()]+\"";
				case "%M": return "\"+gantt.locale.date.month_short[date.getMonth()]+\"";
				case "%F": return "\"+gantt.locale.date.month_full[date.getMonth()]+\"";
				case "%h": return "\"+gantt.date.to_fixed((date.getHours()+11)%12+1)+\"";
				case "%g": return "\"+((date.getHours()+11)%12+1)+\"";
				case "%G": return "\"+date.getHours()+\"";
				case "%H": return "\"+gantt.date.to_fixed(date.getHours())+\"";
				case "%i": return "\"+gantt.date.to_fixed(date.getMinutes())+\"";
				case "%a": return "\"+(date.getHours()>11?\"pm\":\"am\")+\"";
				case "%A": return "\"+(date.getHours()>11?\"PM\":\"AM\")+\"";
				case "%s": return "\"+gantt.date.to_fixed(date.getSeconds())+\"";
				case "%W": return "\"+gantt.date.to_fixed(gantt.date.getISOWeek(date))+\"";
				default: return a;
			}
		});
		if (utc) format=format.replace(/date\.get/g,"date.getUTC");
		return new Function("date","return \""+format+"\";");
	},
	str_to_date:function(format,utc){
		var splt="var temp=date.match(/[a-zA-Z]+|[0-9]+/g);";
		var mask=format.match(/%[a-zA-Z]/g);
		for (var i=0; i<mask.length; i++){
			switch(mask[i]){
				case "%j":
				case "%d": splt+="set[2]=temp["+i+"]||1;";
					break;
				case "%n":
				case "%m": splt+="set[1]=(temp["+i+"]||1)-1;";
					break;
				case "%y": splt+="set[0]=temp["+i+"]*1+(temp["+i+"]>50?1900:2000);";
					break;
				case "%g":
				case "%G":
				case "%h": 
				case "%H":
							splt+="set[3]=temp["+i+"]||0;";
					break;
				case "%i":
							splt+="set[4]=temp["+i+"]||0;";
					break;
				case "%Y": splt+="set[0]=temp["+i+"]||0;";
					break;
				case "%a":					
				case "%A": splt+="set[3]=set[3]%12+((temp["+i+"]||'').toLowerCase()=='am'?0:12);";
					break;					
				case "%s": splt+="set[5]=temp["+i+"]||0;";
					break;
				case "%M": splt+="set[1]=gantt.locale.date.month_short_hash[temp["+i+"]]||0;";
					break;
				case "%F": splt+="set[1]=gantt.locale.date.month_full_hash[temp["+i+"]]||0;";
					break;
				default:
					break;
			}
		}
		var code ="set[0],set[1],set[2],set[3],set[4],set[5]";
		if (utc) code =" Date.UTC("+code+")";
		return new Function("date","var set=[0,0,1,0,0,0]; "+splt+" return new Date("+code+");");
	},
	getISOWeek: function(ndate) {
		if(!ndate) return false;
		var nday = ndate.getDay();
		if (nday === 0) {
			nday = 7;
		}
		var first_thursday = new Date(ndate.valueOf());
		first_thursday.setDate(ndate.getDate() + (4 - nday));
		var year_number = first_thursday.getFullYear(); // year of the first Thursday
		var ordinal_date = Math.round( (first_thursday.getTime() - new Date(year_number, 0, 1).getTime()) / 86400000); //ordinal date of the first Thursday - 1 (so not really ordinal date)
		var week_number = 1 + Math.floor( ordinal_date / 7);
		return week_number;
	},
	getUTCISOWeek: function(ndate){
		return this.getISOWeek(ndate);
	},
	convert_to_utc: function(date) {
		return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	},
	parseDate: function(date, format) {
		if (typeof(date) == "string") {
			if (gantt.defined(format)){
				if (typeof(format) == "string")
					format = gantt.defined(gantt.templates[format]) ? gantt.templates[format] : gantt.date.str_to_date(format);
				else
					format = gantt.templates.xml_date;
			}
			if(date)
				date = format(date);
			else
				date = null;
		}
		return date;
	}
};
gantt.date.quarter_start = function(date){
	gantt.date.month_start(date);
	var m = date.getMonth(),
		res_month;

	if(m >= 9){
		res_month = 9;
	}else if(m >= 6){
		res_month = 6;
	}else if(m >= 3){
		res_month = 3;
	}else{
		res_month = 0;
	}

	date.setMonth(res_month);
	return date;
};
gantt.date.add_quarter = function(date, inc){
	return gantt.date.add(date, inc*3, "month");
};
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

if(!gantt.config) gantt.config = {};
if(!gantt.config) gantt.config = {};
if(!gantt.templates) gantt.templates = {};

(function(){

gantt.mixin(gantt.config,
	{links : {
		"finish_to_start":"0",
		"start_to_start":"1",
		"finish_to_finish":"2",
		"start_to_finish":"3"
	},
	types : {
		'task':'task',
		'project':'project',
		'milestone':'milestone'
	},
	duration_unit : "day",
	work_time:false,
	correct_work_time:false,
	skip_off_time:false,

	autosize:false,
	autosize_min_width: 0,

	show_links : true,
	show_task_cells : true,
	// replace backgroung of the task area with a canvas img
	static_background: false,
	branch_loading: false,
	show_loading: false,
	show_chart : true,
	show_grid : true,
	min_duration : 60*60*1000,
	xml_date : "%d-%m-%Y %H:%i",
	api_date : "%d-%m-%Y %H:%i",
	start_on_monday: true,
	server_utc : false,
	show_progress:true,
	fit_tasks : false,
	select_task:true,
	scroll_on_click: true,
	preserve_scroll: true,
	readonly:false,

	/*grid */
	date_grid: "%Y-%m-%d",

	drag_links : true,
	drag_progress:true,
	drag_resize:true,
	drag_move:true,
	drag_mode:{
		"resize":"resize",
		"progress":"progress",
		"move":"move",
		"ignore":"ignore"
	},
	round_dnd_dates:true,
	link_wrapper_width:20,
	root_id:0,

    autofit: false, // grid column automatic fit grid_width config
	columns: [
		{name:"text", tree:true, width:'*', resize:true },
		{name:"start_date", align: "center", resize:true },
		{name:"duration", align: "center" },
		{name:"add", width:'44' }
	],

	/*scale*/
	step: 1,
	scale_unit: "day",
	scale_offset_minimal:true,
	subscales : [

	],

	inherit_scale_class:false,

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
		"dhx_save_btn":"gantt_save_btn",
		"dhx_cancel_btn":"gantt_cancel_btn",
		"dhx_delete_btn":"gantt_delete_btn"
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
			{name: "time", type: "duration", readonly:true, map_to: "auto"}
		],
		milestone_sections: [
			{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
			{name: "type", type: "typeselect", map_to: "type"},
			{name: "time", type: "duration", single_date:true, map_to: "auto"}
		]
    },
    drag_lightbox: true,
    sort: false,
    details_on_create: true,
	details_on_dblclick:true,
	initial_scroll : true,
	task_scroll_offset : 100,

	order_branch: false,
	order_branch_free: false,

	task_height: "full",//number px of 'full' for row height
	min_column_width:70,

	// min width for grid column (when resizing)
	min_grid_column_width:70,
	// name of the attribute with column index for resize element
	grid_resizer_column_attribute: "column_index",
	// name of the attribute with column index for resize element
	grid_resizer_attribute: "grid_resizer",

	// grid width can be increased after the column has been resized
	keep_grid_width:false,
	
	// grid width can be adjusted
	grid_resize:false,

	show_unscheduled: true,

	//
	readonly_property: "readonly",
	editable_property: "editable",
	type_renderers:{},

	open_tree_initially: false,
	optimize_render: true,
	prevent_default_scroll: false,
	show_errors: true
});
gantt.keys={
    edit_save:13,
    edit_cancel:27
};

gantt._init_template = function(name, initial, template_name){
	var registeredTemplates = this._reg_templates || {};
	template_name = template_name || name;
	if(this.config[name] && registeredTemplates[template_name] != this.config[name]){
		if(!(initial && this.templates[template_name])){
			this.templates[template_name] = this.date.date_to_str(this.config[name]);
			registeredTemplates[template_name] = this.config[name];
		}
	}
	this._reg_templates = registeredTemplates;
};
gantt._init_templates = function(){
	var labels = gantt.locale.labels;
	labels.gantt_save_btn 	= labels.icon_save;
	labels.gantt_cancel_btn 	= labels.icon_cancel;
	labels.gantt_delete_btn 	= labels.icon_delete;



	//build configuration based templates
	var d = this.date.date_to_str;
	var c = this.config;
	gantt._init_template("date_scale", true);
	gantt._init_template("date_grid", true, "grid_date_format");
	gantt._init_template("task_date", true);



	gantt.mixin(this.templates,{
		xml_date:this.date.str_to_date(c.xml_date,c.server_utc),
		xml_format:d(c.xml_date,c.server_utc),
		api_date:this.date.str_to_date(c.api_date),
		progress_text:function(start, end, task){return "";},
		grid_header_class : function(column, config){
			return "";
		},

		task_text:function(start, end, task){
			return task.text;
		},
		task_class:function(start, end, task){return "";},
		grid_row_class:function(start, end, task){
			return "";
		},
		task_row_class:function(start, end, task){
			return "";
		},
		task_cell_class:function(item, date){return "";},
		scale_cell_class:function(date){return "";},
		scale_row_class:function(date){return "";},

        grid_indent:function(item) {
            return "<div class='gantt_tree_indent'></div>";
        },
        grid_folder:function(item) {
            return "<div class='gantt_tree_icon gantt_folder_" + (item.$open ? "open" : "closed") + "'></div>";
        },
        grid_file:function(item) {
            return "<div class='gantt_tree_icon gantt_file'></div>";
        },
        grid_open:function(item) {
            return "<div class='gantt_tree_icon gantt_" + (item.$open ? "close" : "open") + "'></div>";
        },
        grid_blank:function(item) {
            return "<div class='gantt_tree_icon gantt_blank'></div>";
        },
		date_grid: function(date, item) {
			if(item && gantt.isUnscheduledTask(item) && gantt.config.show_unscheduled){
				return gantt.templates.task_unscheduled_time(item);
			}else{
				return gantt.templates.grid_date_format(date);
			}
		},

        task_time:function(start,end,ev){
			if(gantt.isUnscheduledTask(ev) && gantt.config.show_unscheduled){
				return gantt.templates.task_unscheduled_time(ev);
			}else{
				return gantt.templates.task_date(start)+" - "+gantt.templates.task_date(end);
			}
		},

		task_unscheduled_time: function(task){
			return "";
		},

        time_picker:d(c.time_picker),
		link_class : function(link){
			return "";
		},
		link_description : function(link){
			var from = gantt.getTask(link.source),
				to = gantt.getTask(link.target);

			return "<b>" + from.text + "</b> &ndash;  <b>" + to.text+"</b>";
		},

		drag_link : function(from, from_start, to, to_start) {
			from = gantt.getTask(from);
			var labels = gantt.locale.labels;

			var text = "<b>" + from.text + "</b> " + (from_start ? labels.link_start : labels.link_end)+"<br/>";
			if(to){
				to = gantt.getTask(to);
				text += "<b> " + to.text + "</b> "+ (to_start ? labels.link_start : labels.link_end)+"<br/>";
			}
			return text;
		},
		drag_link_class: function(from, from_start, to, to_start) {
			var add = "";

			if(from && to){
				var allowed = gantt.isLinkAllowed(from, to, from_start, to_start);
				add = " " + (allowed ? "gantt_link_allow" : "gantt_link_deny");
			}

			return "gantt_link_tooltip" + add;
		}
    });

	this.callEvent("onTemplatesReady",[]);
};

})();
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
					if (!this.getAttribute("dhxgantt")){
						for (var key in config)
							if (key!="data")
								gantt.config[key] = config[key];

						gantt.init(this);
						if (config.data)
							gantt.parse(config.data);

						views.push(gantt);
					}
				}
			});

		
			if (views.length === 1) return views[0];
			return views;
		}
	};

})(jQuery);

}

gantt.locale = {
	date:{
		month_full:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		month_short:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		day_full:["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		day_short:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	},
	labels:{
		new_task:"New task",
		icon_save:"Save",
		icon_cancel:"Cancel",
		icon_details:"Details",
		icon_edit:"Edit",
		icon_delete:"Delete",
		confirm_closing:"",//Your changes will be lost, are your sure ?
		confirm_deleting:"Task will be deleted permanently, are you sure?",
        section_description:"Description",
        section_time:"Time period",
		section_type:"Type",

        /* grid columns */

        column_text : "Task name",
        column_start_date : "Start time",
        column_duration : "Duration",
        column_add : "",

		/* link confirmation */
		link: "Link",
		confirm_link_deleting:"will be deleted",
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
        years: "Years"
	}
};




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
gantt.skins.broadway = {
	config:{
		grid_width:360,
		row_height: 35,
		scale_height: 35,
		link_line_width:1,
		link_arrow_size:7,
		lightbox_additional_height:86
	},
	_second_column_width:90,
	_third_column_width:80,

	_lightbox_template:"<div class='gantt_cal_ltitle'><span class='gantt_mark'>&nbsp;</span><span class='gantt_time'></span><span class='gantt_title'></span><div class='gantt_cancel_btn'></div></div><div class='gantt_cal_larea'></div>",
	_config_buttons_left: {},
	_config_buttons_right: {
		"gantt_delete_btn": "icon_delete",
		"gantt_save_btn": "icon_save"
	}
};


gantt.config.touch_drag = 500; //nearly immediate dnd
gantt.config.touch = true;
gantt.config.touch_feedback = true;


gantt._touch_feedback = function(){
	if(gantt.config.touch_feedback){
		if(navigator.vibrate)
			navigator.vibrate(1);
	}
};

gantt._init_touch_events = function(){
	if (this.config.touch != "force")
		this.config.touch = this.config.touch &&
			 ((navigator.userAgent.indexOf("Mobile")!=-1)    ||
				(navigator.userAgent.indexOf("iPad")!=-1)    ||
				(navigator.userAgent.indexOf("Android")!=-1) ||
				(navigator.userAgent.indexOf("Touch")!=-1));

	if (this.config.touch){
		if (window.navigator.msPointerEnabled){
			this._touch_events(["MSPointerMove", "MSPointerDown", "MSPointerUp"], function(ev){
				if (ev.pointerType == ev.MSPOINTER_TYPE_MOUSE ) return null;
				return ev;
			}, function(ev){
				return (!ev || ev.pointerType == ev.MSPOINTER_TYPE_MOUSE);
			});
		} else
			this._touch_events(["touchmove", "touchstart", "touchend"], function(ev){
				if (ev.touches && ev.touches.length > 1) return null;
				if (ev.touches[0])
					return {
						target: ev.target,
						pageX: ev.touches[0].pageX,
						pageY: ev.touches[0].pageY,
						clientX:ev.touches[0].clientX,
						clientY:ev.touches[0].clientY
					};
				else 
					return ev;
			}, function(){ return false; });
	}
};


//we can't use native scrolling, as we need to sync momentum between different parts
//so we will block native scroll and use the custom one
//in future we can add custom momentum
gantt._touch_events = function(names, accessor, ignore){
	//webkit on android need to be handled separately
	var dblclicktime = 0;
	var action_mode = false;
	var scroll_mode = false;
	var dblclick_timer = 0;
	var action_start = null;
	var scroll_state;
	var long_tap_timer = null;
	var current_target = null;

	//touch move
	if (!this._gantt_touch_event_ready){
		this._gantt_touch_event_ready = 1;
		gantt.event(gantt.$container, names[0], function(e){
			if (ignore(e)) return;

			//ignore common and scrolling moves
			if (!action_mode) return;
			
			if (long_tap_timer) clearTimeout(long_tap_timer);

			var source = accessor(e);
			if (gantt._tasks_dnd.drag.id || gantt._tasks_dnd.drag.start_drag) {
				gantt._tasks_dnd.on_mouse_move(source);
				if (e.preventDefault)
					e.preventDefault();
				e.cancelBubble = true;
				return false;
			}
			if (source && action_start){
				var dx = action_start.pageX - source.pageX;
				var dy = action_start.pageY - source.pageY;
				if (!scroll_mode && (Math.abs(dx) > 5 || Math.abs(dy) > 5)){
					gantt._touch_scroll_active = scroll_mode = true;
					dblclicktime = 0;
					scroll_state = gantt.getScrollState();
				}

				if (scroll_mode){
					gantt.scrollTo(scroll_state.x + dx, scroll_state.y + dy);
					var new_scroll_state = gantt.getScrollState();

					if((scroll_state.x != new_scroll_state.x && dy > 2 * dx) ||
						(scroll_state.y != new_scroll_state.y && dx > 2 * dy ))
					{
						return block_action(e);
					}
				}
			}
			return block_action(e);
		});
	}

	//block touch context menu in IE10
	gantt.event(this.$container, "contextmenu", function(e){
		if (action_mode)
			return block_action(e);
	});

	//touch start
	gantt.event(this.$container, names[1], function(e){
		if (ignore(e)) return;
		if (e.touches && e.touches.length > 1){
			action_mode = false;
			return;
		}

		action_mode = true;
		action_start = accessor(e);



		//dbl-tap handling
		if (action_start && dblclicktime){
			var now = new Date();
			if ((now - dblclicktime) < 500 ){
				gantt._on_dblclick(action_start);
				block_action(e);
			} else
				dblclicktime = now;
		} else {
			dblclicktime = new Date();
		}
		
		//long tap
		long_tap_timer = setTimeout(function(){
			var taskId = gantt.locate(action_start);
			if(taskId && !gantt._locate_css(action_start, "gantt_link_control") &&  !gantt._locate_css(action_start, "gantt_grid_data")) {
				gantt._tasks_dnd.on_mouse_down(action_start);

				if(gantt._tasks_dnd.drag && gantt._tasks_dnd.drag.start_drag){
					cloneTaskRendered(taskId);
					gantt._tasks_dnd._start_dnd(action_start);
					gantt._touch_drag = true;

					gantt.refreshTask(taskId);

					gantt._touch_feedback();
				}

			}
			
			long_tap_timer = null;
		}, gantt.config.touch_drag);
	});
	
	//touch end
	gantt.event(this.$container, names[2], function(e){
		if (ignore(e)) return;
		if (long_tap_timer) clearTimeout(long_tap_timer);
		gantt._touch_drag = false;
		action_mode = false;
		var source = accessor(e);
		gantt._tasks_dnd.on_mouse_up(source);
		
		if(current_target) {
			gantt.refreshTask(gantt.locate(current_target));
			if(current_target.parentNode){
				current_target.parentNode.removeChild(current_target);
				gantt._touch_feedback();
			}
		}
		
		gantt._touch_scroll_active = action_mode = scroll_mode = false;
		current_target = null;
	});


	//common helper, prevents event
	function block_action(e){
		if (e && e.preventDefault)
			e.preventDefault();
		(e||event).cancelBubble = true;
		return false;
	}
	
	function cloneTaskRendered(taskId) {
		var renders = gantt._task_area_pulls;
		var task = gantt.getTask(taskId);
		if(task && gantt.isTaskVisible(taskId)){
			for(var i in renders) {
				task = renders[i][taskId];
				if(task && task.getAttribute("task_id") && task.getAttribute("task_id") == taskId) {
					var copy = task.cloneNode(true);
					current_target = task;
					renders[i][taskId] = copy;
					task.style.display="none";
					copy.className += " gantt_drag_move ";
					task.parentNode.appendChild(copy);
					return copy;
				}
			}
		}
	}
};
(function(){

	function deprecated(badCode, goodCode) {

		var formatting = gantt.env.isIE ? "" : "%c";


		var message = [
			formatting, "\"", badCode, "\"",  formatting,
			" has been deprecated in dhtmlxGantt v4.0 and will stop working in v5.0. Use ",
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

})();