const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Ring of Knowledge",
	[
		["Passive", "Gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light"
).setCost(200)
	.setUpgrades("Accurate Ring of Knowledge", "Swift Ring of Knowledge");
