const { ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, DiscordjsErrorCodes } = require("discord.js");
const { SubcommandWrapper } = require("../../classes");
const { getPlayer, setPlayer } = require("../../orcustrators/playerOrcustrator");
const { SKIP_INTERACTION_HANDLING } = require("../../constants");

module.exports = new SubcommandWrapper("archetype", "Start new adventures as the selected archetype",
	async function executeSubcommand(interaction, ...[player]) {
		const archetypeOptions = Object.keys(player.archetypes).map(archetype => ({
			label: archetype,
			value: archetype
		}));

		interaction.reply({
			content: "You'll start as the selected archetype on new adventures by default (you can still select others during the preparation phase).",
			components: [
				new ActionRowBuilder().addComponents(
					new StringSelectMenuBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
						.setPlaceholder("Select a archetype...")
						.addOptions(archetypeOptions)
				)
			],
			flags: [MessageFlags.Ephemeral],
			withResponse: true
		}).then(response => response.resource.message.awaitMessageComponent({ time: 120000 })).then(collectedInteraction => {
			const recentPlayer = getPlayer(interaction.user.id, interaction.guildId);
			const selectedArchetype = collectedInteraction.values[0];
			recentPlayer.favoriteArchetype = selectedArchetype;
			setPlayer(recentPlayer);
			return collectedInteraction.reply({ content: `Your favorite archetype has been set to ${selectedArchetype}.`, flags: [MessageFlags.Ephemeral] });
		}).catch(error => {
			if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
				console.error(error);
			}
		}).finally(() => {
			if (interaction.channel) { // prevent crash if channel is deleted before cleanup
				interaction.deleteReply();
			}
		});
	}
);
