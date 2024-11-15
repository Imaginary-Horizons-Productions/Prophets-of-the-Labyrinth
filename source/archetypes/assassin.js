const { ArchetypeTemplate, Combatant } = require("../classes");
const { ZERO_WIDTH_WHITESPACE } = require("../constants");
const { getCombatantWeaknesses } = require("../util/combatantUtil");
const { getEmoji, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Assassin",
	"They'll be able to predict which combatants will critically hit and assess combatant elemental affinities, lining up massive damage with their Daggers.",
	"Wind",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Daggers", "Cloak"],
	(embed, adventure) => {
		/** @param {Combatant} combatant */
		function createElementAndCritField(combatant) {
			const weaknesses = getCombatantWeaknesses(combatant);
			const resistances = getResistances(combatant.element);
			embed.addFields({ name: `${combatant.name} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}`, inline: true });
		}
		// Separate Enemies and Delvers into different rows
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(createElementAndCritField);
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(createElementAndCritField);
		return embed.setDescription(`Assassin predictions for Round ${adventure.room.round}:`);
	},
	(combatant) => {
		const weaknesses = getCombatantWeaknesses(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
