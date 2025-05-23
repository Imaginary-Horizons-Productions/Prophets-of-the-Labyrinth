const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { generateCombatRoomBuilder } = require("../util/messageComponentUtil");
const { parseExpression } = require("../util/mathUtil");
const { SAFE_DELIMITER } = require("../constants");

const enemies = [["Comet the Sun Dog", "1"], ["Gust Wolf", "1*n"], ["Unkind Corvus", "1"]];

// Note: USUALLY we don't have route-vote options available, which may intermittently disappear
// This may allow for a race condition where the delvers start moving on before they lose access to the route-vote buttons
// In this case, delvers might be able to leave just before anything happens in combat
// This bug will be tolerated as a feature (because it requires coordinated skedaddling with the loot)
module.exports = new RoomTemplate("Let Sleeping Dogs Lie",
	"Water",
	"In a snow-covered courtyard, you encounter a napping Frosty Siberian Husky; \"Comet\" is inscribed on its collar. Its fangs clench around a Sword of the Sun. Do you try to pry the sword from its jaws? Or do you indulge your urge to floof its fur?",
	function (adventure) {
		adventure.room.history = {
			"Awoke Comet": [],
			"Took sword": [],
			"Floofed fur": []
		};
		adventure.room.addResource("levelsGained", "levelsGained", "internal", 1);
		const goldCount = Math.ceil(parseExpression(`${enemies[0][1]}*35`, adventure.delvers.length) * (90 + adventure.generateRandomNumber(21, "general")) / 100);
		adventure.room.addResource("Gold", "Currency", "loot", goldCount);
		adventure.room.addResource("Sword of the Sun", "Gear", "loot", 1);
		return [];
	},
	function (roomEmbed, adventure) {
		if (adventure.room.history["Awoke Comet"].length > 0) {
			return generateCombatRoomBuilder([])(roomEmbed, adventure)
		}
		else {
			const floofFailChance = 40;
			return {
				embeds: [roomEmbed.addFields(pathVoteField)],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId("takeswordfromcomet")
							.setStyle(ButtonStyle.Danger)
							.setLabel("Take sword [wake 100%]")
							.setDisabled(adventure.room.history["Took sword"].length > 0),
						// Does not take sword if fight starts, but sword should be available as loot
						new ButtonBuilder().setCustomId(`floofcometfur${SAFE_DELIMITER}${floofFailChance}`)
							.setStyle(ButtonStyle.Danger)
							.setLabel(`Floof fur [wake ${floofFailChance}%]`)
					),
					generateRoutingRow(adventure)
				]
			};
		}
	}
).setEnemies(enemies);
