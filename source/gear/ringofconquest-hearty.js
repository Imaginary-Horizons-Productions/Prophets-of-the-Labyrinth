const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Ring of Conquest",
	[
		["Passive", "Increase your Max HP by @{percentMaxHP}% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness"
).setCost(350)
	.setSidegrades("Powerful Ring of Conquest")
	.setScalings({ percentMaxHP: 10 });
