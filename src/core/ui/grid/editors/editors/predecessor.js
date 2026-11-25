import BaseFactory from "./base";
import * as utils from "../../../../../utils/utils";
import __extends from "../../../../../utils/extends";


export default function(gantt) {

	var BaseEditor = BaseFactory(gantt);

	function PredecessorEditor() {
		var self = BaseEditor.apply(this, arguments) || this;
		return self;
	}

	__extends(PredecessorEditor, BaseEditor);

	function getFormatter(config) {
		return config.formatter || gantt.ext.formatters.linkFormatter();
	}

	function parseInputString(value, config) {
		var predecessors = (value || "").split(config.delimiter || ",");
		for (var i = 0; i < predecessors.length; i++) {
			var val = predecessors[i].trim();
			if (val) {
				predecessors[i] = val;
			} else {
				predecessors.splice(i, 1);
				i--;
			}
		}
		predecessors.sort();
		return predecessors;
	}

	function formatPredecessors(task, config, gantt) {
		var links = task.$target;
		var labels = [];
		for (var i = 0; i < links.length; i++) {
			var link = gantt.getLink(links[i]);
			labels.push(getFormatter(config).format(link));
		}
		return labels.join((config.delimiter || ",") + " ");
	}

	// GS-3626: the complete edit is validated before any link changes - one malformed
	// or unresolved code rejects the whole edit and keeps the existing links, so a typo
	// can never delete the links it failed to restate
	function getSelectedLinks(taskId, predecessorCodes, config) {
		var links = [];
		var rejected = false;
		// select only unique codes GS-1439
		[...new Set(predecessorCodes)].forEach(function (code) {
			var link = getFormatter(config).parse(code);
			if(!link || link.source === null || link.source === undefined){
				rejected = true;
				return;
			}
			if(link){
				link.target = taskId;
				// GS-1290 A way to preserve the link. Otherwise validation will return false
				// because the existing link ID is not passed there
				link.id = "predecessor_generated";
				if (gantt.isLinkAllowed(link)) {
					link.id = undefined;
					links.push(link);
				}
			}
		});
		return rejected ? null : links;
	}

	function formatLinkKey(link){
		return link.source + "_" + link.target + "_" + link.type + "_" + (link.lag||0);
	}

	function getLinksDiff(task, predecessorCodes, config) {
		var selectedLinks = getSelectedLinks(task.id, predecessorCodes, config);
		if(!selectedLinks){
			return null;
		}
		var existingLinksSearch = {};
		task.$target.forEach(function (linkId) {
			var link = gantt.getLink(linkId);
			existingLinksSearch[formatLinkKey(link)] = link.id;
		});

		var linksToAdd = [];
		selectedLinks.forEach(function (link) {
			var linkKey = formatLinkKey(link);
			if (!existingLinksSearch[linkKey]) {
				linksToAdd.push(link);
			} else {
				delete existingLinksSearch[linkKey];
			}
		});

		var linksToDelete = [];
		for (var i in existingLinksSearch) {
			linksToDelete.push(existingLinksSearch[i]);
		}

		return {
			add: linksToAdd,
			remove: linksToDelete
		};
	}

	utils.mixin(PredecessorEditor.prototype, {
		show: function (id, column, config, placeholder) {
			var html = `<div role='cell'><input type='text' name='${column.name}' title='${column.name}'></div>`;
			placeholder.innerHTML = html;
		},
		hide: function () {
		},
		set_value: function (value, id, column, node) {
			this.get_input(node).value = formatPredecessors(value, column.editor, gantt);
		},
		get_value: function (id, column, node) {
			return parseInputString((this.get_input(node).value || ""), column.editor);
		},
		save: function (id, column, node) {
			var task = gantt.getTask(id);

			var linksDiff = getLinksDiff(task, this.get_value(id, column, node), column.editor);

			if (linksDiff && (linksDiff.add.length || linksDiff.remove.length)) {
				gantt.batchUpdate(function () {
					linksDiff.add.forEach(function (link) {
						gantt.addLink(link);
					});
					linksDiff.remove.forEach(function (linkId) {
						gantt.deleteLink(linkId);
					});

					if (gantt.autoSchedule)
						gantt.autoSchedule();
				});
			}
		},
		is_changed: function (value, id, column, node) {
			var inputPredecessors = this.get_value(id, column, node);
			var taskPredecessors = parseInputString(formatPredecessors(value, column.editor, gantt), column.editor);

			return inputPredecessors.join() !== taskPredecessors.join();
		}
	}, true);

	return PredecessorEditor;
};