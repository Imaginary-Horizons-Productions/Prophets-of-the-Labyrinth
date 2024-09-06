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
				"Bashing Power from Wrath",
				"Hunter's Power from Wrath",
				"Staggering Power from Wrath",
				"Toxic Blood Aegis",
				"Furious Life Drain",
				"Thirsting Life Drain",
				"Midas's Risky Mixture",
				"Thick Risky Mixture",
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
				"Reckless Certain Victory",
				"Flanking Goad Futility",
				"Poised Goad Futility",
				"Shattering Goad Futility"
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
				"Purifying Infinite Regeneration",
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
				"Floating Mist Stance",
				"Agile Floating Mist Stance",
				"Devoted Floating Mist Stance",
				"Soothing Floating Mist Stance",
				"Iron Fist Stance",
				"Accurate Iron Fist Stance",
				"Organic Iron Fist Stance",
				"Hunter's Morning Star",
				"Distracting Prismatic Blast",
				"Harmful Shoulder Throw",
				"Staggering Shoulder Throw"
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
				"Ice Bolt",
				"Awesome Ice Bolt",
				"Distracting Ice Bolt",
				"Bouncing Medicine",
				"Cleansing Medicine",
				"Soothing Medicine",
				"Distracting Poison Torrent",
				"Harmful Poison Torrent",
				"Staggering Poison Torrent"
			],
			Rare: [
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Unstoppable Bow",
				"Slowing Daggers",
				"Supportive Refreshing Breeze",
				"Swift Refreshing Breeze"
			],
			Rare: [
			]
		},
		Untyped: {
			Cursed: [
			],
			Common: [
				"Poised Chainmail",
				"Powerful Chainmail",
				"Accurate Scarf",
				"Wise Scarf",
				"Lucky Second Wind",
				"Flanking Strong Attack",
				"Wise Wolf Ring"
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
