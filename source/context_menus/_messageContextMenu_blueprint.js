const { PermissionFlagsBits, InteractionContextType } = require('discord.js');
const { MessageContextMenuWrapper } = require('../classes');

const mainId = "";
module.exports = new MessageContextMenuWrapper(mainId, PermissionFlagsBits.SendMessages, false, [InteractionContextType.Guild], 3000,
	/** Specs */
	(interaction) => {

	}
);
