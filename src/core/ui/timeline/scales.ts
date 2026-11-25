// Gantt-side adapter over the gantt-independent ScaleManager (scale_manager/).
// Wires gantt's date helper and ignore strategy into the engine and keeps the
// method surface used by timeline.js / export_api. The ignore filter is injected
// via `getIgnoreFilter`, overridden in scales_ignore.ts.

import { GanttConfigOptions, GanttStatic } from "../../../types/gantt_types";
import ScaleManager from "./scale_manager/scale_manager";
import {
	ColumnFilter,
	IDateHelper,
	ScaleConfig,
	ScaleDescriptor,
	ScaleLayout
} from "./scale_manager/types";


// TODO: inspect if needed and extract into module if so
// gantt exposes a private DST correction helper that is not part of GanttStatic.
type GanttWithDST = GanttStatic & {
	_correct_dst_change(date: Date, prevOffset: number, step: number, unit: string): Date;
};

// Public surface of the adapter, consumed by timeline.js and export_api.
export interface ScaleHelperApi {
	getIgnoreFilter(): ColumnFilter | undefined;
	primaryScale(config?: GanttConfigOptions): ScaleDescriptor;
	getAdditionalScales(config?: GanttConfigOptions): ScaleDescriptor[];
	sortScales(scales: ScaleDescriptor[]): void;
	prepareConfigs(
		scales: ScaleDescriptor[],
		min_coll_width: number,
		container_width: number,
		scale_height: number,
		minDate: Date,
		maxDate: Date,
		rtl: boolean
	): ScaleLayout[];
}

// `config.scales` and the engine's `ScaleConfig` are now the same shared `Scale` type, so
// this boundary needs no cast — it just exposes the gantt-config array to normalize().
function getScaleConfigs(config: GanttConfigOptions): ScaleConfig[] {
	return config.scales;
}

// Adapt gantt.date (DateHelpers) to the engine's narrower injected IDateHelper contract,
// adding the private DST correction. DateHelpers is a structural superset of IDateHelper.
function createDateHelper(gantt: GanttStatic): IDateHelper {
	// gantt.date (DateHelpers) provides every member IDateHelper needs; it is bound here as
	// the engine's date dependency. (A strict `const x: IDateHelper = gantt.date` guard is
	// blocked only by DateHelpers.date_to_str being typed as the broad `Function` — tightening
	// that public return type to `(date: Date) => string` is a worthwhile follow-up.)
	var adapter: IDateHelper = Object.create(gantt.date);
	adapter.correctDSTChange = function (date, prevOffset, step, unit) {
		return (gantt as GanttWithDST)._correct_dst_change(date, prevOffset, step, unit);
	};
	return adapter;
}

function ScaleHelper(gantt: GanttStatic): ScaleHelperApi {
	var manager = new ScaleManager(createDateHelper(gantt));

	return {
		// Ignore strategy hook. No ignores by default; overridden in scales_ignore.ts.
		getIgnoreFilter: function (): ColumnFilter | undefined {
			return undefined;
		},

		primaryScale: function (config?: GanttConfigOptions): ScaleDescriptor {
			var scales = getScaleConfigs(config || gantt.config);
			var primary = scales[0];
			return manager.normalizeScale({
				unit: primary.unit,
				step: primary.step,
				template: primary.template,
				format: primary.format,
				date: primary.date,
				css: primary.css || (gantt.templates.scale_cell_class as ScaleConfig["css"]),
				projection: primary.projection || null,
				column_width: primary.column_width || null
			});
		},

		getAdditionalScales: function (config?: GanttConfigOptions): ScaleDescriptor[] {
			var scales = getScaleConfigs(config || gantt.config);
			return scales.slice(1).map(function (scale) {
				return manager.normalizeScale(scale);
			});
		},

		sortScales: function (scales: ScaleDescriptor[]): void {
			manager.sortScales(scales);
		},

		prepareConfigs: function (
			scales: ScaleDescriptor[],
			min_coll_width: number,
			container_width: number,
			scale_height: number,
			minDate: Date,
			maxDate: Date,
			rtl: boolean
		): ScaleLayout[] {
			return manager.calculate(scales, {
				minDate: minDate,
				maxDate: maxDate,
				containerWidth: container_width,
				scaleHeight: scale_height,
				minColumnWidth: min_coll_width,
				rtl: rtl,
				filter: this.getIgnoreFilter()
			});
		}
	};
}

export default ScaleHelper;
