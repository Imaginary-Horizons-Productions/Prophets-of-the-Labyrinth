const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { SelectWrapper } = require('../classes');
const { ZERO_WIDTH_WHITESPACE } = require('../constants');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { updateRoomHeader } = require('../util/embedUtil');
const { consumeRoomActions } = require('../util/messageComponentUtil');

const mainId = "artifactdupe";
module.exports = new SelectWrapper(mainId, 3000,
	/** Give the party 1 copy of the specified artifact */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure.delvers.some(delver => delver.id == interaction.user.id)) {
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
					.setOptions([{ label: "If the menu is stuck, switch channels and come back.", description: "This usually happens when two players try to duplicate an artifact at the same time.", value: "placeholder" }])
			))
			interaction.update({ embeds, components });
			setAdventure(adventure);
		} else {
			interaction.update({ content: ZERO_WIDTH_WHITESPACE });
		}
	}
);
