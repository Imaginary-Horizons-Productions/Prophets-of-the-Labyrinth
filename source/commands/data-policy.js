const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');

const customId = "data-policy";
const options = [];
const subcommands = [];
module.exports = new CommandWrapper(customId, "Get a link to this bot's Data Policy page", PermissionFlagsBits.ViewChannel, false, true, 3000, options, subcommands,
	/** Send the user a link to the Data Policy wiki page */
	(interaction) => {
		interaction.reply({ content: "Here's a link to the ${bot} Data Policy page (automatically updated): https://github.com/Imaginary-Horizons-Productions/${bot}/wiki/Data-Policy", ephemeral: true });
	}
);
