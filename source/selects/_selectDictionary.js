const { SelectWrapper } = require("../classes");

/** @type {Record<string, SelectWrapper>} */
const selectDictionary = {};

for (const file of [
	"applepiewishingwell.js",
	"artifact.js",
	"artifactdupe.js",
	"blackboxgear.js",
	"buygear.js",
	"buyitem.js",
	"challenge.js",
	"collectartifact.js",
	"gearcollector.js",
	"item.js",
	"movetarget.js",
	"randomtinker.js",
	"randomupgrade.js",
	"repair.js",
	"sellgear.js",
	"startingartifact.js",
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
