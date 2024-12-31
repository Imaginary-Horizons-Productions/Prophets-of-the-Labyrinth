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
			"Warhammer",
			"Fatiguing Warhammer",
			"Vigorous Warhammer"
	]])),
		Earth: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Flail",
			"Bouncing Flail",
			"Incompatible Flail",
			"Sandstorm Formation",
			"Balanced Sandstorm Formation",
			"Soothing Sandstorm Formation"
		]])),
		Fire: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Bonfire Formation",
			"Charging Bonfire Formation",
			"Hastening Bonfire Formation",
			"Longsword",
			"Double Longsword",
			"Reactive Longsword",
		]])),
		Light: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Battle Standard",
			"Thief's Battle Standard",
			"Tormenting Battle Standard",
			"Reveal Flaw",
			"Distracting Reveal Flaw",
			"Numbing Reveal Flaw"
		]])),
		Water: Object.fromEntries(RARITIES.map(rarity => [rarity, [
			"Conjured Ice Armaments",
			"Supportive Conjured Ice Armaments",
			"Vigilant Conjured Ice Armaments",
			"Net Launcher",
			"Kinetic Net Launcher",
			"Staggering Net Launcher",
		]])),
		Wind: Object.fromEntries(RARITIES.map(rarity => [rarity, [
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
