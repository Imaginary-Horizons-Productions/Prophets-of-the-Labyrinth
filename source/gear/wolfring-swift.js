const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	"Gain @{poise} Poise and @{speed} Speed",
	"N/A",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setDurability(0)
	.setPoise(2)
	.setSpeed(5);
