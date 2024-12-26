const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Mirror Clone", "n"]];

module.exports = new RoomTemplate("Hall of Mirrors",
	"Unaligned",
	"A long hall of wavy mirrors sits silently between the party and the door... until a bunch of shadows step out of the mirror and attack the party!",
	[
		new ResourceTemplate("5", "internal", "levelsGained")
	],
	function (adventure) { },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
