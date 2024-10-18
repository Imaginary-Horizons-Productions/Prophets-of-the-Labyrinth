const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP"]
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setUpgrades("Poised Chainmail", "Powerful Chainmail", "Wise Chainmail")
	.setDurability(0)
	.setMaxHP(50);
