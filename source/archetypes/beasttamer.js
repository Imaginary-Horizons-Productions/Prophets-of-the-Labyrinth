const { bold, italic } = require("discord.js");
const { ArchetypeTemplate } = require("../classes");
const { getPetMoveDescription } = require("../pets/_petDictionary");
const { listifyEN } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Beast Tamer",
	"They'll be able to predict what moves enemies and pets are using. They'll also be able to entice an ally's pet to act with their Carrot.",
	"Earth",
	{
		maxHPGrowth: 25,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: 1,
		poiseGrowth: 0
	},
	[],
	(embed, adventure) => {
		const moveLines = [];
		adventure.room.moves.forEach(({ userReference, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					if (name !== "Mirror Clone") {
						moveLines.push(`${bold(enemy.name)}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}`);
					} else {
						moveLines.push(`${bold(enemy.name)}: Mimic ${adventure.delvers[userReference.index].name}`);
					}
				}
			}
		})
		embed.addFields({ name: `Enemy Moves (Round ${adventure.room.round + 1})`, value: moveLines.join("\n") });
		const nextPetOwner = adventure.delvers[adventure.petRNs.delverIndex];
		const [moveName, moveDescription] = getPetMoveDescription(nextPetOwner.pet, adventure.petRNs.moveIndex);
		return embed.setDescription("Beast Tamer predictions:").addFields({ name: `Next Pet Move (Round ${2 + adventure.room.round - (adventure.room.round % 2)})`, value: `${nextPetOwner.name}'s ${nextPetOwner.pet.type} will use ${bold(moveName)}${adventure.petRNs.targetReferences.length > 0 ? ` on ${listifyEN(adventure.petRNs.targetReferences.map(reference => italic(adventure.getCombatant(reference).name)))}` : ""}\n${italic(moveDescription)}` });
	},
	(combatant) => {
		if (combatant.pet?.type) {
			return `Pet: ${combatant.pet.type}`;
		} else {
			return "";
		}
	}
);
