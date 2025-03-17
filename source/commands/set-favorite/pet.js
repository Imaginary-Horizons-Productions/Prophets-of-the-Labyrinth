const { CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags, DiscordjsErrorCodes, ComponentType } = require("discord.js");
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
		interaction.reply({ content: "You don't have any pets yet.", flags: [MessageFlags.Ephemeral] });
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
		flags: [MessageFlags.Ephemeral],
		withResponse: true
	}).then(response => response.resource.message.awaitMessageComponent({ time: 120000, componentType: ComponentType.StringSelect })).then(collectedInteraction => {
		const recentPlayer = getPlayer(interaction.user.id, interaction.guildId);
		const newBestFriend = collectedInteraction.values[0];
		recentPlayer.favoritePet = newBestFriend;
		setPlayer(recentPlayer);
		return collectedInteraction.reply({ content: `Your favorite pet has been set to ${newBestFriend}.`, flags: [MessageFlags.Ephemeral] });
	}).catch(error => {
		if (error.code !== DiscordjsErrorCodes.InteractionCollectorError) {
			console.error(error);
		}
	}).finally(() => {
		if (interaction.channel) { // prevent crash if channel is deleted before cleanup
			interaction.deleteReply();
		}
	});
};

module.exports = {
	data: {
		name: "pet",
		description: "Bring the selected pet on adventures by default"
	},
	executeSubcommand
};
