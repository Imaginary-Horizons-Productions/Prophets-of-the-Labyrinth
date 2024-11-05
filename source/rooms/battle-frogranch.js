const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Mechabee Soldier", "1"], ["Fire-Arrow Frog", "0.5*n"], ["Mechabee Soldier", "1"]];

module.exports = new RoomTemplate("Frog Ranch",
	"Earth",
	"Two Mechabee Soldiers are interrupted while escorting a set of domesticated Fire-Arrow Frogs to another pasture.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate(`${enemies[1][1]}*25+35`, "loot", "Currency")
	],
	function (adventure) { },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
