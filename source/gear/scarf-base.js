const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setUpgrades("Hearty Scarf", "Powerful Scarf", "Swift Scarf")
	.setScalings({ percentCritRate: 20 });
