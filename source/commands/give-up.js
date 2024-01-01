const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper, Adventure } = require('../classes');
const { getAdventure, completeAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "give-up";
module.exports = new CommandWrapper(mainId, "Ends the adventure", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000,
	/** Give up on the current adventure */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure || Adventure.endStates.includes(adventure.state)) {
			interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
			return;
		}

		interaction.reply(completeAdventure(adventure, interaction.channel, "giveup"));
	}
);
