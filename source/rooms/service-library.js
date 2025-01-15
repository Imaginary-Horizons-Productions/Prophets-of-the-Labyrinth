const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { RoomTemplate } = require("../classes");
const { SAFE_DELIMITER } = require("../constants");
const { generateRoutingRow, pathVoteField } = require("../util/messageComponentUtil");
const { ordinalSuffixEN } = require("../util/textUtil");

module.exports = new RoomTemplate("A Serene Library",
	"@{adventure}",
	"A quick stop at the library gives the party the chance to recharge Spells and research foes in the area.",
	function (adventure) {
		adventure.room.history = {
			Rechargers: []
		};
		return [];
	},
	function (roomEmbed, adventure) {
		const rechargeCost = 50;
		const bossScoutingCost = adventure.calculateScoutingCost("Final Battle");
		const guardScoutingCost = adventure.calculateScoutingCost("Artifact Guardian");
		return {
			embeds: [roomEmbed.addFields(pathVoteField)],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder().setCustomId(`recharge${SAFE_DELIMITER}${rechargeCost}`)
						.setEmoji("🔋")
						.setLabel(`Recharge a Spell [${rechargeCost}g]`)
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(adventure.gold < rechargeCost),
					new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Final Battle${SAFE_DELIMITER}${adventure.scouting.bosses}`)
						.setEmoji("🔭")
						.setLabel(`${adventure.scouting.bosses > 0 ? `Final Battle: ${adventure.bosses[adventure.scouting.bossesEncountered]}` : `Scout the Final Battle [${bossScoutingCost}g]`}`)
						.setStyle(ButtonStyle.Success)
						.setDisabled(adventure.scouting.bosses > 0 || adventure.gold < bossScoutingCost),
					new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Artifact Guardian${SAFE_DELIMITER}${adventure.scouting.artifactGuardians}`)
						.setEmoji("🔭")
						.setLabel(`Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 1)} Artifact Guardian [${guardScoutingCost}g]`)
						.setStyle(ButtonStyle.Success)
						.setDisabled(adventure.gold < guardScoutingCost)
				),
				generateRoutingRow(adventure)
			]
		};
	}
);
