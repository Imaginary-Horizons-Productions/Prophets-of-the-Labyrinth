const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	10,
	[10],
	{
		Darkness: [],
		Earth: [],
		Fire: [],
		Light: [],
		Water: [],
		Wind: [],
		Untyped: ["Panacea", "Placebo"]
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
			],
			Rare: [
				"Organic Herb Basket",
				"Reinforced Herb Basket",
				"Urgent Herb Basket"
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
				"Prismatic Blast"
			],
			Rare: [
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
				"Toxic Abacus",
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
		"Event": ["Imp Contract Faire", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Fight", "Mechabee Fight", "Slime Fight", "Tortoise Fight"],
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger"],
		"Final Battle": ["Confronting the Top Celestial Knight"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
