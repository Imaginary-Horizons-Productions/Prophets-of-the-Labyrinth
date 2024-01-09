const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Fighter",
	"They won't be able to predict anything and won't start with fancy gear, but have double normal stat growths.",
	"Untyped",
	{
		maxHPGrowth: 50,
		powerGrowth: 10,
		speedGrowth: 1,
		critRateGrowth: 2,
		poiseGrowth: 0.5
	},
	["Strong Attack", "Second Wind"],
	(embed, adventure) => {
		return embed.setTitle(`Fighter Predictions for Round ${adventure.room.round + 1}`)
			.setDescription("¯\\_(ツ)_/¯");
	},
	(combatant) => ""
);
