const { GearTemplate, GearFamily } = require('../classes');

const cursedDoll = new GearTemplate("Cursed Doll",
	[
		["Passive", "Reduces your Crit Rate by @{percentCritRate*-1}%, can be upgraded into random Support gear"],
	],
	"Support",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Arcane Sledge", "Carrot", "Medic's Kit", "Elemental Scroll", "Midas Staff", "War Cry")
	.setScalings({ percentCritRate: -5 });

module.exports = new GearFamily(cursedDoll, [], true);
