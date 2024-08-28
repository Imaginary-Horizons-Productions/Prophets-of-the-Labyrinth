const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Mechabee Fight",
	"Earth",
	"Battle",
	"Some mechabees charge at you. In addition to starting a fight, it prompts you to wonder if mechabees are more mech or more bee.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("25*n", "loot", "gold")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(["Mechabee Drone", "n*0.25"], ["Mechabee Soldier", "1"], ["Mechabee Drone", "n*0.25"]);
