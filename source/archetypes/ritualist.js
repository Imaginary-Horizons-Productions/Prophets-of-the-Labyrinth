const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL } = require("../constants");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Ritualist",
	["Hemomancer", "Warlock", "Illusionist", "Reaper"],
	"A Ritualist can predict the order combatants will act in and assess HP levels.",
	"Their Life Drain will allow them to regain HP.",
	"Darkness",
	[
		"Ritualist tip 1",
		"Ritualist tip 2",
		"Ritualist tip 3"
	],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getSpeed(true) - first.getSpeed(true);
			});
		activeCombatants.forEach(combatant => {
			embed.addFields({ name: combatant.name, value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.protection ? `, ${combatant.protection} Protection` : ""}\nSpeed: ${combatant.getSpeed(true)}` });
		});
		return embed.setDescription(`Ritualist predictions for Round ${adventure.room.round + 1}:`).setAuthor({ name: "Combatants may act out of order if they have priority or are tied in speed.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		return `Speed: ${combatant.getSpeed(true)}`;
	},
	{
		base: "Life Drain",
		Warlock: "Furious Life Drain",
		Hemomancer: "Thirsting Life Drain",
		Illusionist: "Fatiguing Life Drain",
		Reaper: "Reaper's Life Drain"
	},
	["Blood Aegis"],
	{
		maxHPGrowth: 50,
		powerGrowth: 5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25
	}
);
