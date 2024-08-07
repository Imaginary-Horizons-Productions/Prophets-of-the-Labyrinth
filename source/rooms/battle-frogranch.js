const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

module.exports = new RoomTemplate("Frog Ranch",
	"Earth",
	"Battle",
	"Two Mechabee Soldiers are interrupted while escorting a set of domesticated Fire-Arrow Frogs to another pasture.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("50*n", "loot", "gold")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).addEnemy("Mechabee Soldier", "1")
	.addEnemy("Fire-Arrow Frog", "0.5*n")
	.addEnemy("Mechabee Soldier", "1");
