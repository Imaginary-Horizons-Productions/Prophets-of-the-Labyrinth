const { SubcommandWrapper } = require("../../classes");
const { generatePartyStatsPayload } = require("../../util/embedUtil");

module.exports = new SubcommandWrapper("party-stats", "Get info about the current adventure",
	async function executeSubcommand(interaction, ...[adventure]) {
		interaction.reply(generatePartyStatsPayload(adventure))
			.catch(console.error);
	}
);
