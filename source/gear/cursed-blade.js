const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Blade",
	[
		["Passive", "Reduces your Max HP by @{percentMaxHP*-1}%, can be upgraded into random Offense gear"],
	],
	"Offense",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Greatsword", "Flail", "Net Launcher", "Longsword", "Battle Standard", "Warhammer")
	.setScalings({ percentMaxHP: -5 });
