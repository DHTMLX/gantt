export default function(gantt){
	var htmlTags = new RegExp("<(?:.|\n)*?>", "gm");
	var extraSpaces = new RegExp(" +", "gm");

	function stripHTMLLite(htmlText){
		return (htmlText + "")
			.replace(htmlTags, " ").
			replace(extraSpaces, " ");
	}

	var singleQuotes = new RegExp("'", "gm");
	function escapeQuotes(text){
		return (text + "").replace(singleQuotes, "&#39;");
	}

	function labels(){
		return gantt.ext.accessibility.labels;
	}

	function gridSemantics(){
		const accessibility = gantt.config.accessibility;
		return accessibility ? accessibility.grid_semantics !== false : true;
	}

	gantt._waiAria = {
		getAttributeString: function(attr){
			var attributes = [" "];
			for(var i in attr){
				var text = escapeQuotes(stripHTMLLite(attr[i]));
				attributes.push(i + "='" + text + "'");
			}
			attributes.push(" ");
			return attributes.join(" ");

		},

		getTimelineCellAttr:function(dateString, date, scale){

			const label = labels().timelineCell(date, scale, dateString);
			return gantt._waiAria.getAttributeString({"role": "columnheader", "aria-label": label});
		},

		getTimelineScaleContainerAttr:function(){
			return gantt._waiAria.getAttributeString({"role": "table"});
		},

		getTimelineScaleRowAttr:function(){
			return gantt._waiAria.getAttributeString({"role": "row"});
		},

		_taskCommonAttr: function(task, div, getLabel){

			if(!(task.start_date && task.end_date))
				return;

			div.setAttribute("aria-label", stripHTMLLite(getLabel(task)));

			if(task.$dataprocessor_class){
				div.setAttribute("aria-busy", true);
			}

		},

		setTaskBarAttr: function(task, div){
			this._taskCommonAttr(task, div, labels().taskBar);

			// task bars are complex elements that should be treated as a single element
			div.setAttribute("role", "img");
		},

	_cellStateAttr: function(task){
			const attrs = {
				"aria-selected": gantt.isSelectedTask(task.id) ? "true" : "false"
			};

			if(gantt.hasChild(task.id)){
				attrs["aria-expanded"] = task.$open ? "true" : "false";
			}

			return attrs;
		},

		_rowStateAttr: function(task, store){
			const attrs = this._cellStateAttr(task);

			attrs["aria-level"] = task.$level + 1 || 1;

			// getBranchIndex/hasChild answer this in O(1) off the branch position
			// index; getChildren() would copy the whole sibling branch per row
			if(gridSemantics() && store && store.exists(task.id) && typeof store.getParent === "function" && typeof store.getBranchIndex === "function"){
				const index = store.getBranchIndex(task.id);
				if(index !== -1){
					attrs["aria-posinset"] = index + 1;
					attrs["aria-setsize"] = store.hasChild(store.getParent(task.id)) || 0;
				}

				const rowIndex = typeof store.getIndexById === "function" ? store.getIndexById(task.id) : -1;
				if(rowIndex !== -1){
					attrs["aria-rowindex"] = rowIndex + 1;
				}
			}

			return attrs;
		},

		taskRowAttr: function(task, div, store){

			this._taskCommonAttr(task, div, labels().taskRow);

			div.setAttribute("role", "row");

			const stateAttrs = this._rowStateAttr(task, store);
			for(const name in stateAttrs){
				div.setAttribute(name, stateAttrs[name]);
			}
		},

		linkAttr: function(link, div){

			// links are complex elements that should be treated as a single element
			div.setAttribute("role", "img");

			div.setAttribute("aria-label", stripHTMLLite(labels().link(link)));
		},

		resourceRowAttr: function(resource, div, store){
			div.setAttribute("aria-label", stripHTMLLite(labels().resourceRow(resource)));
			div.setAttribute("role", "row");
			div.setAttribute("aria-level", resource.$level + 1 || 1);

			if(store && store.hasChild && store.hasChild(resource.id)){
				div.setAttribute("aria-expanded", resource.$open ? "true" : "false");
			}

			if(gridSemantics() && store && store.exists(resource.id) && typeof store.getParent === "function" && typeof store.getBranchIndex === "function"){
				const index = store.getBranchIndex(resource.id);
				if(index !== -1){
					div.setAttribute("aria-posinset", index + 1);
					div.setAttribute("aria-setsize", store.hasChild(store.getParent(resource.id)) || 0);
				}
			}
		},

		resourceCellAttr: function(resource, date, value, div){
			div.setAttribute("role", "gridcell");
			div.setAttribute("aria-label", stripHTMLLite(labels().resourceCell(resource, date, value)));
		},

		resourceBarsAttr: function(div){
			div.setAttribute("aria-hidden", "true");
		},

		resourceTimelineAttr: function(div){
			div.setAttribute("role", "grid");
		},

		resourceTimelineRowAttr: function(resource, div){
			div.setAttribute("role", "row");
			div.setAttribute("aria-label", stripHTMLLite(labels().resourceRow(resource)));
		},

		gridSeparatorAttr: function(div){
			// the only valid role for the grid header
			div.setAttribute("role", "columnheader");
		},
		rowResizerAttr: function(div){
			// the only valid role for the grid header
			div.setAttribute("role", "row");
		},

		lightboxHiddenAttr: function(div){
			div.setAttribute("aria-hidden", "true");
		},

		lightboxVisibleAttr: function(div){
			div.setAttribute("aria-hidden", "false");
		},

		lightboxAttr: function(div){
			div.setAttribute("role", "dialog");
			div.setAttribute("aria-modal", "true");
			div.setAttribute("aria-hidden", "true");
			div.firstChild.setAttribute("role", "heading");
			div.firstChild.setAttribute("aria-level", "1");
		},

		lightboxButtonAttrString:function(buttonName){
			return this.getAttributeString({"role":"button", "aria-label":gantt.locale.labels[buttonName], "tabindex":"0"});
		},

		lightboxHeader: function(div, headerText){
			div.setAttribute("aria-label", headerText);
		},

		lightboxSelectAttrString: function(time_option){
			let label = "";

			switch (time_option) {
				case "%Y":
					label = gantt.locale.labels.years;
					break;
				case "%m":
					label = gantt.locale.labels.months;
					break;
				case "%d":
					label = gantt.locale.labels.days;
					break;
				case "%H:%i":
					label = gantt.locale.labels.hours + gantt.locale.labels.minutes;
					break;
				default:
					break;
			}

			return gantt._waiAria.getAttributeString({"aria-label": label});
		},

		lightboxDurationInputAttrString: function(section){
			return this.getAttributeString({
				"aria-label": gantt.locale.labels.column_duration,
				"aria-valuemin": "0",
				"role": "spinbutton"
			});
		},

		lightboxDurationInputValueAttr: function(input, value, text){
			input.setAttribute("aria-valuenow", value);
			if(text){
				input.setAttribute("aria-valuetext", text);
			}else{
				input.removeAttribute("aria-valuetext");
			}
		},

		lightboxTextareaAttrString: function(section){
			const label = (section && (section.label || gantt.locale.labels["section_" + section.name] || section.name)) || "";
			return this.getAttributeString({"aria-label": label});
		},

		inlineEditorAttr: function(div){
			div.setAttribute("role", "row");
		},

		inlineEditorInputAttr: function(placeholder, column){
			if(!placeholder || !column){
				return;
			}
			var input = placeholder.querySelector("input, textarea, select, [role='combobox'], [role='spinbutton']");
			if(!input || input.getAttribute("aria-label") || input.getAttribute("aria-labelledby")){
				return;
			}
			var label = stripHTMLLite(column.label || column.name || "").trim();
			if(label){
				input.setAttribute("aria-label", label);
			}
		},

		gridAttrString: function(){
			return [
				" role='treegrid'",
				"aria-label='" + escapeQuotes(gantt.locale.labels.aria_grid || "") + "'",
				gantt.config.multiselect ? "aria-multiselectable='true'" : "aria-multiselectable='false'",
				" "
			].join(" ");
		},

		gridRowCountAttr: function(gridEl, store){
			if(!gridEl){
				return;
			}
			if(!gridSemantics() || !store || typeof store.countVisible !== "function"){
				gridEl.removeAttribute("aria-rowcount");
				return;
			}
			gridEl.setAttribute("aria-rowcount", store.countVisible());
		},

		gridColCountAttr: function(gridEl, count){
			if(!gridEl){
				return;
			}
			if(!gridSemantics()){
				gridEl.removeAttribute("aria-colcount");
				return;
			}
			gridEl.setAttribute("aria-colcount", count);
		},


		gridScaleRowAttrString: function(){
			return "role='row'";
		},

		gridScaleCellAttrString: function(column, label, addDisabled){
			var attrs = "";
			if(column.name == "add"){
				// a more precise role is button, but it is not valid for the grid header
				var addAttributes = {"role":"columnheader", "aria-label": gantt.locale.labels.new_task};
				if (addDisabled) {
					addAttributes["aria-disabled"] = "true";
				}
				attrs = this.getAttributeString(addAttributes);
			}else{

				var attributes = {
					"role":"columnheader",
					"aria-label": gantt.config.external_render && gantt.config.external_render.isElement(label) ? "" : label
				};

				if(gantt._sort && gantt._sort.name == column.name){
					if(gantt._sort.direction == "asc"){
						attributes["aria-sort"] = "ascending";
					}else{
						attributes["aria-sort"] = "descending";
					}
				}

				attrs = this.getAttributeString(attributes);
			}
			return attrs;
		},

		gridDataAttrString: function(){
			return "role='rowgroup'";
		},

		reorderMarkerAttr: function(div){
			div.setAttribute("role", "grid");
			div.firstChild.removeAttribute("aria-level");
		},

		gridCellAttrString: function(column, textValue, task, store, colIndex){
			var ariaLabel = labels().gridCell(column, textValue, task);
			var attributes = {"role":"gridcell", "aria-label": ariaLabel};
			if(!column.editor || gantt.isReadonly(task)){
				attributes["aria-readonly"] = true;
			}

			const stateAttrs = this._cellStateAttr(task);
			for(const name in stateAttrs){
				attributes[name] = stateAttrs[name];
			}

			if(gridSemantics()){
				if(typeof colIndex === "number"){
					attributes["aria-colindex"] = colIndex + 1;
				}
				const rowIndex = store && typeof store.getIndexById === "function" ? store.getIndexById(task.id) : -1;
				if(rowIndex !== -1){
					attributes["aria-rowindex"] = rowIndex + 1;
				}
			}

			return this.getAttributeString(attributes);
		},

		gridAddButtonAttrString: function(column, disabled){
			var attributes = {"role":"button", "aria-label": gantt.locale.labels.new_task};
			if (disabled) {
				attributes["aria-disabled"] = "true";
			}
			return this.getAttributeString(attributes);
		},

		gridToggleButtonAttrString: function(){
			return this.getAttributeString({"role":"button", "aria-label": gantt.locale.labels.aria_toggle_row});
		},

		gridDecorativeIconAttrString: function(){
			return this.getAttributeString({"aria-hidden": "true"});
		},

		messageButtonAttrString: function(buttonLabel){
			return "tabindex='0' role='button' aria-label='"+buttonLabel+"'";
		},

		messageInfoAttr: function(div){
			div.setAttribute("role", "alert");
			//div.setAttribute("tabindex", "-1");
		},

		messageModalAttr: function(div, uid, describedById){
			div.setAttribute("role", "dialog");
			if(uid){
				div.setAttribute("aria-labelledby", uid);
			}
			if(describedById){
				div.setAttribute("aria-describedby", describedById);
			}

		//	div.setAttribute("tabindex", "-1");
		},

		quickInfoAttr: function(div){
			div.setAttribute("role", "dialog");
		},

		quickInfoHeaderAttrString: function(){
			return " role='heading' aria-level='1' ";
		},

		quickInfoHeader: function(div, header){
			const label = (header && header.trim()) ? header : gantt.locale.labels.aria_dialog_quickinfo;
			div.setAttribute("aria-label", label);
		},

		quickInfoButtonAttrString: function(label){
			return gantt._waiAria.getAttributeString({"role":"button", "aria-label":label, "tabindex":"0"});
		},

		tooltipAttr: function(div){
			div.setAttribute("role", "tooltip");
		},

		tooltipVisibleAttr: function(div){
			div.setAttribute("aria-hidden", "false");
		},

		tooltipHiddenAttr: function(div){
			div.setAttribute("aria-hidden", "true");
		}
	};

	function isDisabled(){
		return !gantt.ext.accessibility.isEnabled();
	}

	for(var i in gantt._waiAria){
		gantt._waiAria[i] = (function(payload){
			return function(){
				if(isDisabled()){
					return "";
				}
				return payload.apply(this, arguments);
			};
		})(gantt._waiAria[i]);
	}


};
