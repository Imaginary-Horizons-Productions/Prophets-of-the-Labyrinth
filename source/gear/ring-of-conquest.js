const { GearTemplate, GearFamily } = require('../classes');

//#region Base
const ringOfConquest = new GearTemplate("Ring of Conquest",
	[
		["Passive", "Increase your damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
).setCost(200);
//#endregion Base

//#region Hearty
const heartyRingOfConquest = new GearTemplate("Hearty Ring of Conquest",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness"
).setCost(350)
	.setScalings({ percentMaxHP: 10 });
//#endregion Hearty

//#region Powerful
const powerfulRingOfConquest = new GearTemplate("Powerful Ring of Conquest",
	[
		["Passive", "Increase your Power by @{percentPower}% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
).setCost(350)
	.setScalings({ percentPower: 10 });
//#endregion Powerful

module.exports = new GearFamily(ringOfConquest, [heartyRingOfConquest, powerfulRingOfConquest], false);
