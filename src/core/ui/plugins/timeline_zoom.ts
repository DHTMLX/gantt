import env from "../../../utils/env";
import eventable from "../../../utils/eventable";
import { TModifierKeys } from "../../common/config";
import type { Scale, TimeUnit } from "../../common/scale_types";
import { getLevelingDelayRange } from "../../common/leveling_delay";

type TZoomLevelReference = number | string;
type TZoomToFitScope = "visible" | "all";
type TZoomToFitRangeMode = "auto" | "preserve" | "target";

interface IZoomToFitRange {
	start_date: Date;
	end_date: Date;
}

interface IZoomToFitOptions {
	scope?: TZoomToFitScope;
	taskId?: string | number;
	range?: IZoomToFitRange;
	rangeMode?: TZoomToFitRangeMode;
	padding?: number;
	minLevel?: TZoomLevelReference;
	maxLevel?: TZoomLevelReference;
}

interface IZoomToFitContext {
	range: IZoomToFitRange;
	viewportWidth: number;
	levels: IZoomLevel[];
	padding: number;
	defaultLevel: number;
}

type TZoomToFitHandler = (context: IZoomToFitContext) => string | number | boolean | void;

// configuration of the "zoom to fit" behaviour, set via TimelineZoom.init({ fit })
interface IZoomToFitConfig extends IZoomToFitOptions {
	// optional, a dedicated set of zoom levels used only for "zoom to fit";
	// defaults to the interactive zoom levels when not specified
	levels?: IZoomLevel[] | Scale[][];
	// optional, fully overrides the level selection logic
	handler?: TZoomToFitHandler;
}

interface IZoomSavedState {
	levelIndex: number;
	scales: Scale[] | undefined;
	scale_height: number | undefined;
	min_column_width: number | undefined;
	start_date: Date | undefined;
	end_date: Date | undefined;
	scroll: { x: number; y: number } | null;
}

interface ITimelineZoomConfig {
	handler?: (e: Event) => {};
	startDate?: Date;
	endDate?: Date;
	levels?: IZoomLevel[];
	activeLevelIndex?: number;
	widthStep?: number;
	minColumnWidth?: number;
	maxColumnWidth?: number;
	useKey?: "ctrlKey" | "altKey" | "shiftKey";
	trigger?: "wheel" | null | undefined;
	element?: Element | (() => Element);
	fit?: IZoomToFitConfig;
}

const USE_KEY = ["ctrlKey", "altKey", "shiftKey", "metaKey"];
const FIXED_UNITS = {
	week: 1000 * 60 * 60 * 24 * 7,
	day: 1000 * 60 * 60 * 24,
	hour: 1000 * 60 * 60,
	minute: 1000 * 60
};
const SCALE_ORDER: Record<TimeUnit, number> = {
	minute: 0,
	hour: 1,
	day: 2,
	week: 3,
	month: 4,
	quarter: 5,
	year: 6
};

interface IZoomLevel {
	name?: string;
	label?: string;
	scale_height?: number;
	min_column_width?: number;
	scales: Scale[];
}

interface IResolvedLevelRange {
	minIndex: number;
	maxIndex: number;
}

interface IScaleColumnConfig {
	unit: TimeUnit;
	step: number;
}

interface IRangeBuffer {
	start_date: Date | null;
	end_date: Date | null;
}

const _defaultScales = [
	{
		name: "hour",
		scale_height: 35,
		scales: [
			{ unit: "day", step: 1, date: "%d %M" },
			{ unit: "hour", step: 1, date: "%H:%i" }
		]
	},
	{
		name: "day",
		scale_height: 35,
		scales: [
			{ unit: "day", step: 1, date: "%d %M" }
		]
	},
	{
		name: "week",
		scale_height: 70,
		scales: [
			{ unit: "month", step: 1, date: "%F, %Y" },
			{ unit: "week", step: 1, date: "Week %W" }
		]
	},
	{
		name: "month",
		scale_height: 70,
		scales: [
			{ unit: "year", step: 1, date: "%Y" },
			{ unit: "month", step: 1, date: "%M" }
		]
	},
	{
		name: "year",
		scale_height: 70,
		scales: [
			{ unit: "year", step: 1, date: "%Y" }
		]
	}
];

