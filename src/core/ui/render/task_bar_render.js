import { hasPauses, getWorkSegments } from "../../common/pauses";
import { getBarTopPadding } from "./baseline_helper";

function createTaskRenderer(gantt) {

	function _render_task_element(task, view, config) {
		var config = view.$getConfig();
		var painters = config.type_renderers;
		var renderer = painters[gantt.getTaskType(task.type)],
			defaultRenderer = _task_default_render;

		if (!renderer) {
			return defaultRenderer.call(gantt, task, view, config);
		}else{
			return renderer.call(gantt, task, function(task){ return defaultRenderer.call(gantt, task, view, config);}, view);
		}
	}

	function _task_default_render(task, view, config) {
		if (gantt._isAllowedUnscheduledTask(task))
			return;

		if (!gantt._isTaskInTimelineLimits(task)) {
			return;
		}

		var pos = view.getItemPosition(task);

		var cfg = config,
			templates = view.$getTemplates();

		var taskType = gantt.getTaskType(task.type);
		var height = view.getBarHeight(task.id, taskType == cfg.types.milestone);

		var controlsMargin = 0;
		if (taskType == cfg.types.milestone) {
			controlsMargin = (height - pos.height)/2;
		}

		var padd = getBarTopPadding(gantt, view, task, height, taskType === cfg.types.milestone);
	//	if(task.type == cfg.types.milestone){
	//		padd -= 1;
	//	}
	//	if (taskType == cfg.types.milestone && cfg.link_line_width > 1) {
	//		//little adjust milestone position, so horisontal corners would match link arrow when thickness of link line is more than 1px
	//		padd += 1;
	//	}

		if (taskType == cfg.types.milestone) {
			pos.left -= Math.round(height / 2);
			pos.width = height;
		}

		var div = document.createElement("div");

		var width = Math.round(pos.width);

		if(view.$config.item_attribute) {
			div.setAttribute(view.$config.item_attribute, task.id);
			div.setAttribute(view.$config.bind + "_id", task.id); // 'task_id'/'resource_id' for backward compatibility
		}

		// task.pauses: the bar is drawn as work segments, without progress
		var paused = taskType == cfg.types.task && hasPauses(gantt, task);

		if (cfg.show_progress && taskType != cfg.types.milestone && !paused) {
			_render_task_progress(task, div, width, cfg, templates);
		}

		var widestSegment = null;
		if (paused) {
			widestSegment = _render_work_segments(task, div, pos, view);
		}

		//use separate div to display content above progress bar
		var content = _render_task_content(task, width, templates);
		if (widestSegment) {
			// the text goes over the widest work part, not over a pause
			content.style.left = widestSegment.left + "px";
			content.style.width = widestSegment.width + "px";
		}

		div.appendChild(content);

		var css = _combine_item_class("gantt_task_line",
			templates.task_class(task.start_date, task.end_date, task),
			task.id,
			view);
		if (task.color || task.progressColor || task.textColor) {
			css += " gantt_task_inline_color";
		}
		if (pos.width < 20){
			css += " gantt_thin_task";
		}
		if (paused) {
			css += " gantt_task_line_gapped";
		}
		div.className = css;

		var styles = [
			"left:" + pos.left + "px",
			"top:" + (padd + pos.top) + 'px',
			"height:" + (height) + 'px',
			"line-height:" + (Math.max(height < 30 ? height - 2 : height, 0)) + 'px',
			"width:" + width + 'px'
		];

		div.style.cssText = styles.join(";");
		if (task.color) {
			div.style.setProperty("--dhx-gantt-task-background", task.color);
		}
		if (task.textColor) {
			div.style.setProperty("--dhx-gantt-task-color", task.textColor);
		}

		if (task.progressColor) {
			div.style.setProperty("--dhx-gantt-task-progress-color", task.progressColor);
		}

		
		var side = _render_leftside_content(task, cfg, templates, controlsMargin);
		if (side) div.appendChild(side);

		side = _render_rightside_content(task, cfg, templates, controlsMargin);
		if (side) div.appendChild(side);

		gantt._waiAria.setTaskBarAttr(task, div);

		var state = gantt.getState();
		const taskEditable = !gantt.isReadonly(task);
		const timelineDrag = gantt.ext.dragTimeline && gantt.ext.dragTimeline._isDragInProgress();

		if (taskEditable || timelineDrag) {
			if (cfg.drag_resize && !gantt.isSummaryTask(task) && taskType != cfg.types.milestone) {
				_render_pair(div, "gantt_task_drag", task, function (css) {
					var el = document.createElement("div");
					el.className = css;
					return el;
				}, cfg);
			}
			if (cfg.drag_links && cfg.show_links) {
				_render_pair(div, "gantt_link_control", task, function (css) {
					var outer = document.createElement("div");
					outer.className = css;
					outer.style.cssText = [
						"height:" + height + 'px',
						"line-height:" + height + 'px'
					].join(";");
					var inner = document.createElement("div");
					inner.className = "gantt_link_point";

					var showLinkPoints = false;
					if(state.link_source_id && cfg.touch){
						showLinkPoints = true;
					}

					inner.style.display = showLinkPoints ? "block" : "";
					outer.appendChild(inner);
					return outer;
				}, cfg, controlsMargin);
			}
		}
		return div;
	}

	// One .gantt_task_segment per work part, positioned inside the bar. The bar
	// itself stays a single element spanning start_date..end_date, so drag,
	// links and getTaskNode keep working with it.
	// Returns the position of the widest segment, relative to the bar.
	function _render_work_segments(task, element, pos, view) {
		// The segments are elapsed offsets from start_date, so a moved bar keeps
		// its shape without any calendar math.
		var segments = getWorkSegments(gantt, task);
		var origin = pos;
		var wrapper = document.createElement("div");
		wrapper.className = "gantt_task_segments";
		var widest = null;
		for (var i = 0; i < segments.length; i++) {
			var segmentPos = view.getItemPosition(task, segments[i].start_date, segments[i].end_date);
			var left = Math.round(segmentPos.left - origin.left);
			var width = Math.round(segmentPos.width);
			var segment = document.createElement("div");
			segment.className = "gantt_task_segment";
			segment.style.left = left + "px";
			segment.style.width = width + "px";
			wrapper.appendChild(segment);
			if (!widest || width > widest.width) {
				widest = { left: left, width: width };
			}
		}
		element.appendChild(wrapper);
		return widest;
	}

	function _render_side_content(task, template, cssClass, marginStyle) {
		if (!template) return null;

		var text = template(task.start_date, task.end_date, task);
		if (!text) return null;
		var content = document.createElement("div");
		content.className = "gantt_side_content " + cssClass;
		content.innerHTML = text;
		if(marginStyle){
			content.style[marginStyle.type] = Math.abs(marginStyle.value) + "px";
		}
		return content;
	}

	function _render_leftside_content(task, cfg, templates, margin) {
		var css = "gantt_left " + _get_link_crossing_css(!cfg.rtl ? true : false, task, cfg);
		var marginStyle = null;
		if(margin){
			marginStyle = { type: "marginRight", value: margin };
		}
		return _render_side_content(task, templates.leftside_text, css, marginStyle);
	}

	function _render_rightside_content(task, cfg, templates, margin) {
		var css = "gantt_right " + _get_link_crossing_css(!cfg.rtl ? false : true, task, cfg);
		var marginStyle = null;
		if(margin){
			marginStyle = { type: "marginLeft", value: margin };
		}
		return _render_side_content(task, templates.rightside_text, css, marginStyle);
	}

	function _get_link_crossing_css(left, task) {
		var cond = _get_conditions(left);

		for (var i in cond) {
			var links = task[i];
			for (var ln = 0; ln < links.length; ln++) {
				var link = gantt.getLink(links[ln]);

				for (var tp = 0; tp < cond[i].length; tp++) {
					if (link.type == cond[i][tp]) {
						return "gantt_link_crossing";
					}
				}
			}
		}
		return "";
	}


	function _render_task_content(task, width, templates) {
		var content = document.createElement("div");
		if (gantt.getTaskType(task.type) != gantt.config.types.milestone){
			content.innerHTML = templates.task_text(task.start_date, task.end_date, task);
		} else if(gantt.getTaskType(task.type) == gantt.config.types.milestone && width) {
			content.style.height = content.style.width = width + "px";
		}
		content.className = "gantt_task_content";
		//content.style.width = width + 'px';
		return content;
	}

	function _render_task_progress(task, element, maxWidth, cfg, templates) {
		var done = task.progress * 1 || 0;
		//GS-2776: borders were removed in v9.0
		maxWidth = Math.max(maxWidth, 0);
		var pr = document.createElement("div");
		var width = Math.round(maxWidth * done);

		width = Math.min(maxWidth, width);

		pr.style.width = width + 'px';
		pr.className = "gantt_task_progress";
		pr.innerHTML = templates.progress_text(task.start_date, task.end_date, task);

		if(cfg.rtl){
			pr.style.position = "absolute";
			pr.style.right = "0px";
		}

		var wrapper = document.createElement("div");
		wrapper.className = "gantt_task_progress_wrapper";
		wrapper.appendChild(pr);
		element.appendChild(wrapper);

		const taskEditable = !gantt.isReadonly(task);
		const timelineDrag = gantt.ext.dragTimeline && gantt.ext.dragTimeline._isDragInProgress();

		if (gantt.config.drag_progress && (taskEditable || timelineDrag)) {
			var drag = document.createElement("div");

			var markerPos = width;
			if(cfg.rtl){
				markerPos = maxWidth - width;
			}

			drag.style.left = markerPos + 'px';
			drag.className = "gantt_task_progress_drag";
			drag.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="9" viewBox="0 0 12 9" fill="none">
<path d="M5.58397 1.52543C5.78189 1.22856 6.21811 1.22856 6.41602 1.52543L10.5475 7.72265C10.769 8.05493 10.5308 8.5 10.1315 8.5L1.86852 8.5C1.46917 8.5 1.23097 8.05493 1.45249 7.72265L5.58397 1.52543Z" fill="var(--dhx-gantt-progress-handle-background)" stroke="var(--dhx-gantt-progress-handle-border)"/>
</svg>`;
			pr.appendChild(drag);
			element.appendChild(drag);
		}
	}

	function _get_conditions(leftside) {
		if (leftside) {
			return {
				$source: [
					gantt.config.links.start_to_start
				],
				$target: [
					gantt.config.links.start_to_start,
					gantt.config.links.finish_to_start
				]
			};
		} else {
			return {
				$source: [
					gantt.config.links.finish_to_start,
					gantt.config.links.finish_to_finish
				],
				$target: [
					gantt.config.links.finish_to_finish
				]
			};
		}
	}

	function _combine_item_class(basic, template, itemId, view) {
		var cfg = view.$getConfig();
		var css = [basic];
		if (template)
			css.push(template);

		var state = gantt.getState();

		var task = gantt.getTask(itemId);

		if (gantt.getTaskType(task.type) == cfg.types.milestone) {
			css.push("gantt_milestone");
		}else if (gantt.getTaskType(task.type) == cfg.types.project) {
			css.push("gantt_project");
		}

		css.push("gantt_bar_" + gantt.getTaskType(task.type));

		if (!gantt._isStoredTaskActive(task)) {
			css.push("gantt_task_inactive");
		}


		if (gantt.isSummaryTask(task))
			css.push("gantt_dependent_task");

		if (gantt.isSplitTask(task) && ((task.$inlineSplit && task.$inlineSplit.length) || ((cfg.open_split_tasks && !task.$open && (task.$inlineSplit && task.$inlineSplit.length)) || !cfg.open_split_tasks))) {
			css.push("gantt_split_parent");
		}

		if (cfg.select_task && gantt.isSelectedTask(itemId)) {
			css.push("gantt_selected");
		}

		if (itemId == state.drag_id) {
			css.push("gantt_drag_" + state.drag_mode);
			if (state.touch_drag) {
				css.push("gantt_touch_" + state.drag_mode);
			}
		}

		if (state.link_source_id == itemId){
			css.push("gantt_link_source");
			if(state.link_from_start) {
				css.push("gantt_link_from_start");
			}else{
				css.push("gantt_link_from_end");
			}
		}

		if (state.link_target_id == itemId)
			css.push("gantt_link_target");


		if (cfg.highlight_critical_path && gantt.isCriticalTask) {
			if (gantt.isCriticalTask(task))
				css.push("gantt_critical_task");
		}

		if (state.link_landing_area &&
			(state.link_target_id && state.link_source_id) &&
			(state.link_target_id != state.link_source_id) &&
			(state.link_target_id == itemId || state.link_source_id == itemId)) {

			var from_id = state.link_source_id;
			var from_start = state.link_from_start;
			var to_start = state.link_to_start;

			var allowDrag = gantt.isLinkAllowed(from_id, itemId, from_start, to_start);

			var dragClass = "";
			if (allowDrag) {
				if (to_start)
					dragClass = "link_start_allow";
				else
					dragClass = "link_finish_allow";
			} else {
				if (to_start)
					dragClass = "link_start_deny";
				else
					dragClass = "link_finish_deny";
			}
			css.push(dragClass);
		}
		return css.join(" ");
	}

	function _render_pair(parent, css, task, content, config, margin) {
		var state = gantt.getState();
		var className, element;
		if (+task.start_date >= +state.min_date) {
			className = [css, config.rtl ? "task_right" : "task_left", "task_start_date"];
			element = content(className.join(" "));
			element.setAttribute("data-bind-property", "start_date");
			if(margin){
				element.style.marginLeft = margin + "px";
			}
			parent.appendChild(element);
		}

		if (+task.end_date <= +state.max_date){
			className = [css, config.rtl ? "task_left" : "task_right", "task_end_date"];
			element = content(className.join(" "));
			element.setAttribute("data-bind-property", "end_date");
			if(margin){
				element.style.marginRight = margin + "px";
			}
			parent.appendChild(element);
		}

	}

	return _render_task_element;
}

export default createTaskRenderer;