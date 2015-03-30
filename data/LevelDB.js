/**
 * ...
 * @author Danny Marcowitz
 */

 var allLevels =
 	{"levels": [{
		// Level 1
		"id": "1",
		"duration": 20,
		"maxCustomersAtOnce": 1,
		"fruits":["banana"],
		"liquids":["milk"], 
		"customerWait":15,
		"timeBetweenCustomers":1,
		"maxRecipeSize":1,
		"stars": [8, 10, 12]
	}, {
		// Level 2
		"id": "2",
		"duration": 30,
		"maxCustomersAtOnce": 2,
		"fruits":["banana"],
		"liquids":["milk"], 
		"customerWait":15,
		"timeBetweenCustomers":4,
		"maxRecipeSize":2,
		"stars": [50, 100, 150]
	}, {
		// Level 3
		"id": "3",
		"duration": 35,
		"maxCustomersAtOnce": 2,
		"fruits":["banana", "kiwi"],
		"liquids":["milk"], 
		"customerWait":14,
		"timeBetweenCustomers":3,
		"maxRecipeSize":2,
		"stars": [50, 125, 200]
	}, {
		// Level 4
		"id": "4",
		"duration": 35,
		"maxCustomersAtOnce": 2,
		"fruits":["banana", "kiwi"],
		"liquids":["water", "milk"], 
		"customerWait":14,
		"timeBetweenCustomers":3,
		"maxRecipeSize":2,
		"stars": [80, 140, 200]
	},{
		// Level 5
		"id": "5",
		"duration": 35,
		"maxCustomersAtOnce": 2,
		"fruits":["banana", "kiwi"],
		"liquids":["water", "milk"], 
		"customerWait":13,
		"timeBetweenCustomers":2,
		"maxRecipeSize":3,
		"stars": [130, 200, 270]
	},{
		// Level 6
		"id": "6",
		"duration": 45,
		"maxCustomersAtOnce": 2,
		"fruits":["banana", "kiwi"],
		"liquids":["water", "milk"], 
		"customerWait":12,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [170, 245, 320]
	},{
		// Level 7
		"id": "7",
		"duration": 45,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut"],
		"liquids":["water", "milk"], 
		"customerWait":12,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [170, 250, 330]
	},{
		// Level 8
		"id": "8",
		"duration": 45,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut"],
		"liquids":["water", "milk"], 
		"customerWait":13,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [200, 280, 360]
	},{
		// Level 9
		"id": "9",
		"duration": 50,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon"],
		"liquids":["water", "milk"], 
		"customerWait":13,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [250, 350, 450]
	},{
		// Level 10
		"id": "10",
		"duration": 55,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon"],
		"liquids":["water", "milk"], 
		"customerWait":12,
		"timeBetweenCustomers":1,
		"maxRecipeSize":3,
		"stars": [250, 350, 450]
	},{
		// Level 11
		"id": "11",
		"duration": 60,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes"],
		"liquids":["water", "milk"], 
		"customerWait":13,
		"timeBetweenCustomers":2,
		"maxRecipeSize":3,
		"stars": [250, 350, 450]
	},{
		// Level 12
		"id": "12",
		"duration": 65,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes"],
		"liquids":["water", "milk"], 
		"customerWait":13,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [300, 470, 590]
	},{
		// Level 13
		"id": "13",
		"duration": 65,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes"],
		"liquids":["water", "milk","juice"], 
		"customerWait":11,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [300, 400, 500]
	},{
		// Level 14
		"id": "14",
		"duration": 65,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes"],
		"liquids":["water", "milk","juice"], 
		"customerWait":13,
		"timeBetweenCustomers":3,
		"maxRecipeSize":3,
		"stars": [320, 400, 480]
	},{
		// Level 15 
		"id": "15",
		"duration": 70,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":13,
		"timeBetweenCustomers":2,
		"maxRecipeSize":3,
		"stars": [320, 420, 520]
	},{
		// Level 16
		"id": "16",
		"duration": 70,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":13,
		"timeBetweenCustomers":3,
		"maxRecipeSize":4,
		"stars": [380, 500, 620]
	},{
		// Level 17
		"id": "17",
		"duration": 75,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":12,
		"timeBetweenCustomers":2,
		"maxRecipeSize":4,
		"stars": [380, 500, 620]
	},{
		// Level 18
		"id": "18",
		"duration": 80,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":12,
		"timeBetweenCustomers":2,
		"maxRecipeSize":4,
		"stars": [380, 500, 620]
	},{
		// Level 19
		"id": "19",
		"duration": 80,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":11,
		"timeBetweenCustomers":2,
		"maxRecipeSize":4,
		"stars": [400, 530, 660]
	},{
		// Level 20
		"id": "20",
		"duration": 80,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":10,
		"timeBetweenCustomers":1,
		"maxRecipeSize":4,
		"stars": [400, 530, 660]
	},{
		// Level 21
		"id": "21",
		"duration": 90,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":10,
		"timeBetweenCustomers":1,
		"maxRecipeSize":4,
		"stars": [500, 600, 700]
	},{
		// Level 22
		"id": "22",
		"duration": 90,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":10,
		"timeBetweenCustomers":1,
		"maxRecipeSize":4,
		"stars": [530, 650, 770]
	},{
		// Level 23
		"id": "23",
		"duration": 100,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":9,
		"timeBetweenCustomers":1,
		"maxRecipeSize":4,
		"stars": [530, 650, 770]
	},{
		// Level 24
		"id": "24",
		"duration": 100,
		"maxCustomersAtOnce": 3,
		"fruits":["banana", "kiwi", "coconut","watermelon","grapes","apple"],
		"liquids":["water", "milk","juice"], 
		"customerWait":19,
		"timeBetweenCustomers":1,
		"maxRecipeSize":4,
		"stars": [580, 730, 980]
	}]
}

function LevelDB() {
}

LevelDB.prototype.getAllLevels = function() {
	return allLevels.levels;
}