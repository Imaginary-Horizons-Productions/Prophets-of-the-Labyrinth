const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Spacedust Cadet", "1"], ["Pulsar Zebra", "n+1*0.5"]];

module.exports = new RoomTemplate("Spacedust Cadet Fight",
	"Wind",
	"A Spacedust Cadet attempts to run the party out of the castle, insisting that food inspectors aren't welcome.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("45*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
