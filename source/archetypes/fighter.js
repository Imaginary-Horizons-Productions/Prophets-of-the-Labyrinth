const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Fighter",
	"They won't be able to predict anything and won't start with fancy gear, but have double normal stat growths.",
	"Untyped",
	{
		maxHPGrowth: 50,
		powerGrowth: 5,
		speedGrowth: 1,
		critRateGrowth: 2,
		poiseGrowth: 0
	},
	["Strong Attack", "Second Wind"],
	(embed, adventure) => {
		let descriptions = [];
		descriptions.push(
			`I'm a fighter.`,
			`I don't have any fancy gear.`,
			`I have double stat growths!`,
			"¯\\_(ツ)\_/¯",
			`This delve into ${adventure.name} is exciting!`,
			`I *think* it's <t:${Math.floor(Date.now() / 1000)}:t>.`,
			`It's high noon... (<t:${Math.floor(new Date().setHours(12, 0, 0) / 1000)}:R>)`
		);
		if (adventure.delvers.length > 1) {
			descriptions.push(`I'm so happy to have my ${adventure.delvers.length - 1} good friends with me.`);
		}
		return embed.setTitle(`Fighter Predictions for Round ${adventure.room.round + 1}`)
			.setDescription(descriptions[Date.now() % descriptions.length]);
	},
	(combatant) => ""
);
