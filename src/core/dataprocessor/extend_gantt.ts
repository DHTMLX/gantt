
export default function extendGantt(gantt: any, dp: any) {
	gantt.getUserData = function(id, name, store) {
		if (!this.userdata) {
			this.userdata = {};
		}
		this.userdata[store] = this.userdata[store] || {};
		if (this.userdata[store][id] && this.userdata[store][id][name]) {
			return this.userdata[store][id][name];
		}
		return "";
	};
	gantt.setUserData = function(id, name, value, store) {
		if (!this.userdata) {
			this.userdata = {};
		}
		this.userdata[store] = this.userdata[store] || {};
		this.userdata[store][id] = this.userdata[store][id] || {};
		this.userdata[store][id][name] = value;
	};

	gantt._change_id = function(oldId, newId) {
		switch (this._dp._ganttMode) {
			case "task":
				this.changeTaskId(oldId, newId);
				break;
			case "link":
				this.changeLinkId(oldId, newId);
				break;
			case "assignment":
				this.$data.assignmentsStore.changeId(oldId, newId);
				break;
			case "resource":
				this.$data.resourcesStore.changeId(oldId, newId);
				break;
			case "baseline":
				this.$data.baselineStore.changeId(oldId, newId);
				break;
			default:
				throw new Error(`Invalid mode of the dataProcessor after database id is received: ${this._dp._ganttMode}, new id: ${newId}`);
		}
	};

	gantt._row_style = function(rowId, classname){
		if (this._dp._ganttMode !== "task") {
			return;
		}
		if (!gantt.isTaskExists(rowId)) {
			return;
		}

		const task = gantt.getTask(rowId);
		task.$dataprocessor_class = classname;
		gantt.refreshTask(rowId);
	};

	gantt._sendTaskOrder = function(id, item){
		if (item.$drop_target) {
			this._dp.setGanttMode("task");
			this.getTask(id).target = item.$drop_target;
			this._dp.setUpdated(id, true,"order");
			delete this.getTask(id).$drop_target;
		}
	};

	gantt.setDp = function() {
		this._dp = dp;
	};

	gantt.setDp();
}