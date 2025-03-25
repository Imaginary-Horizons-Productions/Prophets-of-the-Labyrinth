const { GearTemplate, GearFamily } = require('../classes');

const cursedGrimore = new GearTemplate("Cursed Grimore",
	[
		["Passive", "Can be upgraded into a random Pact"],
	],
	"Pact",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Tempestuous Wrath", "Bounty Fist", "Universal Solution", "Overburn Explosion", "Forbidden Knowledge", "Blood Aegis");

module.exports = new GearFamily(cursedGrimore, [], true);
