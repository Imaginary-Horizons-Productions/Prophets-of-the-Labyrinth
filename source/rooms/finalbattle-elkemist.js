const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("A Northern Laboratory",
	"Water",
	"Flasks, beakers, vials and a myriad unknown substances line the innumerable tables and shelves of this room. An elk wanders from table to whiteboard to shelf, muttering various alchemical formuae to itself and taking absolutely no notice of the party.",
	[
		new ResourceTemplate("5", "internal", "levelsGained")
	],
	generateCombatRoomBuilder([])
).addEnemy("Elkemist", "1");
