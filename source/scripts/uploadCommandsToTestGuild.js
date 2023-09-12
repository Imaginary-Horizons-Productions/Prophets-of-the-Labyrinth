const { REST, Routes } = require('discord.js');
const { token, botId, testGuildId } = require('../../config/auth.json');
const { slashData } = require('../commands/_commandDictionary');

const rest = new REST({ version: 9 }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing slash commands on test guild.');

		await rest.put(
			Routes.applicationGuildCommands(botId, testGuildId),
			{ body: slashData },
		);

		console.log('Successfully reloaded slash commands on test guild.');
	} catch (error) {
		console.error(error);
	}
})();
