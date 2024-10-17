const { ArchetypeTemplate } = require("../classes");
const { modifiersToString } = require("../util/combatantUtil.js");
const { generateTextBar } = require("../util/textUtil.js");

module.exports = new ArchetypeTemplate("Chemist",
	"They'll be able to assess combatant modifiers and HP levels. They'll also be able to make items with their Cauldron Stir.",
	"Water",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Cauldron Stir", "Medicine"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0);
		eligibleCombatants.forEach(combatant => {
			const modifiersText = modifiersToString(combatant, adventure);
			embed.addFields({ name: combatant.name, value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.protection ? `, ${combatant.protection} Protection` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return embed.setTitle(`Chemist Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		return `HP: ${combatant.hp}/${combatant.getMaxHP()}`;
	}
);
