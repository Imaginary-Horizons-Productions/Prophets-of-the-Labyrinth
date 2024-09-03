const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Scarf",
	"Passive: Gain @{speed} Speed and @{maxHP} Max HP",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Accurate Scarf")
	.setDurability(0)
	.setSpeed(2)
	.setMaxHP(50);
