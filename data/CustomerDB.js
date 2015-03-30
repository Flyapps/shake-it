/**
 * ...
 * @author Danny Marcowitz
 */

 var allCustomers =
 	{"customers": [{
		"id": "little_girl",
		"waitFactor": 1.1,
		"tip": 25,
		"spritesheet": "images/customers/littlegirl.png",
		"frameWidth": 131,
		"frameHeight": 128,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "old_woman",
		"waitFactor": 0.8,
		"tip": 35,
		"spritesheet": "images/customers/merry.png",
		"frameWidth": 130,
		"frameHeight": 126,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "business_man",
		"waitFactor": 0.6,
		"tip": 55,
		"spritesheet": "images/customers/businessman.png",
		"frameWidth": 131,
		"frameHeight": 128,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "surfer_dude",
		"waitFactor": 1.2,
		"tip": 25,
		"spritesheet": "images/customers/surferdude.png",
		"frameWidth": 131,
		"frameHeight": 128,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "captain",
		"waitFactor": 1.2,
		"tip": 25,
		"spritesheet": "images/customers/captain.png",
		"frameWidth": 130,
		"frameHeight": 126,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,	
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "dude",
		"waitFactor": 1,
		"tip": 20,
		"spritesheet": "images/customers/dude.png",
		"frameWidth": 130,
		"frameHeight": 126,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}, {
		"id": "young_woman",
		"waitFactor": 0.9,
		"tip": 20,
		"spritesheet": "images/customers/jessica.png",
		"frameWidth": 130,
		"frameHeight": 126,
		"idleFrame": 0,
		"angryFrame": 1,
		"satisfiedFrame": 2,
		"arrivingFrame": 3,
		"pissedOff1": 4,
		"pissedOff2": 5,
		"pissedOff3": 6
	}]
};

function CustomerDB() {
}

CustomerDB.prototype.getAllCustomers = function() {
	return allCustomers.customers;
}