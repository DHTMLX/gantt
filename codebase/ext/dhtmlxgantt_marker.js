/*
@license

dhtmlxGantt v.3.1.1 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._markers||(gantt._markers={}),gantt.config.show_markers=!0,gantt.attachEvent("onClear",function(){gantt._markers={}}),gantt.attachEvent("onGanttReady",function(){function t(t){if(!gantt.config.show_markers)return!1;if(!t.start_date)return!1;var e=document.createElement("div");e.setAttribute("marker_id",t.id);var n="gantt_marker";gantt.templates.marker_class&&(n+=" "+gantt.templates.marker_class(t)),t.css&&(n+=" "+t.css),t.title&&(e.title=t.title),e.className=n;var i=gantt.posFromDate(t.start_date);
if(e.style.left=i+"px",e.style.height=Math.max(gantt._y_from_ind(gantt._order.length),0)+"px",t.end_date){var a=gantt.posFromDate(t.end_date);e.style.width=Math.max(a-i,0)+"px"}return t.text&&(e.innerHTML="<div class='gantt_marker_content' >"+t.text+"</div>"),e}var e=document.createElement("div");e.className="gantt_marker_area",gantt.$task_data.appendChild(e),gantt.$marker_area=e,gantt._markerRenderer=gantt._task_renderer("markers",t,gantt.$marker_area,null)}),gantt.attachEvent("onDataRender",function(){gantt.renderMarkers()
}),gantt.getMarker=function(t){return this._markers?this._markers[t]:null},gantt.addMarker=function(t){return t.id=t.id||dhtmlx.uid(),this._markers[t.id]=t,t.id},gantt.deleteMarker=function(t){return this._markers&&this._markers[t]?(delete this._markers[t],!0):!1},gantt.updateMarker=function(t){this._markerRenderer&&this._markerRenderer.render_item(t)},gantt.renderMarkers=function(){if(!this._markers)return!1;if(!this._markerRenderer)return!1;var t=[];for(var e in this._markers)t.push(this._markers[e]);
return this._markerRenderer.render_items(t),!0};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map