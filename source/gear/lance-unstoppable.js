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
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			target.addStagger("elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage([target], user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Vigilant Lance")
	.setDurability(15)
	.setDamage(40);
