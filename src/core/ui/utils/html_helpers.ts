import * as helpers from "../../../utils/helpers";

interface HtmlAttribute {
	key: string;
	value: string | number | boolean;
}

interface HtmlContainerOptions {
	innerHTML?: string;
}

interface HtmlSelectOption {
	key: string | number;
	label: string;
	attributes?: HtmlAttribute[];
}

const htmlHelpers = {
	getHtmlSelect: function(options?: HtmlSelectOption[], attributes?: HtmlAttribute[], value?: string | number): string {
		let innerHTML = "";
		const _this = this;

		options = options || [];

		helpers.forEach(options, function(entry) {
			let _attributes: HtmlAttribute[] = [{ key: "value", value: entry.key }];

			if (value == entry.key) {
				_attributes[_attributes.length] = { key: "selected", value: "selected" };
			}
			if (entry.attributes) {
				_attributes = _attributes.concat(entry.attributes);
			}
			innerHTML += _this.getHtmlOption({ innerHTML: entry.label }, _attributes);
		});

		return _getHtmlContainer("select", { innerHTML: innerHTML }, attributes);
	},
	getHtmlOption: function(options?: HtmlContainerOptions, attributes?: HtmlAttribute[]): string { return _getHtmlContainer("option", options, attributes); },
	getHtmlButton: function(options?: HtmlContainerOptions, attributes?: HtmlAttribute[]): string { return _getHtmlContainer("button", options, attributes); },
	getHtmlDiv: function(options?: HtmlContainerOptions, attributes?: HtmlAttribute[]): string { return _getHtmlContainer("div", options, attributes); },
	getHtmlLabel: function(options?: HtmlContainerOptions, attributes?: HtmlAttribute[]): string { return _getHtmlContainer("label", options, attributes); },
	getHtmlInput: function(attributes?: HtmlAttribute[]): string {
		return "<input" + _getHtmlAttributes(attributes || []) + ">";
	}
};

function _getHtmlContainer(tag: string, options?: HtmlContainerOptions, attributes?: HtmlAttribute[]): string {
	options = options || {};

	const html = "<" + tag + _getHtmlAttributes(attributes || []) + ">" + (options.innerHTML || "") + "</" + tag + ">";
	return html;
}

function _getHtmlAttributes(attributes: HtmlAttribute[]): string {
	let html = "";

	helpers.forEach(attributes, function(entry) {
		html += " " + entry.key + "='" + entry.value + "'";
	});
	return html;
}

export default htmlHelpers;
