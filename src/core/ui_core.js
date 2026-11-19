import * as utils from "../utils/utils";
import env from "../utils/env";
import isHeadless from "../utils/is_headless";
import * as domHelpers from "./ui/utils/dom_helpers";
import * as codeHelpers from "../utils/helpers";
import domEventScope from "./ui/utils/dom_event_scope";
import messages from "./ui/message";
import ui from "./ui/index";
import createLayoutFacade from "./facades/layout";
import taskLayers from "./data_task_layers";
import { getOwnItemId } from "./datastore/own_item_id";

import skin from "./ui/skin";
import skyblue from "../css/skins/skyblue";
import meadow from "../css/skins/meadow";
import terrace from "../css/skins/terrace";
import broadway from "../css/skins/broadway";
import material from "../css/skins/material";
import dark from "../css/skins/dark";
import contrast_black from "../css/skins/contrast_black";
import contrast_white from "../css/skins/contrast_white";
import plugins from "./ui/plugins";
import touch from "./ui/touch";
import lightbox from "./ui/lightbox";
import lightbox_optional_time from "./ui/lightbox/lightbox_optional_time";
import wai_aria from "./ui/wai_aria";


// GS-3658. The task and link attributes hold item ids, so `locate` can return the own id
function getStoreOfIdAttribute(gantt, attribute) {
	if (attribute === gantt.config.task_attribute) {
		return gantt.$data.tasksStore;
	}
	if (attribute === gantt.config.link_attribute) {
		return gantt.$data.linksStore;
	}
	return null;
}

export default function(gantt) {

	if(!env.isNode){

		gantt.utils = {
			arrayFind: codeHelpers.arrayFind,
			dom: domHelpers
		};

		var domEvents = domEventScope();
		gantt.event = domEvents.attach;
		gantt.eventRemove = domEvents.detach;
		gantt._eventRemoveAll = domEvents.detachAll;
		gantt._createDomEventScope = domEvents.extend;

		utils.mixin(gantt, messages(gantt));
		var uiApi = ui.init(gantt);
		gantt.$ui = uiApi.factory;
		gantt.$ui.layers = uiApi.render;
		gantt.$mouseEvents = uiApi.mouseEvents;
		gantt.$services.setService("mouseEvents", function () {
			return gantt.$mouseEvents;
		});
		gantt.mixin(gantt, uiApi.layersApi);

		taskLayers(gantt);

		gantt.$services.setService("layers", function () {
			return uiApi.layersService;
		});

		gantt.mixin(gantt, createLayoutFacade());
		skin(gantt);
		skyblue(gantt);
		dark(gantt);
		meadow(gantt);
		terrace(gantt);
		broadway(gantt);
		material(gantt);
		contrast_black(gantt);
		contrast_white(gantt);
		plugins(gantt);
		touch(gantt);
		lightbox(gantt);
		lightbox_optional_time(gantt);
		wai_aria(gantt);

		gantt.locate = function(e) {
			const trg = domHelpers.getTargetNode(e);

			// ignore empty rows/cells of the timeline
			if(domHelpers.closest(trg, ".gantt_task_row")){
				return null;
			}

			const targetAttribute = arguments[1] || this.config.task_attribute;

			const node = domHelpers.locateAttribute(trg, targetAttribute);
			if(!node){
				return null;
			}

			const id = node.getAttribute(targetAttribute);
			const store = getStoreOfIdAttribute(this, targetAttribute);
			return store ? getOwnItemId(store, id) : id;
		};

		gantt._locate_css = function(e, classname, strict){
			return domHelpers.locateClassName(e, classname, strict);
		};

		gantt._locateHTML = function(e, attribute) {
			return domHelpers.locateAttribute(e, attribute || this.config.task_attribute);
		};
	}

	gantt.attachEvent("onParse", function(){
		if(!isHeadless(gantt)){
			gantt.attachEvent("onGanttRender", function(){
				if(gantt.config.initial_scroll){
					var firstTask = gantt.getTaskByIndex(0);
					var id = firstTask ? firstTask.id : gantt.config.root_id;
					// GS-1450. Don't scroll to the task if there is no timeline
					if(gantt.isTaskExists(id) && gantt.$task && gantt.utils.dom.isChildOf(gantt.$task, gantt.$container)){
						gantt.showTask(id);
					}
				}
			}, {once: true});
		}

	});

	gantt.attachEvent("onBeforeGanttReady", function(){
		if (!this.config.scroll_size)
			this.config.scroll_size = domHelpers.getScrollSize() || 15;

		if(!isHeadless(gantt)){
			// detach listeners before clearing old DOM, possible IE errors when accessing detached nodes
			this._eventRemoveAll();
			this.$mouseEvents.reset();

			this.resetLightbox();
		}

	});

	// GS-1261: scroll the views to the right side when RTL is enabled
	gantt.attachEvent("onGanttReady", function(){
		if(!isHeadless(gantt) && gantt.config.rtl){
			gantt.$layout.getCellsByType("viewCell").forEach(function(cell){ 
				var attachedScrollbar = cell.$config.scrollX;
				if (!attachedScrollbar) return;

				var scrollbar = gantt.$ui.getView(attachedScrollbar);
				if (scrollbar) scrollbar.scrollTo(scrollbar.$config.scrollSize,0);

			});
		}
	});

	// GS-1649: check if extensions are connected via files
	gantt.attachEvent("onGanttReady", function(){
		if(!isHeadless(gantt)){

			var activePlugins = gantt.plugins();

			var availablePlugins = {
				auto_scheduling: gantt.autoSchedule,
				click_drag: gantt.ext.clickDrag,
				critical_path: gantt.isCriticalTask,
				drag_timeline: gantt.ext.dragTimeline,
				export_api: gantt.exportToPDF,
				fullscreen: gantt.ext.fullscreen,
				grouping: gantt.groupBy,
				keyboard_navigation: gantt.ext.keyboardNavigation,
				marker: gantt.addMarker,
				multiselect: gantt.eachSelectedTask,
				overlay: gantt.ext.overlay,
				quick_info: gantt.templates.quick_info_content,
				tooltip: gantt.ext.tooltips,
				undo: gantt.undo
			};

			for (let plugin in availablePlugins){
				if (availablePlugins[plugin] && !activePlugins[plugin]){
					// eslint-disable-next-line no-console
					console.warn(`You connected the '${plugin}' extension via an obsolete file. 
To fix it, you need to remove the obsolete file and connect the extension via the plugins method: https://docs.dhtmlx.com/gantt/api__gantt_plugins.html`);
				}
			}
		}
	});
};