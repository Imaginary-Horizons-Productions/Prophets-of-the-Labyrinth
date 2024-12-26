const { RoomTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");
const { parseExpression } = require("../util/textUtil");

const enemies = [["Mechabee Soldier", "1"], ["Fire-Arrow Frog", "0.5*n"], ["Mechabee Soldier", "1"]];

module.exports = new RoomTemplate("Frog Ranch",
	"Earth",
	"Two Mechabee Soldiers are interrupted while escorting a set of domesticated Fire-Arrow Frogs to another pasture.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[1][1]}*25+35`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
