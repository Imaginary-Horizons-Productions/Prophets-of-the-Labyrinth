const { RoomTemplate } = require("../classes");
const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Royal Slime", "0.5*n"]];

module.exports = new RoomTemplate("A Slimy Throneroom",
	"@{adventure}",
	"Off to the side of the room lays a knocked over thone and crown. As the party approaches it, slime gushes from the ceiling, engulfing the objects. The slime collects stands itself up into a teardrop shape, suspending the throne inside it and the crown atop it, then begins rolling in the direction of the party.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 3);
		adventure.room.addResource(rollArtifact(adventure), "Artifact", "loot", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*100`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
