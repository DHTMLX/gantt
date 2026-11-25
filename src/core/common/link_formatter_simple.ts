import type { ILinkFormatter, ILinkFormatterConfig, LinkReference } from "../../types.d.ts";
import type { Link } from "../../types/gantt_types";

const REFERENCES: LinkReference[] = ["legacy", "outline", "row"];
// a row number is a plain positive integer: no leading zero, no dots
const ROW_NUMBER = /^[1-9][0-9]*$/;
// an outline number in the form getTaskByOutlineNumber reads: "1.2.3", not "01.2" or "1."
const OUTLINE_NUMBER = /^[1-9][0-9]*(\.[1-9][0-9]*)*$/;

function normalizeReference(value: unknown, gantt: any): LinkReference{
	if(value === undefined || value === null){
		return "legacy";
	}
	if(REFERENCES.indexOf(value as LinkReference) < 0){
		gantt.assert(false, `linkFormatter: unknown reference "${String(value)}", expected one of ${REFERENCES.join(", ")}`);
		return "legacy";
	}
	return value as LinkReference;
}

export default class LinkFormatterSimple implements ILinkFormatter {
	static create = (settings: ILinkFormatterConfig | null = null, gantt: any): LinkFormatterSimple => {
		return new LinkFormatterSimple(gantt, settings);
	};
	protected _linkReg: RegExp;
	protected _gantt: any;
	/** the reference domain of this formatter, for both output and parsing */
	protected _reference: LinkReference;

	constructor(gantt: any, settings: ILinkFormatterConfig | null = null) {
		this._linkReg = /^[0-9\.]+/;
		this._gantt = gantt;
		this._reference = normalizeReference(settings && settings.reference, gantt);
	}

	format = (link: Link) : string => {
		const wbs = this._getWBSCode(link.source);
		return wbs;
	};

	// "outline" and "row" take only text that this formatter reads in full, with a reference in the
	// domain's form (it may name no loaded task); "legacy" takes any text that starts with a reference
	canParse = (value: string) : boolean => {
		return this._hasReference(value) && (this._reference === "legacy" || this._isWellFormed(value));
	};
	parse = (value: string) : any => {
		if(!this.canParse(value)){
			return null;
		}

		const linkPart = this._linkReg.exec(value)![0].trim();

		const source = this._findSource(linkPart) || null;

		return {
			id: undefined,
			source,
			target: null,
			type: this._gantt.config.links.finish_to_start,
			lag: 0
		};
	};

	// the value starts with a reference, which in "outline" and "row" has the domain's form
	protected _hasReference = (value: string): boolean => {
		if(!this._linkReg.test(value)){
			return false;
		}
		if(this._reference === "legacy"){
			return true;
		}
		const reference = /^[0-9.]+/.exec(value)![0];
		const form = this._reference === "row" ? ROW_NUMBER : OUTLINE_NUMBER;
		return form.test(reference);
	};

	// this formatter reads no link type and no lag, so a well-formed value is the bare reference
	protected _isWellFormed = (value: string): boolean => {
		return value.trim() === this._linkReg.exec(value)![0].trim();
	};

	// the outline and row-number getters are a core plugin that the MIT build excludes
	// (sources/core/plugins/index.mit.js), so the domain degrades to "legacy" there
	// instead of throwing on every formatted link
	protected _useOutline = () => {
		if(typeof this._gantt.getOutlineNumber !== "function"){
			this._gantt.assert(false, `linkFormatter: reference "${this._reference}" requires the outline-number API, which is not bundled in this edition`);
			return false;
		}
		return true;
	};

	protected _getWBSCode = (source: number | string) => {
		const pred = this._gantt.getTask(source);
		if(this._reference === "outline" && this._useOutline()){
			return this._gantt.getOutlineNumber(pred);
		}
		if(this._reference === "row" && this._useOutline()){
			const rowNumber = this._gantt.getRowNumber(pred);
			return rowNumber ? String(rowNumber) : "";
		}
		if(this._gantt.getWBSCode){
			return this._gantt.getWBSCode(pred);
		}
		// the wbs plugin is not bundled in every edition - fall back to the task id
		return String(pred.id);
	};

	protected _findSource = (value: string) => {
		const reqTemplate = new RegExp("^[0-9\.]+", "i");
		if(reqTemplate.exec(value)){
			const wbs = reqTemplate.exec(value)![0];
			if(this._reference === "outline" && this._useOutline()){
				const task = this._gantt.getTaskByOutlineNumber(wbs);
				return task ? task.id : null;
			}
			if(this._reference === "row" && this._useOutline()){
				const task = ROW_NUMBER.test(wbs) ? this._gantt.getTaskByRowNumber(Number(wbs)) : null;
				return task ? task.id : null;
			}
			if(this._gantt.getTaskByWBSCode){
				const task = this._gantt.getTaskByWBSCode(wbs);
				if(task){
					return task.id;
				}
			}else if(this._gantt.isTaskExists(wbs)){
				// the wbs plugin is not bundled in every edition - fall back to the task id
				return wbs;
			}
		}
		return null;
	};
}