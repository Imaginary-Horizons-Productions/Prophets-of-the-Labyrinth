const { ArchetypeTemplate } = require("../classes");
const { modifiersToString, getCombatantCounters } = require("../util/combatantUtil.js");
const { getEmoji } = require("../util/essenceUtil.js");

module.exports = new ArchetypeTemplate("Chemist",
	["Saboteur", "Researcher", "Poisoner", "Druid"],
	"A Chemist can assess combatant modifiers and which essence to use to counter them.",
	"They'll also be able to make items with their Cauldron Stir.",
	"Light",
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.concat(adventure.delvers).filter(combatant => combatant.hp > 0);
		eligibleCombatants.forEach(combatant => {
			const counters = getCombatantCounters(combatant);
			const counterText = `Counters: ${counters.map(counter => getEmoji(counter)).join(" ")}\n`;
			const modifiersText = modifiersToString(combatant, adventure, counterText.length);
			embed.addFields({ name: `${combatant.name} ${getEmoji(combatant.essence)}`, value: `${counterText}${modifiersText ? `${modifiersText}` : "No buffs, debuffs, or states"}` });
		})
		return embed.setDescription(`Chemist predictions for Round ${adventure.room.round}:`);
	},
	(combatant) => {
		const counters = getCombatantCounters(combatant);
		return `Counters: ${counters.map(counter => getEmoji(counter)).join(" ")}`;
	},
	{
		base: "Cauldron Stir",
		Poisoner: "Toxic Cauldron Stir",
		Druid: "Incompatible Cauldron Stir",
		Researcher: "Innovative Cauldron Stir",
		Saboteur: "Sabotaging Cauldron Stir"
	},
	["Medicine"],
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 1,
		critRateGrowth: 0.5
	}
);
