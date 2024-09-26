const { InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../classes');

const mainId = "commands";
module.exports = new CommandWrapper(mainId, "Get a link to a list of the Prophets of the Labyrinth commands", null, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	/** Link the user to the repo Commands wiki page (automatically updated) */
	(interaction) => {
		interaction.reply({ content: "Here's a link to the Prophets of the Labyrinth commands page (automatically updated): https://github.com/Imaginary-Horizons-Productions/Prophets-of-the-Labyrinth/wiki/Commands", ephemeral: true });
	}
);
