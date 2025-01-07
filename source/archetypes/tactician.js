const { ArchetypeTemplate, Adventure, Combatant } = require("../classes");
const { modifiersToString } = require("../util/combatantUtil");

/**
 * @param {Combatant[]} team
 * @param {Adventure} adventure
 */
function generateCritAndModifierField(team, adventure) {
	return team.map(combatant => {
		const modifiersText = modifiersToString(combatant, adventure);
		return { name: combatant.name, value: `Critical Hit: ${combatant.crit ? "💥" : "🚫"}\n${modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states"}` };
	})
}

module.exports = new ArchetypeTemplate("Tactician",
	["Spellblade", "Historian", "Infiltrator", "Legionnaire"],
	"They'll be able to predict which combatants will score Critical Hits and what modifiers they have as well as the party's morale. Their Spear increases party morale on a Critical Hit.",
	"Light",
	(embed, adventure) => {
		embed.addFields(generateCritAndModifierField(adventure.room.enemies.filter(combatant => combatant.hp > 0), adventure));
		embed.addFields({ name: "Morale", value: `The party currently has ${adventure.room.morale} morale` });
		embed.addFields(generateCritAndModifierField(adventure.delvers, adventure));
		return embed.setDescription(`Tactician predictions for Round ${adventure.room.round + 1}:`);
	},
	(combatant) => {
		return `Critical Hit: ${combatant.crit ? "💥" : "🚫"}`
	},
	{
		base: "Spear",
		Legionnaire: "Flanking Spear",
		Infiltrator: "Weakening Spear",
		Spellblade: "Disenchanting Spear",
		Historian: "Hastening Spear"
	},
	["Encouragement"],
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 1,
		critRateGrowth: 0.5
	}
);