export default class TimelineZoom {
	public attachEvent: (eventName: string, handler: () => void) => string;
	public callEvent: (eventName: string, args: any[]) => any;
	public detachEvent: (eventName: string) => any;
	protected _initialStartDate: Date;
	protected _initialEndDate: Date;
	protected _activeLevelIndex: number;
	protected _levels: IZoomLevel[];
	protected _handler: (e: any) => void;
	protected $gantt;
	protected _widthStep: number | undefined;
	protected _minColumnWidth: number;
	protected _maxColumnWidth: number;
	protected _fitOptions: IZoomToFitOptions;
	protected _fitLevels: IZoomLevel[] | null;
	protected _fitHandler: TZoomToFitHandler | null;
	protected _savedState: IZoomSavedState | null;
	protected _inFitMode: boolean;
	protected _hasConfiguredMinColumnWidth: boolean;
	protected _useKey: TModifierKeys;
	protected _visibleDate: Date;
	protected _initialized: boolean;
	protected _domEvents: any;

	constructor(gantt) {
		this.$gantt = gantt;
		this._domEvents = this.$gantt._createDomEventScope();
	}

	public init(config: ITimelineZoomConfig = {}) {
		// GS-1354 and GS-1318. If we check the headless mode using the function,
		// it will return false when Gantt is not initialized, but we may want to do it later
		if(this.$gantt.env.isNode){
			return;
		}
		this._initialStartDate = config.startDate;
		this._initialEndDate = config.endDate;
		this._activeLevelIndex = config.activeLevelIndex ? config.activeLevelIndex : 0;
		this._levels = this._mapScales(config.levels || _defaultScales);
		this._handler = config.handler || this._defaultHandler;
		this._hasConfiguredMinColumnWidth = config.minColumnWidth !== undefined;
		this._minColumnWidth = config.minColumnWidth !== undefined ? config.minColumnWidth : 60;
		this._maxColumnWidth = config.maxColumnWidth !== undefined ? config.maxColumnWidth : 240;
		this._widthStep = config.widthStep !== undefined ? config.widthStep : (config.minColumnWidth !== undefined ? 3 / 8 * config.minColumnWidth : undefined);
		const fitConfig: any = config.fit || {};
		this._fitHandler = typeof fitConfig.handler === "function" ? fitConfig.handler : null;
		this._fitLevels = fitConfig.levels ? this._mapScales(fitConfig.levels) : null;
		const fitOptions: any = {};
		for (const key in fitConfig) {
			if (key !== "handler" && key !== "levels") {
				fitOptions[key] = fitConfig[key];
			}
		}
		this._fitOptions = this.$gantt.copy(fitOptions);
		this._savedState = null;
		this._inFitMode = false;
		this._useKey = config.useKey;

		if(!this._initialized){
			eventable(this);
			this.$gantt.attachEvent("onGanttScroll", () => {
				this._getVisibleDate();
			});
		}

		this._domEvents.detachAll();

		if(config.trigger === "wheel"){
			if(this.$gantt.$root){
				this._attachWheelEvent(config);
			}else{
				// GS-1322. This way the handler works for the init and resetLayout methods
				this.$gantt.attachEvent("onGanttLayoutReady", () => {
					this.$gantt.attachEvent("onGanttRender", () => {
						this._attachWheelEvent(config);
					}, {once: true});
				});
			}
		}

		this._initialized = true;
		this.setLevel(this._activeLevelIndex);
	}

	public zoomIn = () => {
		const index = this.getCurrentLevel() - 1;
		if(index < 0){
			return;
		}
		this.setLevel(index);
	};

	public zoomOut = () => {
		const index = this.getCurrentLevel() + 1;
		if(index > this._levels.length - 1){
			return;
		}
		this.setLevel(index);
	};

