const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { SAFE_DELIMITER } = require('../constants');
const { getAdventure } = require('../orcustrators/adventureOrcustrator');
const { isCantDirectMessageThisUserError } = require('../util/dAPIREsponses');

const mainId = "invite";
module.exports = new CommandWrapper(mainId, "Invite a friend to an adventure", PermissionFlagsBits.SendMessagesInThreads, false, [InteractionContextType.Guild], 3000,
	/** Invite a friend to an adventure */
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "Please send invites from adventure threads.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		if (adventure.state !== "config") {
			interaction.reply({ content: "Invites cannot be sent after an adventure has started.", flags: [MessageFlags.Ephemeral] });
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
		}).then(() => {
			interaction.reply({ content: "Invite sent!", flags: [MessageFlags.Ephemeral] });
		}).catch(error => {
			if (isCantDirectMessageThisUserError(error)) {
				interaction.reply({ content: "Could not direct message your selected server member. Do they have PotL blocked?", flags: [MessageFlags.Ephemeral] });
			} else {
				interaction.reply({ content: "Could not send your invite due to an uncommon error.", flags: [MessageFlags.Ephemeral] });
				console.error(error);
			}
		});
	}
).setOptions(
	{ type: "User", name: "invitee", description: "The user's mention", required: true }
);
