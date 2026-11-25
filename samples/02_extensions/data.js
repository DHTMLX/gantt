var taskData = {
  "data": [
	{
	  "id": 1,
	  "text": "Office itinerancy",
	  "type": "project",
	  "order": "10",
	  "progress": 0.4,
	  "open": true,
	  "user":"0",
	  "start_date": "06-04-2027 00:00",
	  "duration": 17,
	  "end_date": "23-04-2027 00:00",
	  "parent": 0
	},
	{
	  "id": 2,
	  "text": "Office facing",
	  "type": "project",
	  "start_date": "06-04-2027 00:00",
	  "duration": 8,
	  "order": "10",
	  "progress": 0.6,
	  "user":"0",
	  "parent": "1",
	  "open": true,
	  "end_date": "14-04-2027 00:00"
	},
	{
	  "id": 5,
	  "text": "Interior office",
	  "start_date": "06-04-2027 00:00",
	  "duration": 7,
	  "order": "3",
	  "parent": "2",
	  "progress": 0.8,
	  "open": true,
	  "user":"1",
	  "end_date": "13-04-2027 00:00"
	},
	{
	  "id": 6,
	  "text": "Air conditioners check",
	  "start_date": "07-04-2027 00:00",
	  "duration": 7,
	  "order": "3",
	  "parent": "2",
	  "progress": 0.6,
	  "open": true,
	  "user":"2",
	  "end_date": "14-04-2027 00:00"
	},
	{
	  "id": 3,
	  "text": "Furniture installation",
	  "type": "project",
	  "start_date": "15-04-2027 00:00",
	  "duration": 8,
	  "order": "20",
	  "parent": "1",
	  "progress": 0.8,
	  "user":"0",
	  "open": true,
	  "end_date": "23-04-2027 00:00"
	},
	{
	  "id": 7,
	  "text": "Workplaces preparation",
	  "start_date": "15-04-2027 00:00",
	  "duration": 8,
	  "order": "3",
	  "parent": "3",
	  "progress": 0.6,
	  "user":"0",
	  "open": true,
	  "end_date": "23-04-2027 00:00"
	},
	{
	  "id": 4,
	  "text": "The employee relocation",
	  "type": "project",
	  "start_date": "18-04-2027 00:00",
	  "duration": 5,
	  "order": "30",
	  "parent": "1",
	  "progress": 0.5,
	  "user":"0",
	  "open": true,
	  "end_date": "23-04-2027 00:00"
	},
	{
	  "id": 8,
	  "text": "Preparing workplaces",
	  "start_date": "18-04-2027 00:00",
	  "duration": 5,
	  "order": "3",
	  "parent": "4",
	  "progress": 0.8,
	  "user":"2",
	  "open": true,
	  "end_date": "23-04-2027 00:00"
	},
	{
	  "id": 9,
	  "text": "Workplaces importation",
	  "start_date": "18-04-2027 00:00",
	  "duration": 4,
	  "order": "3",
	  "parent": "4",
	  "progress": 0.7,
	  "user":"0",
	  "open": true,
	  "end_date": "22-04-2027 00:00"
	},
	{
	  "id": 10,
	  "text": "Workplaces exportation",
	  "start_date": "18-04-2027 00:00",
	  "duration": 3,
	  "order": "3",
	  "parent": "4",
	  "progress": 0.75,
	  "user":"3",
	  "open": true,
	  "end_date": "21-04-2027 00:00"
	},
	{
	  "id": 11,
	  "text": "Product launch",
	  "type": "project",
	  "order": "5",
	  "progress": 0.6,
	  "open": true,
	  "user":"0",
	  "start_date": "06-04-2027 00:00",
	  "duration": 13,
	  "end_date": "19-04-2027 00:00",
	  "parent": 0
	},
	{
	  "id": 12,
	  "text": "Perform Initial testing",
	  "start_date": "07-04-2027 00:00",
	  "duration": 5,
	  "order": "3",
	  "parent": "11",
	  "progress": 1,
	  "user":"0",
	  "open": true,
	  "end_date": "12-04-2027 00:00"
	},
	{
	  "id": 13,
	  "text": "Development",
	  "type": "project",
	  "start_date": "07-04-2027 00:00",
	  "duration": 11,
	  "order": "3",
	  "parent": "11",
	  "progress": 0.5,
	  "user":"0",
	  "open": true,
	  "end_date": "18-04-2027 00:00"
	},
	{
	  "id": 17,
	  "text": "Develop System",
	  "start_date": "07-04-2027 00:00",
	  "duration": 2,
	  "order": "3",
	  "parent": "13",
	  "progress": 1,
	  "user":"3",
	  "open": true,
	  "end_date": "09-04-2027 00:00"
	},
	{
	  "id": 25,
	  "text": "Beta Release",
	  "start_date": "10-04-2027 00:00",
	  "order": "3",
	  "type": "milestone",
	  "parent": "13",
	  "progress": 0,
	  "open": true,
	  "user":"0",
	  "end_date": "10-04-2027 00:00",
	  "duration": 0
	},
	{
	  "id": 18,
	  "text": "Integrate System",
	  "start_date": "12-04-2027 00:00",
	  "duration": 2,
	  "order": "3",
	  "parent": "13",
	  "progress": 0.8,
	  "open": true,
	  "user":"1",
	  "end_date": "14-04-2027 00:00"
	},
	{
	  "id": 19,
	  "text": "Test",
	  "start_date": "14-04-2027 00:00",
	  "duration": 4,
	  "order": "3",
	  "parent": "13",
	  "progress": 0.82,
	  "open": true,
	  "user":"0",
	  "end_date": "18-04-2027 00:00"
	},
	{
	  "id": 20,
	  "text": "Marketing",
	  "start_date": "14-04-2027 00:00",
	  "duration": 4,
	  "order": "3",
	  "parent": "13",
	  "progress": 0.6,
	  "user":"3",
	  "open": true,
	  "end_date": "18-04-2027 00:00"
	},
	{
	  "id": 14,
	  "text": "Analysis",
	  "start_date": "06-04-2027 00:00",
	  "duration": 6,
	  "order": "3",
	  "parent": "11",
	  "progress": 0.8,
	  "user":"0",
	  "open": true,
	  "end_date": "12-04-2027 00:00"
	},
	{
	  "id": 15,
	  "text": "Design",
	  "type": "project",
	  "start_date": "07-04-2027 00:00",
	  "duration": 5,
	  "order": "3",
	  "parent": "11",
	  "progress": 0.2,
	  "user":"0",
	  "open": false,
	  "end_date": "12-04-2027 00:00"
	},
	{
	  "id": 21,
	  "text": "Design database",
	  "start_date": "07-04-2027 00:00",
	  "duration": 4,
	  "order": "3",
	  "parent": "15",
	  "progress": 0.5,
	  "user":"0",
	  "open": true,
	  "end_date": "11-04-2027 00:00"
	},
	{
	  "id": 22,
	  "text": "Software design",
	  "start_date": "07-04-2027 00:00",
	  "duration": 4,
	  "order": "3",
	  "parent": "15",
	  "progress": 0.1,
	  "user":"2",
	  "open": true,
	  "end_date": "11-04-2027 00:00"
	},
	{
	  "id": 23,
	  "text": "Interface setup",
	  "start_date": "07-04-2027 00:00",
	  "duration": 5,
	  "order": "3",
	  "parent": "15",
	  "progress": 0,
	  "user":"3",
	  "open": true,
	  "end_date": "12-04-2027 00:00"
	},
	{
	  "id": 16,
	  "text": "Documentation creation",
	  "start_date": "06-04-2027 00:00",
	  "duration": 7,
	  "order": "3",
	  "parent": "11",
	  "progress": 0,
	  "user":"2",
	  "open": true,
	  "end_date": "13-04-2027 00:00"
	},
	{
	  "id": 24,
	  "text": "Release v1.0",
	  "start_date": "19-04-2027 00:00",
	  "order": "3",
	  "type": "milestone",
	  "parent": "11",
	  "progress": 0,
	  "open": true,
	  "user":"0",
	  "end_date": "19-04-2027 00:00",
	  "duration": 0
	}
  ],
  "links": [
	{
	  "id": "1",
	  "source": "1",
	  "target": "2",
	  "type": "1"
	},
	{
	  "id": "2",
	  "source": "2",
	  "target": "3",
	  "type": "0"
	},
	{
	  "id": "3",
	  "source": "3",
	  "target": "4",
	  "type": "0"
	},
	{
	  "id": "10",
	  "source": "11",
	  "target": "12",
	  "type": "1"
	},
	{
	  "id": "16",
	  "source": "17",
	  "target": "25",
	  "type": "0"
	},
	{
	  "id": "17",
	  "source": "18",
	  "target": "19",
	  "type": "0"
	},
	{
	  "id": "18",
	  "source": "19",
	  "target": "20",
	  "type": "0"
	},
	{
	  "id": "22",
	  "source": "13",
	  "target": "24",
	  "type": "0"
	},
	{
	  "id": "23",
	  "source": "25",
	  "target": "18",
	  "type": "0"
	}
  ]
}