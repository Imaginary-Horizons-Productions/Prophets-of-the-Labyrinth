const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");

const { Adventure } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { getArtifact } = require("../artifacts/_artifactDictionary");
const { buildGearDescription } = require("../gear/_gearDictionary");

const { ordinalSuffixEN, trimForSelectOptionDescription, listifyEN } = require("./textUtil");

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

const extraCombatButtonsMap = {
	"appease": (adventure) => new ButtonBuilder().setCustomId(`appease${SAFE_DELIMITER}${adventure.room.round}`)
		.setEmoji("🙇")
		.setLabel("Appease the Starry Knight")
		.setStyle(ButtonStyle.Secondary),
	"greed": (adventure) => new ButtonBuilder().setCustomId(`greed${SAFE_DELIMITER}${adventure.room.round}`)
		.setEmoji("💰")
		.setLabel("Greed")
		.setStyle(ButtonStyle.Secondary)
};

/** Creates the room builder function for combat rooms
 * @param {string[]} extraButtons
 * @returns {(roomEmbed: EmbedBuilder, adventure: Adventure) => {embeds: EmbedBuilder[], components: ActionRowBuilder[]}}
 */
function generateCombatRoomBuilder(extraButtons) {
	return (roomEmbed, adventure) => {
		roomEmbed.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
		const isCombatVictory = adventure.room.enemies?.every(enemy => enemy.hp === 0);
		if (!isCombatVictory) {
			const buttons = [
				new ButtonBuilder().setCustomId("inspectself")
					.setEmoji("🔎")
					.setLabel("Inspect Self")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("predict")
					.setEmoji("🔮")
					.setLabel("Predict")
					.setStyle(ButtonStyle.Secondary),
				new ButtonBuilder().setCustomId("readymove")
					.setEmoji("⚔")
					.setLabel("Ready a Move")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder().setCustomId("readyitem")
					.setEmoji("🧪")
					.setLabel("Ready an Item")
					.setStyle(ButtonStyle.Primary)
					.setDisabled(!Object.values(adventure.items).some(quantity => quantity > 0))
			];
			for (const buttonType of extraButtons) {
				buttons.push(extraCombatButtonsMap[buttonType](adventure));
			}
			return {
				embeds: [roomEmbed],
				components: [new ActionRowBuilder().addComponents(buttons)]
			}
		} else {
			roomEmbed.setTitle(`${adventure.room.title} - Victory!`);

			roomEmbed.addFields({ name: "Level-Up!", value: `Everyone gains ${adventure.room.resources.levelsGained.count ?? 0} levels.` }, { name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." });
			return {
				embeds: [roomEmbed],
				components: [generateLootRow(adventure), generateRoutingRow(adventure)]
			}
		}
	}
}

/** @param {Adventure} adventure */
function generateLootRow(adventure) {
	let options = [];
	for (const { name, type, count, visibility } of Object.values(adventure.room.resources)) {
		if (visibility === "loot") {
			if (count > 0) {
				let option = { value: `${name}${SAFE_DELIMITER}${options.length}` };

				if (name === "gold") {
					option.label = `${count} Gold`;
				} else {
					option.label = `${name} x ${count}`;
				}

				if (type === "gear") {
					option.description = trimForSelectOptionDescription(buildGearDescription(name, false));
				} else if (type === "artifact") {
					option.description = trimForSelectOptionDescription(getArtifact(name).dynamicDescription(count));
				}
				options.push(option)
			}
		}
	}
	if (options.length > 0) {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}loot`)
				.setPlaceholder("Take some of the spoils of combat...")
				.setOptions(options))
	} else {
		return new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder().setCustomId(`treasure${SAFE_DELIMITER}loot`)
				.setPlaceholder("No loot")
				.setOptions(EMPTY_SELECT_OPTION_SET)
				.setDisabled(true)
		)
	}
}

/** @param {Adventure} adventure */
function generateRoutingRow(adventure) {
	return new ActionRowBuilder().addComponents(
		...Object.keys(adventure.roomCandidates).map((candidateTag, index) => {
			const [roomType, depth] = candidateTag.split(SAFE_DELIMITER);
			return new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}${candidateTag}`)
				.setLabel(`Next room: ${adventure.roomCandidates[candidateTag].isHidden ? `Unknown ${index + 1}` : roomType}`)
				.setStyle(ButtonStyle.Secondary)
		}));
}

/** @param {Adventure} adventure */
function generateMerchantScoutingRow(adventure) {
	const bossScoutingCost = adventure.calculateScoutingCost("Final Battle");
	const guardScoutingCost = adventure.calculateScoutingCost("Artifact Guardian");
	return new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Final Battle`)
			.setLabel(`${adventure.scouting.bosses > 0 ? `Final Battle: ${adventure.bosses[adventure.scouting.bossesEncountered]}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(adventure.scouting.bosses > 0 || adventure.gold < bossScoutingCost),
		new ButtonBuilder().setCustomId(`buyscouting${SAFE_DELIMITER}Artifact Guardian`)
			.setLabel(`${guardScoutingCost}g: Scout the ${ordinalSuffixEN(adventure.scouting.artifactGuardiansEncountered + adventure.scouting.artifactGuardians + 1)} Artifact Guardian`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(adventure.gold < guardScoutingCost)
	)
}

module.exports = {
	clearComponents,
	generateCombatRoomBuilder,
	generateLootRow,
	generateRoutingRow,
	generateMerchantScoutingRow
};
