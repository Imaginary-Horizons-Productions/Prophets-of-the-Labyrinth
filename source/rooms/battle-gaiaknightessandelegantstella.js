const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Gaia Knightess", "1"], ["Elegant Stella", "1"], ["Asteroid", "0.34*n-1"]];

module.exports = new RoomTemplate("Gaia Knightess Fight",
	"Earth",
	`A Gaia Knightess catches up to you, "I got this Elegant Stella for being the #1 tank in class, and I'm going to prove it to you!`,
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("45*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
