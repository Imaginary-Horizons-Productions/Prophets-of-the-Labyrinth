const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Ring of Conquest",
	[
		["Passive", "Increase your Max HP by 10% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
	350,
	() => []
).setSidegrades("Powerful Ring of Conquest")
	.setMaxHP(10);
