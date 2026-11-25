import type { Point } from "../../types/gantt_types";

let _dragInProgress: boolean = false;

export class EventsManager {
	static create(gantt: any) {
		return new EventsManager(gantt);
	}
	static _isDragInProgress() {
		return _dragInProgress;
	}
	private _mouseDown: boolean = false;
	private _startPoint: Point;
	private _scrollState: Point;
	private _originAutoscroll: boolean;
	private _domEvents: any;
	private _timeline: any;
	private _gantt: any;
	private _trace: Point[];
	private _originalReadonly: boolean;
	private _ownsReadonlyBeforeDrag: boolean = false;

	constructor(gantt: any) {
		this._gantt = gantt;
		this._domEvents = gantt._createDomEventScope();
		this._trace = [];
	}

	destructor() {
		this._domEvents.detachAll();
		// a layout reset during a drag destroys this manager before mouseup
		this._clearReadonlyBeforeDrag();
	}

	private _clearReadonlyBeforeDrag(): void {
		if (this._ownsReadonlyBeforeDrag) {
			this._gantt.ext.dragTimeline._readonlyBeforeDrag = undefined;
			this._ownsReadonlyBeforeDrag = false;
		}
	}

	attach(timeline: any): void {
		this._timeline = timeline;
		const gantt = this._gantt;
		this._domEvents.attach(timeline.$task, "mousedown", (event) => {
			if (!gantt.config.drag_timeline) {
				return;
			}
			const { useKey,ignore, enabled } = gantt.config.drag_timeline;
			if(enabled === false) {
				return;
			}

			let filterTargets = ".gantt_task_line, .gantt_task_link";
			if(ignore !== undefined) {
				if(ignore instanceof Array){
					filterTargets = ignore.join(", ");
				} else {
					filterTargets = ignore;
				}
			}
			if (filterTargets) {
				if (gantt.utils.dom.closest(event.target, filterTargets)) {
					return;
				}
			}
			if (useKey && event[useKey] !== true) { return; }

			this._startDrag(event);
		});

		this._domEvents.attach(document, "keydown", (event) => {
			if (!gantt.config.drag_timeline) {
				return;
			}
			const { useKey } = gantt.config.drag_timeline;
			if (useKey && event[useKey] === true) {
				this._applyDndReadyStyles();
			}
		});
		this._domEvents.attach(document, "keyup", (event) => {
			if (!gantt.config.drag_timeline) {
				return;
			}
			const { useKey } = gantt.config.drag_timeline;
			if (useKey && event[useKey] === false) {
				this._clearDndReadyStyles();
				this._stopDrag(event);
			}
		});

		this._domEvents.attach(document, "mouseup", (event) => {
			this._stopDrag(event);
		});
		this._domEvents.attach(gantt.$root, "mouseup", (event) => {
			this._stopDrag(event);
		});
		this._domEvents.attach(document, "mouseleave", (event) => {
			this._stopDrag(event);
		});
		this._domEvents.attach(gantt.$root, "mouseleave", (event) => {
			this._stopDrag(event);
		});

		this._domEvents.attach(gantt.$root, "mousemove", (event) => {
			if (!gantt.config.drag_timeline) {
				return;
			}
			const { useKey } = gantt.config.drag_timeline;
			if (useKey && event[useKey] !== true) { return; }
			// GS-854. If we don't have useKey for the drag_timeline extension,
			// check the click_drag to not simultaneously use both extensions
			const clickDrag = this._gantt.ext.clickDrag;
			const clickDragUseKey = (this._gantt.config.click_drag || {}).useKey;
			if (clickDrag && clickDragUseKey) {
				if (!useKey && event[clickDragUseKey]) {
					return;
				}
			}
			if (this._mouseDown === true) {
				this._trace.push({ x: event.clientX, y: event.clientY });
				const scrollPosition: Point = this._countNewScrollPosition({ x: event.clientX, y: event.clientY });
				this._setScrollPosition(timeline, scrollPosition);
				this._scrollState = scrollPosition;
				this._startPoint = { x: event.clientX, y: event.clientY };
			}
		});
	}

