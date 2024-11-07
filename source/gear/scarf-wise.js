const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Scarf",
	[
		["Passive", "Gain @{speed} Speed and 10% more stats from leveling-up"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Scarf", "Hearty Scarf")
	.setSpeed(5);
