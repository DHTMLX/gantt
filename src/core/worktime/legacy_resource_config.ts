export default {
	isLegacyResourceCalendarFormat: function(resourceCalendarsProperty: Record<string, any> | undefined): boolean {
		// modern format:
		//gantt.config.resource_calendars = {
		//	resourceId: calendarId,
		//	resourceId: calendarId,
		//	resourceId: calendarId
		//	};
		
		// legacy format:
		// gantt.config.resource_calendars = {
		//	"resourceProperty": {
		//		resourceId: calendarId,
		//		resourceId: calendarId,
		//		resourceId: calendarId
		//		}
		//	};

		if(!resourceCalendarsProperty){
			return false;
		}
		for(var i in resourceCalendarsProperty){
			if(resourceCalendarsProperty[i] && typeof resourceCalendarsProperty[i] === "object"){
				return true;
			}
		}

		return false;
	},
	getResourceProperty: function(config: Record<string, any>): string {
		var resourceCalendarsConfig = config.resource_calendars;
		var propertyName = config.resource_property;
		if(this.isLegacyResourceCalendarFormat(resourceCalendarsConfig)){
			for(const i in resourceCalendarsConfig){
				propertyName = i;
				break;
			}
		}
		return propertyName;
	},
	getCalendarIdFromLegacyConfig: function(task: Record<string, any>, config: Record<string, any> | undefined): string | number | null {
		if (config) {
			for (var field in config) {
				var resource = config[field];
				if (task[field]) {
					var calendarId = resource[task[field]];
					if (calendarId) {
						return calendarId;
					}
				}
			}
		}
		return null;
	}
};
