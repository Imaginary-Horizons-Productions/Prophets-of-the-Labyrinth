const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setUpgrades("Accurate Mighty Gauntlet", "Hearty Mighty Gauntlet", "Powerful Mighty Gauntlet")
	.setScalings({
		percentPower: 20
	});
