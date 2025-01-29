const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");

const { Adventure } = require("../classes");
const { SAFE_DELIMITER, EMPTY_SELECT_OPTION_SET } = require("../constants");

const { listifyEN } = require("./textUtil");

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
		.setStyle(ButtonStyle.Success),
	"greed": (adventure) => new ButtonBuilder().setCustomId(`greed${SAFE_DELIMITER}${adventure.room.round}`)
		.setEmoji("💰")
		.setLabel("Greed")
		.setStyle(ButtonStyle.Success)
};

/** Creates the room builder function for combat rooms
 * @param {string[]} extraButtons
 * @returns {(roomEmbed: EmbedBuilder, adventure: Adventure) => {embeds: EmbedBuilder[], components: ActionRowBuilder[]}}
 */
function generateCombatRoomBuilder(extraButtons) {
	return (roomEmbed, adventure) => {
		roomEmbed.setFooter({ text: `Room #${adventure.depth} - Round ${adventure.room.round}` });
		if (adventure.getCombatState() === "continue") {
			const buttons = [
				module.exports.partyStatsButton,
				module.exports.inspectSelfButton,
				new ButtonBuilder().setCustomId(`readymove${SAFE_DELIMITER}${adventure.room.round}`)
					.setEmoji("⚔")
					.setLabel("Ready a Move")
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder().setCustomId("readyitem")
					.setEmoji("🧪")
					.setLabel("Ready an Item")
					.setStyle(ButtonStyle.Success)
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
			const fields = [];
			const livingCowards = [];
			adventure.room.enemies.forEach(enemy => {
				if (enemy.hp > 0 && "Cowardice" in enemy.modifiers) {
					livingCowards.push(enemy.name);
				}
			})
			if (livingCowards.length > 0) {
				fields.push({ name: "Fleeing Cowards", value: listifyEN(livingCowards) });
			}

			const levelTexts = [];
			for (const resourceName in adventure.room.resources) {
				const resource = adventure.room.resources[resourceName];
				if (resource.type === "levelsGained") {
					const [_, index] = resourceName.split(SAFE_DELIMITER);
					if (!index) {
						levelTexts.push(`Everyone gains ${resource.count} levels.`);
					} else {
						levelTexts.push(`${adventure.delvers[index].name} gains ${resource.count} levels.`);
					}
				}
			}
			if (levelTexts.length > 0) {
				fields.push({ name: "Level-Up!", value: levelTexts.join("\n") });
			}
			roomEmbed.addFields(fields.concat(module.exports.pathVoteField));
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
				const option = { description: type, value: `${name}${SAFE_DELIMITER}${options.length}` };
				switch (type) {
					case "Gear":
						option.label = `💬 ${name} x ${count}`;
						break;
					case "Artifact":
						option.label = `${name} x ${count}`;
						break;
					case "Currency":
						option.label = `${count} ${name}`;
						break;
					case "Item":
						option.label = `${name} x ${count}`;
						break;
				}
				options.push(option);
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
	return new ActionRowBuilder().addComponents(
		...Object.keys(adventure.roomCandidates).map((candidateTag, index) => {
			const [roomType, depth] = candidateTag.split(SAFE_DELIMITER);
			return new ButtonBuilder().setCustomId(`routevote${SAFE_DELIMITER}${candidateTag}`)
				.setLabel(`Path Vote: ${adventure.roomCandidates[candidateTag].isHidden ? `Unknown ${index + 1}` : roomType}`)
				.setStyle(ButtonStyle.Primary)
		}));
}

module.exports = {
	clearComponents,
	partyStatsButton: new ButtonBuilder().setCustomId("partystats")
		.setEmoji("📚")
		.setLabel("Party Stats")
		.setStyle(ButtonStyle.Secondary),
	inspectSelfButton: new ButtonBuilder().setCustomId("inspectself")
		.setEmoji("🔎")
		.setLabel("Inspect Self")
		.setStyle(ButtonStyle.Secondary),
	generateCombatRoomBuilder,
	generateLootRow,
	pathVoteField: { name: "Path Vote", value: "Each delver must vote for the next room (changes allowed). The party will move on when the decision is unanimous." },
	generateRoutingRow
};
