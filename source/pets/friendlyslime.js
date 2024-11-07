const { PetTemplate, PetMoveTemplate } = require("../classes");
const { selectRandomFoe, selectNone } = require("../shared/actionComponents");
const { rollablePotions } = require("../shared/potions");
const { addModifier, generateModifierResultLines, combineModifierReceipts } = require("../util/combatantUtil");

const petName = "Friendly Slime";
module.exports = new PetTemplate(petName,
	[
		[
			new PetMoveTemplate("Toxin Spray", "Inflict @{mod0Stacks} @{mod0} on a random foe", selectRandomFoe,
				(targets, owner, adventure) => {
					const thisMove = module.exports.moves[0][0];
					return generateModifierResultLines(addModifier(targets, thisMove.modifiers[0]));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Poison", stacks: 2 }),
			new PetMoveTemplate("Toxin Spray", "Inflict @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} on a random foe", selectRandomFoe,
				(targets, owner, adventure) => {
					const thisMove = module.exports.moves[0][1];
					const receipts = addModifier(targets, thisMove.modifiers[0]);
					receipts.push(...addModifier(targets, thisMove.modifiers[1]))
					return generateModifierResultLines(combineModifierReceipts(receipts));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Poison", stacks: 2 }, { name: "Slow", stacks: 2 })
		],
		[
			new PetMoveTemplate("Amateur Alchemy", "Add a random Potion to loot 1/5 of the time", selectNone,
				(targets, owner, adventure) => {
					const [_, success, potionIndex] = adventure.petRNs;
					if (success === 0) {
						const rolledPotion = rollablePotions[potionIndex];
						adventure.room.addResource(rolledPotion, "Item", "loot", 1);
						return [`${owner.name}'s ${petName} makes a ${rolledPotion} and adds it to loot!`]
					} else {
						return [`${owner.name}'s ${petName} fails to make a new potion.`]
					}
				}).setRnConfig([6, rollablePotions.length]),
			new PetMoveTemplate("Amateur Alchemy", "Add a random Potion to loot 1/4 of the time", selectNone,
				(targets, owner, adventure) => {
					const [_, success, potionIndex] = adventure.petRNs;
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
