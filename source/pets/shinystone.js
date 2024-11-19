const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate, CombatantReference } = require("../classes");
const { generateModifierResultLines, addModifier, changeStagger } = require("../util/combatantUtil");
const { joinAsStatement } = require("../util/textUtil");

const petName = "Shiny Stone";
module.exports = new PetTemplate(petName, Colors.LightGrey,
	[
		[
			new PetMoveTemplate("Eye-Catcher", "Inflict a random foe with @{mod0Stacks} @{mod0}",
				(owner, petRNs) => [new CombatantReference(owner.team === "delver" ? "enemy" : "delver", petRNs[1])],
				(targets, owner, adventure, petRNs) => {
					const [distracted] = module.exports.moves[0][0].modifiers;
					return generateModifierResultLines(addModifier(targets, distracted));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Distracted", stacks: 2 }),
			new PetMoveTemplate("Extra Eye-Catcher", "Inflict a random foe with @{mod0Stacks} @{mod0} and 1 Stagger",
				(owner, petRNs) => [new CombatantReference(owner.team === "delver" ? "enemy" : "delver", petRNs[1])],
				(targets, owner, adventure, petRNs) => {
					const [distracted] = module.exports.moves[0][1].modifiers;
					return generateModifierResultLines(addModifier(targets, distracted)).concat(joinAsStatement(false, targets.map(target => target.name), "is", "are", "Staggered."));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Distracted", stacks: 2 })
		],
		[
			new PetMoveTemplate("Sparkle", "Grant owner @{mod0Stacks} @{mod0}", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					const [oblivious] = module.exports.moves[1][0].modifiers;
					return generateModifierResultLines(addModifier([owner], oblivious));
				}).setModifiers({ name: "Oblivious", stacks: 1 }),
			new PetMoveTemplate("Sparkle Brilliantly", "Grant owner @{mod0Stacks} @{mod0} and relieve 1 Stagger", (owner, petRNs) => [],
				(targets, owner, adventure, petRNs) => {
					const [oblivious] = module.exports.moves[1][1].modifiers;
					const resultLines = generateModifierResultLines(addModifier([owner], oblivious));
					if (owner.stagger > 0) {
						changeStagger([owner], -1);
						resultLines.push(`${owner.name} is relieved of Stagger.`);
					}
					return resultLines;
				}).setModifiers({ name: "Oblivious", stacks: 1 })
		]
	]
);