const { CommandWrapper } = require('../classes');
const { generateStatsEmbed } = require('../util/embedUtil');
const { InteractionContextType, MessageFlags } = require('discord.js');

const mainId = "player-stats";
module.exports = new CommandWrapper(mainId, "Get the overall PotL stats for a user", null, false, [InteractionContextType.Guild], 3000,
	(interaction) => {
		const user = interaction.options.getUser("user") || interaction.user;
		interaction.reply({
			embeds: [generateStatsEmbed(user, interaction.guildId)],
			flags: [MessageFlags.Ephemeral]
		});
	}
).setOptions(
	{ type: "User", name: "user", description: "The user's mention (default: yourself)", required: false }
);
