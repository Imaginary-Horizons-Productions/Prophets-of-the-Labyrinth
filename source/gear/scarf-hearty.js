const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Scarf",
	[
		["Passive", "Increase your Crit Rate by 20% and Max HP by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Powerful Scarf", "Swift Scarf")
	.setMaxHP(10)
	.setCritRate(20)
	.setCharges(0);
