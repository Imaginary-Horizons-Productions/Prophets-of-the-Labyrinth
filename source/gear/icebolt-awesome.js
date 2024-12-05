const { GearTemplate } = require('../classes');
const { ELEMENT_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Awesome Ice Bolt",
	[
		["use", "Inflict <@{damage} + @{bonus} if foe is stunned> @{element} damage and @{mod0Stacks} @{mod0} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { element, damage, modifiers: [slow], critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let stunnedDamage = pendingDamage + bonus;
		if (user.element === element) {
			changeStagger(targets, user, ELEMENT_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
			stunnedDamage *= critMultiplier;
		}
		const resultLines = targets.reduce((array, target) => array.concat(dealDamage([target], user, target.isStunned ? stunnedDamage : pendingDamage, false, element, adventure)), []);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, slow))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Distracting Ice Bolt", "Unlucky Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 })
	.setCharges(15)
	.setBonus(75);
