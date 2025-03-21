const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const scarf = new GearTemplate("Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setScalings({ percentCritRate: 20 });
//#endregion Base

//#region Hearty
const heartyScarf = new GearTemplate("Hearty Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentCritRate: 20,
		percentMaxHP: 10
	});
//#endregion Hearty

//#region Powerful
const powerfulScarf = new GearTemplate("Powerful Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentCritRate: 20,
		percentPower: 10
	});
//#endregion Powerful

//#region Swift
const swiftScarf = new GearTemplate("Swift Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively and your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentCritRate: 20,
		percentSpeed: 10
	});
//#endregion Swift

module.exports = new GearFamily(scarf, [heartyScarf, powerfulScarf, swiftScarf], false);
