const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	"Gain @{poise} Poise and @{speed} Speed",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Surpassing Wolf Ring")
	.setDurability(0)
	.setPoise(2)
	.setSpeed(5);