	public getCurrentLevel = () => {
		return this._activeLevelIndex;
	};

	public getLevels = () => {
		return this._levels;
	};

	public setLevel = (level: number|string) => {
		const zoomLevel = this._getZoomIndexByName(level);

		if(zoomLevel === -1){
			this.$gantt.assert(zoomLevel !== -1, "Invalid zoom level for gantt.ext.zoom.setLevel. " + level + " is not an expected value.");
		}
		// a manual zoom change leaves "zoom to fit" mode, so the next fit captures a fresh baseline
		this._exitFitMode();
		this._setLevel(zoomLevel, 0);
	};

	public zoomToFit = (options: IZoomToFitOptions = {}) => {
		if (!this._initialized || !this._levels || !this._levels.length) {
			return false;
		}

		const gantt = this.$gantt;
		const fitOptions = Object.assign({}, this._fitOptions || {}, options || {});
		const viewportWidth = this._getViewPortWidth();
		if (!viewportWidth) {
			return false;
		}

		const targetRange = this._resolveZoomToFitRange(fitOptions);
		if (!targetRange) {
			return false;
		}

		// remember the scale that was active before the first fit, so repeated
		// zoomToFit() calls compute from the same baseline (and resetZoom() can restore it).
		// On a subsequent fit, silently rewind to that baseline before recomputing.
		if (this._inFitMode && this._savedState) {
			this._applyState(this._savedState, true);
		} else {
			this._savedState = this._captureState();
			this._inFitMode = true;
		}

		const levels = this._fitLevels && this._fitLevels.length ? this._fitLevels : this._levels;
		const useCustomLevels = levels !== this._levels;

		const levelRange = this._resolveZoomToFitLevels(fitOptions, levels);
		const rangeMode = this._resolveRangeMode(fitOptions.rangeMode);
		const padding = this._normalizeFitPadding(fitOptions.padding);
		let selectedLevel = levelRange.maxIndex;
		let hasScale = false;

		for (let i = levelRange.minIndex; i <= levelRange.maxIndex; i++) {
			const level = levels[i];
			const smallestScale = this._getSmallestScale(level);
			if (!smallestScale) {
				continue;
			}

			hasScale = true;
			const normalizedRange = this._normalizeRangeToScale(targetRange, smallestScale, padding);
			const columnCount = this._countColumns(normalizedRange.start_date, normalizedRange.end_date, smallestScale.unit, smallestScale.step);
			const columnWidth = this._getEffectiveColumnWidth(level);

			selectedLevel = i;

			if (columnCount * columnWidth <= viewportWidth) {
				break;
			}
		}

		if (!hasScale) {
			return this._abortFit();
		}

		// Let the user override the computed level (custom "zoom to fit" logic)
		if (this._fitHandler) {
			const overridden = this._resolveHandlerLevel(this._fitHandler, {
				range: targetRange,
				viewportWidth: viewportWidth,
				levels: levels,
				padding: padding,
				defaultLevel: selectedLevel
			}, levels);
			if (overridden === false) {
				return this._abortFit();
			}
			if (overridden !== null) {
				selectedLevel = overridden;
			}
		}

		const selectedZoomLevel = levels[selectedLevel];
		const smallestScale = this._getSmallestScale(selectedZoomLevel);
		if (!smallestScale) {
			return this._abortFit();
		}

		const appliedRange = this._normalizeRangeToScale(targetRange, smallestScale, padding);

		if (rangeMode === "target") {
			gantt.config.start_date = new Date(appliedRange.start_date);
			gantt.config.end_date = new Date(appliedRange.end_date);
			this._visibleDate = new Date((appliedRange.start_date.valueOf() + appliedRange.end_date.valueOf()) / 2);
		}

		if (selectedZoomLevel.min_column_width === undefined && this._hasConfiguredMinColumnWidth) {
			gantt.config.min_column_width = this._getEffectiveColumnWidth(selectedZoomLevel);
		}

		if (useCustomLevels) {
			// custom fit levels are independent from the interactive zoom levels,
			// so apply the scale config without moving the active interactive level
			this._applyLevelConfig(selectedZoomLevel);
		} else {
			this._setLevel(selectedLevel, 0);
		}
		return true;
	};

