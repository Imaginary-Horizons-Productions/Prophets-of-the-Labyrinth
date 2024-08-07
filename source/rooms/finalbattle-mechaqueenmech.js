const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("The Hexagon: Bee Mode",
	"Earth",
	"Final Battle",
	"Myriad six-sided holograms flicker on as you enter the room displaying formations, statistics, and supply information. An alarm blares, and some mechabees (and their queen!) charge you. It dawns on you: they are in fact, more bee than mech.",
	[
		new ResourceTemplate("5", "internal", "levelsGained")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).addEnemy("Mecha Queen: Bee Mode", "1")
	.addEnemy("Mechabee Drone", "n");
