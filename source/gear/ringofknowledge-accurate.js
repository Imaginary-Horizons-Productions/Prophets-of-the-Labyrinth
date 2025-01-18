const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Ring of Knowledge",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(350)
	.setSidegrades("Swift Ring of Knowledge")
	.setScalings({ percentCritRate: 10 });
