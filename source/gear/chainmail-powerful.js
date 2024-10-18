const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and @{power} Power"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Poised Chainmail", "Wise Chainmail")
	.setDurability(0)
	.setMaxHP(50)
	.setPower(15);
