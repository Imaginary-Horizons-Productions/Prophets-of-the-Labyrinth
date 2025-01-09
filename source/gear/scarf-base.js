const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Scarf",
	[
		["Passive", "Increase your Crit Rate by 20%"]
	],
	"Trinket",
	"Unaligned",
	200,
	(targets, user, adventure) => []
).setUpgrades("Hearty Scarf", "Powerful Scarf", "Swift Scarf")
	.setCritRate(20)
	.setCharges(0);
