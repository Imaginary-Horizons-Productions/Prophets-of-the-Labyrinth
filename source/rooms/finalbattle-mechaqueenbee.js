const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("The Hexagon: Mech Mode",
	"Darkness",
	"Final Battle",
	"Myriad six-sided holograms flicker on as you enter the room displaying formations, statistics, and supply information. An alarm blares, and some mechabees (and their queen!) charge you. It dawns on you: they are in fact, more mech than bee.",
	[
		new ResourceTemplate("5", "internal", "levelsGained")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(["Mecha Queen: Mech Mode", "1"], ["Mechabee Drone", "n"]);
