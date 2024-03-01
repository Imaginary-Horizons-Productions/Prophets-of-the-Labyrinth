const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { ButtonWrapper } = require('../classes');
const { getPlayer, setPlayer } = require('../orcustrators/playerOrcustrator');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { getArtifact } = require('../artifacts/_artifactDictionary');
const { EMPTY_SELECT_OPTION_SET, SKIP_INTERACTION_HANDLING } = require('../constants');
const { trimForSelectOptionDescription } = require('../util/textUtil');

const mainId = "collectartifact";
module.exports = new ButtonWrapper(mainId, 3000,
	/** Send the player a message with a select an artifact to collect */
	(interaction, args) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure?.delvers.some(delver => delver.id === interaction.user.id)) {
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
				options.push({
					label: artifactName,
					description: trimForSelectOptionDescription(getArtifact(artifactName).dynamicDescription(1)),
					value: artifactName
				})
			}
		}
		interaction.reply({
			content: options.length > 0 ? "Select an artifact to keep from this adventure." : "You have already collected all of the artifacts the party obtained in this adventure.",
			components: [new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId(`${SKIP_INTERACTION_HANDLING}${interaction.id}`)
					.setPlaceholder("Select an artifact...")
					.addOptions(options.length > 0 ? options : EMPTY_SELECT_OPTION_SET)
					.setDisabled(options.length < 1)
			)],
			ephemeral: true,
			fetchReply: true
		}).then(reply => {
			if (reply) {
				const collector = reply.createMessageComponentCollector({ max: 1 });
				collector.on("collect", collectedInteraction => {
					const [artifactName] = collectedInteraction.values;
					const player = getPlayer(collectedInteraction.user.id, collectedInteraction.guildId);
					player.artifacts[collectedInteraction.channelId] = artifactName;
					setPlayer(player);
					collectedInteraction.channel.send({ content: `${collectedInteraction.user.displayName} decides to hold onto a **${artifactName}**. They'll be able to bring it on future adventures.`, ephemeral: true });
				})

				collector.on("end", () => {
					interaction.deleteReply();
				})
			}
		})
	}
);
