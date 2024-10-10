const { REST, Routes } = require('discord.js');
const { token, botId, testGuildId } = require('../../config/auth.json');

const rest = new REST({ version: 10 }).setToken(token);

(async () => {
	try {
		console.log('Started clearing slash commands.');

		if (botId) {
			await rest.put(Routes.applicationCommands(botId), { body: [] });

			if (testGuildId) {
				await rest.put(
					Routes.applicationGuildCommands(botId, testGuildId),
					{ body: [] },
				);
			}
		} else {
			throw new Error("Could not clear commands due to botId missing from config")
		}

		console.log('Successfully cleared slash commands.');
	} catch (error) {
		console.error(error);
	}
})();
