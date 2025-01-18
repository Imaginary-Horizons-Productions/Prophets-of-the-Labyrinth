const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Mighty Gauntlet",
	[
		["Passive", "Increase your Power by @{percentPower}% and Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Mighty Gauntlet", "Powerful Mighty Gauntlet")
	.setScalings({
		percentPower: 20,
		percentMaxHP: 10
	});
