const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Tome",
	[
		["Passive", "Reduce your Poise by @{poise}"]
	],
	"Pact",
	"Untyped",
	-50,
	(targets, user, adventure) => []
).setUpgrades("Blood Aegis", "Certain Victory", "Infinite Regeneration", "Power from Wrath", "Universal Solution", "Resource Transmuter")
	.setPoise(-2)
	.setCharges(0);
