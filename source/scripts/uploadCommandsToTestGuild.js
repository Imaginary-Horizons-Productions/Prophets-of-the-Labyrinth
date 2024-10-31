const { REST, Routes } = require('discord.js');
const { token, botId, testGuildId } = require('../../config/auth.json');
const { slashData } = require('../commands/_commandDictionary');
const { contextMenuData } = require('../context_menus/_contextMenuDictionary');

const rest = new REST({ version: 10 }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing slash commands on test guild.');

		await rest.put(
			Routes.applicationGuildCommands(botId, testGuildId),
			{ body: slashData.concat(contextMenuData) },
		);

		console.log('Successfully reloaded slash commands on test guild.');
	} catch (error) {
		console.error(error);
	}
})();
