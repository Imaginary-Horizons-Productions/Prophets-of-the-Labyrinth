const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Shield",
	[
		["Passive", "Reduces your Power by @{power*-1}%, can upgrade into random Defense gear"],
	],
	"Defense",
	"Unaligned",
	-50,
	() => []
).setUpgrades("Enchantment Siphon", "Smokescreen", "Buckler", "Cloak", "Parrying Dagger", "Spiked Shield")
	.setPower(-5);
