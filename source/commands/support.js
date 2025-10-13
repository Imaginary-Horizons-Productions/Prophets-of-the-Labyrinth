const fs = require("fs");
const { InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { embedTemplate } = require('../util/embedUtil');

const mainId = "support";
module.exports = new CommandWrapper(mainId, "List ways to support PotL", null, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	(interaction) => {
		fs.promises.stat(__filename).then(stats => {
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Supporting *Prophets of the Labyrinth*")
						.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
						.setDescription("Thanks for playing! Here are a few ways to support development:")
						.addFields(
							{ name: "Tell a Friend", value: "Use or send [this link](https://discord.com/oauth2/authorize?client_id=950469509628702740&permissions=2252143411128320&integration_type=0&scope=bot) to a friend to add PotL to a new Discord server!" },
							{ name: "Provide Feedback", value: "Use the `/feedback` command to submit bug reports, feature requests, or balance suggestions and get an invite to the Imaginary Horizons Productions test server." },
							{ name: "Check out the GitHub", value: "Check out our [GitHub](https://github.com/Imaginary-Horizons-Productions) and tackle some issues or sponsor the project!" },
						)
						.setFooter({ text: "Thanks in advanced!", iconURL: interaction.client.user.displayAvatarURL() })
						.setTimestamp(stats.mtime)
				],
				flags: [MessageFlags.Ephemeral]
			})
		})
	}
);
