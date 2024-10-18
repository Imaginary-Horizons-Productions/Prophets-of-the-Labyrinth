const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise and @{speed} Speed"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Surpassing Wolf Ring", "Wise Wolf Ring")
	.setDurability(0)
	.setPoise(2)
	.setSpeed(5);
