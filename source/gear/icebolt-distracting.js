const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Ice Bolt",
	[
		["use", "Inflict @{damage} @{essence} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, modifiers: [torpidity, distraction], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, essence, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, torpidity).concat(addModifier(targets, distraction)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Awesome Ice Bolt", "Clumsiness Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Torpidity", stacks: 2 }, { name: "Distraction", stacks: 2 })
	.setCharges(15);
