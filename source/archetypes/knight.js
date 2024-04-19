const { ArchetypeTemplate } = require("../classes");
const { getNames } = require("../util/combatantUtil");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Knight",
	"They'll be able to predict who enemies are targeting with which moves. They'll gain Power Up for protecting allies with their Buckler too.",
	"Earth",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	["Lance", "Buckler"],
	(embed, adventure) => {
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					const targetNames = getNames(targets.map(targetReference => adventure.getCombatant(targetReference)), adventure);
					if (name !== "@{clone}") {
						embed.addFields({ name: getNames([enemy], adventure, false)[0], value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}(Targets: ${listifyEN(targetNames, false) || "none"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}` });
					} else {
						embed.addFields({ name: getNames([enemy], adventure, false)[0], value: "Mirror Clones mimic your allies!" })
					}
				}
			}
		})
		return embed.setTitle(`Knight Predictions for Round ${adventure.room.round + 1}`);
	},
	(combatant) => {
		if (combatant.team === "delver") {
			return "Move in 2 rounds: Ask them";
		} else {
			return `Move in 2 rounds: ${combatant.nextAction}`;
		}
	}
);
