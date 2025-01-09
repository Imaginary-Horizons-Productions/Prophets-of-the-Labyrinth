const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Ring of Knowledge",
	[
		["Passive", "Increase your Speed by 10% and gain 10% more stats from leveling-up"]
	],
	"Adventuring",
	"Light",
	350,
	() => []
).setSidegrades("Accurate Ring of Knowledge")
	.setSpeed(10);
