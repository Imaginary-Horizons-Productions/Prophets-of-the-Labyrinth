const { GearTemplate } = require('../classes');
const { dealDamage, changeStagger } = require('../util/combatantUtil');

module.exports = new GearTemplate("Unstoppable Lance",
	"Strike a foe for @{damage} @{element} unblockable damage (double increase from Power Up), even while Stunned",
	"Damage x@{critMultiplier}",
	"Weapon",
	"Earth",
	350,
	(targets, user, isCrit, adventure) => {
		const { element, damage, critMultiplier } = module.exports;
		let pendingDamage = user.getPower() + user.getModifierStacks("Power Up") + damage;
		if (user.element === element) {
			changeStagger(targets, "elementMatchFoe");
		}
		if (isCrit) {
			pendingDamage *= critMultiplier;
		}
		return dealDamage(targets, user, pendingDamage, true, element, adventure);
	}
).setTargetingTags({ type: "single", team: "foe", needsLivingTargets: true })
	.setSidegrades("Accelerating Lance", "Shattering Lance")
	.setDurability(15)
	.setDamage(40);
