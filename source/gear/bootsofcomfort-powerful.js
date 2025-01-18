const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Boots of Comfort", "Swift Boots of Comfort")
	.setScalings({
		percentSpeed: 20,
		percentPower: 10
	});
