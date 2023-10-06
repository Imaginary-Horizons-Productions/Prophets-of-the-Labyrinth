const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");

const { Adventure } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { getArtifact } = require("../artifacts/_artifactDictionary");
const { buildGearDescription } = require("../gear/_gearDictionary");

const { ordinalSuffixEN } = require("./textUtil");

/** Modify the buttons whose `customId`s are keys in `edits` from among `components` based on `preventUse`, `label`, and `emoji` then return all components
 * @param {MessageActionRow[]} components
 * @param {{[customId: string]: {preventUse: boolean; label: string; emoji?: string}}} edits
 * @returns {MessageActionRow[]} the components of the message with the button edited
 */
function editButtons(components, edits) {
	return components.map(row => {
		return new ActionRowBuilder().addComponents(row.components.map(({ data: component }) => {
			const customId = component.custom_id;
			switch (component.type) {
				case ComponentType.Button:
					const editedButton = new ButtonBuilder(component);
					if (customId in edits) {
						const { preventUse, label, emoji } = edits[customId];
						editedButton.setDisabled(preventUse)
							.setLabel(label);
						if (emoji) {
							editedButton.setEmoji(emoji);
						}
					};
					return editedButton;
				case ComponentType.StringSelect:
					return new StringSelectMenuBuilder(component);
				default:
					throw new Error(`Disabling unregistered component from editButtons: ${component.type}`);
			}
		}));
	})
}

/** Update the room action resource's count and edit the room embeds to show remaining room action
 * @param {Adventure} adventure
 * @param {MessageEmbed[]} embeds
 * @param {number} actionsConsumed
 * @returns {{embeds: MessageEmbed[], remainingActions: number}}
 */
function consumeRoomActions(adventure, embeds, actionsConsumed) {
	adventure.room.resources.roomAction.count -= actionsConsumed;
	const remainingActions = adventure.room.resources.roomAction.count;
	return {
		embeds: embeds.map(({ data: embed }) => {
			const updatedEmbed = new EmbedBuilder(embed);
			const roomActionsFieldIndex = embed.fields.findIndex(field => field.name === "Room Actions");
			if (roomActionsFieldIndex !== -1) {
				return updatedEmbed.spliceFields(roomActionsFieldIndex, 1, { name: "Room Actions", value: remainingActions.toString() });
			} else {
				return updatedEmbed;
			}
		}),
		remainingActions
	}
}

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
function generateLootRow(adventure) {
	let options = [];
	for (const { name, resourceType: type, count, visibility } of Object.values(adventure.room.resources)) {
		if (visibility === "loot") {
			if (count > 0) {
				let option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

				if (name == "gold") {
					option.label = `${count} Gold`;
				} else {
					option.label = `${name} x ${count}`;
				}

				if (type === "gear") {
					option.description = buildGearDescription(name, false);
				} else if (type === "artifact") {
					option.description = getArtifact(name).dynamicDescription(count);
				}
				options.push(option)
			}
		}
	}
	if (options.length > 0) {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId("loot")
				.setPlaceholder("Take some of the spoils of combat...")
				.setOptions(options))
	} else {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId("loot")
				.setPlaceholder("No loot")
				.setOptions(EMPTY_SELECT_OPTION_SET)
				.setDisabled(true)
		)
	}
}

/** @param {Adventure} adventure */
function generateRoutingRow(adventure) {
	const candidateKeys = Object.keys(adventure.roomCandidates);
	const max = 144;
	const rushingChance = adventure.getChallengeIntensity("Rushing") / 100;
	return new ActionRowBuilder().addComponents(
		...candidateKeys.map(candidateTag => {
			const [roomType, depth] = candidateTag.split(SAFE_DELIMITER);
			return new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}${candidateTag}`)
				.setLabel(`Next room: ${adventure.generateRandomNumber(max, "general") < max * rushingChance ? "???" : roomType}`)
				.setStyle(ButtonStyle.Secondary)
		}));
}

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
	editButtons,
	consumeRoomActions,
	clearComponents,
	generateLootRow,
	generateRoutingRow,
	generateMerchantScoutingRow
};
