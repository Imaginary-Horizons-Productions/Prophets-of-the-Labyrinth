const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Mighty Gauntlet",
	[
		["Passive", "Increase your Power by 20% and your Crit Rate by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Powerful Mighty Gauntlet", "Hearty Mighty Gauntlet")
	.setPower(20)
	.setCritRate(10)
	.setCharges(0);
