const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Blade",
	[
		["Passive", "Reduce your Max HP by @{maxHP*-1}"],
	],
	"Weapon",
	"Unaligned",
	-50,
	(targets, user, adventure) => []
).setUpgrades("Daggers", "Scythe", "Shortsword", "Spear")
	.setMaxHP(-50);
