const { InteractionWrapper } = require("../classes");

/** @type {Record<string, InteractionWrapper>} */
const buttonDictionary = {};

for (const file of [
]) {
	const button = require(`./${file}`);
	buttonDictionary[button.customId] = button;
}

/**
 * @param {string} mainId
 */
exports.getButton = function (mainId) {
	return buttonDictionary[mainId];
}
