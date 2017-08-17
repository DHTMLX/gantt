/*
@license

dhtmlxGantt v.4.2.1 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._markers||(gantt._markers={}),gantt.config.show_markers=!0,gantt.attachEvent("onClear",function(){gantt._markers={}}),gantt.attachEvent("onGanttReady",function(){function t(t){if(!gantt.config.show_markers)return!1;if(!t.start_date)return!1;var e=gantt.getState();if(!(+t.start_date>+e.max_date||+t.end_date&&+t.end_date<+e.min_date||+t.start_date<+e.min_date)){var n=document.createElement("div");n.setAttribute("marker_id",t.id);var a="gantt_marker";gantt.templates.marker_class&&(a+=" "+gantt.templates.marker_class(t)),
t.css&&(a+=" "+t.css),t.title&&(n.title=t.title),n.className=a;var i=gantt.posFromDate(t.start_date);if(n.style.left=i+"px",n.style.height=Math.max(gantt._y_from_ind(gantt._order.length),0)+"px",t.end_date){var s=gantt.posFromDate(t.end_date);n.style.width=Math.max(s-i,0)+"px"}return t.text&&(n.innerHTML="<div class='gantt_marker_content' >"+t.text+"</div>"),n}}var e=document.createElement("div");e.className="gantt_marker_area",gantt.$task_data.appendChild(e),gantt.$marker_area=e,gantt._markerRenderer=gantt._task_renderer("markers",t,gantt.$marker_area,null);
}),gantt.attachEvent("onDataRender",function(){gantt.renderMarkers()}),gantt.getMarker=function(t){return this._markers?this._markers[t]:null},gantt.addMarker=function(t){return t.id=t.id||gantt.uid(),this._markers[t.id]=t,t.id},gantt.deleteMarker=function(t){return this._markers&&this._markers[t]?(delete this._markers[t],!0):!1},gantt.updateMarker=function(t){this._markerRenderer&&this._markerRenderer.render_item(this.getMarker(t))},gantt._getMarkers=function(){var t=[];for(var e in this._markers)t.push(this._markers[e]);
return t},gantt.renderMarkers=function(){if(!this._markers)return!1;if(!this._markerRenderer)return!1;var t=this._getMarkers();return this._markerRenderer.render_items(t),!0};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map