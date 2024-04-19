const { ArchetypeTemplate } = require("../classes");
const { isDebuff } = require("../modifiers/_modifierDictionary");
const { modifiersToString, getNames } = require("../util/combatantUtil");
const { generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Ritualist",
	"They'll be able to assess combatant modifiers and hp levels. They'll also be able to inflict great harm on foes suffering debuffs with their Censer.",
	"Fire",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Censer", "Corrosion"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0)
		const combatantNames = getNames(eligibleCombatants, adventure);
		eligibleCombatants.forEach((combatant, index) => {
			const modifiersText = modifiersToString(combatant, adventure);
			embed.addFields({ name: combatantNames[index], value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.protection ? `, ${combatant.protection} Protection` : ""}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		})
		return embed.setTitle(`Ritualist Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		return `Has Debuffs: ${Object.keys(combatant.modifiers).some(modifier => isDebuff(modifier)) ? "✅" : "🚫"}`;
	}
);
