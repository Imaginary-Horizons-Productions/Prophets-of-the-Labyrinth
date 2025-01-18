const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and your Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Mighty Gauntlet", "Swift Mighty Gauntlet")
	.setScalings({
		percentPower: 20,
		percentSpeed: 10
	});
