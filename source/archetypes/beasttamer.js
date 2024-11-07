const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Beast Tamer", //TODONOW finish
	"description",
	"Untyped",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Stick", "Carrot"],
	(embed, adventure) => {

	},
	(combatant) => {

	}
);
