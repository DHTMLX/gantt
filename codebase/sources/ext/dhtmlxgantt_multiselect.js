/*
@license

dhtmlxGantt v.4.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt.config.multiselect = true;
gantt.config.multiselect_one_level = false;

gantt._multiselect = {
	selected: {},
	one_level: true,
	active: true,
	isActive: function(){
		this.update_state();
		return this.active;
	},
	update_state: function(){
		this.one_level = gantt.config.multiselect_one_level;
		var active = this.active;
		this.active = gantt.config.multiselect;
		if(this.active != active){
			this.reset();
		}
	},
	reset: function () {
		this.selected = {};
	},
	set_last_selected: function (id) {
		this.last_selected = id;
	},
	getLastSelected: function () {
		var last = this.last_selected;
		if(last && gantt.isTaskExists(last))
			return last;
		return null;
	},
	select: function (id, e) {
		if(gantt.callEvent("onBeforeTaskMultiSelect", [id, true, e])){
			this.selected[id] = true;
			this.set_last_selected(id);
			gantt.callEvent("onTaskMultiSelect", [id, true, e]);
		}
	},
	toggle: function (id, e) {
		if(this.selected[id]){
			this.unselect(id, e);
		}else{
			this.select(id, e);
		}
	},
	unselect: function (id, e) {
		if(gantt.callEvent("onBeforeTaskMultiSelect", [id, false, e])){
			this.selected[id] = false;
			if(this.last_selected == id)
				this.last_selected = null;

			gantt.callEvent("onTaskMultiSelect", [id, true, e]);
		}
	},
	isSelected: function (id) {
		return !!(gantt.isTaskExists(id) && this.selected[id]);
	},
	getSelected: function () {
		var res = [];
		for (var i in this.selected) {
			if (this.selected[i] && gantt.isTaskExists(i)) {
				res.push(i);
			}else{
				this.selected[i] = false;
			}
		}

		res.sort(function(a, b){
			return gantt.calculateTaskLevel(gantt.getTask(a)) > gantt.calculateTaskLevel(gantt.getTask(b)) ? 1 : -1;
		});
		
		return res;
	},
	forSelected: function (callback) {
		var selected = this.getSelected();
		for (var i = 0; i < selected.length; i++) {
			callback(selected[i]);
		}
	},
	is_same_level: function(id){
		if(!this.one_level)
			return true;
		var last = this.getLastSelected();
		if(!last)
			return true;

		if(!(gantt.isTaskExists(last) && gantt.isTaskExists(id)))
			return true;

		return !!(gantt.calculateTaskLevel(gantt.getTask(last)) == gantt.calculateTaskLevel(gantt.getTask(id)));
	},
	_after_select: function(target){
		gantt.refreshTask(target);
	},
	_do_selection: function(e) {
		/* add onclick handler to gantt container, hook up multiselection */
		if(!this.isActive())
			return true;
		var target_ev = gantt.locate(e);
		var selected = this.getSelected();
		if (!target_ev)
			return true;

		if(!gantt.callEvent("onBeforeMultiSelect", [e])){
			return true;
		}

		if (e.ctrlKey || e.metaKey) {
			if (target_ev) {
				this.toggle(target_ev, e);
				this._after_select(target_ev);
			}
		} else if (e.shiftKey && selected.length) {
			var last = this.getLastSelected();
			if (!last)
				last = selected[selected.length - 1];
			if (target_ev && last != target_ev) {
				var last_si = gantt.getGlobalTaskIndex(last);
				var cur_si = gantt.getGlobalTaskIndex(target_ev);
				var tmp = target_ev;
				while (gantt.getGlobalTaskIndex(tmp) != last_si) {
					this.select(tmp);
					this._after_select(tmp);
					tmp = (last_si > cur_si) ? gantt.getNext(tmp) : gantt.getPrev(tmp);
				}
				this.forSelected(gantt.bind(function (task_id) {
					var index = gantt.getGlobalTaskIndex(task_id);
					if ((index > last_si && index > cur_si) || (index < last_si && index < cur_si)) {
						this.unselect(task_id);
						gantt.refreshTask(task_id);
					}
				}, this));
			}

		}
		else {
			this.forSelected(gantt.bind(function (task_id) {
				if (task_id != target_ev) {
					this.unselect(task_id);
					gantt.refreshTask(task_id);
				}
			}, this));
			if (!this.isSelected(target_ev)) {

				this.select(target_ev);
				this._after_select(target_ev);
			}
		}

		if(!this.isSelected(target_ev)){
			return false;
		}
		return true;
	}
};


(function(){
	var old_selectTask = gantt.selectTask;
	gantt.selectTask = function(id){
		var res = old_selectTask.call(this, id);
		if(this.config.multiselect)
			this._multiselect.select(id);

		return res;
	};
	var old_unselectTask = gantt.unselectTask;
	gantt.unselectTask = function(id){
		if(id !== undefined && this.config.multiselect)
			this._multiselect.unselect(id);
		var res = old_unselectTask.call(this, id);
		return res;
	};

	gantt.toggleTaskSelection = function(id){
		if(this.config.multiselect)
			this._multiselect.toggle(id);
	};
	gantt.getSelectedTasks = function(){
		return this._multiselect.getSelected();
	};
	gantt.eachSelectedTask = function(callback){
		return this._multiselect.forSelected(callback);
	};
	gantt.isSelectedTask = function(id){
		return this._multiselect.isSelected(id);
	};
	gantt.getLastSelectedTask = function(){
		return this._multiselect.getLastSelected();
	};

})();

gantt.attachEvent("onTaskIdChange", function (id, new_id) {
	var multiselect = gantt._multiselect;
	if(!multiselect.isActive())
		return true;

	if (gantt.isSelectedTask(id)) {
		multiselect.unselect(id, null);
		multiselect.select(new_id, null);
		gantt.refreshTask(new_id);
	}
});

gantt.attachEvent("onAfterTaskDelete", function (id, item) {
	var multiselect = gantt._multiselect;
	if(!multiselect.isActive())
		return true;

	if (multiselect.selected[id])
		multiselect.unselect(id, null);

	multiselect.forSelected(function (task_id) {
		if (!gantt.isTaskExists(task_id))
			multiselect.unselect(task_id, null);
	});
});

gantt.attachEvent("onBeforeTaskMultiSelect", function(id, select, e){
	var multiselect = gantt._multiselect;
	if(select && multiselect.isActive()){
		return multiselect.is_same_level(id);
	}
	return true;
});

gantt.attachEvent("onTaskClick", function(id, e){
	var res = gantt._multiselect._do_selection(e);
	gantt.callEvent("onMultiSelect", [e]);
	return res;
});
gantt.attachEvent("onEmptyClick", function (e){
	gantt._multiselect._do_selection(e);
	gantt.callEvent("onMultiSelect", [e]);
	return true;
});