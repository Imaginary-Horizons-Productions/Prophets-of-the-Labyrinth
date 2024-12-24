const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, addProtection, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Guarding Inspiration",
	[
		["use", "Apply @{mod0Stacks} @{mod0} and @{protection} protection to an ally"],
		["Critical💥", "@{mod0} +@{bonus}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [empowerment], bonus, protection } = module.exports;
		const pendingEmpowerment = { ...empowerment };
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingEmpowerment.stacks += bonus;
		}
		addProtection(targets, protection);
		return [joinAsStatement(false, targets.map(target => target.name), "gains", "gain", "protection."), ...generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEmpowerment)))];
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Soothing Inspiration", "Sweeping Inspiration")
	.setModifiers({ name: "Empowerment", stacks: 25 })
	.setBonus(25) // Empowerment stacks
	.setProtection(25)
	.setCharges(10);
