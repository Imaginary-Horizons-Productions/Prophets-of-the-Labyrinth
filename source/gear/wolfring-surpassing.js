const { GearTemplate } = require('../classes');
const { SURPASSING_VALUE } = require('../constants');

module.exports = new GearTemplate("Surpassing Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise and increase your damage cap by @{bonus}"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setTargetingTags({ type: "none", team: "none", needsLivingTargets: false })
	.setSidegrades("Swift Wolf Ring", "Wise Wolf Ring")
	.setDurability(0)
	.setPoise(2)
	.setBonus(SURPASSING_VALUE);
