const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("name",
	["specialization1", "specialization2", "specialization3", "specialization4"],
	"description",
	"essence",
	(embed, adventure) => { // predict

	},
	(combatant) => { // mini-predict

	},
	{
		base: {
			name: "",
			description: "",
			effect: (targets, user, adventure) => {
				return [];
			}
		}
	},
	["starting gear"],
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	}
);
