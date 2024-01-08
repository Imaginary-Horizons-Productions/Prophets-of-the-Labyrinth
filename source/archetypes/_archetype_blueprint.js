const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("name",
	"description",
	"Untyped",
	{
		maxHPGrowth: 25,
		powerGrowth: 5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0.25
	},
	[],
	(embed, adventure) => {

	},
	(combatant) => {

	}
);
