import { Popup } from "./popup/popup";
import { ModalPopup } from "./popup/modal_popup";
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
import { IUiKit, IUiKitRuntime } from "./ui_kit";
import { getToolbarBuiltin } from "./controls/toolbar_builtins";

type KitResolver = (owner: any) => IUiKit;

function resolveKit(value: any, getKit: KitResolver): IUiKitRuntime {
	return value && value.context && value.createPopup ? value : getKit(value);
}

/** Keep the neutral class prototype so factory-created controls retain legacy instanceof behavior. */
function adaptConstructor<T extends new (...args: any[]) => any>(Base: T, adapt: (args: any[]) => any[]): T {
	return new Proxy(Base, {
		construct(target, args, newTarget) {
			return Reflect.construct(target, adapt(args), newTarget);
		}
	});
}

/** Constructors accepting a Gantt instance while sharing neutral UiKit prototypes. */
export function createGanttUiClasses(getKit: KitResolver): Record<string, any> {
	const kitArgs = ([owner, ...rest]: any[]) => [resolveKit(owner, getKit), ...rest];
	const contextArgs = ([owner, ...rest]: any[]) => [resolveKit(owner, getKit).context, ...rest];
	return {
		Popup: adaptConstructor(Popup, contextArgs),
		ModalPopup: adaptConstructor(ModalPopup, contextArgs),
		Button: adaptConstructor(Button, kitArgs),
		TextInput: adaptConstructor(TextInput, kitArgs),
		NumberStepper: adaptConstructor(NumberStepper, kitArgs),
		Combo: adaptConstructor(Combo, kitArgs),
		DatePicker: adaptConstructor(DatePicker, kitArgs),
		TimeInput: adaptConstructor(TimeInput, kitArgs),
		DateTimePicker: adaptConstructor(DateTimePicker, kitArgs),
		Tabs: adaptConstructor(Tabs, kitArgs),
		CheckboxGroup: adaptConstructor(CheckboxGroup, kitArgs),
		RadioGroup: adaptConstructor(RadioGroup, kitArgs),
		Field: adaptConstructor(Field, kitArgs),
		Toggle: adaptConstructor(Toggle, kitArgs),
		Switch: adaptConstructor(Switch, kitArgs),
		Menu: adaptConstructor(Menu, kitArgs),
		Toolbar: adaptConstructor(Toolbar, ([owner, config]: any[]) => [resolveKit(owner, getKit), config, getToolbarBuiltin])
	};
}
