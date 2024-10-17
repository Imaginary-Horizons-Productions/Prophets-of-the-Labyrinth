const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and 10% more stats from leveling up"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, isCrit, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Poised Chainmail", "Powerful Chainmail")
	.setDurability(0)
	.setMaxHP(50);
