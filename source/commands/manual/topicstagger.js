const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topicstagger.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Stagger")
					.setDescription("Stagger stacks up on combatants when moves are used against them, leading to the combatant getting Stunned. Stagger promotes to Stun between rounds when a combatant's Stagger reaches their Poise (1 per 50 Max HP for delvers, varies for enemies). A stunned combatant misses their turn next round. Combatants shrug off 1 Stagger each round.")
					.addFields({ name: "Essence Match Stagger", value: "When a combatant makes a move that matches their essence, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 2 additional Stagger." })
					.setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "stagger",
		description: "Get details on building up to Stun"
	},
	executeSubcommand
};
