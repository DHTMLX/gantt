import type { Point, NodePosition } from "../../../types/gantt_types";

// non-standard / legacy DOM members not present in lib.dom.d.ts; typed here so the
// helpers below can use them without bare `any` (ticket_03)
interface LegacyStyleNode extends HTMLElement {
	currentStyle?: Record<string, string>;
}
interface ShadowCapableHead extends HTMLHeadElement {
	createShadowRoot?: () => ShadowRoot;
}
// nodes annotated with their original order while sorting focusable elements
type OrderedFocusable = HTMLElement & { $position: number };

// re-exported so existing imports of Point/NodePosition off this module keep working
export type { Point, NodePosition };

//returns position of html element on the page
function getNodePosition(elem: HTMLElement): NodePosition {
	let top = 0, left = 0, right = 0, bottom = 0;
	// kept loosely typed: the legacy fallback below reassigns the node up the offsetParent chain
	let el: any = elem;
	if (el.getBoundingClientRect) { //HTML5 method
		const box = el.getBoundingClientRect();
		const body = document.body;
		const docElem = (document.documentElement ||
			document.body.parentNode ||
			document.body) as HTMLElement;

		const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
		const clientTop = docElem.clientTop || body.clientTop || 0;
		const clientLeft = docElem.clientLeft || body.clientLeft || 0;
		top  = box.top +  scrollTop - clientTop;
		left = box.left + scrollLeft - clientLeft;

		right = document.body.offsetWidth - box.right;
		bottom = document.body.offsetHeight - box.bottom;
	} else { //fallback to naive approach
		while(el) {
			top = top + parseInt(el.offsetTop, 10);
			left = left + parseInt(el.offsetLeft, 10);
			el = el.offsetParent;
		}

		right = document.body.offsetWidth - el.offsetWidth - left;
		bottom = document.body.offsetHeight - el.offsetHeight - top;
	}
	return { y: Math.round(top), x: Math.round(left), width: el.offsetWidth, height: el.offsetHeight, right: Math.round(right), bottom: Math.round(bottom) };
}

function isVisible(node: HTMLElement): boolean {
	let display: string | false = false,
		visibility: string | false = false;
	if(window.getComputedStyle){
		const style = window.getComputedStyle(node, null);
		display = style["display"];
		visibility = style["visibility"];
	}else if((node as LegacyStyleNode).currentStyle){
		display = (node as LegacyStyleNode).currentStyle["display"];
		visibility = (node as LegacyStyleNode).currentStyle["visibility"];
	}
	return (display != "none" && visibility != "hidden");
}

function hasNonNegativeTabIndex(node: HTMLElement): boolean {
	return !isNaN(node.getAttribute("tabindex") as any) && ((node.getAttribute("tabindex") as any) * 1 >= 0);
}

function hasNegativeTabIndex(node: HTMLElement): boolean {
	const value = node.getAttribute("tabindex");
	return value !== null && !isNaN(value as any) && (value as any) * 1 < 0;
}

function hasHref(node: HTMLElement): boolean {
	const canHaveHref: Record<string, boolean> = {"a": true, "area": true};
	if(canHaveHref[node.nodeName.toLowerCase()]){
		return !!node.getAttribute("href");
	}
	return true;
}

function isEnabled(node: HTMLElement): boolean {
	const canDisable: Record<string, boolean> = {"input":true, "select":true, "textarea":true, "button":true, "object":true};
	if(canDisable[node.nodeName.toLowerCase()]){
		return !node.hasAttribute("disabled");
	}

	return true;
}

function getFocusableNodes(root: HTMLElement): HTMLElement[] {
	const nodes = root.querySelectorAll([
		"a[href]",
		"area[href]",
		"input",
		"select",
		"textarea",
		"button",
		"iframe",
		"object",
		"embed",
		"[tabindex]",
		"[contenteditable]"
	].join(", "));

	const nodesArray: OrderedFocusable[] = Array.prototype.slice.call(nodes, 0);

	for(let i = 0; i < nodesArray.length; i++){
		nodesArray[i].$position = i;
		// we remember original nodes order,
		// so when we sort them by tabindex we ensure order of nodes with same tabindex is preserved,
		// since some browsers do unstable sort
	}

	// use tabindex to sort focusable nodes
	nodesArray.sort(function(a, b) {
		if(a.tabIndex === 0 && b.tabIndex !== 0){
			return 1;
		}
		if(a.tabIndex !== 0 && b.tabIndex === 0){
			return -1;
		}

		if (a.tabIndex === b.tabIndex){
			// ensure we do stable sort
			return a.$position - b.$position;
		}
		if (a.tabIndex < b.tabIndex) {
			return -1;
		}
		return 1;
	});

	for(let i = 0; i < nodesArray.length; i++){
		const node = nodesArray[i];
		const isValid = !hasNegativeTabIndex(node)
			&& (hasNonNegativeTabIndex(node) || isEnabled(node) || hasHref(node))
			&& isVisible(node);
		if(!isValid){
			nodesArray.splice(i, 1);
			i--;
		}
	}
	return nodesArray;
}

