const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["@{adventure} Slime", "0.5*n"], ["@{adventureOpposite} Ooze", "0.5*n"]];

module.exports = new RoomTemplate("Slime Fight",
	"@{adventure}",
	"Some slimes and oozes approach...",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate("35*n", "loot", "Currency")
	],
	function (adventure) { },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
