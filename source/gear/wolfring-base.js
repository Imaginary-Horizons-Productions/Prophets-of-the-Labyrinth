const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wolf Ring",
	"Passive: Gain @{poise} Poise",
	"N/A",
	"Trinket",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Surpassing Wolf Ring", "Swift Wolf Ring", "Wise Wolf Ring")
	.setDurability(0)
	.setPoise(2);
