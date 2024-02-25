const { SelectWrapper } = require("../classes");

/** @type {Record<string, SelectWrapper>} */
const selectDictionary = {};

for (const file of [
	"applepiewishingwell.js",
	"artifact.js",
	"artifactdupe.js",
	"buygear.js",
	"buyitem.js",
	"startingchallenges.js",
	"treasure.js"
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
