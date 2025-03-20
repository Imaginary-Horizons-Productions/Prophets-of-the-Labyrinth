const { GearTemplate, GearFamily } = require('../classes');

const cursedBlade = new GearTemplate("Cursed Blade",
	[
		["Passive", "Reduces your Max HP by @{percentMaxHP*-1}%, can be upgraded into random Offense gear"],
	],
	"Offense",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Greatsword", "Flail", "Net Launcher", "Longsword", "Battle Standard", "Warhammer")
	.setScalings({ percentMaxHP: -5 });

module.exports = new GearFamily(cursedBlade, [], true);
