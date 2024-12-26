const { RoomTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");
const { parseExpression } = require("../util/textUtil");

const enemies = [["Earthly Knight", "0.5*n"], ["Meteor Knight", "1"], ["Asteroid", "0.25*n-1"]];

module.exports = new RoomTemplate("Meteor Knight Fight",
	"Fire",
	"You are halted by a company of knights. By the time a Earthly Knight has advanced one step towards you, the Meteor Knight has recklessly charged across most of the gap!",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression("45*n", adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
