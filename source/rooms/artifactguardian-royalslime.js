const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Royal Slime", "0.5*n"]];

module.exports = new RoomTemplate("A Slimy Throneroom",
	"@{adventure}",
	"Artifact Guardian",
	"Off to the side of the room lays a knocked over thone and crown. As the party approaches it, slime gushes from the ceiling, engulfing the objects. The slime collects stands itself up into a teardrop shape, suspending the throne inside it and the crown atop it, then begins rolling in the direction of the party.",
	[
		new ResourceTemplate("3", "internal", "levelsGained"),
		new ResourceTemplate("1", "loot", "Artifact"),
		new ResourceTemplate(`${enemies[0][1]}*100`, "loot", "Currency")
	],
	function (adventure) { return {}; },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
