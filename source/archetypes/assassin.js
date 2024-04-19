const { ArchetypeTemplate } = require("../classes");
const { getCombatantWeaknesses, getNames } = require("../util/combatantUtil");
const { getEmoji, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Assassin",
	"They'll be able to predict which combatants will critically hit and assess combatant elemental affinities, lining up massive damage with thier Daggers.",
	"Wind",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Daggers", "Cloak"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers)
		const combatantNames = getNames(eligibleCombatants, adventure);
		eligibleCombatants.forEach((combatant, index) => {
			const weaknesses = getCombatantWeaknesses(combatant);
			const resistances = getResistances(combatant.element);
			embed.addFields({ name: `${combatantNames[index]} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}` });
		});
		return embed.setTitle(`Assassin Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		const weaknesses = getCombatantWeaknesses(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
