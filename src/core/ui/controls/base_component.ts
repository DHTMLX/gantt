import { IUIComponent } from "./types";
import type { IUiKitRuntime } from "../ui_kit";

/**
 * Shared skeleton for kit components: root-node bookkeeping, mount/destroy,
 * disabled state, change-handler plumbing for value controls.
 * Subclasses build their DOM in _render() (called on mount, never earlier —
 * constructing controls is safe in stub-DOM environments).
 */
export abstract class BaseComponent implements IUIComponent {
	protected $kit: IUiKitRuntime;
	protected _root: HTMLElement | null = null;
	protected _disabled: boolean = false;
	protected _destroyed: boolean = false;
	private _cleanups: Array<() => void> = [];

	constructor(kit: IUiKitRuntime) {
		this.$kit = kit;
		if (kit.registerComponent) {
			kit.registerComponent(this);
		}
	}

	public mount(target: HTMLElement): void {
		if (this._destroyed || this._root) {
			return;
		}
		this._root = this._render();
		if (this._disabled) {
			this._applyDisabled(true);
		}
		target.appendChild(this._root);
	}

	public focus(): void {
		const focusTarget = this._getFocusNode();
		if (focusTarget && focusTarget.focus) {
			try {
				focusTarget.focus();
			} catch {
				// silent, matches gantt._focus
			}
		}
	}

	public destroy(): void {
		if (this._destroyed) {
			return;
		}
		this._destroyed = true;
		this._cleanups.forEach(function(cleanup) {
			cleanup();
		});
		this._cleanups = [];
		if (this.$kit.unregisterComponent) {
			this.$kit.unregisterComponent(this);
		}
		if (this._root && this._root.parentNode) {
			this._root.parentNode.removeChild(this._root);
		}
		this._root = null;
	}

	public setDisabled(flag: boolean): void {
		this._disabled = !!flag;
		if (this._root) {
			this._applyDisabled(this._disabled);
		}
	}

	public getRootNode(): HTMLElement | null {
		return this._root;
	}

	/** register teardown work executed on destroy() */
	protected _onDestroy(cleanup: () => void): void {
		this._cleanups.push(cleanup);
	}

	/** attach a DOM listener that is removed automatically on destroy() */
	protected _listen(target: EventTarget, event: string, handler: any): void {
		target.addEventListener(event, handler);
		this._onDestroy(function() {
			target.removeEventListener(event, handler);
		});
	}

	protected abstract _render(): HTMLElement;

	protected _getFocusNode(): HTMLElement | null {
		return this._root;
	}

	protected _applyDisabled(flag: boolean): void {
		if (!this._root) {
			return;
		}
		if (flag) {
			this._root.classList.add("dhx_ui_disabled");
		} else {
			this._root.classList.remove("dhx_ui_disabled");
		}
		// controls whose root IS the interactive element (Button/Toggle) are not
		// matched by the descendant query below — disable the root too so it also
		// drops out of the tab order / native activation, not just the dim class.
		if (/^(BUTTON|INPUT|SELECT|TEXTAREA)$/.test(this._root.tagName)) {
			(this._root as HTMLInputElement).disabled = flag;
		}
		const inputs = this._root.querySelectorAll("input, select, textarea, button");
		for (let i = 0; i < inputs.length; i++) {
			(inputs[i] as HTMLInputElement).disabled = flag;
		}
	}
}

/**
 * Skeleton for value-bearing controls: change-handler list + _emitChange.
 */
export abstract class BaseControl<TValue> extends BaseComponent {
	private _changeHandlers: Array<(value: TValue) => void> = [];

	public onChange(handler: (value: TValue) => void): void {
		this._changeHandlers.push(handler);
	}

	public abstract getValue(): TValue;
	public abstract setValue(value: TValue): void;

	protected _emitChange(): void {
		const value = this.getValue();
		this._changeHandlers.forEach(function(handler) {
			handler(value);
		});
	}
}
