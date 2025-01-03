const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

const RARITIES = ["Cursed", "Common", "Rare"];

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	"This labyrinth contains whatever the devs were testing most recently. Balance not guaranteed!",
	10,
	[10],
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
			"Chaining Risky Mixture",
			"Midas's Risky Mixture",
		]])),
		Earth: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Carrot",
			"Devoted Carrot",
			"Lucky Carrot",
			"Reinforced Carrot",
			"Vigorous Warhammer",
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
			"Adventurer's Air Blades",
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
		// Rooms
		"Event": ["Apple Pie Wishing Well", "Door 1 or Door 2?", "Free Gold?", "Gear Collector", "Imp Contract Faire", "The Score Beggar", "Twin Pedestals", "Workshop", "Merchant", "Rest Site", "Library", "Treasure"],
		"Battle": ["Hawk Fight", "Frog Ranch", "Wild Fire-Arrow Frogs", "Mechabee Fight", "Slime Fight", "Tortoise Fight", "Meteor Knight Fight"],
		"Artifact Guardian": ["Brute Convention"],
		"Final Battle": ["Hall of Mirrors"],
		...standardLabyrinthInfrastructure
	}
);
