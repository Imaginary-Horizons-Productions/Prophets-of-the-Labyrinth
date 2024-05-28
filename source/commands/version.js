const { AttachmentBuilder } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { generateVersionEmbed } = require('../util/embedUtil');

const mainId = "version";
module.exports = new CommandWrapper(mainId, "Get the PotL change log", null, false, true, 3000,
	/** Send the user the most recent set of patch notes or full change log */
	(interaction) => {
		if (interaction.options.getString("notes-length") === "last-version") {
			generateVersionEmbed().then(embed => {
				interaction.reply({ embeds: [embed], ephemeral: true });
			}).catch(console.error);
		} else {
			interaction.reply({
				content: "Here are all the changes so far: ",
				files: [new AttachmentBuilder("./ChangeLog.md")],
				ephemeral: true
			});
		}
	}
).setOptions(
	{
		type: "String",
		name: "notes-length",
		description: "Get the changes in last version or the full change log",
		choices: [
			{ name: "Last version", value: "last-version" },
			{ name: "Full change log", value: "full-change-log" }
		],
		required: true
	}
);
