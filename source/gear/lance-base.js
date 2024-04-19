const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up)",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	200,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, false, element, adventure);
	}
).setUpgrades("Accelerating Lance", "Shattering Lance", "Unstoppable Lance")
	.setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setDamage(40);
