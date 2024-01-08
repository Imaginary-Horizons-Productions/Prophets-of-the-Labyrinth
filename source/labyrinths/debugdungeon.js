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
				"Blood Aegis",
				"Life Drain",
				"Power from Wrath",
				"Scythe",
			],
			Rare: [
				"Charging Blood Aegis",
				"Reinforced Blood Aegis",
				"Sweeping Blood Aegis",
				"Flanking Life Drain",
				"Reactive Life Drain",
				"Urgent Life Drain",
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
				"Buckler",
				"Certain Victory",
				"Lance",
				"Pistol",
				"Sabotage Kit",
				"Warhammer"
			],
			Rare: [
				"Cleansing Barrier",
				"Devoted Barrier",
				"Long Barrier",
				"Devoted Buckler",
				"Guarding Buckler",
				"Reinforced Buckler",
				"Hunter's Certain Victory",
				"Lethal Certain Victory",
				"Reckless Certain Victory",
				"Accelerating Lance",
				"Unstoppable Lance",
				"Vigilant Lance",
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
				"Ice Bolt",
				"Midas Staff",
				"Poison Torrent",
				"Potion Kit",
				"Sickle"
			],
			Rare: [
				"Accelerating Midas Staff",
				"Discounted Midas Staff",
				"Soothing Midas Staff",
				"Harmful Poison Torrent",
				"Organic Potion Kit",
				"Reinforced Potion Kit",
				"Urgent Potion Kit",
				"Hunter's Sickle",
				"Sharpened Sickle",
				"Toxic Sickle"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Bow",
				"Cloak",
				"Daggers",
				"Inspiration",
				"Spear",
				"Refreshing Breeze"
			],
			Rare: [
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
				"Chainmail"
			],
			Rare: [
				"Wise Chainmail"
			]
		}
	},
	{
		"Event": ["Imp Contract Faire", "Workshop", "Merchant", "Rest Site", "Treasure"],
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
