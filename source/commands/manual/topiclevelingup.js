const fs = require("fs");
const { MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("leveling-up", "Get details about leveling-up",
	async function executeSubcommand(interaction, ...args) {
		fs.promises.stat(__filename).then(stats => {
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Leveling Up")
						.setDescription("Delvers will level up and gain stats after each battle. They'll gain 1 level after normal combat, 3 after artifact guardians, and 5 after final bosses.")
						.setTimestamp(stats.mtime)
				],
				flags: [MessageFlags.Ephemeral]
			});
		})
	}
);
