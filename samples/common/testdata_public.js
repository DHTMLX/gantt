var demo_tasks = {
	"data":[
		{"id":11, "text":"Project #1", "start_date":"03-08-2027", "duration":"11", "progress": 0.6, "open": true},
		{"id":1, "text":"Project #2", "start_date":"07-08-2027", "duration":"18", "progress": 0.4, "open": true},

		{"id":2, "text":"Task #1", "start_date":"08-08-2027", "duration":"8", "parent":"1", "progress":0.5, "open": true},
		{"id":3, "text":"Task #2", "start_date":"17-08-2027", "duration":"8", "parent":"1", "progress": 0.6, "open": true},
		{"id":4, "text":"Task #3", "start_date":"19-08-2027", "duration":"6", "parent":"1", "progress": 0.5, "open": true},
		{"id":5, "text":"Task #1.1", "start_date":"08-08-2027", "duration":"7", "parent":"2", "progress": 0.6, "open": true},
		{"id":6, "text":"Task #1.2", "start_date":"09-08-2027", "duration":"7", "parent":"2", "progress": 0.6, "open": true},
		{"id":7, "text":"Task #2.1", "start_date":"17-08-2027", "duration":"8", "parent":"3", "progress": 0.6, "open": true},
		{"id":8, "text":"Task #3.1", "start_date":"20-08-2027", "duration":"5", "parent":"4", "progress": 0.5, "open": true},
		{"id":9, "text":"Task #3.2", "start_date":"20-08-2027", "duration":"4", "parent":"4", "progress": 0.5, "open": true},
		{"id":10, "text":"Task #3.3", "start_date":"20-08-2027", "duration":"3", "parent":"4", "progress": 0.5, "open": true},

		{"id":12, "text":"Task #1", "start_date":"09-08-2027", "duration":"5", "parent":"11", "progress": 1, "open": true},
		{"id":13, "text":"Task #2", "start_date":"08-08-2027", "duration":"7", "parent":"11", "progress": 0.5, "open": true},
		{"id":14, "text":"Task #3", "start_date":"08-08-2027", "duration":"6", "parent":"11", "progress": 0.8, "open": true},
		{"id":15, "text":"Task #4", "start_date":"08-08-2027", "duration":"5", "parent":"11", "progress": 0.2, "open": true},
		{"id":16, "text":"Task #5", "start_date":"08-08-2027", "duration":"7", "parent":"11", "progress": 0, "open": true},

		{"id":17, "text":"Task #2.1", "start_date":"09-08-2027", "duration":"2", "parent":"13", "progress": 1, "open": true},
		{"id":18, "text":"Task #2.2", "start_date":"12-08-2027", "duration":"3", "parent":"13", "progress": 0.8, "open": true},
		{"id":19, "text":"Task #2.3", "start_date":"16-08-2027", "duration":"4", "parent":"13", "progress": 0.2, "open": true},
		{"id":20, "text":"Task #2.4", "start_date":"16-08-2027", "duration":"4", "parent":"13", "progress": 0, "open": true},
		{"id":21, "text":"Task #4.1", "start_date":"09-08-2027", "duration":"4", "parent":"15", "progress": 0.5, "open": true},
		{"id":22, "text":"Task #4.2", "start_date":"09-08-2027", "duration":"4", "parent":"15", "progress": 0.1, "open": true},
		{"id":23, "text":"Task #4.3", "start_date":"09-08-2027", "duration":"5", "parent":"15", "progress": 0, "open": true}
	],
	"links":[
		{"id":"1","source":"1","target":"2","type":"1"},
		{"id":"2","source":"2","target":"3","type":"0"},
		{"id":"3","source":"3","target":"4","type":"0"},
		{"id":"4","source":"2","target":"5","type":"2"},
		{"id":"5","source":"2","target":"6","type":"2"},
		{"id":"6","source":"3","target":"7","type":"2"},
		{"id":"7","source":"4","target":"8","type":"2"},
		{"id":"8","source":"4","target":"9","type":"2"},
		{"id":"9","source":"4","target":"10","type":"2"},
		{"id":"10","source":"11","target":"12","type":"1"},
		{"id":"11","source":"11","target":"13","type":"1"},
		{"id":"12","source":"11","target":"14","type":"1"},
		{"id":"13","source":"11","target":"15","type":"1"},
		{"id":"14","source":"11","target":"16","type":"1"},
		{"id":"15","source":"13","target":"17","type":"1"},
		{"id":"16","source":"17","target":"18","type":"0"},
		{"id":"17","source":"18","target":"19","type":"0"},
		{"id":"18","source":"19","target":"20","type":"0"},
		{"id":"19","source":"15","target":"21","type":"2"},
		{"id":"20","source":"15","target":"22","type":"2"},
		{"id":"21","source":"15","target":"23","type":"2"}
	]
};

