const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Scarf",
	"Gain @{speed} Speed and @{maxHP} Max HP",
	"N/A",
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setDurability(0)
	.setSpeed(2)
	.setMaxHP(50);
