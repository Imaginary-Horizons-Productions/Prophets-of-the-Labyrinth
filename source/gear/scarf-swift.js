const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Scarf",
	[
		["Passive", "Increase your Crit Rate by 20% and your Speed by 10%"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Hearty Scarf", "Powerful Scarf")
	.setSpeed(10)
	.setCritRate(20)
	.setCharges(0);
