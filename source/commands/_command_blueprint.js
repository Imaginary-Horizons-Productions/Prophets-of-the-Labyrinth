const { PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { CommandWrapper } = require('../classes');
const { createSubcommandMappings } = require('../util/fileUtil');

const mainId = "";
const { slashData: subcommandSlashData, executeDictionary: subcommandExecuteDictionary } = createSubcommandMappings(mainId, []);
module.exports = new CommandWrapper(mainId, "description", PermissionFlagsBits.ViewChannel, false, [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel], 3000,
	/** Command specifications go here */
	(interaction) => {

	}
).setOptions(
	{
		type: "",
		name: "",
		description: "",
		required: false,
		autocomplete: [{ name: "", value: "" }], // optional
		choices: [{ name: "", value: "" }] // optional
	}
).setSubcommands(subcommandSlashData);
