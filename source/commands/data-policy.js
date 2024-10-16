const { InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../classes');

const mainId = "data-policy";
module.exports = new CommandWrapper(mainId, "Get a link to the Prophets of the Labyrinth Data Policy page", null, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	/** Send the user a link to the Data Policy wiki page */
	(interaction) => {
		interaction.reply({ content: "Here's a link to the Prophets of the Labyrinth Data Policy page (automatically updated): https://github.com/Imaginary-Horizons-Productions/Prophets-of-the-Labyrinth/wiki/Data-Policy", ephemeral: true });
	}
);
