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
						name: "Click here to visit the PotL GitHub",
						iconURL: "https://cdn.discordapp.com/icons/353575133157392385/c78041f52e8d6af98fb16b8eb55b849a.png",
						url: "https://github.com/Imaginary-Horizons-Productions/prophets-of-the-labyrinth"
					})
					.setTitle(`Supporting Prophets of the Labyrinth`)
					.setThumbnail(`https://cdn.discordapp.com/attachments/545684759276421120/734202424960745545/love-mystery.png`)
					.setDescription("Thanks for playing *Prophets of the Labyrinth*. Here are a few ways to support us:")
					.addFields({ name: "Check out the github", value: "Check out our [github](https://github.com/Imaginary-Horizons-Productions) and tackle some issues or sponsor a project!" })
					.setFooter({ text: "Thanks in advanced!", iconURL: interaction.client.user.displayAvatarURL() })
					.setTimestamp()
			],
			ephemeral: true
		})
	}
);
