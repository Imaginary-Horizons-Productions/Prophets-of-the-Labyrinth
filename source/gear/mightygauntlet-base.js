const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Mighty Gauntlet",
	[
		["Passive", "Increase your Power by 20%"]
	],
	"Trinket",
	"Unaligned",
	200,
	(targets, user, adventure) => []
).setUpgrades("Accurate Mighty Gauntlet", "Hearty Mighty Gauntlet", "Powerful Mighty Gauntlet")
	.setPower(20)
	.setCharges(0);
