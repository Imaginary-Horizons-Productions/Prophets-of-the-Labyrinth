const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Scarf",
	[
		["Passive", "Increase your Crit Rate by 20% and your Power by 10%"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Scarf", "Swift Scarf")
	.setCritRate(20)
	.setPower(10)
	.setCharges(0);
