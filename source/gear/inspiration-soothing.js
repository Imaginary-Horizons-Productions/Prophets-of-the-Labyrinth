const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Soothing Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1} to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment, regeneration], bonus } = module.exports;
		const pendingEmpowerment = { ...empowerment };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEmpowerment.stacks += bonus;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEmpowerment).concat(addModifier(targets, regeneration))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Guarding Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Empowerment", stacks: 25 }, { name: "Regeneration", stacks: 2 })
	.setBonus(25) // Empowerment stacks
	.setCharges(10)
	.setCooldown(0);
