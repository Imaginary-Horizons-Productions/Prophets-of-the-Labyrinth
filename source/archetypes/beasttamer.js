const { bold, italic } = require("discord.js");
const { ArchetypeTemplate } = require("../classes");
const { getPlayer } = require("../orcustrators/playerOrcustrator");
const { getPetMoveDescription } = require("../pets/_petDictionary");

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
	["Stick", "Carrot"],
	(embed, adventure) => {
		adventure.room.moves.forEach(({ userReference, targets, name, priority }) => {
			if (userReference.team === "enemy") {
				const enemy = adventure.getCombatant(userReference);
				if (enemy.hp > 0) {
					if (name !== "@{clone}") {
						embed.addFields({ name: enemy.name, value: `Round ${adventure.room.round + 1}: ${name} ${priority != 0 ? "(Priority: " + priority + ") " : ""}` });
					} else {
						embed.addFields({ name: enemy.name, value: "Mirror Clones mimic your allies!" })
					}
				}
			}
		})
		const nextPetOwner = adventure.delvers[adventure.nextPet];
		const ownerPlayer = getPlayer(nextPetOwner.id, adventure.guildId);
		const [moveName, moveDescription] = getPetMoveDescription(nextPetOwner.pet, adventure.petRNs[0], ownerPlayer.pets[nextPetOwner.pet]);
		return embed.setTitle(`Beast Tamer Predictions for Round ${adventure.room.round + 1}`).addFields({ name: `Next Pet Move (Round: ${adventure.room.round === 0 ? 2 : adventure.room.round + (adventure.room.round % 2)})`, value: `${nextPetOwner.name}'s ${nextPetOwner.pet} will use ${bold(moveName)}\n${italic(moveDescription)}` });
	},
	(combatant) => {
		if (combatant.pet) {
			return combatant.pet;
		} else {
			return "";
		}
	}
);
