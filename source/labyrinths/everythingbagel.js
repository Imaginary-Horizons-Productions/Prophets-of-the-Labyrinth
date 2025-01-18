const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

module.exports = new LabyrinthTemplate("Everything Bagel",
	"Unaligned",
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
				"Shadow of Confusion",
				"Spiked Shield",
				"Vengeful Void",
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
				"Incompatible Shadow of Confusion",
				"Shattering Shadow of Confusion",
				"Furious Spiked Shield",
				"Reinforced Spiked Shield",
				"Hexing Vengeful Void",
				"Numbing Vengeful Void",
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
				"Medicine",
				"Nature's Caprice",
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
				"Hastening Medicine",
				"Urgent Medicine",
				"Accurate Nature's Caprice",
				"Hearty Nature's Caprice",
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
				"Flame Scythes",
				"Heat Weaken",
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
				"Thief's Flame Scythes",
				"Toxic Flame Scythes",
				"Numbing Heat Weaken",
				"Staggering Heat Weaken",
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
				"Forbidden Knowledge",
				"Midas Staff",
				"Net Launcher",
				"Parrying Dagger",
				"Reveal Flaw",
				"Ring of Knowledge"
			],
			Rare: [
				"Encouragement",
				"Rallying Encouragement",
				"Vigorous Encouragement",
				"Enticing Forbidden Knowledge",
				"Soothing Forbidden Knowledge",
				"Illumination",
				"Balanced Illumination",
				"Inspiring Illumination",
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Thief's Net Launcher",
				"Tormenting Net Launcher",
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
				"Conjured Ice Pillar",
				"Medic's Kit",
				"Steam Wall",
				"Trident",
				"Universal Solution",
				"Wave Crash"
			],
			Rare: [
				"Guarding Buckler",
				"Supportive Buckler",
				"Devoted Conjured Ice Pillar",
				"Taunting Conjured Ice Pillar",
				"Cleansing Medic's Kit",
				"Warning Medic's Kit",
				"Supportive Steam Wall",
				"Vigilant Steam Wall",
				"Kinetic Trident",
				"Staggering Trident",
				"Centering Universal Solution",
				"Tormenting Universal Solution",
				"Accelerating Water's Stillness",
				"Cleansing Water's Stillness",
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
				"Tornado Formation",
				"Vacuum Implosion",
				"Wind Burst"
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
				"Supportive Tornado Formation",
				"Shattering Vacuum Implosion",
				"Urgent Vacuum Implosion",
				"Inspiring Wind Burst",
				"Toxic Wind Burst"
			]
		},
		Unaligned: {
			Cursed: [
				"Cursed Blade",
				"Cursed Shield",
				"Cursed Doll",
				"Cursed Bag",
				"Cursed Tome",
				"Cursed Grimore",
				"Cursed Scroll"
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
		"Event": ["Apple Pie Wishing Well", "Door 1 or Door 2?", "Free Gold?", "Gear Collector", "Imp Contract Faire", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!", "Brute Convention"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],
		...standardLabyrinthInfrastructure
	}
);
