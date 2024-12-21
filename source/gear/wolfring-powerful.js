const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Wolf Ring",
	[
		["Passive", "Increase your Max HP by 20% and your Power by 10%"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Accurate Wolf Ring", "Swift Wolf Ring")
	.setMaxHP(20)
	.setPower(10)
	.setCharges(0);
