/*
 %d - the day as a number with a leading zero ( 01 to 31 );
 %j - the day as a number without a leading zero ( 1 to 31 );
 %D - the day as an abbreviation ( Sun to Sat );
 %l - the day as a full name ( Sunday to Saturday );
 %W - the ISO-8601 week number of the year. Weeks start on Monday; 1)
 %m - the month as a number without a leading zero ( 1 to 12 );
 %n - the month as a number with a leading zero ( 01 to 12);
 %M - the month as an abbreviation ( Jan to Dec );
 %F - the month as a full name ( January to December );
 %y - the year as a two-digit number ( 00 to 99 );
 %Y - the year as a four-digit number ( 1900–9999 );
 %h - the hour based on the 12-hour clock ( 00 to 11 );
 %H - the hour based on the 24-hour clock ( 00 to 23 );
 %i - the minute as a number with a leading zero ( 00 to 59 );
 %s - the second as a number without a leading zero ( 00 to 59 ); 2)
 %a - displays am (for times from midnight until noon) and pm (for times from noon until midnight);
 %A - displays AM (for times from midnight until noon) and PM (for times from noon until midnight).
*/

import dateParsers from "./date_parsers";
import type { DateHelpers } from "./../../types/gantt_types";

export default function(gantt: any): DateHelpers {
	const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

	function parseISODate(dateStr: string): Date | null {
		const hasTime = dateStr.indexOf("T") !== -1;

		if (!hasTime && !gantt.config.server_utc) {
			// "2025-01-15" date-only, local context:
			// new Date("2025-01-15") treats as UTC midnight → wrong in negative-offset TZs
			// Parse manually as local midnight instead
			const parts = dateStr.split("-");
			return new Date(
				parseInt(parts[0], 10),
				parseInt(parts[1], 10) - 1,
				parseInt(parts[2], 10)
			);
		}

		const d = new Date(dateStr);
		if (isNaN(d.getTime())) {
			return null; // invalid → fall through to standard parser
		}

		if (gantt.config.server_utc) {
			// shift UTC components
			// into local getters so .getHours() etc. return UTC values
			return gantt.date.convert_to_utc(d);
		}

		return d;
	}

	const dateHelper = {
		_isoDateOnly: false,
		_nonIsoStringDetected: false,
		formatISODate(date: Date): string {
			return date.toISOString();
		},
		formatISODateOnly(date: Date): string {
			return date.getFullYear() + "-" +
				gantt.date.to_fixed(date.getMonth() + 1) + "-" +
				gantt.date.to_fixed(date.getDate());
		},
		init() {
			const locale = gantt.locale;

			const shortNames = locale.date.month_short;
			const shortHash: any = locale.date.month_short_hash = {};
			for (let i = 0; i < shortNames.length; i++) {
				shortHash[shortNames[i]] = i;
			}

			const fullNames = locale.date.month_full;
			const fullHash: any = locale.date.month_full_hash = {};
			for (let i = 0; i < fullNames.length; i++) {
				fullHash[fullNames[i]] = i;
			}
		},
		date_part(date: Date): Date {
			const old = new Date(date);
			let result = new Date(date);
			result.setHours(0);
			result = this.hour_start(result);
			if (result.getHours() && //shift to yesterday on dst
				(result.getDate() < old.getDate() || result.getMonth() < old.getMonth() || result.getFullYear() < old.getFullYear())) {
				result.setTime(result.getTime() + 60 * 60 * 1000 * (24 - result.getHours()));
			}
			return result;
		},
		time_part(date: Date): number {
			return (date.valueOf() / 1000 - date.getTimezoneOffset() * 60) % 86400;
		},
		week_start(date: Date): Date {
			let shift = date.getDay();
			if (gantt.config.start_on_monday) {
				if (shift === 0) {
					shift = 6;
				} else {
					shift--;
				}
			}
			return this.date_part(this.add(date, -1 * shift, "day"));
		},
		month_start(date: Date): Date {
			const result = new Date(date);
			result.setDate(1);
			return this.date_part(result);
		},
		quarter_start(date: Date): Date {
			const result = this.month_start(date);
			const m = result.getMonth();
			let res_month;

			if (m >= 9) {
				res_month = 9;
			} else if (m >= 6) {
				res_month = 6;
			} else if (m >= 3) {
				res_month = 3;
			} else {
				res_month = 0;
			}

			result.setMonth(res_month);
			return result;
		},
		year_start(date: Date): Date {
			const result = new Date(date);
			result.setMonth(0);
			return this.month_start(result);
		},
		day_start(date: Date): Date {
			return this.date_part(date);
		},
		hour_start(date: Date): Date {
			const result = new Date(date);
			if (result.getMinutes()) {
				result.setMinutes(0);
			}
			return this.minute_start(result);
		},
		minute_start(date: Date): Date {
			const result = new Date(date);
			if (result.getSeconds()) {
				result.setSeconds(0);
			}
			if (result.getMilliseconds()) {
				result.setMilliseconds(0);
			}
			return result;
		},
		_add_days(modifiedDate: Date, inc: number, originalDate: Date): Date {

			modifiedDate.setDate(modifiedDate.getDate() + inc);
			const incCondition = inc >= 0;
			const getHoursCondition = !originalDate.getHours() && modifiedDate.getHours(); //shift to yesterday on dst
			const getDateCondition = (modifiedDate.getDate() <= originalDate.getDate() || modifiedDate.getMonth() < originalDate.getMonth() || modifiedDate.getFullYear() < originalDate.getFullYear());
			if (incCondition && getHoursCondition && getDateCondition) {
				modifiedDate.setTime(modifiedDate.getTime() + 60 * 60 * 1000 * (24 - modifiedDate.getHours()));
			}
			const worktimeCalculation = inc > 1;
			if (worktimeCalculation && getHoursCondition) {
				// try to shift the modified Date to 00:00
				modifiedDate.setHours(0);
			}
			return modifiedDate;
		},

		add(date: Date, inc: number, mode: string): Date {
			let ndate = new Date(date.valueOf());
			switch (mode) {
				case "day":
					ndate = this._add_days(ndate, inc, date);
					break;
				case "week":
					ndate = this._add_days(ndate, inc * 7, date);
					break;
				case "month":
					ndate.setMonth(ndate.getMonth() + inc);
					break;
				case "year":
					// setYear (Annex B) keeps the historical behavior for two-digit years
					(ndate as any).setYear(ndate.getFullYear() + inc);
					break;
				case "hour":
					/*
						adding hours/minutes via setHour(getHour() + inc) gives weird result when
						adding one hour to the time before switch to a Daylight Saving time

						example: //Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)
						new Date(2014, 02, 30, 1).setHours(2)
						>>Sun Mar 30 2014 01:00:00 GMT+0100 (W. Europe Standard Time)

						setTime seems working as expected
					 */
					ndate.setTime(ndate.getTime() + inc * 60 * 60 * 1000);
					break;
				case "minute":
					ndate.setTime(ndate.getTime() + inc * 60 * 1000);
					break;
				default:
					return (this as any)["add_" + mode](date, inc, mode);
			}
			return ndate;
		},
		add_quarter(date: Date, inc: number): Date {
			return this.add(date, inc * 3, "month");
		},

		to_fixed(num: number): string {
			if (num < 10) {
				return "0" + num;
			}
			return "" + num;
		},
		copy(date: Date): Date {
			return new Date(date.valueOf());
		},
		date_to_str(format: string, utc?: boolean) {
			return dateParsers.date_to_str(format, !!utc, gantt);
		},
		str_to_date(format: string, utc?: boolean) {
			return dateParsers.str_to_date(format, !!utc, gantt);
		},
		getISOWeek(ndate: Date): number {
			return gantt.date._getWeekNumber(ndate, true);
		},
		_getWeekNumber(ndate: Date, isoWeek: boolean): number | false {
			if (!ndate) {
				return false;
			}
			let nday = ndate.getDay();
			if (isoWeek) {
				if (nday === 0) {
					nday = 7;
				}
			}
			const first_thursday = new Date(ndate.valueOf());
			first_thursday.setDate(ndate.getDate() + (4 - nday));
			const year_number = first_thursday.getFullYear(); // year of the first Thursday
			const ordinal_date = Math.round((first_thursday.getTime() - new Date(year_number, 0, 1).getTime()) / 86400000); //ordinal date of the first Thursday - 1 (so not really ordinal date)
			const week_number = 1 + Math.floor(ordinal_date / 7);
			return week_number;
		},

		getWeek(ndate: Date): number {
			return gantt.date._getWeekNumber(ndate, gantt.config.start_on_monday);
		},
		getUTCISOWeek(ndate: Date): number {
			return gantt.date.getISOWeek(ndate);
		},
		convert_to_utc(date: Date): Date {
			return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		},
		parseDate(date: any, format?: any): any {
			// raw date may be of type string, number (timestamp) or something else
			// do not check for instanceof Date explicitly, since we may swap native date with different date implementation at some point
			if (date && !date.getFullYear) {
				// Determine if this call would resolve to the parse_date template
				const wouldUseTemplate = !format || format === "parse_date" || format === "xml_date";

				// Check if user explicitly overrode the template
				const userOverrodeParseDate = wouldUseTemplate && (
					gantt.defined(gantt.templates.xml_date) ||
					(gantt.templates.parse_date && !gantt.templates.parse_date._ganttAuto)
				);

				// ISO auto-detection: skip if user explicitly controls parsing
				if (!userOverrodeParseDate) {
					// auto-detect ISO 8601 strings (e.g. "2025-01-15", "2025-01-15T10:30:00.000Z")
					if (typeof date === "string" && isoDateRegex.test(date)) {
						const hasTime = date.indexOf("T") !== -1;
						const isoResult = parseISODate(date);
						if (isoResult) {
							if (!hasTime && !dateHelper._isoDateOnly) {
								dateHelper._isoDateOnly = true;
							} else if (hasTime) {
								dateHelper._isoDateOnly = false;
							}
							return isoResult;
						}
					} else if (typeof date === "string") {
						// Non-ISO string going through default parser — legacy format in use
						dateHelper._nonIsoStringDetected = true;
					}
				} else if (typeof date === "string") {
					// User overrode parse_date — treat string input as non-ISO to preserve legacy serialization
					dateHelper._nonIsoStringDetected = true;
				}

				if (typeof(format) !== "function") {
					if (typeof(format) === "string") {
						if (format === "parse_date" || format === "xml_date") {
							format = gantt.defined(gantt.templates.xml_date) ? gantt.templates.xml_date : gantt.templates.parse_date;
						} else {
							format = gantt.defined(gantt.templates[format]) ? gantt.templates[format] : gantt.date.str_to_date(format);
						}
					} else {
						format = gantt.defined(gantt.templates.xml_date) ? gantt.templates.xml_date : gantt.templates.parse_date;
					}
				}
				if (date) {
					date = format(date);
				} else {
					date = null;
				}
			}
			return date;
		}
	};
	return dateHelper;
}
