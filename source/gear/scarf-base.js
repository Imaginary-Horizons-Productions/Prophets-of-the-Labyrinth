const { GearTemplate } = require('../classes');
const { swiftPassive } = require('./descriptions/passives');

module.exports = new GearTemplate("Scarf",
	[
		swiftPassive
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, adventure) => []
).setUpgrades("Accurate Scarf", "Hearty Scarf", "Wise Scarf")
	.setSpeed(5);
