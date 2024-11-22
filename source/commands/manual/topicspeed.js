const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topicspeed.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Speed")
					.setDescription("Within a round, the combatant with the highest total speed gets to resolve their move first. Combatant speed is now static however: it randomly varies from round to round, can be increased with the Quicken modifier, or decreased with the Slow modifier.\n\n\
					Additionally, moves can have priority, which allows them resolve before moves with lower or no priority regardless of speed.")
					.setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "speed",
		description: "Get details about move order within a round"
	},
	executeSubcommand
};
