// Injects gantt's work-time / ignore strategy by overriding the adapter's
// `getIgnoreFilter` hook with a ColumnFilter (false => ignore column), reproducing
// the legacy rule: ignored = gantt.ignore_time(date) || skip_off_time non-working.

import { GanttStatic } from "../../../types/gantt_types";
import ScaleHelper, { ScaleHelperApi } from "./scales";
import { ColumnFilter, ScaleDescriptor } from "./scale_manager/types";

function ScaleIgnoreHelper(gantt: GanttStatic): ScaleHelperApi {
	var helper = ScaleHelper(gantt);

	helper.getIgnoreFilter = function (): ColumnFilter | undefined {
		if (!gantt.ignore_time && !gantt.config.skip_off_time) {
			return undefined;
		}

		var ignore = gantt.ignore_time || function () {
			return false;
		};

		function ignoreTimeConfig(date: Date, scale: ScaleDescriptor): boolean {
			if (!gantt.config.skip_off_time) {
				return false;
			}
			var skip = true;
			var probe = date;

			// check dates in case custom scale unit, e.g. {unit: "month", step: 3}
			for (var i = 0; i < scale.step; i++) {
				if (i) {
					probe = gantt.date.add(date, i, scale.unit);
				}
				skip = skip && !gantt.isWorkTime(probe, scale.unit);
			}
			return skip;
		}

		return function (date: Date, scale: ScaleDescriptor): boolean {
			var ignored = ignore.call(gantt, date) || ignoreTimeConfig(date, scale);
			return !ignored;
		};
	};

	return helper;
}

export default ScaleIgnoreHelper;
