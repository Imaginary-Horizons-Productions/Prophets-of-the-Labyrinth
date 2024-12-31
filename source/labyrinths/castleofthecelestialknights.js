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
				"Fever Break",
				"Warhammer"
			],
			Rare: [
				"Fatiguing Fever Break",
				"Unstoppable Fever Break",
				"Fatiguing Warhammer",
				"Vigorous Warhammer"
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Flail",
				"Sandstorm Formation"
			],
			Rare: [
				"Bouncing Flail",
				"Incompatible Flail",
				"Balanced Sandstorm Formation",
				"Soothing Sandstorm Formation"
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Bonfire Formation",
				"Longsword"
			],
			Rare: [
				"Double Longsword",
				"Reactive Longsword",
				"Charging Bonfire Formation",
				"Hastening Bonfire Formation"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Battle Standard",
				"Reveal Flaw"
			],
			Rare: [
				"Thief's Battle Standard",
				"Tormenting Battle Standard",
				"Distracting Reveal Flaw",
				"Numbing Reveal Flaw"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Conjured Ice Armaments",
				"Net Launcher"
			],
			Rare: [
				"Kinetic Net Launcher",
				"Staggering Net Launcher",
				"Supportive Conjured Ice Armaments",
				"Vigilant Conjured Ice Armaments"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Greatsword",
				"Tornado Formation"
			],
			Rare: [
				"Chaining Greatsword",
				"Distracting Greatsword",
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
		"Event": ["Door 1 or Door 2?", "Twin Pedestals", "Imp Contract Faire", "Gear Collector", "The Score Beggar", "Apple Pie Wishing Well", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["Brute Convention", "A windfall of treasure!"],
		"Final Battle": ["Hall of Mirrors", "Confronting the Top Celestial Knight"],
		...standardLabyrinthInfrastructure
	}
);
