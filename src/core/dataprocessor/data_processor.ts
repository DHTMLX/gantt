import eventable from "../../utils/eventable";
import * as helpers from "../../utils/helpers";
import * as utils from "../../utils/utils";
import DataProcessorEvents from "./data_processor_events";
import extendGantt from "./extend_gantt";
import SimpleStorage from "./simple_storage";
import global from "../../utils/global";
import type { DataProcessorBatchResponseRow, Id } from "../../types/gantt_types";

export interface DataProcessor { // tslint:disable-line
	$gantt: any;
	detachAllEvents: any;
	attachEvent: any;
	callEvent: any;

	serverProcessor: string;
	action_param: string;
	updatedRows: any[];
	autoUpdate: boolean;
	updateMode: string;
	messages: any[];
	styles: object;
	dnd: any;
	deleteAfterConfirmation?: any;
}

export function createDataProcessor(config: any) {
	let router;
	let tMode;
	let headers;
	if (config instanceof Function) {
		router = config;
	} else if (config.hasOwnProperty("router")) {
		router = config.router;
	} else if (config.hasOwnProperty("assignment") || config.hasOwnProperty("baseline") || config.hasOwnProperty("link") || config.hasOwnProperty("task")) {
		router = config;
	} else if(config.hasOwnProperty("headers")){
		// GS-2312 for custom headers
		headers = config.headers;
	}
	if (router) {
		tMode = "CUSTOM";
	} else {
		tMode = config.mode || "REST-JSON";
	}
	const gantt = this; // tslint:disable-line
	const dp = new DataProcessor(config.url);


	dp.init(gantt);
	dp.setTransactionMode({
		mode: tMode,
		router,
		headers,
		batch: config.batch
	}, config.batchUpdate);
	if(config.deleteAfterConfirmation){
		dp.deleteAfterConfirmation = config.deleteAfterConfirmation;
	}
	return dp;
}

export class DataProcessor {
	public modes: object;
	public serverProcessor: string;
	public action_param: string; // tslint:disable-line
	public updatedRows: any[];
	public autoUpdate: boolean;
	public updateMode: string;
	public messages: any[];
	public styles: object;
	public dnd: any;

	protected _tMode: string;
	protected _headers: any;
	protected _payload: any;
	protected _postDelim: string;
	protected _waitMode: number;
	protected _in_progress: object; // tslint:disable-line
	protected _invalid: object;
	protected _storage: SimpleStorage;
	protected _tSend: boolean;
	protected _batchMode: boolean;
	protected _serializeAsJson: boolean;
	protected _router: any;
	protected _utf: boolean;
	protected _methods: any[];
	protected _user: any;
	protected _uActions: object;
	protected _needUpdate: boolean;
	protected _ganttMode: "task"|"link";
	protected _routerParametersFormat: "parameters"|"object";

	protected _silent_mode: any; // tslint:disable-line
	protected _updateBusy: any;
	protected _serverProcessor: any;
	protected _initialized: boolean;

	constructor(serverProcessorURL?) {
		this.serverProcessor = serverProcessorURL;
		this.action_param = "!nativeeditor_status";

		this.updatedRows = []; // ids of updated rows

		this.autoUpdate = true;
		this.updateMode = "cell";
		this._headers = null;
		this._payload = null;
		this._postDelim = "_";
		this._routerParametersFormat = "parameters";

		this._waitMode = 0;
		this._in_progress = {}; // ?
		this._storage = SimpleStorage.create();
		this._invalid = {};
		this.messages = [];

		this.styles = {
			updated: "font-weight:bold;",
			inserted: "font-weight:bold;",
			deleted: "text-decoration : line-through;",
			invalid: "background-color:FFE0E0;",
			invalid_cell: "border-bottom:2px solid red;",
			error: "color:red;",
			clear: "font-weight:normal;text-decoration:none;"
		};
		this.enableUTFencoding(true);
		eventable(this);
	}

	setTransactionMode(mode:any, total?:any) {
		let batch = false;
		if (typeof mode === "object") {
			this._tMode = mode.mode || this._tMode;

			if (utils.defined(mode.headers)) {
				this._headers = mode.headers;
			}

			if (utils.defined(mode.payload)) {
				this._payload = mode.payload;
			}
			batch = !!mode.batch;
			this._tSend = !!total;
		} else {
			this._tMode = mode;
			this._tSend = total;
		}

		if (batch && this._tMode !== "JSON") {
			throw new Error(`Incorrect dataProcessor configuration: "batch: true" is supported only by the **JSON** transaction mode, and not by **${this._tMode}**.
The REST and REST-JSON modes address a row by the request URL and pick the HTTP method per row state, so sending several rows in one request requires a dedicated endpoint convention rather than a flag.
Use gantt.createDataProcessor({ url, mode: "JSON", batch: true }) or implement a custom router.`);
		}
		this._batchMode = batch;

		if (this._tMode === "REST") {
			this._tSend = false;
		}

		if (this._tMode === "JSON" || this._tMode === "REST-JSON") {
			this._tSend = this._batchMode;
			this._serializeAsJson = true;
			this._headers = this._headers || {};
			this._headers["Content-Type"] = "application/json";
		}else{
			if(this._headers && !this._headers["Content-Type"]){
				this._headers["Content-Type"] = "application/x-www-form-urlencoded";
			}
		}

		if (this._tMode === "CUSTOM") {
			this._tSend = false;
			this._router = mode.router;
		}
	}

