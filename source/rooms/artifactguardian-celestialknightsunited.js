const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Meteor Knight", "1"], ["Gaia Knightess", "1"], ["Luna Militissa", "1"], ["Comet the Sun Dog", "1"], ["Spacedust Cadet", "1"]];

module.exports = new RoomTemplate("Celestial Knights United",
	"Unaligned",
	"Though unable to agree on much, the Celestial Knights do agree on one thing: you need to be dealt with.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 3);
		adventure.room.addResource(rollArtifact(adventure), "Artifact", "loot", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*75`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