function getScrollSize(): number {
	const div = document.createElement("div");
	div.style.cssText="visibility:hidden;position:absolute;left:-1000px;width:100px;padding:0px;margin:0px;height:110px;min-height:100px;overflow-y:scroll;";

	document.body.appendChild(div);
	const width = div.offsetWidth-div.clientWidth;
	document.body.removeChild(div);

	return Math.max(width, 15);
}

function getClassName(node: HTMLElement): string {
	if(!node) return "";

	let className: any = node.className || "";
	if(className.baseVal)//'className' exist but not a string - IE svg element in DOM
		className = className.baseVal;

	if(!className.indexOf)
		className = "";

	return _trimString(className);
}

function addClassName(node: HTMLElement, className: string): void {
	if (className && node.className.indexOf(className) === -1) {
		node.className += " " + className;
	}
}

function removeClassName(node: HTMLElement, name: string): void {
	const names = name.split(" ");
	for (let i = 0; i < names.length; i++) {
		const regEx = new RegExp("\\s?\\b" + names[i] + "\\b(?![-_.])", "");
		node.className = node.className.replace(regEx, "");
	}
}

function hasClass(element: HTMLElement, className: string): boolean {
	// legacy guard kept for browsers without classList; `any` avoids TS narrowing the else to `never`
	const el: any = element;
	if ('classList' in el) {
		return el.classList.contains(className);
	} else {
		return new RegExp("\\b" + className + "\\b").test(el.className);
	}
}

function toNode(node: string | HTMLElement): HTMLElement {
	if (typeof node === "string") {
		return (document.getElementById(node) || document.querySelector(node) || document.body) as HTMLElement;
	}
	return node || document.body;
}

let _slave: HTMLDivElement | undefined;
function insertNode(node: HTMLElement, newone: string): ChildNode {
	if(!_slave){
		_slave = document.createElement("div");
	}
	_slave.innerHTML = newone;
	const child = _slave.firstChild;
	node.appendChild(child);
	return child;
}

