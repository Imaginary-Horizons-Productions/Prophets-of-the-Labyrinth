const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Punch",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Technique",
	"Untyped",
	0,
	([target], user, isCrit, adventure) => {
		let { damage, critMultiplier, element } = module.exports;
		const ironFistStacks = user.getModifierStacks("Iron Fist Stance");
		const pendingElement = ironFistStacks > 0 ? user.element : element;
		const floatingMistStacks = user.getModifierStacks("Floating Mist Stance");
		let totalStagger = floatingMistStacks * 2;
		let pendingDamage = damage + (ironFistStacks * 45);
		if (user.element === pendingElement) {
			totalStagger++;
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (totalStagger > 0) {
			target.addStagger(totalStagger);
		}
		return dealDamage([target], user, pendingDamage, false, pendingElement, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setDurability(Infinity)
	.setDamage(35);
