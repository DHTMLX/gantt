import uiFactory from "./ui_factory";
import mouseEvents from "./mouse";
import createLayers from "./gantt_layers";
import Cell from "./layout/cell";
import Layout from "./layout/layout";
import ViewLayout from "./layout/view_layout";
import ViewCell from "./layout/view_cell";
import Resizer from "./layout/resizer_cell";
import Scrollbar from "./layout/scrollbar_cell";
import Timeline from "./timeline/timeline";
import Grid from "./grid/grid";
import ResourceGrid from "./grid/resource_grid";
import ResourceTimeline from "./timeline/resource_timeline";
import ResourceHistogram from "./timeline/resource_histogram";


import gridEditorsFactory from "./grid/editors/controller";

import renderTaskBar from "./render/task_bar_smart_render";
import renderTimedProjectBar from "./render/task_project_smart_render";
import renderSplitTaskBar from "./render/task_split_render";
import renderRollupTaskBar from "./render/task_rollup_render";
import renderTaskBg from "./render/task_bg_render";
import renderLink from "./render/link_render";
import gridRenderer from "./render/task_grid_line_render";
import resourceMatrixRenderer from "./render/resource_matrix_render";
import resourceHistogramRenderer from "./render/resource_histogram_render";
import gridTaskRowResizerRenderer from "./render/task_grid_row_resize_render";
import renderConstraints from "./render/task_constraints_render";
import renderDeadline from "./render/task_deadline_render";
import renderLevelingDelay from "./render/task_leveling_delay_render";
import renderBaselines from "./render/task_baselines_render";
import mainGridInitializer from "./grid/main_grid_initializer";
import mainTimelineInitializer from "./timeline/main_timeline_initializer";
import mainLayoutInitializer from "./main_layout_initializer";

function initUI(gantt){
	function attachInitializer(view, initializer){
		var ext = initializer(gantt);
		if(ext.onCreated)
			ext.onCreated(view);
		view.attachEvent("onReady", function(){
			if(ext.onInitialized)
				ext.onInitialized(view);
		});
		view.attachEvent("onDestroy", function(){
			if(ext.onDestroyed)
				ext.onDestroyed(view);
		});
	}

	var factory = uiFactory.createFactory(gantt);
	factory.registerView("cell", Cell);
	factory.registerView("resizer", Resizer);
	factory.registerView("scrollbar", Scrollbar);
	factory.registerView("layout", Layout, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "main"){
			attachInitializer(view, mainLayoutInitializer);
		}
	});
	factory.registerView("viewcell", ViewCell);
	factory.registerView("multiview", ViewLayout);
	factory.registerView("timeline", Timeline, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "timeline" || view.$config.bind == "task"){
			attachInitializer(view, mainTimelineInitializer);
		}
	});
	factory.registerView("grid", Grid, function(view){
		var id = view.$config ? view.$config.id : null;
		if(id === "grid" || view.$config.bind == "task"){
			attachInitializer(view, mainGridInitializer);
		}
	});

	factory.registerView("resourceGrid", ResourceGrid);
	factory.registerView("resourceTimeline", ResourceTimeline);
	factory.registerView("resourceHistogram", ResourceHistogram);

	var layersEngine = createLayers(gantt);

	var inlineEditors = gridEditorsFactory(gantt);

	gantt.ext.inlineEditors = inlineEditors;
	gantt.ext._inlineEditors = inlineEditors;
	inlineEditors.init(gantt);

	return {
		factory:factory,
		mouseEvents: mouseEvents.init(gantt),
		layersApi: layersEngine.init(),
		render:{
			gridLine: function(){
				return gridRenderer(gantt);
			},
			taskBg: function(){
				return renderTaskBg(gantt);
			},
			taskBar: function(){
				return renderTaskBar(gantt);
			},
			timedProjectBar: function(){
				return renderTimedProjectBar(gantt);
			},
			taskRollupBar: function() {
				return renderRollupTaskBar(gantt);
			},
			taskSplitBar: function(){
				return renderSplitTaskBar(gantt);
			},
			taskConstraints: function(){
				return renderConstraints(gantt);
			},
			taskDeadline: function(){
				return renderDeadline(gantt);
			},
			taskLevelingDelay: function(){
				return renderLevelingDelay(gantt);
			},
			taskBaselines: function(){
				return renderBaselines(gantt);
			},
			link: function(){
				return renderLink(gantt);
			},
			resourceRow: function(){
				return resourceMatrixRenderer(gantt);
			},
			resourceHistogram: function(){
				return resourceHistogramRenderer(gantt);
			},
			gridTaskRowResizer: function(){
				return gridTaskRowResizerRenderer(gantt);
			}
		},
		layersService: {
			getDataRender: function(name){
				return layersEngine.getDataRender(name, gantt);
			},
			createDataRender: function(config){
				return layersEngine.createDataRender(config, gantt);
			}
		}
	};
}

export default {
	init: initUI
};