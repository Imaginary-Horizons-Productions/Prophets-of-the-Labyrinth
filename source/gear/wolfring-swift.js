const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Swift Wolf Ring",
	[
		["Passive", "Increase your Max HP by 20% and Speed by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Wolf Ring", "Powerful Wolf Ring")
	.setMaxHP(20)
	.setSpeed(10)
	.setCharges(0);