	public resetZoom = () => {
		if (!this._savedState) {
			return false;
		}
		this._applyState(this._savedState, false);
		this._savedState = null;
		this._inFitMode = false;
		return true;
	};

	// rolls back a fit that could not complete (no usable scale / handler aborted) to the baseline
	protected _abortFit = (): false => {
		if (this._savedState) {
			this._applyState(this._savedState, false);
		}
		this._exitFitMode();
		return false;
	};

	protected _getZoomIndexByName = (levelName: number|string, levels: IZoomLevel[] = this._levels) => {
		let zoomLevel:number = -1;
		if(typeof levelName === "string"){
			if(!isNaN(Number(levelName)) &&  levels[Number(levelName)]){
				zoomLevel = Number(levelName);
			}else{
				for(let i = 0; i < levels.length; i++){
					if(levels[i].name === levelName){
						zoomLevel = i;
						break;
					}
				}
			}
		}else{
			zoomLevel = levelName;
		}
		return zoomLevel;
	};

	protected _mapScales(levels: Scale[][] | any): IZoomLevel[]{
		return levels.map((l) => {
			if(Array.isArray(l)){
				return {
					scales: l
				};
			}else{
				return l;
			}
		});
	}

	protected _resolveZoomToFitLevels = (options: IZoomToFitOptions, levels: IZoomLevel[] = this._levels): IResolvedLevelRange => {
		let minIndex = 0;
		let maxIndex = levels.length - 1;

		if (options.minLevel !== undefined) {
			minIndex = this._getZoomIndexByName(options.minLevel, levels);
			this.$gantt.assert(minIndex !== -1, "Invalid zoom level for gantt.ext.zoom.zoomToFit minLevel. " + options.minLevel + " is not an expected value.");
		}

		if (options.maxLevel !== undefined) {
			maxIndex = this._getZoomIndexByName(options.maxLevel, levels);
			this.$gantt.assert(maxIndex !== -1, "Invalid zoom level for gantt.ext.zoom.zoomToFit maxLevel. " + options.maxLevel + " is not an expected value.");
		}

		this.$gantt.assert(minIndex <= maxIndex, "Invalid zoom level range for gantt.ext.zoom.zoomToFit. minLevel must not be greater than maxLevel.");

		return {
			minIndex: minIndex,
			maxIndex: maxIndex
		};
	};

	// resolves the level returned by a user-supplied fit.handler:
	//   - false  → abort the fit (zoomToFit returns false)
	//   - a valid level name/index → use it
	//   - undefined/null/true/invalid → fall back to the computed level
	protected _resolveHandlerLevel = (handler: TZoomToFitHandler, context: IZoomToFitContext, levels: IZoomLevel[]): number | false | null => {
		let result;
		try {
			result = handler.call(this, context);
		} catch (e) {
			this.$gantt.assert(false, "gantt.ext.zoom fit.handler threw an error: " + e);
			return null;
		}

		if (result === false) {
			return false;
		}

		if (result === undefined || result === null || result === true) {
			return null;
		}

		const index = this._getZoomIndexByName(result as number | string, levels);
		if (index < 0 || index >= levels.length) {
			this.$gantt.assert(false, "Invalid zoom level returned by gantt.ext.zoom fit.handler. " + result + " is not an expected value.");
			return null;
		}
		return index;
	};

	protected _resolveZoomToFitRange = (options: IZoomToFitOptions): IZoomToFitRange | null => {
		if (options.range) {
			return this._normalizeExplicitRange(options.range);
		}

		if (options.taskId !== undefined) {
			return this._getBranchRange(options.taskId);
		}

		if (options.scope === "visible") {
			return this._getRangeFromTasks(this._getVisibleTasks());
		}

		// default ("all"): fit every loaded task, including tasks under collapsed branches
		return this._getRangeFromTasks(this.$gantt.getTaskByTime());
	};

