const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Chainmail",
	"Passive: Gain @{maxHP} Max HP",
	"N/A",
	"Trinket",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Powerful Chainmail", "Wise Chainmail")
	.setDurability(0)
	.setMaxHP(50);
