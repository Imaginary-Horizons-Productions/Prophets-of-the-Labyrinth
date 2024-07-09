const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Zoo of Chimeras",
	"Water",
	"These are all normal animals, right?",
	15,
	[15],
	{
		Darkness: [],
		Earth: [],
		Fire: [],
		Light: [],
		Water: [],
		Wind: [],
		Untyped: [
			"Clear Potion",
			"Earthen Potion",
			"Explosion Potion",
			"Fiery Potion",
			"Glowing Potion",
			"Health Potion",
			"Inky Potion",
			"Salt of Oblivion",
			"Panacea",
			"Placebo",
			"Protection Potion",
			"Quick Pepper",
			"Regen Root",
			"Repair Kit",
			"Smoke Bomb",
			"Stasis Quartz",
			"Strength Spinach",
			"Vitamins",
			"Watery Potion",
			"Windy Potion"
		]
	},
	{
		Darkness: {
			Cursed: [
			],
			Common: [
				"Fever Break",
				"Power from Wrath",
				"Risky Mixture",
				"Scythe",
			],
			Rare: [
				"Urgent Fever Break",
				"Organic Fever Break",
				"Surpassing Fever Break",
				"Long Risky Mixture",
				"Lethal Scythe",
				"Toxic Scythe",
				"Unstoppable Scythe",
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Certain Victory",
				"Herb Basket",
				"Warhammer"
			],
			Rare: [
				"Hunter's Certain Victory",
				"Lethal Certain Victory",
				"Reckless Certain Victory",
				"Organic Herb Basket",
				"Reinforced Herb Basket",
				"Urgent Herb Basket",
				"Reactive Warhammer",
				"Slowing Warhammer",
				"Unstoppable Warhammer",
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Battleaxe",
				"Firecracker",
				"War Cry"
			],
			Rare: [
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Thirsting Battleaxe",
				"Double Firecracker",
				"Midas's Firecracker",
				"Toxic Firecracker",
				"Charging War Cry",
				"Slowing War Cry",
				"Tormenting War Cry"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Infinite Regeneration",
				"Morning Star",
				"Prismatic Blast",
				"Shoulder Throw",
				"Sun Flare"
			],
			Rare: [
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Awesome Morning Star",
				"Bashing Morning Star",
				"Vexing Prismatic Blast",
				"Evasive Shoulder Throw",
				"Evasive Sun Flare",
				"Accelerating Sun Flare",
				"Tormenting Sun Flare"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Abacus",
				"Ice Bolt",
				"Midas Staff",
				"Poison Torrent",
			],
			Rare: [
				"Hunter's Abacus",
				"Sharpened Abacus",
				"Unstoppable Abacus",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Soothing Midas Staff",
				"Harmful Poison Torrent"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Barrier",
				"Bow",
				"Inspiration",
				"Spear",
				"Refreshing Breeze"
			],
			Rare: [
				"Cleansing Barrier",
				"Devoted Barrier",
				"Long Barrier",
				"Evasive Bow",
				"Hunter's Bow",
				"Unstoppable Bow",
				"Guarding Inspiration",
				"Soothing Inspiration",
				"Sweeping Inspiration",
				"Lethal Spear",
				"Reactive Spear",
				"Sweeping Spear",
			]
		},
		Untyped: {
			Cursed: [
				"Cursed Blade",
				"Cursed Tome"
			],
			Common: [
				"Chainmail",
				"Scarf",
				"Wolf Ring"
			],
			Rare: [
				"Wise Chainmail",
				"Hearty Scarf",
				"Surpassing Wolf Ring",
				"Swift Wolf Ring"
			]
		}
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Twin Pedestals", "Imp Contract Faire", "Free Gold?", "Gear Collector", "The Score Beggar", "Apple Pie Wishing Well", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Wild Fire-Arrow Frogs", "Tortoise Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant", "Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
