/**
 * ...
 * @author Danny Marcowitz
 */

 var allFruits = {"fruits": [
        		{"id": "1", "name":"banana", "bigIcon": "images/fruits/banana_big.png", "smallIcon": "images/fruits/banana_small.png"},
				{"id": "2", "name":"kiwi","bigIcon": "images/fruits/kiwi_big.png", "smallIcon": "images/fruits/kiwi_small.png"},
				{"id": "3", "name":"apple","bigIcon": "images/fruits/apple_big.png", "smallIcon": "images/fruits/apple_small.png"},
				{"id": "4", "name":"grapes","bigIcon": "images/fruits/grapes_big.png", "smallIcon": "images/fruits/grapes_small.png"},
				{"id": "5", "name":"watermelon","bigIcon": "images/fruits/watermelon_big.png", "smallIcon": "images/fruits/watermelon_small.png"},
				{"id": "6", "name":"coconut","bigIcon": "images/fruits/coconut_big.png", "smallIcon": "images/fruits/coconut_small.png"},
    ]
};

var allLiquids =
	{"liquids": [{
		"id": "1",
		"name":"milk",
		"bigIcon": "images/liquids/milk_big.png",
		"smallIcon": "images/liquids/milk_small.png",
		"fillBack": "images/liquids/milk_blender_back.png",
		"fillFront": "images/liquids/milk_blender_front.png"
	}, {
		"id": "2",
		"name":"juice",
		"bigIcon": "images/liquids/juice_big.png",
		"smallIcon": "images/liquids/juice_small.png",
		"fillBack": "images/liquids/juice_blender_back.png",
		"fillFront": "images/liquids/juice_blender_front.png"
	}, {
		"id": "3",
		"name":"water",
		"bigIcon": "images/liquids/water_big.png",
		"smallIcon": "images/liquids/water_small.png",
		"fillBack": "images/liquids/water_blender_back.png",
		"fillFront": "images/liquids/water_blender_front.png"
	}]
};

function ProductDB() {
}

ProductDB.prototype.getAllFruits = function() {
	return allFruits.fruits;
}

ProductDB.prototype.getAllLiquids = function() {
	return allLiquids.liquids;
}