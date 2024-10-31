const { PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { UserContextMenuWrapper } = require('../classes');

const mainId = "";
module.exports = new UserContextMenuWrapper(mainId, PermissionFlagsBits.SendMessages, false, [InteractionContextType.Guild], 3000,
	/** Specs */
	(interaction) => {

	}
);
