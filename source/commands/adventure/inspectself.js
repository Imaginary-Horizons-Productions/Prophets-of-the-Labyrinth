const { CommandInteraction } = require("discord.js");
const { Adventure, Delver } = require("../../classes");
const { inspectSelfPayload } = require("../../util/embedUtil");
const { ICON_INSPECT_SELF } = require("../../constants");

/**
 * @param {CommandInteraction} interaction
 * @param {[Adventure, Delver]} args
 */
async function executeSubcommand(interaction, ...[adventure, delver]) {
	interaction.reply(inspectSelfPayload(delver, adventure))
		.catch(console.error);
};

module.exports = {
	data: {
		name: "inspect-self",
		description: `${ICON_INSPECT_SELF} Get your adventure-specific stats`
	},
	executeSubcommand
};
