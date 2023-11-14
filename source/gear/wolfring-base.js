const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wolf Ring",
	"Gain @{poise} Poise",
	"N/A",
	"Trinket",
	"Water",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Swift Wolf Ring")
	.setDurability(0)
	.setPoise(2);
