const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Geode Tortoise", "2"]];

module.exports = new RoomTemplate("Tortoise Fight",
	"Earth",
	"Battle",
	"The rocky terrain rises up to reveal a pair of shelled menaces.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("40*n", "loot", "gold")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
