const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE, EMPTY_SELECT_OPTION_SET } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "artifactdupe";
module.exports = new SelectWrapper(mainId, 3000,
	/** Give the party 1 copy of the specified artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure.delvers.some(delver => delver.id === interaction.user.id)) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		if (adventure.room.resources.roomAction.count > 0) {
			const artifactName = interaction.values[0];
			adventure.gainArtifact(artifactName, 1);
			updateRoomHeader(adventure, interaction.message);
			const { embeds } = consumeRoomActions(adventure, interaction.message.embeds, 1);
			const components = interaction.message.components;
			components.splice(0, 1, new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId("artifactdupe")
					.setPlaceholder(`✔️ Duplicated ${artifactName}`)
					.setDisabled(true)
					.setOptions(EMPTY_SELECT_OPTION_SET)
			))
			interaction.update({ embeds, components });
			setAdventure(adventure);
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
