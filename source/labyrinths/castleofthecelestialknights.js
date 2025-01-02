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
				"Spiked Shield",
				"War Cry",
				"Warhammer"
			],
			Rare: [
				"Fatiguing Fever Break",
				"Unstoppable Fever Break",
				"Furious Spiked Shield",
				"Reinforced Spiked Shield",
				"Flanking War Cry",
				"Weakening War Cry",
				"Fatiguing Warhammer",
				"Toxic Warhammer"
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Carrot",
				"Flail",
				"Sandstorm Formation",
				"Smokescreen"
			],
			Rare: [
				"Balanced Carrot",
				"Guarding Carrot",
				"Bouncing Flail",
				"Incompatible Flail",
				"Balanced Sandstorm Formation",
				"Soothing Sandstorm Formation",
				"Chaining Smokescreen",
				"Double Smokescreen"
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Bonfire Formation",
				"Cloak",
				"Elemental Scroll",
				"Longsword"
			],
			Rare: [
				"Charging Bonfire Formation",
				"Hastening Bonfire Formation",
				"Accurate Cloak",
				"Powerful Cloak",
				"Balanced Elemental Scroll",
				"Surpassing Elemental Scroll",
				"Double Longsword",
				"Lethal Longsword"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Battle Standard",
				"Midas Staff",
				"Parrying Dagger",
				"Reveal Flaw"
			],
			Rare: [
				"Thief's Battle Standard",
				"Tormenting Battle Standard",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Devoted Parrying Dagger",
				"Hastening Parrying Dagger",
				"Distracting Reveal Flaw",
				"Numbing Reveal Flaw"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Buckler",
				"Conjured Ice Armaments",
				"Medic's Kit",
				"Net Launcher"
			],
			Rare: [
				"Guarding Buckler",
				"Supportive Buckler",
				"Supportive Conjured Ice Armaments",
				"Vigilant Conjured Ice Armaments",
				"Inspiring Medic's Kit",
				"Warning Medic's Kit",
				"Kinetic Net Launcher",
				"Staggering Net Launcher",
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Arcane Sledge",
				"Enchantment Siphon",
				"Greatsword",
				"Tornado Formation"
			],
			Rare: [
				"Fatiguing Arcane Sledge",
				"Kinetic Arcane Sledge",
				"Flanking Enchantment Siphon",
				"Tormenting Enchantment Siphon",
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
