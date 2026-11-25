import "../css/dhtmlxgantt.less";

import factory from "./make_instance_common";
import type { GanttInstance } from "./make_instance_common";
import ui from "../core/ui_core";
import ajaxLoading from "../core/loading/ajax_loading";
import dynamicLoading from "../core/loading/dynamic_loading";

import type { GanttPlugin } from "../types/gantt_types";
export default function(supportedExtensions: { [key: string]: GanttPlugin }): GanttInstance {
	const gantt = factory(supportedExtensions);

	if(!gantt.env.isNode){
		ui(gantt);
		ajaxLoading(gantt);
		dynamicLoading(gantt);
	}

	return gantt;
}
