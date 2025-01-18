const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Ring of Knowledge",
	[
		["Passive", "Increase your Speed by @{percentSpeed}% and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(350)
	.setSidegrades("Accurate Ring of Knowledge")
	.setScalings({ percentSpeed: 10 });
