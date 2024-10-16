const { ButtonWrapper } = require("../classes");

/** @type {Record<string, ButtonWrapper>} */
const buttonDictionary = {};

for (const file of [
	"appease.js",
	"blackbox.js",
	"buylife.js",
	"buyscouting.js",
	"challenges.js",
	"clearstartingchallenges.js",
	"collectartifact.js",
	"deploy.js",
	"elementresearch.js",
	"eventartifact.js",
	"freerepairkit.js",
	"gearcapup.js",
	"getgoldonfire.js",
	"greed.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"partystats.js",
	"pillagepedestals.js",
	"ready.js",
	"readyitem.js",
	"readymove.js",
	"repair.js",
	"repairkittinker.js",
	"rest.js",
	"routevote.js",
	"sellgear.js",
	"selltogearcollector.js",
	"startingartifacts.js",
	"stealwishingwellcore.js",
	"tinker.js",
	"trainingdummy.js",
	"upgrade.js"
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
