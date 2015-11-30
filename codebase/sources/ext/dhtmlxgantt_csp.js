/*
@license

dhtmlxGantt v.4.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
/*
 Compatibility with Content Security Policy
 https://github.com/denys86/gantt/commit/f64f62f14086a8ec33d5667cfc5dc3a7e775fd2a

 Removes evil JS. Inline styles are still used for rendering, may need to allow them or redefine unsafe methods
 style-src 'unsafe-inline'

*/

gantt.date.date_to_str = function(format,utc){
	return function(date) {
		return format.replace(/%[a-zA-Z]/g, function (a) {
			switch (a) {
				case "%d": return utc ? gantt.date.to_fixed(date.getUTCDate()) : gantt.date.to_fixed(date.getDate());
				case "%m": return utc ? gantt.date.to_fixed((date.getUTCMonth() + 1)) : gantt.date.to_fixed((date.getMonth() + 1));
				case "%j": return utc ? date.getUTCDate() : date.getDate();
				case "%n": return utc ? (date.getUTCMonth() + 1) : (date.getMonth() + 1);
				case "%y": return utc ? gantt.date.to_fixed(date.getUTCFullYear() % 100) : gantt.date.to_fixed(date.getFullYear() % 100);
				case "%Y": return utc ? date.getUTCFullYear() : date.getFullYear();
				case "%D": return utc ? gantt.locale.date.day_short[date.getUTCDay()] : gantt.locale.date.day_short[date.getDay()];
				case "%l": return utc ? gantt.locale.date.day_full[date.getUTCDay()] : gantt.locale.date.day_full[date.getDay()];
				case "%M": return utc ? gantt.locale.date.month_short[date.getUTCMonth()] : gantt.locale.date.month_short[date.getMonth()];
				case "%F": return utc ? gantt.locale.date.month_full[date.getUTCMonth()] : gantt.locale.date.month_full[date.getMonth()];
				case "%h": return utc ? gantt.date.to_fixed((date.getUTCHours() + 11) % 12 + 1) : gantt.date.to_fixed((date.getHours() + 11) % 12 + 1);
				case "%g": return utc ? ((date.getUTCHours() + 11) % 12 + 1) : ((date.getHours() + 11) % 12 + 1);
				case "%G": return utc ? date.getUTCHours() : date.getHours();
				case "%H": return utc ? gantt.date.to_fixed(date.getUTCHours()) : gantt.date.to_fixed(date.getHours());
				case "%i": return utc ? gantt.date.to_fixed(date.getUTCMinutes()) : gantt.date.to_fixed(date.getMinutes());
				case "%a": return utc ? (date.getUTCHours() > 11 ? "pm" : "am") : (date.getHours() > 11 ? "pm" : "am");
				case "%A": return utc ? (date.getUTCHours() > 11 ? "PM" : "AM") : (date.getHours() > 11 ? "PM" : "AM");
				case "%s": return utc ? gantt.date.to_fixed(date.getUTCSeconds()) : gantt.date.to_fixed(date.getSeconds());
				case "%W": return utc ? gantt.date.to_fixed(gantt.date.getUTCISOWeek(date)) : gantt.date.to_fixed(gantt.date.getISOWeek(date));
				default: return a;
			}
		});
	};
};
gantt.date.str_to_date = function(format,utc){
	return function(date) {
		var set = [0, 0, 1, 0, 0, 0];
		var temp = date.match(/[a-zA-Z]+|[0-9]+/g);
		var mask = format.match(/%[a-zA-Z]/g);

		for (var i = 0; i < mask.length; i++) {
			switch (mask[i]) {
				case "%j":
				case "%d":
					set[2] = temp[i] || 1;
					break;
				case "%n":
				case "%m":
					set[1] = (temp[i] || 1) - 1;
					break;
				case "%y":
					set[0] = temp[i] * 1 + (temp[i] > 50 ? 1900 : 2000);
					break;
				case "%g":
				case "%G":
				case "%h":
				case "%H":
					set[3] = temp[i] || 0;
					break;
				case "%i":
					set[4] = temp[i] || 0;
					break;
				case "%Y":
					set[0] = temp[i] || 0;
					break;
				case "%a":
				case "%A":
					set[3] = set[3] % 12 + ((temp[i] || '').toLowerCase() == 'am' ? 0 : 12);
					break;
				case "%s":
					set[5] = temp[i] || 0;
					break;
				case "%M":
					set[1] = gantt.locale.date.month_short_hash[temp[i]] || 0;
					break;
				case "%F":
					set[1] = gantt.locale.date.month_full_hash[temp[i]] || 0;
					break;
				default:
					break;
			}
		}

		if (utc) {
			return new Date(Date.UTC(set[0], set[1], set[2], set[3], set[4], set[5]));
		}

		return new Date(set[0], set[1], set[2], set[3], set[4], set[5]);
	};
};
