const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Treasure Elemental", "1"]];

module.exports = new RoomTemplate("A windfall of treasure!",
	"Earth",
	"Artifact Guardian",
	"Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...",
	[
		new ResourceTemplate("3", "internal", "levelsGained"),
		new ResourceTemplate("1", "loot", "Artifact"),
		new ResourceTemplate("75", "loot", "Currency")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder(["greed"])
).setEnemies(enemies);
