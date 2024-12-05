const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Scarf",
	[
		["Passive", "Gain @{speed} Speed and @{critRate} Crit Rate"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Hearty Scarf", "Wise Scarf")
	.setSpeed(5)
	.setCritRate(5)
	.setCharges(0);
