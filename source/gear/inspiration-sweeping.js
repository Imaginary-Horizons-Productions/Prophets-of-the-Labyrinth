const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Sweeping Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to all allies"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment], bonus } = module.exports;
		const pendingEmpowerment = { ...empowerment };
		if (user.crit) {
			pendingEmpowerment.stacks += bonus;
		}
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEmpowerment)));
	}
).setTargetingTags({ type: "all", team: "ally" })
	.setSidegrades("Guarding Inspiration", "Soothing Inspiration")
	.setModifiers({ name: "Empowerment", stacks: 25 })
	.setBonus(25) // Empowerment stacks
	.setCharges(10);
