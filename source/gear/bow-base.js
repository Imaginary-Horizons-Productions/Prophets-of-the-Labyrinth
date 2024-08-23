const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil.js');

module.exports = new GearTemplate("Bow",
	"Strike a foe for @{damage} @{element} damage with priority",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Wind",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setUpgrades("Evasive Bow", "Thief's Bow", "Unstoppable Bow")
	.setDurability(15)
	.setDamage(40)
	.setPriority(1);
