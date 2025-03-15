const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Luna Militissa", "1"], ["Gust Wolf", "1+n*0.5"]];

module.exports = new RoomTemplate("Luna Militissa Fight",
	"Darkness",
	"Luna Militissa, Celestial Knight of the Dark Moon, seems to be the only one aware that the party is a group of castle siegers.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("45*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