function removeNode(node: Node): void {
	if (node && node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

function getChildNodes(node: HTMLElement, css: string): HTMLElement[] {
	const ch = node.childNodes;
	const len = ch.length;
	const out: HTMLElement[] = [];
	for (let i = 0; i < len; i++) {
		const obj = ch[i] as HTMLElement;
		if (obj.className && obj.className.indexOf(css) !== -1) {
			out.push(obj);
		}
	}
	return out;
}

function getTargetNode(e: Event | Element): HTMLElement {
	let trg: any;
	if ((e as Element).tagName)
		trg = e;
	else {
		const ev = (e || window.event) as Event;
		trg = ev.target || (ev as any).srcElement;
		if (trg.shadowRoot && ev.composedPath) {
			trg = ev.composedPath()[0];
		}
	}
	return trg;
}

function locateAttribute(e: Event | Element, attribute: string): HTMLElement | null | undefined {
	if(!attribute) return;

	let trg: any = getTargetNode(e);

	while (trg){
		if (trg.getAttribute){	//text nodes has not getAttribute
			const test = trg.getAttribute(attribute);
			if (test) return trg;
		}
		// GS-2941. With the `host`, Gantt will continue iteration outside the ShadowDOM
		trg = trg.parentNode || trg.host;
	}
	return null;
}

function _trimString(str: string): string {
	const func = String.prototype.trim || function(this: string){ return this.replace(/^\s+|\s+$/g, ""); };
	return func.apply(str);
}

function locateClassName(e: Event | Element, classname: string, strict?: boolean): HTMLElement | null {
	let trg: any = getTargetNode(e);
	let css = "";

	if(strict === undefined)
		strict = true;

	while (trg){
		css = getClassName(trg);
		if(css){
			const ind = css.indexOf(classname);
			if (ind >= 0){
				if (!strict)
					return trg;

				//check that we have exact match
				const left = (ind === 0) || (!_trimString(css.charAt(ind - 1)));
				const right = ((ind + classname.length >= css.length)) || (!_trimString(css.charAt(ind + classname.length)));

				if (left && right)
					return trg;
			}
		}
		trg=trg.parentNode;
	}
	return null;
}

/*
event position relatively to DOM element
 */
function getRelativeEventPosition(ev: any, node: HTMLElement): Point {
	const d = document.documentElement;
	const box = getNodePosition(node);
	//GS-2809: condition to check event(mouse or touch)
	const { clientX, clientY } = ev.touches?.[0] ?? ev;
	return {
		x: clientX + d.scrollLeft - d.clientLeft - box.x + node.scrollLeft,
		y: clientY + d.scrollTop - d.clientTop - box.y + node.scrollTop
	};
}

function getRelativeNodePosition(child: HTMLElement, parent: HTMLElement): Point {
	const childPos = getNodePosition(child);
	const parentPos = getNodePosition(parent);
	return {
		x: childPos.x - parentPos.x,
		y: childPos.y - parentPos.y
	};
}

function isChildOf(child: EventTarget | null, parent: EventTarget | null): boolean {
	if(!child || !parent){
		return false;
	}

	// callers pass Node/Element as well as raw event targets; walk up the DOM tree
	let node: Node | null = child as Node;
	while(node && node != parent) {
		node = node.parentNode;
	}

	return node === parent;
}

function closest(element: EventTarget | null, selector: string): HTMLElement | null {
	// behavior-preserving: original accepted `any`; access stays untyped so the
	// legacy matches()/msMatchesSelector() fallbacks (and the null-throw) are unchanged
	const node = element as any;
	if(node.closest){
		return node.closest(selector);
	}else if(node.matches || node.msMatchesSelector || node.webkitMatchesSelector){
		let el = node;
		if (!document.documentElement.contains(el)) return null;
		do {
			const method = el.matches || el.msMatchesSelector || el.webkitMatchesSelector;

			if (method.call(el, selector)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1);
		return null;
	}else{
		// eslint-disable-next-line no-console
		console.error("Your browser is not supported");
		return null;
	}
}

function getClosestSizedElement(element: HTMLElement | null): HTMLElement | null {
	while (element) {
		if (element.offsetWidth > 0 && element.offsetHeight > 0) {
			return element;
		}
		element = element.parentElement;
	}
	return null;
}

function isShadowDomSupported(): boolean {
	return !!((document.head as ShadowCapableHead).createShadowRoot || document.head.attachShadow);
}

/**
 * Returns element that has the browser focus, or null if no element has focus.
 * Works with shadow DOM, so it's prefereed to use this function instead of document.activeElement directly.
 * @returns HTMLElement
 */
function getActiveElement(): Element {
	let activeElement = document.activeElement;
	if (activeElement.shadowRoot) {
		activeElement = activeElement.shadowRoot.activeElement;
	}
	if (activeElement === document.body && document.getSelection) {
		activeElement = (document.getSelection().focusNode as Element) || document.body;
	}

	return activeElement;
}

/**
 * Returns document.body or the host node of the ShadowRoot, if the element is attached to ShadowDom
 * @param {HTMLElement} element
 * @returns HTMLElement
 */
function getRootNode(element: Node | null): HTMLElement {
	let node: any = element;
	if (!node) {
		return document.body;
	}
	if (!isShadowDomSupported()) {
		return document.body;
	}
	while (node.parentNode && (node = node.parentNode)) {
		if (node instanceof ShadowRoot) {
			return node.host as HTMLElement;
		}
	}
	return document.body;
}

function hasShadowParent(element: Node | null): boolean {
	return !!getRootNode(element);
}

export {
	getNodePosition,
	getFocusableNodes,
	getScrollSize,
	getClassName,
	addClassName,
	removeClassName,
	insertNode,
	removeNode,
	getChildNodes,
	toNode,
	locateClassName,
	locateAttribute,
	getTargetNode,
	getRelativeEventPosition,
	isChildOf,
	hasClass,
	closest,
	getRootNode,
	hasShadowParent,
	isShadowDomSupported,
	getActiveElement,
	getRelativeNodePosition,
	getClosestSizedElement
};
