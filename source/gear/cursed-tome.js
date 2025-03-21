const { GearTemplate, GearFamily } = require('../classes');

const cursedTome = new GearTemplate("Cursed Tome",
	[
		["Passive", "Can be upgraded into a random Spell"],
	],
	"Spell",
	"Unaligned"
).setCost(-50)
	.setUpgrades("Vacuum Implosion", "Wind Burst", "Medicine", "Nature's Caprice", "Conjured Ice Pillar", "Water's Stillness", "Heat Weaken", "Flame Scythes", "Encouragement", "Illumination", "Vengeful Void", "Shadow of Confusion");

module.exports = new GearFamily(cursedTome, [], true);
