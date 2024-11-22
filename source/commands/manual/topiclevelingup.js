const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topiclevelingup.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Leveling Up")
					.setDescription("Delvers will level up and gain stats after each battle. They'll gain 1 level after normal combat, 3 after artifact guardians, and 5 after final bosses.")
					.setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "leveling-up",
		description: "Get details about leveling-up"
	},
	executeSubcommand
};
