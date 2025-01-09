const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Blade",
	[
		["Passive", "Reduces your Max HP by @{maxHP*-1}%, can be upgraded into random Offense gear"],
	],
	"Offense",
	"Unaligned",
	-50,
	() => []
).setUpgrades("Greatsword", "Flail", "Net Launcher", "Longsword", "Battle Standard", "Warhammer")
	.setMaxHP(-5);
