const { SelectWrapper } = require("../classes");

/** @type {Record<string, SelectWrapper>} */
const selectDictionary = {};

for (const file of [
]) {
	/** @type {SelectWrapper} */
	const select = require(`./${file}`);
	selectDictionary[select.mainId] = select;
}

/** @param {string} mainId */
function getSelect(mainId) {
	return selectDictionary[mainId];
}

module.exports = {
	getSelect
};
