const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const wolfRing = new GearTemplate("Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setScalings({ percentMaxHP: 20 });
//#endregion Base

//#region Accurate
const accurateWolfRing = new GearTemplate("Accurate Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentMaxHP: 20,
		percentCritRate: 10
	});
//#endregion Accurate

//#region Powerful
const powerfulWolfRing = new GearTemplate("Powerful Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({ percentMaxHP: 20, percentPower: 10 });
//#endregion Powerful

//#region Swift
const swiftWolfRing = new GearTemplate("Swift Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentMaxHP: 20,
		percentSpeed: 10
	});
//#endregion Swift

module.exports = new GearFamily(wolfRing, [accurateWolfRing, powerfulWolfRing, swiftWolfRing], false);