	protected _normalizeExplicitRange = (range: IZoomToFitRange): IZoomToFitRange | null => {
		if (!range || !range.start_date || !range.end_date) {
			return null;
		}

		const start_date = new Date(range.start_date);
		const end_date = new Date(range.end_date);
		if (isNaN(start_date.valueOf()) || isNaN(end_date.valueOf())) {
			return null;
		}

		if (start_date.valueOf() > end_date.valueOf()) {
			this.$gantt.assert(false, "Invalid range for gantt.ext.zoom.zoomToFit. start_date must not be greater than end_date.");
			return null;
		}

		return {
			start_date: start_date,
			end_date: end_date
		};
	};

	protected _getBranchRange = (taskId: string | number): IZoomToFitRange | null => {
		if (!this.$gantt.isTaskExists(taskId)) {
			this.$gantt.assert(false, "Invalid task id for gantt.ext.zoom.zoomToFit. Task " + taskId + " does not exist.");
			return null;
		}

		const tasks = [this.$gantt.getTask(taskId)];
		this.$gantt.eachTask((task) => {
			tasks.push(task);
		}, taskId);

		return this._getRangeFromTasks(tasks);
	};

	protected _getVisibleTasks = () => {
		if (!this.$gantt.$data || !this.$gantt.$data.tasksStore) {
			return [];
		}
		return this.$gantt.$data.tasksStore.getVisibleItems();
	};

	protected _getRangeFromTasks = (tasks: any[]): IZoomToFitRange | null => {
		const range: IRangeBuffer = {
			start_date: null,
			end_date: null
		};

		for (let i = 0; i < tasks.length; i++) {
			this._extendRangeFromTask(range, tasks[i]);
		}

		if (!(range.start_date && range.end_date)) {
			return null;
		}

		for (let i = 0; i < tasks.length; i++) {
			this._extendRangeWithExtras(range, tasks[i]);
		}

		return {
			start_date: new Date(range.start_date),
			end_date: new Date(range.end_date)
		};
	};

	protected _extendRangeFromTask = (range: IRangeBuffer, task: any) => {
		const gantt = this.$gantt;
		const taskType = gantt.getTaskType(task.type);
		const isSummaryTask = taskType == gantt.config.types.project;
		const isScheduledSummary = (isSummaryTask && (task.auto_scheduling === false));
		if (gantt.isUnscheduledTask(task)) {
			return;
		}

		if (task.start_date && (isSummaryTask || !task.$no_start || isScheduledSummary) && (!range.start_date || task.start_date < range.start_date)) {
			range.start_date = new Date(task.start_date);
		}

		if (task.end_date && (isSummaryTask || !task.$no_end || isScheduledSummary) && (!range.end_date || task.end_date > range.end_date)) {
			range.end_date = new Date(task.end_date);
		}
	};

	protected _extendRangeWithExtras = (range: IRangeBuffer, task: any) => {
		const gantt = this.$gantt;
		if (!(range.start_date && range.end_date)) {
			return;
		}

		if (gantt.config.deadlines && task.deadline) {
			this._extendRangeForDates(range, task.deadline, task.deadline);
		}

		if (task.constraint_date && task.constraint_type) {
			if (gantt._getAutoSchedulingConfig().apply_constraints &&
				gantt.config.constraint_types &&
				task.constraint_type !== gantt.config.constraint_types.ASAP &&
				task.constraint_type !== gantt.config.constraint_types.ALAP) {
				this._extendRangeForDates(range, task.constraint_date, task.constraint_date);
			}
		}

		if (gantt.config.baselines && task.baselines) {
			task.baselines.forEach((baseline) => {
				this._extendRangeForDates(range, baseline.start_date, baseline.end_date);
			});
		}

		if (gantt.config.leveling_delays && task.leveling_delay) {
			const delayRange = getLevelingDelayRange(gantt, task);
			if (delayRange) {
				this._extendRangeForDates(range, delayRange.start_date, delayRange.end_date);
			}
		}

		if (task.$auto_start_date && task.$auto_end_date) {
			this._extendRangeForDates(range, task.$auto_start_date, task.$auto_end_date);
		}
	};

