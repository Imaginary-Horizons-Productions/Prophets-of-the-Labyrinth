const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setUpgrades("Accurate Boots of Comfort", "Hearty Boots of Comfort", "Powerful Boots of Comfort")
	.setScalings({
		percentSpeed: 20
	});
