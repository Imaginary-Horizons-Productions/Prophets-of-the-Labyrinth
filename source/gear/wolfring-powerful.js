const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and your Power by @{percentPower}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Wolf Ring", "Swift Wolf Ring")
	.setScalings({ percentMaxHP: 20, percentPower: 10 });
