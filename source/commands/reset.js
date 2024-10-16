const { PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { getCompany } = require('../orcustrators/companyOrcustrator');
const { resetScores } = require('../orcustrators/playerOrcustrator');

const mainId = "reset";
module.exports = new CommandWrapper(mainId, "Reset player scores for this server", PermissionFlagsBits.ManageRoles, false, [InteractionContextType.Guild], 3000,
	(interaction) => {
		const company = getCompany(interaction.guildId);
		resetScores(company.userIds, interaction.guildId);
		interaction.reply("The score wipe has begun.");
	}
);
