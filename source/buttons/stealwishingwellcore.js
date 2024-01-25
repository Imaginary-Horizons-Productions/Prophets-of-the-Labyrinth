const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { EMPTY_SELECT_OPTION_SET } = require('../constants');

const mainId = "stealwishingwellcore";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Disable wishing well, gain 250g */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		const delver = adventure?.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		adventure.gainGold(250);
		setAdventure(adventure);
		updateRoomHeader(adventure, interaction.message).then(message => {
			interaction.update({
				embeds: message.embeds,
				components: [
					new ActionRowBuilder().addComponents(
						new StringSelectMenuBuilder().setCustomId("applepiewishingwell")
							.setPlaceholder("Wishing well core stolen!")
							.setOptions(EMPTY_SELECT_OPTION_SET)
							.setDisabled(true)
					),
					new ActionRowBuilder().addComponents(
						new ButtonBuilder().setCustomId(mainId)
							.setLabel("+250g")
							.setEmoji("✔️")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true)
					),
					message.components[2]
				]
			});
		});
	}
);