	protected _extendRangeForDates = (range: IRangeBuffer, start_date: Date, end_date: Date) => {
		if (!start_date || !end_date) {
			return;
		}

		if (!range.start_date || start_date < range.start_date) {
			range.start_date = new Date(start_date);
		}

		if (!range.end_date || end_date > range.end_date) {
			range.end_date = new Date(end_date);
		}
	};

	protected _normalizeFitPadding = (padding?: number) => {
		if (padding === undefined || isNaN(padding)) {
			return 1;
		}
		return Math.max(0, Math.floor(padding));
	};

	protected _resolveRangeMode = (rangeMode?: TZoomToFitRangeMode): Exclude<TZoomToFitRangeMode, "auto"> => {
		if (rangeMode === "preserve" || rangeMode === "target") {
			return rangeMode;
		}

		if (this.$gantt.config.start_date && this.$gantt.config.end_date) {
			return "preserve";
		}

		return "target";
	};

	protected _getSmallestScale = (level: IZoomLevel): IScaleColumnConfig | null => {
		if (!level || !level.scales || !level.scales.length) {
			return null;
		}

		let smallestScale: IScaleColumnConfig | null = null;
		level.scales.forEach((scale) => {
			const candidate = {
				unit: scale.unit as TimeUnit,
				step: scale.step || 1
			};

			if (!smallestScale) {
				smallestScale = candidate;
				return;
			}

			if (SCALE_ORDER[candidate.unit] < SCALE_ORDER[smallestScale.unit]) {
				smallestScale = candidate;
			} else if (candidate.unit === smallestScale.unit && candidate.step < smallestScale.step) {
				smallestScale = candidate;
			}
		});

		return smallestScale;
	};

	protected _normalizeRangeToScale = (range: IZoomToFitRange, scale: IScaleColumnConfig, padding: number): IZoomToFitRange => {
		const gantt = this.$gantt;
		const unitStartMethod = gantt.date[scale.unit + "_start"];
		const start_date = unitStartMethod.call(gantt.date, new Date(range.start_date));
		const end_date = unitStartMethod.call(gantt.date, new Date(range.end_date));

		return {
			start_date: gantt.calculateEndDate({
				start_date: start_date,
				duration: -padding,
				unit: scale.unit,
				step: scale.step
			}),
			end_date: gantt.calculateEndDate({
				start_date: end_date,
				duration: padding + 1,
				unit: scale.unit,
				step: scale.step
			})
		};
	};

	protected _countColumns = (from: Date, to: Date, unit: TimeUnit, step: number) => {
		if (FIXED_UNITS[unit]) {
			return Math.round((to.valueOf() - from.valueOf()) / (step * FIXED_UNITS[unit]));
		}

		let start = new Date(from);
		let columns = 0;
		while (start.valueOf() < to.valueOf()) {
			columns++;
			start = this.$gantt.date.add(start, step, unit);
		}
		return columns;
	};

	protected _getEffectiveColumnWidth = (level: IZoomLevel) => {
		if (level.min_column_width !== undefined) {
			return level.min_column_width;
		}

		if (this._hasConfiguredMinColumnWidth) {
			return this._minColumnWidth;
		}

		return this.$gantt.config.min_column_width;
	};

	protected _getVisibleDate = () => {
		// GS-1450. Don't try to get the visible date if there is no timeline
		if (!this.$gantt.$task){
			return null;
		}
		const scrollPos = this.$gantt.getScrollState().x;
		const viewPort = this.$gantt.$task.offsetWidth;
		this._visibleDate = this.$gantt.dateFromPos(scrollPos + viewPort/2);
	};

