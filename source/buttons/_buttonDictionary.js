const { ButtonWrapper } = require("../classes");

/** @type {Record<string, ButtonWrapper>} */
const buttonDictionary = {};

for (const file of [
	"buylife.js",
	"buyscouting.js",
	"confirmmove.js",
	"deploy.js",
	"elementresearch.js",
	"freerepairkit.js",
	"getgoldonfire.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"predict.js",
	"ready.js",
	"readyitem.js",
	"readymove.js",
	"replacegear.js",
	"rest.js",
	"routevote.js",
	"upgrade.js",
	"viewchallenges.js",
	"viewcollectartifact.js",
	"viewrepairs.js",
	"viewstartingartifact.js"
]) {
	/** @type {ButtonWrapper} */
	const button = require(`./${file}`);
	buttonDictionary[button.mainId] = button;
}

/** @param {string} mainId */
function getButton(mainId) {
	return buttonDictionary[mainId];
}

module.exports = {
	getButton
};
