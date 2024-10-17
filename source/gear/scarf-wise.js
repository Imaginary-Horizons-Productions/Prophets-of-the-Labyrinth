const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Scarf",
	[
		["Passive", "Gain @{speed} Speed and 10% more stats from leveling-up"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Accurate Scarf", "Hearty Scarf")
	.setDurability(0)
	.setSpeed(5);
