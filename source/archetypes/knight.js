const { Archetype } = require("../classes");
// const { getTargetList } = require("../moveDAO.js");

module.exports = new Archetype("Knight",
	"Able to predict which allies enemies are targeting with which moves, the Knight excels at efficiently mitigating damage.",
	"Earth",
	["Lance", "Buckler"],
	(embed, adventure) => {
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					const targetNames = getTargetList(targets, adventure);
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
