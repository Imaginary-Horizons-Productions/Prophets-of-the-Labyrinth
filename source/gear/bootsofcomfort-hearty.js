const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Boots of Comfort",
	[
		["Passive", "Increase your Speed by 20% and Max HP by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Boots of Comfort", "Powerful Boots of Comfort")
	.setMaxHP(10)
	.setSpeed(20)
	.setCharges(0);