	protected _getViewPortWidth = () => {
		let viewPort = 0;
		const gantt = this.$gantt;
		const resourceViews = [
			"resourceTimeline",
			"resourceHistogram"
		];

		if (gantt.$task && gantt.$task.offsetWidth) {
			viewPort = gantt.$task.offsetWidth;
		} else {
			resourceViews.forEach(function(name){
				const resourceView = gantt.$ui.getView(name);
				if (resourceView && resourceView.$task && resourceView.$task.offsetWidth) {
					viewPort = resourceView.$task.offsetWidth;
				}
			});
		}

		return viewPort;
	};

	protected _setLevel = (level: number, cursorOffset: number) => {
		this._activeLevelIndex = level;
		this._applyChartConfig(this._levels[this._activeLevelIndex], cursorOffset);
	};

	// applies a fit-specific level (from fit.levels) without changing the active interactive level
	protected _applyLevelConfig = (levelConfig: IZoomLevel) => {
		this._applyChartConfig(levelConfig, 0);
	};

	protected _applyChartConfig = (levelConfig: IZoomLevel, cursorOffset: number) => {
		const gantt = this.$gantt;
		const nextConfig = gantt.copy(levelConfig);
		const chartConfig = gantt.copy(nextConfig);
		// identification/presentation fields of the level are not chart config
		delete chartConfig.name;
		delete chartConfig.label;

		gantt.mixin(gantt.config, chartConfig, true);

		this._syncResourceViews(chartConfig);
		// GS-2879, GS-2880: different cases for main timeline and resource views
		if(!!gantt.$root){
			if(cursorOffset){
				const cursorDate = gantt.dateFromPos(cursorOffset + gantt.getScrollState().x);
				gantt.render();
				const newPosition = gantt.posFromDate(cursorDate);
				gantt.scrollTo(newPosition - cursorOffset);
			}else{
				const viewPort = this._getViewPortWidth();
				if (!this._visibleDate) {
					this._getVisibleDate();
				}
				const middleDate = this._visibleDate;
				gantt.render();

				if(viewPort) {
					const newPosition = gantt.posFromDate(middleDate);
					gantt.scrollTo(newPosition - viewPort/2);
				}

			}

			this.callEvent("onAfterZoom", [this._activeLevelIndex, nextConfig]);
		}
	};

	// GS-1148: applies the scale config to the resource views (resourceTimeline/resourceHistogram)
	protected _syncResourceViews = (chartConfig: any) => {
		const gantt = this.$gantt;
		const resourceViews = [
			"resourceTimeline",
			"resourceHistogram"
		];

		resourceViews.forEach(function(name){
			const resourceView = gantt.$ui.getView(name);
			if (resourceView){
				const resourceConfig = resourceView.$getConfig();
				if (!resourceConfig.fixed_scales){
					gantt.mixin(resourceConfig, chartConfig, true);
				}
			}
		});
	};

	// discards the remembered pre-fit baseline so the next zoomToFit() captures a fresh one
	protected _exitFitMode = () => {
		this._inFitMode = false;
		this._savedState = null;
	};

	// snapshots the scale-related config so zoomToFit() can be idempotent and resetZoom() can restore it
	protected _captureState = (): IZoomSavedState => {
		const gantt = this.$gantt;
		const config = gantt.config;
		return {
			levelIndex: this._activeLevelIndex,
			scales: config.scales ? gantt.copy(config.scales) : undefined,
			scale_height: config.scale_height,
			min_column_width: config.min_column_width,
			start_date: config.start_date ? new Date(config.start_date.valueOf()) : undefined,
			end_date: config.end_date ? new Date(config.end_date.valueOf()) : undefined,
			scroll: gantt.$root ? gantt.getScrollState() : null
		};
	};

