const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Powerful Mighty Gauntlet", "Hearty Mighty Gauntlet")
	.setScalings({
		percentPower: 20,
		percentCritRate: 10
	});