var users_data = {
	"data":[
		{"id":1, "text":"Project #1", "start_date":"03-04-2027", "duration":"11", "progress": 0.6, "open": true, "users": ["John", "Mike", "Anna"], "priority": "2"},
		{"id":2, "text":"Task #1", "start_date":"05-04-2027", "duration":"5", "parent":"1", "progress": 1, "open": true, "users": ["John", "Mike"], "priority": "1"},
		{"id":3, "text":"Task #2", "start_date":"04-04-2027", "duration":"7", "parent":"1", "progress": 0.5, "open": true, "users": ["Anna"], "priority": "1"},
		{"id":4, "text":"Task #3", "start_date":"04-04-2027", "duration":"6", "parent":"1", "progress": 0.8, "open": true, "users": ["Mike", "Anna"], "priority": "2"},
		{"id":5, "text":"Task #4", "start_date":"04-04-2027", "duration":"5", "parent":"1", "progress": 0.2, "open": true, "users": ["John"], "priority": "3"},
		{"id":6, "text":"Task #5", "start_date":"04-04-2027", "duration":"7", "parent":"1", "progress": 0, "open": true, "users": ["John"], "priority": "2"},
		{"id":7, "text":"Task #2.1", "start_date":"05-04-2027", "duration":"2", "parent":"3", "progress": 1, "open": true, "users": ["Mike", "Anna"], "priority": "2"},
		{"id":8, "text":"Task #2.2", "start_date":"08-04-2027", "duration":"3", "parent":"3", "progress": 0.8, "open": true, "users": ["Anna"], "priority": "3"},
		{"id":9, "text":"Task #2.3", "start_date":"12-04-2027", "duration":"4", "parent":"3", "progress": 0.2, "open": true, "users": ["Mike", "Anna"], "priority": "1"},
		{"id":10, "text":"Task #2.4", "start_date":"12-04-2027", "duration":"4", "parent":"3", "progress": 0, "open": true, "users": ["John", "Mike"], "priority": "1"},
		{"id":11, "text":"Task #4.1", "start_date":"05-04-2027", "duration":"4", "parent":"5", "progress": 0.5, "open": true, "users": ["John", "Anna"], "priority": "3"},
		{"id":12, "text":"Task #4.2", "start_date":"05-04-2027", "duration":"4", "parent":"5", "progress": 0.1, "open": true, "users": ["John"], "priority": "3"},
		{"id":13, "text":"Task #4.3", "start_date":"05-04-2027", "duration":"5", "parent":"5", "progress": 0, "open": true, "users": ["Anna"], "priority": "3"}
	],
	"links":[
		{"id":"10","source":"11","target":"12","type":"1"},
		{"id":"11","source":"11","target":"13","type":"1"}
	]
};

