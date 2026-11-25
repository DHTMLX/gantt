import type { KeyboardCommand, GanttWithKeyboardNavigation, KeyboardModifier } from "../types";

export default function(gantt: GanttWithKeyboardNavigation): void {

	gantt.$keyboardNavigation.shortcuts = {
		createCommand: function (): KeyboardCommand {
			return {
				modifiers: {
					"shift": false,
					"alt": false,
					"ctrl": false,
					"meta": false
				},
				keyCode: null
			};
		},
		parse: function (shortcut: string): KeyboardCommand[] {
			const commands: KeyboardCommand[] = [];

			const expr = this.getExpressions(this.trim(shortcut));
			for (let i = 0; i < expr.length; i++) {
				const words = this.getWords(expr[i]);

				const command = this.createCommand();

				for (let j = 0; j < words.length; j++) {
					const word = words[j] as KeyboardModifier;
					if (this.commandKeys[word]) {
						command.modifiers[word] = true;
					} else if (this.specialKeys[words[j]]) {
						command.keyCode = this.specialKeys[words[j]];
					} else {
						command.keyCode = words[j].charCodeAt(0);
					}
				}

				commands.push(command);
			}
			return commands;
		},

		getCommandFromEvent: function (domEvent: KeyboardEvent): KeyboardCommand {
			const command = this.createCommand();
			command.modifiers.shift = !!domEvent.shiftKey;
			command.modifiers.alt = !!domEvent.altKey;
			command.modifiers.ctrl = !!domEvent.ctrlKey;
			command.modifiers.meta = !!domEvent.metaKey;
			command.keyCode = domEvent.which || domEvent.keyCode;

			if(command.keyCode >= 96 && command.keyCode <= 105){
				// numpad keys 96-105 -> 48-57
				command.keyCode -= 48;//convert numpad  number code to regular number code
			}

			const printableKey = String.fromCharCode(command.keyCode);
			if (printableKey) {
				command.keyCode = printableKey.toLowerCase().charCodeAt(0);
			}
			return command;
		},

		getHashFromEvent: function (domEvent: KeyboardEvent): string {
			return this.getHash(this.getCommandFromEvent(domEvent));
		},

		getHash: function (command: KeyboardCommand): string {
			const parts: Array<string | number | null> = [];
			for (const i in command.modifiers) {
				const key = i as KeyboardModifier;
				if (command.modifiers[key]) {
					parts.push(key);
				}
			}
			parts.push(command.keyCode);

			return parts.join(this.junctionChar);
		},

		getExpressions: function (shortcut: string): string[] {
			return shortcut.split(this.junctionChar);
		},
		getWords: function (term: string): string[] {
			return term.split(this.combinationChar);
		},
		trim: function (shortcut: string): string {
			return shortcut.replace(/\s/g, "");
		},
		junctionChar: ",",
		combinationChar: "+",
		commandKeys: {
			"shift": 16,
			"alt": 18,
			"ctrl": 17,
			"meta": true
		},
		specialKeys: {
			"backspace": 8,
			"tab": 9,
			"enter": 13,
			"esc": 27,
			"space": 32,
			"up": 38,
			"down": 40,
			"left": 37,
			"right": 39,
			"home": 36,
			"end": 35,
			"pageup": 33,
			"pagedown": 34,
			"delete": 46,
			"insert": 45,
			"plus": 107,
			"f1": 112,
			"f2": 113,
			"f3": 114,
			"f4": 115,
			"f5": 116,
			"f6": 117,
			"f7": 118,
			"f8": 119,
			"f9": 120,
			"f10": 121,
			"f11": 122,
			"f12": 123
		}
	};
};
