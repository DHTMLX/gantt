import { Popup, IPopupConfig } from "./popup/popup";
import { ModalPopup } from "./popup/modal_popup";
import { createPopupApi } from "./popup";
import { Button } from "./controls/button";
import { TextInput } from "./controls/text_input";
import { NumberStepper } from "./controls/number_stepper";
import { Combo } from "./controls/combo";
import { DatePicker } from "./controls/datepicker";
import { TimeInput } from "./controls/time_input";
import { DateTimePicker } from "./controls/datetime_picker";
import { Tabs } from "./controls/tabs";
import { CheckboxGroup } from "./controls/checkbox_group";
import { RadioGroup } from "./controls/radio_group";
import { Field } from "./controls/field";
import { Toggle } from "./controls/toggle";
import { Switch } from "./controls/switch";
import { Menu } from "./controls/menu";
import { Toolbar } from "./controls/toolbar";
import { IUiContext } from "./ui_context";
import {
	IButtonConfig, ITextInputConfig, INumberStepperConfig, IComboConfig,
	IDatePickerConfig, ITimeInputConfig, IDateTimePickerConfig, ITabsConfig,
	ICheckboxGroupConfig, IRadioGroupConfig, IFieldConfig, IToggleConfig, ISwitchConfig,
	IMenuConfig, IUIComponent, IToolbarConfig, ToolbarBuiltinResolver
} from "./controls/types";

export interface IUiKitRuntime {
	readonly context: IUiContext;
	readonly owner: any;
	createPopup(config?: IPopupConfig): Popup;
	createModal(config?: IPopupConfig): ModalPopup;
	/** Registers kit-owned components for owner-scope teardown. */
	registerComponent?(component: IUiKitComponent): void;
	unregisterComponent?(component: IUiKitComponent): void;
}

/** Minimal lifecycle contract shared by controls, menus, and toolbars. */
export interface IUiKitComponent {
	destroy(): void;
}

export interface IUiKit extends IUiKitRuntime {
	readonly controls: {
		button(config?: IButtonConfig): Button;
		text(config?: ITextInputConfig): TextInput;
		stepper(config?: INumberStepperConfig): NumberStepper;
		combo(config?: IComboConfig): Combo;
		datepicker(config?: IDatePickerConfig): DatePicker;
		time(config?: ITimeInputConfig): TimeInput;
		datetime(config?: IDateTimePickerConfig): DateTimePicker;
		tabs(config: ITabsConfig): Tabs;
		checkboxGroup(config: ICheckboxGroupConfig): CheckboxGroup;
		radioGroup(config: IRadioGroupConfig): RadioGroup;
		field(config: IFieldConfig, child: IUIComponent): Field;
		toggle(config?: IToggleConfig): Toggle;
		switch(config?: ISwitchConfig): Switch;
		menu(config?: IMenuConfig): Menu;
	};
	createToolbar(config?: IToolbarConfig): Toolbar;
	/** Raw constructors retained for advanced composition and subclassing. */
	readonly classes: Record<string, any>;
	destroy(): void;
}

export interface IUiKitOptions {
	owner?: any;
	resolveToolbarBuiltin?: ToolbarBuiltinResolver;
	onDestroy?(handler: () => void): void;
}

/** Creates one explicitly-bound UI kit. Controls never discover services globally. */
export function createUiKit(context: IUiContext, options: IUiKitOptions = {}): IUiKit {
	const popupApi = createPopupApi(context);
	const components = new Set<IUiKitComponent>();
	let destroyed = false;
	let kit: IUiKit;

	function assertAlive(): void {
		if (destroyed) {
			throw new Error("Cannot use a destroyed UI kit");
		}
	}

	const controls = {
		button: (config?: IButtonConfig) => new Button(kit, config),
		text: (config?: ITextInputConfig) => new TextInput(kit, config),
		stepper: (config?: INumberStepperConfig) => new NumberStepper(kit, config),
		combo: (config?: IComboConfig) => new Combo(kit, config),
		datepicker: (config?: IDatePickerConfig) => new DatePicker(kit, config),
		time: (config?: ITimeInputConfig) => new TimeInput(kit, config),
		datetime: (config?: IDateTimePickerConfig) => new DateTimePicker(kit, config),
		tabs: (config: ITabsConfig) => new Tabs(kit, config),
		checkboxGroup: (config: ICheckboxGroupConfig) => new CheckboxGroup(kit, config),
		radioGroup: (config: IRadioGroupConfig) => new RadioGroup(kit, config),
		field: (config: IFieldConfig, child: IUIComponent) => new Field(kit, config, child),
		toggle: (config?: IToggleConfig) => new Toggle(kit, config),
		switch: (config?: ISwitchConfig) => new Switch(kit, config),
		menu: (config?: IMenuConfig) => new Menu(kit, config)
	};

	kit = {
		context,
		owner: options.owner,
		createPopup: (config?: IPopupConfig) => {
			assertAlive();
			return popupApi.createPopup(config);
		},
		createModal: (config?: IPopupConfig) => {
			assertAlive();
			return popupApi.createModal(config);
		},
		registerComponent: (component: IUIComponent) => {
			assertAlive();
			components.add(component);
		},
		unregisterComponent: (component: IUIComponent) => {
			components.delete(component);
		},
		controls,
		createToolbar: (config?: IToolbarConfig) => {
			assertAlive();
			return new Toolbar(kit, config, options.resolveToolbarBuiltin);
		},
		classes: {
			Popup, ModalPopup, Button, TextInput, NumberStepper, Combo,
			DatePicker, TimeInput, DateTimePicker, Tabs, CheckboxGroup,
			RadioGroup, Field, Toggle, Switch, Menu, Toolbar
		},
		destroy: () => {
			if (destroyed) return;
			destroyed = true;
			Array.from(components).forEach(function(component) {
				component.destroy();
			});
			components.clear();
			popupApi.destroyAll();
		}
	};

	if (options.onDestroy) options.onDestroy(() => kit.destroy());
	return kit;
}

