const { ArchetypeTemplate } = require("../classes");
const { getEmoji, getWeaknesses, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Assassin",
	"Able to predict which combatants will critically hit and assess combatant elemental affinities, the Assassin excels at dealing great amounts of damage.",
	"Wind",
	["Daggers", "Cloak"],
	(embed, adventure) => {
		adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers).forEach(combatant => {
			const weaknesses = getWeaknesses(combatant.element);
			const resistances = getResistances(combatant.element);
			embed.addFields({ name: `${combatant.getName(adventure.room.enemyIdMap)} ${getEmoji(combatant.element)}`, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\nWeakness: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistance: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}` });
		});
		return [false, embed]
	},
	(combatant) => {
		const weaknesses = getWeaknesses(combatant.element);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
