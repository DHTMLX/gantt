function getColumnFormatter(gantt, column) {
	const editor = column.editor;
	return (editor && editor.formatter) || gantt.ext.formatters.linkFormatter();
}

function formatTaskLinks(gantt, column, linkIds, reverse) {
	const labels = [];
	const formatter = getColumnFormatter(gantt, column);
	linkIds = linkIds || [];
	for (let i = 0; i < linkIds.length; i++) {
		const link = gantt.getLink(linkIds[i]);
		if (!link) continue;
		const formatted = reverse
			? formatter.format({ ...link, source: link.target })
			: formatter.format(link);
		labels.push(formatted);
	}
	return labels.join(", ");
}

function predecessorsTemplate(gantt, column) {
	return function(task) {
		return formatTaskLinks(gantt, column, task.$target, false);
	};
}

function successorsTemplate(gantt, column) {
	return function(task) {
		return formatTaskLinks(gantt, column, task.$source, true);
	};
}

function durationTemplate(gantt) {
	return function(task) {
		return gantt.ext.formatters.durationFormatter().format(task.duration);
	};
}

export function applyColumnDefaults(gantt, column) {
	if (column.name === "predecessors") {
		if (column.template === undefined) {
			column.template = predecessorsTemplate(gantt, column);
		}
		if (column.editor === undefined) {
			column.editor = { type: "predecessor", map_to: "auto" };
		}
	} else if (column.name === "successors") {
		if (column.template === undefined) {
			column.template = successorsTemplate(gantt, column);
		}
		if (column.editor === undefined) {
			column.editor = { type: "successor", map_to: "auto" };
		}
	} else if (column.name === "duration") {
		// opt-in: a duration column shows the raw value unless it asks for the formatter
		if (column.template === undefined && column.default_formatter === true) {
			column.template = durationTemplate(gantt);
		}
	}
}