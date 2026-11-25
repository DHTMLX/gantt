import type { IGanttLocale } from "../types.d.ts";

export default class LocaleManager{
	private _locales:{[key:string]: IGanttLocale };

	constructor(config: {[key:string]: IGanttLocale }){
		this._locales = {};
		for(const i in config){
			this._locales[i] = config[i];
		}
	}

	addLocale = (name: string, locale: IGanttLocale) => {
		this._locales[name] = locale;
	};

	getLocale = (name: string): IGanttLocale => {
		return this._locales[name];
	};
}