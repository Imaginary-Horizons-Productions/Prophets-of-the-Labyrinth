const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Mighty Gauntlet",
	[
		["Passive", "Increase your Power by 20% and your Speed by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Mighty Gauntlet", "Swift Mighty Gauntlet")
	.setSpeed(10)
	.setPower(20)
	.setCharges(0);
