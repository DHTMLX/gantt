var taskData = {
  "data": [
	{ "id": 1, "text": "Office itinerancy", "type": "project", "start_date": "31-03-2027 00:00", "duration": 17, "progress": 0.4, "owner_id": "5", "parent": 0},
	{ "id": 2, "text": "Office facing", "type": "project", "start_date": "31-03-2027 00:00", "duration": 8, "progress": 0.6, "owner_id": "5", "parent": "1"},
	{ "id": 3, "text": "Furniture installation", "type": "project", "start_date": "09-04-2027 00:00", "duration": 8, "parent": "1", "progress": 0.6, "owner_id": "5"},
	{ "id": 4, "text": "The employee relocation", "type": "project", "start_date": "11-04-2027 00:00", "duration": 5, "parent": "1", "progress": 0.5, "owner_id": "5", "priority":3},
	{ "id": 5, "text": "Interior office", "type": "task", "start_date": "01-04-2027 00:00", "duration": 7, "parent": "2", "progress": 0.6, "owner_id": "6", "priority":1},
	{ "id": 6, "text": "Air conditioners check", "type": "task", "start_date": "01-04-2027 00:00", "duration": 7, "parent": "2", "progress": 0.6, "owner_id": "7", "priority":2},
	{ "id": 7, "text": "Workplaces preparation", "type": "task", "start_date": "10-04-2027 00:00", "duration": 8, "parent": "3", "progress": 0.6, "owner_id": "10"},
	{ "id": 8, "text": "Preparing workplaces", "type": "task", "start_date": "12-04-2027 00:00", "duration": 5, "parent": "4", "progress": 0.5, "owner_id": "9", "priority":1},
	{ "id": 9, "text": "Workplaces importation", "type": "task", "start_date": "19-04-2027 00:00", "duration": 4, "parent": "4", "progress": 0.5, "owner_id": "7"},
	{ "id": 10, "text": "Workplaces exportation", "type": "task", "start_date": "25-04-2027 00:00", "duration": 3, "parent": "4", "progress": 0.5, "owner_id": "8", "priority":2},
	{ "id": 11, "text": "Product launch", "type": "project", "progress": 0.6, "start_date": "31-03-2027 00:00", "duration": 13, "owner_id": "5", "parent": 0},
	{ "id": 12, "text": "Perform Initial testing", "type": "task", "start_date": "01-04-2027 00:00", "duration": 5, "parent": "11", "progress": 1, "owner_id": "7"},
	{ "id": 13, "text": "Development", "type": "project", "start_date": "01-04-2027 00:00", "duration": 11, "parent": "11", "progress": 0.5, "owner_id": "5"},
	{ "id": 14, "text": "Analysis", "type": "task", "start_date": "01-04-2027 00:00", "duration": 6, "parent": "11", "progress": 0.8, "owner_id": "5"},
	{ "id": 15, "text": "Design", "type": "project", "start_date": "01-04-2027 00:00", "duration": 5, "parent": "11", "progress": 0.2, "owner_id": "5"},
	{ "id": 16, "text": "Documentation creation", "type": "task", "start_date": "01-04-2027 00:00", "duration": 7, "parent": "11", "progress": 0, "owner_id": "7", "priority":1},
	{ "id": 17, "text": "Develop System", "type": "task", "start_date": "01-04-2027 00:00", "duration": 2, "parent": "13", "progress": 1, "owner_id": "8", "priority":2},
	{ "id": 25, "text": "Beta Release", "type": "milestone", "start_date": "04-04-2027 00:00", "parent": "13", "progress": 0, "owner_id": "5", "duration": 0},
	{ "id": 18, "text": "Integrate System", "type": "task", "start_date": "08-04-2027 00:00", "duration": 2, "parent": "13", "progress": 0.8, "owner_id": "6", "priority":3},
	{ "id": 19, "text": "Test", "type": "task", "start_date": "11-04-2027 00:00", "duration": 4, "parent": "13", "progress": 0.2, "owner_id": "6"},
	{ "id": 20, "text": "Marketing", "type": "task", "start_date": "11-04-2027 00:00", "duration": 4, "parent": "13", "progress": 0, "owner_id": "8", "priority":1},
	{ "id": 21, "text": "Design database", "type": "task", "start_date": "01-04-2027 00:00", "duration": 4, "parent": "15", "progress": 0.5, "owner_id": "6"},
	{ "id": 22, "text": "Software design", "type": "task", "start_date": "01-04-2027 00:00", "duration": 4, "parent": "15", "progress": 0.1, "owner_id": "8", "priority":1},
	{ "id": 23, "text": "Interface setup", "type": "task", "start_date": "01-04-2027 00:00", "duration": 5, "parent": "15", "progress": 0, "owner_id": "8", "priority":1},
	{ "id": 24, "text": "Release v1.0", "type": "milestone", "start_date": "18-04-2027 00:00", "parent": "11", "progress": 0, "owner_id": "5", "duration": 0}

  ],
  "links": [

	{ "id": "2", "source": "2", "target": "3", "type": "0" },
	{ "id": "3", "source": "3", "target": "4", "type": "0" },
	{ "id": "7", "source": "8", "target": "9", "type": "0" },
	{ "id": "8", "source": "9", "target": "10", "type": "0" },
	{ "id": "16", "source": "17", "target": "25", "type": "0" },
	{ "id": "17", "source": "18", "target": "19", "type": "0" },
	{ "id": "18", "source": "19", "target": "20", "type": "0" },
	{ "id": "22", "source": "13", "target": "24", "type": "0" },
	{ "id": "23", "source": "25", "target": "18", "type": "0" }

  ]
}