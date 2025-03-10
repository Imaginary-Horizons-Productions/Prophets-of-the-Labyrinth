const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Elegant Stella", "1"], ["Pulsar Zebra", "0.5*n"]];

module.exports = new RoomTemplate("Stars and Stripes",
	"Light",
	"Visual overload abounds.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("45*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
