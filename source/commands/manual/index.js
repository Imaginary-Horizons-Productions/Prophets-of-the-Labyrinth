const { InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../../classes');
const { createSubcommandMappings } = require('../../util/fileUtil');

const mainId = "manual";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, [
	"beginnersguide.js",
	"lookupartifact.js",
	"lookupchallenge.js",
	"lookupenemy.js",
	"lookupgear.js",
	"lookupitem.js",
	"lookupmodifier.js",
	"lookuppet.js",
	"topicdamagecalculation.js",
	"topicessences.js",
	"topiclevelingup.js",
	"topicspeed.js",
	"topicstagger.js"
]);
module.exports = new CommandWrapper(mainId, "Get information about how to play or game entities", null, false, [InteractionContextType.BotDM, InteractionContextType.Guild, InteractionContextType.PrivateChannel], 3000,
	(interaction) => {
		subcommandExecuteDictionary[interaction.options.getSubcommand()](interaction);
	}
).setSubcommands(subcommandSlashData);
