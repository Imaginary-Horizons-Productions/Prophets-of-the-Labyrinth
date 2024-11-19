const { LabyrinthTemplate } = require("../classes");

const RARITIES = ["Cursed", "Common", "Rare"];

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	"This labyrinth contains whatever the devs were testing most recently. Balance not guaranteed!",
	5,
	[5],
	Object.fromEntries(["Darkness", "Earth", "Fire", "Light", "Water", "Wind", "Untyped"].map(element => [element, [
		"Creative Acorn",
		"Flexigrass",
	]])),
	{
		Darkness: Object.fromEntries(RARITIES.map(rarity => [rarity, [
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
		]])),
		Earth: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Carrot",
			"Devoted Carrot",
			"Lucky Carrot",
			"Reinforced Carrot",
			"Reactive Warhammer",
			"Reactive Spear",
			"Stick",
			"Staggering Stick",
			"Shattering Stick",
			"Sharpened Stick"
		]])),
		Fire: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Double Firecracker",
		]])),
		Light: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Buckler",
			"Accelerating Buckler",
			"Devoted Buckler",
			"Guarding Buckler",
			"Lance",
			"Duelist's Lance",
			"Shattering Lance",
			"Surpassing Lance"
		]])),
		Water: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Universal Solution",
			"Centering Universal Solution",
			"Evasive Universal Solution",
			"Harmful Universal Solution"
		]])),
		Wind: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Air Blades",
			"Accelerating Air Blades",
			"Toxic Air Blades",
			"Unstoppable Air Blades"
		]])),
		Untyped: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Pistol",
			"Double Pistol",
			"Duelist's Pistol",
			"Flanking Pistol",
		]]))
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Apple Pie Wishing Well", "Door 1 or Door 2?", "Free Gold?", "Gear Collector", "Imp Contract Faire", "Repair Kit, just hanging out", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["A Northern Laboratory", "Hall of Mirrors", "The Hexagon: Bee Mode", "The Hexagon: Mech Mode", "Confronting the Top Celestial Knight"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Merchant", "Item Merchant", "Overpriced Merchant", "Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
