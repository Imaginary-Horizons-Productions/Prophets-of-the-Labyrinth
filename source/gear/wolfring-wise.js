const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise and 10% more stats from leveling up"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Surpassing Wolf Ring", "Swift Wolf Ring")
	.setPoise(2);
