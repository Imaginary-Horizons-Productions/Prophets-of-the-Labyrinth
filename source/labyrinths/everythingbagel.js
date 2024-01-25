const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Everything Bagel",
	"Untyped",
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
				"Life Drain",
				"Power from Wrath",
				"Risky Mixture",
				"Scythe",
			],
			Rare: [
				"Charging Blood Aegis",
				"Reinforced Blood Aegis",
				"Sweeping Blood Aegis",
				"Flanking Life Drain",
				"Reactive Life Drain",
				"Urgent Life Drain",
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
				"Herb Basket",
				"Lance",
				"Pistol",
				"Sabotage Kit",
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
				"Double Pistol",
				"Duelist's Pistol",
				"Long Sabotage Kit",
				"Shattering Sabotage Kit",
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
				"Scutum",
				"Shortsword",
				"War Cry"
			],
			Rare: [
				"Prideful Battleaxe",
				"Thick Battleaxe",
				"Thirsting Battleaxe",
				"Fate-Sealing Censer",
				"Thick Censer",
				"Tormenting Censer",
				"Flanking Corrosion",
				"Harmful Corrosion",
				"Shattering Corrosion",
				"Double Firecracker",
				"Mercurial Firecracker",
				"Toxic Firecracker",
				"Guarding Scutum",
				"Sweeping Scutum",
				"Vigilant Scutum",
				"Accelerating Shortsword",
				"Toxic Shortsword",
				"Charging War Cry",
				"Slowing War Cry",
				"Tormenting War Cry"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Floating Mist Stance",
				"Infinite Regeneration",
				"Iron Fist Stance",
				"Morning Star",
				"Prismatic Blast",
				"Sun Flare"
			],
			Rare: [
				"Soothing Floating Mist Stance",
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Organic Iron Fist Stance",
				"Vexing Prismatic Blast",
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
				"Cauldron Stir",
				"Ice Bolt",
				"Medicine",
				"Midas Staff",
				"Poison Torrent",
			],
			Rare: [
				"Hunter's Abacus",
				"Sharpened Abacus",
				"Toxic Abacus",
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
				"Cloak",
				"Daggers",
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
				"Mercurial Bow",
				"Accelerating Cloak",
				"Accurate Cloak",
				"Long Cloak",
				"Sharpened Daggers",
				"Slowing Daggers",
				"Sweeping Daggers",
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
			],
			Common: [
				"Chainmail",
				"Scarf",
				"Second Wind",
				"Strong Attack",
				"Wolf Ring"
			],
			Rare: [
				"Wise Chainmail",
				"Hearty Scarf",
				"Cleansing Second Wind",
				"Soothing Second Wind",
				"Sharpened Strong Attack",
				"Staggering Strong Attack",
				"Surpassing Wolf Ring",
				"Swift Wolf Ring"
			]
		}
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Twin Pedestals", "Imp Contract Faire", "Free Gold?", "The Score Beggar", "Repair Kit, just hanging out", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
