const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const mightyGauntlet = new GearTemplate("Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setScalings({
		percentPower: 20
	});
//#endregion Base

//#region Accurate
const accurateMightyGauntlet = new GearTemplate("Accurate Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentPower: 20,
		percentCritRate: 10
	});
//#endregion Accurate

//#region Hearty
const heartyMightyGauntlet = new GearTemplate("Hearty Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentPower: 20,
		percentMaxHP: 10
	});
//#endregion Hearty

//#region Swift
const swiftMightyGauntlet = new GearTemplate("Swift Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentPower: 20,
		percentSpeed: 10
	});
//#endregion Swift

module.exports = new GearFamily(mightyGauntlet, [accurateMightyGauntlet, heartyMightyGauntlet, swiftMightyGauntlet], false);
