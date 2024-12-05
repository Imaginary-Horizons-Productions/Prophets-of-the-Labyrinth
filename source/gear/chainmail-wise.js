const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Wise Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and 10% more stats from leveling up"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Poised Chainmail", "Powerful Chainmail")
	.setMaxHP(50)
	.setCharges(0);
