const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment], bonus } = module.exports;
		const pendingEmpowerment = { ...empowerment };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEmpowerment.stacks += bonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEmpowerment)));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setUpgrades("Guarding Inspiration", "Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Empowerment", stacks: 25 })
	.setBonus(25) // Empowerment stacks
	.setCharges(10);
