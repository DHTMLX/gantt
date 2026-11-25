import * as utils from "../../utils/utils";
import * as domHelpers from "./utils/dom_helpers";
import { getGanttUiKit } from "./gantt_ui_kit";

/*
 * gantt.alert / confirm / message / modalbox.
 *
 * Since the ui-core migration (Step 3, docs/internal/ui-core/03-migration-status.md)
 * the modal boxes ride on the ModalPopup primitive: it owns the backdrop
 * (with the legacy dhx_modal_cover class — z-index 17 under the box's 18),
 * centering, the modal stack, the intrinsic focus trap, aria-modal and
 * focus save/restore. This module keeps building the legacy
 * gantt_modal_box element (classes, buttons, aria, click routing) and the
 * popup ADOPTS it, so the DOM contract is unchanged.
 *
 * Kept here on purpose (deviations from the original migration plan):
 * - modal_key: Enter/Space-to-confirm and ESC-to-cancel read
 *   messageBox.keyboard dynamically, act on the most recent ok/cancel box
 *   and work with focus anywhere on the page (capture phase) — none of
 *   which maps to the primitive's per-popup ESC dismissal;
 * - modalBox.focus: the delayed focus keeps the legacy timing the kb-nav
 *   extension's focus save/restore relies on (the popup's own focus-first
 *   is disabled via autoFocus: false).
 * Toasts (gantt.message) are not popups; they only adopt the notification
 * z-band token on the gantt_message_area element.
 */
