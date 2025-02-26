const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% multiplicatively and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Powerful Scarf", "Swift Scarf")
	.setScalings({
		percentCritRate: 20,
		percentMaxHP: 10
	});
