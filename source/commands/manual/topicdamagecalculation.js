const fs = require("fs");
const { CommandInteraction } = require("discord.js");
const { embedTemplate } = require("../../util/embedUtil");
const { getApplicationEmojiMarkdown } = require("../../util/graphicsUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {...unknown} args
 */
async function executeSubcommand(interaction, ...args) {
	fs.promises.stat("./source/commands/manual/topicdamagecalculation.js").then(stats => {
		interaction.reply({
			embeds: [
				embedTemplate().setTitle("Damage Calculation")
					.setDescription(`The game calculates damage in the following way:\n1. Check if target is dead\n2. Apply Critical Hit effects (eg doubling damage)\n3. Check if damage is converted to healing by Essence Absorption\n4. If damage is blockable, check if target has ${getApplicationEmojiMarkdown("Evade")}\n5. Calculate increases/decreases from ${getApplicationEmojiMarkdown("Exposed")}, Essence Countering, and protection\n6. Apply the damage cap if applicable`)
					.addFields({ name: "The Damage Cap", value: `The maximum amount of damage that can be done in one shot after protection is 199. This cap is raised by 20 when leveling up and for each stack of ${getApplicationEmojiMarkdown("Excellence")} a user has.` })
					.setTimestamp(stats.mtime)
			],
			ephemeral: true
		});
	})
};

module.exports = {
	data: {
		name: "damage-calculation",
		description: "Get details on how damage is calculated"
	},
	executeSubcommand
};
