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
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
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
				"Soothing Floating Mist Stance",
				"Organic Iron Fist Stance",
				"Awesome Morning Star",
				"Bashing Morning Star",
				"Hunter's Morning Star",
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
				"Poison Torrent",
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
				"Bouncing Medicine",
				"Cleansing Medicine",
				"Soothing Medicine",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Soothing Midas Staff",
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
				"Long Barrier",
				"Evasive Bow",
				"Thief's Bow",
				"Unstoppable Bow",
				"Accelerating Cloak",
				"Accurate Cloak",
				"Long Cloak",
				"Sharpened Daggers",
				"Slowing Daggers",
				"Sweeping Daggers",
				"Guarding Inspiration",
				"Soothing Inspiration",
				"Sweeping Inspiration",
				"Supportive Refreshing Breeze"
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
				"Wise Chainmail",
				"Double Pistol",
				"Duelist's Pistol",
				"Flanking Pistol",
				"Long Sabotage Kit",
				"Shattering Sabotage Kit",
				"Urgent Sabotage Kit",
				"Hearty Scarf",
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
		"Event": ["Apple Pie Wishing Well", "Free Gold?", "Gear Collector", "Imp Contract Faire", "Repair Kit, just hanging out", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Treasure"],
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
