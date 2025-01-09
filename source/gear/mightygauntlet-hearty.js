const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Mighty Gauntlet",
	[
		["Passive", "Increase your Power by 20% and Max HP by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Mighty Gauntlet", "Powerful Mighty Gauntlet")
	.setMaxHP(10)
	.setPower(20)
	.setCharges(0);
