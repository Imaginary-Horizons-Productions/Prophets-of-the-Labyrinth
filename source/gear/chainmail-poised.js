const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Poised Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and @{poise} Poise"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Powerful Chainmail", "Wise Chainmail")
	.setMaxHP(50)
	.setPoise(2)
	.setCharges(0);
