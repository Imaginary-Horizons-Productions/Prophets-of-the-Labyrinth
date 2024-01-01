const { PermissionFlagsBits } = require('discord.js');
const { CommandWrapper } = require('../../classes');
const { getAdventure } = require('../../orcustrators/adventureOrcustrator');
const { createSubcommandMappings } = require('../../util/fileUtil');

const mainId = "adventure";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, [
	"partystats.js",
	"inspectself.js"
]);
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.SendMessagesInThreads, false, false, 3000,
	(interaction) => {
		const adventure = getAdventure(interaction.channelId);
		if (!adventure) {
			interaction.reply({ content: "This channel doesn't appear to be an adventure's thread.", ephemeral: true });
			return;
		}

		const delver = adventure.delvers.find(delver => delver.id === interaction.user.id);
		if (!delver) {
			interaction.reply({ content: "You aren't in this adventure.", ephemeral: true });
			return;
		}

		subcommandExecuteDictionary[interaction.options.getSubcommand()](interaction, adventure, delver);
	}
).setSubcommands(subcommandSlashData);
