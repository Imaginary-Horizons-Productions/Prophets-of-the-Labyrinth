const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise"]
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, adventure) => []
).setUpgrades("Surpassing Wolf Ring", "Swift Wolf Ring", "Wise Wolf Ring")
	.setPoise(2)
	.setCharges(0);
