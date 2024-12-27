const { GearTemplate } = require('../classes');
const { ESSENCE_MATCH_STAGGER_FOE } = require('../constants');
const { addModifier, dealDamage, changeStagger, generateModifierResultLines, combineModifierReceipts } = require('../util/combatantUtil');

module.exports = new GearTemplate("Awesome Ice Bolt",
	[
		["use", "Inflict <@{damage} + @{bonus} if foe is stunned> @{essence} damage and @{mod0Stacks} @{mod0} on one foe"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Spell",
	"Water",
	350,
	(targets, user, adventure) => {
		const { essence, damage, modifiers: [torpidity], critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let stunnedDamage = pendingDamage + bonus;
		if (user.essence === essence) {
			changeStagger(targets, user, ESSENCE_MATCH_STAGGER_FOE);
		}
		if (user.crit) {
			pendingDamage *= critMultiplier;
			stunnedDamage *= critMultiplier;
		}
		const resultLines = targets.reduce((array, target) => array.concat(dealDamage([target], user, target.isStunned ? stunnedDamage : pendingDamage, false, essence, adventure)), []);
		return resultLines.concat(generateModifierResultLines(combineModifierReceipts(addModifier(targets, torpidity))));
	}
).setTargetingTags({ type: "single", team: "foe" })
	.setSidegrades("Distracting Ice Bolt", "Numbing Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Torpidity", stacks: 2 })
	.setCharges(15)
	.setBonus(75);
