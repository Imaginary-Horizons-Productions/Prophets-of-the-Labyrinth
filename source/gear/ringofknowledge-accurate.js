const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Ring of Knowledge",
	[
		["Passive", "Increase your Crit Rate by 10% and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light",
	350,
	() => []
).setSidegrades("Swift Ring of Knowledge")
	.setCritRate(10);
