const { ActionRowBuilder, ButtonBuilder, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, endRoom } = require('../orcustrators/adventureOrcustrator');
const { clearComponents } = require('../util/messageComponentUtil');

const mainId = "routevote";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Tally votes for next room */
	(interaction, [candidate, depth]) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const candidateTag = `${candidate}${SAFE_DELIMITER}${depth}`;
		if (adventure.roomCandidates[candidateTag]) {
			let changeVote = false;
			for (const candidate in adventure.roomCandidates) {
				if (adventure.roomCandidates[candidate].includes(interaction.user.id)) {
					changeVote = true;
					adventure.roomCandidates[candidate] = adventure.roomCandidates[candidate].filter(id => id !== interaction.user.id);
				}
			}
			adventure.roomCandidates[candidateTag].push(interaction.user.id);

			interaction.reply(`${interaction.user} ${changeVote ? "changed their vote to" : "voted for"} ${candidate}.`).then(_message => {
				// Decide by unanimous vote
				if (adventure.roomCandidates[candidateTag]?.length === adventure.delvers.length) {
					clearComponents(adventure.messageIds.battleRound, interaction.channel.messages);
					let uiRows = [...interaction.message.components.map(row => {
						return new ActionRowBuilder().addComponents(row.components.map(({ data: component }) => {
							switch (component.type) {
								case ComponentType.Button:
									const updatedButton = new ButtonBuilder(component).setDisabled(true);
									if (component.custom_id === interaction.customId) {
										updatedButton.setEmoji("✔️");
									} else if (!component.emoji) {
										updatedButton.setEmoji("✖️");
									}

									return updatedButton;
								case ComponentType.StringSelect:
									return new StringSelectMenuBuilder(component).setDisabled(true);
								default:
									throw new Error(`Disabling unregistered component from routevote button: ${component.type}`);
							}
						}))
					})];
					interaction.message.edit({ components: uiRows });
					endRoom(candidate, interaction.channel);
				}
			});
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
