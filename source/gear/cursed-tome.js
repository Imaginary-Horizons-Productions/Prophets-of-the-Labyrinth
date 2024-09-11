const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Tome",
	[
		["Passive", "Reduce your Poise by @{poise}"]
	],
	"Pact",
	"Untyped",
	-50,
	(targets, user, isCrit, adventure) => ""
).setTargetingTags({ type: "none", team: "any", needsLivingTargets: false })
	.setUpgrades("Blood Aegis", "Certain Victory", "Infinite Regeneration", "Power from Wrath")
	.setDurability(0)
	.setPoise(-2);
