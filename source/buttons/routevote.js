const { ActionRowBuilder, ButtonBuilder, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { SAFE_DELIMITER, ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, endRoom } = require('../orcustrators/adventureOrcustrator');

const mainId = "routevote";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Tally votes for next room */
	(interaction, [candidate, depth]) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const candidateTag = `${candidate}${SAFE_DELIMITER}${depth}`;
		if (!(candidateTag in adventure.roomCandidates)) {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
			return;
		}

		let changeVote = false;
		for (const candidate in adventure.roomCandidates) {
			if (adventure.roomCandidates[candidate].voterIds.includes(interaction.user.id)) {
				changeVote = true;
				adventure.roomCandidates[candidate].voterIds = adventure.roomCandidates[candidate].voterIds.filter(id => id !== interaction.user.id);
			}
		}
		adventure.roomCandidates[candidateTag].voterIds.push(interaction.user.id);

		interaction.reply(`**${interaction.member.displayName}** ${changeVote ? "changed their vote to" : "voted for"} ${adventure.roomCandidates[candidateTag].isHidden ? "???" : candidate}.`).then(_message => {
			// Decide by unanimous vote
			if (candidateTag in adventure.roomCandidates && adventure.roomCandidates[candidateTag].voterIds?.length === adventure.delvers.length) {
				const uiRows = [...interaction.message.components.map(row => {
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
	}
);
