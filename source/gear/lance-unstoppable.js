const { GearTemplate } = require('../classes');
const { dealDamage } = require('../util/combatantUtil');

module.exports = new GearTemplate("Unstoppable Lance",
	"Strike a foe for @{damage} @{element} unblockable damage (double increase from Power Up), even while Stunned",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
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
		return dealDamage([target], user, damage, true, element, adventure);
	}
).setTargetingTags({ target: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Vigilant Lance")
	.setDurability(15)
	.setDamage(40);
