const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("A windfall of treasure!",
	"Earth",
	"Artifact Guardian",
	"Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...",
	[
		new ResourceTemplate("3", "internal", "levelsGained"),
		new ResourceTemplate("1", "loot", "artifact")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder(["greed"])
).addEnemy("Treasure Elemental", "1");
