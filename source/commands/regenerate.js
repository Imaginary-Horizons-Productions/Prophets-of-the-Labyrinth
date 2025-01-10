const { PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper, Adventure } = require('../classes');
const { getAdventure, setAdventure } = require('../orcustrators/adventureOrcustrator');
const { renderRoom } = require('../util/embedUtil');
const { clearComponents } = require('../util/messageComponentUtil');

const mainId = "regenerate";
module.exports = new CommandWrapper(mainId, "Regenerate the current room message for an adventure", PermissionFlagsBits.SendMessagesInThreads, false, [InteractionContextType.Guild], 30000,
	/** Call renderRoom to regenerate room embed and components */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure || Adventure.endStates.includes(adventure.state)) {
			interaction.reply({ content: "This channel doesn't appear to be an active adventure's thread.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		[adventure.messageIds.room, adventure.messageIds.battleRound].forEach(messageId => {
			clearComponents(messageId, interaction.channel.messages);
		})

		interaction.reply({ ...renderRoom(adventure, interaction.channel), withResponse: true }).then(({ resource: { message } }) => {
			if (adventure.room.enemies) {
				adventure.messageIds.battleRound = message.id;
			} else {
				adventure.messageIds.room = message.id;
			}
			setAdventure(adventure);
		});
	}
);
