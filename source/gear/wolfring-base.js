const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(200)
	.setUpgrades("Accurate Wolf Ring", "Powerful Wolf Ring", "Swift Wolf Ring")
	.setScalings({ percentMaxHP: 20 });
