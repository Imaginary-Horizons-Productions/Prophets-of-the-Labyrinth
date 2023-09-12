const { CommandWrapper } = require('../classes');

/** @type {string[]} */
exports.commandFiles = [
	"data-policy.js",
	"feedback.js",
	"version.js"
];
/** @type {Record<string, CommandWrapper>} */
const commandDictionary = {};
exports.slashData = [];

for (const file of exports.commandFiles) {
	const command = require(`./${file}`);
	commandDictionary[command.customId] = command;
	exports.slashData.push(command.data.toJSON());
}

/**
 * @param {string} commandName
 */
exports.getCommand = function (commandName) {
	return commandDictionary[commandName];
}
