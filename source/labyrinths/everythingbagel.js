const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

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
			"Creative Acorn",
			"Earthen Potion",
			"Explosion Potion",
			"Fiery Potion",
			"Flexigrass",
			"Glowing Potion",
			"Health Potion",
			"Inky Potion",
			"Salt of Oblivion",
			"Panacea",
			"Placebo",
			"Portable Spellbook Charger",
			"Protection Potion",
			"Quick Pepper",
			"Regen Root",
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
				"Unlimited Fever Break",
				"Urgent Fever Break",
				"Surpassing Fever Break",
				"Flanking Life Drain",
				"Furious Life Drain",
				"Thirsting Life Drain",
				"Bashing Power from Wrath",
				"Hunter's Power from Wrath",
				"Staggering Power from Wrath",
				"Midas's Risky Mixture",
				"Potent Risky Mixture",
				"Chaining Risky Mixture",
				"Lethal Scythe",
				"Toxic Scythe",
				"Unstoppable Scythe",
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Carrot",
				"Certain Victory",
				"Goad Futility",
				"Herb Basket",
				"Spear",
				"Stick",
				"Warhammer"
			],
			Rare: [
				"Devoted Carrot",
				"Lucky Carrot",
				"Reinforced Carrot",
				"Hunter's Certain Victory",
				"Lethal Certain Victory",
				"Reckless Certain Victory",
				"Flanking Goad Futility",
				"Poised Goad Futility",
				"Shattering Goad Futility",
				"Chaining Herb Basket",
				"Reinforced Herb Basket",
				"Urgent Herb Basket",
				"Lethal Spear",
				"Reactive Spear",
				"Sweeping Spear",
				"Sharpened Stick",
				"Shattering Stick",
				"Staggering Stick",
				"Slowing Warhammer",
				"Unstoppable Warhammer",
				"Vigorous Warhammer",
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
				"Tormenting Censer",
				"Chaining Censer",
				"Fate-Sealing Corrosion",
				"Fatiguing Corrosion",
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
				"Buckler",
				"Floating Mist Stance",
				"Iron Fist Stance",
				"Lance",
				"Morning Star",
				"Prismatic Blast",
				"Shoulder Throw",
				"War Cry"
			],
			Rare: [
				"Accelerating Buckler",
				"Devoted Buckler",
				"Guarding Buckler",
				"Agile Floating Mist Stance",
				"Devoted Floating Mist Stance",
				"Soothing Floating Mist Stance",
				"Accurate Iron Fist Stance",
				"Chaining Iron Fist Stance",
				"Lucky Iron Fist Stance",
				"Duelist's Lance",
				"Shattering Lance",
				"Surpassing Lance",
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
				"Poison Torrent",
				"Universal Solution"
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
				"Staggering Poison Torrent",
				"Centering Universal Solution",
				"Evasive Universal Solution",
				"Harmful Universal Solution"
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
				"Refreshing Breeze",
				"Air Blades"
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
				"Swift Refreshing Breeze",
				"Adventurer's Air Blades",
				"Toxic Air Blades",
				"Unstoppable Air Blades"
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
		// Rooms
		"Event": ["Apple Pie Wishing Well", "Door 1 or Door 2?", "Free Gold?", "Gear Collector", "Imp Contract Faire", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!", "Brute Convention"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],
		...standardLabyrinthInfrastructure
	}
);
