const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Boots of Comfort",
	[
		["Passive", "Increase your Speed by 20% and your Power by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Boots of Comfort", "Swift Boots of Comfort")
	.setSpeed(20)
	.setPower(10)
	.setCharges(0);
