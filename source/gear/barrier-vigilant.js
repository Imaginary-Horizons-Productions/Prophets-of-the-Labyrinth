const { GearTemplate } = require('../classes/index.js');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants.js');
const { addModifier, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Vigilant Barrier",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod1} x@{critMultiplier}"]
	],
	"Spell",
	"Wind",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], critMultiplier } = module.exports;
		const pendingVigilance = { ...vigilance };
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		if (user.crit) {
			pendingVigilance.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingVigilance).concat(addModifier([user], evasion))));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setSidegrades("Cleansing Barrier", "Devoted Barrier")
	.setModifiers({ name: "Evasion", stacks: 3 }, { name: "Vigilance", stacks: 2 })
	.setCharges(5)
	.setCooldown(0);
