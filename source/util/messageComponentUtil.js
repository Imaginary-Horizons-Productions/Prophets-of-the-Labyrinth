const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Adventure } = require("../classes");
const { ordinalSuffixEN } = require("./textUtil");

/** Remove components (buttons and selects) from a given message
 * @param {string} messageId - the id of the message to remove components from
 * @param {MessageManager} messageManager - the MessageManager for the channel the message is in
 */
function clearComponents(messageId, messageManager) {
	if (messageId) {
		messageManager.fetch(messageId).then(message => {
			message.edit({ components: [] });
		})
	}
};

/** @param {Adventure} adventure */
function generateMerchantScoutingRow(adventure) {
	const bossScoutingCost = adventure.calculateScoutingCost("Final Battle");
	const guardScoutingCost = adventure.calculateScoutingCost("Artifact Guardian");
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Final Battle`)
			.setLabel(`${adventure.scouting.finalBoss ? `Final Battle: ${adventure.finalBoss}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(adventure.scouting.finalBoss || adventure.gold < bossScoutingCost),
		new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Artifact Guardian`)
			.setLabel(`${guardScoutingCost}g: Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 1)} Artifact Guardian`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(adventure.gold < guardScoutingCost)
	)
}

module.exports = {
	clearComponents,
	generateMerchantScoutingRow
};
