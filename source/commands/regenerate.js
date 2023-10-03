const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper, Adventure } = require('../classes');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');
const { clearComponents } = require('../util/messageComponentUtil');

const mainId = "regenerate";
const options = [];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "Regenerate the current room message for an adventure", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000, options, subcommands,
	/** Call renderRoom to regenerate room embed and components */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure || Adventure.endStates.includes(adventure.state)) {
			interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", ephemeral: true });
			return;
		}

		[adventure.messageIds.room, adventure.messageIds.battleRound].forEach(messageId => {
			clearComponents(messageId, interaction.channel.messages);
		})

		interaction.reply(renderRoom(adventure, interaction.channel));
	}
);
