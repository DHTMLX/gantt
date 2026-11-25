import isInViewPort from "./viewport/is_link_in_viewport";
import getVisibleRange from "./viewport/factory/get_visible_link_range";
import { childrenHaveBaselines, getMaxParentHeight } from "./baseline_helper";


function createLinkRender(gantt){

function _render_link_element(link, view, config) {
	var source = gantt.getTask(link.source);
	if(source.hide_bar){
		return;
	}

	var target = gantt.getTask(link.target);
	if(target.hide_bar){
		return;
	}

	var pt = path_builder.get_endpoint(link, view, source, target);
	var dy = pt.e_y - pt.y;
	var dx = pt.e_x - pt.x;
	if(!dx && !dy){
		return null;
	}


	var dots = path_builder.get_points(link, view, source, target);
	const lines = drawer.get_lines(dots, view);

	const shapes = transform_lines_to_shapes(lines.filter(l => l.size > 0), config);
  
	const div = render_shapes(shapes, view, link, config);


	var css = "gantt_task_link";

	if (link.color) {
		css += " gantt_link_inline_color";
	}
	if (!gantt._isStoredLinkActive(link)) {
		css += " gantt_link_inactive";
	}

	var cssTemplate = gantt.templates.link_class ? gantt.templates.link_class(link) : "";
	if (cssTemplate) {
		css += " " + cssTemplate;
	}

	if (config.highlight_critical_path && gantt.isCriticalLink) {
		if (gantt.isCriticalLink(link))
			css += " gantt_critical_link";
	}

	// GS-1557: a dependency the schedule does not meet (auto scheduling, "prompt"/"adjust" modes)
	const unmet = !!(gantt._isConflictLink && gantt._isConflictLink(link));
	if (unmet) {
		css += " gantt_link_conflict";
	}

	div.className = css;

	if(view.$config.link_attribute){
		div.setAttribute(view.$config.link_attribute, link.id);
		div.setAttribute("link_id", link.id);
	}
	if (link.color) {
		div.style.setProperty("--dhx-gantt-link-background", link.color);
	}

	gantt._waiAria.linkAttr(link, div);
	if (unmet && div.hasAttribute("aria-label")) {
		const unmetLabel = gantt.locale.labels.as_conflict_link_unmet || "dependency not met";
		div.setAttribute("aria-label", div.getAttribute("aria-label").trim() + ", " + unmetLabel);
	}

	return div;
}

	function render_shapes(shapes, view, link, config) {
		const container = document.createElement("div");

		shapes.forEach(shape => {
			let element;
			if (shape.type === 'line') {
				element = drawer.render_line(shape.data, null, view, link.source);
			} else if (shape.type === 'corner') {
				element = drawer.render_corner(shape.data, view);
			}else if (shape.type === 'arrow') {
				element = drawer.render_arrow(shape.data, config);
			}

			container.appendChild(element);
		});

		return container;
	}

	function transform_lines_to_shapes(lines, config) {
		const radius = config.link_radius || 4;
		const arrowSize = config.link_arrow_size || 6; // Arrow size from config
		const shapes = [];
	
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const nextLine = lines[i + 1];
	
			if (!nextLine || config.link_radius <= 1) {
				shapes.push({ type: 'line', data: line });
				continue;
			}
	
			if (line.direction !== nextLine.direction) {
				if(line.size < radius || nextLine.size < radius){
					shapes.push({ type: 'line', data: line });
					continue;
				}
				line.size -= radius;
				shapes.push({ type: 'line', data: line });
	
				let cornerX = line.x;
				let cornerY = line.y - config.link_line_width / 2;
	
				switch (line.direction) {
					case 'right':
						cornerX += line.size;
						break;
					case 'left':
						cornerX -= line.size;
						break;
					case 'down':
						cornerY += line.size;
						break;
					case 'up':
						cornerY -= line.size;
						break;
				}
	
				const corner = {
					x: cornerX,
					y: cornerY,
					direction: { from: line.direction, to: nextLine.direction },
					radius
				};
				shapes.push({ type: 'corner', data: corner });
	
				switch (nextLine.direction) {
					case 'right':
						nextLine.x += radius;
						nextLine.size -= radius;
						break;
					case 'left':
						nextLine.x -= radius;
						nextLine.size -= radius;
						break;
					case 'down':
						nextLine.y += radius;
						nextLine.size -= radius;
						break;
					case 'up':
						nextLine.y -= radius;
						nextLine.size -= radius;
						break;
				}
			} else {
				shapes.push({ type: 'line', data: line });
			}
		}
	
		const lastLine = lines[lines.length - 1];
	
		if (lastLine.direction === 'right' || lastLine.direction === 'left') {
			lastLine.size -= arrowSize*3/4; 
	
			let arrowX = lastLine.direction === 'right' ? (lastLine.x + lastLine.size) : lastLine.x - lastLine.size - arrowSize/2;
			let arrowY = lastLine.y - (config.link_line_width / 2) - (arrowSize / 2) + 1;
	
			if(lastLine.direction === 'left'){
				arrowY -= 1;// left pointing arrows for some reason need adjustments
				arrowX -= 2;
			}else{
				arrowX -= 1;
			}
			const arrow = {
				x: arrowX,
				y: arrowY,
				size: arrowSize,
				direction: lastLine.direction
			};
	
			shapes.push({ type: 'line', data: lastLine });
			shapes.push({ type: 'arrow', data: arrow });
		} else {
			shapes.push({ type: 'line', data: lastLine });
		}
	
		return shapes;
	}
	


