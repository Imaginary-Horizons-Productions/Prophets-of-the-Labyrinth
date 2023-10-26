const { ArchetypeTemplate } = require("../classes");
const { getCombatantWeaknesses } = require("../util/combatantUtil");
const { getEmoji, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Assassin",
	"They'll be able to predict which combatants will critically hit and assess combatant elemental affinities, lining up massive damage with thier Daggers.",
	"Wind",
	["Daggers", "Cloak"],
	(embed, adventure) => {
		adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
			const weaknesses = getCombatantWeaknesses(combatant);
			const resistances = getResistances(combatant.element);
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}` });
		});
		return embed.setTitle(`Assassin Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		const weaknesses = getCombatantWeaknesses(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
