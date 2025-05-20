const fs = require("fs");
const { MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("speed", "Get details about move order within a round",
	async function executeSubcommand(interaction, ...args) {
		fs.promises.stat(__filename).then(stats => {
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Speed")
						.setDescription("Within a round, the combatant with the highest total speed gets to resolve their move first. Combatant speed is now static however: it randomly varies from round to round, can be increased with the Swiftness modifier, or decreased with the Torpidity modifier.\n\n\
						Additionally, moves can have priority, which allows them resolve before moves with lower or no priority regardless of speed.")
						.setTimestamp(stats.mtime)
				],
				flags: [MessageFlags.Ephemeral]
			});
		})
	}
);
