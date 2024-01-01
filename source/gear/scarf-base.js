const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Scarf",
	"Gain @{speed} Speed",
	"N/A",
	"Trinket",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Hearty Scarf")
	.setDurability(0)
	.setSpeed(2);
