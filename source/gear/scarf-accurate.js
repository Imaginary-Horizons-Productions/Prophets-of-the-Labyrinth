const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Scarf",
	"Passive: Gain @{speed} Speed and @{critRate} Crit Rate",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Hearty Scarf", "Wise Scarf")
	.setDurability(0)
	.setSpeed(5)
	.setCritRate(5);
