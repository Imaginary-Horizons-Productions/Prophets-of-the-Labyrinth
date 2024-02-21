const { ButtonWrapper } = require("../classes");

/** @type {Record<string, ButtonWrapper>} */
const buttonDictionary = {};

for (const file of [
	"appease.js",
	"blackbox.js",
	"buylife.js",
	"buyscouting.js",
	"confirmmove.js",
	"deploy.js",
	"elementresearch.js",
	"freerepairkit.js",
	"gearcapup.js",
	"getgoldonfire.js",
	"greed.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"pillagepedestals.js",
	"predict.js",
	"ready.js",
	"readyitem.js",
	"readymove.js",
	"repairkittinker.js",
	"replacegear.js",
	"rest.js",
	"routevote.js",
	"stealwishingwellcore.js",
	"tinker.js",
	"trainingdummy.js",
	"upgrade.js",
	"viewchallenges.js",
	"viewcollectartifact.js",
	"viewgearcollector.js",
	"viewgearsales.js",
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
