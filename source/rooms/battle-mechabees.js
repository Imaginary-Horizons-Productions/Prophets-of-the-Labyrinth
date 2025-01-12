const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Mechabee Drone", "n*0.25"], ["Mechabee Soldier", "1"], ["Mechabee Drone", "n*0.25"]];

module.exports = new RoomTemplate("Mechabee Fight",
	"Earth",
	"Some mechabees charge at you. In addition to starting a fight, it prompts you to wonder if mechabees are more mech or more bee.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("25*n+35", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
