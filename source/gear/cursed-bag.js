const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Cursed Bag",
	[
		["Passive", "Reduces your Speed by @{percentSpeed*-1}%, can be upgraded into random Adventuring gear"],
	],
	"Adventuring",
	"Unaligned",
).setCost(-50)
	.setUpgrades("Lightning Staff", "Herb Basket", "Wave Crash", "Musket", "Ring of Knowledge", "Ring of Conquest")
	.setScalings({ percentSpeed: -5 });
