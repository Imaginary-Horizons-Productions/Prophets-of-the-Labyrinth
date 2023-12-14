const { CommandInteraction } = require("discord.js");
const { Adventure, Delver } = require("../../classes");
const { inspectSelfPayload } = require("../../util/embedUtil");

/**
 * @param {CommandInteraction} interaction
 * @param {[Adventure, Delver]} args
 */
async function executeSubcommand(interaction, ...[adventure, delver]) {
	interaction.reply(inspectSelfPayload(delver, adventure.getGearCapacity(), adventure.room.enemies !== null))
		.catch(console.error);
};

module.exports = {
	data: {
		name: "inspect-self",
		description: "🔎 Get your adventure-specific stats"
	},
	executeSubcommand
};
