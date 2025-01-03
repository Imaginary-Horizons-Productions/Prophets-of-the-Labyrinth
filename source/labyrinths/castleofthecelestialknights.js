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
				"Blood Aegis",
				"Fever Break",
				"Ring of Conquest",
				"Spiked Shield",
				"War Cry",
				"Warhammer"
			],
			Rare: [
				"Toxic Blood Aegis",
				"Urgent Blood Aegis",
				"Fatiguing Fever Break",
				"Unstoppable Fever Break",
				"Hearty Ring of Conquest",
				"Powerful Ring of Conquest",
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
				"Bounty Fist",
				"Carrot",
				"Flail",
				"Herb Basket",
				"Sandstorm Formation",
				"Smokescreen"
			],
			Rare: [
				"Midas's Bounty Fist",
				"Thirsting Bounty Fist",
				"Balanced Carrot",
				"Guarding Carrot",
				"Bouncing Flail",
				"Incompatible Flail",
				"Enticing Herb Basket",
				"Guarding Herb Basket",
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
				"Longsword",
				"Musket",
				"Overburn Explosion"
			],
			Rare: [
				"Charging Bonfire Formation",
				"Hastening Bonfire Formation",
				"Accurate Cloak",
				"Powerful Cloak",
				"Balanced Elemental Scroll",
				"Surpassing Elemental Scroll",
				"Double Longsword",
				"Lethal Longsword",
				"Discounted Musket",
				"Hunter's Musket",
				"Accurate Overburn Explosion",
				"Unstoppable Overburn Explosion"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Battle Standard",
				"Forbidden Knowledge",
				"Midas Staff",
				"Parrying Dagger",
				"Reveal Flaw",
				"Ring of Knowledge"
			],
			Rare: [
				"Thief's Battle Standard",
				"Tormenting Battle Standard",
				"Enticing Forbidden Knowledge",
				"Soothing Forbidden Knowledge",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Devoted Parrying Dagger",
				"Hastening Parrying Dagger",
				"Distracting Reveal Flaw",
				"Numbing Reveal Flaw",
				"Accurate Ring of Knowledge",
				"Swift Ring of Knowledge"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Buckler",
				"Conjured Ice Armaments",
				"Medic's Kit",
				"Net Launcher",
				"Universal Solution",
				"Wave Crash"
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
				"Centering Universal Solution",
				"Tormenting Universal Solution",
				"Disenchanting Wave Crash",
				"Fatiguing Wave Crash"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Arcane Sledge",
				"Enchantment Siphon",
				"Greatsword",
				"Lightning Staff",
				"Tempestuous Wrath",
				"Tornado Formation"
			],
			Rare: [
				"Fatiguing Arcane Sledge",
				"Kinetic Arcane Sledge",
				"Flanking Enchantment Siphon",
				"Tormenting Enchantment Siphon",
				"Chaining Greatsword",
				"Distracting Greatsword",
				"Disenchanting Lightning Staff",
				"Hexing Lightning Staff",
				"Flanking Tempestuous Wrath",
				"Opportunist's Tempestuous Wrath",
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
