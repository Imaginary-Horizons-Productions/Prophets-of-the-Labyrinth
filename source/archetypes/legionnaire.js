const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Legionnaire",
	"They'll be able to predict who enemies are targeting with which moves. They'll be able to coodinate for big damage by inflicting Exposed on foes with their Shortsword.",
	"Fire",
	["Shortsword", "Scutum"],
	(embed, adventure) => {
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					const targetNames = [];
					targets.forEach(reference => {
						const combatant = adventure.getCombatant(reference);
						if (combatant) {
							targetNames.push(combatant.getName(adventure.room.enemyIdMap));
						}
					});
					if (name !== "@{clone}") {
						embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}(Targets: ${targetNames.length ? targetNames.join(", ") : "none"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}` });
					} else {
						embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: "Mirror Clones mimic your allies!" })
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
