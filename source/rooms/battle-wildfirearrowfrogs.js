const { RoomTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");
const { parseExpression } = require("../util/textUtil");

const enemies = [["Fire-Arrow Frog", "n"]];

module.exports = new RoomTemplate("Wild Fire-Arrow Frogs",
	"Fire",
	"A blaze of orange and red in the muck outs itself as a warning sign to a blast of heated mud and venom.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*35`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
