const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_ALLY } = require('../constants');
const { changeStagger, generateModifierResultLines, combineModifierReceipts, addModifier } = require('../util/combatantUtil');

module.exports = new GearTemplate("Conjured Ice Pillar",
	[
		["use", "Gain @{mod0Stacks} @{mod0} and @{mod1Stacks} @{mod1}"],
		["Critical💥", "@{mod0} x @{critMultiplier}"]
	],
	"Spell",
	"Water",
	200,
	(targets, user, adventure) => {
		const { essence, modifiers: [evasion, vigilance], critMultiplier } = module.exports;
		if (user.essence === essence) {
			changeStagger([user], user, ESSENCE_MATCH_STAGGER_ALLY);
		}
		const pendingEvasion = { name: evasion.name, stacks: evasion.stacks.generator(user) };
		if (user.crit) {
			pendingEvasion.stacks *= critMultiplier;
		}
		return generateModifierResultLines(combineModifierReceipts(addModifier([user], pendingEvasion).concat(addModifier([user], vigilance))));
	}
).setTargetingTags({ type: "self", team: "ally" })
	.setUpgrades("Devoted Conjured Ice Pillar", "Taunting Conjured Ice Pillar")
	.setCharges(15)
	.setModifiers({ name: "Evasion", stacks: { description: "2 + Bonus HP / 50", generator: (user) => 2 + Math.floor(user.getBonusHP() / 50) } }, { name: "Vigilance", stacks: 1 });
