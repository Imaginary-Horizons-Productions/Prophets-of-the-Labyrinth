const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Bloodtail Hawk", "1.5*n"]];

module.exports = new RoomTemplate("Hawk Fight",
	"Wind",
	"Battle",
	"A flock of birds of prey swoop down looking for a meal.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate(`${enemies[0][1]}*35`, "loot", "Currency")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
