const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { RoomTemplate } = require("../classes");
const { parseExpression } = require("../util/mathUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Brute", "n*2"]];

module.exports = new RoomTemplate("Brute Convention",
	"Unaligned",
	"You're greeted by a book table with popular hits including: \"Stat-Checking for Dummies\", \"Sharp Objects: An Investment in Your Brute Career\", and \"Violence Gets You Everywhere\".\n\nAs you venture further into the convention hall, the keynote brute interrupts their presentation on \"How to be Faceless\" to highlight that a prime opportunity to practice mugging skills has just arrived.",
	function (adventure) {
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 3);
		adventure.room.addResource(rollArtifact(adventure), "Artifact", "loot", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*75`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		return [];
	},
	generateCombatRoomBuilder([])
).setEnemies(enemies);
