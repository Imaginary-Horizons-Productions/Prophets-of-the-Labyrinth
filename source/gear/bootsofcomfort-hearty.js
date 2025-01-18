const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Boots of Comfort",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Boots of Comfort", "Powerful Boots of Comfort")
	.setScalings({
		percentMaxHP: 10,
		percentSpeed: 20
	});
