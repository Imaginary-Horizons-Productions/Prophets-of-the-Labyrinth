const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP"]
	],
	"Trinket",
	"Untyped",
	200,
	(targets, user, adventure) => []
).setUpgrades("Poised Chainmail", "Powerful Chainmail", "Wise Chainmail")
	.setMaxHP(50)
	.setCharges(0);
