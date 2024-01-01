const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');

const mainId = "invite";
module.exports = new CommandWrapper(mainId, "Invite a friend to an adventure", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000,
	/** Invite a friend to an adventure */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "Please send invites from adventure threads.", ephemeral: true });
			return;
		}

		if (adventure.state !== "config") {
			interaction.reply({ content: "Invites cannot be sent after an adventure has started.", ephemeral: true });
			return;
		}

		const invitee = interaction.options.getUser("invitee");
		invitee.send({
			content: `${interaction.member} has invited you to join *${adventure.name}* in ${interaction.guild}!`,
			components: [new ActionRowBuilder().addComponents(
				new ButtonBuilder().setCustomId(`join${SAFE_DELIMITER}${interaction.guildId}${SAFE_DELIMITER}${interaction.channelId}${SAFE_DELIMITER}invite`)
					.setLabel("Join")
					.setStyle(ButtonStyle.Success)
			)]
		});
		interaction.reply({ content: "Invite sent!", ephemeral: true });
	}
).setOptions(
	{ type: "User", name: "invitee", description: "The user's mention", required: true }
);
