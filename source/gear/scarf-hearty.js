const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Hearty Scarf",
	[
		["Passive", "Gain @{speed} Speed and @{maxHP} Max HP"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Scarf", "Wise Scarf")
	.setSpeed(5)
	.setMaxHP(50)
	.setCharges(0);
