const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

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
		Unaligned: [
			"Clear Potion",
			"Creative Acorn",
			"Earthen Potion",
			"Explosion Potion",
			"Fiery Potion",
			"Finesse Fiber",
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
				"Fever Break"
			],
			Rare: [
				"Fatiguing Fever Break",
				"Unstoppable Fever Break"
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Sandstorm Formation"
			],
			Rare: [
				"Balanced Sandstorm Formation",
				"Soothing Sandstorm Formation"
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Bonfire Formation"
			],
			Rare: [
				"Charging Bonfire Formation",
				"Hastening Bonfire Formation"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Reveal Flaw"
			],
			Rare: [
				"Distracting Reveal Flaw",
				"Numbing Reveal Flaw"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Conjured Ice Armaments"
			],
			Rare: [
				"Supportive Conjured Ice Armaments",
				"Vigilant Conjured Ice Armaments"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Tornado Formation"
			],
			Rare: [
				"Charging Tornado Formation",
				"Supportive Tornado Formation"
			]
		},
		Unaligned: {
			Cursed: [
			],
			Common: [
				"Boots of Comfort",
				"Mighty Gauntlet",
				"Scarf",
				"Wolf Ring"
			],
			Rare: [
				"Accurate Boots of Comfort",
				"Hearty Boots of Comfort",
				"Powerful Boots of Comfort",
				"Accurate Mighty Gauntlet",
				"Hearty Mighty Gauntlet",
				"Swift Mighty Gauntlet",
				"Hearty Scarf",
				"Powerful Scarf",
				"Swift Scarf",
				"Accurate Wolf Ring",
				"Powerful Wolf Ring",
				"Swift Wolf Ring"
			]
		}
	},
	{
		// Rooms
		"Event": ["Door 1 or Door 2?", "Twin Pedestals", "Imp Contract Faire", "Free Gold?", "Gear Collector", "The Score Beggar", "Apple Pie Wishing Well", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Hawk Fight", "Wild Fire-Arrow Frogs", "Tortoise Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "Brute Convention"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors"],
		...standardLabyrinthInfrastructure
	}
);
