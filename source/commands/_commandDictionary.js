const { CommandWrapper } = require('../classes');

/** @type {string[]} */
exports.commandFiles = [
	"data-policy.js",
	"feedback.js",
	"manual.js",
	"version.js"
];
/** @type {Record<string, CommandWrapper>} */
const commandDictionary = {};
/** @type {import('discord.js').RESTPostAPIChatInputApplicationCommandsJSONBody[]} */
exports.slashData = [];

for (const file of exports.commandFiles) {
	/** @type {CommandWrapper} */
	const command = require(`./${file}`);
	commandDictionary[command.mainId] = command;
	exports.slashData.push(command.builder.toJSON());
}

/** @param {string} commandName */
exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
