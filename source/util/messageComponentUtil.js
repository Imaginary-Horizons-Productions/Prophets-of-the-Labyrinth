const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");

const { Adventure } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { getArtifact } = require("../artifacts/_artifactDictionary");
const { buildGearDescription } = require("../gear/_gearDictionary");

const { ordinalSuffixEN, trimForSelectOptionDescription, listifyEN } = require("./textUtil");
const { levelUp } = require("./delverUtil");

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

			const baseLevelsGained = adventure.room.resources.levelsGained?.count ?? 0;
			adventure.room.resources.levelsGained.count = 0;
			if (baseLevelsGained > 0) {
				const fieldPayload = { name: "Level-Up!" };
				/** @type {Record<number, string[]>} */
				const levelMap = {};
				for (const delver of adventure.delvers) {
					const manualManuallevels = adventure.getArtifactCount("Manual Manual");
					if (manualManuallevels > 0) {
						adventure.updateArtifactStat("Manual Manual", "Bonus Levels", manualManuallevels);
					}
					const gearLevelBonus = delver.gear.reduce((bonusLevels, currentGear) => {
						if (currentGear.name.startsWith("Wise")) {
							return bonusLevels + 1;
						} else {
							return bonusLevels;
						}
					}, 0);
					const levelsGained = baseLevelsGained + manualManuallevels + gearLevelBonus;
					if (levelsGained in levelMap) {
						levelMap[levelsGained].push(delver.getName());
					} else {
						levelMap[levelsGained] = [delver.getName()];
					}
					levelUp(delver, levelsGained, adventure);
				}
				const levelMapEntries = Object.entries(levelMap);
				if (levelMapEntries.length > 1) {
					fieldPayload.value = Object.entries(levelMap).map(([levelIncrease, delverNames]) => {
						if (levelIncrease !== baseLevelsGained) {
							if (delverNames.length === 1) {
								if (levelIncrease === 1) {
									return `- ${delverNames[0]} gains 1 level.`;
								} else {
									return `- ${delverNames[0]} gains ${levelIncrease} levels.`;
								}
							} else {
								if (levelIncrease === 1) {
									return `- ${listifyEN(delverNames, false)} gain 1 level.`;
								} else {
									return `- ${listifyEN(delverNames, false)} gain ${levelIncrease} levels.`;
								}
							}
						}
					}).join("- \n");
					if (levelMap[levelIncrease].length < adventure.delvers.length) {
						if (levelIncrease === 1) {
							fieldPayload.value = `\n- Everyone else gains 1 level.`;
						} else {
							fieldPayload.value = `\n- Everyone else gains ${levelIncrease} levels.`;
						}
					}
				} else {
					if (levelMapEntries[0][0] === 1) {
						fieldPayload.value = `Everyone gains 1 level.`;
					} else {
						fieldPayload.value = `Everyone gains ${levelMapEntries[0][0]} levels.`;
					}
				}
				roomEmbed.addFields(fieldPayload);
			}
			roomEmbed.addFields({ name: "Decide the next room", value: "Each delver can pick or change their pick for the next room. The party will move on when the decision is unanimous." });
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
			.setLabel(`${adventure.scouting.bosses.length > 0 ? `Final Battle: ${adventure.bosses[adventure.scouting.bossesEncountered]}` : `${bossScoutingCost}g: Scout the Final Battle`}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(adventure.scouting.bosses.length > 0 || adventure.gold < bossScoutingCost),
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
	generateCombatRoomBuilder,
	generateLootRow,
	generateRoutingRow,
	generateMerchantScoutingRow
};
