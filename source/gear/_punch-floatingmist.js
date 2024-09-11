const { GearTemplate } = require('../classes/index.js');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Floating Mist Punch",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Technique",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const { damage, critMultiplier, element } = module.exports;
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
			changeStagger(stillLivingTargets, user.getModifierStacks("Floating Mist Stance") * 3);
			resultSentences.push(joinAsStatement(false, getNames(stillLivingTargets, adventure), "was", "were", "Staggered."));
		}
		return resultSentences.join(" ");
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setDurability(Infinity)
	.setDamage(0);
