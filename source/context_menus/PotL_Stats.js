const { InteractionContextType } = require('discord.js');
const { UserContextMenuWrapper } = require('../classes');
const { generateStatsEmbed } = require('../util/embedUtil');

const mainId = "PotL Stats";
module.exports = new UserContextMenuWrapper(mainId, null, false, [InteractionContextType.Guild], 3000,
	(interaction) => {
		interaction.reply({
			embeds: [generateStatsEmbed(interaction.targetUser, interaction.guildId)],
			ephemeral: true
		});
	}
);
