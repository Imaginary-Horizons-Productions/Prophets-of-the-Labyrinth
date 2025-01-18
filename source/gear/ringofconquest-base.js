const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Ring of Conquest",
	[
		["Passive", "Increase your damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
).setCost(200)
	.setUpgrades("Hearty Ring of Conquest", "Powerful Ring of Conquest");
