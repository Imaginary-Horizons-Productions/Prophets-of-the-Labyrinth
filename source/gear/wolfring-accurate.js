const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Accurate Wolf Ring",
	[
		["Passive", "Increase your Max HP by 20% and your Crit Rate by 10%"]
	],
	"Trinket",
	"Unaligned",
	350,
	(targets, user, adventure) => []
).setSidegrades("Powerful Wolf Ring", "Swift Wolf Ring")
	.setMaxHP(20)
	.setCritRate(10)
	.setCharges(0);
