const { ArchetypeTemplate } = require("../classes");
const { ZERO_WIDTH_WHITESPACE } = require("../constants");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Legionnaire",
	`They'll be able to predict who enemies are targeting and which combatants will score Critical Hits. They'll be able to coodinate for big damage by inflicting @e{Exposed} on foes with their Shortsword.`,
	"Fire",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 0.25,
		poiseGrowth: 0
	},
	["Shortsword", "Scutum"],
	(embed, adventure) => {
		adventure.room.enemies.filter(combatant => combatant.hp > 0).forEach(combatant => {
			const individualIndex = adventure.getCombatantIndex(combatant);
			const move = adventure.room.findCombatantMove({ index: individualIndex, team: combatant.team });
			embed.addFields({ name: combatant.name, value: `Targets: ${listifyEN(move.targets.map(targetReference => adventure.getCombatant(targetReference).name), false) || "none"}\nCritical Hit: ${combatant.crit ? "💥" : "🚫"}`, inline: true });
		});
		embed.addFields({ name: ZERO_WIDTH_WHITESPACE, value: ZERO_WIDTH_WHITESPACE });
		adventure.delvers.forEach(combatant => {
			const individualIndex = adventure.getCombatantIndex(combatant);
			const move = adventure.room.findCombatantMove({ index: individualIndex, team: combatant.team });
			let targetNames = null;
			if (move) {
				targetNames = move.targets.map(targetReference => adventure.getCombatant(targetReference).name);
			}
			embed.addFields({ name: combatant.name, value: `Targets: ${targetNames === null ? "undecided" : (listifyEN(targetNames, false) || "none")}\nCritical Hit: ${combatant.crit ? "💥" : "🚫"}`, inline: true });
		});
		return embed.setDescription(`Legionnaire predictions for Round ${adventure.room.round + 1}:`);
	},
	(combatant) => {
		return `Critical Hit: ${combatant.crit ? "💥" : "🚫"}`
	}
);
