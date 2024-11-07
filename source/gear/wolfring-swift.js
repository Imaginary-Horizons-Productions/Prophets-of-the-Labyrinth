const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise and @{speed} Speed"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Surpassing Wolf Ring", "Wise Wolf Ring")
	.setPoise(2)
	.setSpeed(5);