	// restores a captured state; silent=true rewinds config only (no render) for an in-place re-fit
	protected _applyState = (state: IZoomSavedState, silent: boolean) => {
		const gantt = this.$gantt;
		const config = gantt.config;

		if (state.scales !== undefined) {
			config.scales = gantt.copy(state.scales);
		}
		config.scale_height = state.scale_height;
		config.min_column_width = state.min_column_width;
		config.start_date = state.start_date ? new Date(state.start_date.valueOf()) : undefined;
		config.end_date = state.end_date ? new Date(state.end_date.valueOf()) : undefined;
		this._activeLevelIndex = state.levelIndex;

		if (silent) {
			return;
		}

		// keep the resource views in sync, mirroring the fit/zoom path (GS-1148)
		const restoredChart: any = {
			scale_height: state.scale_height,
			min_column_width: state.min_column_width
		};
		if (state.scales !== undefined) {
			restoredChart.scales = gantt.copy(state.scales);
		}
		this._syncResourceViews(restoredChart);

		if (gantt.$root) {
			gantt.render();
			if (state.scroll) {
				const scroll = state.scroll;
				setTimeout(function(){
					gantt.scrollTo(scroll.x, scroll.y);
				}, 4);
			}
			this.callEvent("onAfterZoom", [this._activeLevelIndex, gantt.copy(this._levels[this._activeLevelIndex])]);
		}
	};

	private _attachWheelEvent = (config) => {
		const event = env.isFF ? "wheel" : "mousewheel";
		let el: Element;
		if(typeof config.element === "function"){
			el = config.element();
		}else{
			el = config.element as Element;
		}
		if (!el){
			return;
		}

		this._domEvents.attach(el, event, this.$gantt.bind(function(e) {
			if (this._useKey) {
				if (USE_KEY.indexOf(this._useKey) < 0) {
					return false;
				}
				if (!e[this._useKey]) {
					return false;
				}
			}
			if (typeof this._handler === "function") {
				this._handler.apply(this, [e]);
				return true;
			}
		}, this), {passive: false});
	};

	private _defaultHandler = (e: any):void => {
		const timelineOffset = this.$gantt.$task.getBoundingClientRect().x;
		const cursorOffset = e.clientX - timelineOffset;
		const wheelY = this.$gantt.env.isFF ? (e.deltaY*-40) : e.wheelDelta;
		let wheelUp = false;
		if (wheelY > 0) {
			wheelUp = true;
		}
		e.preventDefault();
		e.stopPropagation();
		// a manual zoom change leaves "zoom to fit" mode, so the next fit captures a fresh baseline
		this._exitFitMode();
		this._setScaleSettings(wheelUp, cursorOffset);
	};

	private _setScaleSettings(wheelUp: boolean, cursorOffset: number) {
		if (wheelUp) {
			this._stepUp(cursorOffset);
		} else {
			this._stepDown(cursorOffset);
		}
	}

	private _setScaleDates = () => {
		if(this._initialStartDate && this._initialEndDate){
			this.$gantt.config.start_date = this._initialStartDate;
			this.$gantt.config.end_date = this._initialEndDate;
		}
	};

	private _stepUp(cursorOffset) {
		if (this._activeLevelIndex >= this._levels.length - 1) {
			return;
		}

		let nextLevel = this._activeLevelIndex;
		this._setScaleDates();

		if(this._widthStep){
			let newColumnWidth = this.$gantt.config.min_column_width + this._widthStep;
			if (newColumnWidth > this._maxColumnWidth) {
				newColumnWidth = this._minColumnWidth;
				nextLevel++;
			}

			this.$gantt.config.min_column_width = newColumnWidth;
		}else{
			nextLevel++;
		}
		this._setLevel(nextLevel, cursorOffset);
	}
	private _stepDown(cursorOffset) {
		if (this._activeLevelIndex < 1) {
			return;
		}

		let nextLevel = this._activeLevelIndex;
		this._setScaleDates();

		if(this._widthStep){
			let newColumnWidth = this.$gantt.config.min_column_width - this._widthStep;
			if (newColumnWidth < this._minColumnWidth) {
				newColumnWidth = this._maxColumnWidth;
				nextLevel--;
			}
			this.$gantt.config.min_column_width = newColumnWidth;
		}else{
			nextLevel--;
		}
		this._setLevel(nextLevel, cursorOffset);
	}
}
