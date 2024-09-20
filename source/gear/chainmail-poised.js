const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Poised Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and @{poise} Poise"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Powerful Chainmail", "Wise Chainmail")
	.setDurability(0)
	.setMaxHP(50)
	.setPoise(2);
