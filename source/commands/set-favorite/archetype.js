const { CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { Player } = require("../../classes");
const { getPlayer, setPlayer } = require("../../orcustrators/playerOrcustrator");
const { SKIP_INTERACTION_HANDLING } = require("../../constants");

/**
 * @param {CommandInteraction} interaction
 * @param {[Player]} args
 */
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
		ephemeral: true,
		fetchReply: true
	}).then(reply => {
		const collector = reply.createMessageComponentCollector({ max: 1 });
		collector.on("collect", collectedInteraction => {
			const recentPlayer = getPlayer(interaction.user.id, reply.guildId);
			const selectedArchetype = collectedInteraction.values[0];
			recentPlayer.favoriteArchetype = selectedArchetype;
			collectedInteraction.reply({ content: `Your favorite archetype has been set to ${selectedArchetype}.`, ephemeral: true });
			setPlayer(recentPlayer);
		})

		collector.on("end", () => {
			interaction.deleteReply();
		})
	});
};

module.exports = {
	data: {
		name: "archetype",
		description: "Start new adventures as the selected archetype"
	},
	executeSubcommand
};
