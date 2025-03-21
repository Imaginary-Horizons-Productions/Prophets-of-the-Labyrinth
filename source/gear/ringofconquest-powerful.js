const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Ring of Conquest",
	[
		["Passive", "Increase your Power by @{percentPower}% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
).setCost(350)
	.setSidegrades("Hearty Ring of Conquest")
	.setScalings({ percentPower: 10 });