var projects_with_milestones = {
	"tasks":[
		{"id":11, "text":"Project #1", "type":"project", "progress": 0.6, "open": true},

		{"id":12, "text":"Task #1", "start_date":"05-04-2027", "duration":"5", "parent":"11", "progress": 1, "open": true},
		{"id":13, "text":"Task #2", "start_date":"05-04-2027", "type":"project", "parent":"11", "progress": 0.5, "open": true},
		{"id":14, "text":"Task #3", "start_date":"04-04-2027", "duration":"6", "parent":"11", "progress": 0.8, "open": true},
		{"id":15, "text":"Task #4", "type": "project", "parent":"11", "progress": 0.2, "open": true},
		{"id":16, "text":"Final milestone", "start_date":"17-04-2027", "type": "milestone", "parent":"11", "progress": 0, "open": true},

		{"id":17, "text":"Task #2.1", "start_date":"05-04-2027", "duration":"2", "parent":"13", "progress": 1, "open": true},
		{"id":18, "text":"Task #2.2", "start_date":"08-04-2027", "duration":"3", "parent":"13", "progress": 0.8, "open": true},
		{"id":19, "text":"Task #2.3", "start_date":"12-04-2027", "duration":"4", "parent":"13", "progress": 0.2, "open": true},
		{"id":20, "text":"Task #2.4", "start_date":"12-04-2027", "duration":"4", "parent":"13", "progress": 0, "open": true},
		{"id":21, "text":"Task #4.1", "start_date":"05-04-2027", "duration":"4", "parent":"15", "progress": 0.5, "open": true},
		{"id":22, "text":"Task #4.2", "start_date":"05-04-2027", "duration":"4", "parent":"15", "progress": 0.1, "open": true},
		{"id":23, "text":"Intermediate milestone", "start_date":"16-04-2027", "type": "milestone", "parent":"15", "progress": 0, "open": true}
	],
	"links":[
		{"id":"10","source":"11","target":"12","type":"1"},
		{"id":"11","source":"11","target":"13","type":"1"},
		{"id":"12","source":"11","target":"14","type":"1"},
		{"id":"13","source":"11","target":"15","type":"1"},
		{"id":"14","source":"23","target":"16","type":"0"},
		{"id":"15","source":"13","target":"17","type":"1"},
		{"id":"16","source":"17","target":"18","type":"0"},
		{"id":"17","source":"18","target":"19","type":"0"},
		{"id":"18","source":"19","target":"20","type":"0"},
		{"id":"19","source":"15","target":"21","type":"2"},
		{"id":"20","source":"15","target":"22","type":"2"},
		{"id":"21","source":"15","target":"23","type":"0"}
	]
};

