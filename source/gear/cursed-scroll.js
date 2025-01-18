const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Scroll",
	[
		["Passive", "Can be upgraded into a random Maneuver"],
	],
	"Maneuver",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Tornado Formation", "Sandstorm Formation", "Steam Wall", "Bonfire Formation", "Reveal Flaw", "Fever Break");
