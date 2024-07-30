const { ArchetypeTemplate } = require("../classes");
const { getModifierEmoji } = require("../modifiers/_modifierDictionary");
const { getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Legionnaire",
	`They'll be able to predict who enemies are targeting and which combatants will score Critical Hits. They'll be able to coodinate for big damage by inflicting ${getModifierEmoji("Exposed")} on foes with their Shortsword.`,
	"Fire",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Shortsword", "Scutum"],
	(embed, adventure) => {
		const eligibleCombatants = adventure.room.enemies.filter(combatant => combatant.hp > 0).concat(adventure.delvers);
		const combatantNames = getNames(eligibleCombatants, adventure);
		eligibleCombatants.forEach((combatant, index) => {
			const individualIndex = adventure.getCombatantIndex(combatant);
			const move = adventure.room.moves.find(move => move.userReference.team === combatant.team && move.userReference.index === individualIndex);
			let targetNames = null;
			if (move) {
				targetNames = getNames(move.targets.map(targetReference => adventure.getCombatant(targetReference)), adventure);
			}
			embed.addFields({ name: combatantNames[index], value: `Targets: ${targetNames === null ? "undecided" : (listifyEN(targetNames, false) || "none")}\nCritical Hit: ${combatant.crit ? "💥" : "🚫"}` });
		})
		return embed.setTitle(`Legionnaire Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		return `Critical Hit: ${combatant.crit ? "💥" : "🚫"}`
	}
);
