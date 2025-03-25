const { GearTemplate, GearFamily } = require('../classes');

const cursedScroll = new GearTemplate("Cursed Scroll",
	[
		["Passive", "Can be upgraded into a random Maneuver"],
	],
	"Maneuver",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Tornado Formation", "Sandstorm Formation", "Steam Wall", "Bonfire Formation", "Reveal Flaw", "Fever Break");

module.exports = new GearFamily(cursedScroll, [], true);
