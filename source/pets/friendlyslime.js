const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate } = require("../classes");
const { rollablePotions } = require("../shared/potions");
const { addModifier } = require("../util/combatantUtil");

const petName = "Friendly Slime";
module.exports = new PetTemplate(petName, Colors.Aqua,
	[
		"Friendly Slime Tip 1",
		"Friendly Slime Tip 2",
		"Friendly Slime Tip 3"
	],
	[
		[
			new PetMoveTemplate("Toxin Spray", "Inflict @{mod0Stacks} @{mod0} on a random foe",
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const thisMove = module.exports.moves[0][0];
					return addModifier(targets, thisMove.modifiers[0]);
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Poison", stacks: 2 }),
			new PetMoveTemplate("Sticky Toxin Spray", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a random foe",
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const thisMove = module.exports.moves[0][1];
					const results = addModifier(targets, thisMove.modifiers[0]);
					return results.concat(addModifier(targets, thisMove.modifiers[1]))
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Poison", stacks: 2 }, { name: "Torpidity", stacks: 2 })
		],
		[
			new PetMoveTemplate("Amateur Alchemy", "Add a random Potion to loot 1/5 of the time", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					const [success, potionIndex] = petRNs.extras;
					if (success === 0) {
						const rolledPotion = rollablePotions[potionIndex];
						adventure.room.addResource(rolledPotion, "Item", "loot", 1);
						return [`${owner.name}'s ${petName} makes a ${rolledPotion} and adds it to loot!`]
					} else {
						return [`${owner.name}'s ${petName} fails to make a new potion.`]
					}
				}).setRnConfig([6, rollablePotions.length]),
			new PetMoveTemplate("Not-So-Amateur Alchemy", "Add a random Potion to loot 1/4 of the time", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					const [success, potionIndex] = petRNs.extras;
					if (success === 0) {
						const rolledPotion = rollablePotions[potionIndex];
						adventure.room.addResource(rolledPotion, "Item", "loot", 1);
						return [`${owner.name}'s ${petName} makes a ${rolledPotion} and adds it to loot!`]
					} else {
						return [`${owner.name}'s ${petName} fails to make a new potion.`]
					}
				}).setRnConfig([4, rollablePotions.length])
		]
	]
);
