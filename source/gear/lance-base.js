const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Lance",
	"Strike a foe for @{damage} @{element} damage (double increase from Power Up)",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	200,
	([target], user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		const powerUpStacks = user.getModifierStacks("Power Up");
		pendingDamage += powerUpStacks;
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, damage, false, element, adventure);
	}
).setUpgrades("Accelerating Lance", "Unstoppable Lance", "Vigilant Lance")
	.setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setDurability(15)
	.setDamage(75);
