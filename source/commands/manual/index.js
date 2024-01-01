const { CommandWrapper } = require('../../classes');
const { createSubcommandMappings } = require('../../util/fileUtil');

const mainId = "manual";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, [
	"glossary.js",
	"enemyinfo.js",
	"artifactinfo.js",
	"gearinfo.js",
	"iteminfo.js"
]);
module.exports = new CommandWrapper(mainId, "Get information about how to play or game entities", null, false, true, 3000,
	(interaction) => {
		subcommandExecuteDictionary[interaction.options.getSubcommand()](interaction);
	}
).setSubcommands(subcommandSlashData);
