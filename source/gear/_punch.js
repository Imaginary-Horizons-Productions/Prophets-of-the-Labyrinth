const { GearTemplate } = require('../classes/GearTemplate.js');
const { needsLivingTargets } = require('../util/actionComponents.js');
const { dealDamage, addModifier } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Punch",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critBonus}",
	"Technique",
	"Untyped",
	0,
	needsLivingTargets(([target], user, isCrit, adventure) => {
		let { damage, critBonus, element } = module.exports;
		const ironFistStacks = user.getModifierStacks("Iron Fist Stance");
		const pendingElement = ironFistStacks > 0 ? user.element : element;
		const floatingMistStacks = user.getModifierStacks("Floating Mist Stacks");
		let totalStagger = floatingMistStacks * 2;
		let pendingDamage = damage + (ironFistStacks * 45);
		if (user.element === pendingElement) {
			totalStagger++;
		}
		if (isCrit) {
			pendingDamage *= critBonus;
		}
		if (totalStagger > 0) {
			addModifier(target, { name: "Stagger", stacks: totalStagger });
		}
		return dealDamage([target], user, pendingDamage, false, pendingElement, adventure);
	})
).setTargetingTags({ target: "single", team: "enemy" })
	.setDurability(Infinity)
	.setDamage(35);
