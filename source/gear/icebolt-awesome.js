const { GearTemplate } = require('../classes');
const { addModifier, dealDamage, changeStagger, getNames } = require('../util/combatantUtil');
const { joinAsStatement } = require('../util/textUtil');

module.exports = new GearTemplate("Awesome Ice Bolt",
	"Inflict @{damage} @{element} damage (+@{bonus} if foe is stunned) and @{mod0Stacks} @{mod0} on one foe",
	"Damage x@{critMultiplier}",
	"Spell",
	"Water",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, modifiers: [slow], critMultiplier, bonus } = module.exports;
		let pendingDamage = user.getPower() + damage;
		let stunnedDamage = pendingDamage + bonus;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
			stunnedDamage *= critMultiplier;
		}
		const resultSentences = targets.map(target => dealDamage([target], user, target.isStunned ? stunnedDamage : pendingDamage, false, element, adventure));
		const slowedTargets = addModifier(targets, slow);
		if (slowedTargets.length > 0) {
			resultSentences.push(joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Distracting Ice Bolt")
	.setDamage(40)
	.setModifiers({ name: "Slow", stacks: 2 })
	.setDurability(15)
	.setBonus(75);
