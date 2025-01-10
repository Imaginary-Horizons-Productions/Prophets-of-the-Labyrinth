const { PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const { CommandWrapper } = require('../../classes');
const { getAdventure } = require('../../orcustrators/adventureOrcustrator');
const { createSubcommandMappings } = require('../../util/fileUtil');

const mainId = "adventure";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, [
	"partystats.js",
	"inspectself.js",
	"retreat.js"
]);
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.SendMessagesInThreads, false, [InteractionContextType.Guild], 3000,
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", flags: [MessageFlags.Ephemeral] });
			return;
		}

		subcommandExecuteDictionary[interaction.options.getSubcommand()](interaction, adventure, delver);
	}
).setSubcommands(subcommandSlashData);
