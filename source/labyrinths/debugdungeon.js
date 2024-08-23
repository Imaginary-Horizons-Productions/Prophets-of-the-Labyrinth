const { LabyrinthTemplate } = require("../classes");

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	"This labyrinth contains whatever the devs were testing most recently. Balance not guaranteed!",
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
				"Blood Aegis",
				"Power from Wrath",
				"Toxic Blood Aegis",
				"Furious Life Drain",
				"Thirsting Life Drain"
			],
			Rare: [
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Certain Victory",
				"Hunter's Certain Victory",
				"Lethal Certain Victory",
				"Reckless Certain Victory"
			],
			Rare: [
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Firecracker",
				"Infinite Regeneration",
				"Shortsword",
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Staggering Censer",
				"Fate-Sealing Corrosion",
				"Midas's Firecracker",
				"Toxic Firecracker",
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Accelerating Shortsword",
				"Lethal Shortsword",
				"Toxic Shortsword"
			],
			Rare: [
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Agile Floating Mist Stance",
				"Hunter's Morning Star"
			],
			Rare: [
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Blood Aegis",
				"Charging Blood Aegis",
				"Reinforced Blood Aegis",
				"Toxic Blood Aegis",
				"Corrosive Cauldron Stir",
				"Sabotaging Cauldron Stir",
				"Bouncing Medicine",
				"Cleansing Medicine",
				"Soothing Medicine",
				"Distracting Poison Torrent",
				"Harmful Poison Torrent"
			],
			Rare: [
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Unstoppable Bow",
				"Slowing Daggers"
			],
			Rare: [
			]
		},
		Untyped: {
			Cursed: [
			],
			Common: [
				"Lucky Second Wind",
				"Flanking Strong Attack"
			],
			Rare: [
			]
		}
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Imp Contract Faire", "The Score Beggar", "Free Gold?", "Apple Pie Wishing Well", "Twin Pedestals", "Gear Collector", "Repair Kit, just hanging out"],
		"Battle": ["Frog Ranch", "Wild Fire-Arrow Frogs", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["A Northern Laboratory", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
