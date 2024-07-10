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
		Untyped: []
	},
	{
		Darkness: {
			Cursed: [
			],
			Common: [
				"Blood Aegis",
				"Life Drain"
			],
			Rare: [
				"Toxic Blood Aegis",
				"Furious Life Drain",
				"Thirsting Life Drain"
			]
		},
		Earth: {
			Cursed: [
			],
			Common: [
				"Pistol",
				"Sabotage Kit",
				"Spear"
			],
			Rare: [
				"Flanking Pistol",
				"Urgent Sabotage Kit",
				"Lethal Spear",
				"Reactive Spear",
				"Sweeping Spear",
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
				"Infinite Regeneration",
				"Shortsword"
			],
			Rare: [
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Staggering Censer",
				"Fate-Sealing Corrosion",
				"Midas's Firecracker",
				"Discounted Infinite Regeneration",
				"Fate-Sealing Infinite Regeneration",
				"Lethal Shortsword"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
				"Shoulder Throw",
				"War Cry"
			],
			Rare: [
				"Evasive Shoulder Throw",
				"Charging War Cry",
				"Slowing War Cry",
				"Tormenting War Cry"
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
				"Cauldron Stir",
				"Medicine"
			],
			Rare: [
				"Corrosive Cauldron Stir",
				"Sabotaging Cauldron Stir",
				"Bouncing Medicine",
				"Cleansing Medicine",
				"Soothing Medicine"
			]
		},
		Wind: {
			Cursed: [
			],
			Common: [
				"Bow"
			],
			Rare: [
				"Unstoppable Bow"
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
		// Labyrinth Particulars - more customized
		"Event": ["Imp Contract Faire", "The Score Beggar", "Free Gold?", "Apple Pie Wishing Well", "Twin Pedestals", "Gear Collector", "Repair Kit, just hanging out"],
		"Battle": ["Frog Ranch", "Wild Fire-Arrow Frogs", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
