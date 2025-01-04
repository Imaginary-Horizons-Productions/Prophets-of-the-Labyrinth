const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Bag",
	[
		["Passive", "Reduces your Speed by @{speed*-1}%, can be upgraded into random Adventuring gear"],
	],
	"Adventuring",
	"Unaligned",
	-50,
	() => []
).setUpgrades("Lightning Staff", "Herb Basket", "Wave Crash", "Musket", "Ring of Knowledge", "Ring of Conquest")
	.setSpeed(-5);
