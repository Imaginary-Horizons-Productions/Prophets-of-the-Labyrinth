const { REST, Routes } = require('discord.js');
const { token, botId } = require('../../config/auth.json');

const rest = new REST({ version: 10 }).setToken(token);

(async () => {
	try {
		console.log('Started clearing application emoji');

		const emojiList = await rest.get(
			Routes.applicationEmojis(botId)
		);
		emojiList.items.forEach(emoji => {
			rest.delete(Routes.applicationEmoji(botId, emoji.id));
		})

		console.log('Successfully cleared application emoji');
	} catch (error) {
		console.error(error);
	}
})();
