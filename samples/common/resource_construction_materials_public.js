var taskData = {
	"data": [
		{
			"id": "512",
			"start_date": "2027-09-27 00:00:00",
			"duration": 42,
			"text": "House Construction",
			"progress": "0",
			"type": "project",
			"parent": "0",
			"level": "0",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-25 00:00:00"
		},
		{
			"id": "513",
			"start_date": "2027-09-27 00:00:00",
			"duration": 4,
			"text": "Architectural design",
			"progress": "0",
			"type": "project",
			"parent": "512",
			"level": "1",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-02 00:00:00"
		},
		{
			"id": "514",
			"start_date": "2027-09-27 00:00:00",
			"duration": 2,
			"text": "Create a draft of architecture",
			"progress": "0",
			"type": "task",
			"parent": "513",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-09-30 00:00:00"
		},
		{
			"id": "515",
			"start_date": "2027-09-28 00:00:00",
			"duration": 2,
			"text": "Prepare construction documents",
			"progress": "0",
			"type": "task",
			"parent": "514",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-09-30 00:00:00",
			"resources": [
				{
					"resource_id": "1",
					"value": "8"
				}
			]
		},
		{
			"id": "516",
			"start_date": "2027-09-30 00:00:00",
			"duration": 1,
			"text": "Agreement to architectural plan",
			"progress": "0",
			"type": "task",
			"parent": "513",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-01 00:00:00",
			"resources": [
				{
					"resource_id": "1",
					"value": "8"
				}
			]
		},
		{
			"id": "517",
			"start_date": "2027-10-01 00:00:00",
			"duration": 1,
			"text": "Agreement with client",
			"progress": "0",
			"type": "task",
			"parent": "513",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-02 00:00:00",
			"resources": [
				{
					"resource_id": "1",
					"value": "8"
				}
			]
		},
		{
			"id": "518",
			"start_date": "2027-10-02 00:00:00",
			"duration": 27,
			"text": "Construction Phase",
			"progress": "0",
			"type": "project",
			"parent": "512",
			"level": "1",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-10 00:00:00"
		},
		{
			"id": "519",
			"start_date": "2027-10-02 00:00:00",
			"duration": 5,
			"text": "Foundation",
			"progress": "0",
			"type": "project",
			"parent": "518",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-09 00:00:00"
		},
		{
			"id": "520",
			"start_date": "2027-10-02 00:00:00",
			"duration": 2,
			"text": "Excavation",
			"progress": "0",
			"type": "task",
			"parent": "519",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-06 00:00:00",
			"resources": [
				{
					"resource_id": "2",
					"value": "8"
				}
			]
		},
		{
			"id": "521",
			"start_date": "2027-10-06 00:00:00",
			"duration": 3,
			"text": "Pour concrete",
			"progress": "0",
			"type": "task",
			"parent": "519",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-09 00:00:00",
			"resources": [
				{
					"resource_id": "3",
					"value": "8"
				},
				{
					"resource_id": "8",
					"value": "15"
				}
			]
		},
		{
			"id": "522",
			"start_date": "2027-10-09 00:00:00",
			"duration": 5,
			"text": "Ground floor",
			"progress": "0",
			"type": "project",
			"parent": "518",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-16 00:00:00"
		},
		{
			"id": "523",
			"start_date": "2027-10-09 00:00:00",
			"duration": 1,
			"text": "Walls to 1st Floor",
			"progress": "0",
			"type": "task",
			"parent": "522",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-10 00:00:00",
			"resources": [
				{
					"resource_id": "2",
					"value": "8"
				},
				{
					"resource_id": "9",
					"value": "20"
				}
			]
		},
		{
			"id": "524",
			"start_date": "2027-10-12 00:00:00",
			"duration": 4,
			"text": "Roof structure",
			"progress": "0",
			"type": "task",
			"parent": "522",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-16 00:00:00",
			"resources": [
				{
					"resource_id": "2",
					"value": "8"
				},
				{
					"resource_id": "9",
					"value": "10"
				}
			]
		},
		{
			"id": "525",
			"start_date": "2027-10-16 00:00:00",
			"duration": 6,
			"text": "1st Floor",
			"progress": "0",
			"type": "project",
			"parent": "518",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-24 00:00:00"
		},
		{
			"id": "526",
			"start_date": "2027-10-16 00:00:00",
			"duration": 2,
			"text": "Walls to Terrace",
			"progress": "0",
			"type": "task",
			"parent": "525",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-20 00:00:00",
			"resources": [
				{
					"resource_id": "3",
					"value": "8"
				},
				{
					"resource_id": "8",
					"value": "10"
				}
			]
		},
		{
			"id": "527",
			"start_date": "2027-10-20 00:00:00",
			"duration": 4,
			"text": "Roof Structure",
			"progress": "0",
			"type": "task",
			"parent": "525",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-24 00:00:00",
			"resources": [
				{
					"resource_id": "7",
					"value": "8"
				},
				{
					"resource_id": "8",
					"value": "10"
				}
			]
		},
		{
			"id": "528",
			"start_date": "2027-10-24 00:00:00",
			"duration": 11,
			"text": "General works",
			"progress": "0",
			"type": "project",
			"parent": "518",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-10 00:00:00"
		},
		{
			"id": "529",
			"start_date": "2027-10-24 00:00:00",
			"duration": 1,
			"text": " Installation of air conditioning systems",
			"progress": "0",
			"type": "task",
			"parent": "528",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-27 00:00:00",
			"resources": [
				{
					"resource_id": "6",
					"value": "4"
				},
				{
					"resource_id": "7",
					"value": "8"
				},
				{
					"resource_id": "10",
					"value": "1"
				}
			]
		},
		{
			"id": "530",
			"start_date": "2027-10-25 00:00:00",
			"duration": 1,
			"text": "Installation of heating systems",
			"progress": "0",
			"type": "task",
			"parent": "528",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-10-27 00:00:00",
			"resources": [
				{
					"resource_id": "7",
					"value": "8"
				},
				{
					"resource_id": "11",
					"value": "3"
				}
			]
		},
		{
			"id": "531",
			"start_date": "2027-10-27 00:00:00",
			"duration": 5,
			"text": "Electricity installation",
			"progress": "0",
			"type": "task",
			"parent": "528",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-03 00:00:00",
			"resources": [
				{
					"resource_id": "6",
					"value": "8"
				},
				{
					"resource_id": "13",
					"value": "100"
				}
			]
		},
		{
			"id": "532",
			"start_date": "2027-11-03 00:00:00",
			"duration": 5,
			"text": "Waterworks and Plumbing",
			"progress": "0",
			"type": "task",
			"parent": "528",
			"level": "3",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-10 00:00:00",
			"resources": [
				{
					"resource_id": "5",
					"value": "8"
				},
				{
					"resource_id": "12",
					"value": "10"
				}
			]
		},
		{
			"id": "533",
			"start_date": "2027-11-10 00:00:00",
			"duration": 11,
			"text": "Decoration Phase",
			"progress": "0",
			"type": "project",
			"parent": "512",
			"level": "1",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-25 00:00:00"
		},
		{
			"id": "534",
			"start_date": "2027-11-10 00:00:00",
			"duration": 4,
			"text": "Walls",
			"progress": "0",
			"type": "task",
			"parent": "533",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-14 00:00:00"
		},
		{
			"id": "535",
			"start_date": "2027-11-13 00:00:00",
			"duration": 1,
			"text": "Ceilings",
			"progress": "0",
			"type": "task",
			"parent": "533",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-16 00:00:00"
		},
		{
			"id": "536",
			"start_date": "2027-11-15 00:00:00",
			"duration": 2,
			"text": "Floorings",
			"progress": "0",
			"type": "task",
			"parent": "533",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-18 00:00:00"
		},
		{
			"id": "537",
			"start_date": "2027-11-18 00:00:00",
			"duration": 3,
			"text": "Furniture ",
			"progress": "0",
			"type": "task",
			"parent": "533",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-21 00:00:00"
		},
		{
			"id": "538",
			"start_date": "2027-11-21 00:00:00",
			"duration": 2,
			"text": "Final Touches",
			"progress": "0",
			"type": "task",
			"parent": "533",
			"level": "2",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-25 00:00:00"
		},
		{
			"id": "539",
			"start_date": "2027-11-25 00:00:00",
			"duration": 0,
			"text": "Project submission",
			"progress": "0",
			"type": "milestone",
			"parent": "512",
			"level": "1",
			"project_id": "51",
			"open": true,
			"end_date": "2027-11-25 00:00:00"
		}
	],
	"links": [
		{
			"id": "407",
			"source": "514",
			"target": "516",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "408",
			"source": "515",
			"target": "516",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "409",
			"source": "516",
			"target": "517",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "410",
			"source": "513",
			"target": "518",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "412",
			"source": "520",
			"target": "521",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "413",
			"source": "519",
			"target": "522",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "414",
			"source": "523",
			"target": "524",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "415",
			"source": "522",
			"target": "525",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "416",
			"source": "526",
			"target": "527",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "417",
			"source": "529",
			"target": "530",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "418",
			"source": "525",
			"target": "528",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "419",
			"source": "530",
			"target": "531",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "420",
			"source": "531",
			"target": "532",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "422",
			"source": "518",
			"target": "533",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "423",
			"source": "534",
			"target": "538",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "424",
			"source": "535",
			"target": "538",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "425",
			"source": "536",
			"target": "538",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "426",
			"source": "537",
			"target": "538",
			"type": "0",
			"project_id": "51"
		},
		{
			"id": "427",
			"source": "533",
			"target": "539",
			"type": "0",
			"project_id": "51"
		}
	]
}