const { GearTemplate } = require('../classes');
const { dealDamage, addModifier, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Slowing Daggers",
	[
		["use", "Strike a foe for @{damage} @{element} damage and inflict @{mod0Stacks} @{mod0}"],
		["Critical💥", "Damage x@{critMultiplier}"]
	],
	"Weapon",
	"Wind",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, modifiers: [slow], damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		const resultSentences = [dealDamage(targets, user, pendingDamage, false, element, adventure)];
		const stillLivingTargets = targets.filter(target => target.hp > 0);
		if (stillLivingTargets.length > 0) {
			if (user.element === element) {
				changeStagger(stillLivingTargets, "elementMatchFoe");
			}
			const slowedTargets = addModifier(stillLivingTargets, slow);
			if (slowedTargets.length > 0) {
				resultSentences.push(joinAsStatement(false, getNames(slowedTargets, adventure), "is", "are", "Slowed."));
			}
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Sharpened Daggers", "Sweeping Daggers")
	.setModifiers({ name: "Slow", stacks: 1 })
	.setDurability(15)
	.setCritMultiplier(3)
	.setDamage(40);
