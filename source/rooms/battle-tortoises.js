const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Tortoise Fight",
	"Earth",
	"The rocky terrain rises up to reveal a pair of shelled menaces.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("80", "loot", "gold")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).addEnemy("Geode Tortoise", "2");
