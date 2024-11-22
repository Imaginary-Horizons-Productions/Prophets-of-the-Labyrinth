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
					.setDescription(`The game calculates damage in the following way:\n1. Check if target is dead\n2. Check if damage is converted to healing by Elemental Absorbtion\n3. If damage is blockable, check if target has ${getApplicationEmojiMarkdown("Evade")}\n4. Calculate increases/decreases from ${getApplicationEmojiMarkdown("Exposed")}, Elemental Affinity, and protection\n5. Apply the damage cap if applicable`)
					.addFields({ name: "The Damage Cap", value: `The maximum amount of damage that can be done in one shot after protection is 500. This cap is raised by 50 when leveling up and by 1 for each stack of ${getApplicationEmojiMarkdown("Power Up")} a user has.` })
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
