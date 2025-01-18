const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and Speed by @{percentSpeed}%"]
	],
	"Trinket",
	"Unaligned"
).setCost(350)
	.setSidegrades("Accurate Wolf Ring", "Powerful Wolf Ring")
	.setScalings({
		percentMaxHP: 20,
		percentSpeed: 10
	});
