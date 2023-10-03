const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { getCompany } = require('../orcustrators/companyOrcustrator');
const { resetScores } = require('../orcustrators/playerOrcustrator');

const mainId = "reset";
const options = [];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Reset player scores for this server", PermissionFlagsBits.ManageRoles, false, false, 3000, options, subcommands,
	(interaction) => {
		const company = getCompany(interaction.guildId);
		resetScores(company.userIds, interaction.guildId);
		interaction.reply("The score wipe has begun.");
	}
);
