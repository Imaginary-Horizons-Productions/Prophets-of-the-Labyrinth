const { CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { SKIP_INTERACTION_HANDLING } = require("../../constants");
const { setPlayer, getPlayer } = require("../../orcustrators/playerOrcustrator");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...[player]) {
	const petOptions = Object.keys(player.pets).map(petName => ({
		label: petName,
		description: `Level ${player.pets[petName]}`,
		value: petName
	}));

	if (petOptions.length < 1) {
		interaction.reply({ content: "You don't have any pets yet.", ephemeral: true });
		return;
	}

	interaction.reply({
		content: "The pet you select will be brought on adventures by default (you can still select others or deselect during the preparation phase).",
		components: [
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder().setCustomId(SKIP_INTERACTION_HANDLING)
					.setPlaceholder("Select a pet...")
					.addOptions(petOptions)
			)
		],
		ephemeral: true,
		fetchReply: true
	}).then(reply => {
		const collector = reply.createMessageComponentCollector({ max: 1 });
		collector.on("collect", collectedInteraction => {
			const recentPlayer = getPlayer(interaction.user.id, reply.guildId);
			const newBestFriend = collectedInteraction.values[0];
			recentPlayer.favoritePet = newBestFriend;
			collectedInteraction.reply({ content: `Your favorite pet has been set to ${newBestFriend}.`, ephemeral: true });
			setPlayer(recentPlayer);
		})

		collector.on("end", () => {
			interaction.deleteReply();
		})
	});
};

module.exports = {
	data: {
		name: "pet",
		description: "Bring the selected pet on adventures by default"
	},
	executeSubcommand
};