	private _calculateDirectionVector = () => {
		const traceSteps = 10;
		if(this._trace.length >= traceSteps) {
			const dots = this._trace.slice(this._trace.length - traceSteps);

			const vectors = [];
			for(let i = 1; i < dots.length; i++) {
				vectors.push({
					x: dots[i].x - dots[i - 1].x,
					y: dots[i].y - dots[i - 1].y
				});
			}
			const resultVector = {x:0, y:0};

			vectors.forEach((vector) => {
				resultVector.x += vector.x;
				resultVector.y += vector.y;
			});

			const magnitude = Math.sqrt(resultVector.x*resultVector.x + resultVector.y*resultVector.y);
			const angleDegrees = Math.atan2(Math.abs(resultVector.y), Math.abs(resultVector.x)) * 180 / Math.PI;

			return {
				magnitude,
				angleDegrees
			};

		}
		return null;
	};

	private _applyDndReadyStyles = (): void => {
		this._timeline.$task.classList.add("gantt_timeline_move_available");
	};

	private _clearDndReadyStyles = (): void => {
		this._timeline.$task.classList.remove("gantt_timeline_move_available");
	};

	private _getScrollPosition = (timeline: any): Point => {
		const gantt = this._gantt;
		return {
			x: gantt.$ui.getView(timeline.$config.scrollX).getScrollState().position,
			y: gantt.$ui.getView(timeline.$config.scrollY).getScrollState().position
		};
	};
	private _countNewScrollPosition = (coords: Point): Point => {
		const vector = this._calculateDirectionVector();
		let shiftX = this._startPoint.x - coords.x;
		let shiftY = this._startPoint.y - coords.y;
		if(vector){
			if(vector.angleDegrees < 15){
				shiftY = 0;
			} else if(vector.angleDegrees > 75){
				shiftX = 0;
			}
		}

		const result = {
			x: this._scrollState.x + shiftX,
			y: this._scrollState.y + shiftY
		};
		return result;
	};
	private _setScrollPosition = (timeline: any, coords: Point): void => {
		const gantt = this._gantt;
		requestAnimationFrame(() => {
			gantt.scrollLayoutCell(timeline.$id, coords.x, coords.y);
		});
	};
	private _stopDrag = (event: Event): void => {
		const gantt = this._gantt;
		this._trace = [];
		gantt.$root.classList.remove("gantt_noselect");

		// We need to set the readonly mode because with the key modifiers, 
		// users may expect to start dragging the timeline on the task and link coordinates
		if(this._originalReadonly !== undefined && this._mouseDown){
			gantt.config.readonly = this._originalReadonly;
			this._clearReadonlyBeforeDrag();
			if(gantt.config.drag_timeline && gantt.config.drag_timeline.render){
				gantt.render();
			}
		}

		if(this._originAutoscroll !== undefined){
			gantt.config.autoscroll = this._originAutoscroll;
		}

		if(gantt.config.drag_timeline){
			const { useKey } = gantt.config.drag_timeline;
			if (useKey && event[useKey] !== true) {
				return;
			}
		}

		this._mouseDown = false;
		_dragInProgress = false;
	};

	private _startDrag = (event: any) : void => {
		const gantt = this._gantt;
		this._originAutoscroll = gantt.config.autoscroll;
		gantt.config.autoscroll = false;
		_dragInProgress = true;

		gantt.$root.classList.add("gantt_noselect");
		this._originalReadonly = gantt.config.readonly;
		gantt.ext.dragTimeline._readonlyBeforeDrag = this._originalReadonly;
		this._ownsReadonlyBeforeDrag = true;
		gantt.config.readonly = true;

		if(gantt.config.drag_timeline && gantt.config.drag_timeline.render){
			gantt.render();
		}

		this._trace = [];
		this._mouseDown = true;
		const { x, y } = this._getScrollPosition(this._timeline);
		this._scrollState = { x, y };
		this._startPoint = { x: event.clientX, y: event.clientY };
		this._trace.push(this._startPoint);
	};
}