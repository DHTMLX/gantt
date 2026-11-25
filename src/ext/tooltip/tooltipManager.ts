import domEventsScope from "../../core/ui/utils/dom_event_scope";
import * as domHelpers from "../../core/ui/utils/dom_helpers";
import * as helpers from "../../utils/helpers";
import { Tooltip } from "./tooltip";

interface ITrackerTarget {
	selector: string;
	onmouseenter: (event: MouseEvent, node: HTMLElement) => void;
	onmousemove: (event: MouseEvent, node: HTMLElement) => void;
	onmouseleave: (event: MouseEvent, node: HTMLElement) => void;
	global: boolean;
}

interface ITooltipConfig {
	selector: string;
	html: (event: MouseEvent, node: HTMLElement) => string;
	global: boolean;
}

export class TooltipManager{
	tooltip: Tooltip;
	protected _domEvents: any;
	private _listeners: object = {};
	private _gantt: any;
	private delayShow: any;
	private delayHide: any;

	constructor(gantt: any) {
		this.tooltip = new Tooltip(gantt);
		this._gantt = gantt;
		this._domEvents = domEventsScope();
		this._initDelayedFunctions();
		this._initEscDismiss();
	}

	private _initEscDismiss(): void {
		this._domEvents.attach(document, "keydown", (event: KeyboardEvent) => {
			if(event.keyCode === 27 || event.key === "Escape"){
				this.delayShow.$cancelTimeout();
				this.tooltip.hide();
			}
		});
	}

	destructor(): void{
		this.tooltip.hide();
		this._domEvents.detachAll();
	}
	hideTooltip(): void{
		this.delayHide();
	}
	attach(config: ITrackerTarget): void {
		let root = document.body;
		const gantt = this._gantt;
		if(!config.global){
			root = gantt.$root;
		}

		let watchableTarget = null;
		const handler = (event) => {
			const eventTarget = domHelpers.getTargetNode(event);
			const targetNode = domHelpers.closest(eventTarget, config.selector);
			if(domHelpers.isChildOf(eventTarget, this.tooltip.getNode())){
				return;
			}

			const doOnMouseEnter = () => {
				watchableTarget = targetNode;
				config.onmouseenter(event, targetNode);
			};

			if(watchableTarget){
				if(targetNode && targetNode === watchableTarget){
					config.onmousemove(event, targetNode);
				}else{
					config.onmouseleave(event, watchableTarget);
					watchableTarget = null;

					if(targetNode && targetNode !== watchableTarget){
						doOnMouseEnter();
					}
				}
			}else{
				if(targetNode){
					doOnMouseEnter();
				}
			}
		};

		this.detach(config.selector);
		this._domEvents.attach(root, "mousemove", handler);
		this._listeners[config.selector] = {
			node: root,
			handler
		};
	}

	detach(selector: string): void {
		const listener = this._listeners[selector];
		if(listener){
			this._domEvents.detach(listener.node, "mousemove", listener.handler);
		}
	}

	tooltipFor(config: ITooltipConfig): void {
		const cloneDomEvent = (event: MouseEvent) => {
			let clone = event;
			// making events survive timeout in ie
			// tslint:disable-next-line no-string-literal
			if(document["createEventObject"] && !document.createEvent){
				// tslint:disable-next-line no-string-literal
				clone = document["createEventObject"](event);
			}
			return clone;
		};
		this._initDelayedFunctions();
		this.attach({
			selector: config.selector,
			global: config.global,
			onmouseenter:(event: MouseEvent, node: HTMLElement) => {
				const html = config.html(event, node);
				if(html){
					this.delayShow(cloneDomEvent(event), html);
				}
			},
			onmousemove:(event: MouseEvent, node: HTMLElement) => {
				const html = config.html(event, node);
				if(html){
					this.delayShow(cloneDomEvent(event), html);
				}else{
					this.delayShow.$cancelTimeout();
					this.delayHide();
				}
			},
			onmouseleave:() => {
				this.delayShow.$cancelTimeout();
				this.delayHide();
			}
		});
	}

	private _initDelayedFunctions(){
		const gantt = this._gantt;
		// reset delayed functions in order to apply current values of tooltip_timeout
		if(this.delayShow){
			this.delayShow.$cancelTimeout();
		}
		if(this.delayHide){
			this.delayHide.$cancelTimeout();
		}
		this.tooltip.hide();

		this.delayShow = helpers.delay((event: MouseEvent, html: string) => {
			if(gantt.callEvent("onBeforeTooltip", [event]) === false) {
				this.tooltip.hide();
			} else {
				this.tooltip.setContent(html);
				this.tooltip.show(event);
			}
		}, gantt.config.tooltip_timeout || 1);

		this.delayHide = helpers.delay(() => {
			this.delayShow.$cancelTimeout();
			this.tooltip.hide();
		}, gantt.config.tooltip_hide_timeout || 1);
	}

}