const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	5,
	[5],
	{
		Darkness: [],
		Earth: [],
		Fire: [],
		Light: [],
		Water: [],
		Wind: [],
		Untyped: ["Placebo"]
	},
	{
		Darkness: {
			Cursed: [
			],
			Common: [
				"Risky Mixture",
			],
			Rare: [
				"Long Risky Mixture"
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Herb Basket",
				"Lance"
			],
			Rare: [
				"Organic Herb Basket",
				"Reinforced Herb Basket",
				"Urgent Herb Basket",
				"Shattering Lance"
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
				"Morning Star",
				"Prismatic Blast"
			],
			Rare: [
				"Awesome Morning Star",
				"Bashing Morning Star",
				"Vexing Prismatic Blast"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Abacus",
				"Cauldron Stir",
				"Medicine"
			],
			Rare: [
				"Hunter's Abacus",
				"Sharpened Abacus",
				"Unstoppable Abacus",
				"Toxic Cauldron Stir"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Barrier",
			],
			Rare: [
				"Cleansing Barrier",
				"Devoted Barrier",
				"Long Barrier",
			]
		},
		Untyped: {
			Cursed: [
				"Cursed Blade",
				"Cursed Tome"
			],
			Common: [
				"Chainmail",
				"Second Wind",
				"Strong Attack"
			],
			Rare: [
				"Wise Chainmail",
				"Cleansing Second Wind",
				"Soothing Second Wind",
				"Sharpened Strong Attack",
				"Staggering Strong Attack"
			]
		}
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["The Score Beggar", "Free Gold?", "Apple Pie Wishing Well", "Twin Pedestals", "Gear Collector"],
		"Battle": ["Frog Ranch", "Wild Fire-Arrow Frogs"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
