import * as utils from "../utils/utils";
import constants from "../constants";
import ExtensionManager from "../ext/extension_manager";

import services from "../core/common/services";
import config from "../core/common/config";
import ajax from "../core/common/ajax";
import date from "../core/common/date";
import { remoteEvents } from "../core/remote/remote_events";
import { recordStockSections } from "../core/ui/lightbox/stock_sections";

import DnD from "../core/common/dnd";
import templates from "../core/common/templates";
import eventable from "../utils/eventable";

import StateService from "../core/common/state";

import Promise from "../utils/promise";
import env from "../utils/env";
import datastoreHooks from "../core/datastore/datastore_hooks";
import taskActivity from "../core/task_activity";
import DataProcessor from "../core/dataprocessor";

import plugins from "../core/plugins";

import grid_column_api from "../core/grid_column_api";
import tasks from "../core/tasks";
import parsing from "../core/loading/parsing";
import work_time from "../core/worktime/work_time";
import data from "../core/data";

import void_script_second from "../publish_helpers/void_script_second";

import data_task_types from "../core/data_task_types";
import cached_functions from "../core/cached_functions";

import gantt_core from "../core/gantt_core";
import destructor from "../core/destructor";
import void_script_third from "../publish_helpers/void_script_third";

import i18nFactory from "../locale";

import type { GanttInternationalization, GanttPlugin, GanttPlugins, GanttStatic, Id } from "../types/gantt_types";
import type { GanttInternal } from "../types/gantt_internal_types";

type SupportedExtensions = { [key: string]: GanttPlugin };
type ActivePlugins = { [key: string]: boolean };
export type GanttInstance = GanttStatic & GanttInternal;

class DHXGantt {
	constants = constants;
	version = VERSION;
	license = LICENSE;
	templates = {};
	ext = {};
	keys = {
		edit_save: this.constants.KEY_CODES.ENTER,
		edit_cancel: this.constants.KEY_CODES.ESC
	};
}

export default function(supportedExtensions: SupportedExtensions): GanttInstance {
	// use a named constructor to make gantt instance discoverable in heap snapshots
	const gantt = new DHXGantt() as unknown as GanttInstance;

	const extensionManager = new ExtensionManager(supportedExtensions);
	const activePlugins: ActivePlugins = {};
	gantt.plugins = function(config: GanttPlugins = {}): GanttPlugins {
		for(const i in config){
			if(config[i as keyof GanttPlugins] && !activePlugins[i]){
				const plugin = extensionManager.getExtension(i) as GanttPlugin | undefined;
				if(plugin){
					plugin(gantt);
					activePlugins[i] = true;
				}
			}
		}
		return activePlugins as GanttPlugins;
	};

	gantt.$services = services();
	// lets the core tell "this build has no such extension" from "not activated"
	(gantt.$services as any).setService("extensionState", function () {
		return {
			isAvailable: (name: string): boolean => !!extensionManager.getExtension(name),
			isActive: (name: string): boolean => !!activePlugins[name]
		};
	});
	gantt.config = config();
	const stockSections = recordStockSections(gantt.config.lightbox as any);
	(gantt.$services as any).setService("lightboxStockSections", function () {
		return stockSections;
	});
	gantt.ajax = ajax(gantt);
	gantt.date = date(gantt);
	gantt.RemoteEvents = remoteEvents;

	const dnd = DnD(gantt);
	(gantt.$services as any).setService("dnd", function(){return dnd;});

	const templatesLoader = templates(gantt);
	(gantt.$services as any).setService("templateLoader", function () {
		return templatesLoader;
	});

	eventable(gantt);

	
	const stateService = StateService();

	stateService.registerProvider("global", function () {
		const res = {
			min_date: gantt._min_date,
			max_date: gantt._max_date,
			selected_task: null as Id | null
		};

		// do not throw error if getState called from non-initialized gantt
		if(gantt.$data && gantt.$data.tasksStore){
			res.selected_task = gantt.$data.tasksStore.getSelectedId();
		}
		return res;
	});
	gantt.getState = stateService.getState;
	(gantt.$services as any).setService("state", function () {
		return stateService;
	});

	utils.mixin(gantt, utils);

	gantt.Promise = Promise;
	gantt.env = env;

	datastoreHooks(gantt);
	taskActivity(gantt);

	gantt.dataProcessor = DataProcessor.DEPRECATED_api;
	gantt.createDataProcessor = DataProcessor.createDataProcessor;

	plugins(gantt);

	grid_column_api(gantt);
	tasks(gantt);
	parsing(gantt);
	work_time(gantt);
	data(gantt);

	void_script_second();

	data_task_types(gantt);
	cached_functions(gantt);

	gantt_core(gantt);
	destructor(gantt);
	void_script_third();

	const i18n = i18nFactory();
	gantt.i18n = {
		addLocale: i18n.addLocale,
		setLocale: function(locale: Parameters<GanttInternationalization["setLocale"]>[0]){
			if(typeof locale === "string"){
				let localeObject = i18n.getLocale(locale);
				if(!localeObject){
					localeObject = i18n.getLocale("en");
				}

				gantt.locale = localeObject;
			}else if(locale){
				if(!gantt.locale){
					gantt.locale = locale;
				}else{
					const localeConfig = locale as Record<string, any>;
					const ganttLocale = gantt.locale as unknown as Record<string, any>;
					for(const i in localeConfig){
						if(localeConfig[i] && typeof localeConfig[i] === "object"){
							if(!ganttLocale[i]){
								ganttLocale[i] = {};
							}

							gantt.mixin(ganttLocale[i], localeConfig[i], true);
						}else{
							ganttLocale[i] = localeConfig[i];
						}
					}
				}
			}
			const labels = gantt.locale.labels;
			labels.gantt_save_btn = labels.gantt_save_btn || labels.icon_save;
			labels.gantt_cancel_btn = labels.gantt_cancel_btn || labels.icon_cancel;
			labels.gantt_delete_btn = labels.gantt_delete_btn || labels.icon_delete;
		},
		getLocale: i18n.getLocale
	};
	gantt.i18n.setLocale("en");
	return gantt;
}
