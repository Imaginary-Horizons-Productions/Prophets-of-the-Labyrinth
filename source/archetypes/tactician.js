const { ArchetypeTemplate, Adventure, Combatant } = require("../classes");
const { ICON_CRITICAL, ICON_CANCEL } = require("../constants");
const { modifiersToString } = require("../util/combatantUtil");

/**
 * @param {Combatant[]} team
 * @param {Adventure} adventure
 */
function generateCritAndModifierField(team, adventure) {
	return team.map(combatant => {
		const critText = `Critical: ${combatant.crit ? ICON_CRITICAL : ICON_CANCEL}\n`;
		const modifiersText = modifiersToString(combatant, adventure, critText.length);
		return { name: combatant.name, value: `${critText}${modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states"}`, inline: true };
	})
}

module.exports = new ArchetypeTemplate("Tactician",
	["Spellblade", "Historian", "Infiltrator", "Legionnaire"],
	"A Tactician can predict which combatants will score Criticals and what modifiers they have as well as the party's morale.",
	"Their Battle Standard increases party morale on a Critical.",
	"Light",
	[
		"Tactician tip 1",
		"Tactician tip 2",
		"Tactician tip 3"
	],
	(embed, adventure) => {
		embed.addFields(generateCritAndModifierField(adventure.room.enemies.filter(combatant => combatant.hp > 0), adventure));
		embed.addFields({ name: "Morale", value: `The party currently has ${adventure.room.morale} morale` });
		embed.addFields(generateCritAndModifierField(adventure.delvers, adventure));
		return embed.setDescription(`Tactician predictions for Round ${adventure.room.round + 1}:`);
	},
	(combatant) => {
		return `Critical: ${combatant.crit ? ICON_CRITICAL : ICON_CANCEL}`
	},
	{
		base: "Battle Standard",
		Legionnaire: "Flanking Battle Standard",
		Infiltrator: "Weakening Battle Standard",
		Spellblade: "Disenchanting Battle Standard",
		Historian: "Hastening Battle Standard"
	},
	["Encouragement"],
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 1,
		critRateGrowth: 0.5
	}
);
