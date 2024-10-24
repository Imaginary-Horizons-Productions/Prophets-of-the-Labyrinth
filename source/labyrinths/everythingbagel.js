const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Everything Bagel",
	"Untyped",
	"Every and anything is possible in the great Everything Bagel of life! All content has an equal to chance to roll here, balance not guaranteed!",
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
				"Blood Aegis",
				"Fever Break",
				"Life Drain",
				"Power from Wrath",
				"Risky Mixture",
				"Scythe",
			],
			Rare: [
				"Charging Blood Aegis",
				"Reinforced Blood Aegis",
				"Toxic Blood Aegis",
				"Urgent Fever Break",
				"Organic Fever Break",
				"Surpassing Fever Break",
				"Flanking Life Drain",
				"Furious Life Drain",
				"Thirsting Life Drain",
				"Bashing Power from Wrath",
				"Hunter's Power from Wrath",
				"Staggering Power from Wrath",
				"Midas's Risky Mixture",
				"Potent Risky Mixture",
				"Thick Risky Mixture",
				"Lethal Scythe",
				"Toxic Scythe",
				"Unstoppable Scythe",
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Buckler",
				"Certain Victory",
				"Goad Futility",
				"Herb Basket",
				"Lance",
				"Spear",
				"Warhammer"
			],
			Rare: [
				"Devoted Buckler",
				"Guarding Buckler",
				"Reinforced Buckler",
				"Hunter's Certain Victory",
				"Lethal Certain Victory",
				"Reckless Certain Victory",
				"Flanking Goad Futility",
				"Poised Goad Futility",
				"Shattering Goad Futility",
				"Organic Herb Basket",
				"Reinforced Herb Basket",
				"Urgent Herb Basket",
				"Accelerating Lance",
				"Shattering Lance",
				"Unstoppable Lance",
				"Lethal Spear",
				"Reactive Spear",
				"Sweeping Spear",
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
				"Censer",
				"Corrosion",
				"Firecracker",
				"Heat Mirage",
				"Infinite Regeneration",
				"Scutum",
				"Shortsword"
			],
			Rare: [
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Thirsting Battleaxe",
				"Staggering Censer",
				"Thick Censer",
				"Tormenting Censer",
				"Fate-Sealing Corrosion",
				"Harmful Corrosion",
				"Shattering Corrosion",
				"Double Firecracker",
				"Midas's Firecracker",
				"Toxic Firecracker",
				"Evasive Heat Mirage",
				"Unlucky Heat Mirage",
				"Vigilant Heat Mirage",
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Purifying Infinite Regeneration",
				"Guarding Scutum",
				"Lucky Scutum",
				"Sweeping Scutum",
				"Accelerating Shortsword",
				"Lethal Shortsword",
				"Toxic Shortsword"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Floating Mist Stance",
				"Iron Fist Stance",
				"Morning Star",
				"Prismatic Blast",
				"Shoulder Throw",
				"War Cry"
			],
			Rare: [
				"Agile Floating Mist Stance",
				"Devoted Floating Mist Stance",
				"Soothing Floating Mist Stance",
				"Accurate Iron Fist Stance",
				"Lucky Iron Fist Stance",
				"Organic Iron Fist Stance",
				"Awesome Morning Star",
				"Bashing Morning Star",
				"Hunter's Morning Star",
				"Distracting Prismatic Blast",
				"Flanking Prismatic Blast",
				"Vexing Prismatic Blast",
				"Evasive Shoulder Throw",
				"Harmful Shoulder Throw",
				"Staggering Shoulder Throw",
				"Charging War Cry",
				"Slowing War Cry",
				"Tormenting War Cry"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Abacus",
				"Cauldron Stir",
				"Ice Bolt",
				"Medicine",
				"Midas Staff",
				"Omamori",
				"Poison Torrent"
			],
			Rare: [
				"Sharpened Abacus",
				"Thief's Abacus",
				"Unstoppable Abacus",
				"Corrosive Cauldron Stir",
				"Sabotaging Cauldron Stir",
				"Toxic Cauldron Stir",
				"Awesome Ice Bolt",
				"Distracting Ice Bolt",
				"Unlucky Ice Bolt",
				"Bouncing Medicine",
				"Cleansing Medicine",
				"Soothing Medicine",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Soothing Midas Staff",
				"Centering Omamori",
				"Cleansing Omamori",
				"Devoted Omamori",
				"Distracting Poison Torrent",
				"Harmful Poison Torrent",
				"Staggering Poison Torrent"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Barrier",
				"Bow",
				"Cloak",
				"Daggers",
				"Inspiration",
				"Refreshing Breeze"
			],
			Rare: [
				"Cleansing Barrier",
				"Devoted Barrier",
				"Vigilant Barrier",
				"Evasive Bow",
				"Thief's Bow",
				"Unstoppable Bow",
				"Accelerating Cloak",
				"Accurate Cloak",
				"Evasive Cloak",
				"Sharpened Daggers",
				"Slowing Daggers",
				"Sweeping Daggers",
				"Guarding Inspiration",
				"Soothing Inspiration",
				"Sweeping Inspiration",
				"Accelerating Refreshing Breeze",
				"Supportive Refreshing Breeze",
				"Swift Refreshing Breeze"
			]
		},
		Untyped: {
			Cursed: [
				"Cursed Blade",
				"Cursed Tome"
			],
			Common: [
				"Chainmail",
				"Pistol",
				"Sabotage Kit",
				"Scarf",
				"Second Wind",
				"Strong Attack",
				"Wolf Ring"
			],
			Rare: [
				"Poised Chainmail",
				"Powerful Chainmail",
				"Wise Chainmail",
				"Double Pistol",
				"Duelist's Pistol",
				"Flanking Pistol",
				"Potent Sabotage Kit",
				"Shattering Sabotage Kit",
				"Urgent Sabotage Kit",
				"Accurate Scarf",
				"Hearty Scarf",
				"Wise Scarf",
				"Cleansing Second Wind",
				"Lucky Second Wind",
				"Soothing Second Wind",
				"Flanking Strong Attack",
				"Sharpened Strong Attack",
				"Staggering Strong Attack",
				"Surpassing Wolf Ring",
				"Swift Wolf Ring",
				"Wise Wolf Ring"
			]
		}
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Apple Pie Wishing Well", "Door 1 or Door 2?", "Free Gold?", "Gear Collector", "Imp Contract Faire", "Repair Kit, just hanging out", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant", "Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
