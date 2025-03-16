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
	"deploypet.js",
	"essenceresearch.js",
	"eventartifact.js",
	"floofcometfur.js",
	"gearcapup.js",
	"getgoldonfire.js",
	"greed.js",
	"hpshare.js",
	"inspectself.js",
	"join.js",
	"modifier.js",
	"modify.js",
	"partystats.js",
	"pillagepedestals.js",
	"ready.js",
	"readyitem.js",
	"readymove.js",
	"recharge.js",
	"rest.js",
	"routevote.js",
	"sellgear.js",
	"selltogearcollector.js",
	"startingartifacts.js",
	"stealwishingwellcore.js",
	"switchpet.js",
	"switchspecialization.js",
	"takeswordfromcomet.js",
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
