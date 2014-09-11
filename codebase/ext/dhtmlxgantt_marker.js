/*
@license

dhtmlxGantt v.3.0.0 Stardard
This software is covered by GPL license. You also can obtain Commercial or Enterprise license to use it in non-GPL project - please contact sales@dhtmlx.com. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._markers||(gantt._markers={}),gantt.config.show_markers=!0,gantt.attachEvent("onGanttReady",function(){function t(t){if(!gantt.config.show_markers)return!1;if(!t.start_date)return!1;var r=document.createElement("div");r.setAttribute("marker_id",t.id);var e="gantt_marker";gantt.templates.marker_class&&(e+=" "+gantt.templates.marker_class(t)),t.css&&(e+=" "+t.css),t.title&&(r.title=t.title),r.className=e;var a=gantt.posFromDate(t.start_date);if(r.style.left=a+"px",r.style.height=Math.max(gantt._y_from_ind(gantt._order.length),0)+"px",t.end_date){var n=gantt.posFromDate(t.end_date);
r.style.width=Math.max(n-a,0)+"px"}return t.text&&(r.innerHTML="<div class='gantt_marker_content' >"+t.text+"</div>"),r}var r=document.createElement("div");r.className="gantt_marker_area",gantt.$task_data.appendChild(r),gantt.$marker_area=r,gantt._markerRenderer=gantt._task_renderer("markers",t,gantt.$marker_area,null)}),gantt.attachEvent("onDataRender",function(){gantt.renderMarkers()}),gantt.getMarker=function(t){return this._markers?this._markers[t]:null},gantt.addMarker=function(t){return t.id=t.id||dhtmlx.uid(),this._markers[t.id]=t,t.id
},gantt.deleteMarker=function(t){return this._markers&&this._markers[t]?(delete this._markers[t],!0):!1},gantt.updateMarker=function(t){this._markerRenderer&&this._markerRenderer.render_item(t)},gantt.renderMarkers=function(){if(!this._markers)return!1;if(!this._markerRenderer)return!1;var t=[];for(var r in this._markers)t.push(this._markers[r]);return this._markerRenderer.render_items(t),!0};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map