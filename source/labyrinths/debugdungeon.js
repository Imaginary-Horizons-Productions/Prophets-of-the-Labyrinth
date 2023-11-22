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
				"Scythe",
			],
			Rare: [
				"Lethal Scythe",
				"Toxic Scythe",
				"Unstoppable Scythe",
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Barrier",
				"Lance",
				"Sabotage Kit"
			],
			Rare: [
				"Cleansing Barrier",
				"Devoted Barrier",
				"Long Barrier",
				"Accelerating Lance",
				"Unstoppable Lance",
				"Vigilant Lance",
				"Long Sabotage Kit",
				"Shattering Sabotage Kit",
				"Reactive Warhammer",
				"Slowing Warhammer",
				"Unstoppable Warhammer"
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Corrosion"
			],
			Rare: [
				"Flanking Corrosion",
				"Harmful Corrosion",
				"Shattering Corrosion"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Iron Fist Stance",
			],
			Rare: [
				"Organic Iron Fist Stance",
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Ice Bolt",
				"Poison Torrent",
				"Wolf Ring"
			],
			Rare: [
				"Harmful Poison Torrent",
				"Surpassing Wolf Ring",
				"Swift Wolf Ring"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Cloak",
				"Refreshing Breeze"
			],
			Rare: [
				"Accelerating Cloak",
				"Accurate Cloak",
				"Long Cloak",
			]
		},
		Untyped: {
			Cursed: [
			],
			Common: [
			],
			Rare: [
			]
		}
	},
	{
		"Event": ["Twin Pedestals", "Elemental Research", "Free Gold?", "Health Redistribution", "The Score Beggar", "Repair Kit, just hanging out", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Fight", "Mechabee Fight", "Slime Fight", "Tortoise Fight"],
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