export default function(gantt) {

	var boxAttribute = "data-dhxbox";

	var _dhx_msg_cfg = null;
	function createModalPopup(config) {
		return getGanttUiKit(gantt).createModal(config);
	}

	function callback(config, result) {
		var usercall = config.callback;
		modalBox.hide(config.box);

		_dhx_msg_cfg = config.box = null;
		if (usercall)
			usercall(result);
	}

	function modal_key(event) {
		if (_dhx_msg_cfg) {

			var code = event.which || event.keyCode;
			var preventDefault = false;

			if (messageBox.keyboard) {
				if (code == 13 || code == 32) {
					// default behavior is to confirm/submit popup on space/enter
					// if browser focus is set on button element - do button click instead of default behavior
					var target = event.target || event.srcElement;
					if (domHelpers.getClassName(target).indexOf("gantt_popup_button") > -1 && target.click) {
						target.click();
					} else {
						callback(_dhx_msg_cfg, true);
						preventDefault = true;
					}
				}

				if (code == 27) {
					callback(_dhx_msg_cfg, false);
					preventDefault = true;
				}
			}

			if (preventDefault) {
				if (event.preventDefault){
					event.preventDefault();
				}
				return !(event.cancelBubble = true);
			}
			return;
		}
	}
	var eventElement = domHelpers.getRootNode(gantt.$root) || document;
	gantt.event(eventElement, "keydown", modal_key, true);

	function button(text, className, result) {
		var buttonAriaAttrs = gantt._waiAria.messageButtonAttrString(text);
		var name = className.toLowerCase().replace(/ /g, "_");
		var button_css = "gantt_" + name + "_button";
		return "<div " + buttonAriaAttrs + " class='gantt_popup_button " + button_css + "' data-result='" + result + "' result='" + result + "' ><div>" + text + "</div></div>";
	}

	function info(text) {
		if (!messageBox.area) {
			messageBox.area = document.createElement("div");
			// the z-band token class aligns the toast layer with the ui-core
			// stacking model (same computed z-index as the legacy value)
			messageBox.area.className = "gantt_message_area dhx_ui_zband_notification";
			messageBox.area.style[messageBox.position] = "5px";
		}
		if (!domHelpers.isChildOf(messageBox.area, document.body)){
			document.body.appendChild(messageBox.area);
		}

		messageBox.hide(text.id);
		var message = document.createElement("div");
		message.innerHTML = "<div>" + text.text + "</div>";
		message.className = "gantt-info gantt-" + text.type;
		message.onclick = function () {
			messageBox.hide(text.id);
			text = null;
		};

		gantt._waiAria.messageInfoAttr(message);

		if (messageBox.position == "bottom" && messageBox.area.firstChild)
			messageBox.area.insertBefore(message, messageBox.area.firstChild);
		else
			messageBox.area.appendChild(message);

		if (text.expire > 0)
			messageBox.timers[text.id] = window.setTimeout(function () {
				// GS-1213: We need that when Gantt is destroyed
				if (messageBox) messageBox.hide(text.id);
			}, text.expire);

		messageBox.pull[text.id] = message;
		message = null;

		return text.id;
	}

	function getFirstDefined() {
		var values = [].slice.apply(arguments, [0]);

		for (var i = 0; i < values.length; i++) {
			if (values[i]) {
				return values[i];
			}
		}

	}

	function _boxStructure(config, ok, cancel) {
		var box = document.createElement("div");

		var contentId = utils.uid();
		var titleId = config.title ? utils.uid() : null;
		gantt._waiAria.messageModalAttr(box, titleId || contentId, titleId ? contentId : null);


		box.className = " gantt_modal_box gantt-" + config.type;
		box.setAttribute(boxAttribute, 1);

		var inner = '';

		if (config.width)
			box.style.width = config.width;
		if (config.height)
			box.style.height = config.height;
		if (config.title)
			inner += '<div class="gantt_popup_title" id="' + titleId + '">' + config.title + '</div>';
		inner += '<div class="gantt_popup_text" id="' + contentId + '"><span>' + (config.content ? '' : config.text) + '</span></div><div  class="gantt_popup_controls">';
		if (ok)
			inner += button(getFirstDefined(config.ok, gantt.locale.labels.message_ok, "OK"), "ok", true);
		if (cancel)
			inner += button(getFirstDefined(config.cancel, gantt.locale.labels.message_cancel, "Cancel"), "cancel", false);

		if (config.buttons) {
			for (var i = 0; i < config.buttons.length; i++) {
				var btn = config.buttons[i];
				if (typeof btn == "object") {
					// Support { label:"Save", css:"main_button", value:"save" }
					var label = btn.label;
					var css = btn.css || ("gantt_" + btn.label.toLowerCase() + "_button");
					var value = btn.value || i;
					inner += button(label, css, value);
				} else {
					inner += button(btn, btn, i);
				}
			}
		}

		inner += '</div>';
		box.innerHTML = inner;

		if (config.content) {
			var node = config.content;
			if (typeof node == "string")
				node = document.getElementById(node);
			if (node.style.display == 'none')
				node.style.display = "";
			box.childNodes[config.title ? 1 : 0].appendChild(node);
		}

		box.onclick = function (event) {
			var source = event.target || event.srcElement;
			if (!source.className) source = source.parentNode;
			if (domHelpers.closest(source, ".gantt_popup_button")) {
				var result = source.getAttribute("data-result");
				result = (result == "true") || (result == "false" ? false : result);
				callback(config, result);
			}
		};
		config.box = box;
		if (ok || cancel)
			_dhx_msg_cfg = config;

		return box;
	}

	function _createBox(config, ok, cancel) {
		var box = config.tagName ? config : _boxStructure(config, ok, cancel);

		var popup = createModalPopup({
			node: box,
			container: function() { return document.body; },
			position: config.position == "top" ? { type: "none" } : { type: "center" },
			// ESC/Enter/Space stay with modal_key (dynamic messageBox.keyboard)
			dismiss: { escape: false, outsideClick: false },
			autoFocus: false,
			backdropClassName: "dhx_modal_cover"
		});
		box.$msgPopup = popup;
		popup.show();

		if (config.position == "top") {
			// legacy "top" placement: docked under the upper edge, centered horizontally
			box.style.top = "-3px";
			box.style.left = Math.abs(Math.floor(((window.innerWidth || document.documentElement.offsetWidth) - box.offsetWidth) / 2)) + "px";
		}
		//necessary for IE only
		box.onkeydown = modal_key;

		modalBox.focus(box);

		if (config.hidden)
			modalBox.hide(box);

		gantt.callEvent("onMessagePopup", [box]);
		return box;
	}

	function alertPopup(config) {
		return _createBox(config, true, false);
	}

	function confirmPopup(config) {
		return _createBox(config, true, true);
	}

	function boxPopup(config) {
		return _createBox(config);
	}

	function box_params(text, type, callback) {
		if (typeof text != "object") {
			if (typeof type == "function") {
				callback = type;
				type = "";
			}
			text = {text: text, type: type, callback: callback};
		}
		return text;
	}

	function params(text, type, expire, id) {
		if (typeof text != "object")
			text = {text: text, type: type, expire: expire, id: id};
		text.id = text.id || utils.uid();
		text.expire = text.expire || messageBox.expire;
		return text;
	}

	var alertBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "confirm";
		return alertPopup(text);
	};
	var confirmBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return confirmPopup(text);
	};
	var modalBox = function () {
		var text = box_params.apply(this, arguments);
		text.type = text.type || "alert";
		return boxPopup(text);
	};
	modalBox.hide = function (node) {
		while (node && node.getAttribute && !node.getAttribute(boxAttribute))
			node = node.parentNode;
		if (node && node.parentNode) {
			var popup = node.$msgPopup;
			if (popup) {
				node.$msgPopup = null;
				// removes the node and the backdrop, pops the modal stack,
				// restores focus, detaches everything
				popup.destroy();
			} else {
				node.parentNode.removeChild(node);
			}

			gantt.callEvent("onAfterMessagePopup", [node]);
		}
	};

	modalBox.focus = function (node) {
		setTimeout(function () {
			var focusable = domHelpers.getFocusableNodes(node);
			if (focusable.length) {
				if (focusable[0].focus) focusable[0].focus();
			}
		}, 1);
	};

	var messageBox = function (text, type, expire, id) {
		text = params.apply(this, arguments);
		text.type = text.type || "info";

		var subtype = text.type.split("-")[0];
		switch (subtype) {
			case "alert":
				return alertPopup(text);
			case "confirm":
				return confirmPopup(text);
			case "modalbox":
				return boxPopup(text);
			default:
				return info(text);
		}
	};

	messageBox.seed = (new Date()).valueOf();
	messageBox.uid = utils.uid;
	messageBox.expire = 4000;
	messageBox.keyboard = true;
	messageBox.position = "top";
	messageBox.pull = {};
	messageBox.timers = {};

	messageBox.hideAll = function () {
		for (var key in messageBox.pull)
			messageBox.hide(key);
	};
	messageBox.hide = function (id) {
		var obj = messageBox.pull[id];
		if (obj && obj.parentNode) {
			window.setTimeout(function () {
				obj.parentNode.removeChild(obj);
				obj = null;
			}, 2000);
			obj.className += " hidden";

			if (messageBox.timers[id])
				window.clearTimeout(messageBox.timers[id]);
			delete messageBox.pull[id];
		}
	};

	var popups = [];
	gantt.attachEvent("onMessagePopup", function(box){
		popups.push(box);
	});
	gantt.attachEvent("onAfterMessagePopup", function(box){
		for(var i = 0; i < popups.length; i++){
			if(popups[i] === box){
				popups.splice(i, 1);
				i--;
			}
		}
	});

	gantt.attachEvent("onDestroy", function(){
		for(var i = 0; i < popups.length; i++){
			if(popups[i].$msgPopup){
				popups[i].$msgPopup.destroy();
				popups[i].$msgPopup = null;
			} else if(popups[i].parentNode){
				popups[i].parentNode.removeChild(popups[i]);
			}
		}
		popups = null;

		if(messageBox.area && messageBox.area.parentNode){
			messageBox.area.parentNode.removeChild(messageBox.area);
		}
		messageBox = null;
	});

	return {
		alert: alertBox,
		confirm: confirmBox,
		message: messageBox,
		modalbox: modalBox
	};
};