	escape(data:any) {
		if (this._utf) {
			return encodeURIComponent(data);
		} else {
			return escape(data);
		}
	}

	/**
	 * @desc: allows to set escaping mode
	 * @param: true - utf based escaping, simple - use current page encoding
	 * @type: public
	 */
	enableUTFencoding(mode:boolean) {
		this._utf = !!mode;
	}

	/**
	 * @desc: get state of updating
	 * @returns:   true - all in sync with server, false - some items not updated yet.
	 * @type: public
	 */
	getSyncState() {
		return !this.updatedRows.length;
	}

	/**
	 * @desc: set if rows should be send to server automatically
	 * @param: mode - "row" - based on row selection changed, "cell" - based on cell editing finished, "off" - manual data sending
	 * @type: public
	 */
	setUpdateMode(mode: string, dnd: any) {
		this.autoUpdate = (mode === "cell");
		this.updateMode = mode;
		this.dnd = dnd;
	}

	ignore(code: any, master: any) {
		this._silent_mode = true;
		code.call(master || global);
		this._silent_mode = false;
	}

	/**
	 * @desc: mark row as updated/normal. check mandatory fields, initiate autoupdate (if turned on)
	 * @param: rowId - id of row to set update-status for
	 * @param: state - true for "updated", false for "not updated"
	 * @param: mode - update mode name
	 * @type: public
	 */
	setUpdated(rowId:number|string, state: boolean, mode?: string) {
		if (this._silent_mode) {
			return;
		}

		const ind = this.findRow(rowId);

		mode = mode || "updated";
		const existing = this.$gantt.getUserData(rowId, this.action_param, this._ganttMode);
		if (existing && mode === "updated") {
			mode = existing;
		}
		if (state) {
			this.set_invalid(rowId, false); // clear previous error flag
			this.updatedRows[ind] = rowId;
			this.$gantt.setUserData(rowId, this.action_param, mode, this._ganttMode);
			if (this._in_progress[rowId]) {
				this._in_progress[rowId] = "wait";
			}
		} else {
			if (!this.is_invalid(rowId)) {
				this.updatedRows.splice(ind, 1);
				this.$gantt.setUserData(rowId, this.action_param, "", this._ganttMode);
			}
		}

		this.markRow(rowId, state, mode);
		if (state && this.autoUpdate) {
			this.sendData(rowId);
		}
	}

	markRow(id: number | string, state: boolean, mode: string) {
		let str = "";
		const invalid = this.is_invalid(id);
		if (invalid) {
			str = this.styles[invalid];
			state = true;
		}
		if (this.callEvent("onRowMark", [id, state, mode, invalid])) {
			// default logic
			str = this.styles[state ? mode : "clear"] + " " + str;

			this.$gantt[this._methods[0]](id, str);

			if (invalid && invalid.details) {
				str += this.styles[invalid + "_cell"];
				for (let i = 0; i < invalid.details.length; i++) {
					if (invalid.details[i]) {
						this.$gantt[this._methods[1]](id, i, str);
					}
				}
			}
		}
	}

	getActionByState(state: string):string {
		if (state === "inserted") {
			return "create";
		}

		if (state === "updated") {
			return "update";
		}

		if (state === "deleted") {
			return "delete";
		}

		// reorder
		return "update";
	}

	getState(id: number | string) {
		return this.$gantt.getUserData(id, this.action_param, this._ganttMode);
	}

	is_invalid(id: number | string) {
		return this._invalid[id];
	}

	set_invalid(id: number | string, mode: any, details?) {
		if (details) {
			mode = {
				value: mode,
				details,
				toString: function() { // tslint:disable-line
					return this.value.toString();
				}
			};
		}
		this._invalid[id] = mode;
	}

	/**
	 * @desc: check mandatory fields and verify values of cells, initiate update (if specified). Can be redefined in order to provide custom validation
	 * @param: rowId - id of row to set update-status for
	 * @type: public
	 */
	// tslint:disable-next-line
	checkBeforeUpdate(rowId: number | string) {
		return true;
	}

	/**
	 * @desc: send row(s) values to server
	 * @param: rowId - id of row which data to send. If not specified, then all "updated" rows will be send
	 * @type: public
	 */
	sendData(rowId?: any) {
		if (this.$gantt.editStop) {
			this.$gantt.editStop();
		}

		if (typeof rowId === "undefined" || this._tSend) {

			const pendingUpdateModes = [];
			if(this.modes){
				const knownModes = ["task", "link", "assignment", "baseline"];
				knownModes.forEach((mode) => {
					if(this.modes[mode] && this.modes[mode].updatedRows.length){
						pendingUpdateModes.push(mode);
					}
				});
			}

			if (pendingUpdateModes.length){
				for(let i = 0; i < pendingUpdateModes.length; i++){
					this.setGanttMode(pendingUpdateModes[i]);
					this.sendAllData();
				}
				return;
			} else {
				return this.sendAllData();
			}
		}
		if (this._in_progress[rowId]) {
			return false;
		}

		this.messages = [];
		if (!this.checkBeforeUpdate(rowId) && this.callEvent("onValidationError", [rowId, this.messages])) {
			return false;
		}
		this._beforeSendData(this._getRowData(rowId), rowId);
	}

