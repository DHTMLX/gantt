// No-op dynamic-resource-calendars factory for the MIT edition. Resource
// calendars are a Pro feature (resources are excluded here), so there are no
// multiple-resource assignments whose calendars need merging. CalendarManager
// still constructs this factory; the drop-in returns null so getCalendar()
// falls through to the no-calendar path instead of building a merged one.
export default function() {
	return {
		getCalendarIdFromMultipleResources: function(resourceAssignments?: any[], manager?: any): string | number | null {
			return null;
		}
	};
}
