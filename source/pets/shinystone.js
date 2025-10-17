const { Colors } = require("discord.js");
const { PetTemplate, PetMoveTemplate } = require("../classes");
const { addModifier, changeStagger } = require("../util/combatantUtil");

const petName = "Shiny Stone";
module.exports = new PetTemplate(petName, Colors.LightGrey,
	[
		"Shiny Stone Tip 1",
		"Shiny Stone Tip 2",
		"Shiny Stone Tip 3"
	],
	[
		[
			new PetMoveTemplate("Eye-Catcher", "Inflict a random foe with @{mod0Stacks} @{mod0}",
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const [distraction] = module.exports.moves[0][0].modifiers;
					return addModifier(targets, distraction);
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Distraction", stacks: 2 }),
			new PetMoveTemplate("Extra Eye-Catcher", "Inflict a random foe with @{mod0Stacks} @{mod0} and 1 Stagger",
				(owner, petRNs) => petRNs.targetReferences,
				(targets, owner, adventure, { petRNs }) => {
					const [distraction] = module.exports.moves[0][1].modifiers;
					return addModifier(targets, distraction).concat(changeStagger(targets, null, 1));
				}).setRnConfig(["enemyIndex"])
				.setModifiers({ name: "Distraction", stacks: 2 })
		],
		[
			new PetMoveTemplate("Sparkle", "Grant owner @{mod0Stacks} @{mod0}", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					const [vigilance] = module.exports.moves[1][0].modifiers;
					return addModifier([owner], vigilance);
				}).setModifiers({ name: "Vigilance", stacks: 2 }),
			new PetMoveTemplate("Sparkle Brilliantly", "Grant owner @{mod0Stacks} @{mod0} and relieve 1 Stagger", (owner, petRNs) => [],
				(targets, owner, adventure, { petRNs }) => {
					const [vigilance] = module.exports.moves[1][1].modifiers;
					const results = addModifier([owner], vigilance);
					if (owner.stagger > 0) {
						changeStagger([owner], null, -1);
						results.push(`${owner.name} is relieved of Stagger.`);
					}
					return results;
				}).setModifiers({ name: "Vigilance", stacks: 2 })
		]
	]
);
