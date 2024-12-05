const { GearTemplate } = require('../classes');

module.exports = new GearTemplate("Powerful Chainmail",
	[
		["Passive", "Gain @{maxHP} Max HP and @{power} Power"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Poised Chainmail", "Wise Chainmail")
	.setMaxHP(50)
	.setPower(15)
	.setCharges(0);
