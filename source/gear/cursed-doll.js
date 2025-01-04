const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Doll",
	[
		["Passive", "Reduces your Crit Rate by @{critRate*-1}%, can be upgraded into random Support gear"],
	],
	"Support",
	"Unaligned",
	-50,
	() => []
).setUpgrades("Arcane Sledge", "Carrot", "Medic's Kit", "Elemental Scroll", "Midas Staff", "War Cry")
	.setCritRate(-5);
