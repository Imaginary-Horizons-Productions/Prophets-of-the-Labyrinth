const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const ringOfKnowledge = new GearTemplate("Ring of Knowledge",
	[
		["Passive", "Gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(200);
//#endregion Base

//#region Accurate
const accurateRingOfKnowledge = new GearTemplate("Accurate Ring of Knowledge",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(350)
	.setScalings({ percentCritRate: 10 });
//#endregion Accurate

//#region Swift
const swiftRingOfKnowledge = new GearTemplate("Swift Ring of Knowledge",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% multiplicatively and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(350)
	.setScalings({ percentSpeed: 10 });
//#endregion Swift

module.exports = new GearFamily(ringOfKnowledge, [accurateRingOfKnowledge, swiftRingOfKnowledge], false);
