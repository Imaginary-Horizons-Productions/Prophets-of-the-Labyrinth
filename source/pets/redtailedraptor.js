const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate } = require("../classes");
const { dealDamage, addModifier, generateModifierResultLines } = require("../util/combatantUtil");
const { getEmoji } = require("../util/essenceUtil");

const petName = "Red-Tailed Raptor";
module.exports = new PetTemplate(petName, Colors.Red,
	[
		[
			new PetMoveTemplate("Rake", `Deal 15 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const { modifiers: [swiftness] } = module.exports.moves[0][0];
					const { resultLines } = dealDamage(targets, owner, 15, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], swiftness)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Swiftness", stacks: 2 }),
			new PetMoveTemplate("Secret Maneuver: Rake of the Heavens", `Deal 25 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const { modifiers: [swiftness] } = module.exports.moves[0][1];
					const { resultLines } = dealDamage(targets, owner, 25, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], swiftness)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Swiftness", stacks: 3 }),
		],
		[
			new PetMoveTemplate("Rake", `Deal 15 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const { modifiers: [swiftness] } = module.exports.moves[1][0];
					const { resultLines } = dealDamage(targets, owner, 15, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], swiftness)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Swiftness", stacks: 2 }),
			new PetMoveTemplate("World-Cleaving Rake: The Forbidden Technique", `Deal 25 ${getEmoji("Wind")} to a random foe and grant its owner @{mod0Stacks} @{mod0}`,
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const { modifiers: [swiftness] } = module.exports.moves[1][1];
					const { resultLines } = dealDamage(targets, owner, 25, false, "Wind", adventure);
					return resultLines.concat(generateModifierResultLines(addModifier([owner], swiftness)));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Swiftness", stacks: 3 }),
		]
	]
);