var projects_milestones_critical = {
	data: [
		{ id: 1, text: "Office itinerancy", type: "project", progress: 0.4, open: true, start_date: "04-04-2027 00:00", duration: 17, parent: 0 },
		{ id: 2, text: "Office facing", type: "project", start_date: "04-04-2027 00:00", duration: 5, progress: 0.6, parent: 1, open: true},
		{ id: 5, text: "Interior office", type: "task", start_date: "04-04-2027 00:00", duration: 3, parent: 2, progress: 0.6, open: true},
		{ id: 6, text: "Air conditioners check", type: "task",  start_date: "07-04-2027 00:00", duration: 2, parent: 2, progress: 0.29, open: true},
		{ id: 3, text: "Furniture installation", type: "project", start_date: "10-04-2027 00:00", duration: 2, parent: 1, progress: 0.6, open: false},
		{ id: 7, text: "Workplaces preparation", type: "task",  start_date: "10-04-2027 00:00", duration: 2, parent: 3, progress: 0.6, open: true},
		{ id: 4, text: "The employee relocation", type: "project", start_date: "12-04-2027 00:00", duration: 9, parent: 1, progress: 0.5, open: true},
		{ id: 8, text: "Preparing workplaces", type: "task",  start_date: "12-04-2027 00:00", duration: 3, parent: 4, progress: 0.5, open: true},
		{ id: 9, text: "Workplaces importation", type: "task",  start_date: "15-04-2027 00:00", duration: 3, parent: 4, progress: 0.5, open: true},
		{ id: 10, text: "Workplaces exportation", type: "task",  start_date: "18-04-2027 00:00", duration: 3, parent: 4, progress: 0.5, open: true},
		{ id: 11, text: "Product launch", type: "project", progress: 0.6, open: true, start_date: "04-04-2027 00:00", duration: 17, parent: 0 },
		{ id: 12, text: "Perform Initial testing", type: "task",  start_date: "04-04-2027 00:00", duration: 5, parent: 11, progress: 1, open: true},
		{ id: 13, text: "Development", type: "project", start_date: "05-04-2027 00:00", duration: 16, parent: 11, progress: 0.5, open: true},
		{ id: 17, text: "Develop System", type: "task",  start_date: "05-04-2027 00:00", duration: 5, parent: 13, progress: 1, open: true},
		{ id: 25, text: "Beta Release", type: "milestone", start_date: "10-04-2027 00:00", duration: 0, parent: 13, progress: 0, open: true},
		{ id: 18, text: "Integrate System", type: "task",  start_date: "10-04-2027 00:00", duration: 4, parent: 13, progress: 0.8, open: true},
		{ id: 19, text: "Test", type: "task",  start_date: "14-04-2027 00:00", duration: 3, parent: 13, progress: 0.2, open: true},
		{ id: 20, text: "Marketing", type: "task",  start_date: "17-04-2027 00:00", duration: 4, parent: 13, progress: 0, open: true},
		{ id: 14, text: "Analysis", type: "task",  start_date: "04-04-2027 00:00", duration: 4, parent: 11, progress: 0.8, open: true},
		{ id: 15, text: "Design", type: "project", start_date: "08-04-2027 00:00", duration: 6, parent: 11, progress: 0.2, open: true},
		{ id: 21, text: "Design database", type: "task",  start_date: "08-04-2027 00:00", duration: 4, parent: 15, progress: 0.5, open: true},
		{ id: 22, text: "Software design", type: "task",  start_date: "10-04-2027 00:00", duration: 4, parent: 15, progress: 0.1, open: true},
		{ id: 16, text: "Documentation creation", type: "task",  start_date: "13-04-2027 00:00", duration: 5, parent: 11, progress: 0, open: true},
		{ id: 24, text: "Release v1.0", type: "milestone",  start_date: "21-04-2027 00:00", duration: 0, parent: 11, progress: 0, open: true}
	],
	links: [
		{ id: 1, source: "2", target: "3", type: "0"},
		{ id: 2, source: "3", target: "4", type: "0"},
		{ id: 3, source: "17", target: "25", type: "0"},
		{ id: 4, source: "18", target: "19", type: "0"},
		{ id: 5, source: "19", target: "20", type: "0"},
		{ id: 6, source: "13", target: "24", type: "0"},
		{ id: 7, source: "25", target: "18", type: "0"},
		{ id: 8, source: "5", target: "6", type: "0"},
		{ id: 9, source: "8", target: "9", type: "0"},
		{ id: 10, source: "9", target: "10", type: "0"},
		{ id: 11, source: "16", target: "24", type: "0"},
		{ id: 12, source: "14", target: "15", type: "0"}
	]
};

function generateData(count, dateFrom, dateTo, initialDate){
	var tasks =  {
		data:[],
		links:[]
	};

	count = parseInt(count, 10) || 100;

	var date = new Date(initialDate);
	var project_id = 1;
	tasks.data.push({
		id:  project_id,
		text: "Project1",
		start_date: date,
		type: gantt.config.types.project,
		open:true
	});
	for (var i = 1; i < count; i++) {
		date = gantt.date.add(date, 1, "day");
		var task = {
			id: i + 1,
			start_date: date,
			text: "Task " + (i + 1),
			duration: 8,
			parent: project_id
		};

		if(gantt.date.add(date, 8, "day").valueOf() > dateTo.valueOf()){
			date = new Date(dateFrom);
			project_id = i + 1;
			delete task.parent;
			task.open = true;
		}
		tasks.data.push(task);

	}
	return tasks;
}
