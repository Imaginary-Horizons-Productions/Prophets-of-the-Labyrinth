const { GearTemplate } = require('../classes');
const { SURPASSING_VALUE } = require('../constants');

module.exports = new GearTemplate("Surpassing Wolf Ring",
	[
		["Passive", "Gain @{poise} Poise and increase your damage cap by @{bonus}"]
	],
	"Trinket",
	"Untyped",
	350,
	(targets, user, adventure) => []
).setSidegrades("Swift Wolf Ring", "Wise Wolf Ring")
	.setPoise(2)
	.setBonus(SURPASSING_VALUE)
	.setCharges(0);