	serialize(data: any, id: any) {
		if (this._serializeAsJson) {
			return  this._serializeAsJSON(data);
		}

		if (typeof data === "string") {
			return data;
		}
		if (typeof id !== "undefined") {
			return this.serialize_one(data, "");
		} else {
			const stack = [];
			const keys = [];
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					stack.push(this.serialize_one(data[key], key + this._postDelim));
					keys.push(key);
				}
			}
			stack.push("ids=" + this.escape(keys.join(",")));
			if (this.$gantt.security_key) {
				stack.push("dhx_security=" + this.$gantt.security_key);
			}
			return stack.join("&");
		}
	}

	serialize_one(data: any, pref: string) {
		if (typeof data === "string") {
			return data;
		}
		const stack: string[] = [];
		let serialized = "";
		for (const key in data)
			if (data.hasOwnProperty(key)) {
				if ((key === "id" ||
					key == this.action_param) && // tslint:disable-line
					this._tMode === "REST") {
					continue;
				}
				if (typeof data[key] === "string" || typeof data[key] === "number") {
					serialized = String(data[key]);
				} else {
					serialized = JSON.stringify(data[key]);
				}
				stack.push(this.escape((pref || "") + key) + "=" + this.escape(serialized));
			}
		return stack.join("&");
	}

	sendAllData() {
		if (!this.updatedRows.length) {
			return;
		}

		this.messages = [];
		let valid: any = true;

		this._forEachUpdatedRow(function(rowId) {
			valid = valid && this.checkBeforeUpdate(rowId);
		});

		if (!valid && !this.callEvent("onValidationError", ["", this.messages])) {
			return false;
		}

		if (this._tSend) {
			this._sendData(this._getAllData());
		} else {
			// this.updatedRows can be spliced from onBeforeUpdate via dp.setUpdated false
			// use an iterator instead of for(var i = 0; i < this.updatedRows; i++) then
			this._forEachUpdatedRow(function(rowId) {
				if (!this._in_progress[rowId]) {
					if (this.is_invalid(rowId)) {
						return;
					}
					this._beforeSendData(this._getRowData(rowId), rowId);
				}
			});
		}
	}

	findRow(pattern: any) {
		let i = 0;
		for (i = 0; i < this.updatedRows.length; i++) {
			if (pattern == this.updatedRows[i]) { // tslint:disable-line
				break;
			}
		}
		return i;
	}

	/**
	 * @desc: define custom actions
	 * @param: name - name of action, same as value of action attribute
	 * @param: handler - custom function, which receives a XMl response content for action
	 * @type: private
	 */
	defineAction(name: string, handler: any) {
		if (!this._uActions) {
			this._uActions = {};
		}
		this._uActions[name] = handler;
	}

	/**
	 * @desc: used in combination with setOnBeforeUpdateHandler to create custom client-server transport system
	 * @param: sid - id of item before update
	 * @param: tid - id of item after up0ate
	 * @param: action - action name
	 * @type: public
	 * @topic: 0
	 */
	afterUpdateCallback(sid: number | string, tid: number | string, action: string, btag: any, ganttMode: string) {
		if(!this.$gantt){
			// destructor has been called before the callback
			return;
		}

		this.setGanttMode(ganttMode);

		const marker = sid;
		const correct = (action !== "error" && action !== "invalid");
		if (!correct) {
			this.set_invalid(sid, action);
		}
		if ((this._uActions) && (this._uActions[action]) && (!this._uActions[action](btag))) {
			return (delete this._in_progress[marker]);
		}

		if (this._in_progress[marker] !== "wait") {
			this.setUpdated(sid, false);
		}

		const originalSid = sid;

		switch (action) {
			case "inserted":
			case "insert":
				if (tid != sid) { // tslint:disable-line
					this.setUpdated(sid, false);
					this.$gantt[this._methods[2]](sid, tid);
					sid = tid;
				}
				break;
			case "delete":
			case "deleted":
				if (this.deleteAfterConfirmation && this._ganttMode === "task" && this.$gantt.isTaskExists(sid)) {
					this.$gantt.setUserData(sid, this.action_param, "true_deleted", this._ganttMode);
					const task = this.$gantt.getTask(sid);
					this.$gantt.silent(() => {
						this.$gantt.deleteTask(sid);
					});
					this.$gantt.callEvent("onAfterTaskDelete", [sid, task]);
					this.$gantt.render();
					delete this._in_progress[marker];
					return this.callEvent("onAfterUpdate", [sid, action, tid, btag]);
				}
				if (this._in_progress[marker] === "wait" && this.getState(sid) === "deleted") {
					// a delete of this id queued during the request is already done on the server
					this.setUpdated(sid, false);
					delete this._in_progress[marker];
					return this.callEvent("onAfterUpdate", [sid, action, tid, btag]);
				}
				// The item left Gantt before this response. End the request like any other, so that
				// no state passes to an item that comes back with the same id.
				break;
		}

		if (this._in_progress[marker] !== "wait") {
			if (correct) {
				this.$gantt.setUserData(sid, this.action_param, "", this._ganttMode);
			}
			delete this._in_progress[marker];
		} else {
			delete this._in_progress[marker];
			this.setUpdated(tid, true, this.$gantt.getUserData(sid, this.action_param, this._ganttMode));
		}

		this.callEvent("onAfterUpdate", [originalSid, action, tid, btag]);
	}

	/**
	 * @desc: response from server
	 * @param: xml - XMLLoader object with response XML
	 * @type: private
	 */
	afterUpdate(that: any, xml: any, id?:any) {
		let _xml;
		if (arguments.length === 3) {
			_xml = arguments[1];
		} else {
			// old dataprocessor
			_xml = arguments[4];
		}
		let mode = this.getGanttMode();
		const reqUrl = _xml.filePath || _xml.url;

		if (this._tMode !== "REST" && this._tMode !== "REST-JSON") {
			if (reqUrl.indexOf("gantt_mode=links") !== -1) {
				mode = "link";
			} else if (reqUrl.indexOf("gantt_mode=assignments") !== -1) {
				mode = "assignment";
			} else if (reqUrl.indexOf("gantt_mode=baselines") !== -1) {
				mode = "baseline";
			} else {
				mode = "task";
			}
		} else {
			if (reqUrl.indexOf("/link") >= 0) {
				mode = "link";
			} else if(reqUrl.indexOf("/assignment") >= 0){
				mode = "assignment";
			} else if(reqUrl.indexOf("/baseline") >= 0){
				mode = "baseline";
			} else {
				mode = "task";
			}
		}
		this.setGanttMode(mode);

		const ajax = this.$gantt.ajax;
		// try to use json first
		let tag;

		try {
			tag = JSON.parse(xml.xmlDoc.responseText);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {

			// empty response also can be processed by json handler
			if (!xml.xmlDoc.responseText.length) {
				tag = {};
			}
		}

		const processCallback = (itemId: any) => {
			const action = tag.action || this.getState(itemId) || "updated";
			const sid = tag.sid || itemId[0];
			const tid = tag.tid || itemId[0];
			that.afterUpdateCallback(sid, tid, action, tag, mode);
		};

		const batchResponse = this._getBatchResponse(tag);
		if (batchResponse) {
			this._processBatchResponse(that, batchResponse, id, mode);
			that.finalizeUpdate();
			this.setGanttMode(mode);
			return;
		}

		if (tag) {
			// GS-753. When multiple tasks are updated, unhighlight all of them
			if (Array.isArray(id) && id.length > 1) {
				id.forEach((taskId) => processCallback(taskId));
			} else {
				processCallback(id);
			}
			that.finalizeUpdate();
			this.setGanttMode(mode);
			return;
		}

		// xml response
		const top = ajax.xmltop("data", xml.xmlDoc); // fix incorrect content type in IE
		if (!top) {
			return this.cleanUpdate(id);
		}
		const atag = ajax.xpath("//data/action", top);
		if (!atag.length) {
			return this.cleanUpdate(id);
		}

		for (let i = 0; i < atag.length; i++) {
			const btag = atag[i];
			const action = btag.getAttribute("type");
			const sid = btag.getAttribute("sid");
			const tid = btag.getAttribute("tid");

			that.afterUpdateCallback(sid, tid, action, btag, mode);
		}
		that.finalizeUpdate();
	}

	/**
	 * Recognizes a per-row response: either a bare array of row results or an object with
	 * a `batch` array. Anything else keeps the single-object response path.
	 * @param tag parsed JSON response
	 * @returns the array of per-row results, or null
	 */
	protected _getBatchResponse(tag: any): DataProcessorBatchResponseRow[] | null {
		if (Array.isArray(tag)) {
			return tag;
		}
		if (tag && Array.isArray(tag.batch)) {
			return tag.batch;
		}
		return null;
	}

	/**
	 * Applies a per-row response, mirroring the XML `//data/action` loop: each row resolves its
	 * own sid, tid and action. Rows the response does not mention are released from
	 * `_in_progress` so they can be sent again instead of being stuck.
	 * @param dataProcessor the dataProcessor the request callback was bound to
	 * @param rows per-row results from the response
	 * @param sentIds ids sent in the request
	 * @param mode gantt mode the request was sent for
	 */
	protected _processBatchResponse(
		dataProcessor: DataProcessor,
		rows: DataProcessorBatchResponseRow[],
		sentIds: Id[],
		mode: string
	) {
		const answered: { [id: string]: boolean } = {};

		for (let i = 0; i < rows.length; i++) {
			const row = rows[i] || {};
			const sid = row.sid !== undefined ? row.sid : row.id;
			if (sid === undefined) {
				continue;
			}
			const tid = row.tid !== undefined ? row.tid : (row.id !== undefined ? row.id : sid);
			const action = row.action || this.getState(sid) || "updated";

			answered[sid] = true;
			dataProcessor.afterUpdateCallback(sid, tid, action, row, mode);
		}

		if (sentIds) {
			const unanswered = [];
			for (let i = 0; i < sentIds.length; i++) {
				if (!answered[sentIds[i]]) {
					unanswered.push(sentIds[i]);
				}
			}
			this.cleanUpdate(unanswered);
		}
	}

	cleanUpdate(id: any[]) {
		if (id) {
			for (let i = 0; i < id.length; i++) {
				delete this._in_progress[id[i]];
			}
		}
	}

	finalizeUpdate() {
		if (this._waitMode) {
			this._waitMode--;
		}

		this.callEvent("onAfterUpdateFinish", []);
		if (!this.updatedRows.length) {
			this.callEvent("onFullSync", []);
		}
	}

	/**
	 * @desc: initializes data-processor
	 * @param: gantt - dhtmlxGantt object to attach this data-processor to
	 * @type: public
	 */
	init(gantt: any) {
		if (this._initialized) {
			return;
		}
		this.$gantt = gantt;
		if (this.$gantt._dp_init) {
			this.$gantt._dp_init(this);
		}

		this._setDefaultTransactionMode();

		this.styles = {
			updated:"gantt_updated",
			order:"gantt_updated",
			inserted:"gantt_inserted",
			deleted:"gantt_deleted",
			delete_confirmation:"gantt_deleted",
			invalid:"gantt_invalid",
			error:"gantt_error",
			clear:""
		};

		this._methods=["_row_style","setCellTextStyle","_change_id"];
		extendGantt(this.$gantt, this);
		const dataProcessorEvents = new DataProcessorEvents(this.$gantt, this);
		dataProcessorEvents.attach();
		this.attachEvent("onDestroy", function() {
			delete this.setGanttMode;
			delete this._getRowData;

			delete this.$gantt._dp;
			delete this.$gantt._change_id;
			delete this.$gantt._row_style;
			delete this.$gantt._sendTaskOrder;
			delete this.$gantt;

			dataProcessorEvents.detach();
		});
		this.$gantt.callEvent("onDataProcessorReady", [this]);
		this._initialized = true;
	}

	setOnAfterUpdate(handler) {
		this.attachEvent("onAfterUpdate", handler);
	}

	setOnBeforeUpdateHandler(handler) {
		this.attachEvent("onBeforeDataSending", handler);
	}

	/* starts autoupdate mode
		@param interval time interval for sending update requests
	*/
	setAutoUpdate(interval, user) {
		interval = interval || 2000;

		this._user = user || (new Date()).valueOf();
		this._needUpdate = false;

		this._updateBusy = false;

		this.attachEvent("onAfterUpdate", this.afterAutoUpdate); // arguments sid, action, tid, xml_node;

		this.attachEvent("onFullSync", this.fullSync);

		setInterval(() => {
			this.loadUpdate();
		}, interval);
	}

	/* process updating request response
		if status == collision version is deprecated
		set flag for autoupdating immediately
	*/
	afterAutoUpdate(sid, action, tid, xml_node) { // tslint:disable-line
		if (action === "collision") {
			this._needUpdate = true;
			return false;
		} else {
			return true;
		}
	}

	/* callback function for onFillSync event
		call update function if it's need
	*/
	fullSync() {
		if (this._needUpdate) {
			this._needUpdate = false;
			this.loadUpdate();
		}
		return true;
	}

	/* sends query to the server and call callback function
	*/
	getUpdates(url, callback) {
		const ajax = this.$gantt.ajax;
		if (this._updateBusy) {
			return false;
		} else {
			this._updateBusy = true;
		}

		ajax.get(url, callback);

	}

	/* loads updates and processes them
	*/
	loadUpdate() {
		const ajax = this.$gantt.ajax;
		const version = this.$gantt.getUserData(0, "version", this._ganttMode);
		let url = this.serverProcessor + ajax.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, "dhx_version=" + version].join("&");
		url = url.replace("editing=true&", "");
		this.getUpdates(url, (xml) => {
			const vers = ajax.xpath("//userdata", xml);
			this.$gantt.setUserData(0, "version", this._getXmlNodeValue(vers[0]), this._ganttMode);

			const updates = ajax.xpath("//update", xml);
			if (updates.length) {
				this._silent_mode = true;

				for (let i = 0; i < updates.length; i++) {
					const status = updates[i].getAttribute("status");
					const id = updates[i].getAttribute("id");
					const parent = updates[i].getAttribute("parent");
					switch (status) {
						case "inserted":
							this.callEvent("insertCallback", [updates[i], id, parent]);
							break;
						case "updated":
							this.callEvent("updateCallback", [updates[i], id, parent]);
							break;
						case "deleted":
							this.callEvent("deleteCallback", [updates[i], id, parent]);
							break;
					}
				}

				this._silent_mode = false;
			}

			this._updateBusy = false;
		});
	}

	destructor() {
		this.callEvent("onDestroy", []);
		this.detachAllEvents();

		this.updatedRows = [];
		this._in_progress = {}; // ?
		this._invalid = {};
		this._storage.clear();
		this._storage = null;
		this._headers = null;
		this._payload = null;
		delete this._initialized;
	}

	setGanttMode(mode) {
		if (mode === "tasks") {
			mode = "task";
		} else if (mode === "links") {
			mode = "link";
		}

		const modes = this.modes || {};
		const ganttMode = this.getGanttMode();
		if (ganttMode) {
			modes[ganttMode] = {
				_in_progress : this._in_progress,
				_invalid: this._invalid,
				_storage: this._storage,
				updatedRows : this.updatedRows
			};
		}

		let newState = modes[mode];
		if (!newState) {
			newState = modes[mode] = {
				_in_progress : {},
				_invalid : {},
				_storage : SimpleStorage.create(),
				updatedRows : []
			};
		}
		this._in_progress = newState._in_progress;
		this._invalid = newState._invalid;
		this._storage = newState._storage;
		this.updatedRows = newState.updatedRows;
		this.modes = modes;
		this._ganttMode = mode;
	}
	getGanttMode():string {
		return this._ganttMode;
	}

	storeItem(item) {
		this._storage.storeItem(item);
	}

	url(url: string) {
		this.serverProcessor = this._serverProcessor = url;
	}

	protected _beforeSendData(data: any, rowId: any) {
		if (!this.callEvent("onBeforeUpdate", [rowId, this.getState(rowId), data])) {
			return false;
		}
		this._sendData(data, rowId);
	}

	protected _serializeAsJSON(data: any) {
		if (typeof data === "string") {
			return data;
		}

		const copy = utils.copy(data);
		if (this._tMode === "REST-JSON") {
			delete copy.id;
			delete copy[this.action_param];
		}

		return JSON.stringify(copy);
	}

	protected _applyPayload(url: string) {
		const ajax = this.$gantt.ajax;
		if (this._payload) {
			for (const key in this._payload) {
				url = url + ajax.urlSeparator(url) + this.escape(key) + "=" + this.escape(this._payload[key]);
			}
		}
		return url;
	}

	// GET/POST/JSON modes of the dataProcessor didn't send the whole data items in 'delete' requests
	// clear extra info from the data in order not to change the request format
	protected _cleanupArgumentsBeforeSend(dataToSend: any) {
		let processedData;
		if(dataToSend[this.action_param] === undefined){// hash of updated items, and not an individual item
			processedData = {};
			for(const i in dataToSend) {
				processedData[i] = this._cleanupArgumentsBeforeSend(dataToSend[i]);
			}
		} else {
			processedData = this._cleanupItemBeforeSend(dataToSend);
		}
		return processedData;
	}
	protected _cleanupItemBeforeSend(updatedItem: any) {
		let output = null;
		if(updatedItem){
			if(updatedItem[this.action_param] === "deleted"){
				output = {};
				output.id = updatedItem.id;
				output[this.action_param] = updatedItem[this.action_param];
			}else{
				output = updatedItem;
			}
		}

		return output;
	}

	protected _isBatchRequest(rowId?: any): boolean {
		return !!this._batchMode && rowId === undefined;
	}

	/**
	 * Builds the `{ id, action, data }` envelope the JSON mode sends for one row.
	 */
	protected _serializeJsonRow(rawItem: any, rowId?: any): any {
		const data = {};
		const preprocessedData = this._cleanupItemBeforeSend(rawItem);
		for (const key in preprocessedData) {
			if (key === this.action_param || key === "id" || key === "gr_id") {
				continue;
			}
			data[key] = preprocessedData[key];
		}

		return {
			id: rowId !== undefined ? rowId : (rawItem ? rawItem.id : undefined),
			action: rawItem ? rawItem[this.action_param] : undefined,
			data
		};
	}

	protected _serializeBatch(dataToSend: any): any[] {
		const batch = [];
		for (const id in dataToSend) {
			const rawItem = dataToSend[id];
			if (!rawItem) {
				continue;
			}
			
			batch.push(this._serializeJsonRow(rawItem, rawItem.id !== undefined ? rawItem.id : id));
		}
		return batch;
	}

	protected _sendData(dataToSend: any, rowId?: any) {
		if (!dataToSend) {
			return; // nothing to send
		}
		if (!this.callEvent("onBeforeDataSending", rowId ? [rowId, this.getState(rowId), dataToSend] : [null, null, dataToSend])) {
			return false;
		}

		if (rowId) {
			this._in_progress[rowId] = (new Date()).valueOf();
		}

		const ajax = this.$gantt.ajax;

		if (this._tMode === "CUSTOM") {
			const taskState = this.getState(rowId);
			const taskAction = this.getActionByState(taskState);
			delete dataToSend[this.action_param]; // not send !nativeeditor_status parameter in router mode
			const ganttMode = this.getGanttMode();
			const _onResolvedCreateUpdate = (tag) => {
				let action = taskState || "updated";
				let sid = rowId;
				let tid = rowId;

				if (tag) {
					action = tag.action || taskState;
					sid = tag.sid || sid;
					tid = tag.id || tag.tid || tid;
				}
				this.afterUpdateCallback(sid, tid, action, tag, ganttMode);
			};

			let actionPromise;
			if (this._router instanceof Function) {
				if(this._routerParametersFormat === "object"){
					const obj = {
						entity: ganttMode,
						action: taskAction,
						data: dataToSend,
						id: rowId
					};
					actionPromise = this._router(obj);
				} else {
					actionPromise = this._router(ganttMode, taskAction, dataToSend, rowId);
				}
			} else if (this._router[ganttMode] instanceof Function) {
				actionPromise = this._router[ganttMode](taskAction, dataToSend, rowId);
			} else {

				const errorMsgStart = "Incorrect configuration of gantt.createDataProcessor";
				const errorMsgEnd = `
You need to either add missing properties to the dataProcessor router object or to use a router function.
See https://docs.dhtmlx.com/gantt/desktop__server_side.html#customrouting and https://docs.dhtmlx.com/gantt/api__gantt_createdataprocessor.html for details.`;

				if(!this._router[ganttMode]){
					throw new Error(`${errorMsgStart}: router for the **${ganttMode}** entity is not defined. ${errorMsgEnd}`);
				}
				switch (taskState) {
					case "inserted":
						if(!this._router[ganttMode].create){
							throw new Error(`${errorMsgStart}: **create** action for the **${ganttMode}** entity is not defined. ${errorMsgEnd}`);
						}
						actionPromise = this._router[ganttMode].create(dataToSend);
						break;
					case "deleted":
						if(!this._router[ganttMode].delete){
							throw new Error(`${errorMsgStart}: **delete** action for the **${ganttMode}** entity is not defined. ${errorMsgEnd}`);
						}
						actionPromise = this._router[ganttMode].delete(rowId);
						break;
					default:
						if(!this._router[ganttMode].update){
							throw new Error(`${errorMsgStart}: **update**" action for the **${ganttMode}** entity is not defined. ${errorMsgEnd}`);
						}
						actionPromise = this._router[ganttMode].update(dataToSend, rowId);
						break;
				}
			}

			if(actionPromise){
				// neither promise nor {tid: newId} response object
				if(!actionPromise.then &&
					(actionPromise.id === undefined && actionPromise.tid === undefined && actionPromise.action === undefined)){
					throw new Error("Incorrect router return value. A Promise or a response object is expected");
				}

				if(actionPromise.then){
					actionPromise.then(_onResolvedCreateUpdate).catch((error) => {
						if(error && error.action){
							_onResolvedCreateUpdate(error);
						}else{
							_onResolvedCreateUpdate({ action: "error", value: error});
						}
					});
				}else{
					// custom method may return a response object in case of sync action
					_onResolvedCreateUpdate(actionPromise);
				}
			}else{
				_onResolvedCreateUpdate(null);
			}
			return;
		}

		let queryParams: any;
		queryParams = {
			callback: (xml) => {
				const ids = [];

				if (rowId) {
					ids.push(rowId);
				} else if (dataToSend) {
					for (const key in dataToSend) {
						ids.push(key);
					}
				}

				return this.afterUpdate(this, xml, ids);
			},
			headers: this._headers
		};

		const dhxVersion = "dhx_version=" + this.$gantt.getUserData(0, "version", this._ganttMode);
		const urlParams = this.serverProcessor + (this._user ? (ajax.urlSeparator(this.serverProcessor) + ["dhx_user=" + this._user, dhxVersion].join("&")) : "");
		let url: any = this._applyPayload(urlParams);
		let data;

		switch (this._tMode) {
			case "GET":
				data = this._cleanupArgumentsBeforeSend(dataToSend);
				queryParams.url = url + ajax.urlSeparator(url) + this.serialize(data, rowId);
				queryParams.method = "GET";
				break;
			case "POST":
				data = this._cleanupArgumentsBeforeSend(dataToSend);
				queryParams.url = url;
				queryParams.method = "POST";
				queryParams.data = this.serialize(data, rowId);
				break;
			case "JSON":
				queryParams.url = url;
				queryParams.method = "POST";
				queryParams.data = this._isBatchRequest(rowId)
					? JSON.stringify({ batch: this._serializeBatch(dataToSend) })
					: JSON.stringify(this._serializeJsonRow(dataToSend, rowId));
				break;
			case "REST":
			case "REST-JSON":
				url = urlParams.replace(/(&|\?)editing=true/, "");
				data = "";

				switch (this.getState(rowId)) {
					case "inserted":
						queryParams.method = "POST";
						queryParams.data = this.serialize(dataToSend, rowId);
						break;
					case "deleted":
						queryParams.method = "DELETE";
						url = url + (url.slice(-1) === "/" ? "" : "/") + rowId;
						break;
					default:
						queryParams.method = "PUT";
						queryParams.data = this.serialize(dataToSend, rowId);
						url = url + (url.slice(-1) === "/" ? "" : "/") + rowId;
						break;
				}
				queryParams.url = this._applyPayload(url);
				break;
		}

		this._waitMode++;
		return ajax.query(queryParams);
	}

	protected _forEachUpdatedRow(code: any) {
		const updatedRows = this.updatedRows.slice();
		for (let i = 0; i < updatedRows.length; i++) {
			const rowId = updatedRows[i];
			if (this.$gantt.getUserData(rowId, this.action_param, this._ganttMode)) {
				code.call(this, rowId);
			}
		}
	}

	protected _setDefaultTransactionMode() {
		if (this.serverProcessor) {
			this.setTransactionMode("POST", true);
			this.serverProcessor += (this.serverProcessor.indexOf("?") !== -1 ? "&" : "?") + "editing=true";
			this._serverProcessor = this.serverProcessor;
		}
	}

	/* returns xml node value
		@param node
			xml node
	*/
	protected _getXmlNodeValue(node) {
		if (node.firstChild) {
			return node.firstChild.nodeValue;
		}
		return "";
	}

	protected _getAllData() {
		const out = {};
		let hasOne = false;

		this._forEachUpdatedRow(function(id) {
			if (this._in_progress[id] || this.is_invalid(id)){
				return;
			}
			const row = this._getRowData(id);
			if (!this.callEvent("onBeforeUpdate", [id, this.getState(id), row])) {
				return;
			}
			out[id] = row;
			hasOne = true;
			this._in_progress[id] = (new Date()).valueOf();
		});

		return hasOne ? out : null;
	}

	protected _prepareDate(value: Date) : string {
		if (this.$gantt.defined(this.$gantt.templates.xml_format)) {
			return this.$gantt.templates.xml_format(value);
		}
		if (
			(!this.$gantt.date._nonIsoStringDetected || this.$gantt.config.date_format === "iso") &&
			this.$gantt.templates.format_date._ganttAuto
		) {
			return this.$gantt.date._isoDateOnly
				? this.$gantt.date.formatISODateOnly(value)
				: this.$gantt.date.formatISODate(value);
		}
		return this.$gantt.templates.format_date(value);
	}

	protected _prepareArray(value: any[], traversedObjects: object[]) : any[] {
		traversedObjects.push(value);

		return value.map((item) => {
			if(helpers.isDate(item)){
				return this._prepareDate(item);
			} else if (Array.isArray(item) && !helpers.arrayIncludes(traversedObjects, item)){
				return this._prepareArray(item, traversedObjects);
			} else if (item && typeof item === "object" && !helpers.arrayIncludes(traversedObjects, item)) {
				return this._prepareObject(item, traversedObjects);
			} else {
				return item;
			}
		});
	}

	protected _prepareObject(rawItem: any, traversedObjects: object[]) : any {
		const processedItem = {};
		traversedObjects.push(rawItem);

		for (const key in rawItem) {
			if (key.substr(0, 1) === "$") {
				continue;
			}

			const value = rawItem[key];
			if (helpers.isDate(value)) {
				processedItem[key] = this._prepareDate(value);
			} else if(value === null) {
				processedItem[key] = "";
			} else if (Array.isArray(value) && !helpers.arrayIncludes(traversedObjects, value)){
				processedItem[key] = this._prepareArray(value, traversedObjects);
			} else if (value && typeof value === "object" && !helpers.arrayIncludes(traversedObjects, value)) {
				processedItem[key] = this._prepareObject(value, traversedObjects);
			} else {
				processedItem[key] = value;
			}
		}
		return processedItem;
	}

	protected _prepareDataItem(rawItem: any): any {
		const processedItem = this._prepareObject(rawItem, []);

		processedItem[this.action_param] = this.$gantt.getUserData(rawItem.id, this.action_param, this._ganttMode);
		return processedItem;
	}

	protected getStoredItem(id){
		return this._storage.getStoredItem(id);
	}

	protected _getRowData(id) {
		let dataItem;
		const gantt = this.$gantt;
		if (this.getGanttMode() === "task") {
			if(gantt.isTaskExists(id)){
				dataItem =this.$gantt.getTask(id);
			}
		} else if (this.getGanttMode() === "assignment") {
			if(this.$gantt.$data.assignmentsStore.exists(id)){
				dataItem =this.$gantt.$data.assignmentsStore.getItem(id);
			}
		} else if (this.getGanttMode() === "baseline") {
			if(this.$gantt.$data.baselineStore.exists(id)){
				dataItem =this.$gantt.$data.baselineStore.getItem(id);
			}
		} else {
			if(gantt.isLinkExists(id)){
				dataItem =this.$gantt.getLink(id);
			}
		}

		if (!dataItem) {
			dataItem = this.getStoredItem(id);
		}

		if (!dataItem) {
			dataItem = { id };
		}

		return this._prepareDataItem(dataItem);
	}
}