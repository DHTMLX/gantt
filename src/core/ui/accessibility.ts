import isHeadless from "../../utils/is_headless";

export interface IAccessibilityLabels {
	taskBar(task: any): string;
	taskRow(task: any): string;
	link(link: any): string;
	timelineCell(date: Date, scale: any, precomputedText?: string): string;
	resourceCell(resource: any, date: Date, value: any): string;
	resourceRow(resource: any): string;
	gridCell(column: any, textValue: string, task: any): string;
}

export interface IAnnounceOptions {
	assertive?: boolean;
}

/**
 * Resolved ARIA master switch (single source of truth for every consumer,
 * incl. the UI-core control kit and popup primitive): an explicitly-set legacy
 * `wai_aria_attributes` wins, otherwise `config.accessibility.aria`; both
 * default to enabled. Pure — takes `gantt.config`.
 */
export function resolveAriaEnabled(config: any): boolean {
	if (!config) {
		return true;
	}
	const legacy = config.wai_aria_attributes;
	if (legacy !== undefined) {
		return !!legacy;
	}
	const accessibility = config.accessibility;
	return accessibility ? accessibility.aria !== false : true;
}

/**
 * @param gantt - Gantt instance
 *
 * @example
 * // customize the task bar description
 * gantt.ext.accessibility.labels.taskBar = (task) => `Appointment: ${task.text}`;
 *
 * // announce a dynamic change to screen readers
 * gantt.ext.accessibility.announce("Sorted by name, ascending");
 */
