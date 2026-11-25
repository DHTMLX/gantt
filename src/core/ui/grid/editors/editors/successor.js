import BaseFactory from "./base";
import * as utils from "../../../../../utils/utils";
import __extends from "../../../../../utils/extends";


export default function(gantt) {

	const BaseEditor = BaseFactory(gantt);

	function SuccessorEditor() {
		const self = BaseEditor.apply(this, arguments) || this;
		return self;
	}

	__extends(SuccessorEditor, BaseEditor);

	function getFormatter(config) {
		return config.formatter || gantt.ext.formatters.linkFormatter();
	}

	function parseInputString(value, config) {
		const successors = (value || "").split(config.delimiter || ",");
		for (let i = 0; i < successors.length; i++) {
			const val = successors[i].trim();
			if (val) {
				successors[i] = val;
			} else {
				successors.splice(i, 1);
				i--;
			}
		}
		successors.sort();
		return successors;
	}

	function formatSuccessors(task, config, gantt) {
		const links = task.$source;
		const labels = [];
		for (let i = 0; i < links.length; i++) {
			const link = gantt.getLink(links[i]);
			labels.push(getFormatter(config).format({ ...link, source: link.target }));
		}
		return labels.join((config.delimiter || ",") + " ");
	}

	function getSelectedLinks(taskId, successorCodes, config) {
		const links = [];
		let rejected = false;
		// select only unique codes GS-1439
		[...new Set(successorCodes)].forEach(function (code) {
			const link = getFormatter(config).parse(code);
			if(!link || link.source === null || link.source === undefined){
				rejected = true;
				return;
			}
			if(link){
				// the parsed code identifies the successor task; this task is the link's source
				link.target = link.source;
				link.source = taskId;
				// GS-1290 A way to preserve the link. Otherwise validation will return false
				// because the existing link ID is not passed there
				link.id = "successor_generated";
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

	function getLinksDiff(task, successorCodes, config) {
		const selectedLinks = getSelectedLinks(task.id, successorCodes, config);
		if(!selectedLinks){
			return null;
		}
		const existingLinksSearch = {};
		task.$source.forEach(function (linkId) {
			const link = gantt.getLink(linkId);
			existingLinksSearch[formatLinkKey(link)] = link.id;
		});

		const linksToAdd = [];
		selectedLinks.forEach(function (link) {
			const linkKey = formatLinkKey(link);
			if (!existingLinksSearch[linkKey]) {
				linksToAdd.push(link);
			} else {
				delete existingLinksSearch[linkKey];
			}
		});

		const linksToDelete = [];
		for (const i in existingLinksSearch) {
			linksToDelete.push(existingLinksSearch[i]);
		}

		return {
			add: linksToAdd,
			remove: linksToDelete
		};
	}

	utils.mixin(SuccessorEditor.prototype, {
		show: function (id, column, config, placeholder) {
			const html = `<div role='cell'><input type='text' name='${column.name}' title='${column.name}'></div>`;
			placeholder.innerHTML = html;
		},
		hide: function () {
		},
		set_value: function (value, id, column, node) {
			this.get_input(node).value = formatSuccessors(value, column.editor, gantt);
		},
		get_value: function (id, column, node) {
			return parseInputString((this.get_input(node).value || ""), column.editor);
		},
		save: function (id, column, node) {
			const task = gantt.getTask(id);

			const linksDiff = getLinksDiff(task, this.get_value(id, column, node), column.editor);

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
			const inputSuccessors = this.get_value(id, column, node);
			const taskSuccessors = parseInputString(formatSuccessors(value, column.editor, gantt), column.editor);

			return inputSuccessors.join() !== taskSuccessors.join();
		}
	}, true);

	return SuccessorEditor;
};