/**
 * Layout content view registered as `"toolbar"` (Layer B). Hosted inside a
 * ViewCell created from a `{ view: "toolbar" }` layout cell; it mounts a Toolbar
 * widget (Layer A) into the cell's content node and reports a fixed height.
 *
 * The ViewCell drives the row height from its own `$config.height` (injected by
 * the plugin's auto-injection). With `overflow: "wrap"` the items can take
 * several lines: the view then measures the toolbar and grows the row to fit,
 * never below the configured height.
 */
import { IToolbar } from "../../core/ui/controls/types";

export const DEFAULT_TOOLBAR_HEIGHT = 44;   // matches --dhx-gantt-toolbar-height

/** builds the view class bound to a config resolver + a widget sink. */
export function createToolbarView(
	resolveConfig: (gantt: any) => any,
	onWidget: (widget: IToolbar | null, cell: any) => void
): any {
	function ToolbarView(this: any, parent: any, config: any, factory: any, gantt: any) {
		this.$gantt = gantt;
		this.$config = config;
		this.$parent = parent;         // the hosting ViewCell
		this.$factory = factory;
		this.$name = "toolbar";
		this._widget = null;
		this._observer = null;
		this._baseHeight = (config && config.height) || DEFAULT_TOOLBAR_HEIGHT;
	}

	ToolbarView.prototype.init = function (node: HTMLElement): void {
		this._node = node;
		const config = resolveConfig(this.$gantt);
		this._widget = this.$gantt.ext.ui.createToolbar(config);
		this._widget.mount(node);
		onWidget(this._widget, this.$parent);
		if (config.overflow === "wrap") {
			this._watchWrappedHeight();
		}
	};

	/** "wrap" mode: the row follows the height of the wrapped toolbar. */
	ToolbarView.prototype._watchWrappedHeight = function (): void {
		const root: HTMLElement | null = this._widget && this._widget.getRootNode();
		const view = root && root.ownerDocument.defaultView;
		if (!root || !view || typeof (view as any).ResizeObserver !== "function") {
			return;
		}
		this._observer = new (view as any).ResizeObserver(() => {
			// the cell height is its outer height: add the cell borders
			const parent = this.$parent;
			const borders = parent && parent._getBorderSizes ? parent._getBorderSizes().vertical || 0 : 0;
			const height = Math.max(this._baseHeight, Math.ceil(root.getBoundingClientRect().height) + borders);
			const current = (this.$config && this.$config.height) || this._baseHeight;
			if (!root.isConnected || height === current || !this.$gantt) {
				return;
			}
			this.$config.height = height;
			if (this.$parent && this.$parent.$config) {
				this.$parent.$config.height = height;
			}
			this.$gantt.setSizes();
		});
		this._observer.observe(root);
	};

	ToolbarView.prototype.setSize = function (): void {
		// widget lays itself out with flexbox; nothing to size explicitly
	};

	ToolbarView.prototype.getSize = function () {
		const h = (this.$config && this.$config.height) || DEFAULT_TOOLBAR_HEIGHT;
		return {
			width: 0, height: h,
			gravity: 0,
			minWidth: 0, minHeight: h,
			maxWidth: 100000000000, maxHeight: h
		};
	};

	ToolbarView.prototype.destructor = function (): void {
		if (this._observer) {
			this._observer.disconnect();
			this._observer = null;
		}
		if (this._widget) {
			this._widget.destroy();
			this._widget = null;
		}
		onWidget(null, null);
		this._node = null;
		this.$gantt = this.$parent = this.$factory = null;
	};

	// ViewCell calls unload() when present, else destructor()
	ToolbarView.prototype.unload = ToolbarView.prototype.destructor;

	return ToolbarView;
}