var drawer = {
	current_pos: null,
	dirs: {"left": 'left', "right": 'right', "up": 'up', "down": 'down'},
	path: [],
	clear: function () {
		this.current_pos = null;
		this.path = [];
	},
	point: function (pos) {
		this.current_pos = gantt.copy(pos);
	},
	get_lines: function (dots) {
		this.clear();
		this.point(dots[0]);
		for (var i = 1; i < dots.length; i++) {
			this.line_to(dots[i]);
		}
		return this.get_path();
	},
	line_to: function (pos) {
		var next = gantt.copy(pos);
		var prev = this.current_pos;

		var line = this._get_line(prev, next);
		this.path.push(line);
		this.current_pos = next;
	},
	get_path: function () {
		return this.path;
	},
	get_wrapper_sizes: function (v, view, itemId) {
		var config = view.$getConfig();
		var res,
			wrapper_size = config.link_wrapper_width,
			y = v.y - (wrapper_size) / 2;
		switch (v.direction) {
			case this.dirs.left:
				res = {
					top: y,
					height: wrapper_size,
					lineHeight: wrapper_size,
					left: v.x - v.size - wrapper_size / 2,
					width: v.size + wrapper_size
				};
				break;
			case this.dirs.right:
				res = {
					top: y,
					lineHeight: wrapper_size,
					height: wrapper_size,
					left: v.x - wrapper_size / 2,
					width: v.size + wrapper_size
				};
				break;
			case this.dirs.up:
				res = {
					top: y - v.size,
					lineHeight: v.size + wrapper_size,
					height: v.size + wrapper_size,
					left: v.x - wrapper_size / 2,
					width: wrapper_size
				};
				break;
			case this.dirs.down:
				res = {
					top: y /*- wrapper_size/2*/,
					lineHeight: v.size + wrapper_size,
					height: v.size + wrapper_size,
					left: v.x - wrapper_size / 2,
					width: wrapper_size
				};
				break;
			default:
				break;
		}

		return res;
	},
	get_line_sizes: function (v, view) {
		var config = view.$getConfig();
		var res,
			line_size = config.link_line_width,
			wrapper_size = config.link_wrapper_width,
			size = v.size + line_size;
		switch (v.direction) {
			case this.dirs.left:
			case this.dirs.right:
				res = {
					height: line_size,
					width: size,
					marginTop: (wrapper_size - line_size) / 2,
					marginLeft: (wrapper_size - line_size) / 2
				};
				break;
			case this.dirs.up:
			case this.dirs.down:
				res = {
					height: size,
					width: line_size,
					marginTop: (wrapper_size - line_size) / 2,
					marginLeft: (wrapper_size - line_size) / 2
				};
				break;
			default:
				break;
		}


		return res;
	},
	render_line: function (v, end, view, itemId) {
		var pos = this.get_wrapper_sizes(v, view, itemId);
		var wrapper = document.createElement("div");
		wrapper.style.cssText = [
			"top:" + pos.top + "px",
			"left:" + pos.left + "px",
			"height:" + pos.height + "px",
			"width:" + pos.width + "px"
		].join(';');
		wrapper.className = "gantt_line_wrapper";

		var innerPos = this.get_line_sizes(v, view);
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

	render_corner: function (corner, view) {
		const radius = corner.radius;
		const config = view.$getConfig();
		const lineWidth = config.link_line_width || 2;
		const cornerDiv = document.createElement("div");
	
		cornerDiv.classList.add("gantt_link_corner");
		cornerDiv.classList.add(`gantt_link_corner_${corner.direction.from}_${corner.direction.to}`);
	
		cornerDiv.style.width = `${radius}px`;
		cornerDiv.style.height = `${radius}px`;
	
		let borderVertical;
		let borderHorizontal;

		if (corner.direction.from === 'right' && corner.direction.to === 'down') {
			borderVertical = "Right";
			borderHorizontal = "Top";
			cornerDiv.style.left = `${corner.x - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y}px`;
		} else if (corner.direction.from === 'down' && corner.direction.to === 'right') {
			borderVertical = "Left";
			borderHorizontal = "Bottom";
			cornerDiv.style.left = `${corner.x - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y}px`;
		} else if (corner.direction.from === 'right' && corner.direction.to === 'up') {
			borderVertical = "Right";
			borderHorizontal = "Bottom";
			cornerDiv.style.left = `${corner.x - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y - radius}px`;
		} else if (corner.direction.from === 'up' && corner.direction.to === 'right') {
			borderVertical = "Left";
			borderHorizontal = "Top";
			cornerDiv.style.left = `${corner.x - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y - radius}px`;
		} else if (corner.direction.from === 'left' && corner.direction.to === 'down') {
			borderVertical = "Left";
			borderHorizontal = "Top";
			cornerDiv.style.left = `${corner.x - radius - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y}px`;
		} else if (corner.direction.from === 'down' && corner.direction.to === 'left') {
			borderVertical = "Right";
			borderHorizontal = "Bottom";
			cornerDiv.style.left = `${corner.x - radius - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y}px`;
		} else if (corner.direction.from === 'left' && corner.direction.to === 'up') {
			borderVertical = "Left";
			borderHorizontal = "Bottom";
			cornerDiv.style.left = `${corner.x - radius - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y - radius}px`;
		} else if (corner.direction.from === 'up' && corner.direction.to === 'left') {
			borderVertical = "Right";
			borderHorizontal = "Top";
			cornerDiv.style.left = `${corner.x - radius - config.link_line_width/2}px`;
			cornerDiv.style.top = `${corner.y - radius}px`;
		}

		cornerDiv.style[`border${borderHorizontal}Width`] = `${lineWidth}px`;
		cornerDiv.style[`border${borderVertical}Width`] = `${lineWidth}px`;
		cornerDiv.style[`border${borderVertical}Style`] = `solid`;
		cornerDiv.style[`border${borderHorizontal}Style`] = `solid`;
		cornerDiv.style[`border${borderHorizontal}${borderVertical}Radius`] = `${radius}px`;

	
		return cornerDiv;
	},

	render_arrow(arrow, config) {
		var div = document.createElement("div");
		var top = arrow.y;
		var left = arrow.x;
	
		var size = config.link_arrow_size;
		div.style.setProperty("--dhx-gantt-icon-size", `${size}px`);
	
		var className = "gantt_link_arrow gantt_link_arrow_" + arrow.direction;

		div.style.top = top + "px";
		div.style.left = left + 'px';
		div.className = className;
	
		return div;
	},
	
	_get_line: function (from, to) {
		var direction = this.get_direction(from, to);
		var vect = {
			x: from.x,
			y: from.y,
			direction: this.get_direction(from, to)
		};
		if (direction == this.dirs.left || direction == this.dirs.right) {
			vect.size = Math.abs(from.x - to.x);
		} else {
			vect.size = Math.abs(from.y - to.y);
		}
		return vect;
	},
	get_direction: function (from, to) {
		var direction = 0;
		if (to.x < from.x) {
			direction = this.dirs.left;
		} else if (to.x > from.x) {
			direction = this.dirs.right;
		} else if (to.y > from.y) {
			direction = this.dirs.down;
		} else {
			direction = this.dirs.up;
		}
		return direction;
	}

};

var path_builder = {

	path: [],
	clear: function () {
		this.path = [];
	},
	current: function () {
		return this.path[this.path.length - 1];
	},
	point: function (next) {
		if (!next)
			return this.current();

		this.path.push(gantt.copy(next));
		return next;
	},
	point_to: function (direction, diff, point) {
		if (!point)
			point = gantt.copy(this.point());
		else
			point = {x: point.x, y: point.y};
		var dir = drawer.dirs;
		switch (direction) {
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
	get_points: function (link, view, source, target) {
		var pt = this.get_endpoint(link, view, source, target);
		var xy = gantt.config;

		var dy = pt.e_y - pt.y;
		var dx = pt.e_x - pt.x;

		var dir = drawer.dirs;

		var rowHeight = view.getItemHeight(link.source);

		this.clear();
		this.point({x: pt.x, y: pt.y});

		var shiftX = 2 * xy.link_arrow_size;//just random size for first line
		var lineType = this.get_line_type(link, view.$getConfig());

		var forward = (pt.e_x > pt.x);
		if (lineType.from_start && lineType.to_start) {
			this.point_to(dir.left, shiftX);
			if (forward) {
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			}
			this.point_to(dir.right, shiftX);

		} else if (!lineType.from_start && lineType.to_start) {
			// GS-2619. No need to add loops for the split tasks (zero dy means the tasks are on the same line)
			if (dy !== 0){
				forward = (pt.e_x > (pt.x + 2 * shiftX));
			}
			this.point_to(dir.right, shiftX);
			if (forward) {
				dx -= shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				dx -= 2 * shiftX;
				var sign = dy > 0 ? 1 : -1;

				this.point_to(dir.down, sign * (rowHeight / 2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (rowHeight / 2)));
				this.point_to(dir.right, shiftX);
			}

		} else if (!lineType.from_start && !lineType.to_start) {
			this.point_to(dir.right, shiftX);
			if (forward) {
				this.point_to(dir.right, dx);
				this.point_to(dir.down, dy);
			} else {
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			}
			this.point_to(dir.left, shiftX);
		} else if (lineType.from_start && !lineType.to_start) {
			// GS-2619. No need to add loops for the split tasks (zero dy means the tasks are on the same line)
			if (dy !== 0){
				forward = (pt.e_x > (pt.x - 2 * shiftX));
			}
			this.point_to(dir.left, shiftX);

			if (!forward) {
				dx += shiftX;
				this.point_to(dir.down, dy);
				this.point_to(dir.right, dx);
			} else {
				dx += 2 * shiftX;
				var sign = dy > 0 ? 1 : -1;
				this.point_to(dir.down, sign * (rowHeight / 2));
				this.point_to(dir.right, dx);
				this.point_to(dir.down, sign * ( Math.abs(dy) - (rowHeight / 2)));
				this.point_to(dir.left, shiftX);
			}

		}

		return this.path;
	},
	get_line_type: function(link, config){
		var types = config.links;
		var from_start = false, to_start = false;
		if (link.type == types.start_to_start) {
			from_start = to_start = true;
		} else if (link.type == types.finish_to_finish) {
			from_start = to_start = false;
		} else if (link.type == types.finish_to_start) {
			from_start = false;
			to_start = true;
		} else if (link.type == types.start_to_finish) {
			from_start = true;
			to_start = false;
		} else {
			gantt.assert(false, "Invalid link type");
		}

		if(config.rtl){
			from_start = !from_start;
			to_start = !to_start;
		}

		return {from_start: from_start, to_start: to_start};
	},

	get_endpoint: function (link, view, source, target) {
		var config = view.$getConfig();

		var lineType = this.get_line_type(link, config);
		var from_start = lineType.from_start,
			to_start = lineType.to_start;

		var from = getMilestonePosition(source, view, config),
			to = getMilestonePosition(target, view, config);

		return {
			x: from_start ? from.left : (from.left + from.width),
			e_x: to_start ? to.left : (to.left + to.width),
			y: from.top + (from.rowHeight/2) - 1,
			e_y: to.top + (to.rowHeight/2) - 1
		};
	}
};

function getMilestonePosition(task, view, config){
	var pos = view.getItemPosition(task);

	// GS-2270: Link to the split children shouldn't exceed the parent row height
	let splitParams = getMaxParentHeight(gantt, view, task);
	let maxHeight = splitParams.maxHeight;

	let splitChild = splitParams.splitChild;
	const baselinesOnDifferentRow = gantt.config.baselines && (gantt.config.baselines.render_mode == "separateRow" || gantt.config.baselines.render_mode == "individualRow");
	const baselines = baselinesOnDifferentRow && task.baselines && task.baselines.length;

	if (splitParams.shrinkHeight){
		pos.rowHeight = maxHeight;
	}

	let milestoneWidth;
	let milestoneTask = gantt.getTaskType(task.type) == config.types.milestone;
	if(milestoneTask){
		let milestoneHeight = view.getBarHeight(task.id, true);
		milestoneWidth = Math.sqrt(2*milestoneHeight*milestoneHeight);
		if (splitParams.shrinkHeight && maxHeight < milestoneHeight){
			milestoneHeight = maxHeight;
			milestoneWidth = maxHeight;
		}
		pos.left -= milestoneWidth / 2;
		pos.width = milestoneWidth;
	} 
	if (splitChild){
		if (maxHeight >= pos.height) {
			const siblingBaselines = childrenHaveBaselines(gantt, task.parent);
			if (baselines || siblingBaselines){
				if (milestoneTask){
					pos.rowHeight = pos.height + 4;
					pos.left += (pos.width - pos.rowHeight + 4) / 2;
					pos.width = pos.rowHeight - 3;
				}
				else {
					pos.rowHeight = pos.height + 6;
				}
			} else if (milestoneTask) {
				pos.left += (milestoneWidth - pos.height) / 2;
			}
		} else {
			pos.rowHeight = maxHeight + 2;
			if (milestoneTask){
				pos.left += (pos.width - pos.rowHeight + 4) / 2;
				pos.width = pos.rowHeight - 3;
			}
		}
	} else if (baselines){
		pos.rowHeight = pos.height + 4;
	}

	return pos;
}


return {
	render: _render_link_element,
	update: null,
	//getRectangle: getLinkRectangle
	isInViewPort: isInViewPort,
	getVisibleRange: getVisibleRange()
};
}

export default createLinkRender;