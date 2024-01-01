const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Chainmail",
	"Gain @{maxHP} Max HP",
	"N/A",
	"Trinket",
	"Untyped",
	200,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setDurability(0)
	.setSpeed(50);
