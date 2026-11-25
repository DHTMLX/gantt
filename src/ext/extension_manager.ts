import type { GanttPlugin } from "../types/gantt_types";

export default class ExtensionsManager{
	private _extensions:{[key:string]: GanttPlugin } | undefined;

	constructor(config: {[key:string]: GanttPlugin } | undefined){
		this._extensions = {};
		for(const i in config){
			this._extensions[i] = config[i];
		}
	}

	addExtension = (name: string, ext: GanttPlugin) => {
		if (this._extensions) {
			this._extensions[name] = ext;
		}
	};

	getExtension = (name: string): GanttPlugin | undefined => {
		return this._extensions && this._extensions[name];
	};
}