const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Distracting Ice Bolt",
	[
		["use", "Inflict @{damage} @{element} damage, @{mod0Stacks} @{mod0}, and @{mod1Stacks} @{mod1} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, modifiers: [slow, distracted], critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure).concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, slow).concat(addModifier(targets, distracted)))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Awesome Ice Bolt", "Unlucky Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 }, { name: "Distracted", stacks: 2 })
	.setCharges(15);
