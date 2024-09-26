const { ArchetypeTemplate } = require("../classes");
const { getCombatantWeaknesses, modifiersToString } = require("../util/combatantUtil");
const { getEmoji, getResistances } = require("../util/elementUtil");

module.exports = new ArchetypeTemplate("Detective",
	"They'll be able to assess combatant elemental affinities and modifiers. They'll also be able to induce weaknesses on foes with their Sabotage Kit.",
	"Untyped",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Pistol", "Sabotage Kit"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers);
		eligibleCombatants.forEach(combatant => {
			const weaknesses = getCombatantWeaknesses(combatant);
			const resistances = getResistances(combatant.element);
			const modifiersText = modifiersToString(combatant, adventure);
			embed.addFields({ name: `${combatant.name} ${getEmoji(combatant.element)}`, value: `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}\nResistances: ${resistances.map(resistance => getEmoji(resistance)).join(" ")}\n${modifiersText ? `${modifiersText}` : "No modifiers"}` });
		});
		return embed.setTitle(`Detective Predictions for Round ${adventure.room.round}`);
	},
	(combatant) => {
		const weaknesses = getCombatantWeaknesses(combatant);
		return `Weaknesses: ${weaknesses.map(weakness => getEmoji(weakness)).join(" ")}`;
	}
);
