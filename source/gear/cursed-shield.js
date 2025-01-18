const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Shield",
	[
		["Passive", "Reduces your Power by @{percentPower*-1}%, can upgrade into random Defense gear"],
	],
	"Defense",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Enchantment Siphon", "Smokescreen", "Buckler", "Cloak", "Parrying Dagger", "Spiked Shield")
	.setScalings({ percentPower: -5 });
