const { RoomTemplate } = require("../classes");
const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Treasure Elemental", "1"]];

module.exports = new RoomTemplate("A windfall of treasure!",
	"Earth",
	"Floor to ceiling, gold coins, gems and other valuables are stacked in massive piles. Out of the corner of your eyes, you notice a mass of treasure meld together...",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 3);
		adventure.room.addResource(rollArtifact(adventure), "Artifact", "loot", 1);
		const goldCount = Math.ceil(75 * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder(["greed"])
).setEnemies(enemies);
