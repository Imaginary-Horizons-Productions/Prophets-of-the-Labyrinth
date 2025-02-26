const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Scarf", "Swift Scarf")
	.setScalings({
		percentCritRate: 20,
		percentPower: 10
	});
