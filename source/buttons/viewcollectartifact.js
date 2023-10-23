const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact } = require('../artifacts/_artifactDictionary');
const { EMPTY_SELECT_OPTION_SET } = require('../constants');

const mainId = "viewcollectartifact";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select an artifact to collect */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channel.id);
		if (!adventure?.delvers.some(delver => delver.id == interaction.user.id)) {
			interaction.reply({ content: "This adventure isn't active or you aren't participating in it.", ephemeral: true });
			return;
		}

		const playerProfile = getPlayer(interaction.user.id, interaction.guild.id);
		if (interaction.channelId in playerProfile.artifacts) {
			interaction.reply({ content: "You've already collected an artifact from this adventure.", ephemeral: true });
			return;
		}

		const options = [];
		for (const artifactName in adventure.artifacts) {
			if (!Object.values(playerProfile.artifacts).includes(artifactName)) {
				const description = getArtifact(artifactName).dynamicDescription(1);
				options.push({
					label: artifactName,
					description,
					value: artifactName
				})
			}
		}
		if (options.length) {
			interaction.reply({
				content: "Select an artifact to keep from this adventure.",
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("collectartifact")
						.setPlaceholder("Select an artifact...")
						.addOptions(options)
						.setDisabled(options.length < 1)
				)],
				ephemeral: true
			});
		} else {
			interaction.reply({
				content: "You have already collected all of the artifacts the party obtained in this adventure.",
				components: [new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder()
						.setCustomId("collectartifact")
						.setPlaceholder("Select an artifact...")
						.addOptions(EMPTY_SELECT_OPTION_SET)
						.setDisabled(true)
				)],
				ephemeral: true
			});
		}
	}
);
