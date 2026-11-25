export default {
	init: function (controller, grid) {
		var gantt = grid.$gantt;

		gantt.attachEvent("onTaskClick", function (id, e) {
			if (gantt._is_icon_open_click(e))
				return true;
			var state = controller.getState();
			var cell = controller.locateCell(e.target);

			if (cell && controller.getEditorConfig(cell.columnName)) {
				if (controller.isVisible() && state.id == cell.id && state.columnName == cell.columnName) {
					// do nothing if editor is already active in this cell
				} else {
					controller.startEdit(cell.id, cell.columnName);
				}
				return false;
			}
			return true;
		});

		// GS-3482: close the editor before the lightbox opens. The resource grid lives inside the
		// lightbox itself, so its own controller must not close on its own opening.
		if (grid.$config.id !== "GridRL") {
			gantt.attachEvent("onBeforeLightbox", function () {
				if (controller.isVisible()) {
					controller.save();// save() falls back to hide() when nothing was changed
				}
				return true;
			});
		}

		gantt.attachEvent("onEmptyClick", function () {
			if (controller.isVisible() && controller.isChanged()) {
				controller.save();
			} else {
				controller.hide();
			}
			return true;
		});

		gantt.attachEvent("onTaskDblClick", function (id, e) {
			var state = controller.getState();
			var cell = controller.locateCell(e.target);
			if (cell && controller.isVisible() && cell.columnName == state.columnName) {
				//GS-933 probably, we don't need to hide the inline editor because the lightbox cannot be opened if you double-click on an inline editor
				//remove this code later if people don't complain
				//controller.hide();
				return false;
			}
			return true;
		});
	},

	onShow: function (controller, placeholder, grid) {
		var gantt = grid.$gantt;
		

		if(gantt.ext && gantt.ext.keyboardNavigation){
			var keyNav = gantt.ext.keyboardNavigation;
			keyNav.attachEvent("onKeyDown", function(command, e){
				var keyboard = gantt.constants.KEY_CODES;
				var keyCode = e.keyCode;
				var preventKeyNav = false;

				switch (keyCode){
					case keyboard.SPACE:
						if(controller.isVisible()){
							preventKeyNav = true;
						}
						break;
				}
				if (preventKeyNav){
					return false;
				} else{
					return true;
				}
			});
		}
		
		placeholder.onkeydown = function (e) {
			e = e || window.event;

			var keyboard = gantt.constants.KEY_CODES;
			if (e.defaultPrevented || (e.shiftKey && e.keyCode != keyboard.TAB)) {
				return;
			}

			var shouldPrevent = true;
			switch (e.keyCode) {
				case gantt.keys.edit_save:
					controller.save();
					break;
				case gantt.keys.edit_cancel:
					controller.hide();
					break;
				case keyboard.UP:
				case keyboard.DOWN:
					if (controller.isVisible()) {
						controller.hide();
						shouldPrevent = false;
					}
					break;
				case keyboard.TAB:
					if (e.shiftKey) {
						controller.editPrevCell(true);
					} else {
						controller.editNextCell(true);
					}
					break;
				default:
					shouldPrevent = false;
					break;
			}

			if (shouldPrevent) {
				e.preventDefault();
			}
		};
	},
	onHide: function () {

	},

	destroy: function () {

	}
};

