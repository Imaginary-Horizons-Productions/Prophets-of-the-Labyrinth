const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger, getNames } = require('../util/combatantUtil.js');
const { joinAsStatement } = require('../util/textUtil.js');

module.exports = new GearTemplate("Punch",
	"Strike a foe for @{damage} @{element} damage",
	"Damage x@{critMultiplier}",
	"Technique",
	"Untyped",
	0,
	(targets, user, isCrit, adventure) => {
		const { damage, critMultiplier, element } = module.exports;
		const ironFistStacks = user.getModifierStacks("Iron Fist Stance");
		const pendingElement = ironFistStacks > 0 ? user.element : element;
		const floatingMistStacks = user.getModifierStacks("Floating Mist Stance");
		let totalStagger = floatingMistStacks * 2;
		let pendingDamage = user.getPower() + damage + (ironFistStacks * 45);
		if (user.element === pendingElement) {
			totalStagger++;
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		if (totalStagger > 0) {
			changeStagger(targets, totalStagger);
		}
		return `${dealDamage(targets, user, pendingDamage, false, pendingElement, adventure)}${totalStagger > 0 && user.element !== "Untyped" ? ` ${joinAsStatement(false, getNames(targets, adventure), "was", "were", "Staggered.")}` : ""}`;
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setDurability(Infinity)
	.setDamage(0);
