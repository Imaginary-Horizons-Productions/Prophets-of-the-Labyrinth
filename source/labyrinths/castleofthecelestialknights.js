const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

module.exports = new LabyrinthTemplate("Castle of the Celestial Knights",
	"Light",
	"Atop this castle resides the Starry Knight, boss of the Celestial Knights. Gather weapons and steel your nerves to overthrow the tyrant!",
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
				"Fever Break",
				"Power from Wrath",
				"Risky Mixture",
				"Scythe",
			],
			Rare: [
				"Unlimited Fever Break",
				"Urgent Fever Break",
				"Surpassing Fever Break",
				"Bashing Power from Wrath",
				"Hunter's Power from Wrath",
				"Staggering Power from Wrath",
				"Chaining Risky Mixture",
				"Midas's Risky Mixture",
				"Potent Risky Mixture",
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
				"Goad Futility",
				"Herb Basket",
				"Spear",
				"Warhammer"
			],
			Rare: [
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
				"Firecracker",
				"Heat Mirage",
				"Infinite Regeneration"
			],
			Rare: [
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Thirsting Battleaxe",
				"Double Firecracker",
				"Midas's Firecracker",
				"Toxic Firecracker",
				"Evasive Heat Mirage",
				"Unlucky Heat Mirage",
				"Vigilant Heat Mirage",
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Purifying Infinite Regeneration"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Morning Star",
				"Prismatic Blast",
				"Shoulder Throw",
				"War Cry"
			],
			Rare: [
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
				"Ice Bolt",
				"Midas Staff",
				"Omamori",
				"Poison Torrent",
				"Universal Solution"
			],
			Rare: [
				"Sharpened Abacus",
				"Thief's Abacus",
				"Unstoppable Abacus",
				"Awesome Ice Bolt",
				"Distracting Ice Bolt",
				"Unlucky Ice Bolt",
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
				"Scarf",
				"Wolf Ring"
			],
			Rare: [
				"Poised Chainmail",
				"Powerful Chainmail",
				"Wise Chainmail",
				"Accurate Scarf",
				"Hearty Scarf",
				"Wise Scarf",
				"Surpassing Wolf Ring",
				"Swift Wolf Ring",
				"Wise Wolf Ring"
			]
		}
	},
	{
		// Rooms
		"Event": ["Door 1 or Door 2?", "Twin Pedestals", "Imp Contract Faire", "Gear Collector", "The Score Beggar", "Apple Pie Wishing Well", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["Brute Convention", "A windfall of treasure!"],
		"Final Battle": ["Hall of Mirrors", "Confronting the Top Celestial Knight"],
		...standardLabyrinthInfrastructure
	}
);
