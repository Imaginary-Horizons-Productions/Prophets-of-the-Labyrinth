const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const bootsOfComfort = new GearTemplate("Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setScalings({
		percentSpeed: 20
	});
//#endregion Base

//#region Accurate
const accurateBootsOfComfort = new GearTemplate("Accurate Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentSpeed: 20,
		percentCritRate: 10
	});
//#endregion Accurate

//#region Hearty
const heartyBootsOfComfort = new GearTemplate("Hearty Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentMaxHP: 10,
		percentSpeed: 20
	});
//#endregion Hearty

//#region Powerful
const powerfulBootsOfComfort = new GearTemplate("Powerful Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setScalings({
		percentSpeed: 20,
		percentPower: 10
	});
//#endregion Powerful

module.exports = new GearFamily(bootsOfComfort, [accurateBootsOfComfort, heartyBootsOfComfort, powerfulBootsOfComfort], false);