export default function(gantt: any){
	gantt.ext = gantt.ext || {};

	// resolved master switch (see resolveAriaEnabled): an explicitly-set legacy
	// `wai_aria_attributes` wins, otherwise `config.accessibility.aria`
	function isAriaEnabled(): boolean {
		return resolveAriaEnabled(gantt.config);
	}

	function announcementsEnabled(): boolean {
		if(!isAriaEnabled()){
			return false;
		}
		const accessibility = gantt.config.accessibility;
		return accessibility ? accessibility.announcements !== false : true;
	}

	// --- live region -----------------------------------------------------------

	let liveContainer: HTMLElement | null = null;
	let politeNode: HTMLElement | null = null;
	let assertiveNode: HTMLElement | null = null;
	const announceTimers: { polite: any, assertive: any } = { polite: null, assertive: null };

	function createLiveRegion(): void {
		liveContainer = document.createElement("div");
		liveContainer.className = "gantt_live_region";
		liveContainer.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;";

		politeNode = document.createElement("div");
		politeNode.setAttribute("role", "status");
		politeNode.setAttribute("aria-live", "polite");

		assertiveNode = document.createElement("div");
		assertiveNode.setAttribute("role", "alert");
		assertiveNode.setAttribute("aria-live", "assertive");

		liveContainer.appendChild(politeNode);
		liveContainer.appendChild(assertiveNode);
	}

	function ensureLiveRegion(): void {
		if(isHeadless(gantt) || !gantt.$root || !announcementsEnabled()){
			return;
		}
		if(!liveContainer){
			createLiveRegion();
		}
		if(liveContainer && liveContainer.parentNode !== gantt.$root){
			gantt.$root.appendChild(liveContainer);
		}
	}

	gantt.attachEvent("onBeforeGanttRender", ensureLiveRegion);

	function applyVisualA11yAttributes(): void {
		if(isHeadless(gantt) || typeof document === "undefined" || !document.documentElement){
			return;
		}
		const accessibility = gantt.config.accessibility || {};
		const root = document.documentElement;
		toggleAttr(root, "data-gantt-theme-colorblind", !!accessibility.colorblind_friendly);
		toggleAttr(root, "data-gantt-theme-increase-contrast", !!accessibility.increase_contrast);
	}

	function toggleAttr(el: HTMLElement, name: string, on: boolean): void {
		if(on){
			el.setAttribute(name, "");
		} else {
			el.removeAttribute(name);
		}
	}

	gantt.attachEvent("onBeforeGanttRender", applyVisualA11yAttributes);

	gantt.attachEvent("onAfterTaskDrag", function(id: any): void {
		if(!gantt.isTaskExists(id)){
			return;
		}
		gantt.ext.accessibility.announce(gantt.ext.accessibility.labels.taskRow(gantt.getTask(id)));
	});

	function getLinkTypeName(gantt: any, type: any): string {
	const linkTypes = gantt.config.links;
	for(const key in linkTypes){
		if(String(linkTypes[key]) === String(type)){
			return key;
		}
	}
	return "finish_to_start";
}

function formatLinkLag(gantt: any, lag: number): string {
	if(!lag){
		return "";
	}
	const formatted = gantt.ext.formatters.durationFormatter().format(lag);
	return lag < 0 ? " " + formatted : " +" + formatted;
}

function linkColumnCellLabel(gantt: any, column: any, task: any): string {
	const labels = gantt.locale.labels;
	const columnLabel = labels["column_" + column.name] || column.name;
	const isSuccessors = column.name === "successors";
	const linkIds = (isSuccessors ? task.$source : task.$target) || [];

	if(!linkIds.length){
		return columnLabel;
	}

	const parts = linkIds.map(function(linkId: any){
		const link = gantt.getLink(linkId);
		const otherTaskId = isSuccessors ? link.target : link.source;
		const otherTask = gantt.getTask(otherTaskId);
		const typeLabel = labels["aria_link_" + getLinkTypeName(gantt, link.type)];
		return (otherTask ? otherTask.text : otherTaskId) + " " + typeLabel + formatLinkLag(gantt, link.lag);
	});

	return columnLabel + ": " + parts.join(", ");
}

function taskDescription(task: any): string {
		const labels = gantt.locale.labels;
		const type = gantt.getTaskType(task.type);
		const typeLabel = labels["type_" + type] || labels.type_task || "";
		const formatDate = gantt.templates.tooltip_date_format;

		const parts = [
			(typeLabel ? typeLabel + ": " : "") + task.text,
			"Start date: " + formatDate(task.start_date)
		];

		if(type === gantt.config.types.milestone){
			return parts.join(", ");
		}

		parts.push("End date: " + formatDate(task.end_date));

		if(task.duration !== undefined && task.duration !== null){
			parts.push(labels.aria_task_duration.replace("$1", task.duration));
		}
		if(task.progress !== undefined && task.progress !== null){
			parts.push(labels.aria_task_progress.replace("$1", "" + Math.round(task.progress * 100)));
		}

		return parts.join(", ");
	}

	gantt.ext.accessibility = {

		labels: {
			taskBar(task: any): string {
				return taskDescription(task);
			},

			taskRow(task: any): string {
				return taskDescription(task);
			},

			link(link: any): string {
				const linkTypes = gantt.config.links;
				const toStart = link.type == linkTypes.finish_to_start || link.type == linkTypes.start_to_start;
				const fromStart = link.type == linkTypes.start_to_start || link.type == linkTypes.start_to_finish;
				return gantt.locale.labels.link + " " + gantt.templates.drag_link(link.source, fromStart, link.target, toStart);
			},

			timelineCell(date: Date, scale: any, precomputedText?: string): string {
				if(precomputedText !== undefined){
					return precomputedText;
				}
				let content = scale ? (scale.format || scale.template || scale.date) : null;
				if(typeof content === "string"){
					content = gantt.date.date_to_str(content);
				}
				return content ? content(date) : date + "";
			},

			resourceCell(resource: any, date: Date, value: any): string {
				const labels = gantt.locale.labels;
				const name = resource && resource.text ? resource.text : "";

				const structured = value && typeof value === "object";
				const used = structured ? value.used : value;
				const capacity = structured ? value.capacity : undefined;

				if(used === undefined || used === null || used === ""){
					return name;
				}

				const dateText = date ? gantt.templates.tooltip_date_format(date) : "";
				const hasCapacity = capacity !== undefined && capacity !== null && capacity !== "" && Number(capacity) > 0;

				let load: string;
				if(hasCapacity){
					load = dateText
						? labels.aria_resource_load_date.replace("$1", used).replace("$2", capacity).replace("$3", dateText)
						: labels.aria_resource_load.replace("$1", used).replace("$2", capacity);
				} else {
					load = dateText
						? labels.aria_resource_hours_date.replace("$1", used).replace("$2", dateText)
						: "" + used;
				}

				return name ? name + ": " + load : load;
			},

			resourceRow(resource: any): string {
				return resource && resource.text ? resource.text : "";
			},

			gridCell(column: any, textValue: string, task: any): string {
				if(column && (column.name === "predecessors" || column.name === "successors")){
					return linkColumnCellLabel(gantt, column, task);
				}
				return textValue;
			}
		},

		/**
		 * Pushes a message into the visually-hidden live region so screen readers
		 * read it aloud. No-op when announcements or the ARIA master switch are off.
		 *
		 * @param text - plain-text message to announce
		 * @param options - `{ assertive: true }` interrupts the current speech
		 * (time-critical messages); default is a polite announcement
		 *
		 * @example
		 * gantt.ext.accessibility.announce("Task moved to 21 Jul – 25 Jul");
		 * gantt.ext.accessibility.announce("Loading failed", { assertive: true });
		 */
		announce(text: string, options?: IAnnounceOptions): void {
			if(!announcementsEnabled()){
				return;
			}
			ensureLiveRegion();
			const node = options && options.assertive ? assertiveNode : politeNode;
			if(!node){
				return;
			}
			const timerKey = options && options.assertive ? "assertive" : "polite";
			node.textContent = "";
			clearTimeout(announceTimers[timerKey]);
			announceTimers[timerKey] = setTimeout(function(){
				node.textContent = text + "";
			}, 50);
		},

		isEnabled(): boolean {
			return isAriaEnabled();
		}
	};
}
