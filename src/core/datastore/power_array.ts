import * as utils from "../../utils/utils";

export interface PowerArray<T = any> extends Array<T> {
	$removeAt(pos: number, len?: number): void;
	$remove(value: T): void;
	$insertAt(data: T, pos?: number): void;
	$find(data: T): number;
	$each(functor: (this: any, item: T) => void, master?: any): void;
	$map(functor: (this: any, item: T) => T, master?: any): this;
	$filter(functor: (this: any, item: T) => boolean, master?: any): this;
}

interface PowerArrayFactory {
	$create<T = any>(array?: T[]): PowerArray<T>;
	$removeAt<T>(this: PowerArray<T>, pos: number, len?: number): void;
	$remove<T>(this: PowerArray<T>, value: T): void;
	$insertAt<T>(this: PowerArray<T>, data: T, pos?: number): void;
	$find<T>(this: PowerArray<T>, data: T): number;
	$each<T>(this: PowerArray<T>, functor: (this: any, item: T) => void, master?: any): void;
	$map<T>(this: PowerArray<T>, functor: (this: any, item: T) => T, master?: any): PowerArray<T>;
	$filter<T>(this: PowerArray<T>, functor: (this: any, item: T) => boolean, master?: any): PowerArray<T>;
}

const $powerArray: PowerArrayFactory = {
	$create<T = any>(array?: T[]): PowerArray<T>{
		return utils.mixin(array || [], this) as PowerArray<T>;
	},
	//remove element at specified position
	$removeAt<T>(this: PowerArray<T>, pos: number, len?: number): void{
		if (pos>=0) this.splice(pos,(len||1));
	},
	//find element in collection and remove it
	$remove<T>(this: PowerArray<T>, value: T): void{
		this.$removeAt(this.$find(value));
	},
	//add element to collection at specific position
	$insertAt<T>(this: PowerArray<T>, data: T, pos?: number): void{
		if (!pos && pos!==0) 	//add to the end by default
			this.push(data);
		else {
			const b = this.splice(pos,(this.length-pos));
			this[pos] = data;
			this.push.apply(this,b); //reconstruct array without loosing this pointer
		}
	},
	//return index of element, -1 if it doesn't exists
	$find<T>(this: PowerArray<T>, data: T): number{
		// GS-3602. Matching an id across types is the contract here - a store may hold an id as
		// a number and be asked for it as a string - but `==` per element is an interpreted,
		// megamorphic scan over arrays as long as the chart, per visibility check and per
		// removal. Two strict passes express the same intent and stay inside the engine; on a
		// chart that uses one id type throughout the second never runs.
		//
		// This narrows `==` deliberately: an id held as a non-canonical numeric string ("5.0",
		// "05", " 5 ") no longer matches the number 5. Ids do not take those forms - they are
		// `pull` keys, the canonical string of whatever was stored.
		const strict = this.indexOf(data);
		if (strict !== -1) return strict;

		if (typeof data === "string") {
			if (data !== "" && !isNaN(+data)) return this.indexOf(+data as unknown as T);
		} else if (typeof data === "number") {
			return this.indexOf(data + "" as unknown as T);
		}
		return -1;
	},
	//execute some method for each element of array
	$each<T>(this: PowerArray<T>, functor: (this: any, item: T) => void, master?: any): void{
		for (let i=0; i < this.length; i++)
			functor.call((master||this),this[i]);
	},
	//create new array from source, by using results of functor
	$map<T>(this: PowerArray<T>, functor: (this: any, item: T) => T, master?: any): PowerArray<T>{
		for (let i=0; i < this.length; i++)
			this[i]=functor.call((master||this),this[i]);
		return this;
	},
	$filter<T>(this: PowerArray<T>, functor: (this: any, item: T) => boolean, master?: any): PowerArray<T>{
		for (let i=0; i < this.length; i++)
			if (!functor.call((master||this),this[i])){
				this.splice(i,1);
				i--;
			}
		return this;
	}
};

export default $powerArray;
