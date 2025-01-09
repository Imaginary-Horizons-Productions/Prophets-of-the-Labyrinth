const { GearTemplate } = require('../classes/index.js');
const { addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Greed",
	[["use", "Add @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to all Treasure Elementals with priority"]],
	"Action",
	"Unaligned",
	0,
	(targets, user, adventure) => {
		const { modifiers: [midas, empowerment] } = module.exports;
		const affectedTargets = targets.filter(target => target.archetype === "Treasure Elemental");
		return generateModifierResultLines(combineModifierReceipts(addModifier(affectedTargets, empowerment).concat(addModifier(affectedTargets, midas))));
	}
).setTargetingTags({ type: "all", team: "foe" })
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Empowerment", stacks: 20 });
