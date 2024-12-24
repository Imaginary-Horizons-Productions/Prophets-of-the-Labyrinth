const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Fighter",
	"They won't be able to predict anything and won't start with fancy gear, but have double normal stat growths.",
	"Unaligned",
	{
		maxHPGrowth: 50,
		powerGrowth: 5,
		speedGrowth: 1,
		critRateGrowth: 0.5,
		poiseGrowth: 0
	},
	["Strong Attack", "Second Wind"],
	(embed, adventure) => {
		const descriptions = [
			`I'm a fighter.`,
			`I don't have any fancy gear.`,
			`I have double stat growths!`,
			"¯\\_(ツ)\_/¯",
			`This delve into ${adventure.name} is exciting!`,
			`I *think* it's <t:${Math.floor(Date.now() / 1000)}:t>.`,
			`It's high noon... (<t:${Math.floor(new Date().setHours(12, 0, 0) / 1000)}:R> for the server)`,
			"There's supposed to be predictions here."
		];
		if (adventure.delvers.length > 1) {
			descriptions.push(`I'm so happy to have my ${adventure.delvers.length - 1} good friends with me.`);
		}
		return embed.setDescription(`Fighter predictions for Round ${adventure.room.round + 1}:\n${descriptions[Date.now() % descriptions.length]}`);
	},
	(combatant) => ""
);
