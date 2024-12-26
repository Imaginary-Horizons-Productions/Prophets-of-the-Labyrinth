const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Numbing Ice Bolt",
	[
		["use", "Inflict @{damage} @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, modifiers: [slow, clumsiness], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, slow).concat(addModifier(targets, clumsiness)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Awesome Ice Bolt", "Distracting Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Clumsiness", stacks: 1 })
	.setCharges(15);
