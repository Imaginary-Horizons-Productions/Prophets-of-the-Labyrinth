const { ArchetypeTemplate } = require("../classes");

module.exports = new ArchetypeTemplate("Legionnaire",
	"Able to predict the moves and targets of enemies, the Legionnaire excels at controlling the flow of combat.",
	"Fire",
	["Shortsword", "Scutum"],
	(embed, adventure) => {
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					const targetNames = targets.map(reference => adventure.getCombatant(reference).getName(adventure.room.enemyIdMap));
					if (name !== "@{clone}") {
						embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}(Targets: ${targetNames.length ? targetNames.join(", ") : "???"})\nRound ${adventure.room.round + 2}: ${enemy.nextAction}` });
					} else {
						embed.addFields({ name: enemy.getName(adventure.room.enemyIdMap), value: "Mirror Clones mimic your allies!" })
					}
				}
			}
		})
		return [true, embed];
	},
	(combatant) => {
		if (combatant.team === "delver") {
			return "Move in 2 rounds: Ask them";
		} else {
			return `Move in 2 rounds: ${combatant.nextAction}`;
		}
	}
);
