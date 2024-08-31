const { ArchetypeTemplate } = require("../classes");
const { POTL_ICON_URL } = require("../constants");
const { getNames } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Hemomancer",
	"They'll be able to predict the order combatants will act in and assess HP levels. They'll also be able to redirect enemy attacks with Blood Aegis.",
	"Darkness",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Life Drain", "Blood Aegis"],
	(embed, adventure) => {
		const activeCombatants = adventure.room.enemies.filter(enemy => enemy.hp > 0)
			.concat(adventure.delvers)
			.sort((first, second) => {
				return second.getSpeed(true) - first.getSpeed(true);
			});
		const combatantNames = getNames(activeCombatants, adventure);
		activeCombatants.forEach((combatant, index) => {
			embed.addFields({ name: combatantNames[index], value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.protection ? `, ${combatant.protection} Protection` : ""}\nSpeed: ${combatant.getSpeed(true)}` });
		});
		return embed.setTitle(`Hemomancer Predictions for Round ${adventure.room.round + 1}`).setAuthor({ name: "Combatants may act out of order if they have priority or are tied in speed.", iconURL: POTL_ICON_URL });
	},
	(combatant) => {
		return `Speed: ${combatant.getSpeed(true)}`;
	}
);
