const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wolf Ring",
	[
		["Passive", "Increase your Max HP by 20%"]
	],
	"Trinket",
	"Unaligned",
	200,
	(targets, user, adventure) => []
).setUpgrades("Accurate Wolf Ring", "Powerful Wolf Ring", "Swift Wolf Ring")
	.setMaxHP(20)
	.setCharges(0);
