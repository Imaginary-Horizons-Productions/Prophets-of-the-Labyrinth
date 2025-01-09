const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Ring of Conquest",
	[
		["Passive", "Increase your Power by 10% and damage cap by 60."]
	],
	"Adventuring",
	"Darkness",
	350,
	() => []
).setSidegrades("Hearty Ring of Conquest")
	.setPower(10);
