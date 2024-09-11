const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Scarf",
	[
		["Passive", "Gain @{speed} Speed"]
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Accurate Scarf", "Hearty Scarf", "Wise Scarf")
	.setDurability(0)
	.setSpeed(5);
