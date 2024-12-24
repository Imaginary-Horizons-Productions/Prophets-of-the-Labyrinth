const { RoomTemplate, ResourceTemplate } = require("../classes");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");

const enemies = [["Brute", "n*2"]];

module.exports = new RoomTemplate("Brute Convention",
	"Unaligned",
	"You're greeted by a book table with popular hits including: \"Stat-Checking for Dummies\", \"Sharp Objects: An Investment in Your Brute Career\", and \"Violence Gets You Everywhere\".\n\nAs you venture further into the convention hall, the keynote brute interrupts their presentation on \"How to be Faceless\" to highlight that a prime opportunity to practice mugging skills has just arrived.",
	[
		new ResourceTemplate("3", "internal", "levelsGained"),
		new ResourceTemplate("1", "loot", "Artifact"),
		new ResourceTemplate(`${enemies[0][1]}*75`, "loot", "Currency")
	],
	function (adventure) { },
	generateCombatRoomBuilder([])
).setEnemies(enemies);
