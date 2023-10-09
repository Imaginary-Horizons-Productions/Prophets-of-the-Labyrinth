const { EmbedBuilder, Colors } = require('discord.js');
const { CommandWrapper } = require('../classes');

const mainId = "support";
const options = [];
const subcommands = [];
module.exports = new CommandWrapper(mainId, "List ways to support PotL", null, false, true, 3000, options, subcommands,
	(interaction) => {
		interaction.reply({
			embeds: [
				new EmbedBuilder().setColor(Colors.Blurple)
					.setAuthor({
						name: "Imaginary Horizons Productions",
						iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
						url: "https://github.com/Imaginary-Horizons-Productions"
					})
					.setTitle("Supporting *Prophets of the Labyrinth*")
					.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
					.setDescription("Thanks for playing! Here are a few ways to support development:")
					.addFields(
						{ name: "Tell a Friend", value: "Use or send [this link](https://discord.com/api/oauth2/authorize?client_id=950469509628702740&permissions=397284665360&scope=bot%20applications.commands) to a friend to add PotL to a new Discord server!" },
						{ name: "Provide Feedback", value: "Use the `/feedback` command to submit bug reports, feature requests, or balance suggestions and get an invite to the Imaginary Horizons Productions test server." },
						{ name: "Check out the GitHub", value: "Check out our [GitHub](https://github.com/Imaginary-Horizons-Productions) and tackle some issues or sponsor the project!" },
					)
					.setFooter({ text: "Thanks in advanced!", iconURL: interaction.client.user.displayAvatarURL() })
			],
			ephemeral: true
		})
	}
);
