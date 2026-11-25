import type { IDurationFormatter, IDurationFormatterConfig } from "../../types.d.ts";

export default class DurationFormatterNumeric implements IDurationFormatter {
	static create = (settings: IDurationFormatterConfig | null = null): IDurationFormatter => {
		return new DurationFormatterNumeric();
	};
	canParse = (value: string) : boolean => {
		return !isNaN(this.parse(value));
	};
	format = (value: number) : string => {
		return String(value);
	};
	parse = (value: string) : number => {
		return parseInt(value, 10);
	};
}