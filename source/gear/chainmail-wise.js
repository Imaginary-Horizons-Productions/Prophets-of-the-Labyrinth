const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Chainmail",
	"Gain @{maxHP} Max HP. Gain 10% more stats from leveling up.",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setDurability(0)
	.setMaxHP(50);
