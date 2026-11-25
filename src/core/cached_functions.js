/*
 reuse results of functions that can be recalculated during rendering
 greatly increases the rendering speed when critical path enabled
 Sample - 94_dev/critical_path.html

 */
export default function(gantt){

gantt._cached_functions = {
	cache: {},
	mode: false,
	critical_path_mode: false,
	wrap_methods : function(methods, object){
		if(object._prefetch_originals){
			for(var i in object._prefetch_originals){
				object[i] = object._prefetch_originals[i];
			}
		}
		object._prefetch_originals = {};
		for(var i = 0; i < methods.length; i++)
			this.prefetch(methods[i], object);

	},
	prefetch : function(methodname, host){
		var original = host[methodname];
		if(original){
			var optimizer = this;

			host._prefetch_originals[methodname] = original;
			host[methodname] = function get_prefetched_value(){

				var argumentsArray = new Array(arguments.length);
				for (var i = 0, l = arguments.length; i < l; i++) {
					argumentsArray[i] = arguments[i];
				}

				if(optimizer.active){
					var args = optimizer.get_arguments_hash(Array.prototype.slice.call(argumentsArray));
					if(!optimizer.cache[methodname]){
						optimizer.cache[methodname] = {};
					}

					var cached_values = optimizer.cache[methodname];

					if(optimizer.has_cached_value(cached_values, args)){
						return optimizer.get_cached_value(cached_values, args);
					}else{
						var value = original.apply(this, argumentsArray);
						optimizer.cache_value(cached_values, args, value);
						return value;
					}
				}

				return original.apply(this, argumentsArray);
			};
		}
		return original;
	},
	cache_value: function(cache, arguments_hash, value){
		if(this.is_date(value))
			value = new Date(value);
		cache[arguments_hash] = value;
	},
	has_cached_value: function(cache, arguments_hash){
		return cache.hasOwnProperty(arguments_hash);
	},
	get_cached_value: function(cache, arguments_hash){
		var data = cache[arguments_hash];

		//for cached dates - return copy
		if(this.is_date(data)){
			data = new Date(data);
		}
		return data;
	},
	is_date: function(value){
		return (value && value.getUTCDate);
	},
	get_arguments_hash:function(args){
		var values = [];
		for(var i = 0; i < args.length; i++){
			values.push(this.stringify_argument(args[i]));
		}
		return "(" + values.join(";") + ")";
	},
	stringify_argument: function(value){
		//expecting task or link, or any other data entries, dates and primitive values
		var ret = "";
		if(value.id){
			ret = value.id;
		}else if(this.is_date(value)){
			ret = value.valueOf();
		}else{
			ret = value;
		}
		return ret + "";
	},
	activate: function(){
		this.clear();
		this.active = true;
	},
	deactivate: function(){
		this.clear();
		this.active = false;
	},
	clear: function(){
		this.cache = {};
	},

	setup: function(gantt){
		var override_gantt = [];

		var gantt_methods  = [
			'_getProjectEnd'
		];



		if(this.mode == 'auto'){
			if(gantt.config.highlight_critical_path){
				override_gantt = gantt_methods;
			}
		}else if(this.mode === true){
			override_gantt = gantt_methods;
		}

		this.wrap_methods(override_gantt, gantt);

	},
	update_if_changed: function(gantt){
		var changed = (this.critical_path_mode != gantt.config.highlight_critical_path ||
						this.mode !== gantt.config.optimize_render);
		if(changed){
			this.critical_path_mode = gantt.config.highlight_critical_path;
			this.mode = gantt.config.optimize_render;
			this.setup(gantt);
		}
	}
};

function activate(){
	gantt._cached_functions.update_if_changed(gantt);
	if(!gantt._cached_functions.active){
		gantt._cached_functions.activate();
	}
	return true;
}
gantt.attachEvent("onBeforeGanttRender", activate);
gantt.attachEvent("onBeforeDataRender", activate);
gantt.attachEvent("onBeforeSmartRender",  function(){
	activate();
});
gantt.attachEvent("onBeforeParse", activate);
gantt.attachEvent("onDataRender", function(){
	gantt._cached_functions.deactivate();
});
var deactivTimeout = null;
gantt.attachEvent("onSmartRender", function(){
	if(deactivTimeout)
		clearTimeout(deactivTimeout);
	deactivTimeout = setTimeout(function(){
		gantt._cached_functions.deactivate();
	}, 1000);
});

gantt.attachEvent("onBeforeGanttReady", function(){
	gantt._cached_functions.update_if_changed(gantt);
	return true;
});

};