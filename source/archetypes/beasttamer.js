const { bold, italic } = require("discord.js");
const { ArchetypeTemplate } = require("../classes");
const { getPetMoveDescription } = require("../pets/_petDictionary");
const { listifyEN, generateTextBar } = require("../util/textUtil");

module.exports = new ArchetypeTemplate("Beast Tamer",
	["Survivalist", "Marauder", "Hunter", "Wildkin"],
	"A Beast Tamer can predict what moves pets are using, what level the enemies are and how much HP they have.",
	"Their Stick inflicts @e{Impotence} on their target.",
	"Earth",
	[
		"Beast Tamer tip 1",
		"Beast Tamer tip 2",
		"Beast Tamer tip 3"
	],
	(embed, adventure) => {
		const nextPetOwner = adventure.delvers[adventure.petRNs.delverIndex];
		if (nextPetOwner.pet.type) {
			const [moveName, moveDescription] = getPetMoveDescription(nextPetOwner.pet, adventure.petRNs.moveIndex);
			embed.addFields({ name: `Next Pet Move (Round ${2 + adventure.room.round - (adventure.room.round % 2)})`, value: `${nextPetOwner.name}'s ${nextPetOwner.pet.type} will use ${bold(moveName)}${adventure.petRNs.targetReferences.length > 0 ? ` on ${listifyEN(adventure.petRNs.targetReferences.map(reference => italic(adventure.getCombatant(reference).name)))}` : ""}\n${italic(moveDescription)}` });
		}
		adventure.room.enemies.filter(enemy => enemy.hp > 0).forEach(combatant => {
			embed.addFields({ name: `${combatant.name} (Level: ${combatant.level})`, value: `${generateTextBar(combatant.hp, combatant.getMaxHP(), 16)} ${combatant.hp}/${combatant.getMaxHP()} HP${combatant.protection ? `, ${combatant.protection} Protection` : ""}` });
		})
		return embed.setDescription("Beast Tamer predictions:");
	},
	(combatant) => {
		if (combatant.pet?.type) {
			return `Pet: ${combatant.pet.type}`;
		} else {
			return `HP: ${combatant.hp}/${combatant.getMaxHP()}`;
		}
	},
	{
		base: "Stick",
		Hunter: "Hunter's Stick",
		Survivalist: "Convalescence Stick",
		Wildkin: "Flanking Stick",
		Marauder: "Thief's Stick"
	},
	["Carrot"],
	{
		maxHPGrowth: 50,
		powerGrowth: 2.5,
		speedGrowth: 0.5,
		critRateGrowth: .5
	}
);
