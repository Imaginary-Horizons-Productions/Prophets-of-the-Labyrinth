const { CommandInteraction } = require("discord.js");
const { Adventure } = require("../../classes");
const { generatePartyStatsPayload } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {[Adventure]} args
 */
async function executeSubcommand(interaction, ...[adventure]) {
	interaction.reply(generatePartyStatsPayload(adventure))
		.catch(console.error);
};

module.exports = {
	data: {
		name: "party-stats",
		description: "Get info about the current adventure"
	},
	executeSubcommand
};
