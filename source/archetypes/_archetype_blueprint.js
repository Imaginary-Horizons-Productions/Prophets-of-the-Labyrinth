const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("name",
	"description",
	"essence",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	[],
	(embed, adventure) => {

	},
	(combatant) => {

	}
);
