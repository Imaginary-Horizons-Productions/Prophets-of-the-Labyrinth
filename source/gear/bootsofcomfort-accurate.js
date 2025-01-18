const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and your Crit Rate by @{percentCritRate}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Powerful Boots of Comfort", "Hearty Boots of Comfort")
	.setScalings({
		percentSpeed: 20,
		percentCritRate: 10
	});
