const { ArchetypeTemplate } = require("../classes");
const { getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Legionnaire",
	"They'll be able to predict who enemies are targeting with which moves. They'll be able to coodinate for big damage by inflicting Exposed on foes with their Shortsword.",
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
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					const targetNames = getNames(targets.map(targetReference => adventure.getCombatant(targetReference)), adventure);
					if (name !== "@{clone}") {
						embed.addFields({ name: getNames([enemy], adventure, false), value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}(Targets: ${listifyEN(targetNames, false) || "none"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}` });
					} else {
						embed.addFields({ name: getNames([enemy], adventure, false), value: "Mirror Clones mimic your allies!" })
					}
				}
			}
		})
		return embed.setTitle(`Legionnaire Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		if (combatant.team === "delver") {
			return "Move in 2 rounds: Ask them";
		} else {
			return `Move in 2 rounds: ${combatant.nextAction}`;
		}
	}
);
