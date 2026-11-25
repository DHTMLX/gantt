import type { GanttWithKeyboardNavigation, KeyboardNavigationNode, KeyboardShortcutHandler, KeyboardShortcutMap } from "../types";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.EventHandler = {
		_handlers: null,
		findHandler: function (command) {
			if (!this._handlers) this._handlers = {};
			const shortcuts = gantt.$keyboardNavigation.shortcuts;
			const hash = shortcuts.getHash(command);

			return this._handlers[hash];
		},

		doAction: function (command, e) {
			const handler = this.findHandler(command);
			if (handler) {
				const eventFacade = gantt.$keyboardNavigation.facade;

				if(eventFacade.callEvent("onBeforeAction", [command, e]) === false){
					return;
				}

				handler.call(this as unknown as KeyboardNavigationNode, e);

				if (e.preventDefault) e.preventDefault();
				else (e as KeyboardEvent & { returnValue: boolean }).returnValue = false;

			}
		},
		bind: function (shortcut: string, handler: KeyboardShortcutHandler) {
			if (!this._handlers) this._handlers = {};

			const shortcuts = gantt.$keyboardNavigation.shortcuts;

			const commands = shortcuts.parse(shortcut);
			for (let i = 0; i < commands.length; i++) {
				this._handlers[shortcuts.getHash(commands[i])] = handler;
			}
		},
		unbind: function (shortcut: string) {
			const shortcuts = gantt.$keyboardNavigation.shortcuts;

			const commands = shortcuts.parse(shortcut);
			for (let i = 0; i < commands.length; i++) {
				if (this._handlers && this._handlers[shortcuts.getHash(commands[i])]) {
					delete this._handlers[shortcuts.getHash(commands[i])];
				}
			}
		},

		bindAll: function (map: KeyboardShortcutMap) {
			for (const i in map) {
				this.bind(i, map[i]);
			}
		},
		initKeys: function () {
			if (!this._handlers)
				this._handlers = {};
			if (this.keys) {
				this.bindAll(this.keys);
			}
		}
	};

};
