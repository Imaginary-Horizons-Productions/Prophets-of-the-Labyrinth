const { CommandWrapper, BuildError } = require('../classes');

/** @type {Record<string, CommandWrapper>} */
const commandDictionary = {};

module.exports = {
	/** @type {string[]} */
	commandFiles: [
		"adventure",
		"manual",
		"set-favorite",
		"about.js",
		"commands.js",
		"data-policy.js",
		"delve.js",
		"feedback.js",
		"guild-draft.js",
		"invite.js",
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
	if (command.mainId in commandDictionary) {
		throw new BuildError(`Duplicate command custom id: ${command.mainId}`);
	}
	commandDictionary[command.mainId] = command;
	module.exports.slashData.push(command.builder.toJSON());
}

/** @param {string} commandName */
function getCommand(commandName) {
	return commandDictionary[commandName];
}
