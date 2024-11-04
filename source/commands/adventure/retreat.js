const { CommandInteraction } = require("discord.js");
const { Adventure } = require("../../classes");
const { completeAdventure } = require("../../orcustrators/adventureOrcustrator");

/**
 * @param {CommandInteraction} interaction
 * @param {[Adventure]} args
 */
async function executeSubcommand(interaction, ...[adventure]) {
	interaction.reply(completeAdventure(adventure, interaction.channel, "giveup"));
};

module.exports = {
	data: {
		name: "retreat",
		description: "End the current adventure by retreating"
	},
	executeSubcommand
};
