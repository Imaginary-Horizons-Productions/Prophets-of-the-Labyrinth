const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Chainmail",
	"Passive: Gain @{maxHP} Max HP",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Wise Chainmail")
	.setDurability(0)
	.setMaxHP(50)
	.setPower(15);
