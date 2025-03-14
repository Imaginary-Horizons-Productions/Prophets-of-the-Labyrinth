const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { rollArtifact } = require("../artifacts/_artifactDictionary");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");
const { parseExpression } = require("../util/mathUtil");

const enemies = [["Comet the Sun Dog", "1"], ["Gust Wolf", "1*n"], ["Unkind Raven", "1"]];


module.exports = new RoomTemplate("Let Sleeping Dogs Lie",
	"@{adventure}",
	"You come across a snow-covered courtyard where there lies a great Frosty Siberian Husky, currently napping with its fangs clenched around a Sword of the Sun. Do you try to pry the sword from its jaws?",
	function (adventure) {
		adventure.room.history = {
			"Awoke Comet": [],
			"Took sword": []
		};
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*35`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		adventure.room.addResource("Sword of the Sun", "Gear", "always", 1);
		return [];
	},
	function (roomEmbed, adventure) {
		if (adventure.room.history["Awoke Comet"].length > 0) {
			return generateCombatRoomBuilder([])(roomEmbed, adventure)
		}
		else {
			return {
				embeds: [roomEmbed.addFields(pathVoteField)],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("takeswordfromcomet")
							.setStyle(ButtonStyle.Success)
							.setLabel("Take sword")
							.setDisabled(adventure.room.history["Took sword"].length > 0)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
).setEnemies(enemies);
