const { LabyrinthTemplate } = require("../classes");
const { standardLabyrinthInfrastructure } = require("./shared");

const RARITIES = ["Cursed", "Common", "Rare"];

module.exports = new LabyrinthTemplate("Debug Dungeon",
	"Unaligned",
	"This labyrinth contains whatever the devs were testing most recently. Balance not guaranteed!",
	10,
	[10],
	Object.fromEntries(["Darkness", "Earth", "Fire", "Light", "Water", "Wind", "Unaligned"].map(essence => [essence, [
		"Creative Acorn",
		"Finesse Fiber",
	]])),
	{
		Darkness: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Fever Break",
			"Fatiguing Fever Break",
			"Unstoppable Fever Break",
			"Spiked Shield",
			"Furious Spiked Shield",
			"Reinforced Spiked Shield",
			"War Cry",
			"Flanking War Cry",
			"Weakening War Cry",
			"Warhammer",
			"Fatiguing Warhammer",
			"Toxic Warhammer"
		]])),
		Earth: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Carrot",
			"Balanced Carrot",
			"Guarding Carrot",
			"Flail",
			"Bouncing Flail",
			"Incompatible Flail",
			"Sandstorm Formation",
			"Balanced Sandstorm Formation",
			"Soothing Sandstorm Formation",
			"Smokescreen",
			"Chaining Smokescreen",
			"Double Smokescreen"
		]])),
		Fire: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Bonfire Formation",
			"Charging Bonfire Formation",
			"Hastening Bonfire Formation",
			"Cloak",
			"Accurate Cloak",
			"Powerful Cloak",
			"Elemental Scroll",
			"Balanced Elemental Scroll",
			"Surpassing Elemental Scroll",
			"Longsword",
			"Double Longsword",
			"Lethal Longsword",
		]])),
		Light: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Battle Standard",
			"Thief's Battle Standard",
			"Tormenting Battle Standard",
			"Midas Staff",
			"Accelerating Midas Staff",
			"Discounted Midas Staff",
			"Parrying Dagger",
			"Devoted Parrying Dagger",
			"Hastening Parrying Dagger",
			"Reveal Flaw",
			"Distracting Reveal Flaw",
			"Numbing Reveal Flaw"
		]])),
		Water: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Buckler",
			"Guarding Buckler",
			"Supportive Buckler",
			"Conjured Ice Armaments",
			"Supportive Conjured Ice Armaments",
			"Vigilant Conjured Ice Armaments",
			"Medic's Kit",
			"Inspiring Medic's Kit",
			"Warning Medic's Kit",
			"Net Launcher",
			"Kinetic Net Launcher",
			"Staggering Net Launcher",
		]])),
		Wind: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Arcane Sledge",
			"Fatiguing Arcane Sledge",
			"Kinetic Arcane Sledge",
			"Enchantment Siphon",
			"Flanking Enchantment Siphon",
			"Tormenting Enchantment Siphon",
			"Greatsword",
			"Chaining Greatsword",
			"Distracting Greatsword",
			"Tornado Formation",
			"Charging Tornado Formation",
			"Supportive Tornado Formation"
		]])),
		Unaligned: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Boots of Comfort",
			"Mighty Gauntlet",
			"Scarf",
			"Wolf Ring",
			"Accurate Boots of Comfort",
			"Hearty Boots of Comfort",
			"Powerful Boots of Comfort",
			"Accurate Mighty Gauntlet",
			"Hearty Mighty Gauntlet",
			"Swift Mighty Gauntlet",
			"Hearty Scarf",
			"Powerful Scarf",
			"Swift Scarf",
			"Accurate Wolf Ring",
			"Powerful Wolf Ring",
			"Swift Wolf Ring"
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
