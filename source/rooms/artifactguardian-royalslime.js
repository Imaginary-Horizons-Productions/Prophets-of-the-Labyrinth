const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("A Slimy Throneroom",
	"@{adventure}",
	"A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!",
	[
		new ResourceTemplate("3", "internal", "levelsGained"),
		new ResourceTemplate("1", "loot", "artifact"),
		new ResourceTemplate("50*n", "loot", "gold")
	],
	generateCombatRoomBuilder([])
).addEnemy("Royal Slime", "0.5*n");
