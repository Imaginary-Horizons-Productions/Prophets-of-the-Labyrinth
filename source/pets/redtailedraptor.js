const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate, CombatantReference } = require("../classes");
const { dealDamage, addModifier, generateModifierResultLines } = require("../util/combatantUtil");
const { getEmoji } = require("../util/elementUtil");

const petName = "Red-Tailed Raptor";
module.exports = new PetTemplate(petName, Colors.Red,
	[
		[
			new PetMoveTemplate("Rake", `Deal 15 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, petRNs) => {
					const { modifiers: [quicken] } = module.exports.moves[0][0];
					const resultLines = dealDamage(targets, owner, 15, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], quicken)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Quicken", stacks: 2 }),
			new PetMoveTemplate("Secret Maneuver: Rake of the Heavens", `Deal 25 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, petRNs) => {
					const { modifiers: [quicken] } = module.exports.moves[0][1];
					const resultLines = dealDamage(targets, owner, 25, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], quicken)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Quicken", stacks: 3 }),
		],
		[
			new PetMoveTemplate("Rake", `Deal 15 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, petRNs) => {
					const { modifiers: [quicken] } = module.exports.moves[1][0];
					const resultLines = dealDamage(targets, owner, 15, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], quicken)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Quicken", stacks: 2 }),
			new PetMoveTemplate("World-Cleaving Rake: The Forbidden Technique", `Deal 25 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, petRNs) => {
					const { modifiers: [quicken] } = module.exports.moves[1][1];
					const resultLines = dealDamage(targets, owner, 25, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], quicken)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Quicken", stacks: 3 }),
		]
	]
);
