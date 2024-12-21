const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Boots of Comfort",
	[
		["Passive", "Increase your Speed by 20%"]
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, adventure) => []
).setUpgrades("Accurate Boots of Comfort", "Hearty Boots of Comfort", "Powerful Boots of Comfort")
	.setSpeed(20)
	.setCharges(0);
