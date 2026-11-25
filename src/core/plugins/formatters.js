
import DurationFormatter from "../common/duration_formatter";
import LinkFormatter from "../common/link_formatter";

export default function(gantt){
	let defaultDurationFormatter = null;
	let defaultDurationFormatterUnit = null;
	let defaultLinkFormatter = null;

	function getDefaultDurationFormatter(){
		if(!defaultDurationFormatter || defaultDurationFormatterUnit !== gantt.config.duration_unit){
			defaultDurationFormatter = DurationFormatter.create({
				store: gantt.config.duration_unit,
				enter: gantt.config.duration_unit
			});
			defaultDurationFormatterUnit = gantt.config.duration_unit;
			defaultLinkFormatter = null;
		}
		return defaultDurationFormatter;
	}

	function getDefaultLinkFormatter(){
		getDefaultDurationFormatter();
		if(!defaultLinkFormatter){
			defaultLinkFormatter = LinkFormatter.create(null, gantt);
		}
		return defaultLinkFormatter;
	}

	gantt.ext.formatters = {
		durationFormatter: function(settings){
			if(!settings){
				return getDefaultDurationFormatter();
			}
			if(!settings.store){
				settings.store = gantt.config.duration_unit;
			}
			if(!settings.enter){
				settings.enter = gantt.config.duration_unit;
			}
			return DurationFormatter.create(settings, gantt);
		},
		linkFormatter: function(settings){
			if(!settings){
				return getDefaultLinkFormatter();
			}
			return LinkFormatter.create(settings, gantt);
		}
	};
};