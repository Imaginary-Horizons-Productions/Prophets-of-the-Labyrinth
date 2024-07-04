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
				"Sabotage Kit"
			],
			Rare: [
				"Flanking Pistol",
				"Urgent Sabotage Kit"
			]
		},
		Fire: {
			Cursed: [
			],
			Common: [
				"Battleaxe",
				"Censor",
				"Corrosion",
				"Firecracker"
			],
			Rare: [
				"Furious Battleaxe",
				"Reactive Battleaxe",
				"Staggering Censor",
				"Fate-Sealing Corrosion",
				"Midas's Firecracker"
			]
		},
		Light: {
			Cursed: [
			],
			Common: [
			],
			Rare: [
			]
		},
		Water: {
			Cursed: [
			],
			Common: [
			],
			Rare: [
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
