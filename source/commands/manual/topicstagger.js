const fs = require("fs");
const { MessageFlags } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { SubcommandWrapper } = require("../../classes");

module.exports = new SubcommandWrapper("stagger", "Get details on building up to Stun",
	async function executeSubcommand(interaction, ...args) {
		fs.promises.stat("./source/commands/manual/topicstagger.js").then(stats => {
			interaction.reply({
				embeds: [
					embedTemplate().setTitle("Stagger")
						.setDescription("Stagger stacks up on combatants when moves are used against them, leading to the combatant getting Stunned. Stagger promotes to Stun between rounds if a combatant's Stagger is at or above their Stagger Capacity (1 per 50 Max HP for delvers, varies for enemies). A stunned combatant misses their turn next round. Combatants shrug off 1 Stagger each round.")
						.addFields({ name: "Essence Match Stagger", value: "When a combatant makes a move that matches their essence, their target gets a bonus effect. If the target is an ally, they are relieved of 1 Stagger. If the target is an enemy, they suffer 2 additional Stagger." })
						.setTimestamp(stats.mtime)
				],
				flags: [MessageFlags.Ephemeral]
			});
		})
	}
);
