const { InteractionWrapper } = require("../classes");

/** @type {Record<string, InteractionWrapper>} */
const selectDictionary = {};

for (const file of [
]) {
	const select = require(`./${file}`);
	selectDictionary[select.customId] = select;
}

/**
 * @param {string} mainId
 */
exports.getSelect = function (mainId) {
	return selectDictionary[mainId];
}
