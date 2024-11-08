const { LabyrinthTemplate } = require("../classes");

const RARITIES = ["Cursed", "Common", "Rare"];

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Untyped",
	"This labyrinth contains whatever the devs were testing most recently. Balance not guaranteed!",
	5,
	[5],
	Object.fromEntries(["Darkness", "Earth", "Fire", "Light", "Water", "Wind", "Untyped"].map(element => [element, [
		"Creative Acorn"
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
			"Reactive Battleaxe",
		]])),
		Light: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Floating Mist Stance",
			"Agile Floating Mist Stance",
			"Devoted Floating Mist Stance",
			"Soothing Floating Mist Stance",
			"Iron Fist Stance",
			"Accurate Iron Fist Stance",
			"Lucky Iron Fist Stance",
			"Organic Iron Fist Stance",
			"Hunter's Morning Star",
			"Distracting Prismatic Blast",
			"Flanking Prismatic Blast",
			"Harmful Shoulder Throw",
			"Staggering Shoulder Throw"
		]])),
		Water: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Blood Aegis",
			"Charging Blood Aegis",
			"Reinforced Blood Aegis",
			"Toxic Blood Aegis",
			"Corrosive Cauldron Stir",
			"Sabotaging Cauldron Stir",
			"Ice Bolt",
			"Awesome Ice Bolt",
			"Distracting Ice Bolt",
			"Unlucky Ice Bolt",
			"Bouncing Medicine",
			"Cleansing Medicine",
			"Soothing Medicine",
			"Omamori",
			"Centering Omamori",
			"Cleansing Omamori",
			"Devoted Omamori",
			"Distracting Poison Torrent",
			"Harmful Poison Torrent",
			"Staggering Poison Torrent"
		]])),
		Wind: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Unstoppable Bow",
			"Slowing Daggers",
			"Accelerating Refreshing Breeze",
			"Supportive Refreshing Breeze",
			"Swift Refreshing Breeze"
		]])),
		Untyped: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Poised Chainmail",
			"Powerful Chainmail",
			"Accurate Scarf",
			"Wise Scarf",
			"Lucky Second Wind",
			"Flanking Strong Attack",
			"Wise Wolf Ring"
		]]))
	},
	{
		// Labyrinth Particulars - more customized
		"Event": ["Door 1 or Door 2?"],
		"Battle": ["Frog Ranch", "Wild Fire-Arrow Frogs", "Meteor Knight Fight"],
		"Artifact Guardian": ["A Slimy Throneroom", "A windfall of treasure!"],
		"Final Battle": ["Hall of Mirrors"],

		// Labyrinth Infrastructure - less customized
		"Merchant": ["Gear Buying Merchant"],
		"Rest Site": ["Rest Site: Mysterious Challenger", "Rest Site: Training Dummy"],
		"Workshop": ["Abandoned Forge", "Workshop with Black Box", "Tanning Workshop"],
		"Treasure": ["Treasure! Artifact or Gear?", "Treasure! Artifact or Gold?", "Treasure! Artifact or Items?", "Treasure! Gear or Items?", "Treasure! Gold or Gear?", "Treasure! Gold or Items?"],
		"Empty": ["Empty Room"]
	}
);
