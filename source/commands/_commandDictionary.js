const { CommandWrapper } = require('../classes');

/** @type {Record<string, CommandWrapper>} */
const commandDictionary = {};

module.exports = {
	/** @type {string[]} */
	commandFiles: [
		"about.js",
		"adventure",
		"commands.js",
		"data-policy.js",
		"delve.js",
		"feedback.js",
		"give-up.js",
		"invite.js",
		"manual",
		"ping.js",
		"player-stats.js",
		"regenerate.js",
		"reset.js",
		"share-seed.js",
		"support.js",
		"version.js"
	],
	/** @type {import('discord.js').RESTPostAPIChatInputApplicationCommandsJSONBody[]} */
	slashData: [],
	getCommand
};

for (const file of module.exports.commandFiles) {
	/** @type {CommandWrapper} */
	const command = require(`./${file}`);
	commandDictionary[command.mainId] = command;
	module.exports.slashData.push(command.builder.toJSON());
}

/** @param {string} commandName */
function getCommand(commandName) {
	return commandDictionary[commandName];
}
