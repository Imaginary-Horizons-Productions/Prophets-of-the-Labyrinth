const { GearTemplate, GearFamily } = require('../classes/index.js');
const { addModifier, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

//#region Base
const base = new GearTemplate("Greed",
	[["use", "Add @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to all Treasure Elementals with priority"]],
	"Action",
	"Unaligned"
).setEffect(execute, { type: "all", team: "foe" })
	.setModifiers({ name: "Curse of Midas", stacks: 1 }, { name: "Empowerment", stacks: 20 });

/** @type {typeof base.effect} */
function execute(targets, user, adventure) {
	const [midas, empowerment] = base.modifiers;
	const affectedTargets = targets.filter(target => target.archetype === "Treasure Elemental");
	return generateModifierResultLines(combineModifierReceipts(addModifier(affectedTargets, empowerment).concat(addModifier(affectedTargets, midas))));
}
//#endregion Base

module.exports = new GearFamily(base, [], true);
