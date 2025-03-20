const { SubcommandWrapper } = require("../../classes");
const { completeAdventure } = require("../../orcustrators/adventureOrcustrator");

module.exports = new SubcommandWrapper("retreat", "End the current adventure by retreating",
	async function executeSubcommand(interaction, ...[adventure]) {
		interaction.reply(completeAdventure(adventure, interaction.channel, "giveup"));
	}
);
