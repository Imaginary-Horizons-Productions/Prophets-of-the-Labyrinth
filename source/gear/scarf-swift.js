const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Scarf",
	[
		["Passive", "Increase your Crit Rate by @{percentCritRate}% and your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Hearty Scarf", "Powerful Scarf")
	.setScalings({
		percentCritRate: 20,
		percentSpeed: 10
	});
