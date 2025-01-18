const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and your Crit Rate by @{percentCritRate}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Powerful Wolf Ring", "Swift Wolf Ring")
	.setScalings({
		percentMaxHP: 20,
		percentCritRate: 10
	});
