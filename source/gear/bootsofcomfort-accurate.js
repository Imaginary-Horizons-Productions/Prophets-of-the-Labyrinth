const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Boots of Comfort",
	[
		["Passive", "Increase your Speed by 20% and your Crit Rate by 10%"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Powerful Boots of Comfort", "Hearty Boots of Comfort")
	.setSpeed(20)
	.setCritRate(10)
	.setCharges(0);
