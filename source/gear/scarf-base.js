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
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Accurate Scarf", "Hearty Scarf", "Wise Scarf")
	.setDurability(0)
	.setSpeed(5);
