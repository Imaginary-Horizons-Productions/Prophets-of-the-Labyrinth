const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Devoted Conjured Ice Pillar",
	[
		["use", "Grant an ally @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.generator(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier(targets, pendingEvasion).concat(addModifier(targets, vigilance))));
	}
).setTargetingTags({ type: "single", team: "ally" })
	.setSidegrades("Taunting Conjured Ice Pillar")
	.setCharges(15)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + Bonus HP / 50", generator: (user) => 2 + Math.floor(user.getBonusHP() / 50) } }, { name: "Vigilance", stacks: 1 });
