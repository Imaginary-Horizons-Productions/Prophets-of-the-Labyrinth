const { PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../../classes');
const { createSubcommandMappings } = require('../../util/fileUtil');
const { getPlayer } = require('../../orcustrators/playerOrcustrator');

const mainId = "set-favorite";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, [
	"archetype.js",
	"pet.js"
]);
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.ViewChannel, false, [InteractionContextType.Guild], 3000,
	/** Sets the player's favorite archetype or pet so they don't have to select them each adventure */
	(interaction) => {
		const player = getPlayer(interaction.user.id, interaction.guildId);
		subcommandExecuteDictionary[interaction.options.getSubcommand()](interaction, player);
	}
).setSubcommands(subcommandSlashData);
