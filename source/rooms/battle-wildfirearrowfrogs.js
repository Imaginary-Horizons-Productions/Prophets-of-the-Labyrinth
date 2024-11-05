const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Fire-Arrow Frog", "n"]];

module.exports = new RoomTemplate("Wild Fire-Arrow Frogs",
	"Fire",
	"Battle",
	"A blaze of orange and red in the muck outs itself as a warning sign to a blast of heated mud and venom.",
	[
		new ResourceTemplate("1", "internal", "levelsGained"),
		new ResourceTemplate(`${enemies[0][1]}*35`, "loot", "Currency")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
