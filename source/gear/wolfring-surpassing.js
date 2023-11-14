const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Surpassing Wolf Ring",
	"Gain @{poise} Poise, your attacks aren't subject to the damage cap", //TODONOW add limit break effect
	"N/A",
	"Trinket",
	"Water",
	350,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ target: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Swift Wolf Ring")
	.setDurability(0)
	.setPoise(2);
